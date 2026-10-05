# Mikono Creations: Content Strategy

Obeys `00-CHARTER.md`. Hard rules in force: no em or en dashes, no slop phrases, no invented facts, Kenya first, child first, photos of people and children only when cleared in the manifest.

**Known facts (the only facts copy may state as true):**
- Handmade crocheted stuffed animals, made by 25+ women in Nairobi.
- Recycled acrylic yarn. Zero plastic. Nothing detachable. Easy to clean.
- Safari animals and domestic animals. Sizes S, M, L, XL. Many colourways.
- Mostly B2B today (retailers, lodges, gift shops, organisations). Checkout via WhatsApp.

Everything else (prices, dimensions, filling, age guidance, wash method, delivery, certifications, dates, names, numbers) is `TODO:` until the client supplies it. Format: `TODO: <what is needed>`.

---

## 1. Editorial voice guide

**Voice in one line:** a warm Nairobi aunty who knows the craft, speaks plainly, and never oversells.

Traits: plain, specific, warm, calm, respectful of makers. Short sentences. Name the animal, colour, size and material. British spelling (colour, grey). KES for money. Parent-to-parent tone, trade-to-trade for B2B.

### 10 do

1. Name the thing. "A green elephant, size M, crocheted in recycled acrylic yarn."
2. Lead with the fact a parent cares about. "Nothing on this giraffe comes off, so there is nothing to swallow."
3. Say who made it, when known. "Made by our makers in Nairobi."
4. Use numbers only when supplied. "Made by 25+ women."
5. Mark gaps honestly. "TODO: wash temperature."
6. Write for one reader. "You can wipe it clean after snack time."
7. Use plain verbs. "Order on WhatsApp."
8. Keep Swahili sparing and correct. "Karibu" on a welcome, "Asante" on a thank-you.
9. Describe a photo as it is. "A child holding a grey elephant on a green mat."
10. End with a clear next step. "Pick a size, then send your order on WhatsApp."

### 10 do not

1. Do not use vague praise. Not "a truly special plush".
2. Do not use dashes as punctuation. Not "soft, cuddly, safe" with a long dash between clauses.
3. Do not invent proof. Not "loved by thousands of families".
4. Do not stack three adjectives as filler. Not "soft, cosy and adorable".
5. Do not pressure. Not "Only 3 left" or "Hurry".
6. Do not use exclamation marks in a row. One per page at most, usually none.
7. Do not speak for makers with made-up quotes. Quote only what is recorded and approved.
8. Do not pity. Not "helping poor women". Say what the work is and what it pays for, once known.
9. Do not overuse Swahili or cliches such as "Hakuna matata". Never guess a translation.
10. Do not claim safety standards. Not "fully tested" until a certificate is on file.

### Banned phrase list

<!-- SCAN-EXEMPT-START: this list may contain the banned words by necessity. The scanner skips this block and runs on every other file. -->
elevate, unleash, delve, tapestry, journey, seamless, in today's world, more than just, not just X it's Y, crafted with passion, game-changer, game changing, curated, bespoke (use "made to order"), cutting-edge, world-class, best-in-class, premium quality, high-quality (say what is high), magical, adorable (unless a parent said it), perfect for everyone, look no further, take it to the next level, dive into, embark, treasure trove, unlock, revolutionise, passionate about, we are proud to, nestled, vibrant (as filler), rich heritage, one-of-a-kind (unless true per piece), hand-picked, lovingly (as filler), "whether you are X or Y", "from X to Y" as a list opener, any em dash (U+2014), any en dash (U+2013).
<!-- SCAN-EXEMPT-END -->

### Sentence-level style test

Run on every sentence. A sentence fails if any answer is no.

1. Could a child's parent picture it? (Concrete noun present.)
2. Is every fact in the known-facts list, the manifest, or marked TODO?
3. Can it be said with fewer words and no loss?
4. Is there a dash character? Remove it.
5. Does it appear in the banned list? Rewrite.
6. Does it contain a claim a retailer could check and find false? Remove it.
7. Read aloud: would a Nairobi parent say it? If not, simplify.

---

## 2. Sitemap and page requirements

Every page: one H1, meta title and description, a WhatsApp CTA, breadcrumb, alt text on every image, a `TODO` register entry for each unknown.

