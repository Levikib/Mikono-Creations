# Mobile interactions gate (2026-10-02)

Base: http://localhost:3100
Overall: **FAIL** (Critical 1, Serious 100, Moderate 2, Minor 0; unique defects 103)
Devices: 360x740, 390x844, 320x568, 375x667, 412x915, 768x1024
Runtime: 761s
Re-run: `node scripts/mobile-qa/interactions.mjs http://localhost:3100`

## Scenario results

| Scenario | Result | Failing devices |
|---|---|---|
| S1 Splash screen | FAIL | 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915 |
| S2 Header and mobile menu | FAIL | 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915 |
| S3 Overlays (cart, filter, consent, toast, WhatsApp, sticky bar) | FAIL | 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915 |
| S4 Forms with on-screen keyboard | FAIL | 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915 |
| S5 Gestures and scrollers | FAIL | 360x740, 375x667, 320x568 |
| S6 Orientation and resize | PASS | none |

## Ranked defects

1. **Critical** [S1] `html` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: page scrolls by touch after splash (0 to 0)
   - Fix: Splash must release scroll lock.
   - Screenshot: n/a
2. **Serious** [S1] `.splash skip` on 390x844, 360x740, 768x1024, 412x915: Skip intro target none (needs 44x44)
   - Fix: Give Skip min 48px tap area.
   - Screenshot: strategy/gates/screens/mobile-interactions/390x844-splash-first.png
3. **Serious** [S2] `.nav-burger` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: burger 36x36
   - Fix: Min 44x44.
   - Screenshot: n/a
4. **Serious** [S2] `.mnav-top (Shop)` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: top-level row height 46 (needs 48)
   - Fix: min-height:48px.
   - Screenshot: n/a
5. **Serious** [S2] `#mnav-shop a[href="/shop/safari-animals"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Safari animalsGiraffe, lion, e" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-0.png
6. **Serious** [S2] `#mnav-shop a[href="/shop/domestic-animals"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Domestic animalsRabbit, cat, d" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-0.png
7. **Serious** [S2] `#mnav-shop a[href="/shop/more-animals"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "More animalsOctopus, turtle, g" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-0.png
8. **Serious** [S2] `#mnav-shop a[href="/shop/wall-art"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Wall artCrocheted heads to han" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-0.png
9. **Serious** [S2] `#mnav-shop a[href="/shop/dolls"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "DollsHand finished dresses" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-0.png
10. **Serious** [S2] `#mnav-shop a[href="/size-finder?src=nav"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Find the right sizeS, M, L or " row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-0.png
11. **Serious** [S2] `#mnav-shop a[href="/size-guide"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Size guideS, M, L and XL side " row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-0.png
12. **Serious** [S2] `.mnav-top (Gifts)` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: top-level row height 46 (needs 48)
   - Fix: min-height:48px.
   - Screenshot: n/a
13. **Serious** [S2] `#mnav-gifts a[href="/gifts/finder?src=nav"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Gift finderFive questions, thr" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-1.png
14. **Serious** [S2] `#mnav-gifts a[href="/build-a-family?src=nav"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Build a safari familyMake a se" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-1.png
15. **Serious** [S2] `#mnav-gifts a[href="/custom/studio?src=nav"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Make it yoursDesign your own a" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-1.png
16. **Serious** [S2] `#mnav-gifts a[href="/shop"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Gift an animalPick an animal a" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-1.png
17. **Serious** [S2] `#mnav-gifts a[href="/custom/studio?type=corporate_gift&src=nav"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Corporate and group giftsOrder" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-1.png
18. **Serious** [S2] `#mnav-gifts a[href="/gifts#order"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Gift note and deliveryHow the " row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-1.png
19. **Serious** [S2] `.mnav-top (Wholesale)` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: top-level row height 46 (needs 48)
   - Fix: min-height:48px.
   - Screenshot: n/a
20. **Serious** [S2] `#mnav-wholesale a[href="/wholesale?request=price-list#request"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Price listSent on WhatsApp" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-2.png
21. **Serious** [S2] `#mnav-wholesale a[href="/wholesale?request=quote#request"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "QuoteFor your quantities" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-2.png
22. **Serious** [S2] `#mnav-wholesale a[href="/wholesale?request=sample-pack#request"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Sample packAsk on WhatsApp" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-2.png
23. **Serious** [S2] `#mnav-wholesale a[href="/partners"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Become a stockistSell our anim" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-2.png
24. **Serious** [S2] `#mnav-wholesale a[href="/supply"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Supply with usTell us what you" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-2.png
25. **Serious** [S2] `.mnav-top (Our story)` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: top-level row height 46 (needs 48)
   - Fix: min-height:48px.
   - Screenshot: n/a
26. **Serious** [S2] `#mnav-story a[href="/impact"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Our impactThe women we support" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-3.png
27. **Serious** [S2] `#mnav-story a[href="/makers"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Meet the makersAt work in Nair" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-3.png
28. **Serious** [S2] `#mnav-story a[href="/projects"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "ProjectsPhoto stories" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-3.png
29. **Serious** [S2] `#mnav-story a[href="/gallery"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "GalleryMarkets and shelves" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-3.png
30. **Serious** [S2] `#mnav-story a[href="/stockists"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "StockistsWhere to buy in Nairo" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-3.png
31. **Serious** [S2] `.mnav-top (Journal)` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: top-level row height 46 (needs 48)
   - Fix: min-height:48px.
   - Screenshot: n/a
32. **Serious** [S2] `#mnav-journal a[href="/journal/what-mikono-means"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "What Mikono meansOur name, 2 m" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-4.png
33. **Serious** [S2] `#mnav-journal a[href="/journal/what-is-recycled-acrylic-yarn"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "What is recycled acrylic yarn?" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-4.png
34. **Serious** [S2] `#mnav-journal a[href="/journal/how-to-choose-a-size"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "How to choose a size, S to XLS" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-4.png
35. **Serious** [S2] `#mnav-journal a[href="/care"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Care guideKeeping it clean" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-4.png
36. **Serious** [S2] `#mnav-journal a[href="/size-guide"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Size guideChoosing S to XL" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-4.png
37. **Serious** [S2] `#mnav-journal a[href="/safety"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Materials and safetyHow it is " row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-4.png
38. **Serious** [S2] `.mnav-top (Help)` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: top-level row height 46 (needs 48)
   - Fix: min-height:48px.
   - Screenshot: n/a
39. **Serious** [S2] `#mnav-help a[href="/faq"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "FAQCommon questions" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-5.png
40. **Serious** [S2] `#mnav-help a[href="/delivery"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "DeliveryHow delivery works" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-5.png
41. **Serious** [S2] `#mnav-help a[href="/contact"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "ContactSend us a message" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-5.png
42. **Serious** [S2] `#mnav-help a[href="https://wa.me/254724592115"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "WhatsApp usThe quickest way" row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-5.png
43. **Serious** [S2] `#mnav-help a[href="tel:+254724592115"]` on 360x740, 390x844, 375x667, 320x568, 768x1024, 412x915: sub-link "Call +254 724 592 115Speak to " row height 44px (needs 48)
   - Fix: min-height:48px on menu rows.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-menu-section-5.png
44. **Serious** [S2] `.mnav-close` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: close button 36x36
   - Fix: Min 44x44.
   - Screenshot: n/a
45. **Serious** [S2] `dialog.mnav` on 768x1024: landscape while open: {"open":false,"closeVisible":true,"hs":0,"scrollable":false,"dh":0,"ih":768}
   - Fix: Make sheet a flex column with the scroll area flexing; keep close button sticky.
   - Screenshot: strategy/gates/screens/mobile-interactions/768x1024-menu-landscape.png
46. **Serious** [S3] `#cookie-choices button` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: consent buttons [[182,36],[182,36]]
   - Fix: Min 44px.
   - Screenshot: n/a
47. **Serious** [S3] `[aria-label^='Order list']` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: cart button 36x36
   - Fix: Min 44px.
   - Screenshot: n/a
