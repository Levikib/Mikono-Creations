// Product copy. Only what is visible in the photos or stated in the client brief (R2, R9, D26).
// Claims are conservative (D26). "Zero plastic" and "Nothing detachable" apply only to plain crocheted animals
// with no clothes or accessories. Animals in a vest, a dress or with a bag carry only the made by hand and recycled
// yarn rows. Dolls, wall heads and the lion head handbag carry no claim rows until the client confirms them.

export type ClaimSet = "plain" | "dressed" | "none";
export type ProductNoun = "animal" | "doll" | "bag" | "wall head";

export type ProductCopy = {
  /** One plain sentence about what the product looks like. */
  lead: string;
  /** Short facts, each visible in the photos. */
  details: string[];
  /** What to call the product in headings ("About this animal"). Dolls and bags are not animals (R10). */
  noun: ProductNoun;
  /** "plain" = fully crocheted animal with nothing worn or carried, approved D26 rows. "dressed" = made by hand and yarn rows only. "none" = no rows. */
  claims: ClaimSet;
};

/** Approved D26 claim rows, shown only for products whose claims set is "animal". */
export const animalClaims = [
  { icon: "leaf", title: "Zero plastic", text: "On our plain animals." },
  { icon: "shield", title: "Nothing detachable", text: "On our plain animals." },
  { icon: "hand", title: "Recycled acrylic yarn", text: "Made from yarn that already exists." },
] as const;

/** Rows for animals that wear or carry something: the client has not confirmed zero plastic or nothing detachable for those. */
export const basicClaims = [
  { icon: "hand", title: "Made by hand in Nairobi", text: "Crocheted one loop at a time." },
  { icon: "leaf", title: "Recycled acrylic yarn", text: "Made from yarn that already exists." },
] as const;

export const claimsFor = (slug: string) => {
  const set = copyFor(slug).claims;
  return set === "plain" ? animalClaims : set === "dressed" ? basicClaims : [];
};

/** Home page and trust strip wording: the claims are stated for plain crocheted animals only. */
export const trustClaims = [
  { icon: "leaf", title: "Zero plastic", text: "On our plain animals." },
  { icon: "shield", title: "Nothing detachable", text: "On our plain animals." },
  { icon: "hand", title: "Recycled acrylic yarn", text: "Yarn that already exists." },
] as const;

const made = "Crocheted by hand in Nairobi from recycled acrylic yarn.";
const madeNbo = "Crocheted by hand in Nairobi.";
const A = (lead: string, details: string[]): ProductCopy => ({ lead, details: [...details, made], noun: "animal", claims: "plain" });
/** An animal that wears or carries something. */
const D = (lead: string, details: string[]): ProductCopy => ({ lead, details: [...details, made], noun: "animal", claims: "dressed" });
const W = (lead: string, details: string[]): ProductCopy => ({ lead, details: [...details, madeNbo], noun: "wall head", claims: "none" });

