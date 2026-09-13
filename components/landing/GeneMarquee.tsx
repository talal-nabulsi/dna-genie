import { ALL_TRAITS } from "@/lib/traits/traitDatabase";

/** Scrolling strip of every gene in the panel — a quiet proof-of-breadth under the hero. */
export default function GeneMarquee() {
  const genes = Array.from(new Set(ALL_TRAITS.map((t) => t.gene)));
  const row = [...genes, ...genes];
  return (
    <div className="relative border-y border-[var(--color-glass-border)] py-4 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--color-background)] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--color-background)] to-transparent z-10" />
      <div className="flex w-max animate-marquee gap-10 font-mono text-sm text-[var(--color-muted)]">
        {row.map((g, i) => (
          <span key={`${g}-${i}`} className="flex items-center gap-10">
            {g}
            <span className="w-1 h-1 rounded-full bg-[var(--color-neon)]/50" />
          </span>
        ))}
      </div>
    </div>
  );
}
