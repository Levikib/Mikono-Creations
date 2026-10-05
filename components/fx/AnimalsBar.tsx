"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import "./footer-fx.css";
import { applyTier, setChoice, FX_EVENT } from "./engine/tier";

/**
 * Footer control: the Animals on/off switch (every page) and the find-the-herd counter (pages that have animals).
 * Server markup is a complete, still version; the switch state is read from html[data-animals], which public/splash-gate.js sets before first paint.
 * Storage keys: mk-animals (the switch) and mk-found (the game). Both are listed in /privacy and /cookies and removed by Clear my saved details.
 */
const FOUND_KEY = "mk-found";
const FOUND_EVENTS = ["mk:found", "mk:found-reset", "storage"];

const subOn = (cb: () => void) => {
  window.addEventListener(FX_EVENT, cb);
  return () => window.removeEventListener(FX_EVENT, cb);
};
const subFound = (cb: () => void) => {
  for (const e of FOUND_EVENTS) window.addEventListener(e, cb);
  return () => { for (const e of FOUND_EVENTS) window.removeEventListener(e, cb); };
};
const foundSnap = () => { try { return localStorage.getItem(FOUND_KEY) ?? ""; } catch { return ""; } };
const countOf = (raw: string) => {
  try { const v = JSON.parse(raw || "null"); return v && Array.isArray(v.found) ? v.found.length : 0; } catch { return 0; }
};

export function AnimalsBar({ total }: { total: number }) {
  const on = useSyncExternalStore(subOn, () => document.documentElement.getAttribute("data-animals") !== "off", () => true);
  const raw = useSyncExternalStore(subFound, foundSnap, () => "");
  const n = countOf(raw);
  const [msg, setMsg] = useState("");
  // The game sends the sentence to show. It is shown, not announced: the counter below is the polite live region.
  useEffect(() => {
    const onFound = (e: Event) => setMsg(((e as CustomEvent<{ message?: string }>).detail?.message) ?? "");
    const onReset = () => setMsg("");
    window.addEventListener("mk:found", onFound);
    window.addEventListener("mk:found-reset", onReset);
    return () => { window.removeEventListener("mk:found", onFound); window.removeEventListener("mk:found-reset", onReset); };
  }, []);
  return (
    <div className="an-bar" data-fx-total={total}>
      <div className="an-row">
        <button type="button" role="switch" aria-checked={on} className="an-switch" onClick={() => { applyTier(); setChoice(!on); }}>
          <span>Animals: <span className="an-state-on">on</span><span className="an-state-off">off</span></span>
          <span className="an-track" aria-hidden="true" />
        </button>
        <span className="an-pages">
          <span className="an-count" aria-live="polite">
            Found {n} of {total}
            {n >= total ? <span className="sr-only">. You found the whole herd. Thank you for looking so closely.</span> : null}
            <span className="an-dots" aria-hidden="true">{Array.from({ length: total }, (_, i) => <i key={i} data-on={i < n ? "" : undefined} />)}</span>
          </span>
          {n > 0 ? (
            <button type="button" className="an-reset" onClick={() => {
              try { localStorage.removeItem(FOUND_KEY); } catch { /* storage blocked */ }
              window.dispatchEvent(new Event("mk:found-reset"));
            }}>Reset</button>
          ) : null}
        </span>
      </div>
      <p className="an-msg" aria-hidden="true">{msg}</p>
      <p className="an-note an-calm">Your device asks for less motion, so the animals stay still.</p>
    </div>
  );
}
