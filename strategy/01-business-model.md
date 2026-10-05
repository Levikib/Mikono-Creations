# 01 Business Model and B2B/B2C Funnel

Status: Phase 2 report. Obeys `00-CHARTER.md`. Anything not in the client brief is marked TODO or written as a placeholder in square brackets. No figure in this document is a client fact unless it says so.

## 0. One-page summary

**Where to compete.** Mikono sells handmade crocheted animals made from recycled acrylic yarn in Nairobi. Today the money comes from stockists. The site should keep that base and add a second, higher-margin line: direct sales to Kenyan parents and gifters, diaspora buyers and corporate gift buyers.

**How to win.** Three facts that rivals on the shelf next to Mikono cannot easily copy: nothing detachable, zero plastic, and a named group of 25+ women makers. Safety and impact are the reasons to buy. The range (safari and domestic animals, four sizes, several colourways) is what makes the choice easy.

**What to prioritise.**
1. A clean retail shop that converts through WhatsApp.
2. A separate, visible trade path with a quote form, so stockists never have to read retail copy.
3. Bundles and gift sets, because they raise basket size without raising production complexity.
4. Corporate and custom orders as the second revenue engine.

**What we deprioritise for now.** Card payments, marketplace listings, international retail shipping, licensing, and a full "super store" with non-Mikono products. The "super store on the net" goal is kept as a roadmap stage, not a launch scope. A store full of one brand's animals, done well, beats a thin store of everything.

**The key assumption that must be tested.** That retail buyers will pay a retail price above the wholesale price by enough to cover delivery and handling. Mikono has not supplied its prices or costs (TODO), so this is unproven.

**The main structural risk.** Handmade capacity. 25+ women working by hand cannot absorb a sudden retail spike or a large corporate order without lead times. The catalogue must therefore show honest stock status and lead times from day one.

## 1. Value proposition by segment

Each row states the buyer, the job they hire the animal for, the Mikono proof, and the main objection.

| Segment | Job to be done | Proof Mikono can show | Main objection to answer |
|---|---|---|---|
| Parents and gifters in Kenya | A safe first toy or birthday gift for a child, bought quickly on a phone | Nothing detachable, zero plastic, easy to clean, Kenyan safari animals children recognise | "Is it safe for a baby?" and "Will it arrive in time?" |
| Diaspora | A gift with a story that links a child abroad to Kenya, or a gift sent to family at home | Handmade in Nairobi, named makers, safari animals as heritage objects | "Can I pay from abroad and will it reach family?" (TODO: payment and shipping options) |
| Tourists and safari lodges | A souvenir that is not made of plastic and is made locally | Safari animals, recycled yarn, local women makers; sold today at the Giraffe Centre, JKIA and Village Market stockists | "Is it genuinely local and will it fit in my luggage?" (size ladder answers this) |
| Gift shops and retailers | Stock that sells through, with clear margin and easy reorder | Existing stockists (Blue Rhino Shop, Spinners, Pop up shop at Yaya Centre, Giraffe Centre, Beth International Shops, Marula Green Market, New Muthaiga Mall), range depth, colourways | "What is my margin, MOQ and lead time?" |
| Hotels and corporate gifting | Branded or themed gifts for guests, staff children, events, client thank-yous | Consistent quality, bulk capacity (TODO: confirm), impact story for CSR reporting | "Can you deliver 50 or 500 on a date and match our colours?" |
| NGOs | Comfort toys and gifts for programmes, with a documented social purpose | Women makers supported, recycled materials, no plastic | "Can you give a quote, invoice and impact summary?" |
| Schools and ECD centres | Safe classroom and play toys, washable | Nothing detachable, easy to clean, size ladder for age use | "Is it durable and washable at the volume we need?" |
| International wholesale | Ethical, distinctive stock for a foreign shop or online store | Handmade story, recycled yarn, zero plastic | "Can you export, to which standards, and at what freight cost?" (TODO: export readiness) |

**Positioning line to test (not final copy):** a soft animal a child can hold safely, made by named women in Nairobi from recycled yarn. Copy writers must replace this with client-approved wording and must not add claims beyond the brief.

