# Cast 2 (extra animals and props)

All sprites: 200 x 200 viewBox, transparent, face right, ground line at y 182, under 6 KB each. Source: `strategy/stage2/cast2/gen-cast2.mjs` (parts in `parts/`, kit in `lib.mjs`). Files are in `public/fx/cast2/`. Nothing in the site imports them yet.

Shared groups (all transform-origin set inline; animate with `transform-box: fill-box` as in fx.css): `fx-eyes` (blink: scaleY), `fx-ear`, `fx-tail`, `fx-neck`, `fx-head`, `fx-body` (breathe: scaleY 1.02), `fx-wing` / `fx-wing-a` / `fx-wing-b`, `fx-arm`, `fx-tongue`, `fx-ripple`. Four-legged walkers have `fx-leg-fn` (front near), `fx-leg-ff` (front far), `fx-leg-bn` (back near), `fx-leg-bf` (back far); birds have `fx-leg-a` and `fx-leg-b`. For a trot swing fn and bf together, ff and bn together, rotate 12 degrees.

Fun facts were checked with web search against Kenya Wildlife Service, IUCN-linked and African Wildlife Foundation pages where shown; blank means not verified.

## Animals

| File | Groups | Suggested behaviours | Kenyan habitat | Fun fact |
|---|---|---|---|---|
| bee-fly.svg | fx-body, fx-eyes, fx-head, fx-wing, fx-wing-a, fx-wing-b | hover on a looping path; wings buzz; land on the flower prop | Everywhere there are flowers; Kenyan beekeeping is widespread |  |
| bee-wave.svg | fx-arm, fx-arm-l, fx-arm-r, fx-body, fx-eyes, fx-head, fx-wing, fx-wing-a, fx-wing-b | sit on a card corner and wave | Everywhere there are flowers; Kenyan beekeeping is widespread |  |
| buffalo-peek.svg | fx-body, fx-ear, fx-eyes, fx-head | peek over a card edge; ears flick | Grassland and swamp edges across Kenya parks | Cape buffalo live in herds that can number in the hundreds. |
| buffalo-stand.svg | fx-body, fx-ear, fx-eyes, fx-head, fx-leg-bf, fx-leg-bn, fx-leg-ff, fx-leg-fn, fx-tail | slow walk along a section edge | Grassland and swamp edges across Kenya parks | Cape buffalo live in herds that can number in the hundreds. |
| bush-baby-sit.svg | fx-arm, fx-body, fx-ear, fx-eyes, fx-head, fx-tail | peek from a corner at night theme; ears turn | Acacia woodland and forest edge at night |  |
| bush-baby-sleep.svg | fx-body, fx-head, fx-tail | curl up and sleep in the footer or on empty states | Acacia woodland and forest edge at night |  |
| cat-sleep.svg | fx-body, fx-ear, fx-head, fx-tail | fall asleep on a card corner or empty cart | Homes, farms and markets |  |
| cat-walk.svg | fx-body, fx-ear, fx-eyes, fx-head, fx-leg-bf, fx-leg-bn, fx-leg-ff, fx-leg-fn, fx-neck, fx-tail | walk along a card top; tail sway | Homes, farms and markets |  |
| chameleon-perch.svg | fx-body, fx-eyes, fx-head, fx-leg-b, fx-leg-f, fx-tail | sit on a branch prop; curl tail; turret eye looks around | Bushes and trees in forest edge and coast, Kenya has many species |  |
| chameleon-zap.svg | fx-body, fx-eyes, fx-head, fx-leg-b, fx-leg-f, fx-tail, fx-tongue | tongue shoots to catch a butterfly, then retracts | Bushes and trees in forest edge and coast, Kenya has many species |  |
| cheetah-sprint.svg | fx-body, fx-eyes, fx-head, fx-leg-bf, fx-leg-bn, fx-leg-ff, fx-leg-fn, fx-neck, fx-tail | dash across a section edge on scroll, one pass | Open grassland, Maasai Mara, Amboseli, Laikipia | The fastest land animal over short sprints. |
| cheetah-stand.svg | fx-body, fx-eyes, fx-head, fx-leg-bf, fx-leg-bn, fx-leg-ff, fx-leg-fn, fx-neck, fx-tail | walk along a card top; wag tail; sit on a card corner | Open grassland, Maasai Mara, Amboseli, Laikipia | The fastest land animal over short sprints. |
| chick-hatch.svg | fx-body, fx-eyes, fx-head, fx-wing, fx-wing-l, fx-wing-r | hatch from the egg when a section enters view | Farm yards |  |
| chick-stand.svg | fx-body, fx-eyes, fx-head, fx-leg-a, fx-leg-b, fx-tail, fx-wing | hop; flap wing nubs; peck | Farm yards |  |
| crocodile-float.svg | fx-eyes, fx-head, fx-ripple, fx-tail | surface from the footer wave with the pond ripple, blink, sink again | Rivers and lakes: Mara River, Lake Turkana, Tana River |  |
| crocodile-stand.svg | fx-body, fx-eyes, fx-head, fx-leg-bf, fx-leg-bn, fx-leg-ff, fx-leg-fn, fx-tail | waddle along a card top; tail sway | Rivers and lakes: Mara River, Lake Turkana, Tana River |  |
| dik-dik-peek.svg | fx-ear, fx-eyes, fx-head | pop up fast from a corner; dart away | Dry thornbush country, Tsavo, Samburu, Laikipia | Dik-diks are among the smallest antelopes and are usually seen in pairs. |
| dik-dik-stand.svg | fx-body, fx-ear, fx-eyes, fx-head, fx-leg-bf, fx-leg-bn, fx-leg-ff, fx-leg-fn, fx-neck, fx-tail | tiptoe along an edge; ear flick | Dry thornbush country, Tsavo, Samburu, Laikipia | Dik-diks are among the smallest antelopes and are usually seen in pairs. |
| dog-sit.svg | fx-body, fx-ear, fx-eyes, fx-head, fx-leg-fn, fx-neck, fx-tail | sit by the basket; wag tail; tongue pant | Homesteads and towns across Kenya |  |
| dog-stand.svg | fx-body, fx-ear, fx-eyes, fx-head, fx-leg-bf, fx-leg-bn, fx-leg-ff, fx-leg-fn, fx-neck, fx-tail | trot; wag tail | Homesteads and towns across Kenya |  |
| flamingo-one-leg.svg | fx-body, fx-eyes, fx-head, fx-leg-a, fx-leg-b, fx-neck | idle on one leg; sway neck; swap with stand for a "changes pose" loop | Soda lakes of the Rift Valley: Nakuru, Bogoria, Elementaita | Their pink colour comes from the tiny algae they filter from alkaline lakes. |
| flamingo-stand.svg | fx-body, fx-eyes, fx-head, fx-leg-a, fx-leg-b, fx-neck | stand by a footer wave; stretch neck; blink | Soda lakes of the Rift Valley: Nakuru, Bogoria, Elementaita | Their pink colour comes from the tiny algae they filter from alkaline lakes. |
| goat-climb.svg | fx-body, fx-ear, fx-eyes, fx-head, fx-leg-bf, fx-leg-bn, fx-leg-ff, fx-leg-fn, fx-neck, fx-tail | climb the rock prop; hop on the spot | Pastoral and farm land, kept widely across Kenya |  |
| goat-stand.svg | fx-body, fx-ear, fx-eyes, fx-head, fx-leg-bf, fx-leg-bn, fx-leg-ff, fx-leg-fn, fx-neck, fx-tail | graze; ear flick; tail flick | Pastoral and farm land, kept widely across Kenya |  |
| hornbill-fly.svg | fx-body, fx-eyes, fx-head, fx-tail, fx-wing, fx-wing-a, fx-wing-b | fly across the viewport on a bezier path; flap wings | Dry acacia bush, Tsavo, Samburu (Von der Decken's hornbill) |  |
| hornbill-perch.svg | fx-body, fx-eyes, fx-head, fx-neck, fx-tail, fx-wing | sit on a heading or card edge; tilt head; blink | Dry acacia bush, Tsavo, Samburu (Von der Decken's hornbill) |  |
| impala-leap.svg | fx-body, fx-ear, fx-eyes, fx-head, fx-leg-bf, fx-leg-bn, fx-leg-ff, fx-leg-fn, fx-neck, fx-tail | hop between cards; one arc per scroll step | Light woodland and savanna, Maasai Mara, Nairobi NP |  |
| impala-stand.svg | fx-body, fx-ear, fx-eyes, fx-head, fx-leg-bf, fx-leg-bn, fx-leg-ff, fx-leg-fn, fx-neck, fx-tail | graze; ear flick; tail flick | Light woodland and savanna, Maasai Mara, Nairobi NP |  |
| ladybird-crawl.svg | fx-body, fx-eyes, fx-head, fx-leg-a, fx-leg-b, fx-leg-c | crawl along a heading or the thread line | Gardens and farms |  |
| ladybird-fly.svg | fx-body, fx-eyes, fx-head, fx-wing, fx-wing-a, fx-wing-b, fx-wing-w | open wing cases and fly off at the end of a scroll | Gardens and farms |  |
| leopard-branch.svg | fx-body, fx-eyes, fx-head, fx-leg-bn, fx-leg-fn, fx-neck, fx-tail | drape over a card edge or section divider; tail swings; fall asleep | Rocky woodland and riverine forest, widespread in Kenya |  |
| leopard-stand.svg | fx-body, fx-eyes, fx-head, fx-leg-bf, fx-leg-bn, fx-leg-ff, fx-leg-fn, fx-neck, fx-tail | walk; peek from edge | Rocky woodland and riverine forest, widespread in Kenya |  |
| ostrich-peek.svg | fx-body, fx-eyes, fx-head, fx-neck | neck rises from bottom edge, looks around, ducks back | Dry savanna and semi-desert, Samburu, Tsavo, Maasai Mara |  |
| ostrich-stand.svg | fx-body, fx-eyes, fx-head, fx-leg-a, fx-leg-b, fx-neck, fx-tail, fx-wing | walk; wag tail plume | Dry savanna and semi-desert, Samburu, Tsavo, Maasai Mara |  |
| secretary-bird-stand.svg | fx-body, fx-eyes, fx-head, fx-leg-a, fx-leg-b, fx-neck, fx-tail | stride with head bob; blink | Open grassland with scattered trees, Mara, Laikipia | It hunts snakes on foot by stomping them. |
| secretary-bird-wings.svg | fx-body, fx-eyes, fx-head, fx-leg-a, fx-leg-b, fx-neck, fx-tail, fx-wing, fx-wing-a, fx-wing-b | flap wings; stomp (leg-a down) | Open grassland with scattered trees, Mara, Laikipia | It hunts snakes on foot by stomping them. |
| tortoise-hide.svg | fx-body, fx-eyes, fx-head | hide on fast scroll; eyes appear when still | Dry bushland and rocky country; leopard tortoises in Kenya |  |
| tortoise-stand.svg | fx-body, fx-eyes, fx-head, fx-leg-bf, fx-leg-bn, fx-leg-ff, fx-leg-fn, fx-neck, fx-tail | very slow walk; head stretch | Dry bushland and rocky country; leopard tortoises in Kenya |  |
| warthog-peek.svg | fx-body, fx-ear, fx-eyes, fx-head | pop up from bottom edge; ears flick | Open savanna and bushland, Nairobi National Park, Mara |  |
| warthog-stand.svg | fx-body, fx-eyes, fx-head, fx-leg-bf, fx-leg-bn, fx-leg-ff, fx-leg-fn, fx-tail | trot with tail up; wag tail | Open savanna and bushland, Nairobi National Park, Mara |  |

## Props

| File | Groups | Use |
|---|---|---|
| prop-acacia-branch.svg | fx-branch | Branch for monkeys, chameleon, leopard or hornbill to sit on; sways on scroll. Habitat: acacia savanna. |
| prop-basket.svg | fx-handle | Animals hop in, matches the cart hop; kiondo style. |
| prop-flower.svg | fx-bloom, fx-eyes (empty) | Bee lands on it; bloom nods. |
| prop-grass-tuft.svg | fx-blades | Peek-from-behind cover for a warthog or dik-dik; blades sway. |
| prop-pond-ripple.svg | fx-ripple-a, fx-ripple-b, fx-ripple-c, fx-pad | Crocodile surfaces here; scale ripples out in sequence. |
| prop-rock.svg | (static) | Goat or hyrax perch; stand a small animal on top. |
| prop-thread-loop.svg | fx-thread | Elephant trunk or bird picks it up; draws as a loop on the yarn path. |

Existing props to reuse from `public/fx/cast/`: `yarn.svg` (yarn ball) and `butterfly.svg`.

## Sources for facts

- Cheetah speed: Kenya Wildlife Service post (x.com/KWSKenya) and Guinness World Records, fastest mammal over short distances.
- Flamingo colour and Rift Valley lakes: lakenakurupark.org and Wikipedia (lesser flamingo, IUCN Near Threatened).
- Secretary bird: EarthSky and 10,000 Birds on snake stomping.
- Dik-dik: African Wildlife Foundation dik-dik page (pairs); pair bonding wording kept soft.
- Cape buffalo herds: African Wildlife Foundation figures as quoted by safari guides.

## Notes

- Weaker sprites: warthog-stand (head), dik-dik-stand (small), ladybird-fly, secretary-bird-wings.
- Peek poses (ostrich, buffalo, warthog, dik-dik, crocodile-float, tortoise-hide) are cropped at the bottom edge on purpose: place them with their bottom on a card or viewport edge.
