// Payment preferences. Timing is one choice. Methods are an optional list with Other. Nothing is paid on this site.
// Methods stay "to be confirmed" because the till or paybill is not set up yet. The deposit amount is confirmed in the quote.
import type { Opt } from "./option";

/** Placeholder until the owner sets the deposit. The site never shows a percentage. */
export const DEPOSIT_PERCENT_PLACEHOLDER: number | null = null;
export const DEPOSIT_WORDING = "a deposit, confirmed in your quote";
export const PAYMENT_NOTE = "Payment details and the deposit amount are confirmed on WhatsApp.";

export const paymentTiming: Opt[] = [
  { id: "full", label: "Pay on order (in full)", help: "Pay the whole amount when you confirm the quote", impactsQuote: "none" },
  { id: "deposit", label: "Pay a deposit now and the balance later", help: `We ask for ${DEPOSIT_WORDING}`, impactsQuote: "none" },
  { id: "pod", label: "Pay on delivery (POD)", help: "Pay when it reaches you", impactsQuote: "none" },
  { id: "pickup", label: "Pay on pickup", help: "Pay when you collect it", impactsQuote: "none" },
  { id: "suggest", label: "Not sure, let us suggest", help: "We suggest what suits your order", impactsQuote: "none" },
];

export const paymentMethods: Opt[] = [
  { id: "mobile-money", label: "Mobile money (M-Pesa or another mobile wallet)", help: "", pending: true, impactsQuote: "none" },
  { id: "bank", label: "Bank transfer", help: "", pending: true, impactsQuote: "none" },
  { id: "cash", label: "Cash on delivery or pickup", help: "", pending: true, impactsQuote: "none" },
  { id: "card", label: "Card, if available", help: "", pending: true, impactsQuote: "none" },
  { id: "other", label: "Other, tell us", help: "Another way you would like to pay", pending: true, impactsQuote: "none" },
];
export const PAYMENT_METHODS_TITLE = "How would you like to pay?";
export const PAYMENT_METHODS_NOTE = "The way to pay is not set up yet, so each method is to be confirmed on WhatsApp.";
export const PAYMENT_OTHER_MAX = 120;
