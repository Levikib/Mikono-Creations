# 11. Creative Direction: from 3 to 7 out of 10

Proposal for owner review. Binding rules stay as in 00-CHARTER.md and 07-BUILD-DECISIONS.md (R3 chroma cap 0.13, R4 uniform cards, R10 wording). Changes to rules are in 2.7 and the questions. Measured on https://mikono-creations.vercel.app with headless Chromium at 390 and 1440 wide (home, shop, /shop/elephant, journal), screenshots reviewed by eye. "Estimate" means a projection. "Unverified" means a single search source or memory.

## 0. The short version

Type and padding are not huge. The site is long, uniform and still: every card is a tinted box with the same eight controls, and the only animals are photographs. "Big" really means "heavy and repetitive". Fix: fewer elements per card, shorter sections, then a cast of illustrated yarn animals in the earth palette. Five moves carry most of the effect: card and section diet, a living hero scene (CSS first, Veo after), a 12 character SVG cast, a stitched yarn path that draws on scroll, and the animal that hops into the basket.

## 1. Density diagnosis

### 1.1 What was measured

| Item | 390 wide | 1440 wide |
|---|---|---|
| Page height: home / shop / product / journal | 9,220 / 7,347 / 4,785 / 7,204 px | 7,523 / 4,673 / 3,067 / 3,246 px |
| Body, h2, section padding | 17 px, 28 px, 48 px | 17 px, 36 px, 80 px |
| Home h1 | 32 px, block 106 px | 64 px, block 211 px |
| Hero | about 455 px, photo a 150 px circle | about 553 px, 520 px blob photo |
| Shop card | 171 x 435, 2 cols, image 147 x 184 | 286 x 577, 4 cols, image 254 x 318 |
| Card padding, radius | 12 px, 28 px | 12 px, 28 px |
| Journal card | 358 x 470, 1 col | 389 x 491, 3 cols |
| Product image, button | 358 x 351, 175 x 44 | 640 x 627, 160 x 44 |
| Elements with a CSS animation at load | 0 | 0 |

Home section heights at 390: bento 833, featured rail 1,381, trust 690, how ordering 1,030, moments 1,234.

### 1.2 Diagnosis

1. **The shop card is about twice as tall as its photo** (577 px for 318 px at 1440, 435 for 184 at 390). Eight elements each: name, colour line, four size chips, an "Ask for price" pill, a "Choose size" button. Across 24 animals the same two actions repeat 48 times.
2. **Pastel variety.** Cards cycle ochre, terracotta and olive tints with dashed borders and corner dots. Each token is inside the chroma cap (C 0.034, 0.048, 0.032) but the rows read as a pastel rainbow. The issue is variety, not saturation.
3. **Decoration without a job.** Blobs, dotted rails, wave dividers, zigzag edge and heading dots, none an animal, none moving.
4. **Single column mobile stacking** (bento 833 px, rail 1,381, moments 1,234).
5. **Cookie bar** covers 110 px of the 844 px first screen, over the hero buttons.
6. **Hero** is a still photo in a 150 px circle on mobile. Great proof, no play.
7. **Zero animation live.** KineticHeading and the splash exist in the working tree but did not register on the deployed page (unverified whether undeployed).

Do not shrink body below 16 px. Shorten things instead.

### 1.3 New compact scale

