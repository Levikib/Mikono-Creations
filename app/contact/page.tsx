import { FxPage } from "@/components/fx/FxPage";
import { Band } from "@/components/fx/Band";
import { pageMetadata } from "@/lib/pageMeta";
import { CatalogueProvider } from "@/components/CatalogueContext";
import { cartCatalogue } from "@/lib/cartCatalogue";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ButtonLink } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { ContactForm } from "@/components/ContactForm";
import { whatsappUrl } from "@/lib/env";
import { CONTACT_EMAIL, CONTACT_EMAIL_LINK, PHONE_DISPLAY, PHONE_TEL, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Message Mikono Creations on WhatsApp, Instagram, Facebook or email.",
  path: "/contact",
});

export default function ContactPage() {
  const wa = whatsappUrl();
  return (
    <FxPage t="contact">
      <div className="bg-oat">
        <Container className="py-4 md:py-6">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          <h1 className="mt-4 text-display-lg">Contact us</h1>
          <p className="mt-4 max-w-[56ch] text-[.9375rem]">The quickest way to reach us is WhatsApp. We reply on WhatsApp.</p>
        </Container>
      </div>
      <Band t="contact" id="skyline" />
      <Container className="grid gap-5 py-4 md:py-6 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div>
          <h2 className="mb-3 text-display-md">Send us a message</h2>
          <CatalogueProvider products={cartCatalogue()}><ContactForm /></CatalogueProvider>
        </div>
        <aside aria-labelledby="ways" className="side-sticky grid gap-4 rounded-[var(--radius-panel)] bg-oat p-3 shadow-clay-sm">
          <h2 id="ways" className="text-[1.125rem]">Other ways to reach us</h2>
          {wa ? <ButtonLink href={wa} external variant="whatsapp"><Icon name="whatsapp" size={22} />Chat on WhatsApp</ButtonLink> : null}
          <ButtonLink href={PHONE_TEL} variant="ghost"><Icon name="phone" size={22} />Call {PHONE_DISPLAY}</ButtonLink>
          <ButtonLink href={site.instagram} external variant="ghost"><Icon name="instagram" size={22} />Instagram {site.handle}</ButtonLink>
          <ButtonLink href={site.facebook} external variant="ghost"><Icon name="facebook" size={22} />Facebook</ButtonLink>
          <ButtonLink href={CONTACT_EMAIL_LINK} variant="ghost">Email {CONTACT_EMAIL}</ButtonLink>
        </aside>
      </Container>
    </FxPage>
  );
}
