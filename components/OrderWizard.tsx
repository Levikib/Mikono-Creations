"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isB2b, customerTypesLabel } from "@/data/checkout";
import { BUSINESS_NAME, CONSENT_VERSION, TERMS_VERSION, type ConsentPurpose } from "@/data/consent";
import { pricesConfirmed } from "@/data/facts";
import { clearSavedDetails, lineColour, useCart, useHydrated } from "@/lib/cart";
import { estimateFulfilment, readDelivery, writeDelivery, feeFor, type DeliveryChoice } from "@/lib/delivery";
import { env } from "@/lib/env";
import {
  applyProfile, clearDraft, emptyForm, hasContent, maxDateISO, noTicks, nowMs, readDraft, saveOrderSummary, stepList, stepTitles,
  toOrderMsg, tomorrowISO, validateAll, validateStep, writeDraft, type Draft, type Errors, type Form, type StepId, type Ticks,
} from "@/lib/orderForm";
import { acceptedLine } from "@/data/legal";
import { orderApi } from "@/lib/orderApi";
import { buildOrderPayload } from "@/lib/orderPayload";
import { normalisePhone } from "@/lib/phone";
import { countAnimals } from "@/lib/plural";
import { computeTotals } from "@/lib/pricing";
import { forgetProfile, readProfile, writeProfile, type Profile } from "@/lib/profile";
import { reorderLast } from "@/lib/reorder";
import { setSentMemory } from "@/lib/sentMessage";
import { showToast } from "@/lib/toast";
import { attribution, track } from "@/lib/track";
import { trackItem } from "@/lib/trackCart";
import { useKeyboardOpen } from "@/lib/useKeyboard";
import { buildOrderMessage, copyText, digitsOnly, generateRef, planOrderSend, sourceFromAttribution } from "@/lib/whatsapp";
import { readOrders } from "@/lib/orderForm";
import { cx } from "@/lib/cx";
import { Button, ButtonLink } from "./Button";
import { useCatalogue } from "./CatalogueContext";
import { EmptyState } from "./EmptyState";
import { focusSummary, ErrorSummary } from "./Form";
import { Icon } from "./Icon";
import { StepReview } from "./wizard/Review";
import { StepAbout, StepBusiness, StepDelivery, StepDetails, StepGift, StepWho, type Setter } from "./wizard/steps";
import "./cart/checkout.css";
import { sizeWord } from "@/lib/sizes";

export function OrderWizard() {
  const hydrated = useHydrated();
  if (!hydrated) return <p className="min-h-[45dvh] py-3 text-center text-stone" aria-live="polite">Loading your order form</p>;
  return <Wizard />;
}

const profileComplete = (p: Profile | null) => Boolean(p && p.customerTypes.length && p.name.trim().length >= 2 && normalisePhone(p.phone).ok);

function initialForm(profile: Profile | null): Form {
  let f: Form = emptyForm;
  if (profile) f = applyProfile(f, profile);
  const d = readDelivery();
  if (!f.fulfilment && d.fulfilment) f = { ...f, fulfilment: d.fulfilment, area: d.area, areaOther: d.areaOther, county: d.county, town: d.town };
  return f;
}

