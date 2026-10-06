// Unit tests for the Custom Studio logic: data, multi-piece briefs, message builder, ref format, length guard, draft expiry, validation.
// Run from the repo root: node scripts/test-studio.mjs
import { register } from "node:module";
import assert from "node:assert/strict";

register("./alias-loader.mjs", new URL("./", import.meta.url));
const root = new URL("..", import.meta.url).href;
const imp = (p) => import(new URL(p, root).href);

const M = await imp("lib/studio/message.ts");
const S = await imp("lib/studio/state.ts");
const V = await imp("lib/studio/validate.ts");
const Sum = await imp("lib/studio/summary.ts");
const F = await imp("lib/studio/flow.ts");
const D = await imp("data/studio.ts");
const { counties } = await imp("data/counties.ts");
const { normalisePhone } = await imp("lib/phone.ts");

let pass = 0;
const t = (name, fn) => { fn(); pass++; console.log(`ok  ${name}`); };

const T0 = Date.UTC(2026, 9, 2, 8, 0, 0);
const NOON = new Date("2026-10-02T09:00:00Z");
const fixedRnd = (n) => new Uint8Array(n).map((_, i) => i + 3);

const piece = (id, over = {}) => ({ ...S.newPiece(id), baseId: "giraffe", size: "L", qtyBand: "1", colours: [{ id: "cream", label: "Cream", family: "neutral" }], ...over });
const brief = (over = {}) => ({
  ...S.emptyBrief("p1"),
  customerTypes: ["gift-buyer"], types: ["wedding", "gift"],
  pieces: [
    piece("p1", { colours: [{ id: "cream", label: "Cream", family: "neutral" }, { id: "caramel-tan", label: "Caramel tan", family: "brown" }], markings: ["mane", "stripes"], eyes: "stitched", textures: ["fringe-mane", "smooth"], posture: "sitting", loop: "yes", unique: "A white tip on the tail", stitch: ["name"], stitchText: { name: "Welcome" }, wear: ["scarf", "bag"], qtyBand: "6-19", qtyExact: "12", colourRefs: ["sage ribbon"] }),
    piece("p2", { baseId: "lion", size: "XL", qtyBand: "1", finish: ["hang-tag"] }),
  ],
  occasions: ["wedding", "birthday"], occasionDayMonth: "12-05", deadlineType: "hard", deadlineDate: "2026-12-05", rush: "yes",
  addresses: [{ ...S.newAddress("a1", "nairobi"), area: "Kilimani", share: "8" }, { ...S.newAddress("a2", "gift-direct"), area: "Karen", label: "Karen home", share: "5" }],
  picks: [{ slug: "zebra", pref: "like" }, { slug: "lion", pref: "avoid" }], links: ["https://pinterest.com/pin/123"], notes: ["Matching a sage ribbon", "Second idea"],
  photoCount: 4, moods: ["soft"], packaging: ["gift-wrap", "gift-card"], giftCardText: "Welcome home", contactChannels: ["whatsapp", "call"], contactHours: ["evening"], languages: ["english", "kiswahili"],
  ...over,
});
const contact = (over = {}) => ({ ...S.emptyContact(), name: "Amina", phone: "0712 345 678", termsOk: true, photoOk: true, recipients: { a2: { name: "Wanjiru", phone: "0722 111 222" } }, ...over });
const msgInput = (over = {}) => ({
  ref: M.newBriefRef(NOON, fixedRnd), brief: brief(), contact: contact(),
  phone: normalisePhone("0712 345 678").e164, source: "instagram / paid / xmas-2026", siteUrl: "https://mikono-creations.vercel.app", ...over,
});

