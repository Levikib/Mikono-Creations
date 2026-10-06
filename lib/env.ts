import { CONTACT_EMAIL, PHONE_DIGITS } from "./site";

// Typed env access. NEXT_PUBLIC_* values must be read with static property
// access so Next can inline them into the client bundle.
export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  siteEnv: process.env.NEXT_PUBLIC_SITE_ENV ?? "development",
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "",
  // Falls back to the official business number, so a WhatsApp link always exists.
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "") || PHONE_DIGITS,
  // The business email is a constant in lib/site.ts (client message of 2026-10-05).
  contactEmail: CONTACT_EMAIL,
} as const;

/** Names reserved for server use later (D19). Never read in client code. */
export const reservedServerEnv = [
  "META_CAPI_TOKEN",
  "TIKTOK_EVENTS_API_TOKEN",
  "GA4_API_SECRET",
  "EMAIL_PROVIDER_API_KEY",
  "LEADS_SHEET_ID",
  "GOOGLE_SERVICE_ACCOUNT_JSON",
] as const;

export const isProduction = env.siteEnv === "production";

export const optionalEnvNames: Record<string, string> = {
  NEXT_PUBLIC_SITE_URL: env.siteUrl,
  NEXT_PUBLIC_GTM_ID: env.gtmId,
  NEXT_PUBLIC_GA4_ID: env.ga4Id,
  NEXT_PUBLIC_META_PIXEL_ID: env.metaPixelId,
  NEXT_PUBLIC_TIKTOK_PIXEL_ID: env.tiktokPixelId,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
};

export function missingEnv(): string[] {
  return Object.entries(optionalEnvNames)
    .filter(([name, value]) => !value && name !== "NEXT_PUBLIC_WHATSAPP_NUMBER")
    .map(([name]) => name);
}

/** Base URL for metadata. Falls back to localhost so no domain is hardcoded. */
export function siteBaseUrl(): string {
  // next.config.ts fills NEXT_PUBLIC_SITE_URL from Vercel system variables when it is not set.
  // localhost is only a local development fallback and is never used on Vercel.
  return (env.siteUrl || "http://localhost:3000").replace(/\/$/, "");
}

/** WhatsApp link, or null when no number is configured. */
/** One business number for every order, brief and enquiry. */
export function whatsappUrl(text?: string): string | null {
  const number = env.whatsappNumber;
  if (!number) return null;
  const base = `https://wa.me/${number.replace(/\D/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
