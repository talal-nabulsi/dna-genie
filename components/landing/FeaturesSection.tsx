"use client";

import { Shield, Dna, BookOpen, Zap } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const features = [
  {
    icon: Shield,
    title: "100% Client-Side",
    description:
      "Your DNA file is parsed entirely in your browser. The raw file never leaves your device.",
  },
  {
    icon: Dna,
    title: "No Raw DNA Stored",
    description:
      "Only ~150 trait-relevant SNPs are saved — out of 600,000+ in your file. That's 0.025%.",
  },
  {
    icon: BookOpen,
    title: "Research-Backed",
    description:
      "Every trait links to published studies with PubMed IDs. No pseudoscience.",
  },
  {
    icon: Zap,
    title: "40+ Traits",
    description:
      "Personality, health, nutrition, sports, sleep, longevity and more — all from your DNA.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Why <span className="neon-gradient-text">DNA Genie</span>?
        </h2>
        <p className="text-[var(--color-muted)] text-center mb-16 max-w-lg mx-auto">
          Privacy-first genetic trait discovery backed by real science.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <GlassCard key={feature.title} hoverable={false} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-neon)]/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[var(--color-neon)]" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
