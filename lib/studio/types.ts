// Custom Studio data model. A brief is order level answers plus a list of pieces. No field stores a child's name or age (D16).

export type PathMode = "quick" | "full";
export type StepId =
  | "qidea" | "qwhen" | "qsend"
  | "who" | "pieces" | "look" | "personal" | "ideas" | "timing" | "delivery" | "business" | "production" | "contact" | "review";

export type ColourSource = "swatches" | "photo" | "brand" | "surprise";
export type DeadlineType = "" | "hard" | "asap" | "flexible" | "unsure";
export type YesNo = "" | "yes" | "no";

export interface ColourPick {
  /** Stable id from the printed colour name. */
  id: string;
  /** The printed name, as on the shop. */
  label: string;
  family: string;
}

export interface CataloguePick { slug: string; pref: "like" | "avoid" }

/** Free text for the Other choice of a list, by list name. Kept short. */
export type OtherText = Record<string, string>;

/** One piece in a brief. A brief has one or more, as many as the person needs. */
export interface Piece {
  id: string;
  /** Optional short label such as "Table gifts". Never a child's name. */
  label: string;
  /** A catalogue slug or a generic base id (data/studio/baseForms.ts). */
  baseId: string;
  baseNote: string;
  /** Size code S, M, L, XL (shown as words), "advise" or "other". */
  size: string;
  sizeOther: string;
  qtyBand: string;
  /** Exact number as typed, digits only. Optional. */
  qtyExact: string;
  colours: ColourPick[];
  colourSource: ColourSource;
  colourNote: string;
  /** Colour references such as "sage ribbon". */
  colourRefs: string[];
  markings: string[];
  markingsNote: string;
  eyes: string;
  nose: string;
  expression: string;
  textures: string[];
  posture: string;
  loop: "" | "yes" | "no";
  unique: string;
  /** Ids of data/studio/personalisation.ts stitched[]. */
  stitch: string[];
  stitchText: Record<string, string>;
  wear: string[];
  finish: string[];
  /** Text for "Other, tell us" in this piece's lists (markings, eyes, nose, expression, textures, posture, wear, finish, stitch). */
  others: OtherText;
}

export interface Address {
  id: string;
  method: string;
  area: string;
  areaOther: string;
  /** One of the 47 counties, for a town or courier address. */
  county: string;
  /** A site or branch label for business orders, for example "Nakuru branch". */
  label: string;
  /** How many pieces go here. Free text. */
  share: string;
  note: string;
}

export interface Brief {
  /** Who is ordering. Several can be true (a business that is also an event planner). */
  customerTypes: string[];
  types: string[];
  pieces: Piece[];
  occasions: string[];
  /** Day and month only, "MM-DD", for reminders. Empty if not given. */
  occasionDayMonth: string;
  eventLabel: string;
  eventDate: string;
  deadlineType: DeadlineType;
  deadlineDate: string;
  rush: YesNo;
  addresses: Address[];
  budgetBand: string;
  budgetText: string;
  budgetPer: "" | "total" | "each";
  picks: CataloguePick[];
  links: string[];
  /** Free notes, up to four. */
  notes: string[];
  photoCount: number;
  moods: string[];
  rights: string;
  packaging: string[];
  wrapping: string[];
  giftCardText: string;
  giftNote: string;
  /** One choice: full, deposit, pod, pickup or suggest (data/studio/payment.ts). */
  payTiming: string;
  /** How they would like to pay. Optional, with Other. */
  payMethods: string[];
  sustainInfo: boolean;
  contactChannels: string[];
  contactHours: string[];
  languages: string[];
  /** Text for "Other, tell us" by list name (customerTypes, types, occasions, moods, packaging, wrapping, contactChannels, contactHours, languages, bizType, base). */
  others: OtherText;
}

/** Everything personal. Never written to the draft (D16). */
export interface Contact {
  name: string;
  phone: string;
  email: string;
  /** Business details. */
  bizName: string;
  bizType: string;
  role: string;
  invoiceName: string;
  po: string;
  /** Goes only into the WhatsApp message. Never stored, never tracked. */
  kraPin: string;
  /** Adult recipients for gift-direct addresses, by address id. */
  recipients: Record<string, { name: string; phone: string }>;
  /** "Anything that would make this easier for you?" Goes only into the message. Never saved. */
  access: string;
  /** A free note about paying. Goes only into the message. Never saved. */
  payNote: string;
  photoOk: boolean;
  termsOk: boolean;
  marketingWhatsapp: boolean;
  marketingEmail: boolean;
}

export type Errors = Record<string, string>;
