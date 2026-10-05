# Phase 6 Content and Media Verifier (2 of 3), round 3

Target: https://mikono-creations.vercel.app (live, read only). Date 2026-10-01.
Method: sitemap (69 URLs) plus /cart, /order, /styleguide, /robots.txt, /manifest.webmanifest crawled over HTTPS (74 routes, internal link crawl found nothing outside these). Every `<img>` on every page parsed, 111 unique image files downloaded from the live /media paths and viewed on contact sheets (13 sheets), plus close ups. Text extracted from the served HTML of all pages (alt text included). /cart and the five order steps driven with headless Chrome. JSON-LD parsed, headers checked with curl.

Verdict: FAIL (0 blockers, 6 majors, 17 minors). Most phase 5 defects are fixed. The remaining majors are one prod exposure (/styleguide), one unverified claim set, one invented payment fact, one provenance issue, one mislabelled photo and missing og:url.

## 1. Media accuracy

| Check | Item | Result | Evidence | Severity |
|---|---|---|---|---|
| Delivery | All 111 image files | PASS | Every /media URL returns 200 with a non-empty body (smallest over 1 KB). A /_next/image variant also returns 200. | none |
| Orientation | Zebra wall head | PASS (fixed) | File is now 426 x 640, upright head on a shelf background, no EXIF orientation tag. | none |
| Overlay labels | Size ladder on /size-guide, 3 journal posts, home | PASS (fixed) | Live files use lion-size-ladder-unlabelled.jpg. No XL, Large, Medium, Small text in the photo. | none |
| Copy vs photo | /size-guide | FAIL | Copy still says "The faint labels in the photo read XL, Large, Medium and Small." The photo no longer has labels. | minor |
| Duplicates on one page | Journal posts, projects, makers, home, impact, gallery, stockists, gifts | PASS (fixed) | Per page list of image URLs has no repeats on any non-product page. Hero is no longer repeated as first inline image. | none |
| Duplicates on one page | Product pages | WARN | Hero file also appears as the first gallery thumb (2 to 3 uses of one file per page). This is the gallery strip, not a second placement. | minor |
| Near duplicate files | Same photo under two names | WARN | Perceptual hash match: moment-12-table-of-animals = table-lions-giraffes-pastel-bears; moment-06 = lions-front-giraffes-back; moment-10 = giraffe-yellow-03; sewing-bear-face = bear-tan; girl-with-turquoise-bear = bear-turquoise; hippo-pink-dress = hippo product photo. None share a page. | minor |
| Alt vs photo | /journal/why-wholesale | FAIL | Image alt and caption say "pink, green and blue bears" and "pastel bears". The photo shows long cats in orange, mint, blue and pink, the same animals the shop sells as cats (cat-ask-02). | major |
| Colour vs image | Elephant (grey, caramel brown, slate blue, lavender, dusty purple) | PASS with notes | Grey, caramel, slate blue match. Lavender hero is dominated by a caramel elephant in front of a lavender crowd. Dusty purple is a 1200 x 500 crop of grey mauve elephants and is hard to tell from the Grey colourway. | minor |
| Colour vs image | Giraffe (cream, caramel tan, yellow, orange) | PASS | All match. Caramel tan is a 419 x 1220 strip with the ossicones clipped at the top edge; yellow gallery 02 is a 410 x 1220 strip with neighbours cut at both sides. | minor |
| Colour vs image | Rhino (brown, light blue) | PASS with note | Light blue hero is clean. Brown hero shows a brown rhino beside a larger bright blue one. | minor |
| Colour vs image | Hippo | PASS (fixed) | Label, alt and copy all say navy with magenta dress. Photo is navy. | none |
| Colour vs image | Octopus white, yellow, multicolour | PASS with note | White and yellow are clean hand held shots. Multicolour is a beach table of small octopuses and knitted pieces, not one animal. Range photo shows red, green, white, yellow. | minor |
| Colour vs image | Turtle, rabbit (6 vests), bear (4), butterfly (4), goose (2), cat, monkey, shark, zebra, dog, lion | PASS | Each hero matches its label. Shark, monkey, cat show "colours vary" with honest group photos. Cat copy now describes long cats and the bag cats and matches both photos. | none |
| Lead image is a single animal | Cat, monkey, zebra, grey elephant, rhino, shark | WARN | Leads show 2 or more animals (two cats, two monkeys, two zebras, elephant with calf, rhino rows, five sharks). Rabbit, turtle, giraffe cream edges show neighbours. | minor |
| Lead or colourway image has a person | Bear tan, bear turquoise, lion handbag (both), lion gallery 08 and 09 | WARN | Tan bear photo is a woman sewing it, turquoise is a girl holding it, handbag photos show a worn bag on a girl, gallery 08 a man holding a lion, 09 a woman on a sofa. Animal is identifiable but not a clean product shot. | minor |
| Cut off, rotation, watermark | All product and story files | PASS | No rotation, no watermark, no third party brand text. Incidental "ENGLISH" on a shirt (moment-01, maker-at-stall), "URBAN" on a hoodie (workroom-giraffe-pieces), "DA" on a sack (moment-05, trimming-lion-mane). | none |
| Hidden wall head files | /media/products/elephant-wall-head/... | WARN | Hidden listings return 404 (checked warthog), but the watermarked elephant wall head file still returns 200 on its direct URL. | minor |
| Resolution | Zebra wall head 426 px, chameleon 480, octopus yellow 400, turtle 545, elephant caramel 490 | WARN | Soft at full size. | minor |
| Provenance | Chameleon and dinosaur | FAIL | Studio style shots unlike every other photo. The yellow dinosaur with white eyes, orange spikes and green feet closely resembles a well known Nintendo character, which is a third party design. Client confirmation not recorded. | major |
| Alt vocabulary | "toy" | PASS (fixed) | No "toy" or "toys" in any rendered text or alt. | none |
| Alt vs photo | "knitted waistcoats" on /gifts and /projects/a-hippo-in-a-dress | WARN | Waistcoats are crocheted (rabbit pages say crocheted vest). | minor |
| Alt coverage | Product gallery thumbs and colourway images | WARN | Only the default hero has descriptive alt in the served HTML. The lion gallery's other 9 images and other colourways render alt="". Decorative alt is acceptable for a thumb strip but loses the description. | minor |
| Caption vs photo | Story, impact, makers, gallery, stockists, gifts, projects, journal captions | PASS | All checked captions match the photos. /journal/from-yarn-to-giraffe (now titled "Giraffes in the workroom") says three photos and shows three. | none |

