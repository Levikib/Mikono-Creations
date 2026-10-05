#!/usr/bin/env node
// SEO check for Mikono Creations. Node 18+, no dependencies.
// Usage:  node seo-check.mjs https://mikono-creations.vercel.app [--env=production|preview] [--prices-confirmed] [--strict] [--concurrency=6] [--skip-links]
// Copy to scripts/seo-check.mjs in the repo when ready (the file has no repo imports).
// Exit code 1 when any P0 condition fails. P1 findings are printed, and fail only with --strict.
// STATUS: written and syntax-reviewed by hand, NOT executed (the audit session had no shell). Run it once and fix any typo.

const args = process.argv.slice(2);
const base = (args.find((a) => /^https?:\/\//.test(a)) || "").replace(/\/$/, "");
const flag = (n, d) => (args.find((a) => a.startsWith(`--${n}=`)) || `--${n}=${d}`).split("=")[1];
const has = (n) => args.includes(`--${n}`);
if (!base) { console.error("Give a base URL, for example https://example.com"); process.exit(2); }
const envMode = flag("env", "production");
const pricesConfirmed = has("prices-confirmed");
const strict = has("strict");
const conc = Number(flag("concurrency", "6"));
const baseHost = new URL(base).host;

const PRIVATE = ["/cart", "/order", "/styleguide"]; // must be noindex or disallowed
const NOINDEX_OK = new Set(["/cart", "/order", "/order/sent", "/custom/studio/sent", "/styleguide"]);
const DASH = /[\u2013\u2014]/;
const P0 = [], P1 = [];
let locs = [];
const pages = new Map(); // url -> {title, desc, h1s, linkCount}
const p0 = (url, msg) => P0.push(`${url}  ${msg}`);
const p1 = (url, msg) => P1.push(`${url}  ${msg}`);

async function get(url, init = {}) {
  try { return await fetch(url, { redirect: "manual", headers: { "user-agent": "mikono-seo-check/1.0" }, ...init }); }
  catch (e) { return { status: 0, headers: new Headers(), text: async () => "", err: String(e) }; }
}

const attr = (tag, name) => { const m = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i")); return m ? (m[2] ?? m[3]) : null; };
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const metas = (html) => [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
const metaBy = (ms, key, val) => { const t = ms.find((m) => (attr(m, key) || "").toLowerCase() === val); return t ? decode(attr(t, "content") || "") : null; };
const textOf = (s) => decode(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());

// Required properties per schema type. Offer, price and aggregateRating are forbidden until prices are confirmed.
const REQUIRED = {
  Organization: ["name", "url", "logo"],
  Article: ["headline", "datePublished", "image", "author"],
  BlogPosting: ["headline", "datePublished", "image", "author"],
  BreadcrumbList: ["itemListElement"],
  FAQPage: ["mainEntity"],
  ItemList: ["itemListElement"],
  ProductGroup: ["name", "productGroupID", "hasVariant"],
  Product: ["name"],
  VideoObject: ["name", "thumbnailUrl", "uploadDate"],
  WebSite: ["name", "url"],
};
function walk(node, fn) { if (Array.isArray(node)) node.forEach((n) => walk(n, fn)); else if (node && typeof node === "object") { fn(node); Object.values(node).forEach((v) => walk(v, fn)); } }

function checkLd(url, html) {
  const types = [];
  const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const b of blocks) {
    let data;
    try { data = JSON.parse(b[1]); } catch (e) { p0(url, `JSON-LD does not parse: ${e.message}`); continue; }
    walk(data, (n) => {
      const t = n["@type"]; if (!t) return;
      for (const ty of [].concat(t)) {
        types.push(ty);
        const req = REQUIRED[ty];
        if (req) for (const k of req) if (n[k] == null || n[k] === "") p1(url, `JSON-LD ${ty} missing ${k}`);
        if (ty === "ListItem" && (n.position == null || !n.name)) p1(url, "JSON-LD ListItem needs position and name");
        if (!pricesConfirmed && (ty === "Offer" || ty === "AggregateOffer" || ty === "AggregateRating" || ty === "Review")) p0(url, `JSON-LD ${ty} present while prices are not confirmed`);
      }
      if (!pricesConfirmed && ("price" in n || "priceCurrency" in n)) p0(url, "JSON-LD price field present while prices are not confirmed");
    });
    const s = b[1];
    if (/localhost/.test(s)) p0(url, "JSON-LD contains localhost");
    if (!/https?:\/\//.test(s) && /"url"/.test(s)) p1(url, "JSON-LD url not absolute");
  }
  return types;
}

async function pool(items, n, fn) { const out = []; let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } })); return out; }

