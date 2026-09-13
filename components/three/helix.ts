import * as THREE from "three";

export type Base = "A" | "T" | "G" | "C";

export const COMPLEMENT: Record<Base, Base> = { A: "T", T: "A", G: "C", C: "G" };

export const BASE_COLORS: Record<Base, string> = {
  A: "#12d38c",
  T: "#0fbfb4",
  G: "#a3e02a",
  C: "#27a4f2",
};

export const BASE_NAMES: Record<Base, string> = {
  A: "Adenine",
  T: "Thymine",
  G: "Guanine",
  C: "Cytosine",
};

export interface HelixConfig {
  /** Number of base pairs along the helix. */
  pairs: number;
  /** Radius of the sugar-phosphate backbone. */
  radius: number;
  /** Axial rise per base pair (B-DNA ≈ 0.34 nm per 1 nm radius). */
  rise: number;
  /** Base pairs per full turn (B-DNA ≈ 10.5). */
  pairsPerTurn: number;
  /** Angular offset between the two strands — creates the major/minor grooves. */
  strandOffset: number;
}

export const DEFAULT_HELIX: HelixConfig = {
  pairs: 64,
  radius: 1,
  rise: 0.34,
  pairsPerTurn: 10.5,
  strandOffset: 2.2,
};

/** Deterministic PRNG (mulberry32) so the sequence is stable between renders. */
export function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSequence(length: number, seed = 1337): Base[] {
  const rnd = seededRandom(seed);
  const bases: Base[] = ["A", "T", "G", "C"];
  return Array.from({ length }, () => bases[Math.floor(rnd() * 4)]);
}

export function helixLength(cfg: HelixConfig) {
  return (cfg.pairs - 1) * cfg.rise;
}

export function strandPoint(index: number, strand: 0 | 1, cfg: HelixConfig, out = new THREE.Vector3()) {
  const theta = (index / cfg.pairsPerTurn) * Math.PI * 2 + (strand === 1 ? cfg.strandOffset : 0);
  const y = (index - (cfg.pairs - 1) / 2) * cfg.rise;
  return out.set(Math.cos(theta) * cfg.radius, y, Math.sin(theta) * cfg.radius);
}

export interface HelixData {
  strandA: THREE.Vector3[];
  strandB: THREE.Vector3[];
  midpoints: THREE.Vector3[];
}

export function buildHelix(cfg: HelixConfig): HelixData {
  const strandA: THREE.Vector3[] = [];
  const strandB: THREE.Vector3[] = [];
  const midpoints: THREE.Vector3[] = [];
  for (let i = 0; i < cfg.pairs; i++) {
    const a = strandPoint(i, 0, cfg);
    const b = strandPoint(i, 1, cfg);
    strandA.push(a);
    strandB.push(b);
    midpoints.push(a.clone().add(b).multiplyScalar(0.5));
  }
  return { strandA, strandB, midpoints };
}

/** Outward radial direction at a base-pair index (points away from the helix axis). */
export function radialDirection(index: number, cfg: HelixConfig, out = new THREE.Vector3()) {
  const theta = (index / cfg.pairsPerTurn) * Math.PI * 2;
  return out.set(Math.cos(theta), 0, Math.sin(theta));
}

let glowTexture: THREE.Texture | null = null;

/** Soft radial sprite used for marker halos. Built once, on the client. */
export function getGlowTexture(): THREE.Texture {
  if (glowTexture) return glowTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.55)");
  grad.addColorStop(0.6, "rgba(255,255,255,0.12)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  glowTexture = new THREE.CanvasTexture(canvas);
  glowTexture.colorSpace = THREE.SRGBColorSpace;
  return glowTexture;
}
