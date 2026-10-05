import { LegalPage } from "@/components/legal/LegalPage";
import { customOrderTerms } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({ title: "Custom Order Terms", description: customOrderTerms.summary, path: "/terms/custom" });

export default function Page() {
  return <LegalPage doc={customOrderTerms} />;
}