48. **Serious** [S4] `/contact input#name` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
49. **Serious** [S4] `/contact input#name` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
50. **Serious** [S4] `/contact input#phone` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
51. **Serious** [S4] `/contact input#phone` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
52. **Serious** [S4] `/contact textarea#message` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
53. **Serious** [S4] `/wholesale input#business` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
54. **Serious** [S4] `/wholesale input#business` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
55. **Serious** [S4] `/wholesale input#contact` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
56. **Serious** [S4] `/wholesale input#contact` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
57. **Serious** [S4] `/wholesale input#phone` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
58. **Serious** [S4] `/wholesale input#phone` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
59. **Serious** [S4] `/wholesale input#email` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
60. **Serious** [S4] `/wholesale input#email` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
61. **Serious** [S4] `/wholesale input#sells` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
62. **Serious** [S4] `/wholesale input#sells` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
63. **Serious** [S4] `/wholesale input#quantities` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
64. **Serious** [S4] `/wholesale input#quantities` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
65. **Serious** [S4] `/wholesale textarea#notes` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
66. **Serious** [S4] `/custom input#org` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
67. **Serious** [S4] `/custom input#org` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
68. **Serious** [S4] `/custom input#contact` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
69. **Serious** [S4] `/custom input#contact` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
70. **Serious** [S4] `/custom input#phone` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
71. **Serious** [S4] `/custom input#phone` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
72. **Serious** [S4] `/custom input#email` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
73. **Serious** [S4] `/custom input#email` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
74. **Serious** [S4] `/custom input#animal` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
75. **Serious** [S4] `/custom input#animal` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
76. **Serious** [S4] `/custom select#size` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
77. **Serious** [S4] `/custom select#size` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
78. **Serious** [S4] `/custom input#qty` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
79. **Serious** [S4] `/custom input#qty` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
80. **Serious** [S4] `/custom textarea#message` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
81. **Serious** [S4] `/partners input#org` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
82. **Serious** [S4] `/partners input#org` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
83. **Serious** [S4] `/partners input#contact` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
84. **Serious** [S4] `/partners input#contact` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
85. **Serious** [S4] `/partners input#phone` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
86. **Serious** [S4] `/partners input#phone` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
87. **Serious** [S4] `/partners input#email` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
88. **Serious** [S4] `/partners input#email` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
89. **Serious** [S4] `/partners textarea#message` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
90. **Serious** [S4] `/supply input#org` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
91. **Serious** [S4] `/supply input#org` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
92. **Serious** [S4] `/supply input#contact` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
93. **Serious** [S4] `/supply input#contact` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
94. **Serious** [S4] `/supply input#phone` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
95. **Serious** [S4] `/supply input#phone` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
96. **Serious** [S4] `/supply input#email` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
97. **Serious** [S4] `/supply input#email` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: control height 36px (needs 44) 
   - Fix: min-height 48px.
   - Screenshot: n/a
98. **Serious** [S4] `/supply textarea#message` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: font-size 14px triggers iOS zoom on focus 
   - Fix: Set input font-size to 16px or more.
   - Screenshot: n/a
99. **Serious** [S4] `custom #message` on 768x1024: focused field off-screen at 55% height
   - Fix: Sticky/fixed bars must hide on focus or use scroll-padding-bottom; avoid fixed footers in forms.
   - Screenshot: strategy/gates/screens/mobile-interactions/768x1024-custom-keyboard-message.png
100. **Serious** [S5] `/ .scroller.-mx-3.flex` on 360x740, 375x667, 320x568: swipe left moves scroller (0 to 0)
   - Fix: Ensure overflow-x:auto and no touch-action:none/pan-y.
   - Screenshot: strategy/gates/screens/mobile-interactions/360x740-rail-0.png
101. **Serious** [S5] `/ .scroller.-mx-3.flex` on 360x740, 375x667, 320x568: vertical swipe on rail scrolls page (444 to 444); touch-action manipulation
   - Fix: Do not set touch-action:pan-x; use overscroll-behavior-x:contain only.
   - Screenshot: n/a
102. **Moderate** [S1] `.splash` on 390x844, 360x740, 768x1024, 412x915: splash covers viewport (0x0)
   - Fix: Make splash position:fixed inset:0 with 100dvh.
   - Screenshot: strategy/gates/screens/mobile-interactions/390x844-splash-first.png
103. **Moderate** [S4] `/custom input#org` on 390x844, 360x740, 375x667, 320x568, 768x1024, 412x915: "Business or group name (option" autocomplete="organization" missing or wrong
   - Fix: Add the matching autocomplete token (name, email, tel, street-address, organization).
   - Screenshot: n/a

## Evidence per scenario

### S1 Splash screen: FAIL

**390x844** FAIL
- FAIL: splash covers viewport (0x0)
- FAIL: Skip intro target none (needs 44x44)
- ok: tap on Skip removes splash (8050ms)
- ok: after splash: scroll not locked, nothing inert ({"bodyOv":"visible","htmlOv":"visible","inert":false,"ariaHidden":false,"splash":false})
- FAIL: page scrolls by touch after splash (0 to 0)
- ok: content underneath is tappable after splash
- ok: splash plays again on a full reload (owner ruling: every full page load)
- ok: splash completes by itself in 2100ms (limit 3000)
- ok: consent bar not covered after splash (clear)
- ok: prefers-reduced-motion skips splash

**360x740** FAIL
- FAIL: splash covers viewport (0x0)
- FAIL: Skip intro target none (needs 44x44)
- ok: tap on Skip removes splash (8019ms)
- ok: after splash: scroll not locked, nothing inert ({"bodyOv":"visible","htmlOv":"visible","inert":false,"ariaHidden":false,"splash":false})
- FAIL: page scrolls by touch after splash (0 to 0)
- ok: content underneath is tappable after splash
- ok: splash plays again on a full reload (owner ruling: every full page load)
- ok: splash completes by itself in 2097ms (limit 3000)
- ok: consent bar not covered after splash (clear)
- ok: prefers-reduced-motion skips splash

**375x667** FAIL
- ok: splash covers viewport (375x667)
- ok: Skip intro target 57x44 (needs 44x44)
- ok: tap on Skip removes splash (296ms)
- ok: after splash: scroll not locked, nothing inert ({"bodyOv":"visible","htmlOv":"visible","inert":false,"ariaHidden":false,"splash":false})
- FAIL: page scrolls by touch after splash (0 to 0)
- ok: content underneath is tappable after splash
- ok: splash plays again on a full reload (owner ruling: every full page load)
- ok: splash completes by itself in 2086ms (limit 3000)
- ok: consent bar not covered after splash (clear)
- ok: prefers-reduced-motion skips splash

**320x568** FAIL
- ok: splash covers viewport (320x568)
- ok: Skip intro target 57x44 (needs 44x44)
- ok: tap on Skip removes splash (8019ms)
- ok: after splash: scroll not locked, nothing inert ({"bodyOv":"visible","htmlOv":"visible","inert":false,"ariaHidden":false,"splash":false})
- FAIL: page scrolls by touch after splash (0 to 0)
- ok: content underneath is tappable after splash
- ok: splash plays again on a full reload (owner ruling: every full page load)
- ok: splash completes by itself in 2000ms (limit 3000)
- ok: consent bar not covered after splash (clear)
- ok: prefers-reduced-motion skips splash

**768x1024** FAIL
- FAIL: splash covers viewport (0x0)
- FAIL: Skip intro target none (needs 44x44)
- ok: tap on Skip removes splash (8014ms)
- ok: after splash: scroll not locked, nothing inert ({"bodyOv":"visible","htmlOv":"visible","inert":false,"ariaHidden":false,"splash":false})
- FAIL: page scrolls by touch after splash (0 to 0)
- ok: content underneath is tappable after splash
- ok: splash plays again on a full reload (owner ruling: every full page load)
- ok: splash completes by itself in 2132ms (limit 3000)
- ok: consent bar not covered after splash (clear)
- ok: prefers-reduced-motion skips splash

