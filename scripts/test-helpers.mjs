// Tests for the shopping helpers: recommender logic, URL hash codec and the WhatsApp message builders.
// Runs against the real catalogue. Registers the project's "@/" alias loader, so TypeScript sources import directly.
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";

process.emitWarning = () => {};
const root = new URL("..", import.meta.url).pathname;
process.chdir(root);
register(pathToFileURL(root + "scripts/alias-loader.mjs").href);

const { helperAnimals } = await import(pathToFileURL(root + "lib/helpers/data.ts").href);
const G = await import(pathToFileURL(root + "lib/helpers/gift.ts").href);
const F = await import(pathToFileURL(root + "lib/helpers/family.ts").href);
const M = await import(pathToFileURL(root + "lib/helpers/message.ts").href);
const S = await import(pathToFileURL(root + "lib/helpers/size.ts").href);
const D = await import(pathToFileURL(root + "data/helpers.ts").href);
const C = await import(pathToFileURL(root + "lib/catalogue.ts").href);
const W = await import(pathToFileURL(root + "lib/whatsapp.ts").href);

let pass = 0;
const t = (name, fn) => { fn(); pass++; console.log(`ok  ${name}`); };

const animals = helperAnimals();
const bySlug = (s) => animals.find((a) => a.slug === s);

t("pool has every catalogue product, wall art, dolls and bags included", () => {
  assert.ok(animals.length >= 30, String(animals.length));
  assert.equal(animals.length, C.allProducts().filter((p) => p.colourways.length > 0).length);
  for (const k of ["wall", "dolls", "air", "sea", "pets", "safari"]) assert.ok(animals.some((a) => a.group === k), `group ${k}`);
  for (const slug of ["unicorn-wall-head", "doll", "dress-doll", "lion-head-handbag", "secretary-bird-wall-head"]) assert.ok(bySlug(slug), slug);
  assert.ok(animals.every((a) => a.colours.length > 0 && a.colours.every((c) => c.image.src.startsWith("/media/"))));
});
t("safari animals come first", () => {
  const firstNonSafari = animals.findIndex((a) => a.group !== "safari");
  assert.ok(animals.slice(0, firstNonSafari).every((a) => a.group === "safari"));
  assert.equal(animals[0].slug, "elephant");
});
t("every animal and colour matches the catalogue", () => {
  for (const a of animals) {
    const p = C.bySlug(a.slug);
    assert.ok(p, a.slug);
    assert.deepEqual(a.colours.map((c) => c.key).sort(), p.colourways.map((c) => c.key).sort());
  }
});

