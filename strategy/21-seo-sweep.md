# 21 SEO sweep (audit, read-only)

Date of audit: 2026-10-04. Site: https://mikono-creations.vercel.app. Binding inputs: strategy/07-BUILD-DECISIONS.md (R7 prices unconfirmed, R9 and D26 approved claims, D11 no Offer), AGENTS.md rules, no em or en dashes.

## 0. Read this first: how far the audit went

The audit session had no shell. curl and playwright-core could not be run. What was done instead:

- Read the code that produces metadata, sitemap, robots, headers and JSON-LD (app/layout.tsx, lib/pageMeta.ts, lib/shopMeta.ts, lib/routes.ts, lib/site.ts, lib/env.ts, next.config.ts, app/sitemap.ts, app/robots.ts, app/shop/[slug]/page.tsx, app/journal/[slug]/page.tsx, app/journal/page.tsx, app/faq/page.tsx, app/cart/page.tsx, app/custom/studio/page.tsx, app/gifts/finder/page.tsx).
- Fetched about 10 live URLs through a summarising fetch tool (sitemap, robots.txt, home, a product, /shop?animal=lion, /journal, a 404 URL, /llms.txt, /og/default.jpg). That tool does not return raw head tags reliably, so per-URL title, canonical and JSON-LD values below come from the code, not from the live HTML.
- Ran 12 web searches (SERP types, Merchant Center, FAQ rich results, Business Profile).

So the 135-URL crawl table is NOT done. In its place there is a crawler, strategy/seo/seo-check.mjs, that does every item in section 1 and fails CI on the P0 list. First action for whoever has a shell: run
`node strategy/seo/seo-check.mjs https://mikono-creations.vercel.app --env=production` and paste the output into section 12. The script is untested (written by hand), expect to fix a typo.

Verification legend used below: VERIFIED-LIVE (seen on the live site), VERIFIED-CODE (read in the repo), VERIFIED-WEB (seen in a search or Google page), UNVERIFIED.

Update after the coordinator note (re-fetched later the same day): the live sitemap now has 154 URLs (was 135), /gallery is listed, 29 product URLs, still no lastmod. The deploy is moving, so section 1 numbers dated to the first fetch (135) will drift; rerun seo-check.mjs after the photo release goes live. Section 5 product list may need the new product slugs (for example a lion-head-handbag product exists).

## 1. What the audit established

| Item | Finding | Status |
|---|---|---|
| Sitemap | 135 URLs, all on the vercel.app host, no lastmod, no images. About 8 static + 5 categories + 30 products + 30 content pages + 47 posts + project pages. No index split needed (limit is 50,000 URLs). | VERIFIED-LIVE |
| Sitemap contents | Includes four tool pages (/gifts/finder, /size-finder, /build-a-family, /custom/studio). Private pages (/cart, /order, /styleguide) are not in it. Hidden products are filtered in lib/catalogue.ts. | VERIFIED-LIVE and CODE |
| robots.txt (live) | `Allow: /`, `Disallow: /styleguide /cart /order`, `Sitemap:` on the vercel.app host. This is the production branch, so the vercel.app host is currently crawlable. | VERIFIED-LIVE |
| robots.txt logic | `isProduction` comes from NEXT_PUBLIC_SITE_ENV, set at build in next.config.ts from VERCEL_ENV === "production". Previews get `Disallow: /`. Sitemap line follows siteBaseUrl(). | VERIFIED-CODE |
| Base URL logic | NEXT_PUBLIC_SITE_URL wins; else VERCEL_PROJECT_PRODUCTION_URL or VERCEL_URL; localhost only off Vercel. Canonical, OG, sitemap, JSON-LD all use it. Good. | VERIFIED-CODE |
| Home title | "Mikono Creations \| Crocheted animals, handmade in Nairobi". H1 "Crocheted animals, made by hand in Nairobi". 9 H2s, about 45 links in raw HTML. The word Kenya appears nowhere in the title. | VERIFIED-LIVE |
| Product titles | `metaTitle`: "{Name}, crocheted by hand" when the name is 24 characters or fewer. Live giraffe H1 is "Giraffe". Title has no Nairobi or Kenya and no shopping intent word. | VERIFIED-CODE and LIVE |
| Product schema | One ProductGroup with hasVariant of Product (sku, color, size, image), Brand, no offers, no rating, plus BreadcrumbList. Compliant with R7 and D11. | VERIFIED-CODE |
| Article schema | Type Article, author and publisher Organization, image array of one. `dateModified` is a copy of `datePublished`. Publisher has no logo. | VERIFIED-CODE |
| Organization | On every page via layout. Logo, telephone, sameAs, founder, foundingDate, contactPoint with areaServed KE. No @id, no address (correct, none yet). | VERIFIED-CODE |
| FAQPage | Emitted on /faq via faqLd(). Google retired FAQ rich results on 7 May 2026 (they were restricted to government and health sites in August 2023); the markup stays valid and harmless. | VERIFIED-WEB |
| Filtered shop URLs | `/shop?animal=`, `colour`, `size` get `X-Robots-Tag: noindex, follow` and the canonical points at the base page. Two signals; works, but see P2-1. The journal filter `?topic=` is NOT covered by that header rule. | VERIFIED-CODE |
| Private pages | /cart has `robots: {index:false}`. Also disallowed in robots.txt, so Google cannot read the noindex. /order, /order/sent, /custom/studio/sent, /styleguide: noindex not verified. | CODE (cart) / UNVERIFIED (rest) |
| 404 | Unknown URL returns real HTTP 404. | VERIFIED-LIVE |
| llms.txt | 404 today. | VERIFIED-LIVE |
| OG default | /og/default.jpg reachable, JPEG, 135 KB. Declared 1200 x 630 in code; the pixel size was not measured. | LIVE (reachable) |
| Journal index | Shows 12 posts then a "Show more posts" button; the page says 46 posts plus the featured one (47 total). If the other 34 links appear only after a click, they are not in raw HTML. The Suspense fallback `JournalIndexStatic` may render them; unverified. | VERIFIED-LIVE (button), UNVERIFIED (raw HTML) |
| Headers | CSP, nosniff, X-Frame-Options DENY, HSTS (1 year, includeSubDomains), Referrer-Policy, Permissions-Policy are set. poweredByHeader off. Long immutable caching for media. | VERIFIED-CODE |
| Shop | 30 products on one page, no pagination. Fine under the 48-item rule (D33). | VERIFIED-CODE/LIVE |
| Hreflang | None. Correct for one language and one site. `<html lang="en-KE">`, og:locale en_KE. | VERIFIED-CODE |
| Copy risk | A post titled "Acrylic is a plastic based fibre: our honest note" sits beside the site-wide claim "Zero plastic". The claim is approved for plain animals, but the two will be read together. See P0-3. | VERIFIED-LIVE (post exists) |

