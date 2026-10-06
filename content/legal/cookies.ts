import { defineDoc } from "./types";
import { CONTACT_EMAIL } from "@/lib/site";
import { sec } from "./h";

export const cookiePolicy = defineDoc({
  slug: "cookie-policy",
  title: "Cookie and Tracking Policy",
  route: "/cookies",
  summary: "Every item this website saves on your device, why, for how long, and how to change your choice.",
  advocateNotes: [
    "[U] No standalone Kenyan cookie statute found; consent rules of the Data Protection Act 2019 s.32 and Regulations reg 4 are applied, and reg 6(1)(d) treats browsing information as personal data (per strategy/17). Confirm with the ODPC whether prior consent for analytics is expected.",
    "Keys and retention are copied from lib/storageKeys.ts (cart 30 days, saved 30, delivery 30, draft 24 hours, profile 90 days, last 10 orders). If code changes, update this document. Keys mk.cart.v2, mk.nudge.v1 and mk.outbox.v1 are planned in strategy/16 and are listed as 'if added'.",
    "Tracker rows (GA4, GTM, Meta Pixel, TikTok Pixel) must be confirmed against what is actually switched on at launch. Provider data transfer wording follows strategy/17 section 4.6.",
  ],
  sections: [
    sec("what", "What this page covers", [
      "This Site saves small items in your browser's storage on your device. Most are needed to run your order list. Items for measuring visits or ads are off until you choose to allow them. Nothing listed as saved on your device is sent to a server unless it says so.",
    ]),
    sec("essential", "Essential items", [
      "These keep the Site working and need no consent.",
    ], [
      "mk.cart.v1: your order list lines, with any note on a line. Removed 30 days after the last change.",
      "mk.cart.corrupt: a backup copy of an order list that could not be read. Removed after 7 days.",
      "mk.saved.v1: items you put aside with Save for later. Removed 30 days after the last change.",
      "mk.delivery.v1: your delivery estimate (pickup, Nairobi area or town), no street address. Removed 30 days after the last change.",
      "mk.draft.v1: a draft of the order form so you can carry on. It can include the name, phone and delivery details you typed. Removed after 24 hours, or when you finish or start again. It never holds a tax PIN or your marketing choices.",
      "mk.studio.v1 and mk.studio.sent.v1: a draft of your Custom Studio brief and the record of the brief you just sent. Removed after 24 hours or when you start again.",
      "mk.helpers.v1: your answers in the gift finder, size finder and safari family builder. They are never sent anywhere. Removed after 24 hours or when you start again.",
      "mk.orders.v1: recent order references and items, with no name, phone or address. The last 10 are kept.",
      "mk.announce.v1: remembers you closed the announcement bar.",
      "mk_consent: your cookie choice, so we do not ask again.",
    ]),
    sec("choice", "Items you choose", [
      "mk.profile.v1: your name, phone, email, delivery and business details, to speed up your next order. Saved only if you tick Remember me on this device. Removed 90 days after you last send an order with the box ticked, or when you choose Forget me on this device. Never a tax PIN.",
      "mk-animals: the Animals switch in the footer, on or off. Saved only if you change it. Removed by Clear my saved details.",
      "mk-found: which hidden animals you have found in the Find the herd game. Saved when you find one. Removed by the Reset link next to the counter, or by Clear my saved details. Never sent anywhere.",
      "mk-seen: remembers that you saw the short welcome on the home page, so it plays once. Removed by Clear my saved details.",
      "mk-density and mk-fx: your layout choice (compact or roomy), and an older version of the Animals switch that is still read but never written.",
    ]),
    sec("analytics", "Analytics and advertising", [
      "These run only if you allow them in the cookie bar. Before you choose, none of them loads and no request goes to their servers.",
    ], [
      "mk_attr: the campaign link you arrived from, if any. Only with analytics consent.",
      "Google Analytics 4 and Google Tag Manager (Google LLC): counts visits and pages. Data goes to Google, outside Kenya. Status: [ANALYTICS STATUS].",
      "Meta Pixel (Meta Platforms): measures and shows our ads. Data goes outside Kenya. Status: [META PIXEL STATUS].",
      "TikTok Pixel (TikTok): measures and shows our ads. Data goes outside Kenya. Status: [TIKTOK PIXEL STATUS].",
      "If added later: mk.cart.v2, mk.nudge.v1 (remembers you closed a reminder banner), mk.outbox.v1 (holds an order until it can be sent). Each will be listed here before it runs.",
    ], "We send these providers no names, phone numbers or email addresses."),
    sec("change", "How to change your choice", [
      "Use Cookie settings in the footer at any time. Choosing Reject non-essential is as easy as Accept all. Clear my data in the footer removes the items on this device, except the record of your cookie choice. You can also clear site data in your browser. Refusing never affects ordering.",
    ]),
    sec("consent", "Consent", [
      "Analytics, advertising and linking your visits to your customer record are three separate switches, all off by default. We record your choice and the version of this policy when you make it, and you can withdraw it as easily as you gave it.",
    ]),
    sec("more", "More information", [
      "See the Privacy Policy for how personal data is used. Contact " + CONTACT_EMAIL + " with questions.",
    ]),
  ],
});
