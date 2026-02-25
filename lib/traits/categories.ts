import { CategoryMeta } from "./types";

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "personality",
    name: "Personality",
    icon: "Brain",
    description: "Discover your genetic personality tendencies",
    color: "#A855F7",
  },
  {
    id: "health",
    name: "Health",
    icon: "Heart",
    description: "Understand your genetic health markers",
    color: "#EF4444",
  },
  {
    id: "physical",
    name: "Physical Traits",
    icon: "Eye",
    description: "Your genetic physical characteristics",
    color: "#3B82F6",
  },
  {
    id: "nutrition",
    name: "Food & Nutrition",
    icon: "Apple",
    description: "How your genes affect diet and nutrition",
    color: "#F97316",
  },
  {
    id: "intelligence",
    name: "Intelligence",
    icon: "Lightbulb",
    description: "Cognitive traits influenced by your DNA",
    color: "#EAB308",
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    icon: "Dumbbell",
    description: "Your genetic athletic potential",
    color: "#22C55E",
  },
  {
    id: "sleep",
    name: "Sleep",
    icon: "Moon",
    description: "Sleep patterns written in your genes",
    color: "#6366F1",
  },
  {
    id: "longevity",
    name: "Longevity",
    icon: "Clock",
    description: "Genetic factors related to aging and longevity",
    color: "#14B8A6",
  },
];

export const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.id, c]));
