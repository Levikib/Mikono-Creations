// Photo registry for story, journal, projects, makers, gallery and impact pages.
// Every file is an untouched original or a crop made by the media agents (media/catalogue/story-content.json).
// Pixels are never changed. Frames use object-cover with the focal point below.
// Sources with a short side under 700 px are flagged low and are only shown in small frames.

export type Photo = {
  src: string;
  alt: string;
  /** Plain caption describing what is visible. */
  caption: string;
  w: number;
  h: number;
  /** Focal point, 0 to 1 from the top left. */
  focal: [number, number];
  /** Square card version for a source with a short side under 400 px: the photo at its own size on a sand panel. */
  card?: string;
};

const S = "/media/story/";
const M = "/media/moments/";
const G = "/media/gallery/";

const p = (src: string, w: number, h: number, caption: string, alt: string, focal: [number, number] = [0.5, 0.5], card?: string): Photo => ({ src, w, h, caption, alt, focal, card });

export const photos = {
  lionHug: p(S + "hero-lion-hug.jpg", 1472, 1472, "A big lion at the market", "Smiling woman with purple braids and an orange top holding a large crocheted lion at an outdoor market with kitenge cloths behind her"),
  lionLooking: p(S + "lion-market-looking-down.jpg", 1472, 1472, "Looking at the lion she is holding", "Woman with purple braids looking down at a large crocheted lion at an outdoor craft market", [0.5, 0.45]),
  stallMaker: p(S + "maker-at-stall.jpg", 1600, 900, "At the market stall", "Woman with locs and glasses smiling behind a market table full of grey and blue crocheted elephants, rhinos and orange giraffes", [0.5, 0.4]),
  marketStall: p(M + "moment-01-market-stall.jpg", 1600, 1047, "At the market stall", "Woman with locs and glasses smiling behind a market table full of grey and blue crocheted elephants, rhinos and orange giraffes", [0.5, 0.4]),
  giraffeFamily: p(M + "moment-03-giraffe-family.jpg", 673, 927, "A family of giraffes", "Woman in a striped yellow dress seated behind about fifteen crocheted yellow and cream giraffes on a teal blanket", [0.5, 0.4]),
  giraffesSofa: p(M + "moment-04-giraffes-sofa.jpg", 643, 687, "Giraffes on the sofa", "Woman in a blue patterned dress seated on a sofa beside many crocheted giraffes on a teal blanket"),
  lionMane: p(M + "moment-05-lion-mane.jpg", 738, 930, "Giving a lion its mane", "Older woman in a yellow hoodie hand finishing a lion mane surrounded by piles of crocheted giraffes and lion bodies", [0.5, 0.45]),
  marketTable: p(M + "moment-06-market-table.jpg", 1200, 1600, "Lions, giraffes and elephants", "Market table with a white heart print cloth covered in crocheted lions, rabbits, giraffes, rhinos and elephants", [0.5, 0.55]),
  stallVisitors: p(M + "moment-07-stall-visitors.jpg", 961, 1440, "Visitors at the stall", "Two visitors holding crocheted animals under a blue market umbrella beside a teal table", [0.5, 0.5]),
  shelfReady: p(M + "moment-08-shelf-ready.jpg", 744, 562, "Ready to go home", "Gift shop shelf with yellow giraffes, lions, grey elephants and light blue rhinos with hang tags", [0.4, 0.5]),
  orangeGiraffes: p(M + "moment-09-orange-giraffes.jpg", 1600, 1236, "Orange giraffes and rabbits", "Market stall packed with orange giraffes, grey and purple elephants and brown rabbits with shoppers behind"),
  gardenGiraffes: p(M + "moment-10-garden-giraffes.jpg", 1200, 1600, "Giraffes in the shade", "Rows of yellow and cream crocheted giraffes on a pale blue cloth under a canopy with green trees behind", [0.5, 0.45]),
  gardenRestaurant: p(M + "moment-11-garden-restaurant.jpg", 1200, 1600, "On show in a garden", "Crocheted giraffes and elephants on a white table at a busy open air thatched restaurant with seated diners"),
  tableOfAnimals: p(M + "moment-12-table-of-animals.jpg", 744, 992, "A table of animals", "Market table with rows of crocheted giraffes, grey elephants and lions, and four long cats in orange, mint, blue and pink lying at the front", [0.5, 0.4]),
  girlBear: p(S + "girl-with-turquoise-bear.jpg", 672, 736, "A small turquoise bear", "Girl in a pink jumper holding a small turquoise crocheted bear at an outdoor market", [0.5, 0.4]),
  girlLionBag: p(S + "girl-with-lion-bag.jpg", 568, 544, "A lion in a white bag", "Girl in a dark jacket carrying a crocheted lion in her white shoulder bag at an outdoor market", [0.5, 0.5]),
  handsGiraffe: p(S + "hands-crocheting-yellow-giraffe.jpg", 890, 1024, "Hands crocheting a yellow giraffe", "Woman in a black t-shirt crocheting with a hook, with yellow and cream crocheted giraffe pieces in the foreground", [0.4, 0.45]),
  handsStitching: p(S + "hands-stitching-giraffe-parts.jpg", 744, 992, "Stitching giraffe parts", "Young woman in a black t-shirt stitching crocheted yellow giraffe pieces, ready to assemble", [0.4, 0.45]),
  makerCrocheting: p(S + "maker-crocheting-toy-waiting.jpg", 622, 992, "Crocheting on a chair", "Woman in a patterned yellow and black top and kitenge skirt crocheting on a chair, with a crocheted animal waiting beside her", [0.5, 0.4]),
  workroomPieces: p(S + "workroom-giraffe-pieces.jpg", 960, 935, "A break in the workroom", "Woman in a red hat and navy hoodie looking at her phone on a plastic chair beside a table of crocheted giraffe pieces and scissors", [0.55, 0.5]),
  finishingGiraffe: p(S + "finishing-giraffe-orange-yarn.jpg", 477, 886, "Finishing a giraffe", "Woman in a striped top and headscarf holding a crocheted yellow giraffe, with a box of orange yarn beside her", [0.5, 0.35]),
  sewingBear: p(S + "sewing-bear-face.jpg", 678, 867, "Sewing a bear face", "Woman with locs on a grey sofa sewing the face of a tan crocheted bear on her lap", [0.5, 0.4]),
  elephantsInMaking: p(S + "grey-elephants-lion-in-making.jpg", 545, 909, "Many hands, many animals", "Woman in a white jacket on a blue sofa working on a lion beside a pile of grey crocheted elephant pieces", [0.5, 0.35]),
  trimmingMane: p(S + "trimming-lion-mane.jpg", 609, 907, "Trimming a lion mane", "Woman in a yellow hoodie trimming a lion mane with scissors among piles of crocheted giraffe and lion pieces", [0.5, 0.35]),
  hippoDress: p(S + "hippo-pink-dress.jpg", 665, 736, "A hippo in a magenta dress", "Hand holding up a navy crocheted hippo wearing a magenta dress, with a seated woman behind", [0.5, 0.45]),
  courtyard: p(S + "courtyard-gathering.jpg", 708, 308, "A gathering in a courtyard", "Group of adults and children seated and standing in a courtyard in front of a blue wall", [0.5, 0.5], G + "img-005-frame.jpg"),
  beachStall: p(S + "beach-stall-lions-dolls.jpg", 1200, 1600, "A stall by the sand", "Two women at a stall on sand with crocheted lions and dolls on a blue table", [0.5, 0.5]),
  canopyStall: p(S + "canopy-stall-animals.jpg", 736, 578, "A stall under a canopy", "Stall under a white canopy with bags hanging above and rows of crocheted animals below", [0.5, 0.6]),
  manGiraffeElephant: p(S + "man-with-giraffe-and-elephant.jpg", 605, 649, "Holding a giraffe and an elephant", "Smiling young man in an orange jacket holding a crocheted giraffe and a grey elephant under a blue umbrella", [0.5, 0.4]),
  manLionStall: p(S + "man-with-lion-at-stall.jpg", 746, 1062, "Looking closely at a lion", "Man in a cap and leather jacket looking closely at a crocheted lion at a market stall", [0.4, 0.45]),
  tableLionsGiraffes: p(S + "table-lions-giraffes-pastel-bears.jpg", 744, 992, "Lions, giraffes and elephants", "Table of crocheted lions, giraffes and grey elephants with four long cats in orange, mint, blue and pink lying at the front", [0.5, 0.5]),
  longTable: p(S + "long-table-whole-range.jpg", 744, 992, "The whole range on a long table", "Long table with a turquoise cloth carrying lions, elephants and giraffes in rows", [0.5, 0.5]),
  elephantsRhinosRows: p(S + "elephants-rhinos-in-rows.jpg", 645, 952, "Elephants and rhinos in rows", "Neat rows of grey elephants and light blue rhinos below a row of yellow giraffes", [0.5, 0.5]),
  lionsGiraffes: p(S + "lions-front-giraffes-back.jpg", 1200, 1600, "Lions at the front", "Table with crocheted lions at the front and rows of yellow and cream giraffes at the back", [0.5, 0.6]),
  zebrasBunnies: p(S + "zebras-giraffes-bunnies.jpg", 960, 1280, "Zebras, giraffes and bunnies", "Black and white zebras, giraffes and brown rabbits on one table, with long cats in pink, cream and yellow and small dolls in dresses at the front", [0.5, 0.5]),
  rhinosGarden: p(S + "rhinos-elephants-garden-stall.jpg", 960, 1280, "Rhinos and elephants", "Light blue rhinos and grey elephants on a garden stall with a brown bear at the left", [0.5, 0.5]),
  threeGiraffes: p(S + "three-giraffes-cream-yellow-tan.jpg", 1059, 1600, "Three giraffes", "Three crocheted giraffes in cream, yellow and tan standing in front of green trees", [0.5, 0.55]),
  elephantsBamboo: p(S + "elephants-rhinos-bamboo-roof.jpg", 1600, 1059, "In the shade of a bamboo roof", "Blue and grey crocheted elephants and rhinos in front of giraffes and a brown bear under a bamboo roof", [0.5, 0.5]),
  giraffesBamboo: p(S + "giraffes-rabbits-elephants-bamboo.jpg", 1059, 1600, "Giraffes, rabbits and elephants", "Yellow and cream giraffes, brown rabbits and blue elephants under a bamboo roof with green leaves behind", [0.5, 0.5]),
  rabbits: p(S + "two-rabbits-waistcoats.jpg", 1600, 1059, "Two rabbits in waistcoats", "Two brown crocheted rabbits with long ears, one in a blue waistcoat and one in a red and green one, among other animals", [0.5, 0.5]),
  monkeys: p(S + "hand-holding-two-monkeys.jpg", 1200, 1600, "Two long armed monkeys", "Hand holding two crocheted long armed monkeys", [0.5, 0.5]),
  octopuses: p(S + "octopuses-rows.jpg", 736, 628, "Octopuses in rows", "Rows of crocheted octopuses in red, green, yellow and white", [0.5, 0.5]),
  lionsRowShelf: p(S + "lions-row-shelf.jpg", 432, 650, "Lions in a row, large to small", "Four crocheted tan lions with brown manes in a row from largest at the left to smallest at the right, with two small octopuses on a shelf below", [0.5, 0.35]),
  lionsRowTable: p(S + "lions-row-dark-table.jpg", 432, 648, "Lions on a dark table", "Row of crocheted tan lions with brown manes on a dark table, getting smaller from left to right", [0.5, 0.45]),
  lionRowCloseup: p(S + "lion-row-closeup.jpg", 434, 648, "A close look along the row", "Close view along a line of crocheted tan lions on a dark table, the nearest one large and the others smaller", [0.4, 0.4]),
  lionPallet: p(S + "lion-on-wooden-pallet.jpg", 434, 650, "A lion on a wooden pallet", "Crocheted lion with a tan body and a long brown yarn mane standing on a wooden pallet in the sun", [0.5, 0.5]),
  // Overlay text (XL, Large, Medium, Small) was removed from the original and the corner with a third party label cropped.
  ladder: p(S + "lion-size-ladder-unlabelled.jpg", 716, 470, "Four lions, large to small", "Four crocheted tan lions with brown manes in a row on a black table, from largest at the left to smallest at the right, against a cream wall", [0.5, 0.5]),
  giraffeShades: p(S + "giraffes-shades-blanket.jpg", 432, 648, "Giraffes in different shades", "Crocheted giraffes in yellow and cream with brown spots and white muzzles, standing together on a teal blanket", [0.5, 0.45]),
  giraffeTrio: p(S + "giraffes-trio-large-small.jpg", 434, 648, "Giraffes of different sizes", "Three crocheted giraffes in different sizes and shades of yellow and cream standing together", [0.5, 0.45]),
  giraffeHerd: p(S + "giraffes-herd-teal-blanket.jpg", 432, 650, "A herd on a teal blanket", "Crocheted yellow and white giraffes with brown spots standing close together on a teal blanket", [0.5, 0.45]),
  giraffePortrait: p(S + "giraffe-portrait.jpg", 434, 650, "A yellow giraffe", "Crocheted yellow giraffe with brown spots, a white muzzle and two brown horns against a cream wall", [0.5, 0.4]),
  crochetingOrange: p(G + "img-049.jpg", 539, 810, "Crocheting with orange yarn", "Woman in a blue patterned top and a brown head wrap crocheting with orange yarn, her eyes looking down", [0.5, 0.35]),
  courtyardWide: p(G + "img-047.jpg", 708, 308, "The courtyard, another frame", "Group of about thirteen adults and children posing outdoors in front of a blue wall, some seated, including elderly people with walking sticks and a toddler in an orange jacket", [0.5, 0.5], G + "img-047-frame.jpg"),
  threeDolls: p(S + "three-dolls.jpg", 720, 908, "Three crocheted dolls", "Three crocheted dolls in pink, lilac and turquoise dresses standing against a white wall", [0.5, 0.5]),
} as const satisfies Record<string, Photo>;

