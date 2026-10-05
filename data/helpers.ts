// Static copy and option lists for the three shopping helpers (gift finder, size finder, family builder).
// Facts about animals, colours and sizes are never written here: they are read from the catalogue at build time.
// Sizes are relative classes only (R5). No centimetre values, no age guidance, no safety claims (R9).

import type { ColourFamilyKey } from "./colours";

export const HELPER_TTL_HOURS = 24;
export const HELPER_STORE_KEY = "mk.helpers.v1";
export const FAMILY_MAX_LINES = 24;
export const FAMILY_MAX_QTY = 200;
export const PRICE_NOTE = "Set prices are confirmed on WhatsApp.";

export type Option<V extends string = string> = { value: V; label: string; hint?: string };

export const OTHER_VALUE = "other";
export const OTHER_LABEL = "Other, tell us";
export const OTHER_TEXT_MAX = 80;

/** Broad groups only. Never a name or an exact age. */
export const WHO: Option[] = [
  { value: "baby", label: "A baby" },
  { value: "toddler", label: "A toddler" },
  { value: "child", label: "A child" },
  { value: "teen", label: "A teenager" },
  { value: "adult", label: "An adult" },
  { value: "elder", label: "An older person" },
  { value: "friend", label: "A friend" },
  { value: "family", label: "Family" },
  { value: "colleague", label: "A colleague or client" },
  { value: "teacher", label: "A teacher or a team" },
  { value: "group", label: "A group or a class" },
  { value: "myself", label: "Myself" },
  { value: "collector", label: "A collector" },
  { value: OTHER_VALUE, label: OTHER_LABEL },
];

export const OCCASIONS: Option[] = [
  { value: "birthday", label: "Birthday" },
  { value: "baby-shower", label: "Baby shower" },
  { value: "new-baby", label: "New baby" },
  { value: "naming-ceremony", label: "Naming ceremony" },
  { value: "wedding", label: "Wedding" },
  { value: "engagement", label: "Engagement" },
  { value: "cultural-ceremony", label: "Traditional or cultural ceremony", hint: "For example ruracio or dowry, or another" },
  { value: "graduation", label: "Graduation" },
  { value: "new-home", label: "New home" },
  { value: "anniversary", label: "Anniversary" },
  { value: "retirement", label: "Retirement" },
  { value: "christmas", label: "Christmas" },
  { value: "easter", label: "Easter" },
  { value: "eid", label: "Eid" },
  { value: "diwali", label: "Diwali" },
  { value: "mothers-day", label: "Mother's Day" },
  { value: "fathers-day", label: "Father's Day" },
  { value: "valentines", label: "Valentine's Day" },
  { value: "madaraka-day", label: "Madaraka Day" },
  { value: "mashujaa-day", label: "Mashujaa Day" },
  { value: "jamhuri-day", label: "Jamhuri Day" },
  { value: "get-well", label: "Get well" },
  { value: "sympathy", label: "Sympathy" },
  { value: "thank-you", label: "Thank you" },
  { value: "school-event", label: "School event" },
  { value: "corporate-event", label: "Corporate event" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "just-because", label: "Just because" },
  { value: OTHER_VALUE, label: OTHER_LABEL },
];

export type KindKey = "safari" | "pets" | "sea" | "air" | "wall" | "dolls" | "more" | "surprise";
export const KINDS: { value: KindKey | "other"; label: string }[] = [
  { value: "safari", label: "Safari animals" },
  { value: "pets", label: "Farm and pets" },
  { value: "sea", label: "Sea animals" },
  { value: "air", label: "Birds and insects" },
  { value: "wall", label: "Wall art" },
  { value: "dolls", label: "Dolls" },
  { value: "more", label: "More animals" },
  { value: "surprise", label: "Surprise me" },
  { value: OTHER_VALUE, label: OTHER_LABEL },
];

/** Which published animals sit in which group. Anything not listed is "other" and only appears under Surprise me. */
export const GROUP_BY_SLUG: Record<string, "safari" | "pets" | "sea" | "air" | "wall" | "dolls" | "other"> = {
  elephant: "safari", giraffe: "safari", lion: "safari", rhino: "safari", zebra: "safari", hippo: "safari", monkey: "safari",
  rabbit: "pets", cat: "pets", dog: "pets", goose: "pets",
  octopus: "sea", shark: "sea", turtle: "sea",
  butterfly: "air",
  bear: "other", chameleon: "other", dinosaur: "other", "lion-head-handbag": "other",
  "unicorn-wall-head": "wall", "zebra-wall-head": "wall", "warthog-wall-head": "wall", "giraffe-wall-head": "wall", "lion-wall-head": "wall",
  "elephant-wall-head": "wall", "hippo-wall-head": "wall", "rhino-wall-head": "wall", "secretary-bird-wall-head": "wall",
  doll: "dolls", "dress-doll": "dolls",
};

