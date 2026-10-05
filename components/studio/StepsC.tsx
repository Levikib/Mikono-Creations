"use client";
import { useState } from "react";
import { CheckboxField, SelectField, TextField, TextareaField } from "../Form";
import { Icon } from "../Icon";
import { LinkCard } from "../card";
import { cx } from "@/lib/cx";
import {
  AREA_PICKUP, BUDGET_HINT, BUDGET_TEXT_MAX, CHILD_LINE, EVENT_LABEL_MAX, FEE_LINE, GIFT_CARD_HINT, GIFT_CARD_MAX, GIFT_DIRECT_NOTE, GIFT_NOTE_HINT,
  GIFT_NOTE_MAX, INTERNATIONAL_NOTE, LEAD_NOTICE, MAX_ADDRESSES, MONTHS, MULTI_NOTE, PRIVACY_LINE, SITE_LABEL_MAX, SOON_NOTICE, SUSTAIN_ASK, SUSTAIN_LINE,
  BUDGET_CHOICES, BUDGET_TITLE, REPLY_TIME, EXACT_LINE, PAYMENT_METHODS_NOTE, PAYMENT_METHODS_TITLE, PAYMENT_NOTE, paymentMethods, paymentTiming, budgetBands, businessFields, businessTypes, contactChannels, contactHours, deadlinePresets, deadlineTypes, deliveryMethods, languages, LANGUAGE_NOTE, OTHER_ID, OTHER_DELIVERY_NOTE, COLLECT_NOTE, withOther,
  marketingConsents, occasions, packaging, rushOptions, termsDocs, termsHint, wrappingStyles, PHOTO_CONSENT, BUDGET_PER,
} from "@/data/studio";
import { OTHER_AREA, sortedAreaNames } from "@/data/deliveryAreas";
import { counties } from "@/data/counties";
import { isSoon, daysUntil, weeksAheadISO } from "@/lib/studio/validate";
import { daysBand, studioTrack } from "@/lib/studio/track";
import { briefMeter } from "@/lib/studio/summary";
import { needsPhotoConsent, wantsBusiness, wantsMultiAddress } from "@/lib/studio/flow";
import type { StepId } from "@/lib/studio/types";
import { BriefCard } from "./BriefCard";
import { newId, type StepProps } from "./StepsA";
import { Chips, Group, More, Note, OtherText, Pill, hasOther } from "./ui";

/* ---------------- occasion and timing ---------------- */
export function OccasionSection({ state, dispatch }: StepProps) {
  const b = state.brief;
  const [mm, dd] = b.occasionDayMonth ? b.occasionDayMonth.split("-") : ["", ""];
  const monthName = mm ? MONTHS[parseInt(mm, 10) - 1] ?? "" : "";
  const dayName = dd ? String(parseInt(dd, 10)) : "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const setM = (name: string) => { const i = MONTHS.indexOf(name as (typeof MONTHS)[number]); dispatch({ type: "brief", patch: { occasionDayMonth: i < 0 ? "" : `${pad(i + 1)}-${dd || "01"}` } }); };
  const setD = (d: string) => dispatch({ type: "brief", patch: { occasionDayMonth: d ? `${mm || "01"}-${pad(parseInt(d, 10))}` : "" } });
  return (
    <div className="grid gap-2.5">
      <Group id="occasions" legend="Is there an occasion?" hint="Select all that apply." optional>
        <Chips name="Occasions" multi list={occasions} value={b.occasions} onToggle={(id) => dispatch({ type: "toggle", field: "occasions", id })} />
        {hasOther(b.occasions) ? <OtherText id="occasions-other" label="Which occasion? In your own words" value={b.others.occasions ?? ""} onChange={(v) => dispatch({ type: "other", key: "occasions", value: v })} className="mt-2" hint="A kind of occasion only. No names." /> : null}
      </Group>
      {b.occasions.length > 0 && !b.occasions.includes("none") ? (
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Day and month of the occasion">
          <SelectField id="occasion-month" label="Month of the occasion" optional placeholder="Month" options={MONTHS} value={monthName} onChange={setM} autoComplete="off" />
          <SelectField id="occasion-day" label="Day" optional placeholder="Day" options={Array.from({ length: 31 }, (_, i) => String(i + 1))} value={dayName} onChange={setD} autoComplete="off" />
          <p className="col-span-2 text-[.75rem] st-soft">Day and month only. We never ask for a year or a name.</p>
        </div>
      ) : null}
    </div>
  );
}

