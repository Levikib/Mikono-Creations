"use client";
// Cart store (D5, D13). Persisted in localStorage under mk.cart.v1. The server snapshot is always
// empty, so the first client render matches the server and the real cart appears right after hydration.
// Stage 1 additions: a note per line, edit size or colour (lines with the same sku merge), save for later, add many.
import { applyTier, FX_EVENT } from "@/components/fx/engine/tier";
import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { ASK_COLOUR_KEY, ASK_COLOUR_LABEL, MAX_LINES, MAX_QTY_PER_LINE } from "./site";
import { showToast } from "./toast";
import { track } from "./track";
import { trackItem, trackItems } from "./trackCart";
import { CLEARABLE_KEYS, KEYS, RETENTION } from "./storageKeys";
import { addSaved, removeSaved, resetSaved } from "./saved";
import { clearAllDeviceMemory } from "./memory";
import { sizeWord } from "./sizes";

export const CART_KEY = KEYS.cart;
const CORRUPT_KEY = KEYS.cartCorrupt;
export { MAX_LINES };
export const NOTE_MAX = 120;
const EXPIRY_MS = RETENTION.cartDays * 24 * 3600 * 1000;

/** "Grey Elephant", or just "Shark" when the colour is confirmed on WhatsApp. */
export const lineName = (l: { colourKey: string; colourLabel: string; name: string }) =>
  l.colourKey === ASK_COLOUR_KEY ? l.name : `${l.colourLabel} ${l.name}`;

/** Colour text for a cart line. Lines saved before the wording changed are normalised by key. */
export const lineColour = (l: { colourKey: string; colourLabel: string }) =>
  l.colourKey === ASK_COLOUR_KEY ? ASK_COLOUR_LABEL : l.colourLabel;

/** {slug}-{colourKey}-{size}, lower case (D4, D5). */
export const lineSku = (slug: string, colourKey: string, size: string) => `${slug}-${colourKey}-${size}`.toLowerCase();

/** Removes control characters and caps the length. Used for the per line note. */
export const cleanNote = (s: string) => s.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s{2,}/g, " ").trimStart().slice(0, NOTE_MAX);

/** Removes every saved detail this site keeps on the device, except the cookie choice. */
export function clearSavedDetails() {
  try {
    for (const k of CLEARABLE_KEYS) window.localStorage.removeItem(k);
    window.sessionStorage.clear();
  } catch { /* storage blocked */ }
  clearAllDeviceMemory();
  // The Animals switch and the Find the herd list were removed with the rest; bring the page back to the automatic tier.
  applyTier();
  window.dispatchEvent(new Event(FX_EVENT));
  window.dispatchEvent(new Event("mk:found-reset"));
  state = EMPTY;
  loaded = true;
  resetSaved();
  listeners.forEach((l) => l());
  showToast("Saved details on this device were cleared.", "success");
}

export interface CartLine {
  sku: string; slug: string; name: string; colourKey: string; colourLabel: string;
  size: string; image: string; qty: number;
  /** Colour wishes and the like. No child details (the form says so). */
  note?: string;
  /** Category label for analytics, such as "Safari animals". */
  category?: string;
}
export type AddInput = Omit<CartLine, "qty"> & { qty?: number };
interface Stored { v: 1; updatedAt: number; lines: CartLine[] }
interface State { lines: CartLine[]; notice: "" | "corrupt" | "memory" }

const EMPTY: State = { lines: [], notice: "" };
let state: State = EMPTY;
let loaded = false;
let memoryOnly = false;
const listeners = new Set<() => void>();

const clampQty = (n: number) => Math.max(1, Math.min(MAX_QTY_PER_LINE, Math.floor(Number.isFinite(n) ? n : 1)));

function validLine(l: unknown): l is CartLine {
  const x = l as CartLine;
  return !!x && typeof x.sku === "string" && x.sku !== "" && typeof x.name === "string" && typeof x.slug === "string"
    && typeof x.size === "string" && typeof x.colourKey === "string" && typeof x.colourLabel === "string"
    && typeof x.image === "string" && Number.isFinite(x.qty);
}