// Gift finder
const real = (p) => !!C.bySlug(p.animal.slug) && C.bySlug(p.animal.slug).colourways.some((c) => c.key === p.colour.key);
t("recommend returns three real, distinct animals", () => {
  const r = G.recommend(animals, { who: "child", occasion: "birthday", kind: "surprise", size: "M", mood: "any" });
  assert.equal(r.length, 3);
  assert.equal(new Set(r.map((p) => p.animal.slug)).size, 3);
  assert.ok(r.every(real));
});
t("kind safari returns safari animals", () => {
  const r = G.recommend(animals, { kind: "safari" });
  assert.ok(r.every((p) => p.animal.group === "safari"));
});
t("kind sea returns sea animals first", () => {
  const r = G.recommend(animals, { kind: "sea" });
  assert.deepEqual(new Set(r.slice(0, 3).map((p) => p.animal.group)), new Set(["sea"]));
  assert.deepEqual(r.map((p) => p.animal.slug).sort(), ["octopus", "shark", "turtle"]);
});
t("kind pets returns rabbit, cat, dog or goose", () => {
  const r = G.recommend(animals, { kind: "pets" });
  assert.ok(r.every((p) => ["rabbit", "cat", "dog", "goose"].includes(p.animal.slug)));
});
t("colour mood picks a colourway of that family", () => {
  const r = G.recommend(animals, { kind: "safari", mood: "blue" });
  const top = r[0];
  assert.equal(top.colour.family, "blue");
  assert.ok(top.reasons[0].startsWith("In your colour mood"));
  // elephant has blue family colourways and ranks first
  assert.equal(top.animal.slug, "elephant");
});
t("colour mood lists only real colour labels", () => {
  const r = G.recommend(animals, { mood: "red" });
  for (const p of r.filter((x) => x.colour.family === "red")) assert.ok(C.bySlug(p.animal.slug).colourways.some((c) => c.label === p.colour.label));
});
t("size answer is carried into the pick, default M", () => {
  assert.equal(G.recommend(animals, { size: "XL" })[0].size, "XL");
  assert.equal(G.recommend(animals, { size: "any" })[0].size, "M");
  assert.equal(G.recommend(animals, {})[0].size, "M");
});
t("collector favours animals with many colourways", () => {
  const r = G.recommend(animals, { who: "collector", kind: "surprise" });
  assert.ok(r[0].reasons.some((x) => /colourways in our shop/.test(x)));
  assert.ok(C.bySlug(r[0].animal.slug).colourways.length >= 3);
});
t("reasons are facts from the data and carry no claims", () => {
  const banned = /\b(safe|safety|age|aged|years|months|toy|toys|tested|certified|cheap|discount|sale|only \d+ left)\b/i;
  for (const answers of [{}, { kind: "safari", mood: "yellow", size: "L", who: "collector" }, { kind: "sea", mood: "any", size: "S" }, { kind: "pets", who: "baby" }]) {
    for (const p of G.recommend(animals, answers)) {
      assert.ok(p.reasons.length >= 1 && p.reasons.length <= 3);
      for (const r of p.reasons) assert.ok(!banned.test(r), r);
    }
  }
});
t("giraffe colourway count reason matches the catalogue", () => {
  const r = G.recommend(animals, { who: "collector", kind: "safari", mood: "any" });
  const g = r.find((p) => p.animal.slug === "giraffe");
  const n = C.bySlug("giraffe").colourways.length;
  if (g) assert.ok(g.reasons.some((x) => x.includes(`${n} colourways`)));
});
t("surprise is varied: at most two per group", () => {
  const r = G.recommend(animals, { kind: "surprise" });
  const counts = {};
  for (const p of r) counts[p.animal.group] = (counts[p.animal.group] ?? 0) + 1;
  assert.ok(Object.values(counts).every((n) => n <= 2));
});
t("moods offered all match something", () => {
  const moods = G.availableMoods(animals);
  assert.ok(moods.length >= 7);
  for (const m of moods.filter((x) => x.value !== "any" && x.value !== "other")) assert.ok(G.recommend(animals, { mood: m.value })[0].colour.family === m.value, m.value);
});
t("mood swatch pairs exist in the catalogue", () => {
  for (const m of D.MOODS.filter((x) => x.swatch)) {
    const a = bySlug(m.swatch[0]);
    assert.ok(a && a.colours.some((c) => c.key === m.swatch[1]), m.value);
    assert.equal(a.colours.find((c) => c.key === m.swatch[1]).family, m.value);
  }
});
t("gift finder offers broad occasions, every kind of product, and Other with free text", () => {
  for (const v of ["birthday", "baby-shower", "naming-ceremony", "wedding", "engagement", "cultural-ceremony", "graduation", "new-home", "christmas", "easter", "eid", "diwali", "mothers-day", "fathers-day", "valentines", "anniversary", "retirement", "get-well", "sympathy", "thank-you", "school-event", "corporate-event", "fundraiser", "madaraka-day", "mashujaa-day", "jamhuri-day", "just-because", "other"]) assert.ok(D.OCCASIONS.some((o) => o.value === v), v);
  for (const v of ["safari", "pets", "sea", "air", "wall", "dolls", "more", "surprise", "other"]) assert.ok(D.KINDS.some((o) => o.value === v), v);
  for (const list of [D.WHO, D.OCCASIONS, D.KINDS, D.SIZE_FEEL, D.MOODS]) assert.ok(list.some((o) => (o.value ?? o) === "other"));
  for (const k of ["wall", "dolls"]) assert.equal(G.recommend(animals, { kind: k }).filter((p) => p.animal.group === k).length, Math.min(3, animals.filter((a) => a.group === k).length), k);
  assert.ok(G.recommend(animals, { kind: ["other"], mood: ["other"], size: ["other"] }).length === 3, "Other alone still gives picks");
  assert.ok(!/parent/i.test(JSON.stringify(D.WHO)));
});
t("Other answers travel in the picks message in the person's words", () => {
  const picks = G.recommend(animals, { kind: ["sea"] });
  const text = M.buildGroupsMessage([{ picks, answers: { occasion: ["other"], other: { occasion: "Chama anniversary", kind: "a dragon", mood: "sage green", size: "cushion sized" } }, who: ["other: a neighbour"] }]);
  for (const w of ["Chama anniversary", "a neighbour", "a dragon", "sage green", "cushion sized"]) assert.ok(text.includes(w), w);
});
t("every grouped slug in data/helpers exists", () => {
  for (const s of Object.keys(D.GROUP_BY_SLUG)) assert.ok(C.bySlug(s), s);
});