/** Every catalogue product is offered in the helpers (wall art, dolls and bags too). Add a slug here only to hide one. */
export const NOT_IN_HELPERS = new Set<string>();

export const SIZE_FEEL: Option[] = [
  { value: "S", label: "Small", hint: "The smallest size in the range" },
  { value: "M", label: "Medium", hint: "One step up from Small" },
  { value: "L", label: "Large", hint: "One step up from Medium" },
  { value: "XL", label: "Extra large", hint: "The largest size in the range" },
  { value: "any", label: "Not sure, help me choose", hint: "We will show Medium. You can change it" },
  { value: OTHER_VALUE, label: "Other size, tell us" },
];

export type Mood = { value: ColourFamilyKey | "any" | "other"; label: string; hint: string; swatch?: [slug: string, colourKey: string] };
export const MOODS: Mood[] = [
  { value: "neutral", label: "Soft neutrals", hint: "Greys, creams and whites", swatch: ["elephant", "grey"] },
  { value: "brown", label: "Warm browns", hint: "Browns and tans", swatch: ["lion", "tan-brown-mane"] },
  { value: "yellow", label: "Sunny yellows", hint: "Yellows and oranges", swatch: ["giraffe", "orange"] },
  { value: "red", label: "Pinks and reds", hint: "Soft pinks to bold reds", swatch: ["butterfly", "red"] },
  { value: "green", label: "Fresh greens", hint: "Mint and green", swatch: ["turtle", "mint-cream"] },
  { value: "blue", label: "Cool blues and purples", hint: "Blues, lavender, purple", swatch: ["elephant", "slate-blue"] },
  { value: "multi", label: "Bright multicolour", hint: "More than one colour", swatch: ["octopus", "multicolour"] },
  { value: "any", label: "Any colour, surprise me", hint: "Show me what suits" },
  { value: "other", label: "Other colours, tell us", hint: "Any colour by name" },
];

/** Occasions and kinds can be combined: the gift finder lets people pick several. */
export const MAX_RECIPIENTS = 20;

export const SIZE_ORDER = ["S", "M", "L", "XL"] as const;

/** Comparison objects are drawn as pictures to help you imagine the steps. They are not measurements. */
export const SIZE_OBJECTS: { size: (typeof SIZE_ORDER)[number]; object: "hand" | "cushion" | "cushion-big" | "backpack"; word: string; line: string }[] = [
  { size: "S", object: "hand", word: "A hand", line: "The smallest step. Easy to carry about." },
  { size: "M", object: "cushion", word: "A small cushion", line: "One step up from Small." },
  { size: "L", object: "cushion-big", word: "A big cushion", line: "One step up from Medium." },
  { size: "XL", object: "backpack", word: "A backpack", line: "The largest step in the range." },
];
export const SIZE_OBJECTS_NOTE = "The objects are a way to picture the steps. They are not measurements, and we have not published centimetre sizes yet. Ask us on WhatsApp if you need one checked.";

export type UseKey = "cuddle" | "shelf" | "bedside" | "display";
export const SIZE_USES: { value: UseKey; label: string; hint: string; main: (typeof SIZE_ORDER)[number]; also: (typeof SIZE_ORDER)[number]; reason: string }[] = [
  { value: "cuddle", label: "A gift to cuddle", hint: "Something to hold", main: "L", also: "XL",
    reason: "A larger animal gives you more to hold, so Large is a good place to start. Extra large is the biggest we make, for a real armful." },
  { value: "shelf", label: "For a shelf", hint: "Sits among other things", main: "S", also: "M",
    reason: "A smaller animal takes up less room beside books and frames. Small is the smallest, and Medium is one step up if you want it to stand out." },
  { value: "bedside", label: "For a bedside", hint: "Close to where you sleep", main: "M", also: "S",
    reason: "Medium is the middle step: bigger than Small, easier to place than Large. Pick Small if the space is tight." },
  { value: "display", label: "For a display", hint: "A feature in a room", main: "XL", also: "L",
    reason: "The largest sizes stand out across a room. Extra large is the biggest we make, and Large is one step down if you want a softer presence." },
];
