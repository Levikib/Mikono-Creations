# 12. Futuristic design system: Savanna Dusk Glass vs Daylight Clay Tech

Status: proposal for owner decision. No site code was edited. Prototypes live in `strategy/design-lab/` and were built as static HTML and CSS with real shop photos, then screenshotted with Playwright and revised twice per direction.

Why the site reads as dated today: a soft serif display face (Fraunces), flat tinted cards with dashed borders, and thin generic line icons. None of these carry depth, light or material. The fix is not decoration. It is three structural changes: a modern grotesk with tight, confident display sizing, real layered light on every surface, and an icon set drawn for this brand.

## 1. What was built

Files: `design-lab/a.html` and `a.css` (Direction A), `b.html` and `b.css` (Direction B), `icons.js` (12 custom icons, tilt, parallax, menus), `build.py` (shared markup), `shoot.js` (Playwright), `assets/` (13 photos, 5 quick cutouts, 8 fonts).

Each page contains: floating pill nav with an open mega menu (photo left, heading, description and overview link centre, ruled list right), hero with animal imagery and CTAs, a bento category row, four uniform product cards (equal height, one "Ask for price" action each), the three-tier "Three ways to take one home" block, an icon sheet and the type specimen. Mobile shows the nav closed, the menu open, the hero and the cards.

### Screenshots

Direction A (desktop 1440x900 unless noted):
- `strategy/design-lab/screens/a-desktop-hero.png`
- `strategy/design-lab/screens/a-desktop-megamenu.png`
- `strategy/design-lab/screens/a-desktop-bento.png`
- `strategy/design-lab/screens/a-desktop-cards.png`
- `strategy/design-lab/screens/a-desktop-tiers.png`
- `strategy/design-lab/screens/a-desktop-icons.png`
- `strategy/design-lab/screens/a-desktop-type.png`
- `strategy/design-lab/screens/a-desktop-full.png` (whole page)
- Mobile 390x844: `a-mobile-closed.png`, `a-mobile-menu.png`, `a-mobile-cards.png`, `a-mobile-full.png`

Direction B: the same names with the `b-` prefix, for example `strategy/design-lab/screens/b-desktop-hero.png` and `strategy/design-lab/screens/b-mobile-menu.png`.

## 2. The two directions compared

### Direction A, Savanna Dusk Glass
Warm baobab and charcoal surfaces (not purple, not blue), frosted glass nav and mega menu, a golden-hour amber glow behind the animals, rim light on the cutouts, 1px hairlines and a fine grain overlay. Display in Bricolage Grotesque, body in Geist, labels in Geist Mono.

What works: it is the most "2026 product launch" of the two. The glowing hero stage with the lion lit from behind is striking, the glass pill nav is convincing, and the mono eyebrow labels give it a technical, Nothing or Teenage Engineering feel. Product photos with a thin amber rim sit well on dark.

What costs us: dark is the wrong first impression for a child-first toy shop and fights the charter's claymorphism; daylight photos (blue and teal backdrops) look pasted on dark; heavy `backdrop-filter` on nav, chips and tiers is the costliest effect on low-end Android; the glow needs an orange above the chroma cap (section 4).

### Direction B, Daylight Clay Tech
Light bone surfaces, layered contact plus ambient plus key shadows with an inner highlight and inner shade (the "squishy" clay recipe), a bento grid with real depth, sticker-style animal cutouts with a white die-cut edge and parallax shadows, a knit-stitch texture on the hero stage, and Unbounded display type over Instrument Sans and DM Mono.

What works: it is warm, tactile and unmistakably about toys, yet it reads as current because of the huge confident display type, the crisp duotone icons and the physical depth. The terracotta pill CTA with inner highlight looks pressable. Photos keep their own colour on a neutral ground, which satisfies rule R3 and makes the product the loudest thing on the page. Uniform cards stay uniform. It is cheap to render: no blur-heavy layers except the nav.

