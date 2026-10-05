# Phase 5 gate: functional and accessibility verifier (3 of 3), round 2

Build tested: production build at http://localhost:3300 (built with NEXT_PUBLIC_WHATSAPP_NUMBER=254724592115 from .env.local, no site URL, no tracking ids). Browser: bundled Chromium 1243 driven by playwright-core, installed in the scratchpad, widths 390 (DPR 2), 1280, 320 and 640. axe-core 4.13 (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice) on every sitemap route plus /cart, /order, /order/sent and a 404, at 1280 and 390 (146 runs). No real screen reader or device was available; semantics were checked through the DOM, accessible names, axe and keyboard simulation.

For the tracking tests the repo was copied to the scratchpad (node_modules copied, media and strategy excluded, no .env.local), built there with test ids (GA4 G-TEST12345, Meta 123456789012345, TikTok CTESTPIXEL01) and served on port 3399. All third-party hosts were intercepted and stubbed, so nothing left the machine. That server was stopped afterwards. The repo and the server on 3300 were not touched. Screenshots are in strategy/gates/screens/phase5/.

**Verdict: PASS (no blocker).** Every order path works at both widths, all 14 dead links, the missing privacy pages, the missing tag loader, the CLS failures, the 320px overflow and the keyboard scroller from round 1 are fixed. Four majors remain and should be fixed before launch unless the owner accepts them: a privacy notice that contradicts the code, doubled Meta and TikTok PageView events, focus hidden behind the cookie bar, and one non-focusable scroll region.

Severity key: blocker = fix before launch, major = fix before launch unless the owner accepts it, minor = fix in normal maintenance.

## 1. Round 1 defects: fixed or not

| Round 1 ID | Defect | Status | Evidence |
|---|---|---|---|
| D1 | 14 dead internal links | FIXED | 76 unique internal hrefs collected from 72 pages, all return 200. Sitemap routes all 200. /nonexistent returns 404 with the custom page. Console shows no 404 prefetch errors. |
| D2 | Privacy notice missing at point of data capture | FIXED, with a content error (see N1) | /privacy, /cookies, /terms return 200 with real content. Consent bar and wizard step 2 link to Privacy policy and Cookies. |
| D3 | No tracking loader | FIXED | components/Analytics.tsx loads GTM or GA4 or Meta or TikTok only after consent. Proven in the scratch build (section 4). Two defects in the new code: N2, N9. |
| D4 | CLS 0.327 and 0.207 on /shop, 0.106 on /cart | FIXED | /, /shop, product, /journal all 0 at 390 and 1280. /order 0.0065 to 0.0595 (was 0.138). /cart 0.0081 to 0.0491 at 390. All below 0.1. |
| D5 | 320px reflow, home size band | FIXED | 72 routes at 320 CSS px: 0 pages with horizontal overflow. 640 px (200 percent zoom): 0. |
| D6 | Keyboard scroller (home moments) | FIXED on home, NOT FIXED on /cookies | Home region now has role region, name and tabindex 0; ArrowRight moves scrollLeft 0 to 252 at 390. axe now flags the same pattern on the /cookies table at 390 (N3). |
| D7 | Contrast, zero-count filter options | FIXED | axe color-contrast: 0 on /shop?animal=lion at both widths, and on 6 filter and empty-state URLs. |
| D8 | Heading order, 404 h1 | MOSTLY FIXED | /shop and categories clean, 404 has an h1. New heading-order hit on /stockists (N8). |
| D9 | WhatsApp float outside landmarks | FIXED | Wrapped in aside with aria-label "Chat on WhatsApp". axe region: 0 on all pages. |
| D10 | Wizard tab title not updated | FIXED | Title is "Step 1 of 5: Who is ordering" on first load and "Step 5 of 5: Review and send" after Resume. |
| D11 | Cart undo order, remove button wording | NOT RETESTED | Not in scope for this round. |
| D12 | Draft retention up to 14 days | FIXED in code, NOT in the notices | DRAFT_TTL is 24 hours (lib/orderForm.ts line 112). Runtime: a draft 25 hours old is not offered and is deleted; 23 hours old is offered. /privacy and /cookies still say 14 days (N1). |
| D13 | Toast over the consent bar | FIXED | Toast offset uses --consent-h. Measured at 390: bar 691 to 844, toast 523 to 595. At 1280: bar 827 to 900, toast 731 to 803. No overlap. |
| D14 | 28 filter checkboxes before first product | NOT FIXED | 45 Tab stops before the first product card on /shop at 1280. No skip control. (N10) |
| D15 | /styleguide public | NOT FIXED | Still 200 on a production build, with noindex and (in production env) a robots Disallow. 15 contrast failures on placeholder tiles. (N11) |

