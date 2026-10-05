# 15. Cart, Checkout, Data, Delivery and Payments Strategy

Status: strategy, not a build spec. It sits under strategy/07-BUILD-DECISIONS.md (R1 to R10, D1 to D40) and the charter. Where a proposal touches a ruling it is flagged RULING CHECK. Written 2026-10-03.

Method: I read the charter, 01, 02, 03, 04, 07, 08, 10, lib/cart.tsx, lib/orderForm.ts and data/deliveryAreas.ts, then walked the live site at 390 x 844 (added Lion size M, opened /cart, stepped through all five wizard steps, sent nothing). Benchmarks come from web search results; I did not open the benchmark sites in a browser. "Verify" marks any fact that affects a money or legal decision. "Unverified" marks general knowledge I did not confirm.

---

## 0. The answer on one page

**The honest reframe.** Mikono cannot beat Shopify, Zalando or Takealot on feature count. It can beat them on four things they cannot copy: it says plainly what is not confirmed, it works the way Kenyans already buy (WhatsApp, M-Pesa, a person who replies), it is light on a cheap phone, and it makes gifting the main case. The plan is built on those four.

**What is true today (live site).**

| Fact | Evidence |
|---|---|
| The cart is clean but thin: image, name, colour and size text, quantity stepper, Remove. No size or colour edit, no note per line, no save for later, no share, no suggestions beyond a text link "Add more to make a family". | /cart, one Lion line |
| The summary is honest under R7: "Prices are confirmed on WhatsApp, together with delivery and how to pay. Nothing is charged here." | /cart |
| Wizard: Who, Details, Delivery, Gift, Review (4 steps when gift is skipped). Delivery fee says "to be confirmed on WhatsApp". The last button is "Send order on WhatsApp". | All steps walked |
| Delivery asks for area, estate or landmark, notes and a wished date. No pin, no slot, no estimate. All 18 areas in data/deliveryAreas.ts have a null fee. | Step 3 and data file |
| Payment is one optional free text box. | Step 2 |
| A full screen brand splash with a Skip button covered a fresh deep link to /cart. A buyer arriving from a WhatsApp link meets it before the cart. | Screenshot |
| Add to order list stays disabled until a size is chosen, with a hint. Colour reads "Ask us about availability". | /shop/lion |

**Top moves, in order**

1. Ship the honest cart upgrade, frontend only (section 4).
2. Ship a shareable cart link: cart on any device, "send my list for approval", no account.
3. Build Tier 0 and Tier 1 data capture with consent in the right places, plus an unticked device-only "remember me".
4. Create an order record (Google Sheet first, Postgres later). Analytics, status, reminders and payments all depend on it.
5. Add a status page by reference and phone.
6. Get delivery zones and fees from the owner and publish them as data.
7. Move payments in two steps: M-Pesa instructions after confirmation now, STK push later.
8. Add gift mode with an adult-only recipient (D16).
9. Add opt-in WhatsApp and email cart rescue after the record exists.
10. Define the funnels before launch so month one is a clean baseline.

**Deliberately left out:** countdowns, fake stock, exit pop-ups, crossed-out prices, forced accounts, review rewards, child data, public wholesale prices, marketplace features.

**Guardrails that hold throughout:** prices only when confirmed (R7, D11); no child data (D16); unticked, separate consent; no dark patterns (charter 6); no public wholesale price (D20); no server in release 1 (D18), so sections marked Phase B and C need an owner decision; KRA PIN never stored in the browser (D16); never `purchase` until a server confirms payment (D23).

---

## 1. Benchmark

Numbers from vendor blogs are vendor claims and are treated as ceilings.

