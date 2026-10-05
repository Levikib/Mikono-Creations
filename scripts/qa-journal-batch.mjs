// QA for journal batch files. Usage: node scripts/qa-journal-batch.mjs [content/journal-batch/part-a.ts ...]
// Loads each part file by stripping TypeScript types with a regex pass and evaluating the exported array.
// Existing posts in content/journal.ts are read the same way for the repeated-sentence check.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const files = process.argv.slice(2).length ? process.argv.slice(2) : ["content/journal-batch/part-a.ts"];
const fail = [];
const bad = (post, msg) => fail.push(`${post}: ${msg}`);

// ---------- loading ----------
function extractArray(src, startRe) {
  const m = startRe.exec(src);
  if (!m) return [];
  let i = src.indexOf("[", m.index + m[0].length - 1);
  // skip type annotation brackets such as "Post[] = [" by finding "= ["
  const eq = src.indexOf("= [", m.index);
  i = src.indexOf("[", eq);
  let depth = 0, inStr = null, esc = false;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") inStr = c;
    else if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) return vm.runInNewContext("(" + src.slice(i, j + 1) + ")"); }
  }
  return [];
}
const loadBatch = (f) => extractArray(fs.readFileSync(path.join(root, f), "utf8"), /export const \w+\s*:\s*\w+\[\]\s*=\s*\[/);
const existing = extractArray(fs.readFileSync(path.join(root, "content/journal.ts"), "utf8"), /export const posts\s*:\s*Post\[\]\s*=\s*\[/);

// ---------- helpers ----------
const textOf = (b) => (b.t === "p" || b.t === "h" || b.t === "note" ? b.text : b.t === "ul" || b.t === "ol" ? b.items.join(" ") : "");
const bodyText = (p) => p.blocks.map(textOf).join(" ");
const words = (s) => s.split(/\s+/).filter(Boolean);
const sentences = (s) => s.split(/(?<=[.!?])\s+/).map((x) => x.trim().toLowerCase().replace(/\s+/g, " ")).filter((x) => words(x).length >= 4);
const allText = (p) => [p.title, p.description, p.cta.text, p.cta.message, ...p.links.map((l) => l.label), ...p.images.flatMap((i) => [i.brief, i.altHint, i.after ?? ""]), bodyText(p)].join("\n");

const BANNED = [
  "elevate", "unleash", "delve", "tapestry", "journey", "seamless", "in today's world", "more than just", "crafted with passion",
  "game-changer", "game changer", "game-changing", "game changing", "curated", "bespoke", "cutting-edge", "world-class", "best-in-class",
  "premium quality", "high-quality", "magical", "adorable", "perfect for everyone", "look no further", "next level", "dive into", "embark",
  "treasure trove", "unlock", "revolutionise", "revolutionize", "passionate about", "we are proud to", "nestled", "vibrant", "rich heritage",
  "one-of-a-kind", "hand-picked", "lovingly", "embrace", "it's important to note", "it is important to note", "whether you are",
  "child safe", "child-safe", "safe for babies", "safe for kids", "tested", "certified", "nothing to swallow", "choking", "cannot be pulled off",
  "toys", "toy ", "developmental", "milestone", "cure", "therapy", "age range", "years old", "months old",
];
// "tested" etc. are banned as claims; they must not appear at all in a batch file.

const routes = new Set(["/"]);
function walk(dir, rel = "") {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) { if (/^page\.(tsx|ts|mdx)$/.test(e.name)) routes.add("/" + rel); continue; }
    if (e.name.startsWith("_") || e.name === "api") continue;
    walk(path.join(dir, e.name), path.posix.join(rel, e.name.replace(/^\(.*\)$/, "")));
  }
}
walk(path.join(root, "app"));
const catalogue = JSON.parse(fs.readFileSync(path.join(root, "data/catalogue.generated.json"), "utf8"));
const productSlugs = new Set(catalogue.products.filter((p) => !p.hidden).map((p) => p.slug));
const normRoute = (r) => (r.length > 1 ? r.replace(/\/+$/, "") : r);
function routeOk(href) {
  const h = normRoute(href.split("#")[0].split("?")[0]);
  if (routes.has(h)) return true;
  const m = /^\/shop\/([^/]+)$/.exec(h);
  if (m && productSlugs.has(m[1])) return true;
  const j = /^\/journal\/([^/]+)$/.exec(h);
  return !!j; // journal slugs resolve once the batch is merged
}

// ---------- checks ----------
const batches = files.map((f) => ({ f, posts: loadBatch(f) }));
const seenSlugs = new Map(existing.map((p) => [p.slug, "content/journal.ts"]));
const seenSentences = new Map();
const existingSentences = new Set();
for (const p of existing) for (const b of p.blocks) for (const s of sentences(textOf(b))) existingSentences.add(s);