export function DeadlineSection({ state, dispatch, errors, minDate }: StepProps) {
  const b = state.brief;
  const setType = (t: "hard" | "asap" | "flexible" | "unsure" | "") => {
    dispatch({ type: "brief", patch: { deadlineType: t, deadlineDate: t === "hard" ? b.deadlineDate : "", rush: t === "hard" || t === "asap" ? b.rush : "" } });
    if (t) studioTrack("studio_deadline_set", { type: t });
  };
  const preset = (weeks: number) => {
    const d = weeksAheadISO(weeks);
    dispatch({ type: "brief", patch: { deadlineType: "hard", deadlineDate: d } });
    studioTrack("studio_deadline_set", { type: "hard", days_out_band: daysBand(daysUntil(d)) });
  };
  return (
    <div className="grid gap-2.5">
      <Group id="deadlineType" legend="When do you need it?" hint={LEAD_NOTICE} error={errors.deadlineType}>
        <Chips name="Deadline" list={deadlineTypes} value={[b.deadlineType]} onToggle={(id, on) => setType(on ? (id as "hard") : "")} />
      </Group>
      {b.deadlineType === "asap" ? (
        <div className="st-surface st-rise grid gap-2.5 p-3">
          <Note>{SOON_NOTICE}</Note>
          <Group id="rush" legend="A faster option?" optional tbc hint="We tell you honestly whether one exists.">
            <Chips name="Faster option" list={rushOptions} value={[b.rush]} onToggle={(id, on) => dispatch({ type: "brief", patch: { rush: on ? (id as "yes") : "" } })} />
          </Group>
        </div>
      ) : null}
      {b.deadlineType === "hard" ? (
        <div className="st-surface st-rise grid gap-2.5 p-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Date shortcuts">
            {deadlinePresets.map((p) => <button key={p.id} type="button" onClick={() => preset(p.weeks)} className="st-pill st-pill-btn">{p.label}</button>)}
          </div>
          <TextField id="deadlineDate" label="Or pick the date" type="date" min={minDate} value={b.deadlineDate} autoComplete="off" enterKeyHint="next"
            onChange={(v) => { dispatch({ type: "brief", patch: { deadlineDate: v } }); if (v) studioTrack("studio_deadline_set", { type: "hard", days_out_band: daysBand(daysUntil(v)) }); }} error={errors.deadlineDate} />
          {b.deadlineDate && isSoon(b.deadlineDate) ? <Note>{SOON_NOTICE}</Note> : null}
          <Group id="rush" legend="A faster option?" optional tbc hint="We tell you honestly whether one exists.">
            <Chips name="Faster option" list={rushOptions} value={[b.rush]} onToggle={(id, on) => dispatch({ type: "brief", patch: { rush: on ? (id as "yes") : "" } })} />
          </Group>
        </div>
      ) : null}
    </div>
  );
}

export function EventSection({ state, dispatch }: StepProps) {
  const b = state.brief;
  return (
    <More title="Event name and date" count={(b.eventLabel ? 1 : 0) + (b.eventDate ? 1 : 0)} open={!!(b.eventLabel || b.eventDate)}>
      <TextField id="eventLabel" label="Event or project name" optional value={b.eventLabel} maxLength={EVENT_LABEL_MAX} autoComplete="off" hint="For a party, wedding, launch or campaign. Not a child's name." onChange={(v) => dispatch({ type: "brief", patch: { eventLabel: v } })} />
      <TextField id="eventDate" label="Event date" optional type="date" value={b.eventDate} autoComplete="off" onChange={(v) => dispatch({ type: "brief", patch: { eventDate: v } })} />
    </More>
  );
}

export function TimingStep(props: StepProps) {
  return <div className="grid gap-3"><OccasionSection {...props} /><DeadlineSection {...props} /><EventSection {...props} /></div>;
}

