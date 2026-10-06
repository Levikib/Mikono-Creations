"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "@/components/Img";
import Link from "next/link";
import { buttonClass } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useCart } from "@/lib/cart";
import { buildWaUrl } from "@/lib/whatsapp";
import { env } from "@/lib/env";
import { KINDS, MAX_RECIPIENTS, OCCASIONS, OTHER_TEXT_MAX, OTHER_VALUE, SIZE_FEEL, WHO } from "@/data/helpers";
import { sizeWord } from "@/data/studio/labels";
import { availableMoods, groupNames, many, recommend } from "@/lib/helpers/gift";
import { buildAskMessage, buildGroupsMessage } from "@/lib/helpers/message";
import { skuFor } from "@/lib/helpers/family";
import { usePersisted } from "@/lib/helpers/store";
import { trackHelper, trackWhatsApp } from "@/lib/helpers/track";
import type { GiftAnswers, GiftPick, HelperAnimal, Recipient } from "@/lib/helpers/types";
import { OptionCard } from "./OptionCard";
import { ResultCard } from "./ResultCard";
import { StepCard } from "./StepCard";
import { SizeMark } from "./SizeMark";
import "./helpers.css";

/** step 0 is the intro, 1 to 5 are the questions for the active person, 6 shows results for everyone. */
type State = { step: number; recipients: Recipient[]; active: number };
const FALLBACK: State = { step: 0, recipients: [{ id: "r1", answers: {} }], active: 0 };
const isMany = (v: unknown) => v === undefined || typeof v === "string" || (Array.isArray(v) && v.every((x) => typeof x === "string"));
const isState = (x: unknown): x is State => {
  const s = x as State;
  return !!s && typeof s.step === "number" && s.step >= 0 && s.step <= 6 && Array.isArray(s.recipients) && s.recipients.length >= 1 && s.recipients.length <= MAX_RECIPIENTS
    && typeof s.active === "number" && !!s.recipients[s.active]
    && s.recipients.every((r) => !!r && typeof r.id === "string" && !!r.answers && typeof r.answers === "object"
      && Object.entries(r.answers).every(([k, v]) => (k === "other" ? !!v && typeof v === "object" && Object.values(v as object).every((x) => typeof x === "string") : isMany(v))));
};
const TOTAL = 5;
const RESULT = 6;
type Key = "who" | "occasion" | "kind" | "size" | "mood";
const EXCLUSIVE: Partial<Record<Key, string>> = { kind: "surprise", size: "any", mood: "any" };

const label = (list: { value: string; label: string }[], v: string) => list.find((o) => o.value === v)?.label;
/** The chosen label, or "Other: what they typed" for the Other choice, so their own words travel on. */
const labelO = (list: { value: string; label: string }[], v: string, text?: string) => (v === OTHER_VALUE ? (text?.trim() ? `Other: ${text.trim()}` : "Other") : label(list, v));
const has = (a: GiftAnswers) => many(a.who).length + many(a.occasion).length + many(a.kind).length + many(a.size).length + many(a.mood).length > 0;

