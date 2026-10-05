// Tests for the enquiry builders (wholesale, partners, supply, custom, contact): several requests, animals, locations and contacts.
// Run from the repo root: node --no-warnings scripts/test-enquiry.mjs
import { register } from "node:module";
import assert from "node:assert/strict";

register("./alias-loader.mjs", new URL("./", import.meta.url));
const root = new URL("..", import.meta.url).href;
const imp = (p) => import(new URL(p, root).href);
const E = await imp("lib/enquiryForm.ts");
const W = await imp("lib/whatsapp.ts");

let pass = 0;
const t = (name, fn) => { fn(); pass++; console.log(`ok  ${name}`); };
const main = { role: "Ordering contact", name: "Amina W", phone: "+254712345678", email: "amina@example.com" };
const msg = (fields, extra = {}) => W.buildEnquiryMessage({ intro: "Hello Mikono Creations, wholesale request.", ref: "WS-261003-AAAA", fields, consentMarketing: false, ...extra });

t("wholesale lists several request types", () => {
  const f = E.wholesaleFields({ requests: ["price list", "quote", "sample pack"], business: "Savanna Gifts", main, contacts: [], outlets: [], sells: [], sellsOther: "", products: [], quantities: "", notes: "" });
  const m = msg(f);
  assert.ok(m.includes("Requests:\n- price list\n- quote\n- sample pack"), m);
});
t("a single request stays on one line", () => {
  const m = msg(E.wholesaleFields({ requests: ["quote"], business: "B", main, contacts: [], outlets: [], sells: [], sellsOther: "", products: [], quantities: "", notes: "" }));
  assert.ok(m.includes("Requests: quote"));
});
t("several animals with a quantity band each, from the catalogue", () => {
  const products = [
    { slug: "lion", name: "Lion", band: "20 to 49", size: "" },
    { slug: "elephant", name: "Elephant", band: "6 to 19", size: "M" },
    { slug: "", name: "", band: "1 to 5", size: "" },
  ];
  const m = msg(E.wholesaleFields({ requests: ["quote"], business: "B", main, contacts: [], outlets: [], sells: [], sellsOther: "", products, quantities: "", notes: "" }));
  assert.ok(m.includes("Animals of interest:\n- Lion (20 to 49)\n- Elephant, Medium (6 to 19)"), m);
  assert.equal(E.filledProducts(products).length, 2, "blank rows are ignored");
});
t("several locations for a retailer with several shops", () => {
  const m = msg(E.wholesaleFields({ requests: ["quote"], business: "B", main, contacts: [], outlets: [{ name: "Village Market", place: "Gigiri" }, { name: "", place: "Karen" }, { name: "", place: "" }], sells: [], sellsOther: "", products: [], quantities: "", notes: "" }));
  assert.ok(m.includes("Locations:\n- Village Market, Gigiri\n- Karen"), m);
});
t("ordering contact and billing contact", () => {
  const extra = [{ role: "Billing contact", name: "Joy K", phone: "0722 000 111", email: "joy@example.com" }, { role: "", name: "", phone: "", email: "" }];
  const m = msg(E.wholesaleFields({ requests: ["quote"], business: "B", main, contacts: extra, outlets: [], sells: [], sellsOther: "", products: [], quantities: "", notes: "" }));
  assert.ok(m.includes("Contacts:\n- Ordering contact: Amina W, +254712345678, amina@example.com\n- Billing contact: Joy K, +254722000111, joy@example.com"), m);
  assert.ok(!m.includes("- : "), "an empty extra contact adds nothing");
});
t("what the business sells: several choices plus own words", () => {
  const m = msg(E.wholesaleFields({ requests: ["quote"], business: "B", main, contacts: [], outlets: [], sells: ["Gift shop", "Lodge or camp"], sellsOther: "A tour company", products: [], quantities: "", notes: "" }));
  assert.ok(m.includes("What they sell:\n- Gift shop\n- Lodge or camp\n- A tour company"), m);
});
t("extra contacts need a name and a valid phone, an invalid email is flagged", () => {
  const e = E.validateExtras({ contacts: [{ role: "Billing contact", name: "J", phone: "12", email: "x" }, { role: "Other contact", name: "", phone: "", email: "" }] });
  assert.ok(e.contact0_name && e.contact0_phone && e.contact0_email);
  assert.equal(Object.keys(e).length, 3, "the empty second contact is ignored");
  assert.deepEqual(E.validateExtras({ contacts: [{ role: "Billing contact", name: "Joy", phone: "0722000111", email: "" }] }), {});
});
t("a location needs a town or area once it has anything in it", () => {
  assert.ok(E.validateExtras({ outlets: [{ name: "Shop", place: "" }] }).outlet0_place);
  assert.deepEqual(E.validateExtras({ outlets: [{ name: "", place: "" }] }), {});
});
t("lists have wide safety limits and the quantity bands reach the largest orders", () => {
  assert.equal(E.MAX_PRODUCTS, 40); assert.equal(E.MAX_OUTLETS, 40); assert.equal(E.MAX_CONTACTS, 20);
  assert.deepEqual([...E.QTY_BANDS], ["1 to 5", "6 to 19", "20 to 49", "50 to 99", "100 to 499", "500 or more", "Not sure yet"]);
});
t("Other answers and reply preferences reach the message in the person's own words", () => {
  const reach = { channels: ["WhatsApp", "Other, tell us"], channelOther: "Signal", times: ["Evening", "Weekends"], languages: ["Kiswahili", "Other, tell us"], languageOther: "Kikuyu", access: "Large print messages please" };
  const f = E.wholesaleFields({ requests: ["quote", "Other, tell us"], requestOther: "A tender for a county office", business: "B", main, contacts: [], outlets: [], sells: [], sellsOther: "", products: [], quantities: "", notes: "", reach, heard: ["Other, tell us"], heardOther: "A church notice" });
  const m = msg(f);
  for (const w of ["Other: A tender for a county office", "Other: Signal", "Other: Kikuyu", "Large print messages please", "evening", "weekends", "Other: A church notice"]) assert.ok(m.includes(w), w);
  assert.ok(m.includes("What would make this easier for me: Large print messages please"), m);
  const c = msg(E.contactFields({ topics: ["Other, tell us"], topicOther: "A school fair", name: "Li", phone: "+44 7911 123456", email: "li@example.com", products: [], message: "Hello", reach }));
  assert.ok(c.includes("About: Other: A school fair") && c.includes("Phone: +447911123456") && c.includes("Email: li@example.com"), c);
});
t("reply preferences are optional, and an unfinished Other or Email choice is explained", () => {
  assert.deepEqual(E.validateReach(E.emptyReach(), ""), {});
  const e = E.validateReach({ ...E.emptyReach(), channels: ["Other, tell us", "Email"], languages: ["Other, tell us"] }, "");
  assert.ok(e.channelOther && e.email && e.languageOther);
  assert.deepEqual(E.validateReach({ ...E.emptyReach(), channels: ["Email"] }, "a@b.co"), {});
  assert.deepEqual(E.reachFields(E.emptyReach()).filter(([, v]) => (Array.isArray(v) ? v.length : v)), []);
});
t("the largest lists (MAX_PRODUCTS animals, MAX_OUTLETS places, MAX_CONTACTS people) keep every row in the full text and a short link", () => {
  const products = Array.from({ length: E.MAX_PRODUCTS }, (_, i) => ({ slug: "s" + i, name: "Animal " + (i + 1), band: "500 or more", size: "M" }));
  const outlets = Array.from({ length: E.MAX_OUTLETS }, (_, i) => ({ name: "Shop " + (i + 1), place: "Town " + (i + 1) }));
  const contacts = Array.from({ length: E.MAX_CONTACTS }, (_, i) => ({ role: "Other contact", name: "Person " + (i + 1), phone: "+447911123456", email: "" }));
  const full = msg(E.wholesaleFields({ requests: ["quote"], business: "B", main, contacts, outlets, sells: [], sellsOther: "", products, quantities: "", notes: "" }));
  for (let i = 1; i <= E.MAX_PRODUCTS; i++) assert.ok(full.includes("- Animal " + i + ", Medium"), "animal " + i);
  for (let i = 1; i <= E.MAX_OUTLETS; i++) assert.ok(full.includes("- Shop " + i + ", Town " + i), "place " + i);
  for (let i = 1; i <= E.MAX_CONTACTS; i++) assert.ok(full.includes("Person " + i + ", +447911123456"), "person " + i);
  const plan = W.planEnquirySend("254700000000", "Hello Mikono Creations, wholesale request.", "WS-261003-AAAA", full);
  assert.equal(plan.level, "short"); assert.ok(plan.pasteRest && plan.url.length <= W.URL_BUDGET && plan.fullText === full);
});
t("trade enquiries carry payment timing and ways to pay, optional, with Other", () => {
  assert.deepEqual(E.payFields(E.emptyPay()).filter(([, v]) => (Array.isArray(v) ? v.length : v)), []);
  const pay = { timing: "deposit", methods: ["bank", "other"], other: "Cheque" };
  const m = msg(E.wholesaleFields({ requests: ["quote"], business: "B", main, contacts: [], outlets: [], sells: [], sellsOther: "", products: [], quantities: "", notes: "", pay }));
  for (const w of ["When I would like to pay: Pay a deposit now and the balance later (a deposit, confirmed in your quote)", "Bank transfer", "Other: Cheque", "Payment details and the deposit amount are confirmed on WhatsApp."]) assert.ok(m.includes(w), w);
  assert.ok(E.validatePay({ timing: "", methods: ["other"], other: "" }).payOther);
});
t("lead type for analytics picks the most specific request", () => {
  assert.equal(E.leadTypeFor(["price list", "quote", "sample pack"]), "quote");
  assert.equal(E.leadTypeFor(["price list", "sample pack"]), "sample_pack");
  assert.equal(E.leadTypeFor(["price list"]), "price_list");
  assert.equal(E.leadTypeFor(["reorder"]), "wholesale");
});
t("partner, supply and custom lists", () => {
  const base = { org: "Green School", main, contacts: [], outlets: [{ name: "", place: "Ngong" }], products: [], message: "A school fair" };
  const p = msg(E.tradeFields({ ...base, kind: "partner", types: ["school", "ngo or charity"], typeOther: "A club" }));
  assert.ok(p.includes("Kinds of partner:\n- school\n- ngo or charity\n- A club") && p.includes("Locations: Ngong"), p);
  const s = msg(E.tradeFields({ ...base, kind: "supply", types: ["yarn", "packaging", "transport"], typeOther: "" }));
  assert.ok(s.includes("What they supply:\n- yarn\n- packaging\n- transport"), s);
  const c = msg(E.tradeFields({ ...base, kind: "custom", types: ["colour", "size"], typeOther: "", products: [{ slug: "giraffe", name: "Giraffe", band: "6 to 19", size: "L" }, { slug: "zebra", name: "Zebra", band: "", size: "" }] }));
  assert.ok(c.includes("What to change:\n- colour\n- size") && c.includes("Animals of interest:\n- Giraffe, Large (6 to 19)\n- Zebra"), c);
});
t("contact form: several topics and animals", () => {
  const m = msg(E.contactFields({ topics: ["Delivery", "A custom piece"], name: "Amina", phone: "0712345678", products: [{ slug: "lion", name: "Lion", band: "", size: "S" }], message: "Hello" }));
  assert.ok(m.includes("About:\n- Delivery\n- A custom piece") && m.includes("Phone: +254712345678"));
  assert.ok(m.includes("Animals asked about: Lion, Small"), m);
});
t("the long enquiry falls back to a short message and keeps the full text", () => {
  const products = Array.from({ length: 12 }, (_, i) => ({ slug: "s" + i, name: "Hippopotamus number " + i, band: "20 to 49", size: "M" }));
  const outlets = Array.from({ length: 8 }, (_, i) => ({ name: "A long shop name " + i, place: "Somewhere far away " + i }));
  const full = msg(E.wholesaleFields({ requests: ["price list", "quote"], business: "B", main, contacts: [{ role: "Billing contact", name: "Joy", phone: "0722000111", email: "j@x.co" }], outlets, sells: ["Gift shop"], sellsOther: "", products, quantities: "many", notes: "n".repeat(400) }));
  const plan = W.planEnquirySend("254700000000", "Hello Mikono Creations, wholesale request.", "WS-261003-AAAA", full);
  assert.equal(plan.level, "short"); assert.equal(plan.pasteRest, true); assert.equal(plan.fullText, full); assert.ok(plan.url.length <= W.URL_BUDGET);
});
t("messages carry no em or en dashes and no child words", () => {
  const m = msg(E.wholesaleFields({ requests: ["quote"], business: "Savanna Gifts", main, contacts: [], outlets: [{ name: "Shop", place: "Karen" }], sells: ["School or fair"], sellsOther: "", products: [{ slug: "lion", name: "Lion", band: "6 to 19", size: "" }], quantities: "", notes: "" }));
  assert.ok(!/[–—]/.test(m));
  assert.ok(!/\b(age|birthday|child)\b/i.test(m));
});

console.log(`\n${pass} tests passed`);
