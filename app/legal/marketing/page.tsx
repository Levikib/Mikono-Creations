import { LegalPage } from "@/components/legal/LegalPage";
import { marketingTerms } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({ title: "Marketing and Messaging Terms", description: marketingTerms.summary, path: "/legal/marketing" });

export default function Page() {
  return <LegalPage doc={marketingTerms} />;
}
