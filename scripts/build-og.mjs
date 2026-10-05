// Builds 1200 x 630 social share images from the existing photos: logo panel on the left, the photo on the right.
// Photos are only cropped and scaled, never tinted. Run: node --import ./scripts/register-alias.mjs scripts/build-og.mjs
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const { allProducts, heroImage } = await import("@/lib/catalogue");
const { posts } = await import("@/content/journal");
const { projects } = await import("@/content/projects");
const { photos } = await import("@/content/photos");
const { homePhotos } = await import("@/data/home");

const W = 1200, H = 630, PHOTO = 630, PANEL = W - PHOTO;
const out = path.join(process.cwd(), "public/og");
mkdirSync(out, { recursive: true });

const logo = await sharp("public/logo.png").resize({ height: 540, fit: "inside" }).png().toBuffer();
const panel = await sharp({ create: { width: PANEL, height: H, channels: 3, background: "#FBF7F0" } })
  .composite([{ input: logo, gravity: "centre" }]).png().toBuffer();

async function make(name, src, focal = [0.5, 0.45]) {
  const file = path.join(process.cwd(), "public", src);
  const meta = await sharp(file).metadata();
  // Crop a square window around the focal point so the animal stays in view.
  const side = Math.min(meta.width, meta.height);
  const left = Math.round(Math.min(Math.max(focal[0] * meta.width - side / 2, 0), meta.width - side));
  const top = Math.round(Math.min(Math.max(focal[1] * meta.height - side / 2, 0), meta.height - side));
  const photo = await sharp(file).extract({ left, top, width: side, height: side }).resize(PHOTO, PHOTO).toBuffer();
  await sharp({ create: { width: W, height: H, channels: 3, background: "#FBF7F0" } })
    .composite([{ input: panel, left: 0, top: 0 }, { input: photo, left: PANEL, top: 0 }])
    .jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(out, `${name}.jpg`));
}

const names = [];
await make("default", homePhotos.hero.src, [0.5, 0.4]); names.push("default");
for (const p of allProducts()) {
  const h = heroImage(p);
  if (!h) continue;
  await make(`product-${p.slug}`, h.image.src, h.image.focal); names.push(`product-${p.slug}`);
}
for (const p of posts) { const ph = p.images[0]; await make(`journal-${p.slug}`, ph.src, ph.focal); names.push(`journal-${p.slug}`); }
for (const p of projects) { const ph = photos[p.cover]; await make(`project-${p.slug}`, ph.src, ph.focal); names.push(`project-${p.slug}`); }
writeFileSync("data/og.generated.json", JSON.stringify(names, null, 1) + "\n");
console.log(`og images: ${names.length}`);
