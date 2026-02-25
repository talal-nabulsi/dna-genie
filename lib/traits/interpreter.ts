import { TraitDefinition, UserTraitResult, VariantInterpretation } from "./types";
import { ALL_TRAITS, RSID_TO_TRAITS } from "./traitDatabase";

function normalizeGenotype(genotype: string): string {
  const g = genotype.toUpperCase().replace(/\s/g, "");
  if (g.length === 2) {
    return g.split("").sort().join("");
  }
  return g;
}

function matchGenotype(
  variant: VariantInterpretation,
  userGenotype: string
): boolean {
  const normalizedUser = normalizeGenotype(userGenotype);
  const normalizedVariant = normalizeGenotype(variant.genotype);
  return normalizedUser === normalizedVariant;
}

function interpretSingleTrait(
  trait: TraitDefinition,
  userSNPs: Map<string, string>
): UserTraitResult | null {
  // Compound traits use custom logic
  if (trait.isCompound && trait.compoundLogic) {
    const result = trait.compoundLogic(userSNPs);
    if (!result) return null;
    return { trait, genotype: result.genotype, interpretation: result };
  }

  // Simple single-SNP traits
  const rsid = trait.rsids[0];
  const userGenotype = userSNPs.get(rsid);
  if (!userGenotype || userGenotype === "--" || userGenotype === "00") return null;

  for (const variant of trait.variants) {
    if (matchGenotype(variant, userGenotype)) {
      return { trait, genotype: userGenotype, interpretation: variant };
    }
  }

  // If no exact match, return unknown
  return {
    trait,
    genotype: userGenotype,
    interpretation: {
      genotype: userGenotype,
      label: "Uncommon Variant",
      description: `Your genotype (${userGenotype}) is not in our current database for this trait. This may be a rare variant.`,
      color: "gray",
    },
  };
}

export function interpretAllTraits(
  userSNPs: Map<string, string>
): UserTraitResult[] {
  const results: UserTraitResult[] = [];
  const processedTraits = new Set<string>();

  for (const trait of ALL_TRAITS) {
    if (processedTraits.has(trait.id)) continue;

    // Check if user has at least one relevant SNP for this trait
    const hasRelevantSNP = trait.rsids.some(
      (rsid) => userSNPs.has(rsid) && userSNPs.get(rsid) !== "--"
    );
    if (!hasRelevantSNP) continue;

    const result = interpretSingleTrait(trait, userSNPs);
    if (result) {
      results.push(result);
      processedTraits.add(trait.id);
    }
  }

  return results;
}

export function groupResultsByCategory(
  results: UserTraitResult[]
): Map<string, UserTraitResult[]> {
  const grouped = new Map<string, UserTraitResult[]>();
  for (const result of results) {
    const category = result.trait.category;
    const existing = grouped.get(category) || [];
    existing.push(result);
    grouped.set(category, existing);
  }
  return grouped;
}