/* ---------------- delivery ---------------- */
export function DeliverySection({ state, dispatch, errors, path }: StepProps) {
  const b = state.brief;
  const c = state.contact;
  const [more, setMore] = useState(false);
  const multi = (path === "full" && wantsMultiAddress(b)) || more || b.addresses.length > 1;
  const areas = [...sortedAreaNames(), OTHER_AREA];
  const list = multi ? b.addresses : b.addresses.slice(0, 1);
  return (
    <div className="grid gap-3">
      {multi ? <Note icon="sparkle">{MULTI_NOTE}</Note> : null}
      {list.map((a, i) => {
        const k = (s: string) => `addr-${a.id}-${s}`;
        const needsArea = a.method === "nairobi" || a.method === "gift-direct";
        const needsTown = a.method === "town" || a.method === "courier";
        const needsPlace = a.method === "international" || a.method === "other";
        const r = c.recipients[a.id] ?? { name: "", phone: "" };
        return (
          <section key={a.id} className={cx("grid gap-2.5", multi && "st-surface p-3")} aria-label={multi ? `Delivery address ${i + 1}` : "Delivery"} data-address>
            {multi ? (
              <div className="flex items-center justify-between gap-2">
                <p className="text-[.8125rem] font-semibold">Address {i + 1}</p>
                {b.addresses.length > 1 ? <button type="button" className="st-link min-h-11 text-[.8125rem]" onClick={() => dispatch({ type: "removeAddress", id: a.id })} aria-label={`Remove address ${i + 1}`}>Remove</button> : null}
              </div>
            ) : null}
            <Group id={k("method")} legend="How should it reach you?" hint={i === 0 ? FEE_LINE : undefined} error={errors[k("method")]}>
              <Chips name={`Delivery method ${i + 1}`} list={deliveryMethods} value={[a.method]} onToggle={(id, on) => dispatch({ type: "address", id: a.id, patch: { method: on ? id : "", area: "", areaOther: "", county: "" } })} />
            </Group>
            {multi ? (
              <div className="grid gap-2 sm:grid-cols-2">
                <TextField id={k("label")} label="Site or branch name" optional value={a.label} maxLength={SITE_LABEL_MAX} autoComplete="off" hint="For example Nakuru branch" onChange={(v) => dispatch({ type: "address", id: a.id, patch: { label: v } })} />
                <TextField id={k("share")} label="How many go here?" optional value={a.share} maxLength={40} autoComplete="off" inputMode="numeric" hint="For example 12" onChange={(v) => dispatch({ type: "address", id: a.id, patch: { share: v } })} />
              </div>
            ) : null}
            {needsArea ? (
              <SelectField id={k("area")} label="Which area of Nairobi?" placeholder="Choose an area" options={areas} value={a.area} autoComplete="off" onChange={(v) => dispatch({ type: "address", id: a.id, patch: { area: v, areaOther: "" } })} error={errors[k("area")]} />
            ) : null}
            {needsArea && a.area === OTHER_AREA ? <TextField id={k("areaOther")} label="Which area?" value={a.areaOther} maxLength={80} autoComplete="address-level2" onChange={(v) => dispatch({ type: "address", id: a.id, patch: { areaOther: v } })} error={errors[k("areaOther")]} /> : null}
            {needsTown ? (
              <div className="grid gap-2.5 sm:grid-cols-2">
                <SelectField id={k("county")} label="County" optional placeholder="Choose the county" options={counties} value={a.county} autoComplete="off" onChange={(v) => dispatch({ type: "address", id: a.id, patch: { county: v } })} />
                <TextField id={k("areaOther")} label={a.method === "town" ? "Town or area" : "Town, and the courier or bus office"} value={a.areaOther} maxLength={80}
                  autoComplete="address-level2" onChange={(v) => dispatch({ type: "address", id: a.id, patch: { areaOther: v } })} error={errors[k("areaOther")]}
                  hint={a.method === "courier" ? "Any courier or bus parcel service you choose. We confirm how it reaches them." : "Any town in Kenya."} />
              </div>
            ) : null}
            {needsPlace ? (
              <TextField id={k("areaOther")} label={a.method === "international" ? "Which country and city?" : "How would you like it to reach you?"} value={a.areaOther} maxLength={a.method === "other" ? 120 : 80}
                autoComplete={a.method === "international" ? "address-level2" : "off"} onChange={(v) => dispatch({ type: "address", id: a.id, patch: { areaOther: v } })} error={errors[k("areaOther")]} />
            ) : null}
            {a.method === "international" ? <Note>{INTERNATIONAL_NOTE}</Note> : null}
            {a.method === "other" ? <p className="text-[.75rem] st-soft">{OTHER_DELIVERY_NOTE}</p> : null}
            {a.method === "someone-collects" ? <p className="text-[.75rem] st-soft">{COLLECT_NOTE}</p> : null}
            {a.method === "gift-direct" ? (
              <div className="grid gap-2 sm:grid-cols-2">
                <p className="text-[.75rem] st-soft sm:col-span-2">{GIFT_DIRECT_NOTE}</p>
                <TextField id={k("rname")} label="Adult receiving it" value={r.name} maxLength={80} autoComplete="off" onChange={(v) => dispatch({ type: "recipient", id: a.id, patch: { name: v } })} error={errors[k("rname")]} />
                <TextField id={k("rphone")} label="Their phone" type="tel" inputMode="tel" value={r.phone} maxLength={24} autoComplete="off" hint="For example 0712 345 678, or with the country code" onChange={(v) => dispatch({ type: "recipient", id: a.id, patch: { phone: v } })} error={errors[k("rphone")]} />
              </div>
            ) : null}
          </section>
        );
      })}
      {multi && b.addresses.length < MAX_ADDRESSES ? <div><button type="button" className="st-btn st-btn-sec !min-h-9" onClick={() => dispatch({ type: "addAddress", id: newId("a") })}>Add another address</button></div> : null}
      {multi && b.addresses.length >= MAX_ADDRESSES ? <p className="text-[.75rem] st-soft">That is {MAX_ADDRESSES} addresses. For more, send a second brief or tell us on WhatsApp.</p> : null}
      {!multi ? <div><button type="button" className="st-link min-h-11 text-[.8125rem]" onClick={() => setMore(true)}>Deliver to more than one place?</button></div> : null}
      {list.some((a) => a.method === "pickup") ? <p className="text-[.75rem] st-soft">{AREA_PICKUP} point and times are confirmed on WhatsApp.</p> : null}
    </div>
  );
}

