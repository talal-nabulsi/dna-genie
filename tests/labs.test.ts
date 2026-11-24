import { describe, expect, it } from "vitest";
import { parseLine, parseReportCsv, parseReportText } from "@/lib/labs/parse";
import { judge } from "@/lib/labs/panel";
import { buildInsights, missingTests } from "@/lib/insights/pairs";
import { readAll } from "@/lib/traits/interpret";
import { SAMPLE_GENOME, SAMPLE_PANEL } from "@/lib/demo/sample";

describe("printed lines", () => {
  it.each([
    ["Cholesterol, Total 01 189 mg/dL 100-199", "chol", 189, { low: 100, high: 199 }],
    ["CHOLESTEROL, TOTAL 212 H <200 mg/dL", "chol", 212, { high: 200 }],
    ["LDL Chol Calc (NIH) 131 High mg/dL 0-99", "ldl", 131, { low: 0, high: 99 }],
    ["HDL CHOLESTEROL 52 > OR = 40 mg/dL", "hdl", 52, { low: 40 }],
    ["Hemoglobin A1c 5.8 H % 4.8-5.6", "hba1c", 5.8, { low: 4.8, high: 5.6 }],
    ["Hemoglobin 15.1 g/dL 13.0-17.7", "hgb", 15.1, { low: 13, high: 17.7 }],
    ["Vitamin D, 25-Hydroxy 24.0 Low ng/mL 30.0-100.0", "vitd", 24, { low: 30, high: 100 }],
    ["VITAMIN B12 512 200-1100 pg/mL", "b12", 512, { low: 200, high: 1100 }],
    ["Homocyst(e)ine 11.2 umol/L 0.0-14.5", "homocysteine", 11.2, { low: 0, high: 14.5 }],
    ["Bilirubin, Total 1.7 High 1.2 10/02/2025 mg/dL 0.0-1.2", "bilirubin", 1.7, { low: 0, high: 1.2 }],
    ["Iron Bind.Cap.(TIBC) 296 ug/dL 250-450", "tibc", 296, { low: 250, high: 450 }],
    ["Platelets 241 x10E3/uL 150-450", "plt", 241, { low: 150, high: 450 }],
    ["eGFR 92 mL/min/1.73 >59", "egfr", 92, { low: 59 }],
    ["Ferritin 1,318 ng/mL 30-400", "ferritin", 1318, { low: 30, high: 400 }],
    ["Glucose 94 mg/dL 70-99", "glucose", 94, { low: 70, high: 99 }],
  ])("%s", (line, id, value, range) => {
    const d = parseLine(line)!;
    expect(d?.id).toBe(id); expect(d.value).toBe(value); expect(d.printed).toEqual(range);
  });

  it.each([
    "LDL/HDL Ratio 2.5 ratio 0.0-3.6", "Cholesterol/HDL ratio 4.1 <5.0", "Albumin/Globulin Ratio 1.8 1.2-2.2", "BUN/Creatinine Ratio 14 9-20",
    "Creatinine, urine 120 mg/dL", "Hemoglobin A2 2.4 %", "Please fast before your glucose test", "Glucose 70-99 mg/dL", "Estimated Average Glucose 120 mg/dL",
  ])("skips: %s", (line) => expect(parseLine(line)).toBeNull());

  it("keeps non-HDL apart from HDL", () => expect(parseLine("Non-HDL Cholesterol 160 mg/dL <130")?.id).toBe("nonhdl"));
  it("keeps Lp(a) units apart", () => {
    expect(parseLine("Lipoprotein (a) 142 nmol/L <75")?.id).toBe("lpa_nmol");
    expect(parseLine("Lipoprotein (a) 61 mg/dL <30")?.id).toBe("lpa_mg");
  });
  it("converts value and range together", () => {
    const d = parseLine("Glucose 5.4 mmol/L 3.9-5.5")!;
    expect(d.value).toBeCloseTo(97.3, 1); expect(d.printed!.high).toBeCloseTo(99.1, 1); expect(d.check).toMatch(/Converted/);
  });
  it("keeps a bound", () => expect(parseLine("hs-CRP <0.3 mg/L <3.0")).toMatchObject({ bound: "<", value: 0.3 }));
  it("flags a missing unit and an unlikely number", () => {
    expect(parseLine("Potassium 4.3")?.check).toMatch(/No unit/);
    expect(parseLine("Potassium 43 mmol/L 3.5-5.2")?.check).toMatch(/unusual/);
  });
});

