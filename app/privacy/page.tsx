import { LegalPage } from "@/components/legal/LegalPage";
import { PrivacyDevice, privacyExtraNav } from "@/components/legal/DeviceStorage";
import { privacyPolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({ title: "Privacy Policy", description: privacyPolicy.summary, path: "/privacy" });

export default function Page() {
  return <LegalPage doc={privacyPolicy} after={<PrivacyDevice />} extraNav={privacyExtraNav} />;
}
