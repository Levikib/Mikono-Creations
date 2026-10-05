# Mikono Creations: Cart, Order Wizard and Enquiry Flows

Status: Draft v0.1 for the Phase 2 gate. Obeys `00-CHARTER.md`. All prices, fees, the WhatsApp number and tracking IDs are placeholders until the client supplies them (charter section 6). Everything here runs in a static-first Next.js app with no backend.

## 0. Principles

1. WhatsApp is the order channel. The site collects a clean, complete request. The business confirms price, stock, delivery fee and payment on WhatsApp. The site never says "order confirmed". It says "order sent".
2. No invented facts. Where a price, fee, lead time or stock status is unknown, the UI shows a labelled placeholder or "we will confirm".
3. Ask only what is needed for the path chosen. Skip logic hides every irrelevant field.
4. Child-first: big targets, plain words, forgiving input, no timers, no pressure.
5. Draft state lives only in the visitor's browser and is clearable at any time.

## 1. Cart behaviour

### 1.1 Surface
- Cart drawer: opens from the header cart button and after "Add to cart" (focus moves to the drawer heading, a polite live region says "Added: Green elephant, Medium, 1"). Closes on Escape, close button, or backdrop click. Focus returns to the trigger.
- Cart page `/cart`: full view for editing many lines, B2B quantities and notes. The drawer has "View full cart" and "Continue to order form". On screens under 768 px the drawer is a bottom sheet.
- Both read the same store. No duplicate logic.

### 1.2 Variant key and lines
- Variant key = `animalSlug + "|" + size + "|" + colourway`, for example `elephant|M|sage`. Adding the same key increments quantity. Different key means a new line.
- Size values: `S | M | L | XL`. Colourway values come from the typed product data (TODO: client colourway list per animal).
- Each line stores a snapshot of display name, image path and unit price (or null) at add time, plus the current catalogue id for re-validation.

### 1.3 Quantity rules
- Default 1. Stepper with minus, plus and typed input, all targets 44 px or larger.
- Min 1 (reducing to 0 asks "Remove this item?" with Undo for 8 seconds, no countdown shown).
- Max per line for B2C: 20 (TODO: client confirms). Above that the stepper stops and shows "For more than 20 of one item, please use the wholesale request" with a link.
- Cart total quantity of 30 or more shows a gentle suggestion to use the wholesale request. It never blocks.
- B2B mode (set in the wizard) raises max per line to 500 and shows a minimum order note only if the client supplies one (TODO).

### 1.4 Persistence
- localStorage key `mk.cart.v1`, JSON of `Cart`. Written on every change, debounced 150 ms. Also listens to the `storage` event so two tabs stay in sync.
- Schema version field. On version mismatch or parse failure, keep a copy under `mk.cart.corrupt`, start an empty cart, and show a calm notice once.
- Expiry: carts older than 30 days are cleared on load (TODO: client confirms).
- If localStorage is blocked (private mode), fall back to in-memory state and show "Your cart will be forgotten if you close this tab".

### 1.5 Edge cases
- Product removed or renamed in a later deploy: the line is kept, marked "No longer listed", excluded from the WhatsApp message, and the user must remove it or ask on WhatsApp.
- Colourway or size discontinued: same handling, with a "Choose another" link to the product page.
- Price changed since add: show the current price, and a quiet line "Price updated since you added this".
- Price unknown (placeholder phase): line shows "Price on request", totals show "Total to be confirmed".
- Duplicate rapid clicks: add is idempotent per 300 ms per key.
- Maximum 40 distinct lines. Beyond that, suggest the wholesale request.

### 1.6 Empty state
Illustration of an empty basket with a small animal peeking out (reduced-motion safe, decorative, empty alt). Text: "Your cart is empty." Buttons: "Shop safari animals", "Shop farm and pet animals", "Ask about a wholesale order".

### 1.7 Availability messaging
Availability is a typed field per variant, never a stock count (charter rule 3):
- `made_to_order`: "Made to order by hand. We confirm the time on WhatsApp." (TODO: lead time days from client.)
- `ready`: "Ready to send."
- `ask`: "Ask us about availability."
- `unavailable`: add button disabled with "Not available right now. Ask on WhatsApp" link, and a "Notify me on WhatsApp" prefilled message.
No fake scarcity, no "only 2 left", no timers.

