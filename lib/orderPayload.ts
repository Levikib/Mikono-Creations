// Builds the stage 2 order object from the form. Pure. The KRA PIN is never copied into it.
import { isB2b, contactChannels, contactHoursOptions, languages, timeWindows, customerTypeLabel, INTEREST_OTHER, HEARD_OTHER } from "@/data/checkout";
import { TERMS_VERSION } from "@/data/consent";
import { buildConsentRecords } from "@/data/consent";
import { normalisePhone } from "./phone";
import { completeOccasions, occasionComplete, type Form, type Ticks } from "./orderForm";
import { syncAlloc, type SplitLine } from "./split";
import type { OrderPayload } from "./orderApi";

const label = (list: Array<{ value: string; label: string }>, v: string) => list.find((x) => x.value === v)?.label ?? "";
const e164 = (s: string) => { const r = normalisePhone(s); return r.ok ? r.e164 : ""; };

export function buildOrderPayload(o: {
  ref: string; at: Date; form: Form; ticks: Ticks; lines: Array<{ sku: string; qty: number; note?: string }>;
  attribution: Record<string, string>; messageLevel: string;
}): OrderPayload {
  const f = o.form;
  const b2b = isB2b(f.customerTypes);
  const receiving = !f.split && (f.recipientDifferent || f.sendDirect);
  const occ = completeOccasions(f);
  const sl: SplitLine[] = o.lines.map((l) => ({ sku: l.sku, qty: l.qty, name: "", colourLabel: "", size: "" }));
  // Reminders only keep a date when the type, day and month are all there.
  const ticks: Ticks = { ...o.ticks, occasion_reminders: o.ticks.occasion_reminders && occasionComplete(f) };
  return {
    ref: o.ref,
    createdAt: o.at.toISOString(),
    customerTypes: f.customerTypes.map((x) => (x === "other" ? (f.customerOther.trim() ? `Other: ${f.customerOther.trim()}` : "Other") : customerTypeLabel(x))).filter(Boolean),
    segment: b2b ? "b2b" : "b2c",
    contact: { name: f.name.trim(), phone: e164(f.phone), email: f.email.trim(), channels: f.contactChannels.map((c) => (c === "other" ? `Other: ${f.channelOther.trim()}` : label(contactChannels, c))).filter(Boolean), hours: label(contactHoursOptions, f.contactHours), language: f.language === "other" ? `Other: ${f.langOther.trim()}` : label(languages, f.language) },
    lines: o.lines.map((l) => ({ sku: l.sku, qty: l.qty, note: l.note ?? "" })),
    delivery: {
      fulfilment: f.fulfilment, area: f.area, areaOther: f.areaOther, county: f.county, town: f.town, other: f.fulfilmentOther.trim(), landmark: f.landmark, notes: f.deliveryNotes, mapsPin: f.mapsPin.trim(),
      dateWish: f.dateFlex === "asap" ? "As soon as possible" : f.dateFlex === "flexible" ? "Flexible" : f.dateWish, timeWindow: label(timeWindows, f.timeWindow), callOnArrival: f.callOnArrival,
      recipientName: receiving ? f.recipientName.trim() : "", recipientPhone: receiving ? e164(f.recipientPhone) : "",
    },
    deliveries: f.split ? syncAlloc(sl, f.drops).map((d) => ({
      fulfilment: d.fulfilment, area: d.area, areaOther: d.areaOther, county: d.county, town: d.town, other: d.other.trim(), landmark: d.landmark, mapsPin: d.mapsPin.trim(),
      recipientName: d.recipientName.trim(), recipientPhone: e164(d.recipientPhone), giftNote: d.giftNote.trim(),
      units: Object.entries(d.alloc).filter(([, n]) => n > 0).map(([sku, qty]) => ({ sku, qty })),
    })) : [],
    gift: { note: f.split ? "" : f.giftNote, anonymous: f.anonymous, sendDirect: f.sendDirect },
    business: b2b
      ? { businessName: f.businessName.trim(), businessType: f.businessType, outletLocation: f.outletLocation.trim(), volumeBand: f.volumeBand, invoiceName: f.invoiceName.trim(), poNumber: f.poNumber.trim() }
      : { businessName: "", businessType: "", outletLocation: "", volumeBand: "", invoiceName: "", poNumber: "" },
    about: { interests: f.interests.map((x) => (x === INTEREST_OTHER ? `Other: ${f.interestOther.trim()}` : x)), heardFrom: f.heardFrom.map((x) => (x === HEARD_OTHER ? `Other: ${f.heardOther.trim()}` : x)) },
    reminders: ticks.occasion_reminders ? occ.map((x) => ({ occasionType: x.type, day: Number(x.day), month: Number(x.month) })) : [],
    paymentNote: f.paymentNote.trim(),
    payment: { timing: f.payTiming, methods: f.payMethods.map((x) => (x === "other" ? `other: ${f.payOther.trim()}` : x)) },
    notes: f.notes,
    consents: buildConsentRecords(ticks, o.at),
    termsVersion: TERMS_VERSION,
    attribution: o.attribution,
    messageLevel: o.messageLevel,
  };
}
