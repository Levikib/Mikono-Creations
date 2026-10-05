"use client";
import { useEffect, useState } from "react";

/**
 * True while a text field has focus on a touch screen, i.e. the on-screen keyboard is likely open.
 * A sticky bar uses it to sit in the page flow so the keyboard never hides the field beside it.
 */
export function useKeyboardOpen(): boolean {
  const [kb, setKb] = useState(false);
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const isField = (el: EventTarget | null) => el instanceof HTMLElement && el.matches("input:not([type=checkbox]):not([type=radio]),textarea,select");
    const onIn = (e: FocusEvent) => { if (coarse.matches && isField(e.target)) setKb(true); };
    const onOut = () => { setTimeout(() => { if (!isField(document.activeElement)) setKb(false); }, 120); };
    const vv = window.visualViewport;
    const onVv = () => { if (vv && isField(document.activeElement)) setKb(window.innerHeight - vv.height > 120 || coarse.matches); };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    vv?.addEventListener("resize", onVv);
    return () => { document.removeEventListener("focusin", onIn); document.removeEventListener("focusout", onOut); vv?.removeEventListener("resize", onVv); };
  }, []);
  return kb;
}
