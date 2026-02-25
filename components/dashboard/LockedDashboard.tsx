"use client";

import { ALL_TRAITS } from "@/lib/traits/traitDatabase";
import { CATEGORIES } from "@/lib/traits/categories";
import TraitCardLocked from "./TraitCardLocked";
import UploadCTABanner from "./UploadCTABanner";
import * as LucideIcons from "lucide-react";

function getCategoryIcon(iconName: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as any;
  return (icons[iconName] || LucideIcons.Sparkles) as React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export default function LockedDashboard() {
  return (
    <div>
      <UploadCTABanner />

      {CATEGORIES.map((category) => {
        const traits = ALL_TRAITS.filter((t) => t.category === category.id);
        if (traits.length === 0) return null;

        const Icon = getCategoryIcon(category.icon);

        return (
          <div key={category.id} className="mb-10">
            <div className="flex items-center gap-3 mb-4 px-1">
              <Icon
                className="w-5 h-5 opacity-40"
                style={{ color: category.color } as React.CSSProperties}
              />
              <h2 className="text-xl font-bold opacity-40">{category.name}</h2>
            </div>

            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 px-1">
              {traits.map((trait) => (
                <TraitCardLocked key={trait.id} trait={trait} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