| Source | Pattern | Status | What we take |
|---|---|---|---|
| Baymard, https://baymard.com/research-articles/current-state-of-checkout-ux and https://baymard.com/blog/mobile-ecommerce-checkout-forms | About 70% average abandonment. 26% leave when forced to create an account. Most checkouts need 6 to 8 fields, not 15. Guest option most prominent. Right keyboard per field. 63% of mobile checkouts are mediocre or worse. | Verified (summary) | No accounts. Fewest fields per step. Correct `inputMode` and `autocomplete`. Action bar clear of the keyboard. |
| Shopify Shop Pay, https://www.shopify.com/blog/shop-pay-checkout | Remembered buyer, one tap. Shopify claims up to 50% lift over guest checkout. | Vendor claim | Principle only: a returning buyer should not retype. Our version is device-only remember-me and reorder. |
| Jellycat, https://us.jellycat.com/gifting-options | Free printed gift message in the parcel. Free shipping over $75. | Verified | Gift message with card preview. Threshold only if the owner confirms. |
| Allbirds and Glossier, https://www.allbirds.com/ and https://www.glossier.com/cart | Free shipping thresholds ($100, $40). Progress bar not confirmed. | Threshold verified | A plain free-delivery sentence, if real. |
| Takealot, https://www.takealot.com/help-centre/orders-cancellations/placing-orders | Door or Pickup Point at checkout, estimate by address, pickup held 7 days, map, SMS or email when ready, four tracking states. | Verified | Estimate before the form, pickup as a first class option, plain statuses. |
| Jumia Kenya, https://www.jumia-blog.com/post/jumia-reduces-delivery-fee-through-expansion-of-pick-up-station-pus-network-in-kenya | Door or pickup station, pickup cheaper, held 5 days. | Verified | Price pickup lower if the owner has points. |
| Naivas Online, https://www.naivas.online/ and https://mabumbe.net/naivas-online-grocery-shopping-and-home-delivery-guide/ | Slots, same day before 10 AM, M-Pesa and card, substitution notice, minimum order KES 1,000, delivery from KES 129. | Verified (secondary) | Kenyans understand cut-offs and slots. Our "substitution" is "if your colour is not ready". |
| Uber Eats and Glovo, https://about.ubereats.com/us/en/how-it-works/group-order/ | Schedule at checkout, staged tracker, group order by shared link. | Verified | Shared cart link. Five stage tracker. |
| Daraja M-Pesa Express, https://mpesa-nextjs-docs.vercel.app/handling-callback and https://www.mctaba.com/learn/africa/mpesa-integration-guide | STK push, HTTPS callback with result code, receipt number, amount. Needs a paybill or till with Lipa na M-Pesa Online. Go-live commonly quoted at 5 to 15 business days. | Community docs. Verify at https://developer.safaricom.co.ke | The biggest payment upgrade. Needs a server. |
| Paystack Kenya, https://paystack.com/blog/company-news/kenya and https://paystack.com/docs/payments/payment-channels/ | Live in Kenya. Cards, M-Pesa, Apple Pay, Pesalink, hosted page. | Verified | Leading one-integration option. Verify fees and sole proprietor onboarding. |
| Flutterwave, https://developer.flutterwave.com/docs/payment-methods | Inline, redirect and API checkout. M-Pesa STK, cards, bank. | Verified. Fee figures unverified | Second option. |
| Pesapal and IntaSend, https://paymentproviders.io/blog/best-payment-gateways-kenya | Kenyan aggregators. A comparison quotes 3 to 5.5% fees. | Verify | Fallbacks. |
| Stripe, https://dodopayments.com/blogs/stripe-supported-countries-alternatives | Kenya is not a direct Stripe country, reachable through Paystack per third parties. | Verify at https://stripe.com/global | Plan on Paystack, not Stripe. |
| Cart recovery, https://chatarmin.com/en/blog/how-to-recover-abandoned-carts-via-whatsapp | Vendors quote 12 to 23% recovery on WhatsApp, 5 to 12% on email, opt-in base required. | Vendor claims | Build after volume exists. Never forecast revenue from it. |
| WhatsApp Business Platform, https://sleekflow.io/en-us/blog/whatsapp-business-template and https://zenvia.com/en/new-whatsapp-business-pricing-rules-for-2026/ | Outside the 24 hour window only approved templates. One source says utility messages inside the window became billable on 1 October 2026. | Third party. Verify at https://developers.facebook.com/docs/whatsapp | Keep messages manual until volume justifies per-message cost. |
| Kenya Data Protection Act, https://www.odpc.go.ke/wp-content/uploads/2024/02/TheDataProtectionAct__No24of2019.pdf and https://www.afriwise.com/blog/beyond-the-text-of-the-law-adopting-best-practices-for-direct-marketing-in-kenya | Section 37: commercial use needs express consent. Right to object to direct marketing is absolute. Small entities (under KES 5 million turnover, under 10 staff) may skip the registration fee, not the duties. | Legal summaries. Not legal advice | Matches our unticked, separate consent. |
| KRA eTIMS and VAT, https://invoicemonk.com/en/blog/kra-etims-kenya-explained | eTIMS invoices required, B2B needs the buyer's PIN, VAT 16%. | Verify at https://www.kra.go.ke | B2B needs a PIN field and an invoice process. |
| Apple, Nike, IKEA, Zalando, Pottery Barn Kids, Kilimall, Gumroad, Carrefour Kenya | Not opened. From memory: Apple and Zalando show a delivery date before paying, IKEA keeps a persistent list, Nike remembers members across devices, Pottery Barn Kids has gift options, Gumroad uses one compact page. | Unverified | Direction only, never cited as fact. |

---

## 2. The experience in one picture

```
Browse -> Product (size, colour) -> Add to order list (toast)
 -> Mini cart (edit, notes, share) -> Cart page (size help, delivery estimate, suggestions)
 -> Order form: Who -> Details -> Delivery -> Gift -> Review
 -> Send on WhatsApp (ref MK-YYMMDD-XXXX)   [order record saved from Phase B]
 -> A person confirms items, price, delivery, how to pay
 -> Pay by M-Pesa (instructions now, STK push later)
 -> Status page, dispatch, delivery proof, care card, review, reorder
```

Two paths run alongside: /wholesale (D14, D21) and /custom. A cart of 20 or more units gets a soft quote prompt, never a block (`QUOTE_THRESHOLD_UNITS`, 20 in lib/site.ts).

---

## 3. Cart and mini cart

Phase A needs no server. B needs the order record. C needs payments or accounts. "Owner" means blocked on an owner input.

### 3.1 Feature list

| # | Feature | What the buyer sees | Phase | Limit or note |
|---|---|---|---|---|
| 1 | Edit size | Tap "Size M", pick S to XL with the relative note | A | Merge if the variant already exists. |
| 2 | Edit colour | Chips for real colourways, plus "Confirm colour on WhatsApp" | A | From data/colours.ts only. |
| 3 | Quantity | Exists, max 20 | A | At the cap: "Need more? Ask for a quote". |
| 4 | Note per line | "Add a note for this animal" (120 characters) | A | Hint: no child's name or age. Goes into the WhatsApp line. |
| 5 | Save for later | Line moves to "Saved for later (2)" | A | Device only, 30 day expiry. |
| 6 | Share my list on WhatsApp | Opens WhatsApp with the list and a link, buyer picks the contact | A | `wa.me/?text=`. Nothing sent to us. |
| 7 | Shareable cart link | `/cart?l=SKU.qty,SKU.qty` rebuilt on open | A | Validate every SKU. Never encode names or phones. This is cross-device cart with no account. |
| 8 | Complete the family | 3 to 4 cards, other animals in the same size | A | Rule based on catalogue data, not invented popularity. R4 card rules. |
| 9 | Set or bundle tile | "Safari set of 3" | A, owner | Only when a bundle exists and is priced. |
| 10 | Size help | S, M, L, XL compared by relative size | A | R5: no centimetres. Link to /size-finder. |
| 11 | Gift wrap per line | Unticked box | A, owner | Only if offered. Fee TODO. |
| 12 | Delivery estimate by area | Select an area, see zone, fee and lead time | A, owner | Today the fee is null, so it says "to be confirmed". |
| 13 | Running estimate | Items total | A, owner | Only after prices are confirmed. |
| 14 | Free delivery line | "KES [X] more for free delivery in Nairobi" | A, owner | Only if a real threshold exists. Plain text. |
| 15 | Promo code | Collapsed "Have a code?" | B | Hidden when no live code exists. |
| 16 | Trust strip | The four approved items (D27) | A | Small, under the summary. |
| 17 | Cart across devices by login | Phone plus one time code | C | Item 7 covers most of the need until then. |
| 18 | Abandoned cart rescue | "Remind me on WhatsApp or email" | B | Opt-in, one message. Section 4.6. |
| 19 | Back in stock note | "Tell me when this colour is ready" | B | Already in 04 section 3.4. |

