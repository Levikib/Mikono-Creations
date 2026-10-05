# Mikono Creations: SEO, Marketing Infrastructure and Tracking (Phase 2 report 03)

Obeys `00-CHARTER.md`. No em or en dashes, no invented facts, no AI filler. Anything not given in the client brief is marked **TODO** or **ASSUMED**. No search volumes appear in this file because none were verified. Section 1 lists how to obtain them.

Verification status used below: **VERIFIED** (stated in the charter or brief, or a stable platform specification), **ASSUMED** (reasoned, must be checked with real data), **TODO** (client input missing).

---

## 1. Keyword and intent map (Kenya, diaspora, tourists)

### 1.1 Evidence status
- No keyword tool or Search Console data has been consulted. Volumes, difficulty and SERP features are **unknown**. Do not write any number into copy or plans until measured.
- Measurement plan, in order: (1) Search Console from day one of launch; (2) Google Keyword Planner with Kenya as location (free with an Ads account); (3) manual SERP review of each target query on google.co.ke from a Nairobi IP, noting who ranks (marketplaces, Instagram, Etsy, Jumia, local shops); (4) Google Trends comparison of "stuffed animals", "soft toys", "crochet toys" for Kenya and for the UK, US and UAE as diaspora markets.
- Vocabulary risk (**ASSUMED**): Kenyans may search "soft toys", "teddy bears" or "toys" more than "stuffed animals" or "amigurumi". Test all three families in the first month and let Search Console decide the primary term per page.

### 1.2 Intent clusters and example target queries
Queries are hypotheses to test, not validated terms.

| Page type | Intent | Example target queries (ASSUMED) | Owner page |
|---|---|---|---|
| Homepage | Brand plus broad commercial | mikono creations, handmade crochet toys kenya | `/` |
| Shop hub | Commercial | crochet stuffed animals kenya, handmade soft toys nairobi | `/shop` |
| Species collection | Commercial | crochet giraffe toy, crochet elephant stuffed animal, handmade lion soft toy, crochet monkey toy, crochet rhino toy, crochet dog toy, crochet rabbit toy, crochet cat toy | `/shop/giraffes`, etc. |
| Category collection | Commercial | safari animal soft toys, domestic animal crochet toys, baby safe crochet toys | `/shop/safari-animals`, `/shop/domestic-animals` |
| Product | Transactional | [species] crochet toy [size], recycled yarn stuffed [species] | `/shop/[species]/[slug]` |
| Gift guides | Commercial investigation | gifts for baby shower kenya, newborn gift nairobi, first birthday gift handmade, gifts from kenya for kids, kenyan souvenirs for children | `/gifts/...` |
| Diaspora | Commercial | send gift to kenya from uk, kenyan handmade toys to ship abroad, african handmade toys for kids | `/gifts/from-kenya-diaspora` (**TODO**: shipping abroad is not in the brief, only write this page if the client confirms international shipping) |
| Tourist | Commercial | souvenirs from kenya for kids, safari souvenir toys, where to buy kenyan crafts nairobi | `/gifts/safari-souvenirs` |
| B2B | Commercial, lead | wholesale soft toys kenya, bulk handmade toys nairobi, corporate gifts kenya handmade, lodge gift shop supplier kenya, custom crochet toys for organisations | `/wholesale`, `/partners` |
| Informational | Informational | are crochet toys safe for babies, how to wash a crochet stuffed animal, safe toys for toddlers kenya, what is recycled yarn, how crochet toys are made | `/journal/...`, `/care`, `/size-guide` |
| Brand story and impact | Informational and trust | women empowerment crafts nairobi, ethical toys kenya, plastic free toys | `/story`, `/impact` |
| Local | Local commercial | handmade toys nairobi, toy shop karen, gifts village market nairobi, souvenirs jkia | see 1.3 |

### 1.3 Local queries (Nairobi, Karen, Village Market, JKIA)
- Rule: do not create a landing page for a place Mikono does not serve or stock. Whether there is a physical shop, stockist, or stall at Village Market, Karen or JKIA is **TODO** (not in the brief).
- If delivery zones exist: one `/delivery` page listing zones, fees and lead times (fees **TODO**), naming Nairobi neighbourhoods the client confirms. This captures "delivery in Karen" style queries honestly.
- If a stockist exists (a partner shop at Village Market, say): a section on `/stockists` with the partner's real name, address and hours (**TODO**, partner permission needed). No doorway pages like "toys in Karen" without a real basis.
- Local pack ranking depends on Google Business Profile (section 5), not on pages.

### 1.4 Cannibalization map (decide before writing copy)
Each primary term has exactly one owner. Titles and H1s must not share a primary term across pages.
- "crochet stuffed animals kenya": `/shop` only.
- "[species] crochet toy": species collection only. Product pages use the design name plus size or colour, never the bare species phrase as the lead term.
- "wholesale", "bulk", "corporate gifts": `/wholesale` only. `/partners` targets "partner with Mikono" and supply enquiries, not "wholesale".
- "care", "wash": `/care` owns it. Blog posts link to it, never repeat "how to wash" as a title.
- "safe", "child safe": `/safety` (or a section of `/story`, **decide in content plan**) owns it. Product pages mention safety in body only.
- After launch, query Search Console (dimensions page and query) monthly. If two pages show in the top 20 for one query with split clicks, consolidate per the ownership rule.

---

## 2. Site architecture and URL scheme

