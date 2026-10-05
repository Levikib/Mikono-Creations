// Studio state: one reducer, a device-only draft that expires after 24 hours, and the sent record.
// Contact, business details, recipients and the KRA PIN are never written to the draft (D16).
import { DRAFT_TTL_HOURS } from "../site";
import {
  bandAliases, paymentMethods, paymentTiming, qtyBands, MAX_ADDRESSES, MAX_COLOURS, MAX_COLOUR_REFS, MAX_LINKS, MAX_LIST, MAX_NOTES, MAX_PHOTOS, MAX_PICKS, MAX_PIECES, MAX_TYPES, NOTE_MAX, OTHER_TEXT_MAX, deliveryMethods, normaliseType,
} from "../../data/studio";
import type { Address, Brief, CataloguePick, ColourPick, Contact, PathMode, Piece, StepId } from "./types";
import { fullSteps, quickSteps } from "../../data/studio";

const bandIds = qtyBands.map((x) => x.id);
export const DRAFT_KEY = "mk.studio.v2";
export const SENT_KEY = "mk.studio.sent.v2";
export const DRAFT_TTL_MS = DRAFT_TTL_HOURS * 3600 * 1000;

export const newPiece = (id: string): Piece => ({
  id, label: "", baseId: "", baseNote: "", size: "", sizeOther: "", qtyBand: "1", qtyExact: "",
  colours: [], colourSource: "swatches", colourNote: "", colourRefs: [], markings: [], markingsNote: "", eyes: "", nose: "", expression: "", textures: [],
  posture: "", loop: "", unique: "", stitch: [], stitchText: {}, wear: [], finish: [], others: {},
});

export const newAddress = (id: string, method = ""): Address => ({ id, method, area: "", areaOther: "", county: "", label: "", share: "", note: "" });

export const emptyBrief = (firstId = "p1"): Brief => ({
  customerTypes: [], types: [], pieces: [newPiece(firstId)], occasions: [], occasionDayMonth: "", eventLabel: "", eventDate: "",
  deadlineType: "", deadlineDate: "", rush: "", addresses: [newAddress("a1")], budgetBand: "", budgetText: "", budgetPer: "",
  picks: [], links: [], notes: [""], photoCount: 0, moods: [], rights: "", packaging: [], wrapping: [], giftCardText: "", giftNote: "",
  payTiming: "", payMethods: [], sustainInfo: false, contactChannels: [], contactHours: [], languages: [], others: {},
});

export const emptyContact = (): Contact => ({
  name: "", phone: "", email: "", bizName: "", bizType: "", role: "", invoiceName: "", po: "", kraPin: "", recipients: {}, access: "", payNote: "",
  photoOk: false, termsOk: false, marketingWhatsapp: false, marketingEmail: false,
});

export interface StudioState { brief: Brief; contact: Contact; path: PathMode; step: StepId; reached: StepId[]; active: number; ref?: string }

export const initialState = (path: PathMode = "quick"): StudioState => ({
  brief: emptyBrief(), contact: emptyContact(), path, step: path === "quick" ? "qidea" : "who", reached: [], active: 0, ref: undefined,
});

type ListField = "customerTypes" | "types" | "occasions" | "moods" | "packaging" | "wrapping" | "contactChannels" | "contactHours" | "languages" | "payMethods";
type PieceListField = "markings" | "textures" | "stitch" | "wear" | "finish";

