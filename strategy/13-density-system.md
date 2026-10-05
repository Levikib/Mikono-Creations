# 13. Density system: compact Daylight Clay Tech

Status: proposal for one-pass migration of owner ruling R11 (`strategy/07-BUILD-DECISIONS.md`). No site code was edited. Floors: body 14 to 15px, secondary 13px, mono labels 11 to 12px, phone card gaps 8 to 12px, controls 32 to 36px with a 44px hit area, AA contrast, equal heights and aligned CTAs unchanged.

## 1. What was built and measured

- Prototype: `strategy/density-lab/compact.html` (static, real photos from `public/media-opt`, live token values copied from `app/globals.css`, no site imports). Open at 390 and 1440 wide.
- Measurements: playwright-core on https://mikono-creations.vercel.app (mobile 390x844 at dpr 2, desktop 1440x900). Raw data: `density-lab/screens/before-metrics.json`, `proj-metrics.json`.
- Projection: `density-lab/override.css` injected into the live pages in the browser. It cannot restructure markup, so "after" page heights are conservative. The prototype gives the design target.

Screenshots, all under `strategy/density-lab/screens/`: before `before-{mobile,desktop}-{home,shop,product,journal,studio,cart}-fold.png`; after (prototype) `after-mobile-fold.png`, `after-mobile-shop.png`, `after-mobile-shop-comfy.png`, `after-mobile-rails.png`, `after-mobile-bento.png`, `after-mobile-detail.png`, `after-mobile-journal.png`, `after-mobile-forms.png`, `after-mobile-menu.png`, `after-mobile-footer.png`, `after-desktop-fold.png`, `after-desktop-shop.png`, `after-desktop-megamenu.png`, `after-desktop-bento.png`, `after-desktop-detail.png`; projection on live pages `proj-{mobile,desktop}-*-fold.png`.

## 2. Measured before and after

### Before, the real numbers

| Item | Phone 390 | Desktop 1440 |
|---|---|---|
| Body text | 16px | 17px |
| h1 / h2 / h3 | 25 to 32 / 16 to 25 / 15 to 20 | 43 to 67 / 17 to 43 / 17 to 20 |
| Header | pill 60, spacer 76 | pill 66, spacer 92 |
| Hero section (home) | 655px tall | 580px |
| Button / chip height | 56 hero, 44 elsewhere, 48 in cart | 56 hero, 44 elsewhere |
| Form fields | 48 to 52px | 48 to 52px |
| Product card | 173x307, image 1:1, gap 12, 2 columns | 289x425, gap 20, 4 columns |
| Content card (journal) | 173x264, image 4:3 | 289x403 |
| Category circle | 92px | 150px |
| Section padding (top plus bottom) | 56 to 80 | 144 to 160 |

### After, mobile (390), page height and items per screen

"Items per screen" counts cards fully visible with the grid scrolled to the top under the header.

| Page | Body | Card before to after | Items per screen | Page height before to after | Shorter |
|---|---|---|---|---|---|
| Home | 16 to 14 | hero 655 to 208 (prototype) | n/a | 5469 to 4415 (projection) | 19% |
| /shop (24 animals) | 16 to 14 | 173x307 to 117x192 | 4 to 9 (6 partial to 12) | 4984 to 2574 (projection) | 48% |
| /shop/safari-animals (7) | 16 to 14 | 173x307 to 114x189 | 4 to 7 | 2506 to 1559 | 38% |
| Product (lion) | 16 to 14 | related 168x302 to 168x243 | title, sizes and action bar enter the first screen | 3783 to 3264 | 14% |
| Journal | 16 to 14 | 173x264 card to 366x84 row | 1 to 8 | 3207 to 2689 | 16% |
| Studio | 16 to 14 | option 173x149 to 114x159 | 6 to 7 (projection), about 12 estimated with the sub line hidden | 2956 to 2392 | 19% |
| Cart (empty) | 16 to 14 | n/a | n/a | 1336 to 1103 | 17% |