**Priority order for the first release.** 1) Parents and gifters in Kenya. 2) Gift shops and retailers (protect the current base). 3) Hotels, corporate and NGOs. 4) Diaspora. 5) Tourists and lodges (mostly reached through stockists). 6) Schools and ECD. 7) International wholesale. Rationale: the first two segments exist or are reachable on WhatsApp today. International wholesale needs export and compliance work that the client has not described.

## 2. B2B and B2C: how the site serves both

### 2.1 Principle

One catalogue, two doors. The product data is shared (species, size, colourway). The price, order flow and tone differ. A retail visitor never sees wholesale prices. A trade visitor never has to click through retail marketing to find their route.

### 2.2 Site structure

- Primary navigation: Shop, Gifts and Sets, Story and Impact, Trade, Contact.
- "Trade" is a visible top-level item, plus a quiet link in the footer and on the home page trust strip. It leads to the wholesale page (Phase 5).
- Retail pages show KES retail prices and an add to cart button.
- Trade pages show product images and specifications, but prices appear only after the visitor is identified as a trade buyer (see 2.4).
- A small "Buying for a shop, hotel, school or organisation?" prompt appears on the cart drawer and bundle pages, so a corporate buyer who lands in retail is redirected to a quote, not a 48-unit cart.

### 2.3 Wholesale flow

1. Trade visitor opens the Trade page and sees who it is for, what the range includes, and the process in four steps.
2. They choose a path: request a price list, request a quote, request a sample pack, or place a repeat order.
3. A short form collects: business name, business type, location, contact person, WhatsApp number, email, items of interest (species, sizes, colourways, rough quantities), required date, and whether they are an existing stockist.
4. The form sends a structured WhatsApp message to Mikono and stores a lead record. (TODO: client to confirm the business WhatsApp number and who answers it.)
5. Mikono replies with a price list and terms, or a written quote.
6. First orders ship after payment terms are met (see section 7). Repeat orders use a shorter "reorder" form that pre-fills the last order.

### 2.4 Minimum order quantities (MOQ) logic

No MOQ numbers exist in the brief. The structure to decide:

- **MOQ by order value or by units?** Recommendation: set a minimum on units per order, not per design, so a shop can mix species and colours. Placeholder: [MOQ_UNITS] units per first order.
- **Per-size minimums.** Large and XL animals take more hours. Consider a lower unit minimum for L and XL than for S. Placeholder: [MOQ_L_XL].
- **Colourway minimums.** Mixed colourways inside one order are allowed; a single custom colourway needs its own minimum, because yarn must be sourced. Placeholder: [MOQ_CUSTOM_COLOUR].
- **Sample pack exception.** One sample pack per business, below MOQ, at full or near-full wholesale price (see 2.6).

### 2.5 Tiered wholesale pricing logic

Tiers reward volume and repeat behaviour, and they protect retail pricing. Structure only:

| Tier | Who it is for | Basis | Discount off retail |
|---|---|---|---|
| Trade 1 | New stockist, first order | Meets MOQ | [T1_PERCENT] |
| Trade 2 | Repeat stockist or larger order | Order value above [T2_THRESHOLD_KES] or [N] orders in 12 months | [T2_PERCENT] |
| Trade 3 | Anchor partner or international wholesale | Annual volume agreement | [T3_PERCENT], by negotiation |
| Corporate and NGO | One-off or annual gift orders | Quote based, includes any custom work | Quote |

Rules the build needs: wholesale price is always a percentage of the retail price, so a retail price change flows through; the discount applies per line, not per order total, unless the client decides otherwise; the wholesale price list is stored apart from the retail list; no tier is shown to retail visitors.

TODO: the client must confirm the current wholesale terms their seven stockists already hold, so new tiers do not undercut them.

### 2.6 Quote requests, sample packs and repeat orders

- **Quote request:** triggered from the Trade page, from a bundle page, and from any cart above a [QUOTE_THRESHOLD_UNITS] threshold. Response time promise: [QUOTE_RESPONSE_HOURS] (TODO: client to commit to a number they can keep).
- **Sample pack:** one small, fixed set (suggested content: one safari animal and one domestic animal in two sizes, TODO: client to decide). Price [SAMPLE_PACK_KES]. Whether the cost is credited against the first order is an open decision.
- **Repeat order:** a returning stockist enters their business name and phone, the site (or Mikono manually) retrieves the last order, they adjust quantities. First release can be a WhatsApp message template; an account area is a later stage.

## 3. Catalogue architecture

