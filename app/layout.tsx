import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./nav.css";
import "./cards.css";
import "./layout-fixes.css";
import "@/components/fx/fx.css";
import { display, sans, mono } from "@/lib/fonts";
import { CONTACT_EMAIL, PHONE_E164, site } from "@/lib/site";
import { missingEnv, siteBaseUrl, whatsappUrl } from "@/lib/env";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ConsentBar, ConsentSkipLink } from "@/components/ConsentBar";
import { ToastRegion } from "@/components/Toast";
import { CartProvider } from "@/lib/cart";
import { IconSprite } from "@/components/IconSprite";
import { Deferred } from "@/components/Deferred";
import { JsonLd } from "@/components/JsonLd";
import { SPLASH_CSS, SPLASH_HTML } from "@/lib/splashAssets";

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl()),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    siteName: site.name,
    locale: "en_KE",
    type: "website",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    url: "/",
    images: [{ url: "/og/default.jpg", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }],
  },
  twitter: { card: "summary_large_image", title: `${site.name} | ${site.tagline}`, description: site.description, images: [{ url: "/og/default.jpg", alt: `${site.name}: ${site.tagline}` }] },
};

export const viewport: Viewport = { themeColor: "#F3EEE5", width: "device-width", initialScale: 1, viewportFit: "cover" };

if (process.env.NODE_ENV !== "test") {
  const missing = missingEnv();
  if (missing.length) console.warn(`[env] optional variables not set: ${missing.join(", ")}`);
}

const organizationLd = () => ({
  "@context": "https://schema.org", "@type": "Organization", name: site.name, url: siteBaseUrl(),
  logo: `${siteBaseUrl()}/logo.png`, telephone: PHONE_E164, email: CONTACT_EMAIL.toLowerCase(), description: site.description,
  foundingDate: String(site.founded), founder: { "@type": "Person", name: site.founder },
  sameAs: [site.facebook, site.instagram],
  contactPoint: [{ "@type": "ContactPoint", telephone: PHONE_E164, email: CONTACT_EMAIL.toLowerCase(), contactType: "customer service", areaServed: "KE", availableLanguage: ["en", "sw"] }],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Critical CSS for the intro: inline, so the overlay is painted with the very first frame. The CSP already allows inline styles; no inline script is added. */}
        <style dangerouslySetInnerHTML={{ __html: SPLASH_CSS }} />
        {/* Sets html[data-splash] before first paint (reduced motion and bots skip), wires Skip and Escape, and reports "done". Same origin, no inline script. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- must run before first paint */}
        <script src="/splash-gate.js" />
      </head>
      <body>
        <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: SPLASH_HTML }} />
        <div id="shell" className="contents" suppressHydrationWarning>
        <noscript><style>{".kinetic .w{opacity:1;translate:none;rotate:none}.nav-main li:hover .nav-panel,.nav-main li:focus-within .nav-panel{visibility:visible;opacity:1;transform:none;pointer-events:auto}"}</style></noscript>
        <IconSprite />
        <ConsentSkipLink />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-baobab focus:px-5 focus:py-3 focus:text-bone">
          Skip to content
        </a>
        {/* The bar is early in the DOM so keyboard users reach it within three Tab presses. It is fixed to the bottom of the screen. */}
        <ConsentBar />
        <CartProvider>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <Deferred />
        </CartProvider>
        <aside aria-label="Chat on WhatsApp"><WhatsAppButton href={whatsappUrl() ?? "/contact"} /></aside>
        <ToastRegion />
        <JsonLd data={organizationLd()} />
        </div>
      </body>
    </html>
  );
}
