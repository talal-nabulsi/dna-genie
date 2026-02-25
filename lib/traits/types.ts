export interface StudyReference {
  pmid: string;
  title: string;
  journal: string;
  year: number;
}

export interface VariantInterpretation {
  genotype: string;
  label: string;
  description: string;
  color: "green" | "yellow" | "red" | "blue" | "purple" | "gray";
}

export interface TraitDefinition {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  gene: string;
  rsids: string[];
  variants: VariantInterpretation[];
  description: string;
  funFact?: string;
  tips?: string[];
  studies: StudyReference[];
  disclaimer?: string;
  isCompound?: boolean;
  compoundLogic?: (snps: Map<string, string>) => VariantInterpretation | null;
}

export interface CategoryMeta {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface UserTraitResult {
  trait: TraitDefinition;
  genotype: string;
  interpretation: VariantInterpretation;
}
