// Journal posts. Typed objects with simple blocks, no extra dependencies.
// Rules: facts come from the client brief or from the photos, general knowledge is plain and accurate,
// no statistics, quotes or names, no safety or age claims. Each post has its own ending and its own closing prompt.
import type { PhotoId } from "../photos";

export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "photo"; id: PhotoId; caption?: string; side?: "left" | "right" }
  | { t: "note"; text: string };

export type Post = {
  slug: string;
  title: string;
  /** Up to 160 characters. */
  excerpt: string;
  tag: string;
  cover: PhotoId;
  /** Publication and last change date, ISO. Used in the article structured data. */
  date: string;
  blocks: Block[];
  /** The closing box under the post: one sentence and the first line of the WhatsApp message. Different on every post. */
  cta: { text: string; message: string };
  related: string[];
};

const DATE = "2026-10-01";

export const posts: Post[] = [
  {
    slug: "what-mikono-means",
    title: "What Mikono means",
    excerpt: "Mikono is the Swahili word for hands. A short note on the name, and on the hands you can see at work in our photos.",
    tag: "Our name",
    cover: "makerCrocheting",
    date: DATE,
    blocks: [
      { t: "p", text: "Mikono is the Swahili word for hands. One hand is mkono, so mikono is the plural: many hands. It is a fitting name for a business where every animal is crocheted by hand." },
      { t: "p", text: "Mikono Creations was founded in 2019 in Nairobi by Leah Maina. Today the business supports 25+ women through this work. Each animal in the shop is made one stitch after another, with a hook and yarn." },
      { t: "p", text: "The photo at the top of this page shows what that looks like. A woman in a yellow and black top and a kitenge skirt sits on a chair and crochets, with a finished animal waiting beside her." },
      { t: "h", text: "Hands at work in two more photos" },
      { t: "photo", id: "handsGiraffe", caption: "A hook working through yellow yarn, with giraffe pieces in front.", side: "right" },
      { t: "p", text: "In the first, a woman in a black t-shirt crochets with a hook while yellow and cream giraffe pieces fill the front of the frame. Her eyes are on the stitch. The pieces in the foreground are not yet one animal." },
      { t: "photo", id: "sewingBear", caption: "A woman on a grey sofa sewing the face of a tan bear.", side: "left" },
      { t: "p", text: "In the second, a woman with locs sits on a grey sofa with a tan crocheted bear in her lap. She is sewing its face by hand. Crochet makes the shapes, and sewing places the details that give each animal its look." },
      { t: "p", text: "Swahili is spoken across Kenya and is one of its two official languages, alongside English, so the name will be familiar to most people here." },
      { t: "h", text: "Why we use the word hands on this site" },
      { t: "p", text: "We say hands on purpose. When a page tells you a lion has a long yarn mane, a person gave it that mane. When you see a row of giraffes that look alike, each one still passed through someone's fingers." },
      { t: "p", text: "The name also keeps us honest. If we cannot show the hands behind a claim, we try not to make it. That is why some pages on this site say that a detail is still being confirmed, instead of guessing." },
      { t: "h", text: "What the name does not tell you" },
      { t: "p", text: "A name cannot say how a particular animal is made. For that, the journal has posts that follow the work: a lion getting its mane, giraffes going from loose pieces to a family, and the yarn itself. The makers page shows the women at work." },
      { t: "p", text: "So when you hold one of our animals, turn it over and look at the stitches. Each row went in under somebody's hands, and the name is simply the truth about that." },
    ],
    cta: { text: "Curious about the name or the makers? Ask us on WhatsApp.", message: "Hello Mikono Creations, I read your post about the name and would like to ask something." },
    related: ["making-a-lion-mane", "from-yarn-to-giraffe"],
  },
  {
    slug: "what-is-recycled-acrylic-yarn",
    title: "What is recycled acrylic yarn?",
    excerpt: "Plain answers on recycled acrylic yarn, what zero plastic means for our animals, and what we have not published yet.",
    tag: "Materials",
    cover: "giraffeTrio",
    date: DATE,
    blocks: [
      { t: "h", text: "What is acrylic yarn?" },
      { t: "p", text: "Acrylic is a man made fibre. It is spun into yarn and sold in balls and skeins for crochet and knitting. It is a common choice for blankets, hats and crocheted animals because it comes in many colours." },
      { t: "h", text: "What does recycled mean here?" },
      { t: "p", text: "Recycled acrylic yarn is yarn that already exists and is used again, so that new yarn does not have to be made for the same job. All our animals are crocheted from recycled acrylic yarn." },
      { t: "p", text: "We have not yet published where the yarn is collected, how it is sorted or how much we use. Until we can say so plainly, we would rather leave it out than guess." },
      { t: "photo", id: "gardenGiraffes", caption: "Yellow and cream giraffes in rows on a pale blue cloth, in the shade of a canopy.", side: "right" },
      { t: "p", text: "Each colour you see in the photos is the colour of the yarn that animal was crocheted in. The yellows, creams and browns on this table are all yarn." },
      { t: "h", text: "Questions to ask of any recycled claim" },
      { t: "p", text: "When you read recycled on a product, three questions are fair: recycled from what, by whom, and how much of the product is it? For ours, the answers we can give today are acrylic yarn, and all of the crochet. Who prepares the yarn is not published yet." },
      { t: "h", text: "What zero plastic means for our animals" },
      { t: "p", text: "Zero plastic is the statement we make about our plain crocheted animals, together with nothing detachable. Plain means no clothes, bags or other extras. We make no such statement for animals in vests or dresses, or for dolls, bags and wall heads, because we have not confirmed it for them." },
      { t: "p", text: "Acrylic is itself a synthetic fibre made from polymers, and some readers fairly ask how that fits with zero plastic. We have not published a technical definition. If the question matters for your choice, ask us and we will say what we know and what we do not." },
      { t: "h", text: "What we have not published yet" },
      { t: "ul", items: ["Where the yarn is collected from.", "What fills the animals.", "Any test results or certificates."] },
      { t: "p", text: "We do not call our animals tested, certified or suitable for any age, because we have no papers to show." },
      { t: "p", text: "A simple rule sits behind all of this. We state what the maker can stand behind, and we say so when we cannot yet." },
    ],
    cta: { text: "Need to know something about the yarn before you choose? Ask us.", message: "Hello Mikono Creations, I have a question about the yarn your animals are made from." },
    related: ["how-to-choose-a-size", "how-to-clean-a-crocheted-animal"],
  },
  {
    slug: "how-to-choose-a-size",
    title: "How to choose a size, Small to Extra large",
    excerpt: "Small, Medium, Large and Extra large are steps, not centimetres. Three ways to compare sizes by eye, using a row of lions and a visitor's hands.",
    tag: "Sizing",
    cover: "lionRowCloseup",
    date: DATE,
    blocks: [
      { t: "p", text: "Our animals come in four sizes: Small, Medium, Large and Extra large. S is the smallest of that animal and XL is the largest. Each size is one step up from the one before." },
      { t: "p", text: "A size belongs to the animal it describes. A Small giraffe is the smallest giraffe, a Small lion is the smallest lion, and the two are not the same height. We do not publish centimetre measurements yet, so here are three ways to compare by eye." },
      { t: "h", text: "1. Read the row" },
      { t: "photo", id: "ladder", caption: "Four lions in a row, largest at the left and smallest at the right.", side: "right" },
      { t: "p", text: "Four crocheted lions with brown yarn manes stand in a row against a cream wall. The one at the left is the largest and the one at the right is the smallest. Each step is easy to see without being huge, and that is the gap between neighbouring sizes." },
      { t: "p", text: "The close view at the top of this page shows the same kind of row from the side. The nearest lion fills the frame and the others shrink away behind it." },
      { t: "h", text: "2. Use a person as a scale" },
      { t: "photo", id: "manGiraffeElephant", caption: "A visitor at a stall holding a yellow giraffe and a grey elephant.", side: "left" },
      { t: "p", text: "A young man in an orange jacket holds a yellow giraffe in one hand and a grey elephant in the other, both lifted to chest height. Photos with people in them are the best guide we have." },
      { t: "p", text: "Ask yourself whether you want an animal that sits in one hand like these, or one that you hug with both arms, like the large lion on our home page." },
      { t: "h", text: "3. Think about where it will live" },
      { t: "ul", items: ["A smaller size suits a shelf, a desk or a bag.", "A larger size suits a sofa, a bed or a gift that should stand out.", "Ordering a group? Pick sizes that stand next to each other, like the lions in the row."] },
      { t: "p", text: "A quick test helps. Picture the animal beside something you know well, such as a cushion, a school bag or a child's own arms. Then decide whether you want it smaller than that, about the same, or bigger." },
      { t: "p", text: "Not sure? Tell us who the animal is for and where it will sit, or send a photo of the space, and we will suggest a size." },
      { t: "p", text: "Four sizes mean you rarely have to guess alone. Pick the step that looks right in the photos, and we will check it with you on WhatsApp before anything is sent." },
    ],
    cta: { text: "Send us the space or the child and we will suggest a size.", message: "Hello Mikono Creations, can you help me choose a size? I will describe who it is for and where it will sit." },
    related: ["the-safari-animals-we-make", "what-is-recycled-acrylic-yarn"],
  },
  {
    slug: "how-to-clean-a-crocheted-animal",
    title: "How to clean a crocheted animal gently",
    excerpt: "General tips for cleaning crocheted animals. They are common crochet care ideas, not a tested Mikono method.",
    tag: "Care",
    cover: "threeGiraffes",
    date: DATE,
    blocks: [
      { t: "note", text: "These are general tips for crocheted items. We have not published a tested wash method for our animals, and wash guidance is still being confirmed. What we say is that they are easy to clean." },
      { t: "h", text: "Start with the lightest option" },
      { t: "ol", items: [
        "Brush off dust with a soft, dry brush or the flat of your hand.",
        "Wipe a mark with a clean cloth dampened in cool water.",
        "If the mark stays, put a tiny amount of mild soap on the cloth and dab. Do not scrub.",
        "Dab again with a cloth wet with clean water to lift the soap.",
        "Let the animal dry in the air, in a shaded, airy place.",
      ] },
      { t: "photo", id: "giraffePortrait", caption: "A yellow giraffe with brown spots and a white muzzle, close up.", side: "right" },
      { t: "p", text: "The close, even stitches on this giraffe's neck are easy to dab. Light colours show marks more than dark ones, so check a cream or white animal in good light before you put it away." },
      { t: "h", text: "Manes and fringes" },
      { t: "photo", id: "lionPallet", caption: "A lion with a long brown yarn mane on a wooden pallet.", side: "left" },
      { t: "p", text: "A mane of loose yarn strands, like this lion's, catches dust the way a fringe does. Brush it gently in the direction the strands lie. Pulling hard can tangle them." },
      { t: "h", text: "What we would avoid until we know more" },
      { t: "ul", items: [
        "Soaking a whole animal, because we have not confirmed how the filling behaves when wet.",
        "Machine washing, for the same reason.",
        "Direct heat, such as a heater or a hot sun, which can change how yarn feels.",
        "Hard scrubbing, which roughs up the surface of the yarn.",
      ] },
      { t: "h", text: "Test first" },
      { t: "p", text: "On any animal, try your method on a small hidden spot first, such as under an arm or on a foot. If colour comes off onto the cloth, stop." },
      { t: "h", text: "How often, and where to keep it" },
      { t: "p", text: "Clean only when there is something to clean. Most crocheted animals need a gentle brush now and then, not a wash. Keep them somewhere dry with air around them, and not shut in a sealed bag, so that damp does not collect." },
      { t: "h", text: "When to message us" },
      { t: "p", text: "Send a photo of the mark and we will tell you what we know. If we do not know, we will say so." },
      { t: "p", text: "Care advice will grow as we confirm more. When it does, it will go on the care page first, and this post will point there." },
    ],
    cta: { text: "Got a stubborn mark? Send us a photo of it.", message: "Hello Mikono Creations, I have a mark on one of your animals. Here is a photo and what I have tried so far." },
    related: ["what-is-recycled-acrylic-yarn", "how-to-choose-a-size"],
  },
  {
    slug: "the-safari-animals-we-make",
    title: "Safari animals of Kenya, in crochet",
    excerpt: "Seven animals children may meet on safari in Kenya, a plain fact about each, and how our crocheted versions look.",
    tag: "Our animals",
    cover: "longTable",
    date: DATE,
    blocks: [
      { t: "p", text: "Kenya is known for its wildlife, and many children meet the animals first in a picture book, in a park or as a gift. Here are seven safari animals, a plain fact about each, and how our crocheted version looks." },
      { t: "h", text: "Lion" },
      { t: "p", text: "Lions live in family groups called prides. Adult males grow a mane, and the mane is what children remember. Our lions have a long, shaggy mane of brown yarn strands around a tan face with a dark nose." },
      { t: "h", text: "Giraffe" },
      { t: "p", text: "The giraffe is the tallest animal on land. Its long neck reaches leaves high in the trees, and each giraffe has its own pattern of patches. Kenya is home to more than one kind of giraffe, including the Maasai giraffe. Ours have brown spots, two small horns called ossicones and a round muzzle, in yellow, cream, tan and orange." },
      { t: "photo", id: "elephantsBamboo", caption: "Blue and grey elephants and rhinos in front of giraffes and a brown bear, under a bamboo roof.", side: "right" },
      { t: "h", text: "Elephant" },
      { t: "p", text: "Elephants are the largest animals on land. The trunk is used for smelling, drinking and picking things up, and the tusks are long teeth. Ours come in grey, caramel brown, slate blue and other colours, with white tusks." },
      { t: "h", text: "Rhino" },
      { t: "p", text: "Kenya has both black and white rhinos, and their horns are made of keratin, the same material as our fingernails. Ours are light blue or brown, with cream horns." },
      { t: "h", text: "Zebra" },
      { t: "p", text: "Every zebra has its own stripe pattern, a little like a fingerprint. Ours are crocheted in black and white stripes and stand on four legs." },
      { t: "photo", id: "zebrasBunnies", caption: "Black and white zebras with giraffes, brown rabbits and long cats on one table.", side: "left" },
      { t: "h", text: "Hippo" },
      { t: "p", text: "A hippo spends the day in water or mud to stay cool and comes out in the evening to eat grass. The name comes from Greek words meaning river horse. Our hippo is navy with ringed eyes, and in our photo it wears a magenta dress." },
      { t: "h", text: "Monkey" },
      { t: "p", text: "Monkeys use their long arms and legs to climb. Ours have long arms and legs too, with a face and ears in a second colour." },
      { t: "h", text: "Not only safari" },
      { t: "p", text: "We also crochet farm and pet animals such as rabbits, pigs, cows, dogs and ducks, and others such as octopuses, sharks and turtles. You will find them under Farm and pet animals and More animals in the shop." },
      { t: "p", text: "Here is a game for a child. Pick one animal in each photo on this page and say what it eats. A library book or a ranger at the park can check the answers." },
    ],
    cta: { text: "Looking for one animal in particular? Tell us which.", message: "Hello Mikono Creations, I read about your safari animals and would like to ask about" },
    related: ["how-to-choose-a-size", "why-colours-differ-slightly"],
  },
  {
    slug: "making-a-lion-mane",
    title: "Behind the scenes: making a lion mane",
    excerpt: "Photos from the workroom: a mane being trimmed, tan lion pieces waiting for theirs, and a finished lion in the sun.",
    tag: "How it is made",
    cover: "elephantsInMaking",
    date: DATE,
    blocks: [
      { t: "p", text: "A lion is not finished until it has its mane. These photos were taken in a workroom, not a studio, so you see work in progress as it really looks. Here is what to look for." },
      { t: "photo", id: "trimmingMane", caption: "Trimming a lion mane with scissors among heaps of animal pieces.", side: "right" },
      { t: "h", text: "The woman in the yellow hoodie" },
      { t: "p", text: "She sits on a blue and white patterned cloth with scissors in one hand and a lion in the other, trimming the strands of its mane. A tangle of brown yarn strands lies on the cloth in front of her." },
      { t: "h", text: "The heaps around her" },
      { t: "p", text: "Piles of tan lion pieces sit behind and beside her: round heads with small ears, and short legs. They have no manes yet. Yellow giraffe bodies fill the front of the picture. Many animals are in progress at the same moment, each at a different stage." },
      { t: "h", text: "The photo at the top" },
      { t: "p", text: "A woman in a white cardigan and a red skirt sits on a blue sofa with a lion on her lap. This one already has its brown mane. In front of the sofa lies a pile of dark grey elephant pieces, with some light blue ones among them." },
      { t: "h", text: "Look at the face" },
      { t: "p", text: "In a close view along a row of our lions, the nearest one shows a tan face with a dark brown nose, small round ears and a mane of brown strands that stops in a straight fringe at the chest. The strands lie down and fall in the same direction, which is what a trim gives them." },
      { t: "h", text: "What a finished lion looks like" },
      { t: "photo", id: "lionPallet", caption: "A finished lion standing on a wooden pallet in the sun.", side: "left" },
      { t: "p", text: "This lion stands on a wooden pallet outdoors. The mane is a thick fringe of brown yarn strands that falls over the chest and shoulders, and the strands are cut to a similar length. The body is tan, with a dark nose and small dark eyes." },
      { t: "p", text: "How long a mane takes and how many steps go into it are not confirmed yet, so we only describe what the photos show." },
      { t: "p", text: "If you remember one thing from these pictures, make it the strands. Every one on a lion's mane is a piece of yarn, and the mane around the face is what makes a lion a lion." },
    ],
    cta: { text: "Want a lion in a size that suits your shelf or sofa? Ask us.", message: "Hello Mikono Creations, I would like to ask about your lions." },
    related: ["from-yarn-to-giraffe", "what-mikono-means"],
  },
  {
    slug: "from-yarn-to-giraffe",
    title: "From yarn to giraffe",
    excerpt: "Giraffes are made in parts. Three photos follow the work: pieces on a table, a nearly finished giraffe and a herd on a teal blanket.",
    tag: "How it is made",
    cover: "giraffesSofa",
    date: DATE,
    blocks: [
      { t: "p", text: "Giraffes are made in parts. Long yellow bodies, round white muzzles and small brown horns are each crocheted on their own. The photos here follow giraffes from loose pieces to a finished group." },
      { t: "p", text: "Working in parts is common for animals with long necks and legs, because each part can be shaped on its own before the animal is put together. In these photos you can see pieces at each point along the way." },
      { t: "h", text: "Stage one: pieces on a table" },
      { t: "photo", id: "workroomPieces", caption: "A break in the workroom, with giraffe pieces and scissors on the table.", side: "right" },
      { t: "p", text: "A woman in a red hat and a navy hoodie sits on a blue chair and looks at her phone. Beside her, a wooden table is heaped with yellow and cream giraffe bodies, brown horns showing, with a pair of scissors among them. Breaks are part of the work, and this photo shows one." },
      { t: "h", text: "Stage two: a giraffe being finished" },
      { t: "photo", id: "finishingGiraffe", caption: "A maker holding a nearly finished giraffe, with orange yarn in a box beside her.", side: "left" },
      { t: "p", text: "A woman in a striped top and a headscarf sits on a sofa and holds a yellow giraffe that is nearly done, with its spots and horns already on. At her side, a cardboard box holds orange yarn. A giraffe's spots are round brown patches, and on this one they sit evenly over the body." },
      { t: "h", text: "Stage three: the herd" },
      { t: "photo", id: "giraffeFamily", caption: "A family of giraffes on a teal blanket.", side: "right" },
      { t: "p", text: "A woman in a striped yellow dress sits behind about fifteen giraffes on a teal blanket. They are yellow and cream, in different heights, with brown spots and muzzles. This is where the pieces end up." },
      { t: "p", text: "The photo at the top shows another group. A woman in a blue patterned dress sits on a sofa beside a crowd of giraffes on the same kind of blanket, and holds one in her hand." },
      { t: "p", text: "Look at the faces. Each giraffe has a round white or cream muzzle, two brown horns and brown spots, and those marks repeat from one animal to the next. That repetition is why a crowd of them reads as a family." },
      { t: "h", text: "Sizes and shades" },
      { t: "p", text: "In both groups the giraffes stand at more than one height and are not all the same yellow. That is what hand crocheted animals look like side by side." },
      { t: "p", text: "Put the three stages next to each other and you have the whole story: heaps of parts, one animal in a pair of hands, and a family on a blanket." },
    ],
    cta: { text: "Want giraffes for a shop, a lodge or a gift? Tell us which colours.", message: "Hello Mikono Creations, I would like to ask about your giraffes." },
    related: ["making-a-lion-mane", "the-safari-animals-we-make"],
  },
  {
    slug: "how-ordering-on-whatsapp-works",
    title: "How ordering on WhatsApp works",
    excerpt: "No account and no card form. Choose your animals, fill in a short form, send the message, and a person replies on WhatsApp.",
    tag: "Ordering",
    cover: "canopyStall",
    date: DATE,
    blocks: [
      { t: "p", text: "You do not pay on this website and you do not need an account. You build an order list, the site writes it out as a WhatsApp message, and a person at Mikono replies to you." },
      { t: "h", text: "Step by step" },
      { t: "ol", items: [
        "Open an animal, choose a colour and a size, and press Add to order list. A small message confirms it.",
        "Open your order list. Change quantities or remove a line.",
        "Continue to the order form. It asks who is ordering, your name and WhatsApp number, delivery or pickup, and a gift note if you want one.",
        "Review the order. WhatsApp opens with the whole order written out. You press send.",
        "We reply on WhatsApp to confirm availability, prices and delivery, and to arrange payment with you.",
      ] },
      { t: "h", text: "What the message contains" },
      { t: "photo", id: "stallMaker", caption: "A maker behind a market table of grey and blue elephants, rhinos and orange giraffes.", side: "right" },
      { t: "p", text: "The message starts with an order reference, for example MK, then the date, then four letters or numbers, so that you and we can find the order again. After it come the items, each with its colour, size and a short code, then your contact details, delivery, any gift note and anything you wrote about payment." },
      { t: "h", text: "After you press send" },
      { t: "p", text: "The message is a request, not a confirmed order, until we reply and you agree. Prices, availability and delivery are settled with you in the chat before anyone pays or anything is sent." },
      { t: "h", text: "Good to know" },
      { t: "ul", items: [
        "Animals show a price by size: Small KES 1,500, Medium KES 2,000, Large KES 3,500 and Extra large KES 5,000. The same prices apply to dolls. Wall art is one size, larger than Extra large, at KES 8,000. Delivery is not included and is confirmed on WhatsApp.",
        "Some animals are shown only in group photos. For those, the colour is confirmed with you on WhatsApp.",
        "Your order list stays on your device while you decide. An unfinished order form is kept for 24 hours and then removed.",
        "If WhatsApp does not open, the form gives you the message to copy and paste.",
        "Type your number the way you usually do, for example 0712 345 678 or +254 712 345 678. The form tidies it for the message.",
        "The details step has an optional box for anything we should know about payment.",
      ] },
      { t: "p", text: "Ordering for a shop, lodge, school or organisation? Use the wholesale page instead. It has its own short form." },
      { t: "p", text: "That is the whole process. If a step ever feels unclear, tell us which one on WhatsApp and we will fix the words." },
    ],
    cta: { text: "Stuck on a step? Tell us which one.", message: "Hello Mikono Creations, I need help with the order form." },
    related: ["why-wholesale", "how-to-choose-a-size"],
  },
  {
    slug: "why-wholesale",
    title: "Why wholesale",
    excerpt: "Much of what we sell goes to shops, lodges and organisations. Who asks, what to put in a request, and where our animals already sit on shelves.",
    tag: "Trade",
    cover: "elephantsRhinosRows",
    date: DATE,
    blocks: [
      { t: "p", text: "Much of what we sell goes to retailers, lodges, gift shops and organisations. That is why the wholesale page sits in the main menu, next to Shop." },
      { t: "h", text: "Who sends a request" },
      { t: "ul", items: ["Gift shops and other retailers.", "Lodges.", "Schools, charities and other organisations."] },
      { t: "photo", id: "shelfReady", caption: "On a gift shop shelf, with hang tags.", side: "right" },
      { t: "p", text: "If you run a shop, a short note on where you are and what you already sell helps us suggest animals that fit your shelf." },
      { t: "h", text: "What to put in your request" },
      { t: "p", text: "The wholesale form asks for a request type: a price list, a quote or a reorder. Tell us a little about your business, the animals and sizes you have in mind, roughly how many, and when you would need them. The more you say, the less we have to ask back." },
      { t: "p", text: "A reorder request is for shops that already stock our animals. If you have not ordered before, a price list or a quote is the place to start. A school or a charity can use the same form: say what the animals are for." },
      { t: "p", text: "A person replies on WhatsApp with the price list or the quote. We do not show wholesale prices on the website." },
      { t: "h", text: "Where our animals already sit on shelves" },
      { t: "p", text: "Seven outlets in and around Nairobi stock them: Blue Rhino Shop at Village Market Mall, Spinners Web Shop in Kitisuru, a Pop-up Shop at Yaya Centre Mall, the Giraffe Centre in Karen, Beth International Shops at JKIA, Marula Green Market on Marula Lane in Karen and New Muthaiga Mall. The stockists page lists them all." },
      { t: "p", text: "The outlets are different kinds of places, from a mall to a wildlife centre to a green market. Our animals have been placed on shelves, on tables and at stalls, and the photos below show some of that." },
      { t: "photo", id: "tableLionsGiraffes", caption: "A market table with lions, giraffes, grey elephants and four long cats at the front.", side: "left" },
      { t: "h", text: "What the photos tell a buyer" },
      { t: "p", text: "In the gift shop photo, yellow giraffes, tan lions, grey elephants and light blue rhinos sit in groups on a shelf, each with a hang tag. In the market table photo, giraffes stand in a block, elephants in a line and lions together, with four long cats in orange, mint, blue and pink at the front." },
      { t: "p", text: "Both are grouped by kind, which makes a table easy to read at a glance. If you are planning a display, that is a good place to start." },
      { t: "p", text: "You can also reach the same number by phone or WhatsApp from the contact page." },
      { t: "p", text: "Not sure whether wholesale or retail fits? Start with whichever form feels closer, and a person will point you to the other one if needed." },
    ],
    cta: { text: "Ready to ask for a price list or a quote? Start on the wholesale page.", message: "Hello Mikono Creations, I would like a price list for my shop or organisation." },
    related: ["how-ordering-on-whatsapp-works", "the-safari-animals-we-make"],
  },
  {
    slug: "why-colours-differ-slightly",
    title: "Why colours can differ between animals",
    excerpt: "Look at a row of our giraffes and the yellows are not all the same. Why handmade colour varies, and how to ask for the one you want.",
    tag: "Colour",
    cover: "giraffeShades",
    date: DATE,
    blocks: [
      { t: "p", text: "Look closely at a group of our giraffes. The yellows are close but not identical, and the cream ones are not all the same cream." },
      { t: "photo", id: "giraffeHerd", caption: "Yellow and white giraffes with brown spots on a teal blanket.", side: "right" },
      { t: "h", text: "What the photos show" },
      { t: "ul", items: [
        "In the herd, yellow and white giraffes with brown spots, muzzles and horns stand close together.",
        "In the workroom, three giraffes in a deep golden yellow, a lemon yellow and a cream stand in three heights.",
        "On a market table, four long cats lie in orange, mint, blue and pink, each in one bold colour.",
      ] },
      { t: "photo", id: "giraffeTrio", caption: "Three giraffes in deep yellow, lemon yellow and cream.", side: "left" },
      { t: "h", text: "Why colours can differ" },
      { t: "p", text: "Anything made by hand from yarn varies a little. Different balls of yarn can be slightly lighter or darker, and every animal is crocheted on its own. Photos add their own differences: daylight, shade and a phone camera all change a yellow." },
      { t: "p", text: "Screens change colour too, so a shade on your phone may not match the animal exactly." },
      { t: "h", text: "One animal, several colours" },
      { t: "p", text: "Each animal page shows a photo for every colour it comes in. The elephant, for example, has grey, caramel brown, slate blue, lavender and dusty purple. Some pairs look alike on a small screen, such as grey and dusty purple, and a message to us settles it quickly." },
      { t: "h", text: "Colour is not only the body" },
      { t: "p", text: "Look for the second colour. Our cats have a coloured ear tip and some carry a small bag. Our monkeys have a face and ears in a second colour, and the hippo in our photos wears a dress with a multicoloured hem. Mention these details when you ask, so that we can answer about the whole animal." },
      { t: "h", text: "How to ask for the colour you want" },
      { t: "ol", items: [
        "Use the colour filter in the shop. It groups colours into families such as yellow, grey and brown.",
        "Open the animal and look at the photo for each colour it comes in.",
        "If an exact shade matters, say so in the order form notes, or message us before you order.",
      ] },
      { t: "p", text: "Some animals, such as the cats, sharks and monkeys, are shown only in group photos. For those, the colour is confirmed with you on WhatsApp, and the order list says colour to confirm." },
      { t: "p", text: "A row of slightly different yellows is nothing we are hiding. It is what hand crocheted animals look like when you put them side by side." },
    ],
    cta: { text: "Have a shade in mind? Describe it and we will tell you what we have.", message: "Hello Mikono Creations, I am looking for a particular colour and would like to ask what you have." },
    related: ["the-safari-animals-we-make", "how-to-choose-a-size"],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);

const blockText = (b: Block): string => (b.t === "p" || b.t === "h" || b.t === "note" ? b.text : b.t === "ul" || b.t === "ol" ? b.items.join(" ") : b.t === "photo" ? b.caption ?? "" : "");

/** Words in the post body, without captions. */
export function wordCount(post: Post): number {
  return post.blocks.filter((b) => b.t !== "photo").map(blockText).join(" ").split(/\s+/).filter(Boolean).length;
}

/** Read time from whole words. */
export function readMinutes(post: Post): number {
  return Math.max(1, Math.round(wordCount(post) / 200));
}
