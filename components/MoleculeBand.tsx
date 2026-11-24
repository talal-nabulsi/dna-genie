"use client";

import { useMemo, useSyncExternalStore } from "react";
import Molecule from "./Molecule";
import { MARKER_SITE, moleculeSite } from "@/lib/molecule/sites";

const media = (query: string) => {
  const sub = (f: () => void) => { const m = matchMedia(query); m.addEventListener("change", f); return () => m.removeEventListener("change", f); };
  return [sub, () => matchMedia(query).matches, () => false] as const;
};
const NARROW = media("(max-width: 900px)"), SHORT = media("(max-height: 780px)");
export const useNarrow = () => useSyncExternalStore(...NARROW);
export const useShort = () => useSyncExternalStore(...SHORT);

/** A strip of the molecule at one marker. */
export default function MoleculeBand({ rsid, alt, x = 0.18 }: { rsid: string; alt?: boolean; x?: number }) {
  const narrow = useNarrow(), m = MARKER_SITE.get(rsid)!;
  const pose = useMemo(() => ({ span: narrow ? 34 : 33, angle: -0.03, x: narrow ? 0 : x, y: 0 }), [narrow, x]);
  return <div className="band"><Molecule site={moleculeSite(rsid)} alt={alt} pose={pose} label={`DNA around ${m.trait.gene} ${rsid}, with the marker in yellow. Drag to turn.`} /></div>;
}
