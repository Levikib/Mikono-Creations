// Legal pack types. DRAFT for review by a Kenyan advocate. Not legal advice.
// Placeholders are written in square brackets in capitals, for example [LEGAL ENTITY NAME].
// The master list of placeholders is in strategy/18-legal-pack.md.

export interface LegalSection {
  /** Stable anchor id for deep links, for example "formation". */
  id: string;
  heading: string;
  paragraphs: string[];
  list?: string[];
  /** A short visible note for the reader (for example "Placeholder until confirmed"). */
  note?: string;
}

export type LegalAudience = "public" | "internal";
export type AcceptanceContext = "checkout" | "custom" | "wholesale";

export interface LegalDoc {
  slug: string;
  title: string;
  version: string;
  /** Placeholder until the owner publishes. */
  effectiveDate: string;
  summary: string;
  sections: LegalSection[];
  /** Computed from the text by defineDoc(): every [PLACEHOLDER] used in this document. */
  placeholders: string[];
  /** Planned site route. Internal documents have none. */
  route?: string;
  audience: LegalAudience;
  /** Which acceptance checkboxes reference this document. */
  acceptedAt: AcceptanceContext[];
  /** Not rendered on the site. For the advocate: citations with [V] verified or [U] unverified marks, and open points. */
  advocateNotes: string[];
}

export const EFFECTIVE_DATE_PLACEHOLDER = "[EFFECTIVE DATE]";
export const DRAFT_VERSION = "v0.1-draft";

const PLACEHOLDER_RE = /\[[A-Z0-9][A-Z0-9 /,'()+:.]*\]/g;

export function collectPlaceholders(sections: LegalSection[], extra: string[] = []): string[] {
  const found = new Set<string>();
  const scan = (text: string) => {
    for (const m of text.match(PLACEHOLDER_RE) ?? []) found.add(m);
  };
  for (const s of sections) {
    scan(s.heading);
    s.paragraphs.forEach(scan);
    s.list?.forEach(scan);
    if (s.note) scan(s.note);
  }
  extra.forEach(scan);
  return [...found].sort();
}

type DocInput = Omit<LegalDoc, "placeholders" | "version" | "effectiveDate" | "audience" | "acceptedAt" | "advocateNotes"> & {
  version?: string;
  effectiveDate?: string;
  audience?: LegalAudience;
  acceptedAt?: AcceptanceContext[];
  advocateNotes?: string[];
};

export function defineDoc(input: DocInput): LegalDoc {
  return {
    version: DRAFT_VERSION,
    effectiveDate: EFFECTIVE_DATE_PLACEHOLDER,
    audience: "public",
    acceptedAt: [],
    advocateNotes: [],
    ...input,
    placeholders: collectPlaceholders(input.sections, [input.summary]),
  };
}
