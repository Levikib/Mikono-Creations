// QA for content/journal-batch/part-c.ts. Run: node scripts/qa-journal-batch-c.mjs
// Needs Node 22.6+ (type stripping). If the import fails, run: node --experimental-strip-types scripts/qa-journal-batch-c.mjs
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const fails = [];
const fail = (slug, msg) => fails.push(`${slug}: ${msg}`);

const mod = await import(pathToFileURL(path.join(root, "content/journal-batch/part-c.ts")).href);
const posts = mod.postsC;

const BANNED = [
  "elevate", "unleash", "delve", "tapestry", "journey", "seamless", "in today's world", "more than just", "crafted with passion",
  "game-changer", "game changer", "game changing", "curated", "bespoke", "cutting-edge", "world-class", "best-in-class", "premium quality",
  "high-quality", "magical", "adorable", "perfect for everyone", "look no further", "next level", "dive into", "embark", "treasure trove",
  "unlock", "revolutionise", "passionate about", "we are proud to", "nestled", "vibrant", "rich heritage", "one-of-a-kind", "hand-picked",
  "lovingly", "embrace", "important to note", "child safe", "safe for babies", "certified", "tested for", "toys", "toy ",
];
const BANNED_RE = [/whether you are/i, /not just .{1,40}, it'?s/i];

const routes = new Set(["/"]);
function walk(dir, rel = "") {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name), rel + "/" + e.name);
    else if (e.name === "page.tsx") routes.add(rel || "/");
  }
}
walk(path.join(root, "app"));
const cat = JSON.parse(fs.readFileSync(path.join(root, "data/catalogue.generated.json"), "utf8"));
const productSlugs = new Set(cat.products.map((p) => p.slug));
const dynamicOk = (href) => {
  const clean = href.split("?")[0].split("#")[0];
  if (routes.has(clean)) return true;
  const m = /^\/shop\/([^/]+)$/.exec(clean);
  if (m && (productSlugs.has(m[1]) || routes.has(clean))) return true;
  const j = /^\/journal\/([^/]+)$/.exec(clean);
  return !!j;
};

const textOf = (b) => (b.t === "p" || b.t === "h" || b.t === "note" ? b.text : b.t === "ul" || b.t === "ol" ? b.items.join(" ") : "");
const sentences = (s) => s.split(/(?<=[.!?])\s+/).map((x) => x.trim().toLowerCase().replace(/[^a-z0-9' ]/g, "")).filter((x) => x.split(" ").length > 4);

// Existing posts: pull every string literal from journal.ts and journal-batch/*.ts (except this batch) for sentence comparison.
const seen = new Map();
const otherFiles = [path.join(root, "content/journal.ts")];
const bdir = path.join(root, "content/journal-batch");
for (const f of fs.readdirSync(bdir)) if (f.endsWith(".ts") && f !== "part-c.ts") otherFiles.push(path.join(bdir, f));
for (const f of otherFiles) {
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/"((?:[^"\\]|\\.)*)"/g)) for (const s of sentences(m[1])) seen.set(s, path.basename(f));
}

