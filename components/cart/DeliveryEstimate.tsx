"use client";
import { useId } from "react";
import { counties } from "@/data/counties";
import { OTHER_AREA, sortedAreaNames } from "@/data/deliveryAreas";
import { feeFor, leadTimeText, pickupText, useDelivery, writeDelivery, zoneFor, type DeliveryChoice, type Fulfilment } from "@/lib/delivery";
import { formatKes } from "@/lib/pricing";
import { track } from "@/lib/track";

const areaNames = [...sortedAreaNames(), OTHER_AREA];
const options: Array<{ value: Fulfilment; label: string }> = [
  { value: "pickup", label: "Pickup" }, { value: "nairobi", label: "Nairobi" }, { value: "town", label: "Other Kenyan town" },
];

/** One line that says where the estimate stands. */
export function estimateLine(d: DeliveryChoice): string {
  if (!d.fulfilment) return "Not chosen yet";
  if (d.fulfilment === "pickup") return "Pickup";
  if (d.fulfilment === "nairobi") return d.area ? `Nairobi, ${d.area === OTHER_AREA ? d.areaOther || "other area" : d.area}` : "Nairobi";
  return d.town || d.county ? `${d.town || "Town"}${d.county ? `, ${d.county}` : ""}` : "Other Kenyan town";
}

const sel = "block h-9 w-full rounded-[var(--radius-input)] border-[1.5px] border-line bg-paper px-3 text-[1rem] text-charcoal focus:border-terracotta-deep focus:outline-none focus:ring-2 focus:ring-ochre md:text-sm";

/** Delivery estimate by area. An estimate only: while fees are null it says "confirmed on WhatsApp". Shared with the order form (mk.delivery.v1). */
export function DeliveryEstimate() {
  const uid = useId();
  const d = useDelivery();
  const fee = feeFor(d);
  const zone = zoneFor(d);
  const set = (patch: Partial<DeliveryChoice>) => {
    const next = { ...d, ...patch };
    writeDelivery(next);
    if (patch.fulfilment || patch.area) track("delivery_estimate_view", { shipping_tier: next.fulfilment === "town" ? "kenya_other" : next.fulfilment, area_chosen: Boolean(next.area) });
  };
  return (
    <details className="group rounded-[var(--radius-input)] bg-paper shadow-clay-sm">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-3 text-[.875rem] font-semibold text-baobab [&::-webkit-details-marker]:hidden">
        <span>Delivery estimate <span className="font-normal text-stone">({estimateLine(d)})</span></span>
        <span aria-hidden="true" className="text-stone transition-transform group-open:rotate-180">&#9662;</span>
      </summary>
      <div className="grid gap-2 px-3 pb-3">
        <p className="text-[.8125rem] text-stone">Estimate only. We confirm the real cost and time on WhatsApp.</p>
        <fieldset className="min-w-0 border-0 p-0">
          <legend className="sr-only">How should it reach you</legend>
          <div className="ck-seg">
            {options.map((o) => (
              <label key={o.value}>
                <input type="radio" name={`${uid}-f`} value={o.value} checked={d.fulfilment === o.value} onChange={() => set({ fulfilment: o.value })} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {d.fulfilment === "nairobi" ? (
          <>
            <div>
              <label htmlFor={`${uid}-a`} className="block text-[.8125rem] font-semibold text-baobab">Area</label>
              <select id={`${uid}-a`} value={d.area} onChange={(e) => set({ area: e.target.value })} className={sel} autoComplete="off">
                <option value="">Choose your area</option>
                {areaNames.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            {d.area === OTHER_AREA ? (
              <div>
                <label htmlFor={`${uid}-ao`} className="block text-[.8125rem] font-semibold text-baobab">Which area?</label>
                <input id={`${uid}-ao`} value={d.areaOther} onChange={(e) => set({ areaOther: e.target.value.slice(0, 80) })} className={sel} enterKeyHint="done" autoComplete="off" />
              </div>
            ) : null}
            {d.area ? (
              <p className="text-[.8125rem]" data-testid="delivery-fee">
                {fee === null ? "Delivery cost: confirmed on WhatsApp." : `Delivery cost: ${formatKes(fee)}.`}{zone ? ` Zone ${zone}.` : ""}
              </p>
            ) : null}
          </>
        ) : null}
        {d.fulfilment === "town" ? (
          <>
            <div>
              <label htmlFor={`${uid}-c`} className="block text-[.8125rem] font-semibold text-baobab">County</label>
              <select id={`${uid}-c`} value={d.county} onChange={(e) => set({ county: e.target.value })} className={sel} autoComplete="off">
                <option value="">Choose the county</option>
                {counties.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`${uid}-t`} className="block text-[.8125rem] font-semibold text-baobab">Town</label>
              <input id={`${uid}-t`} value={d.town} onChange={(e) => set({ town: e.target.value.slice(0, 80) })} className={sel} enterKeyHint="done" autoComplete="off" />
            </div>
            <p className="text-[.8125rem]">We confirm how it travels, the cost and the time on WhatsApp.</p>
          </>
        ) : null}
        {d.fulfilment === "pickup" ? <p className="text-[.8125rem]">{pickupText()}</p> : null}
        {d.fulfilment ? <p className="text-[.8125rem] text-stone">{leadTimeText()}</p> : null}
      </div>
    </details>
  );
}
