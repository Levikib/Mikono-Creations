# 09 Custom Order Studio (build-ready spec)

Status: Draft v0.1, 2026-10-02. Author: Workflow Architect. Subordinate to 00-CHARTER.md and 07-BUILD-DECISIONS.md (D16, D18, D20, D22 to D26, R5, R7, R9, R10). Extends 02 section 5.4 and replaces the `kind="custom"` branch of `components/TradeEnquiryForm.tsx` and the body of `app/custom/page.tsx`.

Grounding facts used here, all verified in the repo: ref prefix `CU` exists in `lib/whatsapp.ts` `generateRef`; `sendEnquiry` in `lib/enquiry.ts` already opens WhatsApp, copies the full text and fires `generate_lead` with `lead_type: "custom"`; the URL budget is 2000 characters with a short fallback; `pricesConfirmed` is false (R7); sizes are S, M, L, XL with no centimetres (R5); the catalogue has 30 products and 49 colourway entries in `data/catalogue.generated.json`; `data/colours.ts` maps colour keys to seven families; the SizeLadder component is illustration only.

Rules carried into every screen and message: no prices, no lead times and no feasibility promises that the owner has not supplied (R7, charter rule 3); no child names, surnames, schools or ages anywhere (D16); no countdowns, no pre-ticked boxes, no pressure copy; "animals" never "toys" (R10); no em dashes or en dashes; the charter banned-phrase list applies; approved safety claims only (R9, D26).

---

## 1. Custom order types

Twelve types. Each is a visual card in Step 1. The type sets which later questions appear (section 2) and which "maker needs" fields enter the brief. "Maker needs" lists what Mikono must know before it can quote. Everything under "to confirm" is an owner decision, never a site promise.

| # | Type | Who it is for | Maker needs to know |
|---|---|---|---|
| 1 | Make it my way (a showcased animal in new colours, size or details) | Private customers, gift buyers | Which animal (from catalogue), size class, colours, details, quantity, date |
| 2 | Something new (an animal we do not show yet, from a photo, sketch or link) | Private customers, collectors, lodges | Reference images or link, which parts matter most (face, colour, ears), size class, how close it must look |
| 3 | Pet or character in yarn (a pet photo, a storybook or cartoon character, a mascot idea) | Pet owners, families, schools | Several clear photos from different sides, markings, colours, eye colour, what to keep or simplify. Licensed characters: whether the customer owns or may use the rights |
| 4 | From a child's drawing | Parents, grandparents, teachers | A photo of the drawing, which parts to keep, colours as drawn or tidied, size class. The adult submits the brief. No child name or age is asked or sent |
| 5 | Keepsake or memorial piece | Families remembering a person or a pet | Reference photos or a favourite colour, any fabric or yarn the family wishes to include (to confirm if possible), deadline if tied to a date. Tone: gentle copy, a phone call offered, no upsell |
| 6 | Wedding, baby shower and naming sets | Private customers, event planners | Quantity, theme colours, set composition (for example a matching pair or a family set), event date, delivery venue |
| 7 | Event favours and party animals | Birthdays, parties, church and community events, planners | Quantity band, one design or several, colours, event date, delivery area, whether tags or labels are wanted |
| 8 | Branded or mascot animal | Businesses, brands, sports clubs, schools | Brand colours (swatch or logo file reference), what is stitched (name tag, logo as a patch idea), quantity, whether a logo file will be sent by WhatsApp, who approves the sample |
| 9 | Corporate gifts and staff or client gifting | Companies, banks, agencies | Quantity, one or many designs, branding wish, delivery sites, invoice needs (handled by a person, not collected here), date |
| 10 | Hotels, lodges and shops | Hospitality, gift shops | Species fit for the guest or retail setting, size mix, colours matching interiors, quantity, whether repeat orders are expected. Routes to the wholesale path (D21) for price list questions |
| 11 | Schools, NGOs and community projects | Schools, charities, programmes | Group purpose, quantity, animals that fit the story, whether a project or donation angle applies (links to `/projects`), date. Aligns with 02 section 5.2 partnership wording |
| 12 | Wall animals and special formats (wall heads, handbag-style pieces, dolls) | Interior buyers, collectors | Which existing format, colours, size class, mounting needs. Only offered where the catalogue shows the format |

Cross-cutting needs captured for all types: contact name (an adult), phone for WhatsApp, optional email, delivery area (Nairobi area, another Kenyan town, pickup), deadline and whether it is flexible, quantity, optional budget range, consent for photos (section 3).

"Who is this for" is one adult question at the start of the contact step: "Me", "A gift for someone", "A group or event", "A business or organisation". It routes business and organisation answers to the quote pathway with bulk wording (section 2, Step 6) and never asks about the recipient child.

---

## 2. The Custom Studio experience

Route: `/custom` (hub and Studio), deep links `/custom?animal=giraffe` and `/custom?type=child-drawing`. Pure client state in a `useReducer`, persisted to `localStorage` key `mk.studio.v1` for 14 days (same retention as the wizard draft, D16 rule: no names, phones or addresses persisted until the user sends; only choices and text notes are kept, with a "Clear my brief" button). Inspiration image files are never persisted in the browser store; only URLs and colour choices are.

