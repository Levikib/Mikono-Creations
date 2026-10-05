import { LegalPage } from "@/components/legal/LegalPage";
import { termsOfSale } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({ title: "Terms of Sale", description: termsOfSale.summary, path: "/terms" });

export default function Page() {
  return <LegalPage doc={termsOfSale} />;
}
