// Navigation content for the header: the desktop mega panels and the mobile accordion read the same data.
// Every href is a real route (app/ and lib/routes.ts). Journal titles and animal pages come from the content and catalogue.
import { pillars, posts } from "@/content/journal";
import { photos, type PhotoId } from "@/content/photos";
import { bySlug, heroImage } from "@/lib/catalogue";
import { whatsappUrl } from "@/lib/env";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";
import type { IconName } from "@/components/Icon";
import imageLoader from "@/lib/imageLoader";

export type MenuLink = { label: string; href: string; external?: boolean; icon?: IconName; caption?: string; thumb?: { src: string; srcSet: string; alt: string } };
export type MenuGroup = { title?: string; links: MenuLink[] };
export type MenuPhoto = { src: string; srcSet: string; alt: string; focal: [number, number] };

/** Static variant URLs resolved on the server, so the client nav carries no image loader. */
const set = (src: string, widths: number[]) => {
  const seen = new Set<string>();
  return widths.flatMap((w) => { const u = imageLoader({ src, width: w }); if (seen.has(u)) return []; seen.add(u); return [`${u} ${w}w`]; }).join(", ");
};
const photoSet = (src: string) => set(src, [320, 480, 640]);
const thumbSet = (src: string) => set(src, [160, 240]);
export type MenuPanel = {
  id: string;
  label: string;
  href: string;
  /** Route prefixes that mark this item as the current section. */
  match: string[];
  heading: string;
  blurb: string;
  overview: string;
  /** Short mono tag on the photo. */
  chip: string;
  photo: MenuPhoto;
  groups: MenuGroup[];
  /** A plain link with no panel (Home). */
  plain?: boolean;
};

const fromPhoto = (id: PhotoId): MenuPhoto => ({ src: imageLoader({ src: photos[id].src, width: 480 }), srcSet: photoSet(photos[id].src), alt: photos[id].alt, focal: photos[id].focal });