export type Action =
  | { type: "brief"; patch: Partial<Brief> }
  | { type: "contact"; patch: Partial<Contact> }
  | { type: "toggle"; field: ListField; id: string; max?: number }
  | { type: "other"; key: string; value: string }
  | { type: "pother"; index: number; key: string; value: string }
  | { type: "note"; index: number; value: string }
  | { type: "addNote" }
  | { type: "removeNote"; index: number }
  | { type: "colourRef"; index: number; at: number; value: string | null }
  | { type: "piece"; index: number; patch: Partial<Piece> }
  | { type: "ptoggle"; index: number; field: PieceListField; id: string; max?: number }
  | { type: "stitchText"; index: number; id: string; value: string }
  | { type: "toggleColour"; index: number; colour: ColourPick }
  | { type: "clearColours"; index: number }
  | { type: "addPiece"; id: string }
  | { type: "duplicatePiece"; index: number; id: string }
  | { type: "movePiece"; index: number; dir: -1 | 1 }
  | { type: "removePiece"; index: number }
  | { type: "active"; index: number }
  | { type: "setPick"; slug: string; pref: CataloguePick["pref"] | null }
  | { type: "addLink"; url: string }
  | { type: "removeLink"; url: string }
  | { type: "address"; id: string; patch: Partial<Address> }
  | { type: "addAddress"; id: string }
  | { type: "removeAddress"; id: string }
  | { type: "recipient"; id: string; patch: Partial<{ name: string; phone: string }> }
  | { type: "step"; step: StepId }
  | { type: "path"; path: PathMode; step: StepId }
  | { type: "ref"; ref: string }
  | { type: "load"; state: StudioState }
  | { type: "reset" };

const toggled = (list: string[], id: string, max?: number): string[] =>
  list.includes(id) ? list.filter((x) => x !== id) : max !== undefined && list.length >= max ? list : [...list, id];

const setPiece = (s: StudioState, index: number, fn: (p: Piece) => Piece): StudioState => {
  if (!s.brief.pieces[index]) return s;
  return { ...s, brief: { ...s.brief, pieces: s.brief.pieces.map((p, i) => (i === index ? fn(p) : p)) } };
};

