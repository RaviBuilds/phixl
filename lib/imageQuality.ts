// lib/imageQuality.ts
// ----------------------------------------------------------------------------
// SERVER-ONLY no-reference image quality scorer (uses sharp).
// This is a fast, local, zero-cost proxy for perceptual IQA models. It is NOT
// as accurate as MANIQA/MUSIQ, but it reliably ranks candidates by sharpness,
// contrast, and detail — which is exactly what best-of-N selection needs.
// Do NOT import this from client components (it would bundle sharp).
// ----------------------------------------------------------------------------
import sharp from "sharp";
import type { QualityMetrics } from "@/lib/aiQuality";

// Empirical normalization caps (tuned for restored photos at ~512px analysis).
const SHARPNESS_CAP = 300; // variance-of-Laplacian considered "crisp"
const CONTRAST_CAP = 70; // luminance stdev considered "good contrast"
const ENTROPY_CAP = 7.5; // entropy considered "rich detail"

/** Compute a 0..10 no-reference quality score for an image buffer. */
export async function scoreBufferQuality(buffer: Buffer): Promise<QualityMetrics> {
  // Contrast + entropy from sharp's built-in statistics (on luminance).
  const stats = await sharp(buffer, { failOn: "none" }).grayscale().stats();
  const entropy = stats.entropy ?? 0;
  const contrast = stats.channels[0]?.stdev ?? 0;

  // Sharpness: variance of the Laplacian over a normalized 512px grayscale.
  const lap = await sharp(buffer, { failOn: "none" })
    .grayscale()
    .resize(512, 512, { fit: "inside", withoutEnlargement: true })
    .convolve({
      width: 3,
      height: 3,
      kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0],
    })
    .raw()
    .toBuffer();

  let mean = 0;
  for (let i = 0; i < lap.length; i++) mean += lap[i];
  mean /= lap.length || 1;

  let varSum = 0;
  for (let i = 0; i < lap.length; i++) {
    const d = lap[i] - mean;
    varSum += d * d;
  }
  const sharpness = lap.length ? varSum / lap.length : 0;

  const nSharp = Math.min(1, sharpness / SHARPNESS_CAP);
  const nContrast = Math.min(1, contrast / CONTRAST_CAP);
  const nEntropy = Math.min(1, entropy / ENTROPY_CAP);

  // Sharpness dominates perceived restoration quality; detail & contrast refine.
  const score =
    Math.round((0.5 * nSharp + 0.3 * nEntropy + 0.2 * nContrast) * 10 * 10) / 10;

  return { sharpness, contrast, entropy, score };
}
