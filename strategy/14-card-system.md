# 14. Unified Card system: Savanna Hand-Stitched Cards

Status: proposal plus working prototype. No site file was edited. Everything lives in `strategy/card-lab/`. Binding inputs: `07-BUILD-DECISIONS.md` (R3 chroma at or below 0.13 and photos never tinted, R4 uniform cards, R9 approved claims, R11 compact density, AA contrast) and `12-futuristic-design-system.md` (Direction B, Daylight Clay Tech).

The owner finds today's cards plain, and on phones the "Three ways to take one home" cards are broken, with large white gaps. The benchmark, noevellagroup.com, has cards that are identical in structure on every page yet are never plain. This document defines one Mikono card, five meaning-based tones, eight variants, the exact CSS, a one-pass migration plan, QA gates, and the fix for the mobile hero chips.

## 0. Files and screenshots

Prototype files (open directly in a browser, no build step):
- `strategy/card-lab/cards.html`: the spec page (tone map, Three ways on desktop plus both phone options, every variant, every tone).
- `strategy/card-lab/contexts.html`: the same cards in the contexts where they appear (home Three ways and trust strip, shop grid, gifts, journal list, stockists, makers and impact, wholesale).
- `strategy/card-lab/cards.css` (the system), `tones.css` (generated), `tones.mjs` (generator and contrast checker), `build.mjs` (one set of helper functions that emits both pages), `qa.mjs` (QA run), `phone-tiers.html` and `phone-snap.html` (390px embeds).
- `strategy/card-lab/img/` real photos copied from `public/media-opt`, `fonts/` the three site fonts copied from the density lab.

Screenshots (390 is rendered at 2x):
- `strategy/card-lab/shots/v4-cards-1440.png` and `strategy/card-lab/shots/v4-cards-390.png` (full spec page)
- `strategy/card-lab/shots/v4-contexts-1440.png` and `strategy/card-lab/shots/v4-contexts-390.png` (cross page proof)
- `strategy/card-lab/shots/hover-tier.png` (hover lift on the first tier)
- Iterations kept for the record: `v1-*` (first build), `v2-*` (photo foot band and phone iframes), `v3-*` (container query CTA, stat contrast), `v4-*` (final). Slices are `*-sN.png`.
- Noevella study: `strategy/card-lab/noe/` (`home-1440-NN.png`, `hub-1440-NN.png`, `home-390-NN.png`, `hub-390-NN.png`, plus `sheet-*.png` contact sheets). Live Mikono mobile hero: `strategy/card-lab/shots/live-hero-390.png`.

## 1. What makes Noevella cards feel premium (observed, 1440 and 390)

Looked at the home page and `/divisions/creative-hub`. What carries the feeling, and what we take from it:

1. **One anatomy everywhere.** The fanned deck card, the workflow card, the three tier cards, the dark metric cards and the shop product card all share a rounded shell around a coloured top zone, a white text zone and a footer line. Variants change the top zone only. Take: one anatomy, variants swap the head.
2. **Gradient direction.** Gradients run from a saturated light corner at the top to a near black at the bottom, so the title and the faint numeral sit on the deep end and always read. Take: 160 degree earth gradient, light top left, deep bottom, text only on the deep end.
3. **A solid white tag pill** in the top left corner (`CLUSTER 1`, `PHYSICAL`, `MOST REQUESTED`). It is small, mono, uppercase and fully opaque, so it stays legible over any gradient or photo. Take: a solid paper pill with a colour dot.
4. **Numerals as texture.** `01`, `02`, `03` in a huge, low contrast serif sit bottom right of the header and make the card feel designed and sequential. Take: Unbounded 800, 80 to 92px, cream at 17 percent with a 1px outline stroke, decorative only.
5. **Tone coded top edge and tinted halos.** Each card has a coloured cap or accent, and the section behind carries a soft radial glow of the same hue. Cards then sit on colour instead of on flat paper. Take: a tone halo behind every section (`.mk-sec::before`) and tone tinted shadows.
6. **Depth.** White body, hairline, a soft tinted shadow (pink for them), a thin footer rule with a mono stat and one accent link. The middle tier is outlined in the accent colour and sits slightly higher, with a `MOST REQUESTED` tag. Take: a 2px tone outline and a 6px lift on the middle tier (without an unproven "most requested" claim).
7. **Hover.** A small lift and a stronger shadow, never a colour change. Take: lift 3px, gloss sweep, pattern parallax.
8. **What we do not copy.** Their magenta and cyan, their serif and their assets. Ours are earth gradients at chroma 0.13 or less, kitenge, bead and stitch motifs, and real Mikono photos.

