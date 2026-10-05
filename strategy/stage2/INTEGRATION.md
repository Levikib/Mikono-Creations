# Stage 2 fx integration guide

Nothing here is imported by the site yet. All new files; no existing file was edited.

## Files

| Path | What |
|---|---|
| `public/fx/cast/<name>.svg` | 12 sprites: giraffe, elephant, lion, rhino, zebra, rabbit, hippo, monkey, octopus, turtle, butterfly, yarn. 200x200 viewBox, transparent, 3 to 5.5 KB each. Source generator: `strategy/stage2/src/gen-cast.mjs` |
| `public/fx/hero-poster.jpg` | static first frame of the hero (1280x720, 59 KB), default poster for the video |
| `scripts/build-cast.mjs` | reads the SVGs, writes `components/fx/cast.generated.ts`. Run `node scripts/build-cast.mjs` after changing a sprite. Suggested: add `"prebuild": "node scripts/build-cast.mjs"` to package.json |
| `components/fx/cast.generated.ts` | generated: `export const giraffe = '<svg...>'` per character, plus `cast` map and `CastName` |
| `components/fx/fx.css` | all animation, tiers, ambient, yarn path, hero |
| `components/fx/*.tsx` | `Character`, `Confetti`, `AmbientCast`, `YarnPath`, `HeroScene` (+ `HeroShell`, `heroScene.ts`), `FxProvider`, `FxInitScript`, `CartHop`. Barrel: `components/fx/index.ts` |

## Wiring (root layout)

```tsx
import '@/components/fx/fx.css';
import { FxProvider, FxInitScript, CartHop } from '@/components/fx';

<html lang="en">
  <head><FxInitScript /></head>   {/* sets html[data-fx] before paint */}
  <body>
    <FxProvider>{children}<CartHop /></FxProvider>
  </body>
</html>
```

`FxProvider` (client) re-detects the tier, keeps `html[data-fx]` in sync, and runs one IntersectionObserver that sets `data-offscreen="true|false"` on every `.fx-char[data-anim]`, `.fx-hero` and `.fx-yarn` (CSS pauses animations while true). `useFxTier()` returns `{ tier, setTier }`; `setTier('off' | 'lite' | 'full' | null)` persists to `localStorage['mk-fx']` (use it for a "Reduce motion" footer toggle).

Tier rules: reduced motion = off; stored choice; Save-Data, 2g, deviceMemory <= 2, cores <= 2, or (memory <= 4 and cores <= 4) = lite; else full.
- `off`: nothing moves, no ambient, no parade, no confetti.
- `lite`: blink only (plus the hero); no ambient, no parade, no sway.
- `full`: everything.

## Components and props

```tsx
<Character name="giraffe" size={96} anim="idle" className="" edge="right" flip seed="x" style={{}} />
```
`name`: `CastName`. `size`: px number or any CSS length. `anim`: `idle | peek | parade | hop | celebrate | lost | float | none` (default idle). `edge` is for peek (`left | right | bottom`). `flip` mirrors (sprites face right). Server component, SVG inlined, ids scoped per instance, blink delay and period (4 to 6 s) derived deterministically into `--fx-d` and `--fx-b`. Always `aria-hidden`.

- `<Confetti count={16} />` thread confetti; put in a `position:relative` parent beside a `celebrate` character.
- `<AmbientCast page="home|shop|product|journal|story|custom" maxWidth={1200} />` inside a `className="fx-host"` wrapper (`position:relative; isolation:isolate`). Edit `AMBIENT_CONFIG` to retune. Characters sit behind content (z -1) in the gutters, half off-screen under 1100px, capped to 36px under 600px, hidden under 360px.
- `<YarnPath side="left|right" maxWidth={1200} color="#B0654A" />` inside `.fx-host`. Use the opposite side to AmbientCast characters when possible. Drawn on scroll via `animation-timeline: scroll(root)` (Chrome, Edge, Safari 18+); everywhere else it is a fully drawn static stitched line. Mobile shows a straight line in the left gutter.
- `<HeroScene videoSrc={{ webm, mp4, poster }} caption="..." />` see below.
- `<CartHop />` see below.

## Per page placement