// Size finder
t("size recommender maps uses to size classes", () => {
  assert.equal(S.sizeFor("cuddle").main, "L");
  assert.equal(S.sizeFor("shelf").main, "S");
  assert.equal(S.sizeFor("bedside").main, "M");
  assert.equal(S.sizeFor("display").main, "XL");
  assert.equal(S.sizeFor("nope"), null);
});
t("size copy has no centimetres or inches", () => {
  const all = JSON.stringify([D.SIZE_USES, D.SIZE_OBJECTS, D.SIZE_OBJECTS_NOTE, D.SIZE_FEEL]);
  assert.ok(!/\b\d+\s?(cm|mm|in|inch|inches|m)\b/i.test(all));
});

// Family: hash codec
const lines = [
  { slug: "elephant", colourKey: "grey", size: "M", qty: 2 },
  { slug: "giraffe", colourKey: "yellow-brown-spots", size: "L", qty: 1 },
  { slug: "monkey", colourKey: "brown-yellow-face", size: "S", qty: 3 },
];
t("hash round trip", () => {
  const h = F.encodeHash(lines);
  assert.equal(h, "family=elephant-grey-m.2,giraffe-yellow-brown-spots-l,monkey-brown-yellow-face-s.3");
  assert.deepEqual(F.decodeHash("#" + h, animals), lines);
});
t("hash decode drops unknown and broken entries and clamps over-limit quantities", () => {
  const d = F.decodeHash(`#family=elephant-grey-m,unicorn-pink-m,giraffe-nope-l,elephant-grey-xxl,%%%,monkey-brown-yellow-face-s.${D.FAMILY_MAX_QTY + 50}`, animals);
  assert.deepEqual(d.map((l) => `${l.slug}-${l.colourKey}-${l.size}:${l.qty}`), ["elephant-grey-M:1", `monkey-brown-yellow-face-S:${D.FAMILY_MAX_QTY}`], "a quantity over FAMILY_MAX_QTY is clamped to it");
  assert.equal(F.decodeHash(`#family=monkey-brown-yellow-face-s.${D.FAMILY_MAX_QTY}`, animals)[0].qty, D.FAMILY_MAX_QTY, "exactly the cap is kept");
  assert.deepEqual(F.decodeHash("", animals), []);
  assert.deepEqual(F.decodeHash("#other=1", animals), []);
});
t("hash decode is case insensitive and merges duplicates", () => {
  const d = F.decodeHash("#family=ELEPHANT-GREY-M.2,elephant-grey-m", animals);
  assert.deepEqual(d, [{ slug: "elephant", colourKey: "grey", size: "M", qty: 3 }]);
});
t("max FAMILY_MAX_LINES lines (24)", () => {
  const many = [];
  for (const a of animals) for (const c of a.colours) many.push({ slug: a.slug, colourKey: c.key, size: "M", qty: 1 });
  assert.equal(D.FAMILY_MAX_LINES, 24);
  assert.ok(many.length > D.FAMILY_MAX_LINES);
  assert.equal(F.normalise(many).length, D.FAMILY_MAX_LINES);
  assert.equal(F.decodeHash("#" + F.encodeHash(many), animals).length, D.FAMILY_MAX_LINES);
  const full = F.normalise(many);
  const r = F.addAnimal(full, animals.find((a) => !full.some((l) => l.slug === a.slug)));
  assert.equal(r.full, true);
  assert.equal(r.lines.length, D.FAMILY_MAX_LINES);
});
t("every real sku round trips through the hash", () => {
  for (const a of animals) for (const c of a.colours) for (const size of a.sizes) {
    const l = [{ slug: a.slug, colourKey: c.key, size, qty: 1 }];
    assert.deepEqual(F.decodeHash("#" + F.encodeHash(l), animals), l, `${a.slug} ${c.key} ${size}`);
    assert.equal(F.skuFor(l[0]), C.skuOf(a.slug, c.key, size));
  }
});
t("changing a line into an existing sku merges quantities", () => {
  const two = [{ slug: "elephant", colourKey: "grey", size: "M", qty: 1 }, { slug: "elephant", colourKey: "grey", size: "L", qty: 2 }];
  assert.deepEqual(F.updateLine(two, 1, { size: "M" }), [{ slug: "elephant", colourKey: "grey", size: "M", qty: 3 }]);
});
t("summary text", () => {
  assert.equal(F.summaryText([]), "No animals yet");
  assert.equal(F.summaryText([lines[0]]), "2 animals, 1 size");
  assert.equal(F.summaryText([{ ...lines[0], qty: 1 }, { ...lines[1] }, { ...lines[2], qty: 1 }]), "3 animals, 3 sizes");
  assert.equal(F.summaryText([{ ...lines[0], qty: 1 }, { ...lines[1], size: "M" }, { ...lines[2], size: "M", qty: 1 }]), "3 animals, 1 size");
});

