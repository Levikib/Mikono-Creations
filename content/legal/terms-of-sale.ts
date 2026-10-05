import { defineDoc } from "./types";
import { sec, CONTACT_PARA } from "./h";

export const termsOfSale = defineDoc({
  slug: "terms-of-sale",
  title: "Terms of Sale",
  route: "/terms",
  acceptedAt: ["checkout", "custom"],
  summary: "How ordering from Mikono Creations works: you send an order on WhatsApp, we accept it when we confirm it on WhatsApp, and then we make and deliver it.",
  advocateNotes: [
    "[V] Consumer Protection Act (Cap. 501) s.5(1) reasonably merchantable quality, s.5(3) any term that negates or varies implied conditions under the Sale of Goods Act or the Act is void. Source: https://new.kenyalaw.org/akn/ke/act/2012/46/eng@2022-12-31 (text read via the Cap. 501 revised PDF, https://faolex.fao.org/docs/pdf/ken121992.pdf). Older gazette numbering put this at s.8, so check the current section numbers.",
    "[V] CPA ss.12 to 16 (false and unconscionable representation, rescission), s.21 (late delivery: a consumer may cancel a future performance agreement if delivery is more than 30 days after the date stated, or 30 days after the agreement if no date), s.31 to 33 (internet agreements: disclosure of prescribed information, express chance to accept, decline and correct errors, copy of the agreement, 7 day and 30 day cancellation rights), ss.36 to 38 (remote agreements), s.84 (court action), s.88 (a term forcing arbitration is invalid where it blocks a High Court action), s.92 (offence penalty up to KES 1 million or 3 years).",
    "[U] The 'prescribed information' and 'prescribed period' for internet and remote agreements are in regulations that were not located. Ask the advocate for the current Consumer Protection (General) Regulations and align the order confirmation message with them.",
    "[U] Whether a WhatsApp conversation is an 'internet agreement' (text based internet communication, s.2) or a 'remote agreement'. This draft treats the order flow as both and gives the s.31 items (disclosure, chance to correct, copy kept).",
    "[U] Sale of Goods Act (Cap. 31) ss.15 to 17 (description, merchantable quality, sample), ss.20 and 22 (property and risk). Source: https://kenyalaw.org/kl/fileadmin/pdfdownloads/Sale%20of%20goods%20(Cap.%2031).pdf. Confirm numbering.",
    "[V] Kenya Information and Communications Act (Cap. 411A) s.83J: offer and acceptance may be expressed by electronic messages and a contract is not invalid only because of that. s.83G writing requirement met by electronic form. Source: https://www.ca.go.ke/sites/default/files/CA/Statutes%20and%20Regulations/Kenya-Information-and-Communication-Act-1998.pdf (search summary, numbering [U]).",
    "[U] Limitation of liability and handmade tolerance wording must not be read as excluding the CPA s.5 warranty. The advocate should confirm the drafting.",
    "[U] Courts: Nairobi courts and the small claims court threshold (check current limit).",
  ],
  sections: [
    sec("about", "Who we are and what these terms cover", [
      "These Terms of Sale apply to every order you place with Mikono Creations (registration number [REGISTRATION NUMBER]), trading as Mikono Creations, of [PHYSICAL ADDRESS], Nairobi, Kenya (\"Mikono\", \"we\", \"us\"). \"You\" means the person placing the order.",
      "They apply to the animals shown on the Site and to Custom Pieces, which are also covered by the Custom Order Terms. Trade buyers are also covered by the Wholesale and Trade Terms. If those documents conflict with these Terms of Sale on a custom or trade point, the more specific document applies.",
      CONTACT_PARA,
    ]),
    sec("definitions", "Words we use", [
      "These words have the same meaning throughout our legal documents.",
    ], [
      "\"Site\" means mikono-creations.vercel.app and any website address we move to.",
      "\"Order\" means the list of items, quantities, sizes, colours and delivery details you send us on WhatsApp.",
      "\"Confirmation\" means our written message on WhatsApp that accepts your Order and states the price, delivery and payment details.",
      "\"Goods\" means the crocheted animals and other items in your Order.",
      "\"Custom Piece\" means an item made to your brief under the Custom Order Terms.",
      "\"Price\" means the price in Kenya shillings (KES) stated in the Confirmation.",
    ]),
    sec("adults", "Who can order", [
      "You must be 18 or older, or have a parent or guardian place the Order for you. The Site is written for adults and we do not ask for any child's name, age, school or photo.",
    ]),
    sec("ordering", "Ordering on WhatsApp", [
      "The Site is a catalogue and an order form. You do not pay on the Site. When you tap Send, your Order opens as a message in WhatsApp and a copy is placed on your clipboard. You can correct anything before you send it, and you will see a review step with an unticked box to confirm that you have read and accept these Terms of Sale and the Privacy Policy.",
      "A record of your Order stays in your WhatsApp chat with us. We will send you the details of the Order again in the Confirmation so that you have a written copy.",
    ]),
    sec("formation", "When a contract is made", [
      "Your Order is an offer to buy. It is not a contract until we accept it. We accept your Order only when we send you a Confirmation on WhatsApp. Until then we may decline the Order, for example because an item is unavailable, we cannot deliver to your address, or a detail is unclear.",
      "A contract exists once we send the Confirmation and, where the Confirmation asks for payment or a deposit first, once we receive it. Under the Kenya Information and Communications Act an offer and its acceptance may be made by electronic messages, and we agree that your Order and our Confirmation on WhatsApp are enough to form a contract.",
      "If we cannot accept your Order we will tell you and will not charge you. If you have already paid, we will refund you in full.",
    ]),
    sec("prices", "Prices and availability", [
      "Prices and availability are confirmed on WhatsApp before you pay. At the date of these terms Mikono has not published prices on the Site. [PRICE POLICY].",
      "The Price we confirm is the price you pay for the Goods named in the Confirmation. Delivery is quoted separately before you agree. We will not add charges that were not stated in the Confirmation.",
      "If we made an obvious mistake in a price, we will tell you before we accept your Order and you can choose to go ahead at the correct price or cancel at no cost.",
    ]),
    sec("payment", "Payment", [
      "We accept the following payment methods: [PAYMENT METHODS]. Payment details are given in the Confirmation on WhatsApp only. We will never ask for your card number, PIN or M-Pesa PIN. Please check the account name before you pay and keep your payment receipt.",
      "When payment is due: [PAYMENT TIMING]. Pay on delivery is [PAY ON DELIVERY].",
    ], undefined, "Placeholders until the owner confirms. Do not publish numbers that the owner has not given."),
    sec("delivery", "Delivery, risk and ownership", [
      "Delivery, areas, fees and times are set out in our Delivery Policy and confirmed in the Confirmation. Delivery dates are our honest estimate and we will tell you quickly if one will be missed.",
      "The Goods remain at our risk until they are delivered to you or to the person you named, or collected by you. After that they are at your risk. Ownership passes to you when we have received full payment.",
      "Please look over the parcel when it arrives. If it is damaged, tell us on WhatsApp with a photo as soon as you can and within [INSPECTION PERIOD DAYS] days of delivery.",
    ]),
    sec("handmade", "Handmade variation", [
      "Every piece is crocheted by hand, so no two are exactly alike. Colour, size and stitch can differ a little from the photos on the Site and from other pieces of the same design, within the tolerance we describe here: [VARIATION TOLERANCE]. Screens also show colours differently.",
      "This is normal for a handmade item and is not a defect. It does not limit your right to goods that match their description and are of reasonably merchantable quality. If an exact shade matters to you, ask before you order and we will send a photo of the actual yarn.",
    ]),
    sec("changes", "Changes and cancellation before dispatch", [
      "You may ask to change or cancel an Order by messaging us on WhatsApp. Before we have started making or packing the Goods, we will change or cancel at no cost and refund anything you paid. After we have started, we will tell you what is still possible. Custom Pieces follow the Custom Order Terms.",
      "We may cancel an Order if an item cannot be made or delivered, or if we cannot confirm payment. We will refund anything you paid.",
      "Nothing in this section limits any right to cancel that you have under the Consumer Protection Act, including the rights that apply to internet and remote agreements and the right to cancel for late delivery.",
    ]),
    sec("returns", "Returns, exchanges and refunds", [
      "Our Returns, Refunds and Exchanges Policy forms part of these terms. In short: [RETURN POLICY SUMMARY].",
      "Whatever our policy says, you keep your legal rights. The law treats Goods supplied to a consumer as carrying a warranty of reasonably merchantable quality, and a term that tries to remove that warranty is void.",
    ]),
    sec("defects", "Faulty or wrong goods", [
      "If the Goods arrive damaged, faulty, or not as described in the Confirmation, tell us on WhatsApp with photos. At your choice, and as the law allows, we will repair, replace or refund. We will pay reasonable return costs for faulty or wrong Goods. We will reply within [RESPONSE TIME HOURS] hours on working days.",
      "Normal handmade variation within the tolerance above, wear from use, and damage caused after delivery by misuse or not following the care guidance are not defects.",
    ]),
    sec("safety", "Product information and safety", [
      "We describe our animals using only these statements: zero plastic, nothing detachable, easy to clean, recycled acrylic yarn, made in Nairobi, and 25+ women supported. We do not describe our animals as tested, certified or suitable for any age. Please read the Product Care and Safety Notice before giving any item to a child.",
    ]),
    sec("liability", "Our responsibility", [
      "We are responsible for loss or damage you suffer that is a foreseeable result of our breaking these terms or our failing to take reasonable care. We are not responsible for loss that was not foreseeable, for loss of profit or business if you bought for business use, or for delay caused by events outside our control.",
      "Nothing in these terms limits or excludes liability that cannot be limited or excluded by law, including liability for death or personal injury caused by negligence, for fraud, or for any warranty or condition that the Consumer Protection Act or the Sale of Goods Act gives you. [LIABILITY CAP].",
    ]),
    sec("force-majeure", "Events outside our control", [
      "We are not in breach if we are delayed or prevented by an event outside our reasonable control, such as severe weather, fire, public unrest, power or network failure, a courier or supplier failure, or an act of government. We will tell you promptly and give you the choice to wait or to cancel and be refunded for anything not delivered.",
    ]),
    sec("electronic", "Messages and records", [
      "You agree that we may contact you about your Order by WhatsApp, phone and email, and that these messages and our records of them count as written notice. This is not agreement to marketing messages. Marketing is covered by the Marketing and Messaging Terms and always needs your separate tick.",
    ]),
    sec("privacy", "Your personal data", [
      "We use your name, phone number and delivery details to take, make and deliver your Order. Our Privacy Policy explains how, and what your rights are.",
    ]),
    sec("complaints", "Complaints and disputes", [
      "If something goes wrong, tell us first. Our Complaints and Disputes Procedure explains the steps. We will try to settle a dispute by talking, and then by mediation, before going to court. This does not stop you going to the Competition Authority of Kenya or to court at any time, and no term here stops you from bringing a claim you are allowed to bring under the Consumer Protection Act.",
    ]),
    sec("law", "Governing law and courts", [
      "These terms are governed by the laws of Kenya. Subject to your rights above, the courts of Kenya sitting in Nairobi have jurisdiction over any dispute about them.",
    ]),
    sec("general", "General", [
      "Severability: if a part of these terms is found to be unenforceable, the rest stays in force.",
      "Entire agreement: these terms, the Confirmation and the documents they refer to are the whole agreement for the Order. They replace anything said earlier, but do not remove any statement we made about the Goods that you relied on.",
      "Assignment: we may transfer our rights and duties to a successor of the business if it takes them on. You may not transfer your Order without our written agreement, except by giving the Goods as a gift.",
      "Notices: we give notice to the phone number or email you gave us. You give notice by WhatsApp to +254 724 592 115 or by email to [CONTACT EMAIL].",
      "Variation: we may change these terms for future Orders. The version in force when we send the Confirmation governs that Order. A change to an existing Order needs agreement from both of us.",
      "No waiver: if we do not enforce a term at once, we may still enforce it later.",
    ]),
  ],
});
