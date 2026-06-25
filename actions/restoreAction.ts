// app/actions/restoreAction.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import Replicate from "replicate";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import path from "path";
import {
  analyzeImageBuffer,
  buildRestorationPlan,
  SAFE_DEFAULT_PLAN,
  type RestorationPlan,
} from "@/lib/restorationPlan";
import { detectFaces } from "@/actions/qualityActions";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// ============================================================================
// HELPER: Safely extract a usable image URL from a Replicate output.
// Never assume the output is a bare string. Different models return:
//   - a bare URL string                    -> "https://..."
//   - an array of URLs (e.g. CodeFormer)   -> ["https://..."]
//   - a FileOutput-like object w/ .url()   -> { url: () => URL }
//   - an object wrapping the url           -> { output: "https://..." }
// Throws if no valid http(s) URL can be resolved.
// ============================================================================
export function extractImageUrl(output: unknown): string {
  const visit = (value: unknown): string | null => {
    if (value == null) return null;

    if (typeof value === "string") {
      return value.startsWith("http") ? value : null;
    }

    if (value instanceof URL) {
      return visit(value.toString());
    }

    if (Array.isArray(value)) {
      // Walk from the end: most models place the final/highest-res asset last.
      for (let i = value.length - 1; i >= 0; i--) {
        const found = visit(value[i]);
        if (found) return found;
      }
      return null;
    }

    if (typeof value === "object") {
      const obj = value as Record<string, unknown>;

      // replicate's FileOutput exposes a .url() method.
      if (typeof obj.url === "function") {
        try {
          const found = visit((obj.url as () => unknown)());
          if (found) return found;
        } catch {
          /* fall through to key probing */
        }
      }

      for (const key of ["url", "image", "output", "video", "file"]) {
        if (key in obj) {
          const found = visit(obj[key]);
          if (found) return found;
        }
      }
    }

    return null;
  };

  const url = visit(output);
  if (!url) {
    throw new Error("Invalid AI output: no usable image URL was returned.");
  }
  return url;
}

// ============================================================================
// STEP 1: Verify Credits & Get Public URL (deduction is deferred to STEP 4)
// ============================================================================
export async function initializePipeline(imagePath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // FIX 1: We must select both 'credits' AND 'plan_name' here!
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits, plan_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.credits <= 0)
    throw new Error("Insufficient credits.");

  // NOTE: We intentionally DO NOT deduct here. The credit is only charged in
  // finalizeRestoration(), after Replicate has produced a valid image AND it
  // has been safely downloaded, processed, and persisted. This prevents the
  // billing leak where users were charged for failed/aborted generations.

  const { data: publicUrlData } = supabase.storage
    .from("restoration_images")
    .getPublicUrl(imagePath);

  // --- Stage A: analyze the upload and build an adaptive restoration plan ---
  // Clone SAFE_DEFAULT_PLAN (incl. its reasons array) so we never mutate the
  // shared exported constant when we push reasons / override flags below.
  let plan: RestorationPlan = {
    ...SAFE_DEFAULT_PLAN,
    reasons: [...SAFE_DEFAULT_PLAN.reasons],
  };
  try {
    const res = await fetch(publicUrlData.publicUrl);
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      const insights = await analyzeImageBuffer(buf);
      plan = buildRestorationPlan(insights);
    } else {
      console.warn(
        `[initializePipeline] could not fetch image for analysis (HTTP ${res.status}); using safe defaults.`,
      );
    }
  } catch (e: any) {
    console.error(
      "[initializePipeline] analysis failed, using safe defaults:",
      e?.message ?? e,
    );
  }

  // --- Stage A (cont.): gate face restoration on actual face detection ---
  // Degrades gracefully: if no detector is configured/available, detectFaces
  // returns hasFaces=true (confident=false), preserving prior behavior.
  try {
    const faces = await detectFaces(publicUrlData.publicUrl);
    plan.faceRestore = faces.hasFaces;
    plan.reasons.push(
      faces.confident
        ? `Face detection: ${faces.faceCount} face(s) → faceRestore=${faces.hasFaces}.`
        : `Face detection unavailable → faceRestore defaulted to ${faces.hasFaces}.`,
    );
  } catch (e: any) {
    console.error("[initializePipeline] face detection failed:", e?.message ?? e);
  }

  console.log("[initializePipeline] restoration plan:", plan.reasons);

  return {
    success: true,
    imageUrl: publicUrlData.publicUrl,
    userId: user.id,
    isPro: profile.plan_name?.toUpperCase() === "PRO", // Safely check plan
    plan,
  };
}

// ============================================================================
// STEP 2: Start an AI Model (supports both model identifier and version hash)
// ============================================================================
export async function startAIPrediction(modelEndpoint: string, inputData: any) {
  try {
    // If it contains a ":" it's the old format "owner/name:versionhash"
    // Otherwise it's the new format "owner/name" (uses latest version automatically)
    const hasVersion = modelEndpoint.includes(":");
    
    const prediction = await replicate.predictions.create({
      ...(hasVersion 
        ? { version: modelEndpoint.split(":")[1] }
        : { model: modelEndpoint as `${string}/${string}` }
      ),
      input: inputData,
    });
    return { success: true, predictionId: prediction.id };
  } catch (error: any) {
    console.error("[startAIPrediction] failed:", error?.message ?? error);
    return { success: false, error: error?.message ?? "Failed to start AI prediction" };
  }
}