## 2. Copy

| Check | Item | Result | Evidence | Severity |
|---|---|---|---|---|
| Em dash, en dash | 74 routes, HTML source, JSON-LD, meta | PASS | U+2014, U+2013, &mdash;, &ndash; and unicode escape forms found nowhere. | none |
| Banned phrases | Section 1 list plus charter rule 2 | PASS | No hits. | none |
| Exclamation marks, emoji | All pages and alt | PASS | None. | none |
| Wording "toys" | Rendered text | PASS | None. | none |
| Safety and certification claims | Whole site | PASS | "tested", "certified", "child safe", age ranges appear only inside "we do not claim" statements. Care and journal copy says the wash tips are general, not a tested method. | none |
| Prices, cm, fees, stock, scarcity, testimonials, stats | Whole site | PASS | "Price on request", "We do not list centimetres", delivery fees listed as not confirmed. No quotes or testimonials. The "25+" figure and "seven outlets" are R2 facts. | none |
| Names and dates | Leah Maina, 2019, seven outlets | PASS | Only brief facts. | none |
| Claim on clothed and carrying animals | Rabbit (vest), hippo (dress), cat (bag), bear (striped top) product pages | FAIL | Each carries "Zero plastic, No plastic parts in the animal" and "Nothing detachable, Every part is crocheted on", and the hippo page says it is "shown wearing a crocheted magenta dress". Vests, a dress and bags may well be separate pieces. FAQ also answers "Can parts come off? No." for all crocheted animals. Not confirmed by client. | major |
| Claim on handbag, dolls, wall heads | 4 pages | PASS | No zero plastic, detachable or recycled yarn claim. Only "Crocheted by hand in Nairobi" on dolls and wall heads. FAQ now sends dolls, bags and wall heads to WhatsApp for the plastic question. | none |
| Invented business facts | Order form step 2 and FAQ | FAIL (partly fixed) | Cash on delivery and gift wrapping are gone. "Preferred way to pay: M-Pesa, Bank transfer, Not sure yet" remains in step 2, the review step ("Preferred way to pay: M-Pesa") and the FAQ. The brief names no payment methods. | major |
| Invented business facts | Other offers | WARN | Wholesale "sample pack", delivery "to another Kenyan town", "deliver it straight to the person receiving it", contact "We read every message". Not in the brief. | minor |
| Privacy accuracy | Draft retention | PASS (fixed) | Order form, /privacy and /cookies all say 24 hours. | none |
| Typos | Order review | PASS (fixed) | "1 animal. Prices are confirmed on WhatsApp." No plural bug. Review for pickup still shows "Delivery fee: to be confirmed on WhatsApp." | minor |
| Wording consistency | Cart vs order list | PASS (fixed) | Nav "Order list", page "Your order list", button "Add to order list". Route is still /cart. | none |
| Wording consistency | Dolls, wall art and a bag called animals | WARN | /shop "All animals 24" includes 3 wall heads, 2 dolls and the lion head handbag, and the Animal filter lists Lion 3, Unicorn, Doll. "More animals 9" contains the handbag. Doll pages say "More crocheted animals" above the rail. | minor |
| Wording consistency | Order of animals | PASS | Gifts, FAQ, journal and shop use the same order (elephants, giraffes, lions, rhinos, zebras, hippos, monkeys). | none |
| "25+ women" wording | Meta, manifest, JSON-LD, home | PASS (fixed) | All say "25+ women supported". "Made by 25+ women" is gone. | none |
| "stays on" | Impact | PASS (fixed) | Now "Every part is crocheted on." | none |
| Journal quality | 10 posts | WARN | Specific and honest but about 100 words each ("1 min read"). Every post ends with the same "Questions about this? Ask us on WhatsApp." The "What Mikono means" subtitle promises "why we chose it" and the post only gives the translation. Weak lines: "There is no machine in the picture", "That is why the wholesale page sits in the main menu". Post slug from-yarn-to-giraffe no longer matches its title. | minor |
| Project quality | 7 projects | WARN | Honest. "A group gathering" has a "What we did" heading that says nothing was confirmed. "A hippo in a dress" lists dolls and rabbits as "Photos". Templates repeat "Dates, place and partners Not added yet" and "Results and numbers None stated" on all 7. | minor |
| Draft labels | /delivery, /privacy, /cookies, /terms | WARN | Visible "Draft" badges and "This page is a draft" text still live. | minor |

