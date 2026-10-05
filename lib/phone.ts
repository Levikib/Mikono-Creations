// Forgiving phone input. Kenyan numbers in any usual form (07xx, 01xx, 020 landline, 7xx, 254..., +254...)
// and international numbers with a country code (+44..., 0044..., or the code typed without the plus).
// Spaces, hyphens, dots, brackets and slashes are ignored. A foreign number is accepted by E.164 shape (7 to 15 digits).
export type PhoneResult = { ok: true; e164: string; display: string } | { ok: false };

export function normalisePhone(input: string): PhoneResult {
  const raw = (input ?? "").trim();
  if (!raw) return { ok: false };
  // Only digits and the usual separators are allowed. Letters mean it is not a number.
  if (/[^\d\s()+\-./]/.test(raw) || (raw.lastIndexOf("+") > 0)) return { ok: false };
  const plus = raw.startsWith("+");
  let digits = raw.replace(/\D/g, "");
  if (!plus && digits.startsWith("00")) digits = digits.slice(2);
  const explicit = plus || raw.replace(/\D/g, "").startsWith("00");

  const kenyan = (local: string): PhoneResult => {
    if (!/^[1-9]\d{8}$/.test(local)) return { ok: false };
    return { ok: true, e164: `+254${local}`, display: `+254 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}` };
  };
  if (digits.startsWith("254")) return digits.length === 12 ? kenyan(digits.slice(3)) : { ok: false };
  if (explicit) {
    // 0 is never the first digit of a country code.
    if (digits.length >= 7 && digits.length <= 15 && !digits.startsWith("0")) return { ok: true, e164: `+${digits}`, display: `+${digits}` };
    return { ok: false };
  }
  if (digits.length === 10 && digits.startsWith("0")) return kenyan(digits.slice(1));
  if (digits.length === 9) return kenyan(digits);
  // A country code typed without the plus, for example 447700900123.
  if (digits.length >= 10 && digits.length <= 15 && !digits.startsWith("0")) return { ok: true, e164: `+${digits}`, display: `+${digits}` };
  return { ok: false };
}
