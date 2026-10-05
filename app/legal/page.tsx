import Link from "next/link";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { publicDocuments } from "@/content/legal";
import { breadcrumbLd, pageMetadata } from "@/lib/pageMeta";

export const metadata = pageMetadata({
  title: "Legal documents",
  description: "Terms, privacy, cookies, returns, delivery, safety, accessibility and complaints for Mikono Creations. All documents are drafts.",
  path: "/legal",
});

export default function LegalIndex() {
  return (
    <Container className="pb-8 pt-4 md:pt-5">
      <JsonLd data={breadcrumbLd([{ name: "Legal", path: "/legal" }])} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Legal" }]} />
      <h1 className="mt-3 text-display-lg">Legal documents</h1>
      <p className="mt-1 max-w-[60ch] text-[.9375rem]">The terms and policies that apply when you shop with Mikono Creations. Each is a draft that is being reviewed by an advocate.</p>
      <ul className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {publicDocuments.map((d) => (
          <li key={d.slug} className="flex">
            <Link href={d.route ?? "/legal"} className="hit-y block w-full rounded-[var(--radius-card)] bg-oat p-3">
              <span className="font-semibold text-baobab underline-offset-4 hover:underline">{d.title}</span>
              <span className="mt-0.5 line-clamp-3 block text-[.8125rem] text-stone">{d.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
