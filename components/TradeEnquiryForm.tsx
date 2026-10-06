"use client";
import { useRef, useState } from "react";
import { normalisePhone } from "@/lib/phone";
import { sendEnquiry, type Sendable } from "@/lib/enquiry";
import { emptyReach, tradeFields, validateExtras, validateReach, type ExtraContact, type Outlet, type ProductInterest, type Reach } from "@/lib/enquiryForm";
import type { LeadType } from "@/lib/track";
import { CheckboxField, ErrorSummary, focusSummary, TextareaField, TextField } from "./Form";
import { CheckList, ContactList, OutletList, ProductPicker, ReachFields } from "./enquiry/Multi";
import { EnquiryResult } from "./EnquiryResult";
import { Icon } from "./Icon";
import "./cart/checkout.css";

export type EnquiryKind = "partner" | "supply" | "custom";

type Config = {
  prefix: string; lead: LeadType; intro: string;
  typeLegend: string; types: { value: string; label: string; help?: string }[]; typeOtherLabel: string;
  orgLabel: string; orgRequired: boolean;
  messageLabel: string; messageHint: string;
  button: string; privacy: string;
  locations: boolean; products: boolean; productSizes: boolean; productTitle: string;
};

const configs: Record<EnquiryKind, Config> = {
  partner: {
    prefix: "PT", lead: "partnership", intro: "Hello Mikono Creations, partnership enquiry.",
    typeLegend: "What kind of partner are you?",
    types: [{ value: "school", label: "School or ECD centre" }, { value: "ngo or charity", label: "NGO or charity" }, { value: "business or brand", label: "Business or brand" }, { value: "hotel or lodge", label: "Hotel or lodge" },
      { value: "church or faith group", label: "Church or faith group" }, { value: "community group", label: "Community group" }, { value: "hospital or clinic", label: "Hospital or clinic" },
      { value: "shop or retailer", label: "Shop or retailer" }, { value: "event planner", label: "Event planner" }, { value: "government or public body", label: "Government or public body" }],
    typeOtherLabel: "Other, tell us",
    orgLabel: "Organisation name", orgRequired: true,
    messageLabel: "What do you have in mind?", messageHint: "A project, a gift for a group, a place to show the animals. A few lines is enough.",
    button: "Send partner enquiry on WhatsApp", privacy: "We use your details only to answer this enquiry.",
    locations: true, products: true, productSizes: false, productTitle: "Animals you have in mind",
  },
  supply: {
    prefix: "SP", lead: "supply", intro: "Hello Mikono Creations, supply enquiry.",
    typeLegend: "What can you supply?",
    types: [{ value: "yarn", label: "Yarn" }, { value: "packaging", label: "Packaging" }, { value: "transport", label: "Transport" }, { value: "filling or stuffing", label: "Filling or stuffing" }, { value: "labels or printing", label: "Labels or printing" },
      { value: "tools or equipment", label: "Tools or equipment" }, { value: "photography or design", label: "Photography or design" }, { value: "crochet or sewing work", label: "Crochet or sewing work" }],
    typeOtherLabel: "Other, tell us what you supply",
    orgLabel: "Business name", orgRequired: true,
    messageLabel: "Tell us what you supply", messageHint: "What it is, where you are based, and anything we should know. We agree prices with you on WhatsApp.",
    button: "Send supply enquiry on WhatsApp", privacy: "We use your details only to answer this enquiry.",
    locations: true, products: false, productSizes: false, productTitle: "",
  },
  custom: {
    prefix: "CU", lead: "custom", intro: "Hello Mikono Creations, custom order enquiry.",
    typeLegend: "What would you like to change?",
    types: [{ value: "colour", label: "Colour" }, { value: "animal", label: "A different animal" }, { value: "size", label: "Size" }, { value: "tag or branding", label: "A tag or branding" },
      { value: "name or message", label: "A name or short message" }, { value: "outfit or accessory", label: "An outfit or accessory" }, { value: "packaging", label: "Packaging" }],
    typeOtherLabel: "Other, tell us",
    orgLabel: "Business or group name", orgRequired: false,
    messageLabel: "Describe your idea", messageHint: "Which colours, how many, and what it is for. A rough idea is fine.",
    button: "Send custom enquiry on WhatsApp", privacy: "We use your details only to answer this enquiry. We reply with what is possible on WhatsApp.",
    locations: false, products: true, productSizes: true, productTitle: "Animals you would like made",
  },
};