// Messages
const msgLines = M.familyMsgLines(lines, animals);
const ref = W.generateRef();
t("message lines carry real names, labels and skus", () => {
  assert.equal(msgLines.length, 3);
  assert.deepEqual(msgLines[0], { sku: "elephant-grey-m", name: "Elephant", colourLabel: "Grey", size: "M", qty: 2 });
  assert.equal(msgLines[2].colourLabel, "Brown with yellow face and ears");
});
t("family message follows the order message format", () => {
  const text = M.buildFamilyMessage({ ref, lines: msgLines, summary: "6 animals, 3 sizes", shareUrl: "https://x.test/build-a-family#family=a" });
  const rows = text.split("\n");
  assert.equal(rows[0], "Hello Mikono Creations, I would like to order.");
  assert.match(rows[1], /^Order ref: MK-\d{6}-[2-9A-HJKMNP-Z]{4}$/);
  assert.ok(rows.includes("ITEMS"));
  assert.ok(rows.includes("1. 2 x Elephant, Grey, size medium, SKU elephant-grey-m"));
  assert.ok(rows.includes(W.PRICES_SENTENCE));
  assert.ok(text.includes("My family: https://x.test/build-a-family#family=a"));
  assert.ok(!/KES|discount|%/.test(text));
});
t("family message compact level drops the link", () => {
  const c = M.buildFamilyMessage({ ref, lines: msgLines, summary: "s", shareUrl: "https://x.test/#family=a" }, true);
  assert.ok(c.includes("1. 2x Elephant Grey Medium (elephant-grey-m)"));
  assert.ok(!c.includes("My family:"));
});
t("send plan stays inside the URL budget", () => {
  const many = [];
  for (const a of animals) for (const c of a.colours) many.push({ slug: a.slug, colourKey: c.key, size: "XL", qty: 20 });
  const ml = M.familyMsgLines(F.normalise(many), animals);
  const plan = M.planFamilySend("254724592115", { ref, lines: ml, summary: F.summaryText(F.normalise(many)), shareUrl: "https://mikono-creations.vercel.app/build-a-family#" + F.encodeHash(many) });
  assert.ok(plan.url && plan.url.startsWith("https://wa.me/254724592115?text="));
  assert.ok(plan.url.length <= W.URL_BUDGET + 200);
  const small = M.planFamilySend("254724592115", { ref, lines: msgLines, summary: "6 animals, 3 sizes", shareUrl: "https://x.test/" });
  assert.equal(small.level, "full");
});
t("picks message contains the picks and no names", () => {
  const picks = G.recommend(animals, { kind: "safari", mood: "blue", size: "L" });
  const text = M.buildPicksMessage(picks, { occasion: "baby-shower", who: "a baby" });
  assert.ok(text.includes("Occasion: baby shower"));
  assert.ok(text.includes("1. Elephant"));
  assert.equal(text.split("\n").filter((r) => /^\d\. /.test(r)).length, 3);
});
t("ask message is plain", () => {
  assert.equal(M.buildAskMessage("Giraffe", "Orange", "M"), "Hello Mikono Creations, I am interested in the giraffe (orange, size medium). Can you tell me the price and availability?");
});


