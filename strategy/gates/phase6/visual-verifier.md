# Phase 6 Visual Verifier (1 of 3), round 3, LIVE site

Target: https://mikono-creations.vercel.app (read only). Playwright-core with bundled chromium. 45 routes at 320, 390, 768, 1280, 1600 (225 page loads); screenshots at 390 and 1280 for all pages, 768 and 1600 for home, shop, categories and PDPs. Files: strategy/gates/screens/phase6-visual/ (PNGs, metrics-a/b/c.json, img-check.json, consent-fold-*.png). Screenshots reviewed by eye: home 390 and 1280, shop 1280, PDP elephant, giraffe, octopus at 390 and 1280, story, impact, makers, journal, projects, gallery, gifts, stockists, wholesale, contact at 390. Other pages were measured, not all eyeballed one by one.

Verdict: PASS with defects (0 blockers, 1 major, several minor). The no-images regression is fixed.

| Check | Page | Width | Result | Evidence | Severity |
|---|---|---|---|---|---|
| Every img renders (naturalWidth > 0) | all 45 | 390, 1280 | PASS | img-check.json with lazy forced eager: 0 broken, 0 non-OK /_next/image responses on every page | none |
| /_next/image status | all | all | PASS | 200 or 304 only; the one 400 seen was my own invalid probe URL | none |
| Lazy images in horizontal rails | /, PDP "More crocheted animals" | all | minor | During a plain vertical scroll 1 to 4 off-screen rail images (hippo, octopus, cat, rabbit, dinosaur, handbag) are still complete=false with empty currentSrc. They load once the rail is scrolled (verified: cat loaded after scrollIntoView). Not broken, but blank until swiped | minor |
| Horizontal overflow | all | 320, 390, 768, 1280, 1600 | PASS | scrollWidth minus innerWidth = 0 everywhere; home 768 overflow FIXED | none |
| Card height spread | /shop, 5 categories, home grids, /stockists | all | PASS | every data-card-group: height spread 0, CTA bottom spread 0 | none |
| Image ratio uniformity | grids | all | PASS | one ratio per grid; only home mixes 1 (polaroid) and 0.8 (rail) by design | none |
| Smallest font | all | all | PASS except 1 | 16px everywhere; /cookies table header "mk.cart.v1" is 15px | minor |
| Chroma above 0.13 outside img | all | all | PASS | 0 elements on every page | none |
| Touch targets (block links, buttons, inputs) | all | 390, 1280 | PASS | only skip links and a hidden 1px radio input are under 44px | none |
| Touch targets, inline text links | footer, FAQ, delivery, PDP size guide link | 390 | NOT MEASURED this round | my script excluded inline anchors; round 2 found 19 to 34px. Treat as still open | minor |
| Hero CTA above consent bar | / | 390x844 | PASS | CTA 527 to 583, bar starts 734; both CTAs clear (consent-fold-390x844.png) | none |
| Hero CTA above consent bar | / | 360x740 | PARTIAL | primary CTA 527 to 583 visible; bar starts about 630 so "Trade enquiries" (595 to 651) is clipped by the bar. Primary CTA fixed | minor |
| Consent bar on other pages | most | 390 | minor | bar is about 110px, covers the first PDP colour swatches, shop filters and page intros at first view | minor |
| PDP gallery size and lead image | /shop/giraffe, elephant, octopus | 1280 | PASS | main photo about 570x560, thumbnails below, single-animal lead (elephant now caramel elephant close up); dead area under the gallery on elephant at 1280 remains (single photo, no thumbs) | minor |
| Home redundant tiles | / | 390, 1280 | PASS | circles now sit alone; bento is "More ways to find the right one" (size, gifts, makers, shops), no category repeat | none |
| Polaroid heights | home moments, gallery | all | PASS visually | rows look even, rotation only | none |
| Stockists orphan card | /stockists, home | 1280 | PASS | 7 outlets plus "Stock our animals" card fill 8, 2 rows of 4 | none |
| Fast-scroll blank moments | / | 390 | minor | moments tiles load on scroll; lazy rail images as above | minor |
| Kenyan character | / , story | 1280 | PARTIAL | dotted bead divider, diamond pattern band on baobab brown section, kitenge-like photos; the UI itself is still beige slabs; no kitenge colour blocking in cards | minor |
| Palette | all | all | PASS | muted earthy, olive trust band, dark brown story band | none |
| Layout quality | story, impact, makers, journal, projects, gallery, gifts, wholesale, contact | 390 | PASS | scrapbook tape and polaroids, wavy dividers, torn card edges, clean forms; story hero stack tight at 390 | none |
| Mobile page length | / | 390 | minor | about 7 screens, trust strip 2x2 cards cramped (wrapped "Recycled acrylic yarn") | minor |

## Earlier defects
- Home 768 overflow: FIXED.
- Consent bar covering hero CTA at 390: FIXED at 390x844; at 360x740 the secondary CTA is still clipped.
- PDP gallery size and lead image: FIXED.
- Redundant home tiles: FIXED.
- Small links: UNVERIFIED this round (inline links not measured).
- Polaroid heights: FIXED or invisible.
- Stockists orphan card: FIXED.
- Blank moments on fast scroll: STILL PRESENT for lazy horizontal rails (minor).
- Kenyan character: PARTLY, improved (bead divider, diamond band) but UI chrome is still plain.

## Design judgement
Coherent, calm, earthy, uniform and technically clean. Matches the inspiration structure: category circles, featured rail with arrows, trust strip, wavy and beaded dividers, blob hero photo, moments gallery. Weak spots: monotone beige cards, price shown as "Price on request" on every card so cards carry no differentiating content, shop listing at 1280 has a long filter column that runs shorter than the grid, little playful colour from the UI itself.

Top defects: (1) rail images lazy-blank until swiped, (2) 360x740 consent bar clips secondary CTA, (3) consent bar covers PDP swatches and page intros on mobile, (4) inline link targets unverified and likely under 44px, (5) /cookies 15px text, (6) Kenyan flavour mostly dividers, (7) PDP dead area with single-photo animals, (8) cramped trust strip at 390.
