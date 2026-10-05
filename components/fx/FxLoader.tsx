"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { detectTier, FX_EVENT } from "./engine/tier";
import { ENGINE_URL } from "./engine.generated";

/**
 * The animal engine is one standalone script (components/fx/engine, bundled by scripts/build-engine.mjs). In production a tiny inline script,
 * rendered after the footer, adds it the moment the HTML is parsed, so it starts without waiting for React to hydrate. This component renders that
 * loader, and takes care of the cases it cannot: development (starts after hydration), a client side navigation to a page with animals, the Animals
 * switch turned on, and a cart add before the engine is there. It renders nothing visible.
 */
interface FxApi { start: () => void; rescan: () => void; stop: () => void }
const api = () => (window as Window & { __mkFx?: FxApi }).__mkFx;
const WANTS = "[data-fx-page], .fx-find";
const wants = () => Boolean(document.querySelector(WANTS)) && detectTier() !== "off";

/** Resolves with the engine once its script has run. Adds the script if the inline loader did not (development, or a page reached by client navigation). */
function engine(): Promise<FxApi> {
  return new Promise((resolve, reject) => {
    const have = api();
    if (have) return resolve(have);
    let s = document.getElementById("mk-fx-engine") as HTMLScriptElement | null;
    if (!s) {
      s = document.createElement("script");
      s.id = "mk-fx-engine";
      s.async = true;
      s.src = ENGINE_URL;
      document.head.appendChild(s);
    }
    s.addEventListener("load", () => { const a = api(); if (a) resolve(a); else reject(new Error("engine")); }, { once: true });
    s.addEventListener("error", () => reject(new Error("engine")), { once: true });
  });
}

const prod = process.env.NODE_ENV === "production";
// Same decision as detectTier(), made on the server markup's own flag so the page never ships the loader to a visitor with animals off.
const INLINE = `(function(){var d=document.documentElement,w=window;if(w.__mkFxL||d.getAttribute("data-fx")==="off"||!document.querySelector("${WANTS}"))return;w.__mkFxL=1;var s=document.createElement("script");s.id="mk-fx-engine";s.async=true;s.setAttribute("data-auto","1");s.src="${ENGINE_URL}";document.head.appendChild(s)})()`;

let mounted = false;
export function FxLoader() {
  const path = usePathname();
  useEffect(() => {
    let cancelled = false;
    const firstMount = !mounted;
    mounted = true;
    // In production the inline loader has usually started the engine already; the first mount then only needs to wait for it, not rescan.
    if (!wants()) return;
    engine().then((m) => { if (!cancelled && !(prod && firstMount && document.getElementById("mk-fx-engine")?.hasAttribute("data-auto"))) m.start(); }).catch(() => {});
    return () => { cancelled = true; };
  }, [path]);
  useEffect(() => {
    const again = () => { if (wants()) engine().then((m) => m.start()).catch(() => {}); };
    const onAdd = (e: Event) => {
      if (detectTier() === "off" || detectTier() === "still") return;
      engine().then((m) => { m.start(); window.setTimeout(() => window.dispatchEvent(new CustomEvent("mikono:cart-add", { detail: (e as CustomEvent).detail })), 0); }).catch(() => {});
    };
    window.addEventListener(FX_EVENT, again);
    // Only an add that arrives before the engine has started needs this; after that the engine listens itself.
    const first = (e: Event) => { if (!api()) onAdd(e); };
    window.addEventListener("mikono:cart-add", first);
    return () => { window.removeEventListener(FX_EVENT, again); window.removeEventListener("mikono:cart-add", first); };
  }, []);
  return prod ? <script dangerouslySetInnerHTML={{ __html: INLINE }} /> : null;
}
