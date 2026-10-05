// Consent aware tracking. Does nothing until consent is given AND an id exists.
import { env } from "./env";

export const TRACK_EVENTS = [
  "view_item_list", "select_item", "view_item", "select_variant", "add_to_cart",
  "remove_from_cart", "view_cart", "begin_checkout", "wizard_step_complete",
  "add_shipping_info", "whatsapp_order_submit", "whatsapp_click", "generate_lead",
  "newsletter_signup", "file_download", "consent_update", "web_vitals",
  // Cart and order form (strategy/16 section 8). Step names and field names only, never values.
  "customer_type_selected", "share_list", "save_for_later", "move_to_cart", "update_line", "wizard_step_view", "wizard_error",
  "wizard_abandon", "reorder_start", "profile_remember", "delivery_estimate_view", "shared_list_open",
  // Custom Studio (strategy/09 section 6)
  "studio_view", "studio_type_select", "studio_inspiration_add", "studio_base_select", "studio_size_select",
  "studio_colour_select", "studio_detail_toggle", "studio_quantity_set", "studio_deadline_set", "studio_budget_set",
  "studio_contact_complete", "studio_attach_instruction_view", "studio_error", "studio_abandon",
  // Helpers (gift finder, size finder, family builder)
  "helper_start", "helper_step", "helper_result", "helper_restart", "helper_cta", "helper_share", "helper_family_change",
  // Every CTA link that leads into a tool or the Studio
  "cta_click",
] as const;
export type TrackEvent = (typeof TRACK_EVENTS)[number];

export type LeadType =
  | "wholesale" | "price_list" | "sample_pack" | "quote" | "partnership"
  | "supply" | "custom" | "contact" | "catalogue";

export type Consent = { v: 1; analytics: boolean; marketing: boolean; ts: number };

export const CONSENT_KEY = "mk_consent";
export const ATTR_KEY = "mk_attr";
export const CONSENT_EVENT = "mk:consent";
export const CONSENT_OPEN_EVENT = "mk:consent-open";

type Fn = (...args: unknown[]) => void;
type W = Window & { dataLayer?: unknown[]; fbq?: Fn; ttq?: Record<string, Fn> & unknown[]; __mkConsentDefault?: boolean; gtag?: Fn };

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function writeConsent(c: { analytics: boolean; marketing: boolean }): Consent {
  const value: Consent = { v: 1, ...c, ts: Date.now() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {
    /* storage blocked: choice lives for this page only */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  return value;
}

/** gtag.js and GTM only read Arguments objects from the dataLayer, never plain arrays. */
function gtag(..._args: unknown[]) {
  void _args;
  const w = window as W;
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments);
}

/** Consent Mode v2 defaults, all denied. Safe to call twice: it runs once, always before any tag. */
export function pushConsentDefaults() {
  const w = window as W;
  if (w.__mkConsentDefault) return;
  w.__mkConsentDefault = true;
  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: "denied", functionality_storage: "granted",
    security_storage: "granted", wait_for_update: 500,
  });
}

export function pushConsentUpdate(c: { analytics: boolean; marketing: boolean }) {
  const a = c.analytics ? "granted" : "denied";
  const m = c.marketing ? "granted" : "denied";
  gtag("consent", "update", {
    analytics_storage: a, ad_storage: m, ad_user_data: m, ad_personalization: m,
  });
}

// UTM capture (D25): memory before analytics consent, mk_attr after.
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
let memoryAttr: Record<string, string> | null = null;

export function captureUtm(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) found[k] = v.toLowerCase();
  }
  if (Object.keys(found).length) memoryAttr = found;
  if (memoryAttr && readConsent()?.analytics) {
    try {
      window.localStorage.setItem(ATTR_KEY, JSON.stringify({ ...memoryAttr, ts: Date.now() }));
    } catch {
      /* ignore */
    }
  }
  return memoryAttr;
}

export function attribution(): Record<string, string> {
  if (memoryAttr) return memoryAttr;
  try {
    const raw = window.localStorage.getItem(ATTR_KEY);
    if (raw && readConsent()?.analytics) {
      const { ts: _ts, ...rest } = JSON.parse(raw);
      void _ts;
      return rest;
    }
  } catch {
    /* ignore */
  }
  return {};
}

