# Shopping helpers: integration placements

Three new routes exist and are not linked from anywhere yet. All copy below follows the house rules (no dashes, "animals", no claims).

| Route | Tool |
|---|---|
| `/gifts/finder` | Gift finder, 5 questions, 3 picks |
| `/size-finder` | Size finder, ladder plus recommender |
| `/build-a-family` | Build a Safari Family set builder |

Deep links that already work: `/shop?size=M` (size filter), `/build-a-family#family=elephant-grey-m.2,giraffe-orange-l` (shared family, sku list, `.n` is quantity), `/custom/studio?base=<slug>` (used by the gift finder; the Studio must read `base`).

## Placements

| Where | Label | Target | Notes |
|---|---|---|---|
| Menu, Gifts panel (first item, featured) | Gift finder | `/gifts/finder` | Sub line: "Five questions, three picks" |
| Menu, Gifts panel (second item) | Build a Safari Family | `/build-a-family` | Sub line: "Make a set, send it on WhatsApp" |
| Menu, Shop panel (Help block) | Size finder | `/size-finder` | Sub line: "S, M, L or XL" |
| Home, after the category bento | Section "Not sure where to start?" with three equal cards | the three routes | Card titles: "Find a gift", "Pick a size", "Build a family". One action each, equal height |
| Shop page header (`/shop`, and the three category pages) | Banner "Not sure which one?" with link "Try the gift finder" and a quiet second link "Find your size" | `/gifts/finder`, `/size-finder` | One line on mobile, above the filters |
| Product page, next to the size selector | Find the right size | `/size-finder` | Text link under the S M L XL buttons |
| Product page, below Add to order list | Build a family with this animal | `/build-a-family#family=<slug>-<colourKey>-<size>` | Optional, uses the chosen sku |
| Cart page, empty state | Not sure what to pick? Gift finder | `/gifts/finder` | Secondary button |
| Cart page, with items | Add more to make a family | `/build-a-family` | Text link under the list |
| `/gifts` page, hero primary | Find the right gift | `/gifts/finder` | Primary button; second button "Build a Safari Family" |
| `/size-guide` page, after the intro | Not sure? Use the size finder | `/size-finder` | Secondary button |
| Footer, Help group | Size finder | `/size-finder` | Add beside "Size guide" |
| Footer, Shop group | Gift finder | `/gifts/finder` | Add beside "Gifts" |
| Sitemap (`app/sitemap.ts`) | (none) | the three routes | Add as static routes |

## Behaviour to know

- Answers are kept on the device under `mk.helpers.v1` for 24 hours and are never sent. Analytics events carry only the tool name, step number and counts. `/privacy` and `/cookies` should mention the key next to the draft key (24 hours, same wording).
- Order list lines use the same `{slug}-{colourKey}-{size}` sku as the product page. Animals shown only in group photos use colour key `ask` and the label "Colour to confirm".
- The family WhatsApp message reuses `generateRef`, `buildWaUrl`, `PRICES_SENTENCE` and `URL_BUDGET` from `lib/whatsapp.ts`. `buildOrderMessage` needs name, phone and delivery details, so a small builder in `lib/helpers/message.ts` writes the same header, ITEMS lines and price sentence, then says the customer will send name, phone and delivery next.
- Sticky bars sit in the page flow and add right padding below 768px so the floating WhatsApp button does not cover Next. If that button moves, adjust `.mkh-bar` in `components/helpers/helpers.css`.
- Colours come from `--color-*` tokens with fallbacks inside `.mkh` in `components/helpers/helpers.css`. Retuning tokens restyles the helpers.

## Open items

- Size finder comparison objects (hand, small cushion, big cushion, backpack) are a drawn aid and are labelled as not measurements. The client should confirm they are fair before launch (R5).
- `lib/track.ts` types events as a closed union, so `lib/helpers/track.ts` casts new names (`helper_start`, `helper_step`, `helper_result`, `helper_restart`, `helper_cta`, `helper_share`, `helper_family_change`). Add them to `TRACK_EVENTS` to remove the cast.
- The Studio must accept `?base=<slug>`.
