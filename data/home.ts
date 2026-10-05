// Captured moments for the home page: gallery_top12 from media/catalogue/story-content.json, without the two that the hero and the
// story section already show, plus two story photos so the grid still closes in rows of 3 and 4.
// Files are the untouched originals. Every crop is square with object-cover and the focal point below.

export type Moment = { src: string; alt: string; caption: string; focal: [number, number] };

export const moments: Moment[] = [
  { src: "/media/moments/moment-03-giraffe-family.jpg", alt: "Woman in a striped yellow dress seated behind about fifteen crocheted yellow and cream giraffes on a teal blanket", caption: "A family of giraffes", focal: [0.5, 0.4] },
  { src: "/media/moments/moment-04-giraffes-sofa.jpg", alt: "Woman in a blue patterned dress seated on a sofa beside many crocheted giraffes on a teal blanket", caption: "Giraffes on the sofa", focal: [0.5, 0.5] },
  { src: "/media/moments/moment-05-lion-mane.jpg", alt: "Older woman in a yellow hoodie hand finishing a lion mane surrounded by piles of crocheted giraffes and lion bodies", caption: "Giving a lion its mane", focal: [0.5, 0.45] },
  { src: "/media/moments/moment-06-market-table.jpg", alt: "Market table with a white heart print cloth covered in crocheted lions, rabbits, giraffes, rhinos and elephants", caption: "Lions, giraffes and elephants", focal: [0.5, 0.55] },
  { src: "/media/moments/moment-07-stall-visitors.jpg", alt: "Young man holding a crocheted giraffe and elephant beside a smiling woman in a red visor under a blue market umbrella", caption: "Visitors at the stall", focal: [0.5, 0.5] },
  { src: "/media/moments/moment-08-shelf-ready.jpg", alt: "Gift shop shelf with yellow giraffes, lions, grey elephants and light blue rhinos with hang tags", caption: "Ready to go home", focal: [0.4, 0.5] },
  { src: "/media/moments/moment-09-orange-giraffes.jpg", alt: "Market stall packed with orange giraffes, grey and purple elephants and brown rabbits with shoppers behind", caption: "Orange giraffes and rabbits", focal: [0.5, 0.5] },
  { src: "/media/moments/moment-10-garden-giraffes.jpg", alt: "Rows of yellow and cream crocheted giraffes on a pale blue cloth under a canopy with green trees behind", caption: "Giraffes in the shade", focal: [0.5, 0.45] },
  { src: "/media/moments/moment-11-garden-restaurant.jpg", alt: "Crocheted giraffes and elephants on a white table at a busy open air thatched restaurant with seated diners", caption: "On show in a garden", focal: [0.5, 0.5] },
  { src: "/media/moments/moment-12-table-of-animals.jpg", alt: "Market table with rows of crocheted giraffes, grey elephants and lions, and four long cats in orange, mint, blue and pink lying at the front", caption: "A table of animals", focal: [0.5, 0.4] },
  { src: "/media/story/man-with-giraffe-and-elephant.jpg", alt: "Smiling young man in an orange jacket holding a crocheted giraffe and a grey elephant under a blue umbrella", caption: "A giraffe and an elephant", focal: [0.5, 0.4] },
  { src: "/media/story/man-with-lion-at-stall.jpg", alt: "Man in a cap and leather jacket looking closely at a crocheted lion at a market stall", caption: "Looking closely at a lion", focal: [0.4, 0.45] },
];

export const homePhotos = {
  hero: { src: "/media/story/hero-lion-hug.jpg", alt: "Smiling woman with purple braids and an orange top holding a large crocheted lion at an outdoor market with kitenge cloths behind her", width: 1472, height: 1472 },
  maker: { src: "/media/story/maker-at-stall.jpg", alt: "Woman with locs and glasses smiling behind a market table full of grey and blue crocheted elephants, rhinos and orange giraffes", width: 1600, height: 900 },
} as const;
