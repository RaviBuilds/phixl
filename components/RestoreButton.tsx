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

// =============================================================================
// UPGRADED MODEL PIPELINE (v2) — Significantly better output quality
// =============================================================================

// Phase 1: Scratch & damage repair (Microsoft Bringing Old Photos Back to Life)
// This model is still the best at detecting and inpainting physical damage.
const SCRATCH_MODEL =
  "microsoft/bringing-old-photos-back-to-life:c75db81db6cbd809d93cc3b7e7a088a351a3349c9fa02b6d393e35e0d51ba799";

// Phase 2: Face restoration with CodeFormer (best-in-class face reconstruction)
// Using LOWER fidelity = more aggressive restoration = better faces from damaged photos
const FACE_MODEL =
  "sczhou/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56";

// Phase 3: Colorization with DDColor (state-of-the-art dual decoder colorization)
const COLOR_MODEL =
  "piddnad/ddcolor:ca494ba129e44e45f661d6ece83c4c98a9a7c774309beca01429b58fce8aa695";

// Phase 4: Final super-resolution upscale with Real-ESRGAN + GFPGAN face enhancement
// Using model identifier (auto-resolves to latest version for best quality)
const UPSCALE_MODEL = "nightmareai/real-esrgan";

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
  const [progress, setProgress] = useState(0);

  const handleRestore = async () => {
    setIsProcessing(true);
    setProgress(0);
    onError("");

    // --- Bulletproof Auto-Retry Helper with exponential backoff ---
    const executeWithRetry = async (modelUrl: string, input: any) => {
      let attempts = 0;
      const maxAttempts = 4;
      while (attempts < maxAttempts) {
        const pred = await startAIPrediction(modelUrl, input);
        if (pred.success && pred.predictionId) return pred;

        if (pred.error?.includes("429")) {
          const waitTime = Math.min(8500 * Math.pow(1.5, attempts), 30000);
          setLoadingText(`Rate limited. Retrying in ${Math.ceil(waitTime / 1000)}s...`);
          await sleep(waitTime);
          attempts++;
        } else {
          throw new Error(pred.error || "Failed to start AI phase");
        }
      }
      throw new Error("API is too busy. Please try again in 1 minute.");
    };

    // --- Poll for completion with timeout ---
    const waitForCompletion = async (predictionId: string, timeoutMs: number = 180000) => {
      const startTime = Date.now();
      let status = "processing";
      
      while (status !== "succeeded" && status !== "failed") {
        if (Date.now() - startTime > timeoutMs) {
          throw new Error("Processing timed out. Please try again.");
        }
        await sleep(3000);
        const check = await checkPredictionStatus(predictionId);
        if (!check.success || !check.status) {
          throw new Error(check.error || "Failed to check status");
        }
        status = check.status;
        if (status === "succeeded") return check.output as string;
      }
      throw new Error("AI processing failed for this image.");
    };

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated.");

      // --- Upload original image ---
      setLoadingText("Uploading image securely...");
      setProgress(5);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("restoration_images")
        .upload(filePath, file);

      if (uploadError) throw new Error("Failed to upload image.");

      setLoadingText("Initializing AI pipeline...");
      setProgress(10);
      const init = await initializePipeline(uploadData.path);
      let currentImageUrl = init.imageUrl;

      // ==========================================
      // PHASE 1: SCRATCH & DAMAGE REPAIR
      // The Microsoft model excels at detecting tears, scratches, and stains
      // HR=true gives high-resolution output, with_scratch=true activates scratch detection
      // ==========================================
      setLoadingText("Phase 1/4: Repairing scratches & damage...");
      setProgress(15);
      
      let prediction = await executeWithRetry(SCRATCH_MODEL, {
        image: currentImageUrl,
        HR: true,
        with_scratch: true,
      });

      currentImageUrl = await waitForCompletion(prediction.predictionId!);
      setProgress(30);

      // Cooldown between models to avoid rate limits
      setLoadingText("Preparing face reconstruction...");
      await sleep(3000);

      // ==========================================
      // PHASE 2: FACE RESTORATION (CodeFormer)
      // Key improvements:
      // - codeformer_fidelity: 0.3 (lower = more aggressive reconstruction)
      //   This is critical for OLD damaged photos where faces are heavily degraded.
      //   At 0.5 (previous), it was too conservative and left artifacts.
      //   At 0.3, CodeFormer aggressively reconstructs facial features.
      // - face_upsample: true (further enhances detected faces)
      // - background_enhance: true (also improves non-face regions)
      // - upscale: 2 (2x resolution boost)
      // ==========================================
      setLoadingText("Phase 2/4: Reconstructing faces & details...");
      setProgress(35);
      
      prediction = await executeWithRetry(FACE_MODEL, {
        image: currentImageUrl,
        upscale: 2,
        face_upsample: true,
        background_enhance: true,
        codeformer_fidelity: 0.3,
      });

      currentImageUrl = await waitForCompletion(prediction.predictionId!);
      setProgress(55);

      setLoadingText("Preparing colorization engine...");
      await sleep(3000);

      // ==========================================
      // PHASE 3: COLORIZATION (DDColor)
      // Applied AFTER face restoration so the colorizer works with
      // clean, high-quality facial features rather than damaged inputs.
      // This order produces significantly more natural skin tones.
      // ==========================================
      setLoadingText("Phase 3/4: Applying intelligent colorization...");
      setProgress(60);
      
      prediction = await executeWithRetry(COLOR_MODEL, {
        image: currentImageUrl,
      });

      currentImageUrl = await waitForCompletion(prediction.predictionId!);
      setProgress(75);

      setLoadingText("Preparing final enhancement...");
      await sleep(3000);

      // ==========================================
      // PHASE 4: FINAL SUPER-RESOLUTION (Real-ESRGAN + GFPGAN)
      // This is the NEW phase that was missing before.
      // Real-ESRGAN upscales the entire image (backgrounds, textures, details)
      // while GFPGAN (face_enhance) does a final polish pass on any faces.
      // scale: 4 gives a crisp, high-resolution final output.
      // ==========================================
      setLoadingText("Phase 4/4: Final HD upscaling & enhancement...");
      setProgress(80);
      
      prediction = await executeWithRetry(UPSCALE_MODEL, {
        image: currentImageUrl,
        scale: 4,
        face_enhance: true,
      });

      currentImageUrl = await waitForCompletion(prediction.predictionId!);
      setProgress(92);

      // ==========================================
      // FINALIZE: Watermark (free users) & Save
      // ==========================================
      setLoadingText("Saving your restored masterpiece...");
      setProgress(95);
      
      const finalResult = await finalizeRestoration(
        currentImageUrl,
        init.userId,
        init.isPro!,
      );

      if (!finalResult.success || !finalResult.finalUrl) {
        throw new Error(finalResult.error || "Failed to finalize restoration.");
      }

      setProgress(100);
      onSuccess(finalResult.finalUrl);
    } catch (error: any) {
      console.error("Pipeline Error:", error);
      onError(error.message || "Failed to process image.");

      // Refund credit if we failed after initialization (during any AI phase)
      if (loadingText.includes("Phase")) {
        await refundCredit();
      }
    } finally {
      setIsProcessing(false);
      setLoadingText("");
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2 ml-4">
      <button
        onClick={handleRestore}
        disabled={isProcessing}
        className="bg-red-brand hover:bg-red-brand-light text-color-white-fresh px-6 py-2 rounded-full font-bold text-sm transition-all drop-shadow-[0px_0px_1px_#fff] whitespace-nowrap flex items-center justify-center min-w-[180px]"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2 flex-shrink-0" />
            <span className="truncate">{loadingText}</span>
          </>
        ) : (
          "Restore Premium ✨"
        )}
      </button>
      
      {/* Progress bar shown during processing */}
      {isProcessing && progress > 0 && (
        <div className="w-full min-w-[180px] h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-brand to-pink-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
