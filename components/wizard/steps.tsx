"use client";
import Link from "next/link";
import { useId, useMemo } from "react";
import { BUSINESS_OTHER, businessTypes, contactChannels, contactHoursOptions, CUSTOMER_OTHER_MAX, customerTypes, daysInMonth, HEARD_OTHER, heardFromOptions, INTEREST_OTHER, interestOptions, isB2b, LANGUAGE_NOTE, languages, MAX_OCCASIONS, monthNames, OCCASION_OTHER, OTHER_TEXT_MAX, occasionTypes, timeWindows, volumeBands, type CustomerType } from "@/data/checkout";
import { REMEMBER_TEXT } from "@/data/consent";
import { counties } from "@/data/counties";
import { OTHER_AREA, sortedAreaNames } from "@/data/deliveryAreas";
import { leadTimeDays } from "@/data/facts";
import { pickupPoints } from "@/data/pickupPoints";
import { feeFor, leadTimeText, pickupText } from "@/lib/delivery";
import { emptyOccasion, kraLooksValid, type Errors, type Form } from "@/lib/orderForm";
import { formatKes } from "@/lib/pricing";
import { RETENTION } from "@/lib/storageKeys";
import { Button, ButtonLink } from "../Button";
import { CheckboxField, SelectField, TextareaField, TextField } from "../Form";
import { ChipChecks, Note, Segmented, ValueSelect } from "./ui";
import { SplitDelivery } from "./SplitDelivery";
import { allToFirst, newDrop, type Drop, type SplitLine } from "@/lib/split";

export type Setter = <K extends keyof Form>(k: K, v: Form[K]) => void;
export interface StepProps { form: Form; set: Setter; errors: Errors }

