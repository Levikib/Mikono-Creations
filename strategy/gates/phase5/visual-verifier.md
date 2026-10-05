# Phase 5 Visual Verifier (1 of 3), round 2

Verdict: FAIL (0 blockers, 3 major, several minor). Screens and metrics.json: strategy/gates/screens/phase5-visual/ (puppeteer, bundled chromium, 37 pages at 320, 390, 768, 1280, 1600; gallery and shot-set subsets at 768 and 1600 for home, shop, categories, PDPs). Pages were scrolled before capture; home moments re-verified by viewport shot (verify-moments-1280.png), they load.

| Check | Page | Width | Result | Evidence | Severity |
|---|---|---|---|---|---|
| Horizontal overflow | all 37 | 320, 390, 1280, 1600 | PASS | scrollWidth equals clientWidth | none |
| Horizontal overflow | / | 768 | FAIL | scrollWidth 778 vs 768; category circle rail LI (w-104px, snap) pushes past the viewport | major |
| Card height spread | /shop, 5 categories | 320 to 1600 | PASS | all 24 or n cards one height (376/420/489/529), CTA bottom spread 0 | none |
| Image ratio | /shop, categories, journal 1.5, projects 1.33, gifts 1.33, polaroid 1 | all | PASS | one ratio per grid | none |
| Card height spread | /, /gallery, /makers polaroids | all | minor | 2 to 5px (rotation); 290-294 at 390, 338-343 at 1280 | minor |
| Card spread | /stockists | all | PASS height 316 | but 7 cards in a 3 col grid leave a lone orphan card in row 3 (stockists-1280.png); cards are text only and repeat the same sentence | minor |
| Min font | all | all | PASS | 16px everywhere | none |
| Chroma above 0.13 outside img | all | all | PASS | zero elements | none |
| Broken images | all | all | PASS | zero | none |
| Touch targets, checkboxes | /shop, /wholesale | 390, 1280 | PASS | label rows 44px+, previous 24px defect gone | none |
| Touch targets, inline text links | footer consent line, PDP "Size guide", /faq (14 links 20px), phone link on /delivery (28px), journal and project hero CTA on 390 (34px) | 390, 1280 | FAIL | 19 to 34px high | minor |
| Photo letterboxing | /shop, PDP giraffe, wall art | all | PASS | beige bars gone, object-cover crops (shop-1280-s0.png, shop_wall-art-1280-s0.png) | none |
| Wall head resolution | /shop/wall-art | 1280 | PASS | grid now shows lion 600x640, zebra 640x426, unicorn 744x992 sources | none |
| Wall heads still low-res | giraffe, hippo, rhino, warthog, secretary-bird heads | any | minor | sources 286x431; only shown on their PDPs, not checked large | minor |
| Mobile hero order | / | 390 | PASS | blob photo first (home-390-fold.png) | none |
| Cookie bar covers hero | / and most pages | 390 | FAIL | bar is about 150px, covers the hero CTA "Shop the animals" at first view; first view is photo plus headline only | major |
| Cookie bar | all | 1280 | minor | thin bar, but covers first shop card CTA row in every fold shot | minor |
| Category circle row | / | 390, 1280 | PASS but duplicated | circles appear AND bento tiles repeat the same 5 categories right below (home-1280-s0.png, s1.png): redundant, long | minor |
| Featured rail arrows | / and PDP | all | PASS | arrows present; rail peeks the next card | none |
| Polaroid heights | home | all | minor | see above | minor |
| Kenyan pattern | / | 1280 | PASS but light | zigzag triangle divider appears twice; no kitenge colour blocks, beadwork or patterned surfaces elsewhere | minor |
| Home moments gallery | / | 390 | minor | in a fast scroll images 5 to 12 stay lazy-blank (verify shot at 390); on slow phones tiles show empty beige boxes | minor |
| PDP layout | /shop/giraffe, /elephant | 1280 | major | main photo only about 340x420 in a wide column, big dead area under the gallery and left of the buy box; elephant PDP leads with a crowd-of-elephants collage rather than one clear animal | major |
| Related thumbnails | PDPs | 390 | minor | 175px source shown at 196px | minor |
| Hierarchy, home | / | 1280 | minor | size classes, how ordering works, trust strip are three similar beige bands; clay-bento cards all the same beige; little playful colour from the UI | minor |
| Story scrapbook | /story | 1280 | PASS | tape, polaroid stack, Caveat accents; hero left side has a large empty area above the title | minor |
| Journal, projects, gallery, makers, gifts | all | 390, 1280 | PASS | uniform, no empties, wavy dividers, torn edge on project cards | none |
| Forms, cart, order, wholesale, contact, legal, care, faq, delivery, partners, supply, custom | all | 390, 1280 | PASS | clean, no overflow | none |

## Earlier defects: fixed or not
- Letterboxing bars: FIXED.
- Upscaled wall heads on listing: FIXED for the shown three; five other heads are still 286px sources (minor, PDP only).
- Mobile hero order: FIXED (photo first).
- Cookie bar covering hero: NOT FIXED (CTA still hidden at first view on 390).
- Polaroid heights: NOT FIXED (2 to 5px, minor).
- Checkbox targets: FIXED.
- Featured rail arrows: FIXED.
- Category circle row: FIXED (present), but now duplicated by the bento tiles.
- Kenyan pattern character: PARTLY (zigzag dividers only).
- New regression: 10px overflow at 768 on home from the circle rail.

## Design judgement
Calm, earthy, consistent, readable and technically tidy. Compared with the inspiration it now has circles, rail, trust strip, wavy dividers, blob photos and captured moments. Weaknesses: monotone beige slabs, UI contributes little joy or Kenyan character, PDP gallery undersized with dead space, cookie bar dominates mobile first view.
