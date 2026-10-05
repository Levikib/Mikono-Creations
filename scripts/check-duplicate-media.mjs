// Fails when one page shows the same photo twice. Run after a build: npm run build && npm run qa:media
// It reads the prerendered HTML in .next/server/app, collects every /media/ image per page, and groups files that are
// the same picture (same bytes at a glance, found by a small difference hash) or the same moment saved twice (SAME_SCENE).
// Product pages are skipped: their gallery shows each photo once as a large view and once as a thumbnail on purpose.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import sharp from "sharp";

// Pages now reference pre-built variants (/media-opt/<path>-<w>.webp). Map them back to the original /media file.
const variantToSource = new Map();
try {
  const manifest = JSON.parse(readFileSync(new URL("../data/imageManifest.generated.json", import.meta.url), "utf8"));
  for (const e of Object.values(manifest)) for (const v of e.variants) variantToSource.set(v.webp, e.src);
} catch { /* no manifest: only direct /media/ URLs are checked */ }

const root = new URL("..", import.meta.url).pathname;
const appDir = join(root, ".next/server/app");
if (!existsSync(appDir)) { console.error("No build found. Run npm run build first."); process.exit(2); }

// Two frames or crops of one moment that the hash cannot link. Mirrors sameScene in content/photos.ts.
const SAME_SCENE = [
  ["/media/story/maker-at-stall.jpg", "/media/moments/moment-01-market-stall.jpg"],
  ["/media/story/trimming-lion-mane.jpg", "/media/moments/moment-05-lion-mane.jpg"],
];

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out); else if (f.endsWith(".html")) out.push(p);
  }
  return out;
}

const hashCache = new Map();
async function dhash(file) {
  if (hashCache.has(file)) return hashCache.get(file);
  const path = join(root, "public", file);
  let h = null;
  if (existsSync(path)) {
    const { data } = await sharp(path).greyscale().resize(9, 8, { fit: "fill" }).raw().toBuffer({ resolveWithObject: true });
    h = [];
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) h.push(data[y * 9 + x] > data[y * 9 + x + 1] ? 1 : 0);
  }
  hashCache.set(file, h);
  return h;
}
const dist = (a, b) => a.reduce((n, v, i) => n + (v !== b[i] ? 1 : 0), 0);

const pages = walk(appDir).filter((f) => {
  const rel = relative(appDir, f);
  return !rel.startsWith("shop/") || rel === "shop.html"; // product pages and categories are cards, not galleries
}).filter((f) => !relative(appDir, f).startsWith("styleguide"))
  // The gallery lists every supplied photo once per topic, so a photo that fits two topics may show twice there by design.
  .filter((f) => !relative(appDir, f).startsWith("gallery"));

let bad = 0;
for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const files = [];
  for (const m of html.matchAll(/<img\b[^>]*?\ssrc="([^"]+)"/g)) {
    let src = m[1].replace(/&amp;/g, "&");
    const u = src.match(/[?&]url=([^&]+)/);
    if (u) src = decodeURIComponent(u[1]);
    if (variantToSource.has(src)) src = variantToSource.get(src);
    if (src.startsWith("/media/")) files.push(src);
  }
  const unique = [...new Set(files)];
  const groups = [];
  const scene = (f) => { const p = SAME_SCENE.find((g) => g.includes(f)); return p ? p[0] : null; };
  const seen = [];
  for (const f of files) {
    const h = await dhash(f);
    const hit = seen.find((s) => s.file === f || (scene(f) && scene(f) === scene(s.file)) || (h && s.h && dist(h, s.h) <= 6));
    if (hit) groups.push([hit.file, f]); else seen.push({ file: f, h });
  }
  if (groups.length) {
    bad++;
    console.error(`DUPLICATE on ${relative(appDir, file)}`);
    for (const [a, b] of groups) console.error(`  ${a}${a === b ? " (twice)" : `  =  ${b}`}`);
  }
  void unique;
}
if (bad) { console.error(`\n${bad} page(s) show a photo twice.`); process.exit(1); }
console.log(`ok: no photo appears twice on any of ${pages.length} pages`);
