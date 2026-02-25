"use client";

import { CategoryMeta, UserTraitResult } from "@/lib/traits/types";
import TraitCard from "./TraitCard";
import * as LucideIcons from "lucide-react";

interface TraitCategoryRowProps {
  category: CategoryMeta;
  results: UserTraitResult[];
}

function getCategoryIcon(iconName: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as any;
  return (icons[iconName] || LucideIcons.Sparkles) as React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export default function TraitCategoryRow({ category, results }: TraitCategoryRowProps) {
  const Icon = getCategoryIcon(category.icon);

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4 px-1">
        <Icon
          className="w-5 h-5"
          style={{ color: category.color } as React.CSSProperties}
        />
        <h2 className="text-xl font-bold">{category.name}</h2>
        <span className="text-sm text-[var(--color-muted)]">
          {results.length} trait{results.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 px-1">
        {results.map((result) => (
          <TraitCard key={result.trait.id} result={result} />
        ))}
      </div>
    </div>
  );
}