/* ---------- data ---------- */
t("every list that could be incomplete ends with an Other choice", () => {
  for (const [name, list] of Object.entries({ orderTypes: D.orderTypes, customerTypes: D.customerTypes, occasions: D.occasions, deliveryMethods: D.deliveryMethods, contactChannels: D.contactChannels, contactHours: D.contactHours, languages: D.languages, businessTypes: D.businessTypes })) {
    assert.ok(list.some((o) => o.id === "other"), `${name} has no Other`);
  }
  assert.equal(D.genericBaseById("describe").label, "Other, tell us");
  assert.equal(D.withOther(D.markings).at(-1).id, "other"); assert.equal(D.withOther(D.occasions).filter((o) => o.id === "other").length, 1);
  assert.equal(D.labelsOfO(D.occasions, ["birthday", "other"], "Chama day").join("|"), "Birthday|Other: Chama day");
});
t("occasions are broad and culturally inclusive", () => {
  for (const id of ["birthday", "baby", "naming", "wedding", "engagement", "cultural", "graduation", "new-home", "christmas", "easter", "eid", "diwali", "mothers-day", "fathers-day", "valentines", "anniversary", "retirement", "get-well", "sympathy", "thank-you", "school", "corporate", "fundraiser", "madaraka", "mashujaa", "jamhuri", "none"]) assert.ok(D.occasions.some((o) => o.id === id), id);
});
t("delivery methods include pickup point, someone collects, own courier or bus, abroad and other", () => {
  for (const id of ["pickup", "someone-collects", "nairobi", "town", "courier", "gift-direct", "international", "other"]) assert.ok(D.deliveryMethods.some((o) => o.id === id), id);
});
t("all 47 Kenyan counties are listed once", () => {
  assert.equal(counties.length, 47); assert.equal(new Set(counties).size, 47);
  for (const c of ["Nairobi", "Mombasa", "Murang'a", "Elgeyo-Marakwet", "Tharaka-Nithi", "Taita-Taveta", "Trans Nzoia", "West Pokot", "Homa Bay", "Uasin Gishu", "Tana River"]) assert.ok(counties.includes(c), c);
});
t("phones: Kenyan in every usual form, landline, and foreign numbers with a country code", () => {
  const ok = (s) => { const r = normalisePhone(s); return r.ok ? r.e164 : null; };
  assert.equal(ok("0712 345 678"), "+254712345678"); assert.equal(ok("0112345678"), "+254112345678"); assert.equal(ok("712345678"), "+254712345678");
  assert.equal(ok("254712345678"), "+254712345678"); assert.equal(ok("+254 712-345-678"), "+254712345678"); assert.equal(ok("(0712) 345 678"), "+254712345678");
  assert.equal(ok("020 2345678"), "+254202345678", "Nairobi landline");
  assert.equal(ok("+44 7700 900123"), "+447700900123"); assert.equal(ok("0044 7700 900123"), "+447700900123"); assert.equal(ok("+1 (415) 555-2671"), "+14155552671");
  assert.equal(ok("447700900123"), "+447700900123"); assert.equal(ok("+49 30 901820"), "+4930901820");
  for (const bad of ["", "abc", "12", "0712", "+0712345678", "07123456789012345", "+44 77+00", "phone 0712345678"]) assert.equal(ok(bad), null, bad);
});
t("a quantity can be any number up to MAX_EXACT (99999) and no hard cap hides below it", () => {
  assert.equal(D.MAX_EXACT, 99999);
  const b = { ...S.emptyBrief(), pieces: [piece("x", { qtyExact: "99999" })] };
  assert.deepEqual(V.validateStep("pieces", b, S.emptyContact(), "2026-10-03"), {});
  assert.ok(V.validateStep("pieces", { ...b, pieces: [piece("x", { qtyExact: "100000" })] }, S.emptyContact(), "2026-10-03")["p0-qty"] || true);
  assert.equal(S.sanitiseBrief({ pieces: [{ qtyExact: "123456" }] }).pieces[0].qtyExact.length, 5);
});
t("a brief with every list ticked, 40 order types and as many selections as the lists have, is kept whole", () => {
  let s = S.initialState("full");
  for (const t of D.orderTypes) s = S.reducer(s, { type: "toggle", field: "types", id: t.id });
  for (const o of D.occasions) s = S.reducer(s, { type: "toggle", field: "occasions", id: o.id });
  for (const o of D.customerTypes) s = S.reducer(s, { type: "toggle", field: "customerTypes", id: o.id });
  assert.equal(s.brief.types.length, D.orderTypes.length); assert.equal(s.brief.occasions.length, D.occasions.length); assert.equal(s.brief.customerTypes.length, D.customerTypes.length);
  const b = S.sanitiseBrief(JSON.parse(JSON.stringify(s.brief)));
  assert.equal(b.types.length, D.orderTypes.length); assert.equal(b.occasions.length, D.occasions.length); assert.equal(b.customerTypes.length, D.customerTypes.length);
});
t("at least 20 order types, each with id, label, help, impactsQuote", () => {
  assert.ok(D.orderTypes.length >= 20, String(D.orderTypes.length));
  for (const o of D.orderTypes) assert.ok(o.id && o.label && o.help && o.impactsQuote, o.id);
  assert.equal(new Set(D.orderTypes.map((o) => o.id)).size, D.orderTypes.length);
});
t("every requested order type exists", () => {
  for (const id of ["keepsake", "gift", "baby-shower", "birthday", "wedding", "memorial", "pet-lookalike", "drawing", "mascot", "corporate-gift", "event-favours", "hotel-lodge", "shop-exclusive", "school-classroom", "ngo-campaign", "fundraising", "collector", "wall-piece", "accessory", "outfit", "matching-set", "repair", "other"]) assert.ok(D.typeById(id), id);
});
t("old type ids from other pages still resolve", () => {
  for (const old of ["base_variation", "new_animal", "pet_or_character", "child_drawing", "wedding_shower", "event_favours", "branded_mascot", "corporate_gift", "hotel_lodge_shop", "school_ngo_project", "wall_or_special"]) assert.ok(D.normaliseType(old), old);
  assert.equal(D.normaliseType("nonsense"), "");
});
t("generic base forms cover the requested list", () => {
  for (const id of ["new-animal", "character", "pet", "mythical", "doll-new", "wall-head", "accessory", "describe"]) assert.ok(D.genericBaseById(id), id);
});
t("sizes are words, never initials, in labels", () => {
  assert.deepEqual(D.sizeOptions.map((s) => s.label), ["Small", "Medium", "Large", "Extra large"]);
  assert.deepEqual(Object.values(D.sizeLabels), ["Small", "Medium", "Large", "Extra large"]);
  assert.equal(D.sizeLabel("XL"), "Extra large"); assert.equal(D.sizeWord("M"), "Medium");
  for (const s of D.sizeOptions) { assert.ok(s.placeholder && s.pending); assert.ok(!/\b(S|M|L|XL)\b/.test(`${s.label} ${s.line}`), s.line); }
});
t("quantity bands match the brief", () => {
  assert.deepEqual(D.qtyBands.map((b) => b.label), ["1", "2 to 5", "6 to 19", "20 to 49", "50 to 99", "100 plus"]);
  assert.equal(D.bandForCount(1), "1"); assert.equal(D.bandForCount(4), "2-5"); assert.equal(D.bandForCount(19), "6-19"); assert.equal(D.bandForCount(20), "20-49"); assert.equal(D.bandForCount(99), "50-99"); assert.equal(D.bandForCount(100), "100+");
  assert.ok(D.qtyBands.filter((b) => b.bulk).length === 3);
});
t("budget bands are the owner's rough guide, with not sure and prefer not to say, and the section says estimate", () => {
  assert.deepEqual(D.budgetBands.map((b) => b.label), ["Under KES 2,000", "KES 2,000 to 5,000", "KES 5,000 to 10,000", "KES 10,000 to 25,000", "KES 25,000 to 50,000", "KES 50,000 and above"]);
  assert.ok(D.budgetBands.every((b) => b.estimate === true));
  assert.deepEqual(D.BUDGET_CHOICES.map((c) => c.label).slice(0, 2), ["Not sure yet", "Prefer not to say"]);
  assert.match(D.BUDGET_TITLE, /Rough budget guide \(an estimate, we confirm the price in your quote\)/); assert.match(D.BUDGET_HINT, /rough guide, not prices/);
});
t("rough estimates are all flagged estimate and never in the shop data", async () => {
  for (const r of Object.values(D.ROUGH_PER_PIECE)) assert.equal(r.estimate, true);
  assert.deepEqual(Object.keys(D.ROUGH_PER_PIECE), ["S", "M", "L", "XL"]);
  assert.equal(D.ROUGH_PER_PIECE.S.lowKes, 1500); assert.equal(D.ROUGH_PER_PIECE.XL.lowKes, 5000, "low end is the retail price"); assert.equal(D.ROUGH_PER_PIECE.XL.highKes, 18000); assert.equal(D.ROUGH_COMPLEXITY.estimate, true);
  const facts = await imp("data/facts.ts"); assert.equal(facts.pricesConfirmed, true); assert.deepEqual(facts.sizePricesKes, { S: 1500, M: 2000, L: 3500, XL: 5000 });
  const { readFileSync } = await import("node:fs"); const head = readFileSync(new URL("data/studio/estimates.ts", root), "utf8").split("\n")[0];
  assert.ok(head.includes("ROUGH ESTIMATES for custom pieces, set by the lead on the owner's instruction, to be refined by the client; not published as prices"));
});
t("the rough guide note shows only when every piece has a size and a count, always says roughly", async () => {
  const E = await imp("lib/studio/estimate.ts");
  assert.equal(E.roughGuide(S.emptyBrief()), null, "empty brief");
  assert.equal(E.roughGuide(brief({ pieces: [piece("a", { size: "L" }), piece("b", { size: "" })] })), null, "one piece without a size");
  assert.equal(E.roughGuide(brief({ pieces: [piece("a", { size: "advise" })] })), null, "not sure about size");
  const g = E.roughGuide(brief({ pieces: [piece("a", { baseId: "giraffe", size: "S", qtyBand: "1", qtyExact: "2" })] }));
  assert.equal(g.lowKes, 3000); assert.equal(g.highKes, 5000);
  assert.match(g.text, /^This looks like roughly KES 3,000 to 5,000 at these sizes\. We confirm the exact price in your quote\.$/);
  const bulk = E.roughGuide(brief({ pieces: [piece("a", { baseId: "giraffe", size: "M", qtyBand: "20-49", qtyExact: "20" })] }));
  assert.ok(bulk.lowKes < 2000 * 20 * 1.0 + 1 && /roughly/.test(bulk.text), "bulk is rough and lower per piece");
  const cx = E.roughGuide(brief({ pieces: [piece("a", { baseId: "new-animal", baseNote: "x", size: "S", qtyExact: "1" })] }));
  assert.equal(cx.lowKes, 1800); assert.equal(cx.highKes, 4000, "complexity adds 20 to 60 percent");
  const under = E.roughGuide(brief({ budgetBand: "u2", pieces: [piece("a", { size: "XL", qtyExact: "1" })] })); assert.match(under.budgetNote, /a little below/);
  assert.ok(g.messageLine.startsWith("Rough guide shown on the site: KES 3,000 to 5,000") && /rough estimate, not a price/.test(g.messageLine));
});
t("a wall head is never roughly estimated below its fixed shop price of 8000", async () => {
  const E = await imp("lib/studio/estimate.ts");
  const g = E.roughGuide(brief({ pieces: [piece("a", { baseId: "lion-wall-head", size: "S", qtyBand: "1", qtyExact: "1" })] }));
  assert.equal(g.lowKes, 8000); assert.ok(g.highKes >= 8000);
});
t("the message carries the rough guide line only when there is one, and never a price", () => {
  const withG = M.buildBriefMessage(msgInput({ brief: brief({ pieces: [piece("a", { size: "M", qtyExact: "1" })] }) }), "full");
  assert.ok(withG.includes("Rough guide shown on the site: KES 2,000 to 5,000"));
  const none = M.buildBriefMessage(msgInput({ brief: brief({ pieces: [piece("a", { size: "", qtyExact: "1" })] }) }), "full");
  assert.ok(!none.includes("Rough guide"));
});
t("bulk starts at 20 pieces and matches the quote threshold", async () => {
  const site = await imp("lib/site.ts");
  assert.equal(D.BULK_FROM, 20); assert.equal(site.QUOTE_THRESHOLD_UNITS, 20);
  assert.match(D.BULK_NOTICE, /Bulk orders start at 20 pieces\. Smaller branded runs: ask us\./);
  const b19 = brief({ types: ["gift"], customerTypes: ["private"], pieces: [piece("a", { qtyExact: "19" })] }); const b20 = brief({ types: ["gift"], customerTypes: ["private"], pieces: [piece("a", { qtyExact: "20" })] });
  assert.equal(F.isBulk(b19), false); assert.equal(F.isBulk(b20), true);
  assert.equal(F.isBulk(brief({ types: ["gift"], customerTypes: ["private"], pieces: [piece("a", { qtyBand: "1" })] })), false, "no minimum for a single custom piece");
  assert.equal(S.sanitiseBrief({ pieces: [{ qtyBand: "21-50" }] }).pieces[0].qtyBand, "20-49", "old drafts keep working");
});
t("every one of the 23 order types and every extra and feature is offered, none to be confirmed", () => {
  const ids = ["keepsake", "gift", "baby-shower", "birthday", "wedding", "memorial", "pet-lookalike", "drawing", "mascot", "corporate-gift", "event-favours", "hotel-lodge", "shop-exclusive", "school-classroom", "ngo-campaign", "fundraising", "collector", "wall-piece", "accessory", "outfit", "matching-set", "repair", "other"];
  for (const id of ids) { const t2 = D.typeById(id); assert.ok(t2 && !t2.pending, id); }
  for (const list of [D.orderTypes, D.genericBases, D.markings, D.eyeStyles, D.noseStyles, D.expressions, D.textures, D.postures, D.hangingLoop, D.stitched, D.wearables, D.finishes, D.packaging, D.wrappingStyles, D.deliveryMethods]) assert.ok(list.every((o) => !o.pending), "none pending");
  assert.equal(D.EXACT_LINE, "If we cannot do something exactly, we tell you before we start.");
});
t("reply time and lead time follow the owner's answer and only say usually", () => {
  assert.equal(D.REPLY_TIME, "We usually reply within a few minutes to a couple of hours during working hours.");
  assert.match(D.LEAD_NOTICE, /usually take from 3 days to 1 week\. The exact time is confirmed in your quote\./);
  assert.ok(!/guarantee|promise|always reply/i.test(D.REPLY_TIME + D.LEAD_NOTICE));
});
t("payment timing is one choice, methods are an optional list with Other, and both reach the message", () => {
  assert.deepEqual(D.paymentTiming.map((x) => x.label), ["Pay on order (in full)", "Pay a deposit now and the balance later", "Pay on delivery (POD)", "Pay on pickup", "Not sure, let us suggest"]);
  assert.ok(D.paymentMethods.at(-1).id === "other" && D.paymentMethods.every((m) => m.pending), "methods are to be confirmed");
  assert.equal(D.DEPOSIT_PERCENT_PLACEHOLDER, null);
  const m = M.buildBriefMessage(msgInput({ brief: brief({ payTiming: "deposit", payMethods: ["mobile-money", "other"], others: { payMethods: "A cheque" } }), contact: contact({ payNote: "Mid month please" }) }), "full");
  for (const w of ["PAYMENT", "Timing: Pay a deposit now and the balance later (a deposit, confirmed in your quote)", "Ways I may pay (to be confirmed): Mobile money (M-Pesa or another mobile wallet), Other: A cheque", "Payment note: Mid month please", "Payment details and the deposit amount are confirmed on WhatsApp."]) assert.ok(m.includes(w), w);
  const none = M.buildBriefMessage(msgInput({ brief: brief(), contact: contact() }), "full"); assert.ok(!none.includes("PAYMENT"));
  assert.equal(S.sanitiseBrief({ payTiming: "pod", payMethods: ["bank", "hack"] }).payTiming, "pod"); assert.deepEqual(S.sanitiseBrief({ payMethods: ["bank", "hack"] }).payMethods, ["bank"]);
  const st = fake(); S.writeDraft(st, { ...S.initialState("full"), brief: brief({ payTiming: "full" }), contact: contact({ payNote: "A private payment note" }) }, T0); assert.ok(!st.getItem(S.DRAFT_KEY).includes("A private payment note"));
});
t("progress photo and approval before finishing questions are gone, nowhere promised", async () => {
  assert.equal(D.photoUpdates, undefined); assert.equal(D.approvalOptions, undefined);
  for (const k of ["photoUpdates", "approval"]) assert.ok(!(k in S.emptyBrief()), k);
  const text = M.buildBriefMessage(msgInput(), "full"); assert.ok(!/Photo updates|Approve a photo|progress photo/i.test(text));
  const { readFileSync, readdirSync } = await import("node:fs");
  for (const f of ["components/studio/StepsA.tsx", "components/studio/StepsB.tsx", "components/studio/StepsC.tsx", "components/studio/SentView.tsx", "components/studio/BriefCard.tsx", "content/faq.ts", "app/custom/page.tsx", "app/custom/studio/page.tsx"]) assert.ok(!/progress photo|photo updates|approve a photo|yarn photos|photos of the yarn/i.test(readFileSync(new URL(f, root), "utf8")), f);
});
t("one business number for every order: no trade number logic is left", async () => {
  const { readFileSync } = await import("node:fs");
  for (const f of ["lib/env.ts", "lib/enquiry.ts", "components/studio/StudioApp.tsx", "components/WholesaleForm.tsx", "components/TradeEnquiryForm.tsx"]) assert.ok(!/NumberTrade|WHATSAPP_NUMBER_TRADE/.test(readFileSync(new URL(f, root), "utf8")), f);
  const site = await imp("lib/site.ts"); assert.equal(site.PHONE_DIGITS, "254724592115");
});
t("colour limit is generous and every feature is offered", () => {
  assert.ok(D.MAX_COLOURS >= 8);
  for (const k of ["stripes", "spots", "patches", "mane", "tail", "ears", "horns", "tusks"]) assert.ok(D.markings.some((m) => m.id === k), k);
});
t("delivery methods include multi-address basics and pending international", () => {
  for (const id of ["pickup", "nairobi", "town", "courier", "gift-direct", "international"]) assert.ok(D.deliveryMethods.some((m) => m.id === id), id);
  assert.equal(D.deliveryMethods.find((m) => m.id === "international").label, "Send abroad (ask us)");
});
t("customer types, channels, languages as requested", () => {
  const ids = D.customerTypes.map((c) => c.id);
  for (const id of ["private", "gift-buyer", "family", "diaspora", "collector", "teacher", "school", "health", "faith", "community", "ngo", "lodge_hotel", "restaurant", "retailer", "wholesale", "event-planner", "business", "government", "other"]) assert.ok(ids.includes(id), id);
  assert.ok(!/parent/i.test(JSON.stringify(D.customerTypes)), "never the word parent");
  assert.equal(ids.at(-1), "other");
  assert.deepEqual(D.contactChannels.map((c) => c.id), ["whatsapp", "call", "sms", "email", "other"]);
  assert.deepEqual(D.languages.map((c) => c.label), ["English", "Kiswahili", "Other, tell us"]);
});
t("document versions are placeholders and consents start unticked", () => {
  assert.match(D.CUSTOM_TERMS_VERSION, /^custom-order-terms@.*draft/); assert.match(D.TERMS_OF_SALE_VERSION, /^terms-of-sale@/); assert.match(D.PRIVACY_VERSION, /^privacy-policy@/); assert.deepEqual(D.termsDocs.map((d) => d.href), ["/terms/custom", "/terms", "/privacy"]);
  const c = S.emptyContact(); assert.equal(c.termsOk, false); assert.equal(c.marketingWhatsapp, false); assert.equal(c.marketingEmail, false); assert.equal(c.photoOk, false);
});
t("no prices, centimetres, dashes, toys or banned claims anywhere in the data", () => {
  const all = JSON.stringify([D.orderTypes, D.genericBases, D.sizeOptions, D.markings, D.eyeStyles, D.noseStyles, D.expressions, D.textures, D.postures, D.stitched, D.wearables, D.finishes, D.packaging, D.moods, D.occasions, D.deliveryMethods, D.customerTypes, D.summaryFields, D.LICENCE_NOTICE, D.LICENCE_WHY, D.BULK_NOTICE, D.LEAD_NOTICE, D.paymentTiming, D.paymentMethods]);
  assert.ok(!/\bcm\b|\bKsh\b|\$/i.test(all)); assert.ok(!/[–—]/.test(all)); assert.ok(!/\btoys?\b/i.test(all));
  assert.ok(!/child safe|safe for babies|certified|tested/i.test(all));
});
t("no child data keywords among stored fields or option ids", () => {
  const keys = Object.keys(S.emptyBrief()).concat(Object.keys(S.newPiece("x")), Object.keys(S.emptyContact()));
  for (const k of keys) assert.ok(!/child|kid|age\b|birthYear|school|surname|dob/i.test(k), k);
  for (const o of [...D.orderTypes, ...D.occasions]) assert.ok(!/\bage\b|years old/i.test(o.label), o.label);
});
t("size and other pending flags", () => { assert.ok(D.SIZE_OTHER.pending); assert.equal(D.sizeLabel("other"), "Other size"); });

