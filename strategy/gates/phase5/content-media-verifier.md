# Phase 5 Content and Media Verifier (2 of 3), round 2

Build tested: http://localhost:3300 (production build). Method: contact sheets of every image on the 24 listed product pages (70 colourway images plus range), all 54 story and moment images viewed, 71 pages fetched and text extracted (cart, order steps 1 to 5 and order/sent via puppeteer), every internal link crawled, JSON-LD parsed.

Verdict: FAIL (0 hard blockers in this round, 8 majors, 14 minors). Phase 4 blockers are cleared. Remaining majors are mostly honesty and config items that are cheap to fix.

## 1. Media accuracy

| Check | Item | Result | Evidence | Severity |
|---|---|---|---|---|
| Orientation | Zebra wall head, only photo | FAIL | zebra-wall-head-black-white-01.jpg (640 x 426) is rotated 90 degrees: the head lies on its side, shelving and table tilt. No EXIF tag, so every browser shows it sideways. Source note in manifest batch-2 says "rotated". | major |
| Colour vs image | Elephant (grey, slate blue, lavender, caramel brown, dusty purple) | PASS | Each hero shows that colour. Dusty purple is now elephants only. Lavender hero has a caramel elephant in front (alt says so). | none |
| Colour vs image | Turtle | PASS | One colourway, mint and cream, matches. Hero shows edges of a pink and a purple turtle (alt admits). Coral and blue colourways removed. | none |
| Colour vs image | Giraffe (yellow, cream, caramel tan, orange) | PASS | All match. Cream hero shows a brown rabbit lower right. Caramel gallery has yellow giraffe slivers at the edge. | minor |
| Colour vs image | Rhino light blue, brown | PASS with note | Light blue hero now clean. Brown "hero" is a brown rhino beside a larger bright blue rhino, so the blue one dominates. | minor |
| Colour vs image | Octopus white, yellow, multicolour | PASS | White and yellow are hand held close ups. Multicolour is a beach table, partly knitted caps and bags. Range photo shows red, green, white, yellow. | minor |
| Group photo honesty | Shark, monkey, cat ("Colours vary") | PASS | Shark: one photo of five sharks, copy says "Ask us which are available. The photos show the colours we have made." Monkey: two different photos. Cat: two different photos. No colour label is attached to a wrong photo. | none |
| Copy vs photo | Cat page text vs second photo | WARN | Copy: "A cream crocheted cat with a small shoulder bag and a coloured ear tip". Photo 2 (cat-ask-02) is four long cats in orange, mint, blue and pink with no bags. | minor |
| Colour vs image | Hippo label and alt | WARN | Alt "Blue-grey crocheted hippo", label "Blue with magenta dress", body copy and the project page say "dark blue" and "navy". The photo is navy. Project page says "blue ringed eyes", product page "lilac and pink eyes". | minor |
| Resolution | Zebra wall head 640 px, chameleon 480 px, dinosaur, octopus yellow 400 px, turtle 545 px | WARN | Visibly soft at full size, not a blocker. | minor |
| Third party text | Wall head listings | PASS | The six sub 400 px wall heads (warthog, giraffe, elephant with watermark, hippo, rhino, secretary bird) are hidden and return 404. Their files are still served: /media/products/elephant-wall-head/elephant-wall-head-purple-01.jpg returns 200. | minor |
| Third party text | Story photos | PASS | Faint "DA" on a sack in moment-05 and trimming-lion-mane, "ENGLISH" on a hoodie in maker-at-stall, "URBAN" on a hoodie in workroom-giraffe-pieces. Incidental, not brands or watermarks. | none |
| Overlay text | lion-size-ladder-labelled.jpg | FAIL | White overlay labels "XL, Large, Medium, Small" are still in the photo. It is the cover for the size guide and for 7 journal cards, and the inline image on /journal/how-to-choose-a-size. A clean version, lion-size-ladder-clean.jpg, exists and is unused. Charter rule 10 says overlays are cropped. The labels also contradict the S M L XL scheme. | major |
| Duplicates inside one gallery | Lion gallery (9 photos) | WARN | Photos 03, 04, 05 are three shots of the same black table lion row. | minor |
| Duplicates inside one page | Journal posts | FAIL | The hero image is repeated as the first inline image on 10 of 10 posts (for example workroom-giraffe-pieces twice on from-yarn-to-giraffe, maker-at-stall twice on the ordering post, giraffe-portrait twice on the cleaning post). | major |
| Duplicates inside one page | Projects | FAIL | Hero equals first gallery photo on all 7 projects. The group gathering project shows its single photo twice. | major |
| Duplicates inside one page | Makers, Home, Impact | FAIL | Makers repeats 3 photos (hands crocheting, crocheting on a chair, finishing a giraffe) in two sections. Home shows hero-lion-hug and moment-02 (same photo) and maker-at-stall and moment-01 (same photo). Impact uses moment-05 and trimming-lion-mane (same scene, two crops). | major |
| Provenance | Chameleon and dinosaur | WARN | Studio style shots unlike every other photo. The dinosaur resembles a well known video game character. Still not confirmed by the client. | major |
| Provenance | Wall art studio photos (lion, unicorn, zebra) | WARN | Look like pattern site photos. Rights cleared per R1, client confirmation item only. | minor |
| Alt vs image | Product alts | MOSTLY PASS | Alts match what is visible. Rabbit hero alt says "small striped vest", the vest is variegated red, teal and white. Gifts and projects alt "knitted waistcoats" for crocheted vests. | minor |
| Alt vocabulary | "toy" | WARN | One alt remains: "a crocheted toy waiting beside her" (maker-crocheting-toy-waiting, 3 pages). The earlier "Crocheted lion toy" alt is gone. | minor |
| Caption vs photo | Story, impact, makers, gallery, stockists, gifts captions | PASS | All captions I checked match what is visible (lion hug, giraffe family, shelf with hang tags, orange giraffes, courtyard group, hippo in dress). | none |
| Caption vs photo | /journal/from-yarn-to-giraffe | FAIL | Summary says "Makers at work on giraffes in four photos: finishing, resting and a finished herd". The post shows three photos, and the "yarn to giraffe" title promises a process the photos do not show. | minor |

