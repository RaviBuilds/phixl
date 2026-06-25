// lib/restorationPlan.ts
// ----------------------------------------------------------------------------
// Stage A — Image triage.
// Pure, framework-agnostic analysis (sharp only) that inspects an uploaded
// photo and produces an adaptive RestorationPlan. The pipeline then runs ONLY
// the modules the plan calls for, instead of blindly running every model on
// every image. The single biggest quality win here: we no longer re-colorize
// photos that are already in colour.
// ----------------------------------------------------------------------------
import sharp from "sharp";

export interface ImageInsights {
  width: number;
  height: number;
  /** Mean per-pixel saturation in 0..1 (0 = pure grayscale). */
  meanSaturation: number;
  /** Saturation-weighted hue concentration in 0..1 (1 = a single dominant hue). */
  hueConcentration: number;
  /** True when the image carries essentially no chroma. */
  isGrayscale: boolean;
  /** True for monochrome-but-toned images (e.g. sepia / duotone). */
  isToned: boolean;
}

export interface RestorationPlan {
  width: number;
  height: number;
  /** Run colorization (DDColor) — only for grayscale / toned originals. */
  colorize: boolean;
  /** Run blind face restoration (CodeFormer). */
  faceRestore: boolean;
  /**
   * CodeFormer fidelity. HIGHER = more faithful to the real person.
   * We default high to avoid the identity drift that aggressive (low) values
   * cause — a "beautiful" but wrong face is a failed restoration.
   */
  faceFidelity: number;
  /** Run scratch / damage repair (Microsoft Bringing-Old-Photos-Back-to-Life). */
  repairScratches: boolean;
  /** Final super-resolution factor, computed from input resolution. */
  upscale: number;
  /** Human-readable explanation of every decision (for logs / debugging / QA). */
  reasons: string[];
}

/**
 * Safe fallback used when analysis cannot be performed. We deliberately set
 * `colorize: false` here: recolouring a colour photo is destructive, so when
 * we are uncertain we leave colour untouched.
 */
export const SAFE_DEFAULT_PLAN: RestorationPlan = {
  width: 0,
  height: 0,
  colorize: false,
  faceRestore: true,
  faceFidelity: 0.7,
  repairScratches: true,
  upscale: 2,
  reasons: ["Analysis unavailable — using safe defaults (no colorization)."],
};

// Downscale edge used for the colour analysis. Small = fast and allocation-light;
// colour statistics are robust to downsampling.
const SAMPLE_EDGE = 96;

/**
 * Inspect raw pixels to determine whether an image is grayscale, sepia/toned,
 * or genuinely colourful, plus its native dimensions.
 */
export async function analyzeImageBuffer(buffer: Buffer): Promise<ImageInsights> {
  const meta = await sharp(buffer, { failOn: "none" }).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  const { data, info } = await sharp(buffer, { failOn: "none" })
    .resize(SAMPLE_EDGE, SAMPLE_EDGE, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels; // 3 (RGB) after removeAlpha
  let satSum = 0;
  let sumSin = 0;
  let sumCos = 0;
  let satWeight = 0;
  let count = 0;

  for (let i = 0; i + (channels - 1) < data.length; i += channels) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const sat = max === 0 ? 0 : delta / max;

    satSum += sat;
    count++;

    if (delta > 1e-4) {
      // Standard RGB->Hue (degrees), then to radians for circular statistics.
      let hue: number;
      if (max === r) hue = ((g - b) / delta) % 6;
      else if (max === g) hue = (b - r) / delta + 2;
      else hue = (r - g) / delta + 4;
      hue = hue * 60 * (Math.PI / 180);

      // Weight by saturation so near-gray pixels don't dominate hue stats.
      sumSin += Math.sin(hue) * sat;
      sumCos += Math.cos(hue) * sat;
      satWeight += sat;
    }
  }

  const meanSaturation = count ? satSum / count : 0;
  // Resultant length of the (saturation-weighted) hue vectors: ~1 => one hue.
  const hueConcentration =
    satWeight > 1e-6
      ? Math.sqrt(sumSin * sumSin + sumCos * sumCos) / satWeight
      : 1;

  const isGrayscale = meanSaturation < 0.08;
  const isToned =
    !isGrayscale && meanSaturation < 0.4 && hueConcentration > 0.9;

  return {
    width,
    height,
    meanSaturation,
    hueConcentration,
    isGrayscale,
    isToned,
  };
}

/** Turn raw image insights into an executable, explainable restoration plan. */
export function buildRestorationPlan(insights: ImageInsights): RestorationPlan {
  const reasons: string[] = [];
  const longEdge = Math.max(insights.width, insights.height) || 1000;

  // --- Colorization: ONLY for images that lack real colour ---
  const colorize = insights.isGrayscale || insights.isToned;
  if (insights.isGrayscale) {
    reasons.push(
      `Grayscale detected (mean saturation ${insights.meanSaturation.toFixed(
        2,
      )}) → colorize.`,
    );
  } else if (insights.isToned) {
    reasons.push(
      `Monochrome/sepia tone detected (hue concentration ${insights.hueConcentration.toFixed(
        2,
      )}) → colorize.`,
    );
  } else {
    reasons.push(
      `Colour image (mean saturation ${insights.meanSaturation.toFixed(
        2,
      )}) → skip colorization to preserve original colours.`,
    );
  }

  // --- Adaptive upscale toward a ~2400px long edge, clamped to 2..4 ---
  let upscale: number;
  if (longEdge >= 2400) {
    upscale = 2;
    reasons.push(`Large input (${longEdge}px long edge) → conservative 2x upscale.`);
  } else {
    upscale = Math.min(4, Math.max(2, Math.ceil(2400 / longEdge)));
    reasons.push(`Long edge ${longEdge}px → ${upscale}x upscale toward ~2400px.`);
  }

  // Identity-preserving fidelity (see RestorationPlan.faceFidelity).
  const faceFidelity = 0.7;
  reasons.push(
    `Face fidelity set to ${faceFidelity} to prioritise identity preservation.`,
  );

  return {
    width: insights.width,
    height: insights.height,
    colorize,
    faceRestore: true,
    faceFidelity,
    repairScratches: true,
    upscale,
    reasons,
  };
}