export function DeliveryStep(props: StepProps) { return <DeliverySection {...props} />; }

/* ---------------- business ---------------- */
export function BusinessSection({ state, dispatch, errors }: StepProps) {
  const c = state.contact;
  const set = (patch: Partial<typeof c>) => dispatch({ type: "contact", patch });
  const f = businessFields;
  return (
    <div className="grid gap-2.5">
      <TextField id="bizName" label={f.name.label} value={c.bizName} maxLength={f.name.max} autoComplete="organization" onChange={(v) => set({ bizName: v })} error={errors.bizName} />
      <Group id="bizType" legend="Type of organisation" optional>
        <Chips name="Type of organisation" list={businessTypes} value={[c.bizType]} onToggle={(id, on) => set({ bizType: on ? id : "" })} />
        {c.bizType === OTHER_ID ? <OtherText id="bizType-other" label="What kind of organisation?" value={state.brief.others.bizType ?? ""} onChange={(v) => dispatch({ type: "other", key: "bizType", value: v })} className="mt-2" /> : null}
      </Group>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <TextField id="role" label={f.role.label} optional value={c.role} maxLength={f.role.max} autoComplete="organization-title" hint={f.role.hint} onChange={(v) => set({ role: v })} />
        <TextField id="invoiceName" label={f.invoiceName.label} optional value={c.invoiceName} maxLength={f.invoiceName.max} autoComplete="off" hint={f.invoiceName.hint} onChange={(v) => set({ invoiceName: v })} />
        <TextField id="po" label={f.po.label} optional value={c.po} maxLength={f.po.max} autoComplete="off" onChange={(v) => set({ po: v })} />
        <TextField id="kraPin" label={f.kraPin.label} optional value={c.kraPin} maxLength={f.kraPin.max} autoComplete="off" autoCapitalize="characters" hint={f.kraPin.hint} onChange={(v) => set({ kraPin: v.toUpperCase() })} />
      </div>
    </div>
  );
}

export function BusinessStep(props: StepProps) {
  return (
    <div className="grid gap-3">
      <BusinessSection {...props} />
      <ul data-card-group className="mk-grid mk-grid--1">
        <li><LinkCard tone="olive" icon="store" title="Prefer a wholesale price list?" text="Shops and stockists can ask for a price list and samples." cta={{ label: "Go to wholesale", href: "/wholesale" }} cardType="link" /></li>
      </ul>
    </div>
  );
}

