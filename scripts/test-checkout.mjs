// Unit tests for the cart and order form logic: price states, share links, suggestions, validation, device profile,
// order object, tracking guard. Run from the repo root: node --no-warnings scripts/test-checkout.mjs
import { register } from "node:module";
import assert from "node:assert/strict";

register("./alias-loader.mjs", new URL("./", import.meta.url));
const root = new URL("..", import.meta.url).href;
const imp = (p) => import(new URL(p, root).href);

const P = await imp("lib/pricing.ts");
const S = await imp("lib/shareList.ts");
const G = await imp("lib/suggest.ts");
const F = await imp("lib/orderForm.ts");
const SP = await imp("lib/split.ts");
const SZ = await imp("lib/sizes.ts");
const LG = await imp("data/legal.ts");
const PR = await imp("lib/profile.ts");
const OP = await imp("lib/orderPayload.ts");
const C = await imp("data/consent.ts");
const T = await imp("lib/track.ts");
const R = await imp("lib/reorder.ts");
const SM = await imp("lib/sentMessage.ts");
const D = await imp("data/deliveryAreas.ts");
const K = await imp("lib/storageKeys.ts");
const { MAX_QTY_PER_LINE } = await imp("lib/site.ts");
const { MAX_OCCASIONS } = await imp("data/checkout.ts");
const catalogue = (await imp("data/catalogue.generated.json")).default;

let pass = 0;
const t = (name, fn) => { fn(); pass++; console.log(`ok  ${name}`); };

const mem = new Map();
globalThis.window = { localStorage: { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) } };

/* ---------- price ladder (R12): S 1500, M 2000, L 3500, XL 5000, one ladder for every product ---------- */
const FACTS = await imp("data/facts.ts");
t("price ladder is S 1500, M 2000, L 3500, XL 5000 and the flag is on", () => {
  assert.deepEqual(FACTS.sizePricesKes, { S: 1500, M: 2000, L: 3500, XL: 5000 });
  assert.equal(FACTS.pricesConfirmed, true);
  for (const [size, kes] of [["S", 1500], ["M", 2000], ["L", 3500], ["XL", 5000]]) assert.equal(P.unitPriceKes("elephant", size), kes);
  assert.equal(FACTS.WALL_ART_PRICE_KES, 8000);
  for (const size of ["WALL", "S", "XL"]) assert.equal(P.unitPriceKes("lion-wall-head", size), 8000, "wall art is one fixed price");
  assert.equal(P.unitPriceKes("dress-doll", "XL"), 5000, "dolls use the same ladder");
  assert.equal(P.unitPriceKes("elephant", "XXL"), null, "unknown size has no price");
});
t("from price is the cheapest size", () => { assert.equal(P.fromPriceKes("rabbit"), 1500); assert.equal(P.fromPriceKes("pig"), 1500); });
t("price ladder text reads in words, not codes", () => assert.equal(P.priceLadderText(), "Small KES 1,500, Medium KES 2,000, Large KES 3,500 and Extra large KES 5,000. Wall art: KES 8,000"));
t("every catalogue product has a price for every size, and the cards read From KES 1,500", () => {
  assert.ok(catalogue.products.length >= 30);
  for (const p of catalogue.products) for (const sz of (p.category === "wall-art" ? ["WALL"] : ["S", "M", "L", "XL"])) assert.equal(typeof P.unitPriceKes(p.slug, sz), "number", p.slug);
  const wall = catalogue.products.filter((p) => p.category === "wall-art");
  assert.equal(wall.length, 9); assert.ok(wall.every((p) => p.slug.endsWith("-wall-head")), "wall art is exactly the -wall-head slugs");
  for (const slug of ["pig", "cow", "duck"]) assert.ok(catalogue.products.some((p) => p.slug === slug), `${slug} is a product`);
  assert.ok(!catalogue.products.some((p) => p.slug === "chick"), "the yellow birds are ducks, not chicks");
});