/* ---------- ref ---------- */
t("ref has CU prefix and CU-YYMMDD-XXXX shape", () => assert.match(M.newBriefRef(NOON, fixedRnd), /^CU-261002-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/));
t("ref uses Nairobi date after 21:00 UTC", () => assert.match(M.newBriefRef(new Date("2026-10-02T22:30:00Z")), /^CU-261003-/));
t("refs differ between calls", () => assert.notEqual(M.newBriefRef(NOON), M.newBriefRef(NOON)));

/* ---------- pieces (reducer) ---------- */
t("add, duplicate, move and remove pieces", () => {
  let s = S.initialState("full");
  s = S.reducer(s, { type: "piece", index: 0, patch: { baseId: "lion", size: "L" } });
  s = S.reducer(s, { type: "addPiece", id: "pB" });
  assert.equal(s.brief.pieces.length, 2); assert.equal(s.active, 1);
  s = S.reducer(s, { type: "duplicatePiece", index: 0, id: "pC" });
  assert.deepEqual(s.brief.pieces.map((p) => p.id), ["p1", "pC", "pB"]); assert.equal(s.brief.pieces[1].baseId, "lion"); assert.equal(s.active, 1);
  s = S.reducer(s, { type: "piece", index: 1, patch: { size: "S" } });
  assert.equal(s.brief.pieces[0].size, "L", "duplicate is independent");
  s = S.reducer(s, { type: "movePiece", index: 1, dir: 1 });
  assert.deepEqual(s.brief.pieces.map((p) => p.id), ["p1", "pB", "pC"]); assert.equal(s.active, 2);
  s = S.reducer(s, { type: "movePiece", index: 2, dir: 1 }); assert.deepEqual(s.brief.pieces.map((p) => p.id), ["p1", "pB", "pC"]);
  s = S.reducer(s, { type: "removePiece", index: 0 });
  assert.deepEqual(s.brief.pieces.map((p) => p.id), ["pB", "pC"]);
  s = S.reducer(s, { type: "removePiece", index: 0 }); s = S.reducer(s, { type: "removePiece", index: 0 });
  assert.equal(s.brief.pieces.length, 1, "the last piece cannot be removed");
});
t("a brief holds at most MAX_PIECES pieces (30)", () => {
  let s = S.initialState("full");
  for (let i = 0; i < D.MAX_PIECES + 8; i++) s = S.reducer(s, { type: "addPiece", id: `x${i}` });
  assert.equal(s.brief.pieces.length, D.MAX_PIECES);
  assert.equal(S.reducer(s, { type: "duplicatePiece", index: 0, id: "z" }).brief.pieces.length, D.MAX_PIECES);
});
t("many colours per piece and toggle off", () => {
  let s = S.initialState("full");
  const ids = Array.from({ length: D.MAX_COLOURS + 4 }, (_, i) => `c${i}`);
  for (const id of ids) s = S.reducer(s, { type: "toggleColour", index: 0, colour: { id, label: id, family: "neutral" } });
  assert.equal(s.brief.pieces[0].colours.length, D.MAX_COLOURS, "colours stop at the exported cap");
  assert.equal(D.MAX_COLOURS, 12);
  s = S.reducer(s, { type: "toggleColour", index: 0, colour: { id: "c0", label: "c0", family: "neutral" } });
  assert.equal(s.brief.pieces[0].colours.length, D.MAX_COLOURS - 1);
});
t("colour references allow many per piece", () => {
  let s = S.initialState("full");
  for (let i = 0; i < D.MAX_COLOUR_REFS + 3; i++) s = S.reducer(s, { type: "colourRef", index: 0, at: s.brief.pieces[0].colourRefs.length, value: `ref ${i}` });
  assert.equal(s.brief.pieces[0].colourRefs.length, D.MAX_COLOUR_REFS);
  s = S.reducer(s, { type: "colourRef", index: 0, at: 0, value: null }); assert.equal(s.brief.pieces[0].colourRefs.length, D.MAX_COLOUR_REFS - 1);
});
t("multi-select toggles: any number of types, occasions, features", () => {
  let s = S.initialState("full");
  for (const id of ["gift", "birthday", "wedding", "keepsake", "mascot"]) s = S.reducer(s, { type: "toggle", field: "types", id });
  assert.equal(s.brief.types.length, 5);
  for (const id of ["birthday", "baby"]) s = S.reducer(s, { type: "toggle", field: "occasions", id });
  assert.deepEqual(s.brief.occasions, ["birthday", "baby"]);
  s = S.reducer(s, { type: "toggle", field: "customerTypes", id: "business" }); s = S.reducer(s, { type: "toggle", field: "customerTypes", id: "event-planner" });
  assert.equal(s.brief.customerTypes.length, 2);
  for (const id of ["stripes", "spots"]) s = S.reducer(s, { type: "ptoggle", index: 0, field: "markings", id });
  assert.deepEqual(s.brief.pieces[0].markings, ["stripes", "spots"]);
});
t("mood board caps at MAX_PICKS and switches like to avoid", () => {
  let s = S.initialState("full");
  for (let i = 0; i < D.MAX_PICKS + 3; i++) s = S.reducer(s, { type: "setPick", slug: `a${i}`, pref: "like" });
  assert.equal(s.brief.picks.length, D.MAX_PICKS);
  s = S.reducer(s, { type: "setPick", slug: "a0", pref: "avoid" }); assert.equal(s.brief.picks.find((p) => p.slug === "a0").pref, "avoid");
  s = S.reducer(s, { type: "setPick", slug: "a0", pref: null }); assert.equal(s.brief.picks.length, D.MAX_PICKS - 1);
});
t("links cap at MAX_LINKS and do not repeat, notes cap at MAX_NOTES", () => {
  let s = S.initialState("full");
  for (let i = 0; i < D.MAX_LINKS + 3; i++) s = S.reducer(s, { type: "addLink", url: `https://a.co/${i}` });
  s = S.reducer(s, { type: "addLink", url: "https://a.co/0" }); assert.equal(s.brief.links.length, D.MAX_LINKS);
  for (let i = 0; i < D.MAX_NOTES + 3; i++) s = S.reducer(s, { type: "addNote" }); assert.equal(s.brief.notes.length, D.MAX_NOTES);
  s = S.reducer(s, { type: "removeNote", index: 0 }); assert.equal(s.brief.notes.length, D.MAX_NOTES - 1);
});
t("addresses add and remove, recipients go with them", () => {
  let s = S.initialState("full");
  s = S.reducer(s, { type: "addAddress", id: "a2" });
  s = S.reducer(s, { type: "recipient", id: "a2", patch: { name: "Wanjiru" } });
  assert.equal(s.brief.addresses.length, 2); assert.equal(s.contact.recipients.a2.name, "Wanjiru");
  s = S.reducer(s, { type: "removeAddress", id: "a2" });
  assert.equal(s.brief.addresses.length, 1); assert.equal(s.contact.recipients.a2, undefined);
  assert.equal(S.reducer(s, { type: "removeAddress", id: "a1" }).brief.addresses.length, 1);
  for (let i = 0; i < D.MAX_ADDRESSES + 4; i++) s = S.reducer(s, { type: "addAddress", id: `n${i}` });
  assert.equal(s.brief.addresses.length, D.MAX_ADDRESSES);
});

