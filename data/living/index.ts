// Typed access to the choreography files. Server code only (the pages and components/fx/Band read this; the browser gets markup).
import cart from "./cart.json";
import contact from "./contact.json";
import custom from "./custom.json";
import footer from "./footer.json";
import game from "./game.json";
import gifts from "./gifts.json";
import home from "./home.json";
import journal from "./journal.json";
import makers from "./makers.json";
import notFound from "./not-found.json";
import post from "./post.json";
import product from "./product.json";
import sent from "./sent.json";
import shop from "./shop.json";
import sizeGuide from "./size-guide.json";
import stockists from "./stockists.json";
import story from "./story.json";
import wholesale from "./wholesale.json";
import type { GameDef, PageDef } from "./types";

export type Template =
  | "home" | "shop" | "product" | "journal" | "post" | "story" | "makers" | "gifts" | "stockists" | "wholesale"
  | "contact" | "custom" | "size-guide" | "cart" | "sent" | "not-found" | "footer";

const pages = {
  home, shop, product, journal, post, story, makers, gifts, stockists, wholesale, contact, custom,
  "size-guide": sizeGuide, cart, sent, "not-found": notFound, footer,
} as unknown as Record<Template, PageDef>;

export const living = (t: Template): PageDef => pages[t];
export const gameDef = game as unknown as GameDef;
export type { BandDef, Resident, PageDef, Habitat, Role } from "./types";
