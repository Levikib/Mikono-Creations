// Consent texts for the order form (strategy/17 section 8.1). One box per purpose, all unticked.
// Bump CONSENT_VERSION on any wording change: the version is written into every consent record.
// The English wording is final for stage 1. The Kiswahili wording in strategy/17 still needs a fluent reviewer and the advocate,
// so it is not shown yet.
import { marketingFrequency } from "./facts";
import { TERMS_ACCEPT } from "./legal";

export const CONSENT_VERSION = "consent-v1-draft";
export const TERMS_VERSION = TERMS_ACCEPT.version;
export const BUSINESS_NAME = "Mikono Creations";

export type ConsentPurpose = "whatsapp_updates" | "email_newsletter" | "occasion_reminders" | "terms_acknowledged";

export const CONSENT_INTRO = "Optional. Your order does not depend on these. You can change your mind at any time.";

const per = (lead: string, tail = "") => (marketingFrequency ? `${lead}, about ${marketingFrequency} a month${tail}` : `${lead}${tail}`);

/** The exact box texts. The frequency phrase appears only once the owner has set a number. */
export const consentTexts: Record<ConsentPurpose, string> = {
  whatsapp_updates: `${per(`Yes, send me news and offers from ${BUSINESS_NAME} on WhatsApp`)}. I can reply STOP at any time.`,
  email_newsletter: `${marketingFrequency ? `Yes, email me the Mikono newsletter (${marketingFrequency} a month)` : "Yes, email me the Mikono newsletter"}. I will confirm my email by link and can unsubscribe at any time.`,
  occasion_reminders: "Yes, remind me about a gift occasion I choose (day and month only). Use my contact details for this only.",
  terms_acknowledged: TERMS_ACCEPT.text,
};

export const REMEMBER_TEXT = "Save my name, phone and delivery details on this device only, to speed up my next order. Not sent to Mikono.";

export const CONSENT_NOTICE = `${BUSINESS_NAME} uses your name, phone and delivery details to prepare and deliver your order. Please do not add a child's name, school or age.`;
export const CONSENT_TRANSPORT = "Your choices are written into your WhatsApp message to us. We send no marketing to anyone who leaves these boxes blank.";

export interface ConsentRecord {
  purpose: ConsentPurpose;
  granted: boolean;
  textVersion: string;
  text: string;
  /** ISO time the choice was made, taken when the order is sent. */
  at: string;
  source: "order_form_review";
}

export function buildConsentRecords(ticks: Record<ConsentPurpose, boolean>, at: Date): ConsentRecord[] {
  return (Object.keys(consentTexts) as ConsentPurpose[]).map((purpose) => ({
    purpose, granted: Boolean(ticks[purpose]), textVersion: CONSENT_VERSION, text: consentTexts[purpose], at: at.toISOString(), source: "order_form_review" as const,
  }));
}
