# Mikono Creations: Build Charter

Binding addendum: strategy/07-BUILD-DECISIONS.md overrides the phase reports 01 to 06.

Source of truth for every agent. If a task conflicts with this file, stop and report.

## 1. What we are building
A Kenya-first, child-first e-commerce store for handmade crocheted animals (safari and domestic), sold in sizes S, M, L, XL and in several colourways. Today the business is mostly B2B (retailers, lodges, gift shops, organisations). The store must also win B2C (parents, gifters, diaspora). Checkout is WhatsApp-based for now, via a cart plus a comprehensive order wizard. The site also carries partnership and supply enquiries, blogs and projects.

Selling points: UI/UX quality above all, then trust (safety, zero plastic, recycled yarn, 25+ women supported), then story.

## 2. Hard rules (audited at every gate)
1. **No em dashes or en dashes used as punctuation, anywhere** (copy, code comments, alt text, metadata). Use commas, full stops, colons or restructure. Numeric ranges use "to" or a hyphen.
2. **No AI slop.** Banned phrases and patterns: "elevate", "unleash", "delve", "tapestry", "journey", "seamless", "in today's world", "more than just", "not just X, it's Y", "crafted with passion", "game-changer", empty superlatives, lists of three adjectives as filler, exclamation spam. Copy is specific, concrete, plain and warm. Facts only come from the client brief or are marked TODO.
3. **No invented facts.** No fake reviews, fake stock counts, fake prices, fake awards, fake partner logos. Unknown data is a labelled placeholder that the build can list.
4. **UI palette is muted and earthy only.** No bright, saturated or neon colours in the interface: backgrounds, text, borders, illustrations, badges, sale tags, hover states. Product photographs and the toys' own colours are content and are never filtered, tinted or recoloured. UI colours stay at or below OKLCH chroma 0.13. Contrast must still meet WCAG AA. See strategy/07-BUILD-DECISIONS.md.
5. **Uniform cards.** In any row or grid: equal card height, equal image aspect ratio, titles clamped to the same line count, body clamped, price and CTA pinned to the same baseline at the card bottom (flex column, `mt-auto`). Content length never changes card size. Same radius, padding, shadow, gap.
6. **Child-first.** Large touch targets (min 44px), readable type (min 16px body), forgiving forms, playful but calm motion, full `prefers-reduced-motion` support. No dark patterns, no countdown pressure, no pop-up on first paint.
7. **Accuracy of media.** A product named "green elephant" must show a green elephant. Every image placement is traceable to a manifest entry with a confidence level. Where the species is unclear, five independent agents vote and the majority decides. The decision is recorded with its vote count, the item is used, and the client corrects it at review if needed.
8. **Kenya first.** KES currency, Nairobi delivery logic, WhatsApp as the primary channel, Swahili touches used sparingly and correctly, African children and makers shown with dignity.
9. **Performance and accessibility are features.** Images optimised (WebP/AVIF via next/image, explicit sizes), LCP target under 2.5s, semantic HTML, keyboard reachable, alt text that describes the actual image.
10. **Media rights.** The client owns all supplied media and has confirmed rights to use all of it, including photos of makers, customers and children. All media is eligible for use. Placement is chosen for best fit (shop, galleries, blog, projects, story). Screenshots, collages and overlays are cropped or split for quality, and third party text in the frame (signs, other brands) is cropped out for tidiness.

## 3. Visual direction
- **Shop (priority):** Claymorphism x organic blobs x bento grid. Soft squishy 3D cards, blob-masked photography, bento category tiles. Reference structure from the client inspo: category circle row, best sellers rail, trust strip, wavy section dividers, stats band, captured moments gallery.
- **Story, Blog, Projects, Partners:** Scrapbook collage x kinetic typography. Torn paper edges, tape, polaroid frames, gently bouncing headings (CSS only, reduced-motion safe).
- **Palette (starting point, to be refined by the design agent):** sand, oat, clay, terracotta, dusty ochre, acacia olive, baobab brown, charcoal, bone white. Everything desaturated. Kenyan flavour through patterns (kitenge-inspired geometry in two earth tones), Maasai-inspired beadwork motifs used respectfully and sparingly, savanna horizon silhouettes.
- **Type:** friendly rounded or soft serif for display, clean humanist sans for body. Chosen for legibility first.