### 3.1 Hierarchy

```
Collection  >  Species (product)  >  Variant (size x colourway)
                                  >  Bundle (set of species or sizes)
```

- **Collections (browse groups):** Safari Animals, Domestic Animals, Gift Sets, Nursery Sets, Safari Family Sets. Additional collections only when stock exists (for example, a seasonal collection).
- **Species (product page):** giraffe, elephant, lion, monkey, rhino and more (safari); dog, cat, rabbit and more (domestic). The complete species list is TODO; the build must read it from the data file, not hardcode it.
- **Size:** S, M, L, XL. Dimensions in centimetres are TODO. The size guide must not publish any measurement until the client supplies it.
- **Colourway:** each species lists only the colourways that exist. The image shown must match the colour chosen (charter rule 7).
- **Variant:** one size and one colourway of one species. This is the unit that carries stock status, price, and image reference.

### 3.2 Bundles

| Bundle type | Contents logic | Notes |
|---|---|---|
| Safari family set | A fixed group of safari species, same size, matching or mixed colourways | Highest gift value; photograph as a group |
| Nursery set | A small number of calm, smaller animals suited to a cot or shelf | Age and safety copy needs client sign-off |
| Gift sets | One animal plus a card or packaging; optional second item | Packaging materials must be zero plastic to stay on message (TODO: confirm packaging) |
| Build your own set | Customer picks any N animals of one size | Later stage; needs rules for discount |

Which exact sets exist is a client decision. The data model must allow a bundle to be a list of variant references plus its own price rule.

### 3.3 Personalisation and made-to-order

- **Personalisation options to evaluate:** embroidered or stitched name, a handwritten gift card, choice of a custom colour. Each one adds hours for the maker. TODO: client to say which are feasible and what they cost.
- **Made-to-order:** any variant not in stock can be offered as made to order with a lead time. This lets the catalogue show the whole range without holding stock of every variant.

### 3.4 Stock status model (no invented numbers)

Every variant carries one status:

| Status | Meaning on the page | Cart behaviour |
|---|---|---|
| In stock | Ready to dispatch | Add to cart; delivery estimate from the delivery table |
| Made to order | Mikono makes it after the order | Add to cart; shows lead time in a plain sentence |
| Limited | Only when the client maintains counts honestly | Shows "limited" only; never a fake countdown or invented count |
| Not available | Retired or on pause | Hidden from shop or shown with a "tell me when back" WhatsApp link |

Lead time: stored as a range of days per size, [LEAD_DAYS_S], [LEAD_DAYS_M], [LEAD_DAYS_L], [LEAD_DAYS_XL]. Until the client supplies them the page says "We will confirm the date on WhatsApp." Stock status is edited by the client in a simple data file or admin sheet in the first release.

## 4. Pricing framework

All amounts below are placeholders. No retail or wholesale price has been supplied. Currency is KES.

### 4.1 Size ladder logic

Price rises with size because yarn use and making hours rise, but not in a straight line: the XL is a display and gift piece, and the S is an entry price. Method:

1. Obtain cost per variant: yarn, stuffing, labour (fair maker rate), finishing, packaging. (TODO: client supplies.)
2. Set the S price from target margin on the entry product, with the aim that it stays a reasonable impulse gift.
3. Set M, L and XL so the price per unit of material falls a little as size rises (a modest volume logic), while labour stays the dominant cost.

| Size | Retail price (KES) | Wholesale T1 (KES) | Notes |
|---|---|---|---|
| S | [PRICE_S] | [WS_S] | Entry, souvenir, stocking filler |
| M | [PRICE_M] | [WS_M] | Core gift size |
| L | [PRICE_L] | [WS_L] | Statement gift, nursery |
| XL | [PRICE_XL] | [WS_XL] | Display piece, lodge and corporate |

Species may carry a price modifier if some animals take notably longer to make (for example, a species with many parts). Allow one modifier field per species, default zero.

### 4.2 Bundle discounts

A bundle is priced as the sum of its parts minus a stated discount: [BUNDLE_DISCOUNT_PERCENT] for sets of [N] or more. Show the saving as a plain amount in KES. Do not use a crossed-out "was" price to create urgency. Charter rule 6 forbids countdown pressure, and rule 4 forbids bright sale tags.

### 4.3 Delivery pricing structure

