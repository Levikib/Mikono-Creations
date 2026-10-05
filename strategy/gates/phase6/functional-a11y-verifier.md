# Phase 6 gate: functional and accessibility verifier (3 of 3), round 3, LIVE site

Target: https://mikono-creations.vercel.app (read only). Chromium 1243 via playwright-core, widths 390 (DPR 2) and 1280. axe-core 4.x (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice) on all 69 sitemap routes plus /cart, /order, /order/sent and a 404 (73 routes, 146 runs). window.open was stubbed in every order and form test: the wa.me URL was captured and decoded, nothing was opened or sent. No real screen reader or device. Screenshots: strategy/gates/screens/phase6/.

**Verdict: PASS (no blocker).** The whole order journey and all five enquiry forms work live at both widths, no third party host is contacted in any consent state, and 8 of the 10 earlier defects are fixed. Remaining majors: focus hidden behind the cookie bar, one colour contrast failure on the home page. Doubled PageView could not be tested (no tracking ids on live).

Severity key: blocker = fix before launch, major = fix before launch unless owner accepts, minor = normal maintenance.

## 1. Earlier defects (phase 5 report): fixed or not

| Defect | Status | Evidence |
|---|---|---|
| 14-day text in notices (N1) | FIXED | /privacy: "kept for up to 24 hours". /cookies: "Removed after 24 hours". Wizard step 2 also says 24 hours. Runtime: 23 h old draft offered, 25 h old draft not offered and deleted (390). |
| PageView twice (N2) | NOT TESTABLE | No GA4, Meta or TikTok id is set on live, so no pixel loads. Needs a scratch build with test ids or a post-launch check. Carry over. |
| Cookie bar hiding focus (N4) | NOT FIXED | On /faq focused elements still land under the bar: 60 of 90 Tab stops at 390 (bar 734 to 844), 37 of 90 at 1280 (bar 839 to 900). |
| 65 Tab presses to Accept (N5) | PARTLY | Now 51 (390) and 57 (1280) presses on /faq. Bar is still last in DOM and focus is not moved to it. |
| Cookies table scroller (N3) | FIXED | axe scrollable-region-focusable: 0 on /cookies at 390. |
| Security headers (N6) | FIXED | Live headers on HTML, images and static files: CSP (default-src self, tag hosts only, object-src none, frame-ancestors none, upgrade-insecure-requests), HSTS max-age 31536000 includeSubDomains, X-Content-Type-Options nosniff, X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy camera, microphone, geolocation denied. No X-Powered-By. 0 CSP violations seen in 219 page loads. |
| Icon size (N7) | FIXED | /icon.png 927 bytes, /apple-icon.png 9146 bytes. Largest image on any page is now 60 to 67 KB. |
| Stockists heading order (N8) | FIXED | axe heading-order: 0 on /stockists. |
| Tab stops before products (N10) | NOT FIXED | /shop: 48 Tab stops before the first product at 1280, 14 at 390. Skip link exists. |
| /styleguide public (N11) | NOT FIXED | Still 200, meta robots noindex, nofollow, robots.txt Disallow. It is not in the sitemap. |
| Colour wording "ask" (N12) | NOT FIXED | Still "Colour: to be confirmed with you on WhatsApp" in cart, review and message. Clearer than before, but long for a line (see M5). |
| Stale draft in storage (N13) | FIXED on open | A 25 h draft is removed when /order opens. A draft is still never removed if the visitor never returns. Footer clear control covers it. |

## 2. Defects, ordered by severity

