"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { CartProduct, RescueCard } from "@/lib/cartCatalogue";
import type { CartLine } from "@/lib/cart";
import { ASK_COLOUR_KEY } from "@/lib/site";

interface Cat {
  products: CartProduct[];
  rescue: RescueCard[];
  bySlug: (slug: string) => CartProduct | undefined;
  priceBySlug: Record<string, number | null>;
  /** The catalogue entry for a line, or null when the animal, colour or size no longer exists. */
  resolve: (l: Pick<CartLine, "slug" | "colourKey" | "size">) => { product: CartProduct; colour: CartProduct["colours"][number] } | null;
}
const Ctx = createContext<Cat | null>(null);

/** Hands the server built catalogue to the client parts of /cart and /order. */
export function CatalogueProvider({ products, rescue = [], children }: { products: CartProduct[]; rescue?: RescueCard[]; children: ReactNode }) {
  const value = useMemo<Cat>(() => {
    const map = new Map(products.map((p) => [p.slug, p]));
    return {
      products, rescue,
      bySlug: (s) => map.get(s),
      priceBySlug: Object.fromEntries(products.map((p) => [p.slug, p.priceKes])),
      resolve: (l) => {
        const product = map.get(l.slug);
        const colour = l.colourKey === ASK_COLOUR_KEY ? (product?.colourAsk ? product.colours[0] : undefined) : product?.colours.find((c) => c.key === l.colourKey);
        return product && colour && product.sizes.includes(l.size) ? { product, colour } : null;
      },
    };
  }, [products, rescue]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalogue(): Cat {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCatalogue must be used inside CatalogueProvider");
  return c;
}