/* ---------- price states ---------- */
const lines = [{ sku: "elephant-grey-m", slug: "elephant", size: "M", qty: 2 }, { sku: "giraffe-orange-l", slug: "giraffe", size: "L", qty: 1 }];
const base = { lines, pricesConfirmed: true, fulfilment: "nairobi", deliveryFeeKes: 300 };
t("line totals follow the size: 2 x Medium = 4000, 1 x Large = 3500", () => {
  const x = P.computeTotals(base);
  assert.deepEqual(x.lines.map((l) => [l.unitKes, l.totalKes]), [[2000, 4000], [3500, 3500]]);
  assert.equal(x.subtotalKes, 7500);
});
t("the same animal in two sizes prices each size", () => {
  const x = P.computeTotals({ ...base, lines: [{ sku: "a-s", slug: "lion", size: "S", qty: 1 }, { sku: "a-xl", slug: "lion", size: "XL", qty: 3 }] });
  assert.equal(x.subtotalKes, 1500 + 15000);
});
t("wall art lines cost 8000 each, mixed with animals, and the same wall head merges on one sku", () => {
  const x = P.computeTotals({ ...base, lines: [{ sku: "lion-wall-head-yellow-wall", slug: "lion-wall-head", size: "WALL", qty: 2 }, { sku: "pig-pink-s", slug: "pig", size: "S", qty: 1 }] });
  assert.deepEqual(x.lines.map((l) => l.totalKes), [16000, 1500]); assert.equal(x.subtotalKes, 17500);
  assert.equal(SZ.sizeWord("WALL"), "Wall size");
  assert.equal(`${"lion-wall-head"}-${"yellow"}-${"WALL"}`.toLowerCase(), "lion-wall-head-yellow-wall", "same sku for the same wall head, so lines merge");
});
t("P0: prices not confirmed shows no figure at all", () => {
  const x = P.computeTotals({ ...base, pricesConfirmed: false });
  assert.equal(x.state, "P0");
  assert.equal(x.subtotalKes, null); assert.equal(x.totalKes, null); assert.equal(x.valueKnown, false);
  assert.ok(x.lines.every((l) => l.unitKes === null && l.totalKes === null));
});
t("P0 even when prices exist in data: the flag decides", () => assert.equal(P.computeTotals({ ...base, pricesConfirmed: false }).state, "P0"));
t("P1: confirmed but a line has no price shows no subtotal and no total", () => {
  const x = P.computeTotals({ ...base, priceFor: (slug) => (slug === "elephant" ? 1500 : null) });
  assert.equal(x.state, "P1"); assert.equal(x.subtotalKes, null); assert.equal(x.totalKes, null);
  assert.equal(x.lines[0].totalKes, 3000); assert.equal(x.lines[1].totalKes, null);
});
t("P2: every line priced but delivery fee unknown gives an items total and no total", () => {
  const x = P.computeTotals({ ...base, deliveryFeeKes: null });
  assert.equal(x.state, "P2"); assert.equal(x.subtotalKes, 7500); assert.equal(x.totalKes, null); assert.equal(x.valueKnown, false);
});
t("P2 also while no delivery option is chosen", () => assert.equal(P.computeTotals({ ...base, fulfilment: "" }).state, "P2"));
t("P3: delivery fee known gives a total", () => {
  const x = P.computeTotals(base);
  assert.equal(x.state, "P3"); assert.equal(x.subtotalKes, 7500); assert.equal(x.deliveryFeeKes, 300); assert.equal(x.totalKes, 7800); assert.equal(x.valueKnown, true);
});
t("P3: pickup has no delivery cost", () => {
  const x = P.computeTotals({ ...base, fulfilment: "pickup", deliveryFeeKes: null });
  assert.equal(x.state, "P3"); assert.equal(x.deliveryFeeKes, 0); assert.equal(x.totalKes, 7500);
});
t("discount lowers the total and never below zero", () => {
  assert.equal(P.computeTotals({ ...base, discountKes: 500 }).totalKes, 7300);
  assert.equal(P.computeTotals({ ...base, discountKes: 99999 }).totalKes, 0);
});
t("bad prices are treated as missing", () => {
  assert.equal(P.computeTotals({ ...base, priceFor: (slug) => (slug === "elephant" ? -5 : 2000) }).state, "P1");
  assert.equal(P.computeTotals({ ...base, priceFor: (slug) => (slug === "elephant" ? 1500.5 : 2000) }).state, "P1");
  assert.equal(P.computeTotals({ ...base, lines: [] }).state, "P1");
});
t("KES format", () => assert.equal(P.formatKes(1500).replace(/ /g, " "), "KES 1,500"));
t("today every delivery fee in the data is null and the zones are placeholders", () => {
  assert.ok(D.deliveryAreas.every((a) => a.feeKes === null));
});

/* ---------- share list ---------- */
const products = catalogue.products.filter((p) => !p.hidden).map((p) => ({
  slug: p.slug, colourAsk: Boolean(p.colourAsk), sizes: ["S", "M", "L", "XL"], colours: p.colourways.map((c) => ({ key: c.key })),
}));
const elephant = products.find((p) => p.slug === "elephant");
const colour = elephant.colours[0].key;
t("share code round trips", () => {
  const code = S.encodeShare([{ slug: "elephant", colourKey: colour, size: "M", qty: 2 }, { slug: "giraffe", colourKey: products.find((p) => p.slug === "giraffe").colours[0].key, size: "L", qty: 1 }]);
  assert.match(code, /^[A-Za-z0-9_-]+$/);
  const r = S.decodeShare(code, products);
  assert.equal(r.lines.length, 2); assert.equal(r.dropped, 0);
  assert.deepEqual(r.lines[0], { slug: "elephant", colourKey: colour, size: "M", qty: 2 });
});
t("share code has no personal data fields", () => {
  const code = S.encodeShare([{ slug: "elephant", colourKey: colour, size: "S", qty: 1 }]);
  assert.equal(Buffer.from(code, "base64url").toString(), `elephant-${colour}-s:1`);
});
t("share link and message", () => {
  const link = S.shareUrl("https://example.org/", [{ slug: "elephant", colourKey: colour, size: "S", qty: 1 }]);
  assert.ok(link.startsWith("https://example.org/cart?list="));
  assert.ok(S.shareWaUrl(link, 1).startsWith("https://wa.me/?text="));
  assert.ok(decodeURIComponent(S.shareWaUrl(link, 3)).includes("(3 animals)"));
});
t("unknown, malformed and tampered entries are dropped, never thrown", () => {
  const bad = Buffer.from(`unicorn-pink-m:2,elephant-${colour}-xxl:1,elephant-nope-m:1,<script>:1,elephant-${colour}-m:3`).toString("base64url");
  const r = S.decodeShare(bad, products);
  assert.equal(r.lines.length, 1); assert.equal(r.dropped, 4);
  assert.deepEqual(S.decodeShare("%%%not base64%%%", products), { lines: [], dropped: 0 });
  assert.deepEqual(S.decodeShare("", products).lines, []);
});
t("quantity is clamped to MAX_QTY_PER_LINE and the same sku merges", () => {
  const code = Buffer.from(`elephant-${colour}-m:${MAX_QTY_PER_LINE + 99},elephant-${colour}-m:5`).toString("base64url");
  assert.equal(S.decodeShare(code, products).lines[0].qty, MAX_QTY_PER_LINE);
  assert.equal(MAX_QTY_PER_LINE, 500);
  assert.equal(S.decodeShare(Buffer.from(`elephant-${colour}-m:${MAX_QTY_PER_LINE}`).toString("base64url"), products).lines[0].qty, MAX_QTY_PER_LINE, "exactly the cap is kept");
});
t("share is capped at SHARE_MAX_LINES lines and every line below the cap survives the link", () => {
  const many = products.flatMap((p) => p.colours.flatMap((c) => ["S", "M", "L", "XL"].map((size) => ({ slug: p.slug, colourKey: c.key, size, qty: 7 }))));
  assert.equal(S.SHARE_MAX_LINES, 60);
  assert.ok(many.length > S.SHARE_MAX_LINES, String(many.length));
  const back = S.decodeShare(S.encodeShare(many), products).lines;
  assert.equal(back.length, S.SHARE_MAX_LINES);
  assert.deepEqual(back.map((l) => `${l.slug}-${l.colourKey}-${l.size}`), many.slice(0, S.SHARE_MAX_LINES).map((l) => `${l.slug}-${l.colourKey}-${l.size}`));
  assert.ok(back.every((l) => l.qty === 7));
});
t("a colour to confirm animal accepts the ask key", () => {
  const ask = products.find((p) => p.colourAsk);
  if (!ask) return;
  const r = S.decodeShare(Buffer.from(`${ask.slug}-ask-s:1`).toString("base64url"), products);
  assert.equal(r.lines.length, 1);
});

