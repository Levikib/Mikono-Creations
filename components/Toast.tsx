"use client";
import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "./Icon";

export type ToastVariant = "info" | "success" | "error";
export const TOAST_EVENT = "mk:toast";
const bar = { info: "border-ochre", success: "border-olive", error: "border-brick" } as const;

/** Presentational toast. Also used directly in the style guide. */
export function Toast({ message, variant = "info", onDismiss }: { message: string; variant?: ToastVariant; onDismiss?: () => void }) {
  return (
    <div role="status" className={cx("flex min-h-11 items-center gap-3 rounded-[20px] border-l-8 bg-baobab-deep px-4 py-3 text-base text-bone shadow-clay-dark", bar[variant])}>
      <Icon name={variant === "success" ? "check" : "info"} size={22} className="shrink-0 text-ochre" />
      <span className="min-w-0 flex-1">{message}</span>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} aria-label="Dismiss message" className="on-dark inline-flex size-11 shrink-0 items-center justify-center rounded-full">
          <Icon name="close" size={20} />
        </button>
      ) : null}
    </div>
  );
}

/** Mount once in the root layout. Fire with showToast() from lib/toast. */
export function ToastRegion() {
  const [t, setT] = useState<{ message: string; variant: ToastVariant } | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ message: string; variant?: ToastVariant }>).detail;
      setT({ message: d.message, variant: d.variant ?? "info" });
      clearTimeout(timer);
      if (d.variant !== "error") timer = setTimeout(() => setT(null), 5000);
    };
    window.addEventListener(TOAST_EVENT, on);
    return () => { window.removeEventListener(TOAST_EVENT, on); clearTimeout(timer); };
  }, []);
  if (!t) return null;
  return (
    <div style={{ bottom: "calc(var(--dock-h, 0px) + 6rem)" }} className="on-dark fixed inset-x-4 z-50 md:inset-x-auto md:!bottom-[calc(var(--dock-h,0px)+1.5rem)] md:left-6 md:w-[380px]">
      <Toast message={t.message} variant={t.variant} onDismiss={() => setT(null)} />
    </div>
  );
}