| Token | Before | After |
|---|---|---|
| Body | 17 px | 16 px, line height 1.55 (charter minimum) |
| h1 desktop / mobile | 64 / 32 px | 48 / 30 px |
| h2 desktop / mobile | 36 / 28 px | 28 / 22 px, no heading dots, one line subtitle |
| Card title, captions | 17, 13 px | 15 px semibold 2 line clamp, 13 px (never smaller) |
| Section padding desktop / mobile | 80 / 48 px | 56 / 32 px (steps 8, 16, 24, 32, 56) |
| Container | 1280 px | 1200 px, 16 px mobile gutter |
| Hero desktop / mobile | 553 / 455 px | min(62svh, 560px) / 440 px with headline over a baobab-deep scrim, CTA on the first screen |
| Shop grid | 2 / 4 cols | 2, 3 at 768, 4 at 1024, 5 at 1280 (only if images stay 220 px or wider) |
| Card image | mixed ratios | 4:5 fixed, sand box, object-fit cover |
| Shop card mobile | 171 x 435 | 171 x about 250 (estimate) |
| Shop card desktop | 286 x 577 | about 224 x 330 at 5 cols (estimate) |
| Card chrome | 12 px pad, 28 px radius, tinted fill, dashed border, dots | 8 px pad, 16 px radius, bone card on oat page, no dashes or dots |
| Product image | 640 x 627 | 560 square desktop, full width square mobile |
| Journal card | 3 cols, 4 text blocks | 4 cols desktop, 2 mobile, 4:3 image, 2 line excerpt |
| Cookie bar | 110 px, two buttons | 56 px single line, bottom left card on desktop |
| Home height (estimate) | 9,220 / 7,523 | about 6,200 / 5,600 |
| Shop height (estimate) | 7,347 / 4,673 | about 4,900 / 3,500 |

Shop card diet: "Ask for price" becomes a small "Price on request" line, size chips collapse to "S, M, L, XL" text, "4 colours" stays, and "Choose size" is the only button. Sizes and WhatsApp ask live on the product page and quick-add sheet. R4 and R7 stay intact. Home diet: bento becomes a 2 x 2 row of 120 px tiles on mobile, trust and how-ordering merge into one 3-up icon strip, stockists shrink to a line plus link, moments become a one-row swipe rail (saves about 900 px).

## 2. The "alive" system

### 2.1 Principles

Motion and drawing carry energy, not colour. Few precise moments beat many twitching icons. No moving element within 400 px of a form field, price or add button, and none that shifts layout. Every animation has a still twin under reduced motion. Animals are "animals", the group is "the herd".

### 2.2 The cast: 12 original SVG yarn characters

Style: flat shapes, stitched dashed outline (dasharray 4 3), faint V-stitch fill at 8 percent, two-tone shading, black bead eyes with one highlight. Colours echo real yarns (mustard, cream with brown patches, slate and charcoal, tan with brown mane, light blue) and stay inside C 0.13. Each is split into groups (body, head, ear, tail, eyes, limb) animated with `transform-box: fill-box`. Handles are Swahili animal names; public labels stay English, Swahili appears on the Easter egg tooltip.

| # | Handle | Look | Poses and motion | Pages |
|---|---|---|---|---|
| 1 | Twiga, giraffe | Mustard `#C9A05A`, brown patches `#8A5A3C`, cream muzzle | Neck rises from the edge in 700 ms, blinks every 5 to 7 s, leans to cursor | Home hero, footer top, 404, shop header |
| 2 | Tembo, elephant | Slate `#7F878B`, charcoal `#4A4743` | Slow walk cycle on a section edge, trunk lifts a thread loop | How it works, wholesale, stockists |
| 3 | Simba, lion | Tan `#C9A67C`, mane `#7A4E32` | Mane sways 2 deg, one yawn on view, eyes follow cursor | Story, makers, hero |
| 4 | Kifaru, rhino | Light blue `#A9BCC0` | Nudges the filter chips once on load (outside the grid) | Shop header, size guide |
| 5 | Pundamilia, zebra | Cream, charcoal stripes | 6 frame trot, stripes never flash | Shop strip, parade |
| 6 | Kiboko, hippo | Slate with plum cast `#8A7F86` | Surfaces from the footer wave once, blinks, two ripples | Footer, delivery |
| 7 | Tumbili, monkey | Tan `#B98F63`, face `#EBD2C4` | Hangs from the thread, swings with scroll speed (8 deg cap) | 404, journal, custom studio |
| 8 | Sungura, rabbit | Cream, ear lining `#C99A8E` | Ears pop from section edges, hops to the CTA | Order sent, newsletter |
| 9 | Pweza, octopus | Cream, dusk dots `#A17275` | Eight arm wave, 1.6 s loop | Loading, empty cart, wizard |
| 10 | Kobe, turtle | Mint cream `#C6D0B8`, shell `#8F9E7C` | Walks the reading progress bar, hides head on fast scroll | Journal, footer |
| 11 | Kipepeo, 3 butterflies | Sky dust `#AAC2CC`, ochre, olive `#849D57` | Float on bezier paths, settle on the headline accent word | Hero, story, makers |
| 12 | Uzi, yarn ball | Terracotta `#B0654A`, thread `#C79B7D` | Rides the stitched path, squashes on landing, ties a bow on order sent | Everywhere as guide and loader |