export function GiftFinder({ animals }: { animals: HelperAnimal[] }) {
  const [state, save] = usePersisted<State>("gift", FALLBACK, isState);
  const { step, recipients, active } = state;
  const answers = recipients[active].answers;
  const cart = useCart();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const [announce, setAnnounce] = useState("");
  const [shared, setShared] = useState(false);

  const moods = useMemo(() => availableMoods(animals), [animals]);
  const groups = useMemo(
    () => (step >= RESULT ? recipients.filter((r) => has(r.answers)).map((r) => ({ r, picks: recommend(animals, r.answers) })) : []),
    [animals, recipients, step],
  );

  // Move focus to the new question or to the result heading. Not on first load.
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    (step >= RESULT ? resultRef : headingRef).current?.focus();
  }, [step, active]);

  const person = (i: number) => (recipients.length > 1 ? `Person ${i + 1}` : "");
  const go = (to: number) => {
    save({ ...state, step: to });
    if (to === 0) return;
    if (to >= RESULT) {
      trackHelper("helper_result", "gift_finder", { picks: 3, people: recipients.length });
      setAnnounce(recipients.length > 1 ? "Your picks for each person are ready." : "Your three picks are ready.");
    } else {
      trackHelper("helper_step", "gift_finder", { step: to + 1 });
      setAnnounce(`Question ${to} of ${TOTAL}${recipients.length > 1 ? ` for person ${active + 1}` : ""}.`);
    }
  };
  const setOther = (key: Key, text: string) => setAnswers({ ...answers, other: { ...answers.other, [key]: text.slice(0, OTHER_TEXT_MAX) } });
  const setAnswers = (next: GiftAnswers) => save({ ...state, recipients: recipients.map((r, i) => (i === active ? { ...r, answers: next } : r)) });
  /** Several answers can be true. The "any" style choices clear the others, and picking something else clears them. */
  const toggle = (key: Key, value: string) => {
    const cur = many(answers[key]);
    const ex = EXCLUSIVE[key];
    let next: string[];
    if (cur.includes(value)) next = cur.filter((v) => v !== value);
    else if (ex && value === ex) next = [value];
    else next = [...cur.filter((v) => v !== ex), value];
    setAnswers({ ...answers, [key]: next });
  };
  const restart = () => { save(null); setShared(false); trackHelper("helper_restart", "gift_finder"); setAnnounce("Started again. Question 1 of 5."); };
  const addPerson = () => {
    if (recipients.length >= MAX_RECIPIENTS) return;
    save({ step: 1, recipients: [...recipients, { id: `r${Date.now().toString(36)}`, answers: {} }], active: recipients.length });
    setAnnounce(`Question 1 of ${TOTAL} for person ${recipients.length + 1}.`);
    trackHelper("helper_step", "gift_finder", { step: 1, people: recipients.length + 1 });
  };
  const editPerson = (i: number) => save({ ...state, step: 1, active: i });
  const removePerson = (i: number) => {
    if (recipients.length <= 1) return;
    const next = recipients.filter((_, k) => k !== i);
    save({ step: RESULT, recipients: next, active: 0 });
    setAnnounce(`Removed person ${i + 1}.`);
  };

  const moodLabel = (v: string) => moods.find((m) => m.value === v)?.label;
  const addPick = (p: GiftPick) => {
    cart.addLine({
      sku: skuFor({ slug: p.animal.slug, colourKey: p.colour.key, size: p.size, qty: 1 }), slug: p.animal.slug, name: p.animal.name,
      colourKey: p.colour.key, colourLabel: p.colour.label, size: p.size, image: p.colour.image.src,
    });
    trackHelper("helper_cta", "gift_finder", { action: "add", item_id: p.animal.slug });
  };

  const shareHref = groups.length
    ? buildWaUrl(env.whatsappNumber, buildGroupsMessage(groups.map(({ r, picks }) => ({
      picks, answers: r.answers, who: many(r.answers.who).map((w) => (w === OTHER_VALUE ? (r.answers.other?.who?.trim() ? `other: ${r.answers.other.who.trim()}` : "other") : label(WHO, w)?.toLowerCase() ?? "")).filter(Boolean),
    }))))
    : null;

  // Intro: nothing asked yet.
  if (step === 0) {
    return (
      <div className="mkh">
        <p role="status" aria-live="polite" className="sr-only">{announce}</p>
        <section aria-labelledby="mkh-intro" className="mkh-card mkh-rise p-4 md:p-4">
          <p className="mkh-eyebrow">Five quick questions</p>
          <h2 id="mkh-intro" ref={headingRef} tabIndex={-1} className="mt-1.5 text-display-md outline-none">Find the right animal to give</h2>
          <p className="mkh-muted mt-2 max-w-[56ch] text-base leading-snug">
            Tell us a little and we will pick three animals from the shop. Choose more than one answer where it fits. Buying for more than one person? You can add each person after the first. Your answers stay on this device and are not sent to us unless you choose to share your picks.
          </p>
          <button type="button" onClick={() => { trackHelper("helper_start", "gift_finder"); save({ step: 1, recipients: [{ id: "r1", answers: {} }], active: 0 }); setAnnounce("Question 1 of 5."); }}
            className={buttonClass("primary", "large", "mt-4 w-full sm:w-auto")}>Start the quiz<Icon name="arrow" size={20} /></button>
        </section>
      </div>
    );
  }

  if (step >= RESULT) {
    return (
      <div className="mkh">
        <p role="status" aria-live="polite" className="sr-only">{announce}</p>
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div>
            <p className="mkh-eyebrow">Your picks</p>
            <h2 ref={resultRef} tabIndex={-1} className="mt-1 text-display-md outline-none">{groups.length > 1 ? "Animals to consider, for each person" : "Three animals to consider"}</h2>
          </div>
          <button type="button" onClick={restart} className="mkh-btn-text">Start again</button>
        </div>
        {groups.map(({ r, picks }) => {
          const i = recipients.indexOf(r);
          const chips = [
            ...many(r.answers.who).map((v) => labelO(WHO, v, r.answers.other?.who)),
            ...many(r.answers.occasion).map((v) => labelO(OCCASIONS, v, r.answers.other?.occasion)),
            ...many(r.answers.kind).map((v) => labelO(KINDS, v, r.answers.other?.kind)),
            ...many(r.answers.size).filter((v) => v !== "any").map((v) => (v === OTHER_VALUE ? labelO(SIZE_FEEL, v, r.answers.other?.size) : sizeWord(v))),
            ...many(r.answers.mood).filter((v) => v !== "any").map((v) => (v === OTHER_VALUE ? (r.answers.other?.mood?.trim() ? `Other colours: ${r.answers.other.mood.trim()}` : "Other colours") : moodLabel(v))),
          ].filter(Boolean) as string[];
          return (
            <section key={r.id} aria-label={person(i) || "Your picks"} className="mt-3" data-recipient>
              <div className="flex flex-wrap items-center justify-between gap-2">
                {recipients.length > 1 ? <h3 className="font-display text-[1.0625rem] font-bold">{person(i)}</h3> : <span />}
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => editPerson(i)} className="mkh-btn-text" aria-label={`Change answers${recipients.length > 1 ? ` for person ${i + 1}` : ""}`}>Change answers</button>
                  {recipients.length > 1 ? <button type="button" onClick={() => removePerson(i)} className="mkh-btn-text" aria-label={`Remove person ${i + 1}`}>Remove</button> : null}
                </div>
              </div>
              <ul className="mt-1.5 flex flex-wrap gap-1.5" aria-label={`Answers${recipients.length > 1 ? ` for person ${i + 1}` : ""}`}>
                {chips.map((t) => <li key={t} className="mkh-pill mkh-pill-line">{t}</li>)}
              </ul>
              <ul data-card-group className="mt-3 grid gap-3 md:grid-cols-3 md:gap-4 [grid-auto-rows:1fr]">
                {picks.map((p, k) => (
                  <li key={p.animal.slug} className="flex">
                    <ResultCard pick={p} rank={k} eager={i === 0 && k === 0}
                      askHref={buildWaUrl(env.whatsappNumber, buildAskMessage(p.animal.name, p.colour.label, p.size))}
                      customHref={`/custom/studio?base=${p.animal.slug}`}
                      onAdd={() => addPick(p)}
                      onAsk={() => trackWhatsApp("gift_finder", "click", { item_id: p.animal.slug })}
                      onCustom={() => trackHelper("helper_cta", "gift_finder", { action: "custom", item_id: p.animal.slug })} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        <div className="mkh-card mt-4 flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between md:p-4">
          <div>
            <p className="font-display text-[1rem] font-bold">Gifts for more than one person?</p>
            <p className="mkh-muted mt-0.5 text-[.9375rem] leading-snug sm:max-w-[48ch]">Add another person and answer the five questions again. Each person gets their own picks.</p>
          </div>
          <button type="button" onClick={addPerson} disabled={recipients.length >= MAX_RECIPIENTS} className={buttonClass("secondary", "compact", "whitespace-nowrap")}>
            <Icon name="sparkle" size={18} />Add another person
          </button>
        </div>
        <div className="mkh-card mt-3 flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between md:p-4">
          <p className="mkh-muted text-[.9375rem] leading-snug sm:max-w-[48ch]">
            Want a second opinion? Share your picks and we will reply on WhatsApp. This sends the animals and the occasions, nothing else. Availability and delivery are confirmed there.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a href={shareHref ?? "/contact"} {...(shareHref ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onClick={() => { setShared(true); trackHelper("helper_share", "gift_finder"); trackWhatsApp("gift_finder", "click", { kind: "share" }); }}
              className={buttonClass("whatsapp", "compact", "whitespace-nowrap")}><Icon name="whatsapp" size={20} />Share my picks</a>
            <Link href="/cart" className={buttonClass("ghost", "compact")}>View order list</Link>
          </div>
        </div>
        <p role="status" aria-live="polite" className="mkh-muted mt-2 text-[.9375rem]">{shared ? "WhatsApp opened with your picks. Nothing was sent until you press send there." : ""}</p>
        <p className="mkh-muted mt-1 text-[.9375rem]">We do not give age guidance. Ask us on WhatsApp if you have a question about who an animal suits.</p>
      </div>
    );
  }

  // Question steps 1 to 5 (state.step is 1-based while asking).
  const q = step;
  const who = person(active);
  const next = () => go(q + 1);
  const common = { step: q, total: TOTAL, headingRef, onBack: () => (q === 1 && active > 0 ? go(RESULT) : go(q - 1)), onNext: next, onSkip: next };
  const grid = "grid gap-2 [grid-auto-rows:1fr]";
  const sel = "Select all that apply.";
  const ok = (k: Key) => many(answers[k]).length > 0;
  const group = (k: Key) => many(answers[k]);
  return (
    <div className="mkh">
      <p role="status" aria-live="polite" className="sr-only">{announce}</p>
      {who ? <p className="mkh-eyebrow mb-1.5">{who}</p> : null}
      {q === 1 ? (
        <StepCard {...common} onBack={active > 0 ? () => go(RESULT) : undefined} title="Who is it for?" help={`Broad groups only. We do not store names or ages. ${sel}`} canNext={ok("who")}
          onNext={() => ok("who") && go(2)}>
          <div role="group" aria-labelledby="mkh-step-title" className={`${grid} grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`}>
            {WHO.map((o) => <OptionCard key={o.value} multi name="who" {...o} checked={group("who").includes(o.value)} onChange={(v) => toggle("who", v)} />)}
          </div>
          {group("who").includes(OTHER_VALUE) ? <OtherField id="mkh-other-who" label="Who is it for? In your own words" value={answers.other?.who ?? ""} onChange={(v) => setOther("who", v)} hint="A broad group only. Please do not type a name or an age." /> : null}
        </StepCard>
      ) : null}
      {q === 2 ? (
        <StepCard {...common} title="What is the occasion?" help={`We use this to word your message. ${sel}`} canNext={ok("occasion")} onNext={() => ok("occasion") && go(3)}>
          <div role="group" aria-labelledby="mkh-step-title" className={`${grid} grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`}>
            {OCCASIONS.map((o) => <OptionCard key={o.value} multi name="occasion" {...o} checked={group("occasion").includes(o.value)} onChange={(v) => toggle("occasion", v)} />)}
          </div>
          {group("occasion").includes(OTHER_VALUE) ? <OtherField id="mkh-other-occasion" label="What is the occasion? In your own words" value={answers.other?.occasion ?? ""} onChange={(v) => setOther("occasion", v)} /> : null}
        </StepCard>
      ) : null}
      {q === 3 ? (
        <StepCard {...common} title="Which kind of animal?" help={sel} canNext={ok("kind")} onNext={() => ok("kind") && go(4)}>
          <div role="group" aria-labelledby="mkh-step-title" className={`${grid} sm:grid-cols-2`}>
            {KINDS.map((o) => (
              <OptionCard key={o.value} multi name="kind" value={o.value} label={o.label}
                hint={o.value === "surprise" ? "Any animal in the shop" : groupNames(animals, o.value)}
                checked={group("kind").includes(o.value)} onChange={(v) => toggle("kind", v)} />
            ))}
          </div>
          {group("kind").includes(OTHER_VALUE) ? <OtherField id="mkh-other-kind" label="Which kind of animal? In your own words" value={answers.other?.kind ?? ""} onChange={(v) => setOther("kind", v)} hint="For example a bird, a dragon or an animal from a story." /> : null}
        </StepCard>
      ) : null}
      {q === 4 ? (
        <StepCard {...common} title="How big should it feel?" help={`Sizes are steps, each one up from the last. Compare, do not measure. ${sel}`} canNext={ok("size")} onNext={() => ok("size") && go(5)}>
          <div role="group" aria-labelledby="mkh-step-title" className={`${grid} grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3`}>
            {SIZE_FEEL.map((o) => (
              <OptionCard key={o.value} multi name="size" {...o} checked={group("size").includes(o.value)} onChange={(v) => toggle("size", v)}
                media={<SizeMark size={o.value} />} />
            ))}
          </div>
          {group("size").includes(OTHER_VALUE) ? <OtherField id="mkh-other-size" label="What size? In your own words" value={answers.other?.size ?? ""} onChange={(v) => setOther("size", v)} hint="For example about as big as a cushion." /> : null}
        </StepCard>
      ) : null}
      {q === 5 ? (
        <StepCard {...common} title="Which colour mood?" help={`These are real colours from the shop. ${sel}`} canNext={ok("mood")} nextLabel="See picks" onNext={() => ok("mood") && go(RESULT)}>
          <div role="group" aria-labelledby="mkh-step-title" className={`${grid} grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4`}>
            {moods.map((m) => {
              const sw = m.swatch ? animals.find((a) => a.slug === m.swatch![0])?.colours.find((c) => c.key === m.swatch![1]) : undefined;
              return (
                <OptionCard key={m.value} multi name="mood" value={m.value} label={m.label} hint={m.hint} checked={group("mood").includes(m.value)} onChange={(v) => toggle("mood", v)}
                  media={<Swatch src={sw?.image.src} focal={sw?.image.focal} />} />
              );
            })}
          </div>
          {group("mood").includes(OTHER_VALUE) ? <OtherField id="mkh-other-mood" label="Which colours? Any colour, by name" value={answers.other?.mood ?? ""} onChange={(v) => setOther("mood", v)} hint="For example sage green, or the colours of a flag." /> : null}
        </StepCard>
      ) : null}
    </div>
  );
}

/** Free text for an Other choice. A real label, never a placeholder. */
function OtherField({ id, label, value, onChange, hint }: { id: string; label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <div className="mt-3 grid gap-1">
      <label htmlFor={id} className="text-[.9375rem] font-semibold">{label} <span className="mkh-muted font-normal">(optional)</span></label>
      <input id={id} type="text" value={value} maxLength={OTHER_TEXT_MAX} autoComplete="off" enterKeyHint="done" onChange={(e) => onChange(e.target.value)}
        aria-describedby={hint ? `${id}-h` : undefined} className="mkh-input" />
      {hint ? <p id={`${id}-h`} className="mkh-muted text-[.9375rem] leading-snug">{hint}</p> : null}
    </div>
  );
}

function Swatch({ src, focal }: { src?: string; focal?: [number, number] }) {
  return (
    <span className="relative size-11 flex-none overflow-hidden rounded-full" style={{ background: "var(--h-sand)", boxShadow: "0 0 0 2px var(--h-paper), 0 0 0 3.5px var(--h-line)" }}>
      {src ? <Image src={src} alt="" fill sizes="44px" className="object-cover" style={{ objectPosition: `${(focal?.[0] ?? .5) * 100}% ${(focal?.[1] ?? .45) * 100}%` }} /> : null}
    </span>
  );
}
