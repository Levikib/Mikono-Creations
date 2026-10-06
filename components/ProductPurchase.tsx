"use client";
import Image from "@/components/Img";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AddToOrder } from "./AddToOrder";
import { buttonClass } from "./Button";
import { Icon } from "./Icon";
import { QuantityStepper } from "./QuantityStepper";
import { sizeWord, WALL_SIZE_NOTE } from "@/lib/sizes";
import { formatKes } from "@/lib/pricing";
import { whatsappUrl } from "@/lib/env";
import { ASK_COLOUR_KEY, ASK_COLOUR_LABEL, MAX_QTY_PER_LINE } from "@/lib/site";
import { track } from "@/lib/track";
import { cx } from "@/lib/cx";


export type GalleryItem = {
  src: string; alt: string; width: number; height: number; focal: [number, number];
  /** White background cutouts blend into the sand frame (D30). */
  multiply: boolean;
  /** Short side under 400 px: shown at its own size on the sand frame, never scaled up. */
  lowRes: boolean;
  /** "group": the photo shows this animal with others, and the caption says so. */
  kind: "colourway" | "range" | "group";
};
export type PurchaseColour = { key: string; label: string; title: string; thumb: GalleryItem | null };
export type PurchaseProps = {
  slug: string;
  name: string;
  colours: PurchaseColour[];
  /** Photos per colourway key. */
  galleries: Record<string, GalleryItem[]>;
  /** The colourway the page opens on. */
  openOn: string;
  sizes: readonly string[];
  /** Retail price in KES for each size, or null when the piece has no price (shows the price label instead). */
  sizePrices?: Record<string, number> | null;
  /** Shown only when there is no price per size. */
  priceLabel?: string;
  availability: string;
  /** Only group photos exist: no colour selector, colour is confirmed on WhatsApp. */
  colourAsk?: boolean;
  /** Category label for analytics. */
  category?: string;
  /** URL of the animal sprite that hops into the basket on Add (chosen on the server by species and category). */
  hopSprite?: string;
  /** What the product is, for the help text ("animal", "doll", "bag", "wall head"). */
  noun?: string;
  /** Plain text for the lead sentence of the WhatsApp message. */
  skuFor: Record<string, string>;
  /** Links shown under the gallery on wide screens, and after the buy box on narrow ones. */
  below?: ReactNode;
};


