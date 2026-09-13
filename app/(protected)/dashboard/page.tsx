"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { useUserSNPs } from "@/lib/hooks/useUserSNPs";
import { useTraitResults } from "@/lib/hooks/useTraitResults";
import TraitCard from "@/components/dashboard/TraitCard";
import LockedDashboard from "@/components/dashboard/LockedDashboard";
import DemoBanner from "@/components/dashboard/DemoBanner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CategoryIcon from "@/components/ui/CategoryIcon";

function DashboardSkeleton() {
  return (
    <div>
      <div className="h-8 w-56 skeleton rounded-lg mb-3" />
      <div className="h-4 w-80 skeleton rounded mb-10" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-44 skeleton rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const { isDemo } = useDemo();
  const { snps, loading } = useUserSNPs();
  const { results, sortedCategories } = useTraitResults(snps);
  const params = useSearchParams();
  const router = useRouter();
  const reduced = useReducedMotion();

  // The URL is the source of truth for the active category so deep links and back/forward work.
  const category = params.get("category");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return results.filter(
      (r) =>
        (!category || r.trait.category === category) &&
        (!q || r.trait.name.toLowerCase().includes(q) || r.trait.gene.toLowerCase().includes(q) || r.interpretation.label.toLowerCase().includes(q))
    );
  }, [results, category, query]);

  if (loading) return <DashboardSkeleton />;

  const hasData = !!snps && snps.size > 0;

  if (!hasData) {
    return (
      <div>
        <div className="mb-8">
          <p className="eyebrow mb-2">Dashboard</p>
          <h1 className="text-3xl sm:text-4xl font-semibold">Your genetic traits</h1>
        </div>
        <LockedDashboard />
      </div>
    );
  }

  const selectCategory = (id: string | null) => {
    router.replace(id ? `/dashboard?category=${id}` : "/dashboard", { scroll: false });
  };

  return (
    <div>
      {isDemo && !user && <DemoBanner />}
      <DashboardHeader results={results} categoryCount={sortedCategories.length} />

      {/* Filter bar */}
      <div className="sticky top-14 sm:top-14 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-6 glass-nav border-y">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar flex-1 -mx-1 px-1">
            <button
              onClick={() => selectCategory(null)}
              className={`pill shrink-0 ${!category ? "!border-[rgba(143,124,255,0.5)] !text-[var(--color-foreground)] !bg-[rgba(143,124,255,0.08)]" : "hover:text-[var(--color-foreground)]"}`}
            >
              All <span className="tabular-nums opacity-70">{results.length}</span>
            </button>
            {sortedCategories.map(({ category: c, results: r }) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => selectCategory(active ? null : c.id)}
                  className={`pill shrink-0 ${active ? "!text-[var(--color-foreground)]" : "hover:text-[var(--color-foreground)]"}`}
                  style={active ? { borderColor: `${c.color}80`, background: `${c.color}1a` } : undefined}
                >
                  <CategoryIcon name={c.icon} className="w-3.5 h-3.5" style={{ color: c.color }} />
                  {c.name} <span className="tabular-nums opacity-70">{r.length}</span>
                </button>
              );
            })}
          </div>
          <label className="relative md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search traits or genes"
              className="input !py-2 !pl-9 !pr-8 !text-sm"
              aria-label="Search traits"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-foreground)]" aria-label="Clear search">
                <X className="w-4 h-4" />
              </button>
            )}
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-[var(--color-muted)]">No traits match “{query}”.</div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((r) => (
              <motion.div
                key={r.trait.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <TraitCard result={r} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
