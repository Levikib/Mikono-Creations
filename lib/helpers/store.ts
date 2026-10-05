"use client";
// Small device-only store under mk.helpers.v1. Each tool keeps its own value with a timestamp and expires after 24 hours.
// Nothing here is ever sent anywhere. The server snapshot is always the fallback, so hydration matches.
import { useCallback, useSyncExternalStore } from "react";
import { HELPER_STORE_KEY, HELPER_TTL_HOURS } from "@/data/helpers";

type Blob = { v: 1; tools: Record<string, { t: number; d: unknown }> };
const TTL = HELPER_TTL_HOURS * 3600 * 1000;
const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; value: unknown }>();
let memory: Blob | null = null;

function readBlob(): Blob {
  if (memory) return memory;
  try {
    const raw = window.localStorage.getItem(HELPER_STORE_KEY);
    if (!raw) return { v: 1, tools: {} };
    const p = JSON.parse(raw) as Blob;
    if (p?.v === 1 && p.tools && typeof p.tools === "object") return p;
  } catch { /* blocked or corrupt: start empty */ }
  return { v: 1, tools: {} };
}

function writeBlob(b: Blob) {
  try {
    const keep = Object.keys(b.tools).length > 0;
    if (keep) window.localStorage.setItem(HELPER_STORE_KEY, JSON.stringify(b));
    else window.localStorage.removeItem(HELPER_STORE_KEY);
    memory = null;
  } catch {
    memory = b;
  }
}

function notify() { listeners.forEach((l) => l()); }

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === HELPER_STORE_KEY || e.key === null) cb(); };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
}

/** Returns a stable object for an unchanged stored string, so useSyncExternalStore does not loop. */
function snapshot<T>(tool: string, fallback: T, valid: (x: unknown) => x is T): T {
  let raw: string | null = null;
  if (memory) raw = JSON.stringify(memory.tools[tool] ?? null);
  else {
    try { raw = window.localStorage.getItem(HELPER_STORE_KEY); } catch { raw = null; }
  }
  const hit = cache.get(tool);
  if (hit && hit.raw === raw) return hit.value as T;
  const entry = readBlob().tools[tool];
  const value = entry && Date.now() - entry.t <= TTL && valid(entry.d) ? entry.d : fallback;
  cache.set(tool, { raw, value });
  return value;
}

export function usePersisted<T>(tool: string, fallback: T, valid: (x: unknown) => x is T): [T, (next: T | null) => void] {
  const value = useSyncExternalStore(subscribe, () => snapshot(tool, fallback, valid), () => fallback);
  const set = useCallback((next: T | null) => {
    const b = readBlob();
    if (next === null) delete b.tools[tool];
    else b.tools[tool] = { t: Date.now(), d: next };
    writeBlob(b);
    cache.delete(tool);
    notify();
  }, [tool]);
  return [value, set];
}

/** One-off read for effects, for example restoring a family into the URL hash. */
export function readPersisted<T>(tool: string, valid: (x: unknown) => x is T): T | null {
  const e = readBlob().tools[tool];
  return e && Date.now() - e.t <= TTL && valid(e.d) ? e.d : null;
}

export function writePersisted<T>(tool: string, value: T | null) {
  const b = readBlob();
  if (value === null) delete b.tools[tool];
  else b.tools[tool] = { t: Date.now(), d: value };
  writeBlob(b);
  cache.delete(tool);
}
