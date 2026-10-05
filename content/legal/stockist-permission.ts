import { defineDoc } from "./types";
import { sec } from "./h";

export const stockistPermission = defineDoc({
  slug: "stockist-permission",
  title: "Stockist and Partner Listing Permission (internal template)",
  audience: "internal",
  summary: "A short form for a shop, lodge, school or organisation that lets Mikono list its name, logo and location on the site.",
  advocateNotes: [
    "D40: stockist names and venues are not used in copy until the client confirms them. This form is how she confirms them. Logos are the partner's trade marks (Trade Marks Act Cap. 506 [U]); written permission avoids passing off or implied endorsement.",
    "[U] Personal data of named contact persons in a listing: keep the listing to business details.",
  ],
  sections: [
    sec("form", "Permission", [
      "[PARTNER BUSINESS NAME] (the Partner) permits Mikono Creations (Mikono) to list the Partner on the Mikono Creations website and social media as a stockist or partner, showing:",
      "Business name: [PARTNER BUSINESS NAME]. Logo: [LOGO YES OR NO]. Location and opening hours: [PARTNER LOCATION]. Link: [PARTNER LINK].",
      "This permission lasts until withdrawn.",
    ]),
    sec("terms", "Terms", [
      "The listing says only that the Partner stocks or works with Mikono, and does not suggest any other approval. Mikono uses the Partner's logo only as supplied, unchanged. The Partner may withdraw permission by written notice, and Mikono removes the listing within [LISTING REMOVAL DAYS] days. The Partner confirms the person signing is authorised. No personal data of the Partner's staff is published without their agreement.",
    ]),
    sec("sign", "Signature", [
      "Name: [SIGNER NAME]. Position: [SIGNER POSITION]. Signature: [SIGNATURE]. Date: [SIGNATURE DATE].",
    ]),
  ],
});