/* ---------- complete the family ---------- */
const cp = (slug, group, extra = {}) => ({ slug, name: slug, category: "x", group, colourAsk: false, suggestable: true, sizes: ["S", "M", "L", "XL"], priceKes: null, colours: [{ key: "c", label: "C", src: "", alt: "", focal: [0.5, 0.5], multiply: false }], ...extra });
const cat = [cp("elephant", "safari"), cp("giraffe", "safari"), cp("lion", "safari"), cp("rabbit", "pets"), cp("octopus", "sea"), cp("bag", "other", { suggestable: false }), cp("zebra", "safari")];
t("suggestions skip animals already in the list and non animals", () => {
  const s = G.suggestFamily(cat, [{ slug: "elephant", size: "M", qty: 1 }], 4);
  assert.ok(!s.some((x) => x.product.slug === "elephant" || x.product.slug === "bag"));
});
t("suggestions prefer the group of the biggest line, deterministic", () => {
  const list = [{ slug: "rabbit", size: "L", qty: 3 }, { slug: "elephant", size: "S", qty: 1 }];
  const a = G.suggestFamily(cat, list, 3);
  assert.deepEqual(a.map((x) => x.product.slug), ["giraffe", "lion", "octopus"], "the only pet is in the list, so catalogue order follows");
  assert.deepEqual(a, G.suggestFamily(cat, list, 3));
  const b = G.suggestFamily(cat, [{ slug: "elephant", size: "S", qty: 5 }], 2);
  assert.deepEqual(b.map((x) => x.product.slug), ["giraffe", "lion"], "safari first when the biggest line is safari");
});
t("suggestions respect max and use the most common size", () => {
  const s = G.suggestFamily(cat, [{ slug: "elephant", size: "L", qty: 2 }], 2);
  assert.equal(s.length, 2); assert.equal(s[0].size, "L");
  assert.equal(G.suggestFamily(cat, [], 4)[0].size, "M");
});
t("no suggestions when everything is in the list", () => assert.equal(G.suggestFamily([cp("a", "safari")], [{ slug: "a", size: "M", qty: 1 }]).length, 0));

