// actions/qualityActions.ts
"use server";

import Replicate from "replicate";
import {
  parseEmbedding,
  extractFaceCount,
  cosineSimilarity,
  DEFAULT_IDENTITY_THRESHOLD,
} from "@/lib/aiQuality";
import { scoreBufferQuality } from "@/lib/imageQuality";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// ----------------------------------------------------------------------------
// Model endpoints are CONFIGURABLE via env so the system isn't bound to a model
// hash that may change. When a model is not configured, the corresponding
// feature degrades gracefully (see each function) instead of failing the run.
//   REPLICATE_FACE_DETECT_MODEL  -> face presence/count (gates faceRestore)
//   REPLICATE_FACE_EMBED_MODEL   -> ArcFace-style face embedding (identity)
// ----------------------------------------------------------------------------
const FACE_DETECT_MODEL = process.env.REPLICATE_FACE_DETECT_MODEL;
const FACE_EMBED_MODEL = process.env.REPLICATE_FACE_EMBED_MODEL;

/** Run a Replicate model to completion and return its raw output. */
async function runModel(
  model: string,
  input: Record<string, unknown>,
  timeoutMs = 120000,
): Promise<unknown> {
  const hasVersion = model.includes(":");
  let prediction = await replicate.predictions.create({
    ...(hasVersion
      ? { version: model.split(":")[1] }
      : { model: model as `${string}/${string}` }),
    input,
  });

  const start = Date.now();
  while (
    prediction.status !== "succeeded" &&
    prediction.status !== "failed" &&
    prediction.status !== "canceled"
  ) {
    if (Date.now() - start > timeoutMs) {
      throw new Error(`Model ${model} timed out`);
    }
    await new Promise((r) => setTimeout(r, 2000));
    prediction = await replicate.predictions.get(prediction.id);
  }

  if (prediction.status !== "succeeded") {
    throw new Error(`Model ${model} ${prediction.status}`);
  }
  return prediction.output;
}

export interface FaceDetectionResult {
  hasFaces: boolean;
  faceCount: number;
  /** False when detection was skipped/failed (caller should stay conservative). */
  confident: boolean;
}

/**
 * Detect whether the image contains faces (to gate face restoration).
 * Degradation: if no detector is configured or the call fails, we conservatively
 * assume a face IS present (faceRestore stays on) but mark confident=false.
 */
export async function detectFaces(imageUrl: string): Promise<FaceDetectionResult> {
  if (!FACE_DETECT_MODEL) {
    return { hasFaces: true, faceCount: 1, confident: false };
  }
  try {
    const out = await runModel(FACE_DETECT_MODEL, { image: imageUrl });
    const faceCount = extractFaceCount(out);
    return { hasFaces: faceCount > 0, faceCount, confident: true };
  } catch (e: any) {
    console.error("[detectFaces] failed:", e?.message ?? e);
    return { hasFaces: true, faceCount: 1, confident: false };
  }
}

/**
 * Get an ArcFace-style face embedding for an image.
 * Degradation: returns null when no embed model is configured or on error.
 */
export async function getFaceEmbedding(imageUrl: string): Promise<number[] | null> {
  if (!FACE_EMBED_MODEL) return null;
  try {
    const out = await runModel(FACE_EMBED_MODEL, { image: imageUrl });
    return parseEmbedding(out);
  } catch (e: any) {
    console.error("[getFaceEmbedding] failed:", e?.message ?? e);
    return null;
  }
}

export interface IdentityResult {
  verified: boolean;
  similarity: number;
  /** True when identity could not be measured (no embed model) -> not blocked. */
  skipped: boolean;
}

/**
 * Verify that a restored image preserves the identity of the original.
 * Degradation: if either embedding is unavailable, we DON'T block the pipeline
 * (verified=true, skipped=true) — we never fail closed on a missing measurement.
 */
export async function verifyIdentity(
  originalUrl: string,
  candidateUrl: string,
  threshold: number = DEFAULT_IDENTITY_THRESHOLD,
): Promise<IdentityResult> {
  const [a, b] = await Promise.all([
    getFaceEmbedding(originalUrl),
    getFaceEmbedding(candidateUrl),
  ]);
  if (!a || !b) {
    return { verified: true, similarity: 1, skipped: true };
  }
  const similarity = cosineSimilarity(a, b);
  return { verified: similarity >= threshold, similarity, skipped: false };
}

export interface QualityResult {
  score: number;
  sharpness: number;
  contrast: number;
  entropy: number;
}

/** No-reference quality score (0..10) for an image URL. Local + free. */
export async function scoreImageQuality(
  imageUrl: string,
): Promise<QualityResult | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return await scoreBufferQuality(buf);
  } catch (e: any) {
    console.error("[scoreImageQuality] failed:", e?.message ?? e);
    return null;
  }
}

export interface CandidateEvaluation {
  quality: number;
  identity: number;
  identityKnown: boolean;
}

/**
 * Evaluate a single best-of-N candidate: combine no-reference quality with
 * identity similarity vs the original upload. Used by the client to rank
 * candidates and enforce the identity guardrail.
 */
export async function evaluateCandidate(
  originalUrl: string,
  candidateUrl: string,
): Promise<CandidateEvaluation> {
  const [q, idOriginal, idCandidate] = await Promise.all([
    scoreImageQuality(candidateUrl),
    getFaceEmbedding(originalUrl),
    getFaceEmbedding(candidateUrl),
  ]);

  const quality = q?.score ?? 0;
  if (idOriginal && idCandidate) {
    return {
      quality,
      identity: cosineSimilarity(idOriginal, idCandidate),
      identityKnown: true,
    };
  }
  return { quality, identity: 1, identityKnown: false };
}