// ============================================================================
// STEP 3: Check AI Status
// ============================================================================
export async function checkPredictionStatus(predictionId: string) {
  try {
    const prediction = await replicate.predictions.get(predictionId);

    // Surface Replicate's own failure reason instead of silently returning it
    // as a "successful" check with no output.
    if (prediction.status === "failed" || prediction.status === "canceled") {
      return {
        success: false,
        status: prediction.status,
        error: prediction.error
          ? String(prediction.error)
          : "The AI model failed to process this image.",
      };
    }

    // Only resolve a concrete URL once the model has finished. While the
    // prediction is still "processing"/"starting", output is null and must
    // be passed through untouched.
    let output: string | undefined;
    if (prediction.status === "succeeded") {
      output = extractImageUrl(prediction.output);
    }

    return {
      success: true,
      status: prediction.status,
      output,
    };
  } catch (error: any) {
    // Log securely on the server; never leak internals to the client.
    console.error("[checkPredictionStatus] failed:", error?.message ?? error);
    return { success: false, error: error?.message ?? "Failed to check status" };
  }
}

// ============================================================================
// STEP 4: Finalize, Watermark & Save
// ============================================================================
export async function finalizeRestoration(
  finalReplicateOutput: unknown,
  userId: string,
  isPro: boolean,
) {
  try {
    const supabase = await createClient();

    // Defensive: never assume a bare string. Resolve the real URL whether the
    // client handed us a string, an array (CodeFormer), or an object.
    const finalReplicateUrl = extractImageUrl(finalReplicateOutput);

    // Download image from Replicate — and verify it actually succeeded.
    const response = await fetch(finalReplicateUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to download AI image (HTTP ${response.status}).`,
      );
    }
    const arrayBuffer = await response.arrayBuffer();

    let imageBuffer: Buffer = Buffer.from(arrayBuffer as ArrayBuffer);

    if (imageBuffer.length === 0) {
      throw new Error("Downloaded AI image was empty.");
    }

    // Ensure final output is high-quality PNG with maximum detail preservation
    // Normalize to PNG format with optimal compression (lossless)
    imageBuffer = await sharp(imageBuffer)
      .png({ quality: 100, compressionLevel: 6 })
      .toBuffer();

    // Apply Watermark if they are on the FREE plan
    if (!isPro) {
      const watermarkPath = path.join(process.cwd(), "public", "watermark.svg");

      // 1. Get the exact dimensions of the AI-upscaled image
      const imageMetadata = await sharp(imageBuffer).metadata();
      const baseWidth = imageMetadata.width || 2048;

      // 2. Calculate the target size (watermark 50% of image width)
      const watermarkWidth = Math.floor(baseWidth * 0.5);

      // 3. Pre-process the SVG: rasterize and scale it up BEFORE stamping
      const properlySizedWatermark = await sharp(watermarkPath)
        .resize({ width: watermarkWidth })
        .png({ quality: 100 })
        .toBuffer();

      // 4. Composite the properly sized watermark
      imageBuffer = await sharp(imageBuffer)
        .composite([
          { 
            input: properlySizedWatermark, 
            gravity: "center"
          }
        ])
        .png({ quality: 100, compressionLevel: 6 })
        .toBuffer();
    }

    const fileName = `restored-${Date.now()}.png`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("restored_images")
      .upload(filePath, imageBuffer, { contentType: "image/png" });

    if (uploadError) throw new Error("Failed to upload to storage");

    const { error: insertError } = await supabase
      .from("restorations")
      .insert({ user_id: userId, image_url: filePath });

    if (insertError) throw new Error("Failed to record restoration.");

    // ========================================================================
    // DEFERRED CREDIT DEDUCTION
    // We have now confirmed: Replicate returned a valid URL, the image was
    // downloaded, processed, persisted to storage, and recorded in the DB.
    // ONLY now is it safe to charge the user. If anything above threw, we land
    // in the catch block below and the user is never charged.
    // ========================================================================
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (profile && profile.credits > 0) {
      await supabase
        .from("profiles")
        .update({ credits: profile.credits - 1 })
        .eq("id", userId);
    }

    const { data } = supabase.storage
      .from("restored_images")
      .getPublicUrl(filePath);

    revalidatePath("/dashboard", "layout");
    return { success: true, finalUrl: data.publicUrl };
  } catch (error: any) {
    // Log the real cause server-side for debugging...
    console.error("[finalizeRestoration] failed:", error?.message ?? error);
    // ...but return a clean, user-safe message. No credit was charged because
    // deduction only happens after a fully successful run above.
    return {
      success: false,
      error: "Generation failed, your credit was not charged.",
    };
  }
}


// ============================================================================
// MANUAL / ADMIN REFUND
// With deferred deduction (see finalizeRestoration), failed generations no
// longer charge the user, so the client should NOT auto-refund on failure.
// This remains available for manual/admin corrections only.
// ============================================================================
export async function refundCredit() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();
    if (profile)
      await supabase
        .from("profiles")
        .update({ credits: profile.credits + 1 })
        .eq("id", user.id);
  }
}
