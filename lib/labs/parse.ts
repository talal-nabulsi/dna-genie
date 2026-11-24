import { BIOMARKERS, type Biomarker, type BiomarkerId, type Range, type Sex } from "./biomarkers";

export interface Draft {
  id: BiomarkerId;
  value: number;
  bound?: "<" | ">";
  printed?: Range;
  /** The text the value came from, shown next to it for checking. */
  source: string;
  /** Why a person should look twice. */
  check?: string;
}

export interface ParsedReport { drafts: Draft[]; date?: string; sex?: Sex }

const norm = (s: string) => s.replace(/[‐-―−]/g, "-").replace(/µ|μ/g, "µ").replace(/\s+/g, " ").trim();
const unitKey = (u: string) => u.toLowerCase().replace(/µ/g, "u").replace(/\s/g, "");

type Alias = { text: string; marker: Biomarker };
const ALIASES: Alias[] = BIOMARKERS.flatMap((m) => m.aliases.map((text) => ({ text, marker: m }))).sort((a, b) => b.text.length - a.text.length);

const UNITS = [...new Set(BIOMARKERS.flatMap((b) => [b.unit, ...Object.keys(b.units ?? {})]))].sort((a, b) => b.length - a.length);

/** Same first word, different test. */
const NOT: Partial<Record<BiomarkerId, RegExp>> = {
  chol: /^cholesterol\s*\/|ratio/i,
  ldl: /^ldl\s*\/|ratio|particle|pattern|size|-p\b/i,
  hdl: /^hdl\s*\/|ratio|particle|large/i,
  glucose: /urine|tolerance|estimated|average|mean/i,
  hgb: /^hemoglobin\s+(a1c|a2|f\b|s\b|c\b|electro)|^hgb a1c/i,
  iron: /^iron\s+(bind|sat)/i,
  creatinine: /urine|clearance|ratio/i,
  albumin: /globulin|ratio|urine|microalbumin/i,
  bun: /ratio|creatinine/i,
  calcium: /ionized/i,
  insulin: /antibod|like growth|resist/i,
  folate: /rbc/i,
  bilirubin: /direct|indirect/i,
};

function findAlias(line: string): { markers: Biomarker[]; end: number; start: number } | null {
  const low = line.toLowerCase();
  for (const a of ALIASES) {
    const i = low.indexOf(a.text);
    if (i < 0 || i > 24) continue;
    const before = low[i - 1], after = low[i + a.text.length];
    if (before && /[a-z0-9-]/.test(before)) continue;
    if (after && /[a-z0-9]/.test(after)) continue;
    if (a.marker.id !== "nonhdl" && /non[- ]hdl/.test(low.slice(0, i + a.text.length))) continue;
    if (/ratio/.test(low)) continue;
    if (NOT[a.marker.id]?.test(line.slice(i, i + 60)) || (a.marker.id === "glucose" && /estimated|average|mean/i.test(line))) continue;
    const markers = ALIASES.filter((x) => x.text === a.text).map((x) => x.marker);
    return { markers, end: i + a.text.length, start: i };
  }
  return null;
}

function findUnit(text: string): { printed: string; at: number } | null {
  const hay = text.toLowerCase().replace(/µ/g, "u");
  let best: { printed: string; at: number } | null = null;
  for (const u of UNITS) {
    const at = hay.indexOf(u.toLowerCase().replace(/µ/g, "u"));
    if (at >= 0 && (!best || at < best.at || (at === best.at && u.length > best.printed.length))) best = { printed: u, at };
  }
  return best;
}

const NUM = String.raw`\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?|\.\d+`;
const num = (s: string) => Number(s.replace(/,/g, ""));