What costs us:
- Less dramatic than A in a screenshot. It relies on shadow craft to feel premium, so the tokens must be applied exactly.
- Unbounded is wide. It is heavy at small sizes, so it is limited to display and card titles, never body.
- The sticker cutouts here are quick GrabCut extractions (the lion keeps a bit of plank). Production needs proper matting, see the risks.

## 3. Recommendation

Adopt Direction B, Daylight Clay Tech, as the system. Borrow three things from A, in limited amounts:
1. The glass pill nav recipe (light version) and the mono eyebrow labels, which B already uses.
2. A "Dusk" dark band, using A's tokens, for exactly three places: the splash screen, the footer and one optional full-bleed feature band ("the makers"). This gives the site a night-safari moment without making the shop dark.
3. A's rim light and amber glow, but only on the optional 3D hero and the splash, behind a flag, and only if the owner accepts the accent exception in section 4.

Reasons: B matches the owner's words (claymorphism, bento, squishy toy surfaces), matches the charter's section 3 (claymorphism by bento on the shop), the existing `--shadow-clay` family in `app/globals.css` already points this way, the product photographs look best on a neutral light ground, and B is much cheaper on a low-end Android phone.

## 4. Colour tokens (recommended direction, B plus the Dusk band)

All UI colours are at or below OKLCH chroma 0.13 except the one proposed exception. Contrast is measured against the surface it is used on.

### Light (default)

| Token | Hex | OKLCH (L, C, H) | Use |
|---|---|---|---|
| `--bone` (page) | #F3EEE5 | 0.95, 0.013, 82 | page background |
| `--paper` (card top) | #FBF8F2 | 0.98, 0.009, 84 | card highlight, nav |
| `--oat` | #EBE2D3 | 0.92, 0.022, 80 | card bottom, pressed wells |
| `--sand` | #E1D4BF | 0.87, 0.032, 79 | hairlines on fills, rails |
| `--ink` | #2A2420 | 0.27, 0.012, 55 | headings, body |
| `--ink-soft` | #5F5348 | 0.45, 0.024, 64 | secondary text |
| `--action` | #8A4630 | 0.47, 0.099, 38 | links, icon strokes, eyebrow |
| `--action-top` | #A4583D | 0.54, 0.108, 40 | button gradient top |
| `--action-bot` | #7C3F2B | 0.44, 0.090, 38 | button gradient bottom |
| `--ochre` | #C9A05A | 0.73, 0.101, 79 | icon duotone fill, bullets |
| `--olive` | #6A7049 | 0.53, 0.058, 115 | wholesale tile, success |
| `--clay` | #C79B7D | 0.72, 0.067, 55 | secondary accents |
| `--brick` | #9B3F35 | 0.49, 0.125, 28 | error only |

### Dusk band (splash, footer, optional feature band)

| Token | Hex | OKLCH | Use |
|---|---|---|---|
| `--dusk-bg` | #120F0C | 0.17, 0.008, 67 | background |
| `--dusk-s2` | #221B16 | 0.23, 0.015, 57 | raised surface |
| `--dusk-ink` | #F4EBDD | 0.94, 0.021, 79 | text |
| `--dusk-ink-soft` | #BFB09F | 0.77, 0.029, 70 | secondary text |
| `--amber` | #E3AE5A | 0.78, 0.119, 77 | accent, buttons, icon strokes |

### AA contrast table

| Pair | Ratio | Result |
|---|---|---|
| ink on bone | 13.25 | AAA |
| ink-soft on bone | 6.45 | AA |
| ink-soft on oat | 5.80 | AA |
| action on bone | 6.06 | AA |
| action on paper | 6.60 | AA |
| cream text #FFF8EE on action-bot | 7.65 | AA |
| cream text on action-top (gradient top edge) | 4.93 | AA (text sits on the mid to bottom of the gradient) |
| cream #FFF6EA on featured tier #7F4029 | 7.36 | AA |
| olive on bone | 4.51 | AA, use for text of 16px and larger only |
| dusk-ink on dusk-bg | 16.17 | AAA |
| dusk-ink-soft on dusk-s2 | 8.03 | AAA |
| amber on dusk-bg | 9.52 | AAA |
| #1B1209 on amber (button text) | 9.21 | AAA |