What makes ours unmistakably Mikono: every head carries a tiny kitenge, bead, knit or sun-arc pattern, a yarn fibre texture, a row of tiny stitches along the seam, and a glossy clay highlight from the upper right.

## 2. The anatomy (one card)

```
.mk-card [data-tone]
  .mk-head   96px zone: gradient + pattern + fibre + gloss + stitched seam
     .mk-tag   solid paper pill, top left (mono 11px caps)
     .mk-num   faint numeral, bottom right (tiers, features)
     .mk-gem   38px medallion with an icon (feature, tier, link)
     (photo | scrim + title overlay | big stat) swapped per variant
  .mk-body   title (14.5px display, 1 line), text (13px, 2 lines), optional facts chips
  .mk-foot   52px band tinted with the tone, meta left, ONE action right (pinned with margin-top:auto)
```

Fixed values, identical on every variant:

| Property | Value |
|---|---|
| Radius | 18px (`--card-r`) |
| Padding | 12px (`--card-pad`) everywhere inside head, body and foot |
| Grid gap | 10px (`--gap`), R11 range 8 to 12 |
| Head height | 96px default, 98px tier, 58px feature, 74px stat, 1:1 photo, 16:10 story |
| Foot height | min 52px (46px in rows), 54px on the photo card |
| Action | one per card, 32px visual, 44px hit area by `::after` |

Type scale (R11 compliant: body at 13px is the "secondary text" floor, titles 14.5px):

| Role | Spec |
|---|---|
| Title | Unbounded 700, 14.5px, line height 1.2, tracking -.02em, 1 line clamp (story overlay 2 lines) |
| Text | Instrument Sans 400, 13px, 1.42, clamp 2 lines |
| Meta | Instrument Sans 400, 12px, 1.3, one line with ellipsis |
| Tag and facts | DM Mono 400, 11px, uppercase, .08em tracking |
| Big numeral | Unbounded 800, 80px (feature 62px, tier 92px), cream 17 percent, decorative, `aria-hidden` |
| Stat number | Unbounded 800, 32px, cream |
| CTA label | Instrument Sans 600, 13px |

## 3. The five tones, by meaning

Tone is a property of the content's meaning, set by the page or the destination, never by position or taste. `data-tone` is the only switch.

| Tone | Meaning | Used on |
|---|---|---|
| `amber` (Shop and animals, amber and sand) | Buying finished animals | `/shop` and category pages, product cards, `/gifts`, "Ready to go", cart and order, size finder, size guide entry points that lead to a purchase |
| `terracotta` (Custom, make it yours) | Making something to order | `/custom`, the studio, build-a-family, "Make it yours", custom promo band |
| `olive` (Wholesale and trade) | Business, partners, outlets | `/wholesale`, `/partners`, `/supply`, "For many", `/stockists` and the home outlets |
| `baobab` (Story, makers, impact) | People, craft, mission | `/story`, `/makers`, `/impact`, `/projects`, the 25+ women feature |
| `slate` (Journal and learning, dusty clay-blue) | Reading and help | `/journal`, `/care`, `/safety`, `/faq`, `/delivery`, `/size-guide`, trust features that link to those pages |

Rules: a card takes the tone of the page it links to, so a "Make it yours" card on the gifts page is terracotta even inside an amber section. A grid may mix tones only when its cards lead to different meanings (the home Three ways). Slate is the single cool tone and is the only one used for neutral help content, so it never competes with the warm shop.

### Tone values

Generated by `card-lab/tones.mjs` from OKLCH sources (hex values are the sRGB gamut clamped result; clamping only ever lowers chroma). Chroma is at most 0.115, the cap is 0.13.

| Tone | top | mid | deep | stat top | tint | tint2 | accent ink | CTA a | CTA b | gem |
|---|---|---|---|---|---|---|---|---|---|---|
| amber | #E9C57D | #AD7B37 | #754A22 | #8C5B2C | #F6ECD5 | #EEDCB9 | #704416 | #925F2E | #6F4420 | #D7B16A |
| terracotta | #DD9872 | #AF5D40 | #692E21 | #833F2F | #FDE6DA | #FAD5C3 | #793624 | #9D5038 | #77382A | #DD996F |
| olive | #A6B279 | #757D4D | #404321 | #555831 | #EDEFD9 | #DDE2C0 | #484B21 | #60653A | #464825 | #AEB87D |
| baobab | #846855 | #4E3B30 | #1C1410 | #2E221C | #F1E6DA | #E5D5C3 | #553C2B | #4E3729 | #2C1E17 | #E0B76C |
| slate | #92B0C0 | #5C7C90 | #253B4A | #3A5264 | #E3EFF6 | #CEE2ED | #2B4C61 | #3D5C71 | #284051 | #98BED2 |

