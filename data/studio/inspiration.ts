// Inspiration and references. Photos are attached in WhatsApp: nothing is uploaded to this site.
import type { Opt } from "./option";

const o = (id: string, label: string, help: string, icon?: Opt["icon"]): Opt => ({ id, label, help, icon, impactsQuote: "none" });

export const MAX_PICKS = 12;
export const MAX_LINKS = 10;
export const MAX_PHOTOS = 20;
export const MAX_COLOUR_REFS = 12;
export const MAX_NOTES = 10;
/** Guard for any stored multi-select (draft sanity only). Nothing in the UI shows or enforces it. */
export const MAX_LIST = 40;
export const NOTE_MAX = 600;
export const COLOUR_REF_MAX = 160;

export const moods: Opt[] = [
  o("soft", "Soft and cuddly", "Gentle and huggable"),
  o("realistic", "Realistic", "Close to the real animal"),
  o("cartoon", "Cartoon style", "Simple and friendly"),
  o("tiny", "Tiny", "Small and neat"),
  o("chunky", "Chunky", "Round and sturdy"),
  o("calm", "Calm colours", "Soft, quiet colours"),
  o("bright", "Bright colours", "Bold, happy colours"),
  o("earthy", "Earthy", "Natural, warm tones"),
];

export const referenceKinds: Opt[] = [
  o("photos", "Photos or drawings", "You attach these in WhatsApp after your brief opens", "camera"),
  o("links", "Links", "Pinterest, Instagram, Google Photos or any web page", "arrow"),
  o("description", "A description", "Tell us the shape, face, ears and tail", "book"),
  o("catalogue", "Animals we already make", "Pin the ones you like or do not like", "yarn"),
  o("colours", "Colour references", "A ribbon, a room, a brand colour", "yarn"),
];

export const photoTips: string[] = [
  "Take photos in daylight, from the front, the side and the back.",
  "Photograph a drawing flat on a table.",
  "For a pet, add a close photo of the face and one of any markings.",
  "Please keep children out of the photos. Crop to the drawing or the pet.",
];

export const attachSteps = ["Tap the paperclip in WhatsApp", "Choose Gallery", "Pick your photos and send"];

export const LICENCE_TITLE = "Characters and logos";
export const LICENCE_NOTICE = "We can only make characters and logos you own or have permission to use.";
export const LICENCE_WHY = "Cartoon, film and brand characters belong to other people. Making a copy without a licence can break their rights, and it puts you and us at risk. If you are not sure, tell us and we will talk it through.";

/** Proof of rights for a logo or a character. Needed only when a logo, brand tag or character is part of the brief. */
export const rightsOptions: Opt[] = [
  o("own", "It is mine, or my organisation's", "We own the logo or character"),
  o("permission", "I have written permission", "I can show it if asked"),
  o("unsure", "I am not sure yet", "Please talk it through with me"),
  o("none", "Not applicable", "No logo or character"),
];

export const PHOTO_CONSENT = "I have the right to share these photos, and no child's face is in them.";