### After, desktop (1440)

| Page | Body | Card before to after | Items per screen | Page height before to after | Shorter |
|---|---|---|---|---|---|
| Home | 17 to 15 | hero 580 to 308 | 5 to 6 | 6108 to 4374 | 28% |
| /shop (24) | 17 to 15 | 289x425 to 206x288 (6 columns) | 4 to 12 | 3641 to 1950 | 46% |
| Safari (7) | 17 to 15 | 289x425 to 193x268 | 4 to 7 | 1927 to 1374 | 29% |
| Product | 17 to 15 | related 250x386 to 250x326 | n/a | 2971 to 2507 | 16% |
| Journal | 17 to 15 | 289x403 to 602x93 row (2 up) | 5 to 9 | 2671 to 1784 | 33% |
| Studio | 17 to 15 | 406x127 to 200x140 | 13 to 16 | 2149 to 1619 | 25% |
| Cart (empty) | 17 to 15 | n/a | n/a | 1175 to 1061 | 10% |

The shop listing, where the size is felt most, drops by about half. Prose heavy pages gain less because the override cannot reshape markup; the migration does.

Prototype dimensions: phone card 117x192 (109px square image, 3 columns, 8px gap), comfortable card 179x297 (4:5), header pill 50 (56 desktop), circle 56, journal row 84, field 36, hero 208 phone and 308 desktop.

## 3. The system

### Scales (strict)

- Spacing: 2, 4, 6, 8, 12, 16, 24, 32.
- Type: 11, 12, 13, 14, 15, 18, 22, 28, 40. One exception, the desktop home hero at 52px (`--fs-hero`).
- Radii: 8, 12, 16, 22 (chips stay 999).
- Roles: 11 overlay tags; 12 mono labels, helper text; 13 card titles, secondary; 14 body phones, buttons; 15 body from 768; 18 section h2 phones, price; 22 section h2 from 768; 28 page h1; 40 hero from 768; 52 hero from 1024.
- Card titles use Instrument Sans 600, not Unbounded. Unbounded is wide and heavy below 18px and wastes a third of a 104px column.

### Token deltas mapped to `app/globals.css` names that exist today

| Variable | Now | Compact |
|---|---|---|
| `--text-body` | 1rem | .875rem, .9375rem from 768 |
| `--text-body--line-height` | 1.55 | 1.45 |
| `--text-small` | 1rem | .8125rem |
| `--text-small--line-height` | 1.45 | 1.4 |
| `--text-display-xl` (home hero only) | clamp(1.875rem, 1.2rem + 3.3vw, 4.5rem) | clamp(1.75rem, 1.2rem + 2.3vw, 3.25rem) |
| `--text-display-lg` (page h1) | clamp(1.5rem, 1.15rem + 1.7vw, 2.75rem) | clamp(1.375rem, 1.2rem + .7vw, 1.75rem) |
| `--text-display-md` (section h2) | clamp(1.25rem, 1.05rem + .85vw, 1.75rem) | clamp(1.125rem, 1rem + .4vw, 1.375rem) |
| `--radius-card` | 24px | 16px |
| `--radius-panel` | 30px | 22px |
| `--radius-input` | 18px | 12px |
| `--radius-photo` | 18px | 8px phones, 12px from 768 |
| `--radius-stage` | 40px | 22px |
| `--nav-h` | 60px | 50px, 56px from 1024 |
| `--shadow-clay` | 5 layers, 30px and 44px blurs | `--shadow-clay-2`: inset 1.5px, 0 8px 14px -6px, 0 14px 22px -12px |
| `--shadow-clay-hover` | 44px and 60px blurs | `--shadow-clay-2` plus translateY(-2px) |
| `--shadow-clay-sm` | inset 2px, 8px and 18px drops | `--shadow-clay-xs`: inset 1px, 0 4px 8px -3px |
| `--shadow-btn` | 10px and 16px drops | `--shadow-btn-sm`: 0 5px 9px -4px |