Not yet measured (needs the script or a browser): per-URL title and description lengths and uniqueness, canonical on all 135 URLs, og image size, alt coverage, broken links, redirect chains, orphan pages, click depth, JSON-LD validity on every page, heading outlines, CWV. See section 11.

Click depth, estimated from code: Home links to Shop, Gifts, Wholesale, Story, Blog, Contact; the footer links categories, tools, wholesale group, help, legal. So categories, hubs and legal are depth 1. Products depth 2 (via /shop). Posts 12 at depth 2, the rest depth 3 or more via related and previous/next links unless the full list is in HTML. Project pages depth 2 via /projects. No page should be deeper than 4.

## 2. robots.txt and previews

- Production: correct. Preview: `Disallow: /` is correct but robots.txt does not stop indexing of URLs that other sites link to. Vercel normally adds `X-Robots-Tag: noindex` to preview deployments itself (UNVERIFIED here; check a preview URL header). If not, add to next.config.ts headers: `...(isProd ? [] : [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }])`.
- Because the vercel.app production host is crawlable now, anything Google indexes there must be redirected after the domain is bought (section 9). Until then, you may block it: set NEXT_PUBLIC_SITE_ENV=preview on Production, but only if you do not want indexing before launch (recommended: yes, keep the pre-launch site out of the index).
- /cart and /order: they carry or should carry noindex, so remove them from the robots `Disallow` list (Google must crawl to see noindex). Keep `/styleguide` disallowed (proxy.ts removes it in production).
- Sitemap index split: not needed. Use `generateSitemaps()` only beyond about 5,000 URLs. Add `images` entries per product (Next supports `images` on sitemap entries) rather than a second file.
- llms.txt: feasible as `app/llms.txt/route.ts` returning static text. No major search engine documents using it, so P2. Content: site name, one line, then links to /shop, /wholesale, /custom, /stockists, /story, /faq, /journal, with only approved facts. Do not put prices or unconfirmed claims there.

## 3. Keyword and intent map

No search volumes are given: none were available to this audit (no Keyword Planner, GSC or paid tool). Treat every row as a hypothesis to test in Search Console once the domain has 4 weeks of data. "Ranks" = what the web search returned, VERIFIED-WEB; People Also Ask boxes were not returned by the search tool, so PAA is UNVERIFIED.

### 3.1 SERP check (10 queries, 2026-10-04)

| Query | What ranked (types) | Gap or note |
|---|---|---|
| handmade crocheted stuffed animals Kenya Nairobi | US fair trade retailers (Just One Africa, Zuri, Amani Africa, African Mod for Kenana Knitters in Nakuru), Etsy, one B2B directory (Ruma Craft, Nairobi) | No Kenyan-owned crocheted animal store ranked. Opening for a Nairobi, Kenya page. Competitors sell knitted wool or sewn kitenge, not recycled acrylic crochet. |
| crochet giraffe toy Kenya (and buy) | Etsy listings and patterns only | "Crochet giraffe" is dominated by DIY patterns. Use "crocheted giraffe" and "giraffe stuffed animal Kenya" in titles; do not chase pattern intent. |
| crochet elephant toy Kenya | Etsy, 54kibo (savannah crocheted toys), Global Gifts, a Kenyan fair trade group (Creation Hive) dressed in kitenge | Kenya-made crocheted elephants exist on few sites. Real competitors: 54kibo, Creation Hive. |
| safari soft toys Kenya handmade | Etsy, Amazon, Bambuzi Toys (Kenya), Pinterest, a Mombasa kitenge range | Marketplaces dominate. Category page needs "safari" and Kenya, not "toys" (R10 keeps "animals" in headings). |
| custom crochet plush Kenya made to order | Etsy and overseas plush sellers; no Kenyan result | Clear gap: nobody in Kenya ranks. /custom should own it. |
| corporate gifts Nairobi handmade custom plush | Purpink, Blueline, Signature Kenya, Garo, Ruma Craft (plush supplier, custom design) | Competition is gift-hamper stores. Plush angle only has Ruma Craft. Post owns it, not a product page. |
| baby shower gifts Nairobi handmade soft toys | Baby shops (Asher Kids, Lumi, Bassinet, Tash), Nairobi Gifters, Bambuzi, Etsy | Commercial list pages. Our post can win long tail; avoid baby-safety wording (banned until evidence). |
| Kenyan souvenirs for lodges wholesale | Pink Skink (supplies named lodges), Swahili Wholesale, Tripadvisor lists, travel blogs | Wholesale lodge angle is held by Pink Skink. Our edge: crocheted animals, 7 named stockists. Needs a lodges section on /wholesale. |
| recycled yarn toys Kenya | Yarn shops (Amazon, Jumia recycled chenille), a Crochet Kenya charity site | Low intent for us. Use as supporting term on /safety and the materials posts, not a target page. |
| send gift to Kenya from abroad handmade | Gift delivery sites (Garo, Floral Whispers, Giftblooms) | Diaspora searches are about delivery. We have no international or diaspora delivery decided (D15). Hold until the owner confirms. |

Not run: "crocheted animals Kenya" exact, "wholesale handmade toys Kenya" exact (covered by the lodges query). Run them in a browser with a Kenyan IP and note PAA.

### 3.2 One owner per primary query

