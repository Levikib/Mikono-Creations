// STAGE 2 HOOK. Stage 1 stores nothing on a server, so this file does nothing on purpose.
// When the database is approved (owner registered with the ODPC, privacy notice updated), replace the two functions below
// with calls to the order routes in strategy/16 section 5. The order form already builds the full OrderPayload and
// calls these in the right places:
//   - reserveRef(): when the review step opens. null means "use the reference made on this device".
//   - submitOrder(): after WhatsApp has been opened. It must never delay or block opening WhatsApp, and a failure must
//     never be shown to the customer as an error: the order is already on its way by WhatsApp.
// Keep PERSIST_ENABLED false until then. Nothing here may call fetch, XMLHttpRequest or sendBeacon in stage 1.
import type { ConsentRecord } from "@/data/consent";

export const PERSIST_ENABLED = false;

/** The order as stage 2 will receive it. Built in the browser at send time. The KRA PIN is deliberately not part of it. */
export interface OrderPayload {
  ref: string;
  createdAt: string;
  customerTypes: string[];
  segment: "b2c" | "b2b";
  contact: { name: string; phone: string; email: string; channels: string[]; hours: string; language: string };
  lines: Array<{ sku: string; qty: number; note: string }>;
  delivery: {
    fulfilment: string; area: string; areaOther: string; county: string; town: string; other: string; landmark: string; notes: string; mapsPin: string;
    dateWish: string; timeWindow: string; callOnArrival: boolean; recipientName: string; recipientPhone: string;
  };
  /** Present when the order goes to more than one place: every place with the units sent there. */
  deliveries: Array<{
    fulfilment: string; area: string; areaOther: string; county: string; town: string; other: string; landmark: string; mapsPin: string;
    recipientName: string; recipientPhone: string; giftNote: string; units: Array<{ sku: string; qty: number }>;
  }>;
  gift: { note: string; anonymous: boolean; sendDirect: boolean };
  business: { businessName: string; businessType: string; outletLocation: string; volumeBand: string; invoiceName: string; poNumber: string };
  about: { interests: string[]; heardFrom: string[] };
  /** Day and month only, filled only when the occasion reminder box is ticked. */
  reminders: Array<{ occasionType: string; day: number; month: number }>;
  paymentNote: string;
  payment: { timing: string; methods: string[] };
  notes: string;
  /** One record per box: version id, exact text shown, tick state and time. */
  consents: ConsentRecord[];
  termsVersion: string;
  attribution: Record<string, string>;
  messageLevel: string;
}

export interface SubmitResult { persisted: boolean }
export interface OrderApi {
  reserveRef: () => Promise<string | null>;
  submitOrder: (payload: OrderPayload) => Promise<SubmitResult>;
}

/** No-op implementation for stage 1. */
export const orderApi: OrderApi = {
  reserveRef: async () => null,
  submitOrder: async () => ({ persisted: false }),
};