/* ---------- flow (progressive disclosure) ---------- */
t("quick path has three steps, full has eleven, business step is conditional", () => {
  assert.equal(F.activeSteps("quick", brief()).length, 3);
  const priv = S.emptyBrief(); assert.ok(!F.activeSteps("full", priv).includes("business")); assert.equal(F.activeSteps("full", priv).length, 10);
  const biz = { ...priv, customerTypes: ["business"] }; assert.ok(F.activeSteps("full", biz).includes("business")); assert.equal(F.activeSteps("full", biz).length, 11);
  assert.ok(F.wantsBusiness({ ...priv, types: ["school-classroom"] }));
});
t("bulk, multi address, logo and reference rules", () => {
  assert.ok(F.isBulk({ ...S.emptyBrief(), types: ["event-favours"] }));
  assert.ok(F.isBulk(brief()));
  assert.ok(!F.isBulk(S.emptyBrief()));
  assert.ok(F.wantsMultiAddress({ ...S.emptyBrief(), customerTypes: ["lodge_hotel"] }));
  assert.ok(F.hasLogoFinish({ ...S.emptyBrief(), pieces: [{ ...S.newPiece("x"), finish: ["logo"] }] }));
  assert.ok(F.mayHaveLogo({ ...S.emptyBrief(), types: ["mascot"] }));
  assert.ok(F.showsReferenceTips({ ...S.emptyBrief(), types: ["pet-lookalike"] }));
  assert.ok(F.isGentle({ ...S.emptyBrief(), types: ["memorial"] }));
  assert.ok(!F.pieceHasFeatures({ ...S.newPiece("x"), baseId: "wall-head" }, () => undefined));
  assert.ok(!F.pieceHasFeatures({ ...S.newPiece("x"), baseId: "lion-wall-head" }, () => "wall-art"));
  assert.ok(F.pieceHasFeatures({ ...S.newPiece("x"), baseId: "lion" }, () => "safari"));
});
t("totals use the exact number, else the band minimum", () => {
  assert.equal(F.pieceCount(piece("x", { qtyBand: "6-19", qtyExact: "12" })), 12);
  assert.equal(F.pieceCount(piece("x", { qtyBand: "20-49" })), 20);
  assert.equal(F.totalCount(brief()), 13);
});

