// Device profile (strategy/16 section 3.1): opt-in "remember me on this device", kept 90 days from the last send.
// Never stored: KRA PIN, PO number, gift notes, recipient name and phone (a third party), payment note, order notes,
// map pin of a recipient, anything about children. Nothing here is ever sent anywhere.
import { KEYS, RETENTION } from "./storageKeys";

export interface Profile {
  v: 1;
  savedAt: number;
  customerTypes: string[];
  name: string;
  phone: string;
  email: string;
  contactChannels: string[];
  contactHours: string;
  language: string;
  fulfilment: string;
  area: string;
  areaOther: string;
  county: string;
  town: string;
  landmark: string;
  deliveryNotes: string;
  mapsPin: string;
  businessName: string;
  businessType: string;
  outletLocation: string;
  invoiceName: string;
}
export type ProfileFields = Omit<Profile, "v" | "savedAt">;

const ARRAY_FIELDS = ["customerTypes", "contactChannels"] as const;
export const PROFILE_FIELDS: Array<keyof ProfileFields> = [
  "customerTypes", "name", "phone", "email", "contactChannels", "contactHours", "language", "fulfilment", "area", "areaOther",
  "county", "town", "landmark", "deliveryNotes", "mapsPin", "businessName", "businessType", "outletLocation", "invoiceName",
];

const TTL = RETENTION.profileDays * 86400000;

/** Keeps only the allowed keys, as short strings. Anything else a caller passes in is dropped. */
export function pickProfile(source: object): ProfileFields {
  const src = source as Record<string, unknown>;
  const out = {} as Record<string, string | string[]>;
  for (const k of PROFILE_FIELDS) {
    if ((ARRAY_FIELDS as readonly string[]).includes(k)) out[k] = Array.isArray(src[k]) ? (src[k] as unknown[]).filter((x): x is string => typeof x === "string").map((x) => x.slice(0, 40)).slice(0, 40) : [];
    else out[k] = typeof src[k] === "string" ? (src[k] as string).slice(0, 300) : "";
  }
  return out as unknown as ProfileFields;
}

export function readProfile(now: number = Date.now()): Profile | null {
  try {
    const raw = window.localStorage.getItem(KEYS.profile);
    if (!raw) return null;
    const p = JSON.parse(raw) as Profile;
    if (p?.v !== 1 || typeof p.savedAt !== "number") throw new Error("shape");
    if (now - p.savedAt > TTL) { window.localStorage.removeItem(KEYS.profile); return null; }
    return { v: 1, savedAt: p.savedAt, ...pickProfile(p) };
  } catch {
    try { window.localStorage.removeItem(KEYS.profile); } catch { /* ignore */ }
    return null;
  }
}

/** Rolling 90 days: every successful send with the box ticked renews it. */
export function writeProfile(src: object, now: number = Date.now()): boolean {
  try {
    const p: Profile = { v: 1, savedAt: now, ...pickProfile(src) };
    window.localStorage.setItem(KEYS.profile, JSON.stringify(p));
    return true;
  } catch { return false; }
}

export function forgetProfile() {
  try { window.localStorage.removeItem(KEYS.profile); } catch { /* ignore */ }
}
