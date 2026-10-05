# 08 Business Audit: from 3 to 7, and the road to a super store

Date: 2026-10-02. Author: business strategy review. Scope: live site https://mikono-creations.vercel.app, charter 00, build decisions 07, business model 01. Where this file differs from 07 on purpose, it says so and the owner must rule.

## 0. One-page answer

**Diagnosis.** The site is clean, consistent and honest, and it is quiet. The owner's 3 out of 10 for energy is fair. The cause is not the palette or the layout. The cause is that nothing on the site responds to the visitor, nothing moves with intent, every product card is the same pose on the same tile, and the most emotional assets (the makers, the lion mane, the giraffe herd) sit lower on the page than the polite filler. We built a store that is safe to publish. We have not yet built a store a child wants to poke at.

**What 7 out of 10 means here.** Not neon, not a game. It means: a hero that shows hands and animals doing something, motion that rewards scrolling and tapping, product pages where choosing a colour changes the animal on screen, a custom order that feels like building something, and real proof (real photos, real outlets, real makers) placed where the buyer decides. All of it inside the earthy palette and the no-dark-pattern rules. The owner's rulings stand.

**Where to compete.** Kenyan parents and gifters first, shops and lodges second (keep the base), corporate and custom third. Not a marketplace yet.

**How to win.** One-brand depth that no plush maker does well: every animal in every real colourway, size shown side by side, the maker visible, a custom brief that is as easy as a message. Jellycat wins on character and scarcity, Build-A-Bear wins on making, Cuddle and Kind wins on a single impact sentence. Mikono can hold all three if it stays specific.

**What we deprioritise.** Card payments in sprint 1 and 2, accounts, reviews, subscriptions, third-party products. A real "super store" comes after fulfilment is proven (section 4).

**The biggest risk.** Not design. It is `pricesConfirmed = false`. Every card says "Ask for price", the cart button is disabled until options are chosen, and the checkout is a message. A store with no prices scores low on conversion and trust no matter how it looks. The owner holds the unlock (section 6).

## 1. What I saw on the live site

Screenshots taken at 390 and 1440 wide for home, shop, giraffe product page, journal and story. Facts below are from those screenshots and page measurements.

- **Home** is about 9,200 px tall at 390 and 7,500 px at 1440, 33 images, about 600 words, 74 links and buttons. Order: hero with a maker holding a lion head in a blob mask, trust chips, category circles, a featured rail, a bento of "more ways", a dark green "Why families choose Mikono" band, "How ordering works" three cards, a dark brown "Mikono means hands" band, "Captured moments" polaroids, seven outlets, footer.
- **Hero**: strong photograph, calm headline ("Crocheted animals, made by hand in Nairobi"), two buttons. Nothing moves. The maker's face is the best asset on the page and it is a static circle.
- **Featured animals**: uniform cards, each with "N colours", four size dots, "Ask for price", "Choose size". Four controls repeat on every card. On mobile the rail clips the second card and the size dots, which feels cramped.
- **Shop** (24 pieces): a two-column grid on mobile, 26 images, 90 links and buttons. It is orderly. Every card carries the same four stacked controls, so a scan of the page reads as a wall of buttons ("Ask for price", "Choose size" 24 times).
- **Product page (giraffe)**: good bones. Colour swatches use photo crops, size selector, relative-size note, thumbnails, trust cards. Weak points: the price is "Ask for price", the add button is faded until options are chosen, the gallery has three thumbnails, and nothing shows scale or personality. The photo is a tight head crop of one giraffe, so the page does not show the animal whole.
- **Journal**: eight posts, uniform cards, one featured post with a polaroid. Neat. Every post is "2 min read", which tells a reader these are thin. Photos are used well. It reads as a catalogue of notes, not a magazine.
- **Story**: the best page for feeling. Taped polaroids, handwriting font, "Hands at work" strip. It also says outright "The longer story ... is not on this page yet", which is honest and also a gap: the founder's voice is the single most valuable asset on the site and it is missing.
- **Mobile**: the consent bar sits over the first screen of every page until answered, which pushes content down. Touch targets are large. Headings are readable. There is no bottom bar with cart or WhatsApp that stays within reach. (Not verified whether the WhatsApp float hides by design under rule D34.)