## 2. New and remaining defects (ordered by severity)

| ID | Check | Flow | Result | Evidence | Severity |
|----|-------|------|--------|----------|----------|
| N1 | Privacy notice matches behaviour | /privacy and /cookies versus lib/orderForm.ts and the wizard | FAIL | /privacy: "kept for up to 14 days". /cookies table: "Removed after 14 days". Code: 24 hours. The wizard step 2 text says "24 hours". A privacy notice that states a longer retention than the real one is inaccurate; the owner must pick one number and use it everywhere. | major |
| N2 | Pixel event correctness | Meta and TikTok with Accept all | FAIL | Every page load with marketing consent sends two Meta PageView and two TikTok page calls. The init snippet fires one, then the route effect in Analytics.tsx fires another when loadMeta flips to true (deps [path, loadMeta, loadTiktok]). Observed fbq queue: init, PageView, PageView; ttq: page, page. Doubled PageViews inflate audiences and ad reporting. Fix: skip the effect on the first run after load, or key it on path only. | major |
| N3 | 2.1.1 Keyboard: scrollable region | /cookies table at 390 | FAIL | axe scrollable-region-focusable (serious), selector .overflow-x-auto, app/cookies/page.tsx line 38. Same pattern as round 1 D6. Give the wrapper tabindex 0, role region and an accessible name. | major |
| N4 | 2.4.11 Focus Not Obscured | First visit, cookie bar open | FAIL while the bar is open | At 390 on /faq, 9 focused elements sit fully under the fixed bar (for example "What sizes are there?" at 694 to 750, bar top 691). At 1280, 4 more are overlapped. The bar has no scroll-padding-bottom. Fix: scroll-padding-bottom: var(--consent-h) on html. | major |
| N5 | Cookie bar reachable by keyboard | Home, first visit | Weak | 65 Tab presses to reach "Accept all" because the bar is last in the DOM and focus is not moved to it. Reopening via "Cookie settings" leaves focus on the footer button while the bar appears at the bottom. Consider moving focus to the bar heading on open (non-modal), or placing the bar earlier in the DOM. | minor |
| N6 | Security headers | curl -I on /, config review | FAIL (recommend) | Only X-Powered-By: Next.js. No Content-Security-Policy, X-Content-Type-Options, Referrer-Policy, Permissions-Policy or frame protection. next.config.ts has no headers() and there is no vercel.json. Recommend: poweredByHeader false, nosniff, Referrer-Policy strict-origin-when-cross-origin, X-Frame-Options DENY or frame-ancestors, Permissions-Policy denying camera, microphone and geolocation, and a CSP that allows only the tag hosts when ids are set (googletagmanager.com, connect.facebook.net, analytics.tiktok.com). Vercel adds HSTS on custom domains. | major |
| N7 | Favicon weight | app/icon.png | FAIL | 315 KB (315167 bytes), the largest image request on every page at 390 and 1280. public/logo.png 232 KB and logo-mark.png 177 KB are also heavy. A tab icon should be about 5 to 20 KB. | minor |
| N8 | Heading order | /stockists, both widths | FAIL | axe heading-order (moderate): first card h3 follows the h1 with no h2 (components/InfoCard.tsx h3). | minor |
| N9 | GTM consent coupling | Analytics.tsx | Weak | GTM loads only when analytics is accepted. A visitor who accepts marketing only (possible through stored state or a future granular bar) gets no GTM, so container pixel tags never fire. Current bar offers only Accept all or Reject optional, so this is latent. | minor |
| N10 | Skip past filters | /shop keyboard, 1280 | Weak | 45 Tab stops before the first product. Skip link itself works (D14 carried over). | minor |
| N11 | /styleguide in production | /styleguide | Weak | Reachable, noindex, 15 contrast failures and 1 landmark-unique on placeholder tiles. Remove from the production build or gate it by NEXT_PUBLIC_SITE_ENV. | minor |
| N12 | Colour label when "ask" | Cart, review and WhatsApp message for shark, monkey, cat | Weak | Reads "Shark, any, please confirm on WhatsApp, size S". The comma chain is ambiguous. Message line: "2. 1 x Shark, any, please confirm on WhatsApp, size S, SKU shark-ask-s". Suggest "colour to confirm". | minor |
| N13 | Stale draft remains in storage | lib/orderForm.ts readDraft | Weak | Expiry is checked only when /order is opened. A draft with name and phone is never deleted if the visitor never returns to /order. The footer "Clear my saved details" control covers it, but the notice says "removed". | minor |
| N14 | Text-only resize at 200 percent | All 72 routes, html font-size 200 percent at 1280 | Info | Desktop header overflows by 495 px on every page in this forced test. A CSS root-size override does not move rem media-query breakpoints, so real browser text-size settings probably switch to the mobile header. Zoom 200 percent (640 px) passes. Re-check with a real browser text-size setting. | minor |
| N15 | Site URL in the tested build | HTML of every page | Info | The tested build has canonical, og:image and JSON-LD URLs set to http://localhost:3000 because the build had no site URL. next.config.ts now falls back to VERCEL_PROJECT_PRODUCTION_URL or VERCEL_URL, so a Vercel build will not use localhost. Setting NEXT_PUBLIC_SITE_URL to the final domain is still advised. Scratch build with SITE_URL set emitted correct canonical, sitemap and robots. | minor |

