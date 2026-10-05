// Maps every supplied photo (media/raw img-001 to img-087) and the video (vid-001) to where it appears on the site.
// Run after a build for the real answer (it reads the prerendered HTML in .next/server/app, including the page data that
// holds the other colourways of a product). Without a build it falls back to scanning the source files.
//   node scripts/photo-coverage.mjs           table of unused ids first, then where every id appears
//   node scripts/photo-coverage.mjs --source  force the source scan
// Byte identical twins (same sha1, for example img-003 and img-086) count as used when their twin is used.
// Exit code 1 when any id is unused.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const json = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));
const forceSource = process.argv.includes("--source");

const merged = json("media/manifest/merged.json");
const allIds = merged.map((e) => e.id);

// Byte identical twins.
const sha = (p) => createHash("sha1").update(readFileSync(p)).digest("hex");
const byHash = new Map();
for (const id of allIds) {
  const f = join(root, "media/raw", id);
  if (!existsSync(f)) continue;
  const h = sha(f);
  byHash.set(h, [...(byHash.get(h) ?? []), id]);
}
const twinsOf = new Map();
for (const g of byHash.values()) for (const id of g) twinsOf.set(id, g);

// Public file -> raw ids.
const fileToIds = new Map();
const add = (file, id) => { if (id) fileToIds.set(file, [...(fileToIds.get(file) ?? []), id]); };
const sources = json("data/photoSources.json");
for (const [f, id] of Object.entries(sources.files)) add(f, id);
const cat = json("data/catalogue.generated.json");
const rawId = (sid) => (/^img-\d+\.jpg$/.test(sid) ? sid : sources.aliases[sid] ?? null);
for (const p of cat.products) for (const im of [...p.colourways.flatMap((c) => c.images), ...p.range]) {
  add(im.src, rawId(im.source_id));
  if (im.cardSrc) add(im.cardSrc, rawId(im.source_id));
}
const gal = json("data/gallery.generated.json");
for (const it of gal.items) { add(it.src, it.id); if (it.cardSrc) add(it.cardSrc, it.id); for (const t of it.twins ?? []) { add(it.src, t); } }
add(gal.video.src, gal.video.id); add(gal.video.poster, gal.video.id);

// Built variants (/media-opt/<path>-<w>.webp) back to the original file.
const variantToSource = new Map();
try { for (const e of Object.values(json("data/imageManifest.generated.json"))) for (const v of e.variants) variantToSource.set(v.webp, e.src); } catch { /* no manifest */ }

const appDir = join(root, ".next/server/app");
const useBuild = !forceSource && existsSync(appDir);
const walk = (dir, out = []) => {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};

/** page -> Set(public file) */
const pages = new Map();
const note = (page, file) => { if (!pages.has(page)) pages.set(page, new Set()); pages.get(page).add(file); };
const re = /\/media(?:-opt)?\/[A-Za-z0-9_\-./]+?\.(?:jpe?g|png|webp|mp4)/g;
const resolve = (u) => (u.startsWith("/media-opt/") ? variantToSource.get(u) ?? null : u);

if (useBuild) {
  for (const f of walk(appDir).filter((x) => x.endsWith(".html"))) {
    const rel = "/" + relative(appDir, f).replace(/\.html$/, "").replace(/\/index$/, "").replace(/^index$/, "");
    const text = readFileSync(f, "utf8").replace(/\\u002F/g, "/");
    for (const m of text.matchAll(re)) { const src = resolve(m[0]); if (src) note(rel === "/" ? "/" : rel, src); }
  }
} else {
  // Source scan: any quoted /media path, plus the file name in content/photos.ts style (S + "name.jpg"), in code and data.
  const files = ["app", "components", "content", "data", "lib"].flatMap((d) => walk(join(root, d))).filter((x) => /\.(tsx?|json|mjs)$/.test(x) && !/imageManifest|imageLoaderMap|photoSources|og\.generated|\.next/.test(x));
  const pub = ["story", "moments", "gallery", "products", "video"].flatMap((d) => (existsSync(join(root, "public/media", d)) ? walk(join(root, "public/media", d)) : []));
  const byBase = new Map(pub.map((p) => ["/" + relative(join(root, "public"), p), p.split("/").pop()]));
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    const page = "/" + relative(root, f);
    for (const m of text.matchAll(re)) { const src = resolve(m[0]); if (src) note(page, src); }
    for (const [src, base] of byBase) if (text.includes(`"${base}"`)) note(page, src);
  }
}

// Fold into ids.
const where = new Map(allIds.map((id) => [id, new Map()]));
for (const [page, set] of pages) for (const file of set) {
  for (const id of fileToIds.get(file) ?? []) for (const t of twinsOf.get(id) ?? [id]) where.get(t)?.set(page, (where.get(t).get(page) ?? new Set()).add(file));
}
const unused = allIds.filter((id) => where.get(id).size === 0);

console.log(`Photo coverage (${useBuild ? "built HTML in .next/server/app" : "source scan"}): ${allIds.length - unused.length} of ${allIds.length} supplied files appear on the site.\n`);
console.log(unused.length ? `UNUSED (${unused.length}): ${unused.join(", ")}\n` : "UNUSED (0): none\n");
const rows = allIds.map((id) => {
  const w = [...where.get(id).keys()].sort();
  const twin = (twinsOf.get(id) ?? []).filter((x) => x !== id);
  return `${id.padEnd(14)} ${String(w.length).padStart(3)} page(s)  ${twin.length ? `[twin ${twin.join(",")}] ` : ""}${w.slice(0, 6).join("  ")}${w.length > 6 ? `  +${w.length - 6} more` : ""}`;
});
console.log("id             uses  where");
console.log(rows.join("\n"));
process.exit(unused.length ? 1 : 0);
