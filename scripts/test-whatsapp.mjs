// Tests for the WhatsApp message builder (order message v2), ref generator and phone normaliser.
// Imports the project's TypeScript sources through the alias loader, like the other test scripts.
import { register } from "node:module";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

register("./alias-loader.mjs", new URL("./", import.meta.url));
const root = new URL("..", import.meta.url).href;
const imp = (p) => import(new URL(p, root).href);
const { normalisePhone } = await imp("lib/phone.ts");
const W = await imp("lib/whatsapp.ts");
const F = await imp("lib/orderForm.ts");
const C = await imp("data/consent.ts");
const CK = await imp("data/checkout.ts");
const API = await imp("lib/orderApi.ts");

let pass = 0;
const t = (name, fn) => { fn(); pass++; console.log(`ok  ${name}`); };

// Phone
const e164 = (s) => { const r = normalisePhone(s); return r.ok ? r.e164 : null; };
t("phone 07 format", () => assert.equal(e164("0712 345 678"), "+254712345678"));
t("phone 01 format", () => assert.equal(e164("0112-345-678"), "+254112345678"));
t("phone +254", () => assert.equal(e164("+254 712 345 678"), "+254712345678"));
t("phone 254 without plus", () => assert.equal(e164("254712345678"), "+254712345678"));
t("phone 00254", () => assert.equal(e164("00254712345678"), "+254712345678"));
t("phone nine digits", () => assert.equal(e164("712345678"), "+254712345678"));
t("phone brackets and dots", () => assert.equal(e164("(0712) 345.678"), "+254712345678"));
t("phone rejects short", () => assert.equal(e164("0712 345"), null));
t("phone accepts a Kenyan landline such as 051 (Nakuru) and 020 (Nairobi)", () => { assert.equal(e164("051 2345678"), "+254512345678"); assert.equal(e164("020 234 5678"), "+254202345678"); });
t("phone rejects a too short local number", () => assert.equal(e164("0512345"), null));
t("phone rejects letters", () => assert.equal(e164("abc"), null));
t("phone accepts foreign +", () => assert.equal(e164("+44 7911 123456"), "+447911123456"));
t("phone accepts foreign numbers in the usual shapes (diaspora)", () => {
  assert.equal(e164("+1 (415) 555-2671"), "+14155552671"); assert.equal(e164("0044 7911 123456"), "+447911123456"); assert.equal(e164("447911123456"), "+447911123456");
  assert.equal(e164("+49 30 901820"), "+4930901820"); assert.equal(e164("+971 50 123 4567"), "+971501234567"); assert.equal(e164("+61 412 345 678"), "+61412345678");
  assert.equal(e164("+255 712 345 678"), "+255712345678", "Tanzania");
});
t("phone rejects things that are not numbers", () => { for (const bad of ["+0712345678", "+44 77+00", "phone", "+1", "+123456789012345678"]) assert.equal(e164(bad), null, bad); });
t("phone rejects empty", () => assert.equal(e164(""), null));

// Ref
t("ref format and alphabet", () => {
  for (let i = 0; i < 200; i++) {
    const r = W.generateRef("MK");
    assert.match(r, /^MK-\d{6}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/);
  }
});
t("ref uses Nairobi date", () => {
  const r = W.generateRef("WS", new Date("2026-10-01T22:30:00Z"), () => new Uint8Array(8).fill(0));
  assert.equal(r, "WS-261002-2222");
});
t("ref skips biased bytes", () => {
  const r = W.generateRef("MK", new Date("2026-10-01T00:00:00Z"), () => new Uint8Array([255, 250, 0, 1, 2, 3, 30, 31]));
  assert.equal(r, "MK-261001-2345");
});