**412x915** FAIL
- FAIL: splash covers viewport (0x0)
- FAIL: Skip intro target none (needs 44x44)
- ok: tap on Skip removes splash (8059ms)
- ok: after splash: scroll not locked, nothing inert ({"bodyOv":"visible","htmlOv":"visible","inert":false,"ariaHidden":false,"splash":false})
- FAIL: page scrolls by touch after splash (0 to 0)
- ok: content underneath is tappable after splash
- ok: splash plays again on a full reload (owner ruling: every full page load)
- ok: splash completes by itself in 2139ms (limit 3000)
- ok: consent bar not covered after splash (clear)
- ok: prefers-reduced-motion skips splash

### S2 Header and mobile menu: FAIL

**360x740** FAIL
- ok: pinch zoom allowed (width=device-width, initial-scale=1, viewport-fit=cover)
- ok: viewport-fit=cover set so env(safe-area-inset-*) works
- FAIL: burger 36x36
- ok: scroll-padding-top 72px vs header bottom 56px
- ok: tap on burger opens menu
- ok: background scroll locked while menu open (scrollY 400 to 400)
- ok: sheet fills viewport (360x740 vs 360x740)
- ok: no horizontal scroll inside menu (overflow 0/0)
- ok: sticky CTA footer within viewport (bottom 740 of 740)
- ok: .mnav-foot padding-bottom 8px
- ok: 6 top-level sections
- FAIL: top-level row height 46 (needs 48)
- ok: tap expands "Shop"
- FAIL: sub-link "Safari animalsGiraffe, lion, e" row height 44px (needs 48)
- FAIL: sub-link "Domestic animalsRabbit, cat, d" row height 44px (needs 48)
- FAIL: sub-link "More animalsOctopus, turtle, g" row height 44px (needs 48)
- FAIL: sub-link "Wall artCrocheted heads to han" row height 44px (needs 48)
- FAIL: sub-link "DollsHand finished dresses" row height 44px (needs 48)
- FAIL: sub-link "Find the right sizeS, M, L or " row height 44px (needs 48)
- FAIL: sub-link "Size guideS, M, L and XL side " row height 44px (needs 48)
- ok: tap expands "Gifts"
- FAIL: sub-link "Gift finderFive questions, thr" row height 44px (needs 48)
- FAIL: sub-link "Build a safari familyMake a se" row height 44px (needs 48)
- FAIL: sub-link "Make it yoursDesign your own a" row height 44px (needs 48)
- FAIL: sub-link "Gift an animalPick an animal a" row height 44px (needs 48)
- FAIL: sub-link "Corporate and group giftsOrder" row height 44px (needs 48)
- FAIL: sub-link "Gift note and deliveryHow the " row height 44px (needs 48)
- ok: tap expands "Wholesale"
- FAIL: sub-link "Price listSent on WhatsApp" row height 44px (needs 48)
- FAIL: sub-link "QuoteFor your quantities" row height 44px (needs 48)
- FAIL: sub-link "Sample packAsk on WhatsApp" row height 44px (needs 48)
- FAIL: sub-link "Become a stockistSell our anim" row height 44px (needs 48)
- FAIL: sub-link "Supply with usTell us what you" row height 44px (needs 48)
- ok: tap expands "Our story"
- FAIL: sub-link "Our impactThe women we support" row height 44px (needs 48)
- FAIL: sub-link "Meet the makersAt work in Nair" row height 44px (needs 48)
- FAIL: sub-link "ProjectsPhoto stories" row height 44px (needs 48)
- FAIL: sub-link "GalleryMarkets and shelves" row height 44px (needs 48)
- FAIL: sub-link "StockistsWhere to buy in Nairo" row height 44px (needs 48)
- ok: tap expands "Journal"
- FAIL: sub-link "What Mikono meansOur name, 2 m" row height 44px (needs 48)
- FAIL: sub-link "What is recycled acrylic yarn?" row height 44px (needs 48)
- FAIL: sub-link "How to choose a size, S to XLS" row height 44px (needs 48)
- FAIL: sub-link "Care guideKeeping it clean" row height 44px (needs 48)
- FAIL: sub-link "Size guideChoosing S to XL" row height 44px (needs 48)
- FAIL: sub-link "Materials and safetyHow it is " row height 44px (needs 48)
- ok: tap expands "Help"
- FAIL: sub-link "FAQCommon questions" row height 44px (needs 48)
- FAIL: sub-link "DeliveryHow delivery works" row height 44px (needs 48)
- FAIL: sub-link "ContactSend us a message" row height 44px (needs 48)
- FAIL: sub-link "WhatsApp usThe quickest way" row height 44px (needs 48)
- FAIL: sub-link "Call +254 724 592 115Speak to " row height 44px (needs 48)
- ok: 37 unique sub-links found
- ok: link statuses: https://wa.me/254724592115=external
- ok: keyboard focus trapped inside menu over 60 Tab presses
- ok: Escape closes menu
- ok: focus returns to burger after close (active: nav-burger iconbtn)
- ok: scroll position and overflow restored after close ({"y":400,"ov":"visible"})
- FAIL: close button 36x36
- ok: tap on close button closes menu
- ok: landscape while open: {"open":true,"closeVisible":true,"hs":0,"scrollable":true,"dh":360,"ih":360}
- ok: landscape: CTA footer inside viewport (bottom 360 of 360)
- ok: browser Back with menu open: url changed to about:blank, menu open=false (info)
- ok: menu closes and scroll unlocked after tapping /shop ({"open":false,"y":0,"ov":"visible"}, url /shop)
- ok: no in-page anchor links on /faq to test

