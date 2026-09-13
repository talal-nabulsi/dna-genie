"use client";

import { ALL_TRAITS } from "@/lib/traits/traitDatabase";
import { CATEGORIES } from "@/lib/traits/categories";
import TraitCardLocked from "./TraitCardLocked";
import UploadCTABanner from "./UploadCTABanner";
import CategoryIcon from "@/components/ui/CategoryIcon";

export default function LockedDashboard() {
  return (
    <div>
      <UploadCTABanner />
      {CATEGORIES.map((category) => {
        const traits = ALL_TRAITS.filter((t) => t.category === category.id);
        if (traits.length === 0) return null;
        return (
          <section key={category.id} className="mb-10">
            <div className="flex items-center gap-2.5 mb-4 opacity-50">
              <CategoryIcon name={category.icon} className="w-4 h-4" style={{ color: category.color }} />
              <h2 className="font-semibold">{category.name}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {traits.map((trait) => (
                <TraitCardLocked key={trait.id} trait={trait} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
