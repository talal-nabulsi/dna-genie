"use client";

import { useParams } from "next/navigation";
import { useUserSNPs } from "@/lib/hooks/useUserSNPs";
import { useTraitResults } from "@/lib/hooks/useTraitResults";
import { TRAIT_BY_ID } from "@/lib/traits/traitDatabase";
import TraitDetailView from "@/components/traits/TraitDetailView";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TraitDetailPage() {
  const params = useParams();
  const traitId = params.traitId as string;
  const { snps, loading } = useUserSNPs();
  const { results } = useTraitResults(snps);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const trait = TRAIT_BY_ID.get(traitId);
  if (!trait) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Trait Not Found</h1>
        <p className="text-[var(--color-muted)] mb-6">
          The trait &ldquo;{traitId}&rdquo; doesn&apos;t exist in our database.
        </p>
        <Link
          href="/dashboard"
          className="text-[var(--color-neon)] hover:underline flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const result = results.find((r) => r.trait.id === traitId);
  if (!result) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold mb-4">{trait.name}</h1>
        <p className="text-[var(--color-muted)] mb-6">
          No data available for this trait. Upload your DNA file to see your results.
        </p>
        <Link
          href="/upload"
          className="text-[var(--color-neon)] hover:underline"
        >
          Upload DNA File
        </Link>
      </div>
    );
  }

  return <TraitDetailView result={result} />;
}
