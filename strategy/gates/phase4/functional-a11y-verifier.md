# Phase 4 gate: functional and accessibility verifier (3 of 3)

Build tested: production build at http://localhost:3200, NEXT_PUBLIC_WHATSAPP_NUMBER=254700000000, NEXT_PUBLIC_SITE_URL and tracking ids unset. Browser: bundled Chromium 1243 driven by playwright-core (installed outside the repo, in the scratchpad). Widths 390 and 1280, plus 320 for reflow. axe-core 4.x (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice) run on 13 pages at both widths. Screen reader and real device runs were not possible here; screen reader semantics were checked through the DOM, accessible names and axe.

**Verdict: FAIL.** No order-path defect was found (the wizard, cart and WhatsApp hand-off all work). The fail comes from 14 dead internal links, a missing privacy notice, a poor CLS on the shop, a 320px reflow failure and a keyboard-inaccessible scroller.

Severity key: blocker = fix before launch, major = fix before launch unless the owner accepts it, minor = fix in normal maintenance.

## 1. Defects (ordered by severity)

| ID | Check | Flow | Result | Evidence | Severity |
|----|-------|------|--------|----------|----------|
| D1 | Internal links resolve | Header, footer, product page, size ladder, home | FAIL | 14 of 54 internal links return 404: /gifts, /story, /journal, /size-guide, /partners, /supply, /stockists, /care, /faq, /delivery, /privacy, /cookies, /terms, /safety. Header nav (Gifts, Our story, Journal) is dead on every page. Next prefetch of these links produces 404 console errors on every page load. | blocker |
| D2 | Privacy notice reachable at the point of data capture | Wizard "Your details" step links to /privacy; footer links /privacy, /cookies, /terms | FAIL | /privacy, /cookies, /terms all 404. Consent bar has no link to a cookie notice at all. The wizard collects name, phone and address. | blocker |
| D3 | Tracking pipeline works when ids are set | lib/track.ts, app/layout.tsx | FAIL (gap) | No code loads GTM, GA4, Meta or TikTok (no next/script, no script injection anywhere). track() only pushes to window.dataLayer. With ids set and Accept chosen, no tag would ever load, so no event or conversion reaches any platform. Consent defaults and updates do reach dataLayer correctly. | major |
| D4 | Cumulative layout shift | /shop, /shop/elephant | FAIL | CLS 0.327 at 1280, 0.207 at 390 (budget 0.1). Single shift: the footer is visible during the streaming/loading state and then jumps out when the page body arrives. /cart 0.106 at 390. Home is 0. | major |
| D5 | 1.4.10 Reflow at 320 CSS px | Home "Four size classes, S to XL" band | FAIL | Horizontal scroll of 45px at 320 wide on /; figure and heading reach right=365. All other tested pages have none. | major |
| D6 | 2.1.1 Keyboard: scrollable region | Home "Captured moments" gallery (ul.scroller, 3036px wide in 390 viewport) | FAIL | axe scrollable-region-focusable (serious) at 390. Keyboard users cannot scroll the gallery. | major |
| D7 | 1.4.3 Contrast, zero-count filter options | /shop?animal=lion desktop sidebar | FAIL | 5 option labels at opacity 55%, ratio 3.34:1 (#857f77 on #f3ebdd, 17px). axe serious. | minor |
| D8 | Heading order and h1 | Shop listing, 404 page | FAIL | /shop and category pages jump h1 to h3 (card titles, axe heading-order). 404 page has no h1 (axe page-has-heading-one) at both widths. | minor |
| D9 | Landmarks | All pages | FAIL | The floating WhatsApp button (.wa-float) sits outside every landmark (axe region, all pages). | minor |
| D10 | Wizard tab title | /order first load and after Resume | FAIL | Title stays "Order form | Mikono Creations" on step 1 and after resume; step titles ("Step 2 of 5: ...") appear only after the first step change. | minor |
| D11 | Cart line semantics | /cart, drawer | Weak | Remove buttons all read "Remove" plus a hidden ": Grey Elephant, M" suffix (acceptable name, awkward punctuation). Undo restores the line at the end of the list rather than its old position (qty order [3,1] became [1,3]). | minor |
| D12 | Draft privacy | Wizard review then Send | Weak | mk.draft.v1 keeps name, phone, address and the full sent message for up to 14 days if the user never presses "I have sent it". Disclosed on the resume screen ("kept on this device only") but D16 intent is minimal storage. mk.orders.v1 correctly holds ref and items only. | minor |
| D13 | Overlap of fixed layers | Product page at 390 with consent bar open | Weak | Add-to-cart toast renders on top of the consent bar text. Consent bar hides the sticky wizard action bar until a choice is made (matches D34, but the first-time user cannot see Next). | minor |
| D14 | Skip past filters | /shop keyboard | Weak | 28 filter checkboxes sit before the first product in tab order, no skip link or collapse. Skip link itself works. | minor |
| D15 | /styleguide public | /styleguide | Weak | Reachable (200) and has 15 axe contrast failures on placeholder tiles. robots.ts disallows it only when SITE_ENV is production; D39 says preview only. Confirm it is excluded from the production build. | minor |

## 2. Shop and product page

| Check | Flow | Result | Evidence | Severity |
|-------|------|--------|----------|----------|
| Animal filter changes results and URL | Desktop, tick Lion | PASS | /shop?animal=lion, "Showing 3 of 30 animals", 3 cards | |
| Colour filter combines with animal | Tick Neutrals | PASS | ?animal=lion&colour=neutral, "Showing 1 of 30" | |
| Facet counts | Sidebar | PASS | Counts respect other filters (Lion 3, colour counts shown) | |
| Empty state | /shop?animal=lion&colour=green | PASS | "No animals match these filters", Clear filters button, status "Showing 0 of 30" | |
| Bogus params ignored | ?animal=bogus&colour=zzz | PASS | Shows all 30 | |
| Category plus filter | /shop/safari-animals?colour=neutral | PASS | "Showing 4 of 7 animals" | |
| Keyboard filter toggle | Space on checkbox, desktop | PASS | Auto-submits, focus stays on the input, scroll stays 0 | |
| Mobile filter drawer | 390: open, Tab, Escape, close button, submit | PASS | Native dialog, opens on click and Enter once hydrated, Tab cycles through browser chrome (no trap), Escape closes, focus returns to the Filters button, submit closes and applies, body scroll restored | |
| Colour choice swaps gallery | Elephant, pick 2nd colour | PASS | Main image src changes grey-01 to charcoal-grey-02 | |
| Add to order list disabled state | Elephant | PASS | aria-disabled=true, message "Choose a colour and size to add this animal to your order list.", early press focuses the first missing group, message updates to "Choose a size" | |
| Quantity stepper | Product page | PASS | One fewer and One more labels, value 3 | |
| Toast and header count | Add | PASS | Toast "Added to your cart: Charcoal grey Elephant, L" in a status region, header "Cart, 3 items" | |
| Ask on WhatsApp link | Product page | PASS | https://wa.me/254700000000?text=Hello Mikono Creations, I would like to ask about the Charcoal grey Elephant, size L. target=_blank, rel noopener noreferrer | |
| Number unset fallback (code review, not run) | whatsappUrl() | PASS by code | Returns null, link falls back to /contact; wizard button becomes "Copy my order message", send skips window.open and shows copy text; wholesale and contact show a copy panel | |

## 3. Cart drawer and /cart

| Check | Flow | Result | Evidence | Severity |
|-------|------|--------|----------|----------|
| Drawer opens from header cart | 390 and 1280, Enter on trigger | PASS | dialog open, focus on heading, Escape closes, focus returns to "Cart, 3 items" | |
| Qty change persists | /cart One more | PASS | localStorage qty 2 to 3 | |
| Remove with undo | /cart | PASS | "Removed Grey Elephant." with Undo, restored line (order changes, see D11) | |
| Persistence after reload | /cart | PASS | Quantities and header count survive | |
| Corrupt storage | mk.cart.v1 = "{{garbage", "[1,2,3]", lines with bad fields | PASS | No crash, notice "Your saved cart could not be read, so we started a fresh one", bad lines dropped, raw value kept in mk.cart.corrupt | |
| Empty state | /cart empty | PASS | "Your cart is empty" and "See the animals" | |
| Quote prompt over threshold | 22 pieces (threshold 20) | PASS | Prompt with "Ask for a quote" and wholesale link, soft, no block | |

## 4. Order wizard, wholesale, contact

| Check | Flow | Result | Evidence | Severity |
|-------|------|--------|----------|----------|
| Step 1 validation | Next with nothing chosen | PASS | Error summary heading takes focus: "Please choose the answer that fits you best." | |
| Business or organisation answer | Step 1 | PASS | Note offers wholesale link and "Continue as retail" | |
| Step 2 validation | Empty Next | PASS | 3 errors (name, phone, payment) in summary with focus on the summary heading | |
| Phone normalisation | 0712345678, 0112345678, +254712345678, 254712345678, 712345678 | PASS | All accepted, stored as +254712345678 style (review shows +254 712 345 678) | |
| Phone rejection | 0212345678, 12345, abc | PASS | Rejected with the friendly message. +1 415 555 2671 accepted as international | |
| Email validation | "bad@" | PASS | Error, optional field | |
| Step 3 validation | Empty, then town without county or town | PASS | "Please choose pickup or delivery", then county and town errors | |
| Cash on delivery conflict | COD plus other Kenyan town | PASS | Note with "Switch payment to M-Pesa" button, blocking error text, switch works | |
| Date wish in the past | 2020-01-01 | PASS | Error, accepts a future date | |
| Gift step | Send direct without contact | PASS | Adult name and phone errors, hint says no child's surname, school or age. No child name or age field exists anywhere | |
| Back and Next preserve data | Step 4 back to 3 and forward | PASS | County, town and gift note kept | |
| Marketing consent default | Review and wholesale | PASS | Unticked at review, after resume, and on /wholesale | |
| Review edit links | Edit your details | PASS | Goes to step, button becomes "Save and back to review", returns to review with the edit applied | |
| Draft resume | Reload at review | PASS | "Welcome back" with Continue and Start again, data restored | |
| Send builds wa.me URL | Send order on WhatsApp (window.open captured) | PASS | https://wa.me/254700000000?text=..., 1031 to 1086 chars, under the 2000 budget. Decoded: ref MK-261001-CFFH (MK-YYMMDD-XXXX, Nairobi date), "1. 2 x Elephant, Grey, size M, SKU elephant-grey-m", "2. 1 x Lion, Grey, size L, SKU lion-grey-l", +254 phone, delivery, gift, payment, marketing line. No child name or age | |
| Source line and UTM | ?utm_source=Instagram&utm_medium=Paid&utm_campaign=Xmas-2026, Accept all | PASS | "Source: instagram / paid / xmas-2026"; no Source line when none | |
| /order/sent behaviour | After Send | PASS | Shows ref, cart still 2 lines, orders store has ref and items only | |
| Cart cleared only after "I have sent it" | Sent page | PASS | Reload keeps cart; after the button, cart and draft both null, thank-you status focused | |
| /order/sent without an order | Direct visit | PASS | "We could not find an order waiting on this device" with exits | |
| Wholesale validation and message | Empty, bad phone, bad email, sample pack | PASS | 4 errors in summary, then ref WS-261001-5ATE, fields in message, "Marketing messages: No" | |
| Contact validation and message | Empty, bad phone, valid | PASS | Message required, phone optional but validated, ref CT-261001-KWTT | |
| Wizard business-path wording | Review and message | PASS | "Shop or business (continuing as retail)" | |

## 5. Keyboard, screen reader semantics, accessibility

| Check | Flow | Result | Evidence | Severity |
|-------|------|--------|----------|----------|
| Skip link | /shop | PASS | First Tab stop, Enter moves the sequential start to #main, next Tab lands on the first link in main | |
| Tab order and traps | Home, product, cart, wizard step 1, shop | PASS | Logical order, no traps, tab loops back to the skip link at the end. Native dialogs cycle through browser chrome by design | |
| Visible focus | Every stop on the 5 pages | PASS | Every focused element has an outline or ring (including sr-only radios through their sibling or label) | |
| Dialog semantics | Cart, filters, menu | PASS | Native dialog with aria-label or labelledby, Escape, focus return | |
| axe violations per page | 13 pages at 1280 and 390 | Mixed | /cart, /order, /order/sent: none. Home: region (1280, 390), scrollable-region-focusable (390). /shop family: heading-order, region. /shop?animal=lion at 1280: color-contrast x5. Product pages and /wholesale, /contact: region only. 404 and /doll check: page-has-heading-one on 404. /styleguide: color-contrast x15, landmark-unique, region. No critical findings | see D6 to D9, D15 |
| Landmarks | All pages | PASS | One banner, main, contentinfo, labelled navs (Main, Mobile, Breadcrumb, Categories, Shop, Work with us, Help) | |
| Heading order | All pages | Mixed | One h1 on every real page; see D8 | minor |
| Labels and errors | All forms | PASS | Every input labelled, aria-invalid and describedby on errors, assertive error summary with links, focus moves to the summary | |
| Image alt and names | 13 pages | PASS | 0 images without alt, 0 empty buttons, 0 empty links, 0 duplicate ids, alt text is descriptive (no filenames) | |
| lang | All pages | PASS | en-KE | |
| Reduced motion | Home with prefers-reduced-motion | PASS | scroll-behavior auto under reduce (smooth otherwise), 0 running animations in both modes at 2.5 s | |
| Contrast spot checks | axe plus tokens | PASS except D7 | No failures in the main flows | |
| Reflow | 320 and 390 | FAIL on home only | D5. Shop, product, cart, order, wholesale, contact have no horizontal scroll at 320 | major |
| Target size and name for Remove, qty, size radios | Cart, product | PASS | 44px or larger controls, radios named by label | |

## 6. Console, network, tracking, performance

| Check | Flow | Result | Evidence | Severity |
|-------|------|--------|----------|----------|
| Console errors | All pages | FAIL via D1 | Only errors are 404 prefetches of dead links (6 to 13 per page). No page errors, no hydration warnings | see D1 |
| Failed requests | All pages | PASS apart from D1 | Only 404 _rsc prefetches and aborted prefetches | |
| Third parties before consent | Home, shop, product, cart, contact, wholesale, no choice | PASS | Only host localhost:3200, no external scripts, no cookies set | |
| Reject non-essential | Same pages | PASS | consent stored analytics=false, marketing=false, mk_attr not written, dataLayer holds default denied plus update denied only, no third party hosts | |
| Accept all | Same pages | PASS (limited) | Consent granted in dataLayer, mk_attr written lower-cased; no third party loads because no loader exists (D3) | |
| UTM capture | ?utm_source=Instagram etc. | PASS | Held in memory before consent, stored in mk_attr only after Accept, lower-cased, reaches the Source line | |
| Response sizes | 390 at 2x | OK | /shop doc 283 KB (HTML), JS about 570 KB, total 3.3 MB over 93 requests including 31 images (571 KB); home 2.3 MB; product 1.8 MB | minor: /shop HTML is large |
| Image sizes served on /shop at 390 | Cards | PASS | Next image, WebP, widths 384 and 96 only, largest card 46 KB, none more than 2x the rendered pixels, max-age 14400 | |
| Largest images | Home | OK | hero-lion-hug 122 KB at w=750, moments 79 to 115 KB at w=640 | |
| LCP | Desktop and mobile | PASS on localhost | /shop 1.9 to 2.1 s, product 1.5 s, home 0.5 to 1.0 s (hero image is the LCP element on home and product) | |
| robots and sitemap | Build env | Info | robots.txt disallows everything and sitemap points to localhost:3000 because SITE_ENV and SITE_URL are unset in this build; confirm production values at deploy | minor |

## 7. Not tested

Real screen reader output (NVDA, VoiceOver), real device touch, Dragon, forced colors, the number-unset behaviour at runtime (needs a rebuild; verified by reading the code), tracking with real ids, and the long-order URL fallback (compact and short levels, verified by reading planOrderSend only).