OKLCH sources (L C H):
- amber: top oklch(0.84 0.1 84), mid oklch(0.62 0.105 72), deep oklch(0.45 0.08 62), tint oklch(0.945 0.032 86); max chroma after sRGB clamp 0.105
- terracotta: top oklch(0.74 0.098 50), mid oklch(0.57 0.115 40), deep oklch(0.38 0.088 34), tint oklch(0.94 0.03 50); max chroma after sRGB clamp 0.115
- olive: top oklch(0.74 0.078 118), mid oklch(0.57 0.068 116), deep oklch(0.37 0.052 112), tint oklch(0.945 0.03 112); max chroma after sRGB clamp 0.08
- baobab: top oklch(0.54 0.046 56), mid oklch(0.37 0.032 52), deep oklch(0.2 0.016 50), tint oklch(0.93 0.02 70); max chroma after sRGB clamp 0.105
- slate: top oklch(0.74 0.04 232), mid oklch(0.57 0.048 236), deep oklch(0.34 0.038 240), tint oklch(0.945 0.016 230); max chroma after sRGB clamp 0.053

| Pair | amber | terracotta | olive | baobab | slate | min |
|---|---|---|---|---|---|---|
| cream on head deep (numeral/gloss text zone) | 7.21 | 9.88 | 9.74 | 17.19 | 11.03 | 4.5 |
| cream on head mid (tag/medallion glyph, 3:1 UI) | 3.51 | 4.46 | 4.15 | 9.98 | 4.2 | 3 |
| cream on CTA top | 5.1 | 5.47 | 5.82 | 10.46 | 6.7 | 4.5 |
| cream on CTA bottom | 7.88 | 8.34 | 8.98 | 15.24 | 10.24 | 4.5 |
| ink on tint (footer name) | 13.03 | 12.76 | 13.09 | 12.45 | 13.08 | 4.5 |
| ink-soft on tint (meta) | 6.35 | 6.21 | 6.37 | 6.06 | 6.37 | 4.5 |
| ink-soft on tint2 | 5.53 | 5.46 | 5.58 | 5.2 | 5.58 | 4.5 |
| accent-ink on tint (link, tag text) | 7.07 | 7.4 | 7.79 | 8.26 | 7.77 | 4.5 |
| accent-ink on paper (link) | 7.84 | 8.37 | 8.6 | 9.58 | 8.58 | 4.5 |
| ink on paper (title) | 14.44 | 14.44 | 14.44 | 14.44 | 14.44 | 4.5 |
| ink-soft on paper (body) | 7.03 | 7.03 | 7.03 | 7.03 | 7.03 | 4.5 |
| ink on tag pill (paper) | 14.44 | 14.44 | 14.44 | 14.44 | 14.44 | 4.5 |
| accent-ink on tag pill (paper) | 7.84 | 8.37 | 8.6 | 9.58 | 8.58 | 4.5 |
| cream on stat top (stat card text zone) | 5.45 | 7.32 | 7.04 | 14.61 | 7.74 | 4.5 |
| cream .9 alpha approx on stat top | 4.77 | 6.26 | 6.08 | 12.09 | 6.62 | 4.5 |
| head mid vs paper (outline/medallion edge, 3:1) | 3.5 | 4.44 | 4.13 | 9.94 | 4.18 | 3 |

All 16 pairs pass in all five tones (`node card-lab/tones.mjs` prints `ALL PASS`; `contrast.json` holds the numbers). Text on a gradient only ever sits on the deep end (`deep`, or `stat top` for the stat card) or on a solid paper pill. The faint numeral is decorative and exempt. Footers use ink and ink-soft on the tint. Text colours: title `#2A2420`, body `#5F5348`, cream `#FFF8EC`.

### Patterns (one per tone, inline SVG data URIs, 240 to 600 bytes each)

Defined once on `:root` as `--pat-amber`, `--pat-terracotta`, `--pat-olive`, `--pat-baobab`, `--pat-slate`, `--seam` and `--fibre` (see `card-lab/cards.css` lines 1 to 20; copy verbatim). White strokes at 12 to 24 percent opacity only.

| Tone | Pattern | Motif |
|---|---|---|
| amber | `--pat-amber` 14x12 | knit V stitches, the crochet itself |
| terracotta | `--pat-terracotta` 34x34 | kitenge diamond with a centre dot and corner beads |
| olive | `--pat-olive` 20x20 | beadwork dot grid, two bead sizes |
| baobab | `--pat-baobab` 40x24 | concentric sun arcs over the savanna plus an ochre glow at the upper right |
| slate | `--pat-slate` 16x16 | woven kikoy stripes |
| all | `--seam` 9x5 | a row of V stitches along the bottom of every head, cream at 62 percent (this is the stitched seam, not a dashed border) |
| all | `--fibre` 64x64 | wavy yarn strands at 7 percent, under the pattern |
| bands and stats | `--bead` | a row of 1.5px cream beads along the bottom edge |

