import { CategoryMeta } from "./types";

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "personality",
    name: "Personality",
    icon: "Brain",
    description: "Discover your genetic personality tendencies",
    color: "#8F7CFF",
  },
  {
    id: "health",
    name: "Health",
    icon: "Heart",
    description: "Understand your genetic health markers",
    color: "#D896C8",
  },
  {
    id: "physical",
    name: "Physical Traits",
    icon: "Eye",
    description: "Your genetic physical characteristics",
    color: "#5E6AD2",
  },
  {
    id: "nutrition",
    name: "Food & Nutrition",
    icon: "Apple",
    description: "How your genes affect diet and nutrition",
    color: "#E8B48C",
  },
  {
    id: "intelligence",
    name: "Intelligence",
    icon: "Lightbulb",
    description: "Cognitive traits influenced by your DNA",
    color: "#E5D08A",
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    icon: "Dumbbell",
    description: "Your genetic athletic potential",
    color: "#7FD1B9",
  },
  {
    id: "sleep",
    name: "Sleep",
    icon: "Moon",
    description: "Sleep patterns written in your genes",
    color: "#A5B4FC",
  },
  {
    id: "longevity",
    name: "Longevity",
    icon: "Clock",
    description: "Genetic factors related to aging and longevity",
    color: "#7CC5E6",
  },
];

export const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.id, c]));