const hasAnyId = () => Boolean(env.gtmId || env.ga4Id || env.metaPixelId || env.tiktokPixelId);

/* ---------- no personal data in any event ---------- */
// Keys that could carry a person's details are removed before an event is queued. Item entries keep a fixed set of keys.
const FORBIDDEN_KEY = /(^|_)(name|first|last|phone|tel|email|mail|address|landmark|town|county|area|note|notes|message|text|kra|pin|recipient|invoice|business|po|map|pin_link|gift)(_|$)/i;
const ITEM_KEYS = new Set(["item_id", "item_name", "item_category", "item_variant", "quantity", "price"]);

export function cleanParams(params: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    if (k === "items" && Array.isArray(v)) {
      out.items = v.map((it) => Object.fromEntries(Object.entries(it as Record<string, unknown>).filter(([ik, iv]) => ITEM_KEYS.has(ik) && iv !== undefined)));
      continue;
    }
    if (k === "item_name" || k === "step_name" || k === "field_name" || k === "customer_type") { out[k] = v; continue; }
    if (FORBIDDEN_KEY.test(k) || v === undefined) continue;
    out[k] = v;
  }
  return out;
}

/* ---------- event forwarding (D22, D23) ---------- */
// Events are queued until the loader reports that the tags exist. A reject drops the queue.
type Queued = { event: TrackEvent; params: Record<string, unknown> };
const MAX_QUEUE = 50;
const queue: Queued[] = [];
let ready = false;

/** D23: our events to Meta and TikTok standard events. Never purchase. */
const metaMap: Partial<Record<TrackEvent, string>> = {
  whatsapp_order_submit: "Lead", generate_lead: "Lead", whatsapp_click: "Contact",
};
const tiktokMap: Partial<Record<TrackEvent, string>> = {
  whatsapp_order_submit: "SubmitForm", generate_lead: "SubmitForm", whatsapp_click: "Contact",
};

function forward({ event, params }: Queued) {
  const w = window as W;
  const consent = readConsent();
  if (!consent) return;
  if (consent.analytics) {
    if (env.gtmId) {
      w.dataLayer = w.dataLayer || [];
      // GA4 ecommerce shape: clear the previous ecommerce object, then push items, value and currency under "ecommerce".
      const { items, value, currency, ...rest } = params;
      if (Array.isArray(items)) {
        w.dataLayer.push({ ecommerce: null });
        w.dataLayer.push({ event, ecommerce: { ...(typeof value === "number" ? { value, currency: currency ?? "KES" } : {}), items }, ...rest });
      } else {
        w.dataLayer.push({ event, ...rest, ...(typeof value === "number" ? { value, currency: currency ?? "KES" } : {}) });
      }
    } else if (env.ga4Id) gtag("event", event, params);
  }
  // Direct pixels only. With GTM the pixel tags are configured inside the container.
  if (!consent.marketing || env.gtmId) return;
  const value = typeof params.value === "number" ? { value: params.value, currency: "KES" } : {};
  if (env.metaPixelId && typeof w.fbq === "function" && metaMap[event]) w.fbq("track", metaMap[event], value);
  if (env.tiktokPixelId && w.ttq && typeof w.ttq.track === "function" && tiktokMap[event]) w.ttq.track(tiktokMap[event]!, value);
}

function flush() {
  while (queue.length) forward(queue.shift()!);
}

/** Called by components/Analytics.tsx once the tags can receive events. */
export function markAnalyticsReady() {
  ready = true;
  flush();
}

/** Called on reject, or when the loader gives up. */
export function dropQueuedEvents() {
  queue.length = 0;
}

export function track(event: TrackEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (!hasAnyId()) return;
  const consent = readConsent();
  if (consent && !consent.analytics && !consent.marketing) { dropQueuedEvents(); return; }
  const item: Queued = { event, params: { ...attribution(), ...cleanParams(params) } };
  if (ready && consent) { forward(item); return; }
  // Not loaded yet, or no choice made yet: hold the event. It is sent after Accept and dropped on Reject.
  if (queue.length < MAX_QUEUE) queue.push(item);
}
