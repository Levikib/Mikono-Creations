import type { ProductCardData } from "@/components/ProductCard";
import { heroImage, type Product } from "@/lib/catalogue";
import { whatsappUrl } from "@/lib/env";
import { peekFor } from "@/lib/fx/species";

/** Card data for a product. When a colour is given the card shows a photo of that colour. */
export function toCard(p: Product, colourKey?: string): ProductCardData {
  const h = heroImage(p, colourKey) ?? heroImage(p);
  const n = p.colourways.length;
  return {
    href: `/shop/${p.slug}`,
    title: p.name,
    meta: p.colourAsk ? "" : n === 1 ? "1 colour" : `${n} colours`,
    sizes: p.sizes,
    peek: peekFor(p.species),
    priceKes: p.priceKes,
    askHref: whatsappUrl(`Hello Mikono, is the ${p.name.toLowerCase()} available?`),
    image: h
      ? {
          // A small source shows its own-size sand panel version, so the card never stretches or blurs it.
          src: h.image.cardSrc ?? h.image.src, alt: h.image.alt, focal: h.image.cardSrc ? [0.5, 0.5] : h.image.focal,
          fit: "cover",
          multiply: h.image.cardSrc ? false : h.image.bg === "white",
        }
      : undefined,
  };
}
