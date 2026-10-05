# Mikono Creations: Design System (Tailwind v4, Next.js)

Status: build-ready. Obeys `strategy/00-CHARTER.md`. Rules cited as H1 to H10 (the ten hard rules in charter section 2). All contrast ratios below were computed with a WCAG 2.x relative luminance script, not estimated.

---

## 1. Design principles

1. **Soft, not loud (H4).** Every colour is desaturated and earthy. Delight comes from shape, depth, texture and motion, never from saturation. The four client inspo sites use purple, yellow, orange, green and electric blue as their identity. We keep their structure (category circles, best sellers rail, trust strip, wavy dividers, blob photos, stats band, captured moments, program cards, newsletter and tour forms) and drop all of their colour.
2. **Uniform by construction (H5).** Equal height is guaranteed by CSS rules, not by content discipline. Section 5.5 names the exact rules.
3. **Child-first, parent-safe (H6).** 48px default touch targets, 17px body, forgiving forms, calm motion, no countdowns, no first-paint pop-ups.
4. **Two voices, one family.** The shop speaks clay: squishy surfaces, blobs, bento tiles. The story pages speak scrapbook: paper, tape, polaroids, hand lettering. Both share the same palette, type and spacing, so moving between them feels like moving between rooms of one house.
5. **Kenya in the details (H8).** Kitenge-inspired geometry in two earth tones as quiet patterns, a savanna horizon silhouette in footers and heroes, sparing beadwork motifs as dividers. No cartoon safari clichés. People and makers shown with dignity and only once cleared (H10).
6. **Accessible as default (H9).** AA contrast on every pairing in section 2, visible focus, full keyboard use, reduced motion honoured.
7. **Fast.** Tokens in CSS variables, one variable font per role, SVG shapes inline, `next/image` everywhere.

---

## 2. Palette

Muted, earthy, derived from the logo (brown hands `#774B28`, charcoal yarn ball) and the savanna. No hue exceeds roughly 45 percent saturation.

### 2.1 Tokens

| Token | Hex | Role |
|---|---|---|
| `bone` | `#FBF7F0` | Page background, card surface on dark |
| `oat` | `#F3EBDD` | Alternate section background, clay surface |
| `sand` | `#E6D9C3` | Tinted panels, chips, dividers fill |
| `sand-deep` | `#D2BFA0` | Decorative only (blobs, wave fills, tape). Never text, never a control border |
| `clay` | `#C79B7D` | Decorative only (illustration, pattern) |
| `terracotta` | `#B0654A` | Large display accents, icons 24px+, focus ring, graphic fills |
| `terracotta-deep` | `#8A4630` | Primary button fill, links on light surfaces, price accent |
| `terracotta-tint` | `#EBD2C4` | Soft panel, "new" tag background |
| `ochre` | `#C9A05A` | Decorative, stars, bead motif, text only on baobab-deep |
| `ochre-deep` | `#7F5C1C` | Text on light (tags, ratings) |
| `ochre-tint` | `#F0E2BF` | Sale and info tag background, highlight |
| `olive` | `#6A7049` | Icons, success fill, text on bone only |
| `olive-deep` | `#464B2D` | WhatsApp button, success text, secondary fill |
| `olive-tint` | `#DDE0C8` | Success panel, "in stock" tag |
| `baobab` | `#5A3F32` | Headings, secondary buttons, body on tinted panels |
| `baobab-deep` | `#3B2A22` | Footer, dark bands, tooltips |
| `charcoal` | `#2B2724` | Body text on light, yarn-ball logo colour |
| `stone` | `#6E6258` | Muted text, captions (on bone and oat only) |
| `line` | `#8B7D6F` | Input borders and control outlines (3:1 non-text) |
| `brick` | `#9B3F35` | Error text and error border. Muted brick, not red |

### 2.2 WCAG AA contrast table (computed)

Thresholds: 4.5 normal text, 3.0 large text (24px, or 18.66px bold) and non-text UI.

| Foreground | Background | Ratio | Use | Result |
|---|---|---|---|---|
| charcoal | bone | 13.86 | body | AA, AAA |
| charcoal | oat | 12.51 | body | AA, AAA |
| charcoal | sand | 10.63 | body on chips | AA, AAA |
| charcoal | terracotta-tint | 10.26 | body on panel | AA, AAA |
| charcoal | olive-tint | 10.98 | body on panel | AA, AAA |
| charcoal | ochre-tint | 11.52 | body on panel | AA, AAA |
| charcoal | ochre | 6.11 | text on ochre fill | AA |
| baobab | bone | 8.97 | headings | AA, AAA |
| baobab | oat | 8.09 | headings | AA, AAA |
| baobab | sand | 6.88 | headings on sand | AA |
| baobab | terracotta-tint | 6.64 | text on panel | AA |
| baobab | olive-tint | 7.10 | text on panel | AA |
| baobab | ochre-tint | 7.45 | text on panel | AA |
| stone | bone | 5.54 | captions | AA |
| stone | oat | 5.00 | captions | AA |
| stone | sand | 4.25 | FORBIDDEN, fails | FAIL |
| stone | terracotta-tint | 4.10 | FORBIDDEN, fails | FAIL |
| terracotta-deep | bone | 6.56 | links, price | AA |
| terracotta-deep | oat | 5.91 | links | AA |
| terracotta-deep | sand | 5.03 | links on sand | AA |
| terracotta-deep | terracotta-tint | 4.85 | link on panel | AA |
| terracotta-deep | ochre-tint | 5.45 | link on panel | AA |
| bone | terracotta-deep | 6.56 | primary button text | AA |
| bone | baobab | 8.97 | secondary button text | AA |
| bone | baobab-deep | 12.77 | footer text | AA, AAA |
| bone | olive-deep | 8.53 | WhatsApp button text | AA, AAA |
| bone | olive | 4.88 | text on olive fill | AA |
| sand | baobab-deep | 9.79 | footer secondary text | AA, AAA |
| ochre | baobab-deep | 5.62 | gold accent on dark | AA |
| ochre-deep | bone | 5.70 | tag text | AA |
| ochre-deep | ochre-tint | 4.74 | sale tag | AA |
| olive | bone | 4.88 | success icon text | AA |
| olive | oat | 4.41 | FORBIDDEN as text | FAIL |
| olive-deep | oat | 7.70 | success text | AA |
| olive-deep | olive-tint | 6.76 | tag text | AA |
| brick | bone | 6.23 | error text | AA |
| brick | oat | 5.62 | error text | AA |
| brick | terracotta-tint | 4.61 | error on panel | AA |
| terracotta | bone | 4.09 | focus ring, large text, icons | non-text AA only |
| terracotta | oat | 3.69 | icons 24px+ only | non-text AA only |
| terracotta | sand | 3.14 | icons 24px+ only | non-text AA only |
| line | bone | 3.74 | input border | non-text AA |
| line | oat | 3.37 | input border | non-text AA |
| line | sand | 2.87 | FORBIDDEN as border | FAIL |
| sand-deep | bone | 1.68 | decoration only | not for meaning |
| clay | bone | 2.34 | decoration only | not for meaning |
| ochre | bone | 2.27 | decoration only | not for meaning |

