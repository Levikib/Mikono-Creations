// Custom Studio data. No prices, lead times or feasibility promises live here (R7, charter rule 3).
// Everything marked pending is an owner decision, not a site promise. The files under data/studio/ hold the options;
// strategy/stage2/studio/DATA-MODEL.md lists every option and what the owner must confirm.
import type { StepId } from "@/lib/studio/types";

export * from "./studio/option";
export * from "./studio/labels";
export * from "./studio/sizes";
export * from "./studio/orderTypes";
export * from "./studio/baseForms";
export * from "./studio/features";
export * from "./studio/personalisation";
export * from "./studio/inspiration";
export * from "./studio/timing";
export * from "./studio/quantity";
export * from "./studio/delivery";
export * from "./studio/budget";
export * from "./studio/customer";
export * from "./studio/production";
export * from "./studio/consents";
export * from "./studio/summaryFields";
export * from "./studio/estimates";
export * from "./studio/payment";

export const STUDIO_PATH = "/custom/studio";
export const NOTE_PIECE_MAX = 300;
export const LABEL_MAX = 40;

/** Special values for the Nairobi area select, kept apart from real area names. */
export const AREA_PICKUP = "Pickup";

export const quickSteps: StepId[] = ["qidea", "qwhen", "qsend"];
export const fullSteps: StepId[] = ["who", "pieces", "look", "personal", "ideas", "timing", "delivery", "business", "production", "contact", "review"];

export const stepTitles: Record<StepId, string> = {
  qidea: "What would you like made?", qwhen: "When and where?", qsend: "Your details and send",
  who: "Who and what is it for?", pieces: "Your pieces", look: "Colours and features", personal: "Personal touches",
  ideas: "Show us what you imagine", timing: "Occasion and timing", delivery: "Delivery", business: "Business details",
  production: "Budget, payment and packaging", contact: "Your details", review: "Review and send",
};
export const stepShort: Record<StepId, string> = {
  qidea: "Idea", qwhen: "When", qsend: "Send", who: "For", pieces: "Pieces", look: "Look", personal: "Touches", ideas: "Ideas",
  timing: "Timing", delivery: "Delivery", business: "Business", production: "Pay", contact: "You", review: "Send",
};
export const stepHints: Partial<Record<StepId, string>> = {
  qidea: "Three quick steps. You can add more detail whenever you like.",
  who: "An adult fills this in. Everything stays on this device until you send.",
  pieces: "Add one piece, or several. Each piece can have its own size and count.",
  personal: "All optional. We confirm what is possible and the cost on WhatsApp.",
  ideas: "Optional. A rough idea is fine.",
  production: "Optional. A rough budget guide, how you would like to pay, and packaging. Nothing is paid on this page.",
  review: "Check everything, then send it to us on WhatsApp.",
  qsend: "Check your brief, then send it to us on WhatsApp.",
};