| Page | Route | Must contain |
|---|---|---|
| Home | `/` | One-line promise (handmade in Nairobi, recycled yarn, zero plastic). Category circle row. Best sellers rail. Trust strip. Stats band using only known numbers (25+ women). Captured moments strip. Wholesale pointer. Newsletter. |
| Shop | `/shop` | Filters: animal type, size, colour. Uniform product grid. Sort. Empty state. Result count. |
| Collection pages | `/shop/safari`, `/shop/domestic`, `/shop/[colour]`, `/shop/size-[s,m,l,xl]` | Intro of 40 to 60 words, grid, link to size and colour guides, FAQ snippet of 3 questions. |
| Product pages | `/shop/[slug]` | Title, gallery matching the named animal and colour, size and colour selectors, price (TODO), safety line, care line, size line, long description, add to cart, WhatsApp order link, related animals. |
| Size guide | `/size-guide` | S, M, L, XL with measurements (TODO), photo of each beside a common object or child (if cleared), age suitability (TODO), how to choose by gift type. |
| Colour guide | `/colour-guide` | Colourway swatches from real photos, how colours vary slightly in handmade yarn lots, how to request a colour. |
| Care and cleaning | `/care` | How to clean (TODO method), drying, what to avoid, when to message us. Short, step-numbered. |
| Safety and materials | `/safety` | Recycled acrylic yarn, zero plastic, nothing detachable, easy to clean. Filling (TODO). Testing and age guidance (TODO). No claim beyond evidence. |
| Our impact | `/impact` | What recycled yarn means in plain terms, 25+ women, what the work provides (TODO specifics), no invented figures. |
| Our makers | `/makers` | Maker profiles with consent: first name, craft, favourite animal to make. Quotes only if recorded and approved. |
| Our story | `/story` | How Mikono began (TODO from client), the meaning of the name (Mikono means hands), timeline with dates marked TODO. Scrapbook style. |
| Wholesale | `/wholesale` | Who we supply (retailers, lodges, gift shops, organisations), minimum order (TODO), price list request, lead times (TODO), sample request, quote form. |
| Stockists | `/stockists` | Verified partner list only, name and town. Placeholder state: "Stockist list coming. Ask us on WhatsApp." No logos until permission. |
| Partner with us | `/partner` | Partnership types (schools, NGOs, brands, hotels), what we offer, enquiry form. |
| Supply with us | `/supply` | Who can supply (yarn, packaging, transport), requirements, enquiry form. Recycled yarn sourcing note (TODO). |
| Custom orders | `/custom` | What can be customised (colour, size, animal; confirm TODO), steps, lead time (TODO), brief form, WhatsApp link. |
| Gifting guide | `/gifts` | Picks by occasion and age, size advice, gift note option (TODO), delivery timing (TODO). |
| FAQ | `/faq` | Grouped questions from section 6, with schema.org FAQPage. |
| Delivery and returns | `/delivery` | Nairobi zones and fees (TODO), outside Nairobi (TODO), diaspora shipping (TODO), return policy (TODO), how WhatsApp checkout works. |
| Blog | `/blog` | Pillar filter, uniform post cards, featured post, newsletter. |
| Projects | `/projects` | Project cards by type, filter, year. |
| Gallery | `/gallery` | Captured moments, filtered by makers, play, products. Only cleared photos. Alt text per image. |
| Press | `/press` | Real coverage only. Empty state if none: "No press yet. Writing about us? Message us." Logo and fact sheet (TODO). |
| Contact | `/contact` | WhatsApp first, email (TODO), form, Nairobi location line (TODO), hours (TODO). |
| Legal | `/privacy`, `/terms`, `/cookies` | Privacy and consent, terms of sale, cookie settings. Drafted for client and lawyer review. TODO: legal entity name. |

---

## 3. Product copy system

| Field | Template | Limit |
|---|---|---|
| Title | `{Colour} {Animal}, size {S/M/L/XL}` | 50 characters |
| Short description | `A {colour} {animal}, crocheted by hand in Nairobi from recycled acrylic yarn. {One concrete detail.}` | 140 characters, clamps to 2 lines |
| Long description | Para 1: what it is and who it suits. Para 2: how it is made. Para 3: size and colour note. | 90 to 140 words |
| Safety line | `Zero plastic. Nothing detachable. {TODO: filling}. {TODO: age guidance}.` | 1 line |
| Care line | `Easy to clean. {TODO: method}. See care guide.` | 1 line |
| Size line | `Size {X}: about {TODO} cm tall. {Who it suits in plain words.}` | 1 line |

