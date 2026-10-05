// SINGLE SOURCE for the checkout terms acceptance. It reads the legal pack (content/legal/acceptance.ts), so changing the
// wording or bumping a document version there changes the checkbox, the consent record and the WhatsApp line together.
import { acceptance, orderMessageLine } from "../content/legal/acceptance";

const a = acceptance.checkout;

export const TERMS_ACCEPT = {
  version: a.versionId,
  /** Plain text without the {braces}. */
  text: a.text.replace(/[{}]/g, ""),
  links: a.links.map((l) => ({ phrase: l.label, href: l.href })),
  error: a.error,
} as const;

/** "Accepted: terms-of-sale v0.1-draft, privacy-policy v0.1-draft on 2026-10-03 14:05 EAT" */
export function acceptedLine(at: Date): string {
  const eat = new Date(at.getTime() + 3 * 3600 * 1000).toISOString().slice(0, 16).replace("T", " ");
  return orderMessageLine(a.versionId, `${eat} EAT`);
}