### 2.1 URL map
```
/                                  Home
/shop                              All products (listing, filters)
/shop/safari-animals               Category collection
/shop/domestic-animals             Category collection
/shop/giraffes                     Species collection (also elephants, lions, monkeys, rhinos, dogs, cats, rabbits)
/shop/giraffes/[slug]              Product (one per design; sizes and colours are variants)
/gifts                             Gift hub
/gifts/[slug]                      Gift guides (baby shower, newborn, safari souvenirs ...)
/wholesale                         Trade landing and quote form
/partners                          Partner showcase and partnership enquiry
/story  /impact                    Brand and maker story
/projects  /projects/[slug]        Projects
/journal  /journal/[slug]          Blog
/care  /size-guide  /safety  /faq  /delivery   Utility trust pages
/contact  /stockists
/cart  /order                      noindex (wizard, WhatsApp hand-off)
/privacy  /cookies  /terms         Legal
```
Lowercase, hyphenated, English, no trailing slash (set `trailingSlash: false`), no dates in URLs. Slugs are stable once published. Renames require a 301 in `next.config.ts` `redirects()`.

### 2.2 Size and colour handling
- **Size** (S, M, L, XL) and **colour** are variants of one product page. They are not separate indexable URLs. Selecting a variant updates the UI and optionally `?size=M&colour=olive`, which canonicalises to the base product URL.
- **Filters on `/shop` and collections** (size, colour, species, price) use query parameters. Canonical is the unfiltered collection URL. Filtered URLs are `noindex, follow`, and excluded from the sitemap. Do not block them in robots.txt (Google must see the noindex).
- **No colour or size landing pages** (for example "/shop/green-elephants") unless Search Console later shows demand and there are at least a handful of real products. Thin pages are the main duplicate risk.
- If a colourway is a visibly different design (the charter requires "green elephant" to show a green elephant), the catalogue agent may model it as a separate product only when the photography, description and name genuinely differ. Default is one product with colour variants, each variant carrying its own matched image from the manifest.
- Pagination: `?page=2`, self-canonical, indexable, listed 24 per page is **ASSUMED**; with a small catalogue, show all products on one page and avoid pagination.
- Sort parameters: `noindex, follow`, canonical to the base.

### 2.3 Internal linking
- Every product links to its species collection, its category, and 2 to 4 related products (same species other designs, then same category). Related products fill a uniform card row (charter rule 5).
- Every collection links to the relevant gift guide, `/size-guide` and `/care` in a short "good to know" block.
- Every blog post links to at least one collection or product, and one utility page. Every product with a care or safety question links to `/care` or `/safety`.
- Header nav: Shop, Gifts, Wholesale, Our story, Journal. Footer: utility, legal, contact, social. No orphan pages: QA check in section 9.
- Anchor text is descriptive ("crochet giraffe toys"), never "click here".

### 2.4 Breadcrumbs
Visible breadcrumb on all pages below depth 1, mirrored by `BreadcrumbList` JSON-LD. Examples:
- Home > Shop > Giraffes > Product name
- Home > Gifts > Baby shower gifts
- Home > Journal > Post title
The product breadcrumb uses the species collection, not the category, as its parent (one canonical path). The current page is the last item, not a link.

---

## 3. Page templates, metadata and schema

### 3.1 Metadata patterns
Lengths: title up to 60 characters, description 140 to 160. No em or en dashes. Use a pipe or comma. Brand suffix `| Mikono Creations`. Set via the Next.js `generateMetadata`, with `metadataBase` from `NEXT_PUBLIC_SITE_URL` (**TODO** domain).

| Template | Title pattern | Description pattern |
|---|---|---|
| Home | Handmade Crochet Animals from Nairobi \| Mikono Creations | Crochet safari and domestic animals in four sizes, made from recycled yarn by 25+ women in Nairobi. Zero plastic. Order on WhatsApp. |
| Shop | Crochet Stuffed Animals in Kenya \| Mikono Creations | (state product count only if computed from data) Browse crochet animals by species, size and colour. Prices in KES. Order on WhatsApp. |
| Species | {Species} Crochet Toys \| Mikono Creations | Handmade crochet {species} toys in sizes {sizes available}, made in Nairobi from recycled yarn. {n} designs, order on WhatsApp. |
| Product | {Design name}, {Species} Crochet Toy \| Mikono Creations | {Colour} crochet {species}, sizes {S to XL as available}, from KES {min price}. Recycled yarn, no plastic, child safe stitching. |
| Gift guide | {Occasion} Gifts from Kenya \| Mikono Creations | Short, specific line naming 2 to 3 real products. |
| Wholesale | Wholesale Crochet Toys, Kenya \| Mikono Creations | Supplying lodges, gift shops and organisations with handmade crochet animals. Request a quote on WhatsApp or by form. Minimums: TODO. |
| Blog post | {Question or topic} \| Mikono Journal | One sentence answer plus what the post covers. |

Rules: product price and "child safe" claims only if the data layer supplies them (safety testing claims need client evidence, **TODO**: ask what safety standard or checks apply before using the words "tested" or "certified"; "child safe" itself is a brief claim). Never write stock counts or review counts that are not real.

### 3.2 H1 rules
- One H1 per page, visible, matches the page's primary term in natural language, differs from the title tag wording slightly, never stuffed.
- Product H1 is the product name. Collection H1 is "{Species} crochet toys". Blog H1 is the post title.
- H2s follow user questions (size, material, care, delivery). Heading levels never skip.

### 3.3 JSON-LD
Render via a server component `<JsonLd data={...} />` using `<script type="application/ld+json">` with the output of `JSON.stringify`, escaping `<` as `<`. All values come from the data layer. Fields marked TODO render only when present, never as empty strings. Validate with the Rich Results Test and Schema Markup Validator (QA, section 9).

