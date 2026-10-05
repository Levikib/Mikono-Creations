"use client";
import { useEffect, useRef, useState } from "react";
import { lineColour, lineName, useCart } from "@/lib/cart";
import { sizeWord } from "@/lib/sizes";
import { MAX_QTY_PER_LINE } from "@/lib/site";
import { Button } from "../Button";
import { Icon } from "../Icon";

/** Edit every quantity in one place. 0 removes the line (it can be undone from the list). */
export function BulkQuantities({ onClose }: { onClose: () => void }) {
  const { lines, setQty, removeLine } = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  const [vals, setVals] = useState<Record<string, string>>(() => Object.fromEntries(lines.map((l) => [l.sku, String(l.qty)])));
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  const save = () => {
    for (const l of lines) {
      const n = parseInt(vals[l.sku] ?? "", 10);
      if (Number.isNaN(n)) continue;
      if (n <= 0) removeLine(l.sku);
      else if (n !== l.qty) setQty(l.sku, n);
    }
    onClose();
  };
  return (
    <dialog ref={ref} aria-labelledby="bulk-title" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }} className="ck-sheet">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-sand px-4">
        <h2 id="bulk-title" className="text-[.9375rem]">Edit all quantities</h2>
        <button type="button" aria-label="Close without saving" onClick={onClose} className="hit-area inline-flex size-9 items-center justify-center rounded-full text-baobab"><Icon name="close" size={22} /></button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
        <p className="mb-1 text-[.8125rem] text-stone">Type a number for each line, from 1 to {MAX_QTY_PER_LINE}. Type 0 to remove a line.</p>
        <ul className="grid gap-1">
          {lines.map((l) => (
            <li key={l.sku} className="flex items-center justify-between gap-2">
              <label htmlFor={`bq-${l.sku}`} className="min-w-0 text-[.875rem]">
                <span className="block truncate font-semibold">{l.name}</span>
                <span className="block truncate text-[.8125rem] text-stone">{lineColour(l)}, {sizeWord(l.size)}</span>
              </label>
              <input id={`bq-${l.sku}`} aria-label={`Quantity of ${lineName(l)}, ${sizeWord(l.size)}`} inputMode="numeric" pattern="[0-9]*" enterKeyHint="next" autoComplete="off"
                value={vals[l.sku] ?? ""} onChange={(e) => setVals((v) => ({ ...v, [l.sku]: e.target.value.replace(/\D/g, "").slice(0, 2) }))}
                className="h-9 w-16 shrink-0 rounded-[var(--radius-input)] border-[1.5px] border-line bg-paper text-center text-[1rem] font-semibold tabular-nums text-charcoal focus:border-terracotta-deep focus:outline-none focus:ring-2 focus:ring-ochre md:text-sm" />
            </li>
          ))}
        </ul>
      </div>
      <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-sand bg-bone p-3 pb-[max(.75rem,env(safe-area-inset-bottom))]">
        <Button variant="ghost" size="large" onClick={onClose}>Cancel</Button>
        <Button size="large" onClick={save}>Save quantities</Button>
      </div>
    </dialog>
  );
}
