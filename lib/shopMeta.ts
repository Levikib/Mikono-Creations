import type { Metadata } from "next";
import { type Category } from "@/lib/catalogue";
import { pageMetadata } from "@/lib/pageMeta";

const animalClaimLine = "Plain crocheted animals have zero plastic and nothing detachable.";

const categoryOg: Record<string, string> = {
  safari: "product-lion", domestic: "product-rabbit", more: "product-octopus", "wall-art": "product-lion-wall-head", dolls: "product-dress-doll",
};

/** The page is static. Filtered URLs keep this canonical (the unfiltered page) and get X-Robots-Tag: noindex, follow from next.config.ts (03, D1). */
export function listingMetadata(category: Category | undefined): Metadata {
  const path = category ? `/shop/${category.slug}` : "/shop";
  return {
    ...pageMetadata({
      title: category ? `${category.label}, crocheted by hand` : "Shop crocheted animals",
      // Claims apply to plain crocheted animals only (data/copy.ts), never to dolls, wall art or animals in clothes.
      description: category
        ? category.key === "wall-art" || category.key === "dolls"
          ? `${category.blurb} Handmade in Nairobi.`
          : `${category.blurb} Handmade in Nairobi from recycled acrylic yarn. ${animalClaimLine}`
        : `Crocheted animals handmade in Nairobi from recycled acrylic yarn, plus wall art and dolls. ${animalClaimLine}`,
      path,
      og: category ? categoryOg[category.key] : undefined,
    }),
  };
}