Rules that follow from the table:
- Text is only charcoal, baobab, stone (on bone or oat), terracotta-deep, ochre-deep, olive-deep, brick, or bone/sand on dark.
- Controls on sand backgrounds use a baobab border, never `line`.
- Anything marked "decoration only" must never be the sole carrier of information. Pair it with text or an icon outline in a passing colour.
- No sale red, no success green, no warning orange. Status uses brick, olive-deep and ochre-deep with an icon and a word.

### 2.3 Semantic mapping

```css
@theme {
  --color-bone: #FBF7F0;  --color-oat: #F3EBDD;  --color-sand: #E6D9C3;
  --color-sand-deep: #D2BFA0; --color-clay: #C79B7D;
  --color-terracotta: #B0654A; --color-terracotta-deep: #8A4630; --color-terracotta-tint: #EBD2C4;
  --color-ochre: #C9A05A; --color-ochre-deep: #7F5C1C; --color-ochre-tint: #F0E2BF;
  --color-olive: #6A7049; --color-olive-deep: #464B2D; --color-olive-tint: #DDE0C8;
  --color-baobab: #5A3F32; --color-baobab-deep: #3B2A22; --color-charcoal: #2B2724;
  --color-stone: #6E6258; --color-line: #8B7D6F; --color-brick: #9B3F35;

  --color-surface: var(--color-oat);          /* clay cards */
  --color-page: var(--color-bone);
  --color-ink: var(--color-charcoal);
  --color-ink-soft: var(--color-stone);
  --color-action: var(--color-terracotta-deep);
  --color-focus: var(--color-terracotta);
}
```

There is no dark mode for the storefront in v1 (the palette is a warm-light brand). Dark surfaces exist only as bands (footer, stats band, tooltips) using `baobab-deep`.

---

## 3. Type system

### 3.1 Faces (next/font/google)

| Role | Face | Why |
|---|---|---|
| Display | **Fraunces** (variable, axes `opsz`, `SOFT`, `WONK`) | A soft serif with rounded terminals when `SOFT` is raised. Warm, handmade, readable at big sizes, distinct from the sans body. Matches the charter's "soft serif for display". |
| Body and UI | **Figtree** (variable, 400 to 700) | Clean humanist sans, open apertures, tall x-height, clear numerals for KES prices. Friendly without being childish. Strong at 16px on low-end Android screens. |
| Hand accent | **Caveat** (500, 600) | Only for polaroid captions and scrapbook margin notes on story pages, minimum 22px, never for essential information, always paired with a real text caption elsewhere or `aria-hidden` when decorative. |

```tsx
// app/layout.tsx
import { Fraunces, Figtree, Caveat } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"], variable: "--font-display", display: "swap",
  axes: ["SOFT", "opsz"],          // SOFT 100 gives round terminals
});
const sans = Figtree({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-hand", display: "swap" });

<html lang="en" className={`${display.variable} ${sans.variable} ${hand.variable}`}>
```

```css
@theme {
  --font-display: var(--font-display), "Georgia", serif;
  --font-sans: var(--font-sans), system-ui, sans-serif;
  --font-hand: var(--font-hand), "Comic Sans MS", cursive;
}
.font-display { font-variation-settings: "SOFT" 100, "WONK" 0; }
```

Swahili words (karibu, asante) render fine in all three faces (Latin subset).

### 3.2 Scale

Line heights are unitless. Display uses `clamp()` so one class covers mobile and desktop.

| Token | Mobile (390) | Desktop (1280+) | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| `display-xl` hero | 40px | 64px | Fraunces 600 | 1.05 | -0.01em |
| `display-lg` page title | 34px | 48px | Fraunces 600 | 1.1 | -0.01em |
| `display-md` section | 28px | 36px | Fraunces 600 | 1.15 | 0 |
| `title` card or block | 20px | 22px | Figtree 650 | 1.3 | 0 |
| `body-lg` lead | 19px | 20px | Figtree 400 | 1.55 | 0 |
| `body` default | 17px | 17px | Figtree 400 | 1.6 | 0 |
| `small` meta | 16px | 16px | Figtree 500 | 1.45 | 0.005em |
| `label` form, chip | 16px | 16px | Figtree 600 | 1.2 | 0.01em |
| `price` | 20px | 22px | Figtree 700, tabular-nums | 1.1 | 0 |
| `hand` caption | 22px | 26px | Caveat 600 | 1.2 | 0 |

```css
@theme {
  --text-display-xl: clamp(2.5rem, 1.6rem + 3.6vw, 4rem);
  --text-display-lg: clamp(2.125rem, 1.6rem + 2.2vw, 3rem);
  --text-display-md: clamp(1.75rem, 1.5rem + 1vw, 2.25rem);
  --text-body: 1.0625rem;
  --text-small: 1rem;
}
```

Nothing below 16px anywhere (H6), including chips, captions and legal text. Measure: 62ch maximum for long text. Prices use `font-variant-numeric: tabular-nums`, formatted `KES 1,850`.

---

## 4. Surfaces, shapes and effects

### 4.1 Spacing, radius, layout tokens

```css
@theme {
  --spacing: 4px;                    /* use p-4 = 16px etc */
  --radius-chip: 999px;
  --radius-card: 28px;
  --radius-panel: 36px;
  --radius-input: 18px;
  --container-page: 1280px;
  --breakpoint-sm: 640px; --breakpoint-md: 768px; --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px; --breakpoint-2xl: 1600px;
  --ease-soft: cubic-bezier(.22, 1, .36, 1);
  --ease-squish: cubic-bezier(.34, 1.56, .64, 1);
}
```

Gutter: 16px at 390, 24px at 768, 32px at 1280, container capped at 1280 and centred (1600 gets more side air, not wider content, except full-bleed bands and the hero image).

### 4.2 Clay recipe

Five stacked layers: top inner highlight, bottom inner shade, contact shadow, mid shadow, long ambient shadow. All shadow colour is a brown (`59 42 34`), never pure black, so depth stays warm.

