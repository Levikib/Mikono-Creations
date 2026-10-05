import { LegalPage } from "@/components/legal/LegalPage";
import { accessibilityStatement } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({ title: "Accessibility Statement", description: accessibilityStatement.summary, path: "/accessibility" });

export default function Page() {
  return <LegalPage doc={accessibilityStatement} />;
}
