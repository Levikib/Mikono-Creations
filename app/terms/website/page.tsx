import { LegalPage } from "@/components/legal/LegalPage";
import { websiteTerms } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({ title: "Website Terms of Use", description: websiteTerms.summary, path: "/terms/website" });

export default function Page() {
  return <LegalPage doc={websiteTerms} />;
}