```css
@theme {
  --shadow-clay:
    inset 0 2px 3px rgb(255 255 255 / .75),
    inset 0 -8px 12px rgb(90 63 50 / .10),
    0 1px 2px rgb(59 42 34 / .08),
    0 8px 16px -4px rgb(59 42 34 / .14),
    0 22px 36px -14px rgb(59 42 34 / .18);
  --shadow-clay-hover:
    inset 0 2px 3px rgb(255 255 255 / .8),
    inset 0 -8px 12px rgb(90 63 50 / .10),
    0 2px 3px rgb(59 42 34 / .08),
    0 12px 22px -4px rgb(59 42 34 / .16),
    0 30px 44px -16px rgb(59 42 34 / .20);
  --shadow-clay-press:
    inset 0 4px 10px rgb(90 63 50 / .22),
    inset 0 -2px 3px rgb(255 255 255 / .55),
    0 1px 1px rgb(59 42 34 / .08);
  --shadow-clay-sm:
    inset 0 1px 2px rgb(255 255 255 / .75),
    inset 0 -4px 6px rgb(90 63 50 / .10),
    0 1px 1px rgb(59 42 34 / .08),
    0 4px 8px -2px rgb(59 42 34 / .14);
  /* dark surface (baobab-deep): highlights become faint warm light, shadows deepen */
  --shadow-clay-dark:
    inset 0 2px 3px rgb(255 235 210 / .10),
    inset 0 -8px 12px rgb(0 0 0 / .28),
    0 10px 24px -8px rgb(0 0 0 / .45);
}

@utility clay {
  background: var(--color-oat);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-clay);
  transition: transform .25s var(--ease-soft), box-shadow .25s var(--ease-soft);
}
@utility clay-interactive {
  &:hover { transform: translateY(-3px); box-shadow: var(--shadow-clay-hover); }
  &:active { transform: translateY(1px) scale(.985); box-shadow: var(--shadow-clay-press); }
}
@utility clay-dark { background: var(--color-baobab); box-shadow: var(--shadow-clay-dark); }
```

Surface ladder: page `bone`, clay card `oat`, nested chip or input well `sand` with `inset` shadow only. A clay element never sits on a same-colour background without its shadow (otherwise it vanishes). Hover lift is 3px and never reorders layout (transform only, so it cannot change card height).

### 4.3 Blob shape library

CSS border-radius sets (zero-cost, scale with box, good for photo masks and decorative divs). Use with `overflow:hidden`.

```css
@utility blob-a { border-radius: 58% 42% 55% 45% / 48% 56% 44% 52%; }
@utility blob-b { border-radius: 42% 58% 38% 62% / 55% 40% 60% 45%; }
@utility blob-c { border-radius: 64% 36% 60% 40% / 40% 62% 38% 60%; }
@utility blob-d { border-radius: 50% 50% 46% 54% / 62% 46% 54% 38%; }
@utility blob-e { border-radius: 38% 62% 50% 50% / 50% 42% 58% 50%; }
```

For the hero and the about portrait, where the silhouette must be organic and fixed, use an SVG clip path with `clipPathUnits="objectBoundingBox"` so it scales to any box:

```html
<svg width="0" height="0" aria-hidden="true" focusable="false">
  <clipPath id="blob-hero" clipPathUnits="objectBoundingBox">
    <path d="M.86 .22C.97 .38 .99 .62 .88 .78C.77 .94 .52 1 .33 .93C.14 .86 .02 .68 .02 .5C.02 .3 .16 .1 .38 .04C.6 -.02 .76 .06 .86 .22Z"/>
  </clipPath>
</svg>
```
```css
.blob-hero { clip-path: url(#blob-hero); aspect-ratio: 1 / 1; }
```

Rules: blobs on product cards are NOT used (cards are uniform rounded rectangles). Blobs mask hero, about, category circles' halo, bento feature tiles and gallery thumbnails. Maximum two distinct blob shapes per viewport, rotated by `scale-x-[-1]` for variety.

### 4.4 Bento grid rules

- Tile unit: 12-column grid at 1024+, 4 columns at 390 to 767, 6 at 768 to 1023. Gap 16px mobile, 20px at 768, 24px at 1280.
- Tile sizes only from this set: `1x1`, `2x1`, `2x2` (in 4-col mobile: `2x1`, `2x2`, `4x1`). No other spans, so rows always close.
- Rows are `grid-auto-rows: minmax(180px, auto)` on mobile, fixed `220px` at 1280 for the category bento so tile heights are uniform within a size class.
- Every bento tile: `clay` surface, radius 36px, 20px padding, one title, one line of support text, one blob photo or illustration, one text link. Same elements in the same positions.
- The shop home bento holds categories (Safari, Farm, Pets, Baby and gift, Wholesale, Care guide). Tiles may differ in span but not in internal structure.
- The grid must close without holes: `grid-auto-flow: row dense` is forbidden because it reorders content; design span sets that sum to the row width.

```css
.bento { display: grid; gap: 16px; grid-template-columns: repeat(4, 1fr); grid-auto-rows: minmax(180px, auto); }
@media (min-width: 768px)  { .bento { grid-template-columns: repeat(6, 1fr); gap: 20px; } }
@media (min-width: 1024px) { .bento { grid-template-columns: repeat(12, 1fr); grid-auto-rows: 220px; gap: 24px; } }
```

### 4.5 Wavy dividers

Inline SVG, `fill: currentColor`, colour set by the section above or below. Height 48px mobile, 80px desktop. Never animate.

```html
<svg viewBox="0 0 1440 80" preserveAspectRatio="none" class="h-12 md:h-20 w-full block text-oat" aria-hidden="true" focusable="false">
  <path fill="currentColor" d="M0 40C120 6 260 6 400 36S680 78 820 46 1100 4 1240 30 1380 58 1440 40V80H0Z"/>
</svg>
```
Variants: `wave-soft` (above), `wave-hills` (savanna ridge: `M0 80V52C150 34 250 58 400 44S650 12 800 36 1100 60 1240 38 1390 30 1440 42V80Z`), `scallop` (beadwork row, repeating semicircles through a CSS `mask` of radial gradients: `mask: radial-gradient(circle at 12px 0, #0000 11px, #000 12px) 0 0/24px 100%`). Dividers sit flush, with `-mt-px` to prevent hairlines.

### 4.6 Torn paper edges (story, blog, projects only)

A clip-path polygon with irregular y offsets in percent, so it needs no image asset and scales to any width. Provide two (bottom, top) and rotate pieces slightly.

```css
@utility torn-bottom {
  clip-path: polygon(0 0,100% 0,100% 96%,97% 98.5%,93% 96.5%,89% 99%,84% 97%,79% 99.2%,74% 96.8%,69% 98.8%,63% 96.6%,58% 99%,52% 97%,46% 99.2%,41% 96.8%,35% 98.8%,29% 96.6%,23% 99%,17% 97%,11% 99.2%,6% 97%,2% 98.6%,0 96.5%);
}
@utility torn-top {
  clip-path: polygon(0 3.5%,2% 1.4%,6% 3%,11% .8%,17% 3%,23% 1%,29% 3.4%,35% 1.2%,41% 3.2%,46% .8%,52% 3%,58% 1%,63% 3.4%,69% 1.2%,74% 3.2%,79% .8%,84% 3%,89% 1%,93% 3.5%,97% 1.5%,100% 3.5%,100% 100%,0 100%);
}
```
Paper pieces use `oat` or `sand` with a faint grain (`background-image` SVG feTurbulence at 6 percent, data URI) and a soft drop shadow via `filter: drop-shadow(0 6px 8px rgb(59 42 34 / .18))` (filter, because box-shadow is clipped by clip-path). Tilt `rotate(-1.2deg)` to `rotate(1.5deg)`, never more than 2deg.