## 3. Order journey (re-run at 390 and 1280)

| Check | Flow | Result | Evidence | Severity |
|---|---|---|---|---|
| Shop filters | Lion at 1280 (sidebar) and 390 (Filters dialog) | PASS | /shop?animal=lion, 3 cards. lion plus green gives "Showing 0 of 24 pieces" empty state with clear action. 24 pieces on one page. | |
| Colour and size product | /shop/elephant, early press, then Caramel brown and M | PASS | Add is aria-disabled with the message "Choose a colour and size to add this animal to your order list." Toast "Added to your cart: Caramel brown Elephant, M". SKU elephant-caramel-brown-m. | |
| Colour "ask" animals | /shop/shark, /shop/monkey, /shop/cat | PASS | Only a size group is shown, with "Colours vary. Ask us which are available." and an Ask on WhatsApp link. SKUs shark-ask-s and monkey-ask-l. Wording: N12. | |
| Cart drawer | Header cart link, Enter, Escape | PASS | Dialog "cart-drawer-title", focus on the heading, Tab cycles Close, line, quantity, One more, Remove, Continue to order form, View cart. Escape closes and focus returns to the "Cart, 1 item" link. | |
| Cart page | /cart with 3 lines | PASS | Lines, "3 pieces in 3 lines", "Nothing is charged here", Continue to order form. | |
| Wizard step 1 | Next with no answer | PASS | Summary "Please choose the answer that fits you best." with focus on the summary heading. Business answer shows a note with wholesale link and "Continue as retail". | |
| Wizard step 2 | Empty Next, then phone variants | PASS | 3 errors. Accepted: 0712345678, 0112345678, +254712345678, 254712345678, 712345678. Rejected: 0212345678, 12345, abc. Bad email "bad@" rejected. | |
| Wizard step 3 and COD conflict | Cash on delivery then other Kenyan town | PASS | Note "You chose cash on delivery, which is only for Nairobi and pickup." with "Switch payment to M-Pesa" button. Blocking error, county and town errors. Past date 2020-01-01 rejected, future date accepted. | |
| Wizard steps 4 and 5 | Skippable gift step, review | PASS | Titles "Step 4 of 5: Gift options", "Step 5 of 5: Review and send". Review lists items, who, details, delivery, gift, marketing consent unticked. | |
| Draft resume | Reload on review | PASS | "Welcome back" with Continue and Start again, tab title restored to step 5. Expiry: 25 hours old draft discarded, 23 hours old offered (tested at both widths). | |
| Send builds wa.me URL | window.open captured | PASS | https://wa.me/254724592115?text=..., 911 characters (budget 2000). Decoded content: "Hello Mikono Creations, I would like to order." "Order ref: MK-261001-S2YH" (390 run: MK-261001-RXMF), numbered items with SKU, "Prices are confirmed on WhatsApp.", customer type "Shop or business (continuing as retail)", name, phone +254712345678, email, delivery method and town, date wish, "Delivery fee: to be confirmed", payment preference, "Marketing messages: No". No child name or age. No Source line when no UTM (and none shown in this run). | |
| Order sent page | After Send | PASS | URL /order/sent?ref=..., cart still 3 lines, mk.orders.v1 holds ref and items only. Reload keeps the cart. | |
| Cart cleared only after "I have sent it" | Button on sent page | PASS | After the button: mk.cart.v1 null, mk.draft.v1 null, thank-you shown. | |
| Number-unset path | whatsappUrl(), env.ts | PASS (impossible) | env.whatsappNumber falls back to PHONE_DIGITS 254724592115 from lib/site.ts, so the URL is never null. The scratch build had no .env.local and still produced wa.me/254724592115 links. .vercelignore excludes .env*, so Vercel relies on the same fallback or a project variable with the same number. | |
| Wholesale form | /wholesale: empty, bad phone, valid | PASS | 4 summary errors, phone error, then message to wa.me/254724592115 with ref WS-261001-NS9A, request type, business, contact, phone +254722111222, email, quantities, "Marketing messages: No". | |
| Partners form | /partners | PASS | 5 errors, then PT-261001-VXM7 with type, organisation, contact, phone, message. | |
| Supply form | /supply | PASS | 5 errors, then SP-261001-NJ3R. | |
| Custom form | /custom | PASS | 4 errors, then CU-261001-ZWK3. | |
| Contact form | /contact | PASS | Only message required, phone validated when given, then CT-261001-Y772 with name, phone, message. | |
| Console and failed requests | Whole journey, both widths | PASS | 0 console errors, 0 failed requests. Only host contacted: localhost:3300. | |

