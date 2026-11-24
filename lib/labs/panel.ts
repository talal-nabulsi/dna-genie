import { BIOMARKERS, BIOMARKER_BY_ID, generalRange, type Biomarker, type BiomarkerId, type Range, type Sex } from "./biomarkers";

export interface LabValue {
  id: BiomarkerId;
  value: number;
  /** "<" or ">" when the lab only reported a bound. */
  bound?: "<" | ">";
  /** Range printed on the report, already in the standard unit. */
  printed?: Range;
}

export interface LabPanel {
  /** YYYY-MM-DD */
  date: string;
  sex?: Sex;
  values: LabValue[];
  sample?: boolean;
}

export type Status = "low" | "in" | "high";

export interface Judged extends LabValue {
  marker: Biomarker;
  range: Range;
  rangeSource: "lab" | "general";
  status: Status;
  urgent: boolean;
  /** Calculated here from other values on the panel. */
  derived?: boolean;
}

/** Lipoprotein(a) is "high from" its limit, so the limit itself counts as high. */
const INCLUSIVE = new Set<BiomarkerId>(["lpa_nmol", "lpa_mg"]);

export function statusOf(id: BiomarkerId, value: number, range: Range): Status {
  if (range.low !== undefined && value < range.low) return "low";
  if (range.high !== undefined && (value > range.high || (INCLUSIVE.has(id) && value === range.high))) return "high";
  return "in";
}

const round = (n: number, d: number) => Math.round(n * 10 ** d) / 10 ** d;

export function judge(panel: LabPanel): Judged[] {
  const byId = new Map(panel.values.map((v) => [v.id, v]));
  const all: (LabValue & { derived?: boolean })[] = [...panel.values];
  const exact = (id: BiomarkerId) => { const v = byId.get(id); return v && !v.bound ? v.value : undefined; };

  const chol = exact("chol"), hdl = exact("hdl");
  if (!byId.has("nonhdl") && chol !== undefined && hdl !== undefined && chol > hdl)
    all.push({ id: "nonhdl", value: round(chol - hdl, 0), derived: true });
  const iron = exact("iron"), tibc = exact("tibc");
  if (!byId.has("tsat") && iron !== undefined && tibc) all.push({ id: "tsat", value: round((iron / tibc) * 100, 0), derived: true });

  const order = new Map(BIOMARKERS.map((b, i) => [b.id, i]));
  return all
    .map((v): Judged | null => {
      const marker = BIOMARKER_BY_ID.get(v.id);
      if (!marker) return null;
      const has = v.printed && (v.printed.low !== undefined || v.printed.high !== undefined);
      const range = has ? v.printed! : generalRange(marker, panel.sex);
      const u = marker.urgent;
      return {
        ...v, marker, range, rangeSource: has ? "lab" : "general",
        status: statusOf(v.id, v.value, range),
        urgent: !!u && ((u.low !== undefined && v.value < u.low && v.bound !== ">") || (u.high !== undefined && v.value >= u.high && v.bound !== "<")),
      };
    })
    .filter((x): x is Judged => x !== null)
    .sort((a, b) => order.get(a.id)! - order.get(b.id)!);
}

export function formatRange(r: Range, unit = ""): string {
  const u = unit ? ` ${unit}` : "";
  if (r.low !== undefined && r.high !== undefined) return `${r.low} to ${r.high}${u}`;
  if (r.high !== undefined) return `up to ${r.high}${u}`;
  if (r.low !== undefined) return `${r.low} or more${u}`;
  return "no range";
}
