"use client";

import { VariantInterpretation } from "@/lib/traits/types";

interface GenotypeResultProps {
  genotype: string;
  interpretation: VariantInterpretation;
}

const BASES = new Set(["A", "T", "G", "C"]);

/** Big genotype readout: letter tiles for simple calls, monospace text for compound haplotypes. */
export default function GenotypeResult({ genotype, interpretation }: GenotypeResultProps) {
  const simple = genotype.length <= 2 && [...genotype].every((b) => BASES.has(b));

  return (
    <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[radial-gradient(circle,rgba(57,255,20,0.12),transparent_60%)]" />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
        <div>
          <p className="eyebrow !text-[10px] mb-3">Your genotype</p>
          {simple ? (
            <div className="flex items-center gap-2">
              {[...genotype].map((b, i) => (
                <span key={i} className="base-tile" data-base={b}>{b}</span>
              ))}
            </div>
          ) : (
            <p className="font-mono text-lg sm:text-xl font-semibold text-glow leading-snug break-words">{genotype}</p>
          )}
        </div>
        <div className="sm:ml-auto sm:text-right">
          <span className={`badge-${interpretation.color} inline-block text-sm px-4 py-2 rounded-full font-semibold`}>
            {interpretation.label}
          </span>
        </div>
      </div>
      <p className="relative text-[15px] text-[var(--color-foreground)]/85 mt-6 leading-relaxed">{interpretation.description}</p>
    </div>
  );
}
