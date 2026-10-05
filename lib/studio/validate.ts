// Per step validation. Messages are plain and kind, one per field id.
import { normalisePhone } from "../phone";
import { termsError, MAX_EXACT, SOON_DAYS, genericBaseById, stitched } from "../../data/studio";
import { OTHER_AREA } from "../../data/deliveryAreas";
import { activeSteps, hasLogoFinish, needsPhotoConsent, wantsBusiness } from "./flow";
import type { Brief, Contact, Errors, PathMode, Piece, StepId } from "./types";

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

/** http or https only. Returns the cleaned URL or null. */
export function cleanLink(input: string): string | null {
  let s = input.trim();
  if (!s || /\s/.test(s)) return null;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = `https://${s}`;
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname.includes(".")) return null;
    return u.toString().slice(0, 300);
  } catch {
    return null;
  }
}

export const domainOf = (url: string): string => {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url.slice(0, 40); }
};

/** Tomorrow in Africa/Nairobi (UTC+3) as YYYY-MM-DD. */
export function tomorrowISO(now: Date = new Date()): string {
  return new Date(now.getTime() + 27 * 3600 * 1000).toISOString().slice(0, 10);
}
/** A date some weeks ahead in Africa/Nairobi. */
export function weeksAheadISO(weeks: number, now: Date = new Date()): string {
  return new Date(now.getTime() + 3 * 3600 * 1000 + weeks * 7 * 86400 * 1000).toISOString().slice(0, 10);
}
/** Whole days from today (Nairobi) to an ISO date. */
export function daysUntil(iso: string, now: Date = new Date()): number {
  const today = new Date(now.getTime() + 3 * 3600 * 1000).toISOString().slice(0, 10);
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
}
export const isSoon = (iso: string, now?: Date) => iso !== "" && daysUntil(iso, now) <= SOON_DAYS;

/** Words that suggest a child's details. Used on short free text fields that are printed on a piece. */
export const CHILD_WORDS = /\b(\d{1,2}\s*(yrs?|years?|months?)\s*old|aged?\s*\d+|age\s*\d+|school|class\s*\d+|grade\s*\d+|surname)\b/i;

function pieceErrors(p: Piece, i: number, step: "pieces" | "look" | "personal"): Errors {
  const e: Errors = {};
  const k = (s: string) => `p${i}-${s}`;
  if (step === "pieces") {
    const g = genericBaseById(p.baseId);
    if (!p.baseId) e[k("base")] = "Please pick a starting shape for this piece.";
    else if (g?.describe && p.baseNote.trim().length < 3) e[k("baseNote")] = "Tell us in a few words what you have in mind.";
    if (!p.size) e[k("size")] = "Please choose a size, or Not sure and we will advise.";
    else if (p.size === "other" && p.sizeOther.trim().length < 2) e[k("sizeOther")] = "Describe the size you have in mind.";
    if (p.qtyExact) {
      const n = parseInt(p.qtyExact, 10);
      if (!(n >= 1 && n <= MAX_EXACT)) e[k("qty")] = `Please give a number from 1 to ${MAX_EXACT}, or clear it.`;
    }
  }
  if (step === "look") {
    if (p.colourSource === "swatches" && p.colours.length === 0 && p.colourNote.trim().length < 2 && p.colourRefs.length === 0) {
      e[k("colours")] = "Pick at least one colour, or tell us about the colours in the note, or choose to match a photo.";
    }
  }
  if (step === "personal") {
    for (const s of stitched) {
      if (!p.stitch.includes(s.id)) continue;
      const v = (p.stitchText[s.id] ?? "").trim();
      if (!v) e[k(`stitch-${s.id}`)] = `Add the ${s.label.toLowerCase()} to stitch, or untick it.`;
      else if (v.length > s.max) e[k(`stitch-${s.id}`)] = `Please keep it to ${s.max} characters.`;
      else if (CHILD_WORDS.test(v)) e[k(`stitch-${s.id}`)] = "Please do not include a child's age, school or surname.";
    }
  }
  return e;
}

function pieceStep(step: "pieces" | "look" | "personal", b: Brief, only?: number): Errors {
  const e: Errors = {};
  b.pieces.forEach((p, i) => { if (only === undefined || only === i) Object.assign(e, pieceErrors(p, i, step)); });
  return e;
}

/** Index of the first piece named in an error map, or -1. */
export const firstPieceWithError = (e: Errors): number => {
  for (const id of Object.keys(e)) { const m = /^p(\d+)-/.exec(id); if (m) return Number(m[1]); }
  return -1;
};

function whoErrors(b: Brief): Errors {
  const e: Errors = {};
  if (b.customerTypes.length === 0) e.customerTypes = "Please choose who is ordering. You can choose more than one, or Other, tell us.";
  else if (b.customerTypes.includes("other") && b.customerTypes.length === 1 && (b.others.customerTypes ?? "").trim().length < 2) e.customerTypes = "Please tell us in a few words who is ordering, or choose one of the others.";
  if (b.types.length === 0) e.types = "Please choose at least one kind of order. Other, tell us is always an option.";
  else if (b.types.includes("other") && b.types.length === 1 && (b.others.types ?? "").trim().length < 2) e.types = "Please tell us in a few words what kind of order it is, or choose one of the others.";
  return e;
}