## 2. Benchmarks: what makes the best feel alive

I fetched or searched each. "Verified" means I read it in a result this session. Several big retail sites blocked automated fetch (403), so those claims come from search summaries and are marked.

| # | Brand | What it does that feels alive | What converts | Source | Status |
|---|---|---|---|---|---|
| 1 | Jellycat | Treats each plush as a character with a name and a book. New designs arrive in limited runs ("Jelly Drops") and older ones retire; the site shows retired designs. Brand story is "Born in London. Loved worldwide." | Scarcity by retirement, collectability, books and soft toys sold as a pair | https://www.jellycat.com/our-story , https://www.jellycat.com/story-books/ | Search summary verified; site itself blocked fetch (403) |
| 2 | Build-A-Bear | Online flow is steps: choose a furry friend, clothes and shoes, sounds and scents, accessories; virtual try-on of outfits on a model; record your voice into the animal; optional stuffing level; a named birth certificate | The buyer makes it, so price pressure drops and the gift becomes personal. Add-ons raise basket size | https://www.buildabear.com/on/demandware.store/Sites-buildabear-us-Site/default/BearBuilder-Show?step=chooseFriends | Search summary verified; site blocked fetch |
| 3 | Etsy custom orders | A "Request Custom Order" button on the shop page; the buyer writes what they want and the date needed; the seller converts the thread into a private listing at an agreed price. Max processing time 6 to 8 weeks | A familiar, low-friction brief, then a single payable item. Removes quote back-and-forth | https://help.etsy.com/hc/en-gb/articles/115015440167-How-to-Request-a-Personalised-or-Custom-Item | Search summary verified |
| 4 | Cuddle and Kind | One sentence carries the impact: "1 hand-knit doll = 10 meals". Offers a second-doll saving, free shipping threshold, money-back guarantee at checkout | A single measurable impact line plus a basket nudge | https://www.cuddleandkind.com/ | Fetched and verified. Maker biographies were not visible in the fetched content |
| 5 | Lovevery | Age-stage play kits delivered every 2 to 3 months, a play guide, a podcast, an app, hundreds of hours of play studies cited for safety | Subscription plus authority content. Optional child birth date on signup personalises content | https://www.lovevery.com/ | Fetched and verified. Claims are Lovevery's own and not independently checked |
| 6 | Pottery Barn Kids | Monogram or name on blankets, baskets and keepsakes (US$17 per item at time of search), registry with checklist and thank-you organiser, gift ideas | Personalisation as a paid upgrade, registry as repeat gifting | https://www.potterybarnkids.com/pages/personalization-guide.html | Search summary verified. Price is a snapshot and may have changed |
| 7 | Mary Meyer | Retailer locator ("Find Mary Meyer near you"), wholesale info page with application, sales reps, international distributors page, listed on the Faire wholesale marketplace | A clear B2B route that does not interrupt retail | https://marymeyer.com/store-locator/ , https://marymeyer.com/wholesale-info/ | Search summary verified |
| 10 | Kazuri (Nairobi) | Ceramic beads made by hand since 1975, over 400 women employed, mostly single mothers, a factory visit and shop that tourists already travel to | Local proof at scale; the factory tour is the marketing | https://www.tripadvisor.com/Attraction_Review-g294207-d2011471-Reviews-Kazuri_Beads_Factory-Nairobi.html , website reported as kazuribeads.com | Tripadvisor figures are visitor-reported. Verify before citing to anyone |
| 11 | The Kikoy Co. and KikoRomeo (Nairobi) | Hand finishing by a women's group (Kikoy Co.); hand-dyed fabric made at a Nairobi workshop (KikoRomeo). Both lead with who makes it and where | Local, named, ethical story as the first line | https://kikoy.com/ , https://kikoromeo.com/ | Search summaries only. I did not open the stores, so I cannot comment on their checkout |
| 12 | Safaricom Daraja / Pesapal | Not a brand site. It is the payment layer: STK Push prompts the M-Pesa PIN on the customer's phone and confirms instantly; Pesapal, DPO and IntaSend wrap M-Pesa, Airtel Money and cards. Shopify Payments is not available in Kenya | M-Pesa is reported at about 65% of Kenyan ecommerce payments (a vendor blog claim, not verified) | https://paybillke.com/guides/daraja-api-mpesa-integration , https://truehost.co.ke/shopify-payments-in-kenya/ | Vendor blogs, treat figures as indicative |

