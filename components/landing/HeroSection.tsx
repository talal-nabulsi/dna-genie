"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Upload } from "lucide-react";
import { BASE_COLORS } from "@/components/three/helix";

const HeroHelix = dynamic(() => import("@/components/three/HeroHelix"), {
  ssr: false,
  loading: () => <div className="w-full h-full rounded-[28px] skeleton opacity-40" />,
});

const STATS = [
  { value: "40", label: "traits explained" },
  { value: "44", label: "SNPs read from your file" },
  { value: "0 B", label: "of raw DNA uploaded" },
];

export default function HeroSection() {
  const reduced = useReducedMotion();
  const item = (i: number) => ({
    initial: reduced ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-5 sm:px-8 overflow-hidden noise">
      <div className="absolute inset-0 surface-grid" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(143,124,255,0.14),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-8 items-center">
        <div className="max-w-xl">
          <motion.div {...item(0)}>
            <span className="pill mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-neon)] shadow-[0_0_8px_var(--color-neon)]" />
              Open source · 40 research-backed traits
            </span>
          </motion.div>

          <motion.h1 {...item(1)} className="text-[2.75rem] leading-[1.04] sm:text-6xl lg:text-[4.25rem] font-semibold tracking-tight">
            Your genome,{" "}
            <span className="neon-gradient-text">decoded</span> in the browser.
          </motion.h1>

          <motion.p {...item(2)} className="mt-6 text-lg text-[var(--color-muted)] leading-relaxed max-w-lg">
            Drop in a 23andMe or AncestryDNA export. DNA Genie scans 600,000+ markers locally,
            keeps only the 44 that matter, and explains what they mean — with the studies to back it up.
          </motion.p>

          <motion.div {...item(3)} className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link href="/demo" className="btn-neon !text-base !py-3.5 !px-6">
              Explore the demo genome <ArrowRight className="w-[18px] h-[18px]" />
            </Link>
            <Link href="/auth" className="btn-neon-outline !text-base !py-3.5 !px-6">
              <Upload className="w-[18px] h-[18px]" /> Upload your DNA
            </Link>
          </motion.div>

          <motion.dl {...item(4)} className="mt-12 grid grid-cols-3 gap-4 max-w-md">
            {STATS.map((s) => (
              <div key={s.label} className="border-l border-[var(--color-glass-border)] pl-4">
                <dt className="text-3xl sm:text-4xl font-light tracking-tight tabular-nums">{s.value}</dt>
                <dd className="text-xs text-[var(--color-muted)] mt-1 leading-snug">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[420px] sm:h-[520px] lg:h-[600px]"
        >
          <div className="absolute inset-0 rounded-[28px] border border-[var(--color-glass-border)] bg-[radial-gradient(ellipse_at_50%_45%,rgba(143,124,255,0.12),rgba(10,10,20,0)_65%)] overflow-hidden">
            <HeroHelix className="absolute inset-0" />
          </div>

          <div className="absolute top-4 left-4 pill !bg-[rgba(10,10,20,0.7)] backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-neon)] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-neon)]" />
            </span>
            Live · drag to spin, hover a base pair
          </div>

          <ul className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--color-muted)]">
            {(Object.keys(BASE_COLORS) as (keyof typeof BASE_COLORS)[]).map((b) => (
              <li key={b} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: BASE_COLORS[b] }} />
                <span className="font-mono text-[var(--color-foreground)]/80">{b}</span>
                {{ A: "adenine", T: "thymine", G: "guanine", C: "cytosine" }[b]}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