### 3.2 Price states

| State | When | Cart shows | `value` in events |
|---|---|---|---|
| P0 (today) | `pricesConfirmed` false | "Price confirmed on WhatsApp with delivery and how to pay. Nothing is charged here." No numbers. | Omitted |
| P1 | Some products priced | Priced lines in KES, others "Price on request". No total. | Omitted |
| P2 | Prices set, fees not | Items total. "Delivery to be confirmed." | Items total |
| P3 | Prices and zone fees set | Items, delivery, total, "Final amount confirmed on WhatsApp" until payments are live | Real total |

The build fails if the flag is true and a product has no price (D11). Extend that to a zone with a null fee when P3 is on.

### 3.3 Mini cart, availability, empty cart

- **Mini cart:** line image, name, "size M, grey", stepper, Remove, one honest price line, "Continue to order form", "View cart", share icon, "Saved for later (n)". It opens only on tap of the cart icon (D13). The add toast carries the same two links.
- **Availability:** handmade means a lead time, not a stock count (01 section 3.4). Each line shows an owner-approved state: "Ready to ship", "Made to order, about [LEAD_TIME_DAYS] days", or "Ask us". No unit counts. A made-to-order colour is never called in stock.
- **Empty cart:** "Your order list is empty. Start with the animals people choose most for gifts." Four featured animals, the gift finder, /size-finder, then saved items. No guilt copy.
- **Edge cases:** storage blocked and corrupt cart already handled in lib/cart.tsx. Add: a removed SKU stays visible with "No longer available, choose a similar animal"; a shared link with an unknown SKU says "We could not load 1 item".

---

## 4. The order wizard

Keep five steps at most. Add a field only where a decision depends on it.

| Step | Keep | Add |
|---|---|---|
| 1 Who | Gift, business, organisation | A fourth answer: "I am sending this to someone in Kenya from abroad" |
| 2 Details | Name, WhatsApp, optional email, notes | Payment preference pick list (section 7.2), preferred channel and best hours (optional), "How did you hear about us?" (optional pick list) |
| 3 Delivery | Pickup, Nairobi area, other town, notes, wished date | Area estimate, "share your WhatsApp location after you send", delivery window if offered, courier choice only if offered |
| 4 Gift | Gift note, send direct to an adult | Card preview, "no prices on the slip", occasion type and date (optional) |
| 5 Review | Items, details, consent, message preview, copy fallback | Delivery and payment lines, unticked "Save my details on this device" |

### 4.1 Returning buyers

If remember-me was ticked, steps 1 and 2 prefill and the page says "Welcome back, Amina. Same details as last time?" with "Yes, use them" and "Change". "Reorder last list" reaches Review in two taps. RULING CHECK: D16 limits `mk.orders.v1` to ref and items. Remember-me is the device profile `mk.profile.v1` defined in 16 section 3.1, unticked, 90 days rolling, wiped by "Clear my saved details", with the exact consent text in 17 section 8.1 (box 4). It is already an owner request in 16. It does not weaken D16.

### 4.2 Quality rules

Keep the current inline errors and the "Please check one thing" summary (they are good). Keep "Copy order text instead" above the fold when WhatsApp does not open within 2 seconds. The splash must not cover /cart, /order or /order/sent: a shared cart link is wasted if the buyer meets a splash first. The wizard must work on a mid range Android on a slow connection with the draft surviving a tab kill (24 hours).

---

## 5. Data capture plan

Rules: ask for the least that finishes the order; each tier has its own consent; no child data (D16); no names, phones, addresses or message text in analytics parameters; KRA PIN never in browser storage. Where this file and 16 or 17 differ, 17 wins on consent, children and retention, and 16 wins on build detail; differences are listed in section 11. Retention numbers are proposals for the owner and a Kenyan advocate, not legal advice. Marketing needs express consent and the right to object is absolute, so every channel has one "Stop" path.

### 5.1 Tier 0: anonymous, consent-gated analytics

Sent only after the visitor accepts analytics. Before that, UTMs sit in memory (D25). Strictly necessary storage (cart, draft, consent choice) needs no consent.

| Field | Purpose | Basis | Retention | Who sees it |
|---|---|---|---|---|
| GA4 client id | Count visitors, link events | Consent | 14 months | Owner, marketing helper |
| Page and event name | Funnels, content use | Consent | 14 months | Same |
| Item id, size, colour | Product demand | Consent | 14 months | Same |
| UTM and referrer (lower case) | Channel performance | Consent | 90 days in `mk_attr` | Same |
| Device class, browser, county or city | Fixes, delivery demand | Consent | 14 months | Same |
| Search term in shop, cart events | Demand, funnel | Consent | 14 months | Same |
| Consent state and text version | Proof of choice | Legal obligation | Life of record | Owner |

Not collected: IP in our own systems, session replays, any text typed in a form.

### 5.2 Tier 1: needed to fulfil the order

Goes into the WhatsApp message now and into the order record from Phase B.

| Field | Required | Purpose | Basis | Retention | Who sees it |
|---|---|---|---|---|---|
| Name, WhatsApp number | Yes | Reply, pay, deliver | Contract | 17: delete or anonymise 90 days after delivery (16 says 24 months; see section 11) | Owner, order handler; courier gets first name and number on dispatch only |
| Fulfilment, area or town, county | Yes | Delivery quote | Contract | 24 months | Owner, courier |
| Estate, street, landmark, notes, pin link | Yes for delivery | Find the door | Contract | 17: 90 days after delivery (16 says 24 months; see section 11) | Owner, courier |
| Items, sizes, colours, line notes, wished date | Yes | Make the order | Contract | 24 months | Owner, makers see items only |
| Gift note, adult recipient name and phone | If used | Card and delivery | Contract | 16: 90 days after delivery; 17: 30 days for any volunteered child data (see section 11) | Owner, packer, courier |
| Payment preference, M-Pesa receipt code, order ref, items, amounts | When paid | Reconcile, accounts | Contract, legal duty | 5 years without contact details (16 and 17, tax period to verify) | Owner, accountant |
| Email | No | Receipt, updates | Contract (receipt), consent (marketing) | Marketing: until withdrawn or 24 months inactive then one re-confirm (17) | Owner |
| Order ref, status, timestamps | Yes | Operations | Contract | 5 years, no contact details | Owner |