/* ---------- validation ---------- */
const ctx = { minDate: "2026-10-04", maxDate: "2027-10-04" };
const form = (o = {}) => ({ ...F.emptyForm, ...o });
t("step who needs a customer type", () => {
  assert.ok(F.validateStep("who", form(), ctx).customerType);
  assert.deepEqual(F.validateStep("who", form({ customerTypes: ["personal"] }), ctx), {});
  assert.deepEqual(F.validateStep("who", form({ customerTypes: ["personal", "corporate"] }), ctx), {});
});
t("step details: name, phone, email format", () => {
  const e = F.validateStep("details", form({ name: "A", phone: "12", email: "x" }), ctx);
  assert.ok(e.name && e.phone && e.email);
  assert.deepEqual(F.validateStep("details", form({ name: "Amina", phone: "0712 345 678" }), ctx), {});
  assert.ok(F.validateStep("details", form({ name: "Amina", phone: "0712345678", contactChannels: ["whatsapp", "email"] }), ctx).email);
});
t("step delivery: pickup needs nothing more, Nairobi needs area and landmark, town needs county and town", () => {
  assert.deepEqual(F.validateStep("delivery", form({ fulfilment: "pickup" }), ctx), {});
  const n = F.validateStep("delivery", form({ fulfilment: "nairobi" }), ctx);
  assert.ok(n.area && n.landmark);
  assert.ok(F.validateStep("delivery", form({ fulfilment: "nairobi", area: "Other Nairobi area", landmark: "Gate 3" }), ctx).areaOther);
  const tw = F.validateStep("delivery", form({ fulfilment: "town" }), ctx);
  assert.ok(tw.county && tw.town);
});
t("date wish must be from tomorrow and within a year", () => {
  assert.ok(F.validateStep("delivery", form({ fulfilment: "pickup", dateWish: "2026-10-01" }), ctx).dateWish);
  assert.ok(F.validateStep("delivery", form({ fulfilment: "pickup", dateWish: "2028-01-01" }), ctx).dateWish);
  assert.deepEqual(F.validateStep("delivery", form({ fulfilment: "pickup", dateWish: "2026-12-10" }), ctx), {});
});
t("date helpers use Nairobi time", () => {
  assert.equal(F.tomorrowISO(new Date("2026-10-03T22:30:00Z")), "2026-10-05");
  assert.equal(F.tomorrowISO(new Date("2026-10-03T09:00:00Z")), "2026-10-04");
  assert.ok(F.maxDateISO(new Date("2026-10-03T09:00:00Z")) >= "2027-10-03");
});
t("maps pin accepts Google Maps links only", () => {
  for (const ok of ["https://maps.app.goo.gl/AbC123", "https://www.google.com/maps/place/Karen", "https://google.com/maps?q=-1.3,36.7", "https://maps.google.com/maps?q=x", "https://goo.gl/maps/xyz"]) assert.equal(F.validMapsUrl(ok), true, ok);
  for (const bad of ["http://maps.app.goo.gl/AbC", "https://evil.example/maps/x", "https://www.google.com/search?q=maps", "javascript:alert(1)", "https://maps.app.goo.gl.evil.com/x", "not a url", "https://goo.gl/other", ""]) assert.equal(F.validMapsUrl(bad), false, bad);
  assert.ok(F.validateStep("delivery", form({ fulfilment: "nairobi", area: "Karen", landmark: "Gate", mapsPin: "https://evil.example/x" }), ctx).mapsPin);
});
t("recipient is an adult contact: name and phone are required when someone else receives it", () => {
  const e = F.validateStep("delivery", form({ fulfilment: "nairobi", area: "Karen", landmark: "Gate", recipientDifferent: true }), ctx);
  assert.ok(e.recipientName && e.recipientPhone);
  const g = F.validateStep("gift", form({ sendDirect: true }), ctx);
  assert.ok(g.recipientName && g.recipientPhone);
  assert.deepEqual(F.validateStep("gift", form({ sendDirect: true, recipientName: "Wanjiru", recipientPhone: "0722000111" }), ctx), {});
});
t("business step needs only the business name", () => {
  assert.ok(F.validateStep("business", form(), ctx).businessName);
  assert.deepEqual(F.validateStep("business", form({ businessName: "Savanna Gifts" }), ctx), {});
});
t("KRA PIN is a soft field: any value passes validation, the check is only a warning", () => {
  assert.deepEqual(F.validateStep("business", form({ businessName: "Savanna Gifts", kraPin: "nonsense" }), ctx), {});
  assert.equal(F.kraLooksValid("A123456789B"), true); assert.equal(F.kraLooksValid("p051234567z"), true); assert.equal(F.kraLooksValid("12345"), false);
});
t("occasions: each needs type, day and month together, and a real day; several are allowed", () => {
  assert.ok(F.validateStep("about", form({ occasions: [{ type: "Birthday", day: "", month: "" }] }), ctx).occasion0_type);
  assert.deepEqual(F.validateStep("about", form({}), ctx), {});
  const xmas = { type: "Christmas", day: "25", month: "12" }, bday = { type: "Birthday", day: "12", month: "3" };
  assert.equal(F.occasionComplete(form({ occasions: [xmas] })), true);
  assert.equal(F.occasionComplete(form({ occasions: [{ type: "Christmas", day: "31", month: "4" }] })), false);
  const two = form({ occasions: [xmas, bday] });
  assert.equal(F.occasionText(two), "Christmas, 25 December; Birthday, 12 March");
  assert.deepEqual(F.validateStep("about", form({ occasions: [xmas, { type: "Gift", day: "5", month: "" }] }), ctx), { occasion1_type: "To use an occasion, choose the type, the day and the month. Or remove it." });
  assert.equal(MAX_OCCASIONS, 20);
  assert.equal(F.completeOccasions(form({ occasions: Array.from({ length: MAX_OCCASIONS + 4 }, () => xmas) })).length, MAX_OCCASIONS, "at most MAX_OCCASIONS occasions");
  const other = { type: "Other, tell us", day: "3", month: "5", other: "Harvest festival" };
  assert.equal(F.occasionLine(other), "Other: Harvest festival, 3 May");
  assert.ok(F.validateStep("about", form({ occasions: [{ ...other, other: "" }] }), ctx).occasion0_other);
});
t("review: the terms tick is required and nothing else is", () => {
  assert.ok(F.validateReview(form(), F.noTicks).terms_acknowledged);
  assert.ok(F.validateReview(form(), { ...F.noTicks, terms_acknowledged: false }).terms_acknowledged);
  assert.deepEqual(F.validateReview(form(), { ...F.noTicks, terms_acknowledged: true }), {});
});
t("review: a ticked newsletter needs an email, a ticked reminder needs an occasion", () => {
  const tk = { ...F.noTicks, terms_acknowledged: true, email_newsletter: true, occasion_reminders: true };
  const e = F.validateReview(form(), tk);
  assert.ok(e.email_newsletter && e.occasion_reminders);
  assert.deepEqual(F.validateReview(form({ email: "a@b.co", occasions: [{ type: "Gift", day: "1", month: "5" }] }), tk), {});
});
t("consent boxes start unticked", () => assert.ok(Object.values(F.noTicks).every((v) => v === false)));
t("step list skips what is not needed", () => {
  assert.deepEqual(F.stepList({ skipGift: false, skipAbout: false, b2b: false }), ["who", "details", "delivery", "gift", "about", "review"]);
  assert.deepEqual(F.stepList({ skipGift: true, skipAbout: true, b2b: false }), ["who", "details", "delivery", "review"]);
  assert.deepEqual(F.stepList({ skipGift: false, skipAbout: false, b2b: true }), ["who", "details", "delivery", "gift", "business", "about", "review"]);
});
t("validateAll finds the first step with a problem", () => {
  const list = F.stepList({ skipGift: true, skipAbout: true, b2b: false });
  assert.equal(F.validateAll(list, form(), ctx, F.noTicks).step, "who");
  const ok = form({ customerTypes: ["personal"], name: "Amina", phone: "0712345678", fulfilment: "pickup" });
  assert.equal(F.validateAll(list, ok, ctx, F.noTicks).step, "review");
  assert.equal(F.validateAll(list, ok, ctx, { ...F.noTicks, terms_acknowledged: true }), null);
});