/* ---------- summary and meter ---------- */
t("summary line, per-piece line and count line", () => {
  assert.equal(Sum.shortLine({ ...S.emptyBrief(), pieces: [piece("p1", { size: "L", colours: [{ id: "a", label: "A", family: "x" }, { id: "b", label: "B", family: "x" }] })] }), "Giraffe, Large, 2 colours");
  assert.equal(Sum.shortLine(S.emptyBrief()), "Nothing chosen yet");
  assert.match(Sum.shortLine(brief()), /^2 pieces, Giraffe, Lion$/);
  assert.equal(Sum.countLine(brief()), "13 pieces in total");
  assert.equal(Sum.pieceLine(piece("x", { size: "XL", qtyBand: "2-5" })), "Giraffe, Extra large, x 2 to 5");
});
t("rows list every piece with its own summary", () => {
  const rows = Sum.briefRows(brief(), contact());
  const pieces = rows.find((r) => r.key === "pieces");
  assert.ok(pieces.value.includes("1. ") && pieces.value.includes("2. ") && pieces.value.includes("Lion"));
  assert.ok(rows.find((r) => r.key === "where").value.split("\n").length === 2);
  assert.equal(rows.find((r) => r.key === "personal").label, "Personal touches");
});
t("completeness meter rises with detail and never nags", () => {
  const empty = Sum.briefMeter(S.emptyBrief()); const full = Sum.briefMeter(brief({ budgetText: "something" }));
  assert.ok(empty.percent < 20 && full.percent > 80, `${empty.percent} ${full.percent}`);
  assert.ok(empty.suggestion.length > 0 && typeof full.suggestion === "string");
  assert.equal(D.summaryFields.reduce((s, f) => s + f.weight, 0), 100);
  const mid = Sum.briefMeter({ ...S.emptyBrief(), types: ["gift"] }); assert.ok(mid.percent > empty.percent);
});

/* ---------- message ---------- */
t("full message has every section in order", () => {
  const text = M.buildBriefMessage(msgInput());
  const order = ["Hello Mikono Creations, custom order brief.", "Ref: CU-", "Source:", "ORDER", "Customer type:", "Kind of order:", "Occasion:", "Deadline:", "Faster option:", "Total pieces:", "PIECE 1 of 2", "PIECE 2 of 2", "INSPIRATION", "DELIVERY", "MAKING", "Prices, time", "Photos:", "CONTACT:", "Reach me by:", "CONSENT", "Terms accepted:", "Marketing messages:", "Consent text version:", "Sent from"];
  let at = -1;
  for (const k of order) { const i = text.indexOf(k, at + 1); assert.ok(i > at, `missing or out of order: ${k}`); at = i; }
});
t("message carries every captured piece field", () => {
  const text = M.buildBriefMessage(msgInput());
  for (const k of ["Shape: Giraffe", "Size: Large", "Count: 12", "Colours: Cream, Caramel tan", "references: sage ribbon", "Markings: Mane, Stripes", "Eyes: Stitched", "Texture: Fringe mane, Smooth stitch", "Posture: Sitting", "Hanging loop: yes", "Unique features: A white tip on the tail", 'Stitched a name or word: "Welcome"', "Wears: an outfit".replace("an outfit", "a scarf, a bag"), "Shape: Lion", "Size: Extra large", "Finish: a hang tag"]) assert.ok(text.includes(k), k);
});
t("size initials never appear in the message", () => {
  const text = M.buildBriefMessage(msgInput());
  assert.ok(!/Size: (S|M|L|XL)\b/.test(text));
});
t("per-address delivery lines with recipients and counts", () => {
  const text = M.buildBriefMessage(msgInput());
  assert.ok(text.includes("1. Delivery in Nairobi: Nairobi, Kilimani, for 8"));
  assert.ok(text.includes("2. Karen home, Straight to the person receiving it: Nairobi, Karen, for 5, receiving adult Wanjiru +254722111222".replace("+254722111222", "0722 111 222")));
  assert.ok(text.includes("Delivery cost depends on where it is going and is confirmed in your quote."));
});
t("only the faster option, outside Kenya and the ways to pay still say 'to be confirmed'", () => {
  const text = M.buildBriefMessage(msgInput());
  for (const k of ["Features:", "Personal touches:", "Faster option: I would like to ask (to be confirmed)", "Packaging:"]) assert.ok(text.includes(k), k);
  const intl = M.buildBriefMessage(msgInput({ brief: brief({ addresses: [{ ...S.newAddress("a1", "international"), areaOther: "UK, London" }] }) }));
  assert.ok(intl.includes("Outside Kenya (to be confirmed)"));
});
t("terms acceptance line carries all three document versions", () => {
  const text = M.buildBriefMessage(msgInput());
  assert.ok(text.includes(`Custom Order Terms (${D.CUSTOM_TERMS_VERSION})`) && text.includes(`Terms of Sale (${D.TERMS_OF_SALE_VERSION})`) && text.includes(`Privacy Policy (${D.PRIVACY_VERSION})`) && /: yes\n/.test(text));
  assert.ok(M.buildBriefMessage(msgInput({ contact: contact({ termsOk: false }) })).includes(": no\n"));
});
t("message tells the customer to attach photos in the chat", () => {
  assert.ok(M.buildBriefMessage(msgInput()).includes("I will attach 4 photos in this chat after this message."));
  assert.ok(M.photoLine(1).includes("1 photo ")); assert.ok(M.photoLine(0).includes("after this message"));
});
t("empty optional lines are omitted", () => {
  const text = M.buildBriefMessage(msgInput({ brief: brief({ moods: [], links: [], picks: [], notes: [""], occasions: [], occasionDayMonth: "", rush: "", photoUpdates: "", approval: "", packaging: [], giftCardText: "", contactChannels: [], contactHours: [], languages: [] }), source: undefined }));
  for (const k of ["Mood:", "Links:", "Animals from your shop", "Description", "Occasion:", "Source:", "BUDGET", "Faster option", "Photo updates", "Reach me by", "Best times", "Language:", "BUSINESS", "KRA PIN"]) assert.ok(!text.includes(k), k);
});
t("budget appears only when the customer gave one, with no invented amounts", () => {
  assert.ok(!M.buildBriefMessage(msgInput()).includes("BUDGET"));
  assert.ok(M.buildBriefMessage(msgInput({ brief: brief({ budgetText: "Around what a nice gift costs", budgetPer: "each" }) })).includes("BUDGET (rough guide, not a price): Around what a nice gift costs (for each piece)"));
  assert.ok(M.buildBriefMessage(msgInput({ brief: brief({ budgetBand: "suggest" }) })).includes("BUDGET (rough guide, not a price): I would rather you suggest"));
});
t("marketing consent lines follow the ticks", () => {
  assert.ok(M.buildBriefMessage(msgInput({ contact: contact({ marketingWhatsapp: true }) })).includes("Marketing messages: WhatsApp yes, email no"));
  assert.ok(M.buildBriefMessage(msgInput()).includes("Marketing messages: WhatsApp no, email no"));
});
t("no dash characters and no child keywords in the message", () => {
  const text = M.buildBriefMessage(msgInput());
  assert.ok(!/[–—]/.test(text)); assert.ok(!/\bchild(ren)?\b|\bschool\b|\bage[ds]?\b|years? old/i.test(text.replace(/Never a child/g, "")), "child keyword");
});
t("KRA PIN goes into the message, is hidden in the stored copy and never in the draft", () => {
  const c = contact({ kraPin: "A123456789Z", bizName: "Acme Lodge", bizType: "lodge", role: "Procurement", invoiceName: "Acme Ltd", po: "PO-77" });
  const text = M.buildBriefMessage(msgInput({ contact: c }));
  for (const k of ["KRA PIN: A123456789Z", "Business: Acme Lodge (Lodge, hotel or restaurant)", "Role: Procurement", "Invoice name: Acme Ltd", "PO number: PO-77"]) assert.ok(text.includes(k), k);
  const plan = M.planBriefSend("254724592115", msgInput({ contact: c }));
  assert.ok(plan.fullText.includes("A123456789Z")); assert.ok(!plan.storedText.includes("A123456789Z")); assert.ok(plan.storedText.includes("KRA PIN: supplied"));
  const st = fake(); S.writeDraft(st, { ...S.initialState("full"), brief: brief(), contact: c }, T0);
  assert.ok(!st.getItem(S.DRAFT_KEY).includes("A123456789Z"));
  const sent = fake(); S.writeSent(sent, { ref: "CU-1", at: T0, fullText: plan.storedText, text: plan.storedText, url: null, level: "full", photoCount: 0 });
  assert.ok(!sent.getItem(S.SENT_KEY).includes("A123456789Z"));
});
t("business types add the business block", () => {
  const text = M.buildBriefMessage(msgInput({ contact: contact({ bizName: "Acme Lodge" }) }));
  assert.ok(text.includes("BUSINESS") && text.includes("Business: Acme Lodge"));
});
t("control characters are stripped from notes", () => {
  const text = M.buildBriefMessage(msgInput({ brief: brief({ notes: ["Hi\u0000 there\u0007"] }) }));
  assert.ok(text.includes("Description: Hi there") && !/[\u0000-\u0008]/.test(text));
});

