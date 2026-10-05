# 16. Cart, Checkout, Persistence and Orders: Build Spec (v1)

Audience: ONE implementation agent. Everything here is build-ready unless marked OPEN or UNVERIFIED.
Status of inputs: `strategy/15-checkout-strategy.md` did not exist when this was written (checked at the end). Section 4 therefore defines its own data tiers, lawful bases and retention. If 15 appears later, reconcile the tier table in 2.9 and the retention table in 4.7 against it and note differences at the foot of this file.
Binding sources: 00-CHARTER, 07-BUILD-DECISIONS (R1 to R11, D1 to D40), 13-density-system, 14-card-system. Where this spec changes a D item, it is listed in section 0.2.

---

## 0. Ground rules

### 0.1 Hard rules carried into every screen
1. No invented prices, fees, lead times, stock counts, payment methods, hours, pickup points, delivery zones or claims. Every unknown is a typed placeholder constant that is `null` or an empty array today, and the UI states "confirmed on WhatsApp".
2. D16: no child names, ages, birthdays or school names are collected anywhere. Hints say so. Adult contacts only.
3. No dark patterns: no countdowns, no scarcity text, no pre-ticked boxes, no "Are you sure you want to leave", no guilt wording on decline buttons, equal visual weight for Accept and Decline, no pop-up on first paint. Withdrawing consent is as easy as giving it.
4. Word "checkout" is never shown (D13). Words used: "order list", "order form", "send order".
5. Persistence is best effort and never blocks ordering: the WhatsApp message always opens, with or without the API.
6. Every control: visual height 32 to 36px allowed (R11), hit area at least 44px, text 14px body, 13px secondary, 12px labels. Contrast AA. No em or en dashes anywhere, including code comments and test names.
7. UI palette and card rules from 06, 13, 14 apply. Cart line thumbnails and suggestion cards use the shipped `components/card` system (`Card`, `CardGrid kind="p3"` on phones, 3 columns at 360 and up, 2 columns at 320).

### 0.2 Changes to earlier decisions (owner request supersedes; confirm in section 12)
| Item | Change |
|---|---|
| D14 | The wizard now serves B2B inside the same flow. KRA PIN, invoice name and PO number return as optional B2B fields. The redirect to `/wholesale` becomes a soft suggestion only when units exceed `QUOTE_THRESHOLD_UNITS` or the customer picks a business type, always with "Continue here" as an equal button. |
| D18 | Release 1 stays server-free. Server persistence is Phase 2 and needs the owner's written go-ahead, a privacy notice update and an ODPC registration check (section 4.8). Marketing consent text travels in the WhatsApp message in P1. |
| D22 | New event names are added in section 8.2. `lib/track.ts` `TRACK_EVENTS` and 03 section 6.4 are updated in P1. |
| D24 | Order ref format `MK-YYMMDD-XXXX` is unchanged. From P2 the server reserves it (4.4). |

### 0.3 File map (create or change)
| File | Action |
|---|---|
| `lib/cart.tsx` | Migrate to `mk.cart.v2` (line `note`, `giftWrap`, `addedAt`), keep v1 reader, add `updateLine`, `saveForLater`, `moveToCart`, `hydrate` helper |
| `lib/cartCatalogue.ts` | New. Build-time map sku to `{name, colourLabel, size, image, availability, priceKes, group, colourAsk}`. Cart never trusts stored labels |
| `lib/pricing.ts` | New. `computeTotals()` and `priceMode` (ask or confirmed) |
| `lib/saved.ts` | New. Save for later store `mk.saved.v1` |
| `lib/shareList.ts` | New. Encode and decode share links (reuses the `family.ts` codec shape) |
| `lib/profile.ts` | New. Device profile `mk.profile.v1` |
| `lib/schema/order.ts` | New. Zod schemas shared by client and server |
| `lib/orderForm.ts` | Replace `Form`, `StepId`, `validateStep` with v2 (section 2) |
| `lib/whatsapp.ts` | Replace `buildOrderMessage` with template v2 (section 5.5) |
| `components/OrderWizard.tsx` | Split into `components/wizard/*` (one file per step) |
| `components/CartView.tsx`, `CartLines.tsx`, `CartDrawer.tsx` | Rebuild per section 1 |
| `components/ConsentTiers.tsx` | New |
| `app/list/page.tsx` | New. Read-only shared list landing |
| `app/order/track/page.tsx` | New (P2) |
| `app/api/**` | New (P2), section 5 |
| `data/pickupPoints.ts`, `data/payments.ts`, `data/leadTime.ts`, `data/occasions.ts` | New placeholder files, empty today |

---

## 1. THE CART

### 1.1 Data model (`mk.cart.v2`)
```ts
interface CartLineV2 {
  sku: string;            // {slug}-{colourKey}-{size} lowercase (D4, D5). colourKey "ask" allowed
  qty: number;            // 1..MAX_QTY_PER_LINE (20)
  note?: string;          // per line, max 120 chars, control chars stripped
  giftWrap?: boolean;     // per line
  addedAt: number;        // ms
}
interface Stored { v: 2; updatedAt: number; lines: CartLineV2[] }
```
Stored labels (name, image) are dropped. They are resolved from `cartCatalogue` at render, so renamed or removed products are handled. Migration: on load, if `mk.cart.v2` is absent and `mk.cart.v1` exists, map v1 lines (keep sku and qty), write v2, delete v1. Expiry stays 30 days from last change (`EXPIRY_MS`); the cart page says "Kept on this device for 30 days" once, in secondary text. MAX_LINES 40 unchanged.

### 1.2 Surfaces and states
| Surface | Behaviour |
|---|---|
| Header cart button | Count badge of units. Never animates more than one 150ms scale on add; none under reduced motion. `aria-label="Order list, N items"` |
| Add to cart | Toast plus count update. Drawer does NOT auto open (D13) |
| Mini cart (drawer) | Opens only on tap. Modal dialog: focus trap, Esc closes, focus returns to the button, scroll lock, `aria-modal`. Lists lines (thumb 48px, name, "Colour, size", qty stepper, remove), the pricing summary block (1.6), buttons "View cart" and "Continue to order form". Drawer height max 85dvh, sticky footer buttons |
| Cart page `/cart` | Two column from 1024 (lines left, summary right). Phone: lines, then summary card, then a sticky bottom bar "Continue to order form" (D34: WhatsApp float hides on `/cart`) |
| Wizard side panel | Read only list with "Change items" link |

States the cart page must render, each with a test (section 9):
1. **Pre hydration**: skeleton text "Loading your order list", no layout shift once lines appear (reserve `min-h`).
2. **Empty**: see 1.9.
3. **Normal**: lines, summary.
4. **Storage blocked** (`notice: "memory"`): banner "Your browser is not saving your order list. It will be forgotten when you close this tab. You can still send it." plus a "Copy my list" button and the share link (1.5).
5. **Corrupt** (`notice: "corrupt"`): banner, fresh cart, the corrupt raw value kept under `mk.cart.corrupt` for 7 days then removed.
6. **Stale line** (sku not in `cartCatalogue`): row greyed with "This item is no longer listed. Remove it or ask us on WhatsApp." The line is excluded from the send unless the customer taps "Ask us about it", which keeps it as a free text line in the message marked `(not in catalogue)`.
7. **Availability**: per D9. `ready` shows nothing. `made_to_order` shows "Made to order, we confirm the time". `limited` shows "Limited, we confirm on WhatsApp" (no counts, D10). `ask` shows "We confirm availability on WhatsApp". `unavailable` shows "Not available right now" with "Ask when it is back" (opens WhatsApp with a prefilled question, no tracking of stock) and excludes it from the order.
8. **At max qty**: inline note linking to `/wholesale`.
9. **List full (40 lines)**: toast "Your order list is full. For a big order, use the wholesale request."
10. **Over quote threshold** (units above `QUOTE_THRESHOLD_UNITS`): soft prompt (exists as `QuotePrompt`), keep, never block.
11. **Multi tab**: `storage` event re-reads (exists). A changed cart in another tab shows a polite status "Your order list was updated in another tab."
12. **Offline**: cart works fully (all local). A small "You are offline. You can still build your list" appears on `offline` event; send is handled in 2.10.
13. **Prices flip** (`pricesConfirmed` becomes true while a cart exists): the next render switches mode (1.6) with no migration needed because prices come from `cartCatalogue`.

### 1.3 Line editing (cart page and drawer)
Each line is a Card-style row (compact, 13px secondary text). Controls:
| Control | Rules |
|---|---|
| Size | Segmented chips S M L XL from the product's `sizes`. Changing to a sku that already exists merges lines (qty added, clamped to 20) and toasts "Merged with the same animal in your list." Uses the `updateLine` merge pattern from `lib/helpers/family.ts` |
| Colour | Swatch buttons from the product's colourways with printed colour name (D30). For `colourAsk` products show one fixed chip "Colour to confirm" and no swatches |
| Quantity | Existing stepper. Typing allowed, clamped 1 to 20. Reaching 0 via minus is not allowed; use Remove (undo available for 8 seconds in an inline status, `role="status"`) |
| Note | "Add a note for this one" reveals a text input, 120 chars, counter, hint "Colour wishes, for example. Please do not include a child's name, age or school." |
| Gift wrap | Checkbox per line "Gift wrap this one". Helper text: "We confirm if wrapping has a cost." No price shown until `giftWrapKes` exists in `data/facts.ts` (placeholder `null`) |
| Save for later | Moves the line to `mk.saved.v1` (1.4). Not offered for the last line of a one line cart? It is offered. The cart then shows the empty state with the saved row above it |
| Remove | Undo as above |