**390x844** FAIL
- ok: pinch zoom allowed (width=device-width, initial-scale=1, viewport-fit=cover)
- ok: viewport-fit=cover set so env(safe-area-inset-*) works
- FAIL: burger 36x36
- ok: scroll-padding-top 72px vs header bottom 56px
- ok: tap on burger opens menu
- ok: background scroll locked while menu open (scrollY 400 to 400)
- ok: sheet fills viewport (390x844 vs 390x844)
- ok: no horizontal scroll inside menu (overflow 0/0)
- ok: sticky CTA footer within viewport (bottom 844 of 844)
- ok: .mnav-foot padding-bottom 8px
- ok: 6 top-level sections
- FAIL: top-level row height 46 (needs 48)
- ok: tap expands "Shop"
- FAIL: sub-link "Safari animalsGiraffe, lion, e" row height 44px (needs 48)
- FAIL: sub-link "Domestic animalsRabbit, cat, d" row height 44px (needs 48)
- FAIL: sub-link "More animalsOctopus, turtle, g" row height 44px (needs 48)
- FAIL: sub-link "Wall artCrocheted heads to han" row height 44px (needs 48)
- FAIL: sub-link "DollsHand finished dresses" row height 44px (needs 48)
- FAIL: sub-link "Find the right sizeS, M, L or " row height 44px (needs 48)
- FAIL: sub-link "Size guideS, M, L and XL side " row height 44px (needs 48)
- ok: tap expands "Gifts"
- FAIL: sub-link "Gift finderFive questions, thr" row height 44px (needs 48)
- FAIL: sub-link "Build a safari familyMake a se" row height 44px (needs 48)
- FAIL: sub-link "Make it yoursDesign your own a" row height 44px (needs 48)
- FAIL: sub-link "Gift an animalPick an animal a" row height 44px (needs 48)
- FAIL: sub-link "Corporate and group giftsOrder" row height 44px (needs 48)
- FAIL: sub-link "Gift note and deliveryHow the " row height 44px (needs 48)
- ok: tap expands "Wholesale"
- FAIL: sub-link "Price listSent on WhatsApp" row height 44px (needs 48)
- FAIL: sub-link "QuoteFor your quantities" row height 44px (needs 48)
- FAIL: sub-link "Sample packAsk on WhatsApp" row height 44px (needs 48)
- FAIL: sub-link "Become a stockistSell our anim" row height 44px (needs 48)
- FAIL: sub-link "Supply with usTell us what you" row height 44px (needs 48)
- ok: tap expands "Our story"
- FAIL: sub-link "Our impactThe women we support" row height 44px (needs 48)
- FAIL: sub-link "Meet the makersAt work in Nair" row height 44px (needs 48)
- FAIL: sub-link "ProjectsPhoto stories" row height 44px (needs 48)
- FAIL: sub-link "GalleryMarkets and shelves" row height 44px (needs 48)
- FAIL: sub-link "StockistsWhere to buy in Nairo" row height 44px (needs 48)
- ok: tap expands "Journal"
- FAIL: sub-link "What Mikono meansOur name, 2 m" row height 44px (needs 48)
- FAIL: sub-link "What is recycled acrylic yarn?" row height 44px (needs 48)
- FAIL: sub-link "How to choose a size, S to XLS" row height 44px (needs 48)
- FAIL: sub-link "Care guideKeeping it clean" row height 44px (needs 48)
- FAIL: sub-link "Size guideChoosing S to XL" row height 44px (needs 48)
- FAIL: sub-link "Materials and safetyHow it is " row height 44px (needs 48)
- ok: tap expands "Help"
- FAIL: sub-link "FAQCommon questions" row height 44px (needs 48)
- FAIL: sub-link "DeliveryHow delivery works" row height 44px (needs 48)
- FAIL: sub-link "ContactSend us a message" row height 44px (needs 48)
- FAIL: sub-link "WhatsApp usThe quickest way" row height 44px (needs 48)
- FAIL: sub-link "Call +254 724 592 115Speak to " row height 44px (needs 48)
- ok: 37 unique sub-links found
- ok: keyboard focus trapped inside menu over 60 Tab presses
- ok: Escape closes menu
- ok: focus returns to burger after close (active: nav-burger iconbtn)
- ok: scroll position and overflow restored after close ({"y":400,"ov":"visible"})
- FAIL: close button 36x36
- ok: tap on close button closes menu
- ok: landscape while open: {"open":true,"closeVisible":true,"hs":0,"scrollable":false,"dh":390,"ih":390}
- ok: landscape: CTA footer inside viewport (bottom 390 of 390)
- ok: browser Back with menu open: url changed to about:blank, menu open=false (info)
- ok: menu closes and scroll unlocked after tapping /shop ({"open":false,"y":0,"ov":"visible"}, url /shop)
- ok: no in-page anchor links on /faq to test

**375x667** FAIL
- ok: pinch zoom allowed (width=device-width, initial-scale=1, viewport-fit=cover)
- ok: viewport-fit=cover set so env(safe-area-inset-*) works
- FAIL: burger 36x36
- ok: scroll-padding-top 72px vs header bottom 56px
- ok: tap on burger opens menu
- ok: background scroll locked while menu open (scrollY 400 to 400)
- ok: sheet fills viewport (375x667 vs 375x667)
- ok: no horizontal scroll inside menu (overflow 0/0)
- ok: sticky CTA footer within viewport (bottom 667 of 667)
- ok: .mnav-foot padding-bottom 8px
- ok: 6 top-level sections
- FAIL: top-level row height 46 (needs 48)
- ok: tap expands "Shop"
- FAIL: sub-link "Safari animalsGiraffe, lion, e" row height 44px (needs 48)
- FAIL: sub-link "Domestic animalsRabbit, cat, d" row height 44px (needs 48)
- FAIL: sub-link "More animalsOctopus, turtle, g" row height 44px (needs 48)
- FAIL: sub-link "Wall artCrocheted heads to han" row height 44px (needs 48)
- FAIL: sub-link "DollsHand finished dresses" row height 44px (needs 48)
- FAIL: sub-link "Find the right sizeS, M, L or " row height 44px (needs 48)
- FAIL: sub-link "Size guideS, M, L and XL side " row height 44px (needs 48)
- ok: tap expands "Gifts"
- FAIL: sub-link "Gift finderFive questions, thr" row height 44px (needs 48)
- FAIL: sub-link "Build a safari familyMake a se" row height 44px (needs 48)
- FAIL: sub-link "Make it yoursDesign your own a" row height 44px (needs 48)
- FAIL: sub-link "Gift an animalPick an animal a" row height 44px (needs 48)
- FAIL: sub-link "Corporate and group giftsOrder" row height 44px (needs 48)
- FAIL: sub-link "Gift note and deliveryHow the " row height 44px (needs 48)
- ok: tap expands "Wholesale"
- FAIL: sub-link "Price listSent on WhatsApp" row height 44px (needs 48)
- FAIL: sub-link "QuoteFor your quantities" row height 44px (needs 48)
- FAIL: sub-link "Sample packAsk on WhatsApp" row height 44px (needs 48)
- FAIL: sub-link "Become a stockistSell our anim" row height 44px (needs 48)
- FAIL: sub-link "Supply with usTell us what you" row height 44px (needs 48)
- ok: tap expands "Our story"
- FAIL: sub-link "Our impactThe women we support" row height 44px (needs 48)
- FAIL: sub-link "Meet the makersAt work in Nair" row height 44px (needs 48)
- FAIL: sub-link "ProjectsPhoto stories" row height 44px (needs 48)
- FAIL: sub-link "GalleryMarkets and shelves" row height 44px (needs 48)
- FAIL: sub-link "StockistsWhere to buy in Nairo" row height 44px (needs 48)
- ok: tap expands "Journal"
- FAIL: sub-link "What Mikono meansOur name, 2 m" row height 44px (needs 48)
- FAIL: sub-link "What is recycled acrylic yarn?" row height 44px (needs 48)
- FAIL: sub-link "How to choose a size, S to XLS" row height 44px (needs 48)
- FAIL: sub-link "Care guideKeeping it clean" row height 44px (needs 48)
- FAIL: sub-link "Size guideChoosing S to XL" row height 44px (needs 48)
- FAIL: sub-link "Materials and safetyHow it is " row height 44px (needs 48)
- ok: tap expands "Help"
- FAIL: sub-link "FAQCommon questions" row height 44px (needs 48)
- FAIL: sub-link "DeliveryHow delivery works" row height 44px (needs 48)
- FAIL: sub-link "ContactSend us a message" row height 44px (needs 48)
- FAIL: sub-link "WhatsApp usThe quickest way" row height 44px (needs 48)
- FAIL: sub-link "Call +254 724 592 115Speak to " row height 44px (needs 48)
- ok: 37 unique sub-links found
- ok: keyboard focus trapped inside menu over 60 Tab presses
- ok: Escape closes menu
- ok: focus returns to burger after close (active: nav-burger iconbtn)
- ok: scroll position and overflow restored after close ({"y":400,"ov":"visible"})
- FAIL: close button 36x36
- ok: tap on close button closes menu
- ok: landscape while open: {"open":true,"closeVisible":true,"hs":0,"scrollable":true,"dh":375,"ih":375}
- ok: landscape: CTA footer inside viewport (bottom 375 of 375)
- ok: browser Back with menu open: url changed to about:blank, menu open=false (info)
- ok: menu closes and scroll unlocked after tapping /shop ({"open":false,"y":0,"ov":"visible"}, url /shop)
- ok: no in-page anchor links on /faq to test

