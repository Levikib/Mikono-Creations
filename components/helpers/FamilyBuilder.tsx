"use client";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "@/components/Img";
import Link from "next/link";
import { buttonClass } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { attribution } from "@/lib/track";
import { env } from "@/lib/env";
import { useCart, useHydrated } from "@/lib/cart";
import { showToast } from "@/lib/toast";
import { copyText, generateRef, sourceFromAttribution } from "@/lib/whatsapp";
import { FAMILY_MAX_LINES, PRICE_NOTE } from "@/data/helpers";
import { addAnimal, duplicateLine, skuFor, decodeHash, encodeHash, summaryText, totalAnimals, updateLine } from "@/lib/helpers/family";
import { buildShareMessage, familyMsgLines, planFamilySend } from "@/lib/helpers/message";
import { readPersisted, writePersisted } from "@/lib/helpers/store";
import { trackHelper, trackWhatsApp } from "@/lib/helpers/track";
import type { FamilyLine, HelperAnimal } from "@/lib/helpers/types";
import { AnimalPicker } from "./AnimalPicker";
import { FamilyPreview, FamilyTray } from "./FamilyTray";
import "./helpers.css";

const HASH_EVENT = "mkh:hash";
const subscribeHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  window.addEventListener(HASH_EVENT, cb);
  return () => { window.removeEventListener("hashchange", cb); window.removeEventListener(HASH_EVENT, cb); };
};
const isString = (x: unknown): x is string => typeof x === "string";

const kicker = (n: number) => (n === 0 ? "Start with a favourite" : n <= 2 ? "A good start" : n <= 5 ? "A growing family" : "A full herd");

