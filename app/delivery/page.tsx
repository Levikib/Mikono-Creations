import { LegalPage } from "@/components/legal/LegalPage";
import { deliveryPolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({ title: "Delivery Policy", description: deliveryPolicy.summary, path: "/delivery" });

export default function Page() {
  return <LegalPage doc={deliveryPolicy} />;
}
