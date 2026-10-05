"use client";
import { useState, useSyncExternalStore } from "react";
import { Icon } from "./Icon";

const KEY = "mk.announce.v1";

/** One static message. Dismissal is remembered on this device. */
const EVENT = "mk:announce";
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener("storage", cb); };
};

export function AnnouncementBar({ children }: { children: string }) {
  const stored = useSyncExternalStore(
    subscribe,
    () => { try { return window.localStorage.getItem(KEY) === children; } catch { return false; } },
    () => false,
  );
  const [hiddenNow, setHiddenNow] = useState(false);
  if (stored || hiddenNow) return null;
  return (
    <div className="hidden border-b border-[var(--hairline)] bg-oat/70 md:block">
      <div className="mx-auto flex min-h-9 w-full max-w-[1280px] items-center justify-between gap-2 px-3 md:px-4 xl:px-6">
        <p className="min-w-0 flex-1 py-1 text-center text-[.8125rem]">{children}</p>
        <button type="button" aria-label="Dismiss announcement" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full"
          onClick={() => {
            setHiddenNow(true);
            try { window.localStorage.setItem(KEY, children); window.dispatchEvent(new Event(EVENT)); } catch { /* ignore */ }
          }}>
          <Icon name="close" size={16} />
        </button>
      </div>
    </div>
  );
}
