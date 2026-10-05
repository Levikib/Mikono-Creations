// QA for content/journal-batch/part-b.ts
// Run: node scripts/qa-journal-batch-b.mjs
// It re-runs itself with Node's type stripping so the .ts files can be imported without a build step.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

if (!process.env.QA_JOURNAL_B_CHILD) {
  const r = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", fileURLToPath(import.meta.url)], {
    stdio: "inherit",
    env: { ...process.env, QA_JOURNAL_B_CHILD: "1" },
  });
  process.exit(r.status ?? 1);
}

const errors = [];
const warns = [];
const fail = (slug, msg) => errors.push(`${slug}: ${msg}`);
const warn = (slug, msg) => warns.push(`${slug}: ${msg}`);

const batchPath = join(ROOT, "content/journal-batch/part-b.ts");
const rawSource = readFileSync(batchPath, "utf8");
const { postsPartB: batch } = await import(pathToFileURL(batchPath).href);
const { posts: existing } = await import(pathToFileURL(join(ROOT, "content/journal.ts")).href);

// ---------- helpers ----------
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);

const blockText = (b) => {
  if (b.t === "p" || b.t === "h" || b.t === "note") return b.text;
  if (b.t === "ul" || b.t === "ol") return b.items.join(" ");
  if (b.t === "photo") return "";
  return "";
};
const bodyBlocks = (p) => p.blocks.filter((b) => b.t !== "image" && b.t !== "photo");
const bodyText = (p) => bodyBlocks(p).map(blockText).join(" ");
const words = (s) => s.split(/\s+/).filter(Boolean);
const wordCount = (p) => words(bodyText(p)).length;
const sentences = (s) =>
  s
    .replace(/\b(Mr|Mrs|Dr|St)\./g, "$1")
    .split(/(?<=[.!?:])\s+/)
    .map((x) => x.trim())
    .filter(Boolean);
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9+ ]/g, "").replace(/\s+/g, " ").trim();
const syllables = (w) => {
  w = w.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const m = w.match(/[aeiouy]{1,2}/g);
  return Math.max(1, m ? m.length : 1);
};

// ---------- file level ----------
if (rawSource.includes(EM) || rawSource.includes(EN)) fail("file", "em or en dash found in part-b.ts");
const scriptSource = readFileSync(fileURLToPath(import.meta.url), "utf8");
if (scriptSource.includes(EM) || scriptSource.includes(EN)) fail("script", "em or en dash found in the QA script");
if (/ - /.test(rawSource.replace(/\/\/.*$/gm, ""))) warn("file", "spaced hyphen found outside comments");

if (batch.length !== 12) fail("batch", `expected 12 posts, found ${batch.length}`);

// ---------- rules ----------
const BANNED_PHRASES = [
  "elevate", "unleash", "delve", "tapestry", "journey", "seamless", "in today's world", "more than just",
  "crafted with passion", "game-changer", "game changer", "game changing", "game-changing", "curated", "bespoke",
  "cutting-edge", "cutting edge", "world-class", "world class", "best-in-class", "premium quality", "high-quality",
  "magical", "adorable", "perfect for everyone", "look no further", "next level", "dive into", "embark",
  "treasure trove", "unlock", "revolutionise", "revolutionize", "passionate about", "we are proud to", "nestled",
  "vibrant", "rich heritage", "one-of-a-kind", "hand-picked", "lovingly", "embrace", "it's important to note",
  "it is important to note", "important to note", "when it comes to", "at the end of the day", "in conclusion",
  "to sum up", "in summary", "hakuna matata", "whether you are",
];
const BANNED_CLAIMS = [
  /\btoys?\b/i, /child[- ]?safe/i, /safe for (babies|children|kids|toddlers)/i, /\btested\b/i, /\bcertified\b/i,
  /\bnon[- ]?toxic\b/i, /hypoallergenic/i, /eco[- ]?friendly/i, /planet[- ]?friendly/i, /environmentally friendly/i,
  /\bbiodegradable\b/i, /zero waste/i, /carbon (neutral|negative)/i, /saves? the planet/i, /\bsuitable for\b/i,
  /\bages? \d/i, /\bfair(ly)? paid\b/i, /\bfair wage/i, /\bguarantee/i,
];
const KID_FACE_WORDS = /\b(child|children|kid|kids|baby|babies|toddler|boy|girl|infant)\b/i;
const ALLOWED_NUMBERS = new Set(["25", "2019", "2016", "2017", "1823", "1948"]);