Each action fires an event (section 8) with the changed fields only.

### 1.4 Save for later
`mk.saved.v1`: `{ v: 1, updatedAt, items: [{ sku, qty, note?, savedAt }] }`, max 20 items, expires 30 days after `updatedAt`. UI: a section "Saved for later (N)" under the cart lines, collapsed on phones when empty-cart rescue is not showing; each item has "Move to order list" and "Remove". Moving merges by sku. Saved items appear on the empty cart page first (1.9). Cleared by "Clear my saved details".

### 1.5 Share my list on WhatsApp
Link form: `https://{site}/list#list=elephant-grey-m.2,giraffe-orange-l`. The hash is never sent to a server, which keeps shares private and avoids a database. Codec: `encodeShare(lines)` and `decodeShare(hash, animals)` generalising `lib/helpers/family.ts` (`HASH_PREFIX = "list="`; same sku and `.qty` grammar; unknown skus silently dropped; max 40 parts). Notes and gift wrap are not shared.
- Button "Share my list" in the cart summary: builds `https://wa.me/?text=` (no number, so the customer picks a contact) with text: `Here is my Mikono Creations list (N animals). Have a look and tell me what you think:\n{link}`. If `navigator.share` exists use it, else open wa.me, else "Copy link" with a polite status.
- `/list` page: read only cards of the decoded lines (names from catalogue), summary "N animals", buttons "Add all to my order list" (merges, then goes to `/cart`) and "Choose different ones" (`/shop`). Page is `noindex`. Empty or invalid hash: "This list link did not work. You can still browse the animals."
- No names or phone numbers are inside the link. Event `share_list` with `method` and `item_count` only.

### 1.6 Delivery estimate and price handling
`lib/pricing.ts`:
```ts
type PriceMode = "ask" | "confirmed";        // from data/facts pricesConfirmed (R7, D11)
interface Totals {
  mode: PriceMode;
  lines: Array<{ sku: string; unitKes: number | null; totalKes: number | null }>;
  subtotalKes: number | null;     // null if any line price missing or mode is ask
  deliveryFeeKes: number | null;  // from deliveryAreas feeKes; null = to be confirmed
  discountKes: number;            // 0 until promo exists
  totalKes: number | null;        // null unless subtotal known AND (pickup OR fee known)
  totalNote: "none" | "plus_delivery_tbc";
}
```
Pure function, unit tested. No rounding surprises: integers only.

**Mode ask (today).** Summary card, in this order:
1. "N animals in M lines".
2. Block `data-testid="prices-on-whatsapp"`: heading "Prices are confirmed on WhatsApp", text "We send you the price for each animal, the delivery cost and how to pay. Nothing is charged on this site."
3. Delivery estimate (below).
4. Buttons.
Line rows show "Price on request" in the price slot (same fixed row as cards, D12). No "KES 0", no dashes, no totals, no promo field.

**Mode confirmed (ready to switch).** Same card shows: each line "unit x qty = line total", then rows Subtotal, Delivery (fee or "to be confirmed"), Discount (only if above 0), Total (or "Subtotal plus delivery"), all `tabular-nums`, "KES 1,500" format via `Intl.NumberFormat("en-KE")`. Mode flips by the data flag only; no code change. Promo code: component `PromoField` renders only when `PROMO_ENABLED` (constant false) and then offers an input, "Apply" button and an error "That code did not work." Server validation is P4 or later. Placeholder test ensures the field is absent now and present when the constant is true.

**Delivery estimate by area** (cart and wizard share state `mk.delivery.v1` = `{fulfilment, area, county, town}`, device only, 30 days):
- Radio chips: Pickup, Nairobi, Other Kenyan town.
- Nairobi: select from `deliveryAreas` plus "Other Nairobi area". Shows zone ("Zone A") only when zones are confirmed (`ZONES_CONFIRMED` flag false today, so zone is hidden) and fee from `feeKes` or "Delivery cost confirmed on WhatsApp".
- Other town: county select from `counties`, town text. Text: "We confirm how it travels, the cost and the time."
- Pickup: lists `pickupPoints` when non empty, else "We confirm the pickup place on WhatsApp."
- Lead time: `data/leadTime.ts` exports `LEAD_TIME_DAYS: number | null`. If null show "We confirm timing on WhatsApp." If set show "Usually N working days after we confirm" only when the owner provides it.
- This is an estimate: label "Estimate only". The wizard prefills from it.

### 1.7 Complete the family suggestions
Source: the serialisable `HelperAnimal[]` already built from the real catalogue (`lib/helpers/types.ts`, `data/catalogue.generated.json`). Rules (pure function `suggestFamily(animals, lines, max=4)`):
1. Candidate animals are those not already in the cart by `slug`.
2. Prefer the same `group` as the animal with the highest qty in the cart; then other groups in catalogue order. Deterministic, no randomness, no "popular" claims (D27).
3. Skip `colourAsk` animals only if their images are group photos; otherwise include with "Colour to confirm".
4. Heading "Complete the family" with sub line "Animals that sit well with what you chose." (no claims). Shown only when the cart has 1 to 12 lines and at least 1 candidate.
5. Rendered as `CardGrid kind="p3"` cards: photo, name, a size select (default: the size most used in the cart, else M), and an "Add" button. Adding fires `add_to_cart` with `list_name: "cart_family"`. Colour defaults to the first colourway (the image shown), printed under the name.
6. Link "Open the family builder" to `/build-a-family`. Collapsible on phones; collapsed state remembered for the session.

### 1.8 Cart recovery nudges (non manipulative)
- Returning with a non empty cart older than 24 hours: one inline banner at the top of `/cart` only ("Welcome back. Your order list is still here: N animals."), with buttons "Continue to order form" and "Dismiss". No pop-up, no header change, no banner on other pages. Shown at most once per 7 days (`mk.nudge.v1`), dismissal remembered.
- Draft resume (exists): keep the "Welcome back" panel in the wizard with Continue and Start again, equal weight.
- Optional WhatsApp reminder (P3 only): a checkbox on the cart page "Remind me about this list on WhatsApp" with phone input, separate consent record purpose `cart_reminder`, one message maximum, sent only after 48 hours, text states it is a single reminder and how to stop. Unticked, never default. Not built in P1 or P2.
- Never used: countdowns, "others are viewing", "only N left", "your items are selling fast", reminder emails without separate consent.

### 1.9 Empty cart rescue
Order of blocks: (1) one line "Your order list is empty. Add an animal, choose a colour and a size, and it appears here." (2) "Saved for later" items if any (1.4). (3) "Order again" with the last order from `mk.orders.v1` (3.4). (4) Three quick entry cards in `CardGrid kind="three"`: "Safari animals", "Domestic animals", "More animals" with real photos. (5) Link "Not sure what to pick? Gift finder" and "Make a custom piece". (6) WhatsApp text link "Ask us on WhatsApp" (event `whatsapp_click` with `context: "empty_cart"`). Mascot art is allowed (existing `Character`). No timers, no discount offers.

### 1.10 Accessibility, mobile and density
- Line list is a `ul`; each line `li` has an accessible name "Grey Elephant, size M, quantity 2". Qty stepper is `role="group"` with labelled buttons (exists). Remove, save, share buttons carry names that include the animal.
- Live region `aria-live="polite"` announces add, remove, merge, saved, undo. Focus after Remove goes to the next line's name link, or the empty state heading if none. Focus after Undo returns to the restored line.
- Drawer and any bottom sheet obey `prefers-reduced-motion`.
- Phone layout (320 to 430): single column; line row = 56px thumb, text block, controls wrapping under the text; qty stepper visual 32px with 44px hit; summary is a card below the lines with a sticky bar that never overlaps the last line (bottom padding equals bar height plus `env(safe-area-inset-bottom)`); no horizontal scroll at 320 even at 200% text zoom. Suggestion grid uses `minmax(6.5rem, 1fr)` (13 section 4).
- Touch: swipe to remove is NOT used (no hidden gestures).

---

## 2. THE CHECKOUT WIZARD v2

Single page feel: one route `/order`, one `<form noValidate>`, steps swap in place, the URL hash `#step-delivery` is updated with `history.replaceState` so Back works, a progress bar on phones and a stepper from 768, a sticky action bar (Back, Next) that never coexists with the WhatsApp float (D34). Autosave draft every 250ms (existing, 24 hours), excluding KRA PIN (2.6).

