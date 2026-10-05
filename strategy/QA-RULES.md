# Standing QA rule (owner ruling, 2026-10-04)

Every change must be wired for phones and covered by the three mobile QA gates. The gates are:

1. layout: scripts/mobile-qa/layout.mjs (sizes, overflow, tap targets, overlaps, images, card uniformity)
2. interactions: scripts/mobile-qa/interactions.mjs (menus, drawers, forms with the keyboard open, gestures, animals, game)
3. perf: scripts/mobile-qa/perf.mjs (LCP, TBT, INP, JS per route, scroll smoothness)

Also: scripts/mobile-qa/width.mjs (full-width layout audit) once it exists. Run all together with scripts/mobile-qa/run-all.mjs (parallel, with --perf-solo for trustworthy timing).

## What every agent must do when it changes the site
- If you add or change a page, route, component, form, step, control, overlay, animation or limit, update the gates in the same job: add the route to the page lists, add or adjust selectors, add a scenario for the new behaviour, and remove checks for things you deleted.
- Add one line to strategy/gates/mobile/CHANGELOG.md: date, what changed, which gate scenarios were added or changed.
- Test the change at 320, 360, 375, 390, 412 and 768 wide, in phone landscape, and with the on-screen keyboard open for forms.
- Taps need a 44 px hit area, text never overlaps animals or the thread, nothing scrolls sideways, cards stay equal height, and the cookie dock, WhatsApp button and sticky bars never cover content.
- Never edit a gate to hide a real defect. A false positive must be explained in the changelog.

## Lead rule
Before every deploy the lead runs the three gates in parallel on a tested snapshot, then perf alone if the parallel timing looks inflated.
