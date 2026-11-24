import type { Judged } from "@/lib/labs/panel";
import type { BiomarkerId } from "@/lib/labs/biomarkers";
import type { TraitResult } from "@/lib/traits/types";
import { TRAIT_BY_ID } from "@/lib/traits/panel";

/**
 * both:  the genotype points a way and the blood value is there.
 * blood: the value is out of range and the genotype does not point that way.
 * dna:   the genotype points a way and the value is in range.
 * quiet: neither stands out.
 */
export type PairState = "both" | "blood" | "dna" | "quiet";

export interface Insight {
  traitId: string;
  state: PairState;
  title: string;
  text: string;
  ask?: string;
  labs: BiomarkerId[];
}

type Labs = Map<BiomarkerId, Judged>;
interface Rule {
  traitId: string;
  /** The first of these that was measured decides. */
  labs: BiomarkerId[];
  /** Shown with the pair, but never decides it. */
  also?: BiomarkerId[];
  direction: "high" | "low";
  points: (r: TraitResult) => boolean;
  say: Record<PairState, { title: string; text: string; ask?: string }>;
  extra?: (labs: Labs) => string | undefined;
}

const notable = (r: TraitResult) => r.reading.tone === "notable";

const RULES: Rule[] = [
  {
    traitId: "gilbert", labs: ["bilirubin"], direction: "high", points: notable,
    say: {
      both: { title: "Raised bilirubin, with the Gilbert pattern", text: "Two slower UGT1A1 copies are a common, harmless reason for a mildly high bilirubin. Other causes still need to be ruled out once.", ask: "Could this be Gilbert syndrome, and do I need a direct bilirubin or blood count to be sure?" },
      blood: { title: "Raised bilirubin without the Gilbert pattern", text: "Your genotype does not explain this one, so it deserves a look.", ask: "What is causing my raised bilirubin?" },
      dna: { title: "Gilbert pattern, normal bilirubin today", text: "Bilirubin can rise with fasting, illness or hard exercise. If a future test reads high, mention this genotype." },
      quiet: { title: "Bilirubin and UGT1A1 both ordinary", text: "Nothing stands out on either side." },
    },
    extra: (l) => (l.get("alt")?.status === "high" || l.get("ast")?.status === "high" ? "Your ALT or AST is also high. Gilbert syndrome does not do that, so do not put the liver results down to it." : undefined),
  },
  {
    traitId: "hfe", labs: ["tsat", "ferritin"], also: ["iron"], direction: "high", points: notable,
    say: {
      both: { title: "Raised iron tests, with an HFE result", text: "This genotype can let the body take in too much iron, and your iron tests are up. The pairing is worth a prompt, unhurried visit.", ask: "Should I have repeat fasting iron studies and a clinical HFE test?" },
      blood: { title: "Raised iron tests, HFE does not explain it", text: "Ferritin also rises with inflammation, alcohol, fatty liver and infection.", ask: "Why are my iron tests high?" },
      dna: { title: "HFE result, iron tests in range today", text: "Iron has not built up on this panel. People with this genotype usually recheck from time to time.", ask: "How often should I repeat ferritin and transferrin saturation?" },
      quiet: { title: "Iron tests and HFE both ordinary", text: "Nothing stands out on either side." },
    },
    extra: (l) => (l.get("ferritin")?.status === "low" ? "Your ferritin is low, which points to low iron stores whatever the genotype." : undefined),
  },
  {
    traitId: "vitamin-d", labs: ["vitd"], direction: "low", points: (r) => r.reading.tone !== "typical",
    say: {
      both: { title: "Low vitamin D, and a genotype that leans that way", text: "The GC result nudges measured vitamin D down. Sun, season and diet are still the larger levers.", ask: "Do I need vitamin D, how much, and when should we recheck?" },
      blood: { title: "Low vitamin D, not explained by this marker", text: "Season, sun, skin tone, weight and diet are the usual reasons.", ask: "Do I need vitamin D, how much, and when should we recheck?" },
      dna: { title: "Vitamin D in range despite a lower-leaning genotype", text: "Whatever you are doing is enough right now. Levels are lowest at the end of winter." },
      quiet: { title: "Vitamin D and GC both ordinary", text: "Nothing stands out on either side." },
    },
  },
  {
    traitId: "mthfr", labs: ["homocysteine"], direction: "high", points: notable,
    say: {
      both: { title: "Raised homocysteine, with two C677T copies", text: "This genotype raises homocysteine mainly when folate is low. B12, kidney function and thyroid matter too.", ask: "Should we check folate, B12 and kidney function, then repeat homocysteine?" },
      blood: { title: "Raised homocysteine, not explained by MTHFR", text: "Low B12, low folate and reduced kidney function are the usual reasons.", ask: "Should we check folate, B12 and kidney function?" },
      dna: { title: "Two C677T copies, homocysteine in range", text: "The enzyme difference is not showing up in your blood. Guidelines do not suggest treating the genotype alone." },
      quiet: { title: "Homocysteine and MTHFR both ordinary", text: "Nothing stands out on either side." },
    },
    extra: (l) => (l.get("b12")?.status === "low" ? "Your B12 is low. That should be sorted out first, since folate can hide it." : undefined),
  },
  {
    traitId: "sort1-ldl", labs: ["ldl", "apob", "nonhdl"], also: ["chol"], direction: "high", points: (r) => r.reading.genotype !== "TT",
    say: {
      both: { title: "LDL is up despite a lowering marker", text: "Your SORT1 result leans LDL down, and it is up anyway. Other genes, diet, weight, thyroid and family history carry more weight.", ask: "What LDL goal fits my overall heart risk?" },
      blood: { title: "LDL is up", text: "Your SORT1 result is the common one and neither raises nor lowers it. Other genes, diet, weight, thyroid and family history set LDL.", ask: "What LDL goal fits my overall heart risk?" },
      dna: { title: "LDL in range, with a lowering marker", text: "The SORT1 result leans the same way as your blood." },
      quiet: { title: "LDL in range", text: "Your SORT1 result is the common one. Nothing stands out on either side." },
    },
    extra: (l) => ((l.get("ldl")?.value ?? 0) >= 190 ? "An LDL of 190 or more can mean familial hypercholesterolemia, which this site does not test for. Ask about it directly." : undefined),
  },
  {
    traitId: "apoe", labs: ["ldl", "apob", "nonhdl"], direction: "high", points: (r) => r.reading.genotype.includes("ε4") && r.reading.genotype !== "ε2/ε4",
    say: {
      both: { title: "LDL is up, with an ε4 copy", text: "ε4 tends to raise LDL a little. LDL responds to treatment in people with every APOE type.", ask: "What LDL goal fits my overall heart risk?" },
      blood: { title: "LDL is up, APOE does not explain it", text: "Diet, weight, thyroid, family history and many other genes set LDL.", ask: "What LDL goal fits my overall heart risk?" },
      dna: { title: "An ε4 copy, with LDL in range", text: "The tendency is not showing up on this panel." },
      quiet: { title: "LDL in range, no ε4 push", text: "Nothing stands out on either side." },
    },
  },
  {
    traitId: "lpa", labs: ["lpa_nmol", "lpa_mg"], direction: "high", points: notable,
    say: {
      both: { title: "High lipoprotein(a), with the LPA marker", text: "Lp(a) is mostly inherited and stays stable for life. Close relatives may have it too.", ask: "How does high Lp(a) change my heart-risk plan, and should my family be tested?" },
      blood: { title: "High lipoprotein(a) without this marker", text: "Many people with high Lp(a) do not carry this marker. The blood value is what counts.", ask: "How does high Lp(a) change my heart-risk plan, and should my family be tested?" },
      dna: { title: "LPA marker, Lp(a) in range", text: "The measured value is what counts, and it is below the high mark." },
      quiet: { title: "Lp(a) and LPA both ordinary", text: "Lp(a) seldom needs repeating." },
    },
  },
  {
    traitId: "apoa5", labs: ["triglycerides"], direction: "high", points: notable,
    say: {
      both: { title: "High triglycerides, with the APOA5 marker", text: "This marker slows triglyceride clearance. Alcohol, sugar, weight, blood sugar and some medicines add to it.", ask: "Was this a fasting test, and what is the best first step to lower it?" },
      blood: { title: "High triglycerides, not explained by APOA5", text: "Alcohol, sugar, weight, blood sugar, thyroid and some medicines are common reasons.", ask: "Was this a fasting test, and what is the best first step to lower it?" },
      dna: { title: "APOA5 marker, triglycerides in range", text: "The tendency is not showing up on this panel." },
      quiet: { title: "Triglycerides and APOA5 both ordinary", text: "Nothing stands out on either side." },
    },
  },
  {
    traitId: "tcf7l2", labs: ["hba1c", "glucose"], direction: "high", points: notable,
    say: {
      both: { title: "Blood sugar is up, with a TCF7L2 risk copy", text: "In the Diabetes Prevention Program, lifestyle change slowed progression for every TCF7L2 result, including yours.", ask: "Is this prediabetes, and is there a prevention program I can join?" },
      blood: { title: "Blood sugar is up without the TCF7L2 marker", text: "Most type 2 diabetes risk lies outside this one marker.", ask: "Is this prediabetes, and is there a prevention program I can join?" },
      dna: { title: "A TCF7L2 risk copy, blood sugar in range", text: "The tendency is not showing up. Routine screening is the right follow-up." },
      quiet: { title: "Blood sugar and TCF7L2 both ordinary", text: "Nothing stands out on either side." },
    },
  },
  {
    traitId: "uric-acid", labs: ["uric"], direction: "high", points: notable,
    say: {
      both: { title: "High uric acid, with an ABCG2 copy", text: "This version clears uric acid less well. High uric acid without gout is often only watched.", ask: "Do I need to do anything about uric acid if I have never had gout?" },
      blood: { title: "High uric acid, not explained by ABCG2", text: "Kidney function, diuretics, alcohol and diet are common reasons.", ask: "Could a medicine or my kidneys explain my uric acid?" },
      dna: { title: "ABCG2 copy, uric acid in range", text: "The tendency is not showing up on this panel." },
      quiet: { title: "Uric acid and ABCG2 both ordinary", text: "Nothing stands out on either side." },
    },
  },
  {
    traitId: "fut2-b12", labs: ["b12"], direction: "low", points: (r) => r.reading.genotype !== "AA",
    say: {
      both: { title: "Low B12", text: "Being a secretor lowers blood B12 only a little. Look to diet, absorption and medicines such as metformin first.", ask: "Should I have methylmalonic acid checked, and what is the cause?" },
      blood: { title: "Low B12 in a non-secretor", text: "Non-secretors usually read higher, so a low value deserves a closer look.", ask: "Should I have methylmalonic acid checked, and what is the cause?" },
      dna: { title: "B12 in range", text: "Nothing stands out on either side." },
      quiet: { title: "B12 in range for a non-secretor", text: "Non-secretors tend to read higher in blood. It does not always mean more B12 in cells." },
    },
  },
  {
    traitId: "crp-baseline", labs: ["hscrp"], direction: "high", points: (r) => r.reading.genotype === "CC",
    say: {
      both: { title: "hs-CRP is up", text: "Your genotype allows the usual CRP baseline and does not explain a raised value. A cold, an injury or poor sleep can.", ask: "Should we repeat hs-CRP when I have been well for two weeks?" },
      blood: { title: "hs-CRP is up despite a lower genetic baseline", text: "Something is driving it on top of the baseline.", ask: "Should we repeat hs-CRP when I have been well for two weeks?" },
      dna: { title: "hs-CRP in range", text: "Nothing stands out on either side." },
      quiet: { title: "hs-CRP in range, with a lower genetic baseline", text: "A genetically low CRP does not by itself mean lower heart risk." },
    },
  },
  {
    traitId: "omega3-metabolism", labs: ["omega3"], direction: "low", points: (r) => r.reading.tone !== "typical",
    say: {
      both: { title: "Low omega-3 index, and slower conversion", text: "Plant omega-3 converts less well with this result. Fish or algae sources skip that step.", ask: "Would eating more fish or an algae source make sense for me?" },
      blood: { title: "Low omega-3 index, conversion is ordinary", text: "Intake is the likely reason.", ask: "Would eating more fish or an algae source make sense for me?" },
      dna: { title: "Omega-3 index in range despite slower conversion", text: "Your intake is making up for it." },
      quiet: { title: "Omega-3 index and FADS1 both ordinary", text: "Nothing stands out on either side." },
    },
  },
  {
    traitId: "celiac-risk", labs: ["ttg"], direction: "high", points: notable,
    say: {
      both: { title: "Positive celiac antibody, with DQ2.5", text: "Together these make celiac disease likely enough to need a specialist. Keep eating gluten until you have seen one, because stopping can hide it.", ask: "Can I be referred to gastroenterology before I change my diet?" },
      blood: { title: "Positive celiac antibody without the DQ2.5 marker", text: "Other types such as DQ8 can also carry it, and this site does not read them. Keep eating gluten until you have been assessed.", ask: "Can I be referred to gastroenterology before I change my diet?" },
      dna: { title: "DQ2.5 marker, celiac antibody negative", text: "No sign of active celiac disease on this test, as long as you were eating gluten." },
      quiet: { title: "Celiac antibody and DQ2.5 both negative", text: "Nothing stands out on either side." },
    },
  },
];

