"use client";

import type { LabPanel } from "@/lib/labs/panel";
import type { DNAFormat } from "@/lib/dna/parse";

/** What this tab holds. Backed by sessionStorage, so it goes when the tab closes. */
export interface SessionState {
  ready: boolean;
  demo: boolean;
  genome: { entries: [string, string][]; format: DNAFormat } | null;
  labs: LabPanel | null;
  /** Sensitive results the person chose to open. */
  opened: string[];
}

const KEY = "dnagenie:session:2";
const EMPTY: SessionState = { ready: true, demo: false, genome: null, labs: null, opened: [] };
const SERVER: SessionState = { ...EMPTY, ready: false };

let state: SessionState | null = null;
const listeners = new Set<() => void>();

function load(): SessionState {
  if (!state) {
    try { state = { ...EMPTY, ...JSON.parse(window.sessionStorage.getItem(KEY) ?? "{}"), ready: true }; }
    catch { state = EMPTY; }
  }
  return state!;
}

export function update(patch: Partial<SessionState>) {
  state = { ...load(), ...patch };
  try { window.sessionStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode: memory only */ }
  listeners.forEach((l) => l());
}

export function clearSession() {
  state = EMPTY;
  try { window.sessionStorage.removeItem(KEY); } catch { /* nothing stored */ }
  listeners.forEach((l) => l());
}

export const getSnapshot = () => (typeof window === "undefined" ? SERVER : load());
export const getServerSnapshot = () => SERVER;
export function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; }