## 4. Consent and tracking

Static review of components/Analytics.tsx and lib/track.ts, plus runtime on the scratch build with stubbed third parties.

| Check | Flow | Result | Evidence | Severity |
|---|---|---|---|---|
| No ids: nothing loads | Production build on 3300, all journeys | PASS | Analytics returns null, no script injection, no third-party host, no cookies, dataLayer not created by the loader. Only host localhost:3300 in 84 to 122 requests per page. | |
| No choice made | Scratch build, product page, add to cart | PASS | 0 external requests, no fbq, no ttq, document.cookie empty. dataLayer holds only the Consent Mode default. | |
| Consent Mode defaults ordering | Scratch build | PASS | Defaults (ad_storage, ad_user_data, ad_personalization, analytics_storage denied, functionality and security granted, wait_for_update 500) are pushed first from the effect in both ConsentBar and Analytics, guarded by __mkConsentDefault so they run once. Update follows on Accept or Reject. Tags are only added after the update. Pushed as Arguments objects, as gtag requires. | |
| Reject | Click Reject optional, then add to cart | PASS | 0 external requests. dataLayer: default then update with all four signals denied. mk_consent analytics false, marketing false. mk_attr not written. | |
| Stored reject on load | localStorage preset | PASS | 0 external requests, update denied pushed. | |
| Accept all | Click Accept all | PASS | Requests: googletagmanager.com/gtag/js?id=G-TEST12345, connect.facebook.net/en_US/fbevents.js, analytics.tiktok.com/i18n/pixel/events.js. Update granted for all four signals, then js, config, then queued events replayed in order (view_item, consent_update, select_variant, add_to_cart). | |
| Analytics only | Stored analytics true, marketing false | PASS | Only gtag.js loads. No Meta or TikTok. | |
| Marketing only | Stored marketing true | PASS (see N9) | Only Meta and TikTok load. No GA4 events. | |
| Revoke after Accept | Accept, then Cookie settings, then Reject optional | PASS | Update denied pushed, fbq("consent","revoke") appears in the queue, ttq revokeConsent called, queue dropped, 0 new third-party requests, a later contact submit sends nothing. | |
| Event names | Journey | PASS | Seen: view_item, select_variant, add_to_cart, begin_checkout, wizard_step_complete x4, add_shipping_info, whatsapp_order_submit, generate_lead, consent_update. All names are in the D22 list. None of the removed names appear. | |
| D23 mapping | Order Send and contact submit | PASS | whatsapp_order_submit gives Meta Lead and TikTok SubmitForm. generate_lead gives Lead and SubmitForm. whatsapp_click maps to Contact (code review). No purchase event, no value without a number. | |
| UTM handling | ?utm_source=Instagram&utm_medium=Paid | PASS | Held in memory before consent, written to mk_attr only after Accept, lower-cased, attached to events. | |
| Double PageView | Accept all, any page | FAIL | See N2. | major |
| Ids sanitised | Code review | PASS | clean() accepts only [A-Za-z0-9_-]{3,40}, values pass through JSON.stringify into the snippets. | |
| GTM path | Code review (not built) | PASS by code | GTM id wins over direct ids. With GTM, pixels are left to the container and events go to dataLayer as {event, ...params}. | |