The pattern layer is masked toward the light corner (`mask-image: linear-gradient(205deg, #000, rgb(0 0 0/.35) 55%, transparent 90%)`) so it never fights the numeral or the text.

## 4. The exact CSS

The complete, working stylesheet is `strategy/card-lab/cards.css` (about 22 KB unminified, 4 KB gzipped) plus the generated `tones.css`. Port it as `app/cards.css` imported once from `app/layout.tsx`. The decisive rules:

### 4.1 Gradients

```css
/* head (every variant except photo/story, which place content over it) */
.mk-head{
  background:
    var(--seam) 0 calc(100% - 4px)/9px 5px repeat-x,                      /* stitched seam */
    radial-gradient(130% 100% at 100% 0%, rgb(255 255 255/.34), transparent 52%), /* glossy clay highlight, upper right */
    var(--fibre) 0 0/64px 64px,                                           /* yarn fibre */
    linear-gradient(160deg, var(--t-top) 0%, var(--t-mid) 46%, var(--t-deep) 100%); /* earth gradient, light top, deep bottom */
}
.mk-head::before{ content:""; position:absolute; inset:-14px; background:var(--t-pat);
  mask-image:linear-gradient(205deg,#000 0%,rgb(0 0 0/.35) 55%,transparent 90%); transition:transform .9s var(--ease-soft) }
.mk-head::after{ content:""; position:absolute; inset:0; pointer-events:none; transform:translateX(-130%);
  background:linear-gradient(105deg,transparent 34%,rgb(255 255 255/.34) 48%,transparent 62%) }   /* gloss sweep, idle off screen */
[data-tone="baobab"] .mk-head{ /* adds an ochre sun glow */
  background: var(--seam) 0 calc(100% - 4px)/9px 5px repeat-x, radial-gradient(70% 90% at 92% 8%, rgb(224 183 108/.38), transparent 62%),
              var(--fibre) 0 0/64px 64px, linear-gradient(160deg,var(--t-top),var(--t-mid) 46%,var(--t-deep)) }
```

Per tone gradient stops (hex, from section 3): amber `#E9C57D / #AD7B37 / #754A22`, terracotta `#DD9872 / #AF5D40 / #692E21`, olive `#A6B279 / #757D4D / #404321`, baobab `#846855 / #4E3B30 / #1C1410`, slate `#92B0C0 / #5C7C90 / #253B4A`. The CSS custom properties (`--t-top`, `--t-mid`, `--t-deep`, `--t-tint`, `--t-tint2`, `--t-ink`, `--t-btn-a`, `--t-btn-b`, `--t-gem`, `--t-stat`, `--t-halo`, `--t-rgb`, `--t-pat`) are emitted by `tones.mjs` into `tones.css` as `[data-tone="..."]` blocks.

Body wash and foot band: `.mk-body{background:linear-gradient(180deg,#FFFDF9 0%,var(--paper) 70%,var(--t-tint) 160%)}` and `.mk-foot{background:linear-gradient(180deg,var(--t-tint),var(--t-tint2));border-top:1px solid rgb(var(--t-rgb)/.14)}`.

CTA (a clay pill in the tone): `background:linear-gradient(180deg,var(--t-btn-a),var(--t-btn-b)); box-shadow: inset 0 1px 1px rgb(255 255 255/.36), inset 0 -3px 5px rgb(0 0 0/.24), 0 6px 10px -5px rgb(var(--t-rgb)/.7); color:#FFF8EC`.

### 4.2 Shadows and radius

```css
.mk-card{ border-radius:18px; overflow:hidden; isolation:isolate;
  box-shadow: inset 0 1px 0 rgb(255 255 255/.9), 0 0 0 1px rgb(var(--t-rgb)/.15),
              0 1px 2px rgb(59 42 34/.1), 0 12px 20px -12px rgb(var(--t-rgb)/.5) }   /* tone tinted ambient shadow */
.mk-card:hover{ transform:translateY(-3px); box-shadow: inset 0 1px 0 rgb(255 255 255/.9), 0 0 0 1px rgb(var(--t-rgb)/.22),
              0 2px 3px rgb(59 42 34/.1), 0 20px 28px -12px rgb(var(--t-rgb)/.58) }
.mk-card:active{ transform:scale(.985); transition-duration:.1s }
.mk-card--tier.is-feat{ transform:translateY(-6px); box-shadow: inset 0 1px 0 #fff, 0 0 0 2px var(--t-mid), 0 2px 3px rgb(59 42 34/.1), 0 22px 30px -12px rgb(var(--t-rgb)/.62) }
```

