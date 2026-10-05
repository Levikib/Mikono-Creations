"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { env } from "@/lib/env";
import {
  CONSENT_EVENT, dropQueuedEvents, markAnalyticsReady, pushConsentDefaults, readConsent, type Consent,
} from "@/lib/track";

type Fn = (...args: unknown[]) => void;
type W = Window & { fbq?: Fn; ttq?: Record<string, Fn> & { page?: Fn }; dataLayer?: unknown[] };

// Ids come from env. Anything that is not a plain id is ignored, so a typo can never inject script text.
const clean = (id: string) => (/^[A-Za-z0-9_-]{3,40}$/.test(id) ? id : "");
const GTM = clean(env.gtmId);
const GA4 = GTM ? "" : clean(env.ga4Id);
const META = GTM ? "" : clean(env.metaPixelId);
const TIKTOK = GTM ? "" : clean(env.tiktokPixelId);

const gtmSnippet = (id: string) =>
  `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(id)});`;

const ga4Snippet = (id: string) =>
  `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(id)});`;

const metaSnippet = (id: string) =>
  `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(id)});fbq('track','PageView');`;

const tiktokSnippet = (id: string) =>
  `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=r+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load(${JSON.stringify(id)});ttq.page();}(window,document,'ttq');`;

/**
 * Consent gated tag loader. Nothing loads until the visitor accepts. Consent Mode v2 defaults
 * (all denied) are pushed before any tag, and the update is pushed by the consent bar on Accept.
 * GTM is used when its id is set. Otherwise GA4, Meta Pixel and TikTok Pixel load directly.
 * With no ids set this component renders nothing.
 */
export function Analytics() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const path = usePathname();
  const metaPath = useRef<string | null>(null);
  const ttqPath = useRef<string | null>(null);
  const anyId = Boolean(GTM || GA4 || META || TIKTOK);

  useEffect(() => {
    if (!anyId) return;
    pushConsentDefaults();
    // Reading storage after mount: the stored choice only exists in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(readConsent());
    const on = (e: Event) => {
      const c = (e as CustomEvent<Consent>).detail;
      setConsent(c);
      if (!c.analytics && !c.marketing) {
        dropQueuedEvents();
        const w = window as W;
        w.fbq?.("consent", "revoke");
        (w.ttq as unknown as { revokeConsent?: Fn } | undefined)?.revokeConsent?.();
      }
    };
    window.addEventListener(CONSENT_EVENT, on);
    return () => window.removeEventListener(CONSENT_EVENT, on);
  }, [anyId]);

  const analyticsOn = Boolean(consent?.analytics);
  const marketingOn = Boolean(consent?.marketing);
  const loadGtm = Boolean(GTM) && (analyticsOn || marketingOn); // Consent Mode inside GTM gates each tag
  const loadGa4 = Boolean(GA4) && analyticsOn;
  const loadMeta = Boolean(META) && marketingOn;
  const loadTiktok = Boolean(TIKTOK) && marketingOn;
  const anyLoading = loadGtm || loadGa4 || loadMeta || loadTiktok;

  // Tell lib/track.ts when the tags can receive events, then flush what was queued.
  useEffect(() => {
    if (!anyLoading) return;
    let tries = 0;
    const t = setInterval(() => {
      const w = window as W;
      const stubsReady = (!loadMeta || typeof w.fbq === "function") && (!loadTiktok || Boolean(w.ttq));
      tries += 1;
      if (stubsReady) { clearInterval(t); markAnalyticsReady(); }
      else if (tries > 50) { clearInterval(t); dropQueuedEvents(); }
    }, 100);
    return () => clearInterval(t);
  }, [anyLoading, loadMeta, loadTiktok]);

  // Single page app route changes: the pixels do not see them on their own. The init snippets already
  // send one PageView for the path they load on, so each pixel remembers that path and only later
  // paths fire here. Keyed on path per pixel, so strict mode double effects and late loads never repeat it.
  useEffect(() => {
    const w = window as W;
    if (loadMeta) {
      if (metaPath.current === null) metaPath.current = path;
      else if (metaPath.current !== path) { metaPath.current = path; w.fbq?.("track", "PageView"); }
    }
    if (loadTiktok) {
      if (ttqPath.current === null) ttqPath.current = path;
      else if (ttqPath.current !== path) { ttqPath.current = path; w.ttq?.page?.(); }
    }
  }, [path, loadMeta, loadTiktok]);

  if (!anyId) return null;
  return (
    <>
      {loadGtm ? <Script id="mk-gtm" strategy="afterInteractive">{gtmSnippet(GTM)}</Script> : null}
      {loadGa4 ? (
        <>
          <Script id="mk-ga4-lib" src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`} strategy="afterInteractive" />
          <Script id="mk-ga4" strategy="afterInteractive">{ga4Snippet(GA4)}</Script>
        </>
      ) : null}
      {loadMeta ? <Script id="mk-meta" strategy="afterInteractive">{metaSnippet(META)}</Script> : null}
      {loadTiktok ? <Script id="mk-tiktok" strategy="afterInteractive">{tiktokSnippet(TIKTOK)}</Script> : null}
    </>
  );
}
