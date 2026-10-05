import { LegalPage } from "@/components/legal/LegalPage";
import { wholesaleTerms } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({ title: "Wholesale and Trade Terms", description: wholesaleTerms.summary, path: "/terms/wholesale" });

export default function Page() {
  return <LegalPage doc={wholesaleTerms} />;
}