export type PhotoId = keyof typeof photos;

/** Low resolution sources must stay in small frames (shop rule: under 700 px short side). */
export const isLow = (ph: Photo) => Math.min(ph.w, ph.h) < 700;

/** Captured moments: the twelve from gallery_top12 plus further stall and garden photos, all uniform square crops. */
export const galleryIds: PhotoId[] = [
  "marketStall", "lionHug", "giraffeFamily", "giraffesSofa", "lionMane", "marketTable",
  "stallVisitors", "shelfReady", "orangeGiraffes", "gardenGiraffes", "gardenRestaurant", "tableOfAnimals",
  "manGiraffeElephant", "manLionStall", "rhinosGarden", "threeGiraffes", "elephantsBamboo", "giraffesBamboo",
];

/**
 * Some files are the same photo or the same moment saved twice (a story copy and a moments copy, or two crops of one frame).
 * Each id maps to one scene id so a page can avoid showing a scene twice. scripts/check-duplicate-media.mjs mirrors this list.
 */
const sameScene: Partial<Record<PhotoId, PhotoId>> = {
  marketStall: "stallMaker",
  lionMane: "trimmingMane",
  marketTable: "lionsGiraffes",
  tableOfAnimals: "tableLionsGiraffes",
};
export const sceneOf = (id: PhotoId): PhotoId => sameScene[id] ?? id;

/** Keeps the ids whose scene is not in `taken`, and each scene once. */
export function freshScenes(ids: readonly PhotoId[], taken: readonly PhotoId[]): PhotoId[] {
  const seen = new Set(taken.map(sceneOf));
  return ids.filter((id) => { const k = sceneOf(id); if (seen.has(k)) return false; seen.add(k); return true; });
}
