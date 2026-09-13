"use client";

/**
 * Tiny external store for demo-mode state, backed by sessionStorage.
 * Kept outside React so components can subscribe with useSyncExternalStore
 * (no setState-in-effect, hydration-safe: the server snapshot is always "not demo").
 */

const DEMO_KEY = "dnagenie:demo";
const LOCAL_GENOME_KEY = "dnagenie:local-genome";

export interface LocalGenome {
  entries: [string, string][];
  format: string;
}

export interface DemoState {
  ready: boolean;
  isDemo: boolean;
  local: LocalGenome | null;
}

const SERVER_STATE: DemoState = { ready: false, isDemo: false, local: null };

let state: DemoState | null = null;
const listeners = new Set<() => void>();

function readSession<T>(key: string, fallback: T): T {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeSession(key: string, value: unknown | null) {
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — state still lives in memory for this page */
  }
}

function load(): DemoState {
  if (!state) {
    state = {
      ready: true,
      isDemo: readSession<boolean>(DEMO_KEY, false),
      local: readSession<LocalGenome | null>(LOCAL_GENOME_KEY, null),
    };
  }
  return state;
}

function emit() {
  listeners.forEach((l) => l());
}

export function getSnapshot(): DemoState {
  return typeof window === "undefined" ? SERVER_STATE : load();
}

export function getServerSnapshot(): DemoState {
  return SERVER_STATE;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function enterDemo() {
  state = { ...load(), isDemo: true };
  writeSession(DEMO_KEY, true);
  emit();
}

export function exitDemo() {
  state = { ...load(), isDemo: false, local: null };
  writeSession(DEMO_KEY, null);
  writeSession(LOCAL_GENOME_KEY, null);
  emit();
}

export function setLocalGenome(snps: Map<string, string>, format: string) {
  const local: LocalGenome = { entries: [...snps.entries()], format };
  state = { ...load(), local };
  writeSession(LOCAL_GENOME_KEY, local);
  emit();
}

export function clearLocalGenome() {
  state = { ...load(), local: null };
  writeSession(LOCAL_GENOME_KEY, null);
  emit();
}
