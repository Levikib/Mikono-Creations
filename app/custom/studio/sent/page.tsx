import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { Character } from "@/components/fx/Character";
import { Confetti } from "@/components/fx/Confetti";
import { SentView } from "@/components/studio/SentView";
import { pageMetadata } from "@/lib/pageMeta";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Your brief is ready",
    description: "Your custom animal brief is ready to send on WhatsApp. See what happens next.",
    path: "/custom/studio/sent",
  }),
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <Container className="pb-6 pt-3 md:pt-4">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Custom orders", href: "/custom" }, { label: "Design your own", href: "/custom/studio" }, { label: "Brief ready" }]} />
      <SentView celebrate={(
        <div className="relative mx-auto grid h-[150px] w-[150px] place-items-center" aria-hidden="true">
          <Character sprite="octopus" inline free live anim="celebrate" size={130} prio={5} />
          <Confetti count={14} />
        </div>
      )} />
    </Container>
  );
}
