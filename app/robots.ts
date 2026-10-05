import type { MetadataRoute } from "next";
import { isProduction, siteBaseUrl } from "@/lib/env";

const private_ = ["/styleguide", "/cart", "/order"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isProduction ? { userAgent: "*", allow: "/", disallow: private_ } : { userAgent: "*", disallow: "/" },
    sitemap: `${siteBaseUrl()}/sitemap.xml`,
  };
}
