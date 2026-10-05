# Phase 4 Content and Media Verifier (2 of 3)

Build tested: http://localhost:3200. Method: every product image file viewed on contact sheets (103 colourway images, 24 range images, 14 story and moment images), all 49 routes fetched and text extracted, links crawled, sitemap and JSON-LD read.

Verdict: FAIL (4 blockers, 11 majors).

## 1. Media accuracy

| Check | Item | Result | Evidence | Severity |
|---|---|---|---|---|
| Colour vs image | Turtle, Coral pink and peach colourway | FAIL | turtle-coral-pink-01.jpg is the same file as the mint turtle hero. The mint and cream turtle fills the frame, the coral turtle is cut off at the top edge. | blocker |
| Colour vs image | Turtle, Royal blue and purple colourway | FAIL | turtle-blue-purple-01.jpg is the same file. The blue turtle is cut off at the right edge, mint turtle dominates. All 3 turtle colourways share one photo. | blocker |
| Animal vs image | Elephant, Dusty purple, first gallery photo (gallery 01) | FAIL | Subject is a hand holding a yellow octopus. Elephants are small and blurred behind it. Alt text admits "behind a hand holding a yellow octopus". Gallery 03 is mostly orange giraffes. | blocker |
| Third party text | Elephant wall head, Purple | FAIL | Visible watermark text at bottom left ("...Believe ...iscover"). Source img-003 is a 287 px wide crop of a 3x3 collage, rated low quality, upscaled and soft. Hippo wall head is the same collage (286 px). | blocker |
| Animal vs image | Elephant, Navy (only image) | FAIL | One photo of a mixed pile of lions, giraffes and elephants. The navy elephant is a small part of it. | major |
| Colour vs image | Shark, 5 colourways (yellow, pink, green, purple grey, dark grey) | FAIL | Six files, one MD5 hash. Every colour shows the same 5 shark group photo, so "Pink" does not show a pink shark alone. Gallery reports 5 photos. Group photo is honest and colours are visible. | major |
| Colour vs image | Octopus Red, Green, White (gallery 02), Yellow (gallery 02) | FAIL | octopus-red-01, green-01, white-02, yellow-02 and range-01 are one identical group photo (5 files, 1 hash). Alt text for red and green contains editorial text ("this colour (red) is shown several times, grey croch..."). Multicolour image is a beach table mixed with knitted caps, no single octopus. | major |
| Colour vs image | Monkey, 5 colourways, 2 photos | FAIL | Purple blue, purple pink and brown yellow are one identical group photo. Brown cream and tan yellow are one identical photo of two monkeys. | major |
| Colour vs image | Cat, Cream with blue bag vs Cream with red bag | FAIL | Both colourways use the same file (same hash). The pair photo shows both bags. | major |
| Crop shows neighbour | Elephant Lavender hero | WARN | Hero shows a zebra and a lion beside the lavender elephant. Elephant is mid frame, small. | minor |
| Crop shows neighbour | Rhino, Light blue hero | WARN | Brown rabbit in a vest fills the left third of the hero. Home page tile uses this image. | minor |
| Crop shows neighbour | Rhino Brown, gallery 02 | FAIL | Image is mostly lions and giraffes. Brown rhinos are tiny. Light blue gallery 03 and lifestyle 04 are mostly elephants and giraffes. | major |
| Crop shows neighbour | Giraffe, Cream with brown spots hero | WARN | A brown rabbit occupies the lower right. | minor |
| Wrong product in gallery | Zebra product gallery | FAIL | Range image zebra-range-01 is a zebra wall head (same file as the wall art product), 640 px, rated low. Pulled in because alt contains "zebra". | major |
| Wrong product in gallery | Lion product gallery (20 photos) | FAIL | lion-range-08 and 09 show the lion head handbag on a girl. lion-range-02 and 03 and 04 and 05 and 06 and 07 are stall shots led by other animals. | major |
| Wrong product in gallery | Cat product gallery | WARN | cat-range-01 shows four different long cats (orange, mint, blue, pink) which are not the cream cat with a bag. | minor |
| Overlay text | Lion size ladder 04 | WARN | White overlay labels "XL Large Medium Small" and a visible device label. Charter item 10 says overlays are cropped out. Labels also conflict with the S M L XL scheme. | minor |
| Duplicates in one gallery | Lion size ladder 04, 05, 06, 07 | WARN | Four near duplicate shots of the same row of lions. Lion hero 01 and gallery 02 are the same scene and pose, slightly different crop. | minor |
| Duplicates across products | Reused files | WARN | elephant-grey-04 = giraffe-range-01 = rhino-brown-02. elephant-grey-02 = cat-range-02 = zebra-03 = rabbit-range-03. elephant-lavender-01 = lion-range-02 = zebra-02. Intentional reuse but a shopper sees the same photo across product pages. | minor |
| Provenance | Chameleon (img-036) and dinosaur (img-032) | WARN | Studio shots with a different look from every other photo. The dinosaur matches a well known video game character. Manifest already flags this for client confirmation. Not confirmed. | major |
| Provenance | Wall art studio photos (unicorn, lion, warthog, giraffe, zebra, rhino heads) | WARN | Look like professional or pattern site shots, not stall photos. Rights cleared per R1, so a client confirmation item only. | minor |
| Hero choice | Home Safari tile (lion), Domestic tile (rabbit), More tile (dinosaur), Wall art tile (lion head), Dolls tile (3 dolls) | PASS with note | Each tile shows the named category. More animals tile is the unconfirmed dinosaur. | minor |
| Hero choice | Giraffe orange (gallery only, no hero), Hippo (lifestyle only, person behind) | WARN | Orange giraffe image is a crowd crop with a neighbouring dark elephant. Hippo is the only photo and has a person's face behind it. | minor |
| Story and moment images | story/hero-lion-hug, maker-at-stall, moments 01 to 12 | PASS | Content matches the alt text. No third party text. moment-12 and rhino-range-01 are lower resolution. People images are cleared under R1. | none |
| Resolution | octopus-white (hand held), elephant-wall-head, hippo-wall-head, zebra-range-01, chameleon (480 px) | WARN | Visibly soft at full size. Elephant and hippo wall heads are the worst. | minor |
| Alt text accuracy | All colourway alts checked against images | MOSTLY PASS | Alts match what is visible, including admissions of cropping. Meta wording in octopus and shark hero alts is not suitable for screen readers. Gallery thumbnails render alt="" (20 on lion page). | minor |
| Alt text vocabulary | Lion hero alt "Crocheted lion toy" | FAIL | Appears in rendered HTML on 15 pages (home, shop, categories, 10 product pages). Also "soft toys" and "elephant toys" in other alts. R10 says animals, not toys. | minor |

