import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Character } from "@/components/fx/Character";
import { CartView } from "@/components/CartView";
import { CatalogueProvider } from "@/components/CatalogueContext";
import { cartCatalogue, rescueCards } from "@/lib/cartCatalogue";

export const metadata: Metadata = {
  title: "Your order list",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <Container className="py-3 md:py-5">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Order list" }]} />
      <h1 className="mb-2 mt-3 text-display-lg">Your order list</h1>
      <CatalogueProvider products={cartCatalogue()} rescue={rescueCards()}>
        <CartView emptyArt={<Character sprite="tortoise-stand" inline free live size={110} prio={4} />} />
      </CatalogueProvider>
    </Container>
  );
}
