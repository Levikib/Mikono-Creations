"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useReducer, useRef, useState, useSyncExternalStore, type FormEvent, type TouchEvent } from "react";
import { ErrorSummary, focusSummary } from "../Form";
import { Icon } from "../Icon";
import { OptionCard } from "./ui";
import { env } from "@/lib/env";
import { attribution } from "@/lib/track";
import { normalisePhone } from "@/lib/phone";
import { copyText, sourceFromAttribution } from "@/lib/whatsapp";
import { STUDIO_PATH, stepHints, stepTitles } from "@/data/studio";
import type { StudioData } from "@/lib/studio/catalogue";
import { applyQuery, clearDraft, hasContent, initialState, readDraft, reducer, writeDraft, writeSent, type StudioState } from "@/lib/studio/state";
import { activeSteps, isBulk, totalCount } from "@/lib/studio/flow";
import { newBriefRef, planBriefSend, type BriefMsg } from "@/lib/studio/message";
import { shortLine } from "@/lib/studio/summary";
import { firstPieceWithError, tomorrowISO, validateAll, validateStep } from "@/lib/studio/validate";
import { qtyBand, studioTrack } from "@/lib/studio/track";
import type { PathMode, StepId } from "@/lib/studio/types";
import { BriefCard } from "./BriefCard";
import { Stepper } from "./Stepper";
import { BaseSection, CustomerSection, PiecesStep, SizeSection, TypesSection, WhoStep, type StepProps } from "./StepsA";
// Later steps load when the person reaches them, so the first step ships only what it needs.
const ColoursSection = dynamic(() => import("./StepsB").then((m) => m.ColoursSection), { ssr: false });
const LookStep = dynamic(() => import("./StepsB").then((m) => m.LookStep), { ssr: false });
const PersonalStep = dynamic(() => import("./StepsB").then((m) => m.PersonalStep), { ssr: false });
const InspirationStep = dynamic(() => import("./StepsB").then((m) => m.InspirationStep), { ssr: false });
const TimingStep = dynamic(() => import("./StepsC").then((m) => m.TimingStep), { ssr: false });
const DeliveryStep = dynamic(() => import("./StepsC").then((m) => m.DeliveryStep), { ssr: false });
const BusinessStep = dynamic(() => import("./StepsC").then((m) => m.BusinessStep), { ssr: false });
const MakingStep = dynamic(() => import("./StepsC").then((m) => m.MakingStep), { ssr: false });
const ContactStep = dynamic(() => import("./StepsC").then((m) => m.ContactStep), { ssr: false });
const ReviewStep = dynamic(() => import("./StepsC").then((m) => m.ReviewStep), { ssr: false });
const QuickWhenStep = dynamic(() => import("./StepsC").then((m) => m.QuickWhenStep), { ssr: false });
const QuickSendStep = dynamic(() => import("./StepsC").then((m) => m.QuickSendStep), { ssr: false });

const noop = () => () => {};
const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);

const storage = (): Storage | null => { try { return window.localStorage; } catch { return null; } };

/** The first thing on the page: two big cards, side by side on wide screens and stacked on phones. A radio group, so the keyboard and screen readers get it for free. */
function PathChooser({ path, onChange }: { path: PathMode; onChange: (p: PathMode) => void }) {
  const cards: { id: PathMode; icon: "sparkle" | "sliders"; title: string; line: string; time: string }[] = [
    { id: "quick", icon: "sparkle", title: "Quick brief, 3 steps", line: "Tell us the basics: what, how many, when and your contact.", time: "Takes about 2 minutes." },
    { id: "full", icon: "sliders", title: "Full brief, all the detail", line: "Every option, many pieces, colours, delivery and inspiration.", time: "Takes 5 to 10 minutes." },
  ];
  return (
    <section aria-labelledby="path-q" className="mb-3" data-pathtoggle>
      <h2 id="path-q" className="mb-1.5 text-[1.0625rem]" style={{ fontFamily: "var(--st-font-display)" }}>How much do you want to tell us?</h2>
      <div role="radiogroup" aria-labelledby="path-q" className="grid gap-2 sm:grid-cols-2">
        {cards.map((c) => (
          <OptionCard key={c.id} name="path" value={c.id} checked={path === c.id} onChange={() => onChange(c.id)} className="min-h-[88px] items-start gap-2.5 p-3" >
            <span className="flex w-full items-start gap-2.5 pr-6">
              <span className="st-ico shrink-0"><Icon name={c.icon} size={22} duo /></span>
              <span className="min-w-0">
                <span className="block text-[1rem] font-bold leading-tight">{c.title}</span>
                <span className="mt-0.5 block text-[.8125rem] leading-snug">{c.line}</span>
                <span className="mt-1 block text-[.75rem] font-semibold st-soft">{c.time}</span>
              </span>
            </span>
          </OptionCard>
        ))}
      </div>
    </section>
  );
}

