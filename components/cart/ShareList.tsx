"use client";
import Image from "@/components/Img";
import { useEffect, useState } from "react";
import { useCart, lineSku, type AddInput, type CartLine } from "@/lib/cart";
import { shareUrl, shareWaUrl, decodeShare, SHARE_PARAM, type ShareLine } from "@/lib/shareList";
import { copyText } from "@/lib/whatsapp";
import { track } from "@/lib/track";
import { showToast } from "@/lib/toast";
import { countAnimals } from "@/lib/plural";
import type { CartProduct } from "@/lib/cartCatalogue";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { useCatalogue } from "../CatalogueContext";
import { sizeWord } from "@/lib/sizes";

const toShare = (lines: CartLine[]): ShareLine[] => lines.map((l) => ({ slug: l.slug, colourKey: l.colourKey, size: l.size, qty: l.qty }));

/** Share my list: a link that holds only animals, colours, sizes and quantities. */
export function ShareButtons({ lines, animals }: { lines: CartLine[]; animals: number }) {
  const [status, setStatus] = useState("");
  const link = () => shareUrl(window.location.origin, toShare(lines));
  return (
    <section aria-labelledby="share-h" className="grid gap-1.5">
      <h3 id="share-h" className="text-[.875rem]">Share my list</h3>
      <div className="grid grid-cols-2 gap-2">
        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" data-wa-track="share_list"
          onClick={(e) => { e.currentTarget.href = shareWaUrl(link(), animals); track("share_list", { method: "wa", item_count: animals }); }}
          className="btn-whatsapp hit-y relative col-span-2 inline-flex min-h-9 min-[480px]:col-span-1 items-center justify-center gap-1.5 rounded-full px-3 text-[.8125rem] font-semibold">
          <Icon name="whatsapp" size={18} />Share on WhatsApp
        </a>
        <Button variant="secondary" size="compact" className="col-span-2 min-[480px]:col-span-1" onClick={async () => {
          const ok = await copyText(link());
          setStatus(ok ? "Link copied. Paste it in a chat to share your list." : "Copying did not work here. Use Share on WhatsApp instead.");
          if (ok) showToast("List link copied.", "success");
          track("share_list", { method: "copy", item_count: animals });
        }}>Copy link</Button>
      </div>
      <p role="status" aria-live="polite" className="min-h-[1.2em] text-[.8125rem] text-olive-deep">{status}</p>
    </section>
  );
}

function parseShared(products: CartProduct[]): { lines: ShareLine[]; dropped: number; present: boolean } {
  const code = new URLSearchParams(window.location.search).get(SHARE_PARAM);
  if (code === null) return { lines: [], dropped: 0, present: false };
  return { ...decodeShare(code, products), present: true };
}

const stripParam = () => {
  const u = new URL(window.location.href);
  u.searchParams.delete(SHARE_PARAM);
  window.history.replaceState(null, "", `${u.pathname}${u.search}${u.hash}`);
};

/** Opening a shared link never touches the order list. The banner offers to add the animals, and the person decides. */
export function SharedListBanner() {
  const { products, resolve } = useCatalogue();
  const { addMany } = useCart();
  const [shared, setShared] = useState(() => parseShared(products));
  const opened = shared.present;
  const openedCount = shared.lines.length;
  useEffect(() => { if (opened) track("shared_list_open", { item_count: openedCount }); }, [opened, openedCount]);
  if (!shared.present) return null;

  const items: Array<AddInput & { qty: number }> = [];
  for (const l of shared.lines) {
    const found = resolve({ slug: l.slug, colourKey: l.colourKey, size: l.size });
    if (!found) continue;
    const c = l.colourKey === "ask" ? found.colour : found.product.colours.find((x) => x.key === l.colourKey) ?? found.colour;
    items.push({ sku: lineSku(l.slug, l.colourKey, l.size), slug: l.slug, name: found.product.name, colourKey: l.colourKey, colourLabel: c.label, size: l.size, image: c.src, qty: l.qty, category: found.product.category });
  }
  const total = items.reduce((n, i) => n + i.qty, 0);
  const dismiss = () => { stripParam(); setShared({ lines: [], dropped: 0, present: false }); };

  if (items.length === 0) {
    return (
      <section role="status" aria-label="Shared list" className="rounded-[var(--radius-card)] bg-oat p-3 shadow-clay-sm">
        <p className="text-[.875rem] font-semibold">This list link did not work.</p>
        <p className="text-[.8125rem] text-stone">You can still browse the animals and build your own list.</p>
        <div className="mt-2"><Button variant="secondary" size="compact" onClick={dismiss}>Close</Button></div>
      </section>
    );
  }
  return (
    <section aria-labelledby="shared-h" data-testid="shared-banner" className="rounded-[var(--radius-card)] bg-oat p-3 shadow-clay-sm">
      <h2 id="shared-h" className="text-[.9375rem]">Someone shared this list with you</h2>
      <p className="mt-0.5 text-[.8125rem] text-stone">{countAnimals(total)}. Your own order list is not changed unless you add these.</p>
      <ul className="mt-2 grid gap-1">
        {items.map((i) => (
          <li key={i.sku} className="flex items-center gap-2 text-[.8125rem]">
            <span className="ck-thumb size-8 !rounded-[9px]">{i.image ? <Image src={i.image} alt="" fill sizes="32px" className="object-cover" /> : null}</span>
            <span className="min-w-0 flex-1 truncate"><span className="font-semibold">{i.qty} x {i.name}</span>, {i.colourKey === "ask" ? "colour to confirm" : i.colourLabel}, {sizeWord(i.size)}</span>
          </li>
        ))}
      </ul>
      {shared.dropped > 0 ? <p className="mt-1 text-[.8125rem] text-stone">{shared.dropped} {shared.dropped === 1 ? "item" : "items"} in the link could not be matched and {shared.dropped === 1 ? "was" : "were"} left out.</p> : null}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Button size="compact" onClick={() => {
          const r = addMany(items);
          showToast(r.added + r.merged ? `Added ${countAnimals(total)} to your order list.` : "Your order list is full, so nothing was added.", r.added + r.merged ? "success" : "info");
          dismiss();
        }}>Add all to my list</Button>
        <Button variant="ghost" size="compact" onClick={dismiss}>No thanks</Button>
      </div>
    </section>
  );
}
