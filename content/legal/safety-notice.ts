import { defineDoc } from "./types";
import { sec } from "./h";

export const safetyNotice = defineDoc({
  slug: "safety-notice",
  title: "Product Care and Safety Notice",
  route: "/safety-notice",
  acceptedAt: ["checkout"],
  summary: "An honest note about our handmade crocheted animals: how to look after them, what to check, and what we do and do not claim.",
  advocateNotes: [
    // SCAN-EXEMPT-START: this note lists the banned phrases so the advocate sees what is never claimed
    "Approved claims only (D26): zero plastic, nothing detachable, easy to clean, recycled acrylic yarn, made in Nairobi, 25+ women supported. Banned until evidence: child safe, safe for babies, tested, certified, age range, nothing to swallow, choking, cannot be pulled off.",
    // SCAN-EXEMPT-END
    "Toy standard research. [U] KEBS lists adopted ISO 8124 parts as Kenya Standards (KS ISO 8124-3:2020 migration of certain elements, KS ISO 8124-4:2014, KS ISO/TR 8124-8:2016 age determination), https://kebs.org/wp-content/uploads/2023/09/List-of-approved-standards-July-2021.pdf. Toys are reported as a PVoC regulated import category, so imported toys need conformity certificates; secondary source only.",
    "[U] 'KS EAS 777' named in the brief: a search found EAS 777 to be a food standard (acrylamide in potato products), not a toy standard. Do not cite it. EN 71 is a European standard and not Kenyan law; the Kenyan equivalents are KS ISO 8124 and KS EN 71 adoptions, which were not confirmed.",
    "[U] Whether a small handmade producer in Kenya must obtain a KEBS standardization mark or permit for toys (Standards Act Cap. 496 s.10 applies to commodities subject to a standardization order). No toy order was found. The voluntary Diamond Mark scheme exists. Advocate or KEBS (https://www.kebs.org) to confirm what is required and whether a conformity assessment is advisable before the owner makes any safety claim or sells to schools or lodges.",
    "[U] Product liability: CPA s.5 and the general law of negligence. This notice is protective but does not exclude liability that cannot be excluded.",
    "The owner should seek testing (for example EN 71 or ISO 8124 mechanical tests) if she wants to claim conformity. Until a certificate is supplied, the notice must keep saying the animals are not certified.",
  ],
  sections: [
    sec("about", "About our animals", [
      "Mikono Creations animals are crocheted by hand in Nairobi from recycled acrylic yarn. Our plain crocheted animals are zero plastic with nothing detachable and are easy to clean. Items that carry extras such as outfits, accessories, name tags or special packaging are described separately, and the extra parts may come off.",
    ]),
    sec("not-certified", "What we do not claim", [
      "Our animals are handmade collectables and gifts. They are not tested or certified to a toy safety standard, and we do not give an age range for them. We have not tested them for flammability. Please decide for yourself whether an item suits the person you are giving it to.",
    ]),
    sec("supervision", "Use with children", [
      "We recommend adult supervision whenever a child plays with a crocheted animal. Please do not leave a young child alone with one.",
    ]),
    sec("inspect", "Look after it, and check it often", [
      "Handmade items can wear with use. Check the animal regularly for loose or pulled threads, worn stitching, holes, loose stuffing, or anything that has come loose. If you find damage, stop using it and contact us. We will advise on a repair or replacement.",
    ]),
    sec("care", "Cleaning and care", [
      "Our animals are easy to clean. Care steps for washing and drying are: [CARE INSTRUCTIONS]. Keep animals away from open flame, heaters and other strong heat.",
    ]),
    sec("custom", "Custom pieces and extras", [
      "Parts added to a Custom Piece, such as buttons, beads or sewn on extras, are agreed with you in the quote. We will tell you what is used. Such parts are not covered by the statement that nothing is detachable unless the quote says so.",
    ]),
    sec("report", "Tell us about a problem", [
      "If you have a safety concern about something we made, tell us at once on WhatsApp on +254 724 592 115 or at [CONTACT EMAIL]. We take every report seriously and will stop selling an item if we find a problem.",
    ]),
  ],
});
