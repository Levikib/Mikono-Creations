"use client";
import Image from "@/components/Img";
import Link from "next/link";
import { useId, useState } from "react";
import { lineColour, lineName, NOTE_MAX, useCart, type CartLine } from "@/lib/cart";
import { formatKes } from "@/lib/pricing";
import { MAX_QTY_PER_LINE, QUOTE_THRESHOLD_UNITS } from "@/lib/site";
import { cx } from "@/lib/cx";
import { Button } from "./Button";
import { Icon } from "./Icon";
import "./cart/checkout.css";
import { sizeWord } from "@/lib/sizes";

/** Compact stepper: 32px buttons with 44px hit areas. */
export function QtyStepper({ line }: { line: Pick<CartLine, "sku" | "qty" | "size" | "name" | "colourKey" | "colourLabel"> }) {
  const { setQty } = useCart();
  const [text, setText] = useState<string | null>(null);
  const commit = () => {
    if (text !== null) {
      const n = parseInt(text, 10);
      setQty(line.sku, Number.isNaN(n) ? line.qty : n);
      setText(null);
    }
  };
  const btn = "hit-area inline-flex size-8 items-center justify-center rounded-full bg-oat text-[1.0625rem] font-semibold text-baobab shadow-clay-sm disabled:opacity-40";
  return (
    <div role="group" aria-label={`Quantity for ${lineName(line)}, ${sizeWord(line.size)}`} className="clay-well inline-flex items-center rounded-full p-1">
      <button type="button" className={btn} aria-label={`One less ${lineName(line)}`} disabled={line.qty <= 1} onClick={() => setQty(line.sku, line.qty - 1)}>
        <span aria-hidden="true">&minus;</span>
      </button>
      <input aria-label={`Quantity of ${lineName(line)}`} inputMode="numeric" pattern="[0-9]*" enterKeyHint="done" value={text ?? String(line.qty)}
        onChange={(e) => setText(e.target.value.replace(/\D/g, "").slice(0, 2))} onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
        className="h-8 w-8 bg-transparent text-center text-[1rem] font-semibold tabular-nums text-charcoal md:text-sm" />
      <button type="button" className={btn} aria-label={`One more ${lineName(line)}`} disabled={line.qty >= MAX_QTY_PER_LINE} onClick={() => setQty(line.sku, line.qty + 1)}>
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}

/** The price slot of a line: the line total, or "To be confirmed" for a line that is no longer listed. */
export function LinePrice({ unitKes, totalKes, qty }: { unitKes: number | null; totalKes: number | null; qty: number }) {
  if (totalKes === null || unitKes === null) return <span className="shrink-0 text-right text-[.75rem] leading-tight text-stone">To be confirmed</span>;
  return (
    <span className="shrink-0 text-right leading-tight">
      <span className="price block text-[.875rem] text-baobab">{formatKes(totalKes)}</span>
      {qty > 1 ? <span className="block text-[.75rem] text-stone">{qty} x {formatKes(unitKes)}</span> : null}
    </span>
  );
}

export interface LineAction { onEdit?: () => void; onAnother?: () => void; onSave?: () => void; stale?: boolean; price?: { unitKes: number | null; totalKes: number | null } }

/** One line of the order list. variant "page" has every action, "drawer" keeps quantity and remove only. */
export function CartLineItem({ line, onNavigate, variant = "page", edit }: { line: CartLine; onNavigate?: () => void; variant?: "page" | "drawer"; edit?: LineAction }) {
  const { removeLine, setNote } = useCart();
  const uid = useId();
  const [noteOpen, setNoteOpen] = useState(false);
  const [draft, setDraft] = useState(line.note ?? "");
  const atMax = line.qty >= MAX_QTY_PER_LINE;
  const drawer = variant === "drawer";
  const closeNote = () => { setNote(line.sku, draft); setNoteOpen(false); };
  return (
    <li id={`line-${line.sku}`} data-line={line.sku} className={cx(
      "grid grid-cols-[52px_minmax(0,1fr)] gap-x-2.5 rounded-[var(--radius-card)] bg-paper p-2 shadow-clay-sm min-[360px]:grid-cols-[56px_minmax(0,1fr)]",
      edit?.stale && "opacity-70",
    )}>
      <Link href={`/shop/${line.slug}`} onClick={onNavigate} tabIndex={-1} aria-hidden="true" className="ck-thumb size-[52px] min-[360px]:size-14">
        {line.image ? <Image src={line.image} alt="" fill sizes="56px" className="object-cover" /> : null}
      </Link>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 font-display text-[.875rem] font-semibold leading-snug text-baobab">
            <Link href={`/shop/${line.slug}`} onClick={onNavigate} className="hit-y line-clamp-1 underline-offset-4 hover:underline">{line.name}</Link>
          </p>
          {edit?.price ? <LinePrice unitKes={edit.price.unitKes} totalKes={edit.price.totalKes} qty={line.qty} /> : null}
        </div>
        <p className="text-[.8125rem] leading-snug text-stone">{lineColour(line)}, {sizeWord(line.size)}</p>
        {line.note && !noteOpen ? <p className="line-clamp-1 text-[.8125rem] leading-snug text-charcoal">Note: {line.note}</p> : null}
        {edit?.stale ? <p className="text-[.8125rem] text-brick">This item is no longer listed. Remove it, or keep it and we check on WhatsApp.</p> : null}
        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
          <QtyStepper line={line} />
          <button type="button" className="ck-tbtn" onClick={() => removeLine(line.sku)} aria-label={`Remove ${lineName(line)}, ${sizeWord(line.size)}`}>Remove</button>
        </div>
        {!drawer ? (
          <div className="-ml-2 flex flex-wrap items-center">
            {edit?.onEdit && !edit.stale ? <button type="button" className="ck-tbtn" onClick={edit.onEdit} aria-label={`Edit size or colour of ${lineName(line)}, ${sizeWord(line.size)}`}>Edit</button> : null}
            <button type="button" className="ck-tbtn" aria-expanded={noteOpen} aria-controls={`${uid}-note`}
              onClick={() => (noteOpen ? closeNote() : (setDraft(line.note ?? ""), setNoteOpen(true)))} aria-label={`${line.note ? "Change note" : "Add a note"} for ${lineName(line)}`}>
              {line.note ? "Change note" : "Add note"}
            </button>
            {edit?.onAnother && !edit.stale ? <button type="button" className="ck-tbtn" onClick={edit.onAnother} aria-label={`Add another size or colour of ${line.name}`}>Add another size or colour</button> : null}
            {edit?.onSave ? <button type="button" className="ck-tbtn" onClick={edit.onSave} aria-label={`Save ${lineName(line)}, ${sizeWord(line.size)} for later`}>Save for later</button> : null}
          </div>
        ) : (
          <Link href="/cart" onClick={onNavigate} className="ck-tbtn -ml-2 mt-0.5 !justify-start">Edit size or colour</Link>
        )}
        {noteOpen ? (
          <div id={`${uid}-note`} className="mt-1">
            <label htmlFor={`${uid}-ni`} className="block text-[.8125rem] font-semibold text-baobab">Note for this one</label>
            <input id={`${uid}-ni`} value={draft} maxLength={NOTE_MAX} enterKeyHint="done" autoFocus autoComplete="off"
              onChange={(e) => setDraft(e.target.value)} onBlur={closeNote}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); closeNote(); } }}
              aria-describedby={`${uid}-nh`}
              className="mt-0.5 block h-9 w-full rounded-[var(--radius-input)] border-[1.5px] border-line bg-paper px-3 text-[1rem] text-charcoal focus:border-terracotta-deep focus:outline-none focus:ring-2 focus:ring-ochre md:text-sm" />
            <p id={`${uid}-nh`} className="mt-0.5 text-[.8125rem] text-stone">Colour wishes, for example. Please do not include a child&rsquo;s name, age or school. {NOTE_MAX - draft.length} characters left.</p>
          </div>
        ) : null}
        {atMax ? (
          <p className="mt-0.5 text-[.8125rem] text-stone">That is the most of one item we add here. For more, <Link href="/wholesale" onClick={onNavigate} className="hit font-semibold text-terracotta-deep underline underline-offset-4">use the wholesale request</Link>.</p>
        ) : null}
      </div>
    </li>
  );
}

