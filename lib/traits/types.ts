import type { BiomarkerId } from "@/lib/labs/biomarkers";

export type GroupId =
  | "lipids" | "glucose" | "iron" | "vitamins" | "organs" | "food" | "body" | "mind" | "aging";

/** 3 = well established, 2 = replicated association, 1 = early or mixed. */
export type Evidence = 1 | 2 | 3;

/**
 * notable: the genotype shifts something a clinician might care about.
 * differs: a real difference with little day-to-day consequence.
 * typical: the common or reference result.
 */
export type Tone = "typical" | "differs" | "notable";

export interface Reading {
  genotype: string;
  label: string;
  text: string;
  tone: Tone;
}

export interface Trait {
  id: string;
  name: string;
  gene: string;
  group: GroupId;
  rsids: string[];
  evidence: Evidence;
  about: string;
  /** Plain statement of what this result cannot tell you. */
  limits: string;
  /** Single-marker traits: one row per genotype, alleles on the GRCh37 plus strand. */
  table?: Record<string, Omit<Reading, "genotype">>;
  /** Multi-marker traits. Returns null when the needed markers are missing. */
  read?: (get: (rsid: string) => string | undefined) => Reading | null;
  /** Every result a multi-marker trait can give, for the detail page. */
  outcomes?: Reading[];
  /** Blood tests that bear on this marker. */
  labs?: BiomarkerId[];
  /** Kept behind an explicit choice. */
  sensitive?: string;
  pmids: string[];
  /** Papers that are not indexed in PubMed. */
  dois?: { doi: string; title: string; journal: string; year: number }[];
}

export interface TraitResult {
  trait: Trait;
  reading: Reading;
}

export interface Group {
  id: GroupId;
  name: string;
  blurb: string;
}