No zones or fees are supplied. The structure:

| Zone | Example areas | Fee | Method |
|---|---|---|---|
| Zone A, Nairobi central | TODO | [FEE_A] | Courier or rider |
| Zone B, Nairobi outskirts and satellite towns | TODO | [FEE_B] | Courier |
| Zone C, rest of Kenya | TODO | [FEE_C] | Courier or bus parcel service |
| Pick-up | Stockist or Mikono pick-up point | Free, if client agrees | Customer collects |
| International | Diaspora and export | Quoted per order | TODO: partner and customs process |

Add a free-delivery threshold only if the client confirms margin allows it: [FREE_DELIVERY_THRESHOLD_KES]. Delivery fee is confirmed in the WhatsApp message if the area is not in the table.

## 5. Revenue streams beyond toys

Ranked by fit with what Mikono already does, not by size of dream.

| Stream | What it is | Fit | Needs before launch |
|---|---|---|---|
| Corporate gifts | Branded or themed orders for companies, hotels, events | High: uses the same product | Quote flow, lead times, packaging, optional brand tag (TODO: feasibility) |
| Custom orders | Special colours, names, a pet or mascot likeness | High, but slow per unit | Brief form, photo upload by WhatsApp, deposit, clear price floor |
| Sponsor-a-doll | A donor pays for an animal that goes to a child or programme | High: ties impact to revenue | Delivery partner (TODO), proof of delivery, consent for photos of children |
| School and ECD programmes | Classroom sets, toy libraries | Medium | Washing and durability evidence; invoicing |
| Workshops | Crochet sessions with makers for visitors or corporate teams | Medium | Venue, a maker's willingness, safety and pricing. TODO: does Mikono want this? |
| Kits | A crochet kit using recycled yarn, plus an instruction card | Medium, later | Yarn supply, pattern ownership, packaging; risks pulling makers from production |
| Licensing | Partner prints or uses Mikono designs | Low for now | Design IP position (TODO), a brand with a fit |
| Sponsorship | A company sponsors a maker group or a collection | Low for now | Impact reporting capability |

Recommended sequence: corporate gifts and custom orders first (stage 2), sponsor-a-doll and school programmes second (stage 3), workshops and kits only after capacity is proven. Licensing is parked. Choosing these means saying no to workshops and kits at launch.

## 6. Trust and impact proof mechanics

Trust is the second selling point after interface quality. It must be earned with evidence, not adjectives.

### 6.1 Maker stories

- Each maker who consents gets a short profile: first name, a photo only if consent is on record, a plain description of what she makes. TODO: client collects consent and decides names.
- Show "made by" on the product page only if the animal can be tied to a maker or maker group. If it cannot, show the group, not an individual.
- Photos of identifiable people and children stay unpublished until marked cleared in the media manifest (charter rule 10).

### 6.2 Impact counter

The brief gives one number: 25+ women supported. A counter is allowed only with figures the client can defend.

- Show "25+ women supported" as stated. Do not display a live-looking counter.
- Candidate additional metrics, each TODO until supplied and sourced: animals made since 2019, kilograms of yarn recycled, maker earnings policy, hours of paid work. Each needs a source and a date. A figure with no source is not shown.

### 6.3 Safety claims and evidence needed

The brief states: zero plastic, nothing detachable, easy to clean. Each claim needs support before it is stated as fact in marketing.

| Claim | Evidence to collect | Owner |
|---|---|---|
| Zero plastic | Material list for yarn, filling, thread, eyes and nose, packaging; yarn supplier statement | Client (TODO) |
| Nothing detachable | Description of how eyes and noses are made (stitched or crocheted) and a simple pull test record | Client (TODO) |
| Easy to clean | Care instructions tested on a sample: wash method, drying, shape retention | Client (TODO) |
| Recycled acrylic yarn | Supplier name, source of recycled material, share of recycled content | Client (TODO) |
| Suitable age range | Do not claim an age range until the client confirms a basis. A formal toy-safety test (for example, a recognised standard such as EN 71) may be requested by corporate, school or export buyers. TODO: has any testing been done? | Client |

Until the evidence exists, the site copy should state what is plainly true from the construction ("no small parts that come off") and avoid words such as "certified" or "tested".

## 7. Operations implications of WhatsApp ordering

