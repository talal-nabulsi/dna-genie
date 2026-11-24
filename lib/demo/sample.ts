import type { LabPanel } from "@/lib/labs/panel";

/** Invented for the sample report. It belongs to no one. */
export const SAMPLE_GENOME: [string, string][] = [
  ["rs429358", "TT"], ["rs7412", "CC"], ["rs646776", "TT"], ["rs11591147", "GG"], ["rs10455872", "AG"], ["rs662799", "AA"],
  ["rs7903146", "CT"], ["rs1260326", "CT"], ["rs1800562", "AG"], ["rs1799945", "CG"],
  ["rs1801133", "AA"], ["rs1801131", "TT"], ["rs601338", "AG"], ["rs2282679", "GT"], ["rs174547", "CT"], ["rs33972313", "CC"],
  ["rs887829", "TT"], ["rs2231142", "GT"], ["rs1205", "CT"],
  ["rs4988235", "AG"], ["rs762551", "AC"], ["rs671", "GG"], ["rs2187668", "CT"],
  ["rs713598", "CG"], ["rs1726866", "AG"], ["rs10246939", "CT"], ["rs72921001", "CC"],
  ["rs12913832", "AG"], ["rs1805007", "CC"], ["rs3827760", "AA"], ["rs17822931", "CC"], ["rs1815739", "CT"],
  ["rs73598374", "CT"], ["rs4680", "AG"], ["rs6265", "CC"], ["rs2802292", "GT"], ["rs9536314", "TT"], ["rs2736100", "AC"],
];

export const SAMPLE_PANEL: LabPanel = {
  date: "2026-10-06",
  sex: "male",
  sample: true,
  values: [
    { id: "chol", value: 212 }, { id: "ldl", value: 131 }, { id: "hdl", value: 52 }, { id: "triglycerides", value: 118 },
    { id: "glucose", value: 94 }, { id: "hba1c", value: 5.8 },
    { id: "ferritin", value: 318 }, { id: "iron", value: 164 }, { id: "tibc", value: 296 }, { id: "hgb", value: 15.1 }, { id: "mcv", value: 91 }, { id: "plt", value: 241 },
    { id: "vitd", value: 24 }, { id: "b12", value: 512 }, { id: "folate", value: 9.4 }, { id: "homocysteine", value: 11.2 },
    { id: "bilirubin", value: 1.7 }, { id: "alt", value: 24 }, { id: "ast", value: 21 }, { id: "alp", value: 68 }, { id: "albumin", value: 4.5 },
    { id: "creatinine", value: 0.98 }, { id: "egfr", value: 92 }, { id: "uric", value: 7.4 }, { id: "sodium", value: 140 }, { id: "potassium", value: 4.3 }, { id: "calcium", value: 9.5 },
    { id: "hscrp", value: 0.8 }, { id: "tsh", value: 1.9 },
  ],
};