Also in `globals.css`: `body` font-size 1rem to .875rem (.9375rem from 768) and line-height 1.55 to 1.45; `scroll-padding-top` 6rem to 4.5rem; `.eyebrow` .875rem to .6875rem (.75rem from 768); `.polaroid figcaption` to .8125rem; `.bento` gaps 12/16/20 to 8/12/12 and row heights 150/180 to 78/92/98; `.ck-text` and `.ck-btn` drop one step (buttons keep 44px).

New variables to add (additive, nothing breaks): `--sp-2 --sp-4 --sp-6 --sp-8 --sp-12 --sp-16 --sp-24 --sp-32`, `--fs-11 --fs-12 --fs-13 --fs-14 --fs-15 --fs-18 --fs-22 --fs-28 --fs-40 --fs-hero`, `--r-8 --r-12 --r-16 --r-22`, `--gutter` (12, 16 from 768, 24 from 1280), `--gap-card` (8, 12 from 768), `--ctl: 36px`, `--hit: 44px`.

Colour tokens are unchanged, so `scripts/tokens-check.mjs` still applies.

Clay depth stays: same recipe, shorter blurs. A 117px card cannot carry a 44px blur.

## 4. The phone grid rule (3 columns)

Use rem based auto-fill, not a hard 3:

```
grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));  /* phones */
gap: var(--gap-card);                                            /* 8px */
```

Content width is viewport minus 24px. 320 gives 2 columns, 360 gives 3 at 106px, 390 gives 3 at 117px, 412 gives 3 at 124px. At about 115% Android font size the grid drops to 2 columns by itself, which is the safety valve. From 640 use `minmax(9rem,1fr)`, from 1024 `minmax(10.5rem,1fr)`, from 1280 `minmax(12rem,1fr)` (6 columns in the 1296px container).

Card at 117px: 4px padding, 1:1 image (4:5 in comfortable mode), optional 20px overlay tag, title 13px two line clamp with reserved 2.4em, one bottom row with 11px mono meta and a 32px WhatsApp icon chip (44px hit). Meta and chip share a row, which saves 30px over stacking. Equal height: `grid-auto-rows: 1fr` plus the reserved title height.

Switch: a two state control (3 up, 2 up) in the sticky filter row, remembered in localStorage with try and catch. Comfortable mode turns the chip into a labelled "Ask for price" button.

## 5. Hit area technique

1. Visual control 32 to 36px; a pseudo element makes the tap target at least 44px: `.hit::after { content:""; position:absolute; left:50%; top:50%; width:max(100%,44px); height:max(100%,44px); translate:-50% -50%; }`. Buttons and chips expand vertically only (`left:0; right:0; height:44px`).
2. Stack rule: for stacked controls, visual height plus gap must be 44 or more (36 plus 8, 32 plus 12), so hit boxes never overlap. Horizontal runs: 36px icon chips need 8px gaps, 28px swatches need 16px gaps.
3. Never put the pseudo element on a wrapper that contains the real controls. A segmented control wrapper stole every tap in the prototype until the pseudo element moved to each button.
4. `overflow: hidden` on the control clips its own hit area. Clip the image child instead (fixed on thumbnails). Rails get `padding-block: 6px` so chips keep their 44px box.
5. Inputs cannot have pseudo elements: the label is the 44px hit area, the 36px input sits inside it.
6. Whole card links stay as `after:absolute after:inset-0` on the title link; the action chip sits above with `z-index: 2`.

Verified with `elementFromPoint` at 21px from each control centre: `screens/after-mobile-hit.json`, `after-desktop-hit.json`.

## 6. Component change list

