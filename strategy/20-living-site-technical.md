# Living site: technical architecture and performance plan

Status: draft 1, 2026-10-03. Companion to the design spec (strategy/19-living-site-design.md, written in parallel; not read). Code under components/fx was read only. Prototype and probes: strategy/living-lab/tech/.

## 1. Recommendation

One small behaviour engine (JS, one shared rAF loop, hard budget, tiers) plus CSS for everything cheap. Do not use per-character CSS keyframes at scale, and do not add Lottie, Rive, GSAP or Motion.

- Server renders static, complete markup (as Character.tsx does today). Characters are inert until the engine adopts them. No hydration mismatch is possible because the engine only mutates style and data attributes on nodes React never re-renders (they are dangerouslySetInnerHTML, aria-hidden).
- Engine is a dynamic import, loaded after idle, only on routes whose template config lists animals. Target under 15 KB gzip (the PoC engine logic is about 3 KB gzip; the rest is room for game, seasons, taps).
- Thread: one SVG path per page, reveal by scroll. Use CSS animation-timeline: scroll(root) where supported (already shipped in fx.css, keep it), JS-driven stroke-dashoffset fallback inside the engine when not. Knots measured from headings with ResizeObserver.
- Characters shipped as SVG sprite assets in /public/fx/cast, served immutable, mounted per section when it nears the viewport.

## 2. Measurements

Method: playwright-core, Chromium 1243, 360x740 dpr 2.625, mobile UA, CDP CPU throttle, 3000 px scripted scroll at 25 px per frame, medians of 3 (PoC) or 1 (live). Script: living-lab/tech/probe.mjs. Raw: live-home.jsonl, poc-results.jsonl. Desktop WSL timings are noisy; read differences, not absolutes.

### 2.1 Live home page today (https://mikono-creations.vercel.app/, 4x CPU)

| Tier | CSS animations (running) | Scroll p95 frame | Frames over 50 ms | Long tasks in scroll | Style/layout recalcs in scroll |
|---|---|---|---|---|---|
| fx full | 21 (9) | 100 ms | 18 | 12 (913 ms) | 227 layouts |
| fx off | 3 (3) | 83 ms | 15 | 6 (425 ms) | 10 layouts |

At 6x: full p95 83 ms, 22 frames over 50 ms; off p95 100 ms. So the page is already janky while scrolling with no fx at all (hydration and image decode still running after load at 5 s); the animation layer adds roughly +470 ms long-task time and about 220 extra layouts at 4x. Findings:
- Today: 4 cast characters give 18 infinite animations on 18 targets. Each animated SVG child (eyes, tail, head, ear, wing) is its own animation; a 32-animal page at this density would be about 140 animations.
- The yarn reveal animates stroke-dashoffset on a mask path (not compositable, repaints each scroll frame). That is the 227 layouts/frames cost together with the three .cut-float images.
- Layer count: the live probe did not capture it (CDP LayerTree enabled too early; fixed in probe.mjs afterwards, PoC values below are valid).
- Shipped gate numbers (perf-2026-10-02.md): JS 219 to 244 KB gzip vs 200 budget, TBT 419 to 1382 ms vs 300. There is zero JS headroom: the engine must be paid for by removing something (see 7).

### 2.2 PoC, 12 characters, 5 knots, 3000 px scroll (medians of 3)

| Variant | CPU | p95 frame | avg frame | Frames over 50 ms | Long tasks | Layers | Layouts | Running anims |
|---|---|---|---|---|---|---|---|---|
| Baseline (no fx) | 4x | 16.7 | 16.7 | 0 | 0 | 5 | 4 | 0 |
| A: CSS keyframes + scroll-timeline, all 12 live | 4x | 83.3 | 38.8 | 16 | 14 | 88 | 257 | 22 |
| A lite (blink only) | 4x | 50.0 | 27.0 | 3 | 2 | 55 | 167 | 17 |
| B: JS engine, budget 4 (mobile), dash thread | 4x | 33.3 | 17.8 | 0 | 0 | 18 | 53 | 0 |
| B, clip-transform thread (compositor-friendly) | 4x | 50.0 | 25.3 | 4 | 5 | 20 | 66 | 0 |
| A | 6x | 183.4 | 68.1 | 53 | 48 | 88 | 257 | 22 |
| B dash | 6x | 66.7 | 30.5 | 11 | 9 | 18 | 75 | 0 |
| B clip | 6x | 50.0 | 25.5 | 3 | 3 | 20 | 69 | 0 |
| B lite (budget 2, 30 fps cap) | 6x | 33.4 | 21.0 | 2 | 2 | 20 | 46 | 0 |
| Baseline | 6x | 33.4 | 19.3 | 0 | 1 | 5 | 4 | 0 |

