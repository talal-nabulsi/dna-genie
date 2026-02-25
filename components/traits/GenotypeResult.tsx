"use client";

import { VariantInterpretation } from "@/lib/traits/types";

interface GenotypeResultProps {
  genotype: string;
  interpretation: VariantInterpretation;
}

export default function GenotypeResult({ genotype, interpretation }: GenotypeResultProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-[var(--color-muted)] mb-1">Your Genotype</p>
          <p className="text-3xl font-mono font-bold text-glow tracking-wider">
            {genotype}
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end">
          <span
            className={`badge-${interpretation.color} text-sm px-4 py-2 rounded-full font-semibold mb-2`}
          >
            {interpretation.label}
          </span>
        </div>
      </div>

      <p className="text-sm text-[var(--color-foreground)]/80 mt-4 leading-relaxed">
        {interpretation.description}
      </p>
    </div>
  );
}