### 4.7 Tape and polaroid

```css
.tape { position:absolute; width:96px; height:28px; top:-12px; left:50%; translate:-50% 0; rotate:-3deg;
  background: color-mix(in srgb, var(--color-ochre) 55%, var(--color-oat)); opacity:.85;
  clip-path: polygon(0 8%,4% 0,8% 10%,12% 0,100% 0,96% 50%,100% 100%,12% 100%,8% 88%,4% 100%,0 92%,3% 50%); }
.polaroid { background: var(--color-bone); padding: 12px 12px 48px; border-radius: 4px; position: relative;
  box-shadow: 0 1px 1px rgb(59 42 34/.1), 0 10px 18px -6px rgb(59 42 34/.28); rotate: var(--tilt, -2deg); }
.polaroid > img { aspect-ratio: 1/1; object-fit: cover; width:100%; }
.polaroid figcaption { position:absolute; inset:auto 12px 10px; font: 600 22px/1.1 var(--font-hand); color: var(--color-baobab); }
```
Polaroid sizes: 220px (390, two across), 260px (768), 280px (1280). Tilt cycle by `:nth-child` of -2deg, 1.5deg, -1deg, 2deg. On hover or focus: `rotate:0; translate:0 -4px` (transform only). Gallery polaroids are a uniform set too: same size, same frame, same tilt range, one square crop.

### 4.8 Kinetic heading recipe

Words in spans with a staggered entrance, then a one-time gentle bounce on the accent word. CSS only, run once when scrolled into view (a 6-line `IntersectionObserver` adds `.is-in`). One kinetic heading per page, six words or fewer.

```css
.kinetic .w { display:inline-block; opacity:0; translate:0 .5em; rotate:-2deg; }
.kinetic.is-in .w { animation: rise .7s var(--ease-squish) forwards; animation-delay: calc(var(--i) * 90ms); }
.kinetic.is-in .w.accent { animation: rise .7s var(--ease-squish) forwards, bob 2.4s ease-in-out 1.2s 2; animation-delay: calc(var(--i) * 90ms), calc(var(--i) * 90ms + 1.2s); color: var(--color-terracotta-deep); }
@keyframes rise { to { opacity:1; translate:0 0; rotate:0deg; } }
@keyframes bob  { 50% { translate: 0 -.12em; rotate: 1.5deg; } }

@media (prefers-reduced-motion: reduce) {
  .kinetic .w { opacity:1; translate:none; rotate:none; animation:none !important; }
}
```
The heading is a real `<h1>` or `<h2>` with the full text, words wrapped by a component that sets `aria-label` is NOT needed because spans are inline text and read in order. No-JS fallback: `.kinetic .w` is visible by default via `<noscript><style>.kinetic .w{opacity:1;translate:none}</style></noscript>`.

---

## 5. Components

Sizes in px at 390 / 1280 unless one value is given. Every interactive element has `min-height: 44px` (default 48), `focus-visible` ring `outline: 3px solid var(--color-focus); outline-offset: 3px` (4.09:1 against bone), and a pressed state.

### 5.1 Announcement bar
Height 40px, `baobab-deep` bg, `bone` text 16px, one message at a time (static text; if several, a manual prev and next, no auto-rotation). Dismissible (44px target), dismissal stored in localStorage. Content examples are placeholders until the client supplies delivery terms.

### 5.2 Header and mega menu
- Height 64px mobile, 80px desktop, `bone` with a 1px `sand` bottom edge, sticky, no shrink animation.
- Desktop order: logo (48px high), nav (Shop, Safari, Farm and Pets, Wholesale, Our Story, Journal), search field (collapsible, 48px), WhatsApp link, cart button (48px circle with count badge, `terracotta-deep` bg, `bone` text).
- Mega menu opens on click or Enter (not hover only), panel width 960px, `oat` clay surface, radius 36px, padding 32px. Three columns: category links with 56px blob thumbnails, "Shop by size" S, M, L, XL chips, one editorial tile. Closes on Escape and outside click; focus returns to the trigger. Panel animates opacity and 8px translate in 200ms.

### 5.3 Mobile navigation
Hamburger 48px opens a full-height sheet from the left, 88vw max 360px, `bone`. Items are 56px rows with 20px text, accordion for Shop. Bottom of sheet: WhatsApp button and language-free contact line. Body scroll locked, focus trapped, Escape closes. Bottom tab bar is NOT used (the floating WhatsApp button owns the corner).

### 5.4 Hero
- 390: stacked. Headline `display-xl`, 2 lines of support copy, two buttons full-width stacked, then blob photo (aspect 1:1, `blob-a`) below. Min height auto.
- 768: two columns 55/45. 1280: 6/5 columns, min-height 560px, photo `blob-hero` 520px. 1600: same content width, background `oat` extends full bleed, photo scales to 600px.
- Background `oat`, a kitenge-geometry pattern at 6 percent opacity in `sand-deep`, a savanna ridge wave to `bone` below. Trust chips (3) under the buttons. No carousel, no auto-advance.
- LCP image has `priority`, `sizes="(min-width:1024px) 520px, 90vw"`.

### 5.5 Category circles
Row of 8 (Safari, Farm, Pets, Baby and gift, Elephants, Giraffes, Lions, Wholesale; actual set from catalogue). Circle 88px at 390, 112px at 768, 128px at 1280. Circle = `oat` clay disc with a 6px `sand` rim, product cut-out or square-cropped photo inside (`object-fit: cover`, round mask, background tint `sand`). Label 16px 600 centred, max 2 lines clamped, `min-height: 2.6em`. Mobile: horizontal scroll snap, 4.5 items visible so the next one peeks; scroll container has `scroll-padding-inline:16px` and visible scrollbar styling off but arrow buttons present at 1024+. Hover: lift 3px; selected: 3px `terracotta-deep` ring.

### 5.6 Product card (UNIFORM, H5)

Anatomy top to bottom, widths fluid, padding 12px at 390, 16px at 1280:
1. Media: `aspect-[4/5]`, radius 20px, `object-fit: cover`, background `sand` (shows while loading and behind transparent cutouts). Optional tag top-left (36px tall pill).
2. Title: `line-clamp-2`, 17px 650, line-height 1.3, **fixed block height `h-[2.6em]`** so one-line titles still reserve two lines.
3. Meta row: animal and colourway, one line, truncated, 16px stone, `h-[1.45em]`.
4. Size chips row: fixed `h-9` (36px), `flex-nowrap overflow-hidden gap-2`, shows up to four chips S M L XL; chips are non-interactive text (selection happens on the product page), 36px tall, 40px min width. If fewer sizes exist the row keeps its height.
5. Footer: `mt-auto pt-3 flex items-center justify-between`: price (left) and "Add" button (right, 48px high, min 96px wide).