Reading: variant A creates 88 layers (every animated SVG group is promoted) and 22 concurrent animations; it fails the p95 under 20 ms goal at 4x by a wide margin. Variant B holds p95 33 ms at 4x with budget 4 and cuts layers 5x. Neither meets p95 under 20 ms at 4x in this noisy harness (baseline itself is 16.7), so the shipped budget must be 4 animated on phones and 2 on lite, as asked. Caveats: B at 12 characters has 8 characters frozen by the budget, so it is not like for like in visual richness; A has no budget concept, which is precisely its weakness. The thread clip variant is the steadier one at 6x; the dash variant is cheaper at 4x. Recommendation: dash-offset via the CSS timeline where supported (zero JS), clip transform in the JS fallback.

The PoC does not measure battery or real devices. Real low-end Android validation is required before launch (risk R1).

## 3. Research summary (cite; unverified marked)

- Scroll-driven animations: Chrome 115 shipped July 2023 (https://developer.chrome.com/blog/new-in-chrome-115); Safari 26 September 2025; Firefox behind a flag as of mid 2026 (search snippet, unverified); global support about 82.6% (caniuse via search, unverified). Kenya: Chrome 59.6% and Opera (mostly Opera Mini/Mobile) 32.2% of mobile+tablet, Samsung Internet 1.3% (https://gs.statcounter.com/browser-market-share/mobile-tablet/kenya, August 2026 per search snippet). Chrome 137 is the most common single version, Chrome 125 present. Android System WebView and Chrome on Android 8 to 10 Go devices lag; assume some are under 115. Opera Mini in extreme mode runs no page JS: the static markup must be a complete page (it already is).
- Long Animation Frames: Chrome and Chrome Android 123+ (https://developer.chrome.com/blog/loaf-has-shipped). Use as a degradation signal where available; fallback is measuring rAF deltas ourselves.
- offset-path: widely available since March 2022 (https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path). It animates on the main thread in Chrome unless composited (unverified); a walking animal can instead be translated with a precomputed point list in the engine. Use offset-path only for the one hero walker, not for many.
- Motion library: animate mini 2.3 kb, hybrid animate 18 kb (https://motion.dev/docs/animate). Mini wraps WAAPI; useful but unnecessary, WAAPI is native.
- GSAP: free including ScrollTrigger since April 2025 (Webflow); core about 23 KB plus ScrollTrigger about 10 KB gzip (search snippets, unverified). Too heavy for a 0 KB headroom site.
- lottie-web 60 to 75 KB gzip, dotLottie player about 12 KB JS plus WASM (search snippets, unverified). Rejected: bytes, a JSON per animal, CPU on main thread (SVG renderer), and the art is already SVG.
- Rive: WASM runtime, rejected for the same bytes reason (not measured).
- SMIL: works in all targets, but cannot be paused by IntersectionObserver without script, no easy tiering; rejected.
- Canvas vs DOM for 12 to 32 characters: canvas needs rasterising 32 detailed SVGs to bitmaps (memory on 2 GB phones, large asset bytes). With a budget of 4 live animals DOM/SVG is cheaper and stays crisp and accessible. Revisit only if more than 12 are simultaneously live.
- Sprite sheets: rejected for animated parts (need separate parts for blink, tail); acceptable for a single static poses.
- View Transitions: not needed for decoration; skip.
- content-visibility: auto on page sections already helps; the thread must not rely on section heights being stable (see 6).

## 4. Asset delivery and the build script

- Keep the 12 SVGs in public/fx/cast (3 to 5.5 KB each, about 50 KB raw, about 12 KB gzip total). 32 characters will be roughly 130 KB raw, 30 to 35 KB gzip if loaded; so never load them all. Per page template the config names at most 6 to 8.
- Do not inline 32 SVGs in the JS bundle. Today cast.generated.ts is 57 KB of strings inside a server module: fine because Server Components keep it off the client. Keep that rule: characters are rendered only as server markup.
- Delivery choice per use:
  - Static decoration and idle characters: server-rendered inline SVG, as now (needs DOM access for eyes/tail/head groups).
  - Below-the-fold characters: rendered as inline SVG but only inside sections that exist in the DOM; add a lazy "slot" for off-page ones: an empty span with data-char="lion" that the engine fills by fetching /fx/cast/lion.svg (immutable cache) when the slot nears the viewport. Fetch is allowed by connect-src 'self'; the SVG text is inserted via DOMParser, not innerHTML of untrusted data (our own file).
  - Never as <img> if the part must animate. Use <img> for fully static props.
- Headers: add /fx/:path* with Cache-Control public, max-age=31536000, immutable (and version the filename with a content hash in the manifest, e.g. lion.3f2a.svg) in next.config.ts. Preload nothing.
- Build script (scripts/build-cast.mjs extended) emits:
  - cast.generated.ts (as now, server only),
  - fx-manifest.json and a typed fx-manifest.ts: characters {id, file, hash, viewBox, parts: [eyes, tail, head, ear, trunk, wing, arm...], habitat, season?}, poses (named class sets), props, habitats; fails the build if a declared part is missing from the SVG, if ids collide, or if a file exceeds 6 KB.
  - the choreography schema types (section 5).
- Total bytes budget for living layer: engine under 15 KB gzip (JS), config under 3 KB per template, characters on a page under 25 KB gzip, thread under 2 KB.

## 5. Data model: choreography as JSON per page template

content/fx/<template>.json, validated at build by the manifest script, imported only by server code and serialised into the markup as one data attribute (no client fetch):

```json
{
  "template": "home",
  "thread": { "side": "left", "knots": [{ "anchor": "#meet", "pop": "giraffe", "season": null }] },
  "slots": [
    { "id": "h1", "char": "lion", "edge": "right", "at": "#story", "size": 88, "pose": "idle", "priority": 3,
      "on": { "enter": "wave", "tap": "roar", "hover": "look" }, "find": { "id": "lion-home", "hint": "behind the story" } }
  ],
  "seasons": { "december": { "swap": { "yarn": "yarn-santa" } } },
  "budget": { "full": 8, "lite": 3, "coarse": 4 }
}
```
Rules: anchors are CSS selectors (headings) so designers move things without code; priorities decide eviction; every behaviour name maps to a fixed vocabulary (idle, wave, roar, look, hop, peek) implemented once in the engine. Seasons resolve on the server from the date (no client clock, no hydration mismatch; the page is cached statically, so season changes ship on revalidate or deploy).

## 6. Engine design

Files (all new, under components/fx/engine/):
- boot.ts (about 0.6 KB): in Deferred.tsx after idle and only if html[data-fx] is not off and the route has [data-fx-scene].
- engine.ts: one rAF loop; wakes on scroll, pointer, IO changes; sleeps when nothing is live (the PoC shows idle rAF stops after 600 ms of rest).
- scheduler: visible characters sorted by distance from viewport centre; the first BUDGET get live=true, all others are frozen in their rest pose (just stop writing; no teardown). Budgets: full desktop 8, coarse or width under 700 4, lite 2 at a 30 fps cap, off 0. Priority overrides distance for characters with an active reaction (tap, enter pop) for up to 1.2 s.
- Writes: only transform and opacity on the character root and on part groups (eyes scaleY, head and tail rotate), one string per node per frame, skipped if unchanged (PoC does this). No reads of layout in the loop; positions come from the measure pass (ResizeObserver, debounced to a rAF).
- Scroll velocity: exponential smoothing (alpha 0.18) of px/ms; characters lean up to 6 degrees; zero cost at rest.
- Pointer proximity: one pointermove listener, passive, stores x,y only; the loop reads it. No per-event DOM work, so no INP cost. Disabled on coarse pointers (taps only: one pointerdown, nearest visible character within 80 px hops).
- Offscreen pause: one IntersectionObserver (rootMargin 120 px) sets data-off; also hidden-tab pause via visibilitychange and the loop never runs while document.hidden.
- Adaptive degradation: a PerformanceObserver on long-animation-frame (Chrome 123+) and a rAF delta fallback; three frames over 100 ms in 2 s drop the budget one step (4 to 2 to 0), never recovers within the page view, and writes html[data-fx]=lite for the rest of the session via sessionStorage (not mk.fx, so the user choice is not overwritten).
- Tiers (extending the existing splash-gate.js): off (reduced motion or the toggle): static decorations only, engine not even imported; lite: blink only, budget 2, 30 fps; full. Add to the gate, before first paint, a check for navigator.deviceMemory and also "coarse + hardwareConcurrency<=4 => lite", plus honour a new mk.animals key ("off"). Keep the key naming: mk-fx exists today (hyphen) while the brief names mk.*; cart uses mk.cart.*. Decision: keep mk-fx and mk-density (shipped, read by splash-gate.js), name new keys mk.find (game) and mk.animals only if separate from mk-fx; simpler: reuse mk-fx value "off" for the Animals on/off toggle. Document both in /privacy and /cookies as strictly necessary preferences (no personal data, never sent).
- Toggle UI: footer button "Animals: on/off" calling setTier; FxProvider already exists. It sets html[data-fx] immediately.

Thread:
- One SVG path per page host (as YarnPath, which already has desktop S-curve and mobile straight line). Extend it so the path passes through knot positions: measure() reads heading rects once and on ResizeObserver of the host and each section; rebuild the d attribute with cubic segments (PoC code). Rebuild is O(knots), under 0.3 ms.
- Reveal: CSS scroll(root) timeline on a mask path (existing) in browsers that support it; otherwise engine sets stroke-dashoffset or a clip transform (measured above; clip variant steadier at 6x). Replace the mask+dashoffset with a clip-path or a scaleY-transformed overlay to stay compositable: verify on device.
- content-visibility: auto sections change height as they render; knots use ResizeObserver, plus contain-intrinsic-size set on sections to limit drift (PoC uses auto 820px with no CLS). RTL: logical inset-inline-start for the gutter; orientationchange triggers measure().
- Knots pop animals by adding a data-popped class once the knot crosses 75% viewport height (PoC), engine plays a 420 ms transform pop; without JS they are visible static.
- CLS 0: everything is position absolute or fixed in a contain: layout paint host with pointer-events none and reserves no flow space (existing .fx-ambient pattern).

Find-all-the-animals game:
- Hidden hit areas: a 44x44 invisible button over a character is NOT hidden from assistive tech but must exist for keyboard and screen readers; decision: found-animals are tappable only when engine is on; each is a real button with an sr-only label ("Found: lion") placed after content, tabindex 0, no focus trap, reachable via Tab, so the game is playable without a pointer. Decorations stay aria-hidden; only game targets are buttons.
- State: localStorage key mk.find = JSON {v:1, found:["lion-home",...]} under 600 bytes; read lazily on first interaction, not at load. List in /privacy and /cookies. Cleared by a "reset the hunt" link. Never sent to a server, no analytics events.
- Reward: reveal screen via a lazy chunk (not in the 15 KB engine).

Accessibility: every cast element aria-hidden, no focus stops except game buttons, prefers-reduced-motion = engine not loaded and CSS animations off (fx.css already), nothing flashes (no cycles over 3 per second; blink is once per 5 s), toggle visible in footer.

CSP: script-src has 'unsafe-inline' and self, so a dynamic import of a same origin chunk is fine; no eval; inline style attributes used by engine writes are allowed by style-src 'unsafe-inline'; element.style writes via CSSOM are exempt anyway. Fetching SVG slots is within connect-src self.

SEO: decorations carry no text; knots are not links; engine never mutates headings.

## 7. Paying for the engine: JS budget

The gate is already 19 to 44 KB over 200 KB. The engine adds up to 15 KB. Plan to recover at least 30 KB before shipping: audit the chunk 2lm6ee1ot3_cu.js (71.6 KB) and 09sl98z3iv3t7.js (43.9 KB) named in the gate, move CartProvider and ConsentBar logic out of the first route chunk, dynamic import ProductPurchase and HeroShell code, and verify the baseline with the perf gate before adding the engine. Gate rule: no merge if per-route JS gzip rises more than 15 KB or TBT more than 50 ms against the stored baseline.

## 8. Test strategy (scripts/mobile-qa)

Add scripts/mobile-qa/living.mjs reusing perf.mjs conventions and strategy/living-lab/tech/probe.mjs:
- Per template at 4x and 6x, tiers full, lite, off: document.getAnimations() total (budget: CSS infinite animations under 6 per page), engine live count (max 4 on phones, asserted through window.__fx.live in non-production builds only or a data attribute), scroll 3000 px p95 frame under 20 ms at 4x (target; PoC currently 33 ms, so baseline against the no-fx page and require delta under 8 ms), no frames over 50 ms from the engine, long-task delta under 50 ms TBT, CLS exactly 0 change, layers under 40, heap growth under 10 MB over a 60 s scroll loop, JS gzip delta under 15 KB (engine) per route.
- Behaviour tests: toggle persists across reload and is applied before first paint (assert data-fx at DOMContentLoaded), reduced motion loads no engine chunk (network assertion), hydration warnings none (console), thread knots align with headings within 4 px after a resize and orientation change, keyboard can find all animals, mk.find keys appear in /privacy and /cookies copy (extend scripts/check-content.mjs).
- Real device smoke: one Tecno or Infinix phone through remote debugging before launch; record Chrome version and fps.

## 9. Risk register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Real low-end phones slower than 4x emulation; PoC p95 33 ms at 4x | High | Jank, heat | Budget 4 phones, 2 lite, auto-degrade by LoAF/rAF, real-device test gate |
| R2 | JS budget already exceeded; engine pushes TBT higher | High | Perf gate fail | Pay down 30 KB first (section 7), dynamic import after idle, stop at off tier |
| R3 | Scroll-timeline unsupported on Chrome under 115, Opera Mini | Medium | No thread growth | Static drawn fallback exists; JS fallback in engine; Opera Mini gets static page |
| R4 | Layer explosion from animated SVG groups (88 layers in variant A) | High if CSS keyframes used | Memory, jank | No per-part CSS animations beyond blink on lite; engine writes only live characters |
| R5 | Knot drift from content-visibility and late images | Medium | Misplaced knots | ResizeObserver, contain-intrinsic-size, re-measure after load and fonts |
| R6 | Hydration mismatch from seasons/date/random | Low | Console errors, flash | Server-resolved seasons, deterministic hashing (already in svgIds.ts), engine mutates only inert nodes |
| R7 | Battery and thermal drain | Medium | Complaints | Engine sleeps at rest, 30 fps lite, offscreen and hidden pause, one-tap toggle |
| R8 | INP regression from pointer effects | Low | CWV | Passive listeners that only store coordinates; no work in handlers |
| R9 | Privacy copy drift for mk.find and mk-fx | Medium | Compliance | check-content test, list both keys in /privacy and /cookies |
| R10 | Asset growth to 32 animals (130 KB raw) | Medium | Bytes | Per template cap of 8, lazy slot fetch, build fails over 6 KB per character, immutable caching |
| R11 | Game targets confuse screen reader users | Medium | A11y | Real buttons with labels, optional, skip with toggle |
| R12 | Probe noise (WSL, shared CPU) | High | False conclusions | 3 runs medians, compare against baseline in same run, confirm on device |

## 10. Phased plan (effort)

| Phase | Work | Files | Effort |
|---|---|---|---|
| 0 | Baseline and pay down JS 30 KB; fix idle jank (hydration, 3 .cut-float images, mask draw) | Deferred.tsx, chunks per gate, app/page.tsx | 2 days |
| 1 | Build script: manifest, typed config, part checks, hashed filenames, immutable header | scripts/build-cast.mjs, next.config.ts, content/fx/*.json | 1.5 days |
| 2 | Engine (scheduler, loop, tiers, toggle, LoAF degrade), thread with knots | components/fx/engine/*, YarnPath.tsx, FxProvider.tsx, splash-gate.js, fx.css | 4 days |
| 3 | Animal slots, lazy fetch, reactions (enter, tap, hover), 32 characters art integration | Character.tsx, AmbientCast.tsx, public/fx/cast | 3 days + art |
| 4 | Find game, mk.find, privacy and cookies copy, accessibility buttons | components/fx/game/*, app/privacy, app/cookies | 2 days |
| 5 | Seasons (server resolved), QA script, real device pass, perf gate integration | scripts/mobile-qa/living.mjs, check-content.mjs | 2.5 days |

Total about 15 engineering days excluding art. Ship phase 0 and 1 first; gate every later phase on the budgets in section 8.