export function reducer(s: StudioState, a: Action): StudioState {
  switch (a.type) {
    case "brief": return { ...s, brief: { ...s.brief, ...a.patch } };
    case "contact": return { ...s, contact: { ...s.contact, ...a.patch } };
    case "toggle": return { ...s, brief: { ...s.brief, [a.field]: toggled(s.brief[a.field], a.id, a.max ?? (a.field === "types" ? MAX_TYPES : MAX_LIST)) } };
    case "other": return { ...s, brief: { ...s.brief, others: { ...s.brief.others, [a.key]: a.value.slice(0, OTHER_TEXT_MAX) } } };
    case "pother": return setPiece(s, a.index, (p) => ({ ...p, others: { ...p.others, [a.key]: a.value.slice(0, OTHER_TEXT_MAX) } }));
    case "note": {
      const notes = [...s.brief.notes]; notes[a.index] = a.value;
      return { ...s, brief: { ...s.brief, notes } };
    }
    case "addNote": return s.brief.notes.length >= MAX_NOTES ? s : { ...s, brief: { ...s.brief, notes: [...s.brief.notes, ""] } };
    case "removeNote": { const notes = s.brief.notes.filter((_, i) => i !== a.index); return { ...s, brief: { ...s.brief, notes: notes.length ? notes : [""] } }; }
    case "colourRef": return setPiece(s, a.index, (p) => ({ ...p, colourRefs: a.value === null ? p.colourRefs.filter((_, i) => i !== a.at) : a.at >= p.colourRefs.length ? (p.colourRefs.length >= MAX_COLOUR_REFS || !a.value.trim() ? p.colourRefs : [...p.colourRefs, a.value.trim().slice(0, 60)]) : p.colourRefs.map((x, i) => (i === a.at ? a.value! : x)) }));
    case "piece": return setPiece(s, a.index, (p) => ({ ...p, ...a.patch }));
    case "ptoggle": return setPiece(s, a.index, (p) => ({ ...p, [a.field]: toggled(p[a.field], a.id, a.max) }));
    case "stitchText": return setPiece(s, a.index, (p) => ({ ...p, stitchText: { ...p.stitchText, [a.id]: a.value } }));
    case "toggleColour": return setPiece(s, a.index, (p) => {
      const has = p.colours.some((c) => c.id === a.colour.id);
      const colours = has ? p.colours.filter((c) => c.id !== a.colour.id) : p.colours.length >= MAX_COLOURS ? p.colours : [...p.colours, a.colour];
      return { ...p, colours };
    });
    case "clearColours": return setPiece(s, a.index, (p) => ({ ...p, colours: [] }));
    case "addPiece": {
      if (s.brief.pieces.length >= MAX_PIECES) return s;
      const pieces = [...s.brief.pieces, newPiece(a.id)];
      return { ...s, brief: { ...s.brief, pieces }, active: pieces.length - 1 };
    }
    case "duplicatePiece": {
      const src = s.brief.pieces[a.index];
      if (!src || s.brief.pieces.length >= MAX_PIECES) return s;
      const copy: Piece = JSON.parse(JSON.stringify(src));
      copy.id = a.id;
      const pieces = [...s.brief.pieces.slice(0, a.index + 1), copy, ...s.brief.pieces.slice(a.index + 1)];
      return { ...s, brief: { ...s.brief, pieces }, active: a.index + 1 };
    }
    case "movePiece": {
      const to = a.index + a.dir;
      const pieces = [...s.brief.pieces];
      if (to < 0 || to >= pieces.length || !pieces[a.index]) return s;
      [pieces[a.index], pieces[to]] = [pieces[to], pieces[a.index]];
      return { ...s, brief: { ...s.brief, pieces }, active: to };
    }
    case "removePiece": {
      if (s.brief.pieces.length <= 1 || !s.brief.pieces[a.index]) return s;
      const pieces = s.brief.pieces.filter((_, i) => i !== a.index);
      return { ...s, brief: { ...s.brief, pieces }, active: Math.min(s.active > a.index ? s.active - 1 : s.active, pieces.length - 1) };
    }
    case "active": return s.brief.pieces[a.index] ? { ...s, active: a.index } : s;
    case "setPick": {
      const rest = s.brief.picks.filter((p) => p.slug !== a.slug);
      if (a.pref === null) return { ...s, brief: { ...s.brief, picks: rest } };
      const had = s.brief.picks.some((p) => p.slug === a.slug);
      if (!had && rest.length >= MAX_PICKS) return s;
      const picks = had ? s.brief.picks.map((p) => (p.slug === a.slug ? { ...p, pref: a.pref! } : p)) : [...rest, { slug: a.slug, pref: a.pref }];
      return { ...s, brief: { ...s.brief, picks } };
    }
    case "addLink": {
      if (s.brief.links.includes(a.url) || s.brief.links.length >= MAX_LINKS) return s;
      return { ...s, brief: { ...s.brief, links: [...s.brief.links, a.url] } };
    }
    case "removeLink": return { ...s, brief: { ...s.brief, links: s.brief.links.filter((l) => l !== a.url) } };
    case "address": return { ...s, brief: { ...s.brief, addresses: s.brief.addresses.map((x) => (x.id === a.id ? { ...x, ...a.patch } : x)) } };
    case "addAddress": {
      if (s.brief.addresses.length >= MAX_ADDRESSES) return s;
      return { ...s, brief: { ...s.brief, addresses: [...s.brief.addresses, newAddress(a.id)] } };
    }
    case "removeAddress": {
      if (s.brief.addresses.length <= 1) return s;
      const { [a.id]: _gone, ...recipients } = s.contact.recipients; void _gone;
      return { ...s, brief: { ...s.brief, addresses: s.brief.addresses.filter((x) => x.id !== a.id) }, contact: { ...s.contact, recipients } };
    }
    case "recipient": {
      const cur = s.contact.recipients[a.id] ?? { name: "", phone: "" };
      return { ...s, contact: { ...s.contact, recipients: { ...s.contact.recipients, [a.id]: { ...cur, ...a.patch } } } };
    }
    case "step": return { ...s, step: a.step, reached: s.reached.includes(a.step) ? s.reached : [...s.reached, a.step] };
    case "path": return { ...s, path: a.path, step: a.step, reached: s.reached.includes(a.step) ? s.reached : [...s.reached, a.step] };
    case "ref": return { ...s, ref: a.ref };
    case "load": return a.state;
    case "reset": return initialState();
  }
}

