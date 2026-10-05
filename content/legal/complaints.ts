import { defineDoc } from "./types";
import { sec, CONTACT_PARA } from "./h";

export const complaintsProcedure = defineDoc({
  slug: "complaints-procedure",
  title: "Complaints and Disputes Procedure",
  route: "/complaints",
  summary: "How to raise a problem with us, how fast we reply, and what you can do if you are still not happy.",
  advocateNotes: [
    "[V] CPA s.88: a term that forces arbitration is invalid where it stops a consumer starting a High Court action under the Act, so mediation here is voluntary and optional for consumers. s.84 gives a right of action. s.4 class proceedings cannot be excluded by term.",
    "[U] The Competition Authority of Kenya takes consumer complaints: https://www.cak.go.ke. Confirm the current complaint channel. The Kenya Consumers Protection Advisory Committee is created by the Act (Part X).",
    "[U] Mediation: Nairobi Centre for International Arbitration or court annexed mediation; owner picks a mediator.",
    "[U] Small Claims Court monetary limit. Check the current limit.",
  ],
  sections: [
    sec("first", "Tell us first", [
      "Most problems are fixed quickly if you tell us. Write on WhatsApp or email with your order reference, what went wrong, photos if you have them, and what you would like us to do.",
      CONTACT_PARA,
    ]),
    sec("steps", "What happens next", [], [
      "Within 2 working days we acknowledge your complaint and give you a reference.",
      "Within [COMPLAINT RESPONSE DAYS] working days we send you our answer and any offer to put it right.",
      "If you are not happy, ask for a review by the owner. The owner replies within a further [REVIEW RESPONSE DAYS] working days.",
    ]),
    sec("mediation", "Mediation", [
      "If we still disagree, we can both try mediation with an independent mediator before going to court. We share the cost [MEDIATION COST RULE]. You do not have to use mediation, and it never takes away your right to go to court.",
    ]),
    sec("outside", "Outside help", [
      "You may contact the Competition Authority of Kenya, which handles consumer complaints, at https://www.cak.go.ke. For privacy complaints you may contact the Office of the Data Protection Commissioner at https://www.odpc.go.ke.",
    ]),
    sec("court", "Courts", [
      "Kenyan law applies and the courts in Nairobi have jurisdiction. This procedure does not limit any right you have under the Consumer Protection Act, including the right to start a court action.",
    ]),
    sec("records", "Records", [
      "We keep a record of each complaint and how it was solved, and use it to improve. We keep the record for [COMPLAINT RECORD RETENTION] and handle it under our Privacy Policy.",
    ]),
  ],
});
