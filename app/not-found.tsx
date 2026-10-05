import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { EmptyState } from "@/components/EmptyState";
import { Band } from "@/components/fx/Band";
import { ButtonLink } from "@/components/Button";

const quiet = "inline-flex min-h-11 items-center font-semibold text-terracotta-deep underline underline-offset-4";

export default function NotFound() {
  return (
    <Container className="py-12 md:py-16">
      <EmptyState level={1} art={<div className="w-full"><Band t="not-found" id="lost" live nested /></div>} title="This animal wandered off" text="The page you wanted is not here. The link may be old or mistyped."
        action={(
          <div className="flex flex-col items-center gap-1">
            <ButtonLink href="/shop" size="large" data-track="404_shop">See the animals</ButtonLink>
            <div className="mt-2 flex flex-wrap justify-center gap-x-5">
              <Link href="/" className={quiet}>Back to home</Link>
              <Link prefetch={false} href="/gifts/finder?src=404" data-track="404_gift_finder" className={quiet}>Gift finder</Link>
              <Link prefetch={false} href="/custom/studio?src=404" data-track="404_studio" className={quiet}>Design your own animal</Link>
              <Link href="/contact" className={quiet}>Message us</Link>
            </div>
          </div>
        )} />
    </Container>
  );
}

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };
