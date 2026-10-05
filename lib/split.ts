// Split delivery: one order, one reference, several adults and places. Each cart line is allocated to the places by quantity.
// Pure functions. Every unit must be allocated exactly once.
import { normalisePhone } from "./phone";

export const MAX_DROPS = 20;

export interface Drop {
  id: string;
  /** nairobi, another Kenyan town, a courier or bus parcel service, a pickup point, someone else collects, abroad, or other in their own words. */
  fulfilment: "nairobi" | "town" | "courier" | "pickup" | "collect" | "abroad" | "other";
  area: string; areaOther: string; county: string; town: string; landmark: string; mapsPin: string;
  /** Country and city when abroad, or how they want it to reach them for Other. */
  other: string;
  /** An adult who receives this part of the order. Never a child. */
  recipientName: string; recipientPhone: string;
  giftNote: string;
  /** sku to quantity for this place. */
  alloc: Record<string, number>;
}

export interface SplitLine { sku: string; qty: number; name: string; colourLabel: string; size: string }

export const newDrop = (n: number, over: Partial<Drop> = {}): Drop => ({
  id: `d${n}`, fulfilment: "nairobi", area: "", areaOther: "", county: "", town: "", landmark: "", mapsPin: "", other: "",
  recipientName: "", recipientPhone: "", giftNote: "", alloc: {}, ...over,
});

/** Every line to the first place, nothing to the others. */
export function allToFirst(lines: readonly SplitLine[], drops: readonly Drop[]): Drop[] {
  return drops.map((d, i) => ({ ...d, alloc: i === 0 ? Object.fromEntries(lines.map((l) => [l.sku, l.qty])) : {} }));
}

/** Drops lines that left the cart and clamps quantities that were lowered, so an old allocation never refers to something gone. */
export function syncAlloc(lines: readonly SplitLine[], drops: readonly Drop[]): Drop[] {
  const qty = new Map(lines.map((l) => [l.sku, l.qty]));
  return drops.map((d) => {
    const alloc: Record<string, number> = {};
    for (const [sku, n] of Object.entries(d.alloc)) if (qty.has(sku) && n > 0) alloc[sku] = Math.min(n, qty.get(sku) as number);
    return { ...d, alloc };
  });
}

export const allocated = (drops: readonly Drop[], sku: string): number => drops.reduce((n, d) => n + (d.alloc[sku] ?? 0), 0);

export function setAlloc(drops: readonly Drop[], index: number, sku: string, qty: number): Drop[] {
  return drops.map((d, i) => {
    if (i !== index) return d;
    const alloc = { ...d.alloc };
    if (qty > 0) alloc[sku] = qty; else delete alloc[sku];
    return { ...d, alloc };
  });
}

/** Lines whose allocated total is not the quantity, and places with nothing in them. */
export function allocationProblems(lines: readonly SplitLine[], drops: readonly Drop[]) {
  const lineProblems = lines.map((l) => ({ line: l, allocated: allocated(drops, l.sku) })).filter((x) => x.allocated !== x.line.qty);
  const emptyDrops = drops.map((d, i) => ({ i, units: Object.values(d.alloc).reduce((n, v) => n + v, 0) })).filter((x) => x.units === 0).map((x) => x.i);
  return { lineProblems, emptyDrops };
}

export const dropUnits = (d: Drop): number => Object.values(d.alloc).reduce((n, v) => n + v, 0);

export function dropItems(lines: readonly SplitLine[], d: Drop): Array<SplitLine & { qty: number }> {
  return lines.filter((l) => (d.alloc[l.sku] ?? 0) > 0).map((l) => ({ ...l, qty: d.alloc[l.sku] }));
}

/** Short label such as "Karen" or "Naivasha, Nakuru". */
export function dropLabel(d: Drop, i: number): string {
  const where = d.fulfilment === "nairobi" ? (d.area === "Other Nairobi area" ? d.areaOther : d.area)
    : d.fulfilment === "pickup" ? "Pickup point" : d.fulfilment === "collect" ? "Someone collects" : d.fulfilment === "abroad" || d.fulfilment === "other" ? d.other
    : [d.town, d.county].filter(Boolean).join(", ");
  return where ? `Place ${i + 1}: ${where}` : `Place ${i + 1}`;
}

export function validateDrop(d: Drop, i: number, mapsOk: (s: string) => boolean): Record<string, string> {
  const e: Record<string, string> = {};
  const k = (f: string) => `drop${i}_${f}`;
  if (d.fulfilment === "nairobi") {
    if (!d.area) e[k("area")] = "Please choose the area. If it is not listed, choose Other Nairobi area.";
    else if (d.area === "Other Nairobi area" && d.areaOther.trim().length < 2) e[k("areaOther")] = "Please tell us the area.";
    if (d.landmark.trim().length < 3) e[k("landmark")] = "Please add an estate, street, building or landmark.";
  } else if (d.fulfilment === "town" || d.fulfilment === "courier") {
    if (!d.county) e[k("county")] = "Please choose the county.";
    if (d.town.trim().length < 2) e[k("town")] = "Please add the town.";
  } else if (d.fulfilment === "abroad") {
    if (d.other.trim().length < 2) e[k("other")] = "Please tell us the country and city.";
  } else if (d.fulfilment === "other") {
    if (d.other.trim().length < 2) e[k("other")] = "Please tell us how you would like it to reach you.";
  }
  if (d.mapsPin.trim() && !mapsOk(d.mapsPin)) e[k("mapsPin")] = "That does not look like a Google Maps link. Leave it empty if you prefer.";
  if (d.recipientName.trim().length < 2) e[k("recipientName")] = "Please add the name of the adult who will receive it.";
  if (!normalisePhone(d.recipientPhone).ok) e[k("recipientPhone")] = "Please add that adult's phone number, like 0712 345 678, or with the country code.";
  return e;
}

export function validateSplit(lines: readonly SplitLine[], drops: readonly Drop[], mapsOk: (s: string) => boolean): Record<string, string> {
  const e: Record<string, string> = {};
  drops.forEach((d, i) => Object.assign(e, validateDrop(d, i, mapsOk)));
  const { lineProblems, emptyDrops } = allocationProblems(lines, drops);
  if (lineProblems.length) {
    const first = lineProblems[0];
    const more = lineProblems.length > 1 ? ` and ${lineProblems.length - 1} more` : "";
    e.alloc = `Every animal must go to a place, exactly once. ${first.line.name} has ${first.allocated} of ${first.line.qty} placed${more}.`;
  }
  for (const i of emptyDrops) e[`drop${i}_units`] = `Place ${i + 1} has nothing in it. Give it an animal, or remove the place.`;
  return e;
}