### 2.1 Steps and budgets
| # | Step id | Title | Shown when | New customer budget | Returning customer budget |
|---|---|---|---|---|---|
| 1 | `who` | Who is ordering | always | 8s | 3s (preselected from profile, "Change" link) |
| 2 | `contact` | Your details | always | 30s | 5s (prefilled, edit only if needed) |
| 3 | `delivery` | Delivery or pickup | always | 40s | 10s |
| 4 | `extras` | Gift and business details | gift block always optional; business block only for B2B types | 20s or skip in 3s | 3s |
| 5 | `review` | Review and send | always | 30s | 15s |
Total: new about 2 minutes, returning at most 36 to 60 seconds of work, so under the 90 second target even with reading time. Step count is computed ("Step 2 of 5"); `extras` is skippable with "Skip" which still shows consent on review. Moving between steps never loses data. Each step heading receives focus on entry; the tab title reads "Step N of M: Title | Mikono Creations" (exists).

### 2.2 Step 1: Who is ordering
Radio cards (2 columns on phones, compact), single select, required. `customerType` enum:
| value | Label | Segment |
|---|---|---|
| `parent` | Parent or family | B2C |
| `gifter` | Buying a gift | B2C |
| `retailer` | Shop or retailer | B2B |
| `lodge_hotel` | Lodge or hotel | B2B |
| `school` | School | B2B |
| `ngo` | NGO or charity | B2B |
| `corporate` | Company or corporate gifting | B2B |
| `other` | Something else | B2C |
Skip logic: B2B types set `segment = "b2b"`, enable the business block in `extras`, show the `QuotePrompt`-style soft note ("For larger or regular orders our wholesale request may suit you. You can also continue here.") with equal buttons. Gift block still available to B2B (corporate gifts). Microcopy under legend: "This helps us reply in the right way. It is not stored unless you send the order." Event `wizard_step_complete` carries `customer_type`.

### 2.3 Step 2: Your details
| Field | Req | Rules | Microcopy |
|---|---|---|---|
| `name` | yes | 2 to 80 chars, trimmed, autocomplete `name` | "Your name" |
| `phone` | yes | `normalisePhone` ok (accepts 07xx, 01xx, +254, intl). Store E.164 | "Your WhatsApp number. We message you on this number about this order." (Meta opt-in statement, see 2.9) |
| `email` | no | regex as today, max 120 | "Email (optional). For a copy of your order details if you want one." No copy is sent in P1; wording changes to the real use only when emails are sent |
| `contactChannel` | no | `whatsapp` (default), `call`, `sms`, `email` | "How should we reach you?" |
| `contactHours` | no | `morning`, `afternoon`, `evening`, `anytime` (default) | "Best time to reach you" shown only if channel is `call` |
| `language` | no | `en` (default), `sw` | "Reply in" English or Kiswahili |
Returning profile: if `mk.profile.v1` exists, fields are prefilled and a one line "Using your saved details. Not you? Clear them." appears. `Enter` moves to Next. Autofill attributes set. Inline validation on blur, error summary on Next (exists, `ErrorSummary`).

### 2.4 Step 3: Delivery or pickup
`fulfilment` radio: `pickup`, `nairobi`, `town`. Defaults from `mk.delivery.v1` if set in the cart.
- **Pickup**: `pickupPoint` select from `data/pickupPoints.ts`. If the array is empty: no select, text "We confirm the pickup place and time on WhatsApp."
- **Nairobi**: `area` select (`deliveryAreas` plus Other), `areaOther` if Other (2 to 80), `landmark` (estate, street, building or landmark, 3 to 200, required), `deliveryNotes` (optional, 300), `mapsPin` (optional, see below). Fee line: "Delivery cost: {fee} KES" if `feeKes` set else "Delivery cost: confirmed on WhatsApp". Zone shown only if `ZONES_CONFIRMED`.
- **Other town**: `county` select (required), `town` (required 2 to 80), `landmark` optional ("A parcel office or shop name works"), `deliveryNotes`, `mapsPin`.
- `mapsPin`: optional URL, accepted hosts `maps.app.goo.gl`, `goo.gl`, `www.google.com`, `google.com`, `maps.google.com` with path starting `/maps`. https only, 300 chars. Help text "Share your location from Google Maps and paste the link. Optional." Never fetched by the server. Invalid: "That does not look like a Google Maps link. Leave it empty if you prefer."
- **Someone else receives it** (toggle `recipientDifferent`): reveals `recipientName` (adult, 2 to 80) and `recipientPhone` (`normalisePhone`). Hint "An adult we can call at delivery. Please do not add a child's name or age." This single block replaces the old `sendDirect` pair; `sendDirect` in the gift step now only controls packaging (2.5).
- **Date wish**: `dateWish` date picker, `min` = tomorrow Africa/Nairobi (`tomorrowISO`), `max` = +365 days, optional. Lead time warning placeholder: if `LEAD_TIME_DAYS` is set and the date is within that many days, show a non blocking warning "This is sooner than we usually manage ({N} days). We tell you what is possible." If null, show "A wish, not a promise. Handmade pieces take time, and we confirm what is possible." Never blocks.
- **Time window** (when delivering): `timeWindow` `morning`, `afternoon`, `anytime` (default) "We confirm the exact time." No clock times invented.
- `callOnArrival` checkbox "Call me when the rider arrives" (default unticked).
- Validation errors are per field as in current `orderForm.ts`; new messages follow the same warm style.

### 2.5 Step 4: Gift options and business details (progressive disclosure)
Two `<details>`-style sections (real buttons with `aria-expanded`), both closed unless relevant. Gift section opens by default for `gifter` and `corporate`.
**Gift** (all optional):
| Field | Rules |
|---|---|
| `isGift` | toggle "This is a gift". Reveals the rest |
| `giftNote` | 240 chars with counter, hint "Please do not include a child's surname, school or age." |
| `giftWrap` | "Gift wrap the whole order". Per line wrap from the cart is shown read only with a link to change |
| `anonymous` | "Do not say who it is from" (the recipient adult sees no sender name on the note or message we send them) |
| `sendDirect` | "Deliver straight to the person receiving it". Requires `recipientDifferent`; if off, turning it on turns on `recipientDifferent` and scrolls to the delivery fields |
**Business** (B2B types only, all optional except `businessName`):
| Field | Rules |
|---|---|
| `businessName` | required for B2B, 2 to 120 |
| `businessType` | select: Gift shop, Lodge or camp, Hotel, School, NGO or charity, Corporate, Online shop, Other |
| `outletLocation` | town or area, 2 to 120, "Where will the animals be sold or used?" |
| `volumeBand` | select: Under 20, 20 to 49, 50 to 99, 100 or more per month; "Roughly, per month. A guess is fine." |
| `invoiceName` | 2 to 120, "Name for the invoice, if different" |
| `kraPin` | soft optional. Format `^[AP]\d{9}[A-Z]$` case insensitive. Mismatch shows a warning only ("This does not look like a KRA PIN. Check it, or leave it empty.") and never blocks. Not autosaved, not in profile, not in the API payload (2.6) |
| `poNumber` | 40 chars, optional |
If total units exceed `QUOTE_THRESHOLD_UNITS` for a B2B customer, text "We will confirm wholesale terms on WhatsApp" is shown, nothing else changes. No wholesale price appears (D20).

### 2.6 KRA PIN handling (binding)
Held in React state only. Excluded from `writeDraft`, `mk.profile.v1`, analytics, logs and the API (`kraPin` is not in the Zod schema, so a request containing it fails with `VALIDATION_FAILED` if sent by mistake). It is included only in the WhatsApp message to the business and shown masked on review ("A12****89B"). A unit test asserts a draft JSON never contains the field name.

### 2.7 Occasion, interests, source (optional "Help us suggest" panel on the review step)
A closed `<details>` titled "Help us suggest (optional)". Contents:
- `occasion`: select from `data/occasions.ts` (Birthday, Baby gift, Christmas, School term gift, Corporate gift, Shop restock, Just browsing). Type only. No dates, no child details here.
- `interests`: multi select chips from catalogue groups (Safari, Domestic, Sea, More) and colour families from `data/colours.ts`.
- `heardFrom`: select (Instagram, Facebook, TikTok, WhatsApp status or a friend, Google search, A shop or stockist, Event, Other with 80 char text). If UTM `utm_source` exists it is stored separately as `source`; `heardFrom` is the person's own words.
Purpose line: "We use this only to suggest animals that suit you. It is optional." Interests are stored on the server only when at least one marketing tier is ticked (lawful basis consent); otherwise they travel in the message for this order only.

### 2.8 Step 5: Review and send
Blocks (editable via "Edit" links, existing pattern): Items (link to cart), Who, Details, Delivery, Gift, Business, Help us suggest. Then in this order:
1. **Payment preference.** Today: textarea `paymentNote` (200), label "Tell us how you prefer to pay", hint "You pay nothing on this site. We send payment instructions on WhatsApp after we confirm your order." When `data/payments.ts` is non empty, a radio group of those methods appears above the note. No methods are named until the owner confirms them.
2. **Marketing consent tiers** (2.9), three separate unticked checkboxes.
3. **Terms acknowledgement**: required unticked checkbox "I have read the Terms and the Privacy notice." with links (new tab not used; same tab with draft safe). Error: "Please tick to confirm you have read them." This is not a consent to marketing and is stated in the Privacy notice as acknowledgement only.
4. "See the message we will send" disclosure (exists).
5. Primary button "Send order on WhatsApp" (or "Copy my order message" if the number is unset) and secondary "Copy order text instead".
6. Reassurance text: "Nothing is charged here. We reply on WhatsApp to confirm items, price and delivery, and arrange payment with you there."