/** Has the customer chosen anything worth keeping? */
export function hasContent(b: Brief): boolean {
  return JSON.stringify(b) !== JSON.stringify(emptyBrief(b.pieces[0]?.id ?? "p1")) ;
}

/* ---------- query handling: ?base=<slug>, ?type=<id>, ?path=quick|full ---------- */

/** Applies deep link parameters. An unknown slug is ignored: pass the catalogue slugs the page knows. Old type ids still work. */
export function applyQuery(s: StudioState, params: URLSearchParams, knownSlugs: readonly string[]): StudioState {
  const base = params.get("base") ?? "";
  const type = normaliseType(params.get("type") ?? "");
  const path = params.get("path");
  let brief = s.brief;
  if (type) brief = { ...brief, types: [type] };
  if (base && knownSlugs.includes(base)) {
    brief = { ...brief, pieces: brief.pieces.map((p, i) => (i === 0 ? { ...p, baseId: base } : p)) };
  }
  const next = brief === s.brief ? s : { ...s, brief };
  if (path === "full" && next.path !== "full") return { ...next, path: "full", step: "who" };
  return next;
}

/* ---------- draft storage (pass any Storage so tests can use a fake) ---------- */

export interface StorageLike { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void }

interface DraftFile { v: 2; updatedAt: number; path: PathMode; step: StepId; reached: StepId[]; active: number; brief: Brief; ref?: string }

export function isExpired(updatedAt: number, now: number, ttlMs: number = DRAFT_TTL_MS): boolean {
  return !Number.isFinite(updatedAt) || now - updatedAt > ttlMs;
}

const clampInt = (n: unknown, lo: number, hi: number, d: number) => (typeof n === "number" && Number.isFinite(n) ? Math.min(hi, Math.max(lo, Math.floor(n))) : d);
const str = (v: unknown, max = 300) => (typeof v === "string" ? v.slice(0, max) : "");
const strList = (v: unknown, max: number, each = 60) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").map((x) => x.slice(0, each)).slice(0, max) : []);
const rec = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const otherText = (v: unknown): Record<string, string> =>
  Object.fromEntries(Object.entries(rec(v)).filter(([, x]) => typeof x === "string").slice(0, 20).map(([k, x]) => [k.slice(0, 30), (x as string).slice(0, OTHER_TEXT_MAX)]));
const yn = (v: unknown): "" | "yes" | "no" => (v === "yes" || v === "no" ? v : "");

function sanitisePiece(raw: unknown, i: number): Piece {
  const r = rec(raw);
  const p = newPiece(str(r.id, 20) || `p${i + 1}`);
  p.label = str(r.label, 40); p.baseId = str(r.baseId, 60); p.baseNote = str(r.baseNote, 300);
  p.size = ["S", "M", "L", "XL", "advise", "other"].includes(str(r.size)) ? str(r.size) : "";
  p.sizeOther = str(r.sizeOther, 120);
  p.qtyBand = bandIds.includes(bandAliases[str(r.qtyBand)] ?? str(r.qtyBand)) ? (bandAliases[str(r.qtyBand)] ?? str(r.qtyBand)) : "1";
  p.qtyExact = str(r.qtyExact, 5).replace(/\D/g, "");
  p.colours = (Array.isArray(r.colours) ? r.colours : [])
    .filter((c): c is ColourPick => !!c && typeof (c as ColourPick).id === "string" && typeof (c as ColourPick).label === "string")
    .slice(0, MAX_COLOURS).map((c) => ({ id: c.id.slice(0, 60), label: c.label.slice(0, 60), family: str(c.family, 20) }));
  p.colourSource = r.colourSource === "photo" || r.colourSource === "brand" || r.colourSource === "surprise" ? r.colourSource : "swatches";
  p.others = otherText(r.others);
  p.colourNote = str(r.colourNote, 200); p.colourRefs = strList(r.colourRefs, MAX_COLOUR_REFS, 60); p.markings = strList(r.markings, MAX_LIST); p.markingsNote = str(r.markingsNote, 200);
  p.eyes = str(r.eyes, 30); p.nose = str(r.nose, 30); p.expression = str(r.expression, 30); p.textures = strList(r.textures, MAX_LIST);
  p.posture = str(r.posture, 30); p.loop = r.loop === "yes" || r.loop === "no" ? r.loop : ""; p.unique = str(r.unique, 300);
  p.stitch = strList(r.stitch, MAX_LIST); p.wear = strList(r.wear, MAX_LIST); p.finish = strList(r.finish, MAX_LIST);
  const st = rec(r.stitchText);
  p.stitchText = Object.fromEntries(Object.entries(st).filter(([, v]) => typeof v === "string").slice(0, MAX_LIST).map(([k, v]) => [k.slice(0, 20), (v as string).slice(0, 60)]));
  return p;
}

