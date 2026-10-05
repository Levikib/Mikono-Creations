// Legal pack index. DRAFT for review by a Kenyan advocate. Not legal advice.
import type { LegalDoc } from "./types";
import { termsOfSale } from "./terms-of-sale";
import { customOrderTerms } from "./custom-order-terms";
import { wholesaleTerms } from "./wholesale-terms";
import { websiteTerms } from "./website-terms";
import { privacyPolicy } from "./privacy";
import { cookiePolicy } from "./cookies";
import { returnsPolicy } from "./returns";
import { deliveryPolicy } from "./delivery";
import { safetyNotice } from "./safety-notice";
import { ipNotice } from "./ip-takedown";
import { accessibilityStatement } from "./accessibility";
import { complaintsProcedure } from "./complaints";
import { dataRequest } from "./data-request";
import { marketingTerms } from "./marketing";
import { photoConsent } from "./photo-consent";
import { stockistPermission } from "./stockist-permission";

export const documents: LegalDoc[] = [
  termsOfSale, customOrderTerms, wholesaleTerms, websiteTerms, privacyPolicy, cookiePolicy, returnsPolicy,
  deliveryPolicy, safetyNotice, ipNotice, accessibilityStatement, complaintsProcedure, dataRequest,
  marketingTerms, photoConsent, stockistPermission,
];

export const publicDocuments = documents.filter((d) => d.audience === "public");
export const getDoc = (slug: string): LegalDoc | undefined => documents.find((d) => d.slug === slug);
export const allPlaceholders = (): string[] => [...new Set(documents.flatMap((d) => d.placeholders))].sort();

export * from "./types";
export * from "./acceptance";

export {
  termsOfSale, customOrderTerms, wholesaleTerms, websiteTerms, privacyPolicy, cookiePolicy, returnsPolicy, deliveryPolicy,
  safetyNotice, ipNotice, accessibilityStatement, complaintsProcedure, dataRequest, marketingTerms,
};