Rules: one concrete detail per short description (a feature of the animal, such as the mane or the ears, taken from the photo). Never claim "soft" with a comparison. Never state the maker's name unless consented.

### Worked example 1: green elephant

- **Title:** Green Elephant, size M
- **Short:** A green elephant, crocheted by hand in Nairobi from recycled acrylic yarn. Big ears, a long trunk and a calm face.
- **Long:** This green elephant is made by hand by our makers in Nairobi. It suits {TODO: age range} and sits well on a bed, a shelf or a play mat. Each stitch is crocheted from recycled acrylic yarn. There is no plastic in it, and nothing on it comes off. Size M is about {TODO} cm tall. Handmade yarn lots can differ a little, so the green may vary slightly from the photo. To choose another size, see the size guide.
- **Safety:** Zero plastic. Nothing detachable. TODO: filling material. TODO: age guidance.
- **Care:** Easy to clean. TODO: wash method. See care guide.
- **Size:** Size M: about TODO cm tall. A good size for a toddler to carry. (Confirm against size guide.)

### Worked example 2: safari giraffe

- **Title:** {Colour} Giraffe, size L
- **Short:** A {colour} giraffe, crocheted by hand in Nairobi from recycled acrylic yarn. A long neck and patched coat made stitch by stitch.
- **Long:** Giraffes are a common sight in Kenya's parks, and this one is made in Nairobi by hand. It is crocheted from recycled acrylic yarn with no plastic. Nothing is sewn on loosely, so nothing can be pulled off. Size L is about {TODO} cm tall, big enough to sit beside a child. Colour: {colour}. Order on WhatsApp and we will confirm stock. (Park claim: confirm client approves. Otherwise remove the first sentence.)
- **Safety:** Zero plastic. Nothing detachable. TODO: filling. TODO: age guidance.
- **Care:** Easy to clean. TODO: method. See care guide.
- **Size:** Size L: about TODO cm tall.

### Worked example 3: domestic animal

- **Title:** {Colour} Dog, size S
- **Short:** A {colour} dog, crocheted by hand in Nairobi from recycled acrylic yarn. Small enough for a school bag.
- **Long:** A small {colour} dog, made by hand in Nairobi from recycled acrylic yarn. It has no plastic and no parts that come off, which suits a first soft toy. Size S is about {TODO} cm tall. It is easy to clean after a day of play. Ask on WhatsApp if you want a different colour.
- **Safety:** Zero plastic. Nothing detachable. TODO: filling. TODO: age guidance.
- **Care:** Easy to clean. TODO: method. See care guide.
- **Size:** Size S: about TODO cm tall. (Check "school bag" fits once dimensions are known.)

---

## 4. Blog: 40 post ideas

Columns: working title, target reader, search intent (I = informational, C = commercial, T = transactional, N = navigational), media needed. All media must be cleared in the manifest. People photos only if cleared.

### Pillar A: Animals and wildlife of Kenya for kids

| # | Title | Reader | Intent | Media |
|---|---|---|---|---|
| 1 | Meet the Elephant: 8 Facts for Curious Kids | Parent, 3 to 8 year old | I | Photo of a crocheted elephant beside a child's hand |
| 2 | Why Giraffes Have Long Necks, Explained Simply | Parent, teacher | I | Giraffe toy against a plain wall, close-up of the patched coat |
| 3 | A Child's Guide to the Big Five | Parent planning a safari | I | Row of safari toys on a mat |
| 4 | Where to Spot Zebras in Kenya | Family travelling | I | Zebra toy, savanna-style backdrop, no stock photos |
| 5 | Farm Animals Kenyan Kids Know: A Toy Guide | Parent | I | Domestic animals grouped on a wooden surface |
| 6 | Animal Sounds in English and Swahili | Parent, teacher | I | Close-up of animals with a hand-lettered sound card |
| 7 | A Bedtime Safari Story, Told with Toys | Parent | I | Toys arranged by a bed, soft light |

### Pillar B: Parenting and play

| # | Title | Reader | Intent | Media |
|---|---|---|---|---|
| 8 | How to Pick a First Soft Toy for a Baby | New parent | C | Baby-safe composition, toy with no loose parts shown close |
| 9 | Why Nothing Detachable Matters in Soft Toys | Safety-minded parent | I | Close-up of stitched ears and eyes |
| 10 | Pretend Play Ideas with Crocheted Animals | Parent of 2 to 6 year old | I | Child playing with several animals on a mat |
| 11 | Helping a Child Settle at School with a Comfort Toy | Parent | I | Toy beside a school bag |
| 12 | Easy Ways to Clean a Child's Soft Toy | Parent | I | Hands cleaning a toy, step photos |
| 13 | Toys for a New Sibling Welcome | Parent | C | Small and large toy side by side |
| 14 | Quiet Play for Long Matatu Rides | Parent | I | Toy in a child's lap in a vehicle (cleared photo) |

