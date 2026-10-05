import { LegalPage } from "@/components/legal/LegalPage";
import { ipNotice } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({ title: "Intellectual Property and Takedown", description: ipNotice.summary, path: "/legal/ip" });

export default function Page() {
  return <LegalPage doc={ipNotice} />;
}