## 2. Copy

| Check | Item | Result | Evidence | Severity |
|---|---|---|---|---|
| Em dash, en dash | 71 pages, HTML source, content, components, app, data, lib | PASS | U+2014, U+2013 and their entities found nowhere. | none |
| Banned phrases | 71 pages | PASS | No hits for the section 1 list. "From yarn to giraffe" (post title) is the only "from X to Y" opener. | none |
| Exclamation marks, emoji | 71 pages | PASS | None. | none |
| Wording "toys" (R10) | Rendered text | PASS | No visible "toy" except the one alt above. | none |
| Wording R10 | Dolls and wall art called animals | WARN | Shop filter lists Doll and Unicorn under "Animal". Doll and dress doll pages carry the rail heading "More crocheted animals". Shop "All animals 24" counts dolls and wall art. Product pages now correctly say "About this doll", "bag", "wall head". | minor |
| Claims D26 | Handbag, doll, dress doll, 3 listed wall heads | PASS | None of the four claim zero plastic, nothing detachable or recycled yarn. Only "Crocheted by hand in Nairobi" on dolls and wall art. Handbag copy says "A white shoulder bag with a crocheted lion head", no material claim. | none |
| Claims D26 | FAQ, Terms, Safety, Care | WARN | FAQ "Is there any plastic? No. Our animals have zero plastic" and "Can parts come off? No" sit in a list that includes dolls and wall art heads. The same answer is generic across the range. | minor |
| Claims D26 | Rabbit vest, hippo dress, cat bag | WARN | Pages carry "Nothing detachable, every part is crocheted on" for animals that wear clothes or carry a bag. Client should confirm. | minor |
| Claims D26 | "Made by 25+ women" | WARN | Home hero and body say "supports 25+ women" (fine). Organization JSON-LD, site meta description and web manifest say "made by 25+ women" (D26 allows this only if the client confirms the makers). Makers page: "Our team is the 25+ women supported". | minor |
| Claims D26 | "stays on" | WARN | Impact: "Every part is crocheted on and stays on". Edges toward the banned "cannot be pulled off". Home trust strip now clean. | minor |
| Unapproved claims | child safe, tested, certified, age ranges | PASS | Only appear in "we do not claim" statements (/safety, /faq, /terms, journal). | none |
| Invented business facts | Order form step 2 | FAIL | "How would you like to pay? M-Pesa, Bank transfer, Cash on delivery. Only for Nairobi delivery and pickup." The brief gives no payment methods and no cash on delivery rule. | major |
| Invented business facts | Gift wrapping | WARN | Gifts page and order form step 4 offer "Would you like it gift wrapped? Yes, please wrap it". Wrapping is not in the brief. | minor |
| Invented business facts | Contact and journal | WARN | "A person reads and answers every message" (contact) is an unprovable promise. | minor |
| Invented business facts | "supports over 25 women who use their income to provide for and sustain their families" (home) | WARN | Not traceable to any repo file. Check against the client brief wording. | minor |
| Privacy accuracy | Order draft retention | FAIL | Order form says "Your answers stay on this device for 24 hours" and lib/orderForm.ts sets DRAFT_TTL to 24 hours. /privacy and /cookies say "kept for up to 14 days". | major |
| Prices, sizes | All pages | PASS | "Price on request" only. No KES, cm, delivery fee, stock counts, scarcity, testimonials or stats. | none |
| Names and dates | Leah Maina, 2019, 7 outlets | PASS | Allowed by R2. No other names or dates. | none |
| Typos | Order review step | FAIL | "1 pieces. Prices are confirmed on WhatsApp." (plural bug). Pickup review also reads "Delivery fee: to be confirmed on WhatsApp." | minor |
| Terminology | Cart, order list, order form | WARN | Nav "Cart", button "Add to order list", page "Your cart", then "Continue to order form". Still mixed. | minor |
| Journal quality | 10 posts | WARN | Specific and plain, no slop, but each is about 100 words ("1 min read") and four state what is not published. Every post ends with the same "Questions about this? Ask us on WhatsApp." line and "We have not published" appears in 5 posts. Weak lines: "There is no machine in the picture", "That is why the wholesale page sits in the main menu", "In this photo you can also see the giraffes are not all the same size". The "What Mikono means" subtitle promises "why we chose it" but gives only the translation. | minor |
| Project quality | 7 projects | WARN | Honest and specific to photos. "A hippo in a dress" sits under "New designs" with rabbits and dolls in the gallery, and "new" is unsupported. "A group gathering" has a "What we did" heading that says nothing was confirmed. Making giraffes lists yellow, cream and tan only, the product has orange. | minor |
| Draft labels | /delivery, /privacy, /cookies, /terms | WARN | Pages show a visible "Draft" badge twice each. Honest but unfinished for launch. | minor |
| Copy vs photo | Bear, giraffe, rabbit, rhino text | PASS | Bear "round ears and a dark nose", giraffe "white muzzle on most colours and a brown muzzle on the cream one", rabbit "speckled vest" now match. Earlier mismatches fixed. | none |

