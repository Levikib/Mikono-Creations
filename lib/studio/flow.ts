// Which steps and sections show, derived from the brief. Progressive disclosure: only ask what the choices make relevant.
import { BULK_FROM, customerTypes, featureFreeCategories, finishes, fullSteps, genericBaseById, qtyBands, quickSteps, typeById } from "../../data/studio";
import type { Brief, PathMode, Piece, StepId } from "./types";

export const isBusinessCustomer = (b: Brief) => b.customerTypes.some((id) => !!customerTypes.find((c) => c.id === id)?.business);
export const hasType = (b: Brief, pred: (t: NonNullable<ReturnType<typeof typeById>>) => boolean) => b.types.some((id) => { const t = typeById(id); return !!t && pred(t); });

export const wantsBusiness = (b: Brief) => isBusinessCustomer(b) || hasType(b, (t) => !!t.business);

/** Count for one piece: the exact number if given, else the smallest number in its band. */
export function pieceCount(p: Piece): number {
  const n = parseInt(p.qtyExact, 10);
  if (Number.isFinite(n) && n > 0) return n;
  return qtyBands.find((x) => x.id === p.qtyBand)?.min ?? 0;
}
export const totalCount = (b: Brief) => b.pieces.reduce((s, p) => s + pieceCount(p), 0);
export const isBulk = (b: Brief) => hasType(b, (t) => !!t.bulk) || b.pieces.some((p) => !!qtyBands.find((x) => x.id === p.qtyBand)?.bulk) || totalCount(b) >= BULK_FROM;

/** Several addresses are offered for business and bulk work, or when one is already added. */
export const wantsMultiAddress = (b: Brief) => wantsBusiness(b) || isBulk(b) || b.addresses.length > 1;

export const hasLogoFinish = (b: Brief) =>
  b.pieces.some((p) => p.finish.some((f) => finishes.find((x) => x.id === f)?.logo)) || b.packaging.includes("branded-pack");
export const mayHaveLogo = (b: Brief) => hasLogoFinish(b) || hasType(b, (t) => !!t.logo) || b.pieces.some((p) => p.baseId === "character");

export const showsReferenceTips = (b: Brief) => hasType(b, (t) => !!t.reference) || b.pieces.some((p) => p.baseId === "pet");
export const isGentle = (b: Brief) => hasType(b, (t) => !!t.gentle);
export const needsPhotoConsent = (b: Brief) => b.photoCount > 0;

/** Does this piece take the body and features questions? */
export function pieceHasFeatures(p: Piece, categoryOf: (slug: string) => string | undefined): boolean {
  const g = genericBaseById(p.baseId);
  if (g) return g.features;
  const cat = categoryOf(p.baseId);
  return !(cat && featureFreeCategories.includes(cat));
}

export function activeSteps(path: PathMode, b: Brief): StepId[] {
  if (path === "quick") return quickSteps;
  return fullSteps.filter((s) => s !== "business" || wantsBusiness(b));
}

export const stepIndexIn = (steps: StepId[], s: StepId) => steps.indexOf(s);
