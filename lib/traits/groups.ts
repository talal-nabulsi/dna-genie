import type { Group } from "./types";

export const GROUPS: Group[] = [
  { id: "lipids", name: "Heart and lipids", blurb: "Cholesterol, triglycerides and lipoprotein(a)." },
  { id: "glucose", name: "Blood sugar", blurb: "Insulin release and glucose." },
  { id: "iron", name: "Iron", blurb: "Iron absorption." },
  { id: "vitamins", name: "Vitamins and fats", blurb: "Vitamin levels and fatty acid conversion." },
  { id: "organs", name: "Liver, kidney, inflammation", blurb: "Bilirubin, uric acid and CRP." },
  { id: "food", name: "Food and drink", blurb: "Milk, caffeine, alcohol, gluten and bitter taste." },
  { id: "body", name: "Body", blurb: "Eyes, hair, skin, earwax and muscle." },
  { id: "mind", name: "Sleep and mind", blurb: "Small effects, under study." },
  { id: "aging", name: "Aging research", blurb: "Research findings. Not used in medical care." },
];

export const GROUP_BY_ID = new Map(GROUPS.map((g) => [g.id, g]));