Rule: never place ink-soft on photos or on any gradient darker than oat. Chips over photos use a solid paper fill, not translucent glass.

### Accent exception for light and glow only (owner decides)
Direction A's hero orb and rim light use `oklch(0.78 0.14 68)`, hex #EE9B3E, chroma 0.144, which is above the 0.13 cap. Proposal: allow exactly `#EE9B3E` and its alpha variants `rgb(238 155 62 / .25 to .5)` as a light source only. It may appear in the splash, the optional 3D hero glow and the Dusk band glow. It may never fill text, buttons, borders, badges or any flat surface. If the owner declines, use `--amber` #E3AE5A (chroma 0.119) for the glow and accept a slightly duller orb. The recommended light direction needs no exception at all.

## 5. Type

### Font verification
All candidates below returned HTTP 200 from the Google Fonts CSS API on 2026-10-02: Bricolage Grotesque, Space Grotesk, Sora, Outfit, Unbounded, Instrument Sans, Manrope, Plus Jakarta Sans, Geist, Geist Mono, JetBrains Mono, DM Mono, Familjen Grotesk, Onest, Figtree, Hanken Grotesk, Schibsted Grotesk, Funnel Display, Host Grotesk, Albert Sans. So all are loadable through `next/font/google`. Geist and Geist Mono are available there.

### Picks

| Role | Direction A | Direction B (recommended) |
|---|---|---|
| Display | Bricolage Grotesque, variable (opsz, wdth, wght) | Unbounded, variable 400 to 800 |
| Body | Geist 300 to 700 | Instrument Sans 400 to 700 (wdth axis available) |
| Mono | Geist Mono | DM Mono 400 |

Why for B: Unbounded has round, wide, soft-cornered forms that echo stuffed toys and sit naturally beside clay surfaces, yet it is clearly a 2026 geometric face, not a children's novelty font. It is the exact opposite of Fraunces, which is the point. Instrument Sans is warm, highly legible at 16 to 18px and has a slightly humanist feel that keeps long copy friendly. DM Mono gives short labels (sizes, tags, KES) a technical tag feel.

Why not the others: Figtree is generic, Sora and Outfit are cousins of Unbounded without its personality, Space Grotesk is overused, Manrope and Plus Jakarta read as fintech. Bricolage is the right choice if A is picked.

Performance: self-hosted via `next/font`, `display: swap`, latin subset only. Unbounded latin variable is about 51 KB, Instrument Sans about 57 KB, DM Mono about 15 KB, a total near 123 KB. Preload only the display and body files. The mono face loads lazily and is used for labels only.

### Scale (mobile to desktop, fluid)

| Token | Size | Weight | Line height | Tracking | Font |
|---|---|---|---|---|---|
| display-xl (hero H1) | clamp(38px, 5vw, 74px) | 800 | 1.02 | -0.045em | Unbounded |
| display-lg (section H2) | clamp(30px, 3.8vw, 50px) | 700 | 1.04 | -0.04em | Unbounded |
| display-md (card H3, tier) | 28px | 700 | 1.1 | -0.03em | Unbounded |
| title (product card) | 19px | 700 | 1.15 | -0.03em | Unbounded |
| lead | 20px | 400 | 1.55 | 0 | Instrument Sans |
| body | 17px | 400 | 1.55 | 0 | Instrument Sans |
| ui (buttons, nav) | 16px | 600 | 1 | 0 | Instrument Sans |
| eyebrow, label | 13px | 500 | 1 | 0.12em, uppercase | DM Mono |