/* ---------------- payment ---------------- */
/** Payment timing (one choice) and an optional list of ways to pay, with Other and a free note. Nothing is paid here. */
export function PaymentSection({ state, dispatch }: StepProps) {
  const b = state.brief; const c = state.contact;
  return (
    <div className="grid gap-2.5">
      <Group id="payTiming" legend="When would you like to pay?" optional hint="Pick one. Nothing is paid on this page.">
        <Chips name="When to pay" list={paymentTiming} value={[b.payTiming]} onToggle={(id, on) => dispatch({ type: "brief", patch: { payTiming: on ? id : "" } })} />
        <p className="mt-1 text-[.75rem] st-soft">{PAYMENT_NOTE}</p>
      </Group>
      <Group id="payMethods" legend={PAYMENT_METHODS_TITLE} hint={PAYMENT_METHODS_NOTE} optional tbc>
        <Chips name="Ways to pay" multi list={paymentMethods} value={b.payMethods} onToggle={(id) => dispatch({ type: "toggle", field: "payMethods", id })} />
        {hasOther(b.payMethods) ? <OtherText id="payMethods-other" label="Which other way to pay?" value={b.others.payMethods ?? ""} onChange={(v) => dispatch({ type: "other", key: "payMethods", value: v })} className="mt-2" /> : null}
      </Group>
      <TextareaField id="payNote" label="Anything we should know about payment?" optional rows={2} maxLength={300} value={c.payNote} onChange={(v) => dispatch({ type: "contact", patch: { payNote: v } })}
        hint="In your own words. We agree the details with you on WhatsApp." />
    </div>
  );
}

/* ---------------- budget and making ---------------- */
export function BudgetSection({ state, dispatch }: StepProps) {
  const b = state.brief;
  const bands = budgetBands;
  return (
    <Group id="budget" legend={BUDGET_TITLE} optional hint={BUDGET_HINT}>
      <div className="grid gap-2">
        <div role="group" aria-label="Budget shortcuts" className="flex flex-wrap gap-1.5">
          {bands.map((band) => (
            <Pill key={band.id} name="budget" value={band.id} checked={b.budgetBand === band.id} onChange={(on) => dispatch({ type: "brief", patch: { budgetBand: on ? band.id : "" } })}>{band.label}</Pill>
          ))}
          {BUDGET_CHOICES.map((x) => (
            <Pill key={x.id} name="budget" value={x.id} checked={b.budgetBand === x.id}
              onChange={(on) => { dispatch({ type: "brief", patch: { budgetBand: on ? x.id : "" } }); studioTrack("studio_budget_set", { band: on ? x.id : "skip" }); }}>{x.label}</Pill>
          ))}
        </div>
        <TextField id="budgetText" label="Tell us your range" optional value={b.budgetText} autoComplete="off" enterKeyHint="next" maxLength={BUDGET_TEXT_MAX} hint="In your own words."
          onChange={(v) => { dispatch({ type: "brief", patch: { budgetText: v } }); if (v) studioTrack("studio_budget_set", { band: "typed" }); }} />
        {b.budgetText.trim() || (b.budgetBand && !["suggest", "unsure", "skip"].includes(b.budgetBand)) ? (
          <Chips name="Budget applies to" list={BUDGET_PER.map((x) => ({ id: x.id, label: x.label, help: "", impactsQuote: "none" as const }))} value={[b.budgetPer]} onToggle={(id, on) => dispatch({ type: "brief", patch: { budgetPer: on ? (id as "total") : "" } })} />
        ) : null}
      </div>
    </Group>
  );
}

export function MakingStep(props: StepProps) {
  const { state, dispatch } = props;
  const b = state.brief;
  const gift = b.packaging.includes("gift-card");
  const wrapped = b.packaging.some((p) => p === "gift-wrap" || p === "gift-box" || p === "branded-pack");
  return (
    <div className="grid gap-3">
      <BudgetSection {...props} />
      <PaymentSection {...props} />
      <Note icon="sparkle">{EXACT_LINE}</Note>
      <Group id="packaging" legend="Packaging and gift note" hint="Select all that apply." optional>
        <Chips name="Packaging" multi list={withOther(packaging)} value={b.packaging} onToggle={(id) => dispatch({ type: "toggle", field: "packaging", id })} />
        {hasOther(b.packaging) ? <OtherText id="packaging-other" label="Which other packaging?" value={b.others.packaging ?? ""} onChange={(v) => dispatch({ type: "other", key: "packaging", value: v })} className="mt-2" /> : null}
      </Group>
      {wrapped ? (
        <Group id="wrapping" legend="Wrapping style" hint="Select all that apply." optional>
          <Chips name="Wrapping" multi list={withOther(wrappingStyles)} value={b.wrapping} onToggle={(id) => dispatch({ type: "toggle", field: "wrapping", id })} />
          {hasOther(b.wrapping) ? <OtherText id="wrapping-other" label="Which other wrapping?" value={b.others.wrapping ?? ""} onChange={(v) => dispatch({ type: "other", key: "wrapping", value: v })} className="mt-2" /> : null}
        </Group>
      ) : null}
      {gift ? <TextField id="giftCardText" label="Gift card message" optional value={b.giftCardText} maxLength={GIFT_CARD_MAX} autoComplete="off" hint={GIFT_CARD_HINT} onChange={(v) => dispatch({ type: "brief", patch: { giftCardText: v } })} /> : null}
      <TextareaField id="giftNote" label="Anything for the packaging or the person receiving it" optional value={b.giftNote} maxLength={GIFT_NOTE_MAX} rows={2} hint={GIFT_NOTE_HINT} onChange={(v) => dispatch({ type: "brief", patch: { giftNote: v } })} />
      <Note icon="sparkle">{SUSTAIN_LINE}</Note>
      <CheckboxField id="sustainInfo" checked={b.sustainInfo} onChange={(v) => dispatch({ type: "brief", patch: { sustainInfo: v } })} label={SUSTAIN_ASK} />
    </div>
  );
}