// ---- robots.txt
const robots = await get(`${base}/robots.txt`);
const robotsTxt = await robots.text();
if (robots.status !== 200) p0("/robots.txt", `status ${robots.status}`);
const blocksAll = /^\s*disallow:\s*\/\s*$/im.test(robotsTxt);
if (envMode === "production" && blocksAll) p0("/robots.txt", "production robots.txt blocks everything (Disallow: /)");
if (envMode === "preview" && !blocksAll) p0("/robots.txt", "preview robots.txt does not block crawling");
if (envMode === "production" && !new RegExp(`sitemap:\\s*${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap\\.xml`, "i").test(robotsTxt)) p0("/robots.txt", `Sitemap line missing or not on ${base}`);
if (/localhost/.test(robotsTxt)) p0("/robots.txt", "contains localhost");

// ---- sitemap
const sm = await get(`${base}/sitemap.xml`);
const smTxt = await sm.text();
if (sm.status !== 200) { p0("/sitemap.xml", `status ${sm.status}`); report(); }
locs = [...smTxt.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]).trim());
if (!locs.length) { p0("/sitemap.xml", "no <loc> entries"); report(); }
if (new Set(locs).size !== locs.length) p0("/sitemap.xml", "duplicate URLs");
for (const l of locs) {
  if (new URL(l).host !== baseHost) p0(l, "sitemap URL is on a different host than the base URL");
  if (/localhost/.test(l)) p0(l, "sitemap URL contains localhost");
  if (l.length > 1 && l.endsWith("/") && new URL(l).pathname !== "/") p1(l, "sitemap URL has a trailing slash");
  if (/[?#]/.test(l)) p0(l, "sitemap URL has a query or fragment");
}
if (!/<lastmod>/.test(smTxt)) p1("/sitemap.xml", "no lastmod on any URL (add real dates for posts and projects only)");

// ---- crawl
const titles = new Map(), descs = new Map();
const internalLinks = new Set();

await pool(locs, conc, async (url) => {
  const res = await get(url);
  const path = new URL(url).pathname;
  if (res.status >= 300 && res.status < 400) { p0(url, `sitemap URL redirects (${res.status} to ${res.headers.get("location")})`); return; }
  if (res.status !== 200) { p0(url, `status ${res.status}`); return; }
  const html = await res.text();
  const xrt = (res.headers.get("x-robots-tag") || "").toLowerCase();
  const ms = metas(html);
  const robotsMeta = (metaBy(ms, "name", "robots") || "").toLowerCase();
  if (/noindex/.test(xrt + robotsMeta) && !NOINDEX_OK.has(path)) p0(url, `noindex on an indexable sitemap URL (${xrt || robotsMeta})`);
  if (NOINDEX_OK.has(path)) p0(url, "private URL is listed in the sitemap");

  const t = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  const title = t ? decode(t.trim()) : "";
  const titleCount = (html.match(/<title[\s>]/gi) || []).length;
  if (titleCount !== 1) p0(url, `title tag count ${titleCount}`);
  if (title.length > 60) p1(url, `title ${title.length} chars (max 60): ${title}`);
  if (title.length < 15) p1(url, `title short (${title.length})`);
  if (DASH.test(title)) p0(url, "title contains an em or en dash");
  titles.set(title, [...(titles.get(title) || []), url]);

  const desc = metaBy(ms, "name", "description");
  if (!desc) p0(url, "meta description missing"); else {
    if (desc.length > 155) p1(url, `description ${desc.length} chars (max 155)`);
    if (desc.length < 70) p1(url, `description short (${desc.length})`);
    if (DASH.test(desc)) p0(url, "description contains an em or en dash");
    descs.set(desc, [...(descs.get(desc) || []), url]);
  }

  const canTag = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]).find((l) => (attr(l, "rel") || "").toLowerCase() === "canonical");
  const can = canTag ? attr(canTag, "href") : null;
  if (!can) p0(url, "canonical missing");
  else {
    if (!/^https?:\/\//.test(can)) p0(url, `canonical not absolute: ${can}`);
    else if (can.replace(/\/$/, "") !== url.replace(/\/$/, "")) p0(url, `canonical is not self-referencing: ${can}`);
    if (/localhost/.test(can)) p0(url, "canonical contains localhost");
  }

  const lang = (html.match(/<html[^>]*\blang=["']([^"']+)/i) || [])[1];
  if (!lang) p0(url, "html lang missing"); else if (lang !== "en-KE") p1(url, `html lang is ${lang}`);

  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => textOf(m[1]));
  if (h1s.length !== 1) p0(url, `h1 count ${h1s.length}`);
  // heading order sanity: no jump of more than one level down
  const heads = [...html.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i - 1] > 1) { p1(url, `heading jumps from h${heads[i - 1]} to h${heads[i]}`); break; }

  for (const key of ["og:title", "og:description", "og:url", "og:image"]) if (!metaBy(ms, "property", key)) p1(url, `${key} missing`);
  const ogImg = metaBy(ms, "property", "og:image");
  if (ogImg && !/^https?:\/\//.test(ogImg)) p0(url, `og:image not absolute: ${ogImg}`);
  const ogUrl = metaBy(ms, "property", "og:url");
  if (ogUrl && /localhost/.test(ogUrl)) p0(url, "og:url contains localhost");
  if (metaBy(ms, "name", "twitter:card") !== "summary_large_image") p1(url, "twitter:card is not summary_large_image");

  const types = checkLd(url, html);
  if (!types.includes("Organization")) p1(url, "no Organization JSON-LD");
  if (path !== "/" && !types.includes("BreadcrumbList") && path.split("/").filter(Boolean).length >= 2) p1(url, "deep page without BreadcrumbList");

  // crawlable text and links in raw HTML (JavaScript SEO)
  const body = textOf(html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, ""));
  if (body.split(" ").length < 150) p1(url, `thin raw HTML text (${body.split(" ").length} words)`);
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((i) => attr(i, "alt") === null).length;
  if (noAlt) p1(url, `${noAlt} img without an alt attribute`);

  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref=["']([^"'#]+)["']/gi)].map((m) => decode(m[1]));
  for (const h of hrefs) {
    if (/^(mailto:|tel:|javascript:|https:\/\/wa\.me)/.test(h)) continue;
    if (h.startsWith("/")) internalLinks.add(h.split("?")[0]);
    else if (h.startsWith(base)) internalLinks.add(new URL(h).pathname);
    if (/localhost/.test(h)) p0(url, `link to localhost: ${h}`);
  }
  pages.set(url, { title, desc, h1s, linkCount: hrefs.length });
});