## 3. Links and data

| Check | Item | Result | Evidence | Severity |
|---|---|---|---|---|
| Internal links | Crawl of 71 reachable pages | PASS | Zero 404 and zero redirects. All 13 earlier pending pages and /supply now return 200. The six hidden wall head slugs return 404 and are not linked. | none |
| Sitemap routes | 69 URLs | PASS | All 200. Wholesale and contact now listed. /cart and /order are excluded (noindex), as intended. | none |
| Site URL | Sitemap, canonical, og:url, og:image, JSON-LD | FAIL | Everything is http://localhost:3000. robots.txt is "Disallow: /" with sitemap on localhost (non production branch of app/robots.ts). env.ts falls back to localhost when NEXT_PUBLIC_SITE_URL is unset and not on Vercel. Must be set at deploy. | major |
| JSON-LD Organization | Phone | PASS | telephone and contactPoint +254724592115 on every page. | none |
| JSON-LD Product | 24 product pages | PASS | ProductGroup with hasVariant products (sku, color, size, image). No offers, no aggregateRating, no review anywhere. | none |
| JSON-LD Article | 10 posts | WARN | Valid, but no datePublished or dateModified, and no author person. | minor |
| JSON-LD BreadcrumbList | Product, post, content pages | PASS | Valid. Home, shop and category pages carry no breadcrumb. | none |
| JSON-LD validity | 71 pages | PASS | Every block parses as JSON. FAQPage on /faq. | none |
| Canonical | Home, /contact, /wholesale | FAIL | No canonical tag on these three. All other indexable pages have one. /cart and /order are noindex. | minor |
| Titles | All pages | WARN | Unique, but /journal/from-yarn-to-giraffe is 65 characters (limit 60). | minor |
| Meta descriptions | All pages | FAIL | Over 160: /shop/safari-animals 193, /shop/giraffe 188, /shop/more-animals 166, /shop/bear 164. | minor |
| h1 | All pages | PASS | Exactly one h1 per page. | none |
| Phone number display | All pages | PASS | "+254 724 592 115" in footer, contact, FAQ, delivery, privacy, terms. No other business number. Example "0712 345 678" appears only as form placeholder text. | none |
| tel links | 73 links | PASS | All href="tel:+254724592115". | none |
| WhatsApp links | 500+ links | PASS | All use https://wa.me/254724592115, with text parameter where prefilled. | none |
| Client rendered pages | /cart, /order, /order/sent | PASS | Empty and filled cart, order steps 1 to 5 and the "no order found" page render sensible text. No console errors. | none |