function timingErrors(b: Brief, minDate: string): Errors {
  const e: Errors = {};
  if (!b.deadlineType) e.deadlineType = "Please choose a firm date, As soon as possible, Flexible or Not sure.";
  if (b.deadlineType === "hard") {
    if (!b.deadlineDate) e.deadlineDate = "Please pick the date, or choose Flexible.";
    else if (b.deadlineDate < minDate) e.deadlineDate = "Please pick a day from tomorrow on.";
  }
  return e;
}

function deliveryErrors(b: Brief, c: Contact): Errors {
  const e: Errors = {};
  b.addresses.forEach((a) => {
    const k = (s: string) => `addr-${a.id}-${s}`;
    if (!a.method) { e[k("method")] = "Please choose how this one should reach you."; return; }
    if (a.method === "nairobi" || a.method === "gift-direct") {
      if (!a.area) e[k("area")] = "Please choose an area, or Other Nairobi area.";
      else if (a.area === OTHER_AREA && a.areaOther.trim().length < 2) e[k("areaOther")] = "Please tell us the area.";
    }
    if (a.method === "town" && a.areaOther.trim().length < 2) e[k("areaOther")] = "Please tell us the town.";
    if (a.method === "courier" && a.areaOther.trim().length < 2) e[k("areaOther")] = "Please tell us where the courier should take it.";
    if (a.method === "international" && a.areaOther.trim().length < 2) e[k("areaOther")] = "Please tell us the country and city.";
    if (a.method === "other" && a.areaOther.trim().length < 2) e[k("areaOther")] = "Please tell us how you would like it to reach you.";
    if (a.method === "gift-direct") {
      const r = c.recipients[a.id] ?? { name: "", phone: "" };
      if (r.name.trim().length < 2) e[k("rname")] = "Please add the name of the adult who will receive it.";
      if (!normalisePhone(r.phone).ok) e[k("rphone")] = "Please add their phone number, like 0712 345 678.";
    }
  });
  return e;
}

function contactErrors(b: Brief, c: Contact): Errors {
  const e: Errors = {};
  if (c.name.trim().length < 2) e.name = "Please add your name, one name is enough, so we know who to reply to.";
  if (!normalisePhone(c.phone).ok) e.phone = "Please add a phone number we can reach on WhatsApp. For example 0712 345 678, or +44 7700 900123 with the country code.";
  if (c.email.trim() && !emailOk(c.email)) e.email = "That email does not look right yet. Check it, or leave it empty.";
  if (c.email.trim() === "" && b.contactChannels.includes("email")) e.email = "Add your email, or untick Email as a way to reach you.";
  if (b.contactChannels.includes("other") && (b.others.contactChannels ?? "").trim().length < 2) e.channelOther = "Tell us the other way to reach you, or untick Other.";
  if (wantsBusiness(b) && c.bizName.trim().length < 2) e.bizName = "Please add the name of the business or organisation.";
  return e;
}

function consentErrors(b: Brief, c: Contact): Errors {
  const e: Errors = {};
  if (needsPhotoConsent(b) && !c.photoOk) e.photoOk = "Please confirm you have the right to share the photos.";
  if (!c.termsOk) e.termsOk = termsError;
  return e;
}

export function validateStep(step: StepId, b: Brief, c: Contact, minDate: string, only?: number): Errors {
  switch (step) {
    case "who": return whoErrors(b);
    case "pieces": return pieceStep("pieces", b, only);
    case "look": return pieceStep("look", b, only);
    case "personal": return pieceStep("personal", b, only);
    case "ideas": return hasLogoFinish(b) && !b.rights ? { rights: "Please tell us who owns the logo, or choose I am not sure yet." } : {};
    case "timing": return timingErrors(b, minDate);
    case "delivery": return deliveryErrors(b, c);
    case "business": return wantsBusiness(b) && c.bizName.trim().length < 2 ? { bizName: "Please add the name of the business or organisation." } : {};
    case "production": return {};
    case "contact": return contactErrors(b, c);
    case "review": return consentErrors(b, c);
    case "qidea": return { ...whoErrors(b), ...pieceStep("pieces", { ...b, pieces: b.pieces.slice(0, 1) }), ...pieceStep("look", { ...b, pieces: b.pieces.slice(0, 1) }) };
    case "qwhen": return { ...timingErrors(b, minDate), ...deliveryErrors(b, c) };
    case "qsend": return { ...contactErrors(b, c), ...consentErrors(b, c) };
  }
}

/** Steps whose answers are required to send, per path. */
const checks: Record<PathMode, StepId[]> = {
  quick: ["qidea", "qwhen", "qsend"],
  full: ["who", "pieces", "look", "personal", "ideas", "timing", "delivery", "business", "contact", "review"],
};

/** First failing step, for the Send tap. */
export function validateAll(path: PathMode, b: Brief, c: Contact, minDate: string): { step: StepId; errors: Errors } | null {
  const active = activeSteps(path, b);
  for (const s of checks[path]) {
    if (!active.includes(s)) continue;
    const errors = validateStep(s, b, c, minDate);
    if (Object.keys(errors).length) return { step: s, errors };
  }
  return null;
}
