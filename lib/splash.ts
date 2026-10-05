/** Window event fired once the intro has left the page (finished or skipped). */
export const SPLASH_DONE_EVENT = "mk:splash-done";

/** True while the intro is on screen. The gate script in public/splash-gate.js sets the attribute before first paint. */
export const splashActive = () => typeof document !== "undefined" && document.documentElement.dataset.splash === "on";

/** Runs the callback now, or once the intro is gone. Returns a cleanup. */
export function afterSplash(cb: () => void): () => void {
  if (!splashActive()) { cb(); return () => {}; }
  const run = () => cb();
  window.addEventListener(SPLASH_DONE_EVENT, run, { once: true });
  return () => window.removeEventListener(SPLASH_DONE_EVENT, run);
}
