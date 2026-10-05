import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
const dir = '../../../public/fx/cast2/';
const info = {
  cheetah: ['Open grassland, Maasai Mara, Amboseli, Laikipia', 'The fastest land animal over short sprints.', { stand: 'walk along a card top; wag tail; sit on a card corner', sprint: 'dash across a section edge on scroll, one pass' }],
  leopard: ['Rocky woodland and riverine forest, widespread in Kenya', '', { stand: 'walk; peek from edge', branch: 'drape over a card edge or section divider; tail swings; fall asleep' }],
  flamingo: ['Soda lakes of the Rift Valley: Nakuru, Bogoria, Elementaita', 'Their pink colour comes from the tiny algae they filter from alkaline lakes.', { stand: 'stand by a footer wave; stretch neck; blink', 'one-leg': 'idle on one leg; sway neck; swap with stand for a "changes pose" loop' }],
  ostrich: ['Dry savanna and semi-desert, Samburu, Tsavo, Maasai Mara', '', { stand: 'walk; wag tail plume', peek: 'neck rises from bottom edge, looks around, ducks back' }],
  buffalo: ['Grassland and swamp edges across Kenya parks', 'Cape buffalo live in herds that can number in the hundreds.', { stand: 'slow walk along a section edge', peek: 'peek over a card edge; ears flick' }],
  warthog: ['Open savanna and bushland, Nairobi National Park, Mara', '', { stand: 'trot with tail up; wag tail', peek: 'pop up from bottom edge; ears flick' }],
  crocodile: ['Rivers and lakes: Mara River, Lake Turkana, Tana River', '', { stand: 'waddle along a card top; tail sway', float: 'surface from the footer wave with the pond ripple, blink, sink again' }],
  tortoise: ['Dry bushland and rocky country; leopard tortoises in Kenya', '', { stand: 'very slow walk; head stretch', hide: 'hide on fast scroll; eyes appear when still' }],
  'dik-dik': ['Dry thornbush country, Tsavo, Samburu, Laikipia', 'Dik-diks are among the smallest antelopes and are usually seen in pairs.', { stand: 'tiptoe along an edge; ear flick', peek: 'pop up fast from a corner; dart away' }],
  impala: ['Light woodland and savanna, Maasai Mara, Nairobi NP', '', { stand: 'graze; ear flick; tail flick', leap: 'hop between cards; one arc per scroll step' }],
  'secretary-bird': ['Open grassland with scattered trees, Mara, Laikipia', 'It hunts snakes on foot by stomping them.', { stand: 'stride with head bob; blink', wings: 'flap wings; stomp (leg-a down)' }],
  hornbill: ['Dry acacia bush, Tsavo, Samburu (Von der Decken\'s hornbill)', '', { perch: 'sit on a heading or card edge; tilt head; blink', fly: 'fly across the viewport on a bezier path; flap wings' }],
  chameleon: ['Bushes and trees in forest edge and coast, Kenya has many species', '', { perch: 'sit on a branch prop; curl tail; turret eye looks around', zap: 'tongue shoots to catch a butterfly, then retracts' }],
  'bush-baby': ['Acacia woodland and forest edge at night', '', { sit: 'peek from a corner at night theme; ears turn', sleep: 'curl up and sleep in the footer or on empty states' }],
  bee: ['Everywhere there are flowers; Kenyan beekeeping is widespread', '', { fly: 'hover on a looping path; wings buzz; land on the flower prop', wave: 'sit on a card corner and wave' }],
  ladybird: ['Gardens and farms', '', { crawl: 'crawl along a heading or the thread line', fly: 'open wing cases and fly off at the end of a scroll' }],
  dog: ['Homesteads and towns across Kenya', '', { stand: 'trot; wag tail', sit: 'sit by the basket; wag tail; tongue pant' }],
  cat: ['Homes, farms and markets', '', { walk: 'walk along a card top; tail sway', sleep: 'fall asleep on a card corner or empty cart' }],
  chick: ['Farm yards', '', { stand: 'hop; flap wing nubs; peck', hatch: 'hatch from the egg when a section enters view' }],
  goat: ['Pastoral and farm land, kept widely across Kenya', '', { stand: 'graze; ear flick; tail flick', climb: 'climb the rock prop; hop on the spot' }],
};
const props = {
  'prop-acacia-branch': ['fx-branch', 'Branch for monkeys, chameleon, leopard or hornbill to sit on; sways on scroll. Habitat: acacia savanna.'],
  'prop-rock': ['(static)', 'Goat or hyrax perch; stand a small animal on top.'],
  'prop-grass-tuft': ['fx-blades', 'Peek-from-behind cover for a warthog or dik-dik; blades sway.'],
  'prop-flower': ['fx-bloom, fx-eyes (empty)', 'Bee lands on it; bloom nods.'],
  'prop-thread-loop': ['fx-thread', 'Elephant trunk or bird picks it up; draws as a loop on the yarn path.'],
  'prop-pond-ripple': ['fx-ripple-a, fx-ripple-b, fx-ripple-c, fx-pad', 'Crocodile surfaces here; scale ripples out in sequence.'],
  'prop-basket': ['fx-handle', 'Animals hop in, matches the cart hop; kiondo style.'],
};
let md = `# Cast 2 (extra animals and props)\n\nAll sprites: 200 x 200 viewBox, transparent, face right, ground line at y 182, under 6 KB each. Source: \`strategy/stage2/cast2/gen-cast2.mjs\` (parts in \`parts/\`, kit in \`lib.mjs\`). Files are in \`public/fx/cast2/\`. Nothing in the site imports them yet.\n\nShared groups (all transform-origin set inline; animate with \`transform-box: fill-box\` as in fx.css): \`fx-eyes\` (blink: scaleY), \`fx-ear\`, \`fx-tail\`, \`fx-neck\`, \`fx-head\`, \`fx-body\` (breathe: scaleY 1.02), \`fx-wing\` / \`fx-wing-a\` / \`fx-wing-b\`, \`fx-arm\`, \`fx-tongue\`, \`fx-ripple\`. Four-legged walkers have \`fx-leg-fn\` (front near), \`fx-leg-ff\` (front far), \`fx-leg-bn\` (back near), \`fx-leg-bf\` (back far); birds have \`fx-leg-a\` and \`fx-leg-b\`. For a trot swing fn and bf together, ff and bn together, rotate 12 degrees.\n\nFun facts were checked with web search against Kenya Wildlife Service, IUCN-linked and African Wildlife Foundation pages where shown; blank means not verified.\n\n## Animals\n\n| File | Groups | Suggested behaviours | Kenyan habitat | Fun fact |\n|---|---|---|---|---|\n`;
const files = readdirSync(dir).filter((n) => n.endsWith('.svg')).sort();
for (const n of files) {
  const svg = readFileSync(dir + n, 'utf8');
  const groups = [...new Set([...svg.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(' ')))].sort().join(', ');
  const base = n.replace('.svg', '');
  if (base.startsWith('prop-')) continue;
  const m = Object.keys(info).filter((k) => base.startsWith(k + '-')).sort((a, b) => b.length - a.length)[0];
  const pose = base.slice(m.length + 1);
  const [hab, fact, beh] = info[m];
  md += `| ${n} | ${groups} | ${beh[pose] || ''} | ${hab} | ${fact} |\n`;
}
md += `\n## Props\n\n| File | Groups | Use |\n|---|---|---|\n`;
for (const n of files) { const b = n.replace('.svg', ''); if (!props[b]) continue; const svg = readFileSync(dir + n, 'utf8'); md += `| ${n} | ${props[b][0]} | ${props[b][1]} |\n`; }
md += `\nExisting props to reuse from \`public/fx/cast/\`: \`yarn.svg\` (yarn ball) and \`butterfly.svg\`.\n\n## Sources for facts\n\n- Cheetah speed: Kenya Wildlife Service post (x.com/KWSKenya) and Guinness World Records, fastest mammal over short distances.\n- Flamingo colour and Rift Valley lakes: lakenakurupark.org and Wikipedia (lesser flamingo, IUCN Near Threatened).\n- Secretary bird: EarthSky and 10,000 Birds on snake stomping.\n- Dik-dik: African Wildlife Foundation dik-dik page (pairs); pair bonding wording kept soft.\n- Cape buffalo herds: African Wildlife Foundation figures as quoted by safari guides.\n\n## Notes\n\n- Weaker sprites: warthog-stand (head), dik-dik-stand (small), ladybird-fly, secretary-bird-wings.\n- Peek poses (ostrich, buffalo, warthog, dik-dik, crocodile-float, tortoise-hide) are cropped at the bottom edge on purpose: place them with their bottom on a card or viewport edge.\n`;
writeFileSync('CAST2.md', md);