- **ProductCard**: padding `p-1.5 md:p-2` to `p-1 md:p-1.5`; media radius to 8 (12 from 768); title `h-11 font-display text-[.9375rem] md:text-[1.0625rem]` to `h-[2.4em] font-sans font-semibold text-[.8125rem] leading-[1.2] md:text-sm`; meta to mono 11 (12 from 768) on the same row as the chip; chip from `min-h-11 w-full` text button to a 32px icon chip with `.hit` (text returns in comfortable mode and from 768); tag `h-8 px-3 text-[.875rem]` to `h-5 px-1.5 text-[.6875rem]`. `ProductGrid` uses the auto-fill rule plus the density switch. Keep `data-card`, `data-media`, `data-cta`, `data-ratio="1/1"`.
- **ContentCard**: row on phones, 2 up list on desktop: 72px thumb, mono eyebrow, 2 line 14px title, 12px meta, chevron. `data-ratio` becomes `1/1`; update verifiers that read it.
- **InfoCard**: same row form (icon or 72px photo, 2 line title).
- **Header, SiteNav**: `.nav-pill` 60 to 50 (66 to 56 from 1024), `.nav-mark` 40 to 34, `.iconbtn` 44 to 36 plus hit area, `.nav-word` 1.25rem to 1.125rem, `.nav-top` and `.nav-cta` 44 to 36 plus hit area, `.nav-spacer` 76 to 62 and 92 to 68.
- **Mega panels**: radius 34 to 22, padding 20 to 12, gap 28 to 16, `.nav-photo` 280 to 170, `.nav-heading` to 1.375rem, `.nav-row` 56 to 44 in 2 columns.
- **MobileMenu (`.mnav`)**: head 68 to 56, `.mnav-top` 60 to 48 at 1.125rem, sub links as a 2 column grid of 44px tiles, foot CTA 52 to 40 visual.
- **Footer**: phone link groups become collapsed `details` accordions (44px summary), open on desktop; 13px links; top padding 40 to 24.
- **Hero and PageHero**: home h1 on the new `--text-display-xl`, one line 13 to 14px sub, 40px CTAs, 84px cutout on phones. `PageHero` h1 `text-[2rem] sm:text-display-xl` to `text-display-lg`.
- **Sections**: `Section` `py-10 md:py-16 xl:py-20` to `py-4 md:py-6`, compact variant to `py-3 md:py-5`; `SectionHeader` `mb-5 md:mb-9` to `mb-3`, h2 from `text-display-lg` to `text-display-md`, lede 14px.
- **Chips, circles**: `Chip` `min-h-9 text-base` to `h-8 text-[.8125rem]`; `CategoryCircles` 92 or 150px to 56 (72 from 768), snap rail.
- **Forms**: control `min-h-[52px] text-[1.0625rem]` to `h-9 text-base` on phones (16px stays), `text-sm` from 768; label becomes a 44px wrapper with 12px semibold text; textarea 120 to 64; radio and checkbox rows `min-h-14` to `min-h-11`; pair short fields in 2 columns.
- **Studio**: `.st-opt` padding 8, `.st-opt-media` 64, `.st-ico` 44 to 32, option grids to 3 columns on phones and 4 from 768, sub line hidden under 640, `.st-btn-big` 56 to 40, sticky Next bar to 56.
- **Helpers**: `.mkh-option` and `.mkh-card` as Studio, `AnimalPicker` on the 3 column rule.
- **Cart, drawer, wizard**: stepper `size-12` to `size-8` plus hit area, line thumb 72 to 56, name 1.125rem to .9375rem, wizard submit `min-h-14` to `h-10`, headings to 1.125rem, panels `p-4` to `p-3`.
- **Product page**: 132px square gallery beside the title on phones, 420px image plus 56px thumb column from 768, size chips `size-14` to `h-8 min-w-10` plus hit area, swatches 28 with 16px gaps, price to 1.125rem bold, accordions for About, Care, Delivery, and a sticky 52px action bar publishing `--sticky-h`.
- **Rails, bento, stats**: rail cards 132 (188 from 768) with `scroll-snap-type: x proximity`; bento overlay labels instead of text below; stat numbers `2.25rem md:3rem` to `1.375rem md:1.75rem`.
- **Consent bar, WhatsApp float**: keep 44px hit, less padding, float 56 to 48.