## 2. Order wizard

Route `/order`. One question group per screen, progress shown as "Step 3 of 7" plus a labelled progress bar (text, not colour alone). Back always works and never loses input. Steps change with skip logic, and the count updates honestly.

### Step 1: Who is ordering
Field `customerType` (required, radio cards, 44 px or larger):
- "I am buying for a child or as a gift" (`parent_gifter`)
- "I run a shop, lodge or business" (`retailer_business`)
- "I order for a school, charity or organisation" (`organisation`)
Skip logic: retailer_business and organisation show a banner "Ordering 20 or more? The wholesale request may suit you better" with a link, never forced.
Microcopy: question as a plain sentence, no jargon, no "persona" words.

### Step 2: Your details
- `fullName`: required, 2 to 80 chars, letters, spaces, hyphen, apostrophe. Label "Your name". Trimmed.
- `phone`: required, WhatsApp number. Accept `07xx`, `01xx`, `+2547xx`, `2547xx`, spaces and hyphens. Normalise to E.164 `+254XXXXXXXXX` (9 digits after 254, starting 7 or 1). Non-Kenyan numbers allowed if starting `+` followed by 8 to 15 digits. Helper: "We will message you on this number."
- `email`: optional for parent_gifter, required for retailer_business and organisation. Light pattern check, no blocking of unusual valid addresses.
- Business and organisation only: `businessName` (required, 2 to 100), `role` (optional), `businessType` (select: gift shop, lodge or hotel, boutique or toy shop, school, NGO or charity, event or corporate gift, other).
- Gifter only: `recipientFirstName` (optional, shown only if a gift note is added later; first name only, to minimise child data), `recipientAge` as bucket (under 1, 1 to 3, 4 to 7, 8 and over, adult, prefer not to say) used only for a safety note.
Validation timing: validate on blur and on Next, never while typing. Errors are plain: "Please add your phone number so we can reach you." Focus moves to the first error, and an error summary sits at the top with links.

### Step 3: Delivery or pickup
Field `fulfilment` (required): `delivery | pickup`.
- Pickup: show pickup location as TODO (client supplies address and hours). Skip to Step 5 after optional `pickupDateWish`.
- Delivery: field `deliveryZone` (required): `nairobi | kenya_other | international`.

#### 3a. Nairobi
- `nairobiArea` (required): searchable select (combobox with native fallback) grouped by region. Starter list, to be confirmed by client with fees (TODO): Westlands, Kilimani, Lavington, Kileleshwa, Karen, Langata, Runda, Muthaiga, Gigiri, Parklands, CBD, Upper Hill, South B, South C, Embakasi, Eastleigh, Kasarani, Roysambu, Ruaka, Ngong Road, Thika Road, Rongai, Kitengela, Syokimau, Other Nairobi area. "Other Nairobi area" reveals free text `areaOther`.
- `streetOrLandmark` (required, 3 to 200): "Estate, street, building or a landmark".
- `deliveryNotes` (optional, 0 to 300): gate code, floor, "call on arrival".
- Fee: shown as "Delivery fee: we will confirm on WhatsApp" until the client supplies zone fees. If supplied later, a typed table `deliveryZones` gives `feeKes` per area.

#### 3b. Other Kenyan towns
- `county` (required select, 47 counties), `town` (required text), `pickupPoint` (optional: courier or bus parcel office name).
- Helper: "We send by courier or bus parcel. We will confirm the cost and time on WhatsApp." (TODO: client names couriers.)

#### 3c. International
- `country` (required select), `addressLines` (required, up to 3 lines), `city`, `postcode` (optional), `phoneIntl` reuses `phone`.
- Helper: "We will check shipping and any import charges with you on WhatsApp before anything is paid." Cash on delivery is hidden.