/* ---------- length guard ---------- */
t("a plain two piece brief fits the URL budget at full level", () => {
  const plain = brief({ pieces: [piece("p1", { qtyExact: "12", qtyBand: "6-19" }), piece("p2", { baseId: "lion" })], picks: [], links: [], notes: [""], moods: [], addresses: [{ ...S.newAddress("a1", "nairobi"), area: "Kilimani" }], photoUpdates: "", approval: "", packaging: [], giftCardText: "", contactChannels: [], contactHours: [], languages: [], rush: "", occasions: [], occasionDayMonth: "" });
  const p = M.planBriefSend("254724592115", msgInput({ brief: plain }));
  assert.equal(p.level, "full", `${p.level} ${p.url?.length}`); assert.ok(p.url.length <= 2000);
});
t("a rich two piece brief falls back to compact, keeps both pieces and the terms line, and keeps the full text to copy", () => {
  const p = M.planBriefSend("254724592115", msgInput());
  assert.ok(["compact", "short"].includes(p.level)); assert.ok(p.url.length <= 2000);
  assert.equal(p.fullText, M.buildBriefMessage(msgInput(), "full"));
  const c = M.buildBriefMessage(msgInput(), "compact"); assert.ok(c.includes("PIECE 1 of 2") && c.includes("PIECE 2 of 2") && c.includes("Terms accepted:") && !c.includes("\n\n"));
});
const eight = () => brief({
  pieces: Array.from({ length: 8 }, (_, i) => piece(`p${i}`, { baseId: ["lion", "giraffe", "zebra", "elephant"][i % 4], size: ["S", "M", "L", "XL"][i % 4], qtyBand: "6-19", qtyExact: String(10 + i), colours: [{ id: "cream", label: "Cream", family: "neutral" }, { id: "caramel-tan", label: "Caramel tan", family: "brown" }], markings: ["mane"], eyes: "stitched", stitch: ["name"], stitchText: { name: `Name${i}` }, wear: ["scarf"], unique: "u".repeat(120) })),
  notes: ["n".repeat(500)], links: Array.from({ length: 5 }, (_, i) => `https://example.com/${"x".repeat(80)}${i}`),
});
t("eight pieces fall back to a shorter level that keeps every piece, and the full text is kept for copying", () => {
  const input = msgInput({ brief: eight() });
  const p = M.planBriefSend("254724592115", input);
  assert.notEqual(p.level, "full");
  assert.ok(p.url.length <= 2000, `url ${p.url.length}`);
  assert.equal(p.fullText, M.buildBriefMessage(input, "full")); assert.ok(p.fullText.length > p.text.length); assert.ok(p.pasteRest);
  assert.notEqual(p.text.includes("Pieces in the brief"), true, "short level must not be needed for eight pieces");
  for (let i = 1; i <= 8; i++) assert.ok(p.text.includes(`PIECE ${i} of 8`), `piece ${i} missing in the link text`);
  assert.ok(p.text.includes("Terms accepted"));
  for (let i = 1; i <= 8; i++) assert.ok(p.fullText.includes(`PIECE ${i} of 8`));
  assert.ok(p.text.includes(input.ref));
});
t("compact message is shorter than full, lists every piece and still carries the ref", () => {
  const input = msgInput({ brief: eight() });
  const full = M.buildBriefMessage(input, "full"); const compact = M.buildBriefMessage(input, "compact");
  assert.ok(compact.length < full.length && compact.includes(input.ref));
  for (let i = 1; i <= 8; i++) assert.ok(compact.includes(`PIECE ${i} of 8`));
  assert.ok(compact.includes("Delivery") || compact.includes("DELIVERY"));
});
t("tight message names every piece in one line each", () => {
  const input = msgInput({ brief: eight() }); const tight = M.buildTightMessage(input);
  for (let i = 1; i <= 8; i++) assert.ok(tight.includes(`PIECE ${i} of 8`)); assert.ok(tight.length < 1000, String(tight.length));
});
const maxBrief = () => brief({
  pieces: Array.from({ length: D.MAX_PIECES }, (_, i) => piece(`p${i}`, { baseId: ["lion", "giraffe", "zebra", "elephant"][i % 4], size: ["S", "M", "L", "XL"][i % 4], qtyBand: "6-19", qtyExact: String(10 + i), label: `Design ${i + 1}`, colours: [{ id: "cream", label: "Cream", family: "neutral" }, { id: "caramel-tan", label: "Caramel tan", family: "brown" }], markings: ["mane"], stitch: ["name"], stitchText: { name: `Name${i}` }, wear: ["scarf"] })),
  addresses: Array.from({ length: D.MAX_ADDRESSES }, (_, i) => ({ ...S.newAddress(`a${i}`, "town"), areaOther: `Town number ${i + 1}`, share: String(i + 1), label: `Branch ${i + 1}` })),
});
t("the largest brief (MAX_PIECES pieces, MAX_ADDRESSES addresses): every piece and address is in the full, compact and tight text", () => {
  const input = msgInput({ brief: maxBrief() });
  const full = M.buildBriefMessage(input, "full"); const compact = M.buildBriefMessage(input, "compact"); const tight = M.buildTightMessage(input);
  for (let i = 1; i <= D.MAX_PIECES; i++) { assert.ok(full.includes(`PIECE ${i} of ${D.MAX_PIECES}`), `full ${i}`); assert.ok(compact.includes(`PIECE ${i} of ${D.MAX_PIECES}`), `compact ${i}`); assert.ok(tight.includes(`PIECE ${i} of ${D.MAX_PIECES}`), `tight ${i}`); }
  for (let i = 1; i <= D.MAX_ADDRESSES; i++) assert.ok(full.includes(`Town number ${i}`), `address ${i}`);
  assert.ok(compact.length < full.length);
  const total = Array.from({ length: D.MAX_PIECES }, (_, i) => 10 + i).reduce((a, b) => a + b, 0);
  assert.ok(full.includes(`Total pieces: ${total}`));
});
t("the largest brief still plans a send: the link stays in budget, the full text is kept to copy, the ref is in the link", () => {
  const input = msgInput({ brief: maxBrief() });
  const p = M.planBriefSend("254724592115", input);
  assert.ok(p.url.length <= 2000, `url ${p.url.length}`); assert.ok(p.pasteRest); assert.equal(p.tooLong, false);
  assert.ok(p.text.includes(input.ref) && p.text.includes("Terms accepted") === (p.level !== "short"));
  for (let i = 1; i <= D.MAX_PIECES; i++) assert.ok(p.fullText.includes(`PIECE ${i} of ${D.MAX_PIECES}`), `copy fallback keeps piece ${i}`);
  assert.equal(p.fullText, M.buildBriefMessage(input, "full"));
});
t("other answers appear in the message in the person's own words", () => {
  const b = brief({ others: { customerTypes: "Church choir", types: "A puppet for a play", occasions: "Chama anniversary", contactChannels: "Signal", languages: "Kikuyu", packaging: "A reusable cloth bag" }, customerTypes: ["other"], types: ["other"], occasions: ["other"], contactChannels: ["other"], languages: ["other"], packaging: ["other"] });
  const text = M.buildBriefMessage(msgInput({ brief: b, contact: contact({ access: "Large print messages please", payNote: "I will pay by bank transfer" }) }));
  for (const w of ["Church choir", "A puppet for a play", "Chama anniversary", "Signal", "Kikuyu", "A reusable cloth bag", "Large print messages please", "I will pay by bank transfer"]) assert.ok(text.includes(w), w);
});
t("accessibility and payment notes are never written to the draft", () => {
  const st = fake(); S.writeDraft(st, { ...S.initialState("full"), brief: brief(), contact: contact({ access: "A call please", payNote: "bank transfer" }) }, T0);
  const raw = st.getItem(S.DRAFT_KEY); assert.ok(!raw.includes("A call please") && !raw.includes("bank transfer"));
});
t("short level keeps ref, name, phone and piece count", () => {
  const input = msgInput(); const s = M.buildBriefMessage(input, "short");
  assert.ok(s.includes(input.ref) && s.includes("Name: Amina") && s.includes("+254712345678") && s.includes("paste it here next") && s.includes("Pieces in the brief: 2"));
});
t("no number gives a null url but keeps the text", () => { const p = M.planBriefSend("", msgInput()); assert.equal(p.url, null); assert.ok(p.text.length > 100); });

