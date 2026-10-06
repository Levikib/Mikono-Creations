"use client";
import { priceLadderText } from "@/lib/pricing";
import { useState } from "react";
import Image from "@/components/Img";
import Link from "next/link";
import { buttonClass } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { env } from "@/lib/env";
import { buildWaUrl } from "@/lib/whatsapp";
import { SIZE_OBJECTS, SIZE_OBJECTS_NOTE, SIZE_USES } from "@/data/helpers";
import { sizesFor } from "@/lib/helpers/size";
import { sizeWord } from "@/data/studio/labels";
import { usePersisted } from "@/lib/helpers/store";
import { trackHelper, trackWhatsApp } from "@/lib/helpers/track";
import { CompareObject } from "./CompareObject";
import { OptionCard } from "./OptionCard";
import { SizeMark } from "./SizeMark";
import "./helpers.css";

type State = { uses: string[] };
const FALLBACK: State = { uses: [] };
const isState = (x: unknown): x is State => !!x && typeof x === "object" && Array.isArray((x as State).uses) && (x as State).uses.every((u) => typeof u === "string");

export function SizeFinder() {
  const [state, save] = usePersisted<State>("size", FALLBACK, isState);
  const [announce, setAnnounce] = useState("");
  const rec = sizesFor(state.uses);
  const has = rec.items.length > 0;
  const words = (list: string[]) => list.map(sizeWord).join(" or ");

  const toggle = (v: string) => {
    const uses = state.uses.includes(v) ? state.uses.filter((u) => u !== v) : [...state.uses, v];
    save({ uses });
    const r = sizesFor(uses);
    setAnnounce(r.items.length ? `We suggest ${words(r.mains)}${r.alsos.length ? `. Also worth a look: ${words(r.alsos)}` : ""}.` : "Choices cleared.");
    trackHelper("helper_result", "size_finder", { size: r.mains.join(","), uses: uses.length });
  };

  const waText = has
    ? `Hello Mikono Creations, I am choosing a size for ${rec.items.map((i) => i.label.toLowerCase()).join(" and ")}. I am thinking of ${words(rec.mains).toLowerCase()}. Can you help me check it?`
    : "Hello Mikono Creations, can you help me choose a size?";
  const wa = buildWaUrl(env.whatsappNumber, waText);

  return (
    <div className="mkh grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-3">
      <div className="grid gap-4">
        <section aria-labelledby="mkh-ladder" className="mkh-card p-3.5 md:p-3">
          <h2 id="mkh-ladder" className="text-display-md">Four steps, one up from the next</h2>
          <p className="mkh-muted mt-1 text-[.9375rem] leading-snug md:text-base">Same animal, drawn at each size. Under each one, an everyday thing to picture it by.</p>
          <ol className="mt-4 grid grid-cols-4 gap-1.5 md:gap-3" data-card-group>
            {SIZE_OBJECTS.map((s, i) => {
              const main = rec.mains.includes(s.size);
              const also = !main && rec.alsos.includes(s.size);
              return (
                <li key={s.size} data-card="size-step" className="mkh-well flex flex-col items-center gap-2 px-1 pb-3 pt-2 text-center"
                  style={main ? { boxShadow: "0 0 0 2.5px var(--h-accent), inset 0 3px 6px rgb(110 75 50 / .14)" } : also ? { boxShadow: "0 0 0 2px var(--h-ochre), inset 0 3px 6px rgb(110 75 50 / .14)" } : undefined}>
                  <span className="flex h-[7rem] w-full items-end justify-center">
                    <SizeMark size={s.size} className="!h-full !w-full" />
                  </span>
                  <span className="flex min-h-8 max-w-full items-center justify-center rounded-full px-1.5 text-center text-[.6875rem] font-semibold leading-tight sm:px-2 sm:text-[.75rem]" style={{ background: main ? "var(--h-accent)" : "var(--h-ink)", color: "var(--h-bone)" }}>{sizeWord(s.size)}</span>
                  <span className="mkh-muted"><CompareObject object={s.object} size={i === 0 ? 40 : 44} /></span>
                  <span className="block h-[2.5em] text-[.875rem] font-semibold leading-tight">{s.word}</span>
                  <span className="sr-only">{s.line}{main ? " Our suggestion." : also ? " Also worth a look." : ""}</span>
                </li>
              );
            })}
          </ol>
          <p className="mkh-muted mt-3 text-[.875rem] leading-snug">{SIZE_OBJECTS_NOTE}</p>
        </section>

        <figure className="mkh-card m-0 p-2.5 md:p-3">
          <div className="mkh-media aspect-[716/470] w-full">
            <Image src="/media/story/lion-size-ladder-unlabelled.jpg" alt="Four crocheted tan lions with brown manes in a row on a black table, from largest at the left to smallest at the right, against a cream wall"
              fill sizes="(min-width:1024px) 520px, 92vw" className="object-cover" />
          </div>
          <figcaption className="mkh-muted px-1.5 pb-1 pt-2 text-[.9375rem] leading-snug">The same lion in a row, from the largest at the left to the smallest at the right. Compare by eye: the photo carries no labels or measurements.</figcaption>
        </figure>
      </div>

      <div className="grid gap-4 lg:sticky lg:top-24">
        <section aria-labelledby="mkh-use" className="mkh-card p-3.5 md:p-3">
          <p className="mkh-eyebrow">Size recommender</p>
          <h2 id="mkh-use" className="mt-1 text-display-md">What is it for?</h2>
          <p className="mkh-muted mt-1 text-[.875rem]">Select all that apply. We compare them side by side.</p>
          <div role="group" aria-labelledby="mkh-use" className="mt-3 grid grid-cols-2 gap-2 [grid-auto-rows:1fr]">
            {SIZE_USES.map((u) => (
              <OptionCard key={u.value} multi name="use" value={u.value} label={u.label} hint={u.hint} checked={state.uses.includes(u.value)} onChange={toggle}
                labelClassName="!items-start" />
            ))}
          </div>
        </section>

        <section aria-live="polite" aria-label="Our suggestion" className="mkh-card p-3.5 md:p-3">
          <p role="status" className="sr-only">{announce}</p>
          {has ? (
            <div className="mkh-rise" key={state.uses.join("|")}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex min-h-11 max-w-full items-center justify-center rounded-full px-3 text-center text-[.875rem] font-bold leading-tight" style={{ background: "var(--h-accent)", color: "var(--h-bone)" }}>{words(rec.mains)}</span>
                <div className="min-w-0">
                  <p className="mkh-eyebrow">We suggest</p>
                  <p className="font-display text-[1.125rem] font-bold leading-tight">{rec.mains.length > 1 ? `${words(rec.mains)}, depending on the use` : `${sizeWord(rec.mains[0])}${rec.alsos[0] ? `, or ${sizeWord(rec.alsos[0]).toLowerCase()}` : ""}`}</p>
                </div>
              </div>
              <p data-testid="size-prices" className="mkh-muted mt-2 text-[.875rem]">Prices: {priceLadderText()}. Delivery is not included.</p>
              <ul className="mt-3 grid gap-2" data-compare>
                {rec.items.map((i) => (
                  <li key={i.use} className="mkh-well px-3 py-2 text-[.9375rem] leading-snug">
                    <span className="font-semibold">{i.label}: {sizeWord(i.main)}, or {sizeWord(i.also).toLowerCase()}.</span>
                    <span className="mkh-muted block">{i.reason}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid gap-2">
                {rec.mains.map((m) => (
                  <Link key={m} href={`/shop?size=${m}`} onClick={() => trackHelper("helper_cta", "size_finder", { action: "shop", size: m })}
                    className={buttonClass("primary", "compact", "w-full")}>See {sizeWord(m).toLowerCase()} animals in the shop<Icon name="arrow" size={18} /></Link>
                ))}
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/custom/studio" onClick={() => trackHelper("helper_cta", "size_finder", { action: "studio" })} className="mkh-btn-text"><Icon name="sparkle" size={18} />Make it custom</Link>
                  <a href={wa ?? "/contact"} {...(wa ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={() => trackWhatsApp("size_finder", "click")} className="mkh-btn-text"><Icon name="whatsapp" size={18} />Ask on WhatsApp</a>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="mkh-eyebrow">Our suggestion</p>
              <p className="mkh-muted mt-1 text-[1rem] leading-snug">Choose what it is for and we will suggest a size here. Not sure? Send us a photo of the space on WhatsApp and we will help.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                <Link href="/size-guide" className="mkh-btn-text">Read the size guide</Link>
                <a href={wa ?? "/contact"} {...(wa ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={() => trackWhatsApp("size_finder", "click")} className="mkh-btn-text"><Icon name="whatsapp" size={18} />Ask on WhatsApp</a>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