export function UndoNotice() {
  const { lastRemoved, undoRemove } = useCart();
  if (!lastRemoved) return <div aria-live="polite" className="sr-only" />;
  return (
    <div role="status" className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-input)] bg-sand px-3 py-1 text-base">
      <span>Removed {lineName(lastRemoved)}, {sizeWord(lastRemoved.size)}.</span>
      <Button variant="ghost" size="compact" onClick={undoRemove}>Undo</Button>
    </div>
  );
}

export function QuotePrompt({ count, onNavigate, className }: { count: number; onNavigate?: () => void; className?: string }) {
  if (count <= QUOTE_THRESHOLD_UNITS) return null;
  return (
    <div className={cx("flex items-start gap-2 rounded-[var(--radius-input)] bg-ochre-tint p-3 text-[.8125rem] text-charcoal", className)}>
      <Icon name="info" size={20} className="mt-0.5 shrink-0 text-ochre-deep" />
      <p>
        That is more than {QUOTE_THRESHOLD_UNITS} pieces. A wholesale request may suit you better, and you can still send this order as it is.{" "}
        <Link href="/wholesale" onClick={onNavigate} className="hit font-semibold text-terracotta-deep underline underline-offset-4">Ask for a quote</Link>
      </p>
    </div>
  );
}

export function CartNotice() {
  const { notice } = useCart();
  if (!notice) return null;
  return (
    <p role="status" className="rounded-[var(--radius-input)] bg-sand px-3 py-2 text-[.8125rem]">
      {notice === "corrupt"
        ? "Your saved order list could not be read, so we started a fresh one. Sorry about that."
        : "Your browser is not saving your order list, so it will be forgotten when you close this tab. You can still send it."}
    </p>
  );
}