Layout: mobile first, one question per screen, a sticky bottom bar with Back and Next (min 48px), a progress strip "Step 3 of 8" computed from the active step list, and a live brief card. On widths of 1024px and above the brief card sits in a right column and is always visible. On mobile it is a collapsible bar at the top reading "Your brief: Giraffe, L, 2 colours" that expands into a bottom sheet.

Voice: warm, plain, concrete. Example: "Tell us what you imagine. A rough idea is fine."

### Step 0. Studio landing (the page shell)
Hero with a short line: "Dream up your own crocheted animal. Made by hand in Nairobi." Three cards: "Start from an animal we make", "Start from a photo or drawing", "Start from an occasion". Below: a strip of six real customer-facing animal photos from the catalogue (hero images, uniform ratio per rule 5), the honest expectation box (below), and links to wholesale and the FAQ.

Honest expectation box (fixed copy): "Every piece is crocheted by hand, so it will look like a handmade cousin of your idea, not a copy. We tell you what is possible, the price and the time on WhatsApp before you pay anything. Lead times and prices are not published yet." Owner can later replace the last sentence with real lead times (open question Q2).

### Step 1. What are you making? (type cards)
Twelve visual cards (section 1). Each card has a real photo from the catalogue or a drawn glyph, a title, a one-line example. Large touch card, minimum 120px tall, 2 columns on 390px, 3 on tablet, 4 on desktop. Single choice, radio semantics. A secondary text link "Not sure? Tell us in a few words" jumps to the free note step with type set to `not_sure`.

Validation: one type required. Brief card shows the type chip.

### Step 2. Your inspiration (mood board)
Purpose: collect references without a backend in MVP.
- Panel A "From our animals": a horizontally scrollable gallery of the 30 catalogue products (hero image per product, uniform crop). Tap to add as "like this" or "not like this" (two small toggle buttons per card, not hidden gestures). Up to 6 picks.
- Panel B "Your own references": three input paths, each a card.
  1. Photos or drawings (MVP: instruction card with "You will attach these in WhatsApp. Tap to see how." plus a "How many will you send?" count stepper 0 to 10. v2: real upload, section 3).
  2. Links (Pinterest, Instagram, Google Photos, Drive, any URL): up to 5, validated as `http` or `https`, rendered as chips with the domain only.
  3. Describe it: a text box "Tell us about the shape, face, ears, tail" (max 600 characters) with a character counter that is announced politely at 80 percent only.
- Panel C "Mood board": a board of everything picked. Items are reorderable by keyboard (move up, move down buttons) and by drag on touch. Each item has a role: "Shape", "Colour", "Face", "Detail", "Whole idea". Roles become lines in the message. Max 12 items.
- Tag chips for feel: "Soft and cuddly", "Realistic", "Cartoon", "Tiny", "Chunky", "Calm colours", "Bright colours". Mood chips are free multi-select and optional.

Child drawing and pet types add a gentle line: "Photograph the drawing flat, in daylight. Please do not include a child's name or school in the picture."

### Step 3. Base form
Cards: "One of our animals" (opens the 30-product picker, grouped by the three shop categories plus wall animals and dolls, using `lib/catalogue.ts`), "Close to one of ours" (pick the nearest animal as a starting point, then describe the difference), "Brand new shape" (no base). Each card has a short honest note: "We confirm if the shape can be crocheted the way you picture it."
Fields: `baseSlug` (optional for new shapes), `baseRelation` (`exact`, `close_to`, `new_shape`).
Edge: arriving from a product page pre-fills `baseSlug` and `baseColourway` and skips to Step 4.

### Step 4. Size (S, M, L, XL ladder)
Four large cards, each with the SizeLadder illustration highlighting one rung. No centimetres (R5). Relative comparison text only, for example S "The smallest we make. Fits in a hand", M "A little bigger than S", L "A good hug", XL "The biggest we make. A statement piece". These phrases are placeholders for owner approval (Q4) and carry the tag `data-todo`. A fifth card "Not sure, advise me". For sets and favours: "Same size for all" or "Mix of sizes" with a per-size quantity stepper.
Edge: some bases may not exist in all sizes. Copy: "We tell you which sizes are possible."

### Step 5. Colours and details
Colour picker, built only from real data:
- Source: `data/catalogue.generated.json` colourways, deduplicated by label, grouped by `colourFamilies` in `data/colours.ts` (Neutrals, Browns and tans, Yellows and oranges, Reds and pinks, Greens, Blues and purples, Multicolour). Neutrals first, per the Photo Colour Rule.
- Swatch rendering follows D30: a photo crop of the actual colourway image or a text chip with the printed name. No clamped hex and no invented palette. A swatch is the crop at the image `focal` point, in a round 56px target (inside a 48px minimum touch area).
- Slots: "Main colour" (required unless a photo is the colour source), "Second colour", "Details colour" (nose, ears, inner ear, mane, dress). The user can pick up to 3 colours plus a free text "Anything else about colour".
- Honest line under the picker: "Yarn shades can vary slightly from lot to lot. We send a photo of the actual yarn before we start." The first sentence is not in the brief facts (D40 treats "yarn lots vary" as unconfirmed), so it ships behind `data-todo` until the owner confirms (Q5).
- "Match this photo" option: the user picks a reference photo or the main inspiration image. MVP: a button "Match the colours in my photo" sets `colourSource: "photo"` and shows "We will pick the closest yarn shades from the photo and send you swatch photos to approve." No automatic extraction. v3 only: optional on-device colour sampling that suggests the nearest catalogue swatches, always human reviewed.
- Colour brief for brands: a text field "Brand colour names or codes" (free text, 120 characters), no file.