/* ---------------- contact ---------------- */
export function ContactSection({ state, dispatch, errors, path }: StepProps) {
  const { brief: b, contact: c } = state;
  const set = (patch: Partial<typeof c>) => dispatch({ type: "contact", patch });
  return (
    <div className="grid gap-2.5">
      <p className="text-[.8125rem] st-soft">{PRIVACY_LINE}</p>
      <TextField id="name" label="Your full name" hint="Any name is fine. One name is enough." value={c.name} autoComplete="name" enterKeyHint="next" onChange={(v) => set({ name: v })} error={errors.name} maxLength={120} />
      <TextField id="phone" label="Your WhatsApp or phone number" type="tel" inputMode="tel" autoComplete="tel" enterKeyHint="next" value={c.phone}
        hint="For example 0712 345 678. From another country? Add the country code, like +44 7911 123456. We reply here." onChange={(v) => set({ phone: v })} error={errors.phone} maxLength={24} />
      <TextField id="email" label="Email" optional type="email" inputMode="email" autoComplete="email" enterKeyHint="next" value={c.email} onChange={(v) => set({ email: v })} error={errors.email} maxLength={120} />
      {path === "quick" && wantsBusiness(b) ? <TextField id="bizName" label="Business or organisation name" value={c.bizName} maxLength={80} autoComplete="organization" onChange={(v) => set({ bizName: v })} error={errors.bizName} /> : null}
      <More title="How should we reach you?" count={b.contactChannels.length + b.contactHours.length + b.languages.length} open={b.contactChannels.includes("email") || b.contactChannels.includes("other") || !!errors.channelOther}>
        <Group id="channels" legend="Contact by" hint="Select all that apply." optional>
          <Chips name="Contact by" multi list={contactChannels} value={b.contactChannels} onToggle={(id) => dispatch({ type: "toggle", field: "contactChannels", id })} />
          {hasOther(b.contactChannels) ? <OtherText id="channelOther" label="Which other way to reach you?" value={b.others.contactChannels ?? ""} onChange={(v) => dispatch({ type: "other", key: "contactChannels", value: v })} className="mt-2" error={errors.channelOther}
            hint="For example Telegram, Signal or a landline. We confirm what we can use." /> : null}
        </Group>
        <Group id="hours" legend="Best times" hint="Select all that apply." optional>
          <Chips name="Best times" multi list={contactHours} value={b.contactHours} onToggle={(id) => dispatch({ type: "toggle", field: "contactHours", id })} />
          {hasOther(b.contactHours) ? <OtherText id="hours-other" label="Which other time?" value={b.others.contactHours ?? ""} onChange={(v) => dispatch({ type: "other", key: "contactHours", value: v })} className="mt-2" /> : null}
        </Group>
        <Group id="languages" legend="Language" hint={`Select all that apply. ${LANGUAGE_NOTE}`} optional>
          <Chips name="Language" multi list={languages} value={b.languages} onToggle={(id) => dispatch({ type: "toggle", field: "languages", id })} />
          {hasOther(b.languages) ? <OtherText id="languages-other" label="Which language?" value={b.others.languages ?? ""} onChange={(v) => dispatch({ type: "other", key: "languages", value: v })} className="mt-2" /> : null}
        </Group>
      </More>
      <TextareaField id="access" label="Anything that would make this easier for you?" optional rows={2} maxLength={300} value={c.access} onChange={(v) => set({ access: v })}
        hint="For example large print messages, a call instead of messages, or help filling this in. It goes only into your message to us. We never save it on this device." />

    </div>
  );
}

