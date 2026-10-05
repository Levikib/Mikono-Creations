"use client";
// Save for later (strategy/16 section 1.4). Device only, 30 days after the last change, 20 items at most.
import { useSyncExternalStore } from "react";
import { KEYS, RETENTION } from "./storageKeys";
import type { CartLine } from "./cart";

export type SavedItem = CartLine & { savedAt: number };
interface Stored { v: 1; updatedAt: number; items: SavedItem[] }

const MAX_ITEMS = 20;
const EMPTY: SavedItem[] = [];
let items: SavedItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

const valid = (x: unknown): x is SavedItem => {
  const l = x as SavedItem;
  return !!l && typeof l.sku === "string" && l.sku !== "" && typeof l.slug === "string" && typeof l.name === "string"
    && typeof l.size === "string" && typeof l.colourKey === "string" && typeof l.colourLabel === "string" && Number.isFinite(l.qty);
};

function load(): SavedItem[] {
  try {
    const raw = window.localStorage.getItem(KEYS.saved);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw) as Stored;
    if (p?.v !== 1 || !Array.isArray(p.items) || typeof p.updatedAt !== "number") throw new Error("shape");
    if (Date.now() - p.updatedAt > RETENTION.savedDays * 86400000) { window.localStorage.removeItem(KEYS.saved); return EMPTY; }
    return p.items.filter(valid).slice(0, MAX_ITEMS);
  } catch {
    try { window.localStorage.removeItem(KEYS.saved); } catch { /* ignore */ }
    return EMPTY;
  }
}

function write(next: SavedItem[]) {
  items = next;
  try {
    if (next.length === 0) window.localStorage.removeItem(KEYS.saved);
    else window.localStorage.setItem(KEYS.saved, JSON.stringify({ v: 1, updatedAt: Date.now(), items: next } satisfies Stored));
  } catch { /* storage blocked: kept for this page only */ }
  listeners.forEach((l) => l());
}

const snapshot = (): SavedItem[] => {
  if (!loaded) { loaded = true; items = load(); }
  return items;
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === KEYS.saved || e.key === null) { loaded = false; cb(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
};

export function useSaved(): SavedItem[] {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}
export const readSaved = (): SavedItem[] => snapshot();

/** Adds (or merges by sku). Returns false when the list is full. */
export function addSaved(line: CartLine): boolean {
  const cur = snapshot();
  const i = cur.findIndex((s) => s.sku === line.sku);
  if (i >= 0) {
    const next = cur.slice();
    next[i] = { ...next[i], qty: Math.min(20, next[i].qty + line.qty), savedAt: Date.now() };
    write(next);
    return true;
  }
  if (cur.length >= MAX_ITEMS) return false;
  write([...cur, { ...line, savedAt: Date.now() }]);
  return true;
}
export function removeSaved(sku: string) { write(snapshot().filter((s) => s.sku !== sku)); }
export function resetSaved() { loaded = true; items = EMPTY; listeners.forEach((l) => l()); }
