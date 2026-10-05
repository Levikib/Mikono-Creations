"use client";
import { useState } from "react";
import { whatsappUrl } from "@/lib/env";
import { PHONE_DIGITS } from "@/lib/site";

const OTHER = "Other, tell us";
const TYPES = ["Access (see my data)", "Correct my data", "Delete my data", "Object to a use of my data", "Restrict a use of my data", "Move my data to another provider", "Withdraw a consent", OTHER];
const REPLY = ["WhatsApp", "Phone call", "SMS", "Email", OTHER];

/** Builds a WhatsApp or email message. Nothing is sent from this page, and it never asks for an ID document. */
export function DataRequestForm() {
  const [type, setType] = useState(TYPES[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState("");
  const [verify, setVerify] = useState("");
  const [note, setNote] = useState("");
  const [typeOther, setTypeOther] = useState("");
  const [reply, setReply] = useState("");
  const [replyOther, setReplyOther] = useState("");
  const [access, setAccess] = useState("");
  const message = [
    "Hello Mikono Creations, I would like to make a data request.",
    `Request type: ${type === OTHER ? `Other: ${typeOther || "(not given)"}` : type}`,
    `Name: ${name || "(not given)"}`,
    `Phone I used with Mikono: ${phone || "(not given)"}`,
    order ? `Order reference: ${order}` : "",
    verify ? `So you can check it is me: ${verify}` : "",
    note ? `What I would like: ${note}` : "",
    reply ? `Please reply by: ${reply === OTHER ? `Other: ${replyOther || "(not given)"}` : reply}` : "",
    access ? `What would make this easier for me: ${access}` : "",
    "Please do not ask me for an ID document. I have not included a child's name, school or age.",
  ].filter(Boolean).join("\n");
  const wa = whatsappUrl(message) ?? `https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(message)}`;
  const mail = `mailto:?subject=${encodeURIComponent("Data request")}&body=${encodeURIComponent(message)}`;
  return (
    <section id="request-form" aria-labelledby="request-form-h">
      <h2 id="request-form-h">Make a request</h2>
      <p>Fill this in and choose how to send it. The message opens in WhatsApp or your email app for you to check and send. Nothing is sent from this page. Do not add an ID number or a photo of an ID.</p>
      <form className="legal-form" onSubmit={(e) => e.preventDefault()}>
        <label>Request type
          <select value={type} onChange={(e) => setType(e.target.value)}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        </label>
        {type === OTHER ? <label>What kind of request? In your own words<input value={typeOther} onChange={(e) => setTypeOther(e.target.value)} maxLength={120} autoComplete="off" /></label> : null}
        <label>Your full name<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
        <label>Phone number you used with Mikono<input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" /></label>
        <label>Order reference, if you have one<input value={order} onChange={(e) => setOrder(e.target.value)} /></label>
        <label>One detail that helps us check it is you (for example the animal you ordered)<input value={verify} onChange={(e) => setVerify(e.target.value)} /></label>
        <label>What you would like<textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} /></label>
        <label>How would you like us to reply? (optional)
          <select value={reply} onChange={(e) => setReply(e.target.value)}><option value="">No preference</option>{REPLY.map((t) => <option key={t}>{t}</option>)}</select>
        </label>
        {reply === OTHER ? <label>Which other way?<input value={replyOther} onChange={(e) => setReplyOther(e.target.value)} maxLength={120} autoComplete="off" /></label> : null}
        <label>Anything that would make this easier for you? (optional)<textarea rows={2} value={access} onChange={(e) => setAccess(e.target.value)} maxLength={300} /></label>
        <div className="flex flex-wrap gap-2">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp hit-y inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold">Send on WhatsApp</a>
          <a href={mail} className="btn-secondary hit-y inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold">Write an email</a>
        </div>
      </form>
    </section>
  );
}