export function parseLine(raw: string): Draft | null {
  const line = norm(raw);
  const hit = findAlias(line);
  if (!hit) return null;
  let rest = line.slice(hit.end);
  // Labcorp prints a two-digit performing-lab code between the name and the result.
  rest = rest.replace(/^[\s.,:]*0\d\s+(?=[<>]?\s*\d)/, " ");
  // Dates are never results.
  rest = rest.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b/g, " ");

  const unit = findUnit(rest);
  // Units such as x10E3/uL or mL/min/1.73 contain digits. Blank them before looking for numbers.
  const clean = unit ? rest.slice(0, unit.at) + " ".repeat(unit.printed.length) + rest.slice(unit.at + unit.printed.length) : rest;

  const m = clean.match(new RegExp(`^[\\s:;.|]*(?:(?:high|low|h|l|a|abnormal|normal)\\s+)?([<>]=?)?\\s*(${NUM})(?![\\d/])`, "i"));
  if (!m) return null;
  // "Cholesterol <200" with nothing else is a goal, and "70-99" straight after the name is a range.
  const tail = clean.slice(m[0].length);
  if (/^\s*-\s*\d/.test(tail)) return null;
  const bound = m[1] ? (m[1][0] as "<" | ">") : undefined;

  const marker = hit.markers.find((x) => unit && [x.unit, ...Object.keys(x.units ?? {})].some((u) => unitKey(u) === unitKey(unit.printed))) ?? hit.markers[0];

  let factor = 1;
  let check: string | undefined;
  if (!unit) check = `No unit found. Read as ${marker.unit}.`;
  else if (unitKey(unit.printed) !== unitKey(marker.unit)) {
    const f = Object.entries(marker.units ?? {}).find(([u]) => unitKey(u) === unitKey(unit.printed));
    if (f) { factor = f[1]; if (factor !== 1) check = `Converted from ${unit.printed}.`; }
    else check = `Printed in ${unit.printed}, which we do not recognize for this test.`;
  }

  const conv = (n: number) => Number((n * factor).toPrecision(4));
  let printed: Range | undefined;
  const span = tail.match(new RegExp(`(${NUM})\\s*(?:-|to)\\s*(${NUM})`));
  if (span) printed = { low: conv(num(span[1])), high: conv(num(span[2])) };
  else {
    const one = tail.match(new RegExp(`([<>])\\s*(?:or\\s*=|=)?\\s*(${NUM})`, "i"));
    if (one) printed = one[1] === "<" ? { high: conv(num(one[2])) } : { low: conv(num(one[2])) };
  }
  if (printed?.low !== undefined && printed.high !== undefined && printed.low >= printed.high) printed = undefined;

  const value = factor === 1 ? num(m[2]) : conv(num(m[2]));
  if (value < marker.plausible[0] || value > marker.plausible[1]) check = "This number is unusual for this test. Check it against your report.";
  return { id: marker.id, value, bound, printed, source: line.slice(0, 160), check };
}

export function parseReportText(text: string): ParsedReport {
  const lines = text.split(/\r?\n/).map(norm).filter(Boolean);
  const drafts = new Map<BiomarkerId, Draft>();
  for (const line of lines) {
    const d = parseLine(line);
    if (!d) continue;
    const prev = drafts.get(d.id);
    if (!prev) drafts.set(d.id, d);
    else if (prev.value !== d.value && !prev.check)
      prev.check = "The report has more than one number for this test. The first was used.";
  }
  const head = lines.join("\n");
  const when = head.match(/(?:date collected|collected|collection date|specimen collected)\D{0,24}(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/i)?.[1];
  let date: string | undefined;
  if (when) {
    if (when.includes("/")) { const [mo, da, y] = when.split("/"); date = `${y}-${mo.padStart(2, "0")}-${da.padStart(2, "0")}`; }
    else date = when;
  }
  const sx = head.match(/\b(?:sex|gender)\s*:?\s*(female|male|f|m)\b/i)?.[1]?.toLowerCase();
  return { drafts: [...drafts.values()], date, sex: sx ? (sx.startsWith("f") ? "female" : "male") : undefined };
}

function splitCsv(line: string): string[] {
  const out: string[] = [];
  let cur = "", q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { if (q && line[i + 1] === '"') { cur += '"'; i++; } else q = !q; }
    else if ((c === "," || c === "\t" || c === ";") && !q) { out.push(cur); cur = ""; }
    else cur += c;
  }
  return [...out, cur].map((s) => s.trim());
}

export function parseReportCsv(text: string): ParsedReport {
  const rows = text.split(/\r?\n/).filter((l) => l.trim()).map(splitCsv);
  const head = rows[0]?.map((h) => h.toLowerCase()) ?? [];
  const col = (re: RegExp) => head.findIndex((h) => re.test(h));
  const name = col(/test|name|analyte|marker|component/), value = col(/value|result/), unit = col(/unit/), range = col(/range|reference/), date = col(/date|collected/);
  const body = name >= 0 && value >= 0
    ? rows.slice(1).map((r) => [r[name], r[value], unit >= 0 ? r[unit] : "", range >= 0 ? r[range] : ""].join(" "))
    : rows.map((r) => r.join(" "));
  const parsed = parseReportText(body.join("\n"));
  if (date >= 0) {
    const d = rows[1]?.[date] ?? "";
    const us = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/), iso = d.match(/^\d{4}-\d{2}-\d{2}/);
    if (iso) parsed.date = iso[0];
    else if (us) parsed.date = `${us[3]}-${us[1].padStart(2, "0")}-${us[2].padStart(2, "0")}`;
  }
  return parsed;
}