Each character is 6 to 10 shapes, 2 to 4 KB gzipped, whole cast under 45 KB (estimates).

### 2.3 Yarn thread as the page spine

A stitched line (dasharray 6 5, terracotta at 45 percent, 2 px) runs down the page, joins sections and replaces waves and dotted rails: a straight left gutter line on mobile, soft S curves on desktop. Uzi rides it. CSS only: `animation-timeline: scroll(root)` drives `stroke-dashoffset` on a `pathLength="1"` path and `offset-path` moves Uzi, inside `@supports (animation-timeline: scroll())`. Fallback is a fully drawn static path. Chrome and Edge 115 plus and Safari 18 plus support it, Firefox stable is uncertain (sources conflict, unverified), and Chrome on Android dominates Kenya.

### 2.4 Scene, headings, micro-interactions

**Parallax.** Three flat layers: hills (`#D2BFA0` at 60 percent), acacias (`#464B2D` at 25 percent), clouds (bone at 70 percent, 50 s drift). Hero and a quiet footer strip, transform only, 12 px travel on mobile.

**Headings.** Reuse KineticHeading: per-word rise, one accent bounce, six words or fewer, one per section.

**Buttons.** Press squish (scale .97, 100 ms), hover lift 2 px, a stitched outline draws around the primary button on hover and focus (400 ms).

**Cards.** Hover: photo scales 1.03, card rises 3 px, an ear tip of the species peeks 6 px from the corner (hover and focus only). Size chips bounce on select, the quantity number rolls.

**Reveals.** Sections fade and rise 12 px once. Cards stagger 40 ms, 8 per batch. Touch gets a 120 ms press scale.

### 2.5 Key moments

