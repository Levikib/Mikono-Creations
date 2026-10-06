export const site = {
  name: "Mikono Creations",
  tagline: "Crocheted animals, handmade in Nairobi",
  description:
    "Crocheted animals handmade in Nairobi from recycled acrylic yarn. 25+ women supported.",
  founded: 2019,
  founder: "Leah Maina",
  facebook: "https://www.facebook.com/mikonocreations",
  instagram: "https://www.instagram.com/mikonocreations",
  handle: "@mikonocreations",
} as const;

/** Official business number. Env overrides the WhatsApp digits only; display and tel always use this. */
export const PHONE_DIGITS = "254724592115";
export const PHONE_DISPLAY = "+254 724 592 115";
export const PHONE_E164 = `+${PHONE_DIGITS}`;
export const PHONE_TEL = `tel:+${PHONE_DIGITS}`;

/** The business email, shown as the client wrote it (2026-10-05). Links always use the lower case form. */
export const CONTACT_EMAIL = "Mikonocreations@gmail.com";
export const CONTACT_EMAIL_LINK = `mailto:${CONTACT_EMAIL.toLowerCase()}`;
/** Builds a mailto link to the business address with an optional subject and body. */
export const mailtoLink = (subject?: string, body?: string) => {
  const q = [subject ? `subject=${encodeURIComponent(subject)}` : "", body ? `body=${encodeURIComponent(body)}` : ""].filter(Boolean).join("&");
  return `${CONTACT_EMAIL_LINK}${q ? `?${q}` : ""}`;
};

/** Cart and SKU colour key for animals shown only in group photos (no colour selector). */
/** How long an unfinished order draft stays on the device. The wizard, /privacy and /cookies all quote this one value. */
export const DRAFT_TTL_HOURS = 24;

export const ASK_COLOUR_KEY = "ask";
/** Colour text recorded on the order line for those animals. */
export const ASK_COLOUR_LABEL = "Colour to confirm";

export const outlets = [
  { name: "Blue Rhino Shop", place: "Village Market Mall" },
  { name: "Spinners Web Shop", place: "Kitisuru" },
  { name: "Pop-up Shop", place: "Yaya Centre Mall" },
  { name: "Giraffe Centre", place: "Karen" },
  { name: "Beth International Shops", place: "JKIA" },
  { name: "Marula Green Market", place: "16 Marula Lane, Karen" },
  { name: "New Muthaiga Mall", place: "Muthaiga" },
] as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Gifts", href: "/gifts" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Our story", href: "/story" },
  { label: "Blog", href: "/journal" },
  { label: "Help", href: "/contact" },
] as const;

export const footerGroups = [
  {
    title: "Shop",
    links: [
      { label: "Home", href: "/" },
      { label: "Safari animals", href: "/shop/safari-animals" },
      { label: "Farm and pet animals", href: "/shop/domestic-animals" },
      { label: "More animals", href: "/shop/more-animals" },
      { label: "Gifts", href: "/gifts" },
      { label: "Gift finder", href: "/gifts/finder?src=footer" },
    ],
  },
  {
    title: "Make it yours",
    links: [
      { label: "Design your own animal", href: "/custom/studio?src=footer" },
      { label: "Build a safari family", href: "/build-a-family?src=footer" },
      { label: "Custom orders", href: "/custom" },
    ],
  },
  {
    title: "Work with us",
    links: [
      { label: "Wholesale", href: "/wholesale" },
      { label: "Partners", href: "/partners" },
      { label: "Supply with us", href: "/supply" },
      { label: "Stockists", href: "/stockists" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Care guide", href: "/care" },
      { label: "Size guide", href: "/size-guide" },
      { label: "Size finder", href: "/size-finder?src=footer" },
      { label: "Blog", href: "/journal" },
      { label: "FAQ", href: "/faq" },
      { label: "Delivery", href: "/delivery" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;

export const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "Returns", href: "/returns" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Your data", href: "/data-request" },
  { label: "All legal", href: "/legal" },
] as const;

/** Static routes for the sitemap that this app owns. Content routes come from lib/routes.ts. */
export const staticRoutes = ["/", "/shop", "/wholesale", "/contact", "/custom/studio", "/gifts/finder", "/size-finder", "/build-a-family"] as const;

export const categories = [
  { label: "Safari animals", href: "/shop/safari-animals" },
  { label: "Farm and pet animals", href: "/shop/domestic-animals" },
  { label: "More animals", href: "/shop/more-animals" },
] as const;

/** One constant drives the soft quote prompt in the cart and wizard (D21). Placeholder until the client confirms. */
export const QUOTE_THRESHOLD_UNITS = 20;
/** Most of one item in a single cart line. */
export const MAX_QTY_PER_LINE = 500;
/** Most lines in one order list. Guards stored lists and links; the page never shows it until it is reached. */
export const MAX_LINES = 100;