| Primary query (hypothesis) | Intent | Owner URL | Must not appear in primary position on |
|---|---|---|---|
| crocheted animals Kenya | Brand and category | / | /shop, categories |
| handmade stuffed animals Nairobi | Commercial | /shop | / |
| crocheted safari animals, safari stuffed animals | Commercial | /shop/safari-animals | /shop |
| crocheted elephant, giraffe, lion, rhino, zebra (each) | Product | /shop/{animal} | posts (they link to the product, with the animal name as anchor, but do not use "crocheted {animal}" as post title) |
| custom crocheted animals, custom crochet plush | Commercial | /custom | /custom/studio (tool; title about designing) |
| design your own animal | Tool | /custom/studio | /custom |
| wholesale crocheted animals, wholesale handmade toys Kenya | B2B | /wholesale | /partners, /supply |
| Kenyan souvenirs for lodges, safari lodge gift shop supplier | B2B | /wholesale (new section "Lodges and gift shops") or later /wholesale/lodges | /stockists |
| where to buy crocheted animals Nairobi | Local | /stockists | /story |
| crocheted animal gifts | Gift | /gifts | /shop |
| baby shower gifts Nairobi | Info/commercial | /journal/baby-shower-gifts-from-nairobi | /gifts |
| corporate gifts Nairobi | B2B gift | /journal/corporate-gifts-custom-animals | /custom |
| what is amigurumi | Info | /journal/amigurumi-what-the-word-means | none |
| how to look after a crocheted animal | Info | /care | posts |
| size of crocheted animal | Info | /size-guide | /size-finder (tool) |
| recycled acrylic yarn toys | Info | /safety (materials) | home |

Three audiences: Kenya buyers (WhatsApp ordering, Nairobi pickup or delivery, "Price on request"); tourists (stockist airport and attraction locations: Giraffe Centre Karen, JKIA; content "where to buy a souvenir before you fly"); diaspora (send to a recipient in Kenya, D15). The diaspora has no ordering path decided, so only content should be written, not a dedicated page, until the owner answers Q3.

### 3.3 Cannibalisation check among 47 posts

There is no Search Console data yet (pre-launch), so the mandatory page+query check cannot be run. From the 13 titles seen, risk pairs to watch: "Baby shower gifts from Nairobi" vs "A welcome gift for a new brother or sister" (different intent, low risk); "Corporate gifts with a custom animal" vs "What to put in a custom brief" vs /custom (shared word "custom": give /custom the head term, keep posts to "corporate" and "brief checklist"); "Christmas animals" vs "Easter gifts": distinct. Rule: no post title may start with "Crocheted {animal}" or "Crochet {animal}" (owned by product pages). Run at day 28 after launch: export Performance report with dimensions page and query to CSV, group by query, flag queries with 2 or more pages both in the top 20; owner is the page with the most impressions, others get a link to it and a title without that keyword. Titles in section 5 were designed so no two share a primary keyword.

## 4. Structured data plan

Rules: no Offer, price, availability, aggregateRating, review while pricesConfirmed is false (R7, D11). No search box, so no SearchAction. No address until [PHYSICAL ADDRESS] exists. All JSON-LD must escape `<` as `<` (D39; JsonLd component does this, VERIFIED-CODE per D39 but not read).