export function FamilyBuilder({ animals }: { animals: HelperAnimal[] }) {
  // The URL hash is the single source of truth, so the address bar is always a share link.
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => "");
  const lines = useMemo(() => decodeHash(hash, animals), [hash, animals]);
  const hydrated = useHydrated();
  const cart = useCart();
  const [initialHash] = useState(() => (typeof window === "undefined" ? "" : window.location.hash));
  const [status, setStatus] = useState("");
  const [trayVisible, setTrayVisible] = useState(false);
  const trayRef = useRef<HTMLElement>(null);

  const setLines = (next: FamilyLine[]) => {
    const h = encodeHash(next);
    window.history.replaceState(null, "", h ? `#${h}` : `${window.location.pathname}${window.location.search}`);
    writePersisted("family", h || null);
    window.dispatchEvent(new Event(HASH_EVENT));
  };

  // Restore a family kept on this device when the page opens without a shared link.
  useEffect(() => {
    if (window.location.hash) return;
    const saved = readPersisted("family", isString);
    if (saved && decodeHash(`#${saved}`, animals).length) {
      window.history.replaceState(null, "", `#${saved}`);
      window.dispatchEvent(new Event(HASH_EVENT));
    }
  }, [animals]);

  // The mobile bar steps aside while the tray itself is on screen.
  useEffect(() => {
    const el = trayRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setTrayVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const l of lines) m[l.slug] = (m[l.slug] ?? 0) + l.qty;
    return m;
  }, [lines]);

  const summary = summaryText(lines);
  const total = totalAnimals(lines);

  const onAdd = (a: HelperAnimal) => {
    const r = addAnimal(lines, a);
    if (r.full) { setStatus(`Your family has ${FAMILY_MAX_LINES} lines. For a bigger set, send a wholesale request or tell us on WhatsApp.`); return; }
    setLines(r.lines);
    const nextTotal = totalAnimals(r.lines);
    setStatus(`Added ${a.name}. ${summaryText(r.lines)}.`);
    if (lines.length === 0) trackHelper("helper_start", "family_builder");
    trackHelper("helper_family_change", "family_builder", { action: "add", animals: nextTotal });
  };
  const onPatch = (i: number, patch: Partial<FamilyLine>) => {
    const next = updateLine(lines, i, patch);
    setLines(next);
    setStatus(summaryText(next));
  };
  const onDuplicate = (i: number) => {
    const r = duplicateLine(lines, i, animals);
    if (!r.ok) { setStatus("That animal is already in every size and colour we show here."); return; }
    setLines(r.lines);
    setStatus(`Added another ${animals.find((a) => a.slug === lines[i].slug)?.name ?? "animal"} line. ${summaryText(r.lines)}.`);
    trackHelper("helper_family_change", "family_builder", { action: "duplicate", animals: totalAnimals(r.lines) });
  };
  const onRemove = (i: number) => {
    const gone = animals.find((a) => a.slug === lines[i]?.slug)?.name ?? "Animal";
    const next = lines.filter((_, k) => k !== i);
    setLines(next);
    setStatus(`Removed ${gone}. ${summaryText(next)}.`);
  };
  const clear = () => { setLines([]); setStatus("Your family is empty."); };

  const guard = () => {
    if (lines.length) return false;
    setStatus("Add an animal to your family first.");
    return true;
  };

  const addAll = () => {
    if (guard()) return;
    for (const l of lines) {
      const a = animals.find((x) => x.slug === l.slug);
      const c = a?.colours.find((x) => x.key === l.colourKey);
      if (!a || !c) continue;
      cart.addLine({ sku: skuFor(l), slug: a.slug, name: a.name, colourKey: c.key, colourLabel: c.label, size: l.size, image: c.image.src, qty: l.qty, category: a.categoryLabel });
    }
    showToast(`Added ${lines.length} ${lines.length === 1 ? "line" : "lines"} (${total} animals) to your order list.`, "success");
    setStatus(`Added your family to the order list: ${summary}.`);
    trackHelper("helper_cta", "family_builder", { action: "add_all", animals: total });
  };

  const origin = () => `${window.location.origin}${window.location.pathname}`;
  const shareUrl = () => `${origin()}#${encodeHash(lines)}`;

  // The ref and the link are made at click time, so render stays pure and every send gets a new reference.
  const onSend = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (guard()) { e.preventDefault(); return; }
    const ref = generateRef();
    const plan = planFamilySend(env.whatsappNumber, {
      ref, lines: familyMsgLines(lines, animals), summary, shareUrl: shareUrl(),
      source: sourceFromAttribution(attribution()), siteUrl: window.location.origin,
    });
    if (plan.url) e.currentTarget.href = plan.url;
    if (plan.pasteRest) void copyText(plan.fullText);
    setStatus(plan.pasteRest
      ? `WhatsApp is opening with order reference ${ref}. Your whole list is copied. Paste it into the chat, then press send. Nothing is sent until you do.`
      : `WhatsApp is opening with order reference ${ref}. Nothing is sent until you press send there.`);
    trackWhatsApp("family_builder", "order", { animals: total });
  };

  const onCopy = async () => {
    if (guard()) return;
    const ok = await copyText(shareUrl());
    setStatus(ok ? "Link copied. Paste it in a chat to share your family." : "Could not copy. Select the address bar link instead.");
    if (ok) showToast("Family link copied.", "success");
    trackHelper("helper_share", "family_builder", { via: "copy" });
  };
  const onShareWa = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (guard()) { e.preventDefault(); return; }
    e.currentTarget.href = `https://wa.me/?text=${encodeURIComponent(buildShareMessage(shareUrl(), summary))}`;
    trackHelper("helper_share", "family_builder", { via: "whatsapp" });
  };

  const sharedBanner = hydrated && initialHash.startsWith("#family=") && lines.length > 0;
  const hasLines = lines.length > 0;
  const full = lines.length >= FAMILY_MAX_LINES;

  return (
    <div className="mkh pb-24 lg:pb-4">
      <p role="status" aria-live="polite" className="sr-only">{status}</p>
      {sharedBanner ? (
        <p className="mkh-card mb-3 flex items-start gap-2 p-3 text-[.9375rem] leading-snug"><Icon name="info" size={18} className="mt-0.5 shrink-0" />
          <span>This family was shared with you. Change anything you like, then send it on WhatsApp.</span></p>
      ) : null}
      <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start lg:gap-7">
        <AnimalPicker animals={animals} counts={counts} onAdd={onAdd} />

        <section id="family-tray" ref={trayRef} aria-labelledby="mkh-family-title" className="mkh-card min-w-0 scroll-mt-20 p-3 md:p-4 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="mkh-eyebrow">{kicker(total)}</p>
              <h2 id="mkh-family-title" className="mt-0.5 text-display-md">Your family</h2>
            </div>
            {hasLines ? <button type="button" onClick={clear} className="mkh-btn-text">Clear</button> : null}
          </div>
          <p className="mt-1 font-display text-[.9375rem] font-bold" aria-hidden="true">{summary}</p>
          <div className="mt-2.5"><FamilyPreview lines={lines} animals={animals} /></div>
          <div className="mt-3"><FamilyTray lines={lines} animals={animals} onPatch={onPatch} onRemove={onRemove} onDuplicate={onDuplicate} full={full} /></div>
          {full ? <p className="mkh-muted mt-2 text-[.9375rem]">This list is full. For a bigger set, <Link href="/wholesale" className="underline">send a wholesale request</Link> or tell us on WhatsApp.</p> : null}

          <div className="mt-4 grid gap-2">
            <p className="mkh-muted text-[.9375rem] leading-snug">{PRICE_NOTE}</p>
            <a href={`https://wa.me/${env.whatsappNumber}`} target="_blank" rel="noopener noreferrer" onClick={onSend} aria-disabled={!hasLines}
              className={buttonClass("whatsapp", "large", "w-full aria-disabled:pointer-events-none")}><Icon name="whatsapp" size={22} />Send my family on WhatsApp</a>
            <button type="button" onClick={addAll} aria-disabled={!hasLines} className={buttonClass("secondary", "compact", "w-full aria-disabled:pointer-events-none")}>
              <Icon name="cart" size={20} />Add all to order list
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={onCopy} aria-disabled={!hasLines} className="mkh-btn-text aria-disabled:pointer-events-none aria-disabled:opacity-55">Copy share link</button>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" onClick={onShareWa} aria-disabled={!hasLines} className="mkh-btn-text aria-disabled:pointer-events-none aria-disabled:opacity-55">Share on WhatsApp</a>
            </div>
            {cart.count > 0 ? <Link href="/cart" className="mkh-muted text-center text-[.9375rem] underline">View your order list ({cart.count})</Link> : null}
          </div>
        </section>
      </div>

      {hasLines && !trayVisible ? (
        <div className="mkh-bar lg:hidden" role="region" aria-label="Your family so far">
          <ul aria-hidden="true" className="flex -space-x-2 pl-1">
            {lines.slice(0, 4).map((l, i) => {
              const c = animals.find((a) => a.slug === l.slug)?.colours.find((x) => x.key === l.colourKey);
              return c ? <li key={i} className="size-9 overflow-hidden rounded-full bg-[var(--h-sand)] ring-2 ring-[var(--h-paper)]"><Image src={c.image.src} alt="" width={36} height={36} sizes="36px" className="size-full object-cover" style={{ objectPosition: `${c.image.focal[0] * 100}% ${c.image.focal[1] * 100}%` }} /></li> : null;
            })}
          </ul>
          <p className="min-w-0 flex-1 truncate text-[.9375rem] font-semibold">{summary}</p>
          <a href="#family-tray" className={buttonClass("primary", "compact", "!min-h-11")}>Review</a>
        </div>
      ) : null}
    </div>
  );
}