The site's `--shadow-clay-sm` is replaced inside cards by the tone tinted version above (same key light, upper left).

### 4.3 Hover, tap and reduced motion

- Hover (pointer devices): lift 3px, shadow grows, a diagonal gloss band sweeps across the head in 850ms, the pattern layer drifts 7px left and 5px down (parallax), photo scales 1.04 over 900ms, the link arrow moves 3px.
- Tap (touch): `:active` scales to .985 in 100ms. `@media (hover:none)` disables the lift and the sweep, so nothing sticks after a tap.
- Focus: `.mk-card:focus-within{outline:2px solid var(--t-ink);outline-offset:2px}`; the whole card is clickable through the stretched title link (`.mk-title a::after{inset:0}`), the CTA sits above it with `z-index:2`.
- `prefers-reduced-motion: reduce`: no transitions, no lift, no scale, no sweep (`.mk-head::after{display:none}`), no parallax, no photo zoom. The shadow and the focus ring still change statically on hover.

### 4.4 How equal heights and CTA alignment are guaranteed

1. The grid: `.mk-grid{display:grid;grid-auto-rows:1fr;align-items:stretch}`. Every row is as tall as its tallest card, so card heights match by construction.
2. The card: `display:flex;flex-direction:column;height:100%`. `.mk-body{flex:1 1 auto}` absorbs spare height, `.mk-foot{margin-top:auto;flex:none}` pins the foot (and the CTA) to the bottom edge.
3. No unpredictable content: titles clamp to one line (two for the story overlay), text to two lines, meta to one line with ellipsis. Head height is fixed per variant (or an aspect ratio), foot height has a minimum. Variable copy can only change how full the body is, never the card height.
4. Grid columns: `repeat(2,minmax(0,1fr))` on phones, 3 from 640px, 4 from 1024px; `minmax(0,1fr)` prevents long words from widening a track. Tiers and rows use `.mk-grid--3` and `.mk-grid--1`.
5. Container query for the product action: `container-type:inline-size` on `.mk-card--photo`; the label "Ask for price" shows when the card is at least 300px wide, otherwise a 34px chat icon button (accessible name kept with `aria-label`).

Measured by `qa.mjs`: card height spread 0 and CTA bottom offset spread 0 in every row on both pages at 390, 768 and 1440.

## 5. The variants

All eight are built from the same three zones. Markup is produced by one helper per variant in `card-lab/build.mjs`.

### 5.1 PhotoCard (product, `data-card="product"`)
Photo in a gradient frame (head is a 1:1 box, photo inset 6px with a 13px radius and a white hairline), a small solid tag pill over the photo (`Safari`, `More`), and a tone tinted foot band with the name, one meta line (`S to XL`) and one compact action. Because R7 applies (`pricesConfirmed` false), the action is "Ask for price" on a WhatsApp link, or the price chip when a price exists. The photo is never filtered, tinted or overlaid (R3). Only the frame around it is gradient.

### 5.2 FeatureCard (`data-card="feature"`)
58px head with a medallion, a tag top right, a faint numeral. Body: title and 2 line text. Foot: one text link with an arrow, right aligned (`align-self:stretch` so it is 52px tall to tap). Used for trust claims (approved wording only, R9), gift ideas, wholesale request types, studio options.

### 5.3 TierCard (Three ways to take one home, `data-card="tier"`)
98px numbered head: tag (`Shop`, `Custom`, `Trade`), a 92px faint `01`, `02`, `03`, a medallion. Body: title, 2 line text, two facts chips. Foot: one CTA. The middle card (`.is-feat`) has a 2px tone outline and sits 6px higher on desktop. Tags follow the tone map, so no unproven "most requested" claim is made.

Copy used in the prototype (all consistent with R7, R9, D20): "Ready to go: Pick a finished animal and ask for the price on WhatsApp" (Shop animals), "Make it yours: Choose the animal, colours and size, and we crochet it by hand" (Start yours), "For many: Shops, events and groups. We send the price list on WhatsApp" (Ask for list).

**Mobile, designed both ways, chosen A:**
- **A (chosen): tight vertical stack of row cards.** At 639px and below the same markup becomes a grid: a 62px gradient rail on the left (numeral 30px solid cream at top, medallion at bottom, tag hidden) and the body and foot on the right with a full width CTA. Each card is about 145px tall, three cards plus gaps about 450px, everything visible, no scrolling sideways, no empty area (fill ratio 1.00 measured). `.mk-grid--tiers{gap:8px}`.
- B (rejected): horizontal snap row (`.mk-snap`, cards at 78 percent width). Built in `phone-snap.html`. It hides the third option off screen, leaves empty space below short cards in the row, needs a scroll hint, and splits attention on the page whose job is to show all three choices.
Both are visible on desktop in `cards.html` as 390px embeds; A is also what `cards.html` and `contexts.html` show natively at 390.

