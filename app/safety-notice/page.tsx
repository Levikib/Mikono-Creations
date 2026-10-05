import { LegalPage } from "@/components/legal/LegalPage";
import { safetyNotice } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({ title: "Product Care and Safety Notice", description: safetyNotice.summary, path: "/safety-notice" });

export default function Page() {
  return <LegalPage doc={safetyNotice} />;
}
