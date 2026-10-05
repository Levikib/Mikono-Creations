"use client";
import { useRef, useState } from "react";
import { normalisePhone } from "@/lib/phone";
import { sendEnquiry, type Sendable } from "@/lib/enquiry";
import { OTHER_LABEL, contactFields, emptyReach, validateReach, type ProductInterest, type Reach } from "@/lib/enquiryForm";
import { ErrorSummary, focusSummary, TextareaField, TextField } from "./Form";
import { CheckList, ProductPicker, ReachFields } from "./enquiry/Multi";
import { EnquiryResult } from "./EnquiryResult";
import { Icon } from "./Icon";
import "./cart/checkout.css";

const topicOptions = ["A question about an order", "Animals, colours or sizes", "Delivery or pickup", "Prices or payment", "Wholesale or trade", "A custom piece", "A gift or an event", "A return or a problem", "Feedback or a compliment", OTHER_LABEL].map((v) => ({ value: v, label: v }));

export function ContactForm() {
  const [v, setV] = useState({ name: "", phone: "", email: "", message: "", topicOther: "" });
  const [reach, setReach] = useState<Reach>(emptyReach());
  const [topics, setTopics] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductInterest[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Sendable | null>(null);
  const summary = useRef<HTMLHeadingElement>(null);
  const on = (k: keyof typeof v) => (val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    setErrors((e) => { if (!e[k]) return e; const n = { ...e }; delete n[k]; return n; });
  };

  const submit = () => {
    const e: Record<string, string> = {};
    if (v.message.trim().length < 3) e.message = "Please write your message.";
    if (v.phone.trim() && !normalisePhone(v.phone).ok) e.phone = "That number does not look right yet. Use a number like 0712 345 678, or with the country code, like +44 7911 123456. You can also leave it empty.";
    if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "That email does not look right yet. Check it, or leave it empty.";
    Object.assign(e, validateReach(reach, v.email));
    setErrors(e);
    if (Object.keys(e).length) { setTimeout(() => focusSummary(summary.current), 0); return; }
    setSent(sendEnquiry({
      prefix: "CT", intro: "Hello Mikono Creations, I have a question.", consent: false, leadType: "contact",
      extra: { request_count: topics.length, product_count: products.filter((p) => p.slug).length },
      fields: contactFields({ topics, topicOther: v.topicOther, name: v.name, phone: v.phone, email: v.email, products, message: v.message, reach }),
    }));
  };

  if (sent) return <EnquiryResult sent={sent} onAnother={() => { setSent(null); setV({ name: "", phone: "", email: "", message: "", topicOther: "" }); setTopics([]); setProducts([]); setReach(emptyReach()); }} />;
  return (
    <form noValidate onSubmit={(ev) => { ev.preventDefault(); submit(); }} className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
      <ErrorSummary errors={Object.entries(errors).map(([id, message]) => ({ id, message }))} headingRef={summary} />
      <CheckList id="topics" legend="What is it about?" hint="Choose all that apply. Optional." values={topics} onChange={setTopics} options={topicOptions} />
      {topics.includes(OTHER_LABEL) ? <TextField id="topicOther" label="What is it about? In your own words" optional value={v.topicOther} maxLength={120} autoComplete="off" onChange={on("topicOther")} /> : null}
      <TextField id="name" label="Your full name" optional hint="Any name is fine. One name is enough." autoComplete="name" value={v.name} onChange={on("name")} maxLength={120} />
      <TextField id="phone" label="Your phone number" optional hint="Add it if you would like a call back. Numbers from other countries work with the country code." type="tel" inputMode="tel" autoComplete="tel" value={v.phone} onChange={on("phone")} error={errors.phone} />
      <TextField id="email" label="Email" optional type="email" inputMode="email" autoComplete="email" value={v.email} onChange={on("email")} error={errors.email} hint="Only if you would like a reply by email." />
      <ProductPicker idBase="ask" title="Animals you are asking about" hint="Optional. Add as many as you like." rows={products} onChange={setProducts} withSize />
      <TextareaField id="message" label="Your message" rows={5} maxLength={800} value={v.message} onChange={on("message")} error={errors.message} />
      <ReachFields idBase="reach" value={reach} onChange={setReach} errors={errors} />
      <button type="submit" className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[.9375rem] font-semibold sm:w-fit">
        <Icon name="whatsapp" size={24} />Send on WhatsApp
      </button>
    </form>
  );
}