## 7. Legibility, honestly

I could not test on a physical cheap Android in sunlight. This is a judgement from contrast, size and rendering. Test on a 720p LCD outdoors before sign-off.

What holds: 13px semibold `#2A2420` on paper is about 14 to 1; secondary `#5F5348` on paper about 7 to 1; terracotta deep on paper about 6.6 to 1, on oat about 5.5 to 1. Glare eats the low end, so nothing semantic goes below about 5.5 to 1.

What gets worse: DM Mono at 11px regular, uppercase, is the weakest text in the system. Rule: 11px mono only for information stated elsewhere (overlay tags, card meta repeating "S to XL"); anything that is the only source of a fact is 12px mono or 13px sans.

Keep larger: prices 15 to 18px bold tabular, button labels 13 to 14px semibold at 36 to 40px height (hero and form CTAs 40), headings 18px or more, phone form text 16px, error text 13px bold brick, consent and legal 13px, and long reading (journal, `Prose`, `ArticleBody`) 15px phones and 16 desktop at line height 1.6. Scanning surfaces go dense, reading surfaces do not.

Trade-offs: 105 to 124px cards make photos small thumbnails; icon only WhatsApp chips need the comfortable mode to teach them; large system fonts yield 2 columns automatically.

## 8. Risks

1. iOS Safari zooms on focus for inputs under 16px. Phone inputs stay 16px; only the box shrinks to 36. Desktop may use 14.
2. Text scaling at 200%: rem sizes scale and the grid drops to 2 columns, but the 2.4em title box and 32px chip must not clip. Test it.
3. The stack rule is a convention. A control added later without gap discipline reintroduces overlapping hit areas.
4. Verifiers reading `data-ratio` need the new values; uniform heights are still required.
5. Icon only chips keep `aria-label="Ask for price: {title}"`; the visible label returns in comfortable mode and from 768.
6. Unbounded under 18px erases the density gain and hurts legibility.
7. Studio and helpers numbers are projection only. Plan a visual pass.
8. The 52px action bar, consent dock and WhatsApp float must still stack through `--sticky-h` and `--dock-h`.

## 9. Migration order (one agent, one pass)

1. `app/globals.css`: tokens in section 3, body and eyebrow rules, shadows, radii, `.hit`, `.bento`, `.ck-*` sizes, add the new variables.
2. Primitives: `Container` (`px-4 md:px-6 xl:px-8` to `px-3 md:px-4 xl:px-6`), `Button` sizes (`compact min-h-9`, `default min-h-10`, `large min-h-11`, each with the hit pseudo element), `Chip`, `Badge`, `Form`, `QuantityStepper`, `Section`, `SectionHeader`, `PageHero`.
3. Navigation: `app/nav.css`, `SiteNav`, `MobileMenu`, `MobileSheet`, `Header`, `Footer` (accordions).
4. Cards: `ProductCard` and `ProductGrid` with the density switch, `ContentCard` and `InfoCard` rows, `ProductRail`, `CategoryCircles`, `Bento`, `StatsBand`, `TrustStrip`, `HerdDeck`, home hero in `app/page.tsx` and `app/home.css`.
5. Shop flow: `ShopListing` and `FilterPanel` (sticky chip row, density switch), `FilterDrawer`, `ProductPurchase` with the sticky action bar, `CartLines`, `CartDrawer`, `CartView`, `OrderWizard`.
6. Tools: `components/studio/studio.css` and step files, `components/helpers/helpers.css` and files.
7. QA: `scripts/tokens-check.mjs`; Playwright at 320, 360, 390, 412, 768, 1280, 1440, 1600; an `elementFromPoint` hit test; axe; text zoom 200%; compare page heights with section 2; equal card heights and aligned CTAs; em dash and slop scan.

Prototype source of truth for every dimension above: `strategy/density-lab/compact.html`.