function sanitiseAddress(raw: unknown, i: number): Address {
  const r = rec(raw);
  const m = str(r.method, 20);
  return { id: str(r.id, 20) || `a${i + 1}`, method: deliveryMethods.some((d) => d.id === m) ? m : "", area: str(r.area, 60), areaOther: str(r.areaOther, 80), county: str(r.county, 30), label: str(r.label, 60), share: str(r.share, 60), note: str(r.note, 200) };
}

/** Rebuilds a brief from stored JSON, dropping anything of the wrong shape. */
export function sanitiseBrief(raw: unknown): Brief {
  const r = rec(raw);
  const b = emptyBrief();
  b.customerTypes = strList(r.customerTypes, MAX_LIST, 30);
  b.types = strList(r.types, MAX_TYPES, 30).map(normaliseType).filter(Boolean);
  const ps = Array.isArray(r.pieces) ? r.pieces.slice(0, MAX_PIECES).map(sanitisePiece) : [];
  if (ps.length) b.pieces = ps;
  b.occasions = strList(r.occasions, MAX_LIST, 30);
  b.occasionDayMonth = /^\d{2}-\d{2}$/.test(str(r.occasionDayMonth)) ? str(r.occasionDayMonth) : "";
  b.eventLabel = str(r.eventLabel, 60);
  b.eventDate = /^\d{4}-\d{2}-\d{2}$/.test(str(r.eventDate)) ? str(r.eventDate) : "";
  b.deadlineType = r.deadlineType === "hard" || r.deadlineType === "asap" || r.deadlineType === "flexible" || r.deadlineType === "unsure" ? r.deadlineType : "";
  b.deadlineDate = /^\d{4}-\d{2}-\d{2}$/.test(str(r.deadlineDate)) ? str(r.deadlineDate) : "";
  b.rush = yn(r.rush);
  const as = Array.isArray(r.addresses) ? r.addresses.slice(0, MAX_ADDRESSES).map(sanitiseAddress) : [];
  if (as.length) b.addresses = as;
  b.budgetBand = str(r.budgetBand, 30); b.budgetText = str(r.budgetText, 80);
  b.budgetPer = r.budgetPer === "total" || r.budgetPer === "each" ? r.budgetPer : "";
  b.picks = (Array.isArray(r.picks) ? r.picks : [])
    .filter((p): p is CataloguePick => !!p && typeof (p as CataloguePick).slug === "string" && ((p as CataloguePick).pref === "like" || (p as CataloguePick).pref === "avoid"))
    .slice(0, MAX_PICKS).map((p) => ({ slug: p.slug.slice(0, 60), pref: p.pref }));
  b.links = strList(r.links, MAX_LINKS, 300);
  b.notes = strList(r.notes, MAX_NOTES, NOTE_MAX); if (b.notes.length === 0) b.notes = [""];
  b.photoCount = clampInt(r.photoCount, 0, MAX_PHOTOS, 0);
  b.moods = strList(r.moods, MAX_LIST, 30); b.rights = str(r.rights, 20);
  b.packaging = strList(r.packaging, MAX_LIST, 30); b.wrapping = strList(r.wrapping, MAX_LIST, 30);
  b.giftCardText = str(r.giftCardText, 120); b.giftNote = str(r.giftNote, 200);
  b.payTiming = paymentTiming.some((x) => x.id === str(r.payTiming)) ? str(r.payTiming) : ""; b.payMethods = strList(r.payMethods, MAX_LIST, 30).filter((x) => paymentMethods.some((m) => m.id === x)); b.sustainInfo = r.sustainInfo === true;
  b.contactChannels = strList(r.contactChannels, MAX_LIST, 30); b.contactHours = strList(r.contactHours, MAX_LIST, 30); b.languages = strList(r.languages, MAX_LIST, 30); b.others = otherText(r.others);
  return b;
}