## 2. Copy

| Check | Item | Result | Evidence | Severity |
|---|---|---|---|---|
| Em and en dash | 47 rendered pages | PASS | U+2014 and U+2013 found on none of the pages. | none |
| Banned phrases | 47 rendered pages | PASS | Scan for the list in 05 section 1 returned no hits. | none |
| Exclamation marks and emoji | 47 rendered pages | PASS | No exclamation marks, no emoji in UI chrome. | none |
| Unapproved claims | child safe, safe for babies, tested, certified, age range, choking | PASS | None present. Lion page links to "Safety facts" (pending /safety). | none |
| Claim wording | "Every part is crocheted on and stays on." (home trust strip) | WARN | "Stays on" edges toward the banned "cannot be pulled off" (D26). Approved wording is "Nothing detachable". Product pages use the safer "Every part is crocheted on." | minor |
| Claim accuracy | Lion head handbag: "Crocheted by hand from recycled acrylic yarn", "Zero plastic", "Nothing detachable" | FAIL | The bag is a white shoulder bag (not crocheted, with a zip or fastener), and only the lion head is crocheted. Claims are applied to the whole product. | major |
| Claim accuracy | Dolls and cat bag: "Nothing detachable" | WARN | Dresses, shoes and shoulder bag may be removable. Needs client confirmation before the claim stays. | major |
| Claim accuracy | Wall art: "Zero plastic" | WARN | Mounting hardware is not described. Secretary bird sits on a plaque. Needs client confirmation. | minor |
| Copy vs photo | Bear: "A small crocheted bear with a cream muzzle, made in several colours and tops" | FAIL | Blue striped bear has a dark nose and blue face, no cream muzzle. Tan and turquoise bears have no top. | minor |
| Copy vs photo | Giraffe: "a white muzzle" | WARN | Cream with brown spots giraffe has a brown muzzle (alt says so). | minor |
| Copy vs photo | Rabbit: "a small striped vest" | WARN | Vests are variegated and speckled, not striped. | minor |
| Copy vs photo | Rhino wall head: "two cream horns, front horn and a smaller horn" | WARN | Photo shows one large horn. Second horn is not visible. Label "Grey" for a lavender blue grey head. | minor |
| Copy vs photo | Lion: "long, shaggy yarn mane and dark brown nose" | PASS | Matches. Lion wall head, goose, dog, shark, turtle, butterfly, monkey, cat descriptions also match. | none |
| Terminology R10 | "About this animal" and "add this animal" on dolls, doll dress, handbag and wall heads | FAIL | A doll and a handbag are not animals. Dolls category tile reads "2 animals". Home heading "30 crocheted animals, from elephants and giraffes to dolls and wall art". | minor |
| Terminology | Cart vs "order list" vs "Order form" vs "Your order" | WARN | Page title "Your cart" and "Cart" in breadcrumb, but body text says "order list" and "order form". | minor |
| Invented facts | Leah Maina, founded 2019, "Mikono means hands", 7 outlets, 25+ women | PASS | Allowed by R2 (brief facts confirmed). Conflicts with D40, which is superseded by R2. No stats, quotes, prices, cm sizes or scarcity found. | none |
| Invented facts | "Made by 25+ women" wording | PASS | Pages say "25+ women supported" and "Mikono Creations supports over 25 women". Home hero says "by 25+ women", which D26 allows only if the client confirms they are the makers. | minor |
| Prices | All product cards and pages | PASS | "Price on request" everywhere. No KES figure in any card, JSON-LD or meta. | none |
| /cart, /order, /order/sent | Server rendered text | NOT VERIFIABLE | Server HTML shows only "Loading your cart" and "Loading your order form". /order/sent has no body text. Client rendered flow needs a browser run. | minor |
| Typos | All pages | PASS | None found. | none |