## 3. Links and SEO

| Check | Item | Result | Evidence | Severity |
|---|---|---|---|---|
| Internal links | 74 routes | PASS | Zero 404 or redirects from internal links. Hidden wall head slugs return 404 and are not linked. Unknown path returns 404. | none |
| Sitemap | 69 URLs | PASS | All 200 and all begin https://mikono-creations.vercel.app. /cart and /order excluded (noindex). | none |
| robots.txt | Live | PASS (fixed) | `Allow: /`, `Disallow: /styleguide`, `/cart`, `/order`, `Sitemap: https://mikono-creations.vercel.app/sitemap.xml`. | none |
| Localhost leak | All pages, 45 distinct og and twitter images | PASS (fixed) | No "localhost" in any page. Every og:image and twitter:image URL returns 200. | none |
| /styleguide | Production | FAIL | https://mikono-creations.vercel.app/styleguide returns 200 (title "Style guide | Mikono Creations", noindex, nofollow, disallowed in robots, not in sitemap). Required to be 404 on production. | major |
| Canonical | All indexable pages | PASS (fixed) | Present and equal to the live URL on every page. Missing only on /cart, /order, /styleguide (noindex). | none |
| og:url | Home, /shop, 5 category pages, 24 product pages (34 pages) | FAIL | `og:url` meta tag is absent on these pages. Present on content pages. | major |
| og:image | /care, /contact, /cookies, /custom, /delivery, /faq, /gifts, /journal, /partners, /privacy, /projects, /safety, /stockists, /supply, /terms, /wholesale | FAIL | No `og:image` and no twitter:image on these 16 pages. Where present the URL is absolute and live. | minor |
| Titles | All pages | PASS (fixed) | All 60 characters or fewer and unique. | none |
| Meta descriptions | All pages | PASS (fixed) | All 160 characters or fewer. | none |
| h1 | All pages | PASS | One h1 on every page except /styleguide (zero). | none |
| JSON-LD validity | 72 indexable pages | PASS | Every block parses. Organization on all pages with telephone +254724592115, contactPoint, founder Leah Maina, foundingDate 2019. | none |
| JSON-LD Product | 24 products | PASS | ProductGroup with hasVariant, color, size, image. No offers, aggregateRating or review. | none |
| JSON-LD BreadcrumbList | Products, posts, content pages | PASS | Valid, absolute prod URLs. | none |
| JSON-LD Article | 10 posts | WARN | Valid, now has author and image, but no datePublished or dateModified. | minor |
| Phone consistency | All pages | PASS | Display "+254 724 592 115" everywhere. 74 `tel:+254724592115` links. 520 `https://wa.me/254724592115` links. Only other number is the form placeholder "0712 345 678". | none |
| Security headers | Home, /shop/lion, /media image | PASS | Content-Security-Policy, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy, Strict-Transport-Security max-age 31536000. CSP allows 'unsafe-inline' scripts. | none |
| Client rendered flows | /cart, /order steps 1 to 5 | PASS | Empty cart and empty order text sensible. After adding Lion, M: cart shows "Tan with brown mane, size M", order wizard runs 5 steps, review reads "1 animal". Only console noise is aborted prefetch requests. | none |

