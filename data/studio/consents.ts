// Consents and document versions. The three version ids are placeholders until the owner publishes final documents.
// The terms box is required to send. Marketing boxes are optional and start unticked. Consent text version follows data/consent.ts.
import { CONSENT_VERSION } from "../consent";
import { L, acceptance } from "../../content/legal/acceptance";

// Link labels, hrefs and version ids come from the legal pack (content/legal/acceptance.ts).
export const CUSTOM_TERMS_VERSION = `${L.custom.slug}@${L.custom.version}`;
export const TERMS_OF_SALE_VERSION = `${L.terms.slug}@${L.terms.version}`;
export const PRIVACY_VERSION = `${L.privacy.slug}@${L.privacy.version}`;
export const STUDIO_CONSENT_VERSION = CONSENT_VERSION;
/** Combined version id of the three documents, as stored with the acceptance. */
export const ACCEPTANCE_VERSION_ID = acceptance.custom.versionId;

export const termsText = acceptance.custom.text;
export const termsError = acceptance.custom.error;
export const termsHint = "Nothing is final until you approve a quote.";
export const termsDocs = acceptance.custom.links.map((d) => ({ id: d.slug, label: d.label, href: d.href, version: `${d.slug}@${d.version}` }));

export const marketingConsents = [
  { id: "whatsapp", label: "Send me news and offers on WhatsApp", hint: "Optional. I can reply STOP at any time." },
  { id: "email", label: "Email me the Mikono newsletter", hint: "Optional. I can unsubscribe at any time." },
] as const;
export type MarketingId = (typeof marketingConsents)[number]["id"];

export const PRIVACY_LINE = "We use your details only to answer this brief. WhatsApp also sees the message. Your name, phone, email and KRA PIN are never saved on this device.";
export const CHILD_LINE = "An adult fills this in. We never ask for a child's name, age, school or photo.";
