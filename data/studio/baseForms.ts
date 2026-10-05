// Base forms. Real catalogue animals come from the catalogue at build time (lib/studio/catalogue.ts). These are the generic starting points.
import type { Opt } from "./option";

export interface BaseFormDef extends Opt {
  /** Show the body and features questions (markings, eyes, posture and so on). */
  features: boolean;
  /** Needs a short description because no catalogue photo exists. */
  describe: boolean;
}

const b = (id: string, label: string, help: string, icon: Opt["icon"], extra: Partial<BaseFormDef> = {}): BaseFormDef =>
  ({ id, label, help, icon, features: true, describe: true, impactsQuote: "high", ...extra });

export const genericBases: BaseFormDef[] = [
  b("new-animal", "A new animal", "An animal we do not show yet", "sparkle"),
  b("character", "A character or mascot", "From a drawing, a story or a brand. Only characters you may use", "lion"),
  b("pet", "A pet", "Made to look like your pet", "rabbit"),
  b("mythical", "A mythical creature", "A dragon, unicorn or something you imagine", "sparkle"),
  b("doll-new", "A doll", "A new doll design", "people"),
  b("wall-head", "A wall head", "A head to hang on a wall", "giraffe", { features: false }),
  b("accessory", "An accessory", "A bag, keyring or something to carry", "bag", { features: false }),
  b("bird", "A bird", "A bird of any kind", "sparkle"),
  b("sea", "A sea animal", "A fish, whale, turtle or another sea animal", "sparkle"),
  b("insect", "An insect", "A bee, butterfly or another small creature", "sparkle"),
  b("farm", "A farm animal", "A cow, goat, hen or another farm animal", "sparkle"),
  b("describe", "Other, tell us", "Something else, in your own words", "info", { pending: false }),
];

export const genericBaseById = (id: string) => genericBases.find((g) => g.id === id);
export const isGenericBase = (id: string) => !!genericBaseById(id);
/** Catalogue categories whose animals do not take the body and features questions. */
export const featureFreeCategories = ["wall-art"];
export const BASE_NOTE_MAX = 300;
export const BASE_HONEST = "A base is only a starting shape. We tell you if it can be crocheted the way you picture it.";