## 5. Keyboard, assistive semantics and accessibility

axe results across 146 route runs (73 routes at two widths): 143 runs clean, 3 with violations. No critical findings.

| Page | Width | Rule | Impact | Notes |
|---|---|---|---|---|
| /stockists | 1280 and 390 | heading-order | moderate | N8 |
| /cookies | 390 | scrollable-region-focusable | serious | N3 |
| /styleguide (separate run) | 1280 and 390 | color-contrast x15, landmark-unique x1 | serious, moderate | N11 |

States also run through axe with no violations: home with the cookie bar open (390 and 1280), cart drawer (both), mobile menu (390), filter drawer (390), wizard step 1 with errors (both), 6 filter and empty-state URLs, /order with a UTM, and the 404 page.

| Check | Flow | Result | Evidence | Severity |
|---|---|---|---|---|
| Skip link | /, /shop, /shop/elephant | PASS | First Tab stop, href #main, target exists, Enter sets location.hash and moves the sequential start into main. | |
| Keyboard walk | Home, product, cart, order, journal post, gallery, faq, cookies at 1280 and 390 | PASS | 34 to 63 Tab stops per page, no trap, every stop has an outline or box-shadow focus style, none off screen except as noted in N4. | |
| FAQ accordion | /faq | PASS | Native details and summary. Enter opens, Space closes. | |
| Moments scroller | Home at 390 | PASS | Focusable named region, arrow keys scroll. | |
| Cart drawer | Enter on trigger | PASS | See section 3. | |
| Mobile menu | 390, Enter on Open menu | PASS | Dialog "Menu", focus on Close menu, Tab through Shop, Gifts, Wholesale, Our story, Journal, Contact, Chat on WhatsApp, Close. Escape returns focus to Open menu. | |
| Filter drawer | 390 | PASS | Dialog "Filters", focus on Close filters, Escape returns focus to the Filters button. | |
| Cookie settings | /cookies, Enter | PASS with N5 | Bar reopens. Focus is not moved to it. | |
| Focus not obscured | Cookie bar open | FAIL | N4. | major |
| Reduced motion | prefers-reduced-motion on, home, story, journal, projects, shop | PASS | With reduce: 0 running animations, kinetic words have animation none, scroll-behavior auto. Without it: the story heading plays rise and one bob (finite, 2.4 s). No auto-advancing carousel exists. | |
| Landmarks and h1 | All pages | PASS | One banner, main, contentinfo, labelled navs, aside for WhatsApp. One h1 per page, including 404. | |
| Heading order | All pages | PASS except /stockists | axe. | |
| Labels, names, alt | All pages | PASS | axe image-alt, label, button-name, link-name, duplicate-id: 0. Form errors link to fields from an assertive summary that takes focus. | |
| lang | All pages | PASS | en-KE. | |
| Contrast spot checks | axe plus the filtered, empty and drawer states | PASS | 0 color-contrast failures outside /styleguide. | |
| Reflow 320 | 72 routes | PASS | 0 horizontal overflow. | |
| Zoom 200 percent | 72 routes at 640 CSS px | PASS | 0 horizontal overflow. | |
| Text-only 200 percent | 72 routes, forced root size | Info | N14. | minor |

## 6. Console, requests, CLS, LCP and weight

Cold context, localhost, no throttling, two runs each (shown as run 1 / run 2). Production build on 3300.

