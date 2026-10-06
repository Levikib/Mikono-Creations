"use client";
import Link from "next/link";
import { contactChannels, customerTypesLabel, isB2b, languages } from "@/data/checkout";
import { TERMS_ACCEPT } from "@/data/legal";
import { CONSENT_INTRO, CONSENT_NOTICE, CONSENT_TRANSPORT, consentTexts, type ConsentPurpose } from "@/data/consent";
import { OTHER_AREA } from "@/data/deliveryAreas";
import { completeOccasions, occasionLine, occasionText, type Errors, type Form, type StepId, type Ticks } from "@/lib/orderForm";
import { normalisePhone } from "@/lib/phone";
import { countAnimals } from "@/lib/plural";
import { ITEMS_TOTAL_LABEL, itemsTotal, type MsgLine } from "@/lib/whatsapp";
import { formatKes } from "@/lib/pricing";
import { sizeWord } from "@/lib/sizes";
import { Button } from "../Button";
import { CheckboxField, TextareaField, TextField } from "../Form";
import { PAYMENT_METHODS_NOTE, PAYMENT_METHODS_TITLE, PAYMENT_NOTE, PAYMENT_OTHER_MAX, paymentMethods, paymentTiming } from "@/data/studio/payment";
import { ChipChecks, Segmented } from "./ui";
import { OccasionFields, type Setter } from "./steps";
import { dropItems, dropLabel, type SplitLine } from "@/lib/split";

function Block({ title, step, onEdit, children, link }: { title: string; step?: StepId; onEdit?: (s: StepId) => void; link?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] bg-paper px-3 py-2 shadow-clay-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[.875rem]">{title}</h3>
        {step && onEdit ? (
          <button type="button" onClick={() => onEdit(step)} className="ck-tbtn">Edit<span className="sr-only"> {title.toLowerCase()}</span></button>
        ) : link ? (
          <Link href={link} className="ck-tbtn">Change<span className="sr-only"> {title.toLowerCase()}</span></Link>
        ) : null}
      </div>
      <div className="grid gap-0.5 text-[.875rem]">{children}</div>
    </section>
  );
}

/** A12****89B: shown masked on the review, the full value only goes into the WhatsApp message. */
export const maskPin = (s: string) => (s.length > 4 ? `${s.slice(0, 3)}****${s.slice(-3)}` : "****");

/** Turns the link phrases of the terms text into links. The text itself lives in data/legal.ts. */
function linkify(text: string): React.ReactNode[] {
  let parts: Array<string | React.ReactElement> = [text];
  for (const l of TERMS_ACCEPT.links) {
    const next: Array<string | React.ReactElement> = [];
    parts.forEach((p, i) => {
      if (typeof p !== "string" || !p.includes(l.phrase)) { next.push(p); return; }
      const [a, ...rest] = p.split(l.phrase);
      next.push(a, <Link key={`${l.phrase}${i}`} href={l.href} className="hit font-semibold text-terracotta-deep underline underline-offset-4">{l.phrase}</Link>, rest.join(l.phrase));
    });
    parts = next;
  }
  return parts;
}