| Page | Placement |
|---|---|
| Home | `HeroScene` at the top; `AmbientCast page="home"` (butterfly, giraffe peeks, yarn ball, zebra); `YarnPath side="right"` linking sections |
| Shop | `AmbientCast page="shop"` (rhino peek, butterfly, turtle); never inside the product grid or filter panel |
| Product | `AmbientCast page="product"` (yarn, butterfly) only in the outer gutters; keep 400 px clear of price and Add button (gutters satisfy this) |
| Cart (empty) | `<Character name="octopus" anim="idle" size={140}/>` in the empty state; yarn ball with `anim="idle"` as loader |
| Order sent | `<Character name="rabbit" anim="celebrate" size={160}/>` plus `<Confetti/>` in a relative wrapper; yarn ball beside it |
| Journal | `AmbientCast page="journal"`; optional turtle on the reading progress bar (later) |
| Story | `AmbientCast page="story"` (lion peek, butterfly, elephant) |
| Makers | lion `idle` 120px beside the intro, butterflies `float` near the heading; no ambient over portraits |
| Custom | `AmbientCast page="custom"`; octopus in the wizard empty state |
| 404 | `<Character name="giraffe" anim="lost" size={200}/>` (or monkey) centred above the message |
| Footer | hippo `peek` with `edge="bottom"` at the top edge of the dusk band; turtle idle |

## Cart hop

`CartHop` listens for a window event. Dispatch it from the cart store (or the Add button handler) right after a successful add:

```ts
const r = button.getBoundingClientRect();
window.dispatchEvent(new CustomEvent('mikono:cart-add', { detail: { x: r.left + r.width / 2, y: r.top + r.height / 2, character: 'rabbit' } }));
```
Mark the cart button (or its badge) with `data-cart-target`. The sprite arcs from the button to the target in 0.85 s, then `mikono:cart-landed` fires (use it to bump the badge). It does nothing under reduced motion, `data-fx="off"`, when no visible target exists, or if no coordinates are given. `character` is `rabbit` (default) or `yarn`; only those two sprites are in the client bundle (about 8 KB).

## HeroScene (placeholder now, Veo later)

Layered parallax SVG (sky, glow and sun, clouds; far hills; three acacias; mid hills; lion, elephant, giraffe; foreground, yarn ball, stitched thread, dust). About 22 KB of markup, 10 animated nodes, all `transform` and `opacity` (the thread is revealed by scaling a mask rect once). Pointer parallax on fine pointers only, plus scroll parallax, both via CSS vars `--px` and `--sy` set in an rAF throttle and paused offscreen. `Pause motion` button is always visible while motion is possible (hidden under reduced motion or off). Caption slot defaults to the required sentence; pass `caption=""` to hide.

To switch to Veo: `<HeroScene videoSrc={{ webm: '/media/hero.webm', mp4: '/media/hero.mp4', poster: '/media/hero-poster.jpg' }} />`. The same stage and caption stay; the video (autoplay, muted, loop, playsinline, poster first) fades in on `canplay` and the SVG layers fade out and pause. No video is loaded under Save-Data, reduced motion or `data-fx="off"`; it pauses offscreen and with the Pause button. Poster defaults to `/fx/hero-poster.jpg`. The stage keeps `aspect-ratio: 16/9` with `min-height: 440px`; on phones it crops sides (the three animals stay in the centre 800 units).

## Accessibility

- Every character, ambient layer, confetti, yarn path and the hero art is `aria-hidden`, `pointer-events: none`, and holds no text. The Pause motion button and the caption are the only accessible nodes.
- `prefers-reduced-motion: reduce` kills all animation and transitions, hides parade and confetti, draws the yarn path fully, and keeps ambient characters as still decoration.
- No motion within 400 px of forms, prices or Add buttons: ambient sits in gutters behind content; do not use `parade`, `celebrate` or `float` characters inline near those.
- Nothing animated changes layout (transforms only; ambient is absolutely positioned and clipped).
- Contrast is not an issue (decorative), but do not place sprites behind text.

## Performance budget

- Cast: 3.0 to 5.5 KB each (55 KB for all twelve as raw strings, server side only). A page ships only the characters it renders as markup; `CartHop` ships rabbit and yarn.
- Hero: 22 KB SVG, 59 KB poster JPG, 10 animated nodes, no filters, no blur, no video unless supplied.
- Ambient: 2 to 4 characters per page, each idle character animates only a few small groups; hidden in lite and off.
- `will-change` only on parade and hop wrappers. One IntersectionObserver for the whole page.
- Measured (headless Chromium, CPU 4x throttle): hero mobile 390x844 averages 16.7 ms/frame (60 fps), 0 frames over 33 ms; hero desktop 1440x900 averages 16.8 to 19 ms, p95 under 34 ms. Machine noise caused occasional slower runs (one run averaged 24 ms on the full demo page).

## Notes and known gaps

- Uzi riding the yarn path (offset-path) is not built; the path itself is.
- Sprites are side or front views drawn to match the real products; the tortoise, octopus and monkey are simplified.
- `Character` reads ids with `useId`; if the repo later enables cache components, keep Character as a server component without `Math.random`.
- Preview page: `strategy/stage2/preview/index.html` (serve the project root with any static server, e.g. `python3 -m http.server`; fragments are generated by `node strategy/stage2/src/render-hero.mjs`).