**320x568** FAIL
- ok: pinch zoom allowed (width=device-width, initial-scale=1, viewport-fit=cover)
- ok: viewport-fit=cover set so env(safe-area-inset-*) works
- FAIL: burger 36x36
- ok: scroll-padding-top 72px vs header bottom 56px
- ok: tap on burger opens menu
- ok: background scroll locked while menu open (scrollY 400 to 400)
- ok: sheet fills viewport (320x568 vs 320x568)
- ok: no horizontal scroll inside menu (overflow 0/0)
- ok: sticky CTA footer within viewport (bottom 568 of 568)
- ok: .mnav-foot padding-bottom 8px
- ok: 6 top-level sections
- FAIL: top-level row height 46 (needs 48)
- ok: tap expands "Shop"
- FAIL: sub-link "Safari animalsGiraffe, lion, e" row height 44px (needs 48)
- FAIL: sub-link "Domestic animalsRabbit, cat, d" row height 44px (needs 48)
- FAIL: sub-link "More animalsOctopus, turtle, g" row height 44px (needs 48)
- FAIL: sub-link "Wall artCrocheted heads to han" row height 44px (needs 48)
- FAIL: sub-link "DollsHand finished dresses" row height 44px (needs 48)
- FAIL: sub-link "Find the right sizeS, M, L or " row height 44px (needs 48)
- FAIL: sub-link "Size guideS, M, L and XL side " row height 44px (needs 48)
- ok: tap expands "Gifts"
- FAIL: sub-link "Gift finderFive questions, thr" row height 44px (needs 48)
- FAIL: sub-link "Build a safari familyMake a se" row height 44px (needs 48)
- FAIL: sub-link "Make it yoursDesign your own a" row height 44px (needs 48)
- FAIL: sub-link "Gift an animalPick an animal a" row height 44px (needs 48)
- FAIL: sub-link "Corporate and group giftsOrder" row height 44px (needs 48)
- FAIL: sub-link "Gift note and deliveryHow the " row height 44px (needs 48)
- ok: tap expands "Wholesale"
- FAIL: sub-link "Price listSent on WhatsApp" row height 44px (needs 48)
- FAIL: sub-link "QuoteFor your quantities" row height 44px (needs 48)
- FAIL: sub-link "Sample packAsk on WhatsApp" row height 44px (needs 48)
- FAIL: sub-link "Become a stockistSell our anim" row height 44px (needs 48)
- FAIL: sub-link "Supply with usTell us what you" row height 44px (needs 48)
- ok: tap expands "Our story"
- FAIL: sub-link "Our impactThe women we support" row height 44px (needs 48)
- FAIL: sub-link "Meet the makersAt work in Nair" row height 44px (needs 48)
- FAIL: sub-link "ProjectsPhoto stories" row height 44px (needs 48)
- FAIL: sub-link "GalleryMarkets and shelves" row height 44px (needs 48)
- FAIL: sub-link "StockistsWhere to buy in Nairo" row height 44px (needs 48)
- ok: tap expands "Journal"
- FAIL: sub-link "What Mikono meansOur name, 2 m" row height 44px (needs 48)
- FAIL: sub-link "What is recycled acrylic yarn?" row height 44px (needs 48)
- FAIL: sub-link "How to choose a size, S to XLS" row height 44px (needs 48)
- FAIL: sub-link "Care guideKeeping it clean" row height 44px (needs 48)
- FAIL: sub-link "Size guideChoosing S to XL" row height 44px (needs 48)
- FAIL: sub-link "Materials and safetyHow it is " row height 44px (needs 48)
- ok: tap expands "Help"
- FAIL: sub-link "FAQCommon questions" row height 44px (needs 48)
- FAIL: sub-link "DeliveryHow delivery works" row height 44px (needs 48)
- FAIL: sub-link "ContactSend us a message" row height 44px (needs 48)
- FAIL: sub-link "WhatsApp usThe quickest way" row height 44px (needs 48)
- FAIL: sub-link "Call +254 724 592 115Speak to " row height 44px (needs 48)
- ok: 37 unique sub-links found
- ok: keyboard focus trapped inside menu over 60 Tab presses
- ok: Escape closes menu
- ok: focus returns to burger after close (active: nav-burger iconbtn)
- ok: scroll position and overflow restored after close ({"y":400,"ov":"visible"})
- FAIL: close button 36x36
- ok: tap on close button closes menu
- ok: landscape while open: {"open":true,"closeVisible":true,"hs":0,"scrollable":true,"dh":320,"ih":320}
- ok: landscape: CTA footer inside viewport (bottom 320 of 320)
- ok: browser Back with menu open: url changed to about:blank, menu open=false (info)
- ok: menu closes and scroll unlocked after tapping /shop ({"open":false,"y":0,"ov":"visible"}, url /shop)
- ok: no in-page anchor links on /faq to test

**768x1024** FAIL
- ok: pinch zoom allowed (width=device-width, initial-scale=1, viewport-fit=cover)
- ok: viewport-fit=cover set so env(safe-area-inset-*) works
- FAIL: burger 36x36
- ok: scroll-padding-top 72px vs header bottom 56px
- ok: tap on burger opens menu
- ok: background scroll locked while menu open (scrollY 400 to 400)
- ok: sheet fills viewport (768x1024 vs 768x1024)
- ok: no horizontal scroll inside menu (overflow 0/0)
- ok: sticky CTA footer within viewport (bottom 1024 of 1024)
- ok: .mnav-foot padding-bottom 8px
- ok: 6 top-level sections
- FAIL: top-level row height 46 (needs 48)
- ok: tap expands "Shop"
- FAIL: sub-link "Safari animalsGiraffe, lion, e" row height 44px (needs 48)
- FAIL: sub-link "Domestic animalsRabbit, cat, d" row height 44px (needs 48)
- FAIL: sub-link "More animalsOctopus, turtle, g" row height 44px (needs 48)
- FAIL: sub-link "Wall artCrocheted heads to han" row height 44px (needs 48)
- FAIL: sub-link "DollsHand finished dresses" row height 44px (needs 48)
- FAIL: sub-link "Find the right sizeS, M, L or " row height 44px (needs 48)
- FAIL: sub-link "Size guideS, M, L and XL side " row height 44px (needs 48)
- ok: tap expands "Gifts"
- FAIL: sub-link "Gift finderFive questions, thr" row height 44px (needs 48)
- FAIL: sub-link "Build a safari familyMake a se" row height 44px (needs 48)
- FAIL: sub-link "Make it yoursDesign your own a" row height 44px (needs 48)
- FAIL: sub-link "Gift an animalPick an animal a" row height 44px (needs 48)
- FAIL: sub-link "Corporate and group giftsOrder" row height 44px (needs 48)
- FAIL: sub-link "Gift note and deliveryHow the " row height 44px (needs 48)
- ok: tap expands "Wholesale"
- FAIL: sub-link "Price listSent on WhatsApp" row height 44px (needs 48)
- FAIL: sub-link "QuoteFor your quantities" row height 44px (needs 48)
- FAIL: sub-link "Sample packAsk on WhatsApp" row height 44px (needs 48)
- FAIL: sub-link "Become a stockistSell our anim" row height 44px (needs 48)
- FAIL: sub-link "Supply with usTell us what you" row height 44px (needs 48)
- ok: tap expands "Our story"
- FAIL: sub-link "Our impactThe women we support" row height 44px (needs 48)
- FAIL: sub-link "Meet the makersAt work in Nair" row height 44px (needs 48)
- FAIL: sub-link "ProjectsPhoto stories" row height 44px (needs 48)
- FAIL: sub-link "GalleryMarkets and shelves" row height 44px (needs 48)
- FAIL: sub-link "StockistsWhere to buy in Nairo" row height 44px (needs 48)
- ok: tap expands "Journal"
- FAIL: sub-link "What Mikono meansOur name, 2 m" row height 44px (needs 48)
- FAIL: sub-link "What is recycled acrylic yarn?" row height 44px (needs 48)
- FAIL: sub-link "How to choose a size, S to XLS" row height 44px (needs 48)
- FAIL: sub-link "Care guideKeeping it clean" row height 44px (needs 48)
- FAIL: sub-link "Size guideChoosing S to XL" row height 44px (needs 48)
- FAIL: sub-link "Materials and safetyHow it is " row height 44px (needs 48)
- ok: tap expands "Help"
- FAIL: sub-link "FAQCommon questions" row height 44px (needs 48)
- FAIL: sub-link "DeliveryHow delivery works" row height 44px (needs 48)
- FAIL: sub-link "ContactSend us a message" row height 44px (needs 48)
- FAIL: sub-link "WhatsApp usThe quickest way" row height 44px (needs 48)
- FAIL: sub-link "Call +254 724 592 115Speak to " row height 44px (needs 48)
- ok: 37 unique sub-links found
- ok: keyboard focus trapped inside menu over 60 Tab presses
- ok: Escape closes menu
- ok: focus returns to burger after close (active: nav-burger iconbtn)
- ok: scroll position and overflow restored after close ({"y":400,"ov":"visible"})
- FAIL: close button 36x36
- ok: tap on close button closes menu
- FAIL: landscape while open: {"open":false,"closeVisible":true,"hs":0,"scrollable":false,"dh":0,"ih":768}
- ok: browser Back with menu open: url changed to about:blank, menu open=false (info)
- ok: menu closes and scroll unlocked after tapping /shop ({"open":false,"y":0,"ov":"visible"}, url /shop)
- ok: no in-page anchor links on /faq to test