/* ---------- 1. Who ---------- */
export function StepWho({ form, set, errors, onContinueHere }: StepProps & { onContinueHere: () => void }) {
  const pick = (v: CustomerType, on: boolean) => set("customerTypes", on ? [...form.customerTypes, v] : form.customerTypes.filter((x) => x !== v));
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
      <fieldset className="min-w-0 border-0 p-0" aria-describedby={errors.customerType ? "customerType-err" : "customerType-hint"} aria-invalid={errors.customerType ? true : undefined}>
        <legend className="mb-1 text-[.8125rem] font-semibold text-baobab">Who is ordering?</legend>
        <p id="customerType-hint" className="mb-1 text-[.8125rem] text-stone">Choose all that apply, for example a gift and a company. It stays on this device until you send the order.</p>
        <div id="customerType" tabIndex={-1} className="grid gap-1.5 focus:outline-none min-[480px]:grid-cols-2">
          {customerTypes.map((c) => {
            const on = form.customerTypes.includes(c.value);
            return (
              <label key={c.value} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-[var(--radius-input)] border-[1.5px] px-3 py-1.5 text-[.875rem] font-semibold text-charcoal has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta ${on ? "border-terracotta-deep bg-terracotta-tint" : errors.customerType ? "border-brick bg-paper" : "border-line bg-paper"}`}>
                <input type="checkbox" name="customerType" value={c.value} checked={on} onChange={(e) => pick(c.value, e.target.checked)} className="sr-only" />
                <span aria-hidden="true" className={`grid size-5 shrink-0 place-items-center rounded-md border-2 ${on ? "border-baobab bg-baobab text-bone" : "border-baobab bg-paper"}`}>{on ? <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg> : null}</span>
                <span>{c.label}</span>
              </label>
            );
          })}
        </div>
        {errors.customerType ? <p id="customerType-err" className="mt-1 text-[.8125rem] font-bold text-brick">{errors.customerType}</p> : null}
      </fieldset>
      {form.customerTypes.includes("other") ? (
        <TextField id="customerOther" label="Who is ordering? In your own words" optional={form.customerTypes.length > 1} value={form.customerOther} maxLength={CUSTOMER_OTHER_MAX} autoComplete="off" enterKeyHint="next"
          onChange={(v) => set("customerOther", v)} error={errors.customerOther} hint="A few words are enough, for example a book club or a theatre group." />
      ) : null}
      {isB2b(form.customerTypes) ? (
        <Note>
          <p>For larger or regular orders our wholesale request may suit you. You can also continue here and we reply on WhatsApp.</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <ButtonLink href="/wholesale" variant="secondary" size="compact">Go to wholesale request</ButtonLink>
            <Button variant="secondary" size="compact" onClick={onContinueHere}>Continue here</Button>
          </div>
        </Note>
      ) : null}
    </div>
  );
}

/* ---------- 2. Your details ---------- */
export function StepDetails({ form, set, errors, remember, setRemember, hasProfile, onForget }: StepProps & {
  remember: boolean; setRemember: (v: boolean) => void; hasProfile: boolean; onForget: () => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
      <TextField id="name" label="Your full name" hint="Any name is fine. One name is enough." value={form.name} onChange={(v) => set("name", v)} autoComplete="name" autoCapitalize="words" maxLength={120} error={errors.name} />
      <TextField id="phone" label="Your WhatsApp or phone number" hint="We message you on this number about your order. Kenyan numbers like 0712 345 678 work, and so do numbers from other countries with the country code, like +44 7911 123456."
        type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(v) => set("phone", v)} error={errors.phone} />
      <TextField id="email" label="Email" optional type="email" inputMode="email" autoComplete="email" enterKeyHint="next" value={form.email} onChange={(v) => set("email", v)} error={errors.email}
        hint="Only if you want us to be able to email you." />
      <div id="contactChannel" tabIndex={-1} className="focus:outline-none">
        <ChipChecks legend="How should we reach you?" name="contactChannel" values={form.contactChannels} options={contactChannels.map((c) => c.value)} labels={Object.fromEntries(contactChannels.map((c) => [c.value, c.label]))}
          onChange={(v) => set("contactChannels", v as Form["contactChannels"])} hint="Choose all that suit you." />
        {errors.contactChannel ? <p className="mt-1 text-[.8125rem] font-bold text-brick">{errors.contactChannel}</p> : null}
      </div>
      {form.contactChannels.includes("other") ? (
        <TextField id="channelOther" label="Which other way to reach you?" value={form.channelOther} maxLength={OTHER_TEXT_MAX} autoComplete="off" onChange={(v) => set("channelOther", v)} error={errors.channelOther}
          hint="For example Telegram, Signal or a landline. We confirm what we can use." />
      ) : null}
      {form.contactChannels.includes("call") || form.contactChannels.includes("sms") ? (
        <Segmented id="contactHours" legend="Best time to call or text" value={form.contactHours} onChange={(v) => set("contactHours", v as Form["contactHours"])} options={contactHoursOptions} />
      ) : null}
      <Segmented id="language" legend="Reply in" value={form.language} onChange={(v) => set("language", v as Form["language"])} options={languages} hint={LANGUAGE_NOTE} />
      {form.language === "other" ? (
        <TextField id="langOther" label="Which language?" value={form.langOther} maxLength={OTHER_TEXT_MAX} autoComplete="off" onChange={(v) => set("langOther", v)} error={errors.langOther} />
      ) : null}
      <TextareaField id="access" label="Anything that would make this easier for you?" optional rows={2} maxLength={300} value={form.access} onChange={(v) => set("access", v)}
        hint="For example large print messages, a call instead of messages, or help filling this in. It goes only into your message to us. We never save it on this device." />
      <div>
        <CheckboxField id="remember" checked={remember} onChange={setRemember} label={REMEMBER_TEXT}
          hint={`Kept on this device for ${RETENTION.profileDays} days. You can remove it any time.`} />
        {hasProfile ? (
          <p className="mt-0.5 text-[.8125rem] text-stone">Using your saved details.{" "}
            <button type="button" onClick={onForget} className="ck-tbtn !min-w-0 !px-1">Forget me on this device</button></p>
        ) : null}
      </div>
      <p className="text-[.8125rem] text-stone">We use your details only to handle this order. See our <Link href="/privacy" className="hit font-semibold text-terracotta-deep underline underline-offset-4">Privacy notice</Link>.</p>
    </div>
  );
}

/* ---------- 3. Delivery ---------- */
export function RecipientFields({ form, set, errors }: StepProps) {
  return (
    <div className="grid gap-2.5 rounded-[var(--radius-input)] bg-oat p-3">
      <p className="text-[.8125rem] text-stone">An adult we can call at delivery. Please do not add a child&rsquo;s name or age.</p>
      <TextField id="recipientName" label="Adult receiving it" autoComplete="off" value={form.recipientName} onChange={(v) => set("recipientName", v)} error={errors.recipientName} />
      <TextField id="recipientPhone" label="Their phone number" type="tel" inputMode="tel" autoComplete="off" value={form.recipientPhone} onChange={(v) => set("recipientPhone", v)} error={errors.recipientPhone} />
    </div>
  );
}

export function StepDelivery({ form, set, errors, minDate, maxDate, lines }: StepProps & { minDate: string; maxDate: string; lines: SplitLine[] }) {
  const areaNames = useMemo(() => [...sortedAreaNames(), OTHER_AREA], []);
  const uid = useId();
  const fee = feeFor({ fulfilment: form.fulfilment as "" | "pickup" | "nairobi" | "town", area: form.area, areaOther: form.areaOther, county: form.county, town: form.town });
  const delivering = form.split || (form.fulfilment !== "" && form.fulfilment !== "pickup" && form.fulfilment !== "collect");
  const goesToPlace = form.fulfilment === "town" || form.fulfilment === "courier";
  const toggleSplit = (on: boolean) => {
    if (!on) { set("split", false); return; }
    const start: Drop[] = form.drops.length >= 2 ? form.drops : [
      newDrop(1, {
        fulfilment: form.fulfilment === "town" ? "town" : "nairobi", area: form.area, areaOther: form.areaOther, county: form.county, town: form.town, landmark: form.landmark, mapsPin: form.mapsPin,
        recipientName: form.recipientDifferent || form.sendDirect ? form.recipientName : "", recipientPhone: form.recipientDifferent || form.sendDirect ? form.recipientPhone : "", giftNote: form.giftNote,
      }),
      newDrop(2),
    ];
    set("drops", allToFirst(lines, start));
    set("split", true);
    if (form.fulfilment !== "town") set("fulfilment", "nairobi");
  };
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
      <CheckboxField id="split" checked={form.split} onChange={toggleSplit} label="Send to more than one place"
        hint="For gifts to several people or addresses. You choose which animals go where. It stays one order." />
      {form.split ? <SplitDelivery form={form} set={set} errors={errors} lines={lines} /> : null}
      <fieldset className={`min-w-0 border-0 p-0 ${form.split ? "hidden" : ""}`} aria-describedby={errors.fulfilment ? "fulfilment-err" : undefined}>
        <legend className="mb-1 text-[.8125rem] font-semibold text-baobab">How should we get it to you?</legend>
        <div id="fulfilment" tabIndex={-1} className="grid gap-1.5 focus:outline-none">
          {([
            ["pickup", "I will collect it from a pickup point", pickupText()],
            ["collect", "Someone else will collect it", "We confirm who collects it, and where, on WhatsApp."],
            ["nairobi", "Deliver it in Nairobi", ""],
            ["town", "Send it to another Kenyan town", "Any of the 47 counties. We confirm how it travels, the cost and the time on WhatsApp."],
            ["courier", "A courier or bus parcel service of my choice", "Tell us the county, town and service. We confirm how it reaches them."],
            ["abroad", "Send it abroad (ask us)", "We have not confirmed shipping abroad yet. Tell us the country and we say what is possible."],
            ["other", "Other, tell us", "Another way you would like it to reach you."],
          ] as const).map(([v, l, help]) => {
            const on = form.fulfilment === v;
            return (
              <label key={v} className={`flex min-h-11 cursor-pointer items-start gap-2 rounded-[var(--radius-input)] border-[1.5px] px-3 py-1.5 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta ${on ? "border-terracotta-deep bg-terracotta-tint" : errors.fulfilment ? "border-brick bg-paper" : "border-line bg-paper"}`}>
                <input type="radio" name="fulfilment" value={v} checked={on} onChange={() => set("fulfilment", v)} className="sr-only" />
                <span aria-hidden="true" className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-baobab bg-baobab" : "border-baobab bg-paper"}`}>{on ? <span className="size-2 rounded-full bg-bone" /> : null}</span>
                <span><span className="block text-[.875rem] font-semibold text-charcoal">{l}</span>{help ? <span className="block text-[.8125rem] text-stone">{help}</span> : null}</span>
              </label>
            );
          })}
        </div>
        {errors.fulfilment ? <p id="fulfilment-err" className="mt-1 text-[.8125rem] font-bold text-brick">{errors.fulfilment}</p> : null}
      </fieldset>

      {!form.split && form.fulfilment === "pickup" && pickupPoints.length ? (
        <p className="text-[.8125rem] text-stone">{pickupText()}</p>
      ) : null}

      {!form.split && form.fulfilment === "nairobi" ? (
        <>
          <SelectField id="area" label="Area" value={form.area} onChange={(v) => set("area", v)} options={areaNames} placeholder="Choose your area" error={errors.area} />
          {form.area === OTHER_AREA ? <TextField id="areaOther" label="Which area?" value={form.areaOther} onChange={(v) => set("areaOther", v)} error={errors.areaOther} /> : null}
          <TextField id="landmark" label="Estate, street, building or landmark" autoComplete="street-address" value={form.landmark} onChange={(v) => set("landmark", v)} error={errors.landmark} />
        </>
      ) : null}
      {!form.split && goesToPlace ? (
        <>
          <SelectField id="county" label="County" value={form.county} onChange={(v) => set("county", v)} options={counties} placeholder="Choose the county" error={errors.county} />
          <TextField id="town" label="Town or area" autoComplete="address-level2" value={form.town} onChange={(v) => set("town", v)} error={errors.town} />
          <TextField id="landmark" label={form.fulfilment === "courier" ? "Courier or bus service, and the office" : "Landmark or parcel office"} optional autoComplete="off" value={form.landmark} onChange={(v) => set("landmark", v)}
            hint={form.fulfilment === "courier" ? "For example the name of the service and the stage or office to send it to." : "A parcel office or shop name works."} />
        </>
      ) : null}
      {!form.split && form.fulfilment === "abroad" ? (
        <TextField id="fulfilmentOther" label="Which country and city?" autoComplete="off" maxLength={OTHER_TEXT_MAX} value={form.fulfilmentOther} onChange={(v) => set("fulfilmentOther", v)} error={errors.fulfilmentOther} />
      ) : null}
      {!form.split && form.fulfilment === "other" ? (
        <TextareaField id="fulfilmentOther" label="How would you like it to reach you?" rows={2} maxLength={200} value={form.fulfilmentOther} onChange={(v) => set("fulfilmentOther", v)} error={errors.fulfilmentOther} />
      ) : null}
      {delivering ? (
        <>
          {!form.split ? <TextField id="mapsPin" label="Google Maps pin link" optional type="url" inputMode="url" autoComplete="off" enterKeyHint="next" maxLength={300}
            value={form.mapsPin} onChange={(v) => set("mapsPin", v)} error={errors.mapsPin} hint="Share your location from Google Maps and paste the link." /> : null}
          <TextareaField id="deliveryNotes" label="Delivery notes" optional rows={2} maxLength={300} value={form.deliveryNotes} onChange={(v) => set("deliveryNotes", v)}
            hint="A gate code, a floor or a parcel office name, for example." />
          <p className="rounded-[var(--radius-input)] bg-sand px-3 py-2 text-[.8125rem]" data-testid="wizard-fee">
            {form.split ? "Delivery cost depends on where each place is and is confirmed in your quote." : fee === null ? "Delivery cost depends on where it is going and is confirmed in your quote." : `Delivery cost: ${formatKes(fee)}.`}
          </p>
          {!form.split ? (
            <div className="grid gap-2">
              <CheckboxField id="recipientDifferent" checked={form.recipientDifferent} onChange={(v) => set("recipientDifferent", v)} label="Someone else will receive it" />
              {form.recipientDifferent ? <RecipientFields form={form} set={set} errors={errors} /> : null}
            </div>
          ) : null}
        </>
      ) : null}
      {form.fulfilment ? (
        <>
          <Segmented id="dateFlex" legend="When would you like it?" value={form.dateFlex || "date"}
            onChange={(v) => { set("dateFlex", v as Form["dateFlex"]); if (v === "asap" || v === "flexible") set("dateWish", ""); }}
            options={[{ value: "date", label: "By a day I choose" }, { value: "asap", label: "As soon as possible" }, { value: "flexible", label: "Flexible" }]}
            hint="A wish, not a promise. Handmade pieces take time, so we confirm what is possible." />
          {form.dateFlex !== "asap" && form.dateFlex !== "flexible" ? (
            <TextField id="dateWish" label="A day you would like it by" optional type="date" min={minDate} max={maxDate} value={form.dateWish} onChange={(v) => set("dateWish", v)} error={errors.dateWish}
              hint={leadTimeDays === null ? undefined : leadTimeText()} />
          ) : null}
          {delivering ? (
            <>
              <Segmented id={`${uid}-tw`} legend="Time of day" value={form.timeWindow} onChange={(v) => set("timeWindow", v as Form["timeWindow"])} options={timeWindows} hint="We confirm the exact time." />
              <CheckboxField id="callOnArrival" checked={form.callOnArrival} onChange={(v) => set("callOnArrival", v)} label="Call me when the rider arrives" />
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

/* ---------- 4. Gift options ---------- */
export function StepGift({ form, set, errors }: StepProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
      {form.split ? (
        <p className="rounded-[var(--radius-input)] bg-sand px-3 py-2 text-[.8125rem]">You are sending to several places, so each place has its own gift note on the delivery step.</p>
      ) : (
        <TextareaField id="giftNote" label="A note to go with the gift" optional maxLength={240} counter rows={3} value={form.giftNote} onChange={(v) => set("giftNote", v)}
          hint="Please do not include a child's name, surname, school or age." />
      )}
      <CheckboxField id="anonymous" checked={form.anonymous} onChange={(v) => set("anonymous", v)} label="Do not say who it is from" hint="The person receiving it will not see your name on the note." />
      {!form.split ? (
        <>
          <CheckboxField id="sendDirect" checked={form.sendDirect} onChange={(v) => { set("sendDirect", v); if (v) set("recipientDifferent", true); }}
            label="Send it straight to the person receiving it" hint="We ask for an adult contact, never a child's name or age. We confirm it with you on WhatsApp." />
          {form.sendDirect ? <RecipientFields form={form} set={set} errors={errors} /> : null}
        </>
      ) : null}
    </div>
  );
}

/* ---------- 5. Business ---------- */
export function StepBusiness({ form, set, errors }: StepProps) {
  const pinWarn = form.kraPin.trim() !== "" && !kraLooksValid(form.kraPin);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
      <TextField id="businessName" label="Business or organisation name" autoComplete="organization" value={form.businessName} onChange={(v) => set("businessName", v)} error={errors.businessName} />
      <SelectField id="businessType" label="Type of business" optional value={form.businessType} onChange={(v) => set("businessType", v)} options={businessTypes} placeholder="Choose one" />
      {form.businessType === BUSINESS_OTHER ? (
        <TextField id="businessTypeOther" label="What kind of business or group?" value={form.businessTypeOther} maxLength={OTHER_TEXT_MAX} autoComplete="off" onChange={(v) => set("businessTypeOther", v)} error={errors.businessTypeOther} />
      ) : null}
      <TextField id="outletLocation" label="Outlet location" optional autoComplete="off" value={form.outletLocation} onChange={(v) => set("outletLocation", v)} hint="Where will the animals be sold or used?" />
      <SelectField id="volumeBand" label="Roughly how many a month?" optional value={form.volumeBand} onChange={(v) => set("volumeBand", v)} options={volumeBands} placeholder="A guess is fine" />
      <TextField id="invoiceName" label="Name for the invoice, if different" optional autoComplete="off" value={form.invoiceName} onChange={(v) => set("invoiceName", v)} />
      <div>
        <TextField id="kraPin" label="KRA PIN" optional autoComplete="off" autoCapitalize="characters" maxLength={11} value={form.kraPin} onChange={(v) => set("kraPin", v.toUpperCase())}
          hint="Only if you want it on the invoice. It goes into your WhatsApp message to us and is never saved on this device." />
        {pinWarn ? <p role="status" className="mt-1 text-[.8125rem] text-ochre-deep">This does not look like a KRA PIN. Check it, or leave it empty. You can still continue.</p> : null}
      </div>
      <TextField id="poNumber" label="PO number" optional autoComplete="off" maxLength={40} value={form.poNumber} onChange={(v) => set("poNumber", v)} />
      <p className="text-[.8125rem] text-stone">We confirm wholesale terms and prices with you on WhatsApp.</p>
    </div>
  );
}

/* ---------- 6. About you ---------- */
export function OccasionFields({ form, set, errors }: StepProps) {
  const days = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
  const list = form.occasions.length ? form.occasions : [];
  const put = (i: number, p: Partial<Form["occasions"][number]>) => set("occasions", list.map((o, k) => (k === i ? { ...o, ...p } : o)));
  return (
    <div className="grid gap-2" data-testid="occasions">
      {list.map((o, i) => {
        const month = Number(o.month);
        return (
          <div key={i} className="grid gap-2 rounded-[var(--radius-input)] bg-paper p-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[.8125rem] font-semibold">Occasion {i + 1}</p>
              <button type="button" className="ck-tbtn" onClick={() => set("occasions", list.filter((_, k) => k !== i))} aria-label={`Remove occasion ${i + 1}`}>Remove</button>
            </div>
            <ValueSelect id={`occasion${i}_type`} label="Occasion" value={o.type} onChange={(v) => put(i, { type: v })} options={occasionTypes.map((x) => ({ value: x, label: x }))} placeholder="Choose one" error={errors[`occasion${i}_type`]} />
            {o.type === OCCASION_OTHER ? (
              <TextField id={`occasion${i}_other`} label="Which occasion?" value={o.other ?? ""} maxLength={OTHER_TEXT_MAX} autoComplete="off" onChange={(v) => put(i, { other: v })} error={errors[`occasion${i}_other`]}
                hint="A kind of occasion only, for example a harvest festival. No names." />
            ) : null}
            <div className="grid grid-cols-2 gap-2">
              <ValueSelect id={`occasion${i}_day`} label="Day" value={o.day} onChange={(v) => put(i, { day: v })} options={days.slice(0, month >= 1 ? daysInMonth[month - 1] : 31)} placeholder="Day" />
              <ValueSelect id={`occasion${i}_month`} label="Month" value={o.month} onChange={(v) => put(i, { month: v })} options={monthNames.map((m, k) => ({ value: String(k + 1), label: m }))} placeholder="Month" />
            </div>
          </div>
        );
      })}
      {list.length < MAX_OCCASIONS ? (
        <div><Button variant="secondary" size="compact" onClick={() => set("occasions", [...list, emptyOccasion()])}>{list.length ? "Add another occasion" : "Add an occasion"}</Button></div>
      ) : null}
      <p className="text-[.8125rem] text-stone">Day and month only. No year, no names, no ages.</p>
    </div>
  );
}

export function StepAbout({ form, set, errors }: StepProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
      <p className="text-[.8125rem] text-stone">We use this only to suggest animals that suit you. It is optional, and your order does not depend on it.</p>
      <OccasionFields form={form} set={set} errors={errors} />
      <p className="text-[.8125rem] text-stone">The occasions are used for a reminder only if you tick the occasion reminder on the last step.</p>
      <ChipChecks legend="What do you like?" name="interests" values={form.interests} options={interestOptions} onChange={(v) => set("interests", v)} hint="Choose all that apply." />
      {form.interests.includes(INTEREST_OTHER) ? <TextField id="interestOther" label="What else do you like?" optional value={form.interestOther} maxLength={OTHER_TEXT_MAX} autoComplete="off" onChange={(v) => set("interestOther", v)} /> : null}
      <ChipChecks legend="How did you hear about us?" name="heardFrom" values={form.heardFrom} options={heardFromOptions} onChange={(v) => set("heardFrom", v)} hint="Choose all that apply." />
      {form.heardFrom.includes(HEARD_OTHER) ? <TextField id="heardOther" label="How else did you hear about us?" optional value={form.heardOther} maxLength={OTHER_TEXT_MAX} autoComplete="off" onChange={(v) => set("heardOther", v)} /> : null}
      <p className="text-[.8125rem] text-stone">You can skip any of these. Prefer not to say is fine.</p>
    </div>
  );
}
