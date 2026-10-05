// Project pages built from real photos. Each page describes what the photos show and nothing else.
// No outcomes, no numbers, no dates and no partner names until the client supplies them.
import type { PhotoId } from "./photos";

export type Project = {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  cover: PhotoId;
  /** What the photos show: plain paragraphs, no outcomes. */
  did: string[];
  /** Look closer: one line per visible thing. */
  see: string[];
  gallery: PhotoId[];
  /** Which animals appear, one line. */
  animals: string;
  /** What is not confirmed for this set of photos. Shown only when there is something specific to say. */
  note?: string;
  /** How to join or ask. */
  ask: string;
};

export const projects: Project[] = [
  {
    slug: "making-giraffes",
    title: "Making giraffes",
    kind: "In the workroom",
    summary: "Makers crocheting and stitching giraffes, from the first loops to a family on a teal blanket.",
    cover: "giraffesSofa",
    did: [
      "This set follows giraffes from loose pieces to a finished group. In the first photo a woman in a black t-shirt works a hook through yellow yarn. Yellow and cream giraffe pieces fill the front of the frame, each with a round brown patch.",
      "The second photo is closer to the work. A young woman in a black t-shirt stitches yellow pieces together on her lap, with cream pieces below them.",
      "The last three photos show where the pieces end up. A woman in a blue patterned dress sits on a sofa with a crowd of giraffes on a teal blanket and holds one in her hand. Another woman, in a striped yellow dress, sits behind about fifteen giraffes on the same kind of blanket. A close view of the herd shows yellow and white giraffes with brown spots and brown or white muzzles, and a white giraffe in front with a tail of cream yarn.",
    ],
    see: ["A hook working through yellow yarn.", "Giraffe pieces waiting to be stitched.", "Giraffes of several heights on one blanket.", "A short tail of cream yarn on the white giraffe at the front of the herd."],
    gallery: ["handsGiraffe", "handsStitching", "giraffeFamily", "giraffeHerd"],
    animals: "Giraffes in yellow and cream.",
    ask: "Want giraffes for a shop, a lodge or a gift? Send a wholesale request, or message us on WhatsApp to ask about colours and sizes.",
  },
  {
    slug: "finishing-a-lion-mane",
    title: "Finishing a lion mane",
    kind: "In the workroom",
    summary: "A maker gives a lion its mane and trims it, with piles of animals in progress around her.",
    cover: "lionMane",
    did: [
      "A woman in a yellow hoodie sits on a blue and white patterned cloth with a lion in her hands. In one photo she holds a small tuft of brown strands. In the next she trims the mane with scissors, and the strands around the face are cut to about the same length.",
      "Around her lies the rest of the workroom. Tan lion pieces with round ends and small ears are heaped to one side, not yet fitted with manes. Yellow giraffe bodies cover the floor in front of her, and a white sack stands at the back. A tangle of brown yarn strands lies on the cloth, which is what the manes are made of.",
      "The third photo shows a finished lion on a wooden pallet in the sun. The mane is a full fringe of brown strands that falls over its chest and shoulders. Its tan body has a dark nose and small dark eyes.",
    ],
    see: ["Scissors in one hand and a lion in the other.", "Tan lion pieces waiting for manes.", "A mane of loose brown strands, cut to an even fringe.", "The finished lion outdoors, in daylight."],
    gallery: ["lionMane", "trimmingMane", "lionPallet", "lionsRowTable"],
    animals: "Lions, with yellow giraffe bodies in the background.",
    note: "How long a mane takes is not confirmed yet.",
    ask: "Curious about a lion in a particular size? The size guide shows four lions side by side, and you can ask us anything on WhatsApp.",
  },
  {
    slug: "the-market-table",
    title: "The market table",
    kind: "At the market",
    summary: "Our animals laid out on market tables, with visitors stopping to look and hold them.",
    cover: "marketTable",
    did: [
      "The cover photo shows a table dressed in a white cloth with a heart print. Lions with long brown manes stand in front. Behind them, yellow and cream giraffes stand in a block, grey elephants and a blue rhino lie in a line, and a brown rabbit in a colourful vest sits on the right.",
      "In the second photo a woman with locs and glasses smiles from behind a table of grey and blue elephants, light blue rhinos and orange giraffes, with a rabbit in a rainbow scarf among them. In the third, a young man in an orange jacket holds a giraffe and an elephant beside a smiling woman in a red visor, under a large blue umbrella.",
      "A fourth photo packs one stall with orange giraffes, grey and purple elephants and brown rabbits, with shoppers walking behind. In the last, a man in a cap and a leather jacket looks closely at a lion, while orange giraffes wait beside it under a red umbrella.",
    ],
    see: ["A heart print cloth under a row of lions.", "A maker smiling behind a full table.", "Two visitors holding a giraffe and an elephant.", "A shopper bending to look at a lion."],
    gallery: ["marketTable", "stallMaker", "stallVisitors", "orangeGiraffes", "manLionStall"],
    animals: "Lions, giraffes, elephants, rhinos and rabbits.",
    note: "Market dates and places are not listed on this site yet.",
    ask: "Message us on WhatsApp to ask where to see the animals.",
  },
  {
    slug: "a-group-gathering",
    title: "A group gathering",
    kind: "People",
    summary: "Two photos of adults and children in a courtyard. We have not yet written up the occasion.",
    cover: "courtyard",
    did: [
      "This page has two photos of one gathering, so we describe only what is visible. About a dozen people have gathered in front of a blue painted wall. Older women sit in the front row in bright patterned dresses, one holding two walking sticks, and an older man sits on a wooden chair on the right in a dark jacket and a cap.",
      "Behind them, adults stand close together, some in knitted hats. One woman at the back carries a baby in purple. A small child in an orange jacket and a white dress stands at the front, and a pair of crutches leans against a chair on the left. Washing hangs on a line at the edge of the frame.",
      "There are no crocheted animals in the picture. We have not confirmed who is in it, where it was taken or what the occasion was, so we do not name or guess.",
    ],
    see: ["Several generations in one frame.", "A blue painted wall behind the group.", "A small child in an orange jacket at the front."],
    gallery: ["courtyard", "courtyardWide"],
    animals: "None in this photo.",
    note: "The occasion, place and people are not confirmed.",
    ask: "If you would like to take part in a gathering, a workshop or a visit with Mikono, use the partners page or message us on WhatsApp and tell us what you have in mind.",
  },
  {
    slug: "on-the-shelf",
    title: "On the shelf",
    kind: "In shops",
    summary: "Our animals tagged and arranged on shop shelves and long tables, ready to go home.",
    cover: "shelfReady",
    did: [
      "The cover photo is a gift shop shelf. Yellow giraffes, tan lions, grey elephants and light blue rhinos sit in groups, each with a small hang tag, and more grey elephants rest on the floor below. Everything is grouped by kind, so a shopper can find a giraffe or an elephant at a glance.",
      "The second photo is a long table under a turquoise cloth, seen from one end. Lions, elephants and giraffes stand in rows, a blue rhino sits at the front, and three lions rest on the floor beside the table. In the third, a white canopy shelters a stall with bags hanging overhead and rows of animals below: brown bears, grey elephants, yellow giraffes and red, green and white octopuses.",
      "The last photo is a close view of rows. Light blue rhinos and grey elephants sit in lines below a row of yellow giraffes, with a lion at the left edge, all set out neatly on a white table.",
    ],
    see: ["Hang tags on the animals on the shelf.", "A turquoise cloth under rows of lions.", "Octopuses in red, green and white at the front of a stall.", "Elephants and rhinos in straight lines."],
    gallery: ["shelfReady", "longTable", "canopyStall", "elephantsRhinosRows"],
    animals: "Giraffes, lions, elephants, rhinos, bears and octopuses.",
    ask: "Run a shop or a lodge? The wholesale page takes a short request, and we reply on WhatsApp with the price list.",
  },
  {
    slug: "a-hippo-in-a-dress",
    title: "A hippo in a dress",
    kind: "Animals in outfits",
    summary: "A navy crocheted hippo in a magenta dress, held up by a maker, with dolls and rabbits in their own outfits.",
    cover: "hippoDress",
    did: [
      "A hand holds up a navy crocheted hippo with round ears and eyes ringed in pink. It wears a magenta dress with a hem in pink, white and purple. Behind it a woman sits on a sofa with patterned cushions, looking at the camera.",
      "Two more photos show other animals in outfits. Three crocheted dolls stand against a white wall on a wooden shelf, in pink, lilac and turquoise dresses with shoes to match. One has yellow hair, one brown and one dark brown. Two brown rabbits with long ears wear small waistcoats, one blue and one red and green, among other animals on a table.",
      "We have not confirmed how the dress, the doll clothes or the waistcoats are attached, so we make no claim about them.",
    ],
    see: ["A hippo with ringed eyes.", "A dress with a multicoloured hem.", "Three dolls in pink, lilac and turquoise.", "Two rabbits in waistcoats."],
    gallery: ["hippoDress", "threeDolls", "rabbits"],
    animals: "A hippo, three dolls and two rabbits.",
    note: "How the clothes are attached is not confirmed.",
    ask: "Interested in animals in outfits, or a custom idea? Use the custom page to tell us what you have in mind.",
  },
  {
    slug: "giraffes-in-the-garden",
    title: "Giraffes in the garden",
    kind: "On show",
    summary: "Giraffes, elephants, rhinos and rabbits on tables in garden settings, under trees and bamboo roofs.",
    cover: "gardenGiraffes",
    did: [
      "The cover photo shows rows of yellow and cream giraffes on a pale blue cloth under a canopy, with green trees behind. Tall yellow giraffes stand in front, their brown spots and white muzzles turned to the camera.",
      "A second photo is taken at an open air restaurant under a thatched roof. Giraffes and grey elephants sit on a white table in the foreground while diners sit behind, mid meal. In the third, blue and grey elephants and light blue rhinos stand in a row in front of giraffes and a brown bear, under a bamboo roof with leaves behind it.",
      "A fourth photo looks across the same kind of table: brown rabbits stand among yellow and cream giraffes, with blue elephants in front. In the last, light blue rhinos and grey elephants fill a garden stall, with a brown bear in a colourful top at the left edge.",
    ],
    see: ["Daylight through trees on a blue cloth.", "Diners seated behind the animals.", "Light blue rhinos and blue elephants in rows.", "A brown bear in a colourful top."],
    gallery: ["gardenGiraffes", "gardenRestaurant", "elephantsBamboo", "giraffesBamboo", "rhinosGarden"],
    animals: "Giraffes, elephants, rhinos, rabbits and a bear.",
    note: "Where these gardens are is not confirmed.",
    ask: "Would you like our animals shown at your venue? Send a partner enquiry and tell us about the place.",
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

/** Words on a project page: summary, paragraphs, list lines and the closing line. */
export function projectWords(p: Project): number {
  return [p.summary, ...p.did, ...p.see, p.ask].join(" ").split(/\s+/).filter(Boolean).length;
}