| Page | 390 CLS | 390 LCP ms | 1280 CLS | 1280 LCP ms | Transfer (390, decoded) | Result |
|---|---|---|---|---|---|---|
| / | 0 / 0 | 2068 / 748 (hero image) | 0 / 0 | 544 / 608 | 2.0 MB, 84 requests, JS 601 KB | PASS |
| /shop | 0 / 0 | 556 / 644 | 0 / 0 | 660 / 732 | 2.5 MB, 113 requests | PASS |
| /shop/elephant | 0 / 0 | 1024 / 324 | 0 / 0 | 320 / 320 | 1.7 MB, 82 requests | PASS |
| /journal | 0 / 0 | 628 / 552 | 0 / 0 | 424 / 492 | 2.1 MB, 81 requests | PASS |
| /order (with items) | 0.0065 / 0.0065, with bar open 0.0511 | 1068 / 1036 | 0.0183, with bar open 0.0595 | 1068 / 1120 | 1.5 MB, 61 requests | PASS (was 0.138) |
| /cart | 0.0081 / 0.0491 | 1008 / 1028 | 0.0112 / 0.0112 | 1048 / 1244 | 1.5 MB, 69 requests | PASS |

Page weight figures are decoded body sizes (before gzip or brotli). The first-run home LCP of 2.07 s at 390 is a cold start; the second run is 0.75 s. All other LCP values are under 1.3 s.

| Check | Result | Evidence | Severity |
|---|---|---|---|
| Console errors | PASS | 0 on all journeys, perf runs and consent runs. Build prints an "[env] optional variables not set" warning only. | |
| Failed requests | PASS | 0 non-prefetch failures. | |
| Largest images at 390 (DPR 2) | PASS | / hero-lion-hug 59 KB at w=750. /shop largest 23 KB at w=384. /gallery largest 59 KB. 0 images served above 1.6 times the rendered device pixels. WebP or AVIF through next/image. | |
| Largest overall request | FAIL (small) | app/icon.png 315 KB, see N7. | minor |
| Lighthouse-style judgement | Good | Performance is limited by the 600 to 680 KB script total (decoded) and by request count (60 to 120, mostly images), not by layout or media. Accessibility would score at or near 100 on every route tested. SEO: titles, canonical, robots and sitemap present. Best practice: security headers missing (N6). | |

## 7. Vercel readiness

| Check | Result | Evidence | Severity |
|---|---|---|---|
| No server-only secrets in client bundles | PASS | grep of .next/static for META_CAPI_TOKEN, EMAIL_PROVIDER_API_KEY, GA4_API_SECRET, TIKTOK_EVENTS_API_TOKEN, GOOGLE_SERVICE_ACCOUNT_JSON: 0 hits. No non-NEXT_PUBLIC process.env reads in app, components or lib except NODE_ENV in app/layout.tsx. 0 source maps in .next/static. .env.local holds only the public WhatsApp number and is git-ignored. | |
| Build needs no env vars | PASS | The scratch copy had no .env.local and no WhatsApp number; it built in 17 s compile plus static generation of 79 pages with only an optional-variable warning. | |
| .vercelignore | PASS | Excludes media/ (46 MB raw, only a comment refers to it), strategy/, .env*, .next/, node_modules/. Keeps scripts/ (prebuild qa-copy needs it), content/, data/, public/media (29 MB, served). Nothing the build reads is excluded. | |
| robots.txt | PASS | Local build (no env): Disallow /. Production env: Allow /, Disallow /styleguide, /cart, /order, Sitemap URL on the site host. Preview deployments stay disallowed through VERCEL_ENV. | |
| sitemap.xml | PASS | 72 URLs: all static routes, 3 categories plus wall-art and dolls, every product, 10 journal posts, 7 projects, legal pages. Excludes /cart, /order, /order/sent, /styleguide. With a site URL set, every loc uses it. | |
| No localhost URLs in HTML | PASS with condition | The tested build contains http://localhost:3000 (canonical, og:image, JSON-LD) because no site URL was set. On Vercel the config falls back to the Vercel host (N15). Set NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_SITE_ENV=production for the live domain. | minor |
| Security headers | FAIL (recommend) | N6. | major |
| JSON-LD | PASS | Organization, ProductGroup, Product, BreadcrumbList present on product pages. | |

## 8. Not tested

Real screen readers (NVDA, VoiceOver, TalkBack), real touch devices, Dragon and Voice Control, forced colours mode, Lighthouse itself, a real GTM container (the GTM branch was reviewed in code, not built), real ad platform receipt of events, the long-order URL fallback levels (compact and short, reviewed in lib/whatsapp.ts only), cart undo ordering (D11) and a real browser text-size setting (N14).
