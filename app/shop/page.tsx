import type { Metadata } from "next";
import { ShopListing } from "@/components/ShopListing";
import { listingMetadata } from "@/lib/shopMeta";

export const metadata: Metadata = listingMetadata(undefined);

export default function ShopPage() {
  return (
    <ShopListing />
  );
}
