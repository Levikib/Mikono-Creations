# 18 Legal pack

**I am not a lawyer. Everything in content/legal/ and in this file is a draft for a Kenyan advocate to review before publication.** Citations are marked [V] (text read in a source) or [U] (unverified, from secondary sources or memory). The internal documents (data processing agreement checklist, breach plan) are in strategy/18-legal-internal.md. Stays consistent with strategy/07 (D18, D26, D16), strategy/16 and strategy/17.

Typed data: `content/legal/*.ts`, one file per document, `content/legal/index.ts` exports `documents: LegalDoc[]`, `content/legal/acceptance.ts` holds the exact checkbox, cookie bar, footer and order line copy. Each document carries `advocateNotes` (citations and open points, never rendered) and a computed `placeholders` list. Version is `v0.1-draft` for all until the advocate signs off; bump `DRAFT_VERSION` in types.ts on any change.

## 1. Documents

| Document | Slug | Route | Audience | Accepted at | Placeholders |
|---|---|---|---|---|---|
| Terms of Sale | terms-of-sale | /terms | public | checkout, custom | 13 |
| Custom Order Terms | custom-order-terms | /terms/custom | public | custom | 11 |
| Wholesale and Trade Terms | wholesale-terms | /terms/wholesale | public | wholesale | 12 |
| Website Terms of Use | website-terms | /terms/website | public | none | 2 |
| Privacy Policy | privacy-policy | /privacy | public | checkout, custom, wholesale | 17 |
| Cookie and Tracking Policy | cookie-policy | /cookies | public | none | 4 |
| Returns, Refunds and Exchanges Policy | returns-policy | /returns | public | checkout | 9 |
| Delivery Policy | delivery-policy | /delivery | public | checkout | 8 |
| Product Care and Safety Notice | safety-notice | /safety-notice | public | checkout | 2 |
| Intellectual Property and Takedown Notice | ip-notice | /legal/ip | public | none | 3 |
| Accessibility Statement | accessibility-statement | /accessibility | public | none | 3 |
| Complaints and Disputes Procedure | complaints-procedure | /complaints | public | none | 5 |
| Your Data: Make a Request | data-request | /data-request | public | none | 6 |
| Marketing and Messaging Terms | marketing-terms | /legal/marketing | public | none | 3 |
| Photo and Content Consent Form (internal template) | photo-consent | none (internal) | internal | none | 14 |
| Stockist and Partner Listing Permission (internal template) | stockist-permission | none (internal) | internal | none | 10 |

Not on the site: the Photo and Content Consent Form and the Stockist Listing Permission are owner templates (serve as downloads or keep offline). The DPA checklist and breach plan live in strategy/18-legal-internal.md.