### Step 4: Delivery date wish
- `dateWish` (optional) date input with native picker, min = today plus 1. Alternatives as chips: "As soon as possible", "For a birthday on a date", "No rush".
- If `occasion` is chosen (birthday, baby shower, Christmas, school event, other), show `eventDate` and note "We will tell you if that date is possible. Handmade items take time."
- Never promises a date. Past dates blocked with message "Please pick a day from tomorrow on."

### Step 5: Gift options (shown for parent_gifter, and for others on request via "This is a gift" toggle)
- `isGift` toggle, default off.
- `giftNote` (optional, 0 to 240 chars, live counter text "120 characters left"). Allow newlines and emoji. Stripped of control characters.
- `giftWrap` (optional) radio: none, "Paper wrap" , "Gift bag" (TODO: client confirms real options and fees; do not show options not offered).
- `hidePrices` checkbox: "Do not show prices in the parcel".
- `sendDirect` toggle: "Deliver to the recipient instead", reveals `recipientName` and `recipientPhone` (optional) and reuses Step 3 address as the recipient's.

### Step 6: Business details (retailer_business and organisation only; else skipped)
- `needsInvoice` toggle (default on for these types).
- `kraPin` (optional unless invoice is on, then required): pattern `^[AP]\d{9}[A-Z]$` after uppercasing and trimming. Helper: "Starts with A or P, then 9 numbers, then a letter. Example format only: A000000000Z." Invalid format shows a soft warning with "Continue anyway" because pattern rules can change.
- `invoiceName` (prefilled from businessName), `invoiceEmail` (prefilled from email), `poNumber` (optional), `billingAddressSame` (default yes).
- `resaleIntent` select (retail resale, hospitality, gifts for staff or clients, event, other), used to route follow up.

### Step 7: Payment preference and notes
- `paymentPreference` (required, radio): `mpesa`, `bank_transfer` (hidden for parent_gifter if the client chooses; TODO), `cash_on_delivery`.
- Cash on delivery is offered only where allowed: delivery zone Nairobi with area flagged `codAllowed`, or pickup. Hidden for other towns and international. A label explains: "Cash on delivery is for Nairobi deliveries and pickup." (TODO: client confirms policy.)
- Text: "You pay nothing on this site. We will send payment details on WhatsApp." No payment numbers, till or account details are rendered on the site until the client supplies them, and then only inside the WhatsApp reply, not the form.
- `notes` (optional, 0 to 500): "Anything else we should know? Colour preferences, allergies, questions."
- `consentMarketing` checkbox, separate and unticked by default, own row: "Yes, you may send me news and offers on WhatsApp or email. I can say stop at any time." Must not be required and never pre-ticked.
- `consentOrderData` is not a checkbox but a visible sentence with link to privacy notice: "We use your details only to handle this order."

### Step 8: Review and send
- Read-only summary in sections (Items, About you, Delivery, Gift, Business, Payment, Notes) each with an "Edit" link that returns to that step and comes back to Review.
- Totals block: subtotal if all prices known, else "Total to be confirmed". Delivery: "To be confirmed" or the typed fee.
- Primary button: "Send my order on WhatsApp". Secondary: "Copy order text instead". Beneath: "Nothing is charged. We reply on WhatsApp to confirm."
- Required checks re-run for all steps. On failure, the summary lists the broken fields with links back to the step.

### Microcopy approach
Plain, warm, first person plural for the business, second person for the customer. Short sentences. Explain why a field is asked. No exclamation marks, no countdowns, no "hurry". Swahili sparingly: success screen may add "Asante sana" once. Error text says what to do, not what the user did wrong. All strings live in one typed `copy.ts` for audit.

## 3. WhatsApp message

### 3.1 Order reference
Format `MK-YYMMDD-XXXX`: date in Africa/Nairobi, then 4 characters from the alphabet `23456789ABCDEFGHJKMNPQRSTUVWXYZ` (no 0, O, 1, I, L). Generated with `crypto.getRandomValues` at the moment of first Send, then stored on the draft so a re-send reuses it. Without a backend there is no uniqueness guarantee. With 31^4 (about 923,000) values per day the collision chance is negligible at this volume, and the business treats ref plus phone as the key.

