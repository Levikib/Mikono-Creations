import { defineDoc } from "./types";
import { sec, CONTACT_PARA } from "./h";

export const customOrderTerms = defineDoc({
  slug: "custom-order-terms",
  title: "Custom Order Terms",
  route: "/terms/custom",
  acceptedAt: ["custom"],
  summary: "How made to order pieces work: the brief, the quote, the deposit, approval, changes, your promises about the pictures you send us, and what we may decline or adapt.",
  advocateNotes: [
    "[U] Personalised or made to measure goods and the right to return: Kenya has no general statutory 14 day return right found in the CPA text read. The non returnable rule for personalised items is drafted as a contract term. The CPA s.5 warranty and ss.12 to 16 still apply to defects and misdescription. Advocate to confirm that a no returns term for personalised goods is enforceable.",
    "[V] Copyright Act, Cap. 130: copyright in artistic works lasts 50 years after the author's death [U on section number]. Source: https://copyright.go.ke/sites/default/files/downloads/CopyrightAct12of2001.pdf. Making a crocheted copy of a third party character is a reproduction or adaptation that needs the owner's licence. Customer warranty and indemnity drafted for this.",
    "[U] Trade Marks Act (Cap. 506): using another party's registered logo on goods for sale can infringe. Source: https://www.kipi.go.ke/sites/default/files/KIPI/Acts%20and%20Regulations/tm_act_cap506.pdf",
    "[U] Likeness of a pet or of an adult in a photo: personality and privacy. A child's photo is personal data (DPA 2019 s.33, s.2) so the terms discourage it and require deletion.",
    "[U] Deposits and refunds on custom work: advocate to check the deposit forfeiture wording against CPA s.13 (unconscionable terms).",
    "[U] Moral rights of the maker in designs and the ownership of Mikono designs under the Copyright Act.",
  ],
  sections: [
    sec("scope", "What these terms cover", [
      "These Custom Order Terms apply when you ask Mikono Creations (\"Mikono\", \"we\") to make a Custom Piece from a brief. They sit alongside the Terms of Sale and the Privacy Policy. Words in capitals have the meanings given in the Terms of Sale. If these terms and the Terms of Sale differ about a Custom Piece, these terms apply.",
      CONTACT_PARA,
    ]),
    sec("brief", "Your brief", [
      "The brief is what you tell us through the Custom Studio and on WhatsApp: the shape, size, colours, details, quantity, date, and any pictures or links. Please give us a brief that is complete and accurate. We work from the brief as it stands when you approve the quote.",
      "A brief is not an order. It is a request for a quote.",
    ]),
    sec("quote", "Quote and acceptance", [
      "We will review your brief and reply on WhatsApp with what is possible, the Price, the lead time and any changes we suggest. The quote is valid for [QUOTE VALIDITY DAYS] days. A contract for the Custom Piece is made only when you approve the quote in writing on WhatsApp and we confirm that approval, and, where a deposit is asked for, when we receive it.",
      "Lead times are an estimate that we confirm in the quote. At the date of these terms the standard lead time is 3 days to 1 week, depending on quantity and design, confirmed in the quote.",
    ]),
    sec("deposit", "Deposit and payment", [
      "We may ask for a deposit before we begin. The deposit is [DEPOSIT AMOUNT] and the balance is due [BALANCE TIMING]. We accept [PAYMENT METHODS]. We give the payment details only on WhatsApp.",
      "A deposit pays for materials and time already committed. What happens to it if you cancel is set out under Cancellation below.",
    ]),
    sec("approval", "Approval and start of production", [
      "We will send you a swatch photo or a design confirmation where colours or shape matter. Production starts when you approve it and any deposit is received. We will tell you the date it starts.",
    ]),
    sec("changes", "Changes after approval", [
      "Once production has started, a change may not be possible, may cost more, or may move the date. We will tell you which before doing anything. A change is agreed only when we confirm it on WhatsApp.",
    ]),
    sec("cancellation", "Cancellation", [
      "You may cancel before we start production and we will refund everything you paid. After production starts, we will refund what you paid less the cost of materials bought and work done up to the time you cancel, which we will show you in writing: [CANCELLATION CHARGE RULE].",
      "If we cannot make your Custom Piece, or the date slips by more than 30 days after the date we gave you, you may cancel and we will refund what you paid for it. Your rights under the Consumer Protection Act about late delivery are not reduced.",
    ]),
    sec("feasibility", "What we can make", [
      "We may decline a brief, or adapt it, if it cannot be made well in crochet, if it needs materials we cannot get, if the date is not possible, or if it breaks these terms. We will explain the change or the reason and you can accept, adjust or withdraw without charge before approval.",
      "Crochet is a handmade craft. A Custom Piece will look like a handmade interpretation of your idea and not an exact copy or a factory reproduction.",
    ]),
    sec("third-party", "Characters, logos and other people's work", [
      "We do not copy a character, logo, brand, mascot or artwork that belongs to someone else unless you show us proof that you own it or hold a licence that lets us make it. Proof can be a licence letter, a brand permission or a written statement from the owner. We may refuse to make anything we are not satisfied is cleared.",
      "If you want a Custom Piece for a brand you represent, tell us who holds the rights and send the permission with your brief.",
    ]),
    sec("warranties", "Your promises about what you send us", [
      "When you send us pictures, drawings, links or text (\"Inspiration Material\") you promise that you own it or have the right to share it, that using it as we describe does not infringe anyone's rights, and that it does not show an identifiable child. You give us a licence to copy, view and use the Inspiration Material only to prepare the quote and make your Custom Piece.",
      "You will compensate us for loss and costs we suffer because a claim is made that the Inspiration Material infringes someone's rights, unless the claim arises from our own wrong.",
    ]),
    sec("images", "Handling and deletion of your pictures", [
      "We keep your Inspiration Material in a private place that only the maker and the owner can reach. We do not post it, forward it or use it in marketing. We delete it [IMAGE DELETION PERIOD] days after your order is closed or cancelled, or sooner if you ask. See the Privacy Policy for your rights.",
      "Please do not send a child's name, age, school or photo. Photograph a drawing flat, and crop out any child's face. If a picture with a child arrives by mistake, we use it only to make your piece, crop or blur the face where we can, and delete it with the rest.",
    ]),
    sec("personalised", "Personalised items", [
      "Name tags and words should be an adult's choice, such as a first name or short word, never a full name, school or age. A personalised item is made for you alone, so it cannot be returned or exchanged for change of mind. If it is faulty, or does not match what we approved, we will put it right under the Returns, Refunds and Exchanges Policy and your legal rights.",
    ]),
    sec("tolerance", "Tolerance and likeness", [
      "Colour, size and stitch can differ a little from the approved swatch or photo, within [VARIATION TOLERANCE]. A pet or character piece is an artistic likeness and may not match every marking. We do not promise a perfect likeness. Differences within the tolerance and the nature of handmade work are not defects.",
    ]),
    sec("ip", "Who owns the design", [
      "Mikono owns the copyright in the patterns, designs and construction methods we create, including those created for you. You own the physical Custom Piece once you have paid for it. You may not copy, mass produce or sell our designs. We will not sell a design made only for you to another customer for [EXCLUSIVITY PERIOD] unless you agree, but we may keep making our own shapes and patterns.",
      "Rights in your Inspiration Material stay with you or its owner.",
    ]),
    sec("showing", "Showing the finished work", [
      "We will show your Custom Piece in our photos, social media or the Site only if you agree in writing for that use, using our Photo and Content Consent form. You can say no without any effect on your order. If you say yes you can withdraw later and we will stop new use, but we cannot recall material already published.",
    ]),
    sec("law", "Other terms", [
      "The Terms of Sale apply to delivery, risk, defects, liability, complaints, governing law and general matters for Custom Pieces too.",
    ]),
  ],
});