### 2.9 Consent tiers and data captured per tier
Three consent checkboxes, each separate, unticked, with its own purpose line, never bundled with Terms:
| Tier key | Label | Purpose line shown under it |
|---|---|---|
| `whatsapp_updates` | Send me news and offers on WhatsApp | "News about new animals and offers. At most {FREQ} messages a month. Reply STOP any time." `{FREQ}` is an owner decision (open). Until set, the line reads "Reply STOP any time." |
| `email_newsletter` | Send me the newsletter by email | "New animals and stories from the makers. Unsubscribe in one click." Hidden if no email entered; otherwise shown. (Disabled until an email provider exists; in P1 it travels in the message as intent only) |
| `occasion_reminders` | Remind me before an occasion | "One reminder before the date you choose, nothing else. We keep only the occasion type and date, never a child's name or age." Reveals an `occasionType` select and a date picker. |
Service messages (order confirmation, status, delivery) are not marketing. The line under the phone field says so and it is the opt-in statement for business initiated WhatsApp templates (Meta policy requires an opt-in that names WhatsApp and the type of messages; verify wording against current Meta policy before P3, UNVERIFIED).

| Tier | Fields | Purpose | Lawful basis (Data Protection Act 2019, verify with counsel) | Retention |
|---|---|---|---|---|
| T0 Device only | cart, saved items, draft, delivery estimate, optional profile | Make the site work for the visitor | Strictly necessary / user's own device | Cart 30 days, draft 24 hours, profile 90 days, saved 30 days, clearable |
| T1 Order essentials | name, phone, customer type, items, payment note, notes | Fulfil the order | Performance of a contract (s.30) | Order records 5 years then anonymised (tax record keeping, verify) |
| T2 Delivery | area or town, county, landmark, pin link, notes, date and time wishes, recipient adult name and phone, contact channel, hours, language | Deliver and contact | Contract | Address fields deleted 24 months after delivery; recipient contact deleted 90 days after delivery |
| T3 Gift | note, wrap, anonymous, send direct | Prepare and deliver the gift | Contract | Note deleted 90 days after delivery |
| T4 Business | business name, type, outlet, volume, invoice name, PO number (KRA PIN never stored) | Quote, invoice, account handling | Contract and pre contract steps | Invoice name and PO kept with the order record; rest 24 months after last order |
| T5 Profiling | occasion, interests, heard from | Suggest animals | Consent (the Help us suggest panel is the consent action) | Until withdrawn, review every 24 months |
| T6 Marketing | three tier flags, occasion type and date, email | Marketing messages | Consent (s.32), granular, withdrawable | Until withdrawn; proof of consent kept 3 years after withdrawal (verify) |
| T7 Analytics | event data without PII | Improve the site | Consent via cookie bar | 13 months |
Phone is required (T1) because WhatsApp is the order channel. Everything else optional fields are never required to send an order, except those a chosen delivery method physically needs.

### 2.10 Send behaviour and API down (see 4.9)
Tap Send: validate all steps (focus first error), dedupe taps within 2s (exists), then: (a) generate or reuse `ref`; (b) build message plan (5.5); (c) `track("whatsapp_order_submit")`; (d) copy full text to clipboard (exists); (e) `window.open(waUrl)` synchronously in the click handler (iOS blocks async opens); (f) in parallel `POST /api/orders` with `keepalive`, 3s budget (P2); (g) write `mk.orders.v1`; (h) navigate to `/order/sent?ref=`. If the number is unset the page shows the copy flow exactly as today.

---

## 3. RETURNING CUSTOMERS WITHOUT ACCOUNTS