### 3.2 Template (plain text, `\n` line breaks)
```
Hello Mikono Creations, I would like to order.
Order ref: MK-261001-7KQ2

ITEMS
1. Elephant, Medium, Sage x2 | KES [UNIT] each
2. Giraffe, Small, Ochre x1 | KES [UNIT] each
Items total: KES [SUBTOTAL] (to be confirmed)

CUSTOMER
Type: Parent or gifter
Name: Amina Otieno
Phone: +254712345678
Email: amina@example.com

DELIVERY
Method: Delivery, Nairobi
Area: Kilimani
Address: Argwings Kodhek Rd, Block C
Notes: Call on arrival
Date wish: 2026-10-20 (birthday)

GIFT
Note: "Happy birthday Zuri"
Wrap: Gift bag
Hide prices: Yes

PAYMENT
Preference: M-Pesa

NOTES
Please use soft colours.

Marketing messages: No
Sent from mikonocreations.[TODO domain]
```
Rules: a section is omitted when empty or skipped. Business orders add a BUSINESS block (name, type, KRA PIN, invoice email, PO number, resale intent). Placeholders `[UNIT]` and `[SUBTOTAL]` print "to be confirmed" when price is null. No emoji in structural labels, to keep copy plain and portable. User text is sanitised: control characters removed, runs of blank lines collapsed, each free text field capped as stated.

### 3.3 URL, limits and fallback
- Link: `https://wa.me/<WHATSAPP_NUMBER_DIGITS>?text=<encodeURIComponent(message)>`. Number is `NEXT_PUBLIC_WHATSAPP_NUMBER` (TODO from client), digits only, no plus.
- Length: wa.me has no documented text limit that we can rely on, and browsers, in-app browsers and some mobile handlers truncate long URLs. Design budget (an assumption to test on real devices): encoded URL under 2,000 characters. Non-ASCII characters inflate encoding, so budget on the encoded string.
- Builder runs three levels: full message; if over budget, compact (drops labels like Notes after the first 200 characters, prints items as `2x Elephant M Sage`); if still over, send a short message with ref, customer name, phone and "Full order details copied, pasting now" and rely on clipboard.
- Clipboard fallback: on Send we always write the full message to the clipboard first when permission allows (`navigator.clipboard.writeText`, with `document.execCommand("copy")` textarea fallback). The review screen shows a read-only textarea with the full text and a "Copy" button, so the user can paste it into WhatsApp manually. Copy success is announced in a live region: "Order text copied."
- Open behaviour: use an anchor click from the button handler (user gesture) with `target="_blank" rel="noopener"`. Do not use `window.open` after an async gap, which popup blockers stop.

## 4. After sending

1. App sets draft status `sent_to_whatsapp`, stores the order in `mk.orders.v1` (last 10 orders, for "send again"), clears the cart only after the user taps "I have sent it" on the confirmation screen (we cannot detect that WhatsApp actually sent it).
2. Confirmation screen `/order/sent?ref=...`:
   - Heading "Your order is ready to send" until the user confirms, then "Thank you. We have your order request."
   - Shows the ref prominently with a copy button, a recap, and three buttons: "Open WhatsApp again", "Copy order text", "I have sent it".
   - Text: "We reply on WhatsApp, usually within [TODO business hours]. We will confirm items, delivery fee, date and how to pay. Nothing is charged until you agree."
3. Business next steps (internal checklist shown in `/strategy` docs and optionally an internal card): check availability, confirm price and delivery, send payment details, confirm production time for made-to-order items, record the order in a sheet (TODO: tool).
4. Status expectations, stated honestly and generically: Requested, Confirmed on WhatsApp, Paid, Being made or packed, Sent or ready for pickup, Delivered. The site cannot show live status. Statuses are explained in plain words and the customer is told to message the ref for updates.
5. Follow up prompt: if the user returns within 24 hours and the order is not marked "I have sent it", show a quiet card "Did your order go through on WhatsApp? Send it again or copy the text." No repeated nagging, one prompt per draft.
6. Optional: invite to follow social accounts (TODO handles), after, not before, the order. Marketing consent never changes by this step.

## 5. Other flows

