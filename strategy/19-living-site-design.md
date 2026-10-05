# 19. The living site: design spec

Status: design only. No site code was changed. Prototypes are in `strategy/living-lab/` (open the `.html` files; `build.mjs` rebuilds them from `*.src.html`, the existing `components/fx/fx.css` and `public/fx/cast/*.svg`). Query flags: `?welcome=1`, `?hover=N`, `?touch=1`, `?found=N`, `?click=ms`.

## 0. What the owner told us, and what it means

The owner loves it, but needed several visits to notice things. Study of the live site (390x844 and 1440x900, scrolled every 400 px) found why:

1. Animals sit half off screen in the gutters at 15% to 36 px wide on phones, behind content (z -1). On a phone the giraffe peek, zebra and yarn ball are nearly invisible.
2. The yarn path is a 45% opacity dashed line, 14 px wide in the gutter, drawn only on the home and story pages. Nothing says it is progress.
3. Home has 4 ambient animals, shop 3, story 3, journal and product 0. There is no pattern a visitor can learn.
4. Everything is unlabelled and unrewarded. Nothing reacts to touch.

So the fix is not more animals. It is: bigger on first sight, one clear rule per behaviour taught in context, every behaviour repeated on every page, and a reaction to whatever the visitor does.

Six rules that all choreography below obeys:

- R-A. Teach once, then trust. Each rule appears as a tiny in-context hint the first time, never again (stored).
- R-B. Things appear where the eye already is (next to the heading you are reading), not in the gutter.
- R-C. Everything is optional and decorative: `aria-hidden`, `pointer-events:none` (except the hidden finds, section 7), never over text, prices, form fields, or tap targets.
- R-D. Habitats: the animal matches the content (section 2).
- R-E. Same motion grammar everywhere: rise from a surface, settle, idle, leave. No sliding across content.
- R-F. Budgets: at most 4 animating animals in a phone viewport, 6 on desktop, counted at any instant (section 6).

## 1. Discoverability and natural blending

### 1.1 First-visit choreography (once, about 6 seconds, skippable by doing anything)

Trigger: first load of the home page after the splash ends (`html[data-splash]` cleared) and `localStorage mk-welcome` unset. Prototype: `p1-hero.html?welcome=1`.

```
t=0.0 s   splash animals "walk into the hero": the splash lion, giraffe, zebra land on the same spots as the hero scene (no jump cut)
t=1.0 s   the rabbit rises from a grass tuft that sits just under the Shop button row (rise 0.9 s, soft ease)
t=1.3 s   a stitched arrow draws (0.8 s) from the rabbit up to "Shop the animals"; a pill "Start here" fades in
t=1.0 s   Shop button gets a one-time soft ring pulse (2 loops, 1.4 s each)
t=1.0-4.0 rabbit raises one arm and waves (6 half-waves)
t=4.4 s   arrow and pill fade out
t=5.4 s   rabbit sinks into the grass
t=6.2 s   one line of legend fades in and STAYS under the buttons: "Follow the thread. It shows how far down the page you are."
```

Rules: runs once per browser (`mk-welcome=1`). Any scroll, tap or key press shortens it: the rabbit sinks at once and the legend appears. Under reduced motion or Animals off: no animation, the legend line is shown statically (it is information, not decoration). The rabbit never overlaps the buttons: it lives in a 74 px lane below them with `clip-path`, so on a 390 px screen the button row (y 318 to 366) is untouched.

### 1.2 Idle nudge

If the visitor stops scrolling and touching for 5 s (timer reset by scroll, pointerdown, keydown), the animals currently on screen do one 2.6 s gesture: the nearest resident nods or waves, the yarn ball hops twice. Then silence for at least 20 s and at most 3 nudges per page view. This teaches "they are alive" without anyone clicking. Prototype: `p1-hero.html?idle=1500`.

### 1.3 The in-context legend (one line each, shown once, then in the footer help)