16px is the minimum anywhere except mono eyebrows at 13px, which are decorative redundant labels, never the only carrier of information. If the audit treats 13px as a breach, raise the eyebrow to 14px and keep tracking at 0.1em.

## 6. Radii, shadows, glass, motion

### Radii
`--r-chip: 999px`, `--r-btn: 999px`, `--r-input: 18px`, `--r-card: 30px`, `--r-panel: 34px`, `--r-photo: 24px` (photo inside a card with an 8px inset, so the card radius minus the inset is nearly concentric), `--r-stage: 56px` (hero).

### Shadows (physically plausible: contact, ambient, key, plus inner light)
```css
--clay-sh:
  inset 0 2px 3px rgb(255 255 255 / .85),      /* top rim light */
  inset 0 -10px 16px rgb(110 75 50 / .10),     /* bottom inner shade, gives roundness */
  0 1px 2px rgb(59 42 34 / .10),               /* contact shadow */
  0 10px 18px -6px rgb(59 42 34 / .16),        /* ambient */
  0 30px 44px -18px rgb(59 42 34 / .22);       /* key, from upper left */
--clay-hv: same stack, contact .10, ambient 0 16px 26px -6px .18, key 0 44px 60px -20px .28;
--clay-press: inset 0 4px 8px rgb(110 75 50 / .2);   /* pressed well */
--btn-sh: inset 0 2px 2px rgb(255 255 255 / .35), inset 0 -4px 6px rgb(60 20 10 / .35),
  0 1px 2px rgb(59 42 34 / .3), 0 10px 16px -6px rgb(120 60 35 / .5);
--sticker: drop-shadow white 3px on four sides, 0 4px 3px rgb(59 42 34 / .3), 0 26px 22px rgb(59 42 34 / .4);
```
These extend the existing `--shadow-clay` family in `app/globals.css`, so the migration is a tuning, not a rewrite.

### Glass recipes
- Light nav (used): `background: rgb(251 248 242 / .82); backdrop-filter: blur(20px) saturate(1.3); box-shadow: inset 0 2px 2px #fff, inset 0 -6px 10px rgb(110 75 50 / .07), 0 18px 36px -12px rgb(59 42 34 / .3)`. Fallback when `backdrop-filter` is unsupported or `prefers-reduced-transparency`: solid #FBF8F2.
- Mega menu: solid paper `#FBF8F2` with `--clay-hv`. No blur. This keeps the large panel cheap and the text over it fully readable.

### Texture
- Grain: SVG `feTurbulence` baseFrequency 0.9, 2 octaves, as a 160px tiled data URI at 9% alpha, `mix-blend-mode: multiply`, one fixed layer for the whole page. Costs nothing but one composite.
- Knit stitch on stages: two `repeating-linear-gradient` layers at plus and minus 62 degrees (2px line, 6px period), one dark at 6% and one white at 28%. This reads as a "V" stitch without a bitmap. Used on the hero stage and the featured tier only.
- Real yarn macro crop: a 256x256 high-pass tile made from the giraffe photo is at `design-lab/assets/img/yarn-tile.png`. A mirrored tile showed visible repetition at 150px, so the shipped technique is the gradient stitch above, plus a real macro photo (`lion-macro.jpg`) used at small size as a card backing only when a client photo of a crochet close-up is supplied.

### Motion tokens
```css
--ease-soft: cubic-bezier(.22, 1, .36, 1);      /* settle */
--ease-squish: cubic-bezier(.34, 1.56, .64, 1); /* overshoot, press release */
--dur-fast: 150ms; --dur-base: 350ms; --dur-slow: 600ms; --dur-photo: 900ms;
```
Interactions: hover lifts a card by 2px with the `--clay-hv` stack and scales its photo to 1.05 over 900ms. Press scales to 0.96 and swaps to `--clay-press`. Mega menu opens with opacity plus 10px rise plus 0.98 scale over 400ms. Icons play a 700ms wobble on hover, focus and press.

