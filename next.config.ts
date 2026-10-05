import type { NextConfig } from "next";

// Site URL for metadata, sitemap and JSON-LD. NEXT_PUBLIC_SITE_URL wins. On Vercel the production
// domain or the deployment URL is used, so a deployed build never points at localhost.
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (vercelHost ? `https://${vercelHost}` : "");
// Search engines are only invited on the production environment: Vercel production, or NEXT_PUBLIC_SITE_ENV set to
// production. The style guide is removed on production by proxy.ts, which reads the environment at request time.
const isProd = process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_SITE_ENV === "production";
const siteEnv = isProd ? "production" : "development";

const dev = process.env.NODE_ENV === "development";

// Static CSP (no nonces, so pages stay statically generated). The tag hosts are the ones the consent
// gated loader in components/Analytics.tsx can inject: Google tag, Meta Pixel and TikTok Pixel.
const googleHosts = "https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com";
const metaHosts = "https://connect.facebook.net https://www.facebook.com https://*.facebook.com";
const tiktokHosts = "https://analytics.tiktok.com https://*.tiktok.com";
const tagHosts = `${googleHosts} ${metaHosts} ${tiktokHosts}`;
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} ${tagHosts}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${tagHosts}`,
  "font-src 'self' data:",
  `connect-src 'self' ${tagHosts}${dev ? " ws: wss:" : ""}`,
  `frame-src ${googleHosts} ${metaHosts} ${tiktokHosts}`,
  "media-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(process.env.VERCEL ? ["upgrade-insecure-requests"] : []),
].join("; ");

const nextConfig: NextConfig = {
  // Annotation mode: the compiler only touches functions marked "use memo". Its automatic memo cache code added 5 to 17 KB gzip of script per route.
  reactCompiler: { compilationMode: "annotation" },
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_SITE_URL: siteUrl,
    NEXT_PUBLIC_SITE_ENV: siteEnv,
  },
  images: {
    // Static responsive pipeline: scripts/build-images.mjs writes WebP variants to public/media-opt and the loader
    // picks one per requested width. Vercel's runtime optimiser (/_next/image) is never used, so it has no usage cap.
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    // Aligned to the variant widths the pipeline writes (plus 160 and 240 for thumbnails and circles).
    deviceSizes: [320, 400, 480, 560, 640, 800, 960, 1280, 1600],
    imageSizes: [160, 240],
    qualities: [75],
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/media-opt/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // The animal engine (content hashed file name) and the sprites (content hashed ?v= in every URL the app writes).
      {
        source: "/fx/e/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/fx/cast/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/fx/cast2/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/textures/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }],
      },
      {
        source: "/cutouts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }],
      },
      {
        source: "/og/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      // The listing pages are static and filter on the client. A filtered URL stays crawlable for links but is not indexed;
      // its canonical points at the base page (lib/shopMeta.ts). Handled here, at the routing layer, so no function runs.
      // The same holds for the blog and FAQ search and topic addresses (components/filters).
      ...[
        { sources: ["/shop", "/shop/:path*"], keys: ["animal", "colour", "size", "several", "sort", "q"] },
        { sources: ["/journal", "/faq"], keys: ["topic", "q"] },
      ].flatMap(({ sources, keys }) => keys.flatMap((key) => sources.map((source) => ({
        source,
        has: [{ type: "query" as const, key }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      })))),
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
