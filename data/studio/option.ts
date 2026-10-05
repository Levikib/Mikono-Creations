// Shared shape of every Studio option. Nothing here carries a price, a lead time or a promise.
// pending: true means the owner must confirm this option exists, or what it costs or how long it takes.
// The Studio then shows "To be confirmed" next to it and the WhatsApp message says so too.
import type { IconName } from "@/components/Icon";

/** How much a choice is likely to change the quote. A hint for the maker, never shown as a price. */
export type Impact = "none" | "low" | "medium" | "high";

export interface Opt {
  id: string;
  label: string;
  /** Short plain description, one sentence. */
  help: string;
  icon?: IconName;
  pending?: boolean;
  impactsQuote: Impact;
}

/** The always-available last choice of a list that could be incomplete. Its text is typed by the person. */
export const OTHER_ID = "other";
export const OTHER_LABEL = "Other, tell us";
export const OTHER_TEXT_MAX = 120;
export const otherOpt = (help = "Tell us in your own words"): Opt => ({ id: OTHER_ID, label: OTHER_LABEL, help, impactsQuote: "none" });
/** Add the Other choice to a list unless it already has one. */
export const withOther = <T extends Opt>(list: readonly T[], help?: string): Opt[] => (list.some((o) => o.id === OTHER_ID) ? [...list] : [...list, otherOpt(help)]);

export const labelOf = (list: readonly { id: string; label: string }[], id: string): string => list.find((o) => o.id === id)?.label ?? "";
export const labelsOf = (list: readonly { id: string; label: string }[], ids: readonly string[]): string[] =>
  ids.map((i) => labelOf(list, i)).filter(Boolean);
export const pendingOf = (list: readonly Opt[], id: string): boolean => !!list.find((o) => o.id === id)?.pending;

/** Labels of the chosen ids. An "other" choice reads "Other: what they typed", so the message keeps their own words. */
export const labelsOfO = (list: readonly { id: string; label: string }[], ids: readonly string[], other?: string): string[] =>
  ids.map((i) => (i === OTHER_ID ? (other?.trim() ? `Other: ${other.trim()}` : "Other") : labelOf(list, i))).filter(Boolean);
export const labelOfO = (list: readonly { id: string; label: string }[], id: string, other?: string): string =>
  id === OTHER_ID ? (other?.trim() ? `Other: ${other.trim()}` : "Other") : labelOf(list, id);
