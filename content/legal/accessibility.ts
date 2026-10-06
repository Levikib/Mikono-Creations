import { defineDoc } from "./types";
import { CONTACT_EMAIL } from "@/lib/site";
import { sec } from "./h";

export const accessibilityStatement = defineDoc({
  slug: "accessibility-statement",
  title: "Accessibility Statement",
  route: "/accessibility",
  summary: "Our commitment to a website that works for everyone, what we have done, what we know is not perfect, and how to tell us.",
  advocateNotes: [
    "[U] Persons with Disabilities Act, 2025 / earlier Persons with Disabilities Act 2003 and the Constitution art. 54 on access to information. No specific Kenyan web accessibility regulation was verified. The statement aims at WCAG 2.2 AA as a goal, not a claim of conformity. Do not state conformity unless the audit is done.",
  ],
  sections: [
    sec("commitment", "Our commitment", [
      "We want everyone to be able to browse and order from Mikono Creations. We aim for the Web Content Accessibility Guidelines (WCAG) 2.2 level AA. This is our aim and not a claim that every page already meets it.",
    ]),
    sec("done", "What we have done", [
      "We design for keyboard use, visible focus, readable text, clear labels on forms, text descriptions for images, large touch targets, good colour contrast, and reduced motion for people who ask their device for it. The site works at small screen widths and when text is enlarged.",
    ]),
    sec("known", "Known gaps", [
      "Some parts may fall short, for example descriptions on some photos and some third party content. Our last check was on [ACCESSIBILITY AUDIT DATE]. Known issues: [KNOWN ACCESSIBILITY ISSUES].",
    ]),
    sec("other-ways", "Other ways to order", [
      "If the site is hard for you to use, you can order or ask anything by WhatsApp or phone on +254 724 592 115, and we will help you in plain words.",
    ]),
    sec("feedback", "Tell us", [
      "If you find a barrier, tell us at " + CONTACT_EMAIL + " or on WhatsApp. We reply within 5 working days and will say what we can do and by when.",
    ]),
  ],
});
