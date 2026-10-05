import { defineDoc } from "./types";
import { sec } from "./h";

export const marketingTerms = defineDoc({
  slug: "marketing-terms",
  title: "Marketing and Messaging Terms",
  route: "/legal/marketing",
  summary: "What you agree to if you tick a box for news, offers or reminders by WhatsApp or email, and how to stop them at any time.",
  advocateNotes: [
    "[V per strategy/17] Data Protection Act s.37 (commercial use of data needs express consent; fine up to KES 20,000 or 6 months per General Regulations reg 15(4)), regs 4, 14, 15, 17. Unticked, separate and granular boxes.",
    "[U] Kenya Information and Communications (Consumer Protection) Regulations 2010: unsolicited direct marketing by electronic means needs consent; adverts 7 am to 7 pm reported; sources https://www.ca.go.ke/sites/default/files/2023-06/Consumer-Protection-Regulations-2010-1.pdf (not fully read) and https://new.kenyalaw.org/akn/ke/act/ln/2010/54/eng@2022-12-31/source.pdf.",
    "[U] WhatsApp Business messaging policy (Meta): opt in naming the business; templates outside 24 hours. https://business.whatsapp.com/policy. Read before launch.",
    "No SMS marketing in release 1 (strategy/17 section 4.5). The SMS clause is included in case it is added; the advocate checks Communications Authority rules first.",
  ],
  sections: [
    sec("opt-in", "You choose", [
      "We send marketing only to people who ticked a separate, unticked box for it. Placing an order, asking for a quote, or messaging us does not count as agreeing to marketing. You never have to agree to marketing to buy.",
    ]),
    sec("whatsapp", "WhatsApp updates", [
      "If you tick this box, Mikono Creations may send you news and offers on WhatsApp about [MESSAGE FREQUENCY] a month, from +254 724 592 115. Each marketing message ends with Reply STOP to stop. Order messages about your own order are separate and are not marketing.",
    ]),
    sec("email", "Email newsletter", [
      "If you tick this box and confirm your email address by the link we send, we email you the Mikono newsletter [MESSAGE FREQUENCY]. Each email names us as the sender and has a one click unsubscribe link.",
    ]),
    sec("sms", "SMS", [
      "We do not send marketing by SMS at present. If that changes we will ask separately first.",
    ]),
    sec("reminders", "Occasion reminders", [
      "If you tick this box we remind you about a gift occasion you choose, using the day and month only, about 3 weeks before. We do not ask who it is for.",
    ]),
    sec("stop", "Stopping messages", [
      "Reply STOP to any WhatsApp message, click unsubscribe in any email, use the Data Request page, or contact [PRIVACY EMAIL]. We stop within 24 hours and keep your number on a list so we do not message you again. Objecting to marketing is absolute and needs no reason.",
    ]),
    sec("when", "When we send", [
      "We send marketing between 7 am and 7 pm East Africa Time and no more often than we told you.",
    ]),
    sec("records", "Our records", [
      "We record what you agreed to, when, and the wording version, so that we can show it. See the Privacy Policy.",
    ]),
  ],
});