const ALL_STEPS = new Set<string>([...quickSteps, ...fullSteps]);

export function readDraft(storage: StorageLike | null, now: number = Date.now()): StudioState | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as DraftFile;
    if (d?.v !== 2 || typeof d.updatedAt !== "number" || !d.brief) throw new Error("shape");
    if (isExpired(d.updatedAt, now)) { storage.removeItem(DRAFT_KEY); return null; }
    const path: PathMode = d.path === "full" ? "full" : "quick";
    let step: StepId = ALL_STEPS.has(d.step) ? d.step : path === "quick" ? "qidea" : "who";
    // Contact details are never stored, so a draft resumes at the details step at the latest.
    const resumeAt: StepId = path === "quick" ? "qsend" : "contact";
    const list = path === "quick" ? quickSteps : fullSteps;
    if (!list.includes(step)) step = list[0];
    if (list.indexOf(step) > list.indexOf(resumeAt)) step = resumeAt;
    const brief = sanitiseBrief(d.brief);
    if (!hasContent(brief)) return null;
    const reached = (Array.isArray(d.reached) ? d.reached : []).filter((x): x is StepId => ALL_STEPS.has(x as string) && list.includes(x as StepId));
    return { brief, contact: emptyContact(), path, step, reached, active: clampInt(d.active, 0, brief.pieces.length - 1, 0), ref: typeof d.ref === "string" ? d.ref : undefined };
  } catch {
    try { storage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    return null;
  }
}

export function writeDraft(storage: StorageLike | null, s: StudioState, now: number = Date.now()): boolean {
  if (!storage) return false;
  try {
    const file: DraftFile = { v: 2, updatedAt: now, path: s.path, step: s.step, reached: s.reached, active: s.active, brief: s.brief, ref: s.ref };
    storage.setItem(DRAFT_KEY, JSON.stringify(file));
    return true;
  } catch {
    return false;
  }
}

export function clearDraft(storage: StorageLike | null) {
  try { storage?.removeItem(DRAFT_KEY); } catch { /* ignore */ }
}

/* ---------- the sent record, read by /custom/studio/sent ---------- */

/** The text stored here never holds the KRA PIN: the caller passes the redacted copy. */
export interface SentRecord { v: 1; ref: string; at: number; fullText: string; text: string; url: string | null; level: string; photoCount: number }

export function writeSent(storage: StorageLike | null, rec: Omit<SentRecord, "v">): boolean {
  if (!storage) return false;
  try { storage.setItem(SENT_KEY, JSON.stringify({ v: 1, ...rec })); return true; } catch { return false; }
}

export function readSent(storage: StorageLike | null, now: number = Date.now()): SentRecord | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(SENT_KEY);
    if (!raw) return null;
    const r = JSON.parse(raw) as SentRecord;
    if (r?.v !== 1 || typeof r.ref !== "string" || typeof r.fullText !== "string" || isExpired(r.at, now)) { storage.removeItem(SENT_KEY); return null; }
    return r;
  } catch {
    return null;
  }
}

export function clearSent(storage: StorageLike | null) {
  try { storage?.removeItem(SENT_KEY); } catch { /* ignore */ }
}
