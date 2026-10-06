// Rough guide for the Brief Card and the WhatsApp message. Built from data/studio/estimates.ts, which holds ESTIMATES only.
// Shown only when every piece has a size class, so it never appears for an empty brief. Never a price: the wording always says rough or estimate.
import { isWallArtSlug, WALL_ART_PRICE_KES } from "../../data/facts";
import { BULK_FROM, ESTIMATE_CONFIRM, ESTIMATE_MESSAGE_LABEL, ROUGH_BULK, ROUGH_COMPLEXITY, ROUGH_PER_PIECE, budgetBands, fmtKes, genericBaseById } from "../../data/studio";
import { pieceCount, totalCount } from "./flow";
import type { Brief, Piece } from "./types";

export interface RoughGuide { lowKes: number; highKes: number; text: string; budgetNote: string; messageLine: string }

const complex = (p: Piece) => !!genericBaseById(p.baseId) || p.stitch.length + p.wear.length + p.finish.length > 0;
const hasSize = (p: Piece): p is Piece & { size: "S" | "M" | "L" | "XL" } => p.size === "S" || p.size === "M" || p.size === "L" || p.size === "XL";
const floor100 = (n: number) => Math.floor(n / 100) * 100;
const ceil100 = (n: number) => Math.ceil(n / 100) * 100;

/** null until every piece has a size class (Small to Extra large) and a count. */
export function roughGuide(b: Brief): RoughGuide | null {
  if (!b.pieces.length || !b.pieces.every((p) => hasSize(p) && pieceCount(p) > 0)) return null;
  let low = 0, high = 0;
  for (const p of b.pieces) {
    if (!hasSize(p)) continue;
    // A wall head is never rough-estimated below its fixed shop price.
    const wall = typeof p.baseId === "string" && (isWallArtSlug(p.baseId) || p.baseId === "wall-head");
    const base = ROUGH_PER_PIECE[p.size];
    const r = wall ? { lowKes: Math.max(base.lowKes, WALL_ART_PRICE_KES), highKes: Math.max(base.highKes, WALL_ART_PRICE_KES) } : base;
    const n = pieceCount(p);
    const c = complex(p);
    low += r.lowKes * n * (c ? 1 + ROUGH_COMPLEXITY.lowPercent / 100 : 1);
    high += r.highKes * n * (c ? 1 + ROUGH_COMPLEXITY.highPercent / 100 : 1);
  }
  if (totalCount(b) >= BULK_FROM) { low *= 1 - ROUGH_BULK.highPercent / 100; high *= 1 - ROUGH_BULK.lowPercent / 100; }
  const lowKes = floor100(low), highKes = ceil100(high);
  const range = `${fmtKes(lowKes)} to ${fmtKes(highKes).replace("KES ", "")}`;
  const band = budgetBands.find((x) => x.id === b.budgetBand);
  let budgetNote = "";
  if (band && band.toKes !== null && lowKes > band.toKes) budgetNote = "Your budget guide is a little below this rough estimate. We can suggest smaller sizes or fewer extras.";
  else if (band && band.fromKes !== null && band.fromKes > 0 && highKes < band.fromKes) budgetNote = "Your budget guide is above this rough estimate, so there may be room for extras.";
  return {
    lowKes, highKes,
    text: `This looks like roughly ${range} at these sizes. ${ESTIMATE_CONFIRM}`,
    budgetNote,
    messageLine: `${ESTIMATE_MESSAGE_LABEL}: ${range} (a rough estimate, not a price). ${ESTIMATE_CONFIRM}`,
  };
}
