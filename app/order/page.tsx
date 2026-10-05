import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/Breadcrumb";
import { OrderWizard } from "@/components/OrderWizard";
import { CatalogueProvider } from "@/components/CatalogueContext";
import { cartCatalogue } from "@/lib/cartCatalogue";

export const metadata: Metadata = {
  title: "Order form",
  robots: { index: false, follow: true },
};

export default function OrderPage() {
  return (
    <Container className="py-3 md:py-5">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Order list", href: "/cart" }, { label: "Order form" }]} />
      <h1 className="mb-2 mt-3 text-display-lg">Your order</h1>
      <CatalogueProvider products={cartCatalogue()}>
        <OrderWizard />
      </CatalogueProvider>
    </Container>
  );
}
