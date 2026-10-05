"use client";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { normalisePhone } from "@/lib/phone";
import { sendEnquiry, type Sendable } from "@/lib/enquiry";
import { OTHER_LABEL, emptyPay, emptyReach, validatePay, type PayPref, leadTypeFor, validateExtras, validateReach, wholesaleFields, type ExtraContact, type Outlet, type ProductInterest, type Reach } from "@/lib/enquiryForm";
import { CheckboxField, ErrorSummary, focusSummary, TextareaField, TextField } from "./Form";
import { CheckList, ContactList, OutletList, PayFields, ProductPicker, ReachFields } from "./enquiry/Multi";
import { EnquiryResult } from "./EnquiryResult";
import { Icon } from "./Icon";
import "./cart/checkout.css";

const kinds = [
  { value: "price list", label: "Price list", help: "We send the wholesale price list on WhatsApp." },
  { value: "sample pack", label: "Sample pack", help: "Ask about a small sample set to see the animals in person." },
  { value: "quote", label: "Quote", help: "Tell us what you need and we reply with a quote." },
  { value: "reorder", label: "Reorder", help: "You have ordered from us before." },
  { value: OTHER_LABEL, label: OTHER_LABEL, help: "Something else, in your own words." },
];
const sellsOptions = ["Gift shop", "Boutique", "Lodge or camp", "Hotel", "Restaurant or cafe", "School or fair", "Church or community group", "Hospital or clinic", "Event planner", "Online shop", "Market stall"].map((v) => ({ value: v, label: v }));
const heardOptions = ["Instagram", "Facebook", "TikTok", "WhatsApp or a friend", "Google search", "A shop or stockist", "An event or market", OTHER_LABEL].map((v) => ({ value: v, label: v }));

const requestKinds: Record<string, string> = { "price-list": "price list", quote: "quote", "sample-pack": "sample pack", reorder: "reorder" };

/** Reads ?request= from the menu links so the form opens with the right request chosen. The plain form is the Suspense fallback. */
export function WholesaleFormFromLink() {
  const kind = requestKinds[useSearchParams().get("request") ?? ""] ?? "";
  return <WholesaleForm key={kind} initialKind={kind} />;
}

