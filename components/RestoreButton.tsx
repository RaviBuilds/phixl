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

// Replicate Model Version IDs
const SCRATCH_MODEL =
  "microsoft/bringing-old-photos-back-to-life:c75db81db6cbd809d93cc3b7e7a088a351a3349c9fa02b6d393e35e0d51ba799";
const COLOR_MODEL =
  "piddnad/ddcolor:ca494ba129e44e45f661d6ece83c4c98a9a7c774309beca01429b58fce8aa695";
const FACE_MODEL =
  "sczhou/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56";

// Helper function to pause between status checks
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
    onError(""); // Clear any previous errors

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated.");

      // ==========================================
      // STEP 0: Upload original file to Supabase
      // ==========================================
      setLoadingText("Uploading secure original...");
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("restoration_images")
        .upload(filePath, file);

      if (uploadError) throw new Error("Failed to upload image.");

      // ==========================================
      // STEP 1: Verify & Deduct Credit
      // ==========================================
      setLoadingText("Initializing pipeline...");

      // TS FIX: initializePipeline throws internally, so no need to check init.error
      const init = await initializePipeline(uploadData.path);
      let currentImageUrl = init.imageUrl;

      // ==========================================
      // PHASE 1: SCRATCH REMOVAL
      // ==========================================
      setLoadingText("Phase 1: Healing scratches & tears...");
      let prediction = await startAIPrediction(SCRATCH_MODEL, {
        image: currentImageUrl,
        HR: true,
        with_scratch: true,
      });

      // TS FIX: Explicitly prove predictionId exists
      if (!prediction.success || !prediction.predictionId) {
        throw new Error(prediction.error || "Failed to start scratch removal");
      }

      let status = "processing";
      while (status !== "succeeded" && status !== "failed") {
        await sleep(2500); // Poll every 2.5 seconds
        const check = await checkPredictionStatus(prediction.predictionId);

        // TS FIX: Explicitly prove status exists
        if (!check.success || !check.status) {
          throw new Error(check.error || "Failed to check status");
        }

        status = check.status;
        if (status === "succeeded") currentImageUrl = check.output as string;
      }
      if (status === "failed") throw new Error("Scratch removal failed.");

      //Pause for the 6 seconds to reset replicate free tier burst
      setLoadingText("Cooling down AI engine....");
      await sleep(6000);

      // ==========================================
      // PHASE 2: COLORIZATION
      // ==========================================
      setLoadingText("Phase 2: Applying historical color...");
      prediction = await startAIPrediction(COLOR_MODEL, {
        image: currentImageUrl,
      });

      // TS FIX
      if (!prediction.success || !prediction.predictionId) {
        throw new Error(prediction.error || "Failed to start colorization");
      }

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

      // ---> THE FIX: Pause again before the final phase
      setLoadingText("Preparing final upscaler...");
      await sleep(6000);

      // ==========================================
      // PHASE 3: FACE UPSCALING (CODEFORMER)
      // ==========================================
      setLoadingText("Phase 3: Reconstructing faces...");
      prediction = await startAIPrediction(FACE_MODEL, {
        image: currentImageUrl,
        upscale: 2,
        face_upsample: true,
        background_enhance: true,
        codeformer_fidelity: 0.5,
      });

      // TS FIX
      if (!prediction.success || !prediction.predictionId) {
        throw new Error(prediction.error || "Failed to start face upscaling");
      }

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

      // ==========================================
      // FINAL: Save to Gallery & Update UI
      // ==========================================
      setLoadingText("Saving masterpiece...");
      const finalResult = await finalizeRestoration(
        currentImageUrl,
        init.userId,
      );

      // TS FIX: Explicitly prove finalUrl exists
      if (!finalResult.success || !finalResult.finalUrl) {
        throw new Error(finalResult.error || "Failed to finalize restoration.");
      }

      onSuccess(finalResult.finalUrl);
    } catch (error: any) {
      console.error("Pipeline Error:", error);
      onError(error.message || "Failed to process image.");

      // Attempt to refund credit if pipeline failed midway
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
