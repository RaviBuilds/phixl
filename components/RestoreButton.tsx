"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
  initializePipeline,
  startAIPrediction,
  checkPredictionStatus,
  finalizeRestoration,
  refundCredit,
} from "@/actions/restoreAction";

const SCRATCH_MODEL =
  "microsoft/bringing-old-photos-back-to-life:c75db81db6cbd809d93cc3b7e7a088a351a3349c9fa02b6d393e35e0d51ba799";
const COLOR_MODEL =
  "piddnad/ddcolor:ca494ba129e44e45f661d6ece83c4c98a9a7c774309beca01429b58fce8aa695";
const FACE_MODEL =
  "sczhou/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface RestoreButtonProps {
  file: File;
  onSuccess: (restoredImageUrl: string) => void;
  onError: (errorMessage: string) => void;
}

export default function RestoreButton({
  file,
  onSuccess,
  onError,
}: RestoreButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingText, setLoadingText] = useState("");

const handleRestore = async () => {
  setIsProcessing(true);
  onError("");

  // --- NEW: Bulletproof Auto-Retry Helper ---
  const executeWithRetry = async (modelUrl: string, input: any) => {
    let attempts = 0;
    while (attempts < 3) {
      const pred = await startAIPrediction(modelUrl, input);
      if (pred.success && pred.predictionId) return pred;

      // If we hit the Free Tier 429 limit, catch it and wait!
      if (pred.error?.includes("429")) {
        setLoadingText("Free tier limit hit. Auto-retrying in 8s...");
        await sleep(8500); // Wait 8.5 seconds for the Replicate clock to reset
        attempts++;
      } else {
        // If it's a real error (like the Microsoft model crashing), throw it
        throw new Error(pred.error || "Failed to start AI phase");
      }
    }
    throw new Error("API is too busy. Please try again in 1 minute.");
  };

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated.");

    setLoadingText("Uploading secure original...");
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("restoration_images")
      .upload(filePath, file);

    if (uploadError) throw new Error("Failed to upload image.");

    setLoadingText("Initializing pipeline...");
    const init = await initializePipeline(uploadData.path);
    let currentImageUrl = init.imageUrl;

    // ==========================================
    // PHASE 1: SCRATCH REMOVAL
    // ==========================================
    setLoadingText("Phase 1: Healing scratches & tears...");
    // Using the new retry wrapper!
    let prediction = await executeWithRetry(SCRATCH_MODEL, {
      image: currentImageUrl,
      HR: true,
      with_scratch: true,
    });

    let status = "processing";
    while (status !== "succeeded" && status !== "failed") {
      await sleep(2500);
      const check = await checkPredictionStatus(prediction.predictionId);
      if (!check.success || !check.status)
        throw new Error(check.error || "Failed to check status");
      status = check.status;
      if (status === "succeeded") currentImageUrl = check.output as string;
    }
    if (status === "failed")
      throw new Error(
        "Scratch removal failed. The image might be too complex for this specific model.",
      );

    setLoadingText("Cooling down AI engine....");
    await sleep(4000);

    // ==========================================
    // PHASE 2: COLORIZATION
    // ==========================================
    setLoadingText("Phase 2: Applying historical color...");
    prediction = await executeWithRetry(COLOR_MODEL, {
      image: currentImageUrl,
    });

    status = "processing";
    while (status !== "succeeded" && status !== "failed") {
      await sleep(2500);
      const check = await checkPredictionStatus(prediction.predictionId);
      if (!check.success || !check.status)
        throw new Error(check.error || "Failed to check status");
      status = check.status;
      if (status === "succeeded") currentImageUrl = check.output as string;
    }
    if (status === "failed") throw new Error("Colorization failed.");

    setLoadingText("Preparing final upscaler...");
    await sleep(4000);

    // ==========================================
    // PHASE 3: FACE UPSCALING (CODEFORMER)
    // ==========================================
    setLoadingText("Phase 3: Reconstructing faces...");
    prediction = await executeWithRetry(FACE_MODEL, {
      image: currentImageUrl,
      upscale: 2,
      face_upsample: true,
      background_enhance: true,
      codeformer_fidelity: 0.5,
    });

    status = "processing";
    while (status !== "succeeded" && status !== "failed") {
      await sleep(2500);
      const check = await checkPredictionStatus(prediction.predictionId);
      if (!check.success || !check.status)
        throw new Error(check.error || "Failed to check status");
      status = check.status;
      if (status === "succeeded") currentImageUrl = check.output as string;
    }
    if (status === "failed") throw new Error("Face upscaling failed.");

    setLoadingText("Saving masterpiece...");
    const finalResult = await finalizeRestoration(
      currentImageUrl,
      init.userId,
      init.isPro!,
    );

    if (!finalResult.success || !finalResult.finalUrl) {
      throw new Error(finalResult.error || "Failed to finalize restoration.");
    }

    onSuccess(finalResult.finalUrl);
  } catch (error: any) {
    console.error("Pipeline Error:", error);
    onError(error.message || "Failed to process image.");

    if (loadingText.includes("Phase")) {
      await refundCredit();
    }
  } finally {
    setIsProcessing(false);
    setLoadingText("");
  }
};

  return (
    <button
      onClick={handleRestore}
      disabled={isProcessing}
      className="bg-red-brand hover:bg-red-brand-light text-color-white-fresh px-6 py-2 rounded-full font-bold text-sm transition-all drop-shadow-[0px_0px_1px_#fff] whitespace-nowrap ml-4 flex items-center justify-center min-w-[180px]"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2 flex-shrink-0" />
          <span className="truncate">{loadingText}</span>
        </>
      ) : (
        "Restore Premium"
      )}
    </button>
  );
}