### Pillar C: Sustainability and recycled yarn

| # | Title | Reader | Intent | Media |
|---|---|---|---|---|
| 15 | What Is Recycled Acrylic Yarn? | Eco-curious buyer | I | Skeins of yarn, workshop shelf |
| 16 | Zero Plastic Toys: What We Mean | Parent, retailer | I | Close-up of finished stitches |
| 17 | Where Our Yarn Comes From (TODO: sourcing) | Conscious buyer | I | Photo of yarn collection or sorting, if real |
| 18 | Why We Make Soft Toys That Last | Parent | I | Worn, loved toy, cleared photo |
| 19 | Handmade vs Factory Toys: A Fair Comparison | Buyer | C | Side-by-side stitch detail |
| 20 | Reducing Waste at Home: Kid-Friendly Ideas | Parent | I | Child sorting craft scraps |

### Pillar D: Craft and process

| # | Title | Reader | Intent | Media |
|---|---|---|---|---|
| 21 | How a Crocheted Elephant Is Made, Step by Step | Curious buyer, crafter | I | Sequence of process photos from makers' hands |
| 22 | Amigurumi vs Crochet Toys: What Is the Difference? (TODO: confirm technique term) | Crafter | I | Close-ups of stitches |
| 23 | Why Colours Differ Slightly Between Toys | Buyer | I | Two toys of the same colour in daylight |
| 24 | The Tools on a Maker's Table | Crafter | I | Flat-lay of hooks and yarn |
| 25 | How Long Does One Toy Take? (TODO: timing) | Buyer | I | Maker mid-work, cleared photo |
| 26 | Behind a New Animal Design: A Diary | Follower | I | Sketch, prototype, final toy |

### Pillar E: Makers and impact

| # | Title | Reader | Intent | Media |
|---|---|---|---|---|
| 27 | Meet the Women Behind Mikono | Buyer, press | I | Group photo (cleared), makers at work |
| 28 | What Mikono Means | Curious reader | I | Hands crocheting, close-up |
| 29 | A Day in the Workshop | Follower | I | Sequence from morning set-up to packing |
| 30 | How the 25+ Makers Work Together (TODO: model) | Partner | I | Group at a table |

### Pillar F: Gifting and occasions

| # | Title | Reader | Intent | Media |
|---|---|---|---|---|
| 31 | Baby Shower Gift Ideas from Nairobi | Gifter | C | Toys wrapped, simple box |
| 32 | Birthday Gifts for a 3 Year Old | Gifter | C | Child with toy at party (cleared) |
| 33 | Gifts for Kenyan Children Abroad | Diaspora buyer | T | Packed parcel, toy in hand |
| 34 | Christmas Gifts for Children (TODO: dates and delivery) | Gifter | C | Toy by a tree, no lights glare |
| 35 | Choosing a Size for a Gift | Gifter | I | S to XL lined up with a ruler |

### Pillar G: Business and partnerships

| # | Title | Reader | Intent | Media |
|---|---|---|---|---|
| 36 | Stocking Handmade Toys in a Gift Shop | Retailer | C | Shelf with toys |
| 37 | Souvenirs for Lodges and Hotels | Lodge manager | C | Toys in a lodge room |
| 38 | How to Order Wholesale from Mikono | Retailer | T | Packed carton, tags |
| 39 | Corporate and NGO Gifts for Children | Organisation | C | Group of toys ready for donation |
| 40 | Custom Colours for Brands and Events | Event planner | T | Colour swatches beside toys |

---

## 5. Projects section

**Project page structure:** (1) Title and one-line summary. (2) Facts strip: date, place, partner, status (TODO each). (3) What we did, in 3 short paragraphs. (4) Photo collage, cleared only, polaroid frames with descriptive captions. (5) Who took part, with consent. (6) What we learned, honest. (7) Numbers, only if supplied. (8) Next step: join, donate, partner, WhatsApp link. (9) Related projects.

