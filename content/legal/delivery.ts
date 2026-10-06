import { defineDoc } from "./types";
import { sec, CONTACT_PARA } from "./h";

export const deliveryPolicy = defineDoc({
  slug: "delivery-policy",
  title: "Delivery Policy",
  route: "/delivery",
  acceptedAt: ["checkout"],
  summary: "We deliver anywhere in Kenya. This page says how delivery works, who carries the risk, and what happens if a delivery fails or something arrives damaged. The cost and time are agreed on WhatsApp for each order.",
  advocateNotes: [
    "[V] CPA s.21: a consumer may cancel if delivery is more than 30 days after the stated delivery date (or 30 days after the agreement if no date). Drafted in.",
    "[U] Sale of Goods Act ss.20 and 22 on property and risk; this policy passes risk on delivery or collection.",
    "Owner ruling 2026-10-05: Mikono delivers anywhere in Kenya and has no shop, so there is no fixed pickup place. Fees and zones are not supplied yet, so cost and time are confirmed on WhatsApp for each order. Add fees to data/deliveryAreas.ts when they exist.",
  ],
  sections: [
    sec("how", "How delivery works", [
      "We deliver anywhere in Kenya, because our makers are all over the country. When you send your order you tell us where it should go: a Nairobi area, another Kenyan town, a courier or bus parcel service you choose, or a place we agree for you to collect it. A person at Mikono replies on WhatsApp to confirm the price, the delivery cost, and how and when it can reach you. Nothing is sent until you agree.",
    ]),
    sec("zones", "Cost and areas", [
      "The delivery cost depends on where the order is going. It is not included in the price of the animals. We confirm it on WhatsApp for each order, and it is stated in the Confirmation before you agree to it. If you want an order sent outside Kenya, ask us and we will say what is possible.",
    ]),
    sec("times", "Delivery times", [
      "We confirm the delivery time on WhatsApp for each order. Custom Pieces follow the lead time in the quote. Times are estimates. If we will miss a date we will tell you straight away. If delivery is more than 30 days after the date we gave you, you may cancel and be refunded for what has not been delivered.",
    ]),
    sec("pickup", "Collecting an order", [
      "We do not have a shop to collect from. If you would like to collect your order yourself, or send someone to collect it, we agree a meeting place and time on WhatsApp. Bring your order reference.",
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
