// lib/aiQuality.ts
// ----------------------------------------------------------------------------
// Pure, dependency-free helpers for the restoration quality system.
// IMPORTANT: this file must NOT import `sharp` (or any server-only module) so
// it stays safe to import from the client component (best-of-N selection runs
// client-side, scoring runs server-side).
// ----------------------------------------------------------------------------

/** Cosine similarity of two equal-length vectors. Returns 0 for invalid input. */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/**
 * Extract a flat numeric face-embedding from an arbitrary Replicate output.
 * Handles: number[], number[][], and objects keyed by embedding/vector/etc.
 */
export function parseEmbedding(output: unknown): number[] | null {
  const flat = (v: unknown): number[] | null => {
    if (Array.isArray(v)) {
      if (v.length > 0 && v.every((x) => typeof x === "number")) {
        return v as number[];
      }
      for (const item of v) {
        const r = flat(item);
        if (r) return r;
      }
      return null;
    }
    if (v && typeof v === "object") {
      const obj = v as Record<string, unknown>;
      for (const key of [
        "embedding",
        "embeddings",
        "vector",
        "features",
        "face_embedding",
        "descriptor",
      ]) {
        if (key in obj) {
          const r = flat(obj[key]);
          if (r) return r;
        }
      }
    }
    return null;
  };
  return flat(output);
}

/** Pull the first numeric score out of an arbitrary model output. */
export function parseScore(output: unknown): number | null {
  const find = (v: unknown): number | null => {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const n = parseFloat(v);
      return Number.isNaN(n) ? null : n;
    }
    if (Array.isArray(v)) {
      for (const i of v) {
        const r = find(i);
        if (r !== null) return r;
      }
    }
    if (v && typeof v === "object") {
      const obj = v as Record<string, unknown>;
      for (const key of ["score", "quality", "value", "result", "mos", "output"]) {
        if (key in obj) {
          const r = find(obj[key]);
          if (r !== null) return r;
        }
      }
    }
    return null;
  };
  return find(output);
}

/** Best-effort face count from a detector output (count field or array length). */
export function extractFaceCount(output: unknown): number {
  if (Array.isArray(output)) return output.length;
  if (output && typeof output === "object") {
    const obj = output as Record<string, unknown>;
    for (const key of ["count", "num_faces", "faces_count", "n_faces"]) {
      const v = obj[key];
      if (typeof v === "number") return v;
      if (typeof v === "string") {
        const n = parseInt(v, 10);
        if (!Number.isNaN(n)) return n;
      }
    }
    for (const key of ["faces", "detections", "results", "bboxes"]) {
      if (Array.isArray(obj[key])) return (obj[key] as unknown[]).length;
    }
  }
  return 0;
}

export interface QualityMetrics {
  /** Raw variance-of-Laplacian (higher = sharper). */
  sharpness: number;
  /** Luminance standard deviation, 0..255 (higher = more contrast). */
  contrast: number;
  /** Shannon entropy, ~0..8 (higher = more detail). */
  entropy: number;
  /** Normalized overall quality, 0..10. */
  score: number;
}

export interface Candidate {
  url: string;
  /** No-reference quality, 0..10. */
  quality: number;
  /** Identity similarity to the original, -1..1. Meaningless if !identityKnown. */
  identity: number;
  /** Whether identity could actually be measured (face-embed model available). */
  identityKnown: boolean;
}

/**
 * Choose the best restoration candidate.
 * Policy: among candidates that pass the identity threshold (or whose identity
 * is unknown), pick the highest quality. If NONE pass identity, fall back to
 * the most faithful candidate (max identity) and report the failure — never
 * ship a high-quality render of the wrong person.
 */
export function pickBestCandidate(
  candidates: Candidate[],
  identityThreshold: number,
): { best: Candidate; passedIdentity: boolean } {
  if (candidates.length === 0) {
    throw new Error("pickBestCandidate: no candidates provided");
  }

  const passing = candidates.filter(
    (c) => !c.identityKnown || c.identity >= identityThreshold,
  );

  if (passing.length > 0) {
    const best = passing.reduce((a, b) => (b.quality > a.quality ? b : a));
    return { best, passedIdentity: true };
  }

  const best = candidates.reduce((a, b) => (b.identity > a.identity ? b : a));
  return { best, passedIdentity: false };
}

/**
 * Default ArcFace cosine floor below which we treat two faces as different
 * people. Restoration legitimately lowers similarity, so this is a permissive
 * "clearly not the same person" guard rather than a strict match threshold.
 */
export const DEFAULT_IDENTITY_THRESHOLD = 0.35;