3D tilt: pointer move sets `--rx` and `--ry` (max 8 and 10 degrees) on `.tilt` cards with `perspective(900px)`, reset on leave. Hero parallax shifts each sticker by a different multiple of pointer offset (14 to 34px) and its shadow with it. Mobile gyroscope is optional: request `DeviceOrientationEvent.requestPermission()` only after a user tap on a small "tilt" control, never on load. All of it is off under `prefers-reduced-motion: reduce`, where cards become static and the shadows stay.

## 7. Component restyle spec

- Nav: floating pill, 66px high desktop, 60px mobile, max width 1040px, 16px from the top, light glass recipe. Links 44px tall, pill hover with a pressed inner shade, the open "Shop" item shows the chevron rotated. Right side: cart icon button (44px circle, clay), one primary "Chat on WhatsApp" pill. This is compatible with the pill header another agent is building, so only tokens and shadows change.
- Mega menu: 3 columns `1fr 1.1fr 1fr`, 20px padding, solid paper, `--r-panel`. Left a photo card (lion size ladder, caption chip "Sizes S to XL"), centre eyebrow plus 30px display heading plus 2 line description plus an overview link with an arrow that moves 5px on hover, right a ruled list: 1px hairlines, icon 32px, title 700, descriptor 14px. Rows are at least 56px tall. Escape closes, focus returns to the trigger.
- Mobile menu: full-screen bone sheet, rows 64px, 30px Unbounded 700, accordion for Shop with 44px sub-links, ruled with hairlines, sticky WhatsApp CTA at the bottom. The burger is a 44px clay circle that swaps to a close icon.
- Buttons: primary pill with the `--btn-sh` gradient, 48px (sm 44px, lg 56px), press to scale 0.96. Secondary is paper clay. Tertiary is the text link with the arrow. One primary per view region.
- Cards: `--r-card` 30px, paper to oat gradient, `--clay-sh`, photo inset 8px at `--r-photo`, 4:5 photo, title clamped to 2 lines with `min-height: 2.3em`, descriptor clamped to 2 lines with `min-height: 2.7em`, action pinned with `margin-top: auto`. The chip sits top-left on the photo with a solid paper fill. One action only: "Ask for price".
- Forms: inputs 52px tall, radius 18px, inset well (`inset 0 2px 4px rgb(110 75 50 / .14)`), focus ring 3px ochre plus a 2px action outline offset 3px. Labels above in 16px 600. Errors in brick with an icon and text, never colour alone.
- Footer: Dusk band, `--dusk-bg`, amber links, four columns on desktop, accordion on mobile, a quiet grain.
- Splash: Dusk, a single amber-lit yarn ball (inline SVG, 16 KB budget) that unrolls into the wordmark in 1.4s, skippable, shown once per session, not at all under reduced motion, never blocking LCP content.
- Bento tiles: 12 column grid, 150px row unit desktop, gap 16px (12px mobile), mixed spans (5x3, 4x2, 3x1, 3x2, 4x1), each tile one photo or one earth fill (ochre sand, olive sand) plus a 44px clay icon tile and a title. Tilt up to 6 degrees.
- Tiers: three clay cards, the middle ("Make it yours") filled terracotta with a stronger shadow and one primary button, the others with text links. Equal height by grid stretch and a pinned action.

## 8. Icon plan

### Library evaluation (licences checked against the GitHub API on 2026-10-02)
| Set | Licence | Verdict |
|---|---|---|
| Phosphor | MIT (verified) | Best fit as the base library. Six weights including a duotone style that matches our fill-plus-stroke idea. React package tree shakes. |
| Lucide | ISC with some MIT-derived parts (GitHub reports "NOASSERTION", read the repo LICENSE before use) | Clean and tiny, but it is the default look of every Next.js starter, so it contributes to "generic". |
| Tabler | MIT (verified) | Large, consistent, stroke only. Good fallback for utility glyphs. |
| Iconoir | MIT (verified) | Distinctive, but fewer commerce glyphs. |
| Solar | GitHub shows no licence file; the README states CC BY 4.0 (unverified) | Attribution required, avoid. |
| Streamline Free | CC BY 4.0 (unverified, not fetched) | Attribution required, avoid. |
| Hugeicons free | Repo reports MIT, but the free set terms differ from the paid pro set (unverified) | Avoid until terms are read. |