export function WholesaleForm({ initialKind = "" }: { initialKind?: string }) {
  const [v, setV] = useState({ business: "", contact: "", phone: "", email: "", sellsOther: "", quantities: "", notes: "", requestOther: "", heardOther: "" });
  const [heard, setHeard] = useState<string[]>([]);
  const [reach, setReach] = useState<Reach>(emptyReach());
  const [pay, setPay] = useState<PayPref>(emptyPay());
  const [requests, setRequests] = useState<string[]>(initialKind ? [initialKind] : []);
  const [sells, setSells] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductInterest[]>([]);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [contacts, setContacts] = useState<ExtraContact[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tick, setTick] = useState(0);
  const [sent, setSent] = useState<Sendable | null>(null);
  const summary = useRef<HTMLHeadingElement>(null);
  const on = (k: keyof typeof v) => (val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    setErrors((e) => { if (!e[k]) return e; const n = { ...e }; delete n[k]; return n; });
  };

  const submit = () => {
    const e: Record<string, string> = {};
    if (!requests.length) e.kind = "Please choose at least one thing you would like. Other, tell us is always there.";
    else if (requests.length === 1 && requests[0] === OTHER_LABEL && v.requestOther.trim().length < 2) e.requestOther = "Please tell us in a few words what you would like.";
    if (v.business.trim().length < 2) e.business = "Please add your business name.";
    if (v.contact.trim().length < 2) e.contact = "Please add the name of the person we should speak to.";
    const ph = normalisePhone(v.phone);
    if (!ph.ok) e.phone = "Please add a phone number we can reach on WhatsApp. For example 0712 345 678, or with the country code, like +44 7911 123456.";
    if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "That email does not look right yet. Check it, or leave it empty.";
    Object.assign(e, validateExtras({ outlets, contacts }), validateReach(reach, v.email), validatePay(pay));
    setErrors(e);
    if (Object.keys(e).length) {
      setTick((t) => t + 1);
      setTimeout(() => focusSummary(summary.current), 0);
      return;
    }
    setSent(sendEnquiry({
      prefix: "WS", intro: "Hello Mikono Creations, wholesale request.", consent, leadType: leadTypeFor(requests),
      extra: { request_count: requests.length, product_count: products.filter((p) => p.slug).length, outlet_count: outlets.length },
      fields: wholesaleFields({
        requests, requestOther: v.requestOther, business: v.business, reach, pay, heard, heardOther: v.heardOther, main: { role: "Ordering contact", name: v.contact, phone: ph.ok ? ph.e164 : v.phone, email: v.email }, contacts,
        outlets, sells, sellsOther: v.sellsOther, products, quantities: v.quantities, notes: v.notes,
      }),
    }));
  };

  if (sent) return <EnquiryResult sent={sent} onAnother={() => setSent(null)} />;
  const list = Object.entries(errors).map(([id, message]) => ({ id, message }));
  return (
    <form noValidate onSubmit={(ev) => { ev.preventDefault(); submit(); }} className="grid grid-cols-[minmax(0,1fr)] gap-2.5" data-tick={tick}>
      <ErrorSummary errors={list} headingRef={summary} />
      <CheckList id="kind" legend="What would you like?" error={errors.kind} values={requests} onChange={(r) => { setRequests(r); setErrors((e) => { const n = { ...e }; delete n.kind; return n; }); }} options={kinds} />
      {requests.includes(OTHER_LABEL) ? <TextField id="requestOther" label="What would you like? In your own words" value={v.requestOther} maxLength={200} autoComplete="off" onChange={on("requestOther")} error={errors.requestOther} /> : null}
      <TextField id="business" label="Business or group name" autoComplete="organization" value={v.business} onChange={on("business")} error={errors.business} />
      <TextField id="contact" label="Contact person's full name" hint="Any name is fine. One name is enough." autoComplete="name" value={v.contact} onChange={on("contact")} error={errors.contact} maxLength={120} />
      <TextField id="phone" label="Your WhatsApp or phone number" hint="We reply on WhatsApp. For example 0712 345 678, or +44 7911 123456 from abroad." type="tel" inputMode="tel" autoComplete="tel" value={v.phone} onChange={on("phone")} error={errors.phone} />
      <TextField id="email" label="Email" optional type="email" inputMode="email" autoComplete="email" value={v.email} onChange={on("email")} error={errors.email} />
      <ContactList rows={contacts} onChange={setContacts} errors={errors} />
      <OutletList rows={outlets} onChange={setOutlets} errors={errors} />
      <CheckList id="sells" legend="What do you sell, or what is it for?" values={sells} onChange={setSells} options={sellsOptions} />
      <TextField id="sellsOther" label="Other, tell us" optional hint="Another kind of place, or what it is for." value={v.sellsOther} onChange={on("sellsOther")} />
      <ProductPicker rows={products} onChange={setProducts} />
      <TextField id="quantities" label="Anything on quantities?" optional hint="A guess is fine, for example about 30 pieces over the season." value={v.quantities} onChange={on("quantities")} enterKeyHint="next" />
      <TextareaField id="notes" label="Anything else?" optional maxLength={500} value={v.notes} onChange={on("notes")} />
      <CheckList id="heard" legend="How did you hear about us? (optional)" values={heard} onChange={setHeard} options={heardOptions} />
      {heard.includes(OTHER_LABEL) ? <TextField id="heardOther" label="How else did you hear about us?" optional value={v.heardOther} maxLength={120} autoComplete="off" onChange={on("heardOther")} /> : null}
      <PayFields value={pay} onChange={setPay} errors={errors} />
      <ReachFields idBase="reach" value={reach} onChange={setReach} errors={errors} />
      <CheckboxField id="consent" checked={consent} onChange={setConsent} label="Yes, you may send me news and offers on WhatsApp or email." hint="This is optional. I can say stop at any time." />
      <p className="text-base text-stone">We use your details only to answer this request. No prices are shown on this page. We send the price list on WhatsApp.</p>
      <button type="submit" className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[.9375rem] font-semibold sm:w-fit">
        <Icon name="whatsapp" size={24} />Send request on WhatsApp
      </button>
    </form>
  );
}
