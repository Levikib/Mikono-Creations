// Size finder: maps how the animal will be used to the S to XL classes. Relative reasons only (R5).
import { SIZE_USES, type UseKey } from "@/data/helpers";

export interface SizeSuggestion { use: string; label: string; main: string; also: string; reason: string }

/** Several uses at once. Each use keeps its own suggestion. The combined list names every size to consider, main sizes first. */
export function sizesFor(uses: readonly string[]): { items: SizeSuggestion[]; mains: string[]; alsos: string[] } {
  const items = uses.map((u) => sizeFor(u)).filter((x): x is NonNullable<ReturnType<typeof sizeFor>> => !!x);
  const order = ["S", "M", "L", "XL"];
  const mains = [...new Set(items.map((i) => i.main))].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  const alsos = [...new Set(items.map((i) => i.also))].filter((s) => !mains.includes(s)).sort((a, b) => order.indexOf(a) - order.indexOf(b));
  return { items, mains, alsos };
}

export function sizeFor(use: string | undefined) {
  const u = SIZE_USES.find((x) => x.value === (use as UseKey));
  return u ? { use: u.value, main: u.main, also: u.also, reason: u.reason, label: u.label } : null;
}