**Organization** (site wide, in root layout)
```json
{"@context":"https://schema.org","@type":"Organization","@id":"{SITE}/#org","name":"Mikono Creations","url":"{SITE}","logo":"{SITE}/logo.png","description":"Handmade crocheted animals made from recycled yarn in Nairobi, Kenya.","areaServed":"KE","sameAs":["TODO instagram","TODO tiktok","TODO facebook"],"contactPoint":[{"@type":"ContactPoint","contactType":"customer service","telephone":"TODO whatsapp e164","availableLanguage":["en","sw"]}]}
```

**LocalBusiness** (on `/contact` and `/stockists` only, and only with a real public address; if the business is online only, omit address and use `Organization` alone)
```json
{"@context":"https://schema.org","@type":"Store","@id":"{SITE}/#store","name":"Mikono Creations","image":"{SITE}/og/default.png","telephone":"TODO","address":{"@type":"PostalAddress","streetAddress":"TODO","addressLocality":"Nairobi","addressCountry":"KE"},"openingHoursSpecification":"TODO","priceRange":"TODO","parentOrganization":{"@id":"{SITE}/#org"}}
```

**Product** (product pages; `ProductGroup` is used when variants share one page)
```json
{"@context":"https://schema.org","@type":"ProductGroup","@id":"{URL}#product","name":"{name}","description":"{plain description}","brand":{"@type":"Brand","name":"Mikono Creations"},"material":"Recycled yarn","productGroupID":"{slug}","variesBy":["https://schema.org/size","https://schema.org/color"],"image":["{img1}","{img2}"],"url":"{URL}","hasVariant":[{"@type":"Product","sku":"{sku}","name":"{name}, {colour}, {size}","size":"M","color":"Olive","image":"{variant img}","offers":{"@type":"Offer","url":"{URL}?size=M&colour=olive","priceCurrency":"KES","price":"TODO from data","availability":"https://schema.org/InStock","itemCondition":"https://schema.org/NewCondition","seller":{"@id":"{SITE}/#org"}}}]}
```
Notes: availability values `InStock`, `OutOfStock`, `PreOrder` or `MadeToOrder` (use only the one the client confirms; handmade stock policy is **TODO**). Omit `aggregateRating` and `review` entirely until real reviews exist (charter rule 3). Omit `gtin` and `mpn`. Add `shippingDetails` and `hasMerchantReturnPolicy` once delivery and returns terms exist (**TODO**).

**BreadcrumbList** (every page below the home page)
```json
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"{SITE}"},{"@type":"ListItem","position":2,"name":"Shop","item":"{SITE}/shop"},{"@type":"ListItem","position":3,"name":"Giraffes","item":"{SITE}/shop/giraffes"},{"@type":"ListItem","position":4,"name":"{name}"}]}
```

**ItemList** (collection pages): `{"@type":"ItemList","itemListElement":[{"@type":"ListItem","position":1,"url":"{product url}"}]}` with URLs only, matching the visible order.

**FAQPage** (`/faq`, `/care`, `/wholesale`, size guide): only for questions visibly answered on the page, answers in plain text. Google restricts FAQ rich results for most sites (**ASSUMED**, check current docs), so the value is mainly structure and AI-answer eligibility. No FAQ markup on product pages with marketing text.

**Article** (blog and projects): `headline`, `datePublished`, `dateModified`, `image`, `author` (a real named person or the Organization, **TODO**), `publisher` (`@id` org), `mainEntityOfPage`.

**HowTo** (only the care guide, as steps are real: wash, dry, reshape). Google has reduced HowTo rich results (**ASSUMED**), so treat it as optional, low priority.

**WebSite** with `SearchAction` only if on-site search ships.

---

## 4. Technical SEO, social cards, images, performance

### 4.1 Sitemap, robots, canonical, hreflang
- `app/sitemap.ts`: lists home, `/shop`, collections, products, gift guides, wholesale, partners, story, impact, journal posts, projects, utility and legal pages. Excludes `/cart`, `/order`, filtered URLs, thank-you states. `lastModified` from data (real dates), no fabricated dates. Split by type only if over 500 URLs.
- `app/robots.ts`: `Allow: /`, `Disallow: /cart`, `/order`, `/api/`, plus the `Sitemap:` line. Do not disallow filter parameters (use noindex). Staging and preview deployments: `X-Robots-Tag: noindex` via env flag `NEXT_PUBLIC_SITE_ENV !== "production"`.
- Canonical: `alternates.canonical` on every page, absolute, no query string, https, one host (redirect `www` to apex or the reverse, **TODO** domain).
- Hreflang: single language market. Set `alternates.languages` to `{"en-KE": url, "x-default": url}` as self-references. Add `<html lang="en-KE">`. Swahili touches stay inline, no `sw` alternates until full translated pages exist. Diaspora traffic needs no separate locale.
- 404s return real 404 status. Redirects are 301, no chains.

### 4.2 Open Graph and Twitter
- `openGraph`: `type` (`website`, `article`, or `product` where used), `siteName`, `locale: en_KE`, `url`, `title`, `description`, `images`.
- `twitter`: `card: summary_large_image`, same title, description, image.
- **Generated OG images**: `opengraph-image.tsx` per route group using `ImageResponse`, 1200 by 630, PNG. Product template: product photo (approved manifest image only, cleared of identifiable people), name, "from KES {price}" (from data), logo mark, sand background with earthy palette tokens. Collection and blog templates use title text on the same palette. Fonts bundled locally. Photos of people without clearance are never used (charter rule 10).
- Fallback `/og/default.png` for pages without a generator.