### 5.4 StatCard / FactTile (`data-card="stat"`)
Dark earth gradient card (`linear-gradient(165deg,var(--t-stat),var(--t-deep))`), 74px head with a 32px display number and a bead band, body with title and one line, foot link. Confirmed facts only: "25+ women supported", "7 outlets", "Since 2019, founded by Leah Maina", "S to XL, four size classes". No other figure may be added until the client confirms it (D27, R2). Text sits on `--t-stat`, ratios 5.45 to 14.61.

### 5.5 StoryCard (journal, projects, makers, `data-card="journal"` or `"project"`)
16:10 photo; a scrim covers only the lower 52 percent (`rgb(var(--t-rgb)/.72)` rising to `.94`) and carries the title overlay in cream (2 lines); the numbered tag top left (`01 How it is made`). The upper half of the photo is never overlaid, so the photo is not colour graded (R3; QA check below). Body: excerpt, 2 lines. Foot: meta and Read. On phones, lists (`.mk-rowmobile`) switch to a compact row: 104px thumb on the left (no scrim, no overlay), title, excerpt and foot on the right.

### 5.6 LinkCard (menu entries, stockists, `data-card="link"`)
58px row: 50px tone rail with a medallion, title and one line (name and place), arrow cell. Seven stockists are the seven outlets in `lib/site.ts`.

### 5.7 PromoBand (`data-card="band"`)
Full width card using the same tokens: tone gradient, pattern, fibre, gloss, a bead band along the bottom, tag, title, one line, one or two actions (paper pill primary, outlined secondary). Single column on phones, two columns from 768px.

### 5.8 Optional: tone halo section chrome
`.mk-sec` draws a soft radial glow of `rgb(var(--t-rgb)/.13)` behind a card group (the Noevella halo). Set `data-tone` on the section wrapper.

## 6. Cross page proof

`contexts.html` renders the same helpers on: home Three ways and trust strip, the shop grid (8 photo cards), gifts, the journal list (rows on phone), stockists (7 link cards), makers and impact (story cards plus a separate stat row), and wholesale (4 request cards plus a band). Measured at 390, 768 and 1440 (`node card-lab/qa.mjs`):

| Check | Result |
|---|---|
| Height spread per row | 0 in all 6 runs, 8 to 27 rows per run |
| CTA bottom offset spread per row | 0 |
| Horizontal overflow | none |
| Content fill ratio (share of card height covered by content with a 6px margin) | minimum 0.745 (feature at 768 and 1440); tier 0.88 to 1.00, photo 0.98, story 0.82 to 1.00, stat 0.77 to 0.84, link 1.00 |
| Hit area under 44px | none (links get 52px by `align-self:stretch` plus `::after`) |
| Chroma of every hex literal in `cards.css` and `tones.css` (63 values) | none above 0.13; max 0.115 |
| AA pairs in `tones.mjs` | 80 of 80 pass |

Note on the fill ratio: a StatCard placed in a row with a tall StoryCard fails dead space (seen in `v3`), so stat tiles live in their own row. The rule is in the migration plan.

## 7. Migration plan (one agent, one pass)

Create:
1. `app/cards.css`: paste `card-lab/cards.css` (without the `@font-face` block and the `:root` colour duplicates, which the site already has as `--color-*`; map `--bone`, `--paper`, `--ink`, `--ink-soft`, `--cream` to `var(--color-bone)` etc., `--cream:#FFF8EC` is new) and the generated `tones.css`. Import in `app/layout.tsx`. Use `@layer components`.
2. `lib/cardTone.ts`: `export type Tone = "amber"|"terracotta"|"olive"|"baobab"|"slate"` and `toneForPath(path)` implementing the table in section 3 (default `amber`).
3. `components/card/` with `Card.tsx` (shell and zone slots), `PhotoCard.tsx`, `FeatureCard.tsx`, `TierCard.tsx`, `StatCard.tsx`, `StoryCard.tsx`, `LinkCard.tsx`, `PromoBand.tsx`, `CardGrid.tsx` (renders `ul[data-card-group].mk-grid` with `li` wrappers `display:flex`). Each variant emits `data-card` and `data-ratio` (photo `1/1`, story `16/10`).
4. `scripts/tokens-check.mjs`: add `app/cards.css` and the new tone variables to the chroma scan.

Replace (keep exported names and prop types so call sites barely change):

