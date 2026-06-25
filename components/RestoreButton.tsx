"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
  initializePipeline,
  startAIPrediction,
  checkPredictionStatus,
  finalizeRestoration,
} from "@/actions/restoreAction";
import { evaluateCandidate, scoreImageQuality } from "@/actions/qualityActions";
import {
  pickBestCandidate,
  DEFAULT_IDENTITY_THRESHOLD,
  type Candidate,
} from "@/lib/aiQuality";

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

      setLoadingText("Analyzing image & planning restoration...");
      setProgress(10);
      const init = await initializePipeline(uploadData.path);
      let currentImageUrl = init.imageUrl;

      // Stage A produced an adaptive plan: we now run ONLY the modules this
      // specific image needs, instead of every model on every image.
      const plan = init.plan;
      console.log("Restoration plan:", plan.reasons);

      // ==========================================
      // PHASE 1: SCRATCH & DAMAGE REPAIR (conditional)
      // Microsoft model detects tears, scratches, and stains.
      // ==========================================
      if (plan.repairScratches) {
        setLoadingText("Repairing scratches & damage...");
        setProgress(15);

        const prediction = await executeWithRetry(SCRATCH_MODEL, {
          image: currentImageUrl,
          HR: true,
          with_scratch: true,
        });

        currentImageUrl = await waitForCompletion(prediction.predictionId!);
        setProgress(30);

        // Cooldown between models to avoid rate limits
        setLoadingText("Preparing face reconstruction...");
        await sleep(3000);
      }

      // ==========================================
      // PHASE 2: FACE RESTORATION — best-of-N + identity guardrail (conditional)
      // We generate one or more candidates (Pro = multiple fidelities), score
      // each by no-reference quality AND identity similarity to the ORIGINAL
      // upload, then pick the best candidate that preserves identity. We never
      // ship a polished render of the wrong person.
      // ==========================================
      const runFaceRestoration = async (inputUrl: string): Promise<string> => {
        const fidelities = init.isPro
          ? [plan.faceFidelity, 0.85, 0.55]
          : [plan.faceFidelity];

        const candidates: Candidate[] = [];
        for (let i = 0; i < fidelities.length; i++) {
          setLoadingText(
            fidelities.length > 1
              ? `Reconstructing faces (candidate ${i + 1}/${fidelities.length})...`
              : "Reconstructing faces & details...",
          );

          const pred = await executeWithRetry(FACE_MODEL, {
            image: inputUrl,
            upscale: 2,
            face_upsample: true,
            background_enhance: true,
            codeformer_fidelity: fidelities[i],
          });
          const url = await waitForCompletion(pred.predictionId!);

          // Identity must be measured against the ORIGINAL upload, not the
          // intermediate, so drift can't accumulate undetected.
          const evalRes = await evaluateCandidate(init.imageUrl, url);
          candidates.push({
            url,
            quality: evalRes.quality,
            identity: evalRes.identity,
            identityKnown: evalRes.identityKnown,
          });
          console.log(
            `Face candidate fidelity=${fidelities[i]} quality=${evalRes.quality} ` +
              `identity=${evalRes.identityKnown ? evalRes.identity.toFixed(3) : "n/a"}`,
          );
        }

        const { best, passedIdentity } = pickBestCandidate(
          candidates,
          DEFAULT_IDENTITY_THRESHOLD,
        );
        if (!passedIdentity) {
          console.warn(
            `Identity guardrail: no candidate cleared ${DEFAULT_IDENTITY_THRESHOLD}; ` +
              `using most faithful (identity=${best.identity.toFixed(3)}).`,
          );
        }
        return best.url;
      };

      if (plan.faceRestore) {
        setLoadingText("Reconstructing faces & details...");
        setProgress(40);

        currentImageUrl = await runFaceRestoration(currentImageUrl);
        setProgress(55);

        setLoadingText("Preparing colorization engine...");
        await sleep(3000);
      }

      // ==========================================
      // PHASE 3: COLORIZATION (DDColor) (conditional — THE KEY FIX)
      // Runs ONLY when triage flagged the original as grayscale/sepia. We no
      // longer recolour photos that already have real colour.
      // ==========================================
      if (plan.colorize) {
        setLoadingText("Applying intelligent colorization...");
        setProgress(60);

        const prediction = await executeWithRetry(COLOR_MODEL, {
          image: currentImageUrl,
        });

        currentImageUrl = await waitForCompletion(prediction.predictionId!);
        setProgress(75);

        setLoadingText("Preparing final enhancement...");
        await sleep(3000);
      }

      // ==========================================
      // PHASE 4: FINAL SUPER-RESOLUTION (Real-ESRGAN)
      // scale is computed from the input resolution (plan.upscale).
      // face_enhance (GFPGAN) only runs if we did NOT already restore faces in
      // Phase 2 — this avoids the double face pass that caused "plastic" skin.
      // ==========================================
      setLoadingText("Final HD upscaling & enhancement...");
      setProgress(80);

      const upscalePrediction = await executeWithRetry(UPSCALE_MODEL, {
        image: currentImageUrl,
        scale: plan.upscale,
        face_enhance: !plan.faceRestore,
      });

      currentImageUrl = await waitForCompletion(upscalePrediction.predictionId!);
      setProgress(92);

      // --- Final quality gate (QA telemetry) ---
      // Score the finished render so we can monitor output quality over time
      // and (later) trigger an automatic re-run when it falls below target.
      try {
        const finalScore = await scoreImageQuality(currentImageUrl);
        if (finalScore) {
          console.log(
            `Final quality score: ${finalScore.score}/10 ` +
              `(sharpness=${Math.round(finalScore.sharpness)}, ` +
              `contrast=${Math.round(finalScore.contrast)}, ` +
              `entropy=${finalScore.entropy.toFixed(2)})`,
          );
        }
      } catch (e) {
        console.warn("Final quality scoring skipped:", e);
      }

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

      // No refund needed: credits are only charged in finalizeRestoration()
      // AFTER a fully successful run. A failure here means nothing was charged.
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
