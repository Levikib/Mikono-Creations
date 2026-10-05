import { LegalPage } from "@/components/legal/LegalPage";
import { DataRequestForm } from "@/components/legal/DataRequestForm";
import { dataRequest } from "@/content/legal";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({ title: "Your data: make a request", description: dataRequest.summary, path: "/data-request" });

export default function Page() {
  return <LegalPage doc={dataRequest} hide={["form"]} after={<DataRequestForm />} extraNav={[{ id: "request-form", label: "Make a request" }]} />;
}
