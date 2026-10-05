// Studio analytics (strategy/09 section 6). Wraps the shared track(). lib/track.ts types events as a closed union,
// and the Studio names live there. This wrapper adds a per page session id. Never pass free text, links,
// names, phone numbers or inspiration content.
import { track } from "../track";

export type StudioEvent =
  | "studio_view" | "studio_type_select" | "studio_inspiration_add" | "studio_base_select" | "studio_size_select"
  | "studio_colour_select" | "studio_detail_toggle" | "studio_quantity_set" | "studio_deadline_set" | "studio_budget_set"
  | "studio_contact_complete" | "studio_attach_instruction_view" | "studio_error" | "studio_abandon"
  | "wizard_step_complete" | "generate_lead" | "whatsapp_click";

let session = "";
/** Random per page load, never stored. */
export function studioSession(): string {
  if (!session) session = Math.random().toString(36).slice(2, 10);
  return session;
}

type Param = string | number | boolean | undefined;

export function studioTrack(event: StudioEvent, params: Record<string, Param> = {}) {
  track(event, { studio_session: studioSession(), ...params });
}

export const qtyBand = (n: number) => (n <= 1 ? "1" : n <= 5 ? "2 to 5" : n <= 19 ? "6 to 19" : n <= 99 ? "20 to 99" : "100 plus");
export const daysBand = (d: number) => (d <= 14 ? "0 to 14" : d <= 30 ? "15 to 30" : d <= 60 ? "31 to 60" : "61 plus");