| Moment | Hint (plain words) | Placement |
|---|---|---|
| Welcome | Follow the thread. It shows how far down the page you are. | Under hero buttons, stays |
| First knot lit | Each knot is a new part of the page. | Small label beside the knot, 3 s |
| First animal pops | Tap an animal to see it react. | Under the animal, 3 s |
| First hidden find | You found one. 1 of 12. | Toast, 4 s |
| Toggle | Animals: on / off | Footer and menu, always visible |

Hints are text in the DOM with `role="status"` only for the find toast; the others are plain visible text, not announced. Each has a stored flag (`mk-hint-thread`, `mk-hint-tap`).

### 1.4 The Animals toggle

A visible switch labelled `Animals: on` or `Animals: off` (44 px tall) in the footer bar and in the mobile menu sheet. Persists to `localStorage mk-animals`. It maps onto the existing tiers: off sets `html[data-fx=off]`; on restores the detected tier (full or lite). Reduced motion starts it as off and shows `Animals: off (your device asks for less motion)`; the visitor may still turn animals on and get calm still poses. It is shown in the prototypes.

## 2. A world, not wallpaper: habitat per section

Each section type owns a habitat, a thread colour, and a resident list. The thread changes colour as it crosses habitats (gradient stops at the knots).

| Habitat | Where | Thread colour | Residents (existing / cast2) | Surface they use |
|---|---|---|---|---|
| Savanna | Home hero, story hero | ochre `#C9A05A` | giraffe, lion, zebra, elephant / cheetah, ostrich, buffalo | Hill line inside the hero stage |
| Acacia grove | Shop rows, home "Meet the herd" | terracotta `#B0654A` | giraffe (peeks over headings), monkey / leopard, hornbill, chameleon, bush baby, secretary bird on rails | Heading baseline, card top edge, branch rail |
| Nursery shelf | Gifts, baby and kids content | blush `#C98F83` (R3 capped) | rabbit, butterfly, octopus / chick, bee, ladybird | Shelf line under the intro |
| Pet corner | Domestic animals | warm tan `#B98F63` | / dog, cat, goat | Basket rim, card corner |
| Workshop table | Makers, story, custom studio, journal | olive `#6A7049` | octopus (many arms), yarn ball, turtle, monkey / bee, thread loop prop | Table edge under the section heading |
| Market stall | Stockists, wholesale | ochre-olive | elephant, rhino / warthog, goat, basket prop | Awning line, basket |
| Nairobi skyline | Contact | slate `#587783` | giraffe (Giraffe Centre), butterfly / secretary bird | Skyline strip |
| Watering hole | Footer on every page | dusk `#587783` to `#2B211B` | hippo (surfaces), elephant, turtle walker, butterfly / flamingo, crocodile eyes, tortoise, impala | Pond and ground curve |
| Cart and order | Cart, order sent | terracotta | tortoise in the cart, rabbit parade | Basket, step cards |

Habitat rules of thumb: flamingos and hippo only near water; giraffes peek over headings (their neck is the pointer); chameleon on card edges; birds on rails (secretary bird, hornbill on the branch prop); bees by honey words only if the copy has them (gift copy, never claims); dog and cat only in the domestic section and the pet corner; tortoise in the cart.

## 3. The Thread (the site's spine)

Prototype: `p2-thread.html`. Built on the existing `YarnPath`, but promoted from a decorative gutter line to a labelled progress rail.

### 3.1 Look in both states

| | Unscrolled (the path ahead) | Scrolled (the path behind) |
|---|---|---|
| Stroke | dashed `6 5`, 2 px, terracotta at 42% | solid 3.4 px, habitat gradient, plus a faint ply (light dashes at 50% white, `1.2 5.6`) so it reads as twisted yarn |
| Knot | open circle, dashed outline, bone fill | filled circle in habitat colour, scale pop 0.6 to 1.5 to 1 in 0.7 s |
| Branch | dashed 2 px horizontal line from knot under the heading | fills in habitat colour over 1.1 s, a 3 px stitched underline of the heading |
| Colour tokens | `--thread-a #C9A05A`, `--thread-b #B0654A`, `--thread-c #6A7049`, `--thread-d #587783` | same, as gradient stops placed at the knots |