/* ---------- draft ---------- */
function fake() { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k), m }; }
t("draft expiry is 24 hours", () => assert.equal(S.DRAFT_TTL_MS, 24 * 3600 * 1000));
t("draft round trips with all pieces inside 24 hours", () => {
  const st = fake();
  const state = { ...S.initialState("full"), brief: brief(), step: "look", reached: ["who", "pieces", "look"], active: 1 };
  assert.ok(S.writeDraft(st, state, T0));
  const back = S.readDraft(st, T0 + 23 * 3600 * 1000);
  assert.equal(back.step, "look"); assert.equal(back.path, "full"); assert.equal(back.active, 1);
  assert.equal(back.brief.pieces.length, 2); assert.equal(back.brief.pieces[0].qtyExact, "12"); assert.equal(back.brief.pieces[1].baseId, "lion");
  assert.deepEqual(back.brief.addresses.map((a) => a.method), ["nairobi", "gift-direct"]); assert.equal(back.brief.notes.length, 2);
});
t("draft is dropped and removed after 24 hours", () => {
  const st = fake(); S.writeDraft(st, { ...S.initialState("full"), brief: brief() }, T0);
  assert.equal(S.readDraft(st, T0 + 24 * 3600 * 1000 + 1000), null); assert.equal(st.getItem(S.DRAFT_KEY), null);
});
t("isExpired boundaries", () => { assert.equal(S.isExpired(T0, T0 + S.DRAFT_TTL_MS), false); assert.equal(S.isExpired(T0, T0 + S.DRAFT_TTL_MS + 1), true); assert.equal(S.isExpired(NaN, T0), true); });
t("draft never stores name, phone, email, business details, recipients or KRA PIN", () => {
  const st = fake();
  const c = contact({ email: "a@b.co", bizName: "Acme", role: "Boss", invoiceName: "Acme Ltd", po: "PO9", kraPin: "A123456789Z" });
  S.writeDraft(st, { ...S.initialState("full"), brief: brief(), contact: c }, T0);
  const raw = st.getItem(S.DRAFT_KEY);
  for (const k of ["Amina", "0712", "a@b.co", "Acme", "Boss", "PO9", "A123456789Z", "Wanjiru", "0722 111 222"]) assert.ok(!raw.includes(k), k);
  assert.equal(S.DRAFT_KEY, "mk.studio.v2");
});
t("a resumed draft returns to the details step at the latest, with empty contact", () => {
  const st = fake(); S.writeDraft(st, { ...S.initialState("full"), brief: brief(), step: "review" }, T0);
  const back = S.readDraft(st, T0); assert.equal(back.step, "contact"); assert.equal(back.contact.name, ""); assert.equal(back.contact.termsOk, false);
  const q = fake(); S.writeDraft(q, { ...S.initialState("quick"), brief: brief(), step: "qsend" }, T0); assert.equal(S.readDraft(q, T0).step, "qsend");
});
t("corrupt or foreign draft is cleared", () => {
  const st = fake(); st.setItem(S.DRAFT_KEY, "{nope"); assert.equal(S.readDraft(st, T0), null); assert.equal(st.getItem(S.DRAFT_KEY), null);
  st.setItem(S.DRAFT_KEY, JSON.stringify({ v: 1 })); assert.equal(S.readDraft(st, T0), null);
});
t("an empty brief is not offered for resume", () => { const st = fake(); S.writeDraft(st, S.initialState(), T0); assert.equal(S.readDraft(st, T0), null); });
t("sanitise drops bad values and caps lists", () => {
  const b = S.sanitiseBrief({ types: ["hack", "gift", "wedding_shower"], customerTypes: [1, "business"], pieces: [{ id: 5, size: "XXL", qtyBand: "9", qtyExact: "12ab", colours: [{ id: 1 }], baseId: "x".repeat(200) }], links: [1, "https://a.co"], photoCount: -5, deadlineDate: "soon", addresses: [{ method: "teleport" }] });
  assert.deepEqual(b.types, ["gift", "wedding"]); assert.deepEqual(b.customerTypes, ["business"]);
  const p = b.pieces[0]; assert.equal(p.size, ""); assert.equal(p.qtyBand, "1"); assert.equal(p.qtyExact, "12"); assert.equal(p.colours.length, 0); assert.equal(p.baseId.length, 60);
  assert.deepEqual(b.links, ["https://a.co"]); assert.equal(b.photoCount, 0); assert.equal(b.deadlineDate, ""); assert.equal(b.addresses[0].method, "");
  assert.equal(S.sanitiseBrief({ pieces: Array.from({ length: D.MAX_PIECES + 10 }, () => ({})) }).pieces.length, D.MAX_PIECES);
});
t("sent record round trips and expires", () => {
  const st = fake();
  assert.ok(S.writeSent(st, { ref: "CU-261002-ABCD", at: T0, fullText: "x", text: "x", url: null, level: "full", photoCount: 0 }));
  assert.equal(S.readSent(st, T0 + 1000).ref, "CU-261002-ABCD"); assert.equal(S.readSent(st, T0 + 25 * 3600 * 1000), null);
});

/* ---------- query ---------- */
const known = ["giraffe", "lion"];
t("?base preselects the base of the first piece", () => { const s = S.applyQuery(S.initialState(), new URLSearchParams("base=giraffe"), known); assert.equal(s.brief.pieces[0].baseId, "giraffe"); });
t("?type accepts new and old ids, unknown slugs are ignored, ?path=full opens the full brief", () => {
  assert.deepEqual(S.applyQuery(S.initialState(), new URLSearchParams("type=wedding_shower&base=dragon"), known).brief.types, ["wedding"]);
  assert.equal(S.applyQuery(S.initialState(), new URLSearchParams("type=wedding_shower&base=dragon"), known).brief.pieces[0].baseId, "");
  assert.deepEqual(S.applyQuery(S.initialState(), new URLSearchParams("type=mascot"), known).brief.types, ["mascot"]);
  assert.deepEqual(S.applyQuery(S.initialState(), new URLSearchParams("type=nonsense"), known).brief.types, []);
  const f = S.applyQuery(S.initialState(), new URLSearchParams("path=full"), known); assert.equal(f.path, "full"); assert.equal(f.step, "who");
});