// ---- multi-select, several people, several uses, repeated animals ----
t("gift finder: several kinds and moods are combined", () => {
  const r = G.recommend(animals, { kind: ["safari", "sea"], mood: ["blue", "yellow"] });
  assert.equal(r.length, 3);
  assert.ok(r.every((p) => ["safari", "sea"].includes(p.animal.group)));
  assert.ok(r[0].reasons[0].startsWith("In your colour mood") && / or /.test(r[0].reasons[0]));
});
t("gift finder: several sizes choose a size the animal comes in, in words", () => {
  const r = G.recommend(animals, { size: ["XL", "L"], kind: ["safari"] });
  assert.ok(r.every((p) => ["XL", "L"].includes(p.size)));
  assert.ok(r[0].reasons.some((x) => /Comes in (large|extra large), one of four sizes from Small to Extra large/.test(x)));
  assert.ok(r.every((p) => p.reasons.every((x) => !/\b(S|M|L|XL)\b/.test(x))));
});
t("gift finder: surprise and any choices still work as arrays; strings still work", () => {
  assert.equal(G.recommend(animals, { kind: ["surprise"], mood: ["any"], size: ["any"] }).length, 3);
  assert.equal(G.recommend(animals, { kind: "sea" }).length, 3);
  assert.deepEqual(G.many(undefined), []); assert.deepEqual(G.many("a"), ["a"]); assert.deepEqual(G.many(["a", "b"]), ["a", "b"]);
});
t("gift finder: each person gets their own picks", () => {
  const a = G.recommend(animals, { who: ["baby"], kind: ["sea"] }); const b = G.recommend(animals, { who: ["friend"], kind: ["pets"], mood: ["blue"] });
  assert.ok(a.every((p) => p.animal.group === "sea")); assert.ok(b.every((p) => ["rabbit", "cat", "dog", "goose"].includes(p.animal.slug)));
});
t("groups message lists each person and carries no names", () => {
  const g = [
    { picks: G.recommend(animals, { kind: ["sea"], size: ["L"] }), answers: { occasion: ["birthday", "baby-shower"] }, who: ["a baby"] },
    { picks: G.recommend(animals, { kind: ["safari"] }), answers: { occasion: ["christmas"] }, who: ["a friend"] },
  ];
  const text = M.buildGroupsMessage(g);
  assert.ok(text.includes("for 2 people") && text.includes("PERSON 1") && text.includes("PERSON 2"));
  assert.ok(text.includes("Occasion: birthday and baby shower") && text.includes("size large"));
  assert.equal(text.split("\n").filter((r) => /^\d\. /.test(r)).length, 6);
  assert.ok(!/[\u2013\u2014]/.test(text) && !/\bsize (S|M|L|XL)\b/.test(text));
  assert.ok(!M.buildGroupsMessage([g[0]]).includes("PERSON 1"));
});
t("size finder: several uses compare side by side", () => {
  const r = S.sizesFor(["cuddle", "shelf"]);
  assert.equal(r.items.length, 2); assert.deepEqual(r.mains, ["S", "L"]); assert.ok(r.alsos.includes("M") || r.alsos.includes("XL"));
  assert.deepEqual(S.sizesFor([]).mains, []); assert.deepEqual(S.sizesFor(["nope"]).items, []);
  assert.deepEqual(S.sizesFor(["display", "bedside", "cuddle"]).mains, ["M", "L", "XL"]);
});
t("size copy uses words, not initials", () => {
  const all = [D.SIZE_USES.map((u) => u.reason).join(" "), D.SIZE_FEEL.map((s) => `${s.label} ${s.hint}`).join(" "), D.SIZE_OBJECTS.map((s) => s.line).join(" ")].join(" ");
  assert.ok(!/\b(S|M|L|XL)\b/.test(all), all.match(/.{20}\b(S|M|L|XL)\b.{10}/)?.[0]);
  assert.deepEqual(D.SIZE_FEEL.slice(0, 4).map((s) => s.label), ["Small", "Medium", "Large", "Extra large"]);
});
t("family: the same animal in several sizes and colourways stays as separate lines", () => {
  const el = bySlug("elephant"); let lines = [];
  for (let i = 0; i < 4; i++) lines = F.addAnimal(lines, el).lines;
  assert.equal(lines.length, 4); assert.equal(new Set(lines.map((l) => F.skuFor(l))).size, 4);
  assert.ok(lines.every((l) => l.slug === "elephant"));
  const d = F.duplicateLine([{ slug: "elephant", colourKey: el.colours[0].key, size: "M", qty: 2 }], 0, animals);
  assert.ok(d.ok && d.lines.length === 2 && d.lines[1].qty === 1 && F.skuFor(d.lines[1]) !== F.skuFor(d.lines[0]));
  assert.equal(d.lines[1].colourKey, el.colours[0].key, "another size in the same colour comes first");
});
t("family: duplicate stops when every combination is taken or the family is full", () => {
  const a = animals.find((x) => x.colours.length === 1 && x.sizes.length === 1);
  if (a) { const l = [{ slug: a.slug, colourKey: a.colours[0].key, size: a.sizes[0], qty: 1 }]; assert.equal(F.duplicateLine(l, 0, animals).ok, false); }
  const many = []; for (const x of animals) for (const c of x.colours) for (const s of x.sizes) many.push({ slug: x.slug, colourKey: c.key, size: s, qty: 1 });
  const full = F.normalise(many); assert.equal(full.length, D.FAMILY_MAX_LINES); assert.equal(F.duplicateLine(full, 0, animals).ok, false);
});
t("family messages show sizes as words", () => {
  const ml = M.familyMsgLines([{ slug: "elephant", colourKey: bySlug("elephant").colours[0].key, size: "XL", qty: 1 }], animals);
  const text = M.buildFamilyMessage({ ref, lines: ml, summary: "1 animal, 1 size" });
  assert.ok(text.includes("size extra large") && !/size (S|M|L|XL),/.test(text));
});