export function StudioApp({ data }: { data: StudioData }) {
  const hydrated = useHydrated();
  if (!hydrated) return <div className="st mx-auto min-h-[60dvh] max-w-[720px] py-4 text-center" aria-live="polite"><p className="st-soft">Opening the studio</p></div>;
  return <Studio data={data} />;
}

interface Boot { state: StudioState; resume: boolean; entry: string }

function boot(data: StudioData): Boot {
  const params = new URLSearchParams(window.location.search);
  const entry = params.get("src") ?? "direct";
  const slugs = data.animals.map((a) => a.slug);
  const fromLink = params.has("base") || params.has("type") || params.has("path");
  const saved = readDraft(storage());
  if (fromLink) return { state: applyQuery(initialState(), params, slugs), resume: false, entry };
  if (saved) return { state: saved, resume: true, entry };
  return { state: initialState(), resume: false, entry };
}

const toFull: Record<string, StepId> = { qidea: "who", qwhen: "timing", qsend: "review" };
const toQuick: Record<string, StepId> = {
  who: "qidea", pieces: "qidea", look: "qidea", personal: "qidea", ideas: "qidea", timing: "qwhen", delivery: "qwhen", business: "qsend", production: "qsend", contact: "qsend", review: "qsend",
};
const quickHome: Record<string, StepId> = { who: "qidea", pieces: "qidea", look: "qidea", timing: "qwhen", delivery: "qwhen", contact: "qsend", review: "qsend" };