## 3. Data and links

| Check | Item | Result | Evidence | Severity |
|---|---|---|---|---|
| Catalogue count | 30 products, 5 categories | PASS | Home counts 7, 3, 9, 9, 2 sum to 30 and match data. | none |
| Sizes | S, M, L, XL only | PASS | data sizes array and every card. | none |
| SKU format | slug-colour-size lower case | PASS | Example lion-tan-brown-mane-s, in JSON-LD and lib/catalogue.ts. | none |
| Price display | pricesConfirmed false | PASS | data/facts.ts false, "Price on request" shown, build guard throws if true without prices. | none |
| Offer in JSON-LD | Product pages | PASS | ProductGroup and Product variants with no Offer, no rating. | none |
| Absolute URLs | JSON-LD and sitemap | WARN | Built with http://localhost:3000 as site URL. Must be set for production before launch. | minor |
| Sitemap | 37 URLs | WARN | All 37 routes return 200 (home, shop, 5 categories, 30 products). Missing /wholesale and /contact. | minor |
| Category routes | /shop/safari-animals, /domestic-animals, /more-animals, /wall-art, /dolls | PASS | All 200 (/shop/safari etc. return 404 as expected, not linked). | none |
| Broken links, known pending | /care /size-guide /safety /story /gifts /privacy /cookies /terms /faq /delivery /journal /partners /stockists | 404 | Header, footer, product pages. /safety linked from 30 product pages, the others from 46 pages. | none (pending) |
| Broken links, NOT on pending list | /supply (footer "Supply with us", 46 pages) | 404 | Not in the known list. Likely a pending page. Needs adding to the list or fixing. | minor |
| Broken images | All /media and next image URLs | PASS | 338 distinct image URLs, no missing files noted. | none |

## Top defects

1. Turtle coral and blue colourways show the mint turtle (blocker).
2. Elephant dusty purple leads with an octopus photo (blocker).
3. Elephant wall head has a visible watermark and is a 287 px upscale (blocker).
4. Shark (5), octopus (4), monkey (5) and cat (2) colourways reuse one identical photo.
5. Zebra gallery contains a zebra wall head; lion gallery contains handbag photos.
6. Handbag, doll and cat bag carry "Zero plastic", "Nothing detachable" and "crocheted from recycled yarn" claims that the photos do not support.
7. Chameleon and dinosaur provenance and likeness unresolved.
8. /supply 404 and "toy" in 15 pages of alt text.