All enquiry flows use the same WhatsApp mechanism, reference prefix, copy fallback and consent pattern. Each is a short form of its own, not part of the order wizard.

### 5.1 Wholesale request (`/wholesale`, ref prefix `WS`)
Fields: `businessName` (req), `contactName` (req), `phone` (req), `email` (req), `businessType` (req), `location` (req town and country), `website` or `instagram` (opt), `interestedAnimals` (multi-select chips, req 1 or more), `sizes` (multi, req), `estimatedQuantity` (req select: 10 to 24, 25 to 49, 50 to 99, 100 and over, not sure), `colourNotes` (opt), `neededBy` (opt date), `resale` (req radio: retail, hospitality, gifting, event), `kraPin` (opt), `wantSamples` (opt toggle), `notes` (opt 500), `consentMarketing` (separate, unticked).
Template:
```
Hello Mikono Creations, wholesale request.
Ref: WS-261001-4HM9
Business: [name] ([type])
Contact: [name], [phone], [email]
Location: [town, country]
Interested in: [animals]
Sizes: [sizes]
Estimated quantity: [bucket]
Needed by: [date or "not set"]
Use: [resale]
KRA PIN: [value or "not given"]
Samples: [Yes or No]
Notes: [text]
```
Wholesale pricing is never shown, only "We send the wholesale price list on WhatsApp" (TODO: client price list).

### 5.2 Partnership enquiry (`/partner`, ref `PT`)
Fields: `organisationName` (req), `contactName` (req), `role` (opt), `phone` (req), `email` (req), `type` (req select: retailer, lodge, school, NGO, brand collaboration, media, event, other), `idea` (req 20 to 800 chars), `timeline` (opt), `website` (opt), `consentMarketing`.
Template: header "Hello Mikono Creations, partnership enquiry.", Ref, Organisation, Contact, Type, Idea (full text), Timeline, Website.
Notes: no partner logos or names are shown on the site until the client supplies them.

### 5.3 Supply enquiry (`/supply`, ref `SP`)
For people offering yarn, materials or services.
Fields: `companyOrName` (req), `contactName` (req), `phone` (req), `email` (opt), `offerType` (req multi: yarn or thread, recycled materials, filling or stuffing, safety eyes or notions, packaging, printing or labels, transport, photography or other service), `materialDetails` (req 20 to 600), `fibreOrOrigin` (opt: what it is made of and where from), `certifications` (opt text, never verified by the site), `minOrder` (opt), `priceRange` (opt), `location` (req), `samplesAvailable` (opt toggle), `consentMarketing`.
Template: "Hello Mikono Creations, supply enquiry." with Ref, Supplier, Contact, Offer, Details, Origin, Certifications (as stated by supplier), Minimum order, Price info, Location, Samples.
Helper copy states plainly that zero plastic and recycled yarn are Mikono's standards (from charter) and that materials containing plastic fibres will not be considered (TODO: client confirms exact wording).

### 5.4 Custom order (`/custom`, ref `CU`)
Fields: `customerType` (reuse), `name`, `phone`, `email` (opt), `animal` (select or "something else"), `size` (S to XL or "not sure"), `colourIdeas` (req 10 to 400), `referenceImages` (opt: users are told to send photos in WhatsApp after the message opens, since a static site cannot upload; no file input), `occasionAndDate` (opt), `budget` (opt select bucket or "not sure"), `quantity` (req 1 to 500), `personalisation` (opt: name stitched, special colours), `deliveryArea` (opt), `consentMarketing`.
Template: "Hello Mikono Creations, custom order request." with Ref, Customer, Contact, Animal, Size, Colours, Quantity, Occasion and date, Budget, Personalisation, Area, plus "I will send reference photos in this chat."
Expectation line: "Custom pieces take longer. We will tell you the time and price on WhatsApp."

## 6. Analytics events

All tracking waits for consent (consent banner from Phase 7). No names, phones, emails, addresses, gift notes or KRA PINs are ever sent to any tracker. Parameters use IDs, categories and buckets only. Currency is `KES`. Each platform is fired through one `track(eventName, params)` wrapper that maps to GA4 (`gtag`), Meta (`fbq`) and TikTok (`ttq`). Tracker IDs are TODO placeholders. UTM values are captured at first landing into sessionStorage and attached to `order_ref` context only as `utm_source`, `utm_medium`, `utm_campaign`.