export function TradeEnquiryForm({ kind }: { kind: EnquiryKind }) {
  const c = configs[kind];
  const [v, setV] = useState({ typeOther: "", org: "", contact: "", phone: "", email: "", message: "" });
  const [types, setTypes] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductInterest[]>([]);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [contacts, setContacts] = useState<ExtraContact[]>([]);
  const [reach, setReach] = useState<Reach>(emptyReach());
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Sendable | null>(null);
  const summary = useRef<HTMLHeadingElement>(null);
  const on = (k: keyof typeof v) => (val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    setErrors((e) => { if (!e[k]) return e; const n = { ...e }; delete n[k]; return n; });
  };

  const submit = () => {
    const e: Record<string, string> = {};
    if (!types.length && !v.typeOther.trim()) e.type = "Please choose at least one answer that fits.";
    if (c.orgRequired && v.org.trim().length < 2) e.org = `Please add your ${c.orgLabel.toLowerCase()}.`;
    if (v.contact.trim().length < 2) e.contact = "Please add the name of the person we should speak to.";
    const ph = normalisePhone(v.phone);
    if (!ph.ok) e.phone = "Please add a phone number we can reach on WhatsApp. For example 0712 345 678, or with the country code, like +44 7911 123456.";
    if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "That email does not look right yet. Check it, or leave it empty.";
    if (v.message.trim().length < 5) e.message = "Please write a few words about your enquiry.";
    Object.assign(e, validateExtras({ outlets, contacts }), validateReach(reach, v.email));
    setErrors(e);
    if (Object.keys(e).length) { setTimeout(() => focusSummary(summary.current), 0); return; }
    setSent(sendEnquiry({
      prefix: c.prefix, intro: c.intro, consent, leadType: c.lead,
      extra: { request_count: types.length + (v.typeOther.trim() ? 1 : 0), product_count: products.filter((p) => p.slug).length, outlet_count: outlets.length },
      fields: tradeFields({ kind, types, typeOther: v.typeOther, org: v.org, main: { role: "Ordering contact", name: v.contact, phone: ph.ok ? ph.e164 : v.phone, email: v.email }, contacts, outlets, products, message: v.message, reach }),
    }));
  };

  if (sent) return <EnquiryResult sent={sent} onAnother={() => setSent(null)} />;
  const list = Object.entries(errors).map(([id, message]) => ({ id, message }));
  return (
    <form noValidate onSubmit={(ev) => { ev.preventDefault(); submit(); }} className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
      <ErrorSummary errors={list} headingRef={summary} />
      <CheckList id="type" legend={c.typeLegend} error={errors.type} values={types} onChange={(t) => { setTypes(t); setErrors((e) => { const n = { ...e }; delete n.type; return n; }); }} options={c.types} />
      <TextField id="typeOther" label={c.typeOtherLabel} optional value={v.typeOther} onChange={on("typeOther")} maxLength={120} hint="If none of the choices fit, tell us in your own words." />
      <TextField id="org" label={c.orgLabel} optional={!c.orgRequired} autoComplete="organization" value={v.org} onChange={on("org")} error={errors.org} />
      <TextField id="contact" label="Contact person's full name" hint="Any name is fine. One name is enough." autoComplete="name" value={v.contact} onChange={on("contact")} error={errors.contact} maxLength={120} />
      <TextField id="phone" label="Your WhatsApp or phone number" hint="We reply on WhatsApp. For example 0712 345 678, or +44 7911 123456 from abroad." type="tel" inputMode="tel" autoComplete="tel" value={v.phone} onChange={on("phone")} error={errors.phone} />
      <TextField id="email" label="Email" optional type="email" inputMode="email" autoComplete="email" value={v.email} onChange={on("email")} error={errors.email} />
      <ContactList rows={contacts} onChange={setContacts} errors={errors} />
      {c.locations ? <OutletList rows={outlets} onChange={setOutlets} errors={errors} title={kind === "supply" ? "Where you work from" : "Your locations"} hint={kind === "supply" ? "Add each place you supply from. Optional." : undefined} /> : null}
      {c.products ? <ProductPicker rows={products} onChange={setProducts} withSize={c.productSizes} title={c.productTitle} /> : null}
      <TextareaField id="message" label={c.messageLabel} hint={c.messageHint} maxLength={800} rows={5} value={v.message} onChange={on("message")} error={errors.message} />
      <ReachFields idBase="reach" value={reach} onChange={setReach} errors={errors} />
      <CheckboxField id="consent" checked={consent} onChange={setConsent} label="Yes, you may send me news and offers on WhatsApp or email." hint="This is optional. I can say stop at any time." />
      <p className="text-base text-stone">{c.privacy}</p>
      <button type="submit" className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[.9375rem] font-semibold sm:w-fit">
        <Icon name="whatsapp" size={24} />{c.button}
      </button>
    </form>
  );
}
