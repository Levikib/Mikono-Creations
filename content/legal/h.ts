import type { LegalSection } from "./types";
import { CONTACT_EMAIL } from "@/lib/site";

/** Short section builder. note is optional. */
export const sec = (id: string, heading: string, paragraphs: string[], list?: string[], note?: string): LegalSection => {
  const s: LegalSection = { id, heading, paragraphs };
  if (list) s.list = list;
  if (note) s.note = note;
  return s;
};

export const CONTACT_PARA =
  "You can reach us on WhatsApp or by phone on +254 724 592 115, our official business number, or by email at " + CONTACT_EMAIL + ".";
