"use client";
// Delivery estimate state shared by the cart and the order form: mk.delivery.v1, device only, 30 days.
// An estimate only. Fees come from data/deliveryAreas.ts and stay "confirmed on WhatsApp" while they are null.
import { useSyncExternalStore } from "react";
import { findArea, OTHER_AREA } from "@/data/deliveryAreas";
import { leadTimeDays, zonesConfirmed } from "@/data/facts";
import { pickupPoints } from "@/data/pickupPoints";
import { KEYS, RETENTION } from "./storageKeys";
import { onClearMemory } from "./memory";

export type Fulfilment = "" | "pickup" | "nairobi" | "town";
export interface DeliveryChoice { fulfilment: Fulfilment; area: string; areaOther: string; county: string; town: string }
/** The three choices the cart estimate understands. A courier or bus service counts as another town, someone else collecting counts as pickup, anything else has no estimate. */
export const estimateFulfilment = (f: string): Fulfilment => (f === "pickup" || f === "collect" ? "pickup" : f === "nairobi" ? "nairobi" : f === "town" || f === "courier" ? "town" : "");
export const EMPTY_DELIVERY: DeliveryChoice = { fulfilment: "", area: "", areaOther: "", county: "", town: "" };

let current: DeliveryChoice = EMPTY_DELIVERY;
let loaded = false;
const listeners = new Set<() => void>();

const str = (x: unknown) => (typeof x === "string" ? x.slice(0, 80) : "");

function load(): DeliveryChoice {
  try {
    const raw = window.localStorage.getItem(KEYS.delivery);
    if (!raw) return EMPTY_DELIVERY;
    const p = JSON.parse(raw) as { v?: number; at?: number } & Partial<DeliveryChoice>;
    if (p?.v !== 1 || typeof p.at !== "number" || Date.now() - p.at > RETENTION.deliveryDays * 86400000) { window.localStorage.removeItem(KEYS.delivery); return EMPTY_DELIVERY; }
    const f = p.fulfilment;
    return { fulfilment: f === "pickup" || f === "nairobi" || f === "town" ? f : "", area: str(p.area), areaOther: str(p.areaOther), county: str(p.county), town: str(p.town) };
  } catch { return EMPTY_DELIVERY; }
}
const snapshot = () => { if (!loaded) { loaded = true; current = load(); } return current; };
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === KEYS.delivery || e.key === null) { loaded = false; cb(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
};

export const useDelivery = (): DeliveryChoice => useSyncExternalStore(subscribe, snapshot, () => EMPTY_DELIVERY);
export const readDelivery = (): DeliveryChoice => snapshot();

export function writeDelivery(next: DeliveryChoice) {
  current = next;
  loaded = true;
  try {
    if (!next.fulfilment) window.localStorage.removeItem(KEYS.delivery);
    else window.localStorage.setItem(KEYS.delivery, JSON.stringify({ v: 1, at: Date.now(), ...next }));
  } catch { /* storage blocked */ }
  listeners.forEach((l) => l());
}
export function resetDelivery() { current = EMPTY_DELIVERY; loaded = true; listeners.forEach((l) => l()); }

/** Fee in KES for the chosen area, or null while it is not confirmed. */
export function feeFor(d: DeliveryChoice): number | null {
  if (d.fulfilment !== "nairobi" || !d.area || d.area === OTHER_AREA) return null;
  return findArea(d.area)?.feeKes ?? null;
}
/** Zone letter, only once the owner has confirmed the zones. */
export function zoneFor(d: DeliveryChoice): string | null {
  if (!zonesConfirmed || d.fulfilment !== "nairobi" || !d.area || d.area === OTHER_AREA) return null;
  return findArea(d.area)?.zone ?? null;
}
export function leadTimeText(): string {
  return leadTimeDays === null ? "We confirm timing on WhatsApp." : `Usually ${leadTimeDays} working days after we confirm your order.`;
}
export const pickupText = (): string => (pickupPoints.length ? `Pickup points: ${pickupPoints.join(", ")}.` : "We have no shop, so we agree a meeting place and time on WhatsApp.");

onClearMemory(resetDelivery);
