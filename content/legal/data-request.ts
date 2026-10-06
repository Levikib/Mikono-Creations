import { defineDoc } from "./types";
import { CONTACT_EMAIL } from "@/lib/site";
import { sec } from "./h";

export const dataRequest = defineDoc({
  slug: "data-request",
  title: "Your Data: Make a Request",
  route: "/data-request",
  summary: "How to ask to see, correct, delete, move or limit your personal data, or to take back a consent, and the form to use.",
  advocateNotes: [
    "[V per strategy/17] Time limits: access reg 9 within 7 days; objection reg 8 and rectify reg 10 within 14 days; erase reg 12 within 14 days; portability s.38 within 30 days; ODPC forms DPG1 to DPG5 exist but a plain request must be honoured. Re-verify against the Regulations.",
    "Erase by phone design (strategy/17 section 5): the page always shows the same message so that nobody can learn whether a number is on file.",
  ],
  sections: [
    sec("what", "What you can ask for", [
      "You can ask us to do any of these things with the personal data we hold about you:",
    ], [
      "Access: tell you what we hold and why, who gets it, and how long we keep it (we answer within 7 days).",
      "Correct: fix data that is wrong or incomplete (within 14 days).",
      "Delete: erase your data, except what the law makes us keep (within 14 days).",
      "Object: stop a use of your data, including all marketing (within 14 days; marketing stops straight away).",
      "Restrict: pause our use while a question is settled.",
      "Move: give you your data in a portable form such as JSON, or send it to another provider (within 30 days).",
      "Withdraw consent: take back a tick you gave for messages, analytics, ads or reminders (within 2 working days).",
    ]),
    sec("how", "How to ask", [
      "Fill in the request form below and send it by WhatsApp to +254 724 592 115 or by email to " + CONTACT_EMAIL + ". You may also just write to us in your own words. There is no charge.",
    ]),
    sec("verify", "Proving it is you", [
      "To protect your data we confirm it is you. We usually reply to the phone number or email you gave us, or ask for your order reference and one more detail. We will not ask you for a copy of your ID.",
    ]),
    sec("reply", "What you will see", [
      "When you ask by phone number, the page always says: \"If we hold data for this number, we have sent it a confirmation.\" This is true whether or not we hold data, so that nobody can find out who our customers are.",
    ]),
    sec("form", "Request form", [
      "Copy this into WhatsApp or an email and fill in the brackets.",
      "Request type: [ACCESS, CORRECT, DELETE, OBJECT, RESTRICT, MOVE OR WITHDRAW CONSENT]",
      "Your name: [YOUR NAME]",
      "Phone number I used with Mikono: [YOUR PHONE]",
      "Order reference, if any: [ORDER REFERENCE]",
      "What I would like: [YOUR REQUEST]",
      "I understand Mikono may confirm it is me before acting. Please do not include a child's name, school or age.",
    ]),
    sec("refusal", "If we say no", [
      "If we cannot do what you ask, for example because the law makes us keep a record, we tell you why in writing and that you can complain to the Data Protection Commissioner at https://www.odpc.go.ke.",
    ]),
  ],
});
