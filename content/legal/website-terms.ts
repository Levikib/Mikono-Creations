import { defineDoc } from "./types";
import { sec } from "./h";

export const websiteTerms = defineDoc({
  slug: "website-terms",
  title: "Website Terms of Use",
  route: "/terms/website",
  summary: "Rules for using the Mikono Creations website: what you may do, who owns the content, and how to ask us to remove something.",
  advocateNotes: [
    "[U] Computer Misuse and Cybercrimes Act, 2018 ss.14 (unauthorised access), 16 (unauthorised interference): https://new.kenyalaw.org/akn/ke/act/2018/5/eng@2025-11-04. Scraping is not named; the no scraping rule is a contract term. Note the 2025 amendments and the court order suspending some penalties (reported, unverified).",
    "[U] Copyright Act: notice and takedown, s.35B inserted by the Copyright (Amendment) Act 2019, 48 hour period applies to internet service providers, which Mikono may not be. The takedown contact is offered as good practice.",
    "[U] Indemnity from a consumer visitor may be challenged as unconscionable (CPA s.13). Advocate to confirm the scope.",
  ],
  sections: [
    sec("use", "Using the Site", [
      "By using this Site you agree to these terms. If you do not agree, please do not use it. The Site is run by Mikono Creations (\"Mikono\", \"we\"). Orders are covered by the Terms of Sale, not by this document.",
    ]),
    sec("acceptable", "What you may and may not do", [
      "You may browse the Site, build an order list, and send us an order or enquiry. You must not:",
    ], [
      "use the Site for anything unlawful or to harm anyone;",
      "scrape, copy in bulk, or harvest content, prices or contact details by automated means;",
      "try to get into parts of the Site or our systems you are not allowed to reach, or interfere with how the Site works;",
      "send us anything that is abusive, false, harmful, infringing or that shows an identifiable child;",
      "pretend to be someone else or to be connected with us.",
    ]),
    sec("ip", "Who owns what", [
      "The photos, text, designs, patterns, logo and Mikono Creations name on the Site belong to us or are used with permission. All rights are reserved. See the Intellectual Property and Takedown Notice.",
      "We give you a limited licence to view the Site and to print or share a page for your own, non commercial use, as long as you keep our name on it. For any other use, ask us in writing first.",
    ]),
    sec("submissions", "What you send us", [
      "If you send us a message, an enquiry, a photo or a review, you keep your rights in it. You give us a licence to use it to answer you and run the business. We may use it in marketing only if you agree separately. Do not send anything you do not have the right to share.",
    ]),
    sec("links", "Links to other sites", [
      "The Site may link to other websites, such as WhatsApp, social media and our stockists. We do not control them and are not responsible for what they say or do. Their own terms and privacy policies apply.",
    ]),
    sec("availability", "Availability", [
      "We try to keep the Site running, but we do not promise it will always be available or error free. We may change or remove content at any time.",
    ]),
    sec("info", "Information on the Site", [
      "We take care that the Site is accurate. Prices, availability and delivery are confirmed on WhatsApp and the Confirmation controls. Photos show handmade items, which vary a little.",
    ]),
    sec("disclaimer", "Disclaimers and responsibility", [
      "To the extent the law allows, we provide the Site as it is and are not responsible for loss caused by using it, by a virus, or by a fault outside our control. Nothing in this document limits liability that cannot be limited by law, or any right you have as a consumer.",
    ]),
    sec("indemnity", "If you misuse the Site", [
      "If you break these terms and we suffer loss because of it, you agree to compensate us for that loss, to the extent the law allows.",
    ]),
    sec("takedown", "Reports and takedown", [
      "If you think something on the Site infringes your rights, or shows you or your child and you want it removed, write to [TAKEDOWN EMAIL]. We will reply promptly. See the Intellectual Property and Takedown Notice for what to include.",
    ]),
    sec("law", "Law and changes", [
      "These terms are governed by the laws of Kenya and the courts in Nairobi. We may update them and the version on the Site applies from its date.",
    ]),
  ],
});
