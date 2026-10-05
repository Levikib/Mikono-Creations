# Phase 2 Audit: Business Strategy Gate

Auditor: Reality Checker (Phase 2 audit agent). Date: 2026-10-01. Default stance: NEEDS WORK. Evidence is quoted by file and section (for example `02 §3.3` means `02-checkout-and-flows.md`, section 3.3).

## 0. Verdicts

| Report | Verdict | Reason in one line |
|---|---|---|
| 01 Business model | PASS (conditional) | Sound and cautious. Internal slips (Village Market, bad cross reference, bundles that no other report supports) are fixed by the Decisions list. |
| 02 Checkout and flows | FAIL | Collects child data it says it avoids, 8 step wizard with business fields inside the retail flow, international delivery with no client basis, drawer behaviour contradicts 06. |
| 03 SEO and tracking | FAIL | Puts "child safe" in every product meta description, conflicts with 05 on URLs and with 06 on the hero mask, event dictionary conflicts with 02 and 04, assumes a server that 02 says does not exist. |
| 04 Marketing and lead capture | FAIL | Third event vocabulary, lead routing needs a backend, states "child safe" as fact in the welcome email, workshops scheduled that 01 says to refuse at launch, scope far beyond a first release. |
| 05 Content strategy | FAIL | URL scheme conflicts with 03, content model cannot express variants or SKUs, banned words appear outside the exempt markers, unsupported product claims, general wildlife facts that charter rule 2 does not allow. |
| 06 Design system | FAIL | Own saturation test fails on two of its own tokens, `next/font` variable cycle bug, swatch clamping and `multiply` blending conflict with charter rule 7, feature cards break rule 5, card "Add" button cannot know the variant. |
| **Overall Phase 2 gate** | **FAIL** | No single report is unusable, but the six cannot be built from together. Apply the Decisions list (section 7), amend 02, 03, 05, 06 (small edits to 01, 04), then re-run a short consistency check. |