All colours are inside R3 (chroma at or below 0.13). The thread colours never carry text.

### 3.2 Behaviour

- Head position: the filled end sits at `scrollY + viewport * (0.3 + 0.7 * progress)`, so the head is a third down the screen at the top of the page and at the bottom edge at the end. The visitor always sees the head near where they read.
- Yarn ball (Uzi) rides the head. It rotates by path length, squashes up to 16% with scroll speed (`velocity/5000`), tilts up to 8 degrees, and hops twice on the idle nudge. Size 24 px on phones, 38 px on desktop.
- Milestone knots sit at section headings (one per `h2[data-knot]`, at most 6 per page, minimum 520 px apart). On reach: knot fills, branch fills, and the section's animal rises from the branch line (0.8 s overshoot ease, `labpop`). Each page uses a different animal per knot, drawn from that section's habitat.
- Walkers: the turtle (or later tortoise) can walk along a branch, 9 s, linear, at most one per page.
- Memory: knots stay lit when scrolling back up; the head retreats, the fill keeps what it reached.

### 3.3 Layout per breakpoint

- Desktop 900 px and up: soft S curve in the gutter (x from 30% to 62% of the gutter, alternating at each knot), branches extend to the content edge. Wide gutters (over 160 px): thread plus an animal column. Narrow desktop: branch only.
- Phone: straight line 7 px from the left edge, 2 px dashed to 3.4 px filled, branches 16 px to the right gutter edge under the heading. Safe: content already has 16 px side padding, the line sits in the outer 14 px, and nothing animated crosses a card.
- Crossing components: the thread runs `z-index:0` behind cards; branches are drawn in the gap above each `h2`, never through a card or grid. Where a heading is inside a card, the knot attaches to the card's left outer edge instead.

### 3.4 Fallbacks and technique

- Chrome, Edge, Safari 18 and up: fill by `animation-timeline: scroll(root)` on `stroke-dashoffset` (linear in scrollY; the head offset formula above is baked into the keyframes with the measured section heights, one `ResizeObserver`). Ball position by `offset-distance` on the same timeline.
- Others (Firefox stable, older Android WebView): the prototype's rAF scroll handler (passive scroll, one write per frame, `transform` and `stroke-dashoffset` only). If even that is off (tier lite), draw the thread fully filled and static, with knots lit, and no ball. Tier off: show the dashed thread only.
- No layout shift: the thread is `position:absolute` with a height equal to the document, set after fonts load and on resize; it does not change document height.

## 4. Interaction vocabulary (all optional)

| Trigger | Reaction | Notes |
|---|---|---|
| Pointer near an animal (fine pointer) | Head turns up to 5 degrees toward the cursor; eyes shift 3 px | One rAF-throttled `pointermove`; only animals in view |
| Tap or click on an animal | Hop 14 px with a squash, 12 thread bits; the Nth tap of the same animal in 3 s makes it "tickled": laugh wiggle | Only animals that opt in (`pointer-events:auto`, section 7); 44 px hit area |
| Hover or focus on a product card (peek-a-boo) | The species' head rises from behind the card top edge by 38 to 48 px over 0.55 s, card lowers 3 px; on leave it sinks. Touch: the card nearest the middle of the screen for 600 ms, one at a time | `p3-peek.html`. Peeker sits behind the card (z 0), above the row gap; tuned per species by sprite bounding box (elephant top 0.40, giraffe 0.09, lion 0.34, rabbit -0.01) |
| Scroll velocity | Sway up to 3 degrees, ball squash; parallax of hero hills at 0.10, 0.20, 0.34 | Transform only |
| Section entry | Knot pops, resident rises | Section 3 |
| Add to order list | The animal of the product's category hops from the button to the basket (0.85 s arc with squash), basket wobbles, badge pops 1 to 1.5 to 1, polite live text "Added Elephant to your order list". Category map: safari = that species; domestic = dog or cat; wall art and dolls = rabbit; bags and misc = yarn ball | `p3-peek.html`; reduced motion shows only badge change and live text |
| Empty cart | Tortoise looks out of the basket and blinks | Replaces the octopus |
| Order sent | Thread draws across the page in 1.2 s, the yarn ball ties a bow, the herd parades left to right in 3.5 s (max 6 on desktop, 4 on phone), 24 thread bits once | Already specified in 11; budget capped here |
| Loading splash continuity | The splash lion, giraffe, zebra end on the hero's resting positions, then become the hero residents | Share positions via CSS vars |
| Seasons | Christmas hat, Easter eggs, Eid lanterns. Chosen in code by date range, one `data-season` on `html`, overlay SVG groups on 3 residents. Clearly optional, off with the toggle. Assets to draw: `hat-santa`, `egg-set`, `lantern` | Owner decision; default off |
| Hidden finds | Section 7 | |
| Sound | Never | |

