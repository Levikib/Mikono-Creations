# Mobile layout gate 2026-10-04

Base: https://mikono-creations.vercel.app  Mode: quick  Overall: **FAIL**

Defect clusters: critical 0, high 32, medium 11, low 31

Home page height at 390x844: 4955px

Re-run: `node scripts/mobile-qa/layout.mjs https://mikono-creations.vercel.app --pages quick`

## Per page

| Page | Result | Worst | Failing devices |
|---|---|---|---|
| / | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /shop | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /contact | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /gifts | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /story | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /journal | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /faq | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /custom | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /stockists | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /journal/what-mikono-means | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /cart | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /order | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /order/sent | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /shop/elephant | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /shop/monkey | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /shop/octopus | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |
| /shop/lion-head-handbag | FAIL | high | 320x568, 360x640, 360x740, 375x667, 390x844, 412x915, 430x932, 768x1024, 1024x768, 844x390, 667x375 |

## Ranked defects

| # | Sev | Type | Selector | Pages | Devices | Example (page, device) | Detail | Screenshot | Suggested fix |
|---|---|---|---|---|---|---|---|---|---|
| 1 | high | font-too-small | `a.nav-cart.iconbtn > span.absolute.-right-1.-top-1` | 17 | 11 | /contact, 320x568 | min 11px, 69 elements under 16px | strategy/gates/screens/mobile-layout/contact__320x568-fold.png | Raise to 16px minimum per charter. |
| 2 | high | cookie-dock-covers-content | `cookie-dock  X  a.hit-y.inline-flex` | 17 | 6 | /contact, 320x568 | dock covers 100% of "Call us on
+254 724 592 " (transient) | strategy/gates/screens/mobile-layout/contact__320x568-fold.png | Use --dock-h as body padding-bottom so the page can scroll content clear of the dock. |
| 3 | high | bottom-content-covered | `cookie-dock  X  li` | 17 | 5 | /faq, 320x568 | at page bottom "" is 78% covered by cookie-dock | strategy/gates/screens/mobile-layout/faq__320x568-fold.png | Add padding-bottom equal to the fixed bar height (and safe area) to the footer. |
| 4 | high | bottom-content-covered | `cookie-dock  X  a.hit-y.inline-flex` | 17 | 5 | /faq, 320x568 | at page bottom "" is 78% covered by cookie-dock | strategy/gates/screens/mobile-layout/faq__320x568-fold.png | Add padding-bottom equal to the fixed bar height (and safe area) to the footer. |
| 5 | high | tap-target-small | `a#nav-btn-home` | 17 | 1 | /contact, 1024x768 | 60x36 "Home" | - | min-height/min-width 44px (padding or ::after hit area). |
| 6 | high | tap-target-small | `button#nav-btn-shop` | 17 | 1 | /contact, 1024x768 | 73x36 "Shop" | - | min-height/min-width 44px (padding or ::after hit area). |
| 7 | high | tap-target-small | `button#nav-btn-gifts` | 17 | 1 | /contact, 1024x768 | 70x36 "Gifts" | - | min-height/min-width 44px (padding or ::after hit area). |
| 8 | high | tap-target-small | `button#nav-btn-wholesale` | 17 | 1 | /contact, 1024x768 | 108x36 "Wholesale" | - | min-height/min-width 44px (padding or ::after hit area). |
| 9 | high | tap-target-small | `button#nav-btn-story` | 17 | 1 | /contact, 1024x768 | 100x36 "Our story" | - | min-height/min-width 44px (padding or ::after hit area). |
| 10 | high | tap-target-small | `button#nav-btn-blog` | 17 | 1 | /contact, 1024x768 | 68x36 "Blog" | - | min-height/min-width 44px (padding or ::after hit area). |
| 11 | high | tap-target-small | `li > a.hit-y.inline-flex.min-h-8` | 15 | 10 | /contact, 320x568 | 36x44 "" | strategy/gates/screens/mobile-layout/contact__320x568-fold.png | min-height/min-width 44px (padding or ::after hit area). |
| 12 | high | tap-target-small | `div.flex.flex-wrap > a.hit-y.inline-flex.min-h-8` | 10 | 10 | /gifts, 320x568 | 37x44 "Terms" | strategy/gates/screens/mobile-layout/gifts__320x568-fold.png | min-height/min-width 44px (padding or ::after hit area). |
| 13 | high | thread-overlaps-tap-target | `span.fx-ball  X  a.hit-y.inline-flex` | 8 | 5 | /custom, 320x568 | thread covers 18% of "" at y=454 | strategy/gates/screens/mobile-layout/custom__320x568-full.png | Keep the thread within the page gutter, away from controls. |
| 14 | high | tap-target-small | `li.flex.items-center > a.hit-y.inline-flex.min-h-8` | 5 | 10 | /journal/what-mikono-means, 320x568 | 35x44 "Blog" | strategy/gates/screens/mobile-layout/journal_what-mikono-means__320x568-full.png | min-height/min-width 44px (padding or ::after hit area). |
| 15 | high | tap-target-small | `p.mt-2.text-[.8125rem] > a.hit.font-semibold.text-terracotta-deep` | 4 | 10 | /shop/elephant, 320x568 | 62x43 "Size guide" | strategy/gates/screens/mobile-layout/shop_elephant__320x568-fold.png | min-height/min-width 44px (padding or ::after hit area). |
| 16 | high | tap-target-small | `div.clay-well.inline-flex > input.h-8.w-9.bg-transparent` | 4 | 10 | /shop/elephant, 320x568 | 36x32 "" | strategy/gates/screens/mobile-layout/shop_elephant__320x568-fold.png | min-height/min-width 44px (padding or ::after hit area). |
| 17 | high | tap-target-small | `div.mb-3.flex > a.inline-flex.min-h-10.items-center` | 4 | 10 | /shop/elephant, 320x568 | 106x40 "" | strategy/gates/screens/mobile-layout/shop_elephant__320x568-fold.png | min-height/min-width 44px (padding or ::after hit area). |
| 18 | high | zoom200-overflow | `html` | 4 | 1 | /shop/elephant, 320x568 | scrollWidth 327 > 320;  | strategy/gates/screens/mobile-layout/shop_elephant__320x568-fold.png | Use rem for widths/paddings, allow wrap, avoid fixed px widths on text containers. |
| 19 | high | text-clipped | `div.mk-body > h3.mk-title` | 4 | 1 | /shop/elephant, 844x390 | width "Care guide
: Care guide" | strategy/gates/screens/mobile-layout/shop_elephant__844x390-fold.png | Allow wrapping (white-space:normal), remove fixed height, or reduce letter-spacing. |
| 20 | high | tap-target-small | `div.relative.w-full > button.absolute.left-1.5.top-1/2` | 3 | 2 | /shop/monkey, 768x1024 | 32x32 "Previous photo" | strategy/gates/screens/mobile-layout/shop_monkey__768x1024-fold.png | min-height/min-width 44px (padding or ::after hit area). |
| 21 | high | tap-target-small | `div.relative.w-full > button.absolute.right-1.5.top-1/2` | 3 | 2 | /shop/monkey, 768x1024 | 32x32 "Next photo" | strategy/gates/screens/mobile-layout/shop_monkey__768x1024-fold.png | min-height/min-width 44px (padding or ::after hit area). |
| 22 | high | tap-target-small | `div > label.flex.min-h-9.items-end` | 2 | 10 | /contact, 320x568 | 290x36 "Your name
(optional)" | strategy/gates/screens/mobile-layout/contact__320x568-fold.png | min-height/min-width 44px (padding or ::after hit area). |
| 23 | high | tap-target-small | `div.fx-band-in > button.fx-char.fx-find` | 2 | 10 | /stockists, 320x568 | 43x43 "Hidden animal: tap to fi" | strategy/gates/screens/mobile-layout/stockists__320x568-full.png | min-height/min-width 44px (padding or ::after hit area). |
| 24 | high | tap-target-small | `input#name` | 1 | 10 | /contact, 320x568 | 290x36 "" | strategy/gates/screens/mobile-layout/contact__320x568-fold.png | min-height/min-width 44px (padding or ::after hit area). |
| 25 | high | tap-target-small | `input#phone` | 1 | 10 | /contact, 320x568 | 290x36 "" | strategy/gates/screens/mobile-layout/contact__320x568-fold.png | min-height/min-width 44px (padding or ::after hit area). |
| 26 | high | tap-target-small | `li > button` | 1 | 10 | /, 320x568 | 28x44 "Show Elephant" | strategy/gates/screens/mobile-layout/home__320x568-full.png | min-height/min-width 44px (padding or ::after hit area). |
| 27 | high | tap-target-small | `input#typeOther` | 1 | 10 | /custom, 320x568 | 290x36 "" | strategy/gates/screens/mobile-layout/custom__320x568-full.png | min-height/min-width 44px (padding or ::after hit area). |
| 28 | high | tap-target-small | `input#org` | 1 | 10 | /custom, 320x568 | 290x36 "" | strategy/gates/screens/mobile-layout/custom__320x568-full.png | min-height/min-width 44px (padding or ::after hit area). |
| 29 | high | tap-target-small | `input#contact` | 1 | 10 | /custom, 320x568 | 290x36 "" | strategy/gates/screens/mobile-layout/custom__320x568-full.png | min-height/min-width 44px (padding or ::after hit area). |
| 30 | high | fx-overlaps-tap-target | `span.fx-char[data-sp=rhino]  X  button.fx-char.fx-find[data-sp=dik-dik-peek][data-find=dikdik-stockists]` | 1 | 5 | /stockists, 320x568 | animal box covers 57% of "Hidden animal: tap to fi" at y=194 | strategy/gates/screens/mobile-layout/stockists__320x568-full.png | Move the animal off the control or confirm pointer-events:none and z-index below the control. |
| 31 | high | bottom-content-covered | `cookie-dock  X  button.hit-y.inline-flex` | 1 | 1 | /shop/lion-head-handbag, 320x568 | at page bottom "Cookie settings" is 100% covered by cookie-dock | strategy/gates/screens/mobile-layout/shop_lion-head-handbag__320x568-fold.png | Add padding-bottom equal to the fixed bar height (and safe area) to the footer. |
| 32 | high | thread-overlaps-tap-target | `span.fx-ball  X  a.hit-area.inline-flex` | 1 | 1 | /shop, 360x640 | thread covers 10% of "Mikono Creations on Face" at y=2334 | strategy/gates/screens/mobile-layout/shop__360x640-fx.png | Keep the thread within the page gutter, away from controls. |
| 33 | medium | fixed-elements-heavy | `section#cookie-choices + header.nav-spacer > div.nav-zone` | 11 | 5 | /, 320x568 | 26% of viewport covered at scroll 0 | strategy/gates/screens/mobile-layout/home__320x568-full.png | Reduce fixed chrome height. |
| 34 | medium | fixed-elements-heavy | `section#cookie-choices + header.nav-spacer > div.nav-zone + aside > a.wa-float.btn-whatsapp.on-dark` | 8 | 5 | /contact, 320x568 | 26% of viewport covered at scroll 0 | strategy/gates/screens/mobile-layout/contact__320x568-fold.png | Reduce fixed chrome height. |
| 35 | medium | fixed-elements-heavy | `section#cookie-choices + header.nav-spacer > div.nav-zone + div.mx-auto.w-full > div.sticky.top-[58px].z-20` | 1 | 8 | /shop, 320x568 | 33% of viewport covered at scroll 0 | strategy/gates/screens/mobile-layout/shop__320x568-full.png | Reduce fixed chrome height. |
| 36 | medium | fx-overlaps-text | `span.fx-char[data-sp=elephant]  X  p.mt-1.5.max-w-[58ch]` | 1 | 2 | /stockists, 360x640 | animal box covers 39% of text line "Our animals are sold through" at y=201 (decorative, pointer-events none) | strategy/gates/screens/mobile-layout/stockists__360x640-fx.png | Keep animals in their own band lane or add margin; sprites must not sit over body copy. |
| 37 | medium | fx-overlaps-text | `span.fx-char[data-sp=cat-sleep]  X  a.mk-link` | 1 | 1 | /, 320x568 | animal box covers 64% of text line "Our story" at y=2554 (decorative, pointer-events none) | strategy/gates/screens/mobile-layout/home__320x568-full.png | Keep animals in their own band lane or add margin; sprites must not sit over body copy. |
| 38 | medium | fx-overlaps-text | `span.fx-char[data-sp=octopus]  X  h2.mb-2.text-display-md` | 1 | 1 | /custom, 320x568 | animal box covers 39% of text line "Prefer to just message us?" at y=965 (decorative, pointer-events none) | strategy/gates/screens/mobile-layout/custom__320x568-full.png | Keep animals in their own band lane or add margin; sprites must not sit over body copy. |
| 39 | medium | fx-overlaps-text | `span.fx-char[data-sp=zebra]  X  h2#ways` | 1 | 1 | /, 390x844 | animal box covers 25% of text line "Three ways to take one home" at y=1534 (decorative, pointer-events none) | strategy/gates/screens/mobile-layout/home__390x844-full.png | Keep animals in their own band lane or add margin; sprites must not sit over body copy. |
| 40 | medium | fx-overlaps-text | `span.fx-char[data-sp=zebra]  X  h3.mk-title` | 1 | 1 | /, 390x844 | animal box covers 47% of text line "Ready to go" at y=1534 (decorative, pointer-events none) | strategy/gates/screens/mobile-layout/home__390x844-full.png | Keep animals in their own band lane or add margin; sprites must not sit over body copy. |
| 41 | medium | fx-overlaps-text | `span.fx-char[data-sp=zebra]  X  p.mk-text` | 1 | 1 | /, 390x844 | animal box covers 28% of text line "Pick an animal and a size fr" at y=1534 (decorative, pointer-events none) | strategy/gates/screens/mobile-layout/home__390x844-full.png | Keep animals in their own band lane or add margin; sprites must not sit over body copy. |
| 42 | medium | fx-overlaps-text | `span.fx-char[data-sp=elephant]  X  span.mk-tag` | 1 | 1 | /, 412x915 | animal box covers 72% of text line "CUSTOM ORDERS" at y=4007 (decorative, pointer-events none) | strategy/gates/screens/mobile-layout/home__412x915-fx.png | Keep animals in their own band lane or add margin; sprites must not sit over body copy. |
| 43 | medium | fx-overlaps-text | `span.fx-char[data-sp=ostrich-stand]  X  a.inline-flex.min-h-10` | 1 | 1 | /shop/lion-head-handbag, 412x915 | animal box covers 32% of text line "Shop all animals" at y=1189 (decorative, pointer-events none) | strategy/gates/screens/mobile-layout/shop_lion-head-handbag__412x915-fx.png | Keep animals in their own band lane or add margin; sprites must not sit over body copy. |
| 44 | low | cookie-dock-covers-content | `cookie-dock  X  summary.flex.min-h-11` | 15 | 5 | /gifts, 320x568 | dock covers 100% of "Work with us" (transient) | strategy/gates/screens/mobile-layout/gifts__320x568-fold.png | Use --dock-h as body padding-bottom so the page can scroll content clear of the dock. |
| 45 | low | thread-ball-clipped-at-edge | `div.fx-t-ahead > span.fx-ball` | 13 | 11 | /contact, 320x568 | right 17, left -3, width 20 (thread rail sits on the viewport edge, bounding box includes rotation) | strategy/gates/screens/mobile-layout/contact__320x568-fold.png | Inset the thread 4px from the edge so the yarn ball is never cut off. |
| 46 | low | thread-ball-clipped-at-edge | `span.fx-ball > img` | 13 | 11 | /contact, 320x568 | right 17, left -3, width 20 (thread rail sits on the viewport edge, bounding box includes rotation) | strategy/gates/screens/mobile-layout/contact__320x568-fold.png | Inset the thread 4px from the edge so the yarn ball is never cut off. |
| 47 | low | cookie-dock-covers-content | `cookie-dock  X  a.hit-area.inline-flex` | 13 | 5 | /contact, 320x568 | dock covers 100% of "Mikono Creations on Face" (transient) | strategy/gates/screens/mobile-layout/contact__320x568-fold.png | Use --dock-h as body padding-bottom so the page can scroll content clear of the dock. |
| 48 | low | cookie-dock-covers-content | `cookie-dock  X  button.hit-y.inline-flex` | 12 | 5 | /custom, 320x568 | dock covers 100% of "Cookie settings" (transient) | strategy/gates/screens/mobile-layout/custom__320x568-full.png | Use --dock-h as body padding-bottom so the page can scroll content clear of the dock. |
| 49 | low | thread-ball-clipped-at-edge | `div.fx-thread > i.fx-knot` | 10 | 9 | /story, 360x640 | right 16, left -2, width 18 (thread rail sits on the viewport edge, bounding box includes rotation) | strategy/gates/screens/mobile-layout/story__360x640-fx.png | Inset the thread 4px from the edge so the yarn ball is never cut off. |
| 50 | low | cookie-dock-covers-content | `cookie-dock  X  button.an-switch` | 6 | 4 | /shop, 320x568 | dock covers 66% of "Animals: on" (transient) | strategy/gates/screens/mobile-layout/shop__320x568-full.png | Use --dock-h as body padding-bottom so the page can scroll content clear of the dock. |
| 51 | low | cookie-dock-covers-content | `cookie-dock  X  a.hit-y.relative` | 2 | 2 | /cart, 320x568 | dock covers 100% of "See the animals" (transient) | strategy/gates/screens/mobile-layout/cart__320x568-full.png | Use --dock-h as body padding-bottom so the page can scroll content clear of the dock. |
| 52 | low | tap-target-inline | `p.mt-3.eyebrow > a.hover:underline` | 1 | 11 | /journal/what-mikono-means, 320x568 | 2 inline links under 44px, e.g. 143x16 "MAKERS AND IMPACT" | strategy/gates/screens/mobile-layout/journal_what-mikono-means__320x568-full.png | Add vertical padding/line-height to inline links in dense lists. |
| 53 | low | primary-cta-below-fold | `div > button.hit-y.relative.inline-flex` | 1 | 9 | /contact, 320x568 | bottom 975 | strategy/gates/screens/mobile-layout/contact__320x568-fold.png | Tighten hero height so first CTA shows above the fold. |
| 54 | low | primary-cta-below-fold | `div.mt-2.5.flex > a.hit-y.relative.inline-flex` | 1 | 9 | /story, 320x568 | bottom 1292 | strategy/gates/screens/mobile-layout/story__320x568-fold.png | Tighten hero height so first CTA shows above the fold. |
| 55 | low | primary-cta-below-fold | `div.flex.flex-wrap > a.hit-y.relative.inline-flex` | 1 | 9 | /journal/what-mikono-means, 320x568 | bottom 3579 | strategy/gates/screens/mobile-layout/journal_what-mikono-means__320x568-full.png | Tighten hero height so first CTA shows above the fold. |
| 56 | low | cookie-dock-covers-content | `cookie-dock  X  a.inline-flex.min-h-11` | 1 | 5 | /faq, 320x568 | dock covers 86% of "" (transient) | strategy/gates/screens/mobile-layout/faq__320x568-fold.png | Use --dock-h as body padding-bottom so the page can scroll content clear of the dock. |
| 57 | low | primary-cta-below-fold | `div.flex.flex-col > a.hit-y.relative.inline-flex` | 1 | 4 | /stockists, 390x844 | bottom 1008 | strategy/gates/screens/mobile-layout/stockists__390x844-full.png | Tighten hero height so first CTA shows above the fold. |
| 58 | low | cta-under-cookie-dock-at-load | `h2.mt-1.text-display-md > a.hit.hover:underline` | 1 | 3 | /journal, 320x568 | first CTA sits under section#cookie-choices at scroll 0 on first visit; one scroll or choosing clears it | strategy/gates/screens/mobile-layout/journal__320x568-fold.png | Acceptable if dock is dismissable; otherwise keep first CTA above the dock line. |
| 59 | low | primary-cta-below-fold | `p.mt-2 > a.inline-flex.min-h-11.items-center` | 1 | 3 | /faq, 320x568 | bottom 640 | strategy/gates/screens/mobile-layout/faq__320x568-fold.png | Tighten hero height so first CTA shows above the fold. |
| 60 | low | primary-cta-below-fold | `div.flex.flex-wrap > a.ck-tbtn.-ml-2` | 1 | 3 | /cart, 320x568 | bottom 830 | strategy/gates/screens/mobile-layout/cart__320x568-full.png | Tighten hero height so first CTA shows above the fold. |
| 61 | low | primary-cta-below-fold | `h3.mk-title > a.mk-stretch` | 1 | 3 | /stockists, 320x568 | bottom 651 | strategy/gates/screens/mobile-layout/stockists__320x568-full.png | Tighten hero height so first CTA shows above the fold. |
| 62 | low | cookie-dock-covers-content | `cookie-dock  X  a.ck-tbtn` | 1 | 2 | /cart, 320x568 | dock covers 89% of "Ask us on WhatsApp" (transient) | strategy/gates/screens/mobile-layout/cart__320x568-full.png | Use --dock-h as body padding-bottom so the page can scroll content clear of the dock. |
| 63 | low | cookie-dock-covers-content | `cookie-dock  X  button.fx-char.fx-find[data-sp=ladybird-crawl][data-find=ladybird-custom]` | 1 | 2 | /custom, 320x568 | dock covers 100% of "Hidden animal: tap to fi" (transient) | strategy/gates/screens/mobile-layout/custom__320x568-full.png | Use --dock-h as body padding-bottom so the page can scroll content clear of the dock. |
| 64 | low | cookie-dock-covers-content | `cookie-dock  X  button.fx-char.fx-find[data-sp=hornbill-perch][data-find=hornbill-story]` | 1 | 2 | /story, 390x844 | dock covers 65% of "Hidden animal: tap to fi" (transient) | strategy/gates/screens/mobile-layout/story__390x844-fold.png | Use --dock-h as body padding-bottom so the page can scroll content clear of the dock. |
| 65 | low | cta-under-cookie-dock-at-load | `div.flex.flex-wrap > a.ck-tbtn.-ml-2` | 1 | 2 | /cart, 360x640 | first CTA sits under section#cookie-choices at scroll 0 on first visit; one scroll or choosing clears it | - | Acceptable if dock is dismissable; otherwise keep first CTA above the dock line. |
| 66 | low | fixed-overlap | `section#cookie-choices  X  div.mx-auto.w-full > div.sticky.top-[58px].z-20` | 1 | 2 | /shop, 844x390 | overlap 5773px2 | strategy/gates/screens/mobile-layout/shop__844x390-fold.png | Stack with a shared offset variable (e.g. --bar-h) so WhatsApp float sits above cookie bar. |
| 67 | low | primary-cta-below-fold | `h2.mt-1.text-display-md > a.hit.hover:underline` | 1 | 2 | /journal, 844x390 | bottom 428 | strategy/gates/screens/mobile-layout/journal__844x390-fold.png | Tighten hero height so first CTA shows above the fold. |
| 68 | low | cta-under-cookie-dock-at-load | `p.mt-2 > a.inline-flex.min-h-11.items-center` | 1 | 1 | /faq, 360x640 | first CTA sits under section#cookie-choices at scroll 0 on first visit; one scroll or choosing clears it | - | Acceptable if dock is dismissable; otherwise keep first CTA above the dock line. |
| 69 | low | cookie-dock-covers-content | `cookie-dock  X  a.ck-tbtn.-ml-2` | 1 | 1 | /cart, 360x640 | dock covers 100% of "Not sure what to pick? G" (transient) | - | Use --dock-h as body padding-bottom so the page can scroll content clear of the dock. |
| 70 | low | cta-under-cookie-dock-at-load | `h3.mk-title > a.mk-stretch` | 1 | 1 | /stockists, 360x640 | first CTA sits under section#cookie-choices at scroll 0 on first visit; one scroll or choosing clears it | - | Acceptable if dock is dismissable; otherwise keep first CTA above the dock line. |
| 71 | low | cookie-dock-covers-content | `cookie-dock  X  button.fx-char.fx-find[data-sp=monkey][data-find=monkey-journal]` | 1 | 1 | /journal, 360x740 | dock covers 100% of "Hidden animal: tap to fi" (transient) | strategy/gates/screens/mobile-layout/journal__360x740-fold.png | Use --dock-h as body padding-bottom so the page can scroll content clear of the dock. |
| 72 | low | wa-float-covers-content | `wa-float  X  a.hit-y.inline-flex` | 1 | 1 | /contact, 412x915 | float covers 55% of "Your data" at scrollY with target 2046 (transient, scroll clears it) | - | Add bottom padding or move the float away from CTAs; at page end nothing may stay covered. |
| 73 | low | cta-under-cookie-dock-at-load | `div > button.hit-y.relative.inline-flex` | 1 | 1 | /contact, 768x1024 | first CTA sits under section#cookie-choices at scroll 0 on first visit; one scroll or choosing clears it | strategy/gates/screens/mobile-layout/contact__768x1024-fold.png | Acceptable if dock is dismissable; otherwise keep first CTA above the dock line. |
| 74 | low | cta-under-cookie-dock-at-load | `div.mt-1.grid > a.hit-y.relative.inline-flex` | 1 | 1 | /, 844x390 | first CTA sits under section#cookie-choices at scroll 0 on first visit; one scroll or choosing clears it | strategy/gates/screens/mobile-layout/home__844x390-fold.png | Acceptable if dock is dismissable; otherwise keep first CTA above the dock line. |

