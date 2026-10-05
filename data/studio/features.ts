// Body and features. Colours come from the real yarn colours (data/colours.ts and the catalogue colourways) at build time.
// The owner offers every one of these. If something cannot be done exactly, the Studio says we tell the customer before we start (EXACT_LINE).
import type { Opt } from "./option";

const o = (id: string, label: string, help: string, impactsQuote: Opt["impactsQuote"] = "low", icon?: Opt["icon"]): Opt =>
  ({ id, label, help, icon, impactsQuote });

export const MAX_COLOURS = 12;
export const colourCounts = [1, 2, 3, 4, 5] as const;

export const markings: Opt[] = [
  o("stripes", "Stripes", "Bands of colour on the body"),
  o("spots", "Spots", "Dots or patches of spots"),
  o("patches", "Patches", "Larger patches of a second colour", "low"),
  o("mane", "Mane", "A mane around the head or neck", "medium"),
  o("tail", "Tail detail", "A tail with a tip or tuft", "low"),
  o("ears", "Ear detail", "Inner ear colour or a special ear shape", "low"),
  o("horns", "Horns", "One or two horns", "medium"),
  o("tusks", "Tusks", "Tusks for an elephant or similar", "medium"),
  o("belly", "Belly colour", "A lighter or different belly", "low"),
  o("none", "Plain, no markings", "One simple look", "none"),
];

export const eyeStyles: Opt[] = [
  o("round-black", "Round and dark", "Simple dark round eyes"),
  o("stitched", "Stitched", "Eyes stitched in yarn", "low"),
  o("sleepy", "Sleepy", "Half closed and calm", "low"),
  o("coloured", "A colour I choose", "Say which colour in the notes", "low"),
  o("as-photo", "Like my photo", "Match the eyes in the photo", "low"),
];

export const noseStyles: Opt[] = [
  o("small", "Small and neat", "A small nose"),
  o("big", "Big and round", "A bold nose"),
  o("snout", "A snout or muzzle", "A raised muzzle area"),
  o("none", "No nose", "A flat, simple face", "none"),
  o("as-photo", "Like my photo", "Match the nose in the photo"),
];

export const expressions: Opt[] = [
  o("smiling", "Smiling", "A gentle smile", "none"),
  o("calm", "Calm", "A relaxed face", "none"),
  o("sleepy", "Sleepy", "Eyes half closed", "none"),
  o("cheeky", "Cheeky", "A bit of mischief", "none"),
  o("serious", "Serious", "A steady look", "none"),
];

export const textures: Opt[] = [
  o("smooth", "Smooth stitch", "Neat, flat crochet", "none"),
  o("fringe-mane", "Fringe mane", "A mane made of fringe", "medium"),
  o("fluffy", "Fluffy yarn", "A softer, fluffier yarn where it can be done", "medium"),
  o("ribbed", "Ribbed", "Raised lines in the stitch", "low"),
  o("bobble", "Bobbles", "Small raised bobbles", "low"),
];

export const postures: Opt[] = [
  o("sitting", "Sitting", "Sits on a shelf or bed", "none"),
  o("standing", "Standing", "Stands on four feet", "low"),
  o("lying", "Lying down", "Rests flat", "low"),
  o("either", "No preference", "We suggest what suits the animal", "none"),
];

export const hangingLoop: Opt[] = [
  o("yes", "Add a hanging loop", "A loop to hang it by", "low"),
  o("no", "No loop", "Leave it plain", "none"),
];

export const UNIQUE_MAX = 300;
export const UNIQUE_HINT = "Anything that makes it yours: a scar, a patch, a missing ear, a favourite colour. Please do not include a child's name, age or school.";