| Existing | Becomes | Notes |
|---|---|---|
| `components/ProductCard.tsx` (`ProductCard`, `ProductCardData`, `formatKes`, `sizeRange`) | `PhotoCard` internals, same exports | Tone `amber`. Keep `image.focal`, `fit`, `multiply`. Tag from `item.tag`. Foot: name, meta (`sizeRange`), action (WhatsApp ask or price). Drop the `p-1.5 clay-sm` wrapper. |
| `components/ContentCard.tsx` (`ContentCard`, `ContentGrid`) | `StoryCard` | Tone by `kind`: journal `slate`, project `baobab`. `lib/contentCards.ts` unchanged. Move `meta` to the foot, `excerpt` to body (visible on phones now, rows on phones). Tag gets the post number. |
| `components/InfoCard.tsx` (`InfoCard`, `InfoGrid`) | `FeatureCard` when it has `icon` or no image; `StoryCard` when it has `image` | `InfoGrid` becomes `CardGrid`. Tone from `toneForPath(item.cta.href)`. |
| `app/page.tsx` "Three ways" (`.tier`, `.tier-main`, `ti`) and the `ways` array | `TierCard` x3, `.mk-grid--3.mk-grid--tiers` | Delete `.tier*` rules from `app/home.css`. Tones: Ready to go amber, Make it yours terracotta (middle, `is-feat`), For many olive. |
| `app/page.tsx` "What goes into every animal" (`.facts`, `.fact`, `.fact-wide`) | `FeatureCard` x4, with approved claims only | Tones per link target (section 3). `fact-wide` is dropped, rows must stay equal. |
| `app/page.tsx` outlets (`data-card="outlet"`) and `app/stockists/page.tsx` | `LinkCard` (olive) | `lib/site.ts` `outlets` feeds both. |
| `components/StatsBand.tsx` | `StatCard` row in its own `CardGrid` | Keep the D27 rule: zero hides, one stat uses a single centred card. `baobab` for people, `olive` for outlets. Never place a stat in a grid with a Story or Photo card. |
| `components/CtaBand.tsx` | `PromoBand` | Tone by destination. |
| `components/TrustStrip.tsx` | stays a strip; its items may reuse `.mk-gem` and the tone pill | Four items exactly (D27). |
| `components/ProductRail.tsx`, `ShopListing.tsx` | use `PhotoCard` and `CardGrid` | Rail keeps horizontal snap but cards are the same `PhotoCard` at a fixed 200px basis. |
| `components/Bento.tsx`, `CategoryCircles.tsx`, `HerdDeck.tsx` | unchanged now | Bento is the R4 exception. Optionally give bento tiles the head gradient and pattern with `data-tone="amber"` later. |
| `components/helpers/OptionCard.tsx`, `ResultCard.tsx`, `StepCard.tsx`; `GiftFinder`, `SizeFinder`, `FamilyBuilder` | `FeatureCard` (options), `PhotoCard` (results with a photo), `LinkCard` (steps) | Tone: gift finder `amber`, size finder `amber`, family builder `terracotta`. Keep their selection state classes (`aria-pressed`) on the card root and add a 2px tone outline for selected, reusing `.is-feat`. |
| `components/studio/BriefCard.tsx`, `ui.tsx`, `StepsA/B/C`, `studio.css` | tone `terracotta` on option tiles only | `st-panel` is a form panel, not a repeating card; leave it. Option tiles inside the steps become `FeatureCard` with the selected outline. |
| `app/gifts/page.tsx`, `app/stockists/page.tsx`, `app/journal/page.tsx`, `app/projects/page.tsx`, `app/styleguide/page.tsx` | switch imports to the new components; update the styleguide to show section 5 | The styleguide is the QA fixture. |

Delete after the swap: `.clay-sm` and `.clay-interactive` usages inside card components, the old dashed border card styles, `h-[2.3em]` and `h-[4.5em]` fixed text heights (clamp replaces them), and `max-md:hidden` on card text. Do not hide card copy on phones anymore. The row layout makes it fit.

Mobile list rule: use `.mk-rowmobile` on journal, projects and makers grids so they become one column of rows under 640px. Shop grids stay two columns (photo cards fit at 175px wide with the icon action).

Hard constraints to keep during migration: never put text on a gradient lighter than `--t-deep` or `--t-stat`; never overlay or filter product photos (frames and the lower scrim on story cards only); no em or en dashes, no emoji, no unconfirmed claims (R9, D26, D40); no `will-change` on static cards; keep `loading="lazy"` except the first row (`eager`).

## 8. QA checks (add to `scripts/qa-layout.mjs` and `scripts/tokens-check.mjs`)

