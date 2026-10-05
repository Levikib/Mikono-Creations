"use client";

import { useEffect } from "react";

type Conn = { saveData?: boolean; effectiveType?: string; addEventListener?: (t: string, f: () => void) => void; removeEventListener?: (t: string, f: () => void) => void };
const LITE_MAX = 640;

/**
 * Lite mode for Save-Data and 2g/3g phones. After hydration it (1) tells the image loader to cap new images at 640 px and
 * (2) trims srcset candidates above 640 w on images that have not started loading yet, and makes off-screen eager images lazy.
 * It renders nothing and never touches the server HTML, so hydration is unaffected.
 */
export function DataSaver() {
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: Conn }).connection;
    if (!conn) return;
    const isLite = () => conn.saveData === true || /^(slow-2g|2g|3g)$/.test(conn.effectiveType ?? "");
    const g = globalThis as { __mkLite?: boolean };

    const trim = () => {
      g.__mkLite = isLite();
      if (!g.__mkLite) return;
      for (const img of document.querySelectorAll<HTMLImageElement>("img[srcset]")) {
        const r = img.getBoundingClientRect();
        const inView = r.bottom > 0 && r.top < innerHeight * 1.2;
        if (img.loading === "eager" && !inView && !img.complete && img.fetchPriority !== "high") img.loading = "lazy";
        if (img.complete && img.currentSrc) continue; // already fetched, nothing to save
        const parts = (img.getAttribute("srcset") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
        const kept = parts.filter((p) => parseInt(p.split(/\s+/)[1] ?? "", 10) <= LITE_MAX);
        if (kept.length && kept.length < parts.length) img.setAttribute("srcset", kept.join(", "));
      }
    };
    trim();
    conn.addEventListener?.("change", trim);
    let queued = false;
    const mo = new MutationObserver(() => {
      if (!g.__mkLite || queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; trim(); });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { conn.removeEventListener?.("change", trim); mo.disconnect(); };
  }, []);
  return null;
}
