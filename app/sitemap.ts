import type { MetadataRoute } from "next";
import { siteBaseUrl } from "@/lib/env";
import { staticRoutes } from "@/lib/site";
import { allProducts, categories } from "@/lib/catalogue";

// Static routes plus every visible product. Hidden products are filtered out by lib/catalogue.ts.
// Content, help and legal routes come from lib/routes.ts. A failure there never breaks the build.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let content: string[] = [];
  try {
    const mod = await import("@/lib/routes");
    content = mod.contentRoutes();
  } catch {
    content = [];
  }
  const routes = [
    ...staticRoutes,
    ...categories.map((c) => `/shop/${c.slug}`),
    ...allProducts().map((p) => `/shop/${p.slug}`),
    ...content,
  ];
  const base = siteBaseUrl();
  return [...new Set(routes)].map((r) => ({ url: `${base}${r === "/" ? "" : r}` }));
}