export const PAIRED_TRAITS = new Set(RULES.map((r) => r.traitId));
const RANK: Record<PairState, number> = { both: 0, blood: 1, dna: 2, quiet: 3 };

export function buildInsights(results: TraitResult[], judged: Judged[]): Insight[] {
  const labs: Labs = new Map(judged.map((j) => [j.id, j]));
  const traits = new Map(results.map((r) => [r.trait.id, r]));
  const out: Insight[] = [];
  for (const rule of RULES) {
    const tr = traits.get(rule.traitId);
    const measured = rule.labs.map((id) => labs.get(id)).filter((x): x is Judged => !!x);
    if (!tr || measured.length === 0) continue;
    const hit = measured.some((m) => m.status === rule.direction);
    const points = rule.points(tr);
    const state: PairState = hit ? (points ? "both" : "blood") : points ? "dna" : "quiet";
    const s = rule.say[state];
    const extra = rule.extra?.(labs);
    out.push({ traitId: rule.traitId, state, title: s.title, text: extra ? `${s.text} ${extra}` : s.text, ask: s.ask, labs: [...measured.map((m) => m.id), ...(rule.also ?? []).filter((id) => labs.has(id))] });
  }
  return out.sort((a, b) => RANK[a.state] - RANK[b.state]);
}

/** Out-of-range values that no pair already speaks to. */
export function unpaired(judged: Judged[], insights: Insight[]): Judged[] {
  const spoken = new Set(insights.filter((i) => i.state === "both" || i.state === "blood").flatMap((i) => i.labs));
  return judged.filter((j) => j.status !== "in" && !spoken.has(j.id));
}

/** A blood test that would answer what a notable genotype raises, when it has not been measured. */
export function missingTests(results: TraitResult[], judged: Judged[]): { trait: TraitResult; labs: BiomarkerId[] }[] {
  const have = new Set(judged.map((j) => j.id));
  return results
    .filter((r) => r.reading.tone === "notable" && !r.trait.sensitive && PAIRED_TRAITS.has(r.trait.id))
    .map((trait) => ({ trait, labs: RULES.find((x) => x.traitId === trait.trait.id)!.labs }))
    .filter((x) => !x.labs.some((id) => have.has(id)) && TRAIT_BY_ID.has(x.trait.trait.id));
}