for (const [t, urls] of titles) if (t && urls.length > 1) p0(urls[0], `duplicate title shared by ${urls.length} URLs: "${t}"`);
for (const [d, urls] of descs) if (d && urls.length > 1) p1(urls[0], `duplicate description shared by ${urls.length} URLs`);

// ---- orphans: sitemap URLs never linked from a crawled page
const linked = new Set([...internalLinks].map((p) => (p === "" ? "/" : p.replace(/\/$/, "") || "/")));
for (const l of locs) { const p = new URL(l).pathname || "/"; if (p !== "/" && !linked.has(p)) p1(l, "orphan: no crawled page links to it in raw HTML"); }

// ---- broken internal links and redirect chains
if (!has("skip-links")) {
  const targets = [...linked].filter((p) => !/^\/(_next|media|media-opt|og)\b/.test(p));
  await pool(targets, conc, async (p) => {
    const r = await get(base + p, { method: "GET" });
    if (r.status >= 400 || r.status === 0) p0(base + p, `broken internal link target, status ${r.status}`);
    else if (r.status >= 300) p1(base + p, `internal link target redirects (${r.status} to ${r.headers.get("location")})`);
  });
}

// ---- noindex handling of private pages and filtered shop
for (const p of PRIVATE) {
  const r = await get(base + p);
  const robotsAll = robotsTxt.toLowerCase().includes(`disallow: ${p}`);
  const html = r.status === 200 ? await r.text() : "";
  const ni = /noindex/i.test((r.headers.get("x-robots-tag") || "") + (metaBy(metas(html), "name", "robots") || ""));
  if (envMode === "production" && r.status === 200 && !ni && !robotsAll) p0(base + p, "private page is neither noindex nor disallowed");
}
{
  const r = await get(`${base}/shop?animal=lion`);
  const x = (r.headers.get("x-robots-tag") || "").toLowerCase();
  if (!/noindex/.test(x)) p1(`${base}/shop?animal=lion`, "filtered shop URL has no noindex header (canonical alone also works if it points to /shop)");
  const html = await r.text();
  const canTag = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]).find((l) => (attr(l, "rel") || "").toLowerCase() === "canonical");
  if (canTag && attr(canTag, "href") !== `${base}/shop`) p0(`${base}/shop?animal=lion`, `filtered URL canonical should be ${base}/shop, got ${attr(canTag, "href")}`);
}

// ---- 404 behaviour, www, trailing slash, http
{
  const r = await get(`${base}/this-page-does-not-exist-seo-check`);
  if (r.status !== 404) p0(base + "/this-page-does-not-exist-seo-check", `unknown URL returns ${r.status}, expected 404 (soft 404)`);
  const ts = await get(`${base}/shop/`);
  if (ts.status !== 308 && ts.status !== 301 && ts.status !== 200) p1(`${base}/shop/`, `trailing slash returns ${ts.status}`);
  if (ts.status === 200) p1(`${base}/shop/`, "trailing slash serves 200 (duplicate); expected a redirect to /shop");
}

report();

function report() {
  console.log(`\nSEO check for ${base}  env=${envMode}  pages crawled=${pages.size}/${locs?.length ?? 0}`);
  console.log(`\nP0 (${P0.length})`); P0.forEach((m) => console.log("  P0 " + m));
  console.log(`\nP1 (${P1.length})`); P1.slice(0, 200).forEach((m) => console.log("  P1 " + m));
  if (P1.length > 200) console.log(`  ... ${P1.length - 200} more P1`);
  process.exit(P0.length || (strict && P1.length) ? 1 : 0);
}
