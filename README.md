# Mikono Creations

Online shop for Mikono Creations, Kenyan handmade crocheted animals. B2B first, growing B2C. Orders go through WhatsApp; there are no online payments yet.

Built with Next.js 16 (App Router), React 19, Tailwind v4 and TypeScript. Hosted on Vercel (region cpt1).

> This Next.js has breaking changes from older versions. Read `AGENTS.md` and `node_modules/next/dist/docs/` before changing framework code.

## Run it

```bash
npm install
npm run dev        # builds image variants, then starts the dev server
npm run build      # prebuild runs images, animal cast, copy scan and living checks
npm start
```

Use `npx next build --webpack` if Turbopack rejects a symlinked `node_modules`.

## What is in the site

- **Shop**: 30 animals, 5 categories, filters and search, product pages, cart, WhatsApp checkout wizard with order references (`MK-YYMMDD-XXXX`).
- **Custom Studio** (`/custom/studio`): Quick brief (3 steps) or Full brief, 23 order types, multi-piece orders.
- **Tools**: Gift Finder, Size Finder, Build a Safari Family.
- **Content**: 47 journal posts, projects, gallery (every supplied photo is used), FAQ, care and size guides.
- **Business pages**: wholesale, partners, supply, stockists, story, impact, makers.
- **Legal pack**: 16 documents in `content/legal/` with an acceptance checkbox at checkout. Drafts with bracketed placeholders; a Kenyan advocate must review before launch.
- **Living layer**: animals, a scroll thread, a looping welcome rabbit and a find-the-herd game, with still and off tiers.

## Folder map

| Path | What |
|---|---|
| `app/` | Routes and page CSS |
| `components/` | UI. `card/` card system, `fx/` animal engine, `filters/` shared filter family, `studio/`, `wizard/` |
| `lib/`, `data/`, `content/` | Logic, typed data, journal and legal text |
| `scripts/` | Build tools, copy and media checks, unit tests (`test-*.mjs`) |
| `scripts/mobile-qa/` | The standing mobile QA gates |
| `strategy/` | Charter, binding decisions, specs, gate reports. Start with `00-CHARTER.md` and `07-BUILD-DECISIONS.md` |
| `media/manifest`, `media/catalogue` | Photo labels and catalogue source. Raw originals are not in git |

## Checks

```bash
npx tsc --noEmit
npm run qa:copy qa:media qa:whatsapp qa:checkout qa:enquiry   # also test-studio and test-helpers
node scripts/mobile-qa/run-all.mjs <url> --pages quick        # layout, interactions, perf, width
```

Standing rule (`strategy/QA-RULES.md`): every change is wired for phones and covered by the mobile gates, and `strategy/gates/mobile/CHANGELOG.md` is updated.

## House rules

No em or en dashes, no AI filler phrases, plain easy words, "animals" not "toys", muted earthy UI colours (product photos keep their own colours), equal-height cards, no invented facts or prices (`pricesConfirmed` is false until the client supplies them).

## Deploy

Deploy only from a tested snapshot: type check, all tests, copy scan and a webpack build, then `vercel deploy --prod`. After deploy, check routes and sample image URLs return 200. Images are static WebP variants built by `scripts/build-images.mjs` (the Vercel image optimiser is not used).

## Still open

Prices, delivery fees, payment details, legal registration details, domain and email, tracking IDs (GA4, Meta, TikTok), ODPC registration before any database, SEO fixes from `strategy/21-seo-sweep.md`, and the instant-loading plan.