Purposes in one line each: Terms of Sale (contract formed by WhatsApp confirmation, handmade tolerance, remedies). Custom Order Terms (brief, quote, deposit, licence and third party rights). Wholesale and Trade Terms (price list secrecy, credit, title, resale). Website Terms (acceptable use, IP, no scraping). Privacy Policy (data map by tier, bases, rights, ODPC). Cookie and Tracking Policy (every key). Returns, Delivery (placeholders for the owner's policy). Safety Notice (care, honest, no certification claim). IP Notice (ownership, owner has cleared all site photos, takedown). Accessibility, Complaints, Data Request (with form), Marketing and Messaging Terms.

## 2. Acceptance copy (exact, all unticked, required)

| Where | Text | Links | Version id |
|---|---|---|---|
| Checkout review step | I have read and accept the Terms of Sale and the Privacy Policy. | /terms, /privacy | terms-of-sale@v0.1-draft+privacy-policy@v0.1-draft |
| Custom brief, before Send | I have read and accept the Custom Order Terms, the Terms of Sale and the Privacy Policy. | /terms/custom, /terms, /privacy | custom-order-terms@v0.1-draft+terms-of-sale@v0.1-draft+privacy-policy@v0.1-draft |
| Wholesale request | I have read and accept the Wholesale and Trade Terms and the Privacy Policy, and I am authorised to make this request for my business. | /terms/wholesale, /privacy | wholesale-terms@v0.1-draft+privacy-policy@v0.1-draft |

Error text: "Please tick to confirm you have read and accept the terms." Never bundled with the optional marketing boxes (strategy/17 8.1).

Order message line (added to the WhatsApp text, also in the custom brief and wholesale messages): `Accepted: terms-of-sale v0.1-draft, privacy-policy v0.1-draft on 2026-10-03 14:05 EAT`.

Cookie bar (version consent-v1-draft): "We use essential storage to run your order list. With your OK we also measure visits and ads." Buttons: Accept all, Reject non-essential, Choose, plus a link to the Cookie and Tracking Policy. Switches (default off): Analytics, Advertising, Link my browsing to my customer record. Full strings in acceptance.ts.

Footer legal links (in order): Terms of Sale, Custom Order Terms, Wholesale and Trade Terms, Website Terms of Use, Privacy Policy, Cookie and Tracking Policy, Returns and Refunds, Delivery, Product Care and Safety, Accessibility, Complaints, Your data, All legal documents. Cookie settings and Clear my data stay together (D35).

## 3. Master placeholder list

Fill these first, in this order: [LEGAL ENTITY NAME], [REGISTRATION NUMBER], [PHYSICAL ADDRESS], [CONTACT EMAIL], [PRIVACY EMAIL] and [PRIVACY CONTACT NAME], [ODPC REGISTRATION NUMBER] (register first; see strategy/17 1.1), [PAYMENT METHODS], [RETURN WINDOW DAYS] and the returns rules, [DELIVERY ZONES AND FEES], [CUSTOM LEAD TIME], [DEPOSIT AMOUNT], [EFFECTIVE DATE]. Never fill in a number the owner has not decided. Prices and fees stay unpublished until she confirms them (R7).

| Placeholder | Used in |
|---|---|
| [ACCESS, CORRECT, DELETE, OBJECT, RESTRICT, MOVE OR WITHDRAW CONSENT] | data-request |
| [ACCESSIBILITY AUDIT DATE] | accessibility-statement |
| [ACCESSIBILITY EMAIL] | accessibility-statement |
| [ACCOUNTANT NAME] | privacy-policy |
| [ACCOUNTS RETENTION] | privacy-policy |
| [ANALYTICS STATUS] | cookie-policy |
| [BALANCE TIMING] | custom-order-terms |
| [CANCELLATION CHARGE RULE] | custom-order-terms |
| [CARE INSTRUCTIONS] | safety-notice |
| [COMPLAINT RECORD RETENTION] | complaints-procedure |
| [COMPLAINT RESPONSE DAYS] | complaints-procedure |
| [CONSENT LEDGER YEARS] | privacy-policy |
| [CONTACT EMAIL] | terms-of-sale, custom-order-terms, wholesale-terms, returns-policy, delivery-policy, safety-notice, complaints-procedure |
| [COURIER NAME] | privacy-policy |
| [CREDIT PREFERENCE] | photo-consent |
| [CUSTOM LEAD TIME] | custom-order-terms |
| [DATABASE PROVIDER] | privacy-policy |
| [DATABASE REGION] | privacy-policy |
| [DELIVERY FEE REFUND RULE] | returns-policy |
| [DELIVERY ZONES AND FEES] | delivery-policy |
| [DEPOSIT AMOUNT] | custom-order-terms |
| [EMAIL PROVIDER] | privacy-policy |
| [EXCHANGE WINDOW DAYS] | returns-policy |
| [EXCLUSIVITY PERIOD] | custom-order-terms |
| [FAILED DELIVERY RULE] | delivery-policy |
| [HOLD PERIOD DAYS] | delivery-policy |
| [IMAGE DELETION PERIOD] | custom-order-terms, privacy-policy |
| [INSPECTION PERIOD DAYS] | terms-of-sale, wholesale-terms, returns-policy, delivery-policy |
| [INTERNATIONAL DELIVERY STATEMENT] | delivery-policy |
| [KNOWN ACCESSIBILITY ISSUES] | accessibility-statement |
| [LATE PAYMENT TERMS] | wholesale-terms |
| [LEGAL ENTITY NAME] | terms-of-sale, custom-order-terms, wholesale-terms, website-terms, privacy-policy, ip-notice, marketing-terms, photo-consent, stockist-permission |
| [LIABILITY CAP] | terms-of-sale |
| [LISTING REMOVAL DAYS] | wholesale-terms, stockist-permission |
| [LOGO YES OR NO] | stockist-permission |
| [MEDIATION COST RULE] | complaints-procedure |
| [MESSAGE FREQUENCY] | marketing-terms |
| [META PIXEL STATUS] | cookie-policy |
| [MINIMUM ORDER] | wholesale-terms |
| [NEW BUYER TERMS] | wholesale-terms |
| [NOTICE PERIOD] | wholesale-terms |
| [ODPC REGISTRATION NUMBER] | privacy-policy |
| [ORDER DATA RETENTION] | privacy-policy |
| [ORDER REFERENCE] | data-request |
| [PARTNER BUSINESS NAME] | stockist-permission |
| [PARTNER LINK] | stockist-permission |
| [PARTNER LOCATION] | stockist-permission |
| [PAY ON DELIVERY] | terms-of-sale |
| [PAYMENT METHODS] | terms-of-sale, custom-order-terms |
| [PAYMENT TERMS] | wholesale-terms |
| [PAYMENT TIMING] | terms-of-sale |
| [PERMISSION PERIOD] | photo-consent |
| [PERSON CONTACT] | photo-consent |
| [PERSON NAME] | photo-consent |
| [PHOTO DATE AND PLACE] | photo-consent |
| [PHYSICAL ADDRESS] | terms-of-sale, privacy-policy |
| [PICKUP LOCATION] | delivery-policy |
| [PRICE POLICY] | terms-of-sale |
| [PRIVACY CONTACT NAME] | privacy-policy |
| [PRIVACY EMAIL] | privacy-policy, cookie-policy, data-request, marketing-terms, photo-consent |
| [QUOTE VALIDITY DAYS] | custom-order-terms |
| [READY ITEM DELIVERY TIME] | delivery-policy |
| [REFUND METHOD] | returns-policy |
| [REFUND TIME DAYS] | returns-policy |
| [REGISTRATION NUMBER] | terms-of-sale, privacy-policy |
| [RELATIONSHIP] | photo-consent |
| [RESPONSE TIME HOURS] | terms-of-sale |
| [RETURN COST RULE] | returns-policy |
| [RETURN POLICY SUMMARY] | terms-of-sale |
| [RETURN WINDOW DAYS] | returns-policy |
| [REVIEW RESPONSE DAYS] | complaints-procedure |
| [ROLE: MAKER, CUSTOMER, STOCKIST OR OTHER] | photo-consent |
| [SIGNATURE DATE] | photo-consent, stockist-permission |
| [SIGNATURE] | photo-consent, stockist-permission |
| [SIGNER NAME] | photo-consent, stockist-permission |
| [SIGNER POSITION] | stockist-permission |
| [TAKEDOWN EMAIL] | website-terms, ip-notice |
| [TAKEDOWN RESPONSE DAYS] | ip-notice |
| [TIKTOK PIXEL STATUS] | cookie-policy |
| [TRADE RETENTION] | privacy-policy |
| [TRADE RETURNS RULE] | wholesale-terms |
| [TRANSFER COUNTRIES] | privacy-policy |
| [USES TICKED] | photo-consent |
| [VARIATION TOLERANCE] | terms-of-sale, custom-order-terms, wholesale-terms, returns-policy |
| [VAT STATEMENT] | wholesale-terms |
| [WITNESS NAME] | photo-consent |
| [YOUR NAME] | data-request |
| [YOUR PHONE] | data-request |
| [YOUR REQUEST] | data-request |

Also needed on every document: [EFFECTIVE DATE] (field `effectiveDate`).

## 4. Unverified legal points for the advocate

Read and cited [V] from the revised Consumer Protection Act text (Cap. 501, https://faolex.fao.org/docs/pdf/ken121992.pdf; Kenya Law page https://new.kenyalaw.org/akn/ke/act/2012/46/eng@2022-12-31 returned 403):
- s.5 merchantable quality warranty; s.5(3) void exclusion. Numbering in older copies is s.8; confirm.
- ss.12 to 16 unfair practices and rescission; s.21 late delivery (30 days); ss.31 to 33 internet agreements; ss.36 to 38 remote agreements; s.77 agreement not binding unless made as the Act and Regulations require; s.84 action; s.88 arbitration limit; s.92 penalty.

Open points:
1. Prescribed information and prescribed periods for internet and remote agreements sit in regulations not found. Does the WhatsApp flow satisfy ss.31, 32, 36, 37 (disclosure, chance to correct, written copy)? s.77 risk if not.
2. Is there a statutory change of mind or cooling off right? The Act text read gives cancellation rights only for specific agreement types or non compliant suppliers. Secondary sites claim 14 days. [U]
3. Is a no return term for personalised custom pieces enforceable, and the deposit forfeiture wording against s.13?
4. Limitation of liability and handmade tolerance wording against s.5(3).
5. Toy safety. KEBS lists KS ISO 8124 parts (https://kebs.org/wp-content/uploads/2023/09/List-of-approved-standards-July-2021.pdf [U]). "KS EAS 777" in the brief appears to be a food standard, not a toy standard; do not cite it. Is any toy standard compulsory for a small handmade producer, is a standardization mark or permit needed (Standards Act s.10), and should the owner test to EN 71 or ISO 8124 before sales to schools and lodges? Until a certificate exists the notice says not tested or certified.
6. Data Protection Act points from strategy/17 section 10: registration now, DPIA, s.37 consent against reg 15(1), occasion types as sensitive data, retention periods, Vercel DPA and transfers, children's photos under s.33 and the parent consents for published photos, ODPC fees and portal.
7. Sale of Goods Act ss.15 to 17, 20, 22 numbering [U].
8. KICA s.83J electronic contracts and s.83G writing [U numbering]; Kenya Information and Communications (Consumer Protection) Regulations 2010 on direct marketing, hours and opt out [U]; Communications Authority SMS rules (no SMS marketing in release 1).
9. Copyright Act (Cap. 130): duration and s.35B takedown [U]; owner's clearance of site photos (R1) and releases for identifiable people, especially children.
10. Trade marks: Mikono name and logo registration at KIPI (https://www.kipi.go.ke); passing off.
11. Computer Misuse and Cybercrimes Act 2018 ss.14 and 16 [U]; 2025 amendments reported, check.
12. VAT: threshold reported as KES 8 million (KES 5 million voluntary) and eTIMS invoicing from secondary sources [U]; check with KRA and the VAT Act 2013. Turnover tax 3% below threshold [U].
13. Advertising standards (Advertising Standards Society of Kenya or equivalent code) not verified. The safety claim rules (D26) already keep copy inside approved claims.
14. Competition Authority consumer complaint route and Competition Act on trade terms (no resale price fixing) [U].
15. Mediation provider, jurisdiction, small claims limit.

## 5. Implementation note (routes to create)

Another agent edits site code; this pack does not touch it. Build from `content/legal/index.ts` with one renderer that maps `sections` to headings with `id` anchors, a version and effective date line, and a "Draft, to be reviewed by an advocate" banner until sign off.

| Route | Document |
|---|---|
| /terms (replace draft) | termsOfSale |
| /terms/custom | customOrderTerms |
| /terms/wholesale | wholesaleTerms |
| /terms/website | websiteTerms |
| /privacy (replace draft) | privacyPolicy |
| /cookies (keep the live key table; append the policy text) | cookiePolicy |
| /returns | returnsPolicy |
| /delivery (replace draft) | deliveryPolicy |
| /safety-notice | safetyNotice (/safety stays the product safety page) |
| /accessibility | accessibilityStatement |
| /complaints | complaintsProcedure |
| /data-request | dataRequest (add the form text and the same-reply message) |
| /legal | index of publicDocuments; also host /legal/ip and /legal/marketing |

Wiring: render the acceptance checkbox from `acceptance.checkout|custom|wholesale` (unticked, required, version id stored), append `orderMessageLine` to every message, replace the cookie bar strings, replace footer legal links with `footerLegalLinks`, add all new routes to sitemap. Keep the cookies table in sync with lib/storageKeys.ts. The Studio multi-piece work and helper changes in the coordinator note are not part of this pack and were not touched.
