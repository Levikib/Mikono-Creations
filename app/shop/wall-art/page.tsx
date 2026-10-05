import type { Metadata } from "next";
import { ShopListing } from "@/components/ShopListing";
import { categoryByKey } from "@/lib/catalogue";
import { listingMetadata } from "@/lib/shopMeta";

const category = categoryByKey("wall-art");

export const metadata: Metadata = listingMetadata(category);

export default function CategoryPage() {
  return <ShopListing category={category} />;
}