Checkout is WhatsApp-based for now. This is acceptable for the first stage and fragile at scale. The order wizard (separate report) produces a structured message. The business process behind it:

1. **Order intake.** The customer completes the wizard and taps send. A pre-filled WhatsApp message arrives with an order reference, items (species, size, colour), delivery area, contact name, and notes. The site also records the click as an event for tracking. TODO: the client confirms the WhatsApp number and who monitors it, plus hours.
2. **Confirmation.** A named person replies within a promised window [CONFIRM_RESPONSE_HOURS], checks stock status, confirms the total including delivery, and states the date. This is the manual step that prevents overselling.
3. **Payment.** M-Pesa (paybill or till, TODO) and bank transfer. Customer sends the confirmation message; Mikono matches it to the order reference. Cash on delivery is a decision for the client (risk of refused parcels). Diaspora payment method is open: TODO.
4. **Dispatch.** Rider or courier within the zone table, with a handover note. Customer gets a dispatch message with the expected time. Made-to-order items dispatch after the lead time.
5. **Returns and exchanges.** The policy is the client's to set. Suggested structure: exchange within [RETURN_DAYS] days if unused and unwashed, wrong item or defect always corrected at Mikono's cost, custom and personalised items are not returnable except for defects. Hygiene wording needs client approval.
6. **Records.** Every order lives in one shared sheet with: reference, date, items, amount, payment status, dispatch status, channel source. Without this, the KPIs below cannot be measured.

**Failure points to design around:** orders arriving outside hours, a duplicate message from one customer, payment claimed but not received, stock sold twice, and trade orders mixed with retail messages. Use separate WhatsApp contacts or a labelled business account for trade (WhatsApp Business labels), and let the site pass a source tag in the message.

### Roadmap to proper payments

| Stage | Capability | Trigger to move |
|---|---|---|
| 1. Now | WhatsApp wizard, manual M-Pesa and bank | Launch |
| 2. | Order records in a shared database, automatic confirmation email or message template, manual payment match | More than the team can handle by hand (TODO: client sets the daily order level at which this hurts) |
| 3. | M-Pesa STK push or a Kenya payment aggregator, card payments, order status page | Stable demand and a registered business payment account (TODO) |
| 4. | Customer accounts, saved addresses, trade portal with tier pricing and reorder | Repeat B2B and B2C volume justify it |
| 5. | Marketplace features, third-party products ("super store") | Only after fulfilment, returns and supplier vetting are proven |

Choice of provider is a later decision and depends on what the client's bank and M-Pesa account support. No provider is recommended here without that input.

## 8. KPIs per stage

| Stage | Aim | KPIs (targets are TODO until a baseline exists) |
|---|---|---|
| Launch (0 to 3 months) | Site live, WhatsApp orders working | Visits; product page views; add to cart rate; WhatsApp order sends; confirmed orders; trade enquiry forms; response time to a message; share of orders with complete information |
| Early traction (3 to 9 months) | Retail demand proven, trade base protected | Retail conversion (visit to confirmed order); average order value; bundle share of orders; repeat customer rate; stockist reorder rate; quote to order rate; delivery on-time rate |
| Scale (9 to 18 months) | Second revenue engine | Corporate and custom revenue share; sponsor-a-doll volume; email and WhatsApp list size; payment success rate after online payment; return and complaint rate |
| Maturity | Platform | Customer lifetime value; gross margin by channel; capacity utilisation of makers; share of revenue by segment; maker income per hour (an impact KPI) |

Two KPIs the client should watch from day one because they protect the model: gross margin per variant, and make-time per variant against lead time promised.

## 9. Risks and mitigations

| Risk | Likelihood and impact | Mitigation |
|---|---|---|
| Maker capacity cannot meet retail or corporate demand | High likelihood, high impact | Show honest lead times; made-to-order status; capacity cap per week agreed with the client; no countdown or scarcity pressure |
| B2C pricing cannibalises stockists | Medium, high | Keep the retail price at or above stockist shelf price; consult stockists; use "buy in store" links where useful. TODO: client to decide |
| WhatsApp overload, slow replies | High, medium | Named owner, response promise, canned replies, move to stage 2 operations early |
| Safety claims challenged | Low to medium, high | Do not publish claims beyond evidence; collect material and test records (section 6.3) |
| Photo or privacy breach, especially with children or makers | Medium, high | Charter rule 10; consent record per person; manifest default of not cleared |
| Weak unit economics | Unknown, high | Cost each variant before setting any price; review margin by size |
| Cash flow from corporate orders (deposits, late payment) | Medium, medium | Deposit rule for custom and large orders; invoice terms stated on the quote |
| Dependence on a few stockists | Medium, high | Grow B2C and corporate; diversify trade through the Trade page |
| Delivery failure or damage | Medium, medium | Zone table; rider tracking by message; packaging that protects soft items; a clear damage policy |
| Scope drift to "super store" too early | Medium, medium | Keep it as stage 5 on the roadmap |