export function buildMenu(): MenuPanel[] {
  const wa = whatsappUrl();

  const lion = bySlug("lion");
  const lionHero = lion ? heroImage(lion) : null;
  const shopPhoto: MenuPhoto = lionHero
    ? { src: imageLoader({ src: lionHero.image.src, width: 480 }), srcSet: photoSet(lionHero.image.src), alt: lionHero.image.alt, focal: lionHero.image.focal }
    : fromPhoto("lionHug");

  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return [
    {
      id: "home", label: "Home", href: "/", match: [], plain: true,
      heading: "", blurb: "", overview: "Home", chip: "", photo: fromPhoto("lionHug"), groups: [],
    },
    {
      id: "shop", label: "Shop", href: "/shop", match: ["/shop", "/size-finder"],
      heading: "Soft animals, made by hand in Nairobi",
      blurb: "Every animal is crocheted by hand from recycled acrylic yarn. Pick an animal, then a colour and a size.",
      overview: "See all animals", chip: "Four sizes", photo: shopPhoto,
      groups: [{ links: [
        { label: "Safari animals", href: "/shop/safari-animals", icon: "giraffe", caption: "Giraffe, lion, elephant, zebra" },
        { label: "Domestic animals", href: "/shop/domestic-animals", icon: "rabbit", caption: "Rabbit, cat, dog" },
        { label: "More animals", href: "/shop/more-animals", icon: "yarn", caption: "Octopus, turtle, goose and more" },
        { label: "Wall art", href: "/shop/wall-art", icon: "lion", caption: "Crocheted heads to hang" },
        { label: "Dolls", href: "/shop/dolls", icon: "heart", caption: "Hand finished dresses" },
        { label: "Find the right size", href: "/size-finder?src=nav", icon: "sliders", caption: "Small to Extra large" },
        { label: "Size guide", href: "/size-guide", icon: "ruler", caption: "Small to Extra large side by side" },
      ] }],
    },
    {
      id: "gifts", label: "Gifts", href: "/gifts", match: ["/gifts", "/custom", "/build-a-family"],
      heading: "Give an animal",
      blurb: "A crocheted animal made by hand in Nairobi. Pick the animal and the size, and the order form adds the gift note.",
      overview: "See gifts", chip: "Add a gift note", photo: fromPhoto("girlBear"),
      groups: [{ links: [
        { label: "Gift finder", href: "/gifts/finder?src=nav", icon: "gift", caption: "Five questions, three picks" },
        { label: "Build a safari family", href: "/build-a-family?src=nav", icon: "people", caption: "Make a set, send it on WhatsApp" },
        { label: "Make it yours", href: "/custom/studio?src=nav", icon: "hook", caption: "Design your own animal" },
        { label: "Gift an animal", href: "/shop", icon: "heart", caption: "Pick an animal and a size" },
        { label: "Corporate and group gifts", href: "/custom/studio?type=corporate_gift&src=nav", icon: "people", caption: "Orders for many" },
        { label: "Gift note and delivery", href: "/gifts#order", icon: "truck", caption: "How the note and delivery work" },
      ] }],
    },
    {
      id: "wholesale", label: "Wholesale", href: "/wholesale", match: ["/wholesale", "/partners", "/supply"],
      heading: "For shops, lodges and groups",
      blurb: "Send one request and we reply on WhatsApp with the price list or a quote.",
      overview: "See wholesale", chip: "Reply on WhatsApp", photo: fromPhoto("longTable"),
      groups: [
        { title: "Ask us for", links: [
          { label: "Price list", href: "/wholesale?request=price-list#request", icon: "book", caption: "Sent on WhatsApp" },
          { label: "Quote", href: "/wholesale?request=quote#request", icon: "sliders", caption: "For your quantities" },
          { label: "Sample pack", href: "/wholesale?request=sample-pack#request", icon: "package", caption: "Ask on WhatsApp" },
        ] },
        { title: "Work with us", links: [
          { label: "Become a stockist", href: "/partners", icon: "store", caption: "Sell our animals" },
          { label: "Supply with us", href: "/supply", icon: "yarn", caption: "Tell us what you supply" },
        ] },
      ],
    },
    {
      id: "story", label: "Our story", href: "/story", match: ["/story", "/impact", "/makers", "/projects", "/gallery", "/stockists"],
      heading: "Mikono means hands",
      blurb: "Leah Maina founded the business in Nairobi in 2019, and it supports 25+ women.",
      overview: "Read our story", chip: "Nairobi, since 2019", photo: fromPhoto("makerCrocheting"),
      groups: [{ links: [
        { label: "Our impact", href: "/impact", icon: "heart", caption: "The women we support" },
        { label: "Meet the makers", href: "/makers", icon: "hands", caption: "At work in Nairobi" },
        { label: "Projects", href: "/projects", icon: "hook", caption: "Photo stories" },
        { label: "Gallery", href: "/gallery", icon: "camera", caption: "Markets and shelves" },
        { label: "Stockists", href: "/stockists", icon: "pin", caption: "Where to buy in Nairobi" },
      ] }],
    },
    {
      id: "blog", label: "Blog", href: "/journal", match: ["/journal"],
      heading: "Notes on animals, play and making",
      blurb: "Short, plain posts about Kenyan animals, play at home, yarn and craft, our makers and gifts.",
      overview: "All posts", chip: `${posts.length} posts`, photo: fromPhoto("handsStitching"),
      groups: [
        { title: "Latest", links: latest.map((p) => ({ label: p.title, href: `/journal/${p.slug}`, thumb: { src: imageLoader({ src: p.images[0].src, width: 160 }), srcSet: thumbSet(p.images[0].src), alt: "" }, caption: p.readTime })) },
        { title: "Topics", links: pillars.map((t) => ({ label: t.label, href: `/journal?topic=${t.id}`, icon: "book" as IconName })) },
      ],
    },
    {
      id: "help", label: "Help", href: "/contact", match: ["/faq", "/delivery", "/contact", "/privacy", "/care", "/size-guide", "/safety", "/terms", "/returns", "/cookies", "/legal"],
      heading: "Questions about an order?",
      blurb: "Answers on ordering and delivery. For anything else, message us on WhatsApp or call and a person replies.",
      overview: "Contact us", chip: "A person replies", photo: fromPhoto("lionHug"),
      groups: [
        { title: "Answers", links: [
          { label: "FAQ", href: "/faq", icon: "info", caption: "Common questions" },
          { label: "Delivery", href: "/delivery", icon: "truck", caption: "How delivery works" },
          { label: "Contact", href: "/contact", icon: "pin", caption: "Send us a message" },
          { label: "Care guide", href: "/care", icon: "sparkle", caption: "Keeping it clean" },
          { label: "Size guide", href: "/size-guide", icon: "ruler", caption: "Small to Extra large" },
        ] },
        { title: "Talk to us", links: [
          { label: "WhatsApp us", href: wa ?? "/contact", external: Boolean(wa), icon: "whatsapp", caption: "The quickest way" },
          { label: `Call ${PHONE_DISPLAY}`, href: PHONE_TEL, icon: "phone", caption: "Speak to a person" },
        ] },
      ],
    },
  ];
}