export function StepReview({ form, set, errors, lines, skipGift, skipAbout, ticks, setTick, onEdit, message, numberSet, copied, onCopy, count, remember }: {
  form: Form; set: Setter; errors: Errors; lines: MsgLine[]; skipGift: boolean; skipAbout: boolean; ticks: Ticks;
  setTick: (k: ConsentPurpose, v: boolean) => void; onEdit: (s: StepId) => void; message: string; numberSet: boolean;
  copied: string; onCopy: () => void; count: number; remember: boolean;
}) {
  const ph = normalisePhone(form.phone);
  const rp = normalisePhone(form.recipientPhone);
  const where = form.fulfilment === "pickup" ? "Collect it. We agree the place and time on WhatsApp."
    : form.fulfilment === "collect" ? "Someone else will collect it. We confirm who and where on WhatsApp."
    : form.fulfilment === "abroad" ? `Outside Kenya (to be confirmed): ${form.fulfilmentOther}`
    : form.fulfilment === "other" ? `Other: ${form.fulfilmentOther}`
    : form.fulfilment === "nairobi" ? `Nairobi, ${form.area === OTHER_AREA ? form.areaOther : form.area}. ${form.landmark}`
    : `${form.fulfilment === "courier" ? "Courier or bus parcel service: " : ""}${form.town}, ${form.county} county${form.landmark ? `. ${form.landmark}` : ""}`;
  const hasGift = !skipGift && (form.giftNote || form.anonymous || form.sendDirect) && !form.split;
  const b2b = isB2b(form.customerTypes);
  const occ = completeOccasions(form);
  const splitLines: SplitLine[] = lines;
  const hasAbout = !skipAbout && (occ.length || form.interests.length || form.heardFrom.length);
  const channel = form.contactChannels.map((v) => (v === "other" ? `Other: ${form.channelOther}` : contactChannels.find((c) => c.value === v)?.label ?? "")).filter(Boolean).join(", ");
  const lang = form.language === "other" ? `Other: ${form.langOther}` : languages.find((c) => c.value === form.language)?.label ?? "";
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
      <Block title="Items" link="/cart">
        {lines.map((l) => (
          <p key={l.sku}>
            <span className="font-semibold">{l.qty} x {l.name}</span>, {l.colourLabel}, {sizeWord(l.size)}
            {typeof l.totalKes === "number" && typeof l.unitKes === "number" ? <span data-testid="review-line-price">, {formatKes(l.unitKes)} each, <span className="price">{formatKes(l.totalKes)}</span></span> : null}
            {l.note ? <span className="text-stone">. Note: {l.note}</span> : null}
          </p>
        ))}
        {itemsTotal(lines).any ? <p data-testid="review-items-total" className="font-semibold">{itemsTotal(lines).all ? ITEMS_TOTAL_LABEL : "Items total, priced items only (delivery not included)"}: <span className="price">{formatKes(itemsTotal(lines).totalKes)}</span></p> : null}
        <p className="text-[.8125rem] text-stone">{countAnimals(count)}. {itemsTotal(lines).any ? "Delivery to be confirmed on WhatsApp." : "Delivery is confirmed on WhatsApp."}</p>
      </Block>
      <Block title="Who is ordering" step="who" onEdit={onEdit}><p>{customerTypesLabel(form.customerTypes, form.customerOther)}</p></Block>
      <Block title="Your details" step="details" onEdit={onEdit}>
        <p>{form.name}, {ph.ok ? ph.display : form.phone}</p>
        {form.email ? <p>{form.email}</p> : null}
        <p className="text-[.8125rem] text-stone">Reach you by {channel}. Reply in {lang}.</p>
        {form.access.trim() ? <p className="text-[.8125rem] text-stone">To make this easier: {form.access}</p> : null}
        {remember ? <p className="text-[.8125rem] text-stone">Saved on this device after you send.</p> : null}
      </Block>
      <Block title={form.split ? `Delivery to ${form.drops.length} places` : "Delivery or pickup"} step="delivery" onEdit={onEdit}>
        {form.split ? form.drops.map((d, i) => (
          <div key={d.id} className="rounded-[var(--radius-input)] bg-oat px-2.5 py-1.5" data-testid="review-drop">
            <p className="font-semibold">{dropLabel(d, i)}</p>
            <p className="text-[.8125rem]">{d.fulfilment === "abroad" || d.fulfilment === "other" ? d.other : d.landmark || ""} {d.recipientName ? `Adult: ${d.recipientName}, ${normalisePhone(d.recipientPhone).ok ? (normalisePhone(d.recipientPhone) as { display: string }).display : d.recipientPhone}` : ""}</p>
            <ul className="text-[.8125rem] text-stone">{dropItems(splitLines, d).map((l) => <li key={l.sku}>{l.qty} x {l.name}, {l.colourLabel}, {sizeWord(l.size)}</li>)}</ul>
            {d.giftNote ? <p className="text-[.8125rem]">Gift note: {d.giftNote}</p> : null}
          </div>
        )) : <p>{where}</p>}
        {form.deliveryNotes ? <p className="text-stone">{form.deliveryNotes}</p> : null}
        {!form.split && (form.recipientDifferent || form.sendDirect) ? <p>Receiving adult: {form.recipientName}, {rp.ok ? rp.display : form.recipientPhone}</p> : null}
        {form.dateFlex === "asap" ? <p>As soon as possible</p> : form.dateFlex === "flexible" ? <p>Date: flexible</p> : form.dateWish ? <p>Day wished for: {form.dateWish}</p> : null}
        {form.fulfilment !== "pickup" && form.fulfilment !== "collect" ? <p className="text-[.8125rem] text-stone">Delivery cost depends on where it is going and is confirmed in your quote.</p> : null}
      </Block>
      {hasGift ? (
        <Block title="Gift options" step="gift" onEdit={onEdit}>
          {form.giftNote ? <p>Note: {form.giftNote}</p> : null}
          {form.anonymous ? <p>Sender name hidden.</p> : null}
          {form.sendDirect ? <p>Sent straight to the person receiving it.</p> : null}
        </Block>
      ) : null}
      {b2b ? (
        <Block title="Business details" step="business" onEdit={onEdit}>
          <p>{form.businessName}{form.businessType ? ` (${form.businessType === "Other, tell us" ? `Other: ${form.businessTypeOther}` : form.businessType})` : ""}</p>
          {form.outletLocation ? <p>Outlet: {form.outletLocation}</p> : null}
          {form.volumeBand ? <p>{form.volumeBand}</p> : null}
          {form.invoiceName ? <p>Invoice name: {form.invoiceName}</p> : null}
          {form.kraPin ? <p>KRA PIN: {maskPin(form.kraPin)} <span className="text-[.8125rem] text-stone">(goes only into your WhatsApp message)</span></p> : null}
          {form.poNumber ? <p>PO number: {form.poNumber}</p> : null}
        </Block>
      ) : null}
      {hasAbout ? (
        <Block title="About you" step="about" onEdit={onEdit}>
          {occ.length ? <p>Occasions: {occ.map(occasionLine).join("; ")}</p> : null}
          {form.interests.length ? <p>Likes: {form.interests.map((x) => (x === "Other, tell us" ? `Other: ${form.interestOther}` : x)).join(", ")}</p> : null}
          {form.heardFrom.length ? <p>Heard about us: {form.heardFrom.map((x) => (x === "Other, tell us" ? `Other: ${form.heardOther}` : x)).join(", ")}</p> : null}
        </Block>
      ) : null}

      <section aria-labelledby="pay-h" className="grid gap-2 rounded-[var(--radius-card)] bg-oat px-3 py-2.5">
        <h3 id="pay-h" className="text-[.875rem]">Payment and notes</h3>
        <Segmented id="payTiming" legend="When would you like to pay? (optional)" value={form.payTiming} onChange={(v) => set("payTiming", v)}
          options={paymentTiming.map((x) => ({ value: x.id, label: x.label }))} hint="You pay nothing on this site. For a deposit, the amount is confirmed in your quote." />
        <ChipChecks legend={`${PAYMENT_METHODS_TITLE} (optional)`} name="payMethods" values={form.payMethods} options={paymentMethods.map((m) => m.id)} labels={Object.fromEntries(paymentMethods.map((m) => [m.id, m.label]))}
          onChange={(v) => set("payMethods", v)} hint={PAYMENT_METHODS_NOTE} />
        {form.payMethods.includes("other") ? <TextField id="payOther" label="Which other way to pay?" value={form.payOther} maxLength={PAYMENT_OTHER_MAX} autoComplete="off" onChange={(v) => set("payOther", v)} error={errors.payOther} /> : null}
        <TextareaField id="paymentNote" label="Anything we should know about payment" optional rows={2} maxLength={300} value={form.paymentNote} onChange={(v) => set("paymentNote", v)}
          hint={`In your own words. ${PAYMENT_NOTE}`} />
        <TextareaField id="notes" label="Anything else we should know?" optional rows={2} maxLength={500} value={form.notes} onChange={(v) => set("notes", v)} hint="Colour wishes or questions, for example." />
      </section>

      <fieldset className="grid gap-1.5 rounded-[var(--radius-card)] bg-oat px-3 py-2.5">
        <legend className="px-1 text-[.875rem] font-semibold text-baobab">Your choices</legend>
        <p className="text-[.8125rem] text-stone">{CONSENT_INTRO}</p>
        {(["whatsapp_updates", "email_newsletter", "occasion_reminders"] as const).map((k) => (
          <div key={k}>
            <CheckboxField id={k} checked={ticks[k]} onChange={(v) => setTick(k, v)} label={consentTexts[k]} error={errors[k]} />
            {k === "occasion_reminders" && ticks[k] ? (
              <div className="mt-1.5 rounded-[var(--radius-input)] bg-paper p-2.5">
                <OccasionFields form={form} set={set} errors={errors} />
                {occasionText(form) ? <p className="mt-1 text-[.8125rem] text-olive-deep">We will remind you about: {occasionText(form)}.</p> : null}
              </div>
            ) : null}
          </div>
        ))}
        <p className="text-[.8125rem] text-stone">{CONSENT_TRANSPORT}</p>
        <div className="mt-1 border-t border-sand pt-2">
          <CheckboxField id="terms_acknowledged" checked={ticks.terms_acknowledged} onChange={(v) => setTick("terms_acknowledged", v)} error={errors.terms_acknowledged}
            label={<>{linkify(TERMS_ACCEPT.text)} <span className="text-stone">(Required)</span></>} />
        </div>
        <p className="text-[.8125rem] text-stone">{CONSENT_NOTICE} Your rights are on the <Link href="/privacy" className="hit font-semibold text-terracotta-deep underline underline-offset-4">Privacy page</Link>.</p>
      </fieldset>

      <div>
        {numberSet ? (
          <details className="rounded-[var(--radius-card)] bg-oat px-3">
            <summary className="flex min-h-11 cursor-pointer items-center text-[.875rem] font-semibold text-baobab">See the message we will send</summary>
            <pre className="mb-2 whitespace-pre-wrap break-words font-sans text-[.8125rem]" tabIndex={0} aria-label="Order message">{message}</pre>
          </details>
        ) : (
          <div role="note" className="rounded-[var(--radius-card)] border-2 border-ochre bg-ochre-tint p-3">
            <p className="font-semibold">The shop&rsquo;s WhatsApp number is not set on this site yet.</p>
            <p className="mt-1 text-[.875rem]">The button below copies your order message. Please paste it into WhatsApp and send it to us.</p>
            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-[var(--radius-input)] bg-bone p-2 font-sans text-[.8125rem]" tabIndex={0} aria-label="Order message">{message}</pre>
          </div>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="compact" onClick={onCopy}>Copy order text instead</Button>
          <span role="status" aria-live="polite" className="text-[.8125rem] text-olive-deep">{copied}</span>
        </div>
      </div>
      <p className="text-[.8125rem] text-stone">Nothing is charged here. We reply on WhatsApp to confirm items and delivery, and to arrange payment with you there. Details are confirmed after you send.</p>
    </div>
  );
}