### 5.3 Tier 2: opt-in marketing profile

Unticked, separate, asked on /order/sent or in a "Make my next gift easier" card, never inside the required steps. All optional.

| Field | Values | Purpose | Retention |
|---|---|---|---|
| Marketing consent, per channel | WhatsApp, email | Send news | Until withdrawn, re-ask after 24 idle months |
| Email | text | Newsletter | Until withdrawn |
| Birthday month (the adult's) | 1 to 12 | Adult treat message | Until withdrawn |
| Occasion type and day and month (no year, no "for whom", no free text) | Birthday, Christmas, Gift, Corporate, Other (17 section 2.1: a wedding, baby shower or religious date can reveal sensitive data) | Reminder 3 weeks before (17) | Until the date passes once, then renew or delete |
| Interests | up to 5 animals, 5 colours | Suggestions | Until withdrawn |
| How they heard of us | Instagram, Facebook, TikTok, friend, stockist, search, event, other | Channel truth beyond UTMs | 24 months |
| Customer type | Gift for someone, For my home, Business, School or NGO (17: never "parent") | Segment | Same as email |
| Language, channel, hours | English or Swahili; WhatsApp, call, SMS, email; morning, afternoon, evening | Respect the buyer | Until withdrawn |
| Review and photo permission | per request | Show a review or photo | Until withdrawn |

Basis for the whole tier: consent, with the four unticked boxes and exact texts in 17 section 8.1 (version `consent-v1-draft`). Visible to the owner only. No child's name, age or birthday; the form says "your own birthday month" beside the field. Behaviour linked to a customer record needs its own consent and is kept 12 months (17).

### 5.4 Tier 3: B2B qualification

Asked on /wholesale and on the business answer in the wizard. Phone required, email optional (D21). Basis: contract (pre-contract steps), and legal obligation for tax fields. Visible to the owner, and the accountant for invoice fields.

| Field | Purpose | Retention |
|---|---|---|
| Business name, type (shop, lodge, school, NGO, corporate, other) | Quote, price list | 24 months after last contact, 7 years once invoiced |
| Outlet name and town, county | Delivery, territory | Same |
| Contact person and role | Address the right person | Same |
| Request type, expected volume band per order and per year | Qualify, tier | Same |
| Existing stockist? | Avoid price clashes | Same |
| VAT registered? KRA PIN, PO number | eTIMS invoice | On the invoice record only, never in the browser |
| Delivery contact, receiving hours | Delivery | Until the account closes |

### 5.5 Behavioural data (analytics consent only)

Animals viewed, searches, filters, cart events, size and colour choices, UTMs, device and region go to GA4 only, 14 months. They attach to a named person only with Tier 2 consent, and the join key is the order reference, never the GA4 client id.

### 5.6 Segmentation and scoring

At early volume fine scoring is noise. Three simple models, reviewed quarterly, thresholds reset after 3 months of real orders.

**RFM for retail buyers (1 to 3 each).** Recency: up to 90 days = 3, 91 to 270 = 2, over 270 = 1. Frequency in 24 months: 3 or more = 3, 2 = 2, 1 = 1. Monetary: top, middle, bottom third of buyers (only once prices exist). Segments: Champions (R3 F3), Loyal (F2 to 3, R2 to 3), New (F1, R3), At risk (R1, F2 to 3), Lapsed (R1, F1).

**Occasion tags.** `occasion-due` 21 days before a stored day and month. `christmas-gifter` for 2 or more orders in November and December. Tags must not infer family or religion.

**B2B tier (placeholders).**

| Tier | Rule | Treatment |
|---|---|---|
| A | 3 or more outlets, or volume above [VOL_A], or 2 or more reorders | Named contact, early stock notes, owner calls |
| B | 1 outlet with a reorder, or volume above [VOL_B] | Monthly check in, reorder reminder at 8 weeks (04 section 3.6) |
| C | First enquiry or sample pack | Price list, one follow up |
| Corporate gifting | Corporate or NGO with an occasion date | Quote early, lead time warning |

**Lead score (owner's follow up order only).** Asked for price 2, 3 or more units 1, business type known 1, reached Review 2, sent order 5, replied 3. Reasons are visible to the owner.

### 5.7 Lifecycle triggers

Marketing triggers need Tier 2 consent. Service messages (order, payment, dispatch, delivered) are part of the contract and contain nothing promotional. Phase A and B: a person sends them from WhatsApp Business labels and quick replies (04 section 3). Automation only when the record exists and volume justifies template cost.

| Trigger | Condition | Content | Stop rule |
|---|---|---|---|
| Welcome | New consent | Thanks, what to expect, story and shop links, no discount (04 3.1) | 3 messages, then monthly |
| Order received (service) | Record created | Ref, items, "we confirm within [CONFIRM_RESPONSE_HOURS] hours" | One |
| Payment instructions (service) | Confirmed | Total, how to pay, ref as account | One, one reminder after 24 hours |
| Dispatch, delivered check (service) | Status change, day after | Courier and window; "Did it arrive well?" | One each |
| Care and story | Day 3 after delivery | Care card, maker story | One |
| Review request | Day 7, reminder day 14 | Review, optional photo permission, no reward (04 3.3) | Two, then never |
| Reorder or complete the family | Day 45 retail, week 8 B2B | Suggest a friend for the animal | Two, then monthly |
| Occasion reminder | 21 days before the day and month | Ideas and delivery cut-off | One per occasion |
| Back in stock | Variant returns | One message (04 3.4) | One |
| Cart rescue | Opt-in and no order in 24 hours | Cart link | One |
| Win back | R1 with consent | Honest update, new animals | One per 6 months |

### 5.8 KPIs

Targets come after a 4 week baseline. Baymard's 70% average abandonment is context, not a target.

| KPI | Definition | Source |
|---|---|---|
| View to cart | Sessions with `add_to_cart` / sessions with `view_item` | GA4 |
| Cart to form | `begin_checkout` / `view_cart` | GA4 |
| Step completion | `wizard_step_complete` by step / step shown | GA4 |
| Send rate | `whatsapp_order_submit` / `begin_checkout` | GA4 |
| Confirmed and paid rate | Confirmed / sent; paid / confirmed | Order record |
| Time to first reply | Minutes from order created to first reply | Order record |
| AOV, units per order | Paid value / paid orders (needs prices) | Order record |
| On time delivery | Delivered by promised date / delivered | Order record |
| Repeat rate 90 days | Buyers with 2 or more orders / buyers | Order record |
| Gift share, B2B lead to order | Gift orders / orders; B2B orders / leads | Order record |
| Channel return | Orders by `source` / sessions by source | Both |
| Opt-in rates | Consent / orders; remember-me / orders | Order record |
| Problems | Complaints and returns by reason | Order record |

### 5.9 Data dictionary (core)

| Field | Type and example | Tier |
|---|---|---|
| `order_ref` | string, MK-261003-A7K2 (prefixes MK WS PT SP CU, D24) | 1 |
| `created_at` | datetime, Africa/Nairobi | 1 |
| `status` | received, confirmed, awaiting_payment, paid, in_production, ready, dispatched, delivered, cancelled, refunded | 1 |
| `customer_type` | gift, business, organisation, diaspora | 1 |
| `name`, `phone_e164`, `email` | strings, phone via lib/phone | 1 |
| `fulfilment`, `zone`, `area`, `county`, `town` | pickup, nairobi, town; A, B, C, pickup | 1 |
| `address_text`, `landmark`, `delivery_notes`, `pin_url` | strings, short retention | 1 |
| `needed_by` | date | 1 |
| `lines[]` | sku, qty, size, colour_key, note (SKU is the key, D5) | 1 |
| `is_gift`, `gift_note`, `recipient_contact_name`, `recipient_contact_phone` | adult only | 1 |
| `price_state`, `subtotal_kes`, `delivery_kes`, `total_kes` | P0 to P3; numbers only when real | 1 |
| `payment_method`, `payment_ref`, `paid_at` | mpesa, bank, cash; receipt code | 1 |
| `source`, `utm_*`, `referrer` | lower case; stored only if analytics consent | 0 to 1 |
| `consent_wa`, `consent_email`, `consent_text_version`, `consent_at` | keep the exact text shown | 2 |
| `birthday_month_adult`, `occasion_type`, `occasion_date`, `interests_*`, `heard_about`, `language`, `contact_channel`, `contact_hours` | | 2 |
| `business_name`, `business_type`, `outlet_location`, `volume_band`, `vat_registered`, `kra_pin`, `po_number` | PIN never in browser | 3 |
| `rfm_r`, `rfm_f`, `rfm_m`, `segment` | computed, never typed | derived |

### 5.10 Event taxonomy

Keeps every name from 03 and D22. **New** marks additions. Every event carries `event_id`, `page_type`, and `currency` "KES" when `value` is present. `value` only when real. `items[]` use `item_id` = SKU, `item_variant` (size and colour), `quantity`, and `price` only when confirmed.

| Event | Fires when | Key params | GA4 | Meta | TikTok |
|---|---|---|---|---|---|
| `view_item_list`, `select_item`, `view_item`, `select_variant` | As in 03 | items, list | Same names | ViewContent on `view_item` | ViewContent on `view_item` |
| `add_to_cart`, `remove_from_cart` | Cart change | items, value if real | Same | AddToCart | AddToCart |
| `view_cart` | Drawer or /cart opened | items | view_cart | none | none |
| `update_cart_line` **new** | Size, colour, qty or note changed | item_id, field | custom | none | none |
| `save_for_later`, `share_list` **new** | Tapped | method, lines_count | custom (`share`) | none | none |
| `suggestion_click` **new** | Complete the family tile | suggestion_type, item_id | custom | none | none |
| `view_size_help`, `select_delivery_area` **new** | Opened, chosen | zone, area (no address) | custom | none | none |
| `begin_checkout` | Wizard step 1 shown | items, checkout_type | begin_checkout | InitiateCheckout | InitiateCheckout |
| `wizard_step_complete`, `wizard_error` **new** | Step done, error shown | step_name, field name only | custom | none | none |
| `add_shipping_info`, `add_payment_info` | Delivery step, payment preference | zone, method | Same | none, AddPaymentInfo | none, AddPaymentInfo |
| `gift_toggle` **new** | Gift option used | has_note, send_direct | custom | none | none |
| `whatsapp_order_submit` | Send tapped | items, order_ref, zone, UTMs | custom, key event | Lead | SubmitForm |
| `whatsapp_click`, `generate_lead`, `newsletter_signup`, `consent_update` | As in 03 and D23 | placement, lead_type | Same | Contact, Lead, Subscribe | Contact, SubmitForm, Subscribe |
| `cart_rescue_optin`, `order_status_view` **new** | Opt-in, status page opened | channel; status (no ref) | custom | none | none |
| `payment_started`, `payment_failed` **new** (C) | STK sent or failed | method, reason_code | custom | none | none |
| `purchase`, `refund` (C only) | Server confirms payment or refund | transaction_id = order_ref, value, items | purchase, refund | Purchase | CompletePayment |
| `review_submit`, `reorder_click`, `referral_share` **new** | Post purchase | item_id | custom | none | none |

`purchase` stays banned in release 1 (D23). In Phase C it is sent from the server (GA4 Measurement Protocol, Meta Conversions API, TikTok Events API), deduplicated by `event_id`, with hashed phone or email only if consented. RULING CHECK: one line amendment to D23 then. Register custom dimensions: `lead_type`, `checkout_type`, `delivery_zone`, `price_state`, `customer_type`, `step_name`, `suggestion_type`, `order_ref`.

### 5.11 Funnels, cohorts, dashboards

| Funnel | Steps | Cut by |
|---|---|---|
| F1 Browse to cart | `view_item_list`, `view_item`, `add_to_cart` | Animal, size |
| F2 Cart to order | `view_cart`, `begin_checkout`, each step, `whatsapp_order_submit` | Device, source, price_state |
| F3 Order to paid | Created, confirmed, paid, delivered (record) | Zone, payment method |
| F4 B2B | /wholesale view, lead, quote sent, order | Business type |
| F5 Gift | `gift_toggle`, note added, sent | Gift vs not |
| F6 Cart rescue | Opt-in, reminder, order within 7 days | Channel |

**Cohorts.** Group by first order month, show share ordering again at month 1, 3, 6, 12. LTV (retail and B2B apart) as cumulative paid value per buyer by cohort, source and first animal. Until prices exist, track orders and units per buyer.

**Dashboards.** Phase B: Google Sheet as the record, Looker Studio on top, GA4 connected. Phase C: same tables in Postgres (Neon through the Vercel Marketplace, verify, with Looker Studio's PostgreSQL connector), Sheet kept as an export.

| Dashboard | For | Panels |
|---|---|---|
| Weekly pulse | Owner | Orders sent, confirmed, paid, delivered; send rate; first reply time; top animals and sources |
| Funnel | Marketing helper | F1 and F2, drop by wizard step, errors by field, device split |
| Delivery | Owner | Orders by zone and area, on time rate, uncollected pickups |
| Customers | Owner | RFM segments, new vs returning, occasion calendar for 8 weeks, opt-in counts |
| B2B | Owner | Leads by type and stage, volume band, reorder due dates |
| Channel | Marketing helper | Source to orders, not only sessions; cost per order if ad spend is entered |
| Quality | Owner | Complaints, returns, reviews, reasons |

---

## 6. Delivery

Every courier and fee below is an option to confirm, not a fact about Mikono.

### 6.1 Capture and offer

| Item | Capture | Offer once the owner confirms |
|---|---|---|
| Pickup points | Pick list in Step 3 | Mikono point and the seven outlets (R2), hours, hold period (Takealot 7 days, Jumia 5; owner sets ours) |
| Nairobi zones | Area list, 18 areas today, zones A and B | Zone fee table, extend from real requests, "Other Nairobi area" always allowed |
| Other towns | County and town | Zone C, courier or bus parcel, cost quoted on WhatsApp |
| Same day or scheduled | Wished date | Same day only with a stated cut-off; scheduled window if offered |
| Landmark and notes | Required for delivery | Gate code, floor, who receives |
| Map pin | Optional | After sending: "Share your location on WhatsApp"; also accept a pasted Google Maps link |
| Recipient is someone else | Gift step | Adult contact only (D16) |

### 6.2 Courier options to confirm

Sources: https://truehost.co.ke/best-courier-services-for-online-business-in-kenya/, https://www.g4s.com/en-ke/what-we-do/services/courier-services, https://posta.co.ke/services/courier-services/. None is recommended without price and coverage.

| Type | Named in sources | Use | To confirm |
|---|---|---|---|
| On demand rider | Sendy (status to verify), Glovo and Uber courier (unverified for parcels), local riders | Same day Nairobi | Fee scale, pickup time, loss cover |
| Courier company | G4S, Fargo Courier, Wells Fargo Courier | Next day Nairobi, major towns | Rates by zone, insurance, tracking |
| Bus parcel service | Easy Coach and similar | Upcountry, low cost | Depot pickup, who collects, loss policy |
| Postal | Posta Kenya | Wide coverage | Speed, tracking |
| Own delivery | Team or trusted rider | Nairobi gift runs | Capacity, cost |
| International | Courier or freight partner | Diaspora export | Customs, duty. Not offered until confirmed (D15) |

### 6.3 Fees (placeholders, 01 section 4.3)

| Zone | Fee | Lead time |
|---|---|---|
| Pickup | [FEE_PICKUP], often free, cheaper than door | [LEAD] |
| A Nairobi central | [FEE_A] | [LEAD_A] |
| B Nairobi outskirts | [FEE_B] | [LEAD_B] |
| C Other Kenya | [FEE_C] or quoted | [LEAD_C] |
| International | Quoted, not offered yet | |

**Free delivery threshold idea (placeholder):** "Free delivery in Nairobi above KES [THRESHOLD]". Set it from real basket data, not a competitor's number, or the line looks unreachable. One plain sentence, no animated bar.

### 6.4 Address, proof, gifts, diaspora

- **Address.** Nairobi addressing is landmark based, so area plus estate or landmark is a fair minimum. Skip Google Places autocomplete in Phase A: it costs per session, needs a key and a consent decision, and handles estates poorly. Use the WhatsApp location pin and an optional "call me when you arrive" tick.
- **Proof of delivery.** Dispatch note with courier name, phone and window. Receiver replies "received", or the courier sends a photo of the parcel at the door (never of a child). The record gets `delivered`, a timestamp and who confirmed. "Not received" or "damaged" opens a case.
- **Gift mode.** Tick "This is a gift". Card preview. "No prices on the slip" on by default. Send to an adult contact. Optional occasion and date for a next-year reminder. The buyer pays, the receiver gets it, and the payment reference quotes the buyer's phone.
- **Diaspora (pay abroad, deliver in Kenya, per D15).** Step 1 answer; email required for the receipt; the adult recipient's area, landmark and phone; payment by bank transfer or payment link now, card through a hosted gateway in Phase C (verify currencies); receipt and status link to the buyer; delivery proof to the buyer with the recipient's permission; a "best hours" field for time zones. Posting an animal abroad stays out until the owner confirms customs and couriers.

---

## 7. Payments

Today's line, "You pay nothing on this site. We arrange payment with you on WhatsApp", is honest and right for Phase A. The aim is to move payment onto the order without losing the human reply that prevents overselling.

### 7.1 Methods

| Method | How it works | Needs | Verdict |
|---|---|---|---|
| M-Pesa Paybill | Buyer pays a business number, account number = order ref | A paybill (verify Safaricom's requirements) | Best reference fit, good for B2B |
| M-Pesa Till | Buyer pays a till | A till | Simple, weaker reference |
| STK push (Daraja) | Server prompts the buyer's phone, callback confirms | Paybill or till with Lipa na M-Pesa Online, production approval (commonly 5 to 15 business days, verify), server, HTTPS callback | Biggest upgrade, Phase C |
| Card via hosted gateway | Provider's page | Paystack, Flutterwave, Pesapal or IntaSend account | Keeps card data off our site. Diaspora. Phase C |
| Bank transfer, Pesalink | Buyer pays the business account | Business bank account | Phase A, B2B and large orders |
| Cash on pickup | Pay at handover | Owner rule on no-shows | Optional |
| Cash on delivery | Pay the rider | Owner decision (01 section 7) | Small ready orders in set zones only, if at all |
| Deposit for custom | Part first | Owner sets percentage | Phase A by M-Pesa or bank, C by STK |

Before choosing a gateway, verify: onboarding for the owner's business type, fees by method, settlement time and place, and M-Pesa STK support.

### 7.2 Now and later

| Capability | Now (A) | Later (B, C) |
|---|---|---|
| Preference | Pick list in Step 2: M-Pesa, bank, cash on pickup, "tell me the options", plus optional text | Drives which button appears |
| Instructions | After confirmation a person replies with total, paybill or till, account = ref | `/pay/[ref]` page with copy buttons (B), then "Pay now" (C) |
| Confirmation | Buyer sends the M-Pesa message or code, team marks `paid` | Callback marks it |
| Receipt | WhatsApp or email message with ref and amount | Automatic after callback |
| Refund | Manual, logged | Provider refund where supported |

### 7.3 STK push design (Phase C)

1. The team confirms the total. The status page shows "Pay KES [total] by M-Pesa" with the phone prefilled and editable.
2. Our server calls M-Pesa Express with the order ref as account reference and stores `CheckoutRequestID`.
3. The callback is checked for source, amount and ref, then the order becomes `paid` with the receipt code.
4. No callback in the window: run a status query. Still unknown: "We are checking. You do not need to pay again."
5. A failed or cancelled prompt offers "Try again" that never creates a second order.

Secrets live only in server environment variables, never `NEXT_PUBLIC_`, with a rate limit on the pay endpoint and logs that hold no secrets.

### 7.4 Fraud and reconciliation

| Risk | Control |
|---|---|
| Fake or forged M-Pesa texts and screenshots | Mark `paid` only when the receipt code matches the Safaricom statement or the callback |
| Wrong or missing reference | Account is always the order ref; else match by amount, phone and time and note it |
| Overpay, underpay | Record the gap, settle in writing the same day |
| Duplicate orders | Same lines from one phone within 10 minutes count as one; ask once |
| Double pay after retry | One payment per order id; refund the second |
| Card chargebacks | Keep delivery proof and messages |
| COD refused | No COD for custom or large orders; optional small deposit |
| Overselling | Human confirmation stays (01 section 7) |
| Routine | Daily statement vs sheet, weekly totals by method, month end export to the accountant with ref, date, total, method, receipt code, VAT line |
| Access | Two named people mark `paid`; every change logged with name and time |

---

## 8. Post-purchase

**Status model.** Buyer sees Received, Confirmed and waiting for payment, Paid, Being made or packed, On the way, Delivered (mapped to the internal statuses in 5.9). Cancelled and refunded are separate lines. Never show a made-up ETA; show the owner's lead time or the courier's window.

**Messages (plain, one action each).**

| Moment | Text |
|---|---|
| Received | "Hello [first name]. We have your order [ref]: [items]. We confirm price, delivery and payment on this chat within [CONFIRM_RESPONSE_HOURS] hours." |
| Confirmed | "Your order [ref] is confirmed. Total KES [total] including delivery to [area]. Pay by [method and number], account [ref]. Delivery planned for [date or window]." |
| Paid | "Thank you. We received KES [amount], receipt [code]." |
| Dispatched | "Your order [ref] is on its way with [courier], phone [phone], expected [window]." |
| Delivered check | "Did [item] arrive well? Reply here if anything is wrong." |

**Tracking page.** `/order/status` takes the reference and the phone, with a rate limit. It shows the stages, items, delivery summary, payment line and a "Message us about this order" button that opens WhatsApp with the ref. No account. Needs the order record (Phase B).

**Review and UGC.** Day 7, reminder day 14, then never (04 3.3). Ask for the review and, separately and unticked, for a photo. No reward. A customer's photo is the customer's, so each needs their own permission, and a child's face needs a parent's written consent.

**Reorder.** "Order this again" rebuilds the cart from the item summary the device already keeps (`mk.orders.v1`). For B2B, "Reorder last list" fills the wholesale form with the last quantities.

**Referral.** "Tell a friend" opens WhatsApp with a short message and a link tagged `source=referral`. No code or reward in Phase A (04 section 7). A later thank you is a free care card, not a discount.

**Problems.** "Report a problem" opens WhatsApp with the ref, a category (late, damaged, wrong item, other) and a photo prompt. The record gets a case with an owner and a due time. Remedy rules come from the owner (01 section 7 item 5).

---

## 9. The 15 wow features

Ranked by impact over effort. S is days, M is 1 to 2 weeks, L is a month or more.

| Rank | Feature | Why it beats a big store | Impact | Effort | Phase |
|---|---|---|---|---|---|
| 1 | Shareable cart link, "send my list to someone" | Any device, a spouse can approve, no account | High | S | A |
| 2 | Honest price and fee messaging (P0 to P3) | Never fakes a total. Trust is the product. | High | S | A |
| 3 | Edit size and colour in the cart with size help | Fewer wrong sizes, fewer trips back | High | S | A |
| 4 | Delivery estimate by area before the form | What Takealot and Naivas buyers expect, with an honest fallback | High | S to M | A, owner |
| 5 | Reorder last list in two taps | Uses data already on the device. B2B repeat is the main revenue line | High | S | A |
| 6 | Gift mode: card preview, no-price slip, adult recipient | Jellycat style gifting, with no child data | High | M | A |
| 7 | Order status page by reference and phone | No more "where is it?" messages | High | M | B |
| 8 | Remember me on this device, unticked | Shop Pay style speed with no account or server | Medium | S | A, RULING CHECK |
| 9 | STK push on the order page, auto confirmed | The Kenyan payment moment: prompt, PIN, "Paid" | High | L | C |
| 10 | "Needed by" feasibility check | "Can arrive by 20 December" or "We will confirm" | Medium | M | A, owner |
| 11 | Complete the family, size matched | An upsell that reads as a kind idea | Medium | S | A |
| 12 | Pay instructions page with copy buttons | Removes the commonest WhatsApp payment error | Medium | S to M | B |
| 13 | Occasion reminders with consent | Adult data only, one message per occasion | Medium | M | B |
| 14 | Delivery proof photo and maker card | Post purchase trust. Maker names only with consent (R8) | Medium | M | B |
| 15 | Works on slow phones and offline: draft, cart, copy-order fallback | Beats big stores on weak networks | Medium | M | A |

Not yet: loyalty points, chat bots, countdowns, spin wheels, buy now pay later, saved cards, marketplace tools (08 section 4 puts those after fulfilment is proven).

---

## 10. Roadmap and gates

| Phase | Scope | Needs | Gate to move on |
|---|---|---|---|
| A. Frontend now | Section 3 items 1 to 14 and 16, shareable link, wizard additions, gift mode, remember-me if approved, consent and event taxonomy, splash fix for deep links | No server | Events verified in GTM Preview, 4 week baseline captured, owner has set prices or chosen to stay on P0 |
| B. Order record | Server route stores each order and enquiry (Sheet first), status and pay pages, Tier 2 forms, email provider, opt-in cart rescue, Looker Studio | Owner owns the Sheet, picks an email provider, privacy notice updated, named people on WhatsApp | The team cannot keep up by hand, or [N] orders a week (owner sets) |
| C. Payments | Daraja STK or one gateway, auto receipt, callback, reconciliation, server events (Meta CAPI, TikTok Events API, GA4 MP) | Registered business, paybill or till, gateway account, VAT and eTIMS answers | 4 weeks of reconciled payments with no mismatch, refund rule written |
| D. Accounts and trade portal | Phone code login, saved addresses, cross-device cart, trade reorder portal | Repeat volume, owner decision on wholesale visibility (D20) | Repeat B2B share the owner sets |
| E. Super store | Other makers' goods | Fulfilment, returns, vetting proven | Only after C and D are stable |

Each phase has one stop rule: if time to first reply or on time delivery worsens, pause and fix before the next phase.

---

## 11. Conflicts with files 16 and 17, and how to resolve them

| # | Topic | This file (earlier draft) | 16 and 17 | Resolution used above |
|---|---|---|---|---|
| 1 | Contact and address retention | 24 months, address 90 days | 17: 90 days after delivery. 16: contacts 24 months, addresses 24 months | Owner and advocate pick one. 17 is the stricter and the safer default |
| 2 | Order records | 7 years | 5 years, no contact details | 5 years, verify tax period |
| 3 | Gift note | 30 days | 16: 90 days | Pick 30 days (17 stance on child data) |
| 4 | Occasion types | Included baby shower, Eid, graduation, Mother's Day | 17 2.1: only Birthday, Christmas, Gift, Corporate, Other, day and month, no year | 17 adopted |
| 5 | Customer type "parent" | Used | 17: never "parent" | 17 adopted |
| 6 | Remember me storage | New key `mk.me.v1` | 16: `mk.profile.v1`, 90 days | 16 adopted |
| 7 | Occasion reminder lead | 28 days | 17: 3 weeks | 17 adopted |
| 8 | Event names | `wizard_error`, `share_list`, `save_for_later` and others | 16 section 8 adds `wizard_step_view`, `wizard_abandon`, `update_line`, `profile_remember` and more | Use 16 section 8 as the build list; section 5.10 here is the strategy view |
| 9 | Consent set | Marketing, remember me | 17: four boxes (WhatsApp, email, occasion, remember me) plus advertising and record-linking switches | 17 adopted |
| 10 | Data store | Sheet first | 16: Neon Postgres in P2 | 16 adopted; Sheet only as a stopgap export |
| 11 | Tier numbering | Tier 0 to 3 as briefed | 16 uses T0 to T5 by purpose | Briefed tiers are a marketing view; map by purpose when building |

## 12. Questions only the owner can answer

The first eight block Phase A items marked "owner" and all of Phase B.

**Prices and money**
1. Retail prices by size (S, M, L, XL), any premium animals or colourways, and when `pricesConfirmed` can flip.
2. Do you want a free delivery threshold, a bundle discount, gift wrap, and at what figures?
3. Minimum order for delivery, and for wholesale?

**Delivery**
4. Which Nairobi areas you serve, in which zones, at what fee, and which you do not.
5. Who delivers (own rider, courier, bus parcel, mix), at what rate and speed, and do you hold accounts?
6. Pickup: where, which hours, how long you hold an order. Do the seven outlets hold orders for customers?
7. Lead times by size, which colourways are ready versus made to order, the same day cut-off if any, and last order dates for Christmas in Nairobi, upcountry and abroad.
8. Will you ship abroad, or only take diaspora payments for delivery in Kenya (my advice)?

**Payments**
9. What you hold today: M-Pesa till, paybill, business bank account. Who is the account holder? Is the business registered, and as what?
10. Daraja production access yourself, or one gateway (Paystack, Flutterwave, Pesapal, IntaSend) for M-Pesa and cards? Do you want card payments for diaspora?
11. Cash on pickup or delivery, for which orders? What deposit for custom work?
12. Your refund and exchange rule (01 section 7 item 5).

**Tax and legal**
13. Are you VAT registered, and do you issue eTIMS invoices today? Do wholesale buyers need your PIN and an invoice on every order?
14. Are you registered with the Office of the Data Protection Commissioner, and who is the named contact for data requests? How long do you want to keep order records (proposal: 24 months, 7 years for accounts)?

**Operations and data**
15. Who reads WhatsApp, in what hours, and what reply time can you promise? Do trade orders use a separate number (D19)?
16. Who owns the order Sheet, and which email provider do you choose?
17. Do you approve remember-me (4.1), the opt-in cart reminder and the occasion reminder?
18. Do you approve a maker card and a delivery photo in the parcel, and which makers agree to be named (R8)?
19. Which seasons matter for stockists: Christmas, tourist high season, school terms (04 section 3.6)?

Open verifications before money or legal decisions: Daraja go-live terms, gateway fees and onboarding, Stripe availability, Sendy status, WhatsApp template pricing, ODPC registration, eTIMS duties, record retention periods.
