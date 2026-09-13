"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CategoryIcon from "@/components/ui/CategoryIcon";
import Reveal from "@/components/ui/Reveal";
import { CATEGORIES } from "@/lib/traits/categories";
import { ALL_TRAITS } from "@/lib/traits/traitDatabase";

export default function TraitGallery() {
  return (
    <section id="traits" className="py-24 sm:py-32 px-5 sm:px-8 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <Reveal className="max-w-2xl mb-14">
          <p className="eyebrow mb-3">The panel</p>
          <h2 className="text-3xl sm:text-5xl font-semibold">40 traits, 8 categories, every one cited.</h2>
          <p className="mt-4 text-[var(--color-muted)] text-lg">
            No polygenic scores or black-box risk numbers — just well-studied single variants with plain-language interpretations.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((c, i) => {
            const traits = ALL_TRAITS.filter((t) => t.category === c.id);
            const wide = i === 0 || i === 3;
            return (
              <Reveal key={c.id} delay={(i % 4) * 0.06} className={wide ? "lg:col-span-2" : ""}>
                <Link
                  href={`/demo?next=${encodeURIComponent(`/dashboard?category=${c.id}`)}`}
                  className="glass-card is-interactive p-6 h-full flex flex-col group"
                  style={{ ["--cat" as string]: c.color }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center border" style={{ background: `${c.color}14`, borderColor: `${c.color}33` }}>
                      <CategoryIcon name={c.icon} className="w-5 h-5" style={{ color: c.color }} />
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[var(--color-muted)] group-hover:text-[var(--color-foreground)] transition-colors">
                      {traits.length} traits <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{c.name}</h3>
                  <p className="text-sm text-[var(--color-muted)] mt-1 mb-5">{c.description}</p>
                  <ul className="mt-auto flex flex-wrap gap-1.5">
                    {traits.slice(0, wide ? 6 : 3).map((t) => (
                      <li key={t.id} className="pill !py-1 !text-[11px]">
                        <span className="font-mono opacity-70">{t.gene}</span> {t.name}
                      </li>
                    ))}
                    {traits.length > (wide ? 6 : 3) && (
                      <li className="pill !py-1 !text-[11px] opacity-70">+{traits.length - (wide ? 6 : 3)} more</li>
                    )}
                  </ul>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