## 5. Choreography per template

Notation: R = residents; B = budget (phone / desktop); "edge peek" = half off screen from a screen edge, 56 to 72 px, never within 16 px of any tap target.

Global z-index and pointer rules: page content z 1; thread and habitat decor z 0; residents z 2 only where they stand on a surface and never overlap text boxes; peekers behind cards z 0; hop and parade layer z 60, fixed, `pointer-events:none`; hidden finds are the only `pointer-events:auto` animals and have a 44 px hit box that does not overlap other targets. Safe areas: keep 24 px clear around any button, input, link, price, filter chip; keep 400 px of vertical clearance between a moving animal and a form field or Add button (rule from 11).

| Template | Residents and anchor | Trigger | B phone / desktop | Phone variant |
|---|---|---|---|---|
| Home | Hero stage: giraffe, lion, zebra, butterfly (hero scene). Grass lane under hero buttons: rabbit (first visit only). Knot "Shop by kind": zebra. Knot "Meet the herd": giraffe. Knot "Three ways": turtle walker. Footer: watering hole | Load, knot reach | 4 / 6 | Hero 3 animals at 150, 120, 90 px; knot animals 60 to 74 px |
| Shop listing | Giraffe peeks over the "Safari animals" heading; chameleon on first card edge (hover/near-centre only); bird on filter bar rail (static until filter change, then one flap) | Load, card in view | 3 / 5 | Only the heading giraffe and one card peeker |
| Product | One companion beside the gallery (the species, 72 px, in the outer gutter on desktop only); on Add: category hop. Nothing within 400 px of price and Add button except the hop | Add click | 1 + hop | No companion; hop only |
| Cart | Tortoise in the empty state; with items: the basket rim has one pair of ears of the last added species | Load | 1 / 2 | Same |
| Order sent | Rabbit celebrate + herd parade + confetti | Load once | 4 / 6 | Parade of 3 |
| Studio (custom) | Octopus in the empty step; yarn ball as wizard progress rider on the stepper line. No animals over fields | Step change | 1 / 2 | Same, yarn only |
| Journal index | Turtle walks a thin reading line under the heading; monkey hangs from the thread at the third knot | Scroll | 2 / 3 | Turtle only |
| Journal post | Thread is the reading progress; turtle rides it; end of article: a butterfly settles on the last word of the last paragraph's margin (not on text) | Scroll end | 2 / 2 | Turtle, thread only |
| Story | Lion peeks at "Mikono means hands"; butterflies float near the heading; elephant at the end | Knots | 3 / 4 | Lion only |
| Makers | Lion 120 px beside intro; octopus on the table edge; no animals over portraits | Load | 2 / 3 | Octopus edge peek |
| Gifts | Nursery shelf: rabbit, butterfly, bee beside gift copy (cast2) | Knot | 3 / 4 | 2 |
| Stockists | Market stall: elephant and rhino stand on the awning line above the list; basket prop | Knot | 2 / 3 | 1 |
| Wholesale | Elephant walks along one knot branch once | Knot | 1 / 2 | 1 |
| Contact | Skyline strip: giraffe; butterfly | Load | 2 / 2 | 1 |
| 404 | Giraffe "lost" looking around (existing), monkey hanging from the 4; click slides the giraffe to the button | Load | 2 / 2 | Giraffe only |
| Legal, checkout inputs, forms | None. No thread animals, thread may be static dashed only on legal pages | n/a | 0 | 0 |
| Footer (all pages) | Watering hole: hippo surfaces every 9 s, ripples, elephant, turtle walker 60 s, butterfly, found counter and toggle | In view | 3 / 5 | Hippo, elephant, butterfly |

