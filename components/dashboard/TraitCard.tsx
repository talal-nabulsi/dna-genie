"use client";

import { UserTraitResult } from "@/lib/traits/types";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";

interface TraitCardProps {
  result: UserTraitResult;
}

export default function TraitCard({ result }: TraitCardProps) {
  const router = useRouter();
  const { trait, interpretation } = result;

  return (
    <GlassCard
      onClick={() => router.push(`/traits/${trait.id}`)}
      className="min-w-[240px] max-w-[240px] h-[280px] flex flex-col justify-between flex-shrink-0"
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

      <div>
        <span
          className={`badge-${interpretation.color} text-xs px-3 py-1.5 rounded-full inline-block font-medium`}
        >
          {interpretation.label}
        </span>
      </div>
    </GlassCard>
  );
}
