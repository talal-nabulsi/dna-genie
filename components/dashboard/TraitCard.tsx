"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { UserTraitResult } from "@/lib/traits/types";
import { CATEGORY_MAP } from "@/lib/traits/categories";

interface TraitCardProps {
  result: UserTraitResult;
}

export default function TraitCard({ result }: TraitCardProps) {
  const { trait, interpretation, genotype } = result;
  const category = CATEGORY_MAP.get(trait.category);
  const shortGenotype = genotype.length <= 4 ? genotype : null;

  return (
    <Link
      href={`/traits/${trait.id}`}
      className="glass-card is-interactive p-5 flex flex-col h-full group focus-visible:outline-none"
      style={{ ["--cat" as string]: category?.color ?? "#8f7cff" }}
    >
      <span className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-[var(--cat)] to-transparent opacity-70" />
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-wide text-[var(--color-muted)] mb-1">
            {trait.gene}
            {shortGenotype && <span className="text-[var(--color-foreground)]/70"> · {shortGenotype}</span>}
          </p>
          <h3 className="font-semibold leading-snug">{trait.name}</h3>
        </div>
        <span className="w-2 h-2 mt-1.5 rounded-full shrink-0" style={{ background: category?.color }} title={category?.name} />
      </div>
      <span className={`badge-${interpretation.color} self-start text-xs px-2.5 py-1 rounded-full font-medium mb-3`}>
        {interpretation.label}
      </span>
      <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-2">{interpretation.description}</p>
      <span className="mt-auto pt-4 flex items-center gap-1 text-xs text-[var(--color-muted)] group-hover:text-[var(--color-foreground)] transition-colors">
        View details <ArrowUpRight className="w-3.5 h-3.5" />
      </span>
    </Link>
  );
}
