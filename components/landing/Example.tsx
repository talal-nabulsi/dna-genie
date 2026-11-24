"use client";

import { useMemo, useState } from "react";
import Bonds, { EVIDENCE } from "@/components/Bonds";
import RangeStrip, { StatusWord } from "@/components/RangeStrip";
import { buildInsights } from "@/lib/insights/pairs";
import { BIOMARKER_BY_ID, type BiomarkerId } from "@/lib/labs/biomarkers";
import { judge } from "@/lib/labs/panel";
import { readTrait } from "@/lib/traits/interpret";
import { TRAIT_BY_ID } from "@/lib/traits/panel";

/** Runs the same rules as the report. `fixed` fills in the second marker where a trait needs two. */
const CASES: { trait: string; lab: BiomarkerId; rsid: string; options: string[]; fixed?: [string, string][]; start: [number, number]; min: number; max: number; step: number }[] = [
  { trait: "gilbert", lab: "bilirubin", rsid: "rs887829", options: ["CC", "CT", "TT"], start: [2, 1.7], min: 0.2, max: 3, step: 0.1 },
  { trait: "hfe", lab: "tsat", rsid: "rs1800562", options: ["GG", "AG", "AA"], fixed: [["rs1799945", "CC"]], start: [2, 58], min: 10, max: 90, step: 1 },
  { trait: "vitamin-d", lab: "vitd", rsid: "rs2282679", options: ["TT", "GT", "GG"], start: [0, 22], min: 8, max: 90, step: 1 },
  { trait: "mthfr", lab: "homocysteine", rsid: "rs1801133", options: ["GG", "AG", "AA"], fixed: [["rs1801131", "TT"]], start: [2, 11], min: 4, max: 40, step: 0.5 },
  { trait: "uric-acid", lab: "uric", rsid: "rs2231142", options: ["GG", "GT", "TT"], start: [1, 7.6], min: 2, max: 11, step: 0.1 },
];

export default function Example() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(CASES.map((c) => c.start));
  const c = CASES[i], [g, value] = pick[i];
  const trait = TRAIT_BY_ID.get(c.trait)!, marker = BIOMARKER_BY_ID.get(c.lab)!;
  const set = (next: [number, number]) => setPick(pick.map((p, k) => (k === i ? next : p)));

  const { result, j, insight } = useMemo(() => {
    const result = readTrait(trait, new Map([[c.rsid, c.options[g]], ...(c.fixed ?? [])]))!;
    const judged = judge({ date: "2026-01-01", values: [{ id: c.lab, value }] });
    return { result, j: judged[0], insight: buildInsights([result], judged)[0] };
  }, [trait, c, g, value]);

  return (
    <div className="lab">
      <div className="lab-list" role="tablist" aria-label="Examples">
        {CASES.map((x, k) => (
          <button key={x.trait} role="tab" id={`ex-${k}`} aria-selected={k === i} aria-controls="ex-panel" onClick={() => setI(k)}>
            {BIOMARKER_BY_ID.get(x.lab)!.name}<span>{TRAIT_BY_ID.get(x.trait)!.gene}</span>
          </button>
        ))}
      </div>
      <div className="lab-body" id="ex-panel" role="tabpanel" aria-labelledby={`ex-${i}`}>
        <div className="lab-side l">
          <h3 className="dna">{trait.gene}</h3>
          <p className="small muted mono">{c.rsid}</p>
          <div className="geno" role="group" aria-label="Genotype">
            {c.options.map((o, k) => <button key={o} aria-pressed={k === g} onClick={() => set([k, value])}>{o}</button>)}
          </div>
          <p style={{ marginTop: 16, minHeight: "1.5em" }}><strong>{result.reading.label}</strong></p>
        </div>
        <div className="lab-mid"><Bonds n={trait.evidence} /></div>
        <div className="lab-side r">
          <h3 className="blood">{marker.name}</h3>
          <p className="small muted">{EVIDENCE[trait.evidence]} link</p>
          <p style={{ marginTop: 14 }}><span className="big">{value}</span> <span className="muted">{marker.unit}</span> <StatusWord j={j} /></p>
          <input className="slider" type="range" min={c.min} max={c.max} step={c.step} value={value} aria-label={`${marker.name}, ${marker.unit}`} onChange={(e) => set([g, Number(e.target.value)])} />
          <RangeStrip j={j} />
        </div>
        <div className="lab-out" aria-live="polite">
          <h3>{insight.title}</h3>
          <p className="measure">{insight.text}</p>
          {insight.ask && <p className="measure" style={{ marginTop: 12 }}><strong>Ask your clinician:</strong> {insight.ask}</p>}
        </div>
      </div>
    </div>
  );
}