| Moment | GA4 event and params | Meta Pixel | TikTok |
|---|---|---|---|
| View product | `view_item` (items[item_id, item_variant, price?], currency) | `ViewContent` (content_ids, content_type=product) | `ViewContent` |
| Add to cart | `add_to_cart` (items, value?, currency) | `AddToCart` | `AddToCart` |
| Remove from cart | `remove_from_cart` | custom `RemoveFromCart` | none |
| Open cart | `view_cart` | none | none |
| Start wizard | `begin_checkout` (items, value?) plus `wizard_start` (customer_type_unknown) | `InitiateCheckout` | `InitiateCheckout` |
| Step completed | `wizard_step_complete` (step_name, step_index, customer_type, fulfilment) | none | none |
| Step validation error | `wizard_error` (step_name, field_name) | none | none |
| Delivery chosen | `add_shipping_info` (shipping_tier: nairobi, kenya_other, international, pickup) | none | none |
| Payment pref chosen | `add_payment_info` (payment_type: mpesa, bank, cod) | none | none |
| Review shown | `wizard_review_view` (item_count, line_count) | none | none |
| Send tapped | `generate_lead` (lead_type=order, order_ref, value?, currency, customer_type) | `Lead` (value only if known) | `SubmitForm` |
| WhatsApp opened | `whatsapp_click` (context=order, order_ref) | `Contact` | `Contact` |
| Copy text used | `order_text_copied` (order_ref) | none | none |
| User confirms sent | `order_marked_sent` (order_ref) | none | none |
| Wizard abandoned | `wizard_abandon` (last_step, minutes_bucket) fired on `visibilitychange` hidden once per draft | none | none |
| Draft resumed | `draft_resume` (step_name) | none | none |
| Enquiry sent | `generate_lead` (lead_type=wholesale or partnership or supply or custom, ref) | `Lead` | `SubmitForm` |

Note: the standard `purchase` event is not used. No payment is taken on site, and mislabelling a WhatsApp request as a purchase would corrupt revenue reporting. Confirmed orders are counted from the business's own records until a backend exists.

## 7. Failure modes and recovery

| Situation | Detection | Recovery |
|---|---|---|
| WhatsApp not installed (mobile) | Page remains visible after 1.5 s following click | Message appears: "WhatsApp did not open. Your order text is copied. Paste it in WhatsApp, or send it to [TODO number]." Show copy textarea and the number as tel link. |
| Desktop without WhatsApp Desktop | wa.me opens WhatsApp Web | Works if logged in. Otherwise the same fallback panel shows. Detect desktop only for wording, not to change behaviour. |
| Popup blocker | `window.open` returns null, or no visibility change | Use anchor navigation in the same tab as final fallback, with the draft saved so Back returns to Review. |
| In-app browsers (Instagram, Facebook, TikTok) | User agent hint | Show "Open in your browser for the best result" hint, since some block deep links. Clipboard fallback stays. |
| URL too long | Encoded length over budget | Compact then short message plus clipboard, as in 3.3. |
| Clipboard denied | Promise rejects | Show selected-text textarea and instruction "Press and hold to copy". |
| User abandons mid wizard | `visibilitychange` or `pagehide` | Draft saved on every step change to `mk.draft.v1` (see below). |
| Resume draft | On `/order` load with a draft under 14 days old | Banner: "Continue where you stopped (Step 4 of 7)?" Buttons "Continue" and "Start again". "Start again" deletes the draft. |
| Cart changed during wizard | Cart version hash differs | Review step shows "Your cart changed" with the new summary, requiring re-confirmation. |
| Offline | `navigator.onLine` false | Wizard still works. Send explains "You need internet to open WhatsApp." |
| JavaScript disabled | noscript block | Show the WhatsApp number and a plain "Message us" link. TODO copy. |
| Double tap on Send | Button disabled 2 s | Reuses the same ref. |
| localStorage unavailable | Write throws | In-memory state, notice shown once. |
| Number not yet supplied (build phase) | Env var missing | Send button is replaced by copy-only mode and a build warning lists it. |

