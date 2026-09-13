"use client";

import dynamic from "next/dynamic";
import Reveal from "@/components/ui/Reveal";

const GenomeExplorer = dynamic(() => import("@/components/three/GenomeExplorer"), {
  ssr: false,
  loading: () => <div className="glass-card h-[560px] skeleton opacity-40" />,
});

export default function ExploreSection() {
  return (
    <section id="explore" className="py-24 sm:py-32 px-5 sm:px-8 scroll-mt-16 relative">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(143,124,255,0.07),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <Reveal className="max-w-2xl mb-10">
          <p className="eyebrow mb-3">Interactive</p>
          <h2 className="text-3xl sm:text-5xl font-semibold">Walk the helix.</h2>
          <p className="mt-4 text-[var(--color-muted)] text-lg">
            Every marker on this strand is a real SNP the app reads from your file. Orbit around it, filter by category, and fly into any trait to see what it can tell you.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <GenomeExplorer compact />
        </Reveal>
      </div>
    </section>
  );
}
