// Analytics for the helpers, routed through lib/track.ts so consent rules apply. Never sends quiz answers.
import { track } from "@/lib/track";

export type HelperEvent =
  | "helper_start" | "helper_step" | "helper_result" | "helper_restart"
  | "helper_cta" | "helper_share" | "helper_family_change";

export type HelperTool = "gift_finder" | "size_finder" | "family_builder";

export function trackHelper(event: HelperEvent, tool: HelperTool, params: Record<string, string | number | boolean> = {}) {
  track(event, { tool, ...params });
}

/** Standard events that already exist. WhatsApp clicks and order sends keep their usual names. */
export function trackWhatsApp(tool: HelperTool, kind: "click" | "order", params: Record<string, string | number> = {}) {
  track(kind === "order" ? "whatsapp_order_submit" : "whatsapp_click", { location: tool, ...params });
}