**Cart hop.** On "Add to order list" the real product thumbnail (56 px circle from the card's own photo) arcs into the header basket (FLIP with the Web Animations API, 600 ms, squash at launch and landing). The basket wobbles, the count badge pops 1.0 to 1.25 to 1.0, and a pair of ears of the added species peeks 8 px above the rim until the drawer closes. The photo moves, the drawing garnishes. Reduced motion: badge change plus a polite live region, "Added Elephant to your order list".

**Order sent.** The yarn path draws across in 1.2 s, Uzi ties a bow, the herd parades left to right in 3.5 s, then lines up above the next-step cards. 24 soft yarn bits fall once for 1.5 s, no strobe. Reduced motion: static herd line and bow.

**Loading.** `loading.tsx`: Uzi rolls and unspools a thread across a 160 px track, 1.4 s loop. Skeletons are sand blocks with a 2.4 s shimmer at 4 percent contrast. Button loading is three pulsing knots.

**404.** "404" drawn in thread, Twiga peeks over the 0 looking around, Tumbili hangs from the 4. Copy: "This page has wandered off. Here is the way back." Button "Back to the animals". Click on the animal slides it along the thread to the button.

**Empty cart.** Pweza waves from the basket: "Nothing here yet. Pick an animal and it joins the list."

**Discovery.** Typing "twiga" or the Konami code runs a one time parade with a dismissible toast, off under reduced motion.

### 2.5.1 Palette options (owner decision)

The tokens have no sky or water, so a savanna reads brown on brown. Both options sit inside R3's 0.13 cap, no waiver needed:
- **A, sky and dusk (recommended):** `sky-dust #AAC2CC` (OKLCH L 0.80 C 0.03 H 225), `sky-deep #587783` (L 0.55 C 0.04), `dusk #A17275` (L 0.60 C 0.06). Illustration and video grade only, not text (`sky-deep` on bone is about 4.4 to 1, estimate). Changes: air and water in scenes, fits the light blue rhino, no change to buttons or text.
- **B, golden hour:** `sun-gold #E1B75C` (C about 0.12), `ember #C16D45` (about 0.12), `acacia-leaf #849D57` (about 0.10). Illustration only. Changes: a warmer hero. At the ceiling, anything brighter breaks R3.

Truly vivid colour needs a charter change and is not recommended.

### 2.6 Technical plan

**Format.** SVG plus CSS transforms for the cast (no dependency), Web Animations API for the cart hop, Lottie for three optional set pieces (3.9).

**Rules.** Animate only `transform` and `opacity`. Inline the first two visible characters, load the rest as one `/sprites/cast.svg` with `<use>`, fetched on idle. One IntersectionObserver sets `data-live` per scene and CSS pauses `[data-live="0"] *`. Pause on `visibilitychange`. `content-visibility: auto` on long sections. `will-change` only during a run.

**Budget per viewport.** Full tier: 4 animating characters, clouds, the yarn path, one video. Lite: 2 characters, no parallax or pointer tracking. Off: nothing moves.

**Tiers.** An inline head script sets `html[data-fx]`. `off`: reduced motion or Save-Data. `lite`: `deviceMemory` or `hardwareConcurrency` at most 4, or effectiveType 2g or 3g. `full` otherwise. A footer "Calm mode" toggle overrides (localStorage in try/catch). The median Kenyan Android is a Tecno or Infinix with 3 to 4 GB RAM on prepaid data, and a 3 MB page can cost KES 15 to 30 (single source, unverified). Cap new weight at 120 KB excluding video and test on a Tecno-class phone or 4x CPU throttle.

**Pointer.** One rAF throttled `pointermove`, only for `(pointer: fine)` while the hero is visible, eyes 3 px, necks 4 deg.

**Accessibility.** Characters are `aria-hidden` and carry no information. A 44 px "Pause motion" button (WCAG 2.2.2) sits in the hero and footer. Nothing flashes or blinks faster than once per 2 s. Reduced motion shows static poses.

### 2.7 Rule amendment to request

06-design-system.md section 7 allows one finite loop on screen. Proposed: up to 3 ambient loops per viewport (clouds, one character, hero video), each paused offscreen and by Calm mode, none within 400 px of a form, checkout or price, none on wizard steps except the Pweza loader. Needs owner sign-off (Q6).

## 3. The hero: a cinematic yarn and animals video

The hero becomes a short silent loop of crocheted animals in a stylised savanna diorama, with the real maker photo kept as the proof layer immediately below (the existing "Mikono means hands" polaroid and the moments gallery stay, and a small caption under the hero reads "Illustrated scene made with AI. The real animals and the women who make them are in the photos below."). Do not remove real photos. The video persuades, the photos prove.

### 3.1 Production plan

Make one wide diorama still with an image model, using real product cutouts as references so the animals match ours. Feed it to Veo as both first and last frame (Google lists 4, 6 or 8 s, 720p or 1080p, 16:9 or 9:16, audio included, which we strip). Re-frame a 9:16 variant, grade to site tokens (lifted blacks, no pure white). The owner checks every animal against the real product (charter rule 7).

### 3.2 Main prompt (16:9, 8 seconds)

> A handmade stop-motion diorama of a Kenyan savanna built entirely from real wool and acrylic yarn, felt and linen, at golden hour. Single continuous, slow, graceful camera move, 24 fps with a gentle stop-motion cadence (animation on twos, tiny frame-to-frame handmade jitter in the yarn fibres). Shot with a 50 mm macro-capable prime lens on a small motion control dolly, aperture f/2.0, shallow depth of field with creamy yarn bokeh.
>
> Beat 1 (0.0 to 2.0 s): wide establishing frame. Rolling hills of sand-coloured felt, three flat-topped acacia trees made of olive yarn, a soft cream sun disc low on the horizon, thin yarn clouds. A crocheted mustard-yellow giraffe with brown patches and a cream muzzle stands centre-right, a slate-grey crocheted elephant and a tan lion with a brown yarn mane stand left of centre. Warm low backlight rims every loose fibre in gold. The camera begins a slow push in.
>
> Beat 2 (2.0 to 4.0 s): the push reaches an extreme macro of a pair of brown hands, wrists and fingers only, no faces, crocheting a mustard-yellow stitch with a steel hook. Rack focus from the hook to the yarn. A single strand pulls free of the hook and begins to unspool toward frame right.
>
> Beat 3 (4.0 to 6.0 s): the strand becomes a stitched path of thread winding across the diorama floor. The camera tracks right along the thread at ground level, passing a light-blue crocheted rhino and a black-and-cream zebra. Yarn fibres catch the light, tiny dust motes drift.
>
> Beat 4 (6.0 to 8.0 s): the camera lifts and pulls back along the path to return to exactly the opening wide frame, giraffe centre-right, elephant and lion left, sun low, matching the first frame so the clip loops perfectly.
>
> Colour palette: muted and earthy, warm sand, oat, terracotta, dusty ochre, olive, baobab brown, charcoal, a hint of dusty sky blue. Low saturation, gentle contrast, lifted blacks, subtle film grain like faded 160 ASA film. No text anywhere. Silent, no music, no voice, no sound effects. Create a perfect loop where the last frame matches the first frame.

### 3.3 Negative prompt (positive phrasing, per Google guidance)

> A frame of only yarn, felt and wood textures with no readable text, logos, watermarks or captions. Hands appear only as close crops, no faces. The animals keep their original crocheted form with four legs, simple bead eyes and no human expressions. Colours stay muted, no neon, no saturation, no glossy plastic, no CGI shine. The camera moves smoothly, no shake, no fast cuts, no flashes, no strobing, no lens flare. Fibres never melt or morph. No crowds, no children, no real animals, no cartoon characters, no extra limbs.

### 3.4 Alternates

**A, shelf stop-motion (8 s, 16:9).** "Locked-off 35 mm shot of a wooden shelf in a bright Nairobi workshop at golden hour. Eight crocheted animals (giraffe, elephant, lion, rhino, zebra, hippo, monkey, rabbit) shift one by one in true stop-motion on ones at 12 fps: the giraffe's neck dips, the rabbit's ears flick, the lion's mane swings. Dust motes in a window shaft. Muted earth palette, f/2.8. First and last frame identical for a perfect loop. No text, no logos, no people. Silent."

**B, thread as river (8 s, 16:9 or 9:16).** "Overhead slow glide of one terracotta-brown yarn strand unrolling from a ball and winding across oat linen like a river through a felt savanna. Tiny crocheted animals line the banks: giraffe, hippo half in a blue-grey felt pool, zebras. The strand loops back to the ball so the end matches the start. Soft window light, macro lens, shallow depth of field, muted palette, gentle stop-motion cadence. No text, logos or people. Silent."

**C, hands only macro (6 s, 9:16).** "Vertical extreme macro, 100 mm at f/2.8, of brown hands crocheting mustard-yellow yarn in warm side light. Stitches grow into a giraffe's ear and neck, then the thread rises out of frame, ending on the same macro of hook and yarn as frame one for a loop. Muted earthy colour, film grain, no faces, no text, no logos. Silent."

### 3.5 Shot list by second (main prompt)

| Time | Beat and camera |
|---|---|
| 0 to 2 | Wide diorama, sun low, left third clear for text. Slow push in 15 percent. Giraffe blinks at 1.4 s. |
| 2 to 4 | Macro hands and hook (fingers only, brown skin). Rack focus to the hook, strand leaves toward frame right, rim lit. |
| 4 to 6 | Thread path on the floor. Ground-level track right past the light blue rhino and the zebra. Dust motes. |
| 6 to 8 | Lift and pull back along the path, settle exactly on frame 0. Last frame matches first. |

### 3.6 Variants and framing

- **16:9 (1920 x 1080).** Animals in the centre 60 percent, left third quiet for the h1 and buttons, baobab-deep scrim from the left at 55 percent.
- **9:16 (1080 x 1920).** Re-compose, do not crop: tall acacia, thread descending, camera cranes down then up, bottom 35 percent calm. The mobile box is 4:5, so crop 10 percent top and bottom.
- **Loop check.** Frame 1 must equal the last. Otherwise crossfade the last 12 frames into the first 12. Expect up to 5 generations. Remove audio with `-an`.

### 3.7 Delivery spec

| Item | Mobile | Desktop |
|---|---|---|
| Resolution | 540 x 675 (4:5), 24 fps | 1280 x 720, 24 fps |
| Codecs | H.264 High only (hardware decode everywhere) | AV1 mp4, then VP9 WebM, then H.264 |
| Size budget | under 1.5 MB | under 4 MB (target 2.5 MB AV1) |
| Audio | none | none |
| Poster | AVIF 540 w, about 35 KB, is the LCP image | AVIF 1280 w, about 70 KB |

Indicative ffmpeg (tune CRF to the budget): H.264 `-c:v libx264 -preset slow -crf 30 -vf scale=540:-2 -r 24 -pix_fmt yuv420p -movflags +faststart -an`; AV1 `-c:v libsvtav1 -crf 38 -preset 6 -an`; VP9 `-c:v libvpx-vp9 -crf 36 -b:v 0 -an`. AV1 is desktop only because hardware decode on Tecno or Infinix phones is not guaranteed and software decode drains battery. Use `media` attributes on `<source>` to split by width 900 px.

Behaviour: `<video muted playsinline loop preload="none" poster aria-hidden="true">`. The poster paints first as LCP. After `load` plus idle, JS sets sources and plays. Poster only, no video, on reduced motion, Save-Data, effectiveType 2g or 3g, or tier `off`, and on mobile tier `lite`. Pause under 25 percent visibility and on `visibilitychange`. Visible 44 px "Pause motion" button. On video error, show the placeholder scene.

### 3.8 Ship-now placeholder hero (CSS and SVG)

Build while Veo runs. Inside an `aspect-ratio: 16/9; min-height: 440px` box, inline SVG: two hill paths, three acacias, sun disc, two clouds, a stitched thread, Twiga peeking right, Simba sitting left, three butterflies. Clouds drift 60 s, the thread draws once in 1.6 s, Twiga blinks every 6 s and rises 24 px once, butterflies float 8 s. Under 12 KB gzipped (estimate).

```css
.hero-scene .thread{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.6s ease-out .3s forwards}
.hero-scene .eye{animation:blink 6s infinite}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes blink{0%,96%,100%{transform:scaleY(1)}98%{transform:scaleY(.1)}}
html[data-fx="off"] .hero-scene *{animation:none!important}
```

The SVG stays as the video fallback and the reduced-motion still.

### 3.9 Three animation briefs (Lottie or Rive)

Common: `.lottie` under 30 KB each, transparent, palette from 2.2 and 2.5.1, lazy loaded on first interaction, static SVG twin for reduced motion. Lottie is enough for all three, Rive only pays off for a pointer-reactive mascot (sprint 3).

**1. Hop into the basket (1.2 s, 512 x 512, no loop).** A baobab-brown yarn-rimmed basket. A small animal (a yarn ball for v1) leaps in an arc, squashes on landing, basket ears wiggle twice, a thread knot pops. Anticipation 120 ms, arc 500 ms, squash 150 ms, settle 400 ms.

**2. Order sent parade (3.5 s, 1200 x 400, no loop).** Uzi draws a stitched line and ties a bow, then 10 animals in profile walk left to right in a stagger, butterflies last, ending on a held pose. Up to 24 falling yarn bits in the last second, no flashing.

**3. Lost giraffe 404 plus loader (two files).** (a) Twiga walks in, her neck wanders searching, she spots the button and bows (3 s, 2 plays). (b) Uzi unspools a thread across a 160 px track, 1.4 s loop, 16 KB maximum.

### 3.10 Resource evaluation

Unverified unless stated. Re-check before adding a dependency.

| Resource | Licence | Size and cost | Fit |
|---|---|---|---|
| CSS keyframes, Web Animations API | Platform | 0 KB, compositor friendly, one reduced-motion rule | Primary: cast, cart hop, micro-interactions |
| CSS scroll-driven animations | Platform | 0 KB. Chrome and Edge 115 plus, Safari 18 plus, Firefox uncertain, `@supports` fallback | Yarn path, parallax |
| View Transitions | Platform. Same-document: Chrome 111, Safari 18, Firefox 144 | 0 KB. React `<ViewTransition>` reported stable in 19.3, repo is 19.2.8 | Card to product photo morph, sprint 3 |
| Motion (Framer Motion) | MIT | Full about 34 KB, `LazyMotion` plus `m` about 4.6 KB, `useAnimate` mini about 2.3 KB, `useReducedMotion` | Layout animation only |
| GSAP, ScrollTrigger | Free including commercial since 2025 (verify at gsap.com) | About 35 KB gzip | Not needed, backup for the yarn path |
| dotLottie React | Player believed MIT. LottieFiles free art: Lottie Simple License, commercial use, no attribution, no resale as files | Wasm about 500 KB from CDN, files up to 80 percent smaller than JSON, lottie-web 64 to 82 KB. Canvas, add `aria-hidden` and a still | Three set pieces, self-host wasm, lazy load. Stock art will not match our yarn style |
| Rive | MIT runtime | Canvas wasm 567 KB compressed (canvas-lite 222 KB), needs ARIA | Pointer-reactive mascot, sprint 3 or later |
| three.js, react-three-fiber | MIT | About 150 plus 37 KB gzip, GPU and battery cost | Skip for a 3 to 4 GB phone, fake a 3D yarn ball in CSS |
| Spline | Terms unverified | Scenes 2 to 5 MB plus runtime | Skip |
| tsParticles | MIT | Slim size unverified | Skip, 24 bit confetti is 40 lines of CSS |
| Veo 3.1 | Google terms, output rights depend on plan (verify) | 4, 6, 8 s, 720p or 1080p, SynthID, audio included | The hero video, labelled AI-made |

## 4. Page by page liveliness plan

**Home.** Hero scene (placeholder, then video), h1 48 px, both CTAs visible at 390 x 844. Order: hero, category circles (an animal peeks behind each on hover), featured rail, one-row trust strip, how it works (Uzi walks the three steps), stockists line, moments rail. Yarn path joins sections. Budget: 3 characters, clouds, video.

**Shop.** 96 px header with a Kifaru nudge and Twiga peek, outside the grid. Compact cards, ear tip on hover. No characters in the grid except one 40 px Zebra trot strip between rows 6 and 7. Empty filter: Pweza shrug.

**Product.** Swipe gallery, 1.02 tap zoom, species mini-sprite waves once. Size chips squish, add runs the cart hop. No scenery near price or add.

**Cart.** Removal slides left 200 ms. Empty state Pweza. The sticky "Send on WhatsApp" bar only squishes on press.

**Order.** Thread progress bar, Uzi moves only on step change. Pweza loader on submit. Order sent: parade and bow, then next-best actions from document 10. Form steps stay still.

**Journal.** 4:3 cards, kinetic post titles, Kobe on reading progress, Tumbili swings once at post end.

**Story.** Polaroids with the thread weaving through the timeline, Simba beside the real maker photos, stats count up once, butterflies settle on "Mikono means hands".

**Makers.** Polaroids tilt 1 deg on hover, thread links cards, no animal over faces.

**Stockists.** Pins drop with one bounce, Tembo walks the list edge once, cards uniform.

**Wholesale.** Calm and trade-trustworthy: one Tembo strip, Uzi guides three steps, no motion near the form.

**Custom studio (strategy/09).** Type cards each get an animal that tilts on hover. The live brief card draws a thread from each filled field to the preview. The S to XL ladder shows four growing Twiga silhouettes. No motion inside inputs.

**Footer.** Kiboko surfaces from the wave once, Kobe crosses the bottom edge every 20 s while visible, Calm mode toggle.

## 5. Implementation plan: 3 to 7 in two sprints

One front-end developer plus one illustrator, one-week sprints. Effect points are judgement estimates.

| Sprint | Work | Effort | Risk | Effect |
|---|---|---|---|---|
| 1 | Density pass: tokens, padding, card diet, cookie bar, home merge | 2 d | Low | +1.0 |
| 1 | `data-fx` tiers, reduced-motion base, micro-interactions | 1.5 d | Low | +0.5 |
| 1 | Critter component, 4 characters (Twiga, Simba, Uzi, butterflies) | 3 d | Medium (art) | +1.0 |
| 1 | Placeholder SVG and CSS hero | 1.5 d | Low | +1.0 |
| 1 | Cart hop, basket ears, yarn path | 2 d | Low | +1.0 |
| 2 | Remaining 8 characters placed per section 4 | 4 d | Medium | +0.5 |
| 2 | Order sent parade, 404, loaders, pointer eyes, Kobe, Kiboko | 3 d | Low | +0.75 |
| 2 | Veo hero: generate, grade, encode, wire up | 2 d plus iterations | High (loop, accuracy, size) | +0.5 |
| 2 | Three Lottie pieces, if commissioned | external | Medium (wasm weight) | +0.25 |
| 2 | QA on a Tecno-class phone, Lighthouse, axe, reduced-motion audit | 1 d | Low | gate |

Sprint 1 should land near 5.5 to 6, sprint 2 at 7.

**80 percent for 20 percent:** card and section diet, the placeholder hero with Twiga and Simba, one CSS file of button and card micro-interactions, the cart hop, the yarn path. Together about 4 of the 5 points. Veo, Lottie and the full cast earn the last point.

Risks: art consistency (one illustrator, one style sheet), weight creep (120 KB cap excluding video), motion near the order flow (pause it). If any motion lowers add-to-order or WhatsApp send rates in the document 03 events, cut it.

## 6. Questions for the owner

1. Do the muted rules apply to illustration too? Option A (sky and dusk), B (golden hour) or neither?
2. Is the herd of 12 right, and are hidden Swahili labels welcome?
3. May the hero video be AI-made and labelled, or must it be real footage? Is there phone footage of hands crocheting?
4. Hands only, no faces, is the default. Can makers' hands be filmed for reference?
5. Is there budget for an illustrator and Lottie or Rive work, or do we generate and hand-clean?
6. Do you accept up to three ambient loops with Pause motion and Calm mode (amends 06 section 7)?
7. Which phones do customers use? May low-end phones default to lite mode?
8. Is the shop card diet acceptable (sizes and price on the product page, one button per card)?
9. Should the cart hop show the real photo (recommended) or a drawn animal?
10. Any animals, colours or cultural touches to add or avoid, and how will we judge 7 out of 10?