## 4. Phases and gates

Every phase ends with a **gate**. A gate has an **Audit agent** (checks the charter rules, reports PASS or FAIL with evidence) and, for anything that renders, **three independent Verification agents** (see section 5). A failed gate blocks the next phase until fixed and re-run.

| Phase | Output | Gate |
|---|---|---|
| 0. Intake | 87 images and 1 video given stable IDs, 4 inspiration screenshots, charter | Audit: file counts, IDs unique |
| 1. Media analysis | 8 media agents write manifests (animal, colour, size, shot type, people, quality, best use, confidence). 1 cross-check agent re-views a sample and every low confidence item | Audit: manifest schema valid, every ID covered once, cross-check agreement report |
| 2. Business strategy | Reports: business model and B2B/B2C funnel, catalogue and pricing structure, WhatsApp checkout wizard spec, SEO and marketing pipeline and tracking, content and blog and projects plan, UX and design system | Audit: reports consistent with each other and with the charter, contradictions listed and resolved |
| 3. Foundation | Design tokens, layout shell, components (cards, buttons, forms, nav, cart drawer), data layer (products, variants, sizes, colours) | Audit + 3 verifiers |
| 4. Shop | Home, shop listing with filters, product page with size and colour variants, cart, order wizard to WhatsApp | Audit + 3 verifiers |
| 5. Trade and partners | Wholesale page, supply and partnership enquiry flows, partner showcase | Audit + 3 verifiers |
| 6. Story and content | About, impact, blog index and posts, projects, gallery, FAQ, care guide, size guide | Audit + 3 verifiers |
| 7. Marketing infrastructure | SEO (metadata, schema.org, sitemap, robots, OG images), tracking slots (GA4, Meta Pixel, TikTok Pixel, GTM), consent banner, lead capture (newsletter, quote, WhatsApp click events), UTM handling | Audit + 3 verifiers |
| 8. Final QA | Cross-browser widths, accessibility pass, performance pass, copy audit (em dash and slop scan), media accuracy re-audit, build and deploy readiness | Audit + 3 verifiers, then client review |

## 5. Verification protocol (after every rendering step)
Three independent agents, each with a different lens, none sharing context with the others:
1. **Visual verifier:** screenshots at 390, 768, 1280 and 1600 px. Checks layout, alignment, uniform cards, no overflow, palette compliance.
2. **Content and media verifier:** reads rendered text and every image. Confirms each image matches its product name, colour and size, and that copy obeys the hard rules (em dash scan, slop scan, no invented facts).
3. **Functional and accessibility verifier:** keyboard walk, focus states, forms, cart and wizard logic, links, console errors, build output, Lighthouse-style checks.

Each verifier returns a table: check, result, evidence, severity. Any FAIL goes to a fix pass, then the same three re-run. Results are saved under `strategy/gates/`.

## 6. Open inputs from the client (placeholders until supplied)
Partner names and logos, WhatsApp number, retail and wholesale prices, tracking IDs (GA4, Meta, TikTok, GTM), domain and email, delivery zones and fees. Sizes are the four classes S, M, L, XL (no centimetre values are shown until supplied).

## 7. Working conventions
- Stack: Next.js App Router, TypeScript, Tailwind. Static-first. Product data in typed local files until a CMS or database is chosen.
- Media: originals in `media/raw/` (not committed). Optimised, renamed web copies in `public/media/` generated from the approved manifest only.
- Every phase writes its report to `strategy/` and its gate results to `strategy/gates/`.