### 4.1 Organization (layout, every page). Add @id and email only if set.
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "{BASE}/#organization",
  "name": "Mikono Creations",
  "url": "{BASE}",
  "logo": { "@type": "ImageObject", "url": "{BASE}/logo.png", "width": 512, "height": 512 },
  "description": "Crocheted animals handmade in Nairobi from recycled acrylic yarn. 25+ women supported.",
  "foundingDate": "2019",
  "founder": { "@type": "Person", "name": "Leah Maina" },
  "telephone": "+254724592115",
  "areaServed": { "@type": "Country", "name": "Kenya" },
  "sameAs": ["https://www.facebook.com/mikonocreations", "https://www.instagram.com/mikonocreations"],
  "contactPoint": [{ "@type": "ContactPoint", "telephone": "+254724592115", "contactType": "customer service", "areaServed": "KE", "availableLanguage": ["en", "sw"] }]
}
```
Width and height of the logo are placeholders; read the real size of public/logo.png (UNVERIFIED; Google wants at least 112 x 112, and a shape that is not mostly white). Add `"address": {"@type":"PostalAddress","streetAddress":"[PHYSICAL ADDRESS]","addressLocality":"Nairobi","addressCountry":"KE"}` only when the owner supplies it; until then omit the key entirely. The telephone is formatted with a plus and digits only in the current code (+254724592115), which is accepted.

### 4.2 LocalBusiness / Store
Do not add yet. LocalBusiness needs a real address or a pickup point. The business has a Nairobi workroom but the brief gives no public address. Ask Q1. If pickup exists, change `@type` to `["Organization","Store"]`, add `address`, `openingHoursSpecification` (only real hours), `geo`, `priceRange` only if prices are confirmed. The seven stockists are other businesses: list them on /stockists as an ItemList of names with locations in visible text, not as Mikono LocalBusiness entries (P2).

### 4.3 WebSite (home only). No SearchAction.
```json
{ "@context": "https://schema.org", "@type": "WebSite", "@id": "{BASE}/#website", "url": "{BASE}", "name": "Mikono Creations", "inLanguage": "en-KE", "publisher": { "@id": "{BASE}/#organization" } }
```

### 4.4 ProductGroup (current output is valid; improvements)
Add `sku`-less group id as now, plus: `description`, `url` on each variant, `brand` on each variant, `image` as an array of 1 to 4 absolute URLs. Current shape is correct for no prices. Without offers there is no Product rich result; the markup is still useful for entity understanding.
```json
{
  "@context": "https://schema.org",
  "@type": "ProductGroup",
  "@id": "{BASE}/shop/giraffe#product",
  "name": "Giraffe", "description": "{lead}", "url": "{BASE}/shop/giraffe",
  "productGroupID": "giraffe",
  "brand": { "@type": "Brand", "name": "Mikono Creations" },
  "image": ["{BASE}/media-opt/....webp"],
  "variesBy": ["https://schema.org/color", "https://schema.org/size"],
  "hasVariant": [{
    "@type": "Product", "sku": "giraffe-cream-m", "name": "Cream Giraffe, size M",
    "url": "{BASE}/shop/giraffe", "color": "Cream", "size": "M",
    "brand": { "@type": "Brand", "name": "Mikono Creations" },
    "image": "{BASE}/media-opt/....webp"
  }]
}
```
Switch to Offer when `pricesConfirmed` is true. Inside each variant add (the current code already builds the first part, with `url` and `availability`):
```json
"offers": {
  "@type": "Offer", "price": "1500.00", "priceCurrency": "KES",
  "url": "{BASE}/shop/giraffe", "itemCondition": "https://schema.org/NewCondition",
  "availability": "https://schema.org/InStock",
  "priceValidUntil": "2027-12-31",
  "shippingDetails": { "@type": "OfferShippingDetails",
    "shippingRate": { "@type": "MonetaryAmount", "value": "0.00", "currency": "KES" },
    "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "KE" },
    "deliveryTime": { "@type": "ShippingDeliveryTime",
      "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "DAY" },
      "transitTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "DAY" } } }
}
```
The numbers in the example (1500.00, 2027-12-31, 0.00, 1 to 3 days) are placeholders: take price from data, delivery from the confirmed deliveryAreas (D17), and omit `shippingDetails` and `hasMerchantReturnPolicy` until fees, times and returns are confirmed (FAQ page says they are not). `price` is a string with a dot. Availability map stays as in app/shop/[slug]/page.tsx (made_to_order only if Rich Results Test accepts it, D9). Still no aggregateRating until a real review system exists.

### 4.5 Article (journal posts). Current type is Article; keep it (BlogPosting is also valid).
```json
{
  "@context": "https://schema.org", "@type": "Article",
  "@id": "{BASE}/journal/{slug}#article",
  "headline": "{title}", "description": "{description}",
  "datePublished": "{post.date}", "dateModified": "{post.modified ?? post.date}",
  "image": ["{BASE}{hero.src}", "{BASE}/og/journal-{slug}.jpg"],
  "mainEntityOfPage": "{BASE}/journal/{slug}", "inLanguage": "en-KE", "articleSection": "{pillar}",
  "author": { "@type": "Organization", "name": "Mikono Creations", "url": "{BASE}" },
  "publisher": { "@id": "{BASE}/#organization" }
}
```
`headline` must be 110 characters or fewer. Add an optional `modified` field to JournalPost so dateModified is true; until then dateModified equal to datePublished is accurate but pointless.

### 4.6 BreadcrumbList
Implemented through breadcrumbLd and in the product page. Check that the last item has `name` and `item`. Required on every page with 2 or more path segments: the script flags the gaps. Pages known to carry it: /faq, /journal, posts, /gifts/finder, products.

### 4.7 FAQPage
Only /faq, and only when every Q and A is visible text. The rich result is gone for every site since 7 May 2026 (VERIFIED-WEB), so there is no ranking benefit; the markup helps nothing measurable. Keep it (no harm, content already matches) or drop it to save bytes; never add it to other pages. If any accordion renders answers only after a click, confirm they exist in the DOM when closed.

### 4.8 ItemList (category pages and /shop)
```json
{ "@context": "https://schema.org", "@type": "ItemList", "name": "Safari animals",
  "numberOfItems": 7,
  "itemListElement": [ { "@type": "ListItem", "position": 1, "url": "{BASE}/shop/elephant", "name": "Elephant" } ] }
```
Items carry only url and name (no price). Position order equals visual order.

### 4.9 VideoObject (click-to-play video)
Needs `name`, `description`, `thumbnailUrl` (absolute), `uploadDate` (ISO), `contentUrl` (the file URL) and `duration`. Upload date and duration are unknown to this audit (UNVERIFIED which page holds the video). Because the video is click-to-play from a file, add:
```json
{ "@context": "https://schema.org", "@type": "VideoObject", "name": "{title}", "description": "{one real sentence}",
  "thumbnailUrl": ["{BASE}{poster}"], "uploadDate": "{YYYY-MM-DD}", "contentUrl": "{BASE}{mp4}", "duration": "PT0M45S" }
```
Do not invent the upload date or duration; read them from the file and the manifest.

### 4.10 Brand and Person
Brand is nested inside Product as above. Person only for the founder inside Organization (already). Maker names are not published (R8), so no Person pages.

### 4.11 Validation approach
1. Local: seo-check.mjs parses every ld+json block and checks required properties per type, and fails on Offer, price or rating while `--prices-confirmed` is absent.
2. Rich Results Test (search.google.com/test/rich-results): paste the live URL of one page per type: home, giraffe product, one post, /faq, /shop/safari-animals. Expect Breadcrumb valid; Product shows as "Product snippets" only once offers exist.
3. validator.schema.org: paste the same URLs; fix errors, read warnings.
4. Search Console, Enhancements, after launch: Breadcrumbs, Products. Weekly for the first month.

## 5. Title and description rewrites (30 pages)

Source of truth for pasting: strategy/seo/titles.json. Titles use the layout template `%s | Mikono Creations` (19 characters), so segment limit is 41; the home title is absolute. All descriptions are 155 characters or fewer by hand count (the script will confirm). Claims appear only on plain animals. No prices. No "safe", "toys" or "Farm/Pets" words in headings (R10, D3).

| Route | Full title | Description |
|---|---|---|
| / | Crocheted Animals Kenya \| Mikono Creations | Crocheted animals made by hand in Nairobi from recycled acrylic yarn. Giraffe, elephant, lion and more. Zero plastic, nothing detachable. |
| /shop | Shop Handmade Stuffed Animals Nairobi \| Mikono Creations | Shop crocheted stuffed animals made by hand in Nairobi from recycled acrylic yarn. Pick a colour and size, then ask us on WhatsApp for the price. |
| /shop/safari-animals | Crocheted Safari Animals from Kenya \| Mikono Creations | Crocheted elephant, giraffe, lion, rhino, zebra, hippo and monkey, made by hand in Nairobi from recycled acrylic yarn. Zero plastic, nothing detachable. |
| /shop/domestic-animals | Crocheted Domestic Animals, Nairobi \| Mikono Creations | Crocheted rabbit, cat, dog, bear and goose, made by hand in Nairobi from recycled acrylic yarn. Zero plastic, nothing detachable. Order on WhatsApp. |
| /shop/more-animals | More Crocheted Animals, Made in Nairobi \| Mikono Creations | Crocheted octopus, shark, turtle, butterfly, chameleon and dinosaur, made by hand in Nairobi from recycled acrylic yarn. Zero plastic, nothing detachable. |
| /shop/wall-art | Crocheted Animal Head Wall Art \| Mikono Creations | Crocheted lion, zebra and unicorn heads for the wall, handmade in Nairobi. Pick a colour and ask us on WhatsApp for the price and sizes. |
| /shop/dolls | Handmade Crocheted Dolls from Nairobi \| Mikono Creations | Crocheted dolls, plain or in a dress, handmade in Nairobi. Choose a colour and ask us on WhatsApp for the price. |
| /shop/elephant | Crocheted Elephant, Handmade in Nairobi \| Mikono Creations | A crocheted elephant made by hand in Nairobi from recycled acrylic yarn. Zero plastic, nothing detachable. Choose a colour and size, then ask on WhatsApp. |
| /shop/giraffe, lion, rhino, zebra, hippo, monkey, rabbit | Crocheted {Animal}, Handmade in Nairobi \| Mikono Creations | Same template with the animal name. Longest case (elephant, giraffe) is 154 characters. Use only where `copy.claims === "plain"`; for any animal in clothes use the no-claim version "Handmade in Nairobi." |
| /custom | Custom Crocheted Animals Made in Nairobi \| Mikono Creations | Ask for a custom crocheted animal made by hand in Nairobi. Share your idea, we reply on WhatsApp with what is possible and a quote before anything is made. |
| /custom/studio | Design Your Own Crocheted Animal \| Mikono Creations | Choose a shape, size, colours and details for a custom crocheted animal, then send your brief on WhatsApp. We quote before anything is made. |
| /wholesale | Wholesale Crocheted Animals for Shops \| Mikono Creations | Wholesale crocheted animals from Nairobi for gift shops and lodges. Request a price list, quote or sample pack and a person replies on WhatsApp. |
| /gifts | Crocheted Animal Gifts from Nairobi \| Mikono Creations | Gift ideas in crocheted animals, handmade in Nairobi from recycled acrylic yarn. Pick an animal and colour, add a note, and order on WhatsApp. |
| /stockists | Where to Buy Mikono Animals in Nairobi \| Mikono Creations | Find Mikono Creations crocheted animals at seven outlets in Nairobi, including Village Market, Yaya Centre, Giraffe Centre Karen and JKIA. |
| /story | Our Story: Mikono Creations, Nairobi \| Mikono Creations | Mikono means hands. Founded in 2019 by Leah Maina in Nairobi, we crochet animals from recycled acrylic yarn and support 25+ women. |
| /journal | Blog: Kenyan Animals, Gifts and Craft \| Mikono Creations | Plain-word posts on Kenyan animals, gifts, play at home, yarn and craft, and working with Mikono Creations in Nairobi. |
| /journal/baby-shower-gifts-from-nairobi | Baby Shower Gifts in Nairobi \| Mikono Creations | Ideas for a baby shower gift in Nairobi: a handmade crocheted animal in recycled acrylic yarn. Choose a colour and ask us on WhatsApp. |
| /journal/corporate-gifts-custom-animals | Corporate Gifts Nairobi: Custom Animals \| Mikono Creations | Corporate gifts in Nairobi with a custom crocheted animal. See what to include in your brief, then send it and we reply with a quote on WhatsApp. |
| /journal/amigurumi-what-the-word-means | What Is Amigurumi? A Plain Explanation \| Mikono Creations | What the word amigurumi means, and how it relates to the crocheted animals we make by hand in Nairobi. |
| /journal/custom-brief-checklist | Custom Crochet Animal Brief Checklist \| Mikono Creations | What to put in a brief for a custom crocheted animal: shape, size, colours and details. Send it from the Studio and we reply on WhatsApp. |
| /journal/becoming-a-mikono-stockist | Become a Stockist of Crocheted Animals \| Mikono Creations | Questions about becoming a Mikono stockist, answered plainly. See the shops in Nairobi that already sell our crocheted animals. |
| /journal/a-childs-guide-to-the-big-five | keep current | keep current |
| /journal/christmas-animals-choose-early | Christmas Crocheted Animals: Ask Early \| Mikono Creations | Planning a Christmas gift? Choose a crocheted animal early and ask us first on WhatsApp about colours and sizes. |
| /journal/choosing-a-size-as-a-gift | How to Choose a Size for a Gift \| Mikono Creations | How to choose a size for a gift: Small to Extra large compared in plain words, with no centimetre guesses. Ask us if you are unsure. |

Count: home 1, shop 1, categories 5, products 8, studio 1 plus custom 1, wholesale 1, gifts 1, stockists 1, story 1, journal 1, posts 8 = 30. The product template covers 8 products with one entry row.

Cannibalisation check on these strings: "Crocheted Animals" head term is in home and shop only as "Crocheted Animals Kenya" vs "Handmade Stuffed Animals Nairobi" (different modifiers); safari owned by the safari category; animal names only on product pages; "custom" head term on /custom, with studio on "design"; "gifts" owned by /gifts, "baby shower" and "corporate" by posts.

Claim notes for the owner: the Mikono "founded 2019" and "Mikono means hands" are confirmed by R2. "Support 25+ women" matches the approved wording. The stockists description names venues allowed under R2.

## 6. International and local

- Language: keep one language, `lang="en-KE"`. No hreflang is needed. Add hreflang only if a second language or country version is built. Do not use `en` vs `en-KE` variants; it would duplicate pages. Search Console has no international targeting setting for new properties.
- Google Business Profile (GBP): Online and WhatsApp-led businesses without a public shop can create a service-area profile that hides the address (VERIFIED-WEB from Kenyan guides, not from Google; confirm on support.google.com/business). Steps: sign in with a business Google account; add the name "Mikono Creations" exactly as on the site; category primary "Toy store" or "Gift shop" (choose after checking which Google offers; UNVERIFIED), secondary "Handicraft"; choose service area (Nairobi, Kenya) and hide address if no storefront; phone +254 724 592 115; website URL (after domain); verify by video or phone as Google offers (postcard needs an address); add 10 or more real photos (from the media manifest, already cleared); add products only without prices until confirmed (price field is optional); posts monthly; turn on Q&A answers by seeding real questions with answers; ask real customers for reviews with a short link (never buy or gate them). If a pickup point exists, show the address.
- Bing Places: import from GBP. Bing Webmaster Tools: add site, import from Search Console.
- Citations: a consistent name, phone and website on Facebook, Instagram, a Jumia or Kilimall seller page only if the owner wants it, and the stockists' own pages ("stocked at Mikono Creations", with a link). Ask each of the 7 stockists for a link to /stockists. Kenyan directories (BrandKenya, Kenya Gift shops lists) after the domain exists.
- Google Merchant Center: Kenya is listed with KES as a supported currency for Shopping ads and free listings in Google's own "Supported languages and currencies" page (VERIFIED-WEB, support.google.com/merchants/answer/160637). Free local listings are NOT available in Kenya (that list excludes Kenya, VERIFIED-WEB via secondary sources). Needs: a domain you own, prices, shipping and return policy on the site, and a feed. Blocked until `pricesConfirmed` is true and delivery and returns are published. Do not sign up before then.
- Meta and TikTok catalogue feeds: both need price. Draft schema below. Blocked by the same flag.
- WhatsApp Business: complete the profile (name, category, description with approved wording, address only when set, hours, website, email), add catalogue items with names, colours and photos but no prices ("Ask for price" in the description), set greeting and away messages, short links, labels for wholesale and custom. The catalogue is not a SEO signal; it helps conversion from Instagram and GBP.

### Feed draft (script plan, not built)
Script `scripts/build-feeds.mjs`: read `data/catalogue.generated.json` (structure UNVERIFIED; this audit did not open it), refuse to run unless `pricesConfirmed` is true and every variant has a price, then write `public/feeds/google.tsv` and `public/feeds/meta.csv` at build time. Fields: `id` = SKU (D5), `item_group_id` = product slug, `title` = "{Colour} {Animal}, size {S|M|L|XL}", `description` = lead text, `link` = absolute product URL with `?sku=` only if the page supports it, `image_link` = absolute hero image of the colourway, `additional_image_link` up to 10, `availability` from variant availability (only ready, limited and lead-time confirmed made_to_order are included, D9), `price` = "1500.00 KES", `condition` = new, `brand` = Mikono Creations, `color`, `size`, `product_type` = category label, `google_product_category` = Stuffed Animals (read the numeric id from Google's taxonomy file), `identifier_exists` = no (no GTIN), `shipping` = after delivery fees are confirmed. TikTok catalogue uses the same columns.

## 7. Content SEO

### Internal linking map
- Home -> 5 categories -> products (exists). Category -> top-level guides: add a "Read more" row of 2 to 3 posts per category, picked by topic (safari category -> Big Five post; domestic -> care guide).
- Product -> related posts: add a "Read about the {animal}" link to the post with the highest `animalsIn` score (the reverse direction already exists via "Shop the animals in this post"). Same anchor text as the animal name, once.
- Product -> /custom/studio, /size-guide, /care, /safety (exists).
- Posts -> product page for animals named (exists), -> /wholesale for the business posts, -> /custom for custom posts.
- /wholesale -> /stockists, /partners, /terms/wholesale; /stockists -> /wholesale (so a shop owner can see who sells it).
- /journal must expose all 47 posts in raw HTML or a plain `?page=2` series; today the page shows 12 then a button (P1-6).
- Blog clusters (pillars exist in content/journal): Animals of Kenya, Parenting and play, Sustainability, Craft and process, Makers and impact, Gifting and occasions, Business and partners. Add one cluster page per pillar later, not before data shows demand.

### Headings, FAQ and E-E-A-T
- Add visible Q and A blocks (not FAQPage rich results) to: /wholesale (minimum order, samples, lead time: only if confirmed), /custom (how a quote works), /stockists (how to become one). Answers must be real; unconfirmed items stay as "Not answered yet" as /faq does.
- E-E-A-T: name the organisation as author (already). Add a visible "Written by the Mikono team" line and a last-updated date on posts. Link /story, /makers, /impact, /contact from the footer (exists). Do not publish maker names (R8). Keep legal pages in the footer. Reviews: only a placeholder page section "Reviews coming" is not recommended; leave it out until real reviews exist.
- Resolve the plastic wording (P0-3) because trust is the main E-E-A-T lever for a handmade-claims site.

### Image SEO
- File names: the optimiser writes WebP to public/media-opt; confirm names are descriptive (for example `crocheted-giraffe-cream.webp`), not hashes (UNVERIFIED).
- Alt pattern products: "{Colour} crocheted {animal}, handmade in Nairobi" for the hero, "{Colour} crocheted {animal}, {view}" for others. Group shots: "Crocheted {animals} together, handmade in Nairobi". Alt is already carried from the manifest; audit with the script (`img without alt`).
- Images in the sitemap: add `images: [absolute URL]` per product (hero plus colourways) in app/sitemap.ts. Captions only on journal photos.
- Sizes: the custom loader serves widths 320 to 1600 and 160 and 240; keep hero under about 150 KB per variant at 1280 (UNVERIFIED sizes).
- OG: /og/*.jpg generated by scripts/build-og.mjs from data/og.generated.json; add a test that every sitemap URL has a unique or default OG that returns 200 and is 1200 x 630.

### 90-day editorial calendar (relative weeks, not calendar dates)
Today is 2026-10-04 and posts on Christmas and Easter already exist, so the first job is to update, not to publish.
- Weeks 1 to 2: set titles and descriptions from section 5; refresh the Christmas post (add links to the gifts page and the Studio), check its lead-time claims against what the owner confirms.
- Weeks 3 to 4: new post "Crocheted animals for a nursery in Nairobi" only if it avoids baby-safety claims; new section "Lodges and gift shops" on /wholesale (replaces a new page; ask Q4).
- Weeks 5 to 6: tourist content "Where to buy a Kenyan souvenir before you fly" (airport and Giraffe Centre outlets from /stockists, approved facts only). Link to /stockists.
- Weeks 7 to 8: diaspora content "Sending a gift to a family member in Kenya" only after the owner decides the delivery path (Q3).
- Weeks 9 to 10: Easter and school holiday hooks refresh (check that the dates exist in a source before naming them).
- Weeks 11 to 13: mid-term review with Search Console data (queries, cannibalisation, CTR by title), then rewrite the 10 worst titles by CTR.
Seasonal gift peaks to check against real Kenyan calendars before naming dates: Christmas, Easter, Mother's Day, school terms, tourist high seasons, baby showers (year round).

## 8. Technical

- Core Web Vitals: the strategy/gates perf reports were not read in this session (UNVERIFIED). Run PageSpeed Insights on /, /shop, /shop/giraffe and a post after the domain exists; targets LCP < 2.5s, INP < 200ms, CLS < 0.1. Known risks from code: a synchronous script `/splash-gate.js` in `<head>` and an intro overlay (SPLASH_HTML) painted on first frame; this can hurt LCP and, if bots wait on it, content visibility. The splash skips for bots and reduced motion (per layout comment); confirm with a Googlebot user agent in the script (not done).
- Mobile-first parity: content in accordions (FAQ, product details) must exist in raw HTML. Check with the script's raw-HTML text word count and a manual view of `curl -s URL | grep -c "Question text"`.
- JavaScript SEO: Static generation (generateStaticParams, dynamicParams false) means text and links are in the HTML. Home had H1, 9 H2s and 45 or more links in the fetched content (VERIFIED-LIVE). Journal "Show more" and shop filters are client-side; check them with curl.
- 404: real 404 (VERIFIED-LIVE). Soft-404 check is in the script.
- Security headers: present (VERIFIED-CODE). HSTS has no `preload`; do not add until the domain is final.
- HTTP/2, brotli: handled by Vercel; confirm with `curl -sI --http2 -H 'accept-encoding: br' URL` (UNVERIFIED).
- Caching: media immutable for one year; `/og` one day; HTML default Vercel static. Fine.
- Favicons and manifest: app/icon.png, app/apple-icon.png, app/manifest.ts exist (VERIFIED-CODE listing). Check `theme_color` and 192 and 512 icons.
- OG: public/og exists (default reachable).
- Trailing slash: Next default; `/shop/` should 308 to `/shop`. The script checks it.
- www vs non-www: choose one in Vercel Domains, redirect the other (308), put the chosen host in NEXT_PUBLIC_SITE_URL.

## 9. Domain launch, Search Console, Bing, redirects

1. Buy the domain. Add it in Vercel Project, Domains. Choose the canonical host (apex or www) and let Vercel redirect the other.
2. Set `NEXT_PUBLIC_SITE_URL=https://{canonical-host}` for Production (and Preview if you want absolute preview links). Redeploy. The site builds canonical, OG, JSON-LD, sitemap and the robots Sitemap line from it. Run `seo-check.mjs https://{canonical-host} --env=production`.
3. Redirect the vercel.app production host to the new domain: Vercel Domains, edit `mikono-creations.vercel.app`, choose "Redirect to" the new domain with 308 (permanent; search engines treat 301 and 308 the same). The redirect applies to every path. Do not keep both hosts live; do not canonical across hosts only.
4. Search Console: add a Domain property and verify with a DNS TXT record at the registrar (covers http, https, www). Fallback URL-prefix property with the HTML tag. For the HTML tag use metadata in app/layout.tsx: `verification: { google: "{token}", other: { "msvalidate.01": "{bing token}" } }` inside `export const metadata`. Keep the DNS record for good.
5. Submit `https://{host}/sitemap.xml` in Search Console and Bing. If the vercel.app host was ever added, use Change of Address only for domain-level moves; for a *.vercel.app source it is not available, so rely on 308s and sitemap resubmission.
6. Bing Webmaster Tools: sign in, import from Search Console, or verify with DNS CNAME or the msvalidate.01 meta tag.
7. After 24 hours: inspect five URLs with the URL Inspection tool (home, shop, a product, a post, /stockists), request indexing for home and shop only.
8. Week 1 and week 4: Pages report (excluded reasons), Sitemaps report, Enhancements. Keep a log.

### Launch-day checklist
- NEXT_PUBLIC_SITE_ENV is production on the production deployment; previews are noindex
- `seo-check.mjs` passes with zero P0
- robots.txt allows crawling, lists the sitemap on the new host
- No `vercel.app` string in HTML, sitemap or JSON-LD
- vercel.app redirects to the new host with one hop
- Chosen host (www or apex) redirects the other with one hop
- HTTPS valid, HSTS present
- Search Console and Bing verified, sitemap submitted
- GBP created, website field filled
- Analytics and consent bar still load (CSP unchanged)
- Social profile links updated to the new URL
- Stockists asked for a link
- Prices still hidden everywhere until confirmed

## 10. Prioritised fix list

P0 = breaks indexing or violates rules. P1 = high impact. P2 = polish. File paths are relative to the repo.

### P0 (4)
| # | Fix | File | Exact change |
|---|---|---|---|
| P0-1 | Explicit base URL on launch | Vercel env, `next.config.ts` (no code change) | Set `NEXT_PUBLIC_SITE_URL` (Production) to the final host with no trailing slash. Gate the release on `seo-check.mjs` |
| P0-2 | Keep pre-launch vercel.app out of the index, then redirect | Vercel env / Domains | Either set `NEXT_PUBLIC_SITE_ENV=preview` on Production until launch, or accept indexing and add the 308 redirect at launch (section 9) |
| P0-3 | Resolve "Zero plastic" vs the acrylic post | `content/journal/*` (post `acrylic-is-a-plastic-based-fibre`), `data/copy.ts`, `data/facts.ts` | Owner decision (Q2). Acceptable path: keep "zero plastic" strictly as "no plastic parts" wording wherever it appears (for example "No plastic parts, nothing detachable"), and make the post link to /safety. Do not use the claim without the qualifier if the post stays |
| P0-4 | noindex on private result pages | `app/order/page.tsx`, `app/order/sent/page.tsx`, `app/custom/studio/sent/page.tsx`, `app/cart/page.tsx`, `app/robots.ts` | Confirm `robots: { index: false, follow: false }` in each page metadata; then remove `/cart` and `/order` from the robots `private_` list so crawlers can read the tag. Keep `/styleguide` |

### P1 (14)
| # | Fix | File | Exact change |
|---|---|---|---|
| P1-1 | Title and description rewrites | `lib/shopMeta.ts`, `app/shop/[slug]/page.tsx` (`metaTitle`), `app/page.tsx`, `app/wholesale/page.tsx`, `app/gifts/page.tsx`, `app/stockists/page.tsx`, `app/story/page.tsx`, `app/journal/page.tsx`, `app/custom/page.tsx`, `app/custom/studio/page.tsx`, post titles | Values in section 5 / `strategy/seo/titles.json`. Product: `title: \`Crocheted ${p.name}, Handmade in Nairobi\`` and the template description. Home: `title: { absolute: "Crocheted Animals Kenya \| Mikono Creations" }` |
| P1-2 | Real lastmod and image entries in the sitemap | `app/sitemap.ts`, `lib/routes.ts` | Return `{ url, lastModified: post.modified ?? post.date }` for posts and projects only; omit it elsewhere (a fake build date teaches Google to ignore lastmod). Add `images: [abs(hero.src)]` for products |
| P1-3 | Article accuracy | `app/journal/[slug]/page.tsx`, `content/journal` type | Add optional `modified`; `dateModified: post.modified ?? post.date`; `publisher: { "@id": "{BASE}/#organization" }`; add `inLanguage: "en-KE"` |
| P1-4 | Entity schema | `app/layout.tsx` | Add `@id` to Organization; logo as ImageObject with real size; `areaServed: {"@type":"Country","name":"Kenya"}`; add WebSite JSON-LD on home only, no SearchAction (4.3) |
| P1-5 | Product schema extras | `app/shop/[slug]/page.tsx` `productJsonLd` | Add `brand`, `url`, `description` to each variant, `@id` to group, image array (4.4). Add the Offer switch exactly as in 4.4 when `pricesConfirmed` |
| P1-6 | All posts in raw HTML; filter handling | `components/JournalIndex.tsx`, `next.config.ts` | Make `JournalIndexStatic` render all 46 cards as links (hidden visually after 12 is fine if they are real links), or paginate `/journal?page=2` with its own canonical. Add `"topic"` to the key list `["animal","colour","size"]` in the headers() block, canonical stays `/journal` |
| P1-7 | Preview noindex header | `next.config.ts` | Add `...(isProd ? [] : [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }])` to `headers()` |
| P1-8 | Category ItemList | `app/shop/[category]/page.tsx` (or the listing page), `app/shop/page.tsx` | Emit 4.8 beside `breadcrumbLd` |
| P1-9 | Internal links product -> post, category -> post | `app/shop/[slug]/page.tsx`, listing pages, `content/journal` | Add a "Read about the {animal}" link under "About this animal" using `postsAbout(slug)`; add 2 to 3 post links to each category |
| P1-10 | Search Console and Bing tokens | `app/layout.tsx` | `verification: { google: process.env.NEXT_PUBLIC_GSC_TOKEN, other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_TOKEN ?? "" } }` in `metadata`; env names to be added to lib/env.ts |
| P1-11 | Lodges and gift shops section | `app/wholesale/page.tsx` | Add an H2 "For lodges and gift shops" with 3 to 4 sentences using only approved facts; link to /stockists; request type already in the form |
| P1-12 | Google Business Profile and Bing Places | Off-site | Section 6 steps. Needs Q1 |
| P1-13 | VideoObject on the page holding the click-to-play video | that page + `lib/` | 4.9 with real uploadDate and duration |
| P1-14 | Seo check in CI | `scripts/seo-check.mjs`, `package.json` | Copy `strategy/seo/seo-check.mjs`; add `"seo:check": "node scripts/seo-check.mjs $SITE_URL"` and run it against the Vercel preview URL with `--env=preview` and against production with `--env=production` |

### P2 (8)
| # | Fix | File | Change |
|---|---|---|---|
| P2-1 | One signal for filtered shop URLs | `next.config.ts` | Drop the noindex header block and rely on the canonical to `/shop` (Google advises not mixing noindex with canonical to an indexable page). Only if the script shows the canonical is always correct |
| P2-2 | FAQPage | `app/faq/page.tsx` | Keep, or remove `<JsonLd data={faqLd()} />`; no ranking effect since May 2026 |
| P2-3 | llms.txt | `app/llms.txt/route.ts` | Static text with approved facts and key links |
| P2-4 | Tool pages in sitemap | `lib/site.ts` `staticRoutes` | Consider dropping `/size-finder`, `/build-a-family`, `/gifts/finder` from the sitemap or noindex them; keep `/custom/studio` |
| P2-5 | Stockists ItemList | `app/stockists/page.tsx` | List the 7 outlets as ItemList of names; no LocalBusiness for others |
| P2-6 | Add HSTS preload | `next.config.ts` | After the final domain is stable for months |
| P2-7 | Feed generator | `scripts/build-feeds.mjs` | Section 6 draft; after prices |
| P2-8 | Heading outline check | components | Fix any jump from h2 to h4 flagged by the script |

## 11. What could not be verified

- Per-URL crawl results for all 135 URLs (no shell). Titles, descriptions, canonicals, OG values, JSON-LD validity, alt coverage, broken links, redirect chains, orphan pages, click depth, trailing slash, www behaviour: UNVERIFIED on the live site; derived from code only.
- Raw head tags of live pages (the fetch tool did not expose them).
- The unmeasured OG image dimensions and logo size.
- Whether /order, /order/sent, /custom/studio/sent and /styleguide are noindex.
- The raw-HTML list of journal posts beyond 12; whether `JournalIndexStatic` contains all 47.
- JsonLd component implementation and the `data/catalogue.generated.json` shape (not opened).
- Core Web Vitals and strategy/gates perf reports.
- HTTP/2, compression, redirect status codes, HSTS on the live host.
- Search volume, difficulty, PAA boxes, any Kenya-specific result ordering (search tool is US-based). Competitor names come from one search each.
- Google Business Profile category availability and Kenyan verification options (secondary sources only).
- Merchant Center eligibility is supported by Google's currency table and secondary sources; confirm in the Merchant Center sign-up flow.
- Strategy/03-seo-and-tracking.md was not re-read in this pass; check it for any conflict with section 5 and 10.

## 12. Crawl output
Paste the output of `node strategy/seo/seo-check.mjs https://mikono-creations.vercel.app --env=production` here once run.

## 13. Questions for the owner

1. Is there a public shop or pickup point, and may its address be published (LocalBusiness, GBP address, schema)?
2. How should "zero plastic" be worded given the post that says acrylic is a plastic based fibre? Does it mean no plastic parts?
3. Can a diaspora buyer pay from abroad for a recipient in Kenya? If yes, the delivery and payment method.
4. Do you want a lodges and gift shop section on /wholesale and may it name lodges you already supply?
5. When will prices, delivery fees and the returns policy be confirmed (this unlocks Offer schema, Merchant Center and Meta/TikTok feeds)?
6. May "toys" appear in meta descriptions (R10 only covers headings)?
7. Which host will be canonical, apex or www, and when is the domain bought?
8. May the vercel.app site stay out of Google until launch?
