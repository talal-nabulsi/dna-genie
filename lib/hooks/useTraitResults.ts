"use client";

import { useMemo } from "react";
import { UserTraitResult } from "@/lib/traits/types";
import { interpretAllTraits, groupResultsByCategory } from "@/lib/traits/interpreter";
import { CATEGORIES } from "@/lib/traits/categories";

export function useTraitResults(snps: Map<string, string> | null) {
  const results = useMemo(() => {
    if (!snps || snps.size === 0) return [];
    return interpretAllTraits(snps);
  }, [snps]);

  const grouped = useMemo(() => {
    if (results.length === 0) return new Map<string, UserTraitResult[]>();
    return groupResultsByCategory(results);
  }, [results]);

  const sortedCategories = useMemo(() => {
    return CATEGORIES.filter((cat) => grouped.has(cat.id)).map((cat) => ({
      category: cat,
      results: grouped.get(cat.id) || [],
    }));
  }, [grouped]);

  return { results, grouped, sortedCategories };
}