it("reads date, sex and repeats from a report", () => {
  const p = parseReportText("Date Collected: 10/06/2026\nSex: Male\nFerritin 318 ng/mL 30-400\nFerritin 290 ng/mL 30-400");
  expect(p.date).toBe("2026-10-06"); expect(p.sex).toBe("male"); expect(p.drafts).toHaveLength(1); expect(p.drafts[0].check).toMatch(/more than one/);
});

it("reads a CSV with headings", () => {
  const p = parseReportCsv('Test,Result,Units,Reference Range,Date\n"Cholesterol, Total",189,mg/dL,100-199,2026-10-06\nTSH,1.9,mIU/L,0.4-4.5,2026-10-06');
  expect(p.drafts.map((d) => [d.id, d.value])).toEqual([["chol", 189], ["tsh", 1.9]]); expect(p.date).toBe("2026-10-06");
});

describe("judging", () => {
  const one = (id: never, value: number, extra = {}) => judge({ date: "2026-01-01", values: [{ id, value, ...extra }] })[0];
  it("uses the printed range first", () => {
    const j = one("ferritin" as never, 350, { printed: { low: 30, high: 300 } });
    expect(j.status).toBe("high"); expect(j.rangeSource).toBe("lab");
  });
  it("marks urgent values", () => { expect(one("potassium" as never, 6.4).urgent).toBe(true); expect(one("potassium" as never, 5.4).urgent).toBe(false); });
  it("counts the Lp(a) limit as high", () => expect(one("lpa_nmol" as never, 125).status).toBe("high"));
  it("derives saturation and non-HDL", () => {
    const j = judge(SAMPLE_PANEL);
    expect(j.find((x) => x.id === "tsat")).toMatchObject({ value: 55, derived: true });
    expect(j.find((x) => x.id === "nonhdl")).toMatchObject({ value: 160, derived: true });
  });
});

describe("pairs", () => {
  const results = readAll(new Map(SAMPLE_GENOME));
  const ins = buildInsights(results, judge(SAMPLE_PANEL));
  const state = (id: string) => ins.find((i) => i.traitId === id)?.state;
  it("pairs the sample", () => {
    expect(state("gilbert")).toBe("both"); expect(state("hfe")).toBe("both"); expect(state("uric-acid")).toBe("both");
    expect(state("tcf7l2")).toBe("both"); expect(state("vitamin-d")).toBe("both"); expect(state("mthfr")).toBe("dna");
    expect(state("apoe")).toBe("blood"); expect(state("sort1-ldl")).toBe("blood"); expect(state("apoa5")).toBe("quiet");
  });
  it("raises familial hypercholesterolemia at LDL 190", () => {
    const p = { ...SAMPLE_PANEL, values: SAMPLE_PANEL.values.map((v) => (v.id === "ldl" ? { ...v, value: 196 } : v)) };
    expect(buildInsights(results, judge(p)).find((i) => i.traitId === "sort1-ldl")!.text).toMatch(/familial/);
  });
  it("says nothing without a blood value", () => expect(buildInsights(results, [])).toEqual([]));
  it("does not blame Gilbert for liver enzymes", () => {
    const p = { ...SAMPLE_PANEL, values: SAMPLE_PANEL.values.map((v) => (v.id === "alt" ? { ...v, value: 120 } : v)) };
    expect(buildInsights(results, judge(p)).find((i) => i.traitId === "gilbert")!.text).toMatch(/does not do that/);
  });
  it("suggests the missing Lp(a) test", () => expect(missingTests(results, judge(SAMPLE_PANEL)).map((m) => m.trait.trait.id)).toContain("lpa"));
  it("never gives doses or treatment orders", () => {
    for (const i of ins) expect(i.text).not.toMatch(/\b\d+\s?(mg|mcg|IU)\b|stop taking|start taking/i);
  });
});
