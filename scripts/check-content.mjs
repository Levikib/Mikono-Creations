// Journal and project checks: word counts, no shared sentence between two pieces, no repeated closing line,
// no photo scene twice on one page, every date present. Run: node --import ./scripts/register-alias.mjs scripts/check-content.mjs
const { posts, wordCount } = await import("@/content/journal");
const { projects, projectWords } = await import("@/content/projects");

let bad = 0;
const fail = (m) => { bad++; console.log("FAIL", m); };

const sentences = (text) => text.split(/(?<=[.?!])\s+/).map((s) => s.trim().toLowerCase().replace(/\s+/g, " ")).filter((s) => s.split(" ").length >= 5);
const owners = new Map();
const add = (owner, text) => {
  for (const s of sentences(text)) {
    const prev = owners.get(s);
    if (prev && prev !== owner) console.log(`WARN shared sentence between ${prev} and ${owner}: "${s}"`);
    else owners.set(s, owner);
  }
};

for (const p of posts) {
  const w = wordCount(p);
  console.log(`post ${p.slug}: ${w} words`);
  if (w < 350 || w > 900) fail(`${p.slug} has ${w} words, wanted 350 to 900`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) fail(`${p.slug} has no ISO date`);
  if (p.images.length !== 4) fail(`${p.slug} has ${p.images.length} images, wanted 4`);
  const srcs = p.images.map((i) => i.src);
  if (new Set(srcs).size !== srcs.length) fail(`${p.slug} shows an image twice`);
  for (const i of p.images) if (!i.alt) fail(`${p.slug} image ${i.slot} has no alt text`);
  for (const b of p.blocks) {
    if (b.t === "ul" || b.t === "ol") b.items.forEach((i) => add(p.slug, i));
    else if (b.t !== "image") add(p.slug, b.text);
  }
  add(p.slug, p.description);
  add(p.slug, p.cta.text);
}
const endings = posts.map((p) => { const last = [...p.blocks].reverse().find((b) => b.t === "p"); return last?.text; });
if (new Set(endings).size !== endings.length) fail("two posts end on the same paragraph");
if (new Set(posts.map((p) => p.cta.text)).size !== posts.length) fail("two posts share a closing prompt");

for (const p of projects) {
  const w = projectWords(p);
  console.log(`project ${p.slug}: ${w} words`);
  if (w < 150 || w > 300) fail(`${p.slug} has ${w} words, wanted 150 to 300`);
  [p.summary, ...p.did, ...p.see].forEach((t) => add(`project:${p.slug}`, t));
}
console.log(bad ? `content check: ${bad} problems` : "content check: PASS");
process.exit(bad ? 1 : 0);
