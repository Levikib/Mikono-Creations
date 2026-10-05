import { defineDoc } from "./types";
import { sec, CONTACT_PARA } from "./h";

export const returnsPolicy = defineDoc({
  slug: "returns-policy",
  title: "Returns, Refunds and Exchanges Policy",
  route: "/returns",
  acceptedAt: ["checkout"],
  summary: "What you can return, how to do it, and when you get a refund, replacement or exchange. Your legal rights always stay.",
  advocateNotes: [
    "[V] CPA s.5(1) and (3): merchantable quality warranty and voidness of terms that remove it. The change of mind window is the owner's choice: the CPA text read gives a cancellation right for internet and remote agreements only where the supplier fails the disclosure and copy duties (ss.33 and 38). Secondary sources claim a general 14 day cooling off period; that was not found in the Act text and is [U].",
    "[U] CPA s.80: on cancellation the supplier must refund payments in the prescribed way; prescribed time not located. This policy states [REFUND TIME DAYS].",
    "[U] Refund of delivery fee on change of mind returns.",
  ],
  sections: [
    sec("rights", "Your legal rights come first", [
      "Goods we sell to you must match their description and be of reasonably merchantable quality. This policy adds to those rights and does not take them away. Where this policy is more generous, the more generous rule applies.",
    ]),
    sec("faulty", "Faulty, damaged or wrong goods", [
      "Message us on WhatsApp within [INSPECTION PERIOD DAYS] days of delivery with your order reference and photos. We will, at your choice where possible, replace, repair or refund. We pay the return delivery for faulty or wrong goods. Refunds are paid within [REFUND TIME DAYS] days by [REFUND METHOD].",
    ]),
    sec("change-of-mind", "Change of mind", [
      "For ready made items in their original condition, you may return them within [RETURN WINDOW DAYS] days of delivery if they are unused, unwashed, with any tags, and in suitable packaging. You pay the cost of returning them unless we agreed otherwise: [RETURN COST RULE]. We refund the Price of the goods within [REFUND TIME DAYS] days of receiving them, by [REFUND METHOD]. Delivery fees are [DELIVERY FEE REFUND RULE].",
    ]),
    sec("exchanges", "Exchanges", [
      "You may exchange an unused item for a different size or colour within [EXCHANGE WINDOW DAYS] days, subject to availability. If the new item costs more or less we settle the difference on WhatsApp.",
    ]),
    sec("not-returnable", "What cannot be returned for change of mind", [
      "Custom Pieces and personalised items are made for you alone, so they cannot be returned for change of mind. They are still covered if they are faulty or do not match what we approved. Items that are clearly used, washed or damaged by you cannot be returned for change of mind.",
    ]),
    sec("how", "How to return something", [
      "Message us on WhatsApp first so we can give you a return reference and arrangements. Do not send it before we reply. Keep your proof of delivery or posting.",
      CONTACT_PARA,
    ]),
    sec("variation", "Handmade variation", [
      "Small differences in colour, size and stitch within [VARIATION TOLERANCE] are part of handmade work and are not a fault.",
    ]),
    sec("trade", "Trade orders", [
      "Trade returns follow the Wholesale and Trade Terms.",
    ]),
  ],
});