export function ContactStep(props: StepProps) { return <div className="grid gap-3"><ContactSection {...props} /><p className="text-[.75rem] st-soft">{CHILD_LINE}</p></div>; }

/* ---------------- consents ---------------- */
export function ConsentSection({ state, dispatch, errors }: StepProps) {
  const c = state.contact;
  const set = (patch: Partial<typeof c>) => dispatch({ type: "contact", patch });
  return (
    <div className="grid gap-2" data-consents>
      {needsPhotoConsent(state.brief) ? <CheckboxField id="photoOk" checked={c.photoOk} onChange={(v) => set({ photoOk: v })} label={PHOTO_CONSENT} error={errors.photoOk} /> : null}
      <CheckboxField id="termsOk" checked={c.termsOk} onChange={(v) => set({ termsOk: v })} error={errors.termsOk}
        label={<>I accept {termsDocs.map((d, i) => (
          <span key={d.id}>{i > 0 ? (i === termsDocs.length - 1 ? " and the " : ", the ") : "the "}<a href={d.href} target="_blank" rel="noopener noreferrer" className="st-link">{d.label}</a></span>
        ))}.</>}
        hint={termsHint} />
      <p className="mt-1 text-[.75rem] font-semibold st-soft">Optional. Your brief does not depend on these.</p>
      {marketingConsents.map((m) => (
        <CheckboxField key={m.id} id={`mk-${m.id}`} checked={m.id === "whatsapp" ? c.marketingWhatsapp : c.marketingEmail}
          onChange={(v) => set(m.id === "whatsapp" ? { marketingWhatsapp: v } : { marketingEmail: v })} label={m.label} hint={m.hint} />
      ))}
    </div>
  );
}

export function ReviewStep(props: StepProps & { onEdit: (s: StepId) => void; onCopy: () => void; copied: string }) {
  const { state, data, onEdit, onCopy, copied } = props;
  return (
    <div className="grid gap-3">
      <BriefCard brief={state.brief} contact={state.contact} data={data} onEdit={onEdit} variant="review" path={state.path} />
      <ConsentSection {...props} />
      <Note icon="sparkle">When you tap Send, WhatsApp opens with your brief ready. You press send there. {REPLY_TIME} Nothing is final until you approve a quote.</Note>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onCopy} className="st-btn st-btn-sec"><Icon name="check" size={16} />Copy brief</button>
        <span role="status" aria-live="polite" className="text-[.8125rem] st-soft">{copied}</span>
      </div>
    </div>
  );
}

/* ---------------- quick path ---------------- */
export function QuickWhenStep(props: StepProps) {
  return (
    <div className="grid gap-3">
      <DeadlineSection {...props} />
      <DeliverySection {...props} />
      <BudgetSection {...props} />
    </div>
  );
}

export function QuickSendStep(props: StepProps & { onEdit: (s: StepId) => void; onCopy: () => void; copied: string; onMore?: () => void }) {
  const { state, data, onEdit } = props;
  const m = briefMeter(state.brief);
  return (
    <div className="grid gap-3">
      <ContactSection {...props} />
      <ConsentSection {...props} />
      <BriefCard brief={state.brief} contact={state.contact} data={data} onEdit={onEdit} variant="review" path="quick" />
      <p className="text-[.75rem] st-soft" aria-live="polite">How detailed is your brief: {m.label}. {m.suggestion}</p>
      {props.onMore ? (
        <div className="st-surface grid gap-1.5 p-3" data-add-more>
          <p className="text-[.875rem] font-semibold">Want to tell us more?</p>
          <p className="text-[.8125rem] st-soft">Your answers are kept. The full brief adds more pieces, colours, personal touches, inspiration and delivery places.</p>
          <div><button type="button" className="st-btn st-btn-sec" onClick={props.onMore}>Add more detail</button></div>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={props.onCopy} className="st-btn st-btn-sec"><Icon name="check" size={16} />Copy brief</button>
        <span role="status" aria-live="polite" className="text-[.8125rem] st-soft">{props.copied}</span>
      </div>
    </div>
  );
}

