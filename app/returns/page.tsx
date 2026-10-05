import { LegalPage } from "@/components/legal/LegalPage";
import { returnsPolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({ title: "Returns and Refunds", description: returnsPolicy.summary, path: "/returns" });

export default function Page() {
  return <LegalPage doc={returnsPolicy} />;
}