### 4.3 Image SEO
- Filename pattern in `public/media/`: `{species}-{design}-{colour}-{size}-{shot}-{id}.webp`, lowercase, hyphens, for example `elephant-baobab-olive-m-front-img012.webp` (illustrative). IDs tie back to the manifest.
- Alt pattern: describe what is visible. Product: "{Colour} crochet {species}, size {size}, {shot type}". Lifestyle: describe the scene factually. No keyword stuffing, no "image of", no dashes. Decorative images get `alt=""`. Alt text for photos with people describes them respectfully and only when cleared.
- Use `next/image` with explicit `width` and `height`, correct `sizes` (for example `(min-width: 1024px) 25vw, 50vw` for cards), AVIF and WebP in `images.formats`, `quality` around 75, `priority` only on the LCP image, lazy loading everywhere else. Source files at most 2000 px on the long edge.
- Product pages expose 3 or more images in schema, matching the visible gallery.
- Image sitemap not needed; images are discoverable on pages.

### 4.4 Core Web Vitals checklist (Next.js)
Targets: LCP under 2.5s, INP under 200ms, CLS under 0.1 (field data, mobile, 75th percentile).
- [ ] Static generation (`generateStaticParams`) for products, collections, posts. Revalidate only when data changes.
- [ ] LCP image uses `priority` and `fetchPriority="high"`, correct `sizes`, no blob mask that forces extra layers on the hero.
- [ ] Fonts via `next/font`, `display: swap`, 2 families maximum, subset to Latin.
- [ ] Reserve space for every image and embed (aspect-ratio), no layout shift from the cart drawer, banner or wavy dividers.
- [ ] Consent banner is a fixed-position overlay with reserved height behaviour that does not push content (charter: no pop-up on first paint, so the banner is a small bottom bar, not a modal).
- [ ] Tracking scripts loaded `afterInteractive` through GTM, or `lazyOnload` for non-critical pixels. No tracking before consent.
- [ ] Minimise client components. Server components by default. Cart, wizard, filters are client islands.
- [ ] CSS animation only (compositor properties), disabled under `prefers-reduced-motion`. Avoid long main-thread work on filter changes (INP).
- [ ] Self-host the video poster, load the video on interaction, `preload="none"`.
- [ ] Measure with Lighthouse CI in QA and `useReportWebVitals` forwarded to GA4 as `web_vitals` events (consented).
- [ ] Budget: JS per route under 170 KB gzipped is **ASSUMED**, adjust after first build.

---

## 5. Local, merchant and catalogue feeds