Grade for the set as a whole: B-. Strong individual craft (02's failure modes, 03's QA checklist, 06's contrast maths were verified correct), weak integration.

## 1. Evidence gathered

- Dash scan: `grep -P "\x{2014}|\x{2013}"` under a UTF-8 locale, a literal-character grep, and a Python codepoint scan on all seven strategy files and all manifest JSON files. Result: **0 hits in every strategy file and manifest.** The only non-ASCII character in the six reports is "é" in 06 line 13.
- Contrast: all 24 ratios in `06 §2.2` recomputed with the WCAG formula. All match to two decimals. Additional unlisted pairings used elsewhere in 06 also pass or are already marked forbidden.
- Saturation: tokens in `06 §2.1` measured in HSL and in OKLCH (section 4).
- Manifest: `media/manifest/merged.json` (88 entries: 87 images, 1 video) analysed for species, colours, backdrops, sizes, people, resolution.
- Repository: `app/layout.tsx`, `app/page.tsx` (existing scaffold) read. They contain content that conflicts with the charter (section 3.6).
- `AGENTS.md` says this Next.js (16.3.8) has breaking changes and that `node_modules/next/dist/docs/` must be read first. No report cites it (section 6).

## 2. Contradictions between reports

Severity: H blocks the build, M causes rework, L cosmetic. "D" numbers point to the resolving decision in section 7.

| # | Topic | Conflict (with references) | Sev | Fix |
|---|---|---|---|---|
| C1 | Routes and taxonomy | Product URL `/shop/[species]/[slug]` (03 §2.1) vs `/shop/[slug]` (05 §2). Collections `/shop/safari-animals` (03) vs `/shop/safari` (05). 05 §2 makes `/shop/[colour]` and `/shop/size-[s,m,l,xl]` indexable collection pages while 03 §2.2 forbids colour and size landing pages. Blog `/journal` (03) vs `/blog` (05, 06 §10 test routes). `/partners` (03) vs `/partner` (02, 05). `/about` (06 §10 tests) vs `/story`. `/makers` and `/colour-guide` exist only in 05. 04 §11 adds "Corporate gifting page" and "Diaspora gifting page" while 03 §1.4 says "corporate gifts" is owned by `/wholesale` only. Category names: "Domestic" (charter, 01, 03, 05) vs "Farm" and "Pets" (06 §5.5, 02 §1.6 "Shop farm and pet animals"). Nav: Shop, Gifts and Sets, Story and Impact, Trade, Contact (01 §2.2) vs Shop, Gifts, Wholesale, Our story, Journal (03 §2.3) vs Shop, Safari, Farm and Pets, Wholesale, Our Story, Journal (06 §5.2). | H | D1 to D3 |
| C2 | Product, size and colour model | 01 §3.1: variant (size x colourway) carries stock, price, image. 02 §1.2: key `animalSlug\|size\|colourway`, e.g. `elephant\|M\|sage`. 03 §3.3: SKU is the id in schema, feeds and events, size and colour via `?size=M&colour=olive`, file name needs `{design}` and `{size}`. 05 §10: `sizes[]` and `colourways[]` with image per colour, no SKU, no design level, status only per animal. 05 §3: product title "Green Elephant, size M" implies a page per size, while 03 §2.1 says one page per design. Colour names disagree: "sage" (02, 06 §5.9) vs "olive" (03). The manifest has no "sage" or "olive"; its colours are tan, mustard yellow, mint green, light blue and so on. 79 of 134 product-photo items have `size_guess: unknown`, so 03 §4.3 file names cannot be built. | H | D5 to D8 |
| C3 | Stock vocabulary | Four sets: in stock / made to order / limited / not available (01 §3.4); ready / made_to_order / ask / unavailable (02 §1.7, §10); InStock / OutOfStock / PreOrder / MadeToOrder (03 §3.3); "out of stock", "Sold out" (06 §5.6, §5.8). 04 §3.4 restock copy prints "We made [number] pieces", while 02 §1.7 and 05 FAQ 18 say no stock counts are ever shown. 03 §3.3 `MadeToOrder` availability may not be accepted by Google or feed validators (verify). | M | D9, D10 |
| C4 | Event names and conversion mapping | Order sent: `generate_lead` (lead_type=order) plus `whatsapp_click` (context=order) (02 §6) vs `whatsapp_order_submit` (03 §6.4) vs custom Meta event `OrderSentToWhatsApp` (04 §6). WhatsApp link: `whatsapp_click` (02, 03) vs `click_whatsapp` (04). Step: `wizard_step_complete` (02) vs `wizard_step` (03). Wholesale: `generate_lead` lead_type wholesale (02) vs `wholesale_request` plus `generate_lead` (03) vs `price_list_request` and `partner_enquiry` (04). Catalogue: `file_download` (03) vs `catalogue_download` (04). Meta: Lead on Send and Contact on WhatsApp opened for the same tap (02), so one order counts twice. TikTok: `SubmitForm` (02) vs "SubmitForm or PlaceAnOrder" (03 §6.4 table, though 03 §6.6 says SubmitForm). 03 `begin_checkout` has `checkout_type` retail or wholesale, but 02 sends wholesale through a separate form, not checkout. | H | D22, D23 |
| C5 | Order ref and source line | `MK-YYMMDD-XXXX` (02 §3.1) vs `MK-7F3K2` plus `Ref: ... \| src: ...` line (03 §6.5) vs "short reference code" (04 §6). 02's message template has no source line, and ends "Sent from mikonocreations.[TODO domain]" (domain hardcoded, not from env). | M | D24 |
| C6 | UTM storage before consent | 02 §6: UTMs captured "into sessionStorage" at first landing, while "all tracking waits for consent". 03 §6.5: hold in memory until consent, store `mk_attr` after. 04 §6: persist after consent. | M | D25 |
| C7 | Trust and safety claims | 01 §6.3 and 05 §1 allow only "zero plastic, nothing detachable, easy to clean" and forbid "tested" and "certified". But: 03 §3.1 product description pattern ends "Recycled yarn, no plastic, child safe stitching" and calls "child safe" "a brief claim" (it is not in the charter or the client facts). 04 §3.1 welcome message 2 lists "child safe" as a fact. 06 §5.15 trust strip includes "safe for babies (only if certified)", a different standard than 01 and 05. 05 §1 do rule 2 example "so there is nothing to swallow" and 05 §3 giraffe "Nothing is sewn on loosely, so nothing can be pulled off" are safety and construction claims with no evidence (01 §6.3 says a pull test record is needed). Existing scaffold `app/page.tsx` says nothing detachable reduces "the risk of small parts becoming a choking hazard". "25+ women supported" (charter, 01, 06) vs "made by 25+ women" (05 header, 04 §3.1, 03 meta) vs "Over 25 women" (05 FAQ 29) vs "a named group" (01 §0, no names exist). | H | D26, D27 |
| C8 | Lead destinations and backend | 02 §0 and §9: static-first, no server, data goes only browser to WhatsApp. 01 §2.3 step 4: form "stores a lead record". 04 §2: three destinations W, E (email service via route handler or server action) and S (Google Sheet via service account), honeypot plus server rate limit. 03 §4.1 reserves `/api/` and 03 §6.7 plans `app/api/events/route.ts`. 02 §11 lists all of this as "what a backend would add later". Marketing consent (02 `consentMarketing`, unticked) has nowhere to be stored except inside a WhatsApp text. | H | D18 |
| C9 | Wholesale pricing visibility and trade routing | 01 §2.2 says trade pages show prices "only after the visitor is identified as a trade buyer (see 2.4)" (2.4 is MOQ, wrong reference) while 01 Decisions and 02 §5.1 say prices are never shown and a list is sent on WhatsApp. 06 §6.6 puts a "Price table placeholder" on the public wholesale page. 03 §6.4 and 04 §2 #6 offer a public wholesale catalogue PDF (prices inside would leak). 02 §1.2 and Step 1 let a retailer or organisation buy through the retail cart at retail prices, with B2B mode up to 500 per line, while 01 §2.2 wants a 48 unit cart redirected to a quote. Thresholds: 20 per line (02 §1.3), 30 total (02 §1.3), "20 or more" (02 Step 1), 10 to 24 bucket (02 §5.1), `[QUOTE_THRESHOLD_UNITS]` (01). Three different wholesale field lists: 01 §2.3, 02 §5.1, 04 §2 #5. 01 has four paths (price list, quote, sample pack, repeat order), 02 has one form. | H | D20, D21 |
| C10 | Child data in the wizard | 02 Step 2 collects `recipientFirstName` and `recipientAge` (bucket) for gifters, Step 5 collects `recipientName` and `recipientPhone`, and the 02 §3.2 sample message prints a gift note naming a child ("Happy birthday Zuri"). 02 §8.10 and §9 say the design "avoids" child data beyond optional first name and age bucket. The age bucket is "used only for a safety note", but the safety age statement is a client TODO (01 §6.3), so the field has no purpose. 04 §2 #7 asks month and day of an occasion, #4 asks recipient age band and budget. The Kenya Data Protection Act treats child data as needing parental consent, so a first name plus age bucket plus message text is exactly the combination to avoid. | H | D16 |
| C11 | Env var names | 02 §3.3 `NEXT_PUBLIC_WHATSAPP_NUMBER` "digits only, no plus"; 03 §6.2 same name but "E.164 digits only" (ambiguous plus). 03 lists seven public and three server vars. 04 names none, but needs email provider key, Sheet id and service account. 01 §7 wants a separate trade WhatsApp contact: no var. No contact email var. Site domain hardcoded in 02 §3.2. | M | D19 |
| C12 | Cart and wizard behaviour | Drawer opens after "Add to cart" (02 §1.1) vs "add triggers a toast instead (no forced drawer)" (06 §5.11). Drawer is a bottom sheet under 768 px (02) vs right sheet at 768 and bottom sheet only at 390 (06). Drawer buttons "View full cart" and "Continue to order form" (02) vs "Checkout on WhatsApp" and "Keep shopping" (06; "checkout" implies payment, which 02 §0 forbids implying). Wizard: 8 steps defined (02 Steps 1 to 8) but labelled "Step 3 of 7" and "Step 4 of 7"; 6 titles in 05 §7; 5 steps in 06 §5.12 which says "final naming per spec 03" (03 is SEO, the wizard is 02). Card "Add" button (06 §5.6) cannot work: the variant key needs size and colour (02 §1.2), but chips on the card are non-interactive and the price differs by size (01 §4.1). Bottom of screen stack: consent bar (03 §7.1), sticky product bar 72 px (06 §6.3), sticky wizard bar (06 §5.12), toast at 88 px (06 §5.14), WhatsApp button (06 §5.22) compete for the same strip. | H | D12 to D14, D34 |
| C13 | Performance vs design | 03 §4.4 "no blob mask that forces extra layers on the hero" vs 06 §4.3 and §5.4 SVG `clip-path` on the LCP hero image. 03 §4.4 "2 families maximum" vs 06 §3.1 three families. Image quality 75 (03 §4.3) vs 78 (06 §8; Next 16 restricts allowed qualities, verify). 03 §2.2 "show all products on one page" vs 06 §6.2 "Load more". `lang="en-KE"` (03 §4.1) vs `lang="en"` (06 §3.1 code and current layout). 06 §4.2 five stacked shadows on every card, plus filter `drop-shadow` on every torn or polaroid piece, on a grid of 24 cards, for low end Android in Kenya. | M | D31 to D33 |
| C14 | Scope contradictions | 01 §3.2 and §0 rank bundles third, but 02 CartLine has no bundle type, 03 has no bundle URLs or schema, 05 has no bundle model, 06 has no bundle card. 01 §5: "Choosing these means saying no to workshops and kits at launch", yet 04 §2 #8 and §10 (days 61 to 90) launch workshop sign up and 05 §5 project 1 is a community workshop. 02 §5.4 builds `/custom` at launch while 01 §5 puts custom orders at stage 2 with feasibility TODO. Header search field (06 §5.2) vs no search anywhere else (03 §3.3 "only if on-site search ships"). | M | D36, D37 |
| C15 | Fact provenance | Social handle `@mikonocreations` stated as fact in 04 §4 but "social handles TODO" in 02 §12, 03 §1 and charter §6. The scaffold `app/page.tsx` contains the handles, "Founded in 2019" (line 223) and stockists including Blue Rhino Shop at Village Market Mall (lines 35 to 38). 01 §1 says stockists sell "at the Giraffe Centre, JKIA and Village Market" but its own list of seven names has no Village Market venue, and 03 §1.3 says whether any stockist exists at Village Market, Karen or JKIA is TODO. 01 §6.2 cites "animals made since 2019". 05 §2 states "Mikono means hands" as fact. 05 §3 states "Handmade yarn lots can differ a little, so the green may vary" as fact in every product template (only the FAQ marks it TODO). | M | D40 |
| C16 | Trust strip, stats, best sellers | Trust strip: 4 items incl. "safe for babies" (06 §5.15), 5 items (04 §11), 6 lines (05 §7), "25+ women supported" only (01 Decisions). Stats band of "four numbers" (06 §5.16, §6.1) when exactly one number is a fact. "Best sellers rail" (charter §3, 05 §2, 06 §6.1) needs sales data, yet 05 §9 fails any "bestseller" claim with no data source. Home "captured moments" strip needs cleared photos, and the manifest has no cleared field and 36 of 88 entries show people (5 with children). | M | D27, D28 |
| C17 | Delivery and diaspora | 01 §4.3 zones A, B, C plus international "TODO". 02 Step 3 has Nairobi areas (25 starter names), other Kenya (county select) and a full international address form, while 03 §1.2, 05 FAQ 25 and 01 say international shipping is unconfirmed. "Diaspora" is both "pay from abroad, deliver in Kenya" and "ship abroad" across 01, 03, 04. | M | D15, D17 |
| C18 | Local storage and personal data | 02 §7 says drafts exclude KRA PIN; 02 §9 says KRA PIN is kept in the draft for resume. 02 stores `mk.orders.v1` (full `Order` objects incl. name and phone, last 10) in localStorage on possibly shared phones. 03 §7.1 lists only "cart, consent record" as essential storage and does not disclose drafts or orders. Two "clear" controls: "Clear my data" (02 §9) and "Cookie settings" (03 §7.1). | M | D16 (storage), D35 |
| C19 | Two content calendars and two copy stores | 03 §8 lists 20 SEO topics, 05 §4 lists 40 posts in 7 pillars, 04 §4 lists 6 more titles. Titles overlap only partly. 02 §2 says all strings live in typed `copy.ts`, 05 §10 says microcopy lives in JSON files. | L | D38 |

## 3. Charter violations

### 3.1 Dashes (hard rule 1)
- Strategy files and manifests: **0 em or en dashes.** PASS.
- Repository code: **4 hits outside the reports.** `app/layout.tsx:9`, `app/page.tsx:186`, `:245`, `:325`. `AGENTS.md` (tool generated) has 2 more. The scaffold must be rewritten, not patched (3.6).
- 05 §9 instructs verifiers to run `grep -rn " - " content` for spaced hyphens: fine. But several reports use a hyphen for ranges inside code, which is allowed.

### 3.2 Banned phrases and slop (hard rule 2)
- 05 §1 do-not list item 4 contains "adorable" and 05 §9 row "Slop phrases" contains "elevate", "unleash", "journey", "seamless" and more. Both sit **outside** the `SCAN-EXEMPT` markers (05 lines 39 and 352). A scanner that skips only the marked block will flag 05 itself. Move both into the exempt block or reword.
- Otherwise the six reports contain none of the banned list (grep run for the full list plus "curated", "bespoke", "vibrant", "premium", "stunning").
- Voice line in 05 §1 "a warm Nairobi aunty" is a stereotype shorthand. Replace with "a plain spoken parent who knows the craft".
- Product copy examples in 05 §3 contain unsupported statements: "suits a first soft toy", "Small enough for a school bag", "sits well on a bed", "Giraffes are a common sight in Kenya's parks" (flagged for client, fine), "Nothing is sewn on loosely, so nothing can be pulled off" (not fine, see C7).
- 05 §4 Pillar A (7 posts on elephants, giraffes, zebras, the Big Five, animal sounds) and Pillar B (parenting advice) depend on general knowledge. Charter rule 2 says "Facts only come from the client brief or are marked TODO". These posts are a rule 2 conflict unless the charter owner permits cited general knowledge. "Handmade vs Factory Toys: A Fair Comparison" (post 19) invites claims no one can verify.

### 3.3 Invented facts (hard rule 3)
See C7, C15, C16. Additional: 04 §6 media budgets are labelled ASSUMPTION (acceptable), 04 §5 "Existing: Beth International JKIA, Giraffe Centre" relies on the unconfirmed scaffold list. 05 §10 "Mikono means hands" and "Founded 2019" need client confirmation before use.

### 3.4 Bright colours (hard rule 4)
Report 06 claims "No hue exceeds roughly 45 percent saturation" (06 §2). Measured HSL saturation of its own tokens:

| Token | Hex | HSL saturation | OKLCH chroma |
|---|---|---|---|
| ochre-deep | #7F5C1C | 0.64 | 0.091 |
| ochre-tint | #F0E2BF | 0.62 | 0.048 |
| ochre | #C9A05A | 0.51 | 0.101 |
| terracotta-tint | #EBD2C4 | 0.49 | 0.034 |
| brick | #9B3F35 | 0.49 | 0.125 |
| terracotta-deep | #8A4630 | 0.48 | 0.099 |

The claim is false, and `06 §10` check 8 ("HSL saturation above 0.55 is a FAIL") would **fail ochre-deep and ochre-tint**, the two tokens used for the sale and info tags. The colours are visually muted; the metric is wrong (HSL saturation exaggerates dark and very light colours). Fix the metric, not the colours: use OKLCH chroma with a UI cap of 0.13. Tokens range 0.034 to 0.125, so all pass. For scale, a bright pink, royal blue, orange or mint measures 0.16 to 0.19.
Also: `06 §2.2` labels ochre-tint as "Sale and info tag background" and ochre-deep as "sale tag" although 01 §4.2 and charter rule 4 ban sale tags. Rename to "info tag".

### 3.5 Card uniformity (hard rule 5)
06 §5.6 is the best specified card in the set (grid-auto-rows 1fr, fixed title block, pinned footer). Gaps:
1. **Bento tiles** (06 §4.4) use spans 1x1, 2x1, 2x2, so tile heights differ by design. Rule 5 says equal card height in any row or grid. Needs an explicit charter ruling (Q11); the bento direction is also in charter §3.
2. **Feature cards at 2x width** in blog (06 §5.18, §6.8) and projects (06 §5.19, §6.9) break "equal image aspect ratio" and "same size". Move the feature to a separate hero block above a uniform grid.
3. **Tilt and tape on odd blog cards** (06 §5.18) varies the card per position. Keep tilt off cards in a grid, or give every card the same treatment.
4. The Playwright test in 06 §10 asserts media aspect 0.8 on every `[data-card]`, but blog cards are 3:2 and project cards 4:3, so the test fails the design it checks. It also treats a missing `data-cta` as `0` (vacuous pass), the contrast block is unfinished (`effectiveBg` is undefined), routes `/about` and `/blog` do not match 03, and check 1 will fail the bento by design. Required attributes (`data-card-group`, `data-card`, `data-media`, `data-cta`, `data-scroller`) are not reflected in the 05 content model or in 02's components; define per card type: `data-card="product|post|project|tile"` and `data-ratio`.
5. Listing card price: one price on the card but price varies by size (01 §4.1). "From KES x" and a placeholder state ("Price on request") must fit the fixed price row.
6. The `size chips` row is 36 px high and non-interactive but looks like controls. Make them plain text ("S M L XL") or make them 44 px links.

### 3.6 Existing scaffold (outside the six reports, but a gate risk)
`app/page.tsx` and `app/layout.tsx` contain em dashes, emoji icons (06 §9 bans emoji in chrome), "yarntastic", "made with love", "Eco-Friendly & Sustainable", a choking hazard claim, "Modern production methods also help reduce energy and water use" (invented), the Lora and Nunito fonts (06 specifies Fraunces and Figtree), a leaf green token and hardcoded handles and stockists. Treat as throwaway. Phase 8's scan would fail it.

## 4. Design feasibility: saturated products on a muted UI

### 4.1 What the photos are
- 252 item records in 88 manifest entries. 77 (31 percent) have a dominant colour in blue, purple, pink, green, red, orange or yellow families (yellow 26, mustard 15, light blue 9, purple 4, pink 3, royal blue 3, green 3, mint green 3, red 2, orange 2, sky blue 2, others). The other 69 percent are tan, brown, grey, cream, white, black.
- Only 46 entries are product shots (28 group, 18 single). Only 17 of those have confidence 0.8 or higher and no review flag. Only 11 of 18 single shots have a plain neutral backdrop; others are on a mint green wall (img-008), a yellow painted wall (img-025), sofas (img-048, img-082), garden foliage and market tables.
- Median short side of product shots is 757 px. Only 13 of 46 reach 1000 px. A 600 px blob hero at 2x needs about 1200 px.
- The manifest has no `cleared`, `focal`, `blend`, `fit` or neutral backdrop field, and sizes are guesses.

### 4.2 How 06 handles it
Good: UI chrome is neutral; photos are never recoloured (`06 §5.9`, `§8.5`); selected colour name is printed as text; sand frame behind images; semantic status colours avoid red and green.
Not good:
1. **Swatch clamping** (`06 §5.9`): swatch hex is "clamped to chroma at or below the palette's". A royal blue animal gets a dusty blue swatch. That misstates the product colour, which charter rule 7 treats as a fact, and 06 itself admits it needs client confirmation. The `swatchHex` field is also absent from 05 §10.
2. **`mix-blend-mode: multiply`** (`06 §8.3`) on "white background cutouts": valid only on true white. On the pale grey backdrops (img-022, img-023, img-033, img-034) it darkens the animal; on the mint and yellow walls it tints it. It is a colour filter by another route, against rule 7 and 06's own rule 5 in section 8. There is no manifest `blend` flag to drive it.
3. **No curation rule.** Saturated backdrops (mint wall, yellow wall) in a 4:5 card inside a sand UI create exactly the loud rectangles the palette is meant to avoid, and `object-fit: cover` cannot remove them.
4. **No rhythm rule.** A default sort by colour or by species can put four pink, blue, orange and purple animals in a row.
5. **Wrong metric** (3.4).
6. Product colour naming collides with UI token names (olive, terracotta, ochre, sand): a "sage" or "olive" animal is easy to confuse with the brand olive, and the manifest has neither.

### 4.3 Recommended rule (adopt as "Photo Colour Rule")
1. **Scope.** Charter rule 4 governs UI, illustration, badges, backgrounds and states. Product photography and the product's own colour are content, protected by rule 7. Charter owner to confirm in one sentence (Q11) because the charter says to stop on conflict.
2. **Photos untouched.** No tint, overlay, blend mode, saturation filter, duotone or colour matched UI. No per product accent colour.
3. **Neutral frame.** Product images sit in a `sand` box with warm brown shadow. Never a coloured border, never a coloured card background, never a colour keyed hover.
4. **Swatches are evidence.** Use a 28 px round crop of the actual photograph (animal body, masked) or the true sampled hex, unclamped, with a baobab ring and the colour name printed beside it. The colour name comes from one approved taxonomy (`data/colours.ts`, key, label, family) derived from the manifest and approved by the client.
5. **Curation.** A listing or gallery hero image must have `bg: neutral`, `best_use` containing `product_hero` or `product_gallery`, confidence 0.8 or higher, animal 85 percent visible at 4:5. Images with saturated or busy backdrops go to lifestyle, journal and gallery sections only, never listing cards.
6. **Rhythm.** Default sort: species order, then colour family with neutrals first. Featured rails alternate neutral and saturated, with no more than two saturated animals adjacent. This is an editorial rule applied in data, not a runtime filter.
7. **Chroma budget.** UI tokens must stay at or below OKLCH chroma 0.13 and lightness contrast per 06 §2.2. Replace QA check 8 with an OKLCH test on computed CSS colours; exempt `<img>` pixels.
8. **Multiply** only when the manifest flags `bg: white` after visual check; otherwise forbidden.
9. **Low resolution.** Images below 700 px short side never appear above 280 px wide; heroes are chosen only from sources 1000 px or more, or the hero uses a smaller blob.

## 5. Scope risk and recommended cut

### 5.1 Size of the plan
Counted from the reports: roughly 45 routes (05 §2 alone has 28, 04 §11 adds about 10), 40 blog posts (05) plus 20 SEO topics (03) plus 6 more (04), 12 project concepts, 40 FAQ answers (about 25 of them TODO), 25 plus design components, 4 enquiry flows plus 12 capture points, 3 product feeds, 2 catalogues, a quiz, a gift finder, a reminder club, reviews, a UGC programme, a stockist locator. The product data is 88 photos, 46 usable product shots, about 70 distinct animal and colour pairs and no confirmed prices, sizes, dimensions or colourways. A first release built on all of it would ship with most pages in TODO state, which hurts trust more than a smaller site.

### 5.2 MVP cut in priority order

**Shop (release 1)**
1. Data layer: products, colours, variants, delivery areas, copy, facts (typed, validated), image pipeline from the manifest.
2. Shell: header, footer, nav, WhatsApp button, consent bar, 404 and error pages, legal pages.
3. Shop listing with filters: animal type, size, colour family. No price filter, no search.
4. Product page: size and colour selection, availability, add to cart, "Ask on WhatsApp".
5. Cart (drawer plus page, localStorage).
6. Order wizard (4 or 5 steps), WhatsApp message builder, copy fallback, sent page, draft resume.
7. Home: hero, category tiles, featured animals rail, trust strip (4 claims), wholesale pointer. Stats band only if 2 or more confirmed numbers. Gallery only if 4 or more cleared photos.
**Later (shop):** bundles and gift sets pricing, build your own set, wishlist, search, reviews, customer accounts, quick add on cards, order status page, card and M-Pesa STK payments.

**Trade (release 1, small)**
1. `/wholesale` page with one request form (type: price list, quote, sample pack, reorder) to WhatsApp. No prices.
2. `/partners` page with one enquiry form (type selector).
3. `/stockists` list (empty state until permissions arrive).
**Fast follow:** `/custom` (same form engine), `/supply`, repeat order template, catalogue PDF (no prices), corporate and diaspora gifting pages.
**Later:** trade portal with tier prices, sponsor-a-doll, school programmes, workshops and kits, licensing, international wholesale.

**Content (release 1)**
1. `/story` including impact (one page, only confirmed facts), `/care`, `/size-guide` (no measurements until supplied; combine with colour guide), `/safety` (four allowed facts), `/faq` (only answered questions), `/delivery` (placeholders marked), `/contact`.
2. Journal: 3 to 5 posts that rely on brief facts only (what recycled acrylic yarn is, how to clean, how to choose a size, what nothing detachable means as a construction description).
**Fast follow:** makers page (consents), projects (only real ones), gallery (cleared photos only), journal posts 6 to 20.
**Later:** Pillar A and B general knowledge posts (pending charter ruling), kinetic headline set beyond 2 pages, press page.

**Marketing infrastructure (release 1)**
1. Metadata templates, sitemap, robots, canonical, `lang`, Organization, Product, BreadcrumbList, ItemList, FAQPage JSON-LD, OG images.
2. `track()` module, consent bar and Consent Mode defaults, UTM capture, core event set (D22), env var gating.
3. Search Console, GA4 key events, Google Business Profile (manual, outside code), WhatsApp Business labels and quick replies (manual).
**Fast follow (days 1 to 30):** Merchant Center feed, Meta and TikTok catalogues, newsletter (needs email provider), `/links` page, order log sheet.
**Later:** quiz, gift finder, reminder club, reviews and submission, UGC programme, restock email, lifecycle automation, stockist map, paid media, CAPI and server events, referral and loyalty.

### 5.3 Timeline reality
Today is 2026-10-01. 04 §10 puts a Christmas push in days 61 to 90 and 02's sample message dates an order 2026-10-20. Phases 3 to 8 plus unanswered client inputs (prices, colourways, safety evidence, photo clearance) make a Christmas 2026 campaign unlikely. Treat Q4 gifting as best effort and ask the client for a target date (Q14).

## 6. Gaps: needed by the build, covered by no report

| # | Gap | Why it matters | Recommendation |
|---|---|---|---|
| G1 | **Product data model and manifest wiring** | 01, 02, 03, 05 each define a partial model (C2). Manifest lacks `cleared`, `focal`, `blend`/`bg`, `fit`, `shownSize`, `approved`, so 03 §4.3, 05 §10, 06 §8 and charter rule 10 cannot be enforced. | One `types/catalogue.ts` (Product, Colour, Variant, Availability, Money|null, MediaRef) plus a manifest schema v2 with those fields and an approval step. Build fails on a missing or uncleared ID. |
| G2 | **Image pipeline** | Median source 757 px, 13 of 46 product shots at 1000 px, landscape sources (img-005 is 708 x 308), file names need fields the manifest lacks. 14 MB `vid-001.mp4` (WhatsApp video, not analysed for people). | Script (sharp) generating `public/media/` from approved manifest only, no upscaling, AVIF and WebP, 10 px blur data URIs, focal point, rule 4 of 06 §8 flags. Video: transcode, poster, `preload="none"`, no autoplay, clear people first. |
| G3 | **Taxonomy for animals that are not safari or domestic** | Manifest has zebra 9, hippo 6, octopus 7, turtle 5, shark 5, butterfly 4, unicorn 3, bear 4, duck 3, doll 10, dinosaur, chameleon, frog, goose. Charter and all reports assume two categories. | "More animals" collection; client decides what is catalogue and what is one off. |
| G4 | **Where stock and prices are edited** | 01 §3.4 "simple data file or admin sheet", 05 §10 "Decap or Keystatic TODO". A static site needs a rebuild for every stock change. | Choose: Git based CMS (Keystatic) or Google Sheet to JSON with ISR revalidation. Decide before Phase 3 (Q16). |
| G5 | **Placeholder mode** | 05 §10 refuses to publish any product with an unresolved price, but 02 §1.5 and 03 §3.3 plan "Price on request". With no prices at launch the shop would be empty, or Offer schema and feeds would carry fake values. | `pricesConfirmed` flag (D11). |
| G6 | **Error, 404, offline, loading and empty states** | 04 §11 lists a 404 line and 05 §7 has copy; 06 has no layout for 404, 500, order sent, privacy pages, forms, accordion, breadcrumb, consent bar, lightbox focus detail. 06 has no breadcrumb component though 03 §2.4 requires visible breadcrumbs. | Add to 06: ConsentBar, Breadcrumb, Accordion, EnquiryForm, NotFound, Error, Legal page template, OrderSent. |
| G7 | **Legal pages and entity** | `/privacy`, `/cookies`, `/terms` listed (03, 04, 05) but no owner, entity name, ODPC registration status, retention, returns, terms of sale. | Client and lawyer inputs (Q15). Pages ship as labelled drafts, not live legal text. |
| G8 | **Performance budget** | 03 §4.4 has CWV targets and an assumed 170 KB JS per route; nothing on image weight, font weight, number of third party tags, or a test device. | Per route budget: JS 170 KB gzip, images above the fold 300 KB, fonts 2 families 80 KB, third party deferred and consent gated; test profile Slow 4G and a mid range Android. Add to Phase 8. |
| G9 | **Next.js 16 verification** | `AGENTS.md` requires reading `node_modules/next/dist/docs/`. 03 assumes `app/sitemap.ts`, `app/robots.ts`, `generateMetadata`, `images.formats`, `trailingSlash`, `afterInteractive`; 06 assumes `quality` 78 and the font variable names; middleware is not planned but is renamed in newer Next. | Phase 3 first task: read the docs, list API deltas, amend 03 and 06. |
| G10 | **JSON-LD escaping defect** | `03 §3.3` says "escaping `<` as `<`", a no-op. | Escape as `<`. |
| G11 | **Font variable cycle** | `06 §3.1`: `next/font` is given `variable: "--font-display"` and `@theme` then defines `--font-display: var(--font-display), ...`. A custom property that references itself resolves to nothing, so the display font silently falls back. Same for sans and hand. Also `WONK` is set in CSS but not loaded in `axes`. | Name loader variables `--font-display-loaded`, `--font-sans-loaded`, `--font-hand-loaded`. |
| G12 | **Single order log and lead sheet** | 01 §7.6 order sheet, 03 §6.6 order log, 04 §2 lead sheet with different columns. | One sheet, tabs: orders, leads, consents, proof register. |
| G13 | **Internal pages in production** | 05 §10 generates a team only TODO register page. | Build only in preview or behind `noindex` and an env flag; never in production sitemap. |
| G14 | **Hosting and domain** | No report says where it is hosted. Vercel tooling is in the environment but undecided. | Decide with domain (Q13). |
| G15 | **Content and tooling** | No MDX approach (`@next/mdx` vs a library), no Zod dependency, no lint script for the dash and slop scans (05 §9 describes commands but nothing wires them into `npm run`). | Add `scripts/qa-copy.mjs` and run in `prebuild`. |
| G16 | **Manifest review backlog** | 68 of 88 entries need human review; no client review loop is planned. | Client review sheet for review flags in Phase 3. |

## 7. Decisions the build will follow (40 items)

These override the six reports wherever they differ.

**Routes and naming**
- D1. Routes: `/`, `/shop`, `/shop/safari-animals`, `/shop/domestic-animals`, `/shop/more-animals`, `/shop/[slug]` (flat product URL), `/gifts`, `/wholesale`, `/partners`, `/supply`, `/custom`, `/stockists`, `/story`, `/impact`, `/makers`, `/journal`, `/journal/[slug]`, `/projects`, `/projects/[slug]`, `/gallery`, `/care`, `/size-guide`, `/safety`, `/faq`, `/delivery`, `/contact`, `/cart`, `/order`, `/order/sent`, `/privacy`, `/cookies`, `/terms`; drop `/blog`, `/partner`, `/about`, `/colour-guide`, colour and size landing pages, `/shop/[species]/[slug]`.
- D2. Nav: Shop, Gifts, Wholesale, Our story, Journal, plus Contact link, WhatsApp link and cart; "Trade" is an internal word only; footer carries partners, supply, care, size guide, FAQ, delivery and legal.
- D3. Categories are Safari animals, Domestic animals, More animals (client confirms names); no "Farm" or "Pets"; UI says "animals", and the client decides between "animals", "toys" and "dolls" (Q12).

**Product, variants, availability**
- D4. Product (page) has Colourways (key, label, images) and Sizes S, M, L, XL; a Variant is colourway x size with `sku = {slug}-{colourKey}-{size}` lowercase.
- D5. The cart key, event `item_id`, schema `sku`, feed `id` and WhatsApp line all use the SKU (replaces the pipe key in 02 §1.2).
- D6. Images belong to a colourway, not a size; each image carries `shownSize` (nullable); manifest size guesses are never displayed as fact.
- D7. One colour taxonomy file (`key`, `label`, `family`, swatch source) derived from manifest colours and approved by the client; UI palette token names are never used as product colour names unless the photo matches.
- D8. Product H1 and title are "{Colour} {Animal}" with no size; size lives in the selector and variant schema; meta titles are length checked at build.
- D9. Availability per variant: `ready`, `made_to_order`, `limited`, `ask` (default), `unavailable`; schema maps ready to InStock, limited to LimitedAvailability, unavailable to OutOfStock, made to order only if Rich Results Test accepts it; feeds include only `ready`, `limited` and lead-time-confirmed `made_to_order`.
- D10. No stock counts anywhere, including restock messages; remove the count sentence from 04 §3.4.
- D11. `pricesConfirmed` flag: when false, show "Price on request", omit Offer schema, feeds, price filter and "from KES" meta; when true, a product without a price fails the build.
- D12. Listing cards show "Choose size" (links to product), "From KES x" or "Price on request" in a fixed price row; add to cart exists only on the product page.

**Cart, wizard, data**
- D13. Add to cart shows a toast and updates the count; the drawer opens only when the cart is tapped (06 wins over 02 §1.1); drawer buttons "View cart" and "Continue to order form"; never the word "checkout".
- D14. Wizard steps: Who is ordering, Your details (incl. payment preference and notes), Delivery or pickup (incl. date wish), Gift options (skippable), Review and send; count is computed ("Step 2 of 4"); shop, business and organisation answers lead to `/wholesale` with a "continue as retail" link; KRA PIN, invoice and PO fields are removed from the retail wizard.
- D15. Delivery options at launch: pickup, Nairobi area, other Kenyan town; international address entry is removed until the client confirms; diaspora buyers pay from abroad and send to a recipient in Kenya (payment method TODO).
- D16. No `recipientFirstName` and no `recipientAgeBucket`; `sendDirect` keeps adult contact name and phone only; the gift note hint says "please do not include a child's surname, school or age"; quiz and gift finder answers stay on the device; the reminder club stores contact plus occasion type and date only; `mk.orders.v1` keeps ref and item summary only (no name, phone, address); KRA PIN is never stored.
- D17. Delivery data is `deliveryAreas[]` (`area`, `zone` A or B, `feeKes|null`, `codAllowed`) plus zone C for other Kenya; fees show "to be confirmed" until supplied.
- D18. Release 1 has no server persistence: every form ends in a WhatsApp message with copy fallback; email provider and Google Sheet routes (04 §2 E and S), newsletter, restock alert and review submission wait until the client chooses an email provider and owns the Sheet; marketing consent travels in the message text only.
- D19. Env vars: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_ENV`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`, `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits with country code, no plus), optional `NEXT_PUBLIC_WHATSAPP_NUMBER_TRADE` (falls back to retail), `NEXT_PUBLIC_CONTACT_EMAIL`; reserved server names `META_CAPI_TOKEN`, `TIKTOK_EVENTS_API_TOKEN`, `GA4_API_SECRET`, `EMAIL_PROVIDER_API_KEY`, `LEADS_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_JSON`; one typed `lib/env.ts` lists what is missing at build; no domain is hardcoded.

**Wholesale and trade**
- D20. No wholesale or tier price appears on any public page, PDF, schema, feed or WhatsApp catalogue; the price list is sent by a person on WhatsApp after the form; no price table on `/wholesale`.
- D21. One wholesale form with request type (price list, quote, sample pack, reorder), phone required, email optional, fields from 02 §5.1; one `QUOTE_THRESHOLD_UNITS` constant drives the cart and wizard suggestion (soft prompt, never a block), replacing 20, 30 and 500.

**Tracking**
- D22. Event names: `view_item_list`, `select_item`, `view_item`, `select_variant`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `wizard_step_complete`, `add_shipping_info`, `whatsapp_order_submit` (the Send tap, the single order conversion), `whatsapp_click` (every other WhatsApp link), `generate_lead` (all enquiry forms, with `lead_type` of wholesale, price_list, sample_pack, quote, partnership, supply, custom, contact, catalogue), `newsletter_signup`, `file_download`, `consent_update`, `web_vitals`; remove `click_whatsapp`, `wholesale_request`, `price_list_request`, `partner_enquiry`, `catalogue_download`, `wizard_step`, `OrderSentToWhatsApp`.
- D23. Mapping: `whatsapp_order_submit` to Meta `Lead` and TikTok `SubmitForm` (no Meta `Contact` on the same tap); `whatsapp_click` to `Contact`; `generate_lead` to `Lead` and `SubmitForm`; never `purchase`; no `PlaceAnOrder`; `value` only when real.
- D24. Order ref is `MK-YYMMDD-XXXX` (02 §3.1) with prefixes MK, WS, PT, SP, CU; a `Source:` line (for example `instagram / paid / xmas-2026`) is added to the message only when attribution exists; the site URL comes from env.
- D25. UTMs are held in memory before analytics consent and stored in `mk_attr` after; lower case values per 04 §6.

**Trust and privacy**
- D26. Approved claims only: "Zero plastic", "Nothing detachable", "Easy to clean", "Recycled acrylic yarn", "Made in Nairobi", "25+ women supported"; banned until evidence: child safe, safe for babies, tested, certified, age range, "nothing to swallow", "choking", "cannot be pulled off"; "made by 25+ women" only if the client confirms they are the makers.
- D27. Trust strip is exactly four items (zero plastic, nothing detachable, recycled acrylic yarn, 25+ women supported); the stats band renders only confirmed figures (one figure uses a single stat layout; none hides the band); "Best sellers" is renamed "Featured animals" until sales data exists.
- D28. Add `cleared`, `bg`, `focal`, `fit`, `shownSize`, `approved` to the manifest; people images are unpublished unless `cleared: true`; the home gallery renders only with 4 or more cleared images, otherwise the section is omitted (no placeholders).

**Design**
- D29. Photo Colour Rule (section 4.3) is adopted, subject to charter owner sign-off on rule 4 scope; UI chroma cap is OKLCH 0.13; replace the HSL saturation test.
- D30. Swatches are photo crops or true sampled hex with printed name; no clamping; `multiply` only on manifest `bg: white`.
- D31. The hero blob uses CSS `border-radius` (blob-a), not SVG `clip-path`; clip-path is reserved for non-LCP images; shadows on listing cards use the lighter `clay-sm`; drop-shadow filters are limited to the story pages.
- D32. Fonts: Fraunces and Figtree site wide, Caveat only in the story, journal and projects layouts; loader variables renamed per G11; image quality values follow the Next 16 docs (G9).
- D33. `<html lang="en-KE">`; `/shop` renders all products on one page up to 48 items, "Load more" only above that.
- D34. Bottom UI order: consent bar above everything; the WhatsApp button hides on `/cart`, `/order` and whenever a sticky action bar or the consent bar is on screen; sticky product bar and wizard bar never coexist.
- D35. Cards: bento keeps equal internal structure and closed rows but not equal spans (pending ruling); blog and project feature cards move to a hero block above a uniform grid; QA uses `data-card` type and `data-ratio`; "Clear my data" and "Cookie settings" live together in the footer.

**Scope and content**
- D36. Release 1 excludes search, bundles, build your own, wishlist, reviews, accounts, quiz, gift finder, reminder club, UGC, locator map, workshops, sponsor-a-doll (section 5.2); the header search field and SearchAction are removed.
- D37. `/custom` and `/supply` reuse the enquiry form engine and ship as fast follow; `/partners` and `/wholesale` ship in release 1.
- D38. One content model under `content/`: JSON for animals, colours, faq, microcopy, deliveryAreas, facts; MDX for journal and projects; 02's `copy.ts` is replaced by a typed accessor over `microcopy.json`; the master post list is 05 §4 and 03 §8 and 04 §4 titles map to it.
- D39. Phase 3 starts by reading `node_modules/next/dist/docs/`; JSON-LD escapes `<` as `<`; `scripts/qa-copy.mjs` runs the dash, slop and TODO checks in `prebuild`; the TODO register page is preview only.
- D40. Unconfirmed facts are not used in copy until the client confirms: handles, "Founded in 2019", stockist names and venues, "Mikono means hands", "yarn lots vary", wildlife facts for Pillar A; the scaffold `app/page.tsx` and `app/layout.tsx` are replaced in Phase 3.

## 8. Questions only the client can answer (deduplicated, prioritised)

**Priority 1: blocks the data layer and Phase 3**
1. Which animals are catalogue products (the photos show lion, giraffe, elephant, rabbit, rhino, zebra, hippo, monkey, octopus, turtle, shark, butterfly, bear, unicorn, doll and more), what are their colourways and which sizes exist for each? Do you approve the colour names we derive from the photos?
2. Retail price per animal and size. Wholesale terms and MOQ for the seven stockists (never published). Cost per size if you want a pricing review.
3. WhatsApp number(s), who answers, hours, promised reply time; separate number for trade?
4. Which people and children in the photos have given permission (36 images show people, 5 show children, none are cleared)? Which makers agree to be named?
5. Dimensions in centimetres for S, M, L, XL; weight if known.

**Priority 2: blocks Phase 4 and 5 copy**
6. Safety facts: filling, eyes and noses, how "nothing detachable" is checked, any testing, recommended age. May we say "child safe" or "safe for babies"?
7. Is "25+ women supported" correct, and are they the makers? May we say "founded in 2019" and "Mikono means hands"? Are the social handles in the old page correct?
8. Delivery: zones, fees, couriers, lead times per size, pickup point, free delivery rule. International shipping yes or no? Cash on delivery yes or no? M-Pesa and bank details. Returns and exchange policy.
9. Stockists: confirm the list (including Village Market and JKIA), permission to name them, addresses.
10. Do you want custom orders, personalisation, branded corporate gifts, sample packs at launch? Can you fill 50 or more unit orders, on what lead time? Workshops or sponsor-a-doll: yes now, or later?

**Priority 3: blocks Phase 6 and 7**
11. (Charter owner) Confirm in the charter: product photography and product colour are exempt from rule 4; bento tiles are exempt from equal span.
12. Which word do you want: animals, toys, soft toys or dolls?
13. Domain, email address, GA4, Meta Pixel, TikTok Pixel, GTM IDs; hosting choice.
14. Target launch date; is a Christmas 2026 push realistic for you?
15. Legal entity name, ODPC registration status, a lawyer to review privacy, cookies and terms.
16. How should stock and prices be edited (Git form editor or Google Sheet), and who edits them?
17. Which email service for the newsletter, and who owns the lead Sheet?
18. May blog posts use general knowledge about wild animals and parenting if cited, or only facts you supply? (Pillar A and B.)

**Priority 4: later**
19. Paid media budget and who runs it; review policy; referral reward decisions; give-back percentage claim.
20. Which segment to grow first, share of revenue that is B2B today, what "super store" means.

## 9. Amendments required before re-run

- 02: apply D13 to D17, D21, D24 to D25; fix "of 7"; remove international; single storage rule; fix 3.2 template.
- 03: apply D1, D8, D9, D22, D23, D26, D31 to D33, D39; remove "child safe" from §3.1 patterns; drop the unconditional server assumptions; fix JSON-LD escape.
- 04: apply D18, D22 to D27, D36; remove "child safe" from §3.1; align stockist and handle wording; defer workshops; reduce §11 to the MVP list.
- 05: apply D1, D3, D8, D26, D38; move exempt words into the marker block; fix the content model (SKU, colour taxonomy, per variant availability); remove colour and size landing pages; hold Pillar A and B pending Q18; remove unsupported product copy claims.
- 06: apply D12, D13, D14 (stepper), D27, D29 to D35; fix the font variable cycle; rewrite test 8; add missing components (G6); rename sale tags.
- 01: fix the Village Market line, the "see 2.4" reference, the "named group" wording; mark bundles as later.

Re-assessment required after these edits, plus the manifest schema v2 and the Phase 3 Next.js doc check.