**412x915** FAIL
- ok: pinch zoom allowed (width=device-width, initial-scale=1, viewport-fit=cover)
- ok: viewport-fit=cover set so env(safe-area-inset-*) works
- FAIL: burger 36x36
- ok: scroll-padding-top 72px vs header bottom 56px
- ok: tap on burger opens menu
- ok: background scroll locked while menu open (scrollY 400 to 400)
- ok: sheet fills viewport (412x915 vs 412x915)
- ok: no horizontal scroll inside menu (overflow 0/0)
- ok: sticky CTA footer within viewport (bottom 915 of 915)
- ok: .mnav-foot padding-bottom 8px
- ok: 6 top-level sections
- FAIL: top-level row height 46 (needs 48)
- ok: tap expands "Shop"
- FAIL: sub-link "Safari animalsGiraffe, lion, e" row height 44px (needs 48)
- FAIL: sub-link "Domestic animalsRabbit, cat, d" row height 44px (needs 48)
- FAIL: sub-link "More animalsOctopus, turtle, g" row height 44px (needs 48)
- FAIL: sub-link "Wall artCrocheted heads to han" row height 44px (needs 48)
- FAIL: sub-link "DollsHand finished dresses" row height 44px (needs 48)
- FAIL: sub-link "Find the right sizeS, M, L or " row height 44px (needs 48)
- FAIL: sub-link "Size guideS, M, L and XL side " row height 44px (needs 48)
- ok: tap expands "Gifts"
- FAIL: sub-link "Gift finderFive questions, thr" row height 44px (needs 48)
- FAIL: sub-link "Build a safari familyMake a se" row height 44px (needs 48)
- FAIL: sub-link "Make it yoursDesign your own a" row height 44px (needs 48)
- FAIL: sub-link "Gift an animalPick an animal a" row height 44px (needs 48)
- FAIL: sub-link "Corporate and group giftsOrder" row height 44px (needs 48)
- FAIL: sub-link "Gift note and deliveryHow the " row height 44px (needs 48)
- ok: tap expands "Wholesale"
- FAIL: sub-link "Price listSent on WhatsApp" row height 44px (needs 48)
- FAIL: sub-link "QuoteFor your quantities" row height 44px (needs 48)
- FAIL: sub-link "Sample packAsk on WhatsApp" row height 44px (needs 48)
- FAIL: sub-link "Become a stockistSell our anim" row height 44px (needs 48)
- FAIL: sub-link "Supply with usTell us what you" row height 44px (needs 48)
- ok: tap expands "Our story"
- FAIL: sub-link "Our impactThe women we support" row height 44px (needs 48)
- FAIL: sub-link "Meet the makersAt work in Nair" row height 44px (needs 48)
- FAIL: sub-link "ProjectsPhoto stories" row height 44px (needs 48)
- FAIL: sub-link "GalleryMarkets and shelves" row height 44px (needs 48)
- FAIL: sub-link "StockistsWhere to buy in Nairo" row height 44px (needs 48)
- ok: tap expands "Journal"
- FAIL: sub-link "What Mikono meansOur name, 2 m" row height 44px (needs 48)
- FAIL: sub-link "What is recycled acrylic yarn?" row height 44px (needs 48)
- FAIL: sub-link "How to choose a size, S to XLS" row height 44px (needs 48)
- FAIL: sub-link "Care guideKeeping it clean" row height 44px (needs 48)
- FAIL: sub-link "Size guideChoosing S to XL" row height 44px (needs 48)
- FAIL: sub-link "Materials and safetyHow it is " row height 44px (needs 48)
- ok: tap expands "Help"
- FAIL: sub-link "FAQCommon questions" row height 44px (needs 48)
- FAIL: sub-link "DeliveryHow delivery works" row height 44px (needs 48)
- FAIL: sub-link "ContactSend us a message" row height 44px (needs 48)
- FAIL: sub-link "WhatsApp usThe quickest way" row height 44px (needs 48)
- FAIL: sub-link "Call +254 724 592 115Speak to " row height 44px (needs 48)
- ok: 37 unique sub-links found
- ok: keyboard focus trapped inside menu over 60 Tab presses
- ok: Escape closes menu
- ok: focus returns to burger after close (active: nav-burger iconbtn)
- ok: scroll position and overflow restored after close ({"y":400,"ov":"visible"})
- FAIL: close button 36x36
- ok: tap on close button closes menu
- ok: landscape while open: {"open":true,"closeVisible":true,"hs":0,"scrollable":false,"dh":412,"ih":412}
- ok: landscape: CTA footer inside viewport (bottom 412 of 412)
- ok: browser Back with menu open: url changed to about:blank, menu open=false (info)
- ok: menu closes and scroll unlocked after tapping /shop ({"open":false,"y":0,"ov":"visible"}, url /shop)
- ok: no in-page anchor links on /faq to test

### S3 Overlays (cart, filter, consent, toast, WhatsApp, sticky bar): FAIL

**390x844** FAIL
- ok: consent bar height 96px (11% of viewport)
- FAIL: consent buttons [[182,36],[182,36]]
- ok: consent choice dismisses bar
- ok: no sticky add bar at scroll 900
- FAIL: cart button 36x36
- ok: drawer fits viewport (top 68 bottom 844 of 844)
- ok: close button not covered (clear)
- ok: body scroll locked while cart drawer open (0 to 0)
- ok: bottom of viewport belongs to drawer (not covered by float/consent)
- ok: Escape closes cart drawer
- ok: body scroll restored after drawer closes
- ok: tap on close button closes drawer
- ok: filter button opens drawer
- ok: fits viewport (h 717 of 844)
- ok: filter drawer has no text input (keyboard emulation N/A); checking short viewport
- ok: close button visible at 55% viewport height
- ok: Escape closes filter drawer
- ok: tap on close closes filter drawer
- ok: scroll restored after filter drawer

**360x740** FAIL
- ok: consent bar height 96px (13% of viewport)
- FAIL: consent buttons [[167,36],[167,36]]
- ok: consent choice dismisses bar
- ok: no sticky add bar at scroll 900
- FAIL: cart button 36x36
- ok: drawer fits viewport (top 59 bottom 740 of 740)
- ok: close button not covered (clear)
- ok: body scroll locked while cart drawer open (0 to 0)
- ok: bottom of viewport belongs to drawer (not covered by float/consent)
- ok: Escape closes cart drawer
- ok: body scroll restored after drawer closes
- ok: tap on close button closes drawer
- ok: filter button opens drawer
- ok: fits viewport (h 629 of 740)
- ok: filter drawer has no text input (keyboard emulation N/A); checking short viewport
- ok: close button visible at 55% viewport height
- ok: Escape closes filter drawer
- ok: tap on close closes filter drawer
- ok: scroll restored after filter drawer

