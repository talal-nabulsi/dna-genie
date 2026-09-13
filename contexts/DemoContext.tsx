"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, ReactNode } from "react";
import { getSampleGenome } from "@/lib/demo/sampleGenome";
import * as store from "@/lib/demo/demoStore";

interface DemoContextType {
  /** True when the visitor is browsing with the sample genome (no account). */
  isDemo: boolean;
  /** True once client state has been read from sessionStorage. */
  ready: boolean;
  /** SNPs to use while in demo mode: a locally-parsed file if present, else the sample genome. */
  demoSNPs: Map<string, string>;
  usingLocalFile: boolean;
  localFormat: string | null;
  enterDemo: () => void;
  exitDemo: () => void;
  setLocalGenome: (snps: Map<string, string>, format: string) => void;
  clearLocalGenome: () => void;
}

const DemoContext = createContext<DemoContextType | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  const demoSNPs = useMemo(
    () => (snapshot.local ? new Map(snapshot.local.entries) : getSampleGenome()),
    [snapshot.local]
  );

  const value = useMemo<DemoContextType>(
    () => ({
      isDemo: snapshot.isDemo,
      ready: snapshot.ready,
      demoSNPs,
      usingLocalFile: !!snapshot.local,
      localFormat: snapshot.local?.format ?? null,
      enterDemo: store.enterDemo,
      exitDemo: store.exitDemo,
      setLocalGenome: store.setLocalGenome,
      clearLocalGenome: store.clearLocalGenome,
    }),
    [snapshot, demoSNPs]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within a DemoProvider");
  return ctx;
}
