"use client";
import Image from "@/components/Img";
import Link from "next/link";
import { useId, useState, type Dispatch } from "react";
import { TextField, TextareaField } from "../Form";
import { Icon } from "../Icon";
import { cx } from "@/lib/cx";
import {
  BASE_HONEST, BULK_FROM, BULK_NOTICE, MAX_EXACT, MAX_PIECES, SIZE_ADVISE, SIZE_NOTE, SIZE_OTHER, SIZE_OTHER_MAX, customerTypes, genericBases,
  qtyBands, sizeOptions, typeGroups, orderTypes, CHILD_LINE, LABEL_MAX,
} from "@/data/studio";
import type { StudioData, StudioPhoto } from "@/lib/studio/catalogue";
import type { Action, StudioState } from "@/lib/studio/state";
import { isBusinessCustomer, isGentle, pieceCount } from "@/lib/studio/flow";
import { pieceTitle, baseName } from "@/lib/studio/summary";
import type { Errors, PathMode, Piece } from "@/lib/studio/types";
import { studioTrack } from "@/lib/studio/track";
import { Silhouette } from "./Art";
import { Chips, Group, More, Note, OptionCard, OtherText, Pill, hasOther } from "./ui";

export interface StepProps { state: StudioState; dispatch: Dispatch<Action>; data: StudioData; errors: Errors; minDate: string; path: PathMode }

export function Photo({ photo, sizes, className, priority }: { photo: StudioPhoto; sizes: string; className?: string; priority?: boolean }) {
  return (
    <Image src={photo.src} alt="" fill sizes={sizes} loading={priority ? "eager" : undefined} className={cx("object-cover", className)}
      style={{ objectPosition: `${photo.focal[0] * 100}% ${photo.focal[1] * 100}%` }} />
  );
}

export const newId = (prefix: string) => `${prefix}${Math.random().toString(36).slice(2, 7)}`;

/** The piece being edited and a patch helper. */
export function useActive(state: StudioState, dispatch: Dispatch<Action>, onlyFirst = false) {
  const index = onlyFirst ? 0 : Math.min(state.active, state.brief.pieces.length - 1);
  const piece = state.brief.pieces[index];
  const patch = (p: Partial<Piece>) => dispatch({ type: "piece", index, patch: p });
  return { index, piece, patch };
}

/* ---------------- who and what ---------------- */
export function CustomerSection({ state, dispatch, errors }: StepProps) {
  const b = state.brief;
  return (
    <Group id="customerTypes" legend="Who is ordering?" hint="Select all that apply. Other, tell us is always there." error={errors.customerTypes}>
      <Chips name="Who is ordering" multi list={customerTypes} value={b.customerTypes}
        onToggle={(id) => dispatch({ type: "toggle", field: "customerTypes", id })} />
      {hasOther(b.customerTypes) ? <OtherText id="customerTypes-other" label="Who is ordering? In your own words" value={b.others.customerTypes ?? ""} onChange={(v) => dispatch({ type: "other", key: "customerTypes", value: v })} className="mt-2" hint="A few words are enough, for example a book club or a theatre group." /> : null}
    </Group>
  );
}

export function TypesSection({ state, dispatch, errors }: StepProps) {
  const b = state.brief;
  const biz = isBusinessCustomer(b);
  // Groups likely to matter come open first. Others sit in a closed block, so the list stays short.
  const likely = biz ? ["business", "community", "event"] : ["personal", "gift", "event"];
  const groups = [...typeGroups].sort((a, c) => Number(likely.includes(c.id)) - Number(likely.includes(a.id)));
  const openIds = likely.slice(0, 2);
  return (
    <Group id="types" legend="What kind of order is it?" hint="Select all that apply. A baby shower can also be a gift." error={errors.types}>
      <div className="grid gap-2">
        {groups.map((g) => {
          const items = orderTypes.filter((t) => t.group === g.id && t.id !== "other");
          const n = items.filter((t) => b.types.includes(t.id)).length;
          return (
            <More key={g.id} title={g.label} count={n} open={openIds.includes(g.id) || n > 0}>
              <div role="group" aria-label={g.label} className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {items.map((t) => {
                  const on = b.types.includes(t.id);
                  return (
                    <OptionCard key={t.id} type="checkbox" name="types" value={t.id} checked={on}
                      onChange={() => { dispatch({ type: "toggle", field: "types", id: t.id }); if (!on) studioTrack("studio_type_select", { type: t.id }); }}
                      className="min-h-[72px] items-start p-2.5">
                      <span className="flex w-full flex-col items-start gap-1 pr-5">
                        {t.icon ? <span className="st-ico"><Icon name={t.icon} size={18} duo /></span> : null}
                        <span className="text-[.8125rem] font-semibold leading-tight">{t.label}{t.pending ? <span className="sr-only">, to be confirmed</span> : null}</span>
                        <span className="text-[.75rem] leading-snug st-soft">{t.help}</span>
                      </span>
                    </OptionCard>
                  );
                })}
              </div>
            </More>
          );
        })}
      </div>
      <div className="mt-2 grid gap-2">
        <OptionCard type="checkbox" name="types" value="other" checked={b.types.includes("other")} onChange={() => dispatch({ type: "toggle", field: "types", id: "other" })} className="min-h-[56px] items-center px-2.5 py-2">
          <span className="flex w-full flex-col items-start pr-6"><span className="text-[.8125rem] font-semibold leading-tight">Other, tell us</span><span className="text-[.75rem] leading-snug st-soft">Another kind of order, in your own words</span></span>
        </OptionCard>
        {b.types.includes("other") ? <OtherText id="types-other" label="What kind of order is it? In your own words" value={b.others.types ?? ""} onChange={(v) => dispatch({ type: "other", key: "types", value: v })} hint="For example a puppet for a play. We confirm what is possible." /> : null}
      </div>
      <p className="mt-1.5 text-[.75rem] st-soft">{CHILD_LINE}</p>
      {isGentle(b) ? <Note icon="heart" className="mt-2">Take your time. A rough idea is fine, there is no rush, and we are glad to talk it through by phone if you prefer.</Note> : null}
    </Group>
  );
}