**375x667** FAIL
- ok: consent bar height 96px (14% of viewport)
- FAIL: consent buttons [[175,36],[175,36]]
- ok: consent choice dismisses bar
- ok: no sticky add bar at scroll 900
- FAIL: cart button 36x36
- ok: drawer fits viewport (top 53 bottom 667 of 667)
- ok: close button not covered (clear)
- ok: body scroll locked while cart drawer open (0 to 0)
- ok: bottom of viewport belongs to drawer (not covered by float/consent)
- ok: Escape closes cart drawer
- ok: body scroll restored after drawer closes
- ok: tap on close button closes drawer
- ok: filter button opens drawer
- ok: fits viewport (h 567 of 667)
- ok: filter drawer has no text input (keyboard emulation N/A); checking short viewport
- ok: close button visible at 55% viewport height
- ok: Escape closes filter drawer
- ok: tap on close closes filter drawer
- ok: scroll restored after filter drawer

**320x568** FAIL
- ok: consent bar height 96px (17% of viewport)
- FAIL: consent buttons [[147,36],[147,36]]
- ok: consent choice dismisses bar
- ok: no sticky add bar at scroll 900
- FAIL: cart button 36x36
- ok: drawer fits viewport (top 45 bottom 568 of 568)
- ok: close button not covered (clear)
- ok: body scroll locked while cart drawer open (0 to 0)
- ok: bottom of viewport belongs to drawer (not covered by float/consent)
- ok: Escape closes cart drawer
- ok: body scroll restored after drawer closes
- ok: tap on close button closes drawer
- ok: filter button opens drawer
- ok: fits viewport (h 483 of 568)
- ok: filter drawer has no text input (keyboard emulation N/A); checking short viewport
- ok: close button visible at 55% viewport height
- ok: Escape closes filter drawer
- ok: tap on close closes filter drawer
- ok: scroll restored after filter drawer

**768x1024** FAIL
- ok: consent bar height 64px (6% of viewport)
- FAIL: consent buttons [[99,36],[94,36]]
- ok: consent choice dismisses bar
- ok: no sticky add bar at scroll 900
- FAIL: cart button 36x36
- ok: drawer fits viewport (top 0 bottom 1024 of 1024)
- ok: close button not covered (clear)
- ok: body scroll locked while cart drawer open (0 to 0)
- ok: bottom of viewport belongs to drawer (not covered by float/consent)
- ok: Escape closes cart drawer
- ok: body scroll restored after drawer closes
- ok: tap on close button closes drawer
- ok: filter button opens drawer
- ok: fits viewport (h 870 of 1024)
- ok: filter drawer has no text input (keyboard emulation N/A); checking short viewport
- ok: close button visible at 55% viewport height
- ok: Escape closes filter drawer
- ok: tap on close closes filter drawer
- ok: scroll restored after filter drawer

**412x915** FAIL
- ok: consent bar height 96px (10% of viewport)
- FAIL: consent buttons [[193,36],[193,36]]
- ok: consent choice dismisses bar
- ok: no sticky add bar at scroll 900
- FAIL: cart button 36x36
- ok: drawer fits viewport (top 73 bottom 915 of 915)
- ok: close button not covered (clear)
- ok: body scroll locked while cart drawer open (0 to 0)
- ok: bottom of viewport belongs to drawer (not covered by float/consent)
- ok: Escape closes cart drawer
- ok: body scroll restored after drawer closes
- ok: tap on close button closes drawer
- ok: filter button opens drawer
- ok: fits viewport (h 778 of 915)
- ok: filter drawer has no text input (keyboard emulation N/A); checking short viewport
- ok: close button visible at 55% viewport height
- ok: Escape closes filter drawer
- ok: tap on close closes filter drawer
- ok: scroll restored after filter drawer

### S4 Forms with on-screen keyboard: FAIL

**390x844** FAIL
- FAIL: font-size 14px triggers iOS zoom on focus 
- FAIL: control height 36px (needs 44) 
- ok: /contact: 3 controls audited
- ok: focused field visible at 55% height
- ok: submit button reachable
- ok: submit height 44px
- ok: empty submit shows validation (2 messages, ["Please check one thingPlease write your message.",""])
- ok: a validation message is in view or first invalid is focused
- ok: /wholesale: 12 controls audited
- ok: empty submit shows validation (5 messages, ["Please check 4 thingsPlease choose what you would ","What would you like?Price listWe send the wholesal"])
- FAIL: "Business or group name (option" autocomplete="organization" missing or wrong
- ok: /custom: 14 controls audited
- ok: empty submit shows validation (5 messages, ["Please check 4 thingsPlease choose the answer that","What would you like to change?ColourA different an"])
- ok: /partners: 11 controls audited
- ok: empty submit shows validation (6 messages, ["Please check 5 thingsPlease choose the answer that","What kind of partner are you?SchoolNGO or charityB"])
- ok: /supply: 10 controls audited
- ok: empty submit shows validation (6 messages, ["Please check 5 thingsPlease choose the answer that","What can you supply?YarnPackagingTransportSomethin"])

**360x740** FAIL
- FAIL: font-size 14px triggers iOS zoom on focus 
- FAIL: control height 36px (needs 44) 
- ok: /contact: 3 controls audited
- ok: focused field visible at 55% height
- ok: submit button reachable
- ok: submit height 44px
- ok: empty submit shows validation (2 messages, ["Please check one thingPlease write your message.",""])
- ok: a validation message is in view or first invalid is focused
- ok: /wholesale: 12 controls audited
- ok: empty submit shows validation (5 messages, ["Please check 4 thingsPlease choose what you would ","What would you like?Price listWe send the wholesal"])
- FAIL: "Business or group name (option" autocomplete="organization" missing or wrong
- ok: /custom: 14 controls audited
- ok: empty submit shows validation (5 messages, ["Please check 4 thingsPlease choose the answer that","What would you like to change?ColourA different an"])
- ok: /partners: 11 controls audited
- ok: empty submit shows validation (6 messages, ["Please check 5 thingsPlease choose the answer that","What kind of partner are you?SchoolNGO or charityB"])
- ok: /supply: 10 controls audited
- ok: empty submit shows validation (6 messages, ["Please check 5 thingsPlease choose the answer that","What can you supply?YarnPackagingTransportSomethin"])

**375x667** FAIL
- FAIL: font-size 14px triggers iOS zoom on focus 
- FAIL: control height 36px (needs 44) 
- ok: /contact: 3 controls audited
- ok: focused field visible at 55% height
- ok: submit button reachable
- ok: submit height 44px
- ok: empty submit shows validation (2 messages, ["Please check one thingPlease write your message.",""])
- ok: a validation message is in view or first invalid is focused
- ok: /wholesale: 12 controls audited
- ok: empty submit shows validation (5 messages, ["Please check 4 thingsPlease choose what you would ","What would you like?Price listWe send the wholesal"])
- FAIL: "Business or group name (option" autocomplete="organization" missing or wrong
- ok: /custom: 14 controls audited
- ok: empty submit shows validation (5 messages, ["Please check 4 thingsPlease choose the answer that","What would you like to change?ColourA different an"])
- ok: /partners: 11 controls audited
- ok: empty submit shows validation (6 messages, ["Please check 5 thingsPlease choose the answer that","What kind of partner are you?SchoolNGO or charityB"])
- ok: /supply: 10 controls audited
- ok: empty submit shows validation (6 messages, ["Please check 5 thingsPlease choose the answer that","What can you supply?YarnPackagingTransportSomethin"])