### 3.1 Device profile `mk.profile.v1`
Opt-in checkbox on the review step, unticked: "Remember my details on this device for 90 days so next time is quicker." Plain line beside it: "Stored only on this device. Clear it any time." Written only on a successful send and only if ticked.
Stored: `name, phone, email, customerType, contactChannel, contactHours, language, delivery {fulfilment, area, areaOther, county, town, landmark, mapsPin}, business {businessName, businessType, outletLocation, invoiceName}, savedAt`.
Never stored: KRA PIN, PO number, gift notes, recipient name and phone (a third party's data), payment note, order notes, card or bank details, any child information.
Expiry: 90 days from the last successful send (rolling). On read, older than 90 days: delete. Clear paths: footer "Clear my data" (`clearSavedDetails`, add the new keys), a "Clear my saved details" link beside the prefilled line in step 2, and unticking via `/privacy` instructions. Add `mk.profile.v1`, `mk.saved.v1`, `mk.delivery.v1`, `mk.nudge.v1`, `mk.outbox.v1`, `mk.cart.v2` to the wipe list.

### 3.2 Prefill and speed
Profile loads before first paint of the wizard (inside `OrderWizard` hydration guard). Step 1 and 2 collapse to a summary card "Ordering as {name}, {phone}" with "Edit" if the profile is complete; Next goes straight to delivery. Delivery prefilled from the profile or `mk.delivery.v1`. A returning customer taps: confirm details, confirm delivery, skip extras, send.

### 3.3 Reorder previous list
`mk.orders.v1` is extended: `{ ref, at, items: [{sku, qty}] }` (unchanged shape, still no PII, D16). "Order again" shows on the empty cart, on `/order/sent` and in the profile summary: tapping rebuilds the cart from the last order by resolving each sku against the catalogue; unavailable or removed items are listed ("Not in the shop now: ..."), and the customer chooses to continue with the rest. Event `reorder_start`.

### 3.4 WhatsApp magic: "Order again" message
On `/order/sent`, button "Save a shortcut on WhatsApp": opens `wa.me/{number}?text=` with `Hello Mikono Creations, I would like to order again. My last order was {ref}.` (ref only, no PII). Staff recognise the customer by phone. Also on `/order/track` for a delivered order: "Order the same again" with the same text. No data is stored by this.

### 3.5 Never store
Card numbers, CVV, bank details, KRA PIN, M-Pesa PIN, ID numbers. Lint rule and a unit test scan stored keys for those names.

---

## 4. PERSISTENCE ARCHITECTURE

### 4.1 Options compared
| | (a) Neon Postgres via Vercel Marketplace (plus Upstash Redis for limits) | (b) Google Sheets via service account | (c) Airtable | (d) HubSpot or Zoho free CRM API | (e) WhatsApp Business Cloud API |
|---|---|---|---|---|---|
| Role | System of record | Spreadsheet record | Spreadsheet with forms and views | CRM for leads and contacts | Messaging channel, not a store |
| Setup effort | Medium: integration, schema, 6 route handlers, admin | Low: one route handler, one Sheet | Low to medium | Medium: object mapping, auth | Medium to high: Meta business verification, templates, webhook |
| Owner usability | Needs admin view or exports | Best: owner already knows Sheets | Good: views, forms | Good for sales follow up | Inbox in WhatsApp Business app stays |
| Cost (UNVERIFIED, check current pricing) | Free tiers likely cover launch volume | Free | Free tier limited records; paid per seat | Free tiers exist, limits on contacts and features | Per message pricing by category and country; Kenya rates unverified |
| Privacy | Region chosen, encryption, row level deletion, audit | Data in Google (US/global), broad sharing risk, no field encryption | Data in Airtable (US) | US hosted, marketing features invite more processing | Meta is a processor for messages |
| Reliability | Transactions, unique constraints for idempotency | Quotas (per minute read and write), no unique constraints, race conditions | Rate limit 5 req/s per base (verify) | API limits | Webhook delivery, retries |
| Fit with tracking page | Direct lookup by ref | Slow and quota bound | Possible | Poor | Not applicable |
| DSAR and deletion | Easy | Manual, copies in history | Manual | Manual plus vendor | Messages live in WhatsApp |
Vercel project plan note: Vercel Hobby terms restrict commercial use (UNVERIFIED). Confirm the project plan before taking orders through server routes.

### 4.2 Recommendation
**Now (P2): option (a), Neon Postgres from the Vercel Marketplace, with the Vercel WAF for rate limits and BotID or Turnstile for bots; no Redis in the first release.** Reasons: lookup by ref for tracking, unique keys for idempotency, hard delete for DSAR, region control, encryption, backups. The CSV export in the admin gives the owner spreadsheet access without putting PII in Google.
**Growth path:** P3 add the WhatsApp Cloud API (confirmations and status templates, only to opted in customers). P4 add M-Pesa. When volume or sales process needs it, sync only consented contacts (T6) one way into HubSpot or Zoho free. Sheets is the fallback if the owner refuses a database: same route contract, `OrdersStore` interface with two implementations; the spec calls it `lib/store/*`. Airtable is not recommended: no advantage over Sheets here, extra processor.
Install: `vercel integration add neon` from the project (UNVERIFIED exact CLI syntax, check `vercel integration --help`), pull env with `vercel env pull`. ORM: Drizzle or plain `@neondatabase/serverless` with parameterised SQL; migrations in `db/migrations`.

### 4.3 Schema (Postgres)
All ids `uuid` default `gen_random_uuid()`; timestamps `timestamptz`. PII columns marked `enc` hold AES-256-GCM ciphertext (4.6).
```
customers(id, created_at, updated_at, name_enc, phone_enc, phone_hash, phone_last4,
          email_enc, email_hash, customer_type, segment, language, contact_channel, contact_hours,
          business_name_enc, business_type, anonymised_at)
consents(id, customer_id, order_id null, purpose, granted bool, text_version, text_hash,
         source, captured_at, ip_country null, user_agent_family null, withdrawn_at null)
         -- append only. purpose: whatsapp_updates, email_newsletter, occasion_reminders, profiling, analytics, cart_reminder
orders(id, ref unique, client_ref unique null, customer_id, status, status_changed_at, created_at,
       segment, fulfilment, units, line_count, price_mode, subtotal_kes null, delivery_fee_kes null, total_kes null,
       payment_note_enc, payment_method null, payment_status null, notes_enc, date_wish, time_window,
       call_on_arrival, is_gift, gift_note_enc, gift_wrap, anonymous, send_direct, recipient_different,
       po_number_enc, invoice_name_enc, occasion, heard_from, utm_source, utm_medium, utm_campaign,
       message_level, spam_flag, whatsapp_opened_at, deleted_at null)
order_lines(id, order_id, sku, slug, colour_key, size, qty, line_note_enc, gift_wrap, unit_kes null)
delivery_addresses(id, order_id, kind, area, area_other, county, town, landmark_enc, notes_enc,
                   maps_pin_enc, recipient_name_enc, recipient_phone_enc, zone null, fee_kes null, purge_after)
leads(id, ref unique, lead_type, customer_id null, name_enc, phone_enc, email_enc, payload jsonb (no PII values), source, created_at, status, purge_after)
custom_briefs(id, ref unique, customer_id null, brief jsonb, photo_count, deadline, budget_band, created_at, status, purge_after)
status_history(id, order_id, from_status, to_status, note, actor, at, proof_photo_url null, notified_via null)
events(id, at, session_id, name, params jsonb, consent_version)   -- optional, analytics consent only, no PII
dsar_requests(id, at, kind, phone_hash, status, handled_at, note)
rate_limits(key, window_start, count)                             -- or use WAF only
```
Indexes: `orders(ref)`, `orders(customer_id)`, `customers(phone_hash)`, `customers(email_hash)`, `status_history(order_id, at)`, `orders(status, created_at)`.
`status` enum: `received, confirmed, in_production, ready, dispatched, delivered, cancelled, on_hold`.

### 4.4 Ref reservation and idempotency
`POST /api/orders/reserve` (no PII, bot checked) returns `{ ref }`, inserting `orders` row with `status = 'reserved'`, not visible to staff. The wizard calls it on entering review. `POST /api/orders` then completes that row. If reserve failed, the client uses a locally generated ref (existing `generateRef`) and sends it as `clientRef`; the server accepts it if the format matches and it is unused, else it assigns a new `ref` and returns both, and the message already sent keeps the client ref which remains looked up through `client_ref`. Reserved rows never completed are deleted after 48 hours.

### 4.5 PII minimisation
Collect only the fields in 2.9. No IP address stored (rate limiting uses a hash with a daily rotating salt held in memory or the WAF). No full user agent. Order payloads never include KRA PIN. Child data is rejected by schema (no such fields). Free text fields are sanitised and scanned for obvious patterns of birthdates is not attempted; the hints do the work. Logs never print request bodies. Search by phone uses `phone_hash` (HMAC SHA 256 with a server pepper), not plaintext.

### 4.6 Encryption
Provider encryption at rest for the database and backups (Neon, UNVERIFIED, confirm in provider docs). Additionally field level AES-256-GCM for `enc` columns using `DATA_KEY` (32 bytes, base64) in Vercel env with a key id prefix to allow rotation; `HASH_PEPPER` separate. TLS in transit only. Keys never in the repo; `lib/env.ts` lists them (D19) as server only names.

### 4.7 Retention and deletion
| Data | Retention | Mechanism |
|---|---|---|
| Orders and lines (non PII values) | 5 years, then PII columns nulled (tax record keeping, UNVERIFIED: confirm Kenyan period with an accountant) | Monthly job (Vercel Cron) |
| Customer contact fields | 24 months after last order unless a marketing consent is active | Cron anonymises (`anonymised_at`) |
| Recipient contact, gift note | 90 days after delivery | `purge_after` |
| Delivery addresses | 24 months after delivery | `purge_after` |
| Leads, custom briefs | 12 months if not converted | `purge_after` |
| Consents | While active, then 3 years after withdrawal as proof (verify) | Append only |
| Events | 13 months | Cron |
| Backups | Provider point in time window, 7 to 30 days (UNVERIFIED, plan dependent); deleted rows leave backups by expiry; stated in the privacy notice | |
| DSAR requests log | 3 years | |
**DSAR endpoint** `POST /api/privacy/request` `{ kind: "access"|"correct"|"delete"|"withdraw", phone, email? }` always returns 202 and a generic message (no account enumeration). Verification: the business replies on WhatsApp to the phone on file from the business number, the customer confirms there, the owner then runs the action from the admin ("Export this person" JSON, "Delete this person" which anonymises customer row, nulls order PII and keeps non PII figures). Target response 14 days (the Act's period is UNVERIFIED, plan for the stricter). `withdraw` also works by replying STOP on WhatsApp (staff set `consents` withdrawn). Withdrawal is applied within 2 working days.

### 4.8 Compliance and transfers (design basis, not legal advice; counsel to confirm)
- Controller: Mikono Creations; name a data contact (OPEN). ODPC registration as controller or processor: confirm threshold before P2 launch.
- Region: the site's functions run in `cpt1` (Cape Town). Neon region choice: pick the nearest available. Neon offers AWS Frankfurt (eu-central-1) and I could not verify an Africa region (UNVERIFIED; check at install). Prefer EU (Frankfurt) if no Africa region. Set API route functions to the DB region (`preferredRegion` or Vercel function region setting, verify for Next 16) so queries are not cross region; the static site stays in `cpt1`.
- Cross border: data goes from Kenya to the EU and customers' own WhatsApp action sends order text to Meta. State both in the privacy notice (recipients: Vercel, Neon, Meta WhatsApp, later Safaricom, Clerk). Rely on contract safeguards and consent in the notice; confirm with counsel the transfer conditions in Part VI of the Act (UNVERIFIED section numbers).
- Processor agreements: record the vendors' DPAs in a register.
- Breach plan: notify the ODPC and affected people within the Act's period (72 hours is the commonly cited figure, UNVERIFIED) with a one page runbook in P2.

### 4.9 Admin access
P2 minimum: no public admin. Owner uses (1) Neon console read only for emergencies and (2) a protected `/admin` route built in P3 or an earlier thin version: **Clerk via Vercel Marketplace** with an allow list of owner emails, MFA on, sessions short; `proxy.ts` blocks `/admin` and `/api/admin` without a verified session. Alternative: Sign in with Vercel for team members only (UNVERIFIED availability, check current docs). Admin features: orders table with filters, order detail, status dropdown plus note, "Open WhatsApp to this customer" link, CSV export (orders, lines, consented contacts only), DSAR export and delete, proof photo upload (Vercel Blob, signed), audit log in `status_history`. Admin pages `noindex`, `Cache-Control: no-store`, rate limited.

### 4.10 Graceful degradation (client)
1. Reserve fails or times out in 1.5s: use a local ref, continue.
2. `POST /api/orders` runs after `window.open` and never delays it. Timeout 3s. On network error or 5xx: push the validated payload (no KRA PIN) to `mk.outbox.v1` (cap 3 items, 72 hour expiry), retry on `online`, on next page load and with backoff 5s, 30s, 5min (max 5). Success removes it.
3. UI on `/order/sent`: neutral wording "Your message is on WhatsApp. Tracking appears here once we have saved a copy" with a status line that changes to "Saved" when acked. Never an error scare.
4. If the API returns 4xx validation, show nothing to the user; log client side to `console.warn` and send an event `persist_error` with code only.
5. Server down for hours: the owner still receives every order on WhatsApp. The tracking page shows "We could not find that order yet. If you sent it on WhatsApp we have it there."

---

## 5. THE API CONTRACT (P2)

### 5.1 Conventions
Route handlers under `app/api/`, Node runtime, JSON only, `Content-Type: application/json` required, max body 32 KB (`PAYLOAD_TOO_LARGE`). Responses: `{ ok: true, ... }` or `{ ok: false, error: { code, message, retryable, fields? } }`. Same-origin only (check `Origin` against `NEXT_PUBLIC_SITE_URL`), no CORS. Every response `Cache-Control: no-store`. Zod schemas live in `lib/schema/order.ts` and are imported by both the wizard and the routes.

### 5.2 Endpoints
| Method and path | Purpose | Auth |
|---|---|---|
| `POST /api/orders/reserve` | Reserve a ref | bot check, rate limit |
| `POST /api/orders` | Create or complete an order (idempotent by ref) | bot check, rate limit |
| `POST /api/leads` | Wholesale, contact, partnership, supply, price list | bot check |
| `POST /api/custom-briefs` | Studio briefs (reuses lead engine) | bot check |
| `POST /api/orders/track` | Status lookup (ref plus phone last 4) | rate limit, lockout |
| `POST /api/privacy/request` | DSAR | bot check |
| `POST /api/events` | Optional first party events | consent flag required |
| `GET/PATCH /api/admin/orders...` | Admin | Clerk session |
| `POST /api/webhooks/whatsapp` (P3), `POST /api/mpesa/callback/[secret]` (P4) | Inbound | signature or secret |

### 5.3 `POST /api/orders` request
```json
{
  "ref": "MK-261003-7KQ2",
  "clientRef": "optional, only when reserve failed",
  "formStartedAt": 1790000000000,
  "website": "",
  "customerType": "retailer",
  "name": "string", "phone": "+254712345678", "email": "optional",
  "contactChannel": "whatsapp", "contactHours": "anytime", "language": "en",
  "lines": [{ "sku": "elephant-grey-m", "qty": 2, "note": "optional", "giftWrap": false }],
  "delivery": {
    "fulfilment": "nairobi", "pickupPoint": "", "area": "Kilimani", "areaOther": "", "county": "", "town": "",
    "landmark": "string", "notes": "", "mapsPin": "", "dateWish": "2026-12-10", "timeWindow": "anytime", "callOnArrival": true,
    "recipientDifferent": false, "recipientName": "", "recipientPhone": ""
  },
  "gift": { "isGift": false, "note": "", "wrapAll": false, "anonymous": false, "sendDirect": false },
  "business": { "businessName": "", "businessType": "", "outletLocation": "", "volumeBand": "", "invoiceName": "", "poNumber": "" },
  "about": { "occasion": "", "interests": [], "heardFrom": "" },
  "paymentNote": "", "notes": "",
  "consents": [{ "purpose": "whatsapp_updates", "granted": false, "textVersion": "2026-10-v1" }],
  "termsAcknowledged": true,
  "attribution": { "utm_source": "", "utm_medium": "", "utm_campaign": "" },
  "messageLevel": "full"
}
```
Success `201` or `200 duplicate`:
```json
{ "ok": true, "ref": "MK-261003-7KQ2", "duplicate": false, "trackUrl": "/order/track?ref=MK-261003-7KQ2" }
```
Failure example `422`:
```json
{ "ok": false, "error": { "code": "VALIDATION_FAILED", "message": "Check the highlighted fields.", "retryable": false, "fields": { "phone": "invalid_phone" } } }
```

### 5.4 Error codes, idempotency, limits, spam traps
| Code | HTTP | Retryable | Meaning |
|---|---|---|---|
| `VALIDATION_FAILED` | 422 | no | Zod failure (fields listed) |
| `REF_CONFLICT` | 409 | no | Same ref, different payload hash after 30 minutes |
| `DUPLICATE` | 200 | n/a | Same ref and same payload hash: returns the original result |
| `RATE_LIMITED` | 429 | yes (Retry-After) | Limit hit |
| `BOT_SUSPECTED` | 403 | no | Bot check failed |
| `CONSENT_REQUIRED` | 400 | no | Events without analytics consent, or terms not acknowledged |
| `PAYLOAD_TOO_LARGE` | 413 | no | Over 32 KB |
| `NOT_FOUND` | 404 | no | Track miss (generic text) |
| `UNAUTHORISED` | 401 | no | Admin |
| `UNAVAILABLE` | 503 | yes | Database unreachable |
| `SERVER_ERROR` | 500 | yes | Unexpected |
Idempotency: the key is `ref`. A payload hash (SHA 256 of the canonical JSON without `formStartedAt` and `website`) is stored. Rate limits (WAF rules or a small `rate_limits` table): reserve 20 per hour per IP; orders 5 per hour per IP and 3 per hour per `phone_hash`; leads 5 per hour per IP; track 10 per 10 minutes per IP and 5 failed attempts per ref locks that ref for 15 minutes; DSAR 3 per day per IP. Spam traps: `website` honeypot (hidden input, `tabindex=-1`, `autocomplete=off`, off screen not `display:none`); `formStartedAt` older than 3 seconds for the whole form (faster is flagged, not blocked); BotID or Turnstile token in header `x-bot-token` (UNVERIFIED: choose BotID Basic if available on the plan, else Cloudflare Turnstile free; fail open on provider outage). A flagged order is stored with `spam_flag = true`, returns the normal success shape, and is hidden from the default admin view. A real customer is never blocked from WhatsApp.

### 5.5 WhatsApp message template v2 (exact)
Plain text, `\n` breaks, no emoji (sections in capitals). Fields appear only when set.
```
Hello Mikono Creations, I would like to order.
Order ref: MK-261003-7KQ2
Source: instagram / paid / xmas-2026

ITEMS
1. 2 x Elephant, Grey, size M, SKU elephant-grey-m
   Note: no bow please
   Gift wrap: yes
2. 1 x Giraffe, Orange, size L, SKU giraffe-orange-l
Prices are confirmed on WhatsApp.

CUSTOMER
Type: Shop or retailer
Name: Amina W
Phone: +254 712 345 678
Email: amina@example.com
Reach me by: WhatsApp, afternoon
Language: English

BUSINESS
Business: Savanna Gifts (Gift shop)
Outlet: Karen
Volume: 20 to 49 per month
Invoice name: Savanna Gifts Ltd
KRA PIN: A123456789B
PO number: PO-118

DELIVERY
Method: Delivery in Nairobi
Area: Kilimani
Landmark: Yaya Centre, ground floor
Map pin: https://maps.app.goo.gl/xxxx
Notes: Ask for the gate guard
Date wish: 2026-12-10, afternoon
Call me on arrival: yes
Delivery fee: to be confirmed
Receiving adult: Joy K, +254 722 000 111

GIFT
Note: "Happy birthday from Aunty"
Wrap: whole order
Do not say who it is from: yes
Deliver direct to recipient: yes

PAYMENT
Preference: I will pay by M-Pesa
We arrange payment with you on WhatsApp.

NOTES
Any colour wishes

CONSENT
News and offers on WhatsApp: yes
Newsletter by email: no
Occasion reminder: no
Terms and privacy read: yes
Help us suggest: Birthday; likes Safari
Heard about us: Instagram
Sent from mikono-creations.vercel.app
```
Rules: `Type` uses the label table in 2.2; empty blocks are omitted entirely; the Consent block is always present and always shows all three tiers with yes or no; `Heard about us` and `Help us suggest` appear only if filled. Occasion reminders add `Occasion: Christmas, 2026-12-20` when yes. Child data is never present. Values pass through `clean()` (control chars removed, length caps from 2.3 to 2.8).
Length fallback (URL budget 2000 chars encoded, existing `URL_BUDGET`): level `full` then `compact` (drop per line notes into a single `Notes` line, shorten notes, cap items text, drop Source and Sent from) then `short` (head, Name, Phone, "My full order is long, so I will paste it here next.") and the full text is always copied to the clipboard and shown with a "Paste it into WhatsApp" instruction. Consent block is kept in `compact` and moved into the first paste text for `short`. After 5.2 exists, a fourth level `ref` is used when the order is saved: head plus "Full details: {site}/order/track?ref=" is NOT used (the track page is customer facing and needs the phone digits); keep the three levels.

---

## 6. ORDER TRACKING AND STATUS

### 6.1 Page `/order/track`
Form: Order reference (`MK-...`, case insensitive, paste cleaned) and "Last 4 digits of your phone number" (numeric, 4). A `ref` query param prefills the first field. Submit calls `POST /api/orders/track`. The comparison is constant time against `phone_last4` and requires the `ref`. Any mismatch returns the same `NOT_FOUND` text: "We could not find that order. Check the reference and the last 4 digits. If you sent it on WhatsApp, we have it there." Lockout after 5 failures per ref (4.4 limits).
Result card: ref, date placed, units, list of items (names, size, colour), delivery method and area, and a vertical timeline:
`Received`, `Confirmed`, `In production` (made to order) or `Ready` (ready stock), `Dispatched` (or `Ready for pickup` for pickup), `Delivered`. Each node has a date (Nairobi time) once reached, text for the current node, `aria-current="step"`. `Cancelled` and `On hold` render as a banner with the staff note. No prices unless `pricesConfirmed` and set. No address shown (only area). Proof of delivery photo shown only to the verified viewer, only on `delivered`, from a signed time limited URL, with the line "Delivery photo (if we took one)". Photo content rule: no faces of children; staff guidance in admin help.
States: loading, not found, locked ("Too many tries. Try again in 15 minutes."), API down ("Tracking is not available right now. Your order is safe on WhatsApp."), found. All have tests. `noindex`, not in sitemap.

### 6.2 Who updates statuses
P2: owner or staff in the admin (4.9) with a status dropdown and optional note. Interim before admin exists: owner edits the status in the Neon console or via a protected route; or a Google Sheet is NOT used for statuses (privacy). Each change writes `status_history`.

### 6.3 WhatsApp status templates
Before P3 (no Cloud API) staff send these by hand from WhatsApp Business using quick replies; the admin gives a "Copy message" button and an "Open WhatsApp" link. In P3 they become approved templates (UNVERIFIED: Meta template approval, categories and fees). Texts (placeholders in braces, all plain, no claims):
| Status | Template |
|---|---|
| Confirmation | `Hello {first_name}, thank you for your order {ref}. We have confirmed {units} animals. Price, delivery and how to pay: {summary}. Reply here if anything needs changing.` |
| Ready | `Hello {first_name}, your order {ref} is ready. We will arrange {delivery_or_pickup} with you. Which time suits you?` |
| Dispatched | `Hello {first_name}, your order {ref} is on its way. {rider_or_courier_info}. Track it any time: {site}/order/track?ref={ref}` |
| Delivered | `Hello {first_name}, your order {ref} was delivered. We hope it is enjoyed. Tell us if anything is not right.` |
| Review request (7 days after, only if `whatsapp_updates` or the order consent allows; else sent once as a service follow up) | `Hello {first_name}, if you have a minute, we would love a review of your order {ref}: {review_link}. A photo is welcome. Please do not show a child's face. Reply STOP to get no more messages.` |
The review request is marketing in nature: send only to customers with `whatsapp_updates = granted` (open decision 12.10).

---

## 7. PAYMENTS ROADMAP

| Stage | Scope |
|---|---|
| NOW (P1 to P3) | `paymentNote` free text. Payment instructions are sent by a person on WhatsApp after confirmation. `data/payments.ts` is empty; radio appears only when the owner fills it. No payment data on site. |
| NEXT (P4) M-Pesa Daraja STK push | Customer taps "Pay now" on the tracking page after confirmation; server calls Daraja `stkpush` with the order amount from the DB (never from the client), phone from the customer row, `AccountReference = ref`. Callback route `POST /api/mpesa/callback/[secret]` stores `CheckoutRequestID`, `ResultCode`, `MpesaReceiptNumber`, amount, phone hash; unique on `CheckoutRequestID`; status `payment_status` paid, failed, cancelled, pending. Receipt: shown on tracking page and sent as a WhatsApp message. Reconciliation: daily job compares stored receipts with the M-Pesa statement CSV (manual upload in admin), flags amount mismatches and missing callbacks (use `stkpushquery` for pending after 2 minutes). Libraries: plain `fetch` wrapper plus Zod, no third party SDK (avoid unmaintained packages); tokens cached in memory 55 minutes. Callbacks are not signed: use an unguessable path secret, accept only after verifying with `stkpushquery`, and optionally restrict to Safaricom's published IP list (UNVERIFIED, fetch the current list). Sandbox plan: Daraja sandbox app, test shortcode and passkey from the portal (values UNVERIFIED here), expose the callback with a Vercel preview URL, tests for success, wrong PIN, timeout, cancel, duplicate callback, late callback. Safaricom onboarding (UNVERIFIED, confirm on the Daraja portal): developer account, create app, request Go Live for a Paybill or Till, business registration and KYC documents, owner's M-Pesa business shortcode, production credentials (consumer key, secret, passkey), callback URL on HTTPS. Lead time: weeks, plan on 4 to 8 (estimate). |
| LATER cards | Hosted payment page only (no card data on our site, PCI scope SAQ A). Verify Kenya merchant availability before choosing: Stripe (not believed available for Kenyan businesses, UNVERIFIED), Flutterwave, Paystack, Pesapal, DPO Pay. Recommended shortlist to evaluate: Pesapal and Paystack for M-Pesa plus card in one flow; decision criteria: Kenya payout in KES, fee table, settlement time, refund API, webhook signatures, KYC burden. |
| Deposits for custom orders | After a brief is accepted, a deposit amount set by the owner per brief (never a default percentage in code), sent as an STK push request tied to the brief ref, balance before dispatch. Refund and cancellation text in `/terms` must exist first (owner OPEN). |
| Fraud basics | Amount and currency always computed server side; STK only to the verified phone on the order or one the customer confirms on WhatsApp; max attempts 3 per order per hour; reconcile daily; no storage of PINs or card data; dispatch only after confirmed receipt for new customers; name check on payer when the statement shows it; velocity limits per phone; clear refund wording; admin actions logged. |

---

## 8. ANALYTICS

### 8.1 Rules
Consent first (`readConsent()`): events go to GTM or GA4 only with analytics consent, to Meta and TikTok pixels only with marketing consent, as today in `lib/track.ts`. No PII in any parameter: no name, phone, email, address, notes, gift note, KRA PIN, recipient data. `value` is sent only when `pricesConfirmed` and every line has a price and the shipping cost is known or pickup; otherwise the key is absent. `currency: "KES"` always when `value` is present. `purchase` is never sent (D23).

### 8.2 Events per step
Existing D22 events keep their names. New names (add to `TRACK_EVENTS`): `wizard_step_view`, `wizard_error`, `wizard_abandon`, `add_payment_info`, `save_for_later`, `move_to_cart`, `update_line`, `share_list`, `reorder_start`, `profile_remember`, `delivery_estimate_view`, `consent_tier_update`, `order_track_view`, `order_track_result`, `persist_error`.
| Moment | Event | Parameters |
|---|---|---|
| Cart page shown | `view_cart` | `items[]`, `item_count`, `price_mode`, `value` only if real, `currency` if value |
| Line change | `update_line` | `item_id`, `field` (size, colour, qty, note, gift_wrap), no free text |
| Remove or save | `remove_from_cart` or `save_for_later` | `items[]` |
| Share list | `share_list` | `method` (wa, native, copy), `item_count` |
| Delivery estimate | `delivery_estimate_view` | `shipping_tier` (pickup, nairobi, kenya_other), `area_known` bool |
| Family suggestion | `add_to_cart` | `items[]`, `list_name: "cart_family"` |
| Start | `begin_checkout` | `items[]`, `item_count`, `price_mode`, `value?` |
| Each step shown | `wizard_step_view` | `step_name`, `step_index`, `step_total`, `customer_type?`, `returning` bool |
| Step done | `wizard_step_complete` | same plus `skipped?`, `duration_s_bucket` (0-10, 10-30, 30-60, 60+) |
| Validation error | `wizard_error` | `step_name`, `field_name`, `error_code` (never the value) |
| Delivery chosen | `add_shipping_info` | `shipping_tier`, `items[]`, `coupon?` |
| Payment preference | `add_payment_info` | `payment_type` (placeholder: `note` today, method key later), `has_note` bool |
| Consent tier changed | `consent_tier_update` | `tier`, `granted` bool (no identifiers) |
| Send tapped | `whatsapp_order_submit` | `order_ref`, `items[]`, `item_count`, `customer_type`, `segment`, `shipping_tier`, `message_level`, `value?`, `currency?`, `coupon?`, `persisted` (true, false, unknown) |
| Other WhatsApp links | `whatsapp_click` | `context` |
| Reorder | `reorder_start` | `source` (cart, sent, track) |
| Profile saved | `profile_remember` | `granted` bool |
| Tracking | `order_track_view`, `order_track_result` | `result` (found, not_found, locked, error), `status` |
`items[]` entries: `{ item_id: sku, item_name, item_variant: "{colour}-{size}", item_category: group, quantity, price? }`, `price` only when real.

### 8.3 Funnel and drop-off definitions
| Funnel step | Event | Drop-off metric |
|---|---|---|
| F0 Add | `add_to_cart` | sessions with add / sessions with `view_item` |
| F1 Cart | `view_cart` | cart views / sessions with add |
| F2 Start | `begin_checkout` | starts / cart views |
| F3 to F6 | `wizard_step_complete` by step | completion per step; time buckets |
| F7 Review | `wizard_step_view` review | reach rate |
| F8 Send | `whatsapp_order_submit` | send / starts (the order conversion) |
| F9 Confirmed | business records (not web) | confirmed / sent, from the DB `status` |
Abandon: `wizard_abandon` fires once per draft on `visibilitychange` hidden when a step was viewed and no send happened, with `last_step` and minutes bucket. Field level friction: top `wizard_error` field names per step.

### 8.4 Data layer contract (GTM)
Before each ecommerce push: `dataLayer.push({ ecommerce: null })`, then `dataLayer.push({ event, ecommerce: { currency?, value?, items: [...] }, step_name?, ... })`. Custom parameters sit beside `ecommerce`. Page level keys set once: `site_env`, `price_mode`. Event names exactly as 8.2. No object contains PII. A unit test scans every `track()` call fixture for forbidden key names.

### 8.5 Server side later (P3 and P4)
Meta Conversions API and GA4 Measurement Protocol are called from the order route after persistence, only if the matching consent was recorded: Meta `Lead` with `event_id = ref` (dedupes with the browser pixel), hashed phone or email (SHA 256, lower case, E.164) only when `whatsapp_updates` or marketing consent allows; GA4 MP `generate_lead` with a random `client_id` from the analytics cookie only. Env names are already reserved (`META_CAPI_TOKEN`, `GA4_API_SECRET`). Never `purchase` until M-Pesa confirmed payments exist, then `purchase` with the real receipt, `value` and `transaction_id = ref`.

---

## 9. TEST PLAN AND ACCEPTANCE CRITERIA

### 9.1 Unit tests (Vitest, pure functions)
1. `normalisePhone`: 07xx, 01xx, 7xx, 254, +254, 00 prefix, spaces, hyphens, intl, invalid lengths.
2. Cart store: v1 to v2 migration, clamp, merge on size change, max lines, expiry, corrupt JSON, blocked storage.
3. `computeTotals`: ask mode all null, confirmed mode complete, missing price, unknown fee, pickup, discount.
4. `suggestFamily`: excludes in cart, deterministic, respects max.
5. `encodeShare` and `decodeShare` round trip, unknown sku dropped, 40 cap, malformed.
6. Zod schemas: every field boundary, rejects `kraPin`, rejects unknown keys, KRA regex warning logic, maps URL host allowlist.
7. Message builder: every block present or absent, `full`, `compact`, `short`, 2000 char budget, clean(), consent block always present, no dash characters.
8. Draft serialisation never contains `kraPin`; profile excludes forbidden fields; storage key audit has no card or PIN names.
9. Profile expiry (89 and 91 days), rolling renewal, clear.
10. `tomorrowISO`, date window min and max, lead time placeholder.
11. Ref generation format and alphabet; reserve fallback uses `clientRef`.
12. Rate limit and idempotency helpers (hash equality, REF_CONFLICT).
13. Track wrapper: no events without consent, no PII keys, `value` absent when not real.
14. Copy lint: no em or en dash, no banned phrases in `data/copy` and component strings (existing `scripts/qa-copy.mjs`).

### 9.2 E2E (Playwright, local build and preview)
| # | Flow | Pass condition |
|---|---|---|
| E1 | New retail customer, 3 lines, delivery Nairobi, send | Message opens, text matches template, `/order/sent` shown, cart cleared on "Done" |
| E2 | Returning customer with profile | Wizard reaches review in 3 taps, measured under 90 seconds scripted with realistic delays |
| E3 | B2B retailer with business block, KRA PIN | PIN in message, absent from `localStorage`, absent from API request body |
| E4 | Gift with recipient adult and anonymous | Message contains Gift block, no child fields present |
| E5 | Edit lines (size merge, colour, note, wrap, save for later, undo) | Cart state and live region correct |
| E6 | Share list link opens `/list`, add all | Cart equals source, invalid hash handled |
| E7 | Empty cart rescue, reorder | Items restored, missing items listed |
| E8 | Ask mode versus confirmed mode (build with flag flipped) | Block `prices-on-whatsapp` versus totals, no totals in ask mode |
| E9 | Consent tiers | Three unticked on first view; ticking one does not tick others; message and API reflect exact states |
| E10 | API down (route aborted) | WhatsApp still opens, outbox written, retry on `online`, sent page neutral |
| E11 | Offline (browser offline) | Cart and wizard work, send opens WhatsApp and copy |
| E12 | Tracking (P2) | Found, wrong last 4, 5 failures lock, API down message |
| E13 | Draft resume, start again | Draft restored, no KRA PIN restored |
| E14 | Storage blocked | Notices shown, ordering still possible |
| E15 | Popup blocker simulation | Copy and instruction path shown |
| E16 | DSAR request (P2) | Generic 202 response, record created |

### 9.3 Accessibility
axe on `/cart`, `/order` (every step and error state), `/list`, `/order/sent`, `/order/track`: zero serious or critical violations. Manual keyboard walk: every control reachable, visible focus, logical order, Esc closes drawer, focus returns. Screen reader checks (NVDA or VoiceOver) for step changes, error summary, live announcements, timeline `aria-current`. Reduced motion: no transforms. Zoom 200% and text size 150%: no clipped text, no horizontal scroll. Target size: every interactive element hit area at least 44px (script measures bounding boxes). Contrast AA on all UI states.

### 9.4 Mobile and density
Screenshots at 320, 360, 390, 412, 430: no horizontal overflow, sticky bar never covers the last field or line, suggestion grid 2 columns at 320 and 3 from 360, body text 14px, secondary 13px, labels 12px, card heights equal per row (`data-card` checks from 14). Safe area insets honoured. Keyboard open: focused field remains visible.

### 9.5 API tests (P2)
Contract tests for every endpoint and code in 5.4; idempotent replay returns `DUPLICATE`; rate limit boundaries; honeypot filled yields normal 201 with `spam_flag`; oversized body 413; encrypted columns are not plaintext in the DB (query raw table); DSAR delete anonymises; admin routes 401 without session; no request body in logs.

### 9.6 Acceptance criteria (release gates)
P1: all unit tests and E1 to E9, E11, E13 to E15 pass; Lighthouse accessibility 100 on the five pages (existing target); no change in LCP on `/cart` beyond 10%; copy scan clean; bundle for `/cart` and `/order` increases by under 25 KB gzip (cartCatalogue loaded only on those routes).
P2: E10, E12, E16 and section 9.5 pass; privacy notice updated; ODPC check recorded; DB region recorded; backup restore rehearsed once.
P3 and P4: provider sandbox tests per section 7.

---

## 10. PHASED DELIVERY PLAN

| Phase | Scope | Effort (one agent, working days, estimate) |
|---|---|---|
| P1 | No backend. Cart v2 (edit, save for later, delivery estimate, ask and confirmed pricing modes, family suggestions, nudge banner, empty rescue, drawer rebuild), share list and `/list`, wizard v2 (8 customer types, extras, delivery fields, consent tiers, terms, payment note), message template v2 with fallbacks, device profile and reorder, new analytics events, all unit and E2E tests in 9.1, 9.2 (not API items) | 9 to 12 days |
| P2 | Neon install, schema and migrations, Zod shared schemas, six route handlers, rate limits, bot check, reserve flow, outbox retry, tracking page, minimal admin (Clerk allow list, status update, CSV, DSAR), privacy notice update, retention cron, backups check | 10 to 14 days |
| P3 | WhatsApp Cloud API (webhook, opt in handling, status templates, review request), richer admin (templates, proof photos), cart reminder, Meta CAPI and GA4 MP server events, CRM sync of consented contacts if wanted | 8 to 12 days plus Meta verification waiting time |
| P4 | M-Pesa Daraja STK push, callback, receipts, reconciliation, deposits for custom briefs; card gateway evaluation | 8 to 10 days plus Safaricom onboarding waiting time |
Ordering rule: P1 ships alone and is fully useful. Nothing in P1 may call `/api`. Each later phase adds endpoints behind feature flags `NEXT_PUBLIC_PERSIST`, `NEXT_PUBLIC_TRACKING` so the site keeps working with them off.

---

## 11. Assumptions and unverified items
| # | Item | Status |
|---|---|---|
| A1 | `strategy/15-checkout-strategy.md` absent at writing time | Verified: not present. Reconcile if it appears |
| A2 | Neon regions (Africa availability), `vercel integration add` syntax | UNVERIFIED |
| A3 | Vercel Hobby commercial use restriction; BotID availability and plan | UNVERIFIED |
| A4 | Data Protection Act 2019 section numbers, response periods, retention periods (tax records), breach notice window, ODPC registration threshold | UNVERIFIED, counsel to confirm |
| A5 | Meta WhatsApp opt in wording and template fees for Kenya | UNVERIFIED |
| A6 | Daraja sandbox values, onboarding documents and timelines, callback IP list | UNVERIFIED |
| A7 | Stripe, Flutterwave, Paystack, Pesapal, DPO availability and fees in Kenya | UNVERIFIED |
| A8 | Clerk and Sign in with Vercel suitability for a single owner admin | UNVERIFIED |
| A9 | Next 16 per route function region setting name | UNVERIFIED, read `node_modules/next/dist/docs/` first (D39) |
| A10 | Cart expiry 30 days and profile 90 days are owner preferences | Profile 90 days given by owner; cart 30 days kept from existing code |

---

## 12. Open decisions for the owner
1. Approve server persistence (Phase 2), the privacy notice update, and the data contact name. Confirm ODPC registration status.
2. Confirm D14 change: B2B inside the wizard with KRA PIN, PO and invoice name as optional fields.
3. Retention periods in 2.9 and 4.7 (24 months contacts, 5 years order records, 90 days recipient and gift notes).
4. Marketing message frequency `{FREQ}` for the WhatsApp tier.
5. Pickup points list (names and addresses), delivery zones and fees, `LEAD_TIME_DAYS`, whether gift wrapping has a cost.
6. Payment methods to list (M-Pesa Paybill or Till, bank, cash on delivery) and the order they appear in.
7. Who updates statuses and how quickly (response targets), and whether staff want an admin or only exports.
8. Database region preference (EU Frankfurt or an Africa region if available) and acceptance of cross border transfer wording.
9. Cart lifetime (30 days kept or longer) and whether the optional WhatsApp cart reminder (P3) is wanted.
10. Whether the review request is sent only to customers who opted in to WhatsApp updates (recommended) or to all as a service message.
11. Whether to take delivery proof photos, and the rule that no child's face appears.
12. Which card gateway to evaluate first, and the deposit approach for custom orders.
13. Promo codes: wanted at all, and who owns the rules.