export function WhoStep(props: StepProps) {
  return <div className="grid gap-3"><CustomerSection {...props} /><TypesSection {...props} /></div>;
}

/* ---------------- pieces ---------------- */
export function PieceBar({ state, dispatch }: { state: StudioState; dispatch: Dispatch<Action> }) {
  const pieces = state.brief.pieces;
  const idx = Math.min(state.active, pieces.length - 1);
  const [confirm, setConfirm] = useState(false);
  const btn = "st-btn st-btn-sec !min-h-9 !px-2.5 !text-[.75rem]";
  return (
    <section aria-label="Pieces in this brief" className="st-surface grid gap-2 p-2.5" data-piecebar>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[.8125rem] font-semibold">Pieces <span className="font-normal st-soft">({pieces.length})</span></p>
        <p className="text-[.75rem] st-soft">Each piece has its own shape, size and look</p>
      </div>
      <div role="group" aria-label="Choose a piece to edit" className="st-chips !mx-0 !px-0" data-scroll={pieces.length > 6 ? "" : undefined} tabIndex={pieces.length > 6 ? 0 : undefined}>
        {pieces.map((p, i) => (
          <button key={p.id} type="button" aria-pressed={i === idx} onClick={() => { setConfirm(false); dispatch({ type: "active", index: i }); }}
            className={cx("st-pill st-pill-btn max-w-[11rem]", i === idx && "!bg-[var(--st-ink)] !text-[var(--st-paper)]")}>
            <span className="truncate">{pieceTitle(p, i)}</span><span className="st-soft-i text-[.6875rem] opacity-80">x {pieceCount(p) || "?"}</span>
          </button>
        ))}
        {pieces.length < MAX_PIECES ? (
          <button type="button" className="st-pill st-pill-btn" onClick={() => { dispatch({ type: "addPiece", id: newId("p") }); studioTrack("studio_inspiration_add", { kind: "piece", count: pieces.length + 1 }); }}>
            <Icon name="sparkle" size={14} />Add another piece
          </button>
        ) : <p className="text-[.75rem] st-soft">That is {MAX_PIECES} pieces. For more, send a second brief or tell us on WhatsApp.</p>}
      </div>
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={`Actions for ${pieceTitle(pieces[idx], idx)}`}>
        <button type="button" className={btn} disabled={pieces.length >= MAX_PIECES} onClick={() => dispatch({ type: "duplicatePiece", index: idx, id: newId("p") })}>Duplicate</button>
        <button type="button" className={btn} disabled={idx === 0} onClick={() => dispatch({ type: "movePiece", index: idx, dir: -1 })} aria-label="Move this piece earlier">Move earlier</button>
        <button type="button" className={btn} disabled={idx === pieces.length - 1} onClick={() => dispatch({ type: "movePiece", index: idx, dir: 1 })} aria-label="Move this piece later">Move later</button>
        {pieces.length > 1 ? (
          confirm ? (
            <>
              <button type="button" className={cx(btn, "!bg-[var(--st-brick)] !text-[#FFF8EE]")} onClick={() => { dispatch({ type: "removePiece", index: idx }); setConfirm(false); }}>Yes, remove it</button>
              <button type="button" className={btn} onClick={() => setConfirm(false)}>Keep it</button>
            </>
          ) : <button type="button" className={btn} onClick={() => setConfirm(true)}>Remove</button>
        ) : null}
      </div>
    </section>
  );
}

