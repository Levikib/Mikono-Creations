# Phase 4 Visual Verifier (1 of 3)

Verdict: FAIL (no blockers, 3 major defects). Screens and metrics: strategy/gates/screens/phase4-visual/ (59 PNG plus metrics.json, plus verify-*.png viewport proofs).
Method: puppeteer on bundled chromium, 17 pages (first 12 at 390/768/1280/1600, rest at 390/1280). Full-page captures show some below-fold images blank (lazy loading artifact of the capture). Re-checked with viewport screenshots: Captured moments and wall-art images do load (verify-moments-1280.png, verify-wallart-1280.png). Not counted as defects.

| Check | Page | Width | Result | Evidence | Severity |
|---|---|---|---|---|---|
| Horizontal overflow | all 17 | all | PASS | scrollWidth equals clientWidth everywhere, no overflowing elements | none |
| Card height and image ratio | /shop and 4 category pages | all | PASS | 30 product cards one height per width (420/489/529), image ratio 0.80 | none |
| Price and CTA baseline | /shop | 390 to 1600 | PASS visually | price and Choose size on one row in every card | none |
| Card height, home moments | / | all | minor | polaroid heights 290/292/294 at 390 (343/341/338 at 1280); rotation causes it, 3 to 5px spread | minor |
| Min font size | all | all | PASS | smallest computed 16px (cart count badge is the only one near it) | none |
| Touch targets | /shop, /wholesale | 1280, 390 | minor | filter and consent checkboxes 24x24 (row labels larger); home category links report 25px high but overlay covers the tile | minor |
| Chroma above 0.13 outside img | all | all | PASS | zero elements | none |
| Em or en dash in rendered text | all | all | PASS | regex false on every page | none |
| Photo letterboxing | /shop (Elephant card), PDP giraffe, wall-art cards | all | major | beige bars left and right of source photo (giraffe, elephant, wall heads); looks like a mat, not a crop | major |
| Image resolution | /shop/wall-art, PDP | 1280, 1600 | major | wall-head sources are 286x431 px; shown at about 250x315 CSS px, so soft at 2x and upscaled on PDP; elephant wall head shows leftover text watermark "Believe / Discover" | major |
| Hero on mobile | / | 390 | major | blob photo sits below CTAs and trust chips, mostly hidden under the cookie bar at first view; hero has no visual until scroll | major |
| Inspiration match | / | 1280 | minor | no category circle row (bento tiles instead, per R4), best sellers rail exists but is cut off at 4 cards with no arrows, trust strip, wavy dividers, blob photos and captured moments are present | minor |
| Cookie bar covering content | all | 390 | minor | takes about 170px, wraps "Reject non-essential" to 2 lines | minor |
| Weak hierarchy, home mid page | / | 1280 | minor | "Four size classes" and "How ordering works" are heavy, similar beige slabs; "Mikono means hands" block has big empty polaroid area before load | minor |
| Doc mismatch | /shop | 1280 | minor | filter sidebar lists 9 animals plus colours, long, sticky clipping under cookie bar | minor |

Design judgement: calm, earthy, clay-bento, readable, Kenya cues are light (kitenge pattern absent, no beadwork). Child-first feel is moderate: very cream and brown, little playful colour from the UI itself, so the photos carry all the joy. Mobile PDP is good. Wholesale and cart forms are clean.