**320x568** FAIL
- FAIL: font-size 14px triggers iOS zoom on focus 
- FAIL: control height 36px (needs 44) 
- ok: /contact: 3 controls audited
- ok: focused field visible at 55% height
- ok: submit button reachable
- ok: submit height 44px
- ok: empty submit shows validation (2 messages, ["Please check one thingPlease write your message.",""])
- ok: a validation message is in view or first invalid is focused
- ok: /wholesale: 12 controls audited
- ok: empty submit shows validation (5 messages, ["Please check 4 thingsPlease choose what you would ","What would you like?Price listWe send the wholesal"])
- FAIL: "Business or group name (option" autocomplete="organization" missing or wrong
- ok: /custom: 14 controls audited
- ok: empty submit shows validation (5 messages, ["Please check 4 thingsPlease choose the answer that","What would you like to change?ColourA different an"])
- ok: /partners: 11 controls audited
- ok: empty submit shows validation (6 messages, ["Please check 5 thingsPlease choose the answer that","What kind of partner are you?SchoolNGO or charityB"])
- ok: /supply: 10 controls audited
- ok: empty submit shows validation (6 messages, ["Please check 5 thingsPlease choose the answer that","What can you supply?YarnPackagingTransportSomethin"])

**768x1024** FAIL
- FAIL: font-size 13px triggers iOS zoom on focus 
- FAIL: control height 36px (needs 44) 
- ok: /contact: 3 controls audited
- ok: focused field visible at 55% height
- ok: submit button reachable
- ok: submit height 44px
- ok: empty submit shows validation (2 messages, ["Please check one thingPlease write your message.",""])
- ok: a validation message is in view or first invalid is focused
- ok: /wholesale: 12 controls audited
- ok: empty submit shows validation (5 messages, ["Please check 4 thingsPlease choose what you would ","What would you like?Price listWe send the wholesal"])
- FAIL: "Business or group name (option" autocomplete="organization" missing or wrong
- ok: /custom: 14 controls audited
- FAIL: focused field off-screen at 55% height
- ok: empty submit shows validation (5 messages, ["Please check 4 thingsPlease choose the answer that","What would you like to change?ColourA different an"])
- ok: /partners: 11 controls audited
- ok: empty submit shows validation (6 messages, ["Please check 5 thingsPlease choose the answer that","What kind of partner are you?SchoolNGO or charityB"])
- ok: /supply: 10 controls audited
- ok: empty submit shows validation (6 messages, ["Please check 5 thingsPlease choose the answer that","What can you supply?YarnPackagingTransportSomethin"])

**412x915** FAIL
- FAIL: font-size 14px triggers iOS zoom on focus 
- FAIL: control height 36px (needs 44) 
- ok: /contact: 3 controls audited
- ok: focused field visible at 55% height
- ok: submit button reachable
- ok: submit height 44px
- ok: empty submit shows validation (2 messages, ["Please check one thingPlease write your message.",""])
- ok: a validation message is in view or first invalid is focused
- ok: /wholesale: 12 controls audited
- ok: empty submit shows validation (5 messages, ["Please check 4 thingsPlease choose what you would ","What would you like?Price listWe send the wholesal"])
- FAIL: "Business or group name (option" autocomplete="organization" missing or wrong
- ok: /custom: 14 controls audited
- ok: empty submit shows validation (5 messages, ["Please check 4 thingsPlease choose the answer that","What would you like to change?ColourA different an"])
- ok: /partners: 11 controls audited
- ok: empty submit shows validation (6 messages, ["Please check 5 thingsPlease choose the answer that","What kind of partner are you?SchoolNGO or charityB"])
- ok: /supply: 10 controls audited
- ok: empty submit shows validation (6 messages, ["Please check 5 thingsPlease choose the answer that","What can you supply?YarnPackagingTransportSomethin"])

### S5 Gestures and scrollers: FAIL

**390x844** PASS
- ok: touch-action not none (auto|auto)
- ok: 0 horizontal scrollers exercised
- ok: no overflowing horizontal scrollers found at this width

**360x740** FAIL
- FAIL: swipe left moves scroller (0 to 0)
- FAIL: vertical swipe on rail scrolls page (444 to 444); touch-action manipulation
- ok: affordance: next card peeks=true, arrow buttons=false
- ok: keyboard reachable (tabindex=-1, focusable children=5)
- ok: snap x
- ok: touch-action not none (auto|auto)
- ok: 1 horizontal scrollers exercised

**375x667** FAIL
- FAIL: swipe left moves scroller (0 to 0)
- FAIL: vertical swipe on rail scrolls page (455 to 455); touch-action manipulation
- ok: affordance: next card peeks=true, arrow buttons=false
- ok: keyboard reachable (tabindex=-1, focusable children=5)
- ok: snap x
- ok: touch-action not none (auto|auto)
- ok: 1 horizontal scrollers exercised

**320x568** FAIL
- FAIL: swipe left moves scroller (0 to 0)
- FAIL: vertical swipe on rail scrolls page (424 to 424); touch-action manipulation
- ok: affordance: next card peeks=true, arrow buttons=false
- ok: keyboard reachable (tabindex=-1, focusable children=5)
- ok: snap x
- ok: touch-action not none (auto|auto)
- ok: 1 horizontal scrollers exercised

**768x1024** PASS
- ok: touch-action not none (auto|auto)
- ok: 0 horizontal scrollers exercised
- ok: no overflowing horizontal scrollers found at this width

**412x915** PASS
- ok: touch-action not none (auto|auto)
- ok: 0 horizontal scrollers exercised
- ok: no overflowing horizontal scrollers found at this width

### S6 Orientation and resize: PASS

**390x844** PASS
- ok: portrait no horizontal overflow (scrollWidth 390 vs 390)
- ok: landscape no horizontal overflow (scrollWidth 844 vs 844)
- ok: landscape: no fixed element over 50% of height ([])
- ok: rotate while cart open: close visible=true, overflow=0

**360x740** PASS
- ok: portrait no horizontal overflow (scrollWidth 360 vs 360)
- ok: landscape no horizontal overflow (scrollWidth 740 vs 740)
- ok: landscape: no fixed element over 50% of height ([])
- ok: rotate while cart open: close visible=true, overflow=0

**375x667** PASS
- ok: portrait no horizontal overflow (scrollWidth 375 vs 375)
- ok: landscape no horizontal overflow (scrollWidth 667 vs 667)
- ok: landscape: no fixed element over 50% of height ([])
- ok: rotate while cart open: close visible=true, overflow=0

**320x568** PASS
- ok: portrait no horizontal overflow (scrollWidth 320 vs 320)
- ok: landscape no horizontal overflow (scrollWidth 568 vs 568)
- ok: landscape: no fixed element over 50% of height ([])
- ok: rotate while cart open: close visible=true, overflow=0

**768x1024** PASS
- ok: portrait no horizontal overflow (scrollWidth 768 vs 768)
- ok: landscape no horizontal overflow (scrollWidth 1024 vs 1024)
- ok: landscape: no fixed element over 50% of height ([])
- ok: rotate while cart open: close visible=true, overflow=0

**412x915** PASS
- ok: portrait no horizontal overflow (scrollWidth 412 vs 412)
- ok: landscape no horizontal overflow (scrollWidth 915 vs 915)
- ok: landscape: no fixed element over 50% of height ([])
- ok: rotate while cart open: close visible=true, overflow=0

## Menu link statuses

- /shop: 200
- /shop/safari-animals: 200
- /shop/domestic-animals: 200
- /shop/more-animals: 200
- /shop/wall-art: 200
- /shop/dolls: 200
- /size-finder?src=nav: 200
- /size-guide: 200
- /gifts: 200
- /gifts/finder?src=nav: 200
- /build-a-family?src=nav: 200
- /custom/studio?src=nav: 200
- /custom/studio?type=corporate_gift&src=nav: 200
- /gifts#order: 200
- /wholesale: 200
- /wholesale?request=price-list#request: 200
- /wholesale?request=quote#request: 200
- /wholesale?request=sample-pack#request: 200
- /partners: 200
- /supply: 200
- /story: 200
- /impact: 200
- /makers: 200
- /projects: 200
- /gallery: 200
- /stockists: 200
- /journal: 200
- /journal/what-mikono-means: 200
- /journal/what-is-recycled-acrylic-yarn: 200
- /journal/how-to-choose-a-size: 200
- /care: 200
- /safety: 200
- /contact: 200
- /faq: 200
- /delivery: 200
- https://wa.me/254724592115: external
- /: 200
