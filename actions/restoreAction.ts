// app/actions/restoreAction.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import Replicate from "replicate";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import path from "path";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// ============================================================================
// STEP 1: Verify, Deduct Credit, and Get Public URL
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

  // Deduct credit upfront
  await supabase
    .from("profiles")
    .update({ credits: profile.credits - 1 })
    .eq("id", user.id);

  const { data: publicUrlData } = supabase.storage
    .from("restoration_images")
    .getPublicUrl(imagePath);

  return {
    success: true,
    imageUrl: publicUrlData.publicUrl,
    userId: user.id,
    isPro: profile.plan_name?.toUpperCase() === "PRO", // Safely check plan
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
    return { success: false, error: error.message };
  }
}

// ============================================================================
// STEP 3: Check AI Status
// ============================================================================
export async function checkPredictionStatus(predictionId: string) {
  try {
    const prediction = await replicate.predictions.get(predictionId);
    return {
      success: true,
      status: prediction.status,
      output: prediction.output,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// STEP 4: Finalize, Watermark & Save
// ============================================================================
export async function finalizeRestoration(
  finalReplicateUrl: string,
  userId: string,
  isPro: boolean,
) {
  try {
    const supabase = await createClient();

    // Download image from Replicate
    const response = await fetch(finalReplicateUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    let imageBuffer: Buffer = Buffer.from(arrayBuffer as ArrayBuffer);

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

    await supabase
      .from("restorations")
      .insert({ user_id: userId, image_url: filePath });

    const { data } = supabase.storage
      .from("restored_images")
      .getPublicUrl(filePath);

    revalidatePath("/dashboard", "layout");
    return { success: true, finalUrl: data.publicUrl };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


// ============================================================================
// EMERGENCY REFUND
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