| # | Concept | Type | Note |
|---|---|---|---|
| 1 | Community crochet workshop | Workshop | Makers teach beginners |
| 2 | School visit with animal storytime | School | Toys, stories, questions |
| 3 | Donation drive for children's homes | Donation | Partner name TODO |
| 4 | Lodge collaboration: souvenir range | Collaboration | Partner TODO |
| 5 | New animal design diary | Design | Sketch to finished toy |
| 6 | Yarn recycling collection day | Sustainability | What was collected (TODO) |
| 7 | Maker skills training | Training | Curriculum TODO |
| 8 | Hospital ward toy gift | Donation | Consent required |
| 9 | Artist or illustrator collaboration | Collaboration | Credit and permission |
| 10 | Pop-up at a Nairobi market | Event | Dates TODO |
| 11 | Colourway of the season | Design | Why a colour was chosen |
| 12 | Children draw an animal, makers crochet it | School | Child consent, parent sign-off |

---

## 6. FAQ bank

Answers use only known facts. TODO means client input needed.

**About the toys**
1. What are the toys made from? Recycled acrylic yarn.
2. Is there any plastic? No. They are zero plastic.
3. Can parts come off? No. Nothing is detachable.
4. What is the filling? TODO: filling material.
5. Are they safe for babies? TODO: age guidance and test evidence. We will not claim more than we can prove.
6. Which animals do you make? Safari and domestic animals. TODO: current list.
7. What sizes are there? S, M, L and XL. TODO: measurements.
8. What colours are there? Many colourways. See the colour guide.
9. Will my toy match the photo exactly? Handmade yarn lots can vary slightly. TODO: confirm tolerance.
10. Are the toys washable? They are easy to clean. TODO: method.

**Care**
11. How do I clean it? See the care guide. TODO: steps.
12. Can it go in a washing machine? TODO.
13. How should I dry it? TODO.
14. What if it gets stained? Message us on WhatsApp. TODO: advice.

**Ordering**
15. How do I order? Add to cart, fill in the order form, and your order is sent to us on WhatsApp.
16. Do I pay on the website? No. Checkout is on WhatsApp. TODO: payment methods.
17. What are the prices? TODO: prices in KES.
18. Do you have stock? We confirm on WhatsApp. No stock counts are shown online.
19. Can I order a custom colour? Ask us. TODO: confirm limits.
20. Can I order a custom animal? TODO.
21. Can I add a gift note? TODO.
22. Can I change my order? Message us on WhatsApp. TODO: cut-off.

**Delivery and returns**
23. Do you deliver in Nairobi? TODO: zones and fees.
24. Do you deliver outside Nairobi? TODO.
25. Do you ship abroad? TODO.
26. How long does delivery take? TODO.
27. Can I return a toy? TODO: policy.
28. What if the toy arrives damaged? Message us on WhatsApp with a photo. TODO: remedy.

**Makers and impact**
29. Who makes the toys? Over 25 women in Nairobi.
30. Are the makers paid fairly? TODO: client statement. We will not claim this unprompted.
31. Where is the workshop? Nairobi. TODO: public address policy.
32. Can I visit? TODO.
33. Where does the yarn come from? Recycled acrylic. TODO: sourcing detail.

**Trade**
34. Do you sell wholesale? Yes. Many of our customers are retailers, lodges, gift shops and organisations.
35. What is the minimum order? TODO.
36. Can I get a price list? Send a request on the wholesale page. TODO: process.
37. Can you brand toys for my business? TODO.
38. Where can I buy in a shop? See the stockists page. TODO: list.
39. How long do bulk orders take? TODO.
40. Do you donate or partner with schools and NGOs? See the partner page. TODO: policy.

---

## 7. Microcopy library

**Buttons:** Add to cart. View cart. Order on WhatsApp. Send my order. Choose a size. Choose a colour. See size guide. Ask a question. Request wholesale prices. Get a quote. Subscribe. Read the story. Back to shop.

**Empty states**
- Cart: "Your cart is empty. Pick an animal to start."
- Search: "Nothing matches that. Try fewer words or browse all animals."
- Filter: "No toys in that colour and size right now. Ask us on WhatsApp, we may be able to make one."
- Stockists: "Stockist list coming. Ask us on WhatsApp."
- Press: "No press yet. Writing about us? Message us."
- Blog category: "No posts here yet."

**Errors** (calm, no blame): "Please add your name so we know who to greet." "That phone number looks short. Check it and try again." "Something went wrong on our side. Your cart is saved. Try again, or message us on WhatsApp." "Pole, that page is not here. Go back to the shop."

