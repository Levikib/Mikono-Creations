import { defineDoc } from "./types";
import { sec, CONTACT_PARA } from "./h";

export const deliveryPolicy = defineDoc({
  slug: "delivery-policy",
  title: "Delivery Policy",
  route: "/delivery",
  acceptedAt: ["checkout"],
  summary: "How delivery and pickup work, who carries the risk, and what happens if a delivery fails or something arrives damaged. Fees and times are agreed on WhatsApp.",
  advocateNotes: [
    "[V] CPA s.21: a consumer may cancel if delivery is more than 30 days after the stated delivery date (or 30 days after the agreement if no date). Drafted in.",
    "[U] Sale of Goods Act ss.20 and 22 on property and risk; this policy passes risk on delivery or collection.",
    "Replaces the live /delivery page text 'Not confirmed yet' once the owner supplies zones, fees and times (data/deliveryAreas.ts).",
  ],
  sections: [
    sec("how", "How delivery works", [
      "When you send your order you choose pickup, delivery in a Nairobi area, or delivery to another Kenyan town. A person at Mikono replies on WhatsApp to confirm what is available, the price, and how and when it can reach you. Nothing is sent until you agree.",
    ]),
    sec("zones", "Areas and fees", [
      "Delivery areas and fees are: [DELIVERY ZONES AND FEES]. The fee for your order is stated in the Confirmation before you agree to it. We deliver to Kenya only unless we tell you otherwise: [INTERNATIONAL DELIVERY STATEMENT].",
    ]),
    sec("times", "Delivery times", [
      "Ready made items are usually delivered within [READY ITEM DELIVERY TIME] of your Confirmation and payment. Custom Pieces follow the lead time in the quote. Times are estimates. If we will miss a date we will tell you straight away. If delivery is more than 30 days after the date we gave you, you may cancel and be refunded for what has not been delivered.",
    ]),
    sec("pickup", "Pickup", [
      "Pickup is from [PICKUP LOCATION] at a time we agree on WhatsApp. Bring your order reference.",
    ]),
    sec("risk", "Risk and ownership", [
      "The goods are at our risk until they are delivered to you or collected. They are then at your risk. Ownership passes to you when we have received full payment.",
    ]),
    sec("inspection", "Check on delivery", [
      "Please look over the parcel when it arrives. If it is damaged or something is missing, tell us on WhatsApp with photos within [INSPECTION PERIOD DAYS] days. You may note damage when you sign for it, but you do not lose your rights if you do not.",
    ]),
    sec("failed", "If a delivery fails", [
      "If nobody can take the delivery at the agreed time, we will try to contact you. We will rearrange once at no charge, and then charge the extra delivery cost: [FAILED DELIVERY RULE]. If we cannot deliver after reasonable attempts, we will keep the goods for [HOLD PERIOD DAYS] days and then cancel and refund the Price less the costs of delivery attempts we already told you about.",
    ]),
    sec("data", "Your details on delivery", [
      "We give the courier only the name, phone and delivery details needed for your delivery. Please do not put a child's name, school or age in delivery notes.",
      CONTACT_PARA,
    ]),
  ],
});