## Nav pill 1024 to 1440

| Page | Width | Pill right | Rows | scrollWidth/clientWidth | Result |
|---|---|---|---|---|---|
| / | 1024 | 1016 | 1 | 1008/1008 | PASS |
| / | 1100 | 1092 | 1 | 1084/1084 | PASS |
| / | 1180 | 1172 | 1 | 1164/1164 | PASS |
| / | 1280 | 1230 | 1 | 1180/1180 | PASS |
| / | 1366 | 1273 | 1 | 1180/1180 | PASS |
| / | 1440 | 1310 | 1 | 1180/1180 | PASS |
| /shop | 1024 | 1016 | 1 | 1008/1008 | PASS |
| /shop | 1100 | 1092 | 1 | 1084/1084 | PASS |
| /shop | 1180 | 1172 | 1 | 1164/1164 | PASS |
| /shop | 1280 | 1230 | 1 | 1180/1180 | PASS |
| /shop | 1366 | 1273 | 1 | 1180/1180 | PASS |
| /shop | 1440 | 1310 | 1 | 1180/1180 | PASS |

## Living layer overlap sampling (320, 360, 390, 412, 768)

Page x device scans: 102. Totals: {"fxText":9,"fxTap":5,"threadText":0,"threadTap":12,"waDock":0,"bottomCovered":95}