function Studio({ data }: { data: StudioData }) {
  const router = useRouter();
  const [b0] = useState(() => boot(data));
  const [state, dispatch] = useReducer(reducer, b0.state);
  const [resume, setResume] = useState(b0.resume);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errTick, setErrTick] = useState(0);
  const [fromReview, setFromReview] = useState(false);
  const [copied, setCopied] = useState("");
  const [saveFailed, setSaveFailed] = useState(false);
  const [kb, setKb] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [minDate] = useState(() => tomorrowISO());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const resumeRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const firstStep = useRef(true);
  const lastSend = useRef(0);
  const sentRef = useRef(false);
  const touchY = useRef<number | null>(null);

  const { step, brief, contact, path } = state;
  const steps = activeSteps(path, brief);
  const idx = Math.max(0, steps.indexOf(step));
  const total = steps.length;
  const last = idx === total - 1;

  useEffect(() => { studioTrack("studio_view", { entry: b0.entry }); }, [b0.entry]);

  // The WhatsApp float hides while a sticky action bar is on screen (D34).
  useEffect(() => {
    document.documentElement.dataset.stickyBar = "on";
    return () => { delete document.documentElement.dataset.stickyBar; };
  }, []);

  // Autosave on every change. Kept 24 hours on this device only. Contact details are never written.
  useEffect(() => {
    if (resume || !hasContent(brief)) return;
    const t = setTimeout(() => { setSaveFailed(!writeDraft(storage(), state)); }, 250);
    return () => clearTimeout(t);
  }, [state, brief, resume]);

  // Focus the step heading and name the step in the tab title.
  useEffect(() => {
    const title = `Step ${idx + 1} of ${total}: ${stepTitles[step]} | Mikono Creations`;
    document.title = title;
    const t = setTimeout(() => { document.title = title; }, 150);
    if (firstStep.current) { firstStep.current = false; return () => clearTimeout(t); }
    headingRef.current?.focus({ preventScroll: true });
    topRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    return () => clearTimeout(t);
  }, [step, idx, total]);

  useEffect(() => { if (errTick > 0) focusSummary(summaryRef.current); }, [errTick]);
  useEffect(() => { if (resume) resumeRef.current?.focus(); }, [resume]);

  // Browser back and forward move between steps already reached.
  useEffect(() => {
    const onPop = () => {
      const m = /^#step-(\d+)$/.exec(window.location.hash);
      if (!m) return;
      const target = steps[Number(m[1]) - 1];
      if (target && (state.reached.includes(target) || steps.indexOf(target) <= idx)) { setErrors({}); dispatch({ type: "step", step: target }); }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  });

  // On touch screens the on-screen keyboard rises over a fixed bar, so while a text field is focused the bar sits in the flow.
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const isField = (el: EventTarget | null) => el instanceof HTMLElement && el.matches("input:not([type=checkbox]):not([type=radio]),textarea,select");
    const onIn = (e: FocusEvent) => { if (coarse.matches && isField(e.target)) setKb(true); };
    const onOut = () => { setTimeout(() => { if (!isField(document.activeElement)) setKb(false); }, 120); };
    const vv = window.visualViewport;
    const onVv = () => { if (vv && isField(document.activeElement)) setKb(window.innerHeight - vv.height > 120 || coarse.matches); };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    vv?.addEventListener("resize", onVv);
    return () => { document.removeEventListener("focusin", onIn); document.removeEventListener("focusout", onOut); vv?.removeEventListener("resize", onVv); };
  }, []);

  // Best effort drop-off signal.
  const stepNow = useRef(step);
  useEffect(() => { stepNow.current = step; }, [step]);
  useEffect(() => {
    const onHide = () => { if (document.visibilityState === "hidden" && !sentRef.current) studioTrack("studio_abandon", { last_step: stepNow.current }); };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  const goTo = (s: StepId, push = true) => {
    setErrors({});
    setCopied("");
    dispatch({ type: "step", step: s });
    if ((s === "review" || s === "qsend") && !state.ref) dispatch({ type: "ref", ref: newBriefRef() });
    const list = activeSteps(state.path, state.brief);
    if (push) { try { window.history.pushState(null, "", `#step-${list.indexOf(s) + 1}`); } catch { /* ignore */ } }
  };

  const fail = (errs: Record<string, string>, at: StepId) => {
    const pi = firstPieceWithError(errs);
    if (pi >= 0) dispatch({ type: "active", index: pi });
    setErrors(errs); setErrTick((t) => t + 1);
    studioTrack("studio_error", { code: "validation", step: at });
  };

  const setPath = (p: PathMode, target?: StepId) => {
    if (p === state.path) return;
    const to = target ?? (p === "full" ? toFull[step] ?? "who" : toQuick[step] ?? "qidea");
    setErrors({}); setFromReview(false);
    dispatch({ type: "path", path: p, step: to });
    if (p === "quick" && brief.pieces.length > 1) setCopied("");
  };

  const next = () => {
    const errs = validateStep(step, brief, contact, minDate);
    if (Object.keys(errs).length) { fail(errs, step); return; }
    studioTrack("wizard_step_complete", { flow: "studio", step });
    if (step === "contact" || step === "qsend") studioTrack("studio_contact_complete");
    if (fromReview) { setFromReview(false); goTo(path === "quick" ? "qsend" : "review"); return; }
    goTo(steps[Math.min(idx + 1, total - 1)]);
  };
  const back = () => { setFromReview(false); goTo(steps[Math.max(0, idx - 1)]); };
  const edit = (s: StepId) => {
    // Rows from the card name full steps. The quick path has its own homes for the common ones.
    if (path === "quick") {
      const q = quickHome[s];
      if (q) { setFromReview(true); goTo(q); return; }
      dispatch({ type: "path", path: "full", step: s }); setFromReview(true); return;
    }
    setFromReview(true); goTo(s);
  };
  const jump = (s: StepId) => { setFromReview(false); goTo(s); };

  const failAt = (bad: { step: StepId; errors: Record<string, string> }) => {
    setFromReview(true);
    dispatch({ type: "step", step: bad.step });
    fail(bad.errors, bad.step);
  };

  const msg = (ref: string): BriefMsg => {
    const ph = normalisePhone(contact.phone);
    return {
      ref, brief, contact, phone: ph.ok ? ph.e164 : contact.phone.trim(),
      source: sourceFromAttribution(attribution()) || undefined, siteUrl: env.siteUrl || undefined,
    };
  };
  const numberFor = () => env.whatsappNumber;

  const copy = async () => {
    const ref = state.ref ?? newBriefRef();
    if (!state.ref) dispatch({ type: "ref", ref });
    const bad = validateAll(path, brief, contact, minDate);
    if (bad) { failAt(bad); return; }
    const ok = await copyText(planBriefSend(numberFor(), msg(ref)).fullText);
    setCopied(ok ? "Brief copied." : "Copying did not work here. Press and hold the text to copy it.");
  };

  const send = () => {
    if (Date.now() - lastSend.current < 2000) return;
    lastSend.current = Date.now();
    const bad = validateAll(path, brief, contact, minDate);
    if (bad) { failAt(bad); return; }
    const ref = state.ref ?? newBriefRef();
    const plan = planBriefSend(numberFor(), msg(ref));
    sentRef.current = true;
    studioTrack("generate_lead", {
      lead_type: "custom", lead_ref: ref, type: brief.types[0], attach_mode: "whatsapp_attach", qty_band: qtyBand(totalCount(brief)),
      pieces: brief.pieces.length, bulk: isBulk(brief), path,
      has_inspiration: brief.picks.length + brief.links.length + brief.photoCount > 0 || brief.notes.some((n) => n.trim().length > 0),
    });
    // The copy kept on the device never holds the KRA PIN.
    // Same plan with the PIN hidden: its text and link are the only copies kept on the device.
    const safe = planBriefSend(numberFor(), { ...msg(ref), hidePin: true });
    writeSent(storage(), { ref, at: Date.now(), fullText: safe.fullText, text: safe.text, url: safe.url, level: safe.level, photoCount: brief.photoCount });
    void copyText(plan.fullText);
    if (plan.url) window.open(plan.url, "_blank", "noopener");
    router.push(`${STUDIO_PATH}/sent?ref=${encodeURIComponent(ref)}`);
  };

  const startAgain = () => {
    clearDraft(storage());
    dispatch({ type: "reset" });
    setResume(false); setFromReview(false); setErrors({}); setCopied("");
    try { window.history.replaceState(null, "", window.location.pathname); } catch { /* ignore */ }
  };

  const onSubmit = (e: FormEvent) => { e.preventDefault(); if (last) send(); else next(); };

  // Brief sheet (mobile). Native dialog: Escape and focus return come from the browser. Swipe down on the handle closes it.
  const openSheet = () => { dialogRef.current?.showModal(); setSheetOpen(true); };
  const closeSheet = () => { dialogRef.current?.close(); };
  const onTouchStart = (e: TouchEvent) => { touchY.current = e.touches[0].clientY; };
  const onTouchMove = (e: TouchEvent) => {
    if (touchY.current == null || !sheetRef.current) return;
    const dy = Math.max(0, e.touches[0].clientY - touchY.current);
    sheetRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchY.current == null || !sheetRef.current) return;
    const dy = e.changedTouches[0].clientY - touchY.current;
    touchY.current = null;
    sheetRef.current.style.transform = "";
    if (dy > 80) closeSheet();
  };

  if (resume) {
    return (
      <section aria-labelledby="resume-title" className="st st-panel mx-auto my-4 max-w-[640px] p-3 md:p-4">
        <h2 id="resume-title" ref={resumeRef} tabIndex={-1} className="text-[1.125rem] focus:outline-none">Welcome back</h2>
        <p className="mt-1.5 text-[.875rem]">You started a brief: {shortLine(brief)}. Would you like to carry on? It is kept on this device only, for 24 hours. Your name, phone and email are never saved.</p>
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          <button type="button" className="st-btn st-btn-primary st-btn-big" onClick={() => setResume(false)}>Continue my brief</button>
          <button type="button" className="st-btn st-btn-ghost st-btn-big" onClick={startAgain}>Start again</button>
        </div>
      </section>
    );
  }

  // Errors disappear as soon as the field is fixed.
  const stillBad = validateStep(step, brief, contact, minDate);
  const errorList = Object.entries(errors).filter(([id]) => id in stillBad).map(([id, message]) => ({ id, message }));
  const shownErrors = Object.fromEntries(errorList.map((e) => [e.id, e.message]));
  const props: StepProps = { state, dispatch, data, errors: shownErrors, minDate, path };
  const reviewProps = { ...props, onEdit: edit, onCopy: copy, copied };

  return (
    <div className="st" data-kb={kb ? "1" : "0"} data-step={step} data-path={path}>
      <div ref={topRef} />
      <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form noValidate onSubmit={onSubmit} className="min-w-0 pb-2" aria-label="Custom order brief">
          <PathChooser path={path} onChange={(p) => setPath(p)} />
          <Stepper steps={steps} step={step} reached={state.reached} onJump={jump} />
          <ErrorSummary errors={errorList} headingRef={summaryRef} />
          <h2 ref={headingRef} tabIndex={-1} className="text-display-md mb-0.5 focus:outline-none" style={{ fontFamily: "var(--st-font-display)" }}>{stepTitles[step]}</h2>
          <p className="mb-2 text-[.8125rem] st-soft">{stepHints[step]}</p>
          {saveFailed ? <p role="status" className="mb-3 text-[.8125rem] st-soft">We could not save your draft on this device. Your answers are kept while this page stays open.</p> : null}

          <div key={step} className="st-rise">
            {step === "qidea" ? (
              <div className="grid gap-3">
                <CustomerSection {...props} /><TypesSection {...props} /><BaseSection {...props} /><SizeSection {...props} /><ColoursSection {...props} />
                {brief.pieces.length > 1 ? <p className="text-[.8125rem] st-soft">Quick brief edits your first piece. Your other {brief.pieces.length - 1} are kept. Choose Full brief to edit them.</p> : (
                  <p className="text-[.8125rem] st-soft">Need several pieces, features, personal touches or more addresses? <button type="button" className="st-link" onClick={() => setPath("full")}>Switch to the full brief</button>.</p>
                )}
              </div>
            ) : null}
            {step === "qwhen" ? <QuickWhenStep {...props} /> : null}
            {step === "qsend" ? <QuickSendStep {...reviewProps} onMore={() => setPath("full", "pieces")} /> : null}
            {step === "who" ? <WhoStep {...props} /> : null}
            {step === "pieces" ? <PiecesStep {...props} /> : null}
            {step === "look" ? <LookStep {...props} /> : null}
            {step === "personal" ? <PersonalStep {...props} /> : null}
            {step === "ideas" ? <InspirationStep {...props} /> : null}
            {step === "timing" ? <TimingStep {...props} /> : null}
            {step === "delivery" ? <DeliveryStep {...props} /> : null}
            {step === "business" ? <BusinessStep {...props} /> : null}
            {step === "production" ? <MakingStep {...props} /> : null}
            {step === "contact" ? <ContactStep {...props} /> : null}
            {step === "review" ? <ReviewStep {...reviewProps} /> : null}
          </div>

          <div className="st-bar mt-3" data-bar>
            {hasContent(brief) ? (
              <button type="button" onClick={openSheet} aria-haspopup="dialog" aria-expanded={sheetOpen} data-sumbar
                className="st-sumbar mb-1.5 flex min-h-11 w-full items-center justify-between gap-2 rounded-full bg-[var(--st-oat)] px-3.5 text-left text-[.8125rem] font-semibold shadow-[inset_0_2px_4px_rgb(110_75_50/.14)] lg:hidden">
                <span className="min-w-0 truncate"><span className="st-soft">Your brief: </span>{shortLine(brief)}</span>
                <Icon name="chevron" size={18} className="shrink-0 rotate-180" />
              </button>
            ) : null}
            <div className="flex items-center gap-2">
              {idx > 0 ? (
                <button type="button" onClick={back} className="st-btn st-btn-sec shrink-0"><Icon name="back" size={18} /><span>Back</span></button>
              ) : null}
              {last ? (
                <button type="submit" className="st-btn st-btn-wa st-btn-big min-w-0 flex-1"><Icon name="whatsapp" size={20} /><span><span className="sm:hidden">Send on WhatsApp</span><span className="hidden sm:inline">Send brief on WhatsApp</span></span></button>
              ) : (
                <button type="submit" className="st-btn st-btn-primary min-w-0 flex-1"><span>{fromReview ? "Back to review" : "Next"}</span><Icon name="arrow" size={18} /></button>
              )}
            </div>
          </div>
        </form>

        <aside aria-label="Brief summary" className="hidden lg:sticky lg:top-20 lg:block">
          {!last ? <BriefCard brief={brief} contact={contact} data={data} /> : <p className="st-panel p-3 text-[.8125rem] st-soft">Your full brief is on the left. Use Edit next to any row to change it.</p>}
          <button type="button" onClick={startAgain} className="st-link mt-2 min-h-11 text-[.8125rem]">Clear my brief</button>
        </aside>
      </div>

      <dialog ref={dialogRef} aria-label="Your brief" className="st-sheet st" onClose={() => setSheetOpen(false)}
        onClick={(e) => { if (e.target === dialogRef.current) closeSheet(); }}>
        <div ref={sheetRef} className="flex min-h-0 flex-1 flex-col" style={{ transition: "transform .2s" }}>
          <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} className="touch-none">
            <div className="st-grab" />
            <div className="flex items-center justify-between px-3 pb-1 pt-1.5">
              <p className="text-[.9375rem] font-semibold" style={{ fontFamily: "var(--st-font-display)" }}>Your brief so far</p>
              <button type="button" onClick={closeSheet} aria-label="Close your brief" className="st-btn st-btn-sec !min-h-9 !px-2.5"><Icon name="close" size={18} /></button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <BriefCard brief={brief} contact={contact} data={data} variant="sheet" onEdit={(s) => { closeSheet(); edit(s); }} />
            <button type="button" onClick={() => { closeSheet(); startAgain(); }} className="st-link mt-2 min-h-11 text-[.8125rem]">Clear my brief</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