export function ProductPurchase(p: PurchaseProps) {
  const uid = useId();
  const single = p.colours.length === 1;
  const [shownKey, setShownKey] = useState(p.openOn);
  const [chosenKey, setChosenKey] = useState<string | null>(single ? p.colours[0].key : null);
  // Wall art has one size, so it opens already chosen.
  const oneSize = p.sizes.length === 1;
  const [size, setSize] = useState<string | null>(oneSize ? p.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [photo, setPhoto] = useState(0);
  const [nudge, setNudge] = useState(false);
  const colourRef = useRef<HTMLFieldSetElement>(null);
  const sizeRef = useRef<HTMLFieldSetElement>(null);

  useEffect(() => { track("view_item", { item_id: p.slug }); }, [p.slug]);

  const shown = p.colours.find((c) => c.key === shownKey) ?? p.colours[0];
  const ask = Boolean(p.colourAsk);
  const noun = p.noun ?? "animal";
  const chosen = ask ? { key: ASK_COLOUR_KEY, label: ASK_COLOUR_LABEL, title: p.name } : (p.colours.find((c) => c.key === chosenKey) ?? null);
  const items = p.galleries[shown.key] ?? [];
  const current = items[Math.min(photo, items.length - 1)];
  // The frame follows the lead photo's shape (kept between 4:5 and 5:4) so no mat shows beside it. It stays fixed while photos change.
  const lead = items[0];
  const frameRatio = lead ? Math.min(1.25, Math.max(0.8, lead.width / lead.height)) : 0.8;
  const unitKes = size && p.sizePrices ? p.sizePrices[size] ?? null : null;
  const fromKes = p.sizePrices ? Math.min(...Object.values(p.sizePrices)) : null;
  const sku = chosen && size ? p.skuFor[`${chosen.key}|${size}`] ?? null : null;

  const missing = ask ? (size ? null : "size") : !chosen ? (size ? "colour" : "colour and size") : !size ? "size" : null;
  const helpId = `${uid}-help`;
  const help = missing ? `Choose a ${missing} to add this ${noun} to your order list.` : "";

  const pickColour = (key: string) => {
    setChosenKey(key); setShownKey(key); setPhoto(0); setNudge(false);
    track("select_variant", { item_id: p.slug, item_variant: key });
  };
  const pickSize = (s: string) => { setSize(s); setNudge(false); track("select_variant", { item_id: p.slug, item_variant: s }); };

  const waText = ask
    ? `Hello Mikono Creations, which colours of the ${p.name} are available${size ? ` in ${sizeWord(size)}` : ""}?`
    : `Hello Mikono Creations, I would like to ask about the ${(chosen ?? shown).title}${size ? `, ${sizeWord(size)}` : ""}.`;
  const wa = whatsappUrl(waText) ?? "/contact";
  const waExternal = wa.startsWith("http");

  const go = (d: number) => setPhoto((i) => (i + d + items.length) % items.length);

  return (
    <>
    <div className="grid grid-cols-[132px_minmax(0,1fr)] gap-x-3 gap-y-2 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:gap-x-5 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_440px] xl:gap-x-6">
      {/* Gallery: a 132px photo beside the title on phones; the main photo fills its column from 768 px, thumbnails in a row below it. */}
      <div className="contents md:col-start-1 md:row-span-3 md:row-start-1 md:block md:min-w-0">
        <div className="contents md:mx-auto md:block md:w-full md:max-w-[640px] lg:mx-0">
          <figure data-gallery-main className="col-start-1 row-start-1 m-0">
            <div style={{ aspectRatio: frameRatio }} className="relative w-full overflow-hidden rounded-[var(--radius-card)] bg-sand shadow-clay-sm max-md:!aspect-square">
              {current ? (
                current.lowRes ? (
                  <Image
                    key={current.src} src={current.src} alt={current.alt} width={current.width} height={current.height}
                    preload fetchPriority="high" sizes={`${current.width}px`}
                    className="absolute inset-0 m-auto block object-contain"
                    style={{ width: current.width, height: current.height, maxWidth: "100%", maxHeight: "100%" }}
                  />
                ) : (
                  <Image
                    key={current.src} src={current.src} alt={current.alt} fill
                    preload fetchPriority="high" sizes="(min-width:1280px) 640px, (min-width:1024px) 55vw, (min-width:768px) 420px, 132px"
                    className={cx("object-cover", current.multiply && "mix-blend-multiply")}
                    style={{ objectPosition: `${current.focal[0] * 100}% ${current.focal[1] * 100}%` }}
                  />
                )
              ) : null}
              {items.length > 1 ? (
                <>
                  <button type="button" aria-label="Previous photo" onClick={() => go(-1)}
                    className="absolute left-1.5 top-1/2 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full bg-bone/90 text-baobab shadow-clay-sm md:inline-flex">
                    <Icon name="chevron" size={18} className="rotate-90" />
                  </button>
                  <button type="button" aria-label="Next photo" onClick={() => go(1)}
                    className="absolute right-1.5 top-1/2 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full bg-bone/90 text-baobab shadow-clay-sm md:inline-flex">
                    <Icon name="chevron" size={18} className="-rotate-90" />
                  </button>
                </>
              ) : null}
            </div>
            <figcaption className="mt-1 hidden min-h-[1.45em] text-[.8125rem] text-stone md:block">
              {current?.kind === "range" ? "From our range, shown with other animals." : current?.kind === "group" ? `${shown.title}, shown with other colours.` : `${shown.title}`}
              {items.length > 1 ? <span className="sr-only">{`. Photo ${Math.min(photo, items.length - 1) + 1} of ${items.length}`}</span> : null}
            </figcaption>
          </figure>
          {items.length > 1 ? (
            <ul aria-label="Photos" className="scroller col-span-2 row-start-2 -mx-3 flex gap-2 overflow-x-auto px-3 pb-1 pt-1 md:mx-0 md:mt-2 md:px-1">
              {items.map((it, i) => (
                <li key={it.src} className="shrink-0">
                  <button type="button" onClick={() => setPhoto(i)} aria-label={`Show photo ${i + 1}`} aria-pressed={i === photo}
                    className={cx("hit-area relative block size-[52px] overflow-hidden rounded-[10px] bg-sand ring-offset-1 ring-offset-bone", i === photo ? "ring-2 ring-baobab" : "ring-1 ring-sand-deep")}>
                    <Image src={it.src} alt="" fill sizes="52px" loading={i < 5 ? "eager" : "lazy"} className={cx("object-cover", it.multiply && "mix-blend-multiply")}
                      style={{ objectPosition: `${it.focal[0] * 100}% ${it.focal[1] * 100}%` }} />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {/* Title block: beside the photo on phones. */}
      <div className="col-start-2 row-start-1 min-w-0">
        <h1 className="text-display-lg">{p.name}</h1>
        <p className="mt-0.5 text-[.8125rem] text-stone">{ask ? "Colours vary" : (chosen ?? shown).title}</p>
        {current?.kind === "group" ? <p className="mt-0.5 text-[.75rem] text-stone md:hidden">Photo shown with other colours.</p> : null}
        <p data-testid="product-price" data-size={size ?? ""} data-price={unitKes ?? ""} aria-live="polite" className="price mt-1.5 text-lg text-terracotta-deep">
          {unitKes !== null ? formatKes(unitKes) : fromKes !== null ? `From ${formatKes(fromKes)}` : p.priceLabel ?? "Ask on WhatsApp"}
        </p>
        {unitKes !== null || fromKes !== null ? (
          <p data-testid="product-price-note" className="text-[.75rem] leading-snug text-stone">
            {unitKes !== null ? (qty > 1 ? `${qty} x ${formatKes(unitKes)} = ${formatKes(unitKes * qty)}. ` : "") : "The price depends on the size. "}Delivery is not included.
          </p>
        ) : null}
        <p className="mt-0.5 flex items-center gap-1.5 text-[.8125rem] text-charcoal"><Icon name="info" size={16} className="text-baobab" />{p.availability}</p>
      </div>

      {/* Buy box */}
      <div className="col-span-2 row-start-3 min-w-0 md:col-span-1 md:col-start-2 md:row-start-2">

        {ask ? (
          <div className="mt-2 rounded-[var(--radius-card)] bg-oat p-3 shadow-clay-sm">
            <p className="text-base font-semibold text-baobab">Colours vary</p>
            <p className="mt-1 text-base text-charcoal">Ask us which are available. The photos show the colours we have made.</p>
            <a href={wa} onClick={() => track("whatsapp_click", { location: "product_colours", item_id: p.slug })}
              className={buttonClass("ghost", "large", "mt-3 w-full")} {...(waExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <Icon name="whatsapp" size={18} />Ask on WhatsApp
            </a>
          </div>
        ) : (
        <fieldset ref={colourRef} className="mt-2 min-w-0 border-0 p-0">
          <legend className="mb-1 text-sm font-semibold text-baobab">
            Colour{chosen ? <span className="font-normal text-charcoal">{`: ${chosen.label}`}</span> : single ? null : <span className="font-normal text-stone">: choose one</span>}
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {p.colours.map((c) => (
              <label key={c.key} className="relative cursor-pointer">
                <input type="radio" name={`${uid}-colour`} value={c.key} checked={chosenKey === c.key}
                  onChange={() => pickColour(c.key)} className="peer sr-only" />
                <span className="flex min-h-11 max-w-full items-center gap-2 rounded-[14px] bg-oat py-1 pl-1 pr-3 text-[.8125rem] font-semibold text-charcoal shadow-clay-sm ring-2 ring-transparent transition-shadow peer-checked:bg-bone peer-checked:ring-baobab peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-3 peer-focus-visible:outline-focus">
                  <span className="relative block size-9 shrink-0 overflow-hidden rounded-[10px] bg-sand">
                    {c.thumb ? (
                      <Image src={c.thumb.src} alt="" fill sizes="36px" className={cx("object-cover", c.thumb.multiply && "mix-blend-multiply")}
                        style={{ objectPosition: `${c.thumb.focal[0] * 100}% ${c.thumb.focal[1] * 100}%` }} />
                    ) : null}
                  </span>
                  <span className="min-w-0 leading-tight">{c.label}</span>
                  {chosenKey === c.key ? <Icon name="check" size={18} className="shrink-0 text-baobab" /> : null}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        )}

        <fieldset ref={sizeRef} className="mt-2 min-w-0 border-0 p-0">
          <legend className="mb-1 text-sm font-semibold text-baobab">
            Size{size ? <span className="font-normal text-charcoal">{`: ${sizeWord(size)}`}</span> : <span className="font-normal text-stone">: choose one</span>}
          </legend>
          <div className="flex flex-wrap gap-4">
            {p.sizes.map((s) => (
              <label key={s} className="relative cursor-pointer">
                <input type="radio" name={`${uid}-size`} value={s} checked={size === s} onChange={() => pickSize(s)} className="peer sr-only" />
                <span className="hit-area flex min-h-11 min-w-10 flex-col items-center justify-center rounded-[18px] bg-oat px-3 py-0.5 text-sm font-semibold leading-tight text-baobab shadow-clay-sm ring-2 ring-transparent peer-checked:bg-baobab peer-checked:text-bone peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-3 peer-focus-visible:outline-focus">
                  {sizeWord(s)}
                  {p.sizePrices?.[s] ? <span className="price text-[.6875rem] font-medium opacity-90">{formatKes(p.sizePrices[s])}</span> : null}
                </span>
                {size === s ? <Icon name="check" size={16} className="pointer-events-none absolute -right-1 -top-1 rounded-full bg-terracotta-deep p-0.5 text-bone" /> : null}
              </label>
            ))}
          </div>
          {oneSize ? (
            <p className="mt-2 text-[.8125rem] text-stone">
              {WALL_SIZE_NOTE} We do not list centimetres.{" "}
              <Link href="/size-guide" className="hit font-semibold text-terracotta-deep underline underline-offset-4">Size guide</Link>
            </p>
          ) : (
            <>
              <p className="mt-2 text-[.8125rem] text-stone">
                Sizes are relative: Small is the smallest of this {noun} and Extra large the largest. We do not list centimetres.{" "}
                <Link href="/size-guide" className="hit font-semibold text-terracotta-deep underline underline-offset-4">Size guide</Link>
              </p>
              <p className="mt-1">
                <Link prefetch={false} href="/size-finder?src=product" data-track="product_size_finder" className="inline-flex min-h-11 items-center gap-1 font-semibold text-terracotta-deep underline underline-offset-4">Find the right size<Icon name="arrow" size={16} /></Link>
              </p>
            </>
          )}
        </fieldset>

        <div className="mt-2">
          <QuantityStepper value={qty} onChange={setQty} max={MAX_QTY_PER_LINE} />
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <p id={helpId} role="status" aria-live="polite" className={cx("min-h-[1.45em] text-[.8125rem]", nudge ? "font-semibold text-brick" : "text-stone")}>{help}</p>
          <AddToOrder
            slug={p.slug} name={p.name} colour={chosen} size={size} qty={qty} sku={sku} category={p.category} hopSprite={p.hopSprite}
            image={(chosen ? p.galleries[chosen.key]?.[0] : items[0])?.src ?? ""}
            describedBy={missing ? helpId : undefined}
            onIncomplete={() => {
              setNudge(true);
              (!chosen ? colourRef : sizeRef).current?.querySelector<HTMLInputElement>("input")?.focus();
            }}
          />
          {ask ? null : (
            <a href={wa} onClick={() => track("whatsapp_click", { location: "product", item_id: p.slug })}
              className={buttonClass("ghost", "large", "w-full")} {...(waExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <Icon name="whatsapp" size={18} />Ask on WhatsApp{noun === "animal" ? " about this animal" : ""}
            </a>
          )}
          {noun === "animal" ? (
            <Link prefetch={false} href={`/custom/studio?base=${p.slug}&src=product`} data-track="product_customise" className="inline-flex min-h-11 items-center justify-center gap-1 font-semibold text-terracotta-deep underline underline-offset-4">
              <Icon name="hook" size={16} />Customise this animal
            </Link>
          ) : null}
        </div>
      </div>
    </div>
    {p.below ? <div className="mt-3 md:mt-4">{p.below}</div> : null}
    </>
  );
}
