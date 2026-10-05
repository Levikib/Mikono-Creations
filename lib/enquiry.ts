// Shared send step for the wholesale and contact forms (D18, D22). Call from a click handler.
import { env } from "./env";
import { attribution, track, type LeadType } from "./track";
import { buildEnquiryMessage, copyText, generateRef, planEnquirySend, sourceFromAttribution, type SendPlan } from "./whatsapp";

export interface Sendable { ref: string; plan: SendPlan; numberSet: boolean }

export function sendEnquiry(o: {
  prefix: string; intro: string; fields: Array<[string, string | readonly string[] | undefined]>;
  consent: boolean; leadType: LeadType; extra?: Record<string, string | number>;
}): Sendable {
  const ref = generateRef(o.prefix);
  const number = env.whatsappNumber;
  const full = buildEnquiryMessage({
    intro: o.intro, ref, fields: o.fields, consentMarketing: o.consent,
    source: sourceFromAttribution(attribution()), siteUrl: env.siteUrl,
  });
  const plan = planEnquirySend(number, o.intro, ref, full);
  track("generate_lead", { lead_type: o.leadType, lead_ref: ref, ...(o.extra ?? {}) });
  void copyText(plan.fullText);
  if (plan.url) window.open(plan.url, "_blank", "noopener");
  return { ref, plan, numberSet: !!plan.url };
}
