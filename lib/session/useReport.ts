"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getBloodPanel, getUserSNPs } from "@/lib/firebase/firestore";
import { SAMPLE_GENOME, SAMPLE_PANEL } from "@/lib/demo/sample";
import { readAll } from "@/lib/traits/interpret";
import { judge, type LabPanel } from "@/lib/labs/panel";
import { buildInsights, missingTests, unpaired } from "@/lib/insights/pairs";
import * as store from "./store";

export const useSession = () => useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

type Remote = { uid: string; snps: Map<string, string> | null; labs: LabPanel | null; error?: string };

/** One place that decides which DNA and which blood panel the screens show. */
export function useReport() {
  const { user, loading: authLoading } = useAuth();
  const session = useSession();
  const [remote, setRemote] = useState<Remote | null>(null);
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!user) return;
    let stop = false;
    Promise.all([getUserSNPs(user.uid), getBloodPanel(user.uid)])
      .then(([snps, labs]) => { if (!stop) setRemote({ uid: user.uid, snps, labs }); })
      .catch(() => { if (!stop) setRemote({ uid: user.uid, snps: null, labs: null, error: "Your saved data could not be loaded. Check your connection and reload." }); });
    return () => { stop = true; };
  }, [user, tick]);

  const saved = user && remote?.uid === user.uid ? remote : null;
  const loading = authLoading || !session.ready || (!!user && !saved);

  const sample = !user && session.demo && !session.genome;
  const snps = useMemo(() => {
    if (session.genome) return new Map(session.genome.entries);
    if (saved?.snps?.size) return saved.snps;
    return sample ? new Map(SAMPLE_GENOME) : null;
  }, [session.genome, saved, sample]);

  const labs = session.labs ?? saved?.labs ?? (sample ? SAMPLE_PANEL : null);

  const results = useMemo(() => (snps ? readAll(snps) : []), [snps]);
  const judged = useMemo(() => (labs ? judge(labs) : []), [labs]);
  // A result the person has not opened must not leak out through a pair.
  const shown = useMemo(() => results.filter((r) => !r.trait.sensitive || session.opened.includes(r.trait.id)), [results, session.opened]);
  const insights = useMemo(() => buildInsights(shown, judged), [shown, judged]);
  const loose = useMemo(() => unpaired(judged, insights), [judged, insights]);
  const missing = useMemo(() => missingTests(results, judged), [results, judged]);

  return {
    loading, user, error: saved?.error, sample, snps, labs, results, judged, insights, loose, missing, refresh,
    labsSaved: !!saved?.labs, dnaSaved: !!saved?.snps?.size, opened: session.opened,
    signedOutAndEmpty: !loading && !user && !session.demo && !session.genome && !session.labs,
  };
}

export type Report = ReturnType<typeof useReport>;
