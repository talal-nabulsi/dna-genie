"use client";

import { TraitDefinition } from "@/lib/traits/types";
import { CATEGORY_MAP } from "@/lib/traits/categories";
import { Lock } from "lucide-react";

export default function TraitCardLocked({ trait }: { trait: TraitDefinition }) {
  const category = CATEGORY_MAP.get(trait.category);
  return (
    <div className="glass-card p-5 flex flex-col h-full trait-card-locked">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-mono text-[11px] tracking-wide text-[var(--color-muted)] mb-1">{trait.gene}</p>
          <h3 className="font-semibold leading-snug">{trait.name}</h3>
        </div>
        <span className="w-2 h-2 mt-1.5 rounded-full shrink-0" style={{ background: category?.color }} />
      </div>
      <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-2">{trait.subtitle}</p>
      <span className="mt-auto pt-4 flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
        <Lock className="w-3.5 h-3.5" /> Upload DNA to unlock
      </span>
    </div>
  );
}
