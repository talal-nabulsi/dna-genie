"use client";

import { UserTraitResult } from "@/lib/traits/types";
import { CATEGORY_MAP } from "@/lib/traits/categories";
import GenotypeResult from "./GenotypeResult";
import ActionableTips from "./ActionableTips";
import StudyCitations from "./StudyCitations";
import DisclaimerBanner from "@/components/ui/DisclaimerBanner";
import { ArrowLeft, Lightbulb } from "lucide-react";
import Link from "next/link";

interface TraitDetailViewProps {
  result: UserTraitResult;
}

export default function TraitDetailView({ result }: TraitDetailViewProps) {
  const { trait, genotype, interpretation } = result;
  const category = CATEGORY_MAP.get(trait.category);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        {category && (
          <span
            className="text-xs font-medium px-3 py-1 rounded-full inline-block mb-3"
            style={{
              background: `${category.color}15`,
              color: category.color,
              border: `1px solid ${category.color}30`,
            }}
          >
            {category.name}
          </span>
        )}
        <h1 className="text-3xl font-bold mb-1">{trait.name}</h1>
        <p className="text-[var(--color-muted)]">{trait.subtitle}</p>
        <p className="text-xs text-[var(--color-muted)] mt-1 font-mono">
          Gene: {trait.gene} | SNP{trait.rsids.length > 1 ? "s" : ""}: {trait.rsids.join(", ")}
        </p>
      </div>

      {/* Genotype result */}
      <GenotypeResult genotype={genotype} interpretation={interpretation} />

      {/* Description */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-3">About This Trait</h3>
        <p className="text-sm text-[var(--color-foreground)]/80 leading-relaxed">
          {trait.description}
        </p>

        {trait.funFact && (
          <div className="flex items-start gap-3 mt-4 p-3 rounded-lg bg-[var(--color-neon)]/5 border border-[var(--color-neon)]/10">
            <Lightbulb className="w-4 h-4 text-[var(--color-neon)] shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--color-foreground)]/70 leading-relaxed">
              <strong className="text-[var(--color-neon)]">Fun fact:</strong> {trait.funFact}
            </p>
          </div>
        )}
      </div>

      {/* Actionable Tips */}
      {trait.tips && trait.tips.length > 0 && <ActionableTips tips={trait.tips} />}

      {/* Disclaimer */}
      {trait.disclaimer && <DisclaimerBanner text={trait.disclaimer} />}

      {/* Studies */}
      <StudyCitations studies={trait.studies} />
    </div>
  );
}
