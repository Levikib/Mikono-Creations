import { defineDoc } from "./types";
import { sec } from "./h";

export const photoConsent = defineDoc({
  slug: "photo-consent",
  title: "Photo and Content Consent Form (internal template)",
  audience: "internal",
  summary: "A form for the owner to use with makers, customers and anyone shown in photos or videos, so that Mikono has written permission for each use.",
  advocateNotes: [
    "Owner has stated that all media is cleared (charter R1). This template documents that clearance person by person, and is the way to cover people who appear. It is for internal use and is not shown on the site.",
    "[V per strategy/17 section 3] A child's data needs a parent or guardian's consent (DPA 2019 s.33). For a child, an adult with parental responsibility signs. Do not collect a child's name, age or school on the form. Use only the adult's details.",
    "[U] Right of publicity and privacy in Kenya (Constitution art. 31). Moral rights under the Copyright Act in photographs.",
    "[U] Whether consent should be recorded in a consent ledger; retention of the signed form.",
  ],
  sections: [
    sec("use", "Instructions", [
      "Fill one form for each person or each group. For a child, the parent or guardian signs and writes only their own details. Keep the signed form with the media record. Give the person a copy.",
    ]),
    sec("form", "Consent form", [
      "I, [PERSON NAME], of [PERSON CONTACT], give Mikono Creations permission to use photos and video in which I (or the child for whom I have parental responsibility, shown below only as described in the picture) appear.",
      "Date and place of the photo or video: [PHOTO DATE AND PLACE].",
      "Role: [ROLE: MAKER, CUSTOMER, STOCKIST OR OTHER].",
      "Where it may be used (tick each separately): the Mikono website; Facebook and Instagram; printed material; stockist and partner materials; press. [USES TICKED].",
      "For how long: [PERMISSION PERIOD].",
      "Credit: [CREDIT PREFERENCE].",
    ]),
    sec("rights", "What you are agreeing to", [
      "You can say no to any use without any effect on an order or on your work with us. You can withdraw permission at any time by writing to [PRIVACY EMAIL]. We will stop new use and remove the picture from the Site within 14 days. We cannot recall material already printed or published by others. Your picture is personal data and is handled under our Privacy Policy. You keep the right to complain to the Data Protection Commissioner.",
    ]),
    sec("sign", "Signature", [
      "Name: [SIGNER NAME]. Signature: [SIGNATURE]. Date: [SIGNATURE DATE]. If signing for a child: I confirm I am the child's parent or guardian. Relationship: [RELATIONSHIP]. Witness: [WITNESS NAME].",
    ]),
  ],
});
