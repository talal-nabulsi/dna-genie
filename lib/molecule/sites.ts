import { LOCI } from "@/lib/traits/interpret";
import { TRAITS } from "@/lib/traits/panel";
import type { Trait } from "@/lib/traits/types";
import type { Site } from "./engine";

export interface MarkerSite { rsid: string; trait: Trait; chr: string; pos: number; ref: string; alt?: string; flank: string }

const order = (c: string) => (c === "X" ? 23 : Number(c));

/** Every position that is read, in genome order. */
export const MARKER_SITES: MarkerSite[] = TRAITS.flatMap((trait) => trait.rsids.map((rsid) => {
  const l = LOCI[rsid], ref = l.flank[30];
  return { rsid, trait, chr: l.chr, pos: l.pos, ref, alt: l.alleles.find((a) => a !== ref), flank: l.flank };
})).sort((a, b) => order(a.chr) - order(b.chr) || a.pos - b.pos);

export const MARKER_SITE = new Map(MARKER_SITES.map((s) => [s.rsid, s]));

const cache = new Map<string, Site>();
/** The 61 letters around a marker, ready to draw. The same object comes back each time. */
export function moleculeSite(rsid: string): Site {
  let s = cache.get(rsid);
  if (!s) { const m = MARKER_SITE.get(rsid)!; s = { key: rsid, seq: m.flank, focus: 30, alt: m.alt }; cache.set(rsid, s); }
  return s;
}
export const place = (s: { chr: string; pos: number }) => `chr${s.chr}:${s.pos.toLocaleString("en-US")}`;