let total = 0;
for (const { f, posts } of batches) {
  if (!posts.length) fail.push(`${f}: no posts loaded`);
  for (const p of posts) {
    total++;
    const id = `${path.basename(f)}:${p.slug}`;
    const t = allText(p);
    const lower = t.toLowerCase();
    // dashes
    if (/[–—]/.test(JSON.stringify(p))) bad(id, "em or en dash found");
    if (/ - /.test(t)) bad(id, "spaced hyphen used as a dash");
    // limits
    if (p.title.length > 60) bad(id, `title ${p.title.length} chars`);
    if (p.description.length > 150) bad(id, `description ${p.description.length} chars`);
    if (!/^2026-10-(0[1-9]|[12]\d|3[01])$/.test(p.date)) bad(id, `date ${p.date}`);
    // slug
    if (seenSlugs.has(p.slug)) bad(id, `duplicate slug (also in ${seenSlugs.get(p.slug)})`);
    seenSlugs.set(p.slug, f);
    // words
    const wc = words(bodyText(p)).length;
    if (wc < 450 || wc > 750) bad(id, `word count ${wc}`);
    // banned
    for (const w of BANNED) if (lower.includes(w)) bad(id, `banned phrase "${w}"`);
    // exclamation marks
    if ((t.match(/!/g) || []).length > 1) bad(id, "more than one exclamation mark");
    // easy language: sentence length
    for (const s of t.split(/(?<=[.!?])\s+|\n/)) if (words(s).length > 25) bad(id, `sentence over 25 words: "${s.slice(0, 60)}..."`);
    // stacked rhetorical questions: two question sentences in a row
    const qs = bodyText(p).split(/(?<=[.!?])\s+/);
    for (let i = 1; i < qs.length; i++) if (qs[i].endsWith("?") && qs[i - 1].endsWith("?")) bad(id, "stacked questions");
    // images
    const slots = (p.images || []).map((i) => i.slot);
    if (slots.join() !== "hero,inline-1,inline-2,inline-3") bad(id, `images slots ${slots.join()}`);
    for (const i of p.images || []) {
      if (!i.brief || !i.altHint) bad(id, `image ${i.slot} missing brief or altHint`);
      if (i.slot === "hero" && i.after !== null) bad(id, "hero.after must be null");
      if (i.slot !== "hero" && !p.blocks.some((b) => b.t === "h" && b.text === i.after)) bad(id, `image ${i.slot}: heading "${i.after}" not found`);
      if (/\b(face|faces|smiling child|boy|girl)\b/i.test(i.brief) && !/\bno (faces|face|people)|hand only|no close faces/i.test(i.brief)) bad(id, `image ${i.slot} brief may show a face`);
    }
    // image block placement: slot present, after the heading the entry names
    for (const s of ["inline-1", "inline-2", "inline-3"]) {
      const idx = p.blocks.findIndex((b) => b.t === "image" && b.slot === s);
      if (idx < 0) { bad(id, `no image block for ${s}`); continue; }
      const entry = p.images.find((i) => i.slot === s);
      let h = -1;
      for (let k = idx; k >= 0; k--) if (p.blocks[k].t === "h") { h = k; break; }
      if (entry && h >= 0 && p.blocks[h].text !== entry.after) bad(id, `image block ${s} sits under "${p.blocks[h].text}" not "${entry.after}"`);
    }
    // sources
    if (!Array.isArray(p.sources)) bad(id, "sources missing");
    else for (const u of p.sources) if (!/^https:\/\//.test(u)) bad(id, `bad source url ${u}`);
    // wildlife posts need sources
    if (p.pillar === "A" && !p.sources.length) bad(id, "pillar A post with no sources");
    // links
    const hrefs = [...p.links.map((l) => l.href), p.cta.href];
    for (const h of hrefs) if (!routeOk(h)) bad(id, `link target not found: ${h}`);
    for (const h of hrefs) if (h.startsWith("/shop/") && !productSlugs.has(h.slice(6)) && !routes.has(h)) bad(id, `no such product: ${h}`);
    if (!p.links.length || !p.cta?.text || !p.cta?.message) bad(id, "needs links and cta");
    // raw inline paths in text
    for (const m of t.matchAll(/\/(shop|gifts|custom|size-finder)[\w/-]*/g)) if (!routeOk(m[0])) bad(id, `text path not found: ${m[0]}`);
    // digits: no prices or invented counts
    if (/\bKES\b|\bKsh\b|\bUSD\b|\$/.test(t)) bad(id, "price or currency found");
    // sentences
    for (const b of p.blocks) for (const s of sentences(textOf(b))) {
      if (existingSentences.has(s)) bad(id, `sentence also in existing post: "${s.slice(0, 70)}"`);
      const prev = seenSentences.get(s);
      if (prev && prev !== id) bad(id, `sentence also in ${prev}: "${s.slice(0, 70)}"`);
      else if (prev === id) bad(id, `sentence repeated in same post: "${s.slice(0, 70)}"`);
      seenSentences.set(s, id);
    }
  }
}

// whole-batch variety checks
for (const { posts } of batches) {
  const endings = posts.map((p) => textOf(p.blocks[p.blocks.length - 1]).toLowerCase());
  if (new Set(endings).size !== endings.length) fail.push("batch: two posts share the same ending");
}

if (fail.length) {
  console.error(`FAIL: ${fail.length} problem(s) across ${total} posts`);
  for (const m of fail) console.error(" - " + m);
  process.exit(1);
}
console.log(`OK: ${total} posts passed`);
