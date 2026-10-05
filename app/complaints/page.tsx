import { LegalPage } from "@/components/legal/LegalPage";
import { complaintsProcedure } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({ title: "Complaints and Disputes", description: complaintsProcedure.summary, path: "/complaints" });

export default function Page() {
  return <LegalPage doc={complaintsProcedure} />;
}
