"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/track";
import { env } from "@/lib/env";
import { FxLoader } from "./fx/FxLoader";

// Analytics only ships when at least one tag id is configured.
const HAS_TAGS = Boolean(env.gtmId || env.ga4Id || env.metaPixelId || env.tiktokPixelId);

// Code the first view never needs. The cart drawer loads when it is first opened (or when the browser is idle),
// the analytics loader loads when idle, and the Save-Data helper loads straight after hydration.
const CartDrawer = dynamic(() => import("./CartDrawer").then((m) => m.CartDrawer), { ssr: false });
const Analytics = dynamic(() => import("./Analytics").then((m) => m.Analytics), { ssr: false });
// The animal engine loads from FxLoader, which waits for idle and for a page that has animals.
const DataSaver = dynamic(() => import("./DataSaver").then((m) => m.DataSaver), { ssr: false });

export function Deferred() {
  const { drawerOpen } = useCart();
  const [idle, setIdle] = useState(false);
  const [seen, setSeen] = useState(false);
  if (drawerOpen && !seen) setSeen(true);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 4000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setIdle(true), 2500);
    return () => window.clearTimeout(t);
  }, []);
  // Offline fallback and static asset cache (public/sw.js). Production only, and only once the page is idle.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    // Well after load, so it never competes with the first view (the worker only starts caching on the next visit).
    const t = window.setTimeout(() => { navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {}); }, 12000);
    return () => window.clearTimeout(t);
  }, []);
  // One delegated listener for the "Ask on WhatsApp" chips on product cards (server rendered, so they carry no handlers of their own).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      const cta = t?.closest?.("a[data-track]");
      if (cta instanceof HTMLElement) {
        // Links into the tools and the Studio. The label is a fixed id such as "home_closing", never user text.
        track("cta_click", { cta: cta.dataset.track, destination: (cta.getAttribute("href") ?? "").split(/[?#]/)[0] });
        return;
      }
      const a = t?.closest?.("a[data-wa-track]");
      if (!(a instanceof HTMLElement)) return;
      track("whatsapp_click", { location: `${a.dataset.waTrack}_ask_price`, item_id: a.dataset.item });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return (
    <>
      <DataSaver />
      <FxLoader />
      {seen ? <CartDrawer /> : null}
      {idle && HAS_TAGS ? <Analytics /> : null}
    </>
  );
}