/* ---------- consent record and order object ---------- */
t("terms acceptance text comes from one replaceable source and is unticked and required", () => {
  assert.equal(C.consentTexts.terms_acknowledged, LG.TERMS_ACCEPT.text);
  assert.ok(LG.TERMS_ACCEPT.text.includes("Terms of Sale") && LG.TERMS_ACCEPT.text.includes("Privacy Policy"));
  assert.equal(C.TERMS_VERSION, LG.TERMS_ACCEPT.version);
  assert.deepEqual(LG.TERMS_ACCEPT.links.map((l) => l.href), ["/terms", "/privacy"]);
  assert.equal(LG.TERMS_ACCEPT.version, "terms-of-sale@v0.1-draft+privacy-policy@v0.1-draft");
  assert.match(LG.acceptedLine(new Date("2026-10-03T11:05:00Z")), /^Accepted: terms-of-sale v0.1-draft, privacy-policy v0.1-draft on 2026-10-03 14:05 EAT$/);
});
t("consent texts are the four texts of strategy/17, version id included", () => {
  assert.equal(C.CONSENT_VERSION, "consent-v1-draft");
  assert.ok(C.consentTexts.whatsapp_updates.startsWith("Yes, send me news and offers from Mikono Creations on WhatsApp") && C.consentTexts.whatsapp_updates.endsWith("I can reply STOP at any time."));
  assert.ok(C.consentTexts.email_newsletter.includes("unsubscribe at any time"));
  assert.ok(C.consentTexts.occasion_reminders.includes("day and month only"));
  
  assert.ok(!/\[FREQUENCY\]|\[LEGAL/.test(JSON.stringify(C.consentTexts)), "no unfilled placeholders");
});
const okForm = form({ customerTypes: ["shop", "corporate"], name: "Amina", phone: "0712 345 678", email: "a@b.co", fulfilment: "nairobi", area: "Karen", landmark: "Gate 3", businessName: "Savanna Gifts", kraPin: "A123456789B", poNumber: "PO-1", recipientDifferent: true, recipientName: "Joy", recipientPhone: "0722000111", occasions: [{ type: "Christmas", day: "20", month: "12" }, { type: "Birthday", day: "3", month: "7" }] });
t("order object holds consent records with version, text, time and no KRA PIN", () => {
  const at = new Date("2026-10-03T10:00:00Z");
  const o = OP.buildOrderPayload({ ref: "MK-261003-AAAA", at, form: okForm, ticks: { ...F.noTicks, whatsapp_updates: true, terms_acknowledged: true }, lines: [{ sku: "a-b-s", qty: 1 }], attribution: {}, messageLevel: "full" });
  assert.equal(o.consents.length, 4);
  const wa = o.consents.find((c) => c.purpose === "whatsapp_updates");
  assert.equal(wa.granted, true); assert.equal(wa.textVersion, C.CONSENT_VERSION); assert.equal(wa.text, C.consentTexts.whatsapp_updates); assert.equal(wa.at, at.toISOString());
  assert.equal(o.consents.find((c) => c.purpose === "email_newsletter").granted, false);
  assert.ok(!JSON.stringify(o).includes("A123456789B") && !JSON.stringify(o).toLowerCase().includes("kra"));
  assert.equal(o.contact.phone, "+254712345678"); assert.equal(o.delivery.recipientPhone, "+254722000111"); assert.equal(o.segment, "b2b");
});
t("a reminder date is only in the order object when the reminder box is ticked", () => {
  const mk = (ticked) => OP.buildOrderPayload({ ref: "MK-1", at: new Date(), form: okForm, ticks: { ...F.noTicks, occasion_reminders: ticked }, lines: [], attribution: {}, messageLevel: "full" });
  assert.deepEqual(mk(true).reminders, [{ occasionType: "Christmas", day: 20, month: 12 }, { occasionType: "Birthday", day: 3, month: 7 }]);
  assert.deepEqual(mk(false).reminders, []);
});
t("order object has no child fields: the key set is fixed and holds adult contacts only", () => {
  const o = OP.buildOrderPayload({ ref: "x", at: new Date(), form: okForm, ticks: F.noTicks, lines: [], attribution: {}, messageLevel: "full" });
  assert.deepEqual(Object.keys(o).sort(), ["about", "attribution", "business", "consents", "contact", "createdAt", "customerTypes", "deliveries", "delivery", "gift", "lines", "messageLevel", "notes", "payment", "paymentNote", "ref", "reminders", "segment", "termsVersion"]);
  assert.deepEqual(Object.keys(o.delivery).filter((k) => /recipient/.test(k)).sort(), ["recipientName", "recipientPhone"]);
  assert.deepEqual(Object.keys(o.about).sort(), ["heardFrom", "interests"]);
});

/* ---------- device profile ---------- */
t("profile keeps only the allowed fields", () => {
  PR.writeProfile({ ...okForm, giftNote: "secret", recipientName: "Joy", recipientPhone: "0722000111", paymentNote: "x", notes: "y", poNumber: "PO-1" });
  const raw = mem.get(K.KEYS.profile);
  for (const bad of ["A123456789B", "kraPin", "giftNote", "recipient", "paymentNote", "notes", "poNumber", "secret", "Joy", "0722000111"]) assert.ok(!raw.includes(bad), bad);
  const p = PR.readProfile();
  assert.equal(p.name, "Amina"); assert.equal(p.businessName, "Savanna Gifts"); assert.equal(p.area, "Karen");
});
t("profile expires after 90 days and renews on a new write", () => {
  const now = 1_800_000_000_000, day = 86400000;
  PR.writeProfile(okForm, now);
  assert.ok(PR.readProfile(now + 89 * day));
  assert.equal(PR.readProfile(now + 91 * day), null);
  assert.equal(mem.get(K.KEYS.profile), undefined, "expired profile is removed");
  PR.writeProfile(okForm, now + 80 * day);
  assert.ok(PR.readProfile(now + 150 * day), "renewed from the last send");
});
t("forget removes the profile", () => { PR.writeProfile(okForm); PR.forgetProfile(); assert.equal(PR.readProfile(), null); });
t("profile fills only empty fields, a draft wins, bad enum values are ignored", () => {
  PR.writeProfile(okForm);
  const p = PR.readProfile();
  const f = F.applyProfile(form({ name: "Typed" }), p);
  assert.equal(f.name, "Typed"); assert.equal(f.phone, "0712 345 678"); assert.deepEqual(f.customerTypes, ["shop", "corporate"]);
  const bad = F.applyProfile(form(), { ...p, contactChannels: ["carrier pigeon"], customerTypes: ["parent"] });
  assert.deepEqual(bad.contactChannels, ["whatsapp"]); assert.deepEqual(bad.customerTypes, []);
});
t("stored keys never use card, bank, pin or id names", () => {
  for (const k of K.CLEARABLE_KEYS) assert.ok(!/card|bank|cvv|mpesa|kra|id_?number|password/i.test(k), k);
});
t("the clear list holds every key the site writes", () => {
  for (const k of ["mk.cart.v1", "mk.draft.v1", "mk.orders.v1", "mk.profile.v1", "mk.studio.v1", "mk.helpers.v1", "mk_attr", "mk.saved.v1", "mk.delivery.v1"]) assert.ok(K.CLEARABLE_KEYS.includes(k), k);
});

/* ---------- drafts, orders, sent message ---------- */
t("the draft expires after 24 hours", () => {
  F.writeDraft({ step: "who", skipGift: false, skipAbout: false, form: form({ name: "A" }) });
  const d = JSON.parse(mem.get(F.DRAFT_KEY));
  d.updatedAt = Date.now() - 25 * 3600 * 1000;
  mem.set(F.DRAFT_KEY, JSON.stringify(d));
  assert.equal(F.readDraft(), null);
});
t("an old format draft is discarded", () => { mem.set(F.DRAFT_KEY, JSON.stringify({ v: 1, updatedAt: Date.now(), step: "who", form: {} })); assert.equal(F.readDraft(), null); });
t("the order summary keeps ref and items only", () => {
  F.saveOrderSummary("MK-1", [{ sku: "a-b-s", qty: 2, name: "leak", phone: "x" }]);
  const raw = mem.get(F.ORDERS_KEY);
  assert.ok(!raw.includes("leak") && !raw.includes("phone"));
  assert.deepEqual(F.readOrders()[0].items, [{ sku: "a-b-s", qty: 2 }]);
});
t("the KRA PIN line is stripped from the saved copy of a sent message", () => {
  assert.equal(SM.stripKraLines("a\nKRA PIN: A123456789B\nb"), "a\nb");
});
t("reorder resolves skus against the catalogue and counts what is missing", () => {
  const cat2 = [cp("elephant", "safari", { colours: [{ key: "grey", label: "Grey", src: "/e.jpg", alt: "", focal: [0.5, 0.5], multiply: false }] })];
  const r = R.reorderLast({ ref: "MK-1", at: 1, items: [{ sku: "elephant-grey-m", qty: 2 }, { sku: "dragon-red-m", qty: 1 }] }, cat2);
  assert.equal(r.items.length, 1); assert.equal(r.missing, 1); assert.equal(r.items[0].qty, 2); assert.equal(r.items[0].colourLabel, "Grey");
});

/* ---------- split delivery ---------- */
const sl = [
  { sku: "lion-tan-m", qty: 3, name: "Lion", colourLabel: "Tan", size: "M" },
  { sku: "giraffe-orange-l", qty: 2, name: "Giraffe", colourLabel: "Orange", size: "L" },
  { sku: "shark-ask-s", qty: 1, name: "Shark", colourLabel: "Colour to confirm", size: "S" },
];
const adult = (i, o = {}) => SP.newDrop(i, { area: "Karen", landmark: "Gate " + i, recipientName: "Adult " + i, recipientPhone: "07220001" + String(10 + i), ...o });
const three = () => [adult(1), adult(2, { fulfilment: "town", area: "", landmark: "", county: "Nakuru", town: "Naivasha" }), adult(3, { area: "Other Nairobi area", areaOther: "Lenana Road" })];
t("all to place 1 puts every unit in the first place", () => {
  const d = SP.allToFirst(sl, three());
  assert.deepEqual(d[0].alloc, { "lion-tan-m": 3, "giraffe-orange-l": 2, "shark-ask-s": 1 });
  assert.deepEqual(d[1].alloc, {}); assert.deepEqual(d[2].alloc, {});
});
t("a split with units left over or short is an error, every unit exactly once", () => {
  let d = SP.allToFirst(sl, three());
  const e0 = SP.validateSplit(sl, d, F.validMapsUrl);
  assert.ok(e0.drop1_units && e0.drop2_units, "empty places are flagged");
  d = SP.setAlloc(d, 0, "lion-tan-m", 1); d = SP.setAlloc(d, 1, "lion-tan-m", 1);
  const e1 = SP.validateSplit(sl, d, F.validMapsUrl);
  assert.match(e1.alloc, /Lion has 2 of 3 placed/);
  d = SP.setAlloc(d, 2, "lion-tan-m", 1); d = SP.setAlloc(d, 1, "giraffe-orange-l", 2); d = SP.setAlloc(d, 0, "giraffe-orange-l", 0); d = SP.setAlloc(d, 2, "shark-ask-s", 1); d = SP.setAlloc(d, 0, "shark-ask-s", 0);
  assert.deepEqual(SP.validateSplit(sl, d, F.validMapsUrl), {}, JSON.stringify(SP.validateSplit(sl, d, F.validMapsUrl)));
  d = SP.setAlloc(d, 0, "lion-tan-m", 2);
  assert.match(SP.validateSplit(sl, d, F.validMapsUrl).alloc, /Lion has 4 of 3 placed/);
});
t("three places: each needs an adult name and phone, area or town, landmark", () => {
  const d = SP.allToFirst(sl, [adult(1, { recipientName: "", recipientPhone: "x", landmark: "" }), adult(2, { area: "" }), adult(3, { fulfilment: "town", county: "", town: "" })]);
  const e = SP.validateSplit(sl, d, F.validMapsUrl);
  for (const k of ["drop0_recipientName", "drop0_recipientPhone", "drop0_landmark", "drop1_area", "drop2_county", "drop2_town"]) assert.ok(e[k], k);
});
t("split drops carry no child fields: the shape is fixed", () => {
  assert.deepEqual(Object.keys(SP.newDrop(1)).sort(), ["alloc", "area", "areaOther", "county", "fulfilment", "giftNote", "id", "landmark", "mapsPin", "other", "recipientName", "recipientPhone", "town"]);
});
t("syncAlloc drops lines that left the cart and clamps lowered quantities", () => {
  const d = SP.syncAlloc([sl[0]], [SP.newDrop(1, { alloc: { "lion-tan-m": 5, "gone-x-s": 2 } })]);
  assert.deepEqual(d[0].alloc, { "lion-tan-m": 3 });
});
t("the step validator checks a split instead of the single address", () => {
  const f = form({ split: true, drops: SP.allToFirst(sl, three()), fulfilment: "nairobi" });
  const e = F.validateStep("delivery", f, { ...ctx, lines: sl });
  assert.ok(e.drop1_units && !e.fulfilment && !e.landmark);
});
t("the split message and order object list every place with its units", () => {
  let d = SP.allToFirst(sl, three());
  d = SP.setAlloc(SP.setAlloc(SP.setAlloc(d, 0, "lion-tan-m", 1), 1, "lion-tan-m", 1), 2, "lion-tan-m", 1);
  d = SP.setAlloc(SP.setAlloc(d, 0, "giraffe-orange-l", 0), 1, "giraffe-orange-l", 2);
  d = SP.setAlloc(SP.setAlloc(d, 0, "shark-ask-s", 0), 2, "shark-ask-s", 1);
  d[1].giftNote = "For Aunty";
  const f = form({ ...okForm, split: true, drops: d, recipientDifferent: false, sendDirect: false, giftNote: "ignored" });
  const msg = F.toOrderMsg(f, sl, "MK-1", { ...F.noTicks, terms_acknowledged: true }, "", "", C.CONSENT_VERSION, C.TERMS_VERSION);
  assert.equal(msg.drops.length, 3);
  assert.deepEqual(msg.drops.map((x) => x.items.reduce((n, i) => n + i.qty, 0)), [1, 3, 2]);
  assert.equal(msg.giftNote, undefined, "the single gift note is not used when split");
  const pay = OP.buildOrderPayload({ ref: "MK-1", at: new Date(), form: f, ticks: F.noTicks, lines: sl.map((l) => ({ sku: l.sku, qty: l.qty })), attribution: {}, messageLevel: "full" });
  assert.equal(pay.deliveries.length, 3);
  const sum = pay.deliveries.flatMap((x) => x.units).reduce((n, u) => n + u.qty, 0);
  assert.equal(sum, 6);
  assert.equal(pay.deliveries[1].giftNote, "For Aunty"); assert.equal(pay.delivery.recipientName, "");
});
t("sizes are words in the interface, codes stay in SKUs", () => {
  assert.deepEqual(["S", "M", "L", "XL"].map(SZ.sizeWord), ["Small", "Medium", "Large", "Extra large"]);
  assert.equal(SZ.sizeWord("xl"), "Extra large");
});
t("several customer types, channels, interests and heard from survive a draft round trip", () => {
  const f = form({ customerTypes: ["personal", "corporate"], contactChannels: ["whatsapp", "call"], interests: ["Safari animals", "Warm colours"], heardFrom: ["Instagram", "An event"], occasions: [{ type: "Gift", day: "2", month: "2" }], split: true, drops: three() });
  F.writeDraft({ step: "delivery", skipGift: false, skipAbout: false, form: f });
  const d = F.readDraft();
  assert.deepEqual(d.form.customerTypes, ["personal", "corporate"]); assert.deepEqual(d.form.contactChannels, ["whatsapp", "call"]);
  assert.deepEqual(d.form.heardFrom, ["Instagram", "An event"]); assert.equal(d.form.drops.length, 3); assert.equal(d.form.occasions.length, 1);
});


/* ---------- inclusive options: Other answers, new ways to receive, any phone, split to many places ---------- */
const ml = [{ sku: "elephant-grey-m", name: "Elephant", colourLabel: "Grey", size: "M", qty: 2 }];
const msgOf = (f) => W.buildOrderMessage(F.toOrderMsg(f, ml, "MK-261001-7KQ2", F.noTicks, "", "", C.CONSENT_VERSION), "full");
const W = await imp("lib/whatsapp.ts");
t("Other answers reach the message in the person's own words", () => {
  const f = form({ customerTypes: ["other"], customerOther: "Book club", name: "Wanjiru", phone: "0712 345 678", contactChannels: ["other", "whatsapp"], channelOther: "Signal", language: "other", langOther: "Kikuyu",
    fulfilment: "other", fulfilmentOther: "A matatu to Nyeri", access: "Large print messages please", paymentNote: "Bank transfer works for me", interests: ["Other, tell us"], interestOther: "Hand puppets", heardFrom: ["Other, tell us"], heardOther: "A church notice",
    occasions: [{ type: "Other, tell us", day: "3", month: "5", other: "Harvest festival" }] });
  const m = msgOf(f);
  for (const w of ["Other: Book club", "Other: Signal", "Other: Kikuyu", "A matatu to Nyeri", "Large print messages please", "Bank transfer works for me", "Hand puppets", "A church notice", "Harvest festival"]) assert.ok(m.includes(w), w);
  assert.ok(m.includes("What would make this easier for me: Large print messages please"));
});
t("the accessibility note is never written to the draft", () => {
  F.writeDraft({ step: "details", skipGift: false, skipAbout: false, form: form({ name: "A person", access: "A call instead of messages please" }) });
  const raw = mem.get(K.KEYS.draft); assert.ok(raw && !raw.includes("A call instead of messages please"));
  assert.equal(F.readDraft().form.access, "");
});
t("every new way to receive is accepted and written plainly", () => {
  const base = { customerTypes: ["personal"], name: "Amina", phone: "0712 345 678" };
  const cases = [
    [{ fulfilment: "collect" }, "Method: Someone else will collect it"],
    [{ fulfilment: "pickup" }, "Method: I will collect it"],
    [{ fulfilment: "courier", county: "Kisumu", town: "Kisumu town", landmark: "Easy Coach office" }, "Method: A courier or bus parcel service of my choice"],
    [{ fulfilment: "abroad", fulfilmentOther: "Leeds, United Kingdom" }, "Country and city: Leeds, United Kingdom"],
    [{ fulfilment: "other", fulfilmentOther: "Hand it to the choir leader" }, "How: Hand it to the choir leader"],
  ];
  for (const [over, expect] of cases) {
    const f = form({ ...base, ...over });
    assert.deepEqual(F.validateStep("delivery", f, ctx), {}, JSON.stringify(over));
    assert.ok(msgOf(f).includes(expect), expect);
  }
  assert.ok(F.validateStep("delivery", form({ fulfilment: "abroad" }), ctx).fulfilmentOther);
  assert.ok(F.validateStep("delivery", form({ fulfilment: "other" }), ctx).fulfilmentOther);
  assert.ok(F.validateStep("delivery", form({ fulfilment: "courier" }), ctx).county);
  assert.ok(!msgOf(form({ ...base, fulfilment: "collect" })).includes("Delivery fee"));
});
t("a date can be as soon as possible or flexible, with no date needed", () => {
  const f = form({ customerTypes: ["personal"], fulfilment: "pickup", dateFlex: "asap", dateWish: "2020-01-01" });
  assert.deepEqual(F.validateStep("delivery", f, ctx), {});
  assert.ok(msgOf(f).includes("Date wish: As soon as possible")); assert.ok(msgOf({ ...f, dateFlex: "flexible" }).includes("Flexible, any date is fine"));
});
t("any phone number is accepted in the order form: Kenyan, landline and foreign", () => {
  for (const p of ["0712 345 678", "+254 112 345 678", "020 234 5678", "+44 7911 123456", "+1 (415) 555-2671", "+971 50 123 4567"]) assert.deepEqual(F.validateStep("details", form({ name: "Li", phone: p }), ctx), {}, p);
  assert.ok(F.validateStep("details", form({ name: "Li", phone: "call me" }), ctx).phone);
  const m = msgOf(form({ customerTypes: ["diaspora"], name: "Li", phone: "+44 7911 123456" })); assert.ok(m.includes("Phone: +447911123456"));
});
t("names: one name, apostrophes, hyphens and non-Latin scripts are all fine", () => {
  for (const n of ["Wanjiru", "O'Connor-Mwangi", "Chebet", "\u0645\u062D\u0645\u062F", "\u738B\u5C0F\u660E", "Njeri wa Kamau na Wambui"]) assert.deepEqual(F.validateStep("details", form({ name: n, phone: "0712345678" }), ctx), {}, n);
  assert.ok(msgOf(form({ customerTypes: ["personal"], name: "\u0645\u062D\u0645\u062F", phone: "0712345678", fulfilment: "pickup" })).includes("Name: \u0645\u062D\u0645\u062F"));
});
t("split delivery to MAX_DROPS places, each in a different way, validates and writes every place", () => {
  const kinds = ["nairobi", "town", "courier", "pickup", "collect", "abroad", "other"];
  const drops = Array.from({ length: SP.MAX_DROPS }, (_, i) => SP.newDrop(i + 1, { fulfilment: kinds[i % kinds.length], area: "Karen", landmark: "Gate 1", county: "Nakuru", town: "Naivasha", other: "Leeds, United Kingdom", recipientName: `Adult ${i + 1}`, recipientPhone: i % 2 ? "+447911123456" : "0712345678", alloc: { "elephant-grey-m": i === 0 ? 2 : 0 } }));
  const sl = [{ sku: "elephant-grey-m", qty: 2, name: "Elephant", colourLabel: "Grey", size: "M" }];
  const dropsFixed = drops.map((d, i) => (i === 0 ? d : { ...d, alloc: {} }));
  assert.equal(SP.MAX_DROPS, 20);
  const e = SP.validateSplit(sl, dropsFixed.slice(0, 7).map((d, i) => (i === 1 ? { ...d, alloc: { "elephant-grey-m": 0 } } : d)), F.validMapsUrl);
  assert.ok(e.drop1_units, "an empty place is named");
  const two = [SP.newDrop(1, { fulfilment: "pickup", recipientName: "Joy", recipientPhone: "0712345678", alloc: { "elephant-grey-m": 1 } }), SP.newDrop(2, { fulfilment: "abroad", other: "Leeds, UK", recipientName: "Sam", recipientPhone: "+447911123456", alloc: { "elephant-grey-m": 1 } })];
  assert.deepEqual(SP.validateSplit(sl, two, F.validMapsUrl), {});
  const m = msgOf(form({ customerTypes: ["personal"], name: "Amina", phone: "0712345678", split: true, drops: two }));
  assert.ok(m.includes("DELIVERY: 2 places") && m.includes("Receiving adult: Sam, +447911123456") && m.includes("Country and city: Leeds, UK"));
});

t("the wizard carries payment timing and ways to pay into the message, with the deposit wording and an Other", () => {
  const f = form({ customerTypes: ["personal"], name: "Amina", phone: "0712345678", fulfilment: "pickup", payTiming: "deposit", payMethods: ["mobile-money", "other"], payOther: "A cheque", paymentNote: "Mid month" });
  const m = msgOf(f);
  for (const w of ["When I would like to pay: Pay a deposit now and the balance later (a deposit, confirmed in your quote)", "Ways I may pay (to be confirmed): Mobile money (M-Pesa or another mobile wallet), Other: A cheque", "Payment details and the deposit amount are confirmed on WhatsApp.", "Payment note: Mid month"]) assert.ok(m.includes(w), w);
  assert.ok(F.validateReview(form({ payMethods: ["other"] }), { ...F.noTicks, terms_acknowledged: true }).payOther);
  assert.ok(!msgOf(form({ customerTypes: ["personal"], name: "A", phone: "0712345678", fulfilment: "pickup" })).includes("When I would like to pay"));
  const pay = OP.buildOrderPayload({ ref: "MK-1", at: new Date(), form: f, ticks: F.noTicks, lines: [], attribution: {}, messageLevel: "full" });
  assert.deepEqual(pay.payment, { timing: "deposit", methods: ["mobile-money", "other: A cheque"] });
});

/* ---------- tracking: no personal data ---------- */
t("track params never carry personal data keys", () => {
  const out = T.cleanParams({ name: "Amina", phone: "+2547", email: "a@b", address: "x", landmark: "y", notes: "z", kra_pin: "A1", recipient_name: "Joy", gift_note: "hi", message: "m", business_name: "b",
    step_name: "details", customer_type: "shop", shipping_tier: "nairobi", item_count: 2, order_ref: "MK-1", field_name: "phone" });
  assert.deepEqual(Object.keys(out).sort(), ["customer_type", "field_name", "item_count", "order_ref", "shipping_tier", "step_name"]);
});
t("track item entries keep only item fields, SKU is the id", () => {
  const out = T.cleanParams({ items: [{ item_id: "elephant-grey-m", item_name: "Elephant", item_category: "Safari animals", item_variant: "grey-m", quantity: 2, name: "leak", note: "leak", price: undefined }] });
  assert.deepEqual(out.items[0], { item_id: "elephant-grey-m", item_name: "Elephant", item_category: "Safari animals", item_variant: "grey-m", quantity: 2 });
});
t("the new events are registered", () => {
  for (const e of ["view_cart", "begin_checkout", "add_shipping_info", "wizard_step_complete", "customer_type_selected", "share_list", "save_for_later", "whatsapp_order_submit", "consent_update"]) assert.ok(T.TRACK_EVENTS.includes(e), e);
});

console.log(`\n${pass} tests passed`);