Budget enforcement: a tiny `budget` function counts `.fx-char[data-live=1]`, the offscreen observer sets `data-live` only for the 4 or 6 nearest the viewport centre; extras are paused (still pose). This replaces the per-page static lists.

## 6. ASCII layouts

Home, phone 390 wide (first screen):
```
+------------------------------+
| logo                  basket |
| MIKONO CREATIONS             |
| Crocheted animals, made      |
| by hand in Nairobi           |
| text text text               |
| [Shop the animals][Make it ] |
|  (rabbit)^ Start here        |   74 px lane, clipped, 24 px below buttons
| ^^^^^ grass tuft ^^^^        |
| Follow the thread. It shows  |
| how far down you are.        |
|  [ hero stage: giraffe lion zebra butterfly, parallax hills ]
| |  thread (7 px from edge)   |
+------------------------------+
```
Desktop section with knot:
```
 thread S-curve in gutter        content (max 1200)
   o--------------------------------------- (branch fills)   [giraffe pops on branch end]
  /        Shop by kind of animal
 |         (circles row)
```

## 7. Hidden "find the herd" game

12 hidden animals on 12 different pages, each a real, small, quiet detail on a surface of its habitat: rabbit in the footer grass (prototype `p4-waterhole.html`), monkey on the journal thread, chameleon on a card edge, hornbill on a branch in the story page, turtle on the size guide ruler, etc. Rules:

- Each find is a `<button>` with `aria-label="Hidden animal: rabbit. Activate to find it"`, 44 px hit box, `tabindex=0` so keyboard users can find them (focus reveals the animal). This is the one place an animal is not `aria-hidden`.
- Count is in the footer bar and in the menu: `Animals found 3 of 12` with 12 dots. Stored in `localStorage mk-found` (list of ids). No account, no server, no analytics beyond an optional anonymous count event.
- Reward: a thread bit burst (26 bits, 1.6 s) at the animal and a message. At 12: `You found the herd. All 12 animals are out. Thank you for looking.` No discount or prize unless the owner supplies one (Open question Q1).
- The first find is lightly hinted: on the footer, the rabbit's ears are always up (visible), so a visitor sees one; all others are fully hidden.

## 8. Copy (plain words, no dashes)

Legend and hints:
- Follow the thread. It shows how far down the page you are.
- Each knot is a new part of the page.
- Tap an animal to see it react.
- Animals: on / Animals: off
- Animals: off. Your device asks for less motion. You can turn them on.
- Start here (welcome pill)

Found messages:
- Found one. 1 of 12.
- Found one. 5 of 12. Keep looking.
- Found one. 11 of 12. One left.
- You found the herd. All 12 animals are out. Thank you for looking.
- Already found. This one is yours.

Order and cart:
- Added Elephant to your order list (live text)
- Nothing here yet. Pick an animal and it joins the list. (tortoise)

## 9. Performance and tiers

- Tiers unchanged: full, lite, off. Mapping: full runs everything; lite keeps blink, thread fill (static fallback) and one resident per viewport, no peekers, no parade, no ball squash; off nothing moves, thread dashed, legend text still shown.
- Properties: transform and opacity; the thread fill uses `stroke-dashoffset` (compositor-friendly when driven by scroll timeline; one SVG path, no filters, no blur other than the existing header).
- One IntersectionObserver for residents; one passive scroll listener (rAF) for the thread; one pointermove only on fine pointers.
- Weight: new CSS under 6 KB gz, new JS under 5 KB gz (thread, welcome, peek, found counter), cast2 sprites 3 to 5 KB each loaded only on pages that use them. `content-visibility:auto` on long sections already used.
- Prototype timing on the lab pages (headless, no throttling): no console errors; see QA checklist for measured targets to confirm on a throttled device.