// Message v2
const consent = (over = {}) => ({ whatsapp: false, email: false, occasion: false, terms: true, termsVersion: "x", acceptedLine: "Accepted: terms-of-sale v0.1-draft, privacy-policy v0.1-draft on 2026-10-03 14:05 EAT", version: C.CONSENT_VERSION, ...over });
const base = {
  ref: "MK-261001-7KQ2",
  lines: [
    { sku: "elephant-sage-m", name: "Elephant", colourLabel: "Sage", size: "M", qty: 2, note: "No bow please" },
    { sku: "giraffe-ochre-s", name: "Giraffe", colourLabel: "Ochre", size: "S", qty: 1 },
  ],
  customerType: "A person buying for themselves or as a gift", name: "Amina Otieno", phone: "+254712345678", email: "amina@example.com",
  contactChannel: "WhatsApp", language: "English",
  paymentNote: "I can pay in the afternoon.", fulfilment: "nairobi", area: "Kilimani", landmark: "Argwings Kodhek Rd, Block C",
  dateWish: "2026-10-20", timeWindow: "Afternoon", callOnArrival: true,
  giftNote: "Happy birthday", anonymous: true, sendDirect: true,
  recipientName: "Wanjiru", recipientPhone: "+254722000111",
  notes: "Soft colours please.", consent: consent(),
};
const b2b = {
  ...base, customerType: "A shop or retailer", giftNote: undefined, anonymous: undefined, sendDirect: undefined, recipientName: undefined, recipientPhone: undefined,
  business: { businessName: "Savanna Gifts", businessType: "Gift shop", outletLocation: "Karen", volumeBand: "20 to 49 a month", invoiceName: "Savanna Gifts Ltd", kraPin: "A123456789B", poNumber: "PO-118" },
};
t("full message has all required parts", () => {
  const m = W.buildOrderMessage(base, "full");
  for (const s of ["Order ref: MK-261001-7KQ2", "1. 2 x Elephant, Sage, Medium, SKU elephant-sage-m", "   Note: No bow please", "2. 1 x Giraffe, Ochre, Small, SKU giraffe-ochre-s",
    "Name: Amina Otieno", "Phone: +254712345678", "Reach me by: WhatsApp", "Language: English", "Area: Kilimani", "Landmark: Argwings Kodhek Rd, Block C", "Delivery fee: to be confirmed",
    "Date wish: 2026-10-20, afternoon", "Call me on arrival: yes", "Receiving adult: Wanjiru, +254722000111", "Do not say who it is from: yes",
    "We arrange payment with you on WhatsApp.", "Payment note: I can pay in the afternoon.", "Soft colours please.", W.PRICES_DELIVERY_SENTENCE]) {
    assert.ok(m.includes(s), `missing: ${s}`);
  }
});
t("sections are readable plain text with blank lines between them", () => {
  const m = W.buildOrderMessage(base, "full");
  for (const h of ["ITEMS", "CUSTOMER", "DELIVERY", "GIFT", "PAYMENT", "NOTES", "CONSENT"]) assert.ok(new RegExp(`\\n\\n${h}\\n`).test(m), h);
  assert.ok(!/[\u{1F300}-\u{1FAFF}]/u.test(m), "no emoji");
});
t("payment is arranged on WhatsApp, no named methods, no cash on delivery, no gift wrapping", () => {
  const m = W.buildOrderMessage({ ...base, paymentNote: undefined }, "full");
  assert.ok(m.includes("We arrange payment with you on WhatsApp."));
  assert.ok(!m.includes("Payment note:"));
  assert.ok(!/cash|wrapping|m-pesa|mpesa|bank transfer/i.test(W.buildOrderMessage(base, "full")));
});
t("colour to be confirmed reads clearly", () => {
  const m = W.buildOrderMessage({ ...base, lines: [{ sku: "shark-ask-s", name: "Shark", colourLabel: "Colour to confirm", size: "S", qty: 1 }] }, "full");
  assert.ok(m.includes("1. 1 x Shark, Colour to confirm, Small"));
});
t("no Source line without attribution", () => assert.ok(!W.buildOrderMessage(base, "full").includes("Source:")));
t("Source line from UTM when present", () => {
  const src = W.sourceFromAttribution({ utm_source: "instagram", utm_medium: "paid", utm_campaign: "xmas-2026" });
  assert.equal(src, "instagram / paid / xmas-2026");
  assert.ok(W.buildOrderMessage({ ...base, source: src }, "full").includes("Source: instagram / paid / xmas-2026"));
});
t("B2B block appears for a business and holds the KRA PIN", () => {
  const m = W.buildOrderMessage(b2b, "full");
  for (const s of ["\nBUSINESS\n", "Business: Savanna Gifts (Gift shop)", "Outlet: Karen", "Volume: 20 to 49 a month", "Invoice name: Savanna Gifts Ltd", "KRA PIN: A123456789B", "PO number: PO-118"]) assert.ok(m.includes(s), s);
});
t("no B2B block for a private buyer", () => {
  const m = W.buildOrderMessage(base, "full");
  assert.ok(!m.includes("BUSINESS") && !m.includes("KRA PIN"));
});
t("KRA PIN is kept in the compact message too", () => assert.ok(W.buildOrderMessage(b2b, "compact").includes("KRA PIN: A123456789B")));
t("consent summary line says what the customer opted in to", () => {
  assert.ok(W.buildOrderMessage(base, "full").includes("Marketing opt-ins: none"));
  const m = W.buildOrderMessage({ ...base, consent: consent({ whatsapp: true, email: true, occasion: true, occasionText: "Christmas, 20 December" }) }, "full");
  assert.ok(m.includes("Marketing opt-ins: WhatsApp updates, Newsletter by email, Occasion reminder"));
  assert.ok(m.includes("Occasion: Christmas, 20 December"));
  assert.ok(m.includes("Accepted: terms-of-sale v0.1-draft, privacy-policy v0.1-draft on 2026-10-03 14:05 EAT") && m.includes(`Consent text version: ${C.CONSENT_VERSION}`));
});
t("consent summary is in every level, including short", () => {
  for (const lv of ["full", "compact", "short"]) assert.ok(W.buildOrderMessage({ ...base, consent: consent({ whatsapp: true }) }, lv).includes("Marketing opt-ins: WhatsApp updates"), lv);
});
t("optional About me block appears only when filled", () => {
  assert.ok(!W.buildOrderMessage(base, "full").includes("ABOUT ME"));
  const m = W.buildOrderMessage({ ...base, about: { occasions: ["Birthday, 12 March", "Christmas, 20 December"], interests: ["Safari animals"], heardFrom: "Instagram, A shop or stockist" } }, "full");
  assert.ok(m.includes("Help us suggest: Birthday, Christmas; likes Safari animals") && m.includes("Heard about us: Instagram, A shop or stockist"));
});
t("prices and delivery sentence is present", () => assert.ok(W.buildOrderMessage(base, "full").includes("Prices and delivery are confirmed on WhatsApp.")));
t("adult only recipient fields: an adult name and phone, nothing about a child", () => {
  const m = W.buildOrderMessage(base, "full");
  assert.ok(m.includes("Receiving adult: Wanjiru, +254722000111"));
  const form = Object.keys(F.emptyForm).join(" ").toLowerCase();
  for (const bad of ["age", "birthday", "school", "child", "parent", "dob", "firstname"]) assert.ok(!new RegExp(`(^|\\s)\\w*${bad}\\w*(\\s|$)`).test(form.replace("language", "lang").replace("message", "msg").replace("package", "pkg").replace("manage", "mng")), `form field: ${bad}`);
});
t("templates and option lists carry no child data keywords", () => {
  const srcs = ["lib/whatsapp.ts", "lib/orderForm.ts", "data/checkout.ts", "data/consent.ts", "lib/orderApi.ts", "lib/orderPayload.ts"].map((f) => readFileSync(new URL(f, root), "utf8"));
  // Only the hint sentences may name these words, and only to say "do not".
  for (const src of srcs) {
    for (const line of src.split("\n")) {
      if (!/\b(age|school|parent|birthday of|child's name|date of birth)\b/i.test(line)) continue;
      assert.ok(/do not|never|no (child|name|year)|not add|without|only generic|organisation|School\b|school: |"school"|Birthday|\/\/|\*/i.test(line), `suspect line: ${line.trim()}`);
    }
  }
  const w = W.buildOrderMessage(b2b, "full") + W.buildOrderMessage(base, "full");
  assert.ok(!/\b(age|school|birthday of|parent|date of birth)\b/i.test(w.replace("Birthday", "")), "message text");
});
t("customer types: the inclusive list, the first six values still exist, Other is last, no parent", () => {
  const v = CK.customerTypes.map((c) => c.value);
  for (const x of ["personal", "shop", "lodge", "school", "corporate", "other"]) assert.ok(v.includes(x), x);
  for (const x of ["gift", "family", "diaspora", "collector", "teacher", "health", "faith", "community", "ngo", "restaurant", "wholesale", "planner", "government"]) assert.ok(v.includes(x), x);
  assert.equal(v.at(-1), "other"); assert.equal(CK.customerTypes.find((c) => c.value === "other").label, "Other, tell us");
  assert.ok(!JSON.stringify(CK).toLowerCase().includes("parent"));
  assert.equal(CK.customerTypesLabel(["personal", "other"], "Book club"), "An individual; Other: Book club");
  assert.ok(CK.isB2b(["faith"]) && !CK.isB2b(["family", "diaspora"]));
});
t("compact is shorter than full", () => assert.ok(W.buildOrderMessage(base, "compact").length < W.buildOrderMessage(base, "full").length));
t("short has ref, name, phone and the opt-in line only", () => {
  const m = W.buildOrderMessage(base, "short");
  assert.ok(m.includes("MK-261001-7KQ2") && m.includes("Amina Otieno") && m.includes("+254712345678") && m.includes("Marketing opt-ins"));
  assert.ok(!m.includes("ITEMS"));
});
t("control characters and blank runs are cleaned", () => {
  const m = W.buildOrderMessage({ ...base, notes: "a\u0000b\n\n\n\n\nc" }, "full");
  assert.ok(m.includes("ab\n\nc"));
});
t("no em or en dashes in any message level", () => {
  for (const lv of ["full", "compact", "short"]) assert.ok(!/[\u2013\u2014]/.test(W.buildOrderMessage(b2b, lv)), lv);
});

// Split delivery message
const drops3 = [
  { label: "Karen", fulfilment: "nairobi", area: "Karen", landmark: "Gate 3", recipientName: "Joy K", recipientPhone: "+254722000111", giftNote: "Happy birthday", items: [{ sku: "elephant-sage-m", name: "Elephant", colourLabel: "Sage", size: "M", qty: 1 }] },
  { label: "Naivasha, Nakuru", fulfilment: "town", town: "Naivasha", county: "Nakuru", recipientName: "Wanjiru", recipientPhone: "+254733000222", items: [{ sku: "elephant-sage-m", name: "Elephant", colourLabel: "Sage", size: "M", qty: 1 }, { sku: "giraffe-ochre-s", name: "Giraffe", colourLabel: "Ochre", size: "S", qty: 1 }] },
  { label: "Kilimani", fulfilment: "nairobi", area: "Other Nairobi area", areaOther: "Lenana Road", landmark: "Blue gate", recipientName: "Peter", recipientPhone: "+254744000333", items: [] },
];
const split = { ...base, giftNote: undefined, sendDirect: undefined, recipientName: undefined, recipientPhone: undefined, drops: drops3 };
t("split delivery lists every place with its adult, gift note and items", () => {
  const m = W.buildOrderMessage(split, "full");
  for (const s of ["DELIVERY: 3 places", "PLACE 1 OF 3", "PLACE 2 OF 3", "PLACE 3 OF 3", "Receiving adult: Joy K, +254722000111", "Receiving adult: Wanjiru, +254733000222", "Receiving adult: Peter, +254744000333",
    'Gift note: "Happy birthday"', "Town: Naivasha, Nakuru county", "Area: Lenana Road", "Items for this place:", "- 1 x Giraffe, Ochre, Small, SKU giraffe-ochre-s", "Delivery fee: to be confirmed for each place"]) assert.ok(m.includes(s), s);
  assert.ok(!/\nDelivery fee: to be confirmed\n/.test(m) || m.includes("for each place"));
});
t("split delivery compact keeps all places, with short item lines", () => {
  const m = W.buildOrderMessage(split, "compact");
  assert.ok(m.includes("PLACE 3 OF 3") && m.includes("- 1x giraffe-ochre-s"));
  assert.ok(m.length < W.buildOrderMessage(split, "full").length);
});
t("single place orders keep the single DELIVERY block", () => {
  const m = W.buildOrderMessage(base, "full");
  assert.ok(m.includes("\nDELIVERY\n") && !m.includes("PLACE 1 OF"));
});
t("sizes are words in messages and the SKU codes stay", () => {
  const m = W.buildOrderMessage(base, "full");
  assert.ok(m.includes("Medium") && m.includes("elephant-sage-m") && !/, size [SMLX]/.test(m));
  const S = ["S","M","L","XL"].map((x) => W.buildOrderMessage({ ...base, lines: [{ sku: "a-b-" + x.toLowerCase(), name: "A", colourLabel: "B", size: x, qty: 1 }] }, "full"));
  assert.ok(S[0].includes(", Small, SKU") && S[1].includes(", Medium, SKU") && S[2].includes(", Large, SKU") && S[3].includes(", Extra large, SKU a-b-xl"));
});
t("several customer types and contact channels are listed", () => {
  const m = W.buildOrderMessage({ ...base, customerType: "A person buying for themselves or as a gift; A company or corporate gift", contactChannel: "WhatsApp, Phone call", contactHours: "Evening" }, "full");
  assert.ok(m.includes("Type: A person buying for themselves or as a gift; A company or corporate gift") && m.includes("Reach me by: WhatsApp, Phone call, evening"));
});

// URL
t("wa url digits only", () => {
  const u = W.buildWaUrl("+254 700-000 000", "hi there");
  assert.equal(u, "https://wa.me/254700000000?text=hi%20there");
});
t("wa url null when number unset", () => assert.equal(W.buildWaUrl("", "x"), null));
t("plan keeps full when short", () => {
  const p = W.planOrderSend("254700000000", base);
  assert.equal(p.level, "full");
  assert.ok(p.url.length <= W.URL_BUDGET);
});
const long = (n, over = {}) => ({ ...b2b, notes: "x".repeat(100), lines: Array.from({ length: n }, (_, i) => ({ sku: `hippopotamus-soft-grey-${i}-m`, name: "Hippopotamus", colourLabel: "Soft grey", size: "M", qty: 3, note: "n".repeat(20) })), ...over });
t("level fallback: full, then compact, then short, each inside the URL budget", () => {
  const a = W.planOrderSend("254700000000", long(3));
  assert.equal(a.level, "full");
  const b = W.planOrderSend("254700000000", long(8));
  assert.equal(b.level, "compact", `got ${b.level}`);
  assert.ok(b.url.length <= W.URL_BUDGET && b.pasteRest === true);
  const c = W.planOrderSend("254700000000", long(40));
  assert.equal(c.level, "short");
  assert.ok(c.url.length <= W.URL_BUDGET && c.pasteRest === true);
  for (const p of [a, b, c]) assert.equal(p.fullText, W.buildOrderMessage(long(p === a ? 3 : p === b ? 8 : 40), "full"), "the full text is always kept for copying");
});
t("short level still carries the opt-in line, and the full text keeps the KRA PIN for the copy fallback", () => {
  const c = W.planOrderSend("254700000000", long(40, { consent: consent({ email: true }) }));
  assert.ok(c.text.includes("Marketing opt-ins: Newsletter by email"));
  assert.ok(c.fullText.includes("KRA PIN: A123456789B"));
});
t("plan without number has no url but full text", () => {
  const p = W.planOrderSend("", base);
  assert.equal(p.url, null);
  assert.equal(p.level, "full");
});
t("enquiry message", () => {
  const m = W.buildEnquiryMessage({ intro: "Hello Mikono Creations, wholesale request.", ref: "WS-261001-4HM9", consentMarketing: true,
    fields: [["Business", "Giraffe Gifts"], ["Notes", ""], ["Phone", "+254712345678"]] });
  assert.ok(m.includes("Ref: WS-261001-4HM9") && m.includes("Business: Giraffe Gifts") && !m.includes("Notes:"));
  assert.ok(m.includes("Marketing messages: Yes"));
  assert.ok(!/KES|price:/i.test(m));
});

// Storage and order form
const mem = new Map();
globalThis.window = { localStorage: { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) } };
t("the KRA PIN is in the message but never in a draft", () => {
  const form = { ...F.emptyForm, customerTypes: ["shop"], name: "Amina", phone: "0712345678", businessName: "Savanna Gifts", kraPin: "A123456789B", paymentNote: "x" };
  const ticks = { ...F.noTicks, terms_acknowledged: true };
  const msg = F.toOrderMsg(form, [{ sku: "a-b-s", name: "A", colourLabel: "B", size: "S", qty: 1 }], "MK-261001-AAAA", ticks, "", "", C.CONSENT_VERSION);
  assert.ok(W.buildOrderMessage(msg, "full").includes("KRA PIN: A123456789B"));
  const full = W.buildOrderMessage(msg, "full");
  F.writeDraft({ step: "review", skipGift: false, skipAbout: false, form, ref: "MK-261001-AAAA", sent: { message: full, text: full, level: "full", at: 1 } });
  const raw = mem.get(F.DRAFT_KEY);
  assert.ok(raw && !raw.includes("A123456789B") && !raw.includes("kraPin"), "draft has no PIN");
  const back = F.readDraft();
  assert.equal(back.form.kraPin, "");
});
t("the draft never stores consent boxes or the terms tick", () => {
  F.writeDraft({ step: "review", skipGift: false, skipAbout: false, form: F.emptyForm });
  const raw = mem.get(F.DRAFT_KEY);
  for (const bad of ["whatsapp_updates", "email_newsletter", "occasion_reminders", "terms_acknowledged", "consent"]) assert.ok(!raw.includes(bad), bad);
});
t("the stage 2 hook is a no-op: no network call in the file", () => {
  const src = readFileSync(new URL("lib/orderApi.ts", root), "utf8").split("\n").filter((l) => !/^\s*(\/\/|\/\*|\*)/.test(l)).join("\n");
  assert.ok(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/.test(src));
  assert.equal(API.PERSIST_ENABLED, false);
});
t("the stage 2 hook resolves without persisting", async () => {
  assert.equal(await API.orderApi.reserveRef(), null);
  assert.deepEqual(await API.orderApi.submitOrder({}), { persisted: false });
});


// ---- the largest orders: MAX_LINES cart lines of MAX_QTY_PER_LINE, MAX_RECIPIENTS places ----
const { MAX_LINES, MAX_QTY_PER_LINE } = await imp("lib/site.ts");
const SPLIT = await imp("lib/split.ts");
const bigLines = Array.from({ length: MAX_LINES }, (_, i) => ({ sku: `animal${i}-colour${i}-m`, name: `Animal ${i + 1}`, colourLabel: `Colour ${i + 1}`, size: "M", qty: MAX_QTY_PER_LINE, note: i % 7 === 0 ? "Please wrap it plainly" : undefined }));
t("the largest cart (MAX_LINES lines of MAX_QTY_PER_LINE): full and compact name every line, one line each", () => {
  assert.equal(MAX_LINES, 100);
  const o = { ...base, lines: bigLines };
  const full = W.buildOrderMessage(o, "full"); const compact = W.buildOrderMessage(o, "compact");
  for (let i = 1; i <= MAX_LINES; i++) { assert.ok(full.includes(`\n${i}. ${MAX_QTY_PER_LINE} x Animal ${i}, Colour ${i}, Medium, SKU animal${i - 1}-colour${i - 1}-m`), `full ${i}`); assert.ok(compact.includes(`\n${i}. ${MAX_QTY_PER_LINE}x animal${i - 1}-colour${i - 1}-m`), `compact ${i}`); }
  assert.ok(compact.length < full.length);
});
t("the largest cart: the link stays inside the budget, the ref and contact are in it, and the copy text keeps every line", () => {
  const o = { ...base, lines: bigLines };
  const plan = W.planOrderSend("254724592115", o);
  assert.ok(plan.url.length <= W.URL_BUDGET, String(plan.url.length)); assert.equal(plan.level, "short"); assert.ok(plan.pasteRest);
  assert.ok(plan.text.includes(o.ref) && plan.text.includes("Phone: +254712345678"));
  for (let i = 1; i <= MAX_LINES; i++) assert.ok(plan.fullText.includes(`\n${i}. ${MAX_QTY_PER_LINE} x Animal ${i},`), `copy text ${i}`);
});
t("split delivery to MAX_DROPS places keeps every place and its items, in the copy text", () => {
  const MAX_RECIPIENTS = SPLIT.MAX_DROPS;
  const drops = Array.from({ length: MAX_RECIPIENTS }, (_, i) => ({ label: `Place ${i + 1}`, fulfilment: i % 2 ? "town" : "nairobi", area: "Karen", town: `Town ${i + 1}`, county: "Kiambu", recipientName: `Adult ${i + 1}`, recipientPhone: "+447911123456", items: [{ sku: `a${i}-c-m`, name: `Animal ${i}`, colourLabel: "Sage", size: "M", qty: 3 }] }));
  const o = { ...base, drops };
  const full = W.buildOrderMessage(o, "full"); const compact = W.buildOrderMessage(o, "compact");
  assert.ok(full.includes(`DELIVERY: ${MAX_RECIPIENTS} places`));
  for (let i = 1; i <= MAX_RECIPIENTS; i++) { assert.ok(full.includes(`PLACE ${i} OF ${MAX_RECIPIENTS}`) && compact.includes(`PLACE ${i} OF ${MAX_RECIPIENTS}`), `place ${i}`); assert.ok(full.includes(`Receiving adult: Adult ${i}, +447911123456`)); }
  const plan = W.planOrderSend("254724592115", o); assert.ok(plan.url.length <= W.URL_BUDGET); assert.equal(plan.fullText, full);
});
t("an enquiry far over the link budget keeps its full text for copying and a short link with the ref", () => {
  const long = W.buildEnquiryMessage({ intro: "Hello Mikono Creations, wholesale enquiry.", ref: "WS-261001-7KQ2", consentMarketing: false, fields: [["Name", "Amina"], ["Notes", "x".repeat(790)], ["Contacts", Array.from({ length: 12 }, (_, i) => `Contact ${i + 1} ${"y".repeat(100)}`)]] });
  const plan = W.planEnquirySend("254724592115", "Hello Mikono Creations, wholesale enquiry.", "WS-261001-7KQ2", long);
  assert.ok(plan.url.length <= W.URL_BUDGET && plan.pasteRest && plan.fullText === long && plan.text.includes("WS-261001-7KQ2"));
});

console.log(`\n${pass} tests passed`);