Draft contents: all wizard fields except consent and anything that looks like a KRA PIN is kept (needed for resume), nothing else is stored. Draft is deleted on "I have sent it".

## 8. Accessibility and child-first form rules

1. Targets at least 44 by 44 px with 8 px spacing. Body and input text at least 16 px (avoids iOS zoom). Line height at least 1.5.
2. Every input has a visible `<label>`, never placeholder only. Helper text linked with `aria-describedby`. Required marked with the word "required" or "(optional)" in text, not an asterisk alone.
3. Correct `autocomplete` (`name`, `tel`, `email`, `street-address`, `organization`), `inputmode="tel"` for phone, `type="email"`, `type="date"`.
4. Errors: error summary with `role="alert"` on submit, per field `aria-invalid` and inline message with an icon and text. Colour is never the only signal. Palette per charter, all text AA contrast, focus ring at least 3 px with 3:1 contrast.
5. Keyboard: full tab order, Enter submits a step, Escape closes drawer, focus trap in drawer, visible skip link, no keyboard traps in the combobox.
6. Stepper: `<ol>` with `aria-current="step"`. Step change moves focus to the step heading and updates `document.title`.
7. Live regions (polite) for cart changes, copy success and character counters at milestones only.
8. Motion: all animation (peeking animal, step transitions) disabled under `prefers-reduced-motion`. No auto-advancing, no timers, no blinking.
9. No dark patterns: no pre-ticked boxes, no hidden costs, no confirm-shaming, no fake urgency, no pop-up on first paint. Decline wording is neutral.
10. Child-first: the site assumes an adult buyer. Do not collect a child's surname, age in years, school or photo. Recipient age is a bucket, optional. Any child imagery follows the manifest clearance rule. Wording is simple (reading age about 12 or under), with no legal jargon in the primary flow.
11. Forgiving input: trim whitespace, accept phone formats, uppercase KRA PIN, allow paste, never reject names for being short, non-Latin or hyphenated, preserve entries when navigating back.
12. Test with a screen reader (VoiceOver, TalkBack, NVDA) and 200 percent zoom at 390 px width.

## 9. Data handling and privacy (Kenya Data Protection Act, 2019)

This section is a design basis and not legal advice. TODO: client reviews it with a Kenyan lawyer or the Office of the Data Protection Commissioner guidance.
- Controller: Mikono Creations. Registration with the ODPC as a data controller or processor may be required depending on size and data handled (TODO: confirm). Name a contact for data requests (TODO).
- Minimisation and purpose: collect only fields in the active path. Use details only to process the order or enquiry. Marketing is a separate consent, unticked, optional, and withdrawable ("send STOP on WhatsApp").
- Where data goes: the site has no server. Order data goes from the browser to the customer's own WhatsApp, then to the business's WhatsApp. WhatsApp is a third party processor, state this in the privacy notice. Cart and draft sit in the visitor's own localStorage only.
- Transparency: a short notice appears at Step 2 and Review: what we collect, why, who sees it (the Mikono team and WhatsApp), how long we keep it (TODO retention, suggested 24 months for invoicing records, shorter for enquiries), and how to ask for access, correction or deletion.
- Sensitive data: do not collect a child's data beyond optional first name and age bucket. If a child's data is ever collected, parental consent rules apply, and the design avoids it.
- KRA PIN is a tax identifier. It is stored only in the draft in memory or localStorage when needed for resume, excluded from analytics, and shown only in the WhatsApp message to the business.
- Analytics and ad pixels load only after consent. Cross-border transfer: trackers send data outside Kenya, so the consent text says so.
- Retention on device: draft 14 days, cart 30 days, last orders list 10 items, with a "Clear my data" button in the footer that wipes all `mk.*` keys.
- Business side: orders pasted into WhatsApp stay in the business's phone. Recommend a written internal rule for who has access, deleting on request, and not forwarding customer details (TODO: client).

## 10. Data model (TypeScript)