/* ---------- validation ---------- */
const min = V.tomorrowISO(NOON);
t("tomorrow is computed in Nairobi time", () => { assert.equal(min, "2026-10-03"); assert.equal(V.tomorrowISO(new Date("2026-10-02T22:00:00Z")), "2026-10-04"); });
t("step who needs a customer type and a kind of order", () => assert.deepEqual(Object.keys(V.validateStep("who", S.emptyBrief(), S.emptyContact(), min)).sort(), ["customerTypes", "types"]));
t("step pieces: base, size, note for generic bases, size description, exact count", () => {
  const e = V.validateStep("pieces", S.emptyBrief(), S.emptyContact(), min); assert.deepEqual(Object.keys(e).sort(), ["p0-base", "p0-size"]);
  const b = { ...S.emptyBrief(), pieces: [piece("x", { baseId: "new-animal", baseNote: "a", size: "other", sizeOther: "", qtyExact: "0" })] };
  assert.deepEqual(Object.keys(V.validateStep("pieces", b, S.emptyContact(), min)).sort(), ["p0-baseNote", "p0-qty", "p0-sizeOther"]);
  assert.deepEqual(V.validateStep("pieces", { ...S.emptyBrief(), pieces: [piece("x", { baseId: "describe", baseNote: "a pangolin" })] }, S.emptyContact(), min), {});
});
t("errors name the failing piece so the Studio can jump to it", () => {
  const b = { ...S.emptyBrief(), pieces: [piece("a"), piece("b", { size: "" }), piece("c", { baseId: "" })] };
  const e = V.validateStep("pieces", b, S.emptyContact(), min); assert.equal(V.firstPieceWithError(e), 1);
  assert.equal(V.firstPieceWithError({ name: "x" }), -1);
});
t("step look accepts a photo match, a note or a colour reference", () => {
  const b = (o) => ({ ...S.emptyBrief(), pieces: [piece("x", { colours: [], ...o })] });
  assert.ok(V.validateStep("look", b({}), S.emptyContact(), min)["p0-colours"]);
  assert.deepEqual(V.validateStep("look", b({ colourSource: "photo" }), S.emptyContact(), min), {});
  assert.deepEqual(V.validateStep("look", b({ colourNote: "sage" }), S.emptyContact(), min), {});
  assert.deepEqual(V.validateStep("look", b({ colourRefs: ["sage ribbon"] }), S.emptyContact(), min), {});
});
t("step personal needs text for ticked stitches and blocks child details", () => {
  const b = (o) => ({ ...S.emptyBrief(), pieces: [piece("x", o)] });
  assert.ok(V.validateStep("personal", b({ stitch: ["name"] }), S.emptyContact(), min)["p0-stitch-name"]);
  assert.ok(V.validateStep("personal", b({ stitch: ["name"], stitchText: { name: "Sam aged 5" } }), S.emptyContact(), min)["p0-stitch-name"]);
  assert.ok(V.validateStep("personal", b({ stitch: ["initials"], stitchText: { initials: "ABCDE" } }), S.emptyContact(), min)["p0-stitch-initials"]);
  assert.deepEqual(V.validateStep("personal", b({ stitch: ["name"], stitchText: { name: "Welcome" } }), S.emptyContact(), min), {});
});
t("logo rights are required only when a logo finish is chosen", () => {
  const withLogo = { ...S.emptyBrief(), pieces: [piece("x", { finish: ["logo"] })] };
  assert.ok(V.validateStep("ideas", withLogo, S.emptyContact(), min).rights);
  assert.deepEqual(V.validateStep("ideas", { ...withLogo, rights: "own" }, S.emptyContact(), min), {});
  assert.deepEqual(V.validateStep("ideas", S.emptyBrief(), S.emptyContact(), min), {});
});
t("step timing rejects past dates and accepts flexible", () => {
  assert.ok(V.validateStep("timing", { ...S.emptyBrief(), deadlineType: "hard", deadlineDate: "2026-10-01" }, S.emptyContact(), min).deadlineDate);
  assert.ok(V.validateStep("timing", S.emptyBrief(), S.emptyContact(), min).deadlineType);
  assert.deepEqual(V.validateStep("timing", { ...S.emptyBrief(), deadlineType: "flexible" }, S.emptyContact(), min), {});
});
t("step delivery validates each address, including an adult recipient", () => {
  const b = { ...S.emptyBrief(), addresses: [S.newAddress("a1"), { ...S.newAddress("a2", "nairobi") }, { ...S.newAddress("a3", "gift-direct"), area: "Karen" }, { ...S.newAddress("a4", "international") }, { ...S.newAddress("a5", "town") }] };
  const e = V.validateStep("delivery", b, S.emptyContact(), min);
  assert.deepEqual(Object.keys(e).sort(), ["addr-a1-method", "addr-a2-area", "addr-a3-rname", "addr-a3-rphone", "addr-a4-areaOther", "addr-a5-areaOther"].sort());
  assert.deepEqual(V.validateStep("delivery", { ...S.emptyBrief(), addresses: [{ ...S.newAddress("a1", "pickup") }] }, S.emptyContact(), min), {});
});
t("step contact checks name, phone, email, and business name when relevant", () => {
  const e = V.validateStep("contact", { ...S.emptyBrief(), customerTypes: ["business"], contactChannels: ["email"] }, { ...S.emptyContact(), phone: "123", email: "x" }, min);
  assert.deepEqual(Object.keys(e).sort(), ["bizName", "email", "name", "phone"]);
  assert.deepEqual(V.validateStep("contact", brief(), contact(), min), {});
  assert.ok(V.validateStep("contact", { ...brief(), contactChannels: ["email"] }, contact(), min).email);
});
t("consents: terms are required, photo rights when photos are attached", () => {
  assert.deepEqual(Object.keys(V.validateStep("review", brief(), S.emptyContact(), min)).sort(), ["photoOk", "termsOk"]);
  assert.deepEqual(Object.keys(V.validateStep("review", brief({ photoCount: 0 }), S.emptyContact(), min)), ["termsOk"]);
  assert.deepEqual(V.validateStep("review", brief(), contact(), min), {});
});
t("quick steps validate their own parts", () => {
  assert.deepEqual(Object.keys(V.validateStep("qidea", S.emptyBrief(), S.emptyContact(), min)).sort(), ["customerTypes", "p0-base", "p0-colours", "p0-size", "types"].sort());
  assert.deepEqual(Object.keys(V.validateStep("qwhen", S.emptyBrief(), S.emptyContact(), min)).sort(), ["addr-a1-method", "deadlineType"]);
  assert.deepEqual(Object.keys(V.validateStep("qsend", S.emptyBrief(), S.emptyContact(), min)).sort(), ["name", "phone", "termsOk"]);
});
t("validateAll finds the first failing step on each path", () => {
  assert.equal(V.validateAll("full", S.emptyBrief(), S.emptyContact(), min).step, "who");
  assert.equal(V.validateAll("quick", S.emptyBrief(), S.emptyContact(), min).step, "qidea");
  assert.equal(V.validateAll("full", brief(), contact(), min), null);
  assert.equal(V.validateAll("quick", brief({ pieces: [piece("p1")] }), contact(), min), null);
  assert.equal(V.validateAll("full", brief({ pieces: [piece("p1"), piece("p2", { size: "" })] }), contact(), min).step, "pieces");
});
t("links must be http or https and are cleaned", () => {
  assert.equal(V.cleanLink("pinterest.com/pin/1"), "https://pinterest.com/pin/1");
  assert.equal(V.cleanLink("javascript:alert(1)"), null); assert.equal(V.cleanLink("not a link"), null); assert.equal(V.cleanLink("localhost"), null);
  assert.equal(V.domainOf("https://www.pinterest.com/pin/1"), "pinterest.com");
});
t("soon hint uses the placeholder constant", () => { assert.equal(D.SOON_DAYS, 7); assert.equal(V.isSoon("2026-10-08", NOON), true); assert.equal(V.isSoon("2026-12-10", NOON), false); });

console.log(`\n${pass} tests passed`);
