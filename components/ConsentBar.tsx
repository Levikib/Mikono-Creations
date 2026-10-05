"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { afterSplash } from "@/lib/splash";
import {
  CONSENT_OPEN_EVENT, captureUtm, pushConsentDefaults, pushConsentUpdate, readConsent, track, writeConsent,
} from "@/lib/track";
import { Icon } from "./Icon";
import { Tick } from "./Tick";

/**
 * Consent Mode v2 control. Defaults are denied, no tag is loaded here, Accept and Reject carry equal weight.
 * Compact single row docked to the bottom inside the safe area: about 60px on a phone, a 44px strip in phone landscape.
 * "Choose" opens a small panel only when tapped. The bar publishes its height as --dock-h, so fixed elements
 * (the WhatsApp float, toasts) and the page padding sit above it. Styles live in globals.css (.ck).
 * The choice is stored in localStorage and broadcast as the mk:consent window event.
 */
export function ConsentBar() {
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const firstBox = useRef<HTMLInputElement>(null);

  useEffect(() => {
    pushConsentDefaults();
    const stored = readConsent();
    if (stored) pushConsentUpdate(stored);
    captureUtm();
    // The bar waits for the intro to leave, so it never competes with it for attention or focus.
    let t: ReturnType<typeof setTimeout> | undefined;
    const stop = afterSplash(() => { t = setTimeout(() => { if (!stored) setOpen(true); }, 400); });
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => { stop(); clearTimeout(t); window.removeEventListener(CONSENT_OPEN_EVENT, reopen); };
  }, []);

  useEffect(() => {
    if (open) document.documentElement.dataset.consentBar = "open";
    else delete document.documentElement.dataset.consentBar;
  }, [open]);

  // Publish the bar height so fixed elements and the page padding stack above it.
  useEffect(() => {
    const el = bar.current;
    const root = document.documentElement;
    if (!open || !el) { root.style.removeProperty("--dock-h"); return; }
    const set = () => root.style.setProperty("--dock-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => { ro.disconnect(); root.style.removeProperty("--dock-h"); };
  }, [open]);

  // Focus is never left under the bar. Chrome does not always honour scroll-padding for focus, so when focus lands
  // behind the fixed bar the page is scrolled by exactly the overlap (WCAG 2.4.11 Focus Not Obscured).
  useEffect(() => {
    if (!open) return;
    const clear = (t: HTMLElement) => {
      const b = bar.current;
      if (!b || !t.isConnected) return;
      const top = b.getBoundingClientRect().top;
      const r = t.getBoundingClientRect();
      if (r.bottom > top - 8 && r.top < window.innerHeight) {
        window.scrollBy({ top: r.bottom - top + 16, behavior: "instant" });
      }
    };
    const onFocus = (e: FocusEvent) => {
      const t = e.target;
      const b = bar.current;
      if (!(t instanceof HTMLElement) || !b || b.contains(t)) return;
      if (t.closest("dialog, [role='dialog']")) return;
      for (let n: HTMLElement | null = t; n && n !== document.body; n = n.parentElement) {
        if (getComputedStyle(n).position === "fixed") return;
      }
      clear(t);
      requestAnimationFrame(() => requestAnimationFrame(() => clear(t)));
    };
    document.addEventListener("focusin", onFocus);
    return () => document.removeEventListener("focusin", onFocus);
  }, [open]);

  // A reopen from "Cookie settings" is a deliberate action, so focus moves to the bar. It is not modal and never traps focus.
  useEffect(() => {
    const focusBar = () => requestAnimationFrame(() => bar.current?.focus());
    window.addEventListener(CONSENT_OPEN_EVENT, focusBar);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, focusBar);
  }, []);

  useEffect(() => { if (more) firstBox.current?.focus(); }, [more]);

  if (!open) return null;

  const save = (a: boolean, m: boolean) => {
    const c = { analytics: a, marketing: m };
    writeConsent(c);
    pushConsentUpdate(c);
    captureUtm();
    track("consent_update", c);
    setOpen(false);
    setMore(false);
  };
  const toggleMore = () => setMore((v) => !v);

  return (
    <section ref={bar} id="cookie-choices" tabIndex={-1} aria-label="Cookie choices" className="ck"
      onKeyDown={(e) => { if (e.key === "Escape" && more) { e.stopPropagation(); setMore(false); } }}>
      {more ? (
        <div id="cookie-more" className="ck-more">
          <div className="ck-more-in">
            <p className="ck-more-title">Choose what we may use</p>
            <label className="ck-opt">
              <Tick type="checkbox" id="ck-analytics" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} inputRef={firstBox} />
              <span><b>Measure visits</b><span>Counts which pages are opened, so we can improve the site.</span></span>
            </label>
            <label className="ck-opt">
              <Tick type="checkbox" id="ck-marketing" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
              <span><b>Measure ads</b><span>Tells us which of our ads brought a visit.</span></span>
            </label>
            <div className="ck-more-foot">
              <button type="button" className="ck-btn ck-btn-main" onClick={() => save(analytics, marketing)}>Save my choices</button>
              <span className="ck-links"><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookies</Link></span>
            </div>
          </div>
        </div>
      ) : null}
      <div className="ck-row">
        {/* The buttons come first in the DOM so a keyboard user reaches Accept in three Tab presses from page load.
            CSS order keeps the sentence first on screen. */}
        <div className="ck-btns">
          <button type="button" className="ck-btn ck-btn-main" aria-describedby="cookie-text" onClick={() => save(true, true)}>
            <Icon name="check" size={18} className="ck-ic" />Accept
          </button>
          <button type="button" className="ck-btn" aria-describedby="cookie-text" onClick={() => save(false, false)}>
            <svg className="ck-ic" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>Reject<span className="sr-only"> optional cookies</span>
          </button>
        </div>
        <p id="cookie-text" className="ck-text">
          <span className="ck-short">We use cookies.</span>
          <span className="ck-long">We use cookies to measure visits and ads.</span>{" "}
          <a href="#cookie-more" role="button" aria-expanded={more} aria-controls="cookie-more" aria-label="Choose cookie settings" className="ck-choose"
            onClick={(e) => { e.preventDefault(); toggleMore(); }}
            onKeyDown={(e) => { if (e.key === " ") { e.preventDefault(); toggleMore(); } }}>Choose</a>
        </p>
      </div>
    </section>
  );
}

/** First tab stop while the bar is open: jumps to the cookie choices, so keyboard users never tab through the whole page to reach them. */
export function ConsentSkipLink() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setOpen(el.dataset.consentBar === "open");
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["data-consent-bar"] });
    return () => mo.disconnect();
  }, []);
  if (!open) return null;
  return (
    <a href="#cookie-choices" onClick={(e) => { e.preventDefault(); document.querySelector<HTMLElement>("#cookie-choices button")?.focus(); }}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-baobab focus:px-5 focus:py-3 focus:text-bone">
      Skip to cookie choices
    </a>
  );
}
