"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const FAQS = [
  {
    q: "Which files are supported?",
    a: "Raw data exports from 23andMe (.txt) and AncestryDNA (.txt or .csv). The parser auto-detects the format from the header, normalises strand orientation where needed, and reads genotypes as unordered allele pairs.",
  },
  {
    q: "Is this medical advice?",
    a: "No. DNA Genie reports associations from published studies for single common variants. It is not a diagnostic tool, and results for health-related traits like MTHFR or APOE should be discussed with a clinician before acting on them.",
  },
  {
    q: "What exactly gets stored?",
    a: "In demo mode: nothing beyond your browser's session storage. With an account: the 44 trait-relevant genotypes (for example, rs4680 → GG) plus a timestamp and the file format. Never the raw file, never other markers.",
  },
  {
    q: "Why only 40 traits?",
    a: "Each trait in the panel is a single well-replicated variant with a clear interpretation. Polygenic risk scores and ancestry inference need far more markers and a very different evidence standard, so they were deliberately left out.",
  },
  {
    q: "Can I read the code?",
    a: "Yes — the entire app is open source on GitHub, including the trait database with its PubMed citations, the streaming parser, and the Firestore security rules.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <section id="faq" className="py-24 sm:py-32 px-5 sm:px-8 scroll-mt-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-20">
        <Reveal>
          <p className="eyebrow mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-5xl font-bold">Straight answers.</h2>
          <p className="mt-4 text-[var(--color-muted)] text-lg">Genetics is easy to overstate. Here&apos;s where the lines are.</p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="divide-y divide-[var(--color-glass-border)] border-y border-[var(--color-glass-border)]">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-5 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-base sm:text-lg group-hover:text-[var(--color-neon)] transition-colors">{f.q}</span>
                    <Plus className={`w-5 h-5 shrink-0 text-[var(--color-muted)] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-[var(--color-muted)] leading-relaxed max-w-prose">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