Brands I tried and could not verify: Kiko+ (the domain I tried did not resolve and the search found no match, so I cannot say what it does). I make no claim about it. Headspace kids and Mailchimp were not fetched. I name Mailchimp only as a general anti-design example from a trends article (https://www.figma.com/resource-library/web-design-trends/), and I would not copy it.

**Patterns that matter for Mikono, in order of value.**

1. **Make it personal and make the buyer part of it** (Build-A-Bear, Pottery Barn Kids, Etsy). The most energy per pound is a custom brief that feels like choosing, not filling in a form.
2. **One impact sentence, backed by a number the client can defend** (Cuddle and Kind). Mikono has "25+ women supported". It has no per-doll figure and must not invent one.
3. **Characters, not SKUs** (Jellycat). The site calls every animal "Giraffe" plus a colour. A name, a one-line trait and a size family would give the animals life. Names are the client's to give (section 6).

## 3. Honest scorecard

Scale: 1 is absent, 5 is competent, 7 is strong for this niche, 10 is world class. Scores are for the live site today, not for what is in the repository plans.

| Dimension | Score | Evidence | Top fix |
|---|---|---|---|
| Futurism and immersion | 2 | No scroll-linked motion, no animated hero, no 3D or parallax, only a CSS kinetic heading on story pages. Every section is a flat band | Add three immersive moments, all reduced-motion safe: the hero hands scene, a scroll-through "from yarn to animal" strip, a size-ladder that grows as you scroll |
| Content depth | 4 | Eight journal posts at about two minutes each, 24 products, FAQ, care, size, delivery pages. Founder story missing by design | Record and publish the founder's voice (audio or short video) and one long maker feature |
| CTA density and conversion design | 3 | Home has 74 links and buttons. Shop cards repeat four controls 24 times. No price, so the main action is "Ask for price". Add button looks disabled until options are chosen | One primary action per card ("See this animal"), one sticky bottom action on mobile, and a visible "Add to order list" that works on first tap |
| Mobile feel | 4 | Large touch targets, clear type, but the consent bar covers the first screen, the featured rail clips, there is no persistent bottom bar | Move consent to a slim bottom sheet that does not cover the hero, add a sticky "Order list" bar |
| Trust | 6 | Real outlets named, real photos, four plain claims, honest "not on this page yet" notices, safety page, no fake reviews. Stronger than most competitors | Show the outlets and the maker photos on the product page, not only home |
| Custom order capability | 3 | `/custom` exists as an enquiry form (4,400 px tall at mobile, 3 images, about 290 words) and shares the form engine | Rebuild as a four-step "make it yours" builder: animal, colour, size, note and reference photo. Output a clean WhatsApp brief |
| Scalability of content model and catalogue | 4 | Typed local JSON and TypeScript, a generated catalogue file, variants as colourway times size, SKU rule D4. Editing needs a developer. No inventory field beyond availability states | Keep the model, add a small admin (section 4 stage 1) so the client can edit availability and add products |
| B2B pathway | 5 | `/wholesale`, `/partners`, `/supply`, `/stockists`, quote form with request types, no public wholesale price (D20) | Add a downloadable sample pack request and a stockist locator, and a one-page line sheet sent by a person |
| Brand storytelling | 5 | Story page is the best page. Name meaning, hands at work, outlets. Founder narrative absent. Journal is neat but dry | Lead with people. Put maker photos and one real sentence from a maker on home and product pages (names only when supplied, R8) |
| Playfulness | 3 | Taped polaroids and a handwriting font on story pages; everywhere else the tone is calm and uniform | Name the animals, add small interactions (hover wiggle, size growth, colourway swap), and loosen the shop grid into a few bento hero tiles |

**Overall.** Average 3.9. The owner's 3 for energy is right, because energy is the combined effect of rows 1, 3, 4 and 10, which score 2 to 3. The site is stronger on trust and structure than on feeling.

## 4. Scalability assessment

### 4.1 Where the current build stands

Strong: typed content, one colour taxonomy file, variant SKU convention, availability states, no stock counts, no server dependency, fast static pages, tracking slots ready. It is a good base for roughly 30 to 60 products.

Weak: nothing writes data. Every product, price and availability change needs a code change and a deploy. Orders live only in WhatsApp threads and a `localStorage` summary. There is no search (excluded by D36), no accounts, no reviews, one language, one currency.

### 4.2 Catalogue growth

Mikono has 24 pieces today. With 5 to 10 colourways and 4 sizes, a few hundred variants is plausible at 60 to 80 products, and hundreds of animals only if Mikono adds lines. Handmade supply caps what is real, so the catalogue should grow by colourway and by made-to-order before it grows by species.

- **Up to about 100 products**: keep JSON in the repo, add filter by colour, size and availability. Generate pages statically. Cost is build time, not runtime.
- **100 to 500**: move product data to a database or headless CMS, keep static generation with incremental revalidation, add search (a hosted search service, vendor to be chosen), add pagination (D33 already moves to Load more above 48).
- **Colourways at scale**: store one colour taxonomy (exists), one image set per colourway, and generate swatches from photo crops. Add a "similar colourways" strip on the product page so customers find an alternative if one is made-to-order.
### 4.3 When to add a CMS

Add one when a trigger below is true, not before.

| Trigger | Why |
|---|---|
| Client changes availability or adds a colourway more than about 3 times a week | Developer in the loop is now the bottleneck |
| Products pass about 60 or journal posts pass about 25 | Typed files become hard to review |
| A non-technical editor (not the developer) must publish journal and projects | MDX in the repo does not suit them |

Recommended shape: a headless CMS for content (journal, projects, FAQ, makers) and a small database for catalogue and orders. Candidate tools are for the client and developer to choose after a short trial; I have not verified any vendor's current pricing, so no cost is stated.

### 4.4 Staged roadmap

Effort is in developer days for one experienced developer (rough, to be checked in sprint planning).

| Stage | Capability | Trigger to start | Effort | Notes |
|---|---|---|---|---|
| 0. Now | Static catalogue, WhatsApp orders, forms to WhatsApp | Launched | Done | Prices unconfirmed (R7) |
| 1. Light admin and order record | A simple admin for availability, price and colourway edits. Orders saved to a database or sheet with the `MK-YYMMDD-XXXX` ref. Email or WhatsApp template for confirmation | 20 or more orders a week by hand, or the first lost or double-sold order | 8 to 12 days | Needs the client to own a sheet or database account (D18) |
| 2. Payments | M-Pesa STK Push through Daraja directly, or a Kenyan aggregator for M-Pesa plus cards. Order status page | Prices confirmed, a registered till or paybill, order record working | 8 to 15 days plus the payment account approval time (client side, unknown) | Daraja gives control and lower fees. An aggregator such as Pesapal gives cards faster. Decide by the client's bank and appetite for compliance work. Card payments need a gateway that supports Kenyan merchants; Shopify Payments does not (https://truehost.co.ke/shopify-payments-in-kenya/) |
| 3. Inventory and fulfilment | Per-variant counts kept internally (never shown, D10), made-to-order lead times, dispatch status, courier labels | Two or more people fulfilling, or stock held for more than 10 variants | 8 to 12 days | Keep public text to availability states only |
| 4. CMS | Headless CMS for content | Triggers in 4.3 | 6 to 10 days | After stage 1 so content and data are separated cleanly |
| 5. Accounts and reorder | Customer accounts, saved addresses, order history. Wholesale portal with tiered prices and reorder | 50 or more repeat B2B orders a quarter, or stockists ask for it | 15 to 25 days | Wholesale prices stay hidden until a person verifies the buyer (D20) |
| 6. Reviews | Verified reviews tied to an order ref | Orders flowing through stage 1, and at least 30 delivered orders | 4 to 6 days | No fake or imported reviews (rule 3). Do not ask children for reviews |
| 7. Internationalisation and multi-currency | Swahili for key pages, USD and GBP display for diaspora, international shipping rules | Diaspora orders at least 10 percent of enquiries, and shipping partner confirmed | 10 to 20 days | KES stays the charge currency until a gateway supports multi-currency settlement for this merchant (not verified) |
| 8. Workshops and kits | Bookable workshops, DIY crochet kits | Capacity proven and the client wants it. Maker time is the limit | 8 to 14 days | Kits can pull makers away from production, as 01 notes |
| 9. Clubs or subscriptions | A seasonal "new colourway" drop list first, subscription only after | Repeat buyer rate shown in stage 1 data | 6 to 10 days | Start with a plain opt-in list, not auto-billing. No dark patterns |
| 10. Marketplace or super store | Third-party makers or products | Fulfilment, returns and supplier vetting proven for 6 months | 30 or more days | Defer. A thin multi-brand store is worse than a deep single-brand one (01 section 0) |

## 5. Plan: from 3 to 7 in two sprints

Assumes a two-week sprint, one developer plus part-time design, and the palette and copy rules unchanged. Effort in developer days. Risk is the risk of harming trust, speed or accessibility.

| # | Change | Sprint | Effort | Risk | Why it moves the score |
|---|---|---|---|---|---|
| 1 | Unlock prices: apply the owner's price list, flip `pricesConfirmed`, show "From KES x" and add-to-order on first tap | 1 | 1 | Low (data) | Biggest conversion and trust gain. Without it the shop is a catalogue |
| 2 | Hero scene: animate the maker photo (slow breathe, floating blobs), replace the static circle with a layered scene of hands, yarn and animals, all reduced-motion safe | 1 | 3 | Low | Fixes the first five seconds, which set the energy score |
| 3 | Scroll-linked "yarn to animal" strip: five real photos (pieces, mane, parts, finished, shelf) that advance as you scroll, using CSS scroll animation with a static fallback | 1 | 3 | Medium (performance) | The strongest immersive moment, and it uses photos the client already has |
| 4 | Product card diet: one image, name, colour line, one price line and one button. Move size dots and "Ask on WhatsApp" to the product page | 1 | 2 | Low | Cuts button noise by about three quarters on the shop page; keeps card uniformity (R4) |
| 5 | Product page redesign: whole-animal hero image, colourway swap that changes the image instantly, a size ladder graphic that shows relative size, thumbnails for all colourways, sticky mobile order bar | 1 | 5 | Medium | Makes choosing feel like playing, and lifts conversion |
| 6 | Mobile bottom bar: Home, Shop, Order list (count), WhatsApp; consent bar moves to a slim sheet below the hero | 1 | 2 | Low | Improves mobile feel and one-hand use. Must respect D34 rules |
| 7 | Name the animals: a character name and one plain line of trait per species (client supplies, section 6) | 1 | 1 | Low | Gives Jellycat-style personality without inventing facts |
| 8 | Custom order builder at `/custom`: four steps (animal, colour and size, name or note, reference photo by WhatsApp), live summary, ends in a structured WhatsApp brief. Include an optional "name on a tag" only if the client confirms it is feasible | 2 | 5 | Medium | Biggest differentiator and a direct B2B and gift driver |
| 9 | Maker feature: real photos and one real sentence per maker on home and the product page, plus a longer "Meet a maker" page. Names only if supplied (R8) | 2 | 3 | Medium (consent and facts) | Most emotional asset; trust and story |
| 10 | Founder story: recorded voice (audio or video) replaces the "not on this page yet" notice | 2 | 2 | Medium (depends on the client) | Fills the biggest content gap on the site |
| 11 | Home reorder: hero, one rail of featured animals with larger cards, the yarn-to-animal strip, makers, trust band, outlets. Drop the duplicate category row below the fold, keep the shop filter | 2 | 3 | Low | Shortens the home page from about 9,200 px at mobile and puts feeling above explanation |
| 12 | Micro-interactions: hover and tap wiggle on animal cards, size-dot growth, cart button bounce, toast confirmation, all `prefers-reduced-motion` safe, no sound | 2 | 3 | Low | Cheap playfulness, with no pressure tactics |
| 13 | Journal upgrade: three longer posts (one maker interview, one how-it-is-made with photo sequence, one size and colour guide) and a featured post slot with a real lead image | 2 | 4 plus writing | Medium (R8 limits claims) | Content depth from 4 toward 6 |
| 14 | Stockist locator and sample pack path on `/wholesale` and `/stockists`: map or list of the seven named outlets, a "request a sample pack" request type | 2 | 3 | Low | B2B from 5 to 7. Price list still sent by a person (D20) |
| 15 | Order record (stage 1 core): save each WhatsApp order summary to a sheet or database with the `MK-` ref and source, so the client can see volume | 2 | 4 | Medium (data rules D16 and D18) | Enables every payment and inventory decision later |

Total: about 44 developer days, so the list over-fills two sprints for one developer. Realistic cut for two sprints with one developer: items 1, 2, 4, 5, 6, 7 in sprint 1 (about 14 days) and items 8, 9, 11, 12 in sprint 2 (about 14 days), with items 3, 10, 13, 14 and 15 as stretch or sprint 3. The ones that move the energy score most per day are 2, 3, 5, 8 and 12. If the team is two developers, run all 15.

**Expected result.** Average moves from 3.9 to about 6.0 (immersion 2 to 6, conversion 3 to 6, custom orders 3 to 6, playfulness 3 to 6, storytelling 5 to 7). That is 6, not 7. The last point needs the founder story, real prices, maker content and payments, which depend on the owner more than on code.

**What we deliberately do not do in these two sprints.** No sale tags, countdowns, popups, or bright accent colours. No search, wishlist, quiz or accounts (D36 stands). No payments integration. No claims about safety or age.

## 6. Questions only the owner can answer

Grouped by what each unlocks. The first five block sprint 1.

**Prices and money**
1. What are the retail prices by size (S, M, L, XL) and any species that cost more? Are they the same for every colourway?
2. Which payment methods do you already hold: M-Pesa till or paybill, a business bank account, anything for cards? Who would sign up with Daraja or an aggregator?
3. What are the wholesale terms your seven outlets already hold, so we do not undercut them? (This stays off the public site.)

**Capacity and stock**
4. How many animals can the 25+ women make in a week, and what is the usual lead time for S, M, L and XL?
5. Which colourways are made to order and which are ready to ship? Who updates this weekly?
6. Is there a minimum order for shops, hotels and corporates, and a maximum you can deliver by a date?

**Custom orders**
7. Which customisations are possible: a name tag or stitched name, a custom colour, a likeness of a pet or mascot, logos for corporates? What does each cost and add in days?
8. Do you want deposits for custom work, and what percentage?

**Names and voice**
9. May we give each animal a name and one line of personality? Do you want to choose the names or have us propose some for approval?
10. Will you record the founder story (voice or video), and which maker or makers have agreed to be named and photographed?
11. Is it "animals", "toys" or "dolls" in the main words (D3 and R10 say animals)?

**Proof and trust**
12. What evidence exists for zero plastic and nothing detachable: material lists, a pull test, a wash test? Has any toy-safety test been done? Until yes, the banned claims stay banned (R9).
13. Is there a figure you can defend for impact: animals made since 2019, women employed full time, yarn kilograms recycled, fair-pay policy?

**Delivery and reach**
14. What are the Nairobi delivery zones and fees, and who delivers? Will you ship to other Kenyan towns, and abroad for diaspora gifts?
15. Do you want to sell abroad (wholesale or retail) and are you ready for export paperwork?

**Direction**
16. Is a "super store" for you a bigger Mikono range, or other makers' products? My advice is to stay single-brand until stage 10 triggers (section 4).
17. Workshops, kits, clubs: do you want any of these, and does it take makers away from production?
18. Photography: can you produce a consistent photo set (whole animal, side, back, size row) for every colourway? This is the bottleneck for catalogue growth.

## 7. Verification notes

Jellycat, Build-A-Bear, Etsy and Pottery Barn Kids pages returned 403 to direct fetch, so those rows rely on search summaries. Kiko+ could not be found. Mailchimp and Headspace kids were not opened. Vendor blog figures (M-Pesa share, Shopify Plus pricing) are unchecked. Developer effort figures are my estimates.
