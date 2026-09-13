"use client";

import { VariantInterpretation } from "@/lib/traits/types";

/** Every interpretation the trait can produce, with the visitor's own row highlighted. */
export default function VariantTable({ variants, current }: { variants: VariantInterpretation[]; current: VariantInterpretation }) {
  if (variants.length === 0) return null;
  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold mb-1">All possible results</h3>
      <p className="text-sm text-[var(--color-muted)] mb-4">How each genotype at this marker is interpreted.</p>
      <ul className="divide-y divide-[var(--color-glass-border)]">
        {variants.map((v) => {
          const mine = v.genotype === current.genotype && v.label === current.label;
          return (
            <li key={v.genotype} className={`flex items-start gap-4 py-3 -mx-3 px-3 rounded-lg ${mine ? "bg-[rgba(143,124,255,0.06)]" : ""}`}>
              <span className="font-mono text-sm w-10 shrink-0 pt-0.5">{v.genotype}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full dot-${v.color}`} />
                  <span className="text-sm font-medium">{v.label}</span>
                  {mine && <span className="pill !py-0.5 !text-[10px] !border-[rgba(143,124,255,0.4)] text-[var(--color-neon)]">You</span>}
                </div>
                <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">{v.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
