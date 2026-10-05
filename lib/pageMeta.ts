import type { Metadata } from "next";
import { site } from "@/lib/site";
import { siteBaseUrl } from "@/lib/env";
import ogNames from "@/data/og.generated.json";

/** Keeps a meta description at or under 160 characters by dropping whole sentences from the end. */
export function fitDescription(text: string, max = 160): string {
  if (text.length <= max) return text;
  const sentences = text.match(/[^.]+\.?/g) ?? [text];
  let out = "";
  for (const s of sentences) {
    const next = (out + s).trim();
    if (next.length > max) break;
    out = next + " ";
  }
  out = out.trim();
  if (out) return out;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}.`;
}

/** Social image: a generated 1200 x 630 file (scripts/build-og.mjs), or the shared default. */
export function ogImageFor(name?: string): string {
  return name && (ogNames as string[]).includes(name) ? `/og/${name}.jpg` : "/og/default.jpg";
}
const OG_ALT = `${site.name}: ${site.tagline}`;

/**
 * One helper for every page: title, description, canonical, Open Graph (with url and image) and Twitter card.
 * Next replaces a parent openGraph object rather than merging it, so each page states all of it here.
 * `path` starts with a slash. `og` names a generated image, for example "product-lion".
 */
export function pageMetadata(o: { title: string; description: string; path: string; og?: string; ogAlt?: string; type?: "website" | "article"; ogTitle?: string }): Metadata {
  const description = fitDescription(o.description);
  const image = { url: ogImageFor(o.og), width: 1200, height: 630, alt: o.ogAlt ?? OG_ALT };
  const title = o.ogTitle ?? `${o.title} | ${site.name}`;
  return {
    title: o.title,
    description,
    alternates: { canonical: o.path },
    openGraph: { title, description, url: o.path, siteName: site.name, locale: "en_KE", type: o.type ?? "website", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [{ url: image.url, alt: image.alt }] },
  };
}

/** BreadcrumbList JSON-LD. Items after Home carry a name and a path. */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  const base = siteBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${base}${it.path === "/" ? "" : it.path}`,
    })),
  };
}
