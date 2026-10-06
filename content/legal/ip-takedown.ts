import { defineDoc } from "./types";
import { CONTACT_EMAIL } from "@/lib/site";
import { sec } from "./h";

export const ipNotice = defineDoc({
  slug: "ip-notice",
  title: "Intellectual Property and Takedown Notice",
  route: "/legal/ip",
  summary: "Who owns the photos, designs and brand on this site, and how to ask us to remove something.",
  advocateNotes: [
    "The owner states that she has cleared all site photos, including photos of makers, customers and children (charter R1). This notice repeats that statement. The advocate should ask the owner for written releases where identifiable people, especially children, appear, because the Data Protection Act 2019 s.33 treats a child's data as needing parent or guardian consent and strategy/17 section 3 flags this. See the Photo and Content Consent template.",
    "[U] Copyright Act (Cap. 130) as amended in 2019: s.35B takedown by internet service providers [U]; copyright in photographs and artistic works (50 years after author's death for artistic works other than photos; photos 50 years from creation [U]). https://copyright.go.ke/sites/default/files/downloads/CopyrightAct12of2001.pdf",
    "[U] Trade Marks Act (Cap. 506): the Mikono Creations name and logo are unregistered unless the owner has applied at KIPI. Protection by passing off applies (Act s.5 preserves passing off). Recommend registration https://www.kipi.go.ke.",
  ],
  sections: [
    sec("ownership", "What belongs to Mikono", [
      "The Mikono Creations name and logo, the animal designs, patterns and construction methods, and the photographs, text and layout on this Site belong to Mikono Creations or are used with permission. All rights are reserved.",
    ]),
    sec("photos", "Our photographs", [
      "The owner of Mikono Creations has cleared the use of every photograph on this Site, including photographs that show makers, customers and children. If you appear in a photograph and want it removed or changed, write to us and we will act on your request promptly.",
    ]),
    sec("use", "Using our material", [
      "You may share a page or a photo for personal, non commercial use with our name credited. You may not copy designs to make and sell, or use our photographs, name or logo for your own products or advertising, without our written permission.",
    ]),
    sec("third-party", "Other people's marks", [
      "Names of other brands and characters shown or mentioned belong to their owners. We do not make licensed characters or logos without proof of licence.",
    ]),
    sec("notice", "Telling us about an infringement or asking for removal", [
      "Write to " + CONTACT_EMAIL + " with:",
    ], [
      "your name and contact details;",
      "what you say is yours or is about you, and where it appears (the page address);",
      "your reason, such as that you own it, or that it shows you or your child and you want it removed;",
      "a statement that the information is correct;",
      "your signature, typed is fine.",
    ], "We acknowledge within 2 working days and aim to decide or remove within [TAKEDOWN RESPONSE DAYS] days."),
    sec("repeat", "Repeat misuse", [
      "We may refuse service to anyone who repeatedly infringes our rights.",
    ]),
  ],
});
