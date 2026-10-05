import type { ReactNode } from "react";
import { preload } from "react-dom";
import { living, type Template } from "@/data/living";
import { Thread } from "./Thread";
import { ENGINE_URL } from "./engine.generated";

/**
 * Wrap a page that carries animals. Renders the host the thread and bands live in, and marks it for the engine.
 * Do not use on cart, order, legal pages or any form in progress.
 */
export function FxPage({ t, children }: { t: Template; children: ReactNode }) {
  const def = living(t);
  // Start fetching the engine script from the document head; the inline loader after the footer then runs it from cache.
  if (process.env.NODE_ENV === "production") preload(ENGINE_URL, { as: "script" });
  return (
    <div className="fx-host" data-fx-page={t} data-peek={def.peek ? "" : undefined}>
      {def.thread !== "off" ? <Thread t={t} mode={def.thread} /> : null}
      {children}
    </div>
  );
}