export function PieceLabel({ state, dispatch, hidden }: { state: StudioState; dispatch: Dispatch<Action>; hidden?: boolean }) {
  const { piece, patch } = useActive(state, dispatch);
  if (hidden) return null;
  return (
    <TextField id={`p-label`} label="Name this piece" optional value={piece.label} maxLength={LABEL_MAX} autoComplete="off"
      hint="For example Table gifts. Never a child's name." onChange={(v) => patch({ label: v })} />
  );
}

/** Shape picker for the active piece: generic starting points first, then every real animal. */
export function BaseSection({ state, dispatch, data, errors, path }: StepProps) {
  const { index, piece, patch } = useActive(state, dispatch, path === "quick");
  const [cat, setCat] = useState<string>("all");
  const shown = data.animals.filter((a) => cat === "all" || a.category === cat);
  const generic = genericBases.find((g) => g.id === piece.baseId);
  const set = (id: string) => { patch({ baseId: id }); studioTrack("studio_base_select", { relation: genericBases.some((g) => g.id === id) ? "new_shape" : "exact", slug: genericBases.some((g) => g.id === id) ? undefined : id }); };
  const gid = useId();
  return (
    <div className="grid gap-2">
      <Group id={`p${index}-base`} legend={state.brief.pieces.length > 1 ? `Starting shape for ${pieceTitle(piece, index)}` : "Choose a starting shape"} hint={BASE_HONEST} error={errors[`p${index}-base`]}>
        <p className="mb-1 text-[.75rem] font-semibold uppercase tracking-[.08em] st-soft">New or different</p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4" data-grid="generic-bases">
          {genericBases.map((g) => (
            <OptionCard key={g.id} name={`base-${gid}`} value={g.id} checked={piece.baseId === g.id} onChange={() => set(g.id)} className="min-h-[64px] items-start p-2">
              <span className="flex w-full flex-col items-start gap-0.5 pr-5">
                {g.icon ? <span className="st-ico"><Icon name={g.icon} size={18} duo /></span> : null}
                <span className="text-[.8125rem] font-semibold leading-tight">{g.label}{g.pending ? <span className="sr-only">, to be confirmed</span> : null}</span>
                <span className="text-[.6875rem] leading-snug st-soft">{g.help}</span>
              </span>
            </OptionCard>
          ))}
        </div>
        <p className="mb-1 mt-3 text-[.75rem] font-semibold uppercase tracking-[.08em] st-soft">Animals we make</p>
        <div role="radiogroup" aria-label="Show animals from" className="st-chips !mb-1">
          {[{ key: "all", label: "All" }, ...data.categories].map((c) => (
            <Pill key={c.key} name={`cat-${gid}`} value={c.key} checked={cat === c.key} onChange={() => setCat(c.key)}>{c.label}</Pill>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5" data-grid="animals">
          {shown.map((a) => (
            <OptionCard key={a.slug} name={`base-${gid}`} value={a.slug} checked={piece.baseId === a.slug} onChange={() => set(a.slug)} className="flex-col p-1" ariaLabel={a.name}>
              <span className="st-opt-media block aspect-square w-full">{a.photo ? <Photo photo={a.photo} sizes="(min-width:1024px) 120px, 30vw" /> : null}</span>
              <span className="px-1 pb-1 pt-1.5 text-[.75rem] font-semibold leading-tight">{a.name}</span>
            </OptionCard>
          ))}
        </div>
      </Group>
      {generic?.describe ? (
        <div className="st-surface st-rise p-3">
          <TextareaField id={`p${index}-baseNote`} label={generic.id === "describe" ? "Describe it" : `Tell us about the ${generic.label.toLowerCase().replace(/^an? /, "")}`} hint="A few words are enough. You can add photos or links in the inspiration step."
            value={piece.baseNote} onChange={(v) => patch({ baseNote: v })} maxLength={300} rows={3} error={errors[`p${index}-baseNote`]} />
        </div>
      ) : piece.baseId ? (
        <TextareaField id={`p${index}-baseNote`} label="What should be different?" optional hint={`Optional. For example another colour or a different face on the ${baseName(piece.baseId)}.`}
          value={piece.baseNote} onChange={(v) => patch({ baseNote: v })} maxLength={300} rows={2} />
      ) : null}
    </div>
  );
}

/** Size and count for the active piece. */
export function SizeSection({ state, dispatch, errors, path }: StepProps) {
  const { index, piece, patch } = useActive(state, dispatch, path === "quick");
  const b = state.brief;
  const rel = [0.5, 0.66, 0.82, 1];
  const total = b.pieces.reduce((s, p) => s + pieceCount(p), 0);
  const bulk = qtyBands.find((x) => x.id === piece.qtyBand)?.bulk || total >= BULK_FROM;
  return (
    <div className="grid gap-3">
      <Group id={`p${index}-size`} legend="Pick a size" hint={SIZE_NOTE} error={errors[`p${index}-size`]} tbc>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" data-grid="sizes">
          {sizeOptions.map((s, i) => (
            <OptionCard key={s.value} name={`size-${piece.id}`} value={s.value} checked={piece.size === s.value}
              onChange={() => { patch({ size: s.value }); studioTrack("studio_size_select", { size: s.value }); }} className="flex-col items-center p-2 text-center">
              <span className="mt-1 flex h-[64px] items-end justify-center"><Silhouette scale={rel[i]} ghost={i < 3} className="!h-[60px] !w-[60px]" /></span>
              <span className="mt-1 text-[.8125rem] font-semibold">{s.label}</span>
              <span data-todo="size-wording" className="mt-0.5 pb-1 text-[.6875rem] leading-snug st-soft">{s.line}</span>
            </OptionCard>
          ))}
          <OptionCard name={`size-${piece.id}`} value="advise" checked={piece.size === "advise"} onChange={() => patch({ size: "advise" })} className="col-span-1 min-h-[56px] items-center gap-2 px-2.5 py-2 sm:col-span-2">
            <span className="st-ico"><Icon name="ruler" size={18} duo /></span>
            <span className="pr-6"><span className="block text-[.8125rem] font-semibold">{SIZE_ADVISE.label}</span><span className="block text-[.6875rem] st-soft">{SIZE_ADVISE.help}</span></span>
          </OptionCard>
          <OptionCard name={`size-${piece.id}`} value="other" checked={piece.size === "other"} onChange={() => patch({ size: "other" })} className="col-span-1 min-h-[56px] items-center gap-2 px-2.5 py-2 sm:col-span-2">
            <span className="st-ico"><Icon name="sliders" size={18} duo /></span>
            <span className="pr-6"><span className="block text-[.8125rem] font-semibold">{SIZE_OTHER.label}</span><span className="block text-[.6875rem] st-soft">Describe it below</span></span>
          </OptionCard>
        </div>
        {piece.size === "other" ? (
          <TextField id={`p${index}-sizeOther`} label="Describe the size" className="mt-2" value={piece.sizeOther} maxLength={SIZE_OTHER_MAX} autoComplete="off"
            onChange={(v) => patch({ sizeOther: v })} error={errors[`p${index}-sizeOther`]} hint={SIZE_OTHER.help} />
        ) : null}
      </Group>

      <Group id={`p${index}-qty`} legend={b.pieces.length > 1 ? "How many of this piece?" : "How many?"} hint="Pick a range, or type the exact number." error={errors[`p${index}-qty`]}>
        <div className="flex flex-wrap items-end gap-2">
          <Chips name="How many" list={qtyBands} value={[piece.qtyBand]} onToggle={(id, on) => { if (on) { patch({ qtyBand: id, qtyExact: "" }); studioTrack("studio_quantity_set", { band: id, bulk_path: !!qtyBands.find((x) => x.id === id)?.bulk }); } }} />
          <label className="flex items-center gap-1.5 text-[.75rem] st-soft">
            <span>Exact number</span>
            <input inputMode="numeric" pattern="[0-9]*" aria-label="Exact number of this piece" value={piece.qtyExact} maxLength={5}
              onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 5); patch({ qtyExact: v }); }}
              placeholder="e.g. 12" className="h-11 w-24 rounded-[var(--radius-input,12px)] border-[1.5px] border-line bg-paper px-2 text-[1rem] md:text-sm" />
          </label>
        </div>
        <p className="mt-1 text-[.75rem] st-soft">Any number is fine. For several designs, add a piece for each. Over {MAX_EXACT.toLocaleString("en")}? Tell us in the notes.</p>
      </Group>
      {bulk ? (
        <Note icon="sparkle">{BULK_NOTICE}{" "}<Link href="/wholesale" className="st-link">Prefer a price list? Go to wholesale</Link>.</Note>
      ) : null}
      {piece.size === "XL" && piece.baseId && (piece.baseId === "new-animal" || piece.baseId === "mythical") ? <Note>Large new shapes take the longest to plan. We will confirm what is possible.</Note> : null}
    </div>
  );
}

export function PiecesStep(props: StepProps) {
  const { state, dispatch } = props;
  return (
    <div className="grid gap-3">
      <PieceBar state={state} dispatch={dispatch} />
      <PieceLabel state={state} dispatch={dispatch} hidden={state.brief.pieces.length < 2} />
      <BaseSection {...props} />
      <SizeSection {...props} />
    </div>
  );
}
