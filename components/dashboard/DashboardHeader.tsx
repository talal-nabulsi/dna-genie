"use client";

import { UserTraitResult } from "@/lib/traits/types";

const ORDER: UserTraitResult["interpretation"]["color"][] = ["green", "blue", "purple", "yellow", "red", "gray"];
const LABEL: Record<string, string> = {
  green: "Favorable",
  blue: "Typical",
  purple: "Distinctive",
  yellow: "Worth a look",
  red: "Flagged",
  gray: "Uncommon",
};

/** Title, counts, and a segmented bar summarising the result mix. */
export default function DashboardHeader({ results, categoryCount }: { results: UserTraitResult[]; categoryCount: number }) {
  const counts = ORDER.map((c) => ({ color: c, n: results.filter((r) => r.interpretation.color === c).length })).filter((x) => x.n > 0);
  const total = results.length || 1;

  return (
    <div className="mb-8 grid lg:grid-cols-[1fr_auto] gap-6 lg:items-end">
      <div>
        <p className="eyebrow mb-2">Dashboard</p>
        <h1 className="text-3xl sm:text-4xl font-semibold">Your genetic traits</h1>
        <p className="text-[var(--color-muted)] mt-2">
          <span className="text-[var(--color-foreground)] font-medium tabular-nums">{results.length}</span> traits interpreted across{" "}
          <span className="text-[var(--color-foreground)] font-semibold tabular-nums">{categoryCount}</span> categories.
        </p>
      </div>
      <div className="lg:w-[380px]">
        <div className="flex h-2 rounded-full overflow-hidden bg-white/5">
          {counts.map((c) => (
            <span key={c.color} className={`dot-${c.color} h-full`} style={{ width: `${(c.n / total) * 100}%` }} />
          ))}
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
          {counts.map((c) => (
            <li key={c.color} className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
              <span className={`w-2 h-2 rounded-full dot-${c.color}`} />
              {LABEL[c.color]} <span className="tabular-nums text-[var(--color-foreground)]/80">{c.n}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
