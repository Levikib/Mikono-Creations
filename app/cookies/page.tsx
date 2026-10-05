import { LegalPage } from "@/components/legal/LegalPage";
import { CookieTable, cookieExtraNav } from "@/components/legal/DeviceStorage";
import { cookiePolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({ title: "Cookies and storage", description: cookiePolicy.summary, path: "/cookies" });

export default function Page() {
  return <LegalPage doc={cookiePolicy} after={<CookieTable />} extraNav={cookieExtraNav} />;
}
