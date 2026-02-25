"use client";

import { useUserSNPs } from "@/lib/hooks/useUserSNPs";
import { useTraitResults } from "@/lib/hooks/useTraitResults";
import TraitCategoryRow from "@/components/dashboard/TraitCategoryRow";
import LockedDashboard from "@/components/dashboard/LockedDashboard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const { snps, loading } = useUserSNPs();
  const { sortedCategories } = useTraitResults(snps);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const hasData = snps && snps.size > 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Your Genetic Traits</h1>
        <p className="text-[var(--color-muted)]">
          {hasData
            ? `${sortedCategories.reduce((sum, c) => sum + c.results.length, 0)} traits discovered from your DNA`
            : "Upload your DNA file to unlock your traits"}
        </p>
      </div>

      {hasData ? (
        sortedCategories.map(({ category, results }) => (
          <TraitCategoryRow
            key={category.id}
            category={category}
            results={results}
          />
        ))
      ) : (
        <LockedDashboard />
      )}
    </div>
  );
}
