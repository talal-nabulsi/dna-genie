"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Lightbulb, Orbit, ExternalLink } from "lucide-react";
import { UserTraitResult } from "@/lib/traits/types";
import { CATEGORY_MAP } from "@/lib/traits/categories";
import { ALL_TRAITS } from "@/lib/traits/traitDatabase";
import GenotypeResult from "./GenotypeResult";
import VariantTable from "./VariantTable";
import ActionableTips from "./ActionableTips";
import StudyCitations from "./StudyCitations";
import DisclaimerBanner from "@/components/ui/DisclaimerBanner";
import CategoryIcon from "@/components/ui/CategoryIcon";

export default function TraitDetailView({ result }: { result: UserTraitResult }) {
  const { trait, genotype, interpretation } = result;
  const category = CATEGORY_MAP.get(trait.category);

  const siblings = ALL_TRAITS.filter((t) => t.category === trait.category);
  const idx = siblings.findIndex((t) => t.id === trait.id);
  const prev = siblings[(idx - 1 + siblings.length) % siblings.length];
  const next = siblings[(idx + 1) % siblings.length];

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <header className="mb-8">
        {category && (
          <span className="pill mb-4" style={{ borderColor: `${category.color}55`, color: category.color, background: `${category.color}12` }}>
            <CategoryIcon name={category.icon} className="w-3.5 h-3.5" /> {category.name}
          </span>
        )}
        <h1 className="text-3xl sm:text-5xl font-semibold">{trait.name}</h1>
        <p className="text-lg text-[var(--color-muted)] mt-2">{trait.subtitle}</p>
      </header>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="space-y-6 min-w-0">
          <GenotypeResult genotype={genotype} interpretation={interpretation} />

          <div className="glass-card p-6">
            <h3 className="font-semibold mb-3">About this trait</h3>
            <p className="text-[15px] text-[var(--color-foreground)]/80 leading-relaxed">{trait.description}</p>
            {trait.funFact && (
              <div className="flex items-start gap-3 mt-5 p-4 rounded-xl bg-[rgba(143,124,255,0.05)] border border-[rgba(143,124,255,0.12)]">
                <Lightbulb className="w-4 h-4 text-[var(--color-neon)] shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--color-foreground)]/75 leading-relaxed">
                  <strong className="text-[var(--color-neon)] font-semibold">Fun fact.</strong> {trait.funFact}
                </p>
              </div>
            )}
          </div>

          <VariantTable variants={trait.variants} current={interpretation} />
          {trait.tips && trait.tips.length > 0 && <ActionableTips tips={trait.tips} />}
          {trait.disclaimer && <DisclaimerBanner text={trait.disclaimer} />}
          <StudyCitations studies={trait.studies} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20">
          <div className="glass-card p-5">
            <p className="eyebrow !text-[10px] mb-3">Markers read</p>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-[var(--color-muted)] text-xs mb-0.5">Gene</dt>
                <dd className="font-mono">{trait.gene}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)] text-xs mb-1">SNP{trait.rsids.length > 1 ? "s" : ""}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {trait.rsids.map((rs) => (
                    <a
                      key={rs}
                      href={`https://www.ncbi.nlm.nih.gov/snp/${rs}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill !font-mono hover:text-[var(--color-foreground)] hover:border-[var(--color-glass-hover)]"
                      title="Open in dbSNP"
                    >
                      {rs} <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
            <Link href={`/explore?trait=${trait.id}`} className="btn-neon-outline w-full !text-sm mt-5">
              <Orbit className="w-4 h-4" /> Locate on the helix
            </Link>
          </div>

          {category && siblings.length > 1 && (
            <div className="glass-card p-5">
              <p className="eyebrow !text-[10px] mb-3">More in {category.name}</p>
              <div className="flex flex-col gap-1.5">
                <Link href={`/traits/${prev.id}`} className="btn-ghost justify-start !text-sm !px-2">
                  <ArrowLeft className="w-4 h-4 shrink-0" /> <span className="truncate">{prev.name}</span>
                </Link>
                <Link href={`/traits/${next.id}`} className="btn-ghost justify-start !text-sm !px-2">
                  <ArrowRight className="w-4 h-4 shrink-0" /> <span className="truncate">{next.name}</span>
                </Link>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