Details (all optional, all labelled "to be confirmed"):
- Name tag stitched (text up to 20 characters; helper: "A name or word. Please do not use a child's full name, school or age").
- Outfit (cards: none, scarf, vest, dress, hat, other).
- Accessories (bow, bag, glasses, other).
- Packaging (plain, gift wrap, box, other).
Each card carries a "To be confirmed" badge and the sentence "We tell you what is possible and the cost on WhatsApp." No price shown.

### Step 6. How many, and when
- Quantity stepper 1 to 99, then a switch "I need more than 99 or a mixed set". At or above `QUOTE_THRESHOLD_UNITS` (D21 constant) a soft message appears: "For larger orders we prepare a quote on WhatsApp with a person. You can still continue here." Never blocks.
- Bulk and event path: when type is 6 to 11 or quantity passes the threshold, extra fields appear: "Event or project name" (an adult-facing label, not a child's name), "Mix of designs" (one, two to three, several), "Delivery sites" (one, several).
- Deadline: a date picker with a native `<input type="date">` plus "Flexible" and "Not sure" chips. A mandatory honest line: "Handmade takes time. Tell us your date and we will say honestly if it is possible." No countdown, no "order now" pressure.
- Delivery: Pickup, Nairobi area (select from `data/deliveryAreas.ts`), other Kenyan town (text). Fee shown as "to be confirmed" (D17).

### Step 7. Budget (optional)
Question: "Do you have a budget in mind? You can skip this." Four range cards (the owner defines the actual bands, Q6): `band_1` to `band_4`, labels read `{{BUDGET_BAND_1}}` and so on in config until supplied. Fifth card "I would rather you suggest". Sixth chip "Skip". If the owner supplies no bands, this step is removed from the active step list and step counts recompute. Copy: "A range helps us suggest what fits. It does not commit you to anything."

### Step 8. Contact and consent
Fields: contact name (adult), phone (normalised with `lib/phone.ts`), optional email, "Who is this for" (section 1), delivery area (carried), preferred contact time (optional chips: morning, afternoon, evening), marketing consent (unticked, separate), and photo consent (section 3) shown only if the user chose to attach or upload references.
Privacy line: "We use your details only to answer this brief. WhatsApp also sees the message." Link to `/privacy`.

### Step 9. Review and send
The full brief card as a read-only summary with "Edit" links per block. Primary button: "Send brief on WhatsApp". Secondary: "Copy brief" and "Save for later" (stores the draft on the device). After tapping Send: result screen (reuse `EnquiryResult`) showing ref `CU-YYMMDD-XXXX`, the three next steps, the attach-photos instruction block (large, with "Open WhatsApp again" and "Copy brief again"), and the quote path summary (section 4).

### Live brief card (component `BriefCard`)
A claymorphism card that updates on every change and doubles as the review screen. Header: type chip and base animal thumbnail. Rows: Animal, Size, Colours (swatch crops), Details (tagged to be confirmed), Quantity, Deadline, Delivery, Budget, Inspiration thumbnails (counts, first 4). Empty rows show a soft prompt, not an error. `aria-live="polite"` region announces only the changed row label ("Size set to L"), debounced to 800ms. Fixed card height rule from charter rule 5 applies to the thumbnail grid.

### Feasibility notes and expectations
A "What we will check" box, fixed text, no promises: "We look at the shape, the size, the colours and the date. Some ideas need changes to work in crochet. We tell you exactly what and why." Dynamic hints (client side only, rule based, advisory): a new shape with XL size shows "Large new shapes take the longest to plan. We will confirm what is possible." Deadline within 14 days shows "That is soon for handmade pieces. We will tell you honestly." The 14 day number is a placeholder constant `SOON_DAYS` until the owner supplies a real figure (Q2), and the message avoids stating a lead time.

---

## 3. Inspiration images without a backend

### Options and trade-offs

| Option | How it works | Pros | Cons |
|---|---|---|---|
| (a) WhatsApp attach | The brief text opens in WhatsApp. The result screen instructs "Attach your photos to this chat". Brief has a line "I will send N photos here" | Zero infrastructure, zero hosting of personal data by us, fits D18 exactly, works on every phone, the maker already lives in WhatsApp, no abuse surface on the site | A second manual step. Some users forget. Cannot verify photos arrived. No preview inside the brief |
| (b) Vercel Blob upload | Browser uploads through a route handler (or client upload token), links go into the message | Photos arrive with the brief, mood board thumbnails, fewer lost steps | Creates a data controller duty for the images, abuse and storage risk, needs rate limiting and moderation, retention and deletion work, child photo risk, WhatsApp URL length grows, cost, and a public blob URL is guessable if public |
| (c) Email form via a Marketplace email service | The form posts to a route that emails the brief with attachments | Familiar for businesses, attachments supported | Needs the owner's email provider choice (D18 still open), attachment size limits, spam surface, adds a second channel next to WhatsApp, no better privacy than (a) |

### Recommendation
Ship (a) as MVP, with a strong attachment instruction and a rich brief card, because it matches D18 and keeps child photos off our infrastructure by default. Add (b) in v2 as an optional path, never required, using private blobs only, after the owner approves the privacy notice and a deletion routine. Skip (c) unless the owner picks an email provider for the wholesale flow anyway.

### MVP attachment design (option a)
- The message contains the line "Reference photos: I will attach N in this chat" plus any links.
- The result screen has a numbered instruction card with plain steps: tap the paperclip in WhatsApp, choose Gallery or Camera, pick up to 10 images, send. A short looping illustrated GIF is not used (motion and data cost); use three static drawn steps.
- A "Nudge" is shown on the result page and via a gentle line in the chat template ("Photos coming right after this message"). No timer, no pressure.
- On Android and iOS, the `<input type="file" accept="image/*" capture>` is not used in MVP because nothing is uploaded. The user takes the photo in WhatsApp directly.

### v2 upload design (option b), build-ready requirements
Provider: Vercel Blob (verify current docs at build time, Vercel Marketplace storage skill). Access: private, not public.
- Route: `POST /api/studio/upload-token` issues a short-lived client upload token (or `POST /api/studio/upload` receives the file). Response: `{ ok: true, uploadId, expiresAt }`.
- Limits: up to 8 images per brief, 8 MB each, 24 MB total. Types allowed by content sniffing, not only extension: JPEG, PNG, WebP, HEIC (converted client side). Reject SVG, GIF, PDF, executables and anything else.
- Client side: strip EXIF location with a canvas redraw before upload, resize to a long edge of 2000px, show thumbnails with remove buttons.
- Abuse and virus controls: file type sniffing, size caps, a Vercel WAF rate limit rule (for example 10 uploads per IP per hour, to be tuned), a honeypot field, a Turnstile or similar challenge only when the rate rule trips (not on first paint), `Content-Disposition: attachment` on read, a malware scan hook (provider or scan service chosen by the owner, Q8), and no execution of uploaded content ever.
- Link handling: the WhatsApp message carries a short unguessable link (`/s/<token>`) that resolves to a private viewing page protected by a signed token for staff, never a raw blob URL. Customers never get a public image URL.
- Retention: delete images 90 days after the brief is closed (quote declined, delivered or abandoned), and 30 days if the user never sent the brief. The retention days are placeholders for owner and lawyer (Q7). A scheduled Vercel Cron job runs the deletion and logs the count, not file names.
- Deletion on request: a form line "Delete my photos" in the result screen produces a WhatsApp message with the ref, and the maker deletes within a stated period (TODO). Also a `DELETE /api/studio/upload/<id>` with the customer token for self service.
- Consent: an unticked checkbox "I agree Mikono can keep these photos to make my quote and my animal, and delete them as described. I have the right to share them." Separate from marketing consent. Photos are never used in marketing without a new, specific question (this overrides charter R1 for customer-supplied references, which are not the owner's media).
- Failure UX: if upload fails, the flow offers option (a) as an automatic fallback.

### Kenya Data Protection Act, 2019 implications (design basis, not legal advice; TODO lawyer)
- Mikono acts as data controller for briefs and photos and should confirm ODPC registration (02 section 9 already flags this, Q9).
- Principles: purpose limitation (photos used only to quote and make), minimisation (ask only what the brief needs), storage limitation (retention above), integrity and confidentiality (private storage, access list), and transparency (notice on the review step and in `/privacy`).
- Consent must be informed, specific, unticked and withdrawable. Withdrawal path: "Send STOP or DELETE with your ref on WhatsApp".
- Rights: access, correction and deletion. Mikono needs an internal rule and a named contact (TODO).
- Cross-border transfer: hosting outside Kenya and WhatsApp are third parties. The privacy text must say so. Vercel region choice is a decision for the owner (Q10).
- Children: the Act restricts processing of a child's personal data and expects parent or guardian consent and the child's best interests (confirm section reference with a lawyer). Photos of children and faces of children are personal data.

### Child photo rules (apply to all options)
1. The submitter must be an adult. A line says so on Step 8.
2. The Studio never asks for a child's name, age, school or photo of a child. Drawings are welcome. Pet photos are welcome. Photos that show a child's face are discouraged: "If your photo includes a child, please crop to the drawing or the toy only."
3. If a face of a child is visible in a photo, v2 shows a soft warning at upload (no detection in MVP). Detection is out of scope until the owner agrees (v3 only, human review).
4. Images of children are never used in the gallery, journal or social posts under any rule that exists for catalogue media (R1 does not extend to customer references).
5. Staff access list is the maker and the owner only. Photos are not forwarded or posted. Written internal rule needed (Q11).
6. Name tags: a stitched name is an adult choice and the helper text asks for a first name or a word, never a surname, school or age.

---

## 4. The quote path after submission

State machine for a brief (owner-facing, tracked in the owner's WhatsApp or a Sheet; no database in MVP):

`submitted` to `reviewing` to `clarifying` to `quoted` to `approved` to `deposit_pending` to `in_production` to `ready` to `delivered` to `review_requested`; side exits: `declined_by_customer`, `cannot_make`, `expired`, `abandoned`.

1. Reference: `CU-YYMMDD-XXXX` from `generateRef("CU")`. Shown on screen, in the message and in every later message.
2. Acknowledgement: a person replies on WhatsApp using a saved reply "Thank you. We have your brief CU-... and will reply with questions or a quote." The time to reply is stated only when the owner supplies it (Q2).
3. What the business does: (i) checks feasibility on the five criteria: shape, size, colours, yarn availability, date; (ii) asks clarifying questions in one batch; (iii) sends 2 to 4 yarn swatch photos for approval where colours matter; (iv) prepares the quote.
4. Quote template (WhatsApp text, owner fills; the site never invents numbers):

```
Quote for CU-YYMMDD-XXXX
Item: {animal} in size {S|M|L|XL}, colours {list}
Details: {tag, outfit, accessories, packaging or "none"}
Quantity: {n}
Price per piece: KES {____}
Extras: {list with KES ____ or "none"}
Delivery: {method}, KES {____} or "to be confirmed"
Total: KES {____}
Ready by: {date or "to be confirmed"}
Deposit to start: KES {____} ({____}%) via {PAYMENT_METHOD}
Valid until: {date}
Please reply "Approved CU-... " to confirm.
```
5. Approval: the customer replies "Approved" with the ref. The business then sends the payment instructions. A one-line change list is kept for edits. No pressure: "Take your time. This quote is valid until {date}."
6. Deposit: M-Pesa Paybill or Till, bank, or cash at pickup. Placeholder `{PAYMENT_METHOD}` and `{DEPOSIT_PERCENT}` until the owner decides (Q3). The site never collects payment (D18).
7. Production updates over WhatsApp at agreed points: start, a progress photo at the shape stage, a photo before packaging. Each update starts with the ref. Whether progress photos are sent is an owner decision (Q12).
8. Delivery: confirm address, courier or pickup, fee, date. Mark `delivered` when the customer confirms.
9. Review request: 3 days after delivery (placeholder), one warm message with a link to leave feedback by reply. No incentive tied to a rating. Reviews are not published without permission (D36: reviews are excluded from release 1).
10. Abandonment: if no reply after a quote, one polite nudge after 5 days (placeholder), then close. No repeated pestering.

The owner-facing record is a simple Google Sheet or the WhatsApp Business labels (New, Quoted, Approved, In production, Ready, Done). Not a spec dependency; the data model below can export to a Sheet row later (D18).

---

## 5. Data model and message template

```ts
// lib/studio/types.ts
export type CustomType =
  | "base_variation" | "new_animal" | "pet_or_character" | "child_drawing"
  | "keepsake" | "wedding_shower" | "event_favours" | "branded_mascot"
  | "corporate_gift" | "hotel_lodge_shop" | "school_ngo_project" | "wall_or_special";

export type SizeClass = "S" | "M" | "L" | "XL" | "advise";
export type BaseRelation = "exact" | "close_to" | "new_shape";
export type ColourSource = "swatches" | "photo" | "brand";
export type TbcDetail = { key: "name_tag" | "outfit" | "accessory" | "packaging"; choice: string; text?: string; status: "to_be_confirmed" };

export interface InspirationItem {
  id: string;                      // client uuid
  kind: "catalogue" | "link" | "photo_note" | "description";
  role: "shape" | "colour" | "face" | "detail" | "whole";
  catalogueSlug?: string;          // when kind = catalogue
  preference?: "like" | "avoid";   // for catalogue picks
  url?: string;                    // when kind = link, http or https
  note?: string;                   // max 300 chars
  // v2 only:
  upload?: { uploadId: string; mime: "image/jpeg" | "image/png" | "image/webp"; bytes: number; consentAt: string };
  // never: any child name or age
}

export interface ColourPick { key: string; label: string; family: string; slot: "main" | "second" | "details" } // from catalogue colourways

export interface CustomBrief {
  type: CustomType;
  baseRelation: BaseRelation;
  baseSlug?: string;
  baseColourwayKey?: string;
  size: SizeClass;
  sizeMix?: Partial<Record<"S" | "M" | "L" | "XL", number>>;
  colours: ColourPick[];           // max 3
  colourSource: ColourSource;
  colourNote?: string;
  brandColourNote?: string;
  details: TbcDetail[];
  quantity: number;
  bulk?: { eventLabel?: string; designMix: "one" | "two_three" | "several"; sites: "one" | "several" };
  deadline: { date?: string; flexible: boolean; unsure: boolean };
  delivery: { method: "pickup" | "nairobi" | "town"; area?: string; town?: string; county?: string };
  budget?: { band: "band_1" | "band_2" | "band_3" | "band_4" | "suggest" | "skip" };
  mood: string[];                  // chips
  inspiration: InspirationItem[];  // max 12
  note?: string;
  forWhom: "me" | "gift" | "group_event" | "business_org";
}

export interface QuoteRequest {
  ref: `CU-${string}`;
  brief: CustomBrief;
  contact: { name: string; phoneE164: string; email?: string; contactTime?: "morning" | "afternoon" | "evening" };
  consent: { marketing: boolean; photos?: { given: boolean; at: string; version: string } };
  source?: string;                 // attribution, D24
  createdAt: string;               // ISO, Africa/Nairobi aware
  channel: "whatsapp";
  attachMode: "whatsapp_attach" | "upload_v2";
  attachCount: number;             // user declared (MVP) or uploaded (v2)
  status: QuoteStatus;
}
export type QuoteStatus = "submitted" | "reviewing" | "clarifying" | "quoted" | "approved" | "deposit_pending"
  | "in_production" | "ready" | "delivered" | "review_requested" | "declined_by_customer" | "cannot_make" | "expired" | "abandoned";

export interface Quote {
  ref: string;
  lines: { description: string; qty: number; unitKes: number | null }[];
  extrasKes: { label: string; kes: number | null }[];
  deliveryKes: number | null;      // null = to be confirmed
  totalKes: number | null;         // only the maker fills this
  depositKes: number | null;
  paymentMethod: string | null;    // owner decides
  readyBy: string | null;
  validUntil: string | null;
  approvedAt?: string;
}
```
No field stores a child's name or age (D16). `Quote` is owner-side only; nothing prices on the public site (R7, D20).

### WhatsApp message template (MVP)
Built by a new `buildCustomBriefMessage` in `lib/whatsapp.ts` using `buildEnquiryMessage` fields, planned by `planEnquirySend`. Line order is fixed so the maker can scan it. Empty lines are omitted. Full text is always copied to the clipboard (as `sendEnquiry` does).

```
Hello Mikono Creations, custom order brief.
Ref: CU-261002-7KQ2
Source: instagram / paid / xmas-2026

TYPE: Wedding or baby shower set
FOR: A gift for someone
ANIMAL: Close to Giraffe (giraffe)
SIZE: L
COLOURS: Main Cream, Second Caramel tan, Details Lavender
COLOUR NOTE: Soft and calm, matching a sage green ribbon
EXTRAS (to be confirmed): Name tag "Welcome", Packaging gift wrap
QUANTITY: 12 (mix of designs: two to three)
DEADLINE: 2026-12-05 (flexible: no)
DELIVERY: Nairobi, Kilimani
BUDGET: {{BAND_LABEL}}
MOOD: Soft and cuddly, Calm colours
INSPIRATION: 3 catalogue picks (Giraffe like, Zebra like, Lion avoid), 2 links, 4 photos
LINKS: pinterest.com/..., photos.app.goo.gl/...
NOTE: ...

I will attach 4 photos in this chat after this message.
Photo consent: Yes, for making my quote and animal. I can ask to have them deleted.
Prices, time and what is possible: please confirm on WhatsApp.

CONTACT: Name, +2547XXXXXXXX
Marketing messages: No
Sent from mikono-creations.vercel.app
```
(The example name tag is generic. The template never includes a recipient child name unless the adult chooses a first name for a tag.) If the URL exceeds 2000 characters, `planEnquirySend` falls back to the short ref message and the full text is copied for pasting (existing behaviour).

---

## 6. Analytics events

Respect consent (existing `track`). Reuse existing names (D22) and add Studio-specific events through `TRACK_EVENTS`. All events carry `studio_session` (random per page load, not persisted), `lead_ref` once sent. Never send brief free text, links, phone, names or inspiration content.

| Step | Event | Params |
|---|---|---|
| Landing | `studio_view` | `entry` (nav, home, product, cart, 404, journal, gifts, wholesale, footer, float, post_order) |
| 1 | `studio_type_select` | `type` |
| 2 | `studio_inspiration_add` | `kind` (catalogue, link, photo_note, description), `count` |
| 3 | `studio_base_select` | `relation`, `slug` |
| 4 | `studio_size_select` | `size` |
| 5 | `studio_colour_select` | `slot`, `family`, `source` (swatches, photo, brand) |
| 5 | `studio_detail_toggle` | `detail`, `on` |
| 6 | `studio_quantity_set` | `band` (1, 2 to 5, 6 to 19, 20 to 99, 100 plus), `bulk_path` |
| 6 | `studio_deadline_set` | `type` (date, flexible, unsure), `days_out_band` |
| 7 | `studio_budget_set` | `band` or `skip` |
| 8 | `studio_contact_complete` | none |
| Every step | `wizard_step_complete` | `flow: "studio"`, `step` (reuses D22 event) |
| 9 | `generate_lead` | `lead_type: "custom"`, `lead_ref`, `type`, `attach_mode`, `qty_band`, `has_inspiration` |
| Result | `studio_attach_instruction_view`, `whatsapp_click` (re-open) | `lead_ref` |
| Errors | `studio_error` | `code`, `step` |
| Drop | `studio_abandon` (visibilitychange, best effort) | `last_step` |

Entry attribution: `?src=<entry>` is added to every Studio CTA link and stored in memory first, per D25.

Funnel metrics: landing to type (activation), type to sent (completion rate), step drop-off per step, median time to send, share of briefs with inspiration, share using the colour picker vs "match this photo", share on bulk path, mean attached photo count, WhatsApp re-open rate, quote approval rate and median hours to first reply (owner-side, tracked manually, matched by ref). Target numbers are not set here (no invented targets); benchmarks come after 30 days of data.

---

## 7. Failure modes, edge cases, accessibility, mobile

### Failure modes and recovery

| Case | Handling |
|---|---|
| WhatsApp number env missing | Existing `numberSet` false state: show copy button and "Message us at {phone}". Never silent |
| Popup blocked or `wa.me` fails | `EnquiryResult` shows "Open WhatsApp" link and "Copy brief" |
| Message too long | `planEnquirySend` fallback (short message + full text copied) |
| localStorage blocked | Flow works in memory, a note "We could not save your draft on this device" |
| Invalid link | Inline error per field "That link does not look right. Check it or leave it out" |
| Phone invalid | Existing `normalisePhone` message |
| User leaves mid-flow | Draft persists 14 days; "Continue your brief" banner on `/custom` |
| Colour data missing for a swatch | Fall back to text chip with printed name (D30) |
| Catalogue changes | Colour list built at build time; a colour key with no family throws at build (existing `familyOf`) |
| Back navigation | Step state in URL hash `#step-4`; Back preserves values |
| Two tabs | Last write wins; draft has `updatedAt`, newer overwrites older with a toast |
| Photos never attached (MVP) | Quote step asks in the first reply; cannot be enforced |
| v2 upload partial failure | Per file retry x2, then drop file and tell the user which; brief can still send |
| v2 abuse spike | WAF rule trips, challenge appears, uploads disabled by env flag `STUDIO_UPLOAD=off` falling back to MVP |
| Concurrent identical briefs | Refs are random; the maker deduplicates by phone and content |
| Unsupported request (licensed characters, logos not owned) | Maker replies with limits. Copy on the character card: "We can only make characters you have the right to use" |
| Same-day or impossible dates | Advisory hint only, no block |

### Edge cases
Brief with no inspiration is valid (a description alone is enough). `forWhom: business_org` plus quantity above threshold adds a soft link "Prefer a wholesale price list? Go to wholesale" (D21). Wall animals hide size ladder wording that implies height. Dolls and handbag types skip the animal base picker and show only the relevant product.

### Accessibility (WCAG 2.2 AA)
- Keyboard: every card is a `<label>` wrapping a visually hidden `<input type="radio|checkbox">`, with a visible 3px focus ring; arrow keys move within radio groups; Next, Back and Send are reachable in order; the mood board reordering uses "Move up" and "Move down" buttons, not drag only.
- Screen reader: each step has an `<h2>` that receives focus on step change; progress is announced as "Step 4 of 8, Size"; the brief card has `role="region"` with `aria-label="Your brief"` and a polite live region for changes; swatches have text names ("Caramel tan, from the Lion photo"); the SizeLadder keeps its `sr-only` caption; error summary uses the existing `ErrorSummary` pattern with focus.
- Targets 48px and spacing of at least 8px; body text at least 16px; contrast AA with the UI chroma cap (R3).
- Reduced motion: no card bounce, no parallax, no auto-advance; transitions drop to opacity only under `prefers-reduced-motion`. Playfulness comes from layout, colour crops and the drawn illustrations, not constant motion.
- No time limits. No hover-only controls. Colour is never the only signal (selected state has a tick icon and text).
- Cognitive: one decision per screen, plain words, skippable optional steps labelled "Optional".

### Mobile first interactions
- Cards at least 120px, 2 columns on 390px; horizontally scrollable galleries use scroll-snap and show a peek of the next card; buttons for arrows exist for non-touch.
- Swipe: gallery rails swipe; steps do not swipe (avoid accidental navigation).
- Camera: from v2, "Take a photo" uses `<input type="file" accept="image/*" capture="environment">` and "Choose from gallery" a second input without `capture`. In MVP both are explained as WhatsApp steps.
- Sticky bottom bar clears the iOS safe area; the WhatsApp float hides during Studio steps (D34: hide whenever a sticky action bar is present).
- The brief bottom sheet is dismissible by swipe down, close button and Escape.
- Network: the Studio is static, steps cost no requests; v2 uploads show progress and resume per file.

---

## 8. Where the Studio CTAs appear

Primary label: "Design your own animal". Alternates: "Make it your own", "Start a custom order", "Create a custom animal". Short form for tight spots: "Custom order". Decision on final wording: Q13. Every CTA links to `/custom` with `?src=` and, on product pages, `animal` and `colourway`.

| Placement | Label options | Notes |
|---|---|---|
| Header nav | "Custom orders" (exists in `lib/menu.ts`) becomes "Design your own" | Added as a secondary nav link beside Contact. Keep D2 nav limit: put under Shop mega panel and mobile menu, not a sixth top item |
| Home hero | "Design your own animal" as a secondary button beside Shop | Never replaces the primary shop CTA |
| Home bento or section | "Want something that is not on the shelf?" + "Start your brief" | One-off bento tile allowed by R4 |
| Product page | "Want it different? Customise this animal" | Under variant selectors, carries animal and colourway |
| Shop listing end | "Cannot find your animal? Tell us about it" | After the grid, not inside it (cards stay uniform) |
| Cart and cart drawer | "Want a custom piece too? Start a brief" | Not shown in the order wizard (D34 bottom UI rules) |
| 404 | "Looking for something special? Design your own" | Adds to existing links |
| Journal posts | End-of-post panel "Make an animal like this one" | Posts about gifts, size and colour show it above the footer |
| Gifts | "A gift that is just right: design your own" at top, plus a card per occasion linking `type=` | e.g. `type=wedding_shower` |
| Wholesale | "Need a branded or mascot animal? Start a custom brief" | Routes to types 8 to 11 |
| Projects, Impact | "Plan an animal for your school or project" | type 11 |
| Footer | "Custom orders" link in the Shop column | Plain link |
| WhatsApp float | Unchanged. The float stays a direct WhatsApp link. On `/custom` it hides | D34 |
| Post-order page (`/order/sent`) | "Planning something special? Start a custom brief" | Shown after the primary success content |
| FAQ and care | Inline link in the "Can you make my idea?" question | Add that FAQ entry with honest wording |

No pop-ups, no exit intent, no first-paint overlays (charter rule 6).

---

## 9. Phased delivery and effort

Effort in ideal developer days (one engineer familiar with the repo), excluding owner decisions and copy review.

| Phase | Scope | Effort |
|---|---|---|
| MVP | Studio route replacing `/custom` form; 9 steps; type cards; catalogue picker; colour picker from `catalogue.generated.json` and `data/colours.ts`; size ladder step; details marked to be confirmed; quantity and bulk path; deadline; optional budget; contact and consent; live `BriefCard`; mood board (catalogue picks, links, notes, roles); `buildCustomBriefMessage`; result screen with attach-photos instruction; analytics events; draft persistence; CTAs across the site; copy in microcopy JSON; accessibility pass | 12 to 16 days (components 7, message and tests 2, CTAs 1.5, a11y and QA 2.5, copy and TODO register 1) |
| v2 | Optional private Vercel Blob uploads: route handlers, client resize and EXIF strip, rate limit, scanning hook, tokenised staff viewer, retention cron, deletion path, privacy notice update, consent copy, fallback to MVP, abuse monitoring | 8 to 12 days (backend 5, client 3, security review 2, legal and copy review 2) |
| v3 | Visual customiser with illustrated colour previews (SVG animal bases recoloured with chosen swatches, labelled as "illustration, not a promise"); optional on-device palette suggestion from a photo; AI assisted mood board suggestions with mandatory human review before anything is shown as a promise; maker admin view (Sheet export, status updates); possible 3D preview only if the owner supplies assets | 20 to 35 days; AI and 3D are each gated by owner approval and a cost review. Illustration previews carry a risk of implying exact results, so copy must keep "made by hand, will vary" |

Dependencies: MVP is unblocked now. v2 needs Q7 to Q11 answered and a Vercel Blob store. v3 needs maker-approved illustration assets and an agreed review process for any AI output (D36 excludes build-your-own from release 1, so the owner must lift that decision first, Q14).

---

## 10. Open questions only the owner can answer

1. Which of the twelve types does Mikono actually accept? Remove any it will not take (for example licensed characters, memorial pieces).
2. Typical reply time, lead times by size and by quantity, and rush rules. Until supplied the site says "we confirm".
3. Deposit rule and payment methods: M-Pesa Paybill or Till number, bank, cash, deposit percentage, refund and cancellation terms.
4. Approved plain-words size comparisons for S, M, L and XL, or approved centimetres.
5. Is the yarn colour variation sentence true? Which of the 49 catalogue colours can be reproduced on request? Is recycled yarn available in all colours?
6. Budget bands (four ranges), or no budget step at all.
7. Retention periods for briefs and photos, and the deletion promise.
8. Virus scanning and moderation tools to pay for in v2, and who reviews flagged uploads.
9. ODPC registration status and the named contact for data requests.
10. Hosting region preference for uploads (data leaves Kenya otherwise).
11. Who may see customer photos and briefs, and the written staff rule.
12. Do you send progress photos? At which stages?
13. Final CTA wording from section 8.
14. Lifting D36 for a customiser (build your own) in v3, and appetite for AI assistance.
15. Minimum order or minimum quantity for branded and event work, and whether logo files are accepted.
16. Which extras exist: stitched name tag, outfits, accessories, packaging. Remove any that do not.
17. Can wall animals, handbags and dolls be customised?
18. Is a phone call offered for memorial pieces, and who makes it?
19. Delivery partners and areas beyond Nairobi for custom orders (D15, D17).
20. Whether a trade WhatsApp number (`NEXT_PUBLIC_WHATSAPP_NUMBER_TRADE`) handles types 8 to 11.

---

## Assumptions

A1 The existing `EnquiryResult` and `sendEnquiry` can be reused for the Studio with a new field builder. A2 The catalogue hero images are suitable for card crops at uniform ratio. A3 The WhatsApp URL budget of 2000 characters holds the brief for most users, since long notes trigger the short fallback. A4 `localStorage` retention of 14 days mirrors the wizard. A5 Kenyan law references above are a design basis pending lawyer review.

## Spec vs reality audit log

| Date | Finding | Action |
|---|---|---|
| 2026-10-02 | `app/custom/page.tsx` uses `TradeEnquiryForm kind="custom"` with five type options and no inspiration or colour picker | Studio replaces it; keep the old form as a fallback behind a flag until QA passes |
| 2026-10-02 | D36 excludes "build your own" from release 1 | The MVP is a brief, not a configurator; v3 needs a decision |
| 2026-10-02 | The `track.ts` event list has no Studio events | Add the events in section 6 to `TRACK_EVENTS` |