function load(): State {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CART_KEY);
  } catch {
    memoryOnly = true;
    return { lines: [], notice: "memory" };
  }
  if (!raw) return EMPTY;
  try {
    const p = JSON.parse(raw) as Stored;
    if (p?.v !== 1 || !Array.isArray(p.lines) || typeof p.updatedAt !== "number") throw new Error("shape");
    if (Date.now() - p.updatedAt > EXPIRY_MS) {
      window.localStorage.removeItem(CART_KEY);
      return EMPTY;
    }
    const lines = p.lines.filter(validLine).slice(0, MAX_LINES).map((l) => ({
      ...l, qty: clampQty(l.qty), note: typeof l.note === "string" && l.note ? cleanNote(l.note) : undefined,
    }));
    return lines.length ? { lines, notice: "" } : EMPTY;
  } catch {
    try {
      window.localStorage.setItem(CORRUPT_KEY, raw);
      window.localStorage.removeItem(CART_KEY);
    } catch { /* ignore */ }
    return { lines: [], notice: "corrupt" };
  }
}

function persist() {
  if (memoryOnly) return;
  try {
    if (state.lines.length === 0) window.localStorage.removeItem(CART_KEY);
    else window.localStorage.setItem(CART_KEY, JSON.stringify({ v: 1, updatedAt: Date.now(), lines: state.lines } satisfies Stored));
  } catch {
    memoryOnly = true;
    state = { ...state, notice: "memory" };
  }
}

function set(lines: CartLine[]) {
  state = { lines, notice: state.notice };
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_KEY || e.key === null) {
      loaded = false;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): State {
  if (!loaded) {
    loaded = true;
    state = load();
  }
  return state;
}
const getServerSnapshot = () => EMPTY;
const noop = () => () => {};

/** False during server render and hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

export interface LinePatch { size?: string; colourKey?: string; colourLabel?: string; image?: string }
export interface AddManyResult { added: number; merged: number; skipped: number }

interface Ctx {
  lines: CartLine[];
  count: number;
  hydrated: boolean;
  notice: State["notice"];
  addLine: (l: AddInput, opts?: { listName?: string }) => void;
  /** Adds several lines at once (shared list, reorder). Merges by sku, never removes anything. One toast is the caller's job. */
  addMany: (l: AddInput[]) => AddManyResult;
  removeLine: (sku: string) => void;
  setQty: (sku: string, qty: number) => void;
  setNote: (sku: string, note: string) => void;
  /** Changes colour or size. If the new sku already exists the two lines merge. Returns the final sku. */
  updateLine: (sku: string, patch: LinePatch) => { sku: string; merged: boolean };
  saveForLater: (sku: string) => void;
  moveToCart: (item: CartLine) => void;
  clear: () => void;
  lastRemoved: CartLine | null;
  undoRemove: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}