## 10. Questions the client must answer

**Business and pricing**
1. What are your retail prices per species and size? What are your current wholesale prices and terms with each stockist?
2. What is the cost to make each size (yarn, filling, labour, finishing, packaging)?
3. Do you want the retail price to match what stockists charge on their shelves?
4. What MOQ, if any, applies today? Do stockists buy mixed species and colours?
5. Do you offer consignment, credit, or payment on order to stockists?

**Capacity and operations**
6. How many animals can the team make in a week, by size? What lead times can you honestly promise?
7. Who answers WhatsApp, in what hours, and in how many hours do they reply?
8. Which M-Pesa option (paybill, till, send money) and which bank account will be used? Is cash on delivery allowed?
9. What are your delivery zones, fees, couriers or riders, and a free-delivery rule?
10. What is your returns and exchange policy?

**Catalogue**
11. What is the complete species list, with colourways available for each?
12. What are the dimensions of each size in centimetres, and the weight?
13. Which bundles do you want to sell at launch, and which personalisation options can you do?
14. Which age range do you recommend, and on what basis?

**Safety and impact**
15. What are the materials in every component, including filling, eyes and noses? Who supplies the recycled yarn?
16. Has any toy-safety testing been done? Would a corporate or export buyer ask for it?
17. What can be said about impact with evidence: number of makers, earnings, years, animals made?
18. Which makers consent to be named and photographed? Who signs off photos of children?

**Segments and growth**
19. Which segment do you most want to grow first, and what share of revenue is B2B today?
20. Can you handle corporate orders of 50 or more units? On what lead time?
21. Do you want sponsor-a-doll, school programmes, workshops or kits, and are there partners lined up?
22. Are you ready to export or sell to international wholesale? Who handles customs and freight?
23. What do you mean by "super store": other brands, other makers, or more categories?
24. Domain, email, business WhatsApp number, analytics IDs: who supplies them and by when?

## Decisions the build needs

- One shared product data model: collection, species, variant (size by colourway), bundle. Species and colourways are read from data, never hardcoded.
- Sizes are S, M, L, XL. Dimensions show "TODO" until supplied; do not publish a number.
- Every variant has a status: in stock, made to order, limited, not available, plus a lead time field. No invented counts, no countdown timers.
- Prices are KES placeholders from a typed price file, with retail and wholesale lists stored separately. Wholesale is a percentage of retail per tier.
- Retail pages never show wholesale prices. Trade prices are not visible without a trade request; for now a price list is sent on WhatsApp after the form.
- Navigation: Shop, Gifts and Sets, Story and Impact, Trade, Contact. Trade is always visible.
- Trade page offers four paths: price list, quote, sample pack, repeat order. Forms collect the fields in section 2.3 and send a structured WhatsApp message plus a stored lead.
- Bundle pages show the saving in KES, no crossed-out "was" price, no urgency styling.
- A cart above [QUOTE_THRESHOLD_UNITS] shows a "request a quote" prompt in addition to checkout.
- Order wizard output includes: order reference, items, delivery area, notes, source tag (retail or trade, plus UTM source). Delivery fee comes from a zone table in a typed file with placeholders.
- Payment text names M-Pesa and bank transfer with TODO numbers. No card payments at launch.
- Impact strip shows "25+ women supported" only. Any other figure is hidden until the client supplies it with a source.
- Safety copy limited to: zero plastic, nothing detachable, easy to clean. No "certified", "tested" or age-range claims until evidence is supplied.
- Maker and child photos appear only when the manifest marks them cleared.
- Track events: WhatsApp click, wizard step, quote form submit, sample pack request, bundle view.
- Keep placeholders in one list the client can fill, so the build can report open items at every gate.
