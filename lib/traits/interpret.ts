import loci from "@/lib/genome/loci.json";
import { TRAITS } from "./panel";
import type { Trait, TraitResult } from "./types";

type Locus = { chr: string; pos: number; alleles: string[]; flank: string };
export const LOCI = loci as Record<string, Locus>;

const COMP: Record<string, string> = { A: "T", T: "A", C: "G", G: "C" };
const sorted = (g: string) => [...g].sort().join("");

/**
 * Returns a genotype on the GRCh37 plus strand with its letters sorted, or undefined when the call
 * cannot be used. A call that only makes sense on the other strand is complemented. Sites whose two
 * letters pair with each other (A/T, C/G) cannot be told apart that way, so they are used as given.
 */
export function normalizeGenotype(rsid: string, raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const g = raw.toUpperCase().replace(/[^ACGT]/g, "");
  const locus = LOCI[rsid];
  if (g.length !== 2 || !locus) return undefined;
  const ok = (s: string) => [...s].every((b) => locus.alleles.includes(b));
  if (ok(g)) return sorted(g);
  const flipped = [...g].map((b) => COMP[b]).join("");
  return ok(flipped) ? sorted(flipped) : undefined;
}

export function readTrait(trait: Trait, snps: Map<string, string>): TraitResult | null {
  if (trait.read) {
    const reading = trait.read((rsid) => normalizeGenotype(rsid, snps.get(rsid)));
    return reading ? { trait, reading } : null;
  }
  const g = normalizeGenotype(trait.rsids[0], snps.get(trait.rsids[0]));
  const row = g ? trait.table?.[g] : undefined;
  return g && row ? { trait, reading: { genotype: g, ...row } } : null;
}

export function readAll(snps: Map<string, string>): TraitResult[] {
  return TRAITS.map((t) => readTrait(t, snps)).filter((x): x is TraitResult => x !== null);
}
