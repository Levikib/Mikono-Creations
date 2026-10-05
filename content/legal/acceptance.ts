// Exact acceptance copy. DRAFT for advocate review. Version ids come from the documents themselves.
import { DRAFT_VERSION } from "./types";

export interface DocLink { label: string; href: string; slug: string; version: string }

const link = (label: string, href: string, slug: string): DocLink => ({ label, href, slug, version: DRAFT_VERSION });

export const L = {
  terms: link("Terms of Sale", "/terms", "terms-of-sale"),
  privacy: link("Privacy Policy", "/privacy", "privacy-policy"),
  custom: link("Custom Order Terms", "/terms/custom", "custom-order-terms"),
  wholesale: link("Wholesale and Trade Terms", "/terms/wholesale", "wholesale-terms"),
} as const;

/** Version id stored with each acceptance. Bump DRAFT_VERSION in types.ts when any document changes. */
export const acceptanceVersionId = (...docs: DocLink[]) => docs.map((d) => `${d.slug}@${d.version}`).join("+");

export interface AcceptanceCopy {
  context: "checkout" | "custom" | "wholesale";
  /** Plain label; {links} are rendered as anchors in the order given. */
  text: string;
  links: DocLink[];
  versionId: string;
  error: string;
  defaultChecked: false;
  required: true;
}

const mk = (context: AcceptanceCopy["context"], text: string, links: DocLink[]): AcceptanceCopy => ({
  context, text, links, versionId: acceptanceVersionId(...links),
  error: "Please tick to confirm you have read and accept the terms.", defaultChecked: false, required: true,
});

export const acceptance = {
  checkout: mk("checkout", "I have read and accept the {Terms of Sale} and the {Privacy Policy}.", [L.terms, L.privacy]),
  custom: mk("custom", "I have read and accept the {Custom Order Terms}, the {Terms of Sale} and the {Privacy Policy}.", [L.custom, L.terms, L.privacy]),
  wholesale: mk("wholesale", "I have read and accept the {Wholesale and Trade Terms} and the {Privacy Policy}, and I am authorised to make this request for my business.", [L.wholesale, L.privacy]),
} as const;

export const acceptanceNotes = [
  "Each box is required, unticked by default, separate from every marketing box, and must not be combined with marketing consent.",
  "Marketing boxes stay separate and optional (strategy/17 section 8.1).",
  "Replaces the checkout step text 'I have read the Terms and the Privacy notice.' in strategy/16 section 2.8.",
];

/** Line added to the WhatsApp order message. Fill {date} with the send time in East Africa Time. */
export const orderMessageLine = (versionId: string, whenEAT: string) =>
  `Accepted: ${versionId.replace(/\+/g, ", ").replace(/@/g, " ")} on ${whenEAT}`;

export const orderMessageLineExample = "Accepted: terms-of-sale v0.1-draft, privacy-policy v0.1-draft on 2026-10-03 14:05 EAT";

export const cookieBar = {
  text: "We use essential storage to run your order list. With your OK we also measure visits and ads.",
  buttons: { accept: "Accept all", reject: "Reject non-essential", choose: "Choose" },
  link: { label: "Cookie and Tracking Policy", href: "/cookies" },
  switches: {
    analytics: "Allow Google Analytics to count visits and pages so we can improve the site. Data goes to Google, outside Kenya.",
    advertising: "Allow Meta, TikTok and Google to measure and show our ads. They receive data about your visit, outside Kenya, and may use it under their own policies.",
    linkRecord: "Link my browsing to my customer record to improve suggestions. Optional.",
  },
  swahili: "Tunatumia hifadhi muhimu kuendesha orodha ya oda. Ukikubali, tunapima pia ziara na matangazo. (Swahili to be reviewed by a fluent speaker and the advocate.)",
  version: "consent-v1-draft",
} as const;

export interface FooterLink { label: string; href: string }
export const footerLegalLinks: FooterLink[] = [
  { label: "Terms of Sale", href: "/terms" },
  { label: "Custom Order Terms", href: "/terms/custom" },
  { label: "Wholesale and Trade Terms", href: "/terms/wholesale" },
  { label: "Website Terms of Use", href: "/terms/website" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie and Tracking Policy", href: "/cookies" },
  { label: "Returns and Refunds", href: "/returns" },
  { label: "Delivery", href: "/delivery" },
  { label: "Product Care and Safety", href: "/safety-notice" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Complaints", href: "/complaints" },
  { label: "Your data", href: "/data-request" },
  { label: "All legal documents", href: "/legal" },
];
