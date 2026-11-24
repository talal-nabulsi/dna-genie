export type Sex = "female" | "male";

export type BiomarkerId =
  | "chol" | "ldl" | "hdl" | "triglycerides" | "nonhdl" | "apob" | "lpa_nmol" | "lpa_mg"
  | "glucose" | "hba1c" | "insulin"
  | "ferritin" | "iron" | "tibc" | "tsat" | "hgb" | "hct" | "mcv" | "wbc" | "plt"
  | "vitd" | "b12" | "folate" | "homocysteine" | "mma" | "omega3" | "magnesium"
  | "bilirubin" | "alt" | "ast" | "alp" | "albumin"
  | "creatinine" | "egfr" | "bun" | "uric" | "sodium" | "potassium" | "calcium"
  | "hscrp" | "tsh" | "ft4" | "ttg";

export type LabGroup = "Lipids" | "Blood sugar" | "Iron and blood count" | "Vitamins" | "Liver" | "Kidney and minerals" | "Inflammation, thyroid, immune";

export interface Range { low?: number; high?: number }

export interface Biomarker {
  id: BiomarkerId;
  name: string;
  group: LabGroup;
  /** Names as printed on reports, lower case. Longest match wins. */
  aliases: string[];
  unit: string;
  /** Other printed units and the factor that turns them into `unit`. */
  units?: Record<string, number>;
  /** General adult range, used only when the report prints none. */
  range: Range | ((sex?: Sex) => Range);
  /** Values outside this are almost certainly a misread. */
  plausible: [number, number];
  /** Levels that should be raised with a clinician the same day. */
  urgent?: Range;
  /** What the general range is, when it is a goal and not a normal range. */
  note?: string;
  derived?: boolean;
}

const bySex = (f: Range, m: Range) => (sex?: Sex): Range =>
  sex === "female" ? f : sex === "male" ? m : {
    low: f.low !== undefined && m.low !== undefined ? Math.min(f.low, m.low) : undefined,
    high: f.high !== undefined && m.high !== undefined ? Math.max(f.high, m.high) : undefined,
  };