Decision: use Phosphor (Duotone for feature icons, Regular for UI) as the utility base, and replace it wherever a brand glyph matters with our 12 custom icons. This yields a consistent system with only about 12 hand-drawn assets to maintain.

### Custom set (in `design-lab/icons.js`, shown in `a-desktop-icons.png` and `b-desktop-icons.png`)
Yarn ball, hook, hands, giraffe, elephant, lion, rhino, zebra, rabbit, gift, truck, WhatsApp, plus utility arrow, chevron, bag, menu, close.
- 24px grid, 1.75px stroke, round caps and joins, 2px minimum corner radius, 2px safe margin.
- Duotone: a `.duo` layer filled `--ochre` at 35% (light) or amber at 20% (dusk), then the `.ln` stroke layer in `currentColor`. Eyes are filled dots.
- Micro-states: each icon has one animated part. The yarn ball's stitch lines rotate and wobble, the hook tilts, the hands lift the heart, the giraffe neck stretches, the elephant trunk swings, the lion mane pulses, the rhino horn nudges, the zebra head tilts, the rabbit ears wiggle, the gift lid pops, the truck wheels spin, the WhatsApp bubble pops. Triggered on hover, focus-visible and active so touch gets it too. Under reduced motion all are static.
- The WhatsApp glyph is a generic chat bubble with handset. Check WhatsApp's brand guidelines before using the official mark in the footer or share buttons.

## 9. Hyperrealism techniques

- Shadow stack: contact plus ambient plus key (section 6). On product cards the key shadow offset is down and slightly left to match a window-light feel across the page.
- Depth of field: pre-baked blurred backdrops (section 6).
- Sticker cutouts: the prototype uses OpenCV GrabCut, which leaves artefacts (plank on the lion, dark patch behind the rabbit). Production should use a proper matting tool on the originals, one-off, stored as 600px wide WebP with alpha, 15 to 40 KB each.

### Optional lightweight 3D hero
Recommendation: do not use live 3D by default. Options and estimates:

Options: (1) pre-rendered turntable of 24 WebP frames (about 340 KB, no WebGL, 2 to 3 days) is the best first step; (2) a three.js procedural yarn ball (about 150 KB gzip, medium Android cost, 3 to 4 days) is an optional enhancement gated by `deviceMemory >= 4`; (3) a Spline embed (600 KB to 1 MB plus runtime, high cost) is not recommended.

Budget: the 3D layer loads after `load` plus idle, under 400 KB, never above the fold LCP, 30fps cap, pauses when off-screen or when the tab is hidden, static `hero.webp` fallback (the sticker composition in the screenshots) when `prefers-reduced-motion`, `saveData`, low `deviceMemory`, or WebGL missing. Estimate for the recommended path (image sequence plus static fallback): about 3 working days after the owner supplies or approves the source images.

## 10. Density targets (compact)

The brief asks for tighter layouts. Targets:
- Product card width: desktop 4 per row at about 285px (grid gap 18px, container 1240px); tablet 3 per row at about 230px; mobile 2 per row at about 170px (gap 12px, side gutter 16px). On wide screens (1600) allow 5 per row at about 260px.
- Card internals: photo inset 8px, body padding 16px (12px mobile), 6px gap between title, descriptor and action. Card height at 4:5 photo plus body is about 440px desktop, 330px mobile.
- Section spacing: 84px between sections desktop, 48px mobile (down from the current looser rhythm). Heading to content 36px.
- Bento: 150px row unit, 16px gap desktop, 12px mobile.
- Nav: 66px desktop, 60px mobile. Touch targets 44px minimum everywhere.