export const productCopy: Record<string, ProductCopy> = {
  elephant: A("A crocheted elephant with white tusks, made in several colours.", ["White crocheted tusks"]),
  giraffe: A("A crocheted giraffe with brown spots and two ossicones on its head, with a white muzzle on most colours and a brown muzzle on the cream one.", ["Brown spots", "Two ossicones on the head", "A slimmer design with white stitched dots, in red, purple, sky blue, pale yellow and royal blue"]),
  lion: A("A crocheted lion with a long, shaggy yarn mane and a dark brown nose.", ["Yarn mane around the face"]),
  rhino: A("A crocheted rhino with cream horns, made in light blue and brown.", ["Cream crocheted horns"]),
  zebra: A("A crocheted zebra in black and white stripes, standing on four legs.", ["Black and white stripes"]),
  hippo: D("A crocheted navy hippo with ringed eyes, shown wearing a magenta dress.", ["Dress with a multicoloured hem, as photographed"]),
  monkey: A("A long-limbed crocheted monkey with a coloured face and ears.", ["Long arms and legs", "Face and ears in a second colour"]),
  rabbit: D("A brown crocheted rabbit with long ears, wearing a small vest.", ["Long ears", "A different speckled vest colour on each rabbit"]),
  cat: D("Long crocheted cats in cream, orange, mint, blue and pink. Some carry a small shoulder bag and have a coloured ear tip.", ["Some with a small bag", "Some with a coloured ear tip"]),
  dog: A("A brown crocheted dog with floppy ears, a cream muzzle and a black nose.", ["Floppy ears and a cream muzzle"]),
  pig: A("A pink crocheted pig with pink ears, snout and hooves, and small black eyes.", ["Pink ears, snout and hooves"]),
  cow: A("A black and white crocheted cow with black patches, tan horns and a large pink nose.", ["Black patches and tan horns", "A large pink nose"]),
  duck: A("Two yellow crocheted ducklings with orange beaks and feet. One stands and one sits in a white crocheted eggshell.", ["Orange beak and feet", "One duckling sits in a white eggshell"]),
  bear: D("A small crocheted bear with round ears and a dark nose, made in several colours, some with a striped or rainbow top.", ["Round ears and a dark nose"]),
  goose: A("A crocheted goose with an orange beak and orange feet and a folded wing.", ["Orange beak and feet"]),
  octopus: A("A crocheted octopus with a ruffled skirt of tentacles, made in several colours.", ["Ruffled tentacles"]),
  shark: A("A crocheted shark with a cream underside and stitched gill lines.", ["Cream underside", "Stitched gill lines"]),
  turtle: A("A crocheted turtle with a striped spiral shell and four flippers.", ["Striped spiral shell"]),
  butterfly: A("A crocheted butterfly with spotted wings and two antennae.", ["Spotted wings"]),
  chameleon: A("A crocheted chameleon in lime green with a striped body and a curled tail.", ["Striped body and curled tail"]),
  dinosaur: A("A sitting crocheted dinosaur in yellow with orange spikes and large white eyes.", ["Orange spikes on the back"]),
  "lion-head-handbag": { lead: "A white shoulder bag with a crocheted lion head attached, looking out of the open top.", details: ["Crocheted lion head with a fringed brown yarn mane", "Worn on a long strap across the body"], noun: "bag", claims: "none" },
  "lion-wall-head": W("A crocheted lion head to hang on a wall, with a long fringed golden mane.", ["Fringed mane edged in dark brown"]),
  "giraffe-wall-head": W("A crocheted giraffe neck and head to hang on a wall, covered in round brown spots.", ["Two small horns and a brown muzzle"]),
  "elephant-wall-head": W("A crocheted elephant head with a long trunk and white tusks, to hang on a wall.", ["Large ears and lashed eyes"]),
  "rhino-wall-head": W("A crocheted rhino head with a large cream horn, to hang on a wall.", ["Large cream horn", "Lilac eye"]),
  "hippo-wall-head": W("A crocheted hippo head with blue ringed eyes, to hang on a wall.", ["Round ears and blue nostril circles"]),
  "zebra-wall-head": W("A crocheted zebra head in black and white stripes, to hang on a wall.", ["Spiky mane"]),
  "warthog-wall-head": W("A crocheted warthog head with two curved white tusks, to hang on a wall.", ["Small ears and dark eyes"]),
  "unicorn-wall-head": W("A crocheted unicorn head with a pink yarn mane and a twisted horn, to hang on a wall.", ["Small crocheted flowers by the ear"]),
  "secretary-bird-wall-head": W("A crocheted secretary bird neck and head on a round black plaque, to hang on a wall.", ["Orange face patch and black crest feathers"]),
  doll: { lead: "A small crocheted doll with a stitched smile, yarn hair and a crocheted dress.", details: ["Hair and dress colours differ from doll to doll", madeNbo], noun: "doll", claims: "none" },
  "dress-doll": { lead: "A tall crocheted doll with yarn hair, a matching dress and shoes, made in pink, lilac and turquoise.", details: ["Dress and shoes in matching colours", madeNbo], noun: "doll", claims: "none" },
};

export function copyFor(slug: string): ProductCopy {
  const c = productCopy[slug];
  if (!c) throw new Error(`data/copy.ts has no entry for "${slug}"`);
  return c;
}