1. **Card height spread 0:** for each `[data-card-group]`, group `[data-card]` by `getBoundingClientRect().top` (compensate the raised tier by 6px on desktop) and assert `max(h) - min(h) < .5px`, at 360, 390, 768, 1024, 1440.
2. **CTA baseline:** for each row, `card.bottom - cta.bottom` is identical within .5px.
3. **Fill ratio above 70 percent:** for each card, take the vertical union of `.mk-head`, `.mk-title`, `.mk-text`, `.mk-meta`, `.mk-cta`, `.mk-link`, `.mk-facts`, `.mk-big`, `.mk-gem`, `.mk-over` rects expanded by 6px, clipped to the card, divided by the card height; fail below 0.70 (see `qa.mjs`, current minimum 0.745). Also fail if any single vertical gap inside the body exceeds 24px.
4. **No horizontal overflow** at 360px (`documentElement.scrollWidth <= innerWidth`).
5. **Contrast:** `node strategy/card-lab/tones.mjs` exits with `ALL PASS`; wire it into `prebuild`. Any change to tone values must regenerate `tones.css`.
6. **Chroma budget:** every `#rrggbb` and `oklch()` in `app/cards.css` converts to chroma at or below 0.13 (`qa.mjs` section 'chroma literals'; `rgb(... / alpha)` shadows use the tone triplet or neutral browns).
7. **Hit area:** every `.mk-cta` and `.mk-link` has a 44 by 44 hit box (element plus `::after`).
8. **Photo purity (R3):** for photo and story cards, assert that no element with a `background` or `filter` overlaps the photo rect except `.mk-scrim` (lower 52 percent) and the frame; screenshot diff of the top 45 percent of a story photo against the source must be zero.
9. **Tone map:** a unit test that `toneForPath` returns the section 3 tones and that every `data-tone` is one of the five.
10. **Reduced motion:** with `prefers-reduced-motion: reduce` emulated, hover must not change `transform` or show the sweep.
11. **Copy checks:** the existing dash, slop and TODO scan runs over card copy.

## 9. Mobile hero chips fix (`app/home.css` lines 24 to 42 and 103 to 104, markup at `app/page.tsx` 89 to 90)

Problem (screenshot `card-lab/shots/live-hero-390.png`): at 390px the "Yarn / Recycled yarn" chip (`hero-chip-b`, `top:19%; right:3%`) sits over the lion's head, and the "Made by" chip covers the empty top of the panel but pushes the pair into the lion's zone. The panel is only about 320px tall, the two chips are 52px high each, and the lion's head starts at roughly 28 percent of the panel height.

Placement rule (the chips never cover an animal):
1. **Safe zone.** A chip may only occupy the top 26 percent of the stage (the empty backdrop above the tallest cutout) or sit outside the stage. On phones there is not room for both inside 26 percent, so the rule is outside.
2. **At 640px and below, move both chips below the stage panel**, in one row, static, not floating: wrap them in `.hero-chips{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}` after the stage; set `.hero-chip{position:static;translate:none;animation:none;min-height:44px;padding:6px 10px}`; icon 28px, `small` 11px, `b` 13px (R11). Two chips of 34 to 44px fit side by side at 390px (about 175px each).
3. **Above 640px**, keep them floating but constrained: `hero-chip-a{top:4%;left:4%}` and `hero-chip-b{top:4%;right:4%;translate:none}` (both in the top row, never `top:19%`), and disable the pointer parallax for the chips on any viewport narrower than 900px.
4. **Guard.** Add a QA assertion in `scripts/qa-layout.mjs`: for every hero chip, its rect must not intersect the rect of any `img.cut` (`cut-lion`, `cut-giraffe`, `cut-rabbit`) inset by 8 percent on each side (the animals' opaque core), at 360, 390, 430, 768, 1024 and 1440. Fails the build on overlap.
5. If the owner wants the chips inside the panel on phones, the only other compliant placement is the two bottom corners of the panel, but the giraffe and rabbit sit there, so it is not recommended.

## 10. Decisions and notes

- Gradients, pattern and the fibre texture are decoration on the card shell and frame only. Product photographs and the toys' own colours are never altered (R3).
- The "most requested" style tag from the benchmark is not used, because it would be an invented claim. The middle tier is outlined to signal "made for you" only.
- Slate is dusty clay-blue (`#5C7C90` mid, chroma 0.053). If the owner prefers a warmer journal tone, replace the slate row in `tones.mjs` and regenerate; contrast gates will tell if it passes.
- Card copy in the prototypes uses real facts and wording from `lib/site.ts`, `content/journal.ts` and the brief; stat tiles use only R2 confirmed facts. Product names and `S to XL` follow R5. Prices are never shown (R7).
- Fonts in the prototype are the same three the site loads (Unbounded, Instrument Sans, DM Mono), copied from `strategy/density-lab/fonts`.
- Rebuild the prototype with `cd strategy/card-lab && node tones.mjs && node build.mjs`, and screenshot with `node shoot.mjs <tag>`.
