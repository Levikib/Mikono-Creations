import type { ColourFamilyKey } from "@/data/colours";

export type SizeKey = "S" | "M" | "L" | "XL";
export type GroupKey = "safari" | "pets" | "sea" | "air" | "wall" | "dolls" | "other";

export type HelperImage = { src: string; alt: string; focal: [number, number]; w: number; h: number; multiply: boolean };
export type HelperColour = { key: string; label: string; family: ColourFamilyKey; image: HelperImage };

/** Plain, serialisable animal record that the server hands to the client helpers. Built from the real catalogue. */
export type HelperAnimal = {
  slug: string;
  name: string;
  categoryLabel: string;
  group: GroupKey;
  /** True for animals shown only in group photos: the colour is confirmed on WhatsApp. */
  colourAsk: boolean;
  colours: HelperColour[];
  sizes: SizeKey[];
};

/** Each answer can hold several choices. A single string is still accepted by the recommender. */
export type Many = string | string[];
export type GiftAnswers = {
  who?: Many; occasion?: Many; kind?: Many; size?: Many; mood?: Many;
  /** What the person typed for "Other, tell us", by question. Short and free. Never a name or an age. */
  other?: { who?: string; occasion?: string; kind?: string; size?: string; mood?: string };
};

/** One person being shopped for. The label is a number, never a name. */
export type Recipient = { id: string; answers: GiftAnswers };

export type GiftPick = {
  animal: HelperAnimal;
  colour: HelperColour;
  size: SizeKey;
  reasons: string[];
  score: number;
};

export type FamilyLine = { slug: string; colourKey: string; size: SizeKey; qty: number };