function Wizard() {
  const router = useRouter();
  const { lines, count, addMany } = useCart();
  const { priceBySlug, products, bySlug } = useCatalogue();
  const kb = useKeyboardOpen();
  const [saved] = useState<Draft | null>(() => readDraft());
  const [profile, setProfile] = useState<Profile | null>(() => readProfile());
  const resumable = !!saved && !saved.sent && hasContent(saved.form);
  const [resume, setResume] = useState(resumable);
  const [form, setForm] = useState<Form>(() => (resumable && saved ? saved.form : initialForm(profile)));
  const [step, setStep] = useState<StepId>(() => (resumable && saved ? saved.step : "who"));
  const [skipGift, setSkipGift] = useState(() => (resumable && saved ? saved.skipGift : false));
  const [skipAbout, setSkipAbout] = useState(() => (resumable && saved ? saved.skipAbout : false));
  const [ref, setRef] = useState<string | undefined>(() => (resumable && saved ? saved.ref : undefined));
  const [changeWho, setChangeWho] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [errTick, setErrTick] = useState(0);
  const [fromReview, setFromReview] = useState(false);
  const [ticks, setTicks] = useState<Ticks>(noTicks);
  const [remember, setRemember] = useState(false);
  const [copied, setCopied] = useState("");
  const [dates] = useState(() => ({ minDate: tomorrowISO(), maxDate: maxDateISO() }));
  const [lastOrder] = useState(() => readOrders()[0] ?? null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const resumeRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const began = useRef(false);
  const lastSend = useRef(0);
  const sentRef = useRef(false);
  const stepStart = useRef(0);
  const listRef = useRef<StepId[]>(["who"]);

  const b2b = isB2b(form.customerTypes);
  const list = stepList({ skipGift, skipAbout, b2b });
  const idx = Math.max(0, list.indexOf(step));
  const total = list.length;
  const returning = profileComplete(profile) && !changeWho;

  useEffect(() => { listRef.current = list; });

  const totals = computeTotals({
    lines: lines.map((l) => ({ sku: l.sku, slug: l.slug, qty: l.qty })), priceBySlug, pricesConfirmed,
    fulfilment: estimateFulfilment(form.fulfilment), deliveryFeeKes: feeFor({ fulfilment: estimateFulfilment(form.fulfilment), area: form.area, areaOther: form.areaOther, county: form.county, town: form.town }),
  });
  const items = lines.map((l) => trackItem({ ...l, priceKes: pricesConfirmed ? priceBySlug[l.slug] ?? null : null, category: l.category ?? bySlug(l.slug)?.category }));
  const money = totals.valueKnown && totals.totalKes !== null ? { value: totals.totalKes, currency: "KES" } : {};

  // Autosave on every change (kept 24 hours, device only). The KRA PIN, the consent boxes and the remember tick are never written.
  useEffect(() => {
    if (resume || (!hasContent(form) && step === "who")) return;
    const t = setTimeout(() => writeDraft({ step, skipGift, skipAbout, form, ref }), 250);
    return () => clearTimeout(t);
  }, [form, step, skipGift, skipAbout, ref, resume]);

  // Focus the step heading and name the step in the tab title.
  useEffect(() => {
    const title = `Step ${idx + 1} of ${total}: ${stepTitles[step]} | Mikono Creations`;
    document.title = title;
    // The route metadata can write the generic title after hydration, so set it once more.
    const t = setTimeout(() => { document.title = title; }, 150);
    if (first.current) { first.current = false; return () => clearTimeout(t); }
    headingRef.current?.focus();
    return () => clearTimeout(t);
  }, [step, idx, total]);

  useEffect(() => { if (errTick > 0) focusSummary(summaryRef.current); }, [errTick]);
  useEffect(() => { if (resume) resumeRef.current?.focus(); }, [resume]);

  useEffect(() => {
    if (!resume && count > 0 && !began.current) {
      began.current = true;
      track("begin_checkout", { items, item_count: count, line_count: lines.length, price_mode: pricesConfirmed ? "confirmed" : "ask", ...money });
    }
    // fires once when the form is first shown
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume, count]);

  // Step views, and the time spent on each step in buckets.
  useEffect(() => {
    if (resume) return;
    stepStart.current = nowMs();
    track("wizard_step_view", { step_name: step, step_index: idx + 1, step_total: total, returning: Boolean(profile) });
    // one event per step shown
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resume]);

  // Best effort drop-off signal: once, when the page is hidden mid way.
  const stepNow = useRef(step);
  useEffect(() => { stepNow.current = step; }, [step]);
  useEffect(() => {
    let fired = false;
    const onHide = () => {
      if (document.visibilityState === "hidden" && !sentRef.current && !fired && began.current) { fired = true; track("wizard_abandon", { last_step: stepNow.current }); }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  // Browser Back and Forward move between steps. Each step has a #step-name address.
  useEffect(() => {
    const onPop = () => {
      const m = /^#step-([a-z]+)$/.exec(window.location.hash);
      const s = m?.[1] as StepId | undefined;
      if (s && listRef.current.includes(s)) { setErrors({}); setStep(s); }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const set: Setter = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => {
      if (k === "drops" || k === "split") return Object.fromEntries(Object.entries(e).filter(([id]) => !id.startsWith("drop") && id !== "alloc"));
      if (!(k in e) && !(k === "fulfilment" && "fulfilment" in e)) return e;
      const n = { ...e };
      delete n[k as string];
      if (k === "fulfilment" || k === "area") delete n.fulfilment;
      return n;
    });
  };

  const setTick = (k: ConsentPurpose, v: boolean) => {
    setTicks((t) => ({ ...t, [k]: v }));
    setErrors((e) => { if (!(k in e)) return e; const n = { ...e }; delete n[k]; return n; });
    track("consent_update", { consent_scope: "order", tier: k, granted: v });
  };

  const msgLines: Array<{ sku: string; name: string; colourLabel: string; size: string; qty: number; note?: string }> = lines.map((l) => ({ sku: l.sku, name: l.name, colourLabel: lineColour(l), size: l.size, qty: l.qty, note: l.note }));
  const source = sourceFromAttribution(attribution());
  const currentRef = ref ?? "MK-pending";
  const ctx = { ...dates, lines: msgLines };
  const buildMsg = (r: string) => toOrderMsg(form, msgLines, r, ticks, source, env.siteUrl, CONSENT_VERSION, TERMS_VERSION, acceptedLine(new Date()));
  const numberSet = !!digitsOnly(env.whatsappNumber);

  const goTo = (s: StepId, push = true) => {
    setErrors({});
    setCopied("");
    setStep(s);
    if (s === "review" && !ref) setRef(generateRef("MK"));
    if (push) { try { window.history.pushState(null, "", `#step-${s}`); } catch { /* ignore */ } }
  };

  const failed = (step_name: StepId, errs: Errors) => {
    setErrors(errs);
    setErrTick((t) => t + 1);
    for (const field_name of Object.keys(errs)) track("wizard_error", { step_name, field_name });
  };

  const next = () => {
    const errs = validateStep(step, form, ctx);
    if (Object.keys(errs).length) { failed(step, errs); return; }
    const bucket = (nowMs() - stepStart.current) / 1000;
    track("wizard_step_complete", { step_name: step, step_index: idx + 1, step_total: total, duration_bucket: bucket < 10 ? "0-10" : bucket < 30 ? "10-30" : bucket < 60 ? "30-60" : "60+" });
    if (step === "who") track("customer_type_selected", { customer_type: form.customerTypes.join(","), segment: isB2b(form.customerTypes) ? "b2b" : "b2c" });
    if (step === "delivery") {
      const first = form.split ? form.drops[0] : null;
      const d: DeliveryChoice = first
        ? { fulfilment: estimateFulfilment(first.fulfilment), area: first.area, areaOther: first.areaOther, county: first.county, town: first.town }
        : { fulfilment: estimateFulfilment(form.fulfilment), area: form.area, areaOther: form.areaOther, county: form.county, town: form.town };
      writeDelivery(d);
      track("add_shipping_info", { shipping_tier: form.split ? "multiple" : form.fulfilment === "town" ? "kenya_other" : form.fulfilment, items, item_count: count, place_count: form.split ? form.drops.length : 1, ...money });
    }
    setFromReview(false);
    let target: StepId = list[Math.min(idx + 1, total - 1)];
    // A returning customer with complete saved details goes straight on to delivery.
    if (step === "who" && returning && !fromReview && !Object.keys(validateStep("details", form, ctx)).length) {
      target = "delivery";
      track("wizard_step_complete", { step_name: "details", step_index: 2, step_total: total, skipped: true });
    }
    goTo(fromReview ? "review" : target);
  };
  const back = () => {
    setFromReview(false);
    if (window.history.length > 1 && /^#step-/.test(window.location.hash)) window.history.back();
    else goTo(list[Math.max(0, idx - 1)], false);
  };
  const edit = (s: StepId) => {
    if (s === "gift") setSkipGift(false);
    if (s === "about") setSkipAbout(false);
    setFromReview(true);
    goTo(s);
  };
  const skipGiftStep = () => {
    setSkipGift(true);
    setForm((f) => ({ ...f, giftNote: "", anonymous: false, sendDirect: false }));
    track("wizard_step_complete", { step_name: "gift", step_index: idx + 1, step_total: total - 1, skipped: true });
    goTo(stepList({ skipGift: true, skipAbout, b2b })[Math.min(idx, total - 2)]);
  };
  const skipAboutStep = () => {
    setSkipAbout(true);
    setForm((f) => ({ ...f, occasions: [], interests: [], heardFrom: [] }));
    track("wizard_step_complete", { step_name: "about", step_index: idx + 1, step_total: total - 1, skipped: true });
    goTo("review");
  };
  const startAgain = () => {
    clearDraft();
    setForm(initialForm(profile)); setStep("who"); setSkipGift(false); setSkipAbout(false); setRef(undefined); setResume(false);
  };
  const forget = () => {
    forgetProfile();
    setProfile(null);
    setRemember(false);
    showToast("Your saved details were removed from this device.", "success");
  };

  const copy = async () => {
    const ok = await copyText(buildOrderMessage(buildMsg(currentRef), "full"));
    setCopied(ok ? "Order text copied." : "Copying did not work here. Press and hold the text to copy it.");
  };

  const send = () => {
    if (nowMs() - lastSend.current < 2000) return;
    const bad = validateAll(list, form, ctx, ticks);
    if (bad) {
      if (bad.step !== step) goTo(bad.step);
      failed(bad.step, bad.errors);
      return;
    }
    lastSend.current = nowMs();
    const finalRef = ref ?? generateRef("MK");
    const at = new Date();
    const plan = planOrderSend(env.whatsappNumber, buildMsg(finalRef));
    // WhatsApp opens first, inside the tap, so no browser blocks it. Everything else follows.
    if (plan.url) window.open(plan.url, "_blank", "noopener");
    void copyText(plan.fullText);
    sentRef.current = true;
    track("whatsapp_order_submit", {
      order_ref: finalRef, items, item_count: count, line_count: lines.length, customer_type: form.customerTypes.join(","), segment: b2b ? "b2b" : "b2c",
      shipping_tier: form.split ? "multiple" : form.fulfilment === "town" ? "kenya_other" : form.fulfilment, place_count: form.split ? form.drops.length : 1, message_level: plan.level, persisted: false, ...money,
    });
    saveOrderSummary(finalRef, lines.map((l) => ({ sku: l.sku, qty: l.qty })));
    if (remember) { if (writeProfile(form)) track("profile_remember", { granted: true }); }
    setSentMemory({ ref: finalRef, message: plan.fullText, text: plan.text, level: plan.level, at: nowMs(), pasteRest: Boolean(plan.pasteRest) });
    writeDraft({ step: "review", skipGift, skipAbout, form, ref: finalRef, sent: { message: plan.fullText, text: plan.text, level: plan.level, at: nowMs(), pasteRest: Boolean(plan.pasteRest) } });
    // Stage 2 hook. A no-op today: nothing is sent to any server.
    void orderApi.submitOrder(buildOrderPayload({
      ref: finalRef, at, form, ticks, lines: lines.map((l) => ({ sku: l.sku, qty: l.qty, note: l.note })), attribution: attribution(), messageLevel: plan.level,
    })).catch(() => {});
    router.push(`/order/sent?ref=${encodeURIComponent(finalRef)}`);
  };

  if (lines.length === 0) {
    return (
      <EmptyState title="Your order list is empty" text="Add an animal to your order list first, then come back here to send your order."
        action={(
          <div className="flex flex-col gap-2">
            {lastOrder ? (
              <Button variant="secondary" onClick={() => {
                const r = reorderLast(lastOrder, products);
                track("reorder_start", { source: "order", item_count: lastOrder.items.reduce((n, i) => n + i.qty, 0) });
                const res = addMany(r.items);
                showToast(res.added + res.merged ? `Added ${countAnimals(r.items.reduce((n, i) => n + i.qty, 0))} from your last order.` : "Nothing from your last order is listed now.", res.added + res.merged ? "success" : "info");
              }}>Reorder my last list</Button>
            ) : null}
            <ButtonLink href="/shop" size="large">See the animals</ButtonLink>
          </div>
        )} />
    );
  }

  if (resume) {
    return (
      <section aria-labelledby="resume-title" className="mx-auto max-w-[640px] rounded-[var(--radius-panel)] bg-oat p-3 shadow-clay-sm md:p-4">
        <h2 id="resume-title" ref={resumeRef} tabIndex={-1} className="text-[1.0625rem] focus:outline-none">Welcome back</h2>
        <p className="mt-1 text-[.875rem]">You stopped at {stepTitles[step].toLowerCase()}. Would you like to carry on where you left off? Your answers are kept on this device only.</p>
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          <Button size="large" onClick={() => setResume(false)}>Continue</Button>
          <Button size="large" variant="ghost" onClick={startAgain}>Start again</Button>
        </div>
        <p className="mt-1 text-[.8125rem] text-stone">Start again clears the draft.{" "}
          <button type="button" onClick={() => { startAgain(); clearSavedDetails(); }} className="ck-tbtn !min-w-0 !px-1">Clear all my saved details</button></p>
      </section>
    );
  }

  const errorList = Object.entries(errors).map(([id, message]) => ({ id, message }));
  const intro = step === "gift" || step === "about" ? "This step is optional."
    : step === "review" ? "Check everything, then send it to us on WhatsApp."
    : step === "business" ? "Only the business name is needed. The rest is optional."
    : "Everything is required unless it says optional.";

  return (
    <div data-kb={kb ? "1" : "0"} className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <form noValidate onSubmit={(e) => { e.preventDefault(); if (step === "review") send(); else next(); }} className="min-w-0" data-step={step}>
        <Stepper list={list} idx={idx} />
        <ErrorSummary errors={errorList} headingRef={summaryRef} />
        <h2 ref={headingRef} tabIndex={-1} className="mb-0.5 text-display-md focus:outline-none">{stepTitles[step]}</h2>
        <p className="mb-2 text-[.875rem] text-stone">{intro}</p>

        {step === "who" ? (
          returning ? (
            <div className="grid gap-2">
              <div className="rounded-[var(--radius-card)] bg-oat p-3 shadow-clay-sm" data-testid="returning-card">
                <p className="text-[.8125rem] text-stone">Welcome back</p>
                <p className="text-[.9375rem] font-semibold">Ordering as {form.name}</p>
                <p className="text-[.875rem]">{normalisePhone(form.phone).ok ? (normalisePhone(form.phone) as { display: string }).display : form.phone}. {customerTypesLabel(form.customerTypes)}.</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2">
                  <button type="button" className="ck-tbtn !-ml-2" onClick={() => setChangeWho(true)}>Not you? Change</button>
                  <button type="button" className="ck-tbtn" onClick={forget}>Forget me on this device</button>
                </div>
              </div>
            </div>
          ) : (
            <StepWho form={form} set={set} errors={errors} onContinueHere={next} />
          )
        ) : null}
        {step === "details" ? <StepDetails form={form} set={set} errors={errors} remember={remember} setRemember={(v) => { setRemember(v); if (v) track("profile_remember", { granted: false, intent: true }); }} hasProfile={Boolean(profile)} onForget={forget} /> : null}
        {step === "delivery" ? <StepDelivery form={form} set={set} errors={errors} minDate={dates.minDate} maxDate={dates.maxDate} lines={msgLines} /> : null}
        {step === "gift" ? <StepGift form={form} set={set} errors={errors} /> : null}
        {step === "business" ? <StepBusiness form={form} set={set} errors={errors} /> : null}
        {step === "about" ? <StepAbout form={form} set={set} errors={errors} /> : null}
        {step === "review" ? (
          <>
            <StepReview form={form} set={set} errors={errors} lines={msgLines} skipGift={skipGift} skipAbout={skipAbout} ticks={ticks} setTick={setTick} onEdit={edit}
              message={buildOrderMessage(buildMsg(currentRef), "full")} numberSet={numberSet} copied={copied} onCopy={copy} count={count} remember={remember} />
            {skipGift || skipAbout ? (
              <p className="mt-1 flex flex-wrap gap-x-2">
                {skipGift ? <button type="button" className="ck-tbtn" onClick={() => edit("gift")}>Add gift options</button> : null}
                {skipAbout ? <button type="button" className="ck-tbtn" onClick={() => edit("about")}>Add about you</button> : null}
              </p>
            ) : null}
          </>
        ) : null}

        <div className="ck-bar ck-bar--wiz">
          <div className={cx("flex items-center gap-2", step === "review" ? "flex-col-reverse items-stretch sm:flex-row sm:items-center" : "justify-between")}>
            {idx > 0 ? <Button variant="ghost" size="large" onClick={back}>Back</Button> : <span />}
            <div className={cx("flex flex-wrap gap-2", step === "review" && "flex-1 sm:justify-end")}>
              {step === "gift" ? <Button variant="ghost" size="large" onClick={skipGiftStep}>Skip gift options</Button> : null}
              {step === "about" ? <Button variant="ghost" size="large" onClick={skipAboutStep}>Skip</Button> : null}
              {step === "review" ? (
                <button type="submit" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-olive-deep px-4 text-[.9375rem] font-semibold text-bone shadow-clay-sm sm:flex-none">
                  <Icon name="whatsapp" size={22} />{numberSet ? "Send order on WhatsApp" : "Copy my order message"}
                </button>
              ) : (
                <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-terracotta-deep px-5 text-[.9375rem] font-semibold text-bone shadow-clay-sm">
                  {fromReview ? "Save and back to review" : returning && step === "who" ? "Continue" : "Next"}<Icon name="arrow" size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      <aside aria-labelledby="wiz-items" className="hidden rounded-[var(--radius-panel)] bg-oat p-3 shadow-clay-sm xl:sticky xl:top-28 xl:block">
        <h2 id="wiz-items" className="text-[.9375rem]">Your items</h2>
        <ul className="mt-2 grid gap-1.5">
          {lines.map((l) => (
            <li key={l.sku} className="text-[.875rem]">
              <span className="font-semibold">{l.qty} x {l.name}</span>, {lineColour(l)}, {sizeWord(l.size)}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[.8125rem] text-stone">{BUSINESS_NAME} confirms prices and delivery on WhatsApp.</p>
        <Link href="/cart" className="ck-tbtn -ml-2 !justify-start">Change items</Link>
      </aside>
    </div>
  );
}

function Stepper({ list, idx }: { list: StepId[]; idx: number }) {
  return (
    <div className="mb-2">
      <p className="text-[.875rem] font-semibold text-baobab" data-testid="step-count">Step {idx + 1} of {list.length}</p>
      <div className="mt-1 h-1.5 rounded-full bg-sand" aria-hidden="true">
        <div className="h-1.5 rounded-full bg-olive-deep transition-[width] duration-300" style={{ width: `${((idx + 1) / list.length) * 100}%` }} />
      </div>
      <ol aria-label="Order steps" className="sr-only">
        {list.map((s, i) => <li key={s} aria-current={i === idx ? "step" : undefined}>{stepTitles[s]}{i < idx ? ", done" : i === idx ? ", current step" : ""}</li>)}
      </ol>
    </div>
  );
}