const routeExists = (href) => {
  const clean = href.split("#")[0].split("?")[0];
  if (clean === "/") return true;
  const parts = clean.split("/").filter(Boolean);
  if (parts[0] === "shop" && parts.length === 2) {
    const cat = JSON.parse(readFileSync(join(ROOT, "data/catalogue.generated.json"), "utf8"));
    return cat.products.some((p) => p.slug === parts[1] && !p.hidden);
  }
  if (parts[0] === "journal" && parts.length === 2) {
    const all = new Set([...existing.map((p) => p.slug), ...batch.map((p) => p.slug)]);
    return all.has(parts[1]) && existsSync(join(ROOT, "app/journal/[slug]/page.tsx"));
  }
  let dir = join(ROOT, "app");
  for (const part of parts) {
    if (existsSync(join(dir, part))) dir = join(dir, part);
    else return false;
  }
  return existsSync(join(dir, "page.tsx"));
};

const photoIds = new Set([...readFileSync(join(ROOT, "content/photos.ts"), "utf8").matchAll(/^\s{2}(\w+): p\(/gm)].map((m) => m[1]));
const allSlugs = new Set([...existing.map((p) => p.slug), ...batch.map((p) => p.slug)]);

// ---------- sentence index across batch and existing ----------
const seen = new Map(); // normalised sentence -> first location
const dupSentences = [];
const indexSentences = (label, post, isBatch) => {
  const sets = [];
  for (const b of post.blocks) {
    if (b.t === "p" || b.t === "note") sets.push(sentences(b.text));
    else if (b.t === "ul" || b.t === "ol") sets.push(b.items.flatMap((i) => sentences(i)));
    else if (b.t === "h") sets.push([b.text]);
    else if (b.t === "photo" && b.caption) sets.push([b.caption]);
  }
  for (const list of sets) {
    for (const s of list) {
      const n = norm(s);
      if (words(n).length < 4) continue;
      if (seen.has(n)) {
        if (isBatch || seen.get(n).startsWith("batch:")) dupSentences.push(`${label}: "${s}" also in ${seen.get(n)}`);
      } else seen.set(n, label);
    }
  }
};
for (const p of existing) indexSentences(`existing:${p.slug}`, p, false);
for (const p of batch) indexSentences(`batch:${p.slug}`, p, true);
for (const d of dupSentences) errors.push(d);

// ---------- per post ----------
const slugsSeen = new Set();
const startRuns = [];
for (const p of batch) {
  const s = p.slug;

  // slug
  if (slugsSeen.has(s)) fail(s, "duplicate slug in batch");
  slugsSeen.add(s);
  if (existing.some((e) => e.slug === s)) fail(s, "slug already exists in content/journal.ts");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)) fail(s, "slug is not lower case kebab");

  // meta limits
  if (p.title.length > 60) fail(s, `title is ${p.title.length} characters (max 60)`);
  if (p.description.length > 150) fail(s, `description is ${p.description.length} characters (max 150)`);
  if (p.excerpt.length > 160) fail(s, `excerpt is ${p.excerpt.length} characters (max 160)`);
  if (p.description !== p.excerpt) warn(s, "description and excerpt differ");
  if (!/^2026-10-(1\d|2\d)$/.test(p.date)) fail(s, `date ${p.date} is outside 2026-10-10 to 2026-10-29`);
  if (!photoIds.has(p.cover)) fail(s, `cover "${p.cover}" is not a PhotoId in content/photos.ts`);
  if (!Array.isArray(p.tags) || p.tags.length === 0) fail(s, "tags missing");
  if (!["C", "D", "E"].includes(p.pillar)) fail(s, "pillar must be C, D or E");
  if (!p.cta?.text || !p.cta?.message) fail(s, "cta needs text and message");
  if (/\?$/.test(p.cta?.text ?? "") === false && !/[.?]$/.test(p.cta?.text ?? "")) warn(s, "cta text should end with a full stop or question mark");

  // word count and read time
  const wc = wordCount(p);
  if (wc < 450 || wc > 750) fail(s, `word count ${wc} is outside 450 to 750`);
  const mins = Math.max(1, Math.round(wc / 200));
  const rt = Number((p.readTime.match(/\d+/) || [0])[0]);
  if (Math.abs(rt - mins) > 1) fail(s, `readTime "${p.readTime}" does not fit ${wc} words`);

  // dashes and banned text, over every text field
  const fields = [p.title, p.excerpt, p.description, p.tag, ...p.tags, p.cta.text, p.cta.message, bodyText(p),
    ...p.images.flatMap((i) => [i.after ?? "", i.brief, i.altHint]), ...p.links.map((l) => l.label)];
  const all = fields.join("\n");
  if (all.includes(EM) || all.includes(EN)) fail(s, "em or en dash in text");
  const low = all.toLowerCase();
  for (const ph of BANNED_PHRASES) if (low.includes(ph)) fail(s, `banned phrase "${ph}"`);
  for (const re of BANNED_CLAIMS) {
    const m = all.match(re);
    if (m) fail(s, `banned word or claim "${m[0]}"`);
  }
  if (/[a-z]!/i.test(all) || /!/.test(all)) fail(s, "exclamation mark found");

  // numbers must be sourced
  const textForNumbers = [p.title, p.excerpt, bodyText(p), p.cta.text].join(" ");
  for (const m of textForNumbers.matchAll(/\d[\d,.]*/g)) {
    const n = m[0].replace(/[.,]$/, "");
    if (!ALLOWED_NUMBERS.has(n)) fail(s, `unsourced number "${n}"`);
  }

  // headings and structure
  const heads = p.blocks.filter((b) => b.t === "h").map((b) => b.text);
  if (heads.length < 3) fail(s, "needs at least 3 H2 sections");
  if (new Set(heads).size !== heads.length) fail(s, "duplicate headings");
  const types = new Set(p.blocks.map((b) => b.t));
  if (!types.has("ul") && !types.has("ol")) warn(s, "no list in post");

  // reading level
  const allSent = [];
  for (const b of bodyBlocks(p)) {
    if (b.t === "h") continue;
    const list = b.t === "ul" || b.t === "ol" ? b.items.flatMap((i) => sentences(i)) : sentences(b.text);
    allSent.push(...list);
  }
  const lens = allSent.map((x) => words(x).length);
  const maxLen = Math.max(...lens);
  const avgLen = lens.reduce((a, c) => a + c, 0) / lens.length;
  if (maxLen > 25) fail(s, `a sentence has ${maxLen} words (max 25): "${allSent[lens.indexOf(maxLen)]}"`);
  const over20 = lens.filter((l) => l > 20).length;
  if (over20 > 3) warn(s, `${over20} sentences are over 20 words`);
  if (avgLen > 16) fail(s, `average sentence length ${avgLen.toFixed(1)} is above 16`);
  const wl = words(allSent.join(" "));
  const syl = wl.reduce((a, w) => a + syllables(w), 0);
  const fk = 0.39 * (wl.length / allSent.length) + 11.8 * (syl / wl.length) - 15.59;
  if (fk > 9) fail(s, `Flesch-Kincaid grade ${fk.toFixed(1)} is above 9`);
  else if (fk > 8) warn(s, `Flesch-Kincaid grade ${fk.toFixed(1)} is above 8`);

  // questions: no stacking, few in body
  let qCount = 0;
  for (const b of p.blocks) {
    if (b.t === "h" || b.t === "image") continue;
    const list = b.t === "ul" || b.t === "ol" ? b.items.flatMap((i) => sentences(i)) : sentences(b.text);
    list.forEach((x, i) => {
      if (x.endsWith("?")) {
        qCount++;
        if (i > 0 && list[i - 1].endsWith("?")) fail(s, `stacked questions near "${x}"`);
      }
    });
  }
  if (qCount > 3) fail(s, `${qCount} questions in the body (max 3)`);

  // repeated sentence openings inside one paragraph
  for (const b of p.blocks) {
    if (b.t !== "p") continue;
    const list = sentences(b.text);
    let run = 1;
    for (let i = 1; i < list.length; i++) {
      const a = words(list[i]).slice(0, 2).join(" ").toLowerCase();
      const c = words(list[i - 1]).slice(0, 2).join(" ").toLowerCase();
      run = a === c ? run + 1 : 1;
      if (run >= 3) startRuns.push(`${s}: three sentences in a row start with "${a}"`);
    }
  }

  // image plan
  const slots = ["hero", "inline-1", "inline-2", "inline-3"];
  if (!Array.isArray(p.images) || p.images.length !== 4) fail(s, "images must have exactly 4 entries");
  else {
    p.images.forEach((im, i) => {
      if (im.slot !== slots[i]) fail(s, `images[${i}] slot should be ${slots[i]}`);
      if (!im.brief || im.brief.length < 20) fail(s, `${im.slot} brief is missing or too short`);
      if (!im.altHint || im.altHint.length < 10) fail(s, `${im.slot} altHint is missing`);
      if (KID_FACE_WORDS.test(`${im.brief} ${im.altHint}`)) fail(s, `${im.slot} image text mentions a child`);
      if (im.slot === "hero" && im.after !== null) fail(s, "hero must have after: null");
      if (im.slot !== "hero" && !heads.includes(im.after)) fail(s, `${im.slot} after "${im.after}" is not a heading`);
    });
  }
  const markers = p.blocks.filter((b) => b.t === "image").map((b) => b.slot);
  if (markers.join(",") !== "inline-1,inline-2,inline-3") fail(s, `image markers should be inline-1, inline-2, inline-3 in order, found [${markers.join(", ")}]`);
  if (p.blocks.some((b) => b.t === "photo")) fail(s, "photo blocks are not allowed, use image markers");
  let currentHead = null;
  p.blocks.forEach((b, i) => {
    if (b.t === "h") currentHead = b.text;
    if (b.t === "image") {
      const spec = p.images.find((im) => im.slot === b.slot);
      if (!spec || spec.after !== currentHead) fail(s, `${b.slot} marker sits under "${currentHead}" but images says "${spec?.after}"`);
      const prev = p.blocks[i - 1];
      if (!prev || prev.t === "h" || prev.t === "image") fail(s, `${b.slot} marker must follow a paragraph or list, not a heading or another image`);
      if (i === p.blocks.length - 1) fail(s, `${b.slot} marker cannot be the last block`);
    }
  });
  if (p.blocks[p.blocks.length - 1]?.t === "image") fail(s, "post cannot end on an image");

  // internal links and related
  if (!p.links || p.links.length < 2) fail(s, "needs at least 2 internal links");
  for (const l of p.links ?? []) {
    if (!l.href.startsWith("/")) fail(s, `link ${l.href} is not internal`);
    else if (!routeExists(l.href)) fail(s, `link ${l.href} does not resolve to a route or product`);
  }
  for (const r of p.related ?? []) if (!allSlugs.has(r)) fail(s, `related slug "${r}" does not exist`);
  if (!p.related || p.related.length < 1) fail(s, "related is empty");

  // sources
  if (!Array.isArray(p.sources)) fail(s, "sources must be an array");
  for (const u of p.sources ?? []) if (!/^https:\/\//.test(u)) fail(s, `source ${u} is not an https URL`);
  const needsSources = ["C", "D"].includes(p.pillar);
  if (needsSources && p.sources.length === 0) {
    const brief = /^(wash-less|what-a-second-life)/.test(s);
    if (!brief) fail(s, "sustainability and craft posts need sources");
  }

  // endings are unique
  const lastP = [...p.blocks].reverse().find((b) => b.t === "p");
  if (lastP) {
    const last = sentences(lastP.text).pop();
    const n = norm(last);
    const others = batch.filter((o) => o !== p).some((o) => norm(bodyText(o)).includes(n));
    if (others) fail(s, "final sentence appears in another batch post");
  }

  console.log(`${s.padEnd(48)} ${String(wc).padStart(4)} words  avg ${avgLen.toFixed(1)}  max ${maxLen}  grade ${fk.toFixed(1)}  ${p.readTime}`);
}
for (const r of startRuns) errors.push(r);

// batch level: no two posts share a first or last word group, titles unique
const titles = batch.map((p) => p.title.toLowerCase());
if (new Set(titles).size !== titles.length) errors.push("batch: duplicate titles");
const dates = batch.map((p) => p.date);
if (new Set(dates).size < 8) warns.push("batch: dates are bunched, spread them across more days");
const openers = batch.map((p) => words(bodyText(p)).slice(0, 3).join(" ").toLowerCase());
if (new Set(openers).size !== openers.length) errors.push("batch: two posts open with the same three words");

console.log("");
for (const w of warns) console.log("WARN  " + w);
for (const e of errors) console.log("FAIL  " + e);
console.log(errors.length ? `\n${errors.length} failure(s), ${warns.length} warning(s)` : `\nAll checks passed (${warns.length} warning(s))`);
process.exit(errors.length ? 1 : 0);
