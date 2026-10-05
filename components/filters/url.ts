import { useSyncExternalStore } from "react";

/**
 * Filter state lives in the address bar, so Back, reload and sharing a link all work.
 * Reads window.location.search through useSyncExternalStore (empty on the server, so the static page never needs a Suspense boundary).
 * Writes with history.replaceState, which Next.js syncs with its router, so Back leaves the page instead of stepping through every tap.
 */
const EVENT = "mf:url";
const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENT, cb);
  return () => { window.removeEventListener("popstate", cb); window.removeEventListener(EVENT, cb); };
};

/** The raw query string, for example "?colour=yellow". Empty on the server. */
export const useQueryString = () => useSyncExternalStore(subscribe, () => window.location.search, () => "");

/** Put the given values in the address bar. Empty values and empty lists are dropped. */
export function writeQuery(values: Record<string, string | string[]>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(values)) for (const x of Array.isArray(v) ? v : [v]) if (x) q.append(k, x);
  const s = q.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${s ? `?${s}` : ""}${window.location.hash}`);
  window.dispatchEvent(new Event(EVENT));
}

/** Keep only values that exist in the allowed list, so a hand edited link can never break the page. */
export const only = (vals: string[], allowed: readonly string[]) => vals.filter((v) => allowed.includes(v));

/** Plural helper: "1 animal", "12 animals". */
export const nounFor = (n: number, one: string, many: string) => (n === 1 ? one : many);