## 10. QA checklist for verifiers

Layout and safety
- [ ] No animal, bubble, arrow or pill overlaps any text, price, form field, link or button at 390x844, 360x740 and 1440x900 (screenshot each section, check bounding boxes against `a, button, input, h1-h3, p`).
- [ ] The rabbit lane never touches the Shop button (24 px minimum gap).
- [ ] The only focusable animals are the 12 hidden finds; all other animals are `aria-hidden` and `pointer-events:none`.
- [ ] Hit boxes of finds are 44 px and do not overlap other targets.
- [ ] No horizontal scroll at 320 px. No layout shift: CLS unchanged within 0.01 of baseline (thread and peekers are absolutely positioned).

Budgets
- [ ] Phone: at most 4 elements with a running animation among `.fx-char[data-live=1]` at any frame (sample 20 times while scrolling). Desktop: at most 6.
- [ ] Hop and parade layers are removed from the DOM when finished.
- [ ] Each template matches section 5; legal pages and checkout inputs have zero animals.

Accessibility and control
- [ ] `Animals: on/off` is visible in the footer and menu, 44 px tall, keyboard operable, persisted across reload, and off removes all motion immediately (thread dashed, no ball, no peekers, no pops).
- [ ] `prefers-reduced-motion: reduce` starts as off; no animation runs; legend text is still shown; live text still announces Add.
- [ ] Welcome plays once; second visit does not play it; any input skips it.
- [ ] Contrast of any hint text at least 4.5:1 on its background.
- [ ] The found toast has `role="status"`; keyboard users can reach and trigger each find.

Performance
- [ ] 60 fps target on desktop; on 4x CPU throttle, mean frame under 20 ms and p95 under 34 ms during a full-page scroll of home.
- [ ] lite tier: no peekers, no parade, no ball squash; verify via `localStorage mk-fx=lite`.
- [ ] Browser without scroll timelines (Firefox, or disable `animation-timeline`): thread still fills via the scroll handler, or shows fully filled static.
- [ ] Transfer added by this layer under 120 KB with all cast2 on the busiest page.

## 11. Rollout order

1. Toggle and storage keys, thread upgrade (3), welcome and legend (1).
2. Habitat map applied to home, shop, footer watering hole.
3. Peek-a-boo cards and category basket hop.
4. cast2 sprites into habitats, hidden finds, seasons last.

## 12. Open questions for the owner

- Q1: Do you want a real reward for finding all 12 (a discount, a free sticker)? Default is only the message.
- Q2: Seasons: do you want Christmas, Easter and Eid variants, and who checks cultural fit?
- Q3: Which 12 pages should hide animals? Default list in section 7.
- Q4: Are dogs, cats and goats part of your range that you want pictured, or only safari animals?
- Q5: Should the welcome rabbit be a different animal, for example the one from your best seller?

## 13. Prototype notes

Four prototypes with the existing sprites. Each was screenshotted at 390 and 1440 and iterated at least twice:
- `p1-hero.html`: first fixes were the arrow and pill clipping out of the lane, the lane overlapping the chips, and the acacia silhouettes reading too faint; all fixed. Residual: the hero stage is a stand-in for the real HeroScene.
- `p2-thread.html`: fixed heading section padding that was eating the knot position, and made the walker (turtle) travel along the branch. Residual: gradient stops are per knot; page with very close knots will look banded.
- `p3-peek.html`: first version had every peeker showing only a sliver or hiding behind the heading text; retuned per species from the sprite bounding boxes. Residual: the sprites are side views, so a head peeking from behind a card reads best for giraffe, lion and rabbit; elephant shows head and ear only.
- `p4-waterhole.html`: rabbit moved away from the walking turtle, toast moved above the safe area. Residual: on desktop the thread passes behind the hill and ends there; in production it should end at the ripples by raising its z-index above the decor layer.