## Earlier defects (phase 4): fixed or not

| Earlier defect | Status |
|---|---|
| Turtle coral and blue colourways show the mint turtle | Fixed (one colourway) |
| Elephant dusty purple leads with an octopus photo | Fixed |
| Elephant wall head watermark and 287 px upscale | Fixed in the shop (hidden, 404). File still served at its URL: minor |
| Elephant navy single mixed pile photo | Fixed (colourway removed) |
| Shark five colourways on one photo | Fixed ("Colours vary", honest group photo) |
| Octopus red, green, white, yellow all one group photo | Fixed (distinct hero photos) |
| Monkey five colourways, two photos | Fixed |
| Cat cream with blue bag and red bag same file | Fixed |
| Elephant lavender and rhino light blue heroes with neighbours | Fixed for rhino. Lavender still shows a caramel elephant in front, disclosed in alt |
| Rhino brown gallery full of lions and giraffes | Fixed |
| Zebra gallery contains a zebra wall head | Fixed |
| Lion gallery contains handbag photos | Fixed |
| Lion size ladder duplicates and overlay text | Not fixed (overlay version now used site wide, three near duplicates remain in the lion gallery) |
| Chameleon and dinosaur provenance | Not fixed |
| Lion hero alt "Crocheted lion toy" | Fixed (one other alt still says "toy") |
| Handbag, doll, wall art claims | Fixed |
| Bear "cream muzzle", giraffe "white muzzle", rabbit "striped vest", rhino horns copy | Fixed (rabbit hero alt still says striped) |
| "About this animal" on doll, bag, wall head and "2 animals" dolls tile | Fixed |
| Cart vs order list wording | Not fixed |
| "Every part is crocheted on and stays on" | Partly fixed (home clean, impact still has it) |
| /supply and 12 other pending pages 404 | Fixed |
| Sitemap missing wholesale and contact | Fixed |
| JSON-LD and sitemap use localhost | Not fixed (env dependent, must be set at deploy) |
| Client rendered /cart /order not verifiable | Verified this round |

## Top defects

1. Zebra wall head photo is rotated 90 degrees.
2. Order form lists M-Pesa, bank transfer and cash on delivery (Nairobi only) and gift wrapping, none in the brief.
3. Privacy and cookies pages say 14 days draft retention, the form and code say 24 hours.
4. Site URL is localhost in sitemap, canonicals, og and JSON-LD, and robots is Disallow all, until NEXT_PUBLIC_SITE_URL is set.
5. Labelled lion size ladder (XL, Large, Medium, Small overlay) is used on the size guide and 8 journal cards while the clean version sits unused.
6. The same photo appears twice on one page across all journal posts, all projects, makers, home and impact.
7. Chameleon and dinosaur provenance unresolved.
8. Meta descriptions over 160 on 4 pages, one 65 character title, no canonical on home, contact and wholesale, plus "1 pieces" typo and "made by 25+ women" in JSON-LD and meta.
