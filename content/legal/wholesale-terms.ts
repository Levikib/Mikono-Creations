import { defineDoc } from "./types";
import { sec, CONTACT_PARA } from "./h";

export const wholesaleTerms = defineDoc({
  slug: "wholesale-terms",
  title: "Wholesale and Trade Terms",
  route: "/terms/wholesale",
  acceptedAt: ["wholesale"],
  summary: "Terms for retailers, lodges, schools, organisations and companies that buy from Mikono Creations to resell, use or give.",
  advocateNotes: [
    "[U] Whether the CPA applies to trade buyers: its definition of consumer includes a person who enters a transaction with a supplier in the ordinary course of the supplier's business (s.2, read), so a business buyer may still be a consumer. Do not assume trade buyers are outside the CPA. Limits on liability are therefore drafted softly.",
    "[U] Retention of title and credit terms: Sale of Goods Act (Cap. 31) property and payment provisions. Advocate to review enforceability and any need for a written credit agreement.",
    "[U] Late payment interest: check statutory limits and whether to state a rate.",
    "[U] VAT and tax invoices through eTIMS: secondary sources say the VAT registration threshold is KES 8 million with KES 5 million for voluntary registration. Confirm with KRA https://www.kra.go.ke and the VAT Act 2013.",
    "[U] Price list confidentiality: enforceable as a contractual confidence term. Competition law (Competition Act 2010) on resale price maintenance: this draft does not fix resale prices. Advocate to confirm.",
  ],
  sections: [
    sec("scope", "Who these terms are for", [
      "These Wholesale and Trade Terms apply to a business, school, lodge, shop, NGO or other organisation (\"Trade Buyer\", \"you\") that buys from Mikono Creations (\"Mikono\", \"we\") in quantity. They apply together with the Terms of Sale and the Privacy Policy. If they differ, these terms apply to trade orders. Words in capitals have the meanings in the Terms of Sale.",
      CONTACT_PARA,
    ]),
    sec("request", "Requests and price list", [
      "A wholesale request on the Site is a request for information. It is not an order. A person at Mikono answers it on WhatsApp and sends the wholesale price list. We do not publish trade prices on the Site.",
      "The price list, our terms of discount and any quote are confidential. You may use them to decide whether to buy and for your own accounts. You may not give them to another seller or publish them. This does not stop you telling your professional advisers or a regulator.",
    ]),
    sec("orders", "Orders and acceptance", [
      "A trade order is an offer. A contract is made when we confirm it in writing on WhatsApp or by email. The minimum order is [MINIMUM ORDER]. Prices, availability and lead times are confirmed in the quote.",
    ]),
    sec("payment", "Payment, credit and tax", [
      "Payment terms are [PAYMENT TERMS]. New trade buyers pay [NEW BUYER TERMS]. We may set a credit limit after checking your details, and may withdraw credit if an invoice is overdue. Overdue amounts carry [LATE PAYMENT TERMS].",
      "We issue a tax invoice where the law requires. Prices are stated as [VAT STATEMENT]. Give us your invoice name and, if you want a tax invoice, your tax number. We do not store a tax number on the Site.",
    ]),
    sec("delivery", "Delivery and inspection", [
      "Delivery is as set out in the quote and the Delivery Policy. Risk passes on delivery. Please inspect the goods and tell us of any shortage or damage within [INSPECTION PERIOD DAYS] days of delivery, with photos.",
    ]),
    sec("title", "Retention of title", [
      "Ownership of the goods stays with Mikono until we have received full payment. Until then you hold them for us, keep them identifiable and insured, and may resell them in the ordinary course of your business. If you do not pay on time, we may ask you to return unsold goods.",
    ]),
    sec("returns", "Returns and defects", [
      "Faulty goods, goods that do not match the confirmed order, and goods damaged in transit are replaced, repaired or refunded. Unsold stock may be returned only if we agreed in writing: [TRADE RETURNS RULE]. Handmade variation within [VARIATION TOLERANCE] is not a defect. Your legal rights are not reduced.",
    ]),
    sec("resale", "Resale and use of our brand", [
      "You may resell the goods as Mikono Creations products. You may use our name and photos of the goods you buy to advertise them, using the brand materials we give you and without suggesting any endorsement, partnership or approval we have not given. You may not change the goods, remove their labels, or describe them as tested, certified or suitable for any age. You must use only the safety statements in our Product Care and Safety Notice.",
      "We do not set the price at which you resell.",
    ]),
    sec("stockist", "Stockist listing", [
      "We may list your shop by name and place on our Site and social media as a place to find our animals. You can ask us to remove the listing at any time and we will remove it within [LISTING REMOVAL DAYS] days.",
    ]),
    sec("custom", "Custom and branded work", [
      "Custom or branded pieces for your business follow the Custom Order Terms, including the rule that you must show proof of rights in any logo or character.",
    ]),
    sec("data", "Personal data of your staff and customers", [
      "We process the contact details of your staff for the order. If you give us personal data of other people, you confirm that you may do so. Each of us handles personal data under the Data Protection Act, 2019. For any larger data sharing we will agree a data processing agreement.",
    ]),
    sec("termination", "Ending the relationship", [
      "Either of us may end the trade relationship by giving [NOTICE PERIOD] days' written notice. We may end it at once if you break these terms and do not fix it within 14 days of notice, or if you become insolvent. Orders already confirmed continue to be performed unless cancelled by agreement. Terms about confidentiality, payment due, retention of title and liability continue after the end.",
    ]),
    sec("liability", "Liability", [
      "Subject to the law, our total liability for any one order is limited to the price of the goods in that order, and we are not liable for loss of profit or indirect loss. Nothing limits liability that cannot be limited by law, including a warranty or condition that the law implies.",
    ]),
    sec("law", "Law and disputes", [
      "Kenyan law governs. The parties will first try to settle a dispute by talking, then by mediation, before court proceedings. Subject to that, the courts of Kenya sitting in Nairobi have jurisdiction.",
    ]),
    sec("general", "General", [
      "These terms, the quote and the documents they refer to are the whole agreement. If a part is unenforceable the rest continues. Neither of us may transfer our rights without the other's written agreement, except that we may transfer to a successor of our business. Notices are valid if sent by WhatsApp or email to the contact on the quote. We may change these terms for future orders by publishing a new version.",
    ]),
  ],
});
