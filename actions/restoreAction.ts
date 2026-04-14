// app/actions/restoreAction.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import Replicate from "replicate";
import { revalidatePath } from "next/cache";

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();
  if (!profile || profile.credits <= 0)
    throw new Error("Insufficient credits.");

  // Deduct credit upfront (we will refund it if the AI fails)
  await supabase
    .from("profiles")
    .update({ credits: profile.credits - 1 })
    .eq("id", user.id);

  const { data: publicUrlData } = supabase.storage
    .from("restoration_images")
    .getPublicUrl(imagePath);

  return { success: true, imageUrl: publicUrlData.publicUrl, userId: user.id };
}

// ============================================================================
// STEP 2: Start an AI Model (Takes 0.5 seconds - Bypasses Vercel Timeout!)
// ============================================================================
export async function startAIPrediction(modelEndpoint: string, inputData: any) {
  try {
    // .create starts the job in the background and instantly returns an ID
    const prediction = await replicate.predictions.create({
      // @ts-ignore - Replicate types can be finicky with string literals
      version: modelEndpoint.split(":")[1],
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
// STEP 4: Finalize & Save to Gallery
// ============================================================================
export async function finalizeRestoration(
  finalReplicateUrl: string,
  userId: string,
) {
  try {
    const supabase = await createClient();

    // Download image from Replicate
    const response = await fetch(finalReplicateUrl);
    const imageBuffer = await response.arrayBuffer();

    const fileName = `restored-${Date.now()}.png`;
    const filePath = `${userId}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("restored_images")
      .upload(filePath, imageBuffer, { contentType: "image/png" });

    if (uploadError) throw new Error("Failed to upload to storage");

    // Save to Gallery DB
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
