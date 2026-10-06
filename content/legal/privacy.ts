import { defineDoc } from "./types";
import { CONTACT_EMAIL } from "@/lib/site";
import { sec } from "./h";

export const privacyPolicy = defineDoc({
  slug: "privacy-policy",
  title: "Privacy Policy",
  route: "/privacy",
  acceptedAt: ["checkout", "custom", "wholesale"],
  summary: "What personal data Mikono Creations collects, why, who sees it, how long we keep it, and how you can see, correct, delete or move it. Marketing, analytics and ads stay off unless you say yes.",
  advocateNotes: [
    "Replaces the draft /privacy page. The draft said nothing is kept on a server. That is false once a database or WhatsApp record is used, so this version says so. Consistent with strategy/17-data-protection-plan.md.",
    "[V per strategy/17] Data Protection Act, 2019: s.18 registration (offence s.19(7)), s.25 principles, s.26 and s.29 notice, s.30 lawful bases, s.32 consent, s.33 children, s.37 commercial use, s.40 rectify and erase, s.43 breach, ss.48 and 49 transfers; General Regulations 2021 regs 4, 9, 12, 14, 15, 19, 23, 24, 37, 38, 40 to 48. Sources: https://www.kentrade.go.ke/wp-content/uploads/2022/09/Data-Protection-Act-1.pdf and https://www.odpc.go.ke/wp-content/uploads/2024/03/THE-DATA-PROTECTION-GENERAL-REGULATIONS-2021-1.pdf. Not re-read in this pass.",
    "[U] Response times (access 7 days, erase and rectify 14 days, object 14 days, portability 30 days) are taken from strategy/17 and the Regulations; confirm.",
    "[U] Retention of order records for 5 years (tax records) and the consent ledger period. Confirm with the advocate and the accountant.",
    "[U] Whether the ODPC expects prior consent for analytics cookies. Whether Vercel's DPA and Data Privacy Framework are adequate safeguards for transfers (s.48). Whether Mikono must register now.",
    "[U] The ODPC complaint route: https://www.odpc.go.ke, complaints@odpc.go.ke is not verified.",
    "Owner questions: legal entity, registration number, ODPC certificate number, turnover and headcount, Privacy Contact, courier, who may see customer data.",
  ],
  sections: [
    sec("who", "Who we are", [
      "Mikono Creations is a business in Kenya, run by women across the country. We do not have a physical shop. We work online and by WhatsApp. Mikono Creations is the data controller for the personal data described here (\"Mikono\", \"we\"). Our registration with the Office of the Data Protection Commissioner is number [ODPC REGISTRATION NUMBER].",
      "Our Privacy Contact is [PRIVACY CONTACT NAME]. Email " + CONTACT_EMAIL + " (the general business address). Phone or WhatsApp +254 724 592 115.",
    ]),
    sec("short", "In short", [
      "We keep your order details so we can make, deliver and support your order. Marketing messages, analytics and ads stay off unless you say yes. This site is for adults. We do not want children's names, ages, schools or photos.",
    ]),
    sec("collect", "What we collect and why", [
      "We collect a piece of information only when we have a reason, and the order works if you leave the optional boxes blank. The table below is grouped by what the information is for.",
    ], [
      "Order data (name, phone number, delivery area, address and notes): to take, make, deliver and support your order. Lawful basis: performing the contract. Kept until [ORDER DATA RETENTION] days after delivery, then deleted or made anonymous.",
      "Order record (order reference, items, amounts): to keep accounts and meet tax duties. Lawful basis: contract and legal obligation. Kept [ACCOUNTS RETENTION] years without contact details.",
      "Custom brief (your choices, notes, links, and pictures you send): to quote and make your piece. Lawful basis: contract. Pictures are deleted [IMAGE DELETION PERIOD] days after your order closes.",
      "Trade enquiry (business name, outlet, volume, contact person, invoice name): to quote and supply. Lawful basis: contract. Kept while we trade and [TRADE RETENTION] months after.",
      "Email address and WhatsApp number for news: only if you tick the box. Lawful basis: your consent. Kept until you withdraw.",
      "Occasion reminders (occasion type, day and month only): only if you tick the box. Lawful basis: your consent. Kept until the date has passed once, then renewed or deleted.",
      "Visit measurement (pages, device type, coarse region, campaign link): only if you accept analytics. Lawful basis: your consent. Kept up to 14 months, then in totals only.",
      "Ad measurement through Meta, TikTok and Google: only if you accept advertising. Lawful basis: your consent. We keep none; the platforms keep theirs under their own policies.",
      "Proof of consent (what you agreed to, when, the wording version): to show we asked properly. Lawful basis: legal obligation and legitimate interest. Kept while the consent is live plus [CONSENT LEDGER YEARS] years.",
      "Security and fraud checks: to protect the site and orders. Lawful basis: legitimate interests.",
    ]),
    sec("saved", "What is saved on your device", [
      "The Site saves some items in your browser, such as your order list and your draft order. These stay on your device. Our Cookie and Tracking Policy lists every item. When you tap Send, your order text goes into WhatsApp, and our copy of it lives in our WhatsApp chat and any order records we keep.",
    ]),
    sec("consent", "Consent and taking it back", [
      "Marketing, analytics, advertising and occasion reminders are all off until you tick a separate box for each. Accepting the Terms of Sale and this Privacy Policy is only a confirmation that you have read them, and does not mean you agree to marketing. You can withdraw any consent at any time: reply STOP, use the link in an email, change your cookie choice, or contact the Privacy Contact. Withdrawing does not affect anything done before, and does not affect your order.",
    ]),
    sec("children", "Children", [
      "This site is for adults. We do not want children's names, ages, schools or photos. If you send them by mistake, we use them only to complete your order and then delete them (see the table for periods). We do not target children with marketing or build profiles from children's data. A child's data may be processed only with a parent or guardian's consent.",
    ]),
    sec("share", "Who receives your data", [
      "We share data only as needed, with these kinds of recipients:",
    ], [
      "Hosting: Vercel Inc., which hosts the Site.",
      "WhatsApp (Meta Platforms): your order text is sent through WhatsApp when you tap Send, and our replies go the same way.",
      "Courier or rider: your name, phone and delivery details for your delivery only. Courier: [COURIER NAME].",
      "Accountant and bookkeeping: order records, without contact details where possible. Accountant: [ACCOUNTANT NAME].",
      "Analytics and ad providers (Google, Meta, TikTok): only if you accepted analytics or advertising.",
      "Email service for the newsletter: [EMAIL PROVIDER], only if you ticked that box and confirmed your email.",
      "Database provider, if and when we add one: [DATABASE PROVIDER] in [DATABASE REGION].",
      "Authorities, when the law requires it.",
    ], "We do not sell personal data. Each service provider processes data for us under a written contract."),
    sec("abroad", "Sending data abroad", [
      "Some of these providers are outside Kenya, including the United States and Europe. Where we send personal data abroad we use a written contract or another safeguard the law accepts, and for advertising and analytics we ask for your consent after telling you data leaves Kenya. The risk is that other countries' laws may give you different protection. Countries: [TRANSFER COUNTRIES].",
    ]),
    sec("security", "Keeping it safe", [
      "We use access controls, multi factor sign in for our accounts, encryption in transit, and a limit on who can see customer data. We do not store card numbers or PINs. We never store a tax PIN on the Site.",
    ]),
    sec("breach", "If something goes wrong", [
      "If personal data is lost or accessed without permission and there is a real risk of harm, we tell the Data Commissioner within 72 hours of becoming aware and tell the people affected without undue delay.",
    ]),
    sec("rights", "Your rights", [
      "You have the right to be told how your data is used, to see it, to have it corrected, to have it deleted, to object, to restrict use, to receive it in a portable form, to withdraw consent, and to object to direct marketing at any time. Use the Data Request page or contact the Privacy Contact. We aim to respond within these times:",
    ], [
      "Access to your data: within 7 days, free.",
      "Correcting your data: within 14 days.",
      "Deleting your data: within 14 days, free. We keep only what the law requires, such as a financial record without your contact details.",
      "Objecting to use: within 14 days. Objecting to marketing takes effect straight away.",
      "Moving your data to you or to another provider: within 30 days.",
      "Withdrawing consent: within 2 working days, and sooner for messages.",
    ], "We may ask you to confirm it is you, for example by replying from the phone number we have, but we will not ask for a copy of your ID."),
    sec("complain", "Complaints", [
      "Please tell us first so we can put it right. You may also complain to the Office of the Data Protection Commissioner, Kenya, at https://www.odpc.go.ke.",
    ]),
    sec("optional", "What is optional", [
      "You need to give name, phone number and delivery area to place an order. Everything else is optional, and refusing marketing, analytics or advertising never affects your order or the price.",
    ]),
    sec("changes", "Changes", [
      "We will update this policy when what we do changes. The version number and date are at the top. We will tell you of important changes on the Site.",
    ]),
  ],
});
