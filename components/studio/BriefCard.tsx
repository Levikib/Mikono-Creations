"use client";
import { useEffect, useRef } from "react";
import { Icon } from "../Icon";
import { cx } from "@/lib/cx";
import { roughGuide } from "@/lib/studio/estimate";
import { briefMeter, briefRows, countLine, pieceLine, pieceTitle, shortLine } from "@/lib/studio/summary";
import type { StudioData } from "@/lib/studio/catalogue";
import type { Brief, Contact, PathMode, StepId } from "@/lib/studio/types";
import { Photo } from "./StepsA";
import { Swatch } from "./StepsB";

/** The live Brief Card. Updates on every change, doubles as the review summary. Empty rows show a soft prompt, never an error. */
export function BriefCard({ brief, contact, data, onEdit, variant = "panel", className }: {
  brief: Brief; contact: Contact; data: StudioData; onEdit?: (s: StepId) => void; variant?: "panel" | "review" | "sheet"; className?: string; path?: PathMode;
}) {
  const rows = briefRows(brief, contact);
  const meter = briefMeter(brief);
  const guide = roughGuide(brief);
  const live = useRef<HTMLParagraphElement>(null);
  const prev = useRef<Record<string, string> | null>(null);

  // Announce only the row that changed, politely, after 800ms of quiet. Written straight to the DOM: no extra renders.
  const sig = rows.map((r) => `${r.key}=${r.value}`).join("|");
  useEffect(() => {
    const now = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    const before = prev.current;
    prev.current = now;
    if (!before || variant === "review") return;
    const changed = rows.find((r) => before[r.key] !== r.value);
    if (!changed) return;
    const t = setTimeout(() => {
      if (live.current) live.current.textContent = changed.value ? `${changed.label} updated` : `${changed.label} cleared`;
    }, 800);
    return () => clearTimeout(t);
    // rows is derived from sig
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig, variant]);

  const animalOf = (slug: string) => data.animals.find((a) => a.slug === slug);
  const first = animalOf(brief.pieces[0]?.baseId ?? "");
  const pins = brief.picks.slice(0, 4).map((p) => ({ p, a: animalOf(p.slug) })).filter((x) => x.a?.photo);
  const multi = brief.pieces.length > 1;

  return (
    <section role="region" aria-label="Your brief" data-brief-card={variant} className={cx("st-panel min-w-0 p-3", className)}>
      <div className="flex items-center gap-2.5">
        <div className="st-opt-media relative grid size-12 shrink-0 place-items-center" style={{ borderRadius: "var(--st-r-photo, 12px)" }}>
          {first?.photo ? <Photo photo={first.photo} sizes="48px" /> : <span className="text-[var(--st-action)]"><Icon name="yarn" size={24} duo /></span>}
        </div>
        <div className="min-w-0 flex-1">
          <p className="st-eyebrow">Your brief</p>
          <p className="text-[.9375rem] font-semibold leading-tight [overflow-wrap:anywhere]" style={{ fontFamily: "var(--st-font-display)" }}>{shortLine(brief)}</p>
          {countLine(brief) ? <p className="text-[.75rem] st-soft">{countLine(brief)}</p> : null}
        </div>
      </div>

      <div className="mt-2.5" data-meter>
        <div className="flex items-baseline justify-between gap-2 text-[.75rem]">
          <span className="font-semibold">How detailed is your brief</span>
          <span className="st-soft">{meter.label}</span>
        </div>
        <div className="st-track mt-1" role="progressbar" aria-label="How detailed is your brief" aria-valuemin={0} aria-valuemax={100} aria-valuenow={meter.percent} aria-valuetext={`${meter.label}, ${meter.percent} percent`}>
          <div className="st-fill" style={{ width: `${meter.percent}%` }} />
        </div>
        {meter.suggestion && variant !== "review" ? <p className="mt-1 text-[.75rem] st-soft">{meter.suggestion}</p> : null}
      </div>

      {guide ? (
        <p className="mt-2.5 rounded-[var(--st-r-photo,14px)] bg-[var(--st-ochre-tint)] px-3 py-2 text-[.8125rem]" data-rough-guide>
          {guide.text}{guide.budgetNote ? ` ${guide.budgetNote}` : ""}
        </p>
      ) : null}

      <ul className="mt-2.5 grid gap-0 divide-y divide-[var(--st-hair)]">
        {rows.map((r) => (
          <li key={r.key} className="flex items-start justify-between gap-2 py-2" data-row={r.key}>
            <div className="min-w-0 flex-1">
              <p className="text-[.6875rem] font-semibold uppercase tracking-[.08em] st-soft">{r.label}</p>
              {r.key === "pieces" ? (
                <ol className={cx("mt-1 grid gap-1.5", brief.pieces.length > 6 && "max-h-[16rem] overflow-y-auto overscroll-contain pr-1")} data-pieces tabIndex={brief.pieces.length > 6 ? 0 : undefined} aria-label={brief.pieces.length > 6 ? `Your ${brief.pieces.length} pieces, scrolls` : undefined}>
                  {brief.pieces.map((p, i) => {
                    const a = animalOf(p.baseId);
                    return (
                      <li key={p.id} className="flex items-center gap-2 text-[.8125rem]">
                        <span className="st-opt-media relative size-8 shrink-0 overflow-hidden" style={{ borderRadius: 8 }}>{a?.photo ? <Photo photo={a.photo} sizes="32px" /> : <span className="grid size-full place-items-center text-[var(--st-action)]"><Icon name="yarn" size={16} /></span>}</span>
                        <span className="min-w-0 [overflow-wrap:anywhere]"><span className="font-semibold">{pieceTitle(p, i)}</span><span className="block st-soft">{pieceLine(p) || "Not chosen yet"}</span></span>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <div className={cx("mt-0.5 whitespace-pre-line text-[.8125rem] [overflow-wrap:anywhere]", !r.value && "st-soft", r.value.split("\n").length > 6 && "max-h-[11rem] overflow-y-auto overscroll-contain pr-1")}
                  tabIndex={r.value.split("\n").length > 6 ? 0 : undefined} aria-label={r.value.split("\n").length > 6 ? `${r.label}, scrolls` : undefined}>
                  {r.value || "Not chosen yet"}
                  {r.key === "colours" && !multi && brief.pieces[0].colours.length ? (
                    <span className="mt-1 flex flex-wrap gap-1">{brief.pieces[0].colours.map((c) => data.colours.find((x) => x.id === c.id)).filter((c): c is NonNullable<typeof c> => !!c).map((c) => <Swatch key={c.id} colour={c} size={26} />)}</span>
                  ) : null}
                  {r.key === "ideas" && pins.length ? (
                    <span className="mt-1 flex flex-wrap gap-1">{pins.map(({ p, a }) => <span key={p.slug} className="st-opt-media relative size-8 shrink-0 overflow-hidden" style={{ borderRadius: 8 }}>{a?.photo ? <Photo photo={a.photo} sizes="32px" /> : null}</span>)}</span>
                  ) : null}
                </div>
              )}
            </div>
            {onEdit ? <button type="button" onClick={() => onEdit(r.step)} aria-label={`Edit ${r.label}`} className="st-link min-h-11 shrink-0 px-1 text-[.8125rem]">Edit</button> : null}
          </li>
        ))}
      </ul>
      <p ref={live} role="status" aria-live="polite" className="sr-only" />
    </section>
  );
}