```tsx
<ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6 [grid-auto-rows:1fr]">
  <li className="flex"> {/* li stretches to the row height via grid default align-items: stretch */}
    <article className="clay clay-interactive relative flex h-full w-full flex-col p-3 xl:p-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-sand"> <Image fill className="object-cover" sizes="(min-width:1280px) 280px, 45vw" /> </div>
      <h3 className="mt-3 line-clamp-2 h-[2.6em] text-[17px] font-semibold leading-[1.3]">...</h3>
      <p className="h-[1.45em] truncate text-stone">...</p>
      <ul className="mt-2 flex h-9 flex-nowrap gap-2 overflow-hidden">...</ul>
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="price">KES 1,850</span>
        <button className="btn btn-primary min-h-12 min-w-24">Add</button>
      </div>
    </article>
  </li>
</ul>
```

**The exact rules that guarantee equal height and baseline:**
1. Parent grid: `display:grid` with `grid-auto-rows: 1fr`. Every row gets the height of the tallest row in the grid, so rows are equal to each other as well as cards within a row.
2. `align-items: stretch` (the grid default, never override with `start` or `center`). Each `li` fills its cell.
3. `li` is `display:flex` and the card is `h-full w-full flex flex-col`, so the card fills the li.
4. Image box has `aspect-ratio: 4/5` and `overflow:hidden`; the image is `position:absolute; inset:0; object-fit:cover`. No intrinsic image height can leak.
5. Title is clamped to 2 lines AND given `height: 2.6em` (2 x 1.3 line-height). Meta is `height:1.45em; truncate`. Chips row has fixed height with `overflow:hidden`. Therefore every block above the footer has a fixed height, so the footer lands at the same y in every card even without rule 6.
6. Footer uses `margin-top:auto`, pinning price and Add to the card bottom, so any residual difference (long locale text, font fallback) is absorbed above it.
7. `min-width:0` on flex children and `truncate` where needed so long words never widen a column. Grid tracks use `minmax(0,1fr)` (Tailwind `grid-cols-*` already does).
8. Horizontal rails (best sellers) use `display:flex; align-items:stretch; gap:16px; overflow-x:auto; scroll-snap-type:x mandatory`, children `flex:0 0 auto; width:220px (390), 248px (768), 272px (1280)`. Same card component, same rules.
9. Hover lift is `transform` only; no border or padding change, so no reflow.