**Wizard step titles:** 1 Your animals. 2 Sizes and colours. 3 Who is it for. 4 Delivery details. 5 Gift note (optional). 6 Check and send. Confirmation: "Asante. Your order is ready to send on WhatsApp."

**Trust strip lines:** Handmade in Nairobi. Recycled acrylic yarn. Zero plastic. Nothing detachable. Easy to clean. Made by 25+ women.

---

## 8. Kinetic-typography headline set (scrapbook sections)

Short, bouncy, each word can animate on its own. CSS only, reduced-motion safe.

- Made by hand.
- Stitch by stitch.
- Karibu.
- Meet the makers.
- Hands at work.
- Yarn finds a new life.
- One loop at a time.
- Zero plastic.
- Small hands, big hugs. (Use only with a cleared child photo.)
- Our workshop, Nairobi.
- Pick your animal.
- Asante sana.

---

## 9. Production workflow and copy QA

**Workflow:** (1) Brief: pillar, reader, intent, media needed. (2) Facts check against the known-facts list, flag TODOs. (3) Draft in the content file (section 10). (4) Style test, section 1. (5) Media match: every image has a manifest ID, confidence and privacy status "cleared". (6) Mechanical QA below. (7) Client review for facts and people. (8) Publish by setting `status: published`. (9) Log in the TODO register.

**Mechanical checklist.** Run on all `content/`, `app/`, `data/` files, alt text and metadata. Skip the marked exempt block in this file.

| Check | Command or rule | Pass |
|---|---|---|
| Em and en dash | `grep -rnP "\x{2014}\|\x{2013}" content app data` | 0 hits |
| Spaced hyphen as dash | `grep -rn " - " content` | 0 hits in prose |
| Slop phrases | `grep -rniE "elevate\|unleash\|delve\|tapestry\|journey\|seamless\|game.?chang\|crafted with passion\|more than just\|in today's world" content app data` | 0 hits |
| Exclamation spam | more than 1 "!" per page | 0 |
| Digit claim | every number in copy exists in the facts file or in `data/facts.ts` | all traced |
| Superlative | grep "best\|finest\|most\|amazing\|incredible" | each justified or removed |
| Fake social proof | grep "reviews\|rated\|customers love\|bestseller" with no data source | 0 |
| TODO register | `grep -rn "TODO:"` output matches the open-inputs list | listed, none shipped in a live claim |
| Media match | image filename, product title, colour and alt text agree via manifest | 100% |
| Privacy | every people photo has `cleared: true` | 100% |
| Swahili | each Swahili word is in the approved list: Karibu, Asante, Asante sana, Pole, Mikono | 100% |
| Reading level | short sentences, no sentence over 25 words | pass |

Verifier output: table with check, result, evidence, severity, saved to `strategy/gates/`.

---

## 10. Scalability: content model

Typed content, no developer needed for routine additions.

- **Animals and products:** one JSON or MDX file per animal in `content/animals/`. Fields: `slug`, `name`, `type` (safari or domestic), `sizes[]` (each with `size`, `heightCm` or `TODO`, `priceKes` or `TODO`), `colourways[]` (each with `colour`, `imageId`), `shortDescription`, `longDescription`, `status` (draft or published). A shared schema (TypeScript type plus Zod validation) rejects missing fields and flags TODO values.
- **Blog:** MDX in `content/blog/`. Frontmatter: `title`, `slug`, `pillar`, `reader`, `intent`, `date`, `imageIds[]`, `status`, `excerpt` (max 160 characters).
- **Projects:** MDX in `content/projects/`. Frontmatter: `title`, `type`, `date`, `place`, `partner`, `imageIds[]`, `status`, `consent: true`.
- **FAQ and microcopy:** one JSON file each, so edits never touch components.
- **Media:** images referenced by manifest ID. The build resolves ID to optimised file, alt text and privacy status. A missing or uncleared ID fails the build.
- **Adding an animal:** copy the template file, fill fields, add photos to the manifest, commit. The collection, filters, sitemap and schema.org update automatically.
- **Client editing:** start with a plain form tool or Git-based CMS (for example Decap or Keystatic, TODO: client choice) writing to the same files, so the client works in forms, not code.
- **Guardrails in the build:** schema validation, the QA grep checks from section 9 as a pre-build script, a generated TODO register page for the team only, and a refusal to publish any item with `status: draft` or unresolved price TODO on a live product.
