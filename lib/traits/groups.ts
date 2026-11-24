import type { Group } from "./types";

export const GROUPS: Group[] = [
  { id: "lipids", name: "Heart and lipids", blurb: "Markers that shift cholesterol, triglycerides and lipoprotein(a)." },
  { id: "glucose", name: "Blood sugar", blurb: "Markers that shift insulin release and glucose." },
  { id: "iron", name: "Iron", blurb: "Markers that change how much iron the body takes in." },
  { id: "vitamins", name: "Vitamins and fats", blurb: "Markers that shift vitamin levels and fatty acid conversion." },
  { id: "organs", name: "Liver, kidney, inflammation", blurb: "Markers that move bilirubin, uric acid and CRP." },
  { id: "food", name: "Food and drink", blurb: "Milk, caffeine, alcohol, gluten and bitter taste." },
  { id: "body", name: "Body", blurb: "Eyes, hair, skin, earwax and muscle." },
  { id: "mind", name: "Sleep and mind", blurb: "Small effects, still being studied." },
  { id: "aging", name: "Aging research", blurb: "Research findings with no use in care today." },
];

export const GROUP_BY_ID = new Map(GROUPS.map((g) => [g.id, g]));