const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useHydrated();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastRemoved, setLastRemoved] = useState<CartLine | null>(null);

  const addLine = useCallback((input: AddInput, opts?: { listName?: string }) => {
    const cur = getSnapshot().lines;
    const qty = clampQty(input.qty ?? 1);
    const i = cur.findIndex((l) => l.sku === input.sku);
    const label = `${lineName(input)}, ${sizeWord(input.size)}`;
    if (i === -1 && cur.length >= MAX_LINES) {
      showToast("Your order list is full. For a big order, please use the wholesale request.", "info");
      return;
    }
    if (i >= 0) {
      const next = cur.slice();
      const total = next[i].qty + qty;
      next[i] = { ...next[i], qty: Math.min(MAX_QTY_PER_LINE, total) };
      set(next);
      showToast(total > MAX_QTY_PER_LINE
        ? `You already have the most we can add of ${label}. For more, please use the wholesale request.`
        : `Added: ${label}. You now have ${next[i].qty}.`, total > MAX_QTY_PER_LINE ? "info" : "success");
    } else {
      const { qty: _q, ...rest } = input;
      void _q;
      set([...cur, { ...rest, qty }]);
      showToast(`Added to your order list: ${label}`, "success");
    }
    track("add_to_cart", { items: [trackItem({ ...input, qty })], item_count: qty, ...(opts?.listName ? { list_name: opts.listName } : {}) });
  }, []);

  const addMany = useCallback((inputs: AddInput[]): AddManyResult => {
    let cur = getSnapshot().lines.slice();
    const res: AddManyResult = { added: 0, merged: 0, skipped: 0 };
    const tracked: Array<AddInput & { qty: number }> = [];
    for (const input of inputs) {
      const qty = clampQty(input.qty ?? 1);
      const i = cur.findIndex((l) => l.sku === input.sku);
      if (i >= 0) {
        cur[i] = { ...cur[i], qty: Math.min(MAX_QTY_PER_LINE, cur[i].qty + qty) };
        res.merged += 1;
      } else if (cur.length >= MAX_LINES) {
        res.skipped += 1;
        continue;
      } else {
        const { qty: _q, ...rest } = input;
        void _q;
        cur = [...cur, { ...rest, qty }];
        res.added += 1;
      }
      tracked.push({ ...input, qty });
    }
    if (res.added || res.merged) set(cur);
    if (tracked.length) track("add_to_cart", { items: trackItems(tracked), item_count: tracked.reduce((n, l) => n + l.qty, 0) });
    return res;
  }, []);

  const removeLine = useCallback((sku: string) => {
    const cur = getSnapshot().lines;
    const gone = cur.find((l) => l.sku === sku);
    if (!gone) return;
    set(cur.filter((l) => l.sku !== sku));
    setLastRemoved(gone);
    track("remove_from_cart", { items: [trackItem(gone)], item_count: gone.qty });
  }, []);

  const setQty = useCallback((sku: string, qty: number) => {
    const cur = getSnapshot().lines;
    set(cur.map((l) => (l.sku === sku ? { ...l, qty: clampQty(qty) } : l)));
    track("update_line", { item_id: sku, field: "qty" });
  }, []);

  const setNote = useCallback((sku: string, note: string) => {
    const cur = getSnapshot().lines;
    const n = cleanNote(note).trim();
    set(cur.map((l) => (l.sku === sku ? { ...l, note: n || undefined } : l)));
    track("update_line", { item_id: sku, field: "note" });
  }, []);

  const updateLine = useCallback((sku: string, patch: LinePatch) => {
    const cur = getSnapshot().lines;
    const i = cur.findIndex((l) => l.sku === sku);
    if (i < 0) return { sku, merged: false };
    const before = cur[i];
    const edited: CartLine = { ...before, ...patch };
    const nextSku = lineSku(edited.slug, edited.colourKey, edited.size);
    edited.sku = nextSku;
    const fields = [patch.size && patch.size !== before.size ? "size" : "", patch.colourKey && patch.colourKey !== before.colourKey ? "colour" : ""].filter(Boolean);
    if (nextSku === sku) { set(cur.map((l, k) => (k === i ? edited : l))); return { sku, merged: false }; }
    const j = cur.findIndex((l, k) => k !== i && l.sku === nextSku);
    let next: CartLine[];
    let merged = false;
    if (j >= 0) {
      merged = true;
      next = cur
        .map((l, k) => (k === j ? { ...l, qty: clampQty(l.qty + before.qty), note: l.note || before.note } : l))
        .filter((_, k) => k !== i);
      showToast("Merged with the same animal in your order list.", "info");
    } else {
      next = cur.map((l, k) => (k === i ? edited : l));
    }
    set(next);
    for (const f of fields) track("update_line", { item_id: nextSku, field: f });
    return { sku: nextSku, merged };
  }, []);

  const saveForLater = useCallback((sku: string) => {
    const cur = getSnapshot().lines;
    const line = cur.find((l) => l.sku === sku);
    if (!line) return;
    if (!addSaved(line)) { showToast("Saved for later is full. Remove one first.", "info"); return; }
    set(cur.filter((l) => l.sku !== sku));
    showToast(`Saved for later: ${lineName(line)}, ${sizeWord(line.size)}`, "success");
    track("save_for_later", { items: [trackItem(line)], item_count: line.qty });
  }, []);

  const moveToCart = useCallback((item: CartLine) => {
    const { qty, ...rest } = item;
    const cur = getSnapshot().lines;
    if (!cur.some((l) => l.sku === item.sku) && cur.length >= MAX_LINES) { showToast("Your order list is full.", "info"); return; }
    const i = cur.findIndex((l) => l.sku === item.sku);
    if (i >= 0) set(cur.map((l, k) => (k === i ? { ...l, qty: clampQty(l.qty + qty) } : l)));
    else set([...cur, { ...rest, qty: clampQty(qty) }]);
    removeSaved(item.sku);
    track("move_to_cart", { items: [trackItem(item)], item_count: qty });
  }, []);

  const clear = useCallback(() => { set([]); setLastRemoved(null); }, []);

  const undoRemove = useCallback(() => {
    if (lastRemoved && !getSnapshot().lines.some((l) => l.sku === lastRemoved.sku)) set([...getSnapshot().lines, lastRemoved]);
    setLastRemoved(null);
  }, [lastRemoved]);

  const value = useMemo<Ctx>(() => ({
    lines: snap.lines,
    count: snap.lines.reduce((n, l) => n + l.qty, 0),
    hydrated, notice: snap.notice,
    addLine, addMany, removeLine, setQty, setNote, updateLine, saveForLater, moveToCart, clear, lastRemoved, undoRemove,
    drawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
  }), [snap, hydrated, addLine, addMany, removeLine, setQty, setNote, updateLine, saveForLater, moveToCart, clear, lastRemoved, undoRemove, drawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): Ctx {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