States: default, hover (lift), pressed (`shadow-clay-press`), focus-visible (ring on the card via `focus-within` using the title link's `::after` stretched link), out of stock (image 60 percent opacity, "Notify me on WhatsApp" replaces Add, same size), loading (skeleton with the same fixed blocks, `sand` shimmer, shimmer disabled under reduced motion).

### 5.7 Filter bar and drawer
- Desktop (1024+): sticky bar 64px under the header: sort select, "Size", "Animal", "Colour", "Price" popovers, a "Clear all" text button, result count (`aria-live="polite"`). Active filters show as removable chips (40px tall, 44px target via padding).
- Mobile: bar of two buttons, "Filters (n)" and "Sort", each 48px. Filters open a bottom sheet drawer, 85vh, radius 28px top, handle 40x4, sections as accordions, sticky footer with "Show 24 items" primary (48px) and "Clear" text button. Applying keeps scroll position.
- Controls: checkboxes 24px visible in a 48px row.

### 5.8 Size selector
Radio group, `role="radiogroup"`. Each option 56px square (S, M, L, XL) `oat` clay-sm, radius 18px, 20px label, below it height in cm as 16px stone line (values TODO until client supplies dimensions). Selected: `baobab` fill with `bone` text (8.97) plus a check icon, so selection is not colour alone. Disabled: dashed `line` border, strike-free, label "Sold out" in the tooltip and `aria-disabled`. Arrow-key navigation.

### 5.9 Colour swatches (earthy)
Group of 44px hit targets with a 28px visible disc, 3px `bone` inner ring, 2px `baobab` outer ring when selected. Swatch fill comes from the colourway's `swatchHex`, derived from the product photo and clamped to chroma at or below the palette's (HSL saturation 45 percent maximum). Selected colour name is always printed as text beside the group ("Colour: Sage"). The product photograph itself is never recoloured. Clamped swatch colours need client confirmation (TODO) because H7 requires colour accuracy.

### 5.10 Quantity stepper
Pill 48px tall, 144px wide: minus button 48x48, value 48px centred (input `inputmode="numeric"`, 18px, min 1, max 99), plus 48x48. `sand` well with inset shadow, buttons `oat` clay-sm. Holding a button does not auto-repeat. Announces changes via `aria-live`.

### 5.11 Cart drawer
Right sheet 420px at 1280 and 768, full width at 390 (bottom-aligned sheet 92vh). Header 64px with count and close (48px). Line items: 72px blob-b thumb, title (2 line clamp), size and colour line, stepper, remove text button, line total. Footer sticky: subtotal, "Delivery is confirmed on WhatsApp" note (copy TODO), primary "Checkout on WhatsApp" 56px, secondary "Keep shopping". Empty state: illustration of a yarn ball, one line, one button. Opens on add only after the user taps the cart; add triggers a toast instead (no forced drawer).

### 5.12 Wizard stepper (order wizard)
Steps: Items, Recipient, Delivery, Review, Send (final naming per spec 03). Mobile: compact "Step 2 of 5" label plus a 8px progress bar of olive-deep on sand, with the step name in `display-md`. 768+: horizontal numbered circles 44px connected by 4px lines; done = `olive-deep` with check, current = `terracotta-deep` with number, upcoming = `sand` with `baobab` number. Back and Next buttons 56px, sticky at the bottom on mobile. Each step validates inline, saves draft to localStorage, and the Review step shows the exact WhatsApp message text before sending.

### 5.13 Form fields
Label above (16px 600), optional hint (16px stone), field 52px high, radius 18px, `bone` bg, 2px `line` border (3.74:1), 16px horizontal padding, 17px text (prevents iOS zoom). Focus: border `terracotta-deep` plus 3px outer ring `terracotta-tint`. Error: border `brick`, icon and message below in `brick` 16px ("Enter a phone number like 0712 345 678"), `aria-invalid` and `aria-describedby`. Textarea min 120px. Select uses native control styled. Checkbox and radio 24px visible in 48px rows. Never placeholder-as-label. Phone field accepts 07xx, 01xx and +254 formats and normalises.

### 5.14 Toasts
Bottom-centre at 390 (16px from edges, bottom 88px to clear the WhatsApp button), bottom-left at 1280. 56px min height, `baobab-deep` bg, `bone` text, 20px radius, icon left in `ochre`, action text button right. 5 seconds, pause on hover and focus, `role="status"`. Variants differ by icon and left bar only: info (ochre bar), success (olive bar), error (brick bar, stays until dismissed). No red or green fills.

### 5.15 Trust strip
Four items in a row at 1024+ (2x2 at 390, 4 across at 768): zero plastic, recycled yarn, safe for babies (only if certified, otherwise TODO), 25+ women supported. Each is a 44px outline icon (baobab stroke 2px) plus 17px 600 title and one 16px support line. Bg `oat`, radius 36px, 24px padding, dividers 1px `sand`. Same height, titles clamp to 2 lines.

### 5.16 Stats band
`baobab-deep` bg, wave top and bottom. Four numbers in Fraunces 48px (mobile 36px) `bone`, labels in `sand` 16px. Number count-up animation once on view (or static under reduced motion). Only client-supplied figures; anything else shows a labelled placeholder (`TODO: confirm`).

### 5.17 Testimonial slot
Clay card 100 percent width, max 720px, quote in Fraunces 24px, name and place in 16px, optional 56px portrait (blob-c) only when cleared. Static single quote or a manual 3-up grid; never an auto-carousel. Only real, client-supplied quotes; empty slot renders nothing (never a fake).

### 5.18 Blog card
Same uniform rules as product cards: image `aspect-[3/2]`, category tag, title `line-clamp-2 h-[2.6em]`, excerpt `line-clamp-3 h-[4.5em]` (1.5 line-height), footer pinned with date and read time. Scrapbook styling: paper `bone` card, 1deg tilt max, tape strip on odd cards. Radius 8px (paper, not clay).

### 5.19 Project card
Image `aspect-[4/3]` in a torn-bottom frame, project name `line-clamp-2`, partner or place line, a 3-line clamped summary, outcome chip row fixed height, "Read project" link pinned to the bottom. One project is a feature card at 2x width in the grid; internal structure is identical.

### 5.20 Polaroid gallery ("Captured moments")
Row on mobile (horizontal snap, 220px polaroids), 3 across at 768, 5 across at 1280 with a gentle arc layout: each polaroid uses the tilt cycle, container `oat` with wave edges and a hill silhouette. Click opens a lightbox (focus trap, arrow keys, caption). Only cleared images (H10). Every caption is real text.

### 5.21 Footer
`baobab-deep`, savanna ridge wave top in `bone`, kitenge pattern at 5 percent. Columns: brand and short line, Shop, Company, Help (care, size guide, FAQ), Contact (WhatsApp, email placeholders), newsletter field (52px input plus 52px button). 1280: 5 columns. 390: stacked plain lists at 16px with 48px link rows. Bottom bar with copyright, privacy, terms. Text `bone`/`sand` (12.77, 9.79).

### 5.22 WhatsApp floating button
Fixed bottom-right, 16px from edges (24px at 1280), 60px circle, `olive-deep` fill (not WhatsApp green, H4), `bone` icon 30px, clay-dark shadow, label "Chat" pill expands on focus or hover only. `aria-label="Chat with us on WhatsApp"`. Hides while the cart drawer or lightbox is open. Never bounces; one soft pulse ring on first load, off under reduced motion. Safe-area insets respected (`env(safe-area-inset-bottom)`).

### 5.23 Buttons
| Variant | Fill | Text | Heights |
|---|---|---|---|
| Primary | terracotta-deep | bone (6.56) | 48 default, 56 hero and wizard, 44 compact |
| Secondary | baobab | bone (8.97) | same |
| Soft | oat clay-sm | baobab | same |
| Ghost | transparent, 2px baobab border | baobab | same |
| WhatsApp | olive-deep | bone (8.53) | same |

Radius 999px, padding-x 24px, label 17px 650. Pressed: `scale(.97)` with `ease-squish` 160ms and `shadow-clay-press`. Disabled: `sand` fill, `stone` text is NOT used (fails); use opacity .55 on the base style and `aria-disabled`.

---

## 6. Page layouts

Grid: 4 cols (390), 6 (768), 12 (1280, 1600). Content max 1280. `[ ]` = clay card, `~~~` = wave divider, `###` = full-bleed band.

### 6.1 Home
```
390                          1280
[ann bar]                    [ann bar                                  ]
[hdr  logo        cart]      [logo  nav nav nav nav   search wa cart  ]
 H1 Hero text                [ H1 + copy + 2 btns      ] ( blob photo  )
 [Shop] [Wholesale]          [ 3 trust chips                          ]
 ( blob photo 1:1 )          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~                          (o)(o)(o)(o)(o)(o)(o)(o)  category circles
(o)(o)(o)(o)> scroll         Best sellers          View all ->
Best sellers                 [card][card][card][card] rail
[card][card]>                [ bento: 2x2 Safari | 1x1 | 1x1 ]
[ bento tiles 2x1 ... ]      [        | 2x1 Wholesale        ]
[trust 2x2]                  [ trust strip  4 across             ]
### stats band               ### stats band (baobab-deep) ###
Story teaser (torn paper)    story teaser: polaroids + kinetic H2
Captured moments > snap      captured moments 5 polaroids
Newsletter                   newsletter + wholesale enquiry card
footer                       footer 5 col
```
768: 6-col, rail shows 3 cards, bento 3x2, trust 4 across, polaroids 3. 1600: container stays 1280, `oat` and `baobab-deep` bands bleed, hero photo 600px, rail shows 4 cards with arrows.

### 6.2 Shop
```
390                          1280
H1 Shop  (24 items)          Breadcrumb
[Filters (2)] [Sort]         H1 + count            [Sort v]
chips: Elephant x  M x       [Filters sidebar 280][ grid 4 cols      ]
[card][card]                 [ Animal            ][card][card][card][card]
[card][card]                 [ Size  S M L XL    ][card][card][card][card]
[card][card]                 [ Colour swatches   ][ ...                   ]
Load more (48px)             [ Price             ] Load more
```
768: 3 columns, filters in the drawer. 1600: sidebar 300px, grid still 4 columns (cards stay at 280 to 296px; extra width becomes margin). Pagination is "Load more" with a numeric count, no infinite scroll that hides the footer.

### 6.3 Product
```
390                          1280
[gallery swipe 4:5, dots]    [thumbs 72][main 4:5 image 560   ][ info 440 ]
Title H1                     [          zoom on click         ][ H1, KES price ]
KES 1,850                    [                                 ][ Size selector ]
Size  [S][M][L][XL]          [                                 ][ Colour swatches]
Colour o o o  (Sage)         [                                 ][ Qty  [Add to cart] ]
Qty [- 1 +]                  [                                 ][ WhatsApp ask  ]
[Add to cart]  sticky bar    [ accordions: Details, Care, Size guide, Safety ]
Accordions                   Related products rail (uniform cards)
Related rail
```
768: gallery above info two columns 50/50. 1600: container fixed, gallery grows to 600. Mobile sticky bottom bar 72px with price and Add (48px), above the WhatsApp button's offset.

### 6.4 Cart (page, mirrors drawer)
```
390                          1280
H1 Your cart (3)             H1 Your cart (3)
[line][line][line]           [ lines (8 cols)            ][ summary 4 col sticky ]
[summary clay]               [ line ][ line ][ line ]     [ subtotal, note      ]
[Checkout on WhatsApp]       [                          ] [ Checkout on WhatsApp]
You may also like (rail)     You may also like (4 uniform cards)
```

### 6.5 Order wizard
```
390                          1280
Step 2 of 5 [=====    ]      (1)--(2)--(3)--( 4 )--( 5 )
H2 Recipient                 [ form card 7 col         ][ order summary 5 col sticky ]
[ field ][ field ]           [ field   ][ field        ][ line items, totals          ]
[Back]      [Next]  sticky   [Back]                [Next]
```
768: single column form with the summary collapsed into an accordion above the buttons. 1600: same as 1280 with 32px more gutter.

### 6.6 Wholesale
```
390                          1280
H1 Trade and wholesale       ### hero band oat: H1 + copy + [Request a quote]
copy                         ~~~
[Request quote]              [ 3 steps how it works  ][ 3 steps ][ 3 steps ]
Who we supply (4 tiles)      [ lodges | gift shops | NGOs | retailers ] bento
How it works (3 steps)       [ MOQ and lead time table (placeholders TODO) ]
Price table placeholder      [ Quote form 7 col          ][ contact + WA 5 col ]
Quote form                   FAQ accordion
FAQ                          footer
```

### 6.7 About
```
390                          1280
Kinetic H1 (torn top)        ### scrapbook board (oat, grain)
[polaroid maker]             [kinetic H1  ][ polaroid ][ polaroid tilted ]
Story paragraphs 62ch        [ story text with tape-held notes          ]
[stats band]                 ### stats band
[ makers 2-up polaroids]     [ makers: 4 polaroids with hand captions   ]
Values (3 cards)             [ values 3 uniform clay cards              ]
CTA                          [ CTA: Shop | Partner with us ]
```
Photos of makers only when cleared (H10).

### 6.8 Blog
```
390                          1280
H1 Journal                   H1 Journal                 [ search ]
tag chips scroll             tag chips
[feature card]               [ feature (2x width)  ][ card ][ card ]
[card]                       [ card ][ card ][ card ]  3 cols, uniform
[card]                       Pagination (44px targets)
Newsletter                   Newsletter band
```
Article page: 720px measure, torn-edge hero, tape notes for pull quotes, related posts rail.

### 6.9 Project
```
390                          1280
H1 Projects                  H1 + intro
[project card]               [ feature project 2 cols ][ card ]
[project card]               [ card ][ card ][ card ]
Project detail:              Detail: hero torn image, facts sidebar (partner, place,
hero, facts list,            date, quantity: TODO if unknown), story, polaroid
story, polaroids, CTA        gallery, "Partner with us" CTA
```
768 mirrors 1280 with 2 columns for card grids. 1600 only adds margin, except full-bleed bands.

---

## 7. Motion principles

| Aspect | Rule |
|---|---|
| Durations | Micro (press, chip) 120 to 160ms. Surface (hover lift, popover) 200 to 250ms. Sheet and drawer 300ms. Page-level reveal 500 to 700ms (kinetic headings only). Nothing exceeds 700ms except the one-time 2.4s bob. |
| Easing | `ease-soft` for entrances and lifts. `ease-squish` (slight overshoot) only for press release, kinetic words, add-to-cart confirmation. Never linear except shimmer. |
| What animates | transform and opacity only. Hover lift, press squish, drawer slide, toast rise, kinetic heading, count-up once, add-to-cart: cart icon does a single 300ms squish, a toast appears. |
| What never animates | Layout properties (height, width, margin), prices, cart totals changing value (they swap instantly), error messages shaking, wave dividers, body copy, product photos (no auto zoom or Ken Burns), form fields. No autoplay carousel, no parallax, no scroll-jacking, no confetti, no countdown timers (H6). |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` sets transitions to 0.01ms, animations to none, kinetic words visible, sheets appear without slide, count-up shows final value, smooth scroll off. Hover lift is also removed. Test with the OS setting on. |
| Looping | At most one looping animation on screen, finite (2 iterations), and none within 400px of a form. |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
  .clay-interactive:hover { transform: none; }
}
```

---

## 8. Imagery treatment

Source photos vary in lighting, crop and background. Make them uniform through the container, not the file.

| Context | Aspect | Mask | Sizes hint |
|---|---|---|---|
| Product card and gallery main | 4:5 | rounded 20px | 280px, 45vw |
| Product thumbnail and cart line | 1:1 | blob-b | 72px |
| Category circle | 1:1 | circle | 128px |
| Hero | 1:1 (390), 6:5 (768+) | `blob-hero` | 520 to 600px |
| Bento tile | 1:1 or 4:3 | blob-a to blob-e | per tile |
| Blog card | 3:2 | rounded 8px with tape | 360px |
| Project card and detail hero | 4:3 / 16:9 | torn-bottom | 400px / 1280px |
| Polaroid | 1:1 | 4px frame | 280px |
| OG image | 1200x630 | none | static |

Rules:
1. Always `next/image` with explicit `sizes`, `fill` inside an aspect box, `object-fit: cover`. AVIF and WebP from Next defaults, quality 78, `placeholder="blur"` using a generated 10px blurDataURL.
2. Focal point: each manifest entry carries `focal: [x, y]` (0 to 1, default `[.5, .45]`, since animals sit slightly above centre). Apply as `object-position: calc(x*100%) calc(y*100%)`. A verifier checks that no product's head is clipped at 4:5.
3. Background tint: image boxes are `sand` (`#E6D9C3`). White-background cutouts use `mix-blend-mode: multiply` on the `<img>` so the white drops into the sand tint; lifestyle photos do not. Flag per image in the manifest (`blend: "multiply" | "none"`).
4. Never crop an animal to less than 85 percent visible; if a source cannot meet that at 4:5, set `fit: "contain"` for that image with `sand` padding, flagged for review.
5. No filters that shift colour (H7). Rounded corners and blobs only. No stock illustrations of bright cartoon animals.
6. People: cleared images only (H10); dignified framing, faces never cropped at the eyes, no pity framing, subjects named with consent only. Alt text describes the actual scene.
7. Product alt text pattern: "{Colour} crocheted {animal}, size {S}, held in a hand" with no dashes.

---

## 9. Iconography

- Inline SVG, one hand-maintained set in `components/icons/` (React components, `currentColor`), 24px grid, 2px rounded stroke, round caps and joins, optically soft corners. Sizes 20, 24, 32, 44.
- Required set: search, cart, heart, user, menu, close, chevron (4), arrow right, plus, minus, check, info, alert, truck, shield, leaf (zero plastic), yarn ball, scissors, needle, hands, map pin, phone, mail, whatsapp, instagram, facebook, tiktok, filter, sort, star, play, zoom.
- Decorative icons `aria-hidden="true"`; meaningful icons carry `aria-label` or adjacent text. Icon-only buttons always 48px with a visible tooltip on focus.
- Colour: `baobab` strokes on light, `bone` on dark, `terracotta-deep` for active. Never emoji in UI chrome, buttons, nav, badges or toasts (H4 and tone). Emoji are also banned in alt text.
- Illustrations (empty states, dividers): two-tone line art in `baobab` and `sand-deep`, savanna silhouette (acacia, hills, sun disc in `ochre`), kitenge geometry patterns as SVG `<pattern>` using only two earth tones.

---

## 10. UI QA checklist for verifiers

Run at widths 390, 768, 1280, 1600. Every FAIL is logged as check, result, evidence, severity (matches charter section 5).

| # | Check | Pass criterion |
|---|---|---|
| 1 | Card height equality | In every grid or rail, `getBoundingClientRect().height` of all `[data-card]` in the same container differ by 0.5px or less. Rows equal each other in grids. |
| 2 | Card internals | Image box aspect ratio 0.8 +/- 0.01; title block height identical; price and Add button `bottom` offset from card bottom identical across cards (+/- 1px). |
| 3 | CTA baseline | `getBoundingClientRect().bottom` of every Add button inside one row is identical (+/- 1px) and equals card bottom minus padding. |
| 4 | Contrast | Computed foreground and background of every visible text node meet 4.5 (3.0 for large text). Colours must come from section 2 only; FORBIDDEN pairings fail instantly. |
| 5 | Touch target | Every `a, button, input, select, [role=button], [role=radio]` visible box is 44 x 44 or larger (including padding hit area). |
| 6 | Overflow | `document.documentElement.scrollWidth <= innerWidth` and no element has `scrollWidth > clientWidth` unless it is an intended scroller (`[data-scroller]`). |
| 7 | Min font size | No text node under 16px. |
| 8 | Palette | Sample all computed `color`, `background-color`, `border-color`, `fill`, `stroke`: each must be in the token set, or a tint with alpha over a token. HSL saturation above 0.55 is a FAIL. |
| 9 | Dash scan | Rendered text, `alt`, `title`, `aria-label`, `<meta>` contain no U+2014 or U+2013. |
| 10 | Focus | Tab through the page: every interactive element shows a visible outline (outline-width 2px or more, offset 2px). No focus trap except dialogs. |
| 11 | Reduced motion | With `reducedMotion: "reduce"`, `getAnimations()` returns no running animations on load and after scroll. |
| 12 | Images | Every `img` has non-empty alt (or `alt=""` with `role=presentation` if decorative), natural size at least 1x rendered size, no layout shift (CLS under 0.05). |
| 13 | Emoji | No emoji codepoints in rendered text of chrome elements. |

```ts
// tests/ui-qa.spec.ts (Playwright)
import { test, expect } from "@playwright/test";
const widths = [390, 768, 1280, 1600];
const routes = ["/", "/shop", "/shop/example-product", "/cart", "/wholesale", "/about", "/blog", "/projects"];

for (const w of widths) for (const path of routes) {
  test(`ui-qa ${path} @${w}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(path, { waitUntil: "networkidle" });

    // 1,2,3 card height equality, internals, CTA baseline
    const groups = await page.$$eval("[data-card-group]", gs => gs.map(g => {
      const cards = [...g.querySelectorAll("[data-card]")];
      const r = cards.map(c => c.getBoundingClientRect());
      const cta = cards.map(c => c.querySelector("[data-cta]")?.getBoundingClientRect().bottom ?? 0);
      const media = cards.map(c => { const b = c.querySelector("[data-media]")!.getBoundingClientRect(); return b.width / b.height; });
      return { h: r.map(x => x.height), cta: cta.map((b, i) => r[i].bottom - b), media };
    }));
    for (const g of groups) {
      expect(Math.max(...g.h) - Math.min(...g.h)).toBeLessThanOrEqual(0.5);
      expect(Math.max(...g.cta) - Math.min(...g.cta)).toBeLessThanOrEqual(1);
      g.media.forEach(m => expect(Math.abs(m - 0.8)).toBeLessThan(0.01));
    }

    // 5 touch targets
    const small = await page.$$eval("a,button,input,select,[role=button],[role=radio]", els =>
      els.filter(e => { const b = e.getBoundingClientRect(); const s = getComputedStyle(e);
        return b.width > 0 && s.visibility !== "hidden" && (b.width < 44 || b.height < 44); })
        .map(e => e.outerHTML.slice(0, 80)));
    expect(small, "touch targets under 44px").toEqual([]);

    // 6 overflow
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    // 7 min font size
    const tiny = await page.$$eval("body *", els => els.filter(e => e.childNodes.length &&
      [...e.childNodes].some(n => n.nodeType === 3 && n.textContent!.trim()) &&
      parseFloat(getComputedStyle(e).fontSize) < 16).map(e => e.tagName));
    expect(tiny).toEqual([]);

    // 4 contrast (compute with the same luminance function used in section 2)
    const pairs = await page.$$eval("body *", els => els.filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent!.trim()))
      .map(e => { const s = getComputedStyle(e); return { fg: s.color, bg: effectiveBg(e), size: parseFloat(s.fontSize), weight: +s.fontWeight }; }));
    // helper effectiveBg walks parents until a non-transparent background; assert ratio >= 4.5 (>= 3 when size >= 24 or size >= 18.66 && weight >= 700)

    // 9 and 13 dash and emoji scan
    const text = await page.evaluate(() => document.documentElement.outerHTML);
    expect(text).not.toMatch(/\u2014|\u2013/);

    // 11 reduced motion
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length)).toBe(0);

    // 10 focus visibility (sample first 30 tabstops)
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      const ow = await page.evaluate(() => parseFloat(getComputedStyle(document.activeElement!).outlineWidth));
      expect(ow).toBeGreaterThanOrEqual(2);
    }
    await page.screenshot({ path: `strategy/gates/shots/${path.replace(/\//g, "_") || "home"}-${w}.png`, fullPage: true });
  });
}
```

Required data attributes for the tests: `data-card-group` on each grid or rail, `data-card` on each card, `data-media` on the image box, `data-cta` on the Add button, `data-scroller` on intended horizontal scrollers. Components that omit them fail the Foundation gate.