```ts
export type Size = "S" | "M" | "L" | "XL";
export type CustomerType = "parent_gifter" | "retailer_business" | "organisation";
export type Availability = "ready" | "made_to_order" | "ask" | "unavailable";
export type PaymentPref = "mpesa" | "bank_transfer" | "cash_on_delivery";
export type OrderStatus =
  | "draft" | "sent_to_whatsapp" | "confirmed" | "paid"
  | "in_production" | "dispatched" | "delivered" | "cancelled";

export interface CartLine {
  key: string;            // `${animalSlug}|${size}|${colourway}`
  animalSlug: string;
  size: Size;
  colourway: string;
  quantity: number;       // 1..maxPerLine
  nameSnapshot: string;
  imageSnapshot: string;  // public path from approved manifest
  unitPriceKes: number | null; // null = price on request
  availability: Availability;
  addedAt: string;        // ISO 8601
  note?: string;
}

export interface Cart {
  version: 1;
  id: string;
  lines: CartLine[];
  updatedAt: string;
  expiresAt: string;
}

export interface Customer {
  type: CustomerType;
  fullName: string;
  phoneE164: string;
  email?: string;
  business?: {
    name: string;
    businessType: string;
    role?: string;
    kraPin?: string;
    invoiceName?: string;
    invoiceEmail?: string;
    poNumber?: string;
    needsInvoice: boolean;
    resaleIntent?: string;
  };
  consentMarketing: boolean; // default false
  consentAt?: string;
}

export type DeliveryInfo =
  | { method: "pickup"; dateWish?: string }
  | { method: "delivery"; zone: "nairobi"; area: string; areaOther?: string;
      streetOrLandmark: string; notes?: string; dateWish?: string; occasion?: string }
  | { method: "delivery"; zone: "kenya_other"; county: string; town: string;
      pickupPoint?: string; notes?: string; dateWish?: string }
  | { method: "delivery"; zone: "international"; country: string;
      addressLines: string[]; city: string; postcode?: string; dateWish?: string };

export interface GiftOptions {
  isGift: boolean;
  giftNote?: string;      // max 240
  wrap?: "none" | "paper" | "bag";
  hidePrices?: boolean;
  recipientName?: string;
  recipientPhoneE164?: string;
  recipientAgeBucket?: string;
}

export interface Order {
  ref: string;            // MK-YYMMDD-XXXX
  status: OrderStatus;
  createdAt: string;
  sentAt?: string;
  markedSentByUser?: boolean;
  cartSnapshot: CartLine[];
  customer: Customer;
  delivery: DeliveryInfo;
  gift: GiftOptions;
  paymentPreference: PaymentPref;
  notes?: string;
  totals: { subtotalKes: number | null; deliveryFeeKes: number | null; totalKes: number | null };
  utm?: { source?: string; medium?: string; campaign?: string };
  messageLevel: "full" | "compact" | "short";
}

export interface Draft {
  version: 1;
  step: number;
  order: Partial<Order>;
  updatedAt: string;
}
```

## 11. What a backend would add later

- Server-side order ID with guaranteed uniqueness, stored orders and real status tracking with a lookup page.
- Price and stock validation at send time, so totals are real and tampering is impossible.
- Server-sent WhatsApp via the WhatsApp Business Cloud API, removing URL length limits and allowing delivery receipts.
- Payments: M-Pesa Daraja STK push, card or bank links, and automatic confirmation.
- Delivery fee engine from typed zones, and available date calendar.
- Customer accounts, saved addresses, reorder, wholesale price tiers behind login.
- Image upload for custom orders, email and SMS notifications, admin dashboard, abandoned cart reminders (with consent), server-side analytics (Meta CAPI, GA4 Measurement Protocol) and a managed retention and deletion process for DPA requests.
- Spam protection (rate limit, bot checks) for enquiry forms.

## 12. Open inputs (placeholders to list in the build)

WhatsApp number, domain, retail and wholesale prices, delivery zones and fees, COD policy, bank and M-Pesa details, gift wrap options, colourways per animal, made-to-order lead time, max quantities and minimum wholesale order, pickup address and hours, tracking IDs, social handles, courier names, privacy retention periods and ODPC registration status.
