// Static responsive image pipeline. Replaces Vercel's runtime image optimiser (plan limit hit, 402).
//
// Reads every jpg, jpeg and png under public/media/** plus the logo files in public/, and writes WebP and AVIF
// variants into public/media-opt/ (same path, "-<width>" before the extension). Also writes:
//   data/imageManifest.generated.json   full manifest: src, width, height, variants, blur (tiny base64 webp)
//   data/imageLoaderMap.generated.json  slim {src: [widths]} map that lib/imageLoader.ts ships to the browser
//
// Rules: never upscale, auto-rotate from EXIF, keep the aspect ratio, no colour edits and no extra sharpening.
// All metadata is dropped except an ICC profile, which is converted to sRGB first. Incremental: a variant is
// skipped when its file is newer than the source. Run: npm run build:images (also runs in prebuild and predev).
import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, relative, dirname, extname, sep } from "node:path";
import sharp from "sharp";

const root = new URL("..", import.meta.url).pathname;
const pub = join(root, "public");
const outRoot = join(pub, "media-opt");

// The spec steps are 320, 480, 640, 960, 1280 and 1600. 160 and 240 serve thumbnails and category circles (44 to 112 css px);
// 400, 560 and 800 close the gaps so a 2-column phone card (about 130 css px) or a rail card (about 196) does not jump a whole step.
const WIDTHS = [160, 240, 320, 400, 480, 560, 640, 800, 960, 1280, 1600];
const WEBP = { quality: 76, effort: 5 };
const AVIF = { quality: 55, effort: 4 };
// AVIF is opt-in (IMAGES_AVIF=1): next/image emits one format per srcset and the loader serves WebP, so AVIF files would be
// dead weight and cost several seconds of CPU each. Kept for a future <picture> wrapper.
const MAKE_AVIF = process.env.IMAGES_AVIF === "1";
const EXT = new Set([".jpg", ".jpeg", ".png"]);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (EXT.has(extname(e.name).toLowerCase())) out.push(p);
  }
  return out;
}

// public/media/products/x.jpg -> /media/products/x.jpg, written as /media-opt/products/x-<w>.webp
// public/logo.png -> /logo.png, written as /media-opt/_root/logo-<w>.webp
function plan(file) {
  const rel = relative(pub, file).split(sep).join("/");
  const src = "/" + rel;
  const stem = rel.replace(/\.[^.]+$/, "");
  const base = rel.startsWith("media/") ? stem.slice("media/".length) : "_root/" + stem;
  return { src, base };
}
const variantUrl = (base, w, fmt) => `/media-opt/${base}-${w}.${fmt}`;

/** Widths to write for a source of the given width. A source narrower than 320 gets only its own width. Steps within 5% of the source width are skipped (the source itself covers them). */
function widthsFor(sw) {
  const ws = sw < 320 ? [] : WIDTHS.filter((w) => w < sw * 0.95);
  const set = new Set(ws);
  // Always offer the source's own width as the top step (never wider than the source, capped at 1600).
  set.add(Math.min(sw, WIDTHS[WIDTHS.length - 1]));
  return [...set].sort((a, b) => a - b);
}

async function processFile(file) {
  const { src, base } = plan(file);
  const srcTime = statSync(file).mtimeMs;
  const meta = await sharp(file).metadata();
  const swap = (meta.orientation ?? 1) >= 5;
  const width = swap ? meta.height : meta.width;
  const height = swap ? meta.width : meta.height;
  const widths = widthsFor(width);
  const hasIcc = Boolean(meta.icc);
  // Illustrations with transparency (the logos) compress better with a lighter alpha plane and exact chroma at edges.
  const webpOpts = meta.hasAlpha ? { ...WEBP, alphaQuality: 60, smartSubsample: true } : WEBP;
  let written = 0;
  const variants = [];

  for (const w of widths) {
    const v = { w, webp: variantUrl(base, w, "webp") };
    if (MAKE_AVIF) v.avif = variantUrl(base, w, "avif");
    variants.push(v);
    for (const fmt of MAKE_AVIF ? ["webp", "avif"] : ["webp"]) {
      const out = join(pub, v[fmt]);
      if (existsSync(out) && statSync(out).mtimeMs > srcTime) continue;
      mkdirSync(dirname(out), { recursive: true });
      let img = sharp(file).rotate();
      if (w < width) img = img.resize({ width: w, withoutEnlargement: true });
      if (hasIcc) img = img.withIccProfile("srgb"); // converts to sRGB and keeps a profile
      await (fmt === "webp" ? img.webp(webpOpts) : img.avif(AVIF)).toFile(out);
      written++;
    }
  }

  const blurBuf = await sharp(file).rotate().resize({ width: 16, withoutEnlargement: true }).webp({ quality: 40, effort: 4 }).toBuffer();
  const blur = `data:image/webp;base64,${blurBuf.toString("base64")}`;
  return { entry: { src, width, height, variants, blur }, written, expected: variants.flatMap((v) => [v.webp, ...(v.avif ? [v.avif] : [])]) };
}

async function main() {
  const t0 = Date.now();
  const files = [...walk(join(pub, "media")), join(pub, "logo.png"), join(pub, "logo-mark.png")]
    .filter((f) => existsSync(f)).sort();
  const results = [];
  const queue = [...files];
  const workers = Array.from({ length: Math.min(4, files.length) }, async () => {
    while (queue.length) results.push(await processFile(queue.shift()));
  });
  await Promise.all(workers);
  results.sort((a, b) => (a.entry.src < b.entry.src ? -1 : 1));

  // Remove variants whose source is gone.
  const keep = new Set(results.flatMap((r) => r.expected));
  let pruned = 0;
  for (const f of walk2(outRoot)) {
    const url = "/" + relative(pub, f).split(sep).join("/");
    if (!keep.has(url)) { rmSync(f); pruned++; }
  }

  const manifest = {};
  const map = {};
  for (const { entry } of results) {
    manifest[entry.src] = entry;
    map[entry.src] = entry.variants.map((v) => v.w);
  }
  mkdirSync(join(root, "data"), { recursive: true });
  writeFileSync(join(root, "data/imageManifest.generated.json"), JSON.stringify(manifest, null, 1) + "\n");
  writeFileSync(join(root, "data/imageLoaderMap.generated.json"), JSON.stringify(map) + "\n");

  const written = results.reduce((n, r) => n + r.written, 0);
  const total = [...keep].length;
  console.log(`build-images: ${files.length} sources, ${total} variants (${written} written, ${total - written} up to date, ${pruned} pruned) in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

function walk2(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk2(p, out); else out.push(p);
  }
  return out;
}

main().catch((e) => { console.error(e); process.exit(1); });