| ID | Check | Flow | Result | Evidence | Severity |
|---|---|---|---|---|---|
| M1 | 2.4.11 Focus Not Obscured | First visit, cookie bar open, keyboard | FAIL | See section 1. No scroll-padding-bottom equal to the bar height. | major |
| M2 | 1.4.3 Contrast | Home, section aria-labelledby="ways" intro paragraph | FAIL | axe color-contrast serious at 1280 and 390: 4.24:1 (#6e6258 on #e6d9c3, 14.3pt). Needs 4.5:1. Only violation on the whole site. | major |
| M3 | Pixel double PageView | Not testable on live | OPEN | Carry over from phase 5 N2, verify when ids are set. | minor until ids set |
| M4 | Cookie bar keyboard order | Any page | Weak | 51 to 57 Tabs to reach Accept, focus not moved to the bar, "Reopen via Cookie settings" leaves focus in the footer. | minor |
| M5 | Colour wording | Cart, review, WhatsApp message | Weak | "Cat, Colour: to be confirmed with you on WhatsApp, size M". Suggest "colour to confirm". | minor |
| M6 | Skip past filters | /shop 1280 | Weak | 48 Tab stops before first product. | minor |
| M7 | /styleguide in production | /styleguide | Weak | Reachable though noindex and disallowed. | minor |
| M8 | Caching | Static assets | Info | /_next/static/immutable/* is public, max-age 31536000, immutable (good). HTML, /media/* product jpgs, /robots.txt and /_next/image responses use public, max-age=0, must-revalidate. Revalidation returns 304 so repeat visits are cheap, but long cache lifetimes on /media and /_next/image would help repeat loads. | minor |
| M9 | /nonexistent title | 404 page | Weak | Status 404, noindex, h1 "We could not find that page", but the title is the home title "Mikono Creations | Crocheted animals, handmade in Nairobi" instead of a not found title. | minor |
| M10 | Wizard phone display | Step 2 | Info | Stored and shown as typed (0712 345 678), normalised only in the message (+254712345678). Fine. | none |

## 3. Order journey (live, 390 and 1280)

| Check | Flow | Result | Evidence | Severity |
|---|---|---|---|---|
| Shop filters | Lion (sidebar 1280, Filters dialog 390) | PASS | /shop?animal=lion, 3 cards. lion plus green gives "Showing 0 of 24 pieces" empty state. 24 pieces unfiltered. | |
| Product colour and size | /shop/elephant | PASS | Early Add press: "Choose a colour and size to add this animal to your order list." Then Caramel brown and M: toast "Added to your order list: Caramel brown Elephant, M", SKU elephant-caramel-brown-m. | |
| Colour to be confirmed | /shop/shark S, /shop/monkey L, /shop/cat M | PASS | Only a size group, text "Colours vary". SKUs shark-ask-s, monkey-ask-l, cat-ask-m. | |
| Drawer | Header Order list link | PASS | Dialog cart-drawer-title, focus on its heading, Tab trail Close, Elephant link, Quantity, One more, Remove, Continue to order form, View order list. Escape closes and focus returns to the "Order list, 1 animal" link. One Tab press after "View order list" lands on BODY before wrapping (minor focus leak). | minor |
| Cart page | /cart with 4 lines | PASS | "4 animals in 4 lines", "Nothing is charged here", singular "1 animal in 1 line" with one item. | |
| Wizard 5 steps | /order | PASS | Titles "Step 1 of 5: Who is ordering" to "Step 5 of 5: Review and send". Business answer shows wholesale note and "Continue as retail". Step 4 gift options skippable. | |
| Validation | Each step empty Next | PASS | Summary with focus on the heading. Step 1: 1 error. Step 2: name, phone, payment. Step 3: delivery choice, county and town, past date "Please pick a day from tomorrow on". Bad email "bad@" rejected. | |
| Payment options | Step 2 | PASS | Exactly M-Pesa, Bank transfer, Not sure yet. No cash on delivery, no gift wrapping anywhere in wizard text. | |
| Phone normalisation | Step 2 | PASS | Accepted: 0712345678, 0112345678, +254712345678, 254712345678, 712345678, "0712 345 678", "+254 (712) 345-678". Rejected: 0212345678, 12345, abc. All become +254712345678 in the message. | |
| Draft resume and 24 h | Reload on review, aged drafts | PASS | "Welcome back, You stopped at review and send." Continue and Start again. 23 h offered, 25 h discarded. | |
| Review plural | 1 item | PASS | "Step 4 of 4: Review and send" (gift step skipped), "1 animal. Prices are confirmed on WhatsApp." Four items show "4 animals". | |
| Send builds wa.me | Send order on WhatsApp, window.open captured | PASS | https://wa.me/254724592115?text=..., 1162 characters. Decoded: "Hello Mikono Creations, I would like to order.", "Order ref: MK-261001-FC4H" (390: MK-261001-RFZR), numbered items with SKU, "Prices are confirmed on WhatsApp.", Type, Name, Phone +254712345678, Email, Method "Delivery to another Kenyan town", Town, Date wish, "Delivery fee: to be confirmed", "Preferred way to pay: M-Pesa. We confirm on WhatsApp.", "Marketing messages: No", "Sent from mikono-creations.vercel.app". No child details. Not sent. | |
| Order sent page | /order/sent?ref=... | PASS | Ref shown, cart still 4 lines and draft kept after Send and after reload; mk.orders.v1 holds ref and sku/qty only. | |
| Cart cleared only after "I have sent it" | Button | PASS | After the button: mk.cart.v1 null, mk.draft.v1 null, "your order list is now empty". | |
| Wholesale | /wholesale | PASS | 4 empty errors, bad phone error, then WS-261001-EFJG with request type, business, contact, phone +254722111222, email, quantities. | |
| Partners | /partners | PASS | 5 errors, PT-261001-D9SX. | |
| Supply | /supply | PASS | 5 errors, SP-261001-PNP2. | |
| Custom | /custom | PASS | 4 errors, CU-261001-UBGS. | |
| Contact | /contact | PASS | Only message required, phone validated when given, CT-261001-DD8H. | |
| Console and requests in journey | Both widths | PASS | 0 console messages, 0 failed requests, only host mikono-creations.vercel.app. | |

## 4. Consent and tracking (live)

No tracking ids are set on live, so this proves that nothing loads and nothing errors. It does not prove the tag loaders.

| Check | Flow | Result | Evidence | Severity |
|---|---|---|---|---|
| Third party hosts on first load | 73 routes at 390, no consent stored | PASS | Single host in all requests: mikono-creations.vercel.app. No fonts, CDN or analytics host. | |
| After Reject | 73 routes at 390 with stored reject | PASS | Single host. mk_consent analytics false, marketing false, mk_attr not written, no cookies. | |
| After Accept all | 73 routes at 1280 with stored accept | PASS | Still single host (no ids), 0 errors, 0 CSP violations. | |
| Consent bar behaviour | Product page, first visit | PASS | Section "Cookie choices": "We use cookies to measure visits and ads. Privacy and Cookies." Buttons "Accept" and "Reject optional". Nothing appears before the choice; no pop up. Add to order works without choosing. | |
| Consent Mode default order | dataLayer | PASS | First entry is consent default (ad_storage, ad_user_data, ad_personalization, analytics_storage denied; functionality and security granted; wait_for_update). Update follows on choice: Accept gives all four granted, Reject all four denied. | |
| Accept then Reject via Cookie settings | /cookies | PASS | Updates granted then denied, mk_consent reset, mk_attr removed. | |
| UTM handling | ?utm_source=Instagram&utm_medium=Paid | PASS | mk_attr written only after Accept, lower-cased. | |
| dataLayer events and D23 mapping | Not observable | NOT TESTED | gtag, fbq, ttq are undefined on live, by design. Event names and Meta/TikTok mapping were last proven in phase 5 on a scratch build. Re-run when ids are added. | |
| Skip to cookie choices | Keyboard | PASS with M1 and M4 | Bar is reachable and operable; no dedicated skip link, 51 to 57 Tabs. | minor |

## 5. Keyboard, assistive semantics, accessibility

axe: 144 of 146 runs clean. Impact counts across all runs: critical 0, serious 2 (the same home page contrast finding at both widths), moderate 0, minor 0.

| Check | Flow | Result | Evidence | Severity |
|---|---|---|---|---|
| axe sitemap routes plus /cart /order /order/sent and 404 | 73 routes, 2 widths | PASS except M2 | color-contrast on home "ways" intro text only. | major (M2) |
| Skip link | / | PASS | First Tab stop "Skip to content". Enter then Tab moves into main content. At 1280 the next stop is "Dismiss announcement" (an announcement bar exists), at 390 "Shop the animals". | |
| Keyboard walk | /, product, /cart, /order, journal post, /gallery, /faq, /cookies | PASS | 28 to 61 Tab stops per page, no trap, every stop has an outline or box-shadow focus style. | |
| Home moments scroller | Focus then ArrowRight at 390 | PASS | scrollLeft 0 to 252. At 1280 the region does not overflow so no scroll (scrollLeft 0 is correct). | |
| FAQ accordion | /faq | PASS | Native details and summary, Enter opens, Space closes. | |
| Mobile menu | 390 | PASS | Dialog "Menu", focus on Close menu, Escape returns to the opener. | |
| Filters dialog | 390 /shop | PASS | Dialog "Filters", Escape returns focus. | |
| Cookie settings reopen | /cookies | PASS | Button reopens the bar. | |
| Focus not obscured | Cookie bar open | FAIL | M1. | major |
| Reduced motion | emulated reduce, /story | PASS | 0 running animations at 390 and 1280. | |
| Landmarks and h1 | All 73 routes | PASS | axe landmark, region and page-has-heading-one rules: 0. | |
| Heading order | All routes | PASS | axe heading-order: 0 (stockists fixed). | |
| Alt text and names | All routes | PASS | axe image-alt, button-name, link-name, label: 0. 0 images without an alt attribute in the DOM crawl. | |
| Reflow 320 and 200 percent | Not rerun at 320 | PARTLY | At 390 and 1280 document scrollWidth equals clientWidth on all 73 routes (0 horizontal overflow). 320 and text-only 200 percent were not rerun this round (phase 5: pass at 320 and 640). | |

## 6. Live performance and health

| Check | Result | Evidence | Severity |
|---|---|---|---|
| Console errors | PASS | 0 on all 73 routes in three crawls (none, reject, accept), except the expected 404 resource message on /nonexistent. | |
| Failed requests | PASS | 0 failures other than the 404 document on /nonexistent. 0 CSP violation events. | |
| Every img renders | PASS | 668 img elements on 73 routes at each width. A fast scroll crawl flagged some lazy images with naturalWidth 0 (loading=lazy, not yet fetched). Re-check by scrolling each into view on /, /shop, /shop/bear, /story, /journal, /projects, /shop/doll, a journal post: 0 images still broken. Direct requests for the flagged URLs return 200 (w=3840: 53 KB, w=640: 42 KB). No genuinely broken image found. | |
| /_next/image responses | PASS | 0 non-2xx or 3xx responses (statuses 200 and 304 only) across all routes at both widths. Note: lazy images request w=3840, a very large srcset candidate; the optimiser caps at the source size (about 53 KB for this one) so weight is fine, but sizes attributes could be tightened. | minor |
| Page weight 390 (decoded, cold) | PASS | /: 2.0 MB, 85 requests, JS 576 KB. /shop 2.0 MB, 95. Product 1.3 MB, 68. /journal 1.6 MB. /order 1.2 MB, 58. Largest image 60 to 67 KB. Largest overall asset is a JS chunk, not an image. | |
| CLS | PASS | /, /shop, product, /journal: 0 at both widths. /order 0.0511 (390), /cart 0.0491 first run then 0.0081. All under 0.1. | |
| LCP (390, two runs) | PASS | /: 1040 and 896 ms. /shop 1500 and 1392. Product 844 and 788. /journal 984 and 756. /order 560. At 1280: / 620 and 872, /shop 1484. All under 2.5 s (measured from a fast machine, not a mobile network). | |
| Security headers | PASS | See section 1. | |
| Caching | PASS with M8 | immutable static chunks, 304 revalidation for the rest. | minor |
| robots.txt | PASS | Allow /, Disallow /styleguide, /cart, /order, Sitemap URL on the live host. | |
| sitemap.xml | PASS | 69 URLs, all https://mikono-creations.vercel.app, all return 200. No /cart, /order, /styleguide. | |
| Canonical, og | PASS | canonical and og:image use the live host. 0 occurrences of localhost in the home HTML. | |
| 404 page | PASS with M9 | Status 404, noindex, h1 "We could not find that page", links back; title is the home title. | minor |
| Server secrets in client bundles | PASS | 14 client JS chunks (724 KB) from /, /shop, /order, /cart grepped for META_CAPI_TOKEN, EMAIL_PROVIDER_API_KEY, GA4_API_SECRET, TIKTOK_EVENTS_API_TOKEN, GOOGLE_SERVICE_ACCOUNT, sk_live, AKIA, private key blocks: 0 hits. Source maps return 403. Only expected third party strings (tag hosts, wa.me). | |

## 7. Not tested

Real screen readers and devices, forced colours, Lighthouse itself, the tag loaders and event mapping with real ids (nothing is configured on live), double PageView (phase 5 N2), 320 px and text-only 200 percent re-run, long-order URL fallbacks, throttled mobile network timings. No real WhatsApp message was sent at any point.