### 5.1 Google Business Profile and citations
- Create a GBP only if Mikono has a location customers can visit, or operates as a service area business serving Nairobi (Google allows hiding the address). Address and category are **TODO**. Suggested primary category to test: gift shop or toy store (**ASSUMED**, pick from Google's list at setup).
- Fill name exactly as the brand name, hours, WhatsApp-linked phone, website, product posts, photos from the cleared manifest, services, attributes. Never use fake reviews or review gating.
- Request reviews from real customers after delivery with a WhatsApp message containing the GBP review link.
- Citations (consistent name, address, phone): Google, Bing Places, Apple Business Connect, Facebook page, Instagram bio, TikTok bio, and Kenya business directories chosen after manual check (**TODO**, names not verified). Keep NAP identical to the site's `/contact` page.
- Partner and lodge websites linking to the store are the best local link source, with their permission and real names only (**TODO**).

### 5.2 Google Merchant Center free listings
- Eligibility of Kenya for free listings and its currency, shipping and tax requirements is **ASSUMED, verify in Merchant Center help before building**.
- Requirements to prepare: verified and claimed domain, product feed, shipping and returns settings (**TODO** fees and policy), contact info matching the site.
- Feed generation: a route `app/feeds/google.xml/route.ts` (or a scheduled file) built from the typed product data, one item per variant. Fields: `id` (SKU), `title`, `description`, `link` (canonical product URL), `image_link`, `additional_image_link`, `price` (`1200.00 KES` format, actual price from data), `availability`, `condition` (new), `brand` (Mikono Creations), `identifier_exists` (no), `color`, `size`, `material` (recycled yarn), `item_group_id` (product slug), `product_type` (species path), `google_product_category` (Toys & Games > Toys > Stuffed Animals, verify the ID in the current taxonomy file), `age_group` (TODO, only if safety supports it), `shipping` (TODO).
- Price and availability in the feed must equal the page and the JSON-LD. QA checks equality (section 9).

### 5.3 Meta catalogue and TikTok catalogue
- Meta: create a catalogue in Commerce Manager, feed from `app/feeds/meta.csv/route.ts` (same data, Meta field names: `id`, `title`, `description`, `availability`, `condition`, `price`, `link`, `image_link`, `brand`, `color`, `size`, `item_group_id`). Use for dynamic ads and Instagram product tags where available in Kenya (**ASSUMED**, checkout on Meta is not expected in Kenya, so use "message business" or link to site). Match `content_ids` in Pixel events to the catalogue `id`.
- TikTok: create a catalogue in TikTok Ads Manager or Business Center, upload the same feed (scheduled fetch from the URL). Match `content_id` in TikTok events to the feed `id`. Availability of TikTok Shop in Kenya is not required, catalogue is for ads only.
- One canonical ID rule: `id` equals the variant SKU everywhere (feeds, events, schema `sku`).

### 5.4 WhatsApp Business catalogue
- WhatsApp Business app catalogue: add products by hand with images, name, price in KES, description, link to the product page. Do this for the best sellers first. Collections map to species.
- Product links use UTMs: `?utm_source=whatsapp&utm_medium=catalogue&utm_campaign=wa_catalogue`.
- Catalogue and site prices must match. Keep a single price source (the data layer) and export a CSV for manual entry.
- Set a greeting message, away message and quick replies for wholesale versus retail. Label chats (new lead, quote sent, paid, delivered) so attribution can be reconciled (see 6.6).

---

## 6. Tracking layer

### 6.1 Principles
- All tracking is loaded through one module `lib/tracking` and gated by consent. No tag fires before the consent state is read.
- Components never call `gtag`, `fbq` or `ttq` directly. They call `track("event_name", params)`, which pushes to `window.dataLayer`. GTM translates to each platform. (Fallback if GTM is not chosen: the same `track()` calls a thin adapter that fires GA4, Pixel and TikTok directly.)
- No personal data in event parameters: no phone numbers, names, addresses or message text. Order content is described by product IDs, quantities and totals only.
- Missing IDs are fine: if an env var is empty, that integration is silently absent. The build lists missing IDs in a startup log.

### 6.2 Environment variables
```
NEXT_PUBLIC_SITE_URL=            # TODO domain
NEXT_PUBLIC_SITE_ENV=production  # production | preview
NEXT_PUBLIC_GTM_ID=              # GTM-XXXXXXX, TODO
NEXT_PUBLIC_GA4_ID=              # G-XXXXXXXXXX, TODO (used directly only when no GTM)
NEXT_PUBLIC_META_PIXEL_ID=       # TODO
NEXT_PUBLIC_TIKTOK_PIXEL_ID=     # TODO
NEXT_PUBLIC_WHATSAPP_NUMBER=     # TODO, E.164 digits only
```
Server-only for later (not public): `META_CAPI_TOKEN`, `TIKTOK_EVENTS_API_TOKEN`, `GA4_API_SECRET`.

### 6.3 GTM container plan
- One container, one web environment per deploy (Live, Preview). Workspace naming `mikono-web`.
- **Consent initialisation**: a Consent Mode default tag on the Consent Initialization trigger (or set in code before GTM loads, preferred, see section 7). Every non-essential tag has consent checks (`analytics_storage` for GA4, `ad_storage` plus `ad_user_data` for Meta and TikTok).
- Variables: Constant (`GA4_ID`, `META_PIXEL_ID`, `TIKTOK_PIXEL_ID`), Data Layer variables for every parameter below (`dlv.items`, `dlv.value`, `dlv.currency`, `dlv.event_id`, `dlv.lead_type`, `dlv.utm_*`), a Lookup table for GA4 to Meta to TikTok event names.
- Tags: (1) GA4 Configuration (`send_page_view` true, `debug_mode` off in Live); (2) GA4 Event tag per event, using the event name directly; (3) Meta Pixel base plus one Meta event tag per mapped event with `eventID` taken from `dlv.event_id`; (4) TikTok Pixel base plus event tags, `event_id` the same; (5) Google Ads tag later if used.
- Triggers: Custom Event triggers named by event. History change trigger not needed (Next.js App Router): a `page_view` custom event is pushed by a client component on route change, and GA4 automatic page view is disabled to avoid double counts.
- Test with GTM Preview, GA4 DebugView, Meta Test Events, TikTok Test Events. Export the container JSON to `marketing/gtm/mikono-container.json` and commit it.

### 6.4 Event dictionary
Common parameters on every event: `page_type`, `currency` ("KES" when value present), `event_id` (UUID, for dedupe with server events later), UTM and click ID fields when stored (6.5). `items` use GA4 structure: `item_id` (variant SKU), `item_name`, `item_category` (category), `item_category2` (species), `item_variant` ("colour, size"), `price`, `quantity`, `item_brand`.

| Site event (GA4 name) | Fires when | Key parameters | GA4 | Meta | TikTok |
|---|---|---|---|---|---|
| `page_view` | Route change | `page_location`, `page_title`, `page_type` | page_view | PageView | Pageview (automatic) |
| `view_item_list` | Collection or related rail visible | `item_list_id`, `item_list_name`, `items` | view_item_list | none (custom `ViewList` optional) | none |
| `select_item` | Product card clicked | `item_list_name`, `items` | select_item | none | ClickButton (optional) |
| `view_item` | Product page loaded | `items`, `value`, `currency` | view_item | ViewContent (`content_ids`, `content_type: product`, `value`, `currency`) | ViewContent (`contents`, `value`, `currency`) |
| `select_variant` | Size or colour chosen | `item_id`, `size`, `colour` | custom `select_variant` | none | none |
| `add_to_cart` | Add to cart | `items`, `value`, `currency` | add_to_cart | AddToCart | AddToCart |
| `remove_from_cart` | Removed | `items`, `value` | remove_from_cart | none | none |
| `add_to_wishlist` | Wishlist heart (if shipped) | `items` | add_to_wishlist | AddToWishlist | AddToWishlist |
| `view_cart` | Cart drawer opened | `items`, `value` | view_cart | none | none |
| `begin_checkout` | Order wizard step 1 shown | `items`, `value`, `currency`, `checkout_type` (retail or wholesale) | begin_checkout | InitiateCheckout | InitiateCheckout |
| `wizard_step` | Each wizard step completed | `step_number`, `step_name` | custom | none | none |
| `add_shipping_info` | Delivery step done | `delivery_zone`, `value` (no address) | add_shipping_info | none | none |
| `whatsapp_order_submit` | Customer taps the final "Send order on WhatsApp" button | `items`, `value`, `currency`, `order_ref`, `checkout_type`, `delivery_zone`, UTMs | custom `whatsapp_order_submit` (marked as key event) | Lead (retail) or Purchase is NOT sent, see 6.6 | SubmitForm or PlaceAnOrder (see 6.6) |
| `whatsapp_click` | Any other WhatsApp link (header, product, footer) | `placement`, `item_id` if any | custom | Contact | Contact |
| `generate_lead` | Any lead form success (quote, partnership, contact) | `lead_type` (quote, partnership, supply, contact), `value` if known | generate_lead | Lead | SubmitForm |
| `wholesale_request` | Wholesale quote form success | `lead_type: wholesale`, `quantity_band`, `org_type` (lodge, shop, ngo, corporate, other) | custom `wholesale_request` plus `generate_lead` | Lead (`content_category: wholesale`) | SubmitForm |
| `newsletter_signup` | Newsletter success | `placement` | custom (also `sign_up` with `method: newsletter`) | Subscribe (or CompleteRegistration, pick Subscribe) | Subscribe |
| `search` | On-site search | `search_term` | search | Search | Search |
| `view_promotion` and `select_promotion` | Banner or gift guide tile | `promotion_name` | same | none | none |
| `file_download` | Wholesale catalogue PDF | `file_name` | file_download | none | Download (optional) |
| `blog_read` | 75% scroll on post | `post_slug`, `category` | custom | none | none |
| `consent_update` | Banner choice | `analytics`, `marketing` booleans | custom | none | none |
| `web_vitals` | CWV reported | `metric_name`, `value`, `rating` | custom | none | none |

Key events in GA4 to mark: `whatsapp_order_submit`, `generate_lead`, `wholesale_request`, `newsletter_signup`. Register custom dimensions: `lead_type`, `checkout_type`, `delivery_zone`, `placement`, `order_ref`, `org_type`.

Value rules: use the real cart total in KES from the data layer. For `generate_lead` without known value, omit `value`. Never send a made-up lead value.

### 6.5 UTM capture and persistence
1. On first landing, a small client function reads `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `fbclid`, `ttclid`, and `document.referrer`.
2. Store as first-touch and last-touch in a first-party cookie or `localStorage` named `mk_attr` (JSON, 30 days). Storing it counts as analytics, so it respects consent: before consent, keep in memory (`sessionStorage` is still storage, so treat as non-essential and hold it in memory for the session only if declined, **TODO legal review**).
3. Strip nothing from the visible URL, and do not store any personal data.
4. On `begin_checkout`, `generate_lead`, `wholesale_request` and `whatsapp_order_submit`, include the attribution fields in the event.
5. **Order message**: the wizard builds the WhatsApp text. Append a short reference line at the end, for example: `Ref: MK-7F3K2 | src: instagram / paid_social / eid_gifts`. The `order_ref` is a short random code generated client side, also pushed in the event, and stored by the client in the chat when logging the order. Do not append raw click IDs to the message (too long, looks odd), only the compact source, medium, campaign. Customers can delete the line, so treat it as best effort.
6. Forms (quote, wholesale) carry the same fields as hidden inputs.

### 6.6 Attribution with WhatsApp as the conversion point
- The sale completes outside the site. `whatsapp_order_submit` means "customer sent an order message", not "paid". It is a lead-stage conversion. Do not send it as `purchase` to GA4, Meta or TikTok, because that inflates revenue and breaks reporting.
- Platform mapping: Meta gets `Lead` (value from cart total optional, labelled intent). TikTok gets `SubmitForm` with the same. Ads optimisation then targets people who start an order.
- Closing the loop (do from launch, manual): the client logs each order by `order_ref` in a sheet with status (new, quoted, paid, delivered) and real value. A weekly job (manual at first) matches `order_ref` and source to paid orders, producing real source to revenue figures.
- Later: upload paid orders as offline conversions (GA4 Measurement Protocol with `purchase` and the stored `client_id`, Meta Conversions API `Purchase`, TikTok Events API `CompletePayment`) with the same `event_id`/`order_ref` and hashed contact data only where the customer consented. Needs a small server route and a secure order log (database choice is **TODO**).
- Expect undercounting: WhatsApp opens in another app, some users never press send, link previews strip nothing but referrers are lost. Report "order starts" and "confirmed orders" separately.
- Click-to-WhatsApp ads (Meta) report conversations inside Meta. Keep those campaigns tagged with distinct `utm_campaign` values to avoid double counting against site-sent orders.

### 6.7 Server-side and CAPI (later phase)
- Trigger point: once ad spend justifies it (**TODO** threshold decided by client) or when browser loss exceeds acceptable levels.
- Option A: a Next.js route handler `app/api/events/route.ts` forwards events to Meta CAPI, TikTok Events API and GA4 Measurement Protocol, deduplicated by `event_id`. Option B: GTM server container on a small host. Option A first, since volume is low.
- Send only consented events. Hash email and phone (SHA-256, normalised) only if collected and consented. Respect the retention in section 7.

---

## 7. Consent and the Kenya Data Protection Act

Legal note: the Data Protection Act, 2019 (Kenya) requires lawful basis, notice, purpose limitation, data subject rights, and regulates cross-border transfer; the Office of the Data Protection Commissioner (ODPC) runs registration of data controllers and processors. These are **VERIFIED as general knowledge**, but details (registration thresholds, transfer conditions, cookie specifics) must be confirmed by Kenyan counsel before launch (**TODO**). Diaspora visitors from the UK or EU may also bring GDPR expectations, so the safest design is opt-in for everything non-essential.

### 7.1 Banner design
- A calm bottom bar (not a modal, no scrim, no pop-up on first paint, charter rule 6), appears after the first content render, never covering the main CTA on mobile (sits above the sticky WhatsApp button, or integrates with it).
- Copy (plain, under 40 words): "We use cookies to see which pages help families find us and to measure our ads. You choose. Essential cookies stay on so the cart works." Buttons: "Accept all", "Reject non-essential" (equal visual weight, same size, both at least 44px high), "Choose" (opens preferences). No dark patterns, no pre-ticked boxes.
- Preferences panel categories: Essential (always on: cart, consent record), Analytics (GA4), Marketing (Meta Pixel, TikTok Pixel, ad attribution). Each with a plain description and the provider named.
- Footer link "Cookie settings" on every page to change or withdraw consent as easily as it was given. Link to `/cookies` and `/privacy`.
- Keyboard and screen reader friendly: focus moves predictably, `role="dialog"` not used if non-modal, uses `role="region"` with an `aria-label`. Reduced motion respected.
- Consent record stored in a first-party cookie `mk_consent` (version, timestamp, choices), 6 months then re-ask (**ASSUMED**, align with counsel).
- Privacy notice contents (**TODO** text for legal): who the controller is, purposes, recipients (Google, Meta, TikTok), international transfers, retention, rights, ODPC complaint route, contact. WhatsApp orders: state that order details are sent to the business via WhatsApp (Meta) by the user's own action.

### 7.2 Consent Mode v2 defaults
Set before GTM loads, in an inline script in the root layout:
```js
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied',
  analytics_storage:'denied', functionality_storage:'granted',
  security_storage:'granted', wait_for_update:500
});
gtag('set','url_passthrough',true);
gtag('set','ads_data_redaction',true);
```
On choice: `gtag('consent','update',{...})` mapping Analytics to `analytics_storage`, Marketing to `ad_storage`, `ad_user_data`, `ad_personalization`. Returning visitors with a stored choice get the update on load before tags fire. Meta and TikTok tags are blocked in GTM until marketing consent (they do not read Consent Mode themselves, so use trigger blocking on `marketing_consent == true`, and call `fbq('consent','revoke')` / TikTok `holdConsent` equivalent before grant, **verify current API names**).
Cookieless GA4 pings under denied state give modelled data only when thresholds are met (**ASSUMED**), do not promise it to the client.
Default is "denied" everywhere, including Kenya, so behaviour is uniform.

---

## 8. SEO content calendar seed (20 topics)

Format: pillar (P) or cluster (C), owner URL, intent, target query hypothesis (to validate), primary internal links. Publish order follows the plan in section 10. Authors, photos and facts come only from the brief or marked TODO. Posts must not reuse a primary term owned by another page (section 1.4).

| # | Type | Title idea | Owner URL | Intent | Links to |
|---|---|---|---|---|---|
| 1 | P | Handmade crochet animals from Nairobi: the full collection guide | `/shop` | Commercial | species collections |
| 2 | P | How to choose a soft toy size: S, M, L and XL compared (needs real dimensions, TODO) | `/size-guide` | Informational | `/shop` |
| 3 | P | Caring for a crochet stuffed animal | `/care` | Informational | products |
| 4 | P | What makes a crocheted toy child safe | `/safety` | Informational, trust | `/story` |
| 5 | P | Gifts from Kenya for children | `/gifts` | Commercial | gift guides |
| 6 | P | Wholesale handmade toys for lodges and gift shops | `/wholesale` | B2B | `/partners` |
| 7 | C | Baby shower gifts: crochet animals that suit a newborn | `/gifts/baby-shower` | Commercial inv. | size guide |
| 8 | C | Safari souvenirs for children that fit in a suitcase | `/gifts/safari-souvenirs` | Commercial | collections |
| 9 | C | Kenyan wildlife for kids: giraffe, elephant, lion, rhino and monkey | `/journal/` | Informational | species |
| 10 | C | How we turn recycled yarn into a toy (needs real process, TODO) | `/journal/` | Informational | `/story` |
| 11 | C | Meet the women who make Mikono toys (consent for names and photos, TODO) | `/impact` | Trust | `/projects` |
| 12 | C | Why zero plastic stuffing matters (only with real material facts, TODO) | `/journal/` | Informational | `/safety` |
| 13 | C | Are crochet toys safe for babies and toddlers | `/journal/` | Informational | `/safety` |
| 14 | C | Corporate gifts from Kenya: ordering custom crochet animals | `/journal/` | B2B | `/wholesale` |
| 15 | C | Stocking handmade toys in a lodge shop: what retailers ask us | `/journal/` | B2B | `/wholesale` |
| 16 | C | Gifts for first birthdays in Nairobi | `/gifts/first-birthday` | Commercial | collections |
| 17 | C | Domestic animal crochet toys: dog, cat and rabbit | `/shop/domestic-animals` support post | Informational | collection |
| 18 | C | Sending a gift to a child in Kenya from abroad (only if the process is confirmed, TODO) | `/gifts/from-kenya-diaspora` | Commercial | `/delivery` |
| 19 | C | Project spotlight: an organisation or school we supplied (partner permission, TODO) | `/projects/[slug]` | Trust | `/partners` |
| 20 | C | Kitenge-inspired colours: how we choose yarn colours (only if true, TODO) | `/journal/` | Informational | products |

Rules: one primary query per post, linked from its pillar, updated with real `dateModified`, each ends with a plain WhatsApp or collection CTA (no pressure language).

---

## 9. SEO QA checklist (mechanical)

Run on the production build (`next build`, `next start`) with a crawler script (for example Playwright plus `cheerio`) and the listed tools. Each item is PASS or FAIL with evidence.

**Crawl and index**
1. `GET /robots.txt` returns 200, contains `Sitemap:` with an absolute https URL, disallows `/cart`, `/order`, `/api/`.
2. `GET /sitemap.xml` returns 200, valid XML, every URL returns 200, none are noindex, none are filtered or cart URLs, all absolute with one host.
3. Every URL in the sitemap appears in the internal link graph (no orphans), and every internal link target returns 200 (no 404, no redirect chains over one hop).
4. `/cart`, `/order`, filtered URLs and sort URLs carry `noindex`.
5. Preview environment sends `noindex`; production does not (check both).

**Metadata**
6. Each page has exactly one `<title>` (max 60 characters) and one meta description (140 to 160), unique across the site.
7. Each page has a self-referencing absolute canonical without query parameters, matching the sitemap entry.
8. `<html lang="en-KE">`, hreflang `en-KE` and `x-default` present, self-referencing.
9. Exactly one `<h1>`, no skipped heading levels, H1 not identical to the title.
10. No primary term shared between two titles or H1s in the cannibalization map.
11. Open Graph and Twitter tags present, `og:image` returns 200 at 1200 by 630, `twitter:card` is `summary_large_image`.

**Schema**
12. Rich Results Test or `schema-dts` validation: zero errors on Organization, Product or ProductGroup, BreadcrumbList, ItemList, FAQPage, Article.
13. Product schema `price`, `priceCurrency: KES`, `availability` equal the visible page and the feed row for the same SKU.
14. No `aggregateRating` or `review` anywhere unless backed by real data.
15. JSON-LD content equals visible content (FAQ questions visible, breadcrumb matches visible trail).

**Images and performance**
16. All images served as AVIF or WebP via `/_next/image`, have non-empty alt unless decorative, alt contains no em or en dash, filenames follow the pattern, `width`/`height` present.
17. Only one image per page has `priority`.
18. Lighthouse mobile on home, a collection, a product, a post: LCP under 2.5s, CLS under 0.1, TBT under 200ms, SEO score 100, accessibility 95 or more.
19. CrUX or field data check 28 days after launch, same thresholds.

**Tracking and consent**
20. On first load with no choice, the network log shows no request to google-analytics, googletagmanager gtag collect, facebook, or tiktok analytics endpoints other than the GTM container itself and consent defaults (verify against the defined defaults).
21. After "Reject non-essential", still none. After "Accept all", GA4, Meta and TikTok requests appear.
22. Each event in 6.4 fires once per action (no duplicates), carries `event_id`, `currency: KES`, and item IDs equal to feed IDs. Verified in GTM Preview, GA4 DebugView, Meta Test Events, TikTok Test Events.
23. No event payload contains a phone number, name, address or free text from the order message.
24. Visiting with `?utm_source=test&utm_medium=qa&utm_campaign=qa1` and completing the wizard yields a WhatsApp message containing the compact `src:` line and an event with the same values.
25. "Cookie settings" link present in the footer on every page and reopens preferences.

**Copy rules**
26. Em dash (U+2014) and en dash (U+2013) scan over rendered HTML, JSON-LD, metadata, alt text and feeds: zero matches. Banned phrase scan from charter rule 2: zero matches.
27. No invented facts: every price, count and claim traces to data or is a labelled TODO. `grep TODO` output is the client-input list.

---

## 10. Prioritised 90 day plan

Assumes launch inside the build phases (charter phase 7 delivers infrastructure). Day 0 is launch.

**Before launch (blockers, charter phase 7)**
1. P0: domain, `NEXT_PUBLIC_SITE_URL`, canonical host, HTTPS, redirects.
2. P0: metadata templates, sitemap, robots, canonical, hreflang, breadcrumbs.
3. P0: Product, Organization, BreadcrumbList, ItemList JSON-LD.
4. P0: consent banner with Consent Mode v2 defaults, privacy and cookie pages (legal review).
5. P0: `track()` module, dataLayer, GTM container with GA4, Meta, TikTok tags, event dictionary, UTM capture, WhatsApp order ref.
6. P0: image pipeline, OG generators, CWV pass.
7. P1: Search Console and Bing Webmaster verified, sitemap submitted, GA4 key events marked.

**Days 1 to 30: foundations**
- P0: GBP set up and verified (if eligible), NAP consistent, 10 or more photos from cleared manifest.
- P0: Merchant Center account, domain claimed, feed route live, review diagnostics (eligibility check for Kenya).
- P1: Meta and TikTok catalogues connected, Pixel Test Events clean, WhatsApp Business catalogue for best sellers, quick replies and labels.
- P1: publish pillars 1 to 6 from section 8 (collection guide, size guide, care, safety, gifts hub, wholesale).
- P1: order log sheet with `order_ref`, status and value.
- P2: first keyword validation from Keyword Planner and live SERP review, fix terminology per page.

**Days 31 to 60: coverage**
- P1: publish clusters 7 to 13, gift guides, domestic animals post.
- P1: Search Console review: queries by page, cannibalization check, title tests on pages with impressions but low CTR (one change at a time, logged).
- P1: reviews request flow via WhatsApp to GBP, and on-site review collection (no schema until real).
- P2: link and mention outreach to partners, lodges, parenting and craft sites in Kenya (real relationships only, no purchased links).
- P2: GA4 reports: source to `whatsapp_order_submit` to confirmed order, build a Looker Studio view.

**Days 61 to 90: scale and loop closing**
- P1: publish clusters 14 to 20, update pillars with real questions from WhatsApp chats.
- P1: first weekly attribution report matching `order_ref` to paid orders, decide channel budgets.
- P2: server-side events design (6.7), decide go or no go on spend.
- P2: CWV field review, fix regressions, and Lighthouse CI in the deploy pipeline.
- P3: evaluate colour or size landing pages only if Search Console shows demand.
- Review gate: summarise impressions, clicks, non-branded share, order starts, confirmed orders, GBP actions. No targets are set here because no baseline exists. Set targets at day 30 from real data.

**Open client inputs this report depends on (feeds charter section 6):** domain and email, WhatsApp number, prices and availability policy, size dimensions, delivery zones and fees, returns terms, shop or stockist locations, international shipping yes or no, safety testing evidence, social handles, partner names with permission, named authors, tracking IDs (GTM, GA4, Meta, TikTok), ODPC registration status, legal text for privacy and cookie pages.
