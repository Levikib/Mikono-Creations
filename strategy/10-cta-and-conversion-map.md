# 10. CTA and Conversion Map

Status: planning document. Obeys 00-CHARTER.md and 07-BUILD-DECISIONS.md. No dark patterns, no invented facts or prices, no dashes as punctuation, consent-gated tracking.

Method note: this audit used text extraction of the live site (https://mikono-creations.vercel.app) for home, shop, product (giraffe), cart, order, journal, story, stockists, wholesale and the sitemap. Screenshots at 390 and 1440 could not be taken in this run because no shell was available. Visual items (hierarchy, thumb reach, contrast of buttons) are marked VERIFY and need a screenshot pass before build. The order wizard rendered only "Loading your order form" in extraction, so its steps are scored from the spec (D14), not from the live page.

Scope note: D36 excludes wishlist, quiz, gift finder, bundles, build your own, reviews, reminder club, UGC and search from release 1. The owner now wants more conversion points and deeper content. Section 4 and 7 items that fall under D36 are labelled R2 (release 2) and need the owner to lift D36 in writing. Everything labelled R1 fits today's rules.

The one blocker that outweighs every CTA: all products show "Ask for price" because `pricesConfirmed` is false (R7). People can browse and ask, but cannot compare or decide alone. Until prices exist, every CTA must be an honest "ask a person" path made fast. When prices are supplied, flip the flag and the whole map below gets stronger.

---

## 1. Page by page CTA inventory (today) and score

Score is out of 10: how well the page moves a visitor to the next useful step, given the price constraint.

| Page | What exists today | What is missing | Score |
|---|---|---|---|
| Home | Hero "Shop the animals" and "Trade enquiries"; five category tiles; 8 featured cards ("Choose size", "Ask for price"); "Choose by size", "Gifts", "Meet our makers", "Shops, lodges and organisations"; "How ordering works" with "Start choosing"; "Read our story"; "Stock our animals" | Newsletter or WhatsApp Channel capture, occasion row, gift entry with a clear job, a "Not sure? Tell us who it is for" WhatsApp prompt, journal teaser, stockist visit CTA for shoppers (only the trade one exists), a mid-page WhatsApp ask, a closing CTA band | 6 |
| Shop listing | Category links, kind and colour filters, 24 cards each with "Choose size" and "Ask for price" | Sticky filter summary on mobile, "Not finding it? Ask us" card, end of list CTA, empty filter state with next step, "Ask on WhatsApp" per card is present but "Ask for price" repeated 24 times is noise, no gift or size shortcuts, no custom order link | 5 |
| Product (giraffe) | Colour and size selectors, quantity, "Add to order list", "Ask on WhatsApp about this animal", "Ask for price", "Ask us about availability", related animals, care and size links, four attribute lines | Sticky mobile action bar (VERIFY), "Customise this animal" link, size help inline, gift option, "Share this animal" on WhatsApp, "Save for later" (R2), journal story link ("how this is made"), stockist link ("see it in Karen"), a maker line, three near-identical ask buttons confusing the hierarchy | 6 |
| Cart (order list) | Empty state with "See the animals"; footer links | Empty state offers only one route; no suggestions, no "Not sure what to pick? Ask us" ; filled state not verified (VERIFY) | 4 |
| Order wizard | Spec exists (D14); live extraction showed loading only | Verify in browser. Needs "Save my list and finish later", progress, reassurance about no payment taken, WhatsApp fallback at each step | 5 (unverified) |
| Order sent | Route exists (`/order/sent`) | Not verified. Needs next-best actions (section 3) | 4 (unverified) |
| Journal index | "Read the post", "Read", "Suggest a topic", floating "Chat" | Newsletter, "shop the animals in this story" rail, series navigation, category chips, custom order link | 5 |
| Journal post | Not fetched; 10 posts exist | Inline product embeds, end-of-post CTA stack, next post, share on WhatsApp | 4 (assumed, VERIFY) |
| Story | "Meet the makers", "See the outlets", "See the animals" at the bottom | "Shop the animals the women make" mid-page, a "send a message to the makers" path, visit CTA, wholesale CTA for retailers | 6 |
| Makers | Not fetched | Link from each maker block to a relevant animal, and to "Support this work: buy an animal" | 4 (assumed) |
| Stockists | Seven named outlets, per-outlet WhatsApp, "Ask us on WhatsApp before you visit", wholesale and partner links | Directions link per outlet, "Save this outlet", "Order for pickup at this outlet" only if the client confirms, hours (TODO) | 7 |
| Wholesale | Request form with types (price list, sample pack, quote, reorder), consent checkbox (unticked, good), "Send request on WhatsApp", "How it works" | Segment picker (retailer, lodge, corporate, NGO, school), minimum and lead time (TODO), catalogue download with skip option, a phone call option, reassurance on reply time (TODO) | 7 |
| Gifts | In nav; content not fetched | Occasion triggers, delivery cut off dates (TODO), gift note, "Ask for a gift suggestion" | 5 (assumed) |
| FAQ | Exists | Each answer should end with a relevant CTA | 4 (assumed) |
| 404 | Exists | Verify it carries shop, WhatsApp and popular links | 5 (assumed) |
| Footer | Care, size guide, FAQ, delivery, privacy, cookies, terms, cookie settings, social, phone | Newsletter or Channel join, "Start an order" CTA band above the footer, stockist and wholesale links, custom order | 5 |
| WhatsApp float | "Chat" present | Prefilled page context (VERIFY), hide rules per D34 (VERIFY) | 7 |
| Header and menu | Shop, Gifts, Wholesale, Our story, Journal, Contact, Chat on WhatsApp, Call, cart count | Cart count is good. No emphasised primary action in header on mobile (VERIFY) | 6 |

Site average: about 5.4 of 10. The structure is sound. The weakness is that nearly every page ends without a next step, and three "ask" labels compete on the product page.

---

## 2. The complete CTA system

### 2.1 Hierarchy

One primary per screen, never two competing primaries.

- **Primary** (filled clay or baobab brown, 48px high, one per viewport): moves toward an order or an enquiry.
- **Secondary** (outlined, same height): a related route that keeps momentum (see sizes, ask a question).
- **Tertiary and micro** (text links with an arrow, 44px tap area): learning, saving, sharing, subscribing.
- Colours stay within the muted palette and the 0.13 chroma cap. Emphasis comes from fill, size and position, not from brightness.

### 2.2 Primary CTAs, with three label options each

| Job | Option A | Option B | Option C |
|---|---|---|---|
| Start choosing | Shop the animals | See all our animals | Find an animal |
| Add on product page | Add to my order list | Add this animal to my list | Put this in my order |
| Send order | Send my order on WhatsApp | Send this list to Mikono | Send to Mikono on WhatsApp |
| Ask when price unknown | Ask for the price | Ask Mikono the price | Get the price on WhatsApp |
| Wholesale | Request the trade price list | Ask for trade prices | Send a trade request |

Recommendation: the price one should say what happens. "Ask for the price" plus a line "A person replies on WhatsApp" (reply time is TODO, client sets, do not state a number until given).

### 2.3 Secondary CTAs

| Job | Option A | Option B | Option C |
|---|---|---|---|
| Ask a question | Ask a question | Ask on WhatsApp | Message us about this animal |
| Choose a size | Help me choose a size | Which size should I pick? | Compare sizes |
| Customise | Customise this animal | Ask for a different colour | Ask for a special order |
| Gift | Send as a gift | Add a gift note | Ask for gift ideas |
| Stockist | See where to buy in Nairobi | Visit an outlet | Find a shop near you |
| Trade | Stock our animals | Sell Mikono in your shop | Wholesale for shops |
| Share | Send to a friend on WhatsApp | Share this animal | Share this list |
| Custom | Tell us what you have in mind | Start a custom order | Ask about a special order |

### 2.4 Micro CTAs

| Job | Option A | Option B | Option C |
|---|---|---|---|
| Save (R2) | Save this animal | Keep this on my list | Save for later |
| Newsletter | Get the monthly note | Join the monthly note | Send me the monthly note |
| WhatsApp Channel | Join on WhatsApp | Follow the Channel | Get updates on WhatsApp |
| Restock (R2) | Tell me when it is back | Message me when it returns | Let me know on WhatsApp |
| Download | Download the care card | Get the printable care card | Save the care card |
| Colouring | Download the colouring sheet | Print this animal to colour | Get the sheet |
| Read on | Read the next story | Next in the series | Keep reading |
| Return | Continue my order | Pick up where I left off | Back to my list |
| Reassure | See how ordering works | How it works | What happens after I send |

Copy rules: verbs plain, no exclamation marks, no "Don't miss", no "No thanks, I don't love animals" style declines. Decline links read "Not now" or simply close.

### 2.5 Placement rules

1. First screen of every page has one primary CTA visible without scrolling, at 390 and 1440.
2. Every page ends with a closing CTA band (primary plus one secondary), above the footer.
3. Any section longer than about 1.5 mobile screens gets a mid CTA, a text link with an arrow, not a banner.
4. Cards: one CTA each ("Choose size"), pinned to the card bottom per R4. The "Ask for price" line becomes a quiet text row, not a second button, so cards read as one action.
5. After a successful action (add, send, subscribe) show the next step in the confirmation, not a dead end.
6. Never place a CTA that covers content, the consent bar, or another sticky element (D34).
7. Tap targets 44px minimum, 8px gap between neighbours.

### 2.6 Mobile sticky bar behaviours

- **Product page:** sticky bar with the size chosen, "Add to my order list" (primary) and a WhatsApp icon button (secondary). Appears after the main button scrolls out of view, disappears at the footer. Never with the WhatsApp float (D34).
- **Listing page:** a slim bar "Filters" and "Ask on WhatsApp", visible while scrolling up, hidden while scrolling down.
- **Cart:** sticky "Continue to order form" with the item count.
- **Wizard:** sticky "Next" and "Back"; WhatsApp float hidden.
- **Content pages (journal, story, FAQ):** WhatsApp float only, no bar.
- **Consent bar:** sits above everything; no sticky bar renders until it is answered or dismissed.
- Safe area insets respected on iOS; bars never exceed 64px high.

### 2.7 What appears at scroll depth

All inline, none a pop-up, none on first paint.

| Depth | Home | Journal post | Product |
|---|---|---|---|
| 0 to 25 percent | Hero primary | Title, reading time, share | Gallery, selectors, primary |
| 25 to 50 | Category and featured rail | Inline product embed (first) | About, size help link |
| 50 to 75 | Occasion row, story teaser | Second embed or "ask a question" | Gift and customise row |
| 75 to 100 | Newsletter or Channel join, closing band | "Shop the animals in this story", newsletter, next post | Related animals, stockist, closing band |

A gentle "Would you like to save this list?" line may slide into the bottom of a page only after 60 percent scroll plus 20 seconds, once per session, dismissible, and never again after dismissal. It is a line in the flow, not a modal.

### 2.8 Honest exit alternatives

No exit-intent popup. Instead:

- **Save this animal to your list:** a persistent micro CTA on product pages (device only, `localStorage`, stated plainly). R1 can do this using the existing order list; wishlist proper is R2.
- **Send this to yourself on WhatsApp:** opens WhatsApp with the product link. Useful on a phone, honest, no data collected.
- **Leave your list safe:** the order list already persists on the device; say so in the cart ("We keep this list on your phone only").
- **Mid-wizard:** "Save and finish later" copies a link to the list.
- **Cart abandon follow up:** none automatic. Only if the person sent their number for that purpose.

### 2.9 Hover and tap micro-interactions

Calm, short, reduced-motion safe.

- Card hover: lift 2px, shadow from `clay-sm` to `clay`, image scale 1.02. Tap: pressed state with a 0.98 scale, 120ms.
- Size chips: filled on select, a soft check icon, announced to screen readers.
- Add to list: the button text changes to "Added to your list" for 1.5 seconds; the cart icon bumps once; a toast with "View my list" (D13: drawer opens only on cart tap).
- Save heart: toggles with a small fill, label changes to "Saved".
- Animal profile cards: tap to flip or reveal one fun fact (R2), also available as plain text for no-motion.
- WhatsApp float: a quiet outline pulse once on first load after 10 seconds, no repeats. Disabled with reduced motion.
- Success: one small stitch-draw animation on the confirmation tick (CSS only).

---

## 3. CTA map by page type

### Home

| Section | CTA changes |
|---|---|
| Hero | Primary "Shop the animals"; secondary "Ask on WhatsApp" (replaces "Trade enquiries" in the hero, which moves into a trade strip below). Trust line beneath: zero plastic, nothing detachable, 25+ women supported |
| Category tiles | Each tile "See safari animals" etc.; add a sixth tile "Not sure? Help me choose" linking to size guide now, quiz later (R2) |
| Featured animals | Card CTA "Choose size"; below the rail "See all 24 animals" (use real count at build) |
| Size row ("Choose by size") | Keep; each size tile "See the M animals" |
| Occasion row (new) | Tiles for Birthday, New baby, Christmas, Easter, Mother's Day, Eid, Graduation, linking to `/gifts#occasion` anchors. Only show an occasion within its season window; always show Birthday and New baby |
| How ordering works | Keep "Start choosing"; add a second link "Read how WhatsApp ordering works" to the journal post |
| Story teaser | "Read our story" plus "Meet the makers" |
| Journal teaser (new) | Three latest posts, "Read the journal" |
| Where to buy | Shopper CTA "See where to buy in Nairobi" (new); trade CTA "Stock our animals" |
| Join (new) | One line, two options: "Join on WhatsApp" Channel, "Get the monthly note" email (email is R2 until a provider is chosen) |
| Closing band | "Ready to choose? Shop the animals" and "Ask a question" |

### Shop listing

- **Cards:** "Choose size" primary; the price row is plain text "Price on request"; per card no extra buttons. Optional quiet "Save" heart (R2).
- **Filters:** show active filter count; "Clear filters" always visible when any is active. Mobile filters in a bottom sheet with "Show 12 animals" as the apply button.
- **Interstitial card** after row 3 (uniform card size, R4): "Can't see what you want? Ask us" linking to custom.
- **Empty state:** "No animals match these filters. Clear filters, or ask us if we can make it." Buttons "Clear filters" and "Ask on WhatsApp".
- **End of list:** closing band: "Seen them all? Tell us what you are looking for" plus "Start a custom order" plus "Read how to choose a size".
- **Category pages:** an intro line, a size link, and a gift link.

### Product page

- **Above the fold:** name, colour chips (photo swatches, D30), size chips, quantity, one primary "Add to my order list", one secondary "Ask on WhatsApp about this animal". Merge "Ask for price" and "Ask us about availability" into the single ask button; the prefilled message includes colour and size chosen. This fixes the three-ask confusion.
- **Trust line** directly under the buttons: zero plastic, nothing detachable, recycled acrylic yarn (approved claims only, D26).
- **Gallery:** each image carries `shownSize`; a caption "Shown in size M" only when known; "Ask to see this in another colour" link under the gallery.
- **Size help:** an inline expandable "Which size?" with relative comparisons (R5) and a link to the size guide. No centimetres.
- **Customise this animal:** row under the selectors: "Want a different colour or a name tag? Customise this animal" linking to `/custom` with the product prefilled. Only offer what the client confirms is possible (TODO).
- **Gift:** "Sending this as a gift?" opens the gift note step in the wizard; link to gift guide.
- **Share:** "Send to a friend on WhatsApp".
- **Story link:** "How this is made" linking to the matching journal post (for example "From yarn to giraffe" on the giraffe page).
- **Stockist:** "See this in person: outlets in Nairobi" (the outlets list is real, but do not claim any outlet stocks this product, TODO).
- **Related:** "More crocheted animals" rail (exists), add "Animals that go with it" once sets exist (R2).
- **Bundles (R2):** "Build a safari family": see section 4.
- **Closing band:** primary "Add to my order list", secondary "Ask a question".

### Cart (order list)

- Heading "Your order list". Lines with size, colour, quantity, remove, "Save for later" is not needed.
- Primary "Continue to order form". Secondary "Keep choosing". Tertiary "Send this list to myself on WhatsApp".
- Reassurance block: "You do not pay on this site. We confirm price, delivery and payment with you on WhatsApp."
- Soft prompt at the quote threshold (D21): "Ordering many? Ask for a trade quote", never a block.
- Empty state: three routes: "See the animals", "Choose by size", "Ask us to suggest something".
- Suggestions row: "Others also look at" is banned unless real data; use "Other safari animals" (neutral).

### Order wizard

- Keep each step to one primary "Next". Show "Step 2 of 4" (computed).
- Persistent line: "Nothing is charged. You will chat with a person before you pay."
- Each step has a quiet "Ask a question on WhatsApp" link that carries the draft context.
- Gift step: skippable, with a plain hint (D16: no child surname, school or age).
- Review step: primary "Send my order on WhatsApp"; secondary "Copy my order" (fallback); tertiary "Edit my list".
- Error handling: forgiving, no field cleared, offers "Send what I have and ask Mikono to sort the rest".

### Order sent (next-best actions)

Order of actions, one primary, the rest quiet:

1. Primary "Open WhatsApp again" (if the app did not open) or "Chat with us now".
2. "What happens next" three-step plain list: we read it, we reply with price and delivery, you confirm and pay (payment methods TODO).
3. "Copy your order" and "Save your order number" (ref MK-YYMMDD-XXXX).
4. "Read the care guide" so the wait is useful.
5. "Join the WhatsApp Channel" (consent separate and unticked).
6. "Tell a friend": share the site link, no reward language.
7. "Keep browsing": the safari journal or gift guide.
Never ask for a review here; the review ask comes after delivery.

### Journal posts

- **Inline product embeds:** a uniform product card inside the text where the animal is first mentioned, label "Meet the giraffe".
- **End stack:** "Shop the animals in this story" (rail of 2 to 4 real products named in the post), then "Ask us about a custom animal", then newsletter or Channel join, then "Next in this series" and "Share on WhatsApp".
- **Mid-post:** a text link "Not sure of the size? Read the size guide" in size related posts.
- **Index:** category chips (Making, Care, Animals, Ordering, Trade), "Suggest a topic" stays.

### Projects

- "Support this work" links to the shop ("Buy an animal"); no donation language unless the client has a real donation route (TODO).
- "Bring a project to your school or group" opens the partners enquiry (school type preselected).
- Gallery captions link to the related animal.

### Story

- Mid-page after "The women behind it": "Shop the animals they make".
- "Send a message to the makers" opens WhatsApp with a prefilled note; the team relays it. Confirm with the client that this is wanted.
- Bottom: "Shop the animals", "Visit an outlet", "Stock our animals".

### Makers

- Each maker block links to one animal she is known for, only if the client confirms it. Maker names are not used unless supplied (R8).
- CTA "Buy an animal made by hand in Nairobi" generically until names exist.

### Stockists

- Per outlet: "Ask on WhatsApp before you visit" (exists), add "Get directions" (map link, address TODO where unconfirmed), "Share this outlet".
- Top: "Visiting from abroad? Order and send to a recipient in Nairobi" linking to delivery.
- Bottom: trade CTA "Sell Mikono in your shop".

### Wholesale

- Segment picker before the form: Shop or gift store, Lodge or hotel, Corporate gifts, NGO or organisation, School. Each preselects request type and the questions.
- Form primary "Send request on WhatsApp"; secondary "Prefer to call? +254 724 592 115".
- "Download the catalogue" with "Skip, just download" (D20: no prices in it). Needs a real PDF (TODO).
- Reply time line once the client sets it.

### Gifts

- Occasion tiles, each with a short plain intro, "Choose a size", and a delivery note.
- "Add a gift note" explained; "Send directly to the person" (adult contact only, D16).
- Cut off date line only once real courier lead times are supplied.
- "Not sure? Tell us who it is for" opens WhatsApp prefilled "Hello, I am looking for a gift for [who], for [occasion], budget around [amount]".

### FAQ (convert doubts)

Each answer ends with one relevant CTA:

| Doubt | CTA |
|---|---|
| How much? | "Ask for the price" |
| Which size? | "Help me choose a size" |
| Is it washable? | "Read the care guide" |
| How do I order? | "Start choosing" |
| Can I get a different colour? | "Customise this animal" |
| Do you deliver to me? | "See delivery" |
| Can I buy in bulk? | "Request the trade price list" |
| Still unsure | "Ask on WhatsApp" at the page end |

Do not answer "is it safe" with claims beyond D26.

### 404

"This page has wandered off." One line, then: "Shop the animals", "Read the journal", "Ask on WhatsApp". Show real popular links.

### Footer

- Band above: "Ready to choose? Shop the animals", "Ask a question".
- Columns: Shop (categories), Help (care, size guide, FAQ, delivery), Trade (wholesale, partners, supply, stockists), Join (WhatsApp Channel, newsletter in R2).
- Keep "Cookie settings" and "Clear my saved details" together (D35).

### WhatsApp float

- Label "Chat". On product pages the prefilled text names the animal and the chosen colour and size; on cart it includes the list; elsewhere it names the page.
- Hides on `/cart`, `/order`, when a sticky bar or consent bar shows (D34).
- Honest status: show "Replies during business hours" only when hours are supplied (TODO). Never show a fake "online now" dot.

### Menu

- Mobile menu: primary "Shop the animals" button at the top; list below; "Chat on WhatsApp" and "Call" at the bottom; cart count visible.
- Add "Where to buy" and "Care and size" under a "Help" group.

---

## 4. Honest persuasion mechanics

Allowed levers: clarity, convenience, real occasions, real story, real impact facts. Banned: fake scarcity, fake timers, fake social proof, guilt.

1. **Impact framing (R1).** Allowed fact: 25+ women supported, made in Nairobi, zero plastic, recycled acrylic yarn. Copy: "Each animal is crocheted by hand in Nairobi. Buying one supports the 25+ women who make them." Check "made by" wording: D26 says "made by 25+ women" only if the client confirms the 25+ are the makers. Use "supports" until then. No impact counters beyond the 25+ figure.
2. **Occasion triggers (R1 content, R2 reminders).** One page section per occasion on `/gifts` with a start date for messaging: Christmas (early November, with real cut off dates TODO), Easter (about four weeks before), Mother's Day (three weeks, framed as a gift from the child, no guilt), baby showers (always on, no safety age claims, R9), birthdays (always on), graduations (four weeks before school calendar dates, TODO), Eid (two weeks before, copy reviewed by a Muslim reviewer, TODO). Dates change yearly; the owner confirms each one.
3. **Gift finder (R2).** Three questions on one screen: who for, what occasion, budget band (only when prices are real). Result: 3 animals with "Ask on WhatsApp" prefilled. Answers stay on the device (D16). Until R2, the same job is done by "Not sure? Tell us who it is for" on WhatsApp.
4. **Size finder quiz (R2).** Questions: who is it for, where will it live (bed, shelf, car, shop display), hold or display. Outcome: a size class S to XL with relative comparison text (R5). No age bands. Until R2, the "Which size?" inline panel is the entry.
5. **Bundles and sets (R2).** Sets only when the client defines them and prices. Candidates for discussion: "Safari family" (for example elephant, giraffe, zebra, lion if all exist), "Farm and pets" is banned wording (D3), so use "Home animals". No "save X percent" unless a real price difference exists.
6. **Build a safari family (R2).** A set builder: pick 3 to 5 safari animals, choose sizes and colours, all added to the order list in one tap. It is a convenience picker, not a discount engine. Show only existing products.
7. **Wishlist saved on device (R2).** `localStorage`, "Saved on this phone only", with "Send my list on WhatsApp" (copies to message). No account.
8. **Share a list on WhatsApp (R1 or R2).** The order list becomes a link or text message the person sends to a partner or relative ("Which of these do you like?"). Pure convenience.
9. **Back in stock and new colour alerts (R2).** The person taps "Tell me when it is back"; WhatsApp opens with a prefilled message to Mikono, who adds them to a broadcast list manually. No stock counts (D10). State "We will only message you about this animal."
10. **Referral (R2, owner decision).** Start with "Share a gift" link. A reward only if the client agrees real terms in writing.
11. **Loyalty (R2).** Early access to restocks and new animals for repeat buyers, handwritten thank you at the third order. No points.
12. **Reviews and photo UGC (R2, consent).** Reviews only from real buyers with an order reference, first name and month; show mixed reviews; hide averages under 5 reviews. UGC needs the written consent step in 04 section 4. No incentive for photos in phase one.
13. **Social proof that already exists and is safe:** the seven named outlets (from the brief, R2 of decisions), 25+ women. Do not add logos or "as seen in".

---

## 5. Lead capture without a backend

All capture is WhatsApp or a copy-paste fallback until the client picks an email provider (D18). Marketing consent is unticked by default and travels in the message text.

| Capture point | Sits on | Honest incentive | Destination now | Later |
|---|---|---|---|---|
| WhatsApp Channel join | Home, journal end, order sent, footer | New animals and restocks, monthly at most | WhatsApp Channel link | Same |
| Monthly note (email) | Footer, journal end | A short note on new animals and maker stories | Hide until provider chosen | Email service plus Sheet |
| Ask a question | Product, FAQ, listing | A real reply from a person | WhatsApp prefilled | Same |
| Order list send | Wizard | The order itself | WhatsApp | Same |
| Wholesale request | `/wholesale`, partners | Trade price list sent by a person | WhatsApp with copy fallback | Email plus Sheet |
| Catalogue download | Wholesale | The PDF, with skip email option | Direct file | Email optional |
| Colouring sheet and quiz downloads | Kids pages | A printable sheet, free | Direct file, no gate | Optional email for new sheets |
| Restock or colour alert (R2) | Product | Be told first | WhatsApp message to Mikono | Provider list |
| Occasion reminder (R2) | Gifts | A reminder before the date, with ideas | WhatsApp message | Provider list |
| Custom request | `/custom`, product | An answer on what is possible | WhatsApp | Sheet |
| Visit and directions | Stockists | Info | Map link | Same |

Rules: one line saying what we send and how to stop; adults only line; no child data; honeypot not needed for WhatsApp-only; no discount codes as bait. Downloads are never gated by guilt: a "Skip, just download" always works.

---

## 6. B2B conversion path

Segments and what each needs:

| Segment | Landing | Primary CTA | Qualifying questions (in the wholesale form) | Next step |
|---|---|---|---|---|
| Retailers and gift shops | `/wholesale` | "Request the trade price list" | Shop name, town, what you sell, rough quantity | Person sends price list, then sample pack |
| Lodges and hotels | `/partners` lodge block | "Ask about lodge gifts" | Property, number of rooms or shop, guest mix, timing | Call, then sample |
| Corporate gifting | `/partners` corporate block | "Request a gift quote" | Company, quantity, delivery date, branding wanted (TODO feasibility) | Quote on WhatsApp |
| NGOs | `/partners` NGO block | "Talk to us about a partnership" | Organisation, purpose, quantity, timeline | Call |
| Schools and ECD | `/partners` school block | "Ask about classroom sets" | School, group size, date | Call, safety statement only per D26 |

Stages: visit, read "How it works", send request, reply, price list, sample or quote, first order, shelf photo with permission, reorder. A lead score for the owner (not shown to users): hot if quantity above `QUOTE_THRESHOLD_UNITS` and a date is given; warm if a shop with a town; cold if only a question. Reorder reminder at 8 weeks (04 assumption, adjust with real sell through). No wholesale prices anywhere public (D20). Stockist referral and locator are proof, not logos.

---

## 7. Content depth plan

Goal: a visitor who arrives for one animal can keep exploring for 20 minutes, and every page leads to an order path. Limits: R8 allows plain, accurate general knowledge but no invented statistics, quotes, studies, or safety claims. Every fun fact is checked against two reputable sources before publishing and the source is kept in the content file, not shown if it clutters.

| Content type | Quantity (first 90 days) | Purpose | Priority |
|---|---|---|---|
| Animal profile pages (the 18 species in the catalogue) | 18 | Search and depth: what it eats, where it lives, one fun fact, the Mikono version, available colours and sizes, CTA | 1 |
| "Meet the animal" cards | 18 (one per profile, shareable image) | Social shares and listing hover detail | 2 |
| Occasion pages and gift guides | 8 (Birthday, New baby, Christmas, Easter, Mother's Day, Eid, Graduation, Corporate) | Intent capture | 1 |
| Size and care guides | Exist; add 1 visual size comparison (relative, using real photos) and 1 printable care card | Doubt removal | 1 |
| Maker stories | 4 to start, only with consent and the client's wording | Trust and impact | 2 |
| Behind the scenes | 6 photo stories from existing media (lion mane, yarn to giraffe exist) | Immersion | 2 |
| Kids activity pages | 6: colouring sheets for 4 animals, a safari quiz, a "spot the animal" page. Free, printable, shareable, no signup | Shareable, brings parents; must be adult facing page with a child friendly download | 2 |
| Parent guides | 4: choosing a first soft animal (no age or safety claims), washing, travelling with a favourite animal, bedtime routines (no medical claims) | Search | 3 |
| Journal series | "Animal of the month", "Making of", "Ask a maker" (needs consent), "Gifts in Nairobi" | Reasons to return | 2 |
| Videos | Reuse the one video; short clips of hands at work with consent | Immersion | 3 |

Production plan: weeks 1 to 2: 6 animal profiles and 3 occasion pages (Christmas first, season is near: today is 2 October 2026, so Christmas content and cut off dates are urgent). Weeks 3 to 6: remaining profiles, 4 colouring sheets, quiz. Weeks 7 to 12: maker stories (as consent arrives), parent guides, series. Owner provides: confirmation of Christmas cut offs, photo consents, maker approvals. Content lives in `content/` (D38), JSON for animals and facts, MDX for stories.

Fun fact safeguards: keep facts to well documented basics (for example, giraffes have two or more ossicones, elephants use trunks to drink and smell). Mark each as VERIFY in the file until a second source is logged.

---

## 8. Measurement

Events use the D22 names and are consent gated.

| CTA | Event | Parameters | KPI |
|---|---|---|---|
| Hero primary | `select_item_list` or `cta_click` (custom) | `cta_id`, `page`, `position` | Click through rate |
| Product card | `select_item` | `item_id`, `list_name` | Card CTR |
| Add to list | `add_to_cart` | SKU | Add rate per product view |
| Ask on WhatsApp | `whatsapp_click` | `context` (product, cart, faq, listing) | Clicks per session, chat to order |
| Order sent | `whatsapp_order_submit` | ref, item count | Wizard completion |
| Wizard steps | `wizard_step_complete` | step | Drop off per step |
| Wholesale | `generate_lead` | `lead_type` | Request rate by segment |
| Channel join | `newsletter_signup` or `channel_join` | `source` | Joins per 1000 sessions |
| Downloads | `file_download` | file | Downloads, then clicks into shop |
| Share | `share` | method, item | Shares per view |

Funnel: session, product view, add to list, view cart, begin wizard, step 4, `whatsapp_order_submit`, confirmed order (manual from WhatsApp, logged in a Sheet). The true conversion is the confirmed order; the site event is a proxy.

A/B test backlog (needs traffic; with low traffic use before-after and qualitative review, not significance claims):

1. Single merged ask button versus three asks on product page.
2. "Add to my order list" versus "Add this animal to my list".
3. Sticky bar on product mobile versus none.
4. Price row "Price on request" plain text versus a button.
5. Hero secondary "Ask on WhatsApp" versus "Trade enquiries".
6. Occasion row position on home.
7. End of listing band versus none.
8. Journal end stack order.
9. FAQ answer CTAs versus none.
10. Wholesale segment picker versus single form.
11. Order sent primary CTA variants.
12. Prefilled WhatsApp text length.

Rule: one change at a time, record hypothesis and date, never run on checkout steps during Christmas peak.

---

## 9. Top 20 changes, ranked by impact over effort

| Rank | Change | Impact | Effort |
|---|---|---|---|
| 1 | Merge the three ask buttons into one "Ask on WhatsApp" with prefilled colour and size | High | Low |
| 2 | Closing CTA band on every page above the footer | High | Low |
| 3 | Add product mobile sticky bar (add plus WhatsApp) | High | Low to medium |
| 4 | Get real prices from the client and flip `pricesConfirmed` | Highest | Client dependent |
| 5 | Replace per-card "Ask for price" button with a quiet price row | Medium | Low |
| 6 | Journal end stack: shop the animals in this story, Channel join, next post | High | Medium |
| 7 | Empty states and end of list with next steps (cart, filters, shop) | Medium | Low |
| 8 | Occasion row on home plus Christmas gift page with real cut offs | High (season) | Medium |
| 9 | Order sent next-best actions | Medium | Low |
| 10 | FAQ answers each end with one CTA | Medium | Low |
| 11 | "Not sure? Tell us who it is for" WhatsApp prompt on home, gifts, listing | High | Low |
| 12 | Product page "How this is made" and "Customise this animal" rows | Medium | Low |
| 13 | Stockist directions and shopper CTA on home | Medium | Low |
| 14 | Wholesale segment picker and catalogue PDF | Medium | Medium |
| 15 | Animal profile pages for the top 6 animals | High (search) | Medium |
| 16 | Share a list on WhatsApp and "Send this to myself" | Medium | Low to medium |
| 17 | Colouring sheets and safari quiz (free, shareable) | Medium | Medium |
| 18 | WhatsApp Channel join sections | Medium | Low |
| 19 | Size help inline panel on the product page | Medium | Low |
| 20 | Event tracking with `context` parameter for every CTA | Medium | Low |

Sequence for the next two weeks: ranks 1, 2, 3, 5, 7, 9, 10, 11 in one build pass; rank 8 content in parallel because Christmas is about eleven weeks away; rank 4 chased with the client every week.

Open client inputs this map depends on: prices, reply hours and times, Christmas and courier cut offs, payment methods, maker consent and names, whether "customise" is offered and what is possible, catalogue PDF, outlet addresses and hours, email provider choice, owner lifting D36 for R2 items.