t("the largest family (FAMILY_MAX_LINES lines of FAMILY_MAX_QTY): the link plan never loses an animal, the copy text lists every line", () => {
  const many = [];
  for (const a of animals) for (const c of a.colours) for (const size of a.sizes) many.push({ slug: a.slug, colourKey: c.key, size, qty: D.FAMILY_MAX_QTY });
  const lines = F.normalise(many); assert.equal(lines.length, D.FAMILY_MAX_LINES);
  const ml = M.familyMsgLines(lines, animals);
  const plan = M.planFamilySend("254724592115", { ref, lines: ml, summary: F.summaryText(lines), shareUrl: "https://mikono-creations.vercel.app/build-a-family#" + F.encodeHash(lines) });
  assert.ok(plan.url.length <= W.URL_BUDGET, String(plan.url.length)); assert.ok(plan.text.includes(ref));
  for (let i = 1; i <= lines.length; i++) assert.ok(plan.fullText.includes(`\n${i}. `), `line ${i} in the copy text`);
  assert.ok(plan.level === "short" ? plan.pasteRest : true);
  const compact = M.buildFamilyMessage({ ref, lines: ml, summary: "s" }, true);
  for (let i = 1; i <= lines.length; i++) assert.ok(compact.includes(`\n${i}. `), `line ${i} in the compact text`);
  assert.equal(F.decodeHash("#" + F.encodeHash(lines), animals).length, D.FAMILY_MAX_LINES);
});
t("the largest gift finder (MAX_RECIPIENTS people) writes a block for each person", () => {
  assert.equal(D.MAX_RECIPIENTS, 20);
  const groups = Array.from({ length: D.MAX_RECIPIENTS }, (_, i) => ({ picks: G.recommend(animals, { kind: ["sea"], size: ["L"] }), answers: { occasion: ["birthday"] }, who: ["a friend"] }));
  const text = M.buildGroupsMessage(groups);
  for (let i = 1; i <= D.MAX_RECIPIENTS; i++) assert.ok(text.includes(`PERSON ${i}`), `person ${i}`);
});

console.log(`\n${pass} passed`);
