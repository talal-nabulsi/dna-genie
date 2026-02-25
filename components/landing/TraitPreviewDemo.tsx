"use client";

import GlassCard from "@/components/ui/GlassCard";

const demoTraits = [
  { name: "Warrior vs Worrier", gene: "COMT", label: "Warrior", color: "green" },
  { name: "Caffeine Metabolism", gene: "CYP1A2", label: "Fast Metabolizer", color: "green" },
  { name: "Eye Color", gene: "HERC2", label: "Likely Blue/Green", color: "blue" },
  { name: "Muscle Fiber Type", gene: "ACTN3", label: "Power/Sprint", color: "red" },
  { name: "Chronotype", gene: "PER2", label: "Night Owl", color: "purple" },
  { name: "Longevity Gene", gene: "FOXO3", label: "Longevity Variant", color: "green" },
  { name: "Bitter Taste", gene: "TAS2R38", label: "Super Taster", color: "purple" },
  { name: "Lactose Tolerance", gene: "MCM6", label: "Tolerant", color: "green" },
];

export default function TraitPreviewDemo() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          Discover Traits Like These
        </h2>
        <p className="text-[var(--color-muted)] text-center mb-10">
          Sample results from our 40+ trait panel
        </p>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 px-2">
          {demoTraits.map((trait) => (
            <GlassCard
              key={trait.name}
              hoverable
              className="min-w-[220px] max-w-[220px] flex-shrink-0"
            >
              <p className="text-xs text-[var(--color-muted)] mb-1 font-mono">
                {trait.gene}
              </p>
              <h3 className="text-sm font-semibold mb-3 leading-snug">
                {trait.name}
              </h3>
              <span
                className={`badge-${trait.color} text-xs px-3 py-1 rounded-full inline-block`}
              >
                {trait.label}
              </span>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