const slugs = new Set();
const internalSlugs = new Set(posts.map((p) => p.slug));
let n = 0;
for (const p of posts) {
  n++;
  const id = p.slug;
  if (slugs.has(id)) fail(id, "duplicate slug");
  slugs.add(id);
  if (p.title.length > 60) fail(id, `title ${p.title.length} chars`);
  if (p.description.length > 150) fail(id, `description ${p.description.length} chars`);
  if (p.excerpt.length > 160) fail(id, `excerpt ${p.excerpt.length} chars`);
  if (!/^2026-10-(2\d|3[01])$/.test(p.date)) fail(id, `date ${p.date}`);

  const body = p.blocks.map(textOf).filter(Boolean);
  const all = [p.title, p.description, p.excerpt, p.cta.text, p.cta.message, ...body, ...p.images.flatMap((i) => [i.brief, i.altHint, i.after ?? ""]), ...p.tags].join(" \n ");
  if (/[–—]/.test(all)) fail(id, "em or en dash");
  if (/ - /.test(all)) fail(id, "spaced hyphen used as dash");
  const low = all.toLowerCase();
  for (const b of BANNED) if (low.includes(b)) fail(id, `banned phrase "${b}"`);
  for (const r of BANNED_RE) if (r.test(all)) fail(id, `banned pattern ${r}`);
  if ((all.match(/!/g) ?? []).length > 0) fail(id, "exclamation mark");

  const words = body.join(" ").split(/\s+/).filter(Boolean).length;
  if (words < 450 || words > 750) fail(id, `word count ${words}`);

  // Easy language: average sentence length and long sentences.
  const sents = body.join(" ").split(/(?<=[.?])\s+/).filter(Boolean);
  const lens = sents.map((s) => s.split(/\s+/).length);
  const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
  if (avg > 15) fail(id, `average sentence length ${avg.toFixed(1)} (aim under 15)`);
  const long = sents.filter((s, i) => lens[i] > 28);
  if (long.length) fail(id, `${long.length} sentence(s) over 28 words: "${long[0].slice(0, 60)}..."`);

  // Images: four specs, one marker per inline slot, markers sit in the body, after text matches a real heading.
  if (p.images.length !== 4) fail(id, `images ${p.images.length}`);
  const slotsWanted = ["hero", "inline-1", "inline-2", "inline-3"];
  for (const s of slotsWanted) if (!p.images.some((i) => i.slot === s)) fail(id, `missing image slot ${s}`);
  const markers = p.blocks.filter((b) => b.t === "image").map((b) => b.slot);
  for (const s of ["inline-1", "inline-2", "inline-3"]) if (markers.filter((m) => m === s).length !== 1) fail(id, `marker ${s} count`);
  const heads = new Set(p.blocks.filter((b) => b.t === "h").map((b) => b.text));
  for (const i of p.images) {
    if (i.slot !== "hero" && !heads.has(i.after)) fail(id, `image ${i.slot} after "${i.after}" is not a heading`);
    if (!i.brief || !i.altHint) fail(id, `image ${i.slot} missing brief or altHint`);
    if (/child'?s face|children'?s faces?|smiling child/i.test(i.brief)) fail(id, `image ${i.slot} shows a child's face`);
  }

  // Marker follows the heading named in `after` (the section it ends, not starts).
  p.blocks.forEach((b, idx) => {
    if (b.t !== "image") return;
    const spec = p.images.find((i) => i.slot === b.slot);
    let h = null;
    for (let k = idx - 1; k >= 0; k--) if (p.blocks[k].t === "h") { h = p.blocks[k].text; break; }
    if (spec && h !== spec.after) fail(id, `marker ${b.slot} sits under "${h}" but spec says "${spec.after}"`);
  });

  // Links.
  if (!p.links.length) fail(id, "no internal links");
  for (const l of p.links) if (!dynamicOk(l.href)) fail(id, `bad link ${l.href}`);
  for (const r of p.related) if (!internalSlugs.has(r) && !/^(why-wholesale|how-to-choose-a-size|what-mikono-means|how-ordering-on-whatsapp-works)$/.test(r)) fail(id, `related slug not known: ${r}`);
  if (/\/shop\/[a-z-]+/.test(JSON.stringify(p.links)) === false) fail(id, "no shop link");

  // Sources needed when external holiday facts are stated.
  if (/(public holiday|second sunday|full moon|shawwal)/i.test(all) && p.sources.length === 0) fail(id, "states a holiday fact without sources");
  for (const u of p.sources) if (!/^https:\/\//.test(u)) fail(id, `bad source url ${u}`);

  // No invented specifics.
  if (/\bKES\s*\d|\bKsh\s*\d|\d+\s*(%|percent)/i.test(all)) fail(id, "price or percentage found");
  if (/\b(20(26|27))\b/.test(body.join(" "))) fail(id, "specific 2026 or 2027 date in body");

  // Repeated sentences, within the batch and against existing posts.
  for (const s of new Set(body.flatMap(sentences))) {
    if (seen.has(s)) fail(id, `repeated sentence (also in ${seen.get(s)}): "${s.slice(0, 60)}"`);
  }
  for (const s of new Set(body.flatMap(sentences))) seen.set(s, id);

  // Unique ending.
  const last = body[body.length - 1];
  for (const q of posts) if (q !== p && textOf(q.blocks.filter((b) => b.t !== "image").at(-1)) === last) fail(id, "same ending as " + q.slug);
}

console.log(`Checked ${n} posts.`);
if (posts.length !== 13) fails.push(`expected 13 posts, found ${posts.length}`);
if (fails.length) {
  console.log(`FAIL (${fails.length})`);
  for (const f of fails) console.log(" - " + f);
  process.exit(1);
}
console.log("PASS");
