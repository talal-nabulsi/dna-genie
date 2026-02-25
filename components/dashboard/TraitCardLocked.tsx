"use client";

import { TraitDefinition } from "@/lib/traits/types";
import GlassCard from "@/components/ui/GlassCard";
import { Lock } from "lucide-react";

interface TraitCardLockedProps {
  trait: TraitDefinition;
}

export default function TraitCardLocked({ trait }: TraitCardLockedProps) {
  return (
    <GlassCard
      hoverable={false}
      className="min-w-[240px] max-w-[240px] h-[280px] flex flex-col justify-between flex-shrink-0 trait-card-locked"
    >
      <div>
        <p className="text-xs text-[var(--color-muted)] mb-1 font-mono tracking-wide">
          {trait.gene}
        </p>
        <h3 className="text-base font-semibold mb-1 leading-snug">
          {trait.name}
        </h3>
        <p className="text-xs text-[var(--color-muted)] leading-relaxed line-clamp-3 mb-3">
          {trait.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Lock className="w-3.5 h-3.5 text-[var(--color-muted)]" />
        <span className="text-xs text-[var(--color-muted)]">Upload DNA to unlock</span>
      </div>
    </GlassCard>
  );
}