export const BIOMARKERS: Biomarker[] = [
  { id: "chol", name: "Total cholesterol", group: "Lipids", aliases: ["cholesterol, total", "total cholesterol", "cholesterol total", "cholesterol"], unit: "mg/dL", units: { "mmol/L": 38.67 }, range: { high: 200 }, plausible: [50, 800], note: "Desirable level" },
  { id: "ldl", name: "LDL cholesterol", group: "Lipids", aliases: ["ldl-cholesterol", "ldl cholesterol", "ldl chol calc (nih)", "ldl chol calc", "ldl calculated", "ldl-c", "ldl direct", "ldl"], unit: "mg/dL", units: { "mmol/L": 38.67 }, range: { high: 100 }, plausible: [5, 600], note: "Common goal for adults. Personal goals vary." },
  { id: "hdl", name: "HDL cholesterol", group: "Lipids", aliases: ["hdl cholesterol", "hdl-cholesterol", "hdl-c", "hdl"], unit: "mg/dL", units: { "mmol/L": 38.67 }, range: bySex({ low: 50 }, { low: 40 }), plausible: [5, 200], note: "At least 50 for women, 40 for men" },
  { id: "triglycerides", name: "Triglycerides", group: "Lipids", aliases: ["triglycerides", "triglyceride"], unit: "mg/dL", units: { "mmol/L": 88.57 }, range: { high: 150 }, plausible: [10, 6000], urgent: { high: 1000 }, note: "Normal fasting level" },
  { id: "nonhdl", name: "Non-HDL cholesterol", group: "Lipids", aliases: ["non-hdl cholesterol", "non hdl cholesterol", "non-hdl chol"], unit: "mg/dL", units: { "mmol/L": 38.67 }, range: { high: 130 }, plausible: [10, 750], note: "Common goal for adults. Personal goals vary.", derived: true },
  { id: "apob", name: "Apolipoprotein B", group: "Lipids", aliases: ["apolipoprotein b", "apo b", "apob"], unit: "mg/dL", units: { "g/L": 100 }, range: { high: 90 }, plausible: [10, 400], note: "Common goal for adults. Personal goals vary." },
  { id: "lpa_nmol", name: "Lipoprotein(a), nmol/L", group: "Lipids", aliases: ["lipoprotein (a)", "lipoprotein(a)", "lp(a)"], unit: "nmol/L", range: { high: 125 }, plausible: [0, 900], note: "High from 125 nmol/L" },
  { id: "lpa_mg", name: "Lipoprotein(a), mg/dL", group: "Lipids", aliases: ["lipoprotein (a)", "lipoprotein(a)", "lp(a)"], unit: "mg/dL", range: { high: 50 }, plausible: [0, 400], note: "High from 50 mg/dL" },

  { id: "glucose", name: "Glucose", group: "Blood sugar", aliases: ["glucose, fasting", "fasting glucose", "glucose, serum", "glucose"], unit: "mg/dL", units: { "mmol/L": 18.02 }, range: { low: 70, high: 99 }, plausible: [15, 1200], urgent: { low: 54, high: 300 }, note: "Range is for a fasting test" },
  { id: "hba1c", name: "Hemoglobin A1c", group: "Blood sugar", aliases: ["hemoglobin a1c", "hemoglobin a1c with eag", "hba1c", "hgb a1c", "a1c"], unit: "%", range: { high: 5.6 }, plausible: [3, 20] },
  { id: "insulin", name: "Fasting insulin", group: "Blood sugar", aliases: ["insulin, fasting", "insulin"], unit: "µIU/mL", units: { "mIU/L": 1, "uU/mL": 1 }, range: { high: 25 }, plausible: [0.2, 500], note: "Fasting" },

  { id: "ferritin", name: "Ferritin", group: "Iron and blood count", aliases: ["ferritin, serum", "ferritin"], unit: "ng/mL", units: { "ug/L": 1, "µg/L": 1, "mcg/L": 1 }, range: bySex({ low: 13, high: 150 }, { low: 30, high: 400 }), plausible: [1, 20000] },
  { id: "iron", name: "Serum iron", group: "Iron and blood count", aliases: ["iron, total", "iron, serum", "serum iron", "iron"], unit: "µg/dL", units: { "mcg/dL": 1, "umol/L": 5.587, "µmol/L": 5.587 }, range: bySex({ low: 37, high: 145 }, { low: 59, high: 158 }), plausible: [2, 600] },
  { id: "tibc", name: "Iron-binding capacity", group: "Iron and blood count", aliases: ["iron bind.cap.(tibc)", "iron binding capacity", "total iron binding capacity", "tibc"], unit: "µg/dL", units: { "mcg/dL": 1, "umol/L": 5.587, "µmol/L": 5.587 }, range: bySex({ low: 149, high: 492 }, { low: 171, high: 505 }), plausible: [50, 900] },
  { id: "tsat", name: "Transferrin saturation", group: "Iron and blood count", aliases: ["transferrin saturation", "iron saturation", "% saturation", "% transferrin saturation"], unit: "%", range: bySex({ low: 15, high: 45 }, { low: 20, high: 50 }), plausible: [1, 100], derived: true },
  { id: "hgb", name: "Hemoglobin", group: "Iron and blood count", aliases: ["hemoglobin", "hgb"], unit: "g/dL", units: { "g/L": 0.1 }, range: bySex({ low: 12.1, high: 15.1 }, { low: 13.8, high: 17.2 }), plausible: [3, 25], urgent: { low: 7 } },
  { id: "hct", name: "Hematocrit", group: "Iron and blood count", aliases: ["hematocrit", "hct"], unit: "%", range: bySex({ low: 36, high: 46 }, { low: 40, high: 52 }), plausible: [10, 75] },
  { id: "mcv", name: "Red cell size (MCV)", group: "Iron and blood count", aliases: ["mcv"], unit: "fL", range: { low: 80, high: 100 }, plausible: [40, 150] },
  { id: "wbc", name: "White cells", group: "Iron and blood count", aliases: ["white blood cell count", "wbc"], unit: "x10E3/uL", units: { "thousand/ul": 1, "k/ul": 1, "10^3/ul": 1, "x10^9/l": 1 }, range: { low: 4, high: 11 }, plausible: [0.1, 300], urgent: { low: 1 } },
  { id: "plt", name: "Platelets", group: "Iron and blood count", aliases: ["platelet count", "platelets"], unit: "x10E3/uL", units: { "thousand/ul": 1, "k/ul": 1, "10^3/ul": 1, "x10^9/l": 1 }, range: { low: 150, high: 400 }, plausible: [1, 2000], urgent: { low: 30 } },

  { id: "vitd", name: "Vitamin D, 25-hydroxy", group: "Vitamins", aliases: ["vitamin d, 25-hydroxy", "vitamin d,25-oh,total,ia", "vitamin d, 25-oh, total", "25-hydroxyvitamin d", "25-oh vitamin d", "vitamin d 25-hydroxy"], unit: "ng/mL", units: { "nmol/L": 0.4006 }, range: { low: 30, high: 80 }, plausible: [2, 300], note: "Many experts recommend 30 to 80" },
  { id: "b12", name: "Vitamin B12", group: "Vitamins", aliases: ["vitamin b12", "vitamin b-12", "cobalamin", "b12"], unit: "pg/mL", units: { "ng/L": 1, "pmol/L": 1.355 }, range: { low: 299, high: 1054 }, plausible: [30, 6000] },
  { id: "folate", name: "Folate", group: "Vitamins", aliases: ["folate (folic acid), serum", "folate, serum", "folic acid", "folate"], unit: "ng/mL", units: { "nmol/L": 0.4413, "ug/L": 1 }, range: { low: 2.7, high: 17 }, plausible: [0.3, 60] },
  { id: "homocysteine", name: "Homocysteine", group: "Vitamins", aliases: ["homocyst(e)ine", "homocysteine"], unit: "µmol/L", range: { high: 15 }, plausible: [1, 400], note: "Commonly used limit" },
  { id: "mma", name: "Methylmalonic acid", group: "Vitamins", aliases: ["methylmalonic acid, serum", "methylmalonic acid"], unit: "nmol/L", units: { "umol/L": 1000, "µmol/L": 1000 }, range: { high: 378 }, plausible: [20, 20000] },
  { id: "omega3", name: "Omega-3 index", group: "Vitamins", aliases: ["omega-3 index", "omega 3 index"], unit: "%", range: { low: 8 }, plausible: [0.5, 25], note: "Level often described as desirable" },
  { id: "magnesium", name: "Magnesium", group: "Kidney and minerals", aliases: ["magnesium"], unit: "mg/dL", units: { "mmol/L": 2.431 }, range: { low: 1.7, high: 2.2 }, plausible: [0.3, 10] },

  { id: "bilirubin", name: "Total bilirubin", group: "Liver", aliases: ["bilirubin, total", "total bilirubin", "bilirubin total"], unit: "mg/dL", units: { "umol/L": 0.05847, "µmol/L": 0.05847 }, range: { low: 0.1, high: 1.2 }, plausible: [0.05, 60] },
  { id: "alt", name: "ALT", group: "Liver", aliases: ["alt (sgpt)", "alt", "alanine aminotransferase", "sgpt"], unit: "U/L", units: { "IU/L": 1 }, range: { low: 4, high: 36 }, plausible: [1, 15000], urgent: { high: 500 } },
  { id: "ast", name: "AST", group: "Liver", aliases: ["ast (sgot)", "ast", "aspartate aminotransferase", "sgot"], unit: "U/L", units: { "IU/L": 1 }, range: { low: 8, high: 33 }, plausible: [1, 15000], urgent: { high: 500 } },
  { id: "alp", name: "Alkaline phosphatase", group: "Liver", aliases: ["alkaline phosphatase", "alk phos"], unit: "U/L", units: { "IU/L": 1 }, range: { low: 20, high: 130 }, plausible: [3, 3000] },
  { id: "albumin", name: "Albumin", group: "Liver", aliases: ["albumin"], unit: "g/dL", units: { "g/L": 0.1 }, range: { low: 3.4, high: 5.4 }, plausible: [0.8, 8] },

  { id: "creatinine", name: "Creatinine", group: "Kidney and minerals", aliases: ["creatinine, serum", "creatinine"], unit: "mg/dL", units: { "umol/L": 0.01131, "µmol/L": 0.01131 }, range: bySex({ low: 0.5, high: 0.95 }, { low: 0.7, high: 1.3 }), plausible: [0.1, 30], urgent: { high: 5 } },
  { id: "egfr", name: "eGFR", group: "Kidney and minerals", aliases: ["egfr", "estimated gfr"], unit: "mL/min/1.73", units: { "ml/min/1.73m2": 1 }, range: { low: 60 }, plausible: [2, 200], urgent: { low: 15 } },
  { id: "bun", name: "Urea nitrogen (BUN)", group: "Kidney and minerals", aliases: ["urea nitrogen (bun)", "blood urea nitrogen", "bun"], unit: "mg/dL", units: { "mmol/L": 2.801 }, range: { low: 6, high: 20 }, plausible: [1, 300] },
  { id: "uric", name: "Uric acid", group: "Kidney and minerals", aliases: ["uric acid, serum", "uric acid"], unit: "mg/dL", units: { "umol/L": 0.01681, "µmol/L": 0.01681 }, range: bySex({ low: 2.4, high: 6 }, { low: 3.4, high: 7 }), plausible: [0.5, 25] },
  { id: "sodium", name: "Sodium", group: "Kidney and minerals", aliases: ["sodium"], unit: "mmol/L", units: { "mEq/L": 1 }, range: { low: 135, high: 145 }, plausible: [90, 200], urgent: { low: 125, high: 155 } },
  { id: "potassium", name: "Potassium", group: "Kidney and minerals", aliases: ["potassium"], unit: "mmol/L", units: { "mEq/L": 1 }, range: { low: 3.7, high: 5.2 }, plausible: [1, 12], urgent: { low: 2.8, high: 6 } },
  { id: "calcium", name: "Calcium", group: "Kidney and minerals", aliases: ["calcium"], unit: "mg/dL", units: { "mmol/L": 4.008 }, range: { low: 8.8, high: 10.3 }, plausible: [3, 20], urgent: { low: 7, high: 13 } },

  { id: "hscrp", name: "hs-CRP", group: "Inflammation, thyroid, immune", aliases: ["c-reactive protein, cardiac", "hs-crp", "hs crp", "high sensitivity c-reactive protein", "cardio crp"], unit: "mg/L", units: { "mg/dL": 10 }, range: { high: 3 }, plausible: [0.01, 500], note: "Above 3 is called high for heart risk" },
  { id: "tsh", name: "TSH", group: "Inflammation, thyroid, immune", aliases: ["thyroid stimulating hormone", "tsh"], unit: "µIU/mL", units: { "mIU/L": 1, "uU/mL": 1 }, range: { low: 0.4, high: 4.8 }, plausible: [0.001, 200] },
  { id: "ft4", name: "Free T4", group: "Inflammation, thyroid, immune", aliases: ["t4,free(direct)", "t4, free", "free t4"], unit: "ng/dL", units: { "pmol/L": 0.0777 }, range: { low: 0.8, high: 1.8 }, plausible: [0.05, 15] },
  { id: "ttg", name: "Celiac antibody (tTG-IgA)", group: "Inflammation, thyroid, immune", aliases: ["t-transglutaminase (ttg) iga", "tissue transglutaminase iga", "ttg iga", "ttg-iga"], unit: "U/mL", range: { high: 4 }, plausible: [0, 1000], note: "Cutoffs differ by lab" },
];

export const BIOMARKER_BY_ID = new Map(BIOMARKERS.map((b) => [b.id, b]));
export const LAB_GROUPS: LabGroup[] = ["Lipids", "Blood sugar", "Iron and blood count", "Vitamins", "Liver", "Kidney and minerals", "Inflammation, thyroid, immune"];

export const generalRange = (b: Biomarker, sex?: Sex): Range => (typeof b.range === "function" ? b.range(sex) : b.range);