## 11. Implementation plan mapped to the repo

Do not start until another agent's splash and pill header work lands, to avoid collisions.

1. Tokens, `app/globals.css` (half a day). Add the new colour tokens (`--color-bone` already exists; add `--color-action-top`, `--color-action-bot`, `--color-dusk-*`, `--color-amber`), the shadow family (`--shadow-clay` becomes `--clay-sh`, add `--btn-sh`, `--clay-press`), motion tokens, and the stitch and grain layers as utility classes. Keep names so existing components do not break.
2. Fonts, `app/layout.tsx` (1 hour). Replace Fraunces and Figtree loaders with Unbounded, Instrument Sans and DM Mono. Keep the loader variable names from decision G11. Caveat remains for story, journal and projects only. Update decision D32.
3. Icons (1 to 2 days). New `components/icons/` with the 17 inline icons as a typed map and an `Icon` component that takes `name`, `size` and `duo`. Phosphor Duotone for everything not in the custom set. Remove thin icons from nav, cards and the footer.
4. Primitives (1 day). Restyle `Button`, `Chip`, `Card` and `Input` in `components/` to the spec in section 7. Card and ProductCard get the inset photo, clamped title and descriptor, pinned action. Add a `Tilt` client component (about 40 lines, pointer only, reduced motion off).
5. Header and menus (1 day, with the other agent). Apply the light glass recipe, the three column mega menu and the mobile sheet to their pill header. Mega menu panel is solid.
6. Home (1.5 days). Hero stage with sticker cutouts and parallax (client component), bento row, four product cards, tiers block, trust strip.
7. Interior pages (2 days). Sweep through shop, product, cart, order and the content pages: replace dashed borders and flat tint cards with the clay recipe, set the type scale, check tap targets.
8. Dusk band (half a day). Footer, splash, and the optional makers band with the Dusk tokens.
9. Assets (1 to 2 days, in parallel). Proper cutouts for 6 to 8 hero animals, pre-blurred backdrops, final animal icon pass.
10. QA (1 day). The three-verifier gate from the charter, plus Lighthouse mobile on a throttled profile, a contrast re-run, and keyboard walk of the mega menu and the drawer.

Total: roughly 8 to 11 working days for one developer, excluding the optional 3D hero (3 days).

## 12. Risks and what to cut

Risks:
- Photo quality. Many source photos are small (about 430 to 650px wide). Large 4:5 crops and 56px-radius stages exaggerate softness. Mitigation: cap displayed size, use `object-fit: cover` with the sharpest crops, request higher resolution originals for the hero three.
- Cutout quality. Quick extraction leaves artefacts. Without proper matting the sticker hero will look cheap. Fallback: use the full photo in a clay frame.
- Shadow stacks and tilt on 20+ cards can cost frames on low-end Android. Mitigation: tilt only on cards in viewport via IntersectionObserver, no tilt on touch, `will-change` only during pointer interaction, and a `prefers-reduced-motion` and `Save-Data` kill switch.
- The text eyebrows at 13px fall below the 16px guideline. See section 5.

Cut first if time is short: the 3D hero, gyroscope tilt, the splash animation, the macro texture, the pre-blurred backdrops, the Dusk makers band. Never cut: tokens, fonts, the shadow recipe, the custom icons, the uniform card spec and reduced motion support.

## 13. Decision requested from the owner

1. Direction: B Daylight Clay Tech with a Dusk footer and splash (recommended), or A Savanna Dusk Glass as the full site.
2. Accent exception for light and glow: approve `#EE9B3E` as a light source only, or keep the in-cap amber `#E3AE5A`.
3. Whether to commission proper cutouts and a turntable photo sequence for the hero.