## Earlier defects (phase 5): fixed or not

| Phase 5 defect | Status |
|---|---|
| Zebra wall head rotated | Fixed |
| Order form invented payment, COD, gift wrap | Partly fixed (COD and wrapping removed, M-Pesa and bank transfer remain) |
| Privacy 14 days vs form 24 hours | Fixed |
| Site URL localhost, robots Disallow all | Fixed on live |
| Labelled size ladder | Fixed in the image, copy still mentions labels |
| Same photo twice on journal, projects, makers, home, impact | Fixed |
| Chameleon and dinosaur provenance | Not fixed |
| Meta over 160, title 65, missing canonicals, "1 pieces", "made by 25+ women" | Fixed |
| Cat copy vs photo | Fixed |
| Hippo colour wording | Fixed |
| Cart vs order list wording | Fixed |
| "stays on" on impact | Fixed |
| "toy" in an alt | Fixed |
| Rabbit alt "striped vest" | Fixed |
| Nothing detachable on clothed animals | Not fixed |
| Dolls, wall art, bag called animals | Not fixed |
| Draft badges | Not fixed |
| Article datePublished | Not fixed |
| Journal posts thin and repetitive | Not fixed |
| Elephant wall head file served | Not fixed |
| Lion gallery near duplicate row photos (03, 04, 05) | Not fixed |
| Brown rhino hero dominated by blue rhino | Not fixed |
| "knitted waistcoats" alt | Not fixed |

## Top defects

1. /styleguide returns 200 on production (must be 404).
2. "Nothing detachable, every part crocheted on" and "zero plastic" shown on rabbit (vest), hippo (dress), cat (bag) and bear pages, and FAQ "Can parts come off? No", unconfirmed.
3. Order form, review and FAQ still list M-Pesa and bank transfer as payment options; not in the brief.
4. Chameleon and dinosaur provenance unresolved, and the dinosaur resembles a third party character.
5. /journal/why-wholesale describes the long cats photo as "pastel bears" (alt and caption).
6. og:url missing on home, /shop, categories and all 24 product pages; og:image missing on 16 pages.
7. /size-guide copy says the photo has faint XL, Large, Medium, Small labels; the live photo has none.
8. Journal Article JSON-LD has no dates; journal posts about 100 words each with identical closing line; Draft badges still on four policy pages.
