# Custom Studio data model

Generated from `data/studio.ts` and `data/studio/*.ts`. Edit the data files, not this document. Every option has an id, a label, a short description, a pending flag (the owner must confirm the option exists, its price or its lead time), an optional icon key and an impactsQuote hint (none, low, medium, high: a hint for the maker, never shown as a price). Pending options show "To be confirmed" in the Studio and in the WhatsApp message. No price, lead time or promise is stored anywhere.

## 1. Research basis

Public sources read for this design. "Verified" means the page text was read; "unverified" means taken from search summaries only.

| Business type | Fields and options seen | Source | Status |
|---|---|---|---|
| Custom pet plush (Cuddle Clones) | Several clear photos, pet species and breed, notes about the pet, body position (sitting, standing, lying down), eye colour, ear position, tail and mouth position, size by animal type, rush production levels, photo approval before production for some products | https://cuddleclones.com/pages/faq , https://cuddleclones.com/products/custom-plush-cuddle-clones | FAQ verified, product page summary unverified |
| Drawing to plush (Make My Plush) | Upload a drawing, size choice, style complexity by colour count, notes with gift date and message, colour swatch approval before production, optional rush production | https://makemyplush.com/products/convert-childrens-drawing-into-custom-plush | Verified |
| Etsy crochet commissions | Desired design, size, colours, a specific day such as a birthday or holiday, deadline, deposit and payment terms | https://www.etsy.com/market/crochet_commissions , https://www.etsy.com/market/custom_crochet_order_form | Search summaries only: unverified (listing pages returned 403) |
| Custom mascot manufacturers | Quote request with character details, size, quantity, artwork, logo placement, deadline, prototype made and approved before production, minimum order quantities vary widely | https://www.plushies4u.com/company-mascots/ , https://kingkongtoys.com/pages/for-mascots , https://loonietimes.com/plush/ | Process stages verified on one page, field lists unverified |
| Build-A-Bear | Stages: choose, sound, stuff, dress, name and birth certificate; outfits and accessories; name tag; gift packaging carrying case | https://www.buildabear.com/choose-sounds-scents , https://www.buildabear.com/brand-about-story-experience.html | Search summaries only: unverified |
| Jellycat custom and corporate | No official bespoke or corporate programme found. Third party sellers personalise with names on ears, school colours and logos, size and colour choice | https://www.etsy.com/market/custom_jellycat | Unverified, not an official source |
| Wedding and corporate gifting vendors | Matching favours, wrapping, tags, event themes, 100 plus guest orders, custom artwork or monograms, bulk ordering by phone | https://weddingfavorsoutlet.com/ , https://www.weddingstar.com/corporate-gifting , https://www.4allpromos.com/category/wedding | Search summaries only: unverified. Multiple delivery address fields not confirmed |

Design consequences: reference photos and a description come first; approval of colours or a progress photo before finishing is common (kept as a pending option because Mikono has not said she offers it); rush options are common (pending, no promise); body position, eyes and markings are typical (offered as choices); bulk work asks for quantity, artwork and a prototype step (bands, logo rights and the prototype approval option).

## 2. Structure of a brief

A brief has order level answers and a list of 1 to 30 **pieces**. Each piece has its own base form, size, count, colours, features and personal touches. Occasion, timing, delivery, budget, making preferences, contact and consents are once per brief. Several answers can be true wherever the question allows it (select all that apply). Delivery can have up to 20 addresses.

Paths: Quick brief (3 steps: idea, when and where, details and send) and Full brief (11 steps, the business step only when a business customer or business order type is chosen). Quick edits the first piece only; other pieces are kept.

Draft: kept on the device for 24 hours, choices and notes only. Never stored: name, phone, email, business name, role, invoice name, PO number, KRA PIN, adult recipient details, consent ticks. The KRA PIN goes only into the WhatsApp message; the copy kept after sending has it replaced by "supplied (not shown or saved)".

## 3. Options
### 3.1 Customer type (select all that apply)

Who is ordering. Business types open the business details and the multi-address delivery.

| id | label | description | pending | impacts quote | business |
|---|---|---|---|---|---|
| private | Private customer | Ordering for myself | no | none | no |
| gift-buyer | Gift buyer | Ordering for someone else | no | none | no |
| business | Business | A company or brand | no | none | yes |
| school | School | A school or ECD centre | no | none | yes |
| ngo | NGO or charity | A non-profit or a cause | no | none | yes |
| lodge_hotel | Lodge or hotel | Hospitality | no | none | yes |
| event-planner | Event planner | Ordering for a client's event | no | none | yes |
| wholesale | Wholesale or stockist | A shop that sells to others | no | none | yes |

### 3.2 Order types (select all that apply, no visible cap)

All pending because the owner decides which kinds of work she takes (strategy/09 open question 1). Old ids from earlier links map through typeAliases.

| id | label | description | pending | impacts quote | group | opens |
|---|---|---|---|---|---|---|
| keepsake | A personal keepsake | A piece to keep for yourself | yes | medium | personal | - |
| gift | A gift for someone | For a person you know | yes | medium | gift | - |
| birthday | A birthday piece | Made for a birthday | yes | medium | gift | - |
| matching-set | Matching sets and families | Pairs, families or a group that belong together | yes | high | personal | - |
| pet-lookalike | A pet lookalike | Made from photos of a pet | yes | medium | personal | pet references |
| drawing | A drawing turned into an animal | An adult sends the drawing. No child name or age | yes | medium | personal | drawing references |
| memorial | A remembrance piece | To remember a person or a pet | yes | medium | gift | photo references, gentle copy |
| baby-shower | Baby shower sets | Matching pieces for a shower | yes | medium | event | bulk |
| wedding | Wedding favours and gifts | Small pieces for guests or the couple | yes | medium | event | bulk |
| event-favours | Event favours in bulk | For a party, church or community event | yes | high | event | bulk |
| mascot | A mascot for a business or school | A character that stands for you | yes | medium | business | business, logo rights |
| corporate-gift | Branded corporate gifts | For staff or clients | yes | high | business | bulk, business, logo rights |
| hotel-lodge | Hotel and lodge amenities | For guest rooms and gift shops | yes | medium | business | bulk, business |
| shop-exclusive | Shop exclusive designs | A design only your shop sells | yes | medium | business | bulk, business, logo rights |
| school-classroom | School or ECD classroom sets | Sets for a classroom or a centre | yes | medium | community | bulk, business |
| ngo-campaign | NGO and charity campaign pieces | Pieces that carry a cause | yes | medium | community | bulk, business, logo rights |
| fundraising | Fundraising items | Pieces to raise money for a cause | yes | medium | community | bulk, business |
| collector | Collector or display pieces | A piece to show off | yes | medium | special | - |
| wall-piece | Wall pieces | Wall heads and hangings | yes | medium | special | - |
| accessory | Bags, keyrings and accessories | Something to carry or clip | yes | medium | special | - |
| outfit | Outfits and costumes for an animal | Clothes for an animal you already have | yes | medium | special | - |
| repair | Repair or refresh of a Mikono piece | A piece we made, mended or freshened | yes | low | special | - |
| other | Something else | Tell us in your own words | no | medium | special | - |

### 3.3 Base forms

Real catalogue animals are read from the catalogue at build time (all products, including wall heads, dolls and the handbag). These generic starting points are added.

| id | label | description | pending | impacts quote | feature questions |
|---|---|---|---|---|---|
| new-animal | A new animal | An animal we do not show yet | yes | high | yes |
| character | A character or mascot | From a drawing, a story or a brand. Only characters you may use | yes | high | yes |
| pet | A pet | Made to look like your pet | yes | high | yes |
| mythical | A mythical creature | A dragon, unicorn or something you imagine | yes | high | yes |
| doll-new | A doll | A new doll design | yes | high | yes |
| wall-head | A wall head | A head to hang on a wall | yes | high | no |
| accessory | An accessory | A bag, keyring or something to carry | yes | high | no |
| describe | Something I will describe | Tell us in your own words | no | high | yes |

### 3.4 Size

Shown as words only. Internal codes S, M, L, XL match the catalogue. All comparison sentences are placeholders for owner approval (open question 4). No centimetres.

| code | label | placeholder comparison | pending |
|---|---|---|---|
| S | Small | The smallest we make. Fits in a hand | yes |
| M | Medium | A little bigger than Small | yes |
| L | Large | Big enough for a good hug | yes |
| XL | Extra large | The biggest we make. A statement piece | yes |
| advise | Not sure, please advise | Tell us what it is for and we will suggest a size. | no |
| other | Another size | Describe the size you have in mind, for example next to something familiar. (free text, 120 characters) | yes |

### 3.5 Quantity bands (per piece)

Each piece has a band and an optional exact number. Bulk bands open the wholesale note. The soft quote prompt threshold is QUOTE_THRESHOLD_UNITS in lib/site.ts. Minimum order quantities for branded work are not stated anywhere: owner to confirm.

| id | label | description | pending | impacts quote | min | max | bulk |
|---|---|---|---|---|---|---|---|
| 1 | 1 | A single piece | no | medium | 1 | 1 | no |
| 2-5 | 2 to 5 | A small set | no | medium | 2 | 5 | no |
| 6-20 | 6 to 20 | A set or a small group | no | high | 6 | 20 | yes |
| 21-50 | 21 to 50 | A larger group | no | high | 21 | 50 | yes |
| 51-100 | 51 to 100 | A big order | no | high | 51 | 100 | yes |
| 100+ | 100 plus | A very big order | no | high | 101 | none | yes |

### 3.6 Colours

Up to 12 per piece (not shown as a limit), picked from the real yarn colours (one swatch per printed colourway name, built from data/colours.ts families and the catalogue photos), plus up to 12 free text colour references per piece, a colour note, "match a colour from my photo" and "brand colours". Owner to confirm which catalogue colours can be reproduced on request and whether yarn lots vary (open question 5).

### 3.7 Markings (select all that apply)

Every feature option is pending: the owner decides which she can make.

| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| stripes | Stripes | Bands of colour on the body | yes | low |
| spots | Spots | Dots or patches of spots | yes | low |
| patches | Patches | Larger patches of a second colour | yes | low |
| mane | Mane | A mane around the head or neck | yes | medium |
| tail | Tail detail | A tail with a tip or tuft | yes | low |
| ears | Ear detail | Inner ear colour or a special ear shape | yes | low |
| horns | Horns | One or two horns | yes | medium |
| tusks | Tusks | Tusks for an elephant or similar | yes | medium |
| belly | Belly colour | A lighter or different belly | yes | low |
| none | Plain, no markings | One simple look | yes | none |

### 3.8 Eye style

Stitched or embroidered eyes keep the approved claim nothing detachable. Owner to confirm.

| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| round-black | Round and dark | Simple dark round eyes | yes | low |
| stitched | Stitched | Eyes stitched in yarn | yes | low |
| sleepy | Sleepy | Half closed and calm | yes | low |
| coloured | A colour I choose | Say which colour in the notes | yes | low |
| as-photo | Like my photo | Match the eyes in the photo | yes | low |

### 3.9 Nose style



| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| small | Small and neat | A small nose | yes | low |
| big | Big and round | A bold nose | yes | low |
| snout | A snout or muzzle | A raised muzzle area | yes | low |
| none | No nose | A flat, simple face | yes | none |
| as-photo | Like my photo | Match the nose in the photo | yes | low |

### 3.10 Expression



| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| smiling | Smiling | A gentle smile | yes | none |
| calm | Calm | A relaxed face | yes | none |
| sleepy | Sleepy | Eyes half closed | yes | none |
| cheeky | Cheeky | A bit of mischief | yes | none |
| serious | Serious | A steady look | yes | none |

### 3.11 Textures (select all that apply)



| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| smooth | Smooth stitch | Neat, flat crochet | yes | none |
| fringe-mane | Fringe mane | A mane made of fringe | yes | medium |
| fluffy | Fluffy yarn | A softer, fluffier yarn where it can be done | yes | medium |
| ribbed | Ribbed | Raised lines in the stitch | yes | low |
| bobble | Bobbles | Small raised bobbles | yes | low |

### 3.12 Posture



| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| sitting | Sitting | Sits on a shelf or bed | yes | none |
| standing | Standing | Stands on four feet | yes | low |
| lying | Lying down | Rests flat | yes | low |
| either | No preference | We suggest what suits the animal | yes | none |

### 3.13 Hanging loop



| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| yes | Add a hanging loop | A loop to hang it by | yes | low |
| no | No loop | Leave it plain | yes | none |

### 3.14 Stitched or embroidered personalisation (select all that apply)

Each opens a short text field. Name 20 characters, initials 3, date 20, message 40. A check blocks child details in these fields (age, school, surname).

| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| name | A name or word | A first name or a short word an adult chooses. Never a full name, school or age. | yes | low |
| initials | Initials | One to three letters | yes | low |
| date | A date | A day, month or year to remember. Day and month are enough | yes | low |
| message | A short message | A few words, for example Welcome | yes | medium |

### 3.15 Outfit and accessories (select all that apply)



| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| outfit | An outfit | A full outfit for the animal | yes | medium |
| scarf | A scarf | A crocheted scarf | yes | low |
| vest | A vest | A small vest | yes | low |
| dress | A dress | A crocheted dress | yes | medium |
| hat | A hat | A small hat | yes | low |
| bag | A bag | A tiny bag to carry | yes | low |
| accessory | Another accessory | Glasses, a bow or a small extra | yes | low |
| ribbon | A ribbon | A ribbon bow or sash | yes | low |

### 3.16 Branded finishes (select all that apply)

Logo and branded tag need proof of rights.

| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| branded-tag | A branded tag | A tag with your brand name | yes | medium |
| logo | Logo included | A logo as a patch or stitching idea | yes | high |
| hang-tag | A hang tag | A plain tag with a short line | yes | low |
| care-tag | A care card | A small card on how to look after it | yes | low |

### 3.17 Packaging (select all that apply)



| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| plain | Plain packaging | Simple and ready to carry | yes | none |
| gift-wrap | Gift wrap | Wrapped as a gift | yes | low |
| gift-box | Gift box | A box for each piece | yes | medium |
| gift-card | A gift card with a note | A card with a short message | yes | low |
| branded-pack | Branded packaging | Packaging with your brand | yes | high |

### 3.18 Wrapping style (select all that apply)



| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| natural | Natural paper and string | Plain and earthy | yes | none |
| colour | In my colours | Wrapping in colours you choose | yes | low |
| event | Matched to my event | To go with a theme | yes | low |

### 3.19 Inspiration moods (select all that apply)



| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| soft | Soft and cuddly | Gentle and huggable | no | none |
| realistic | Realistic | Close to the real animal | no | none |
| cartoon | Cartoon style | Simple and friendly | no | none |
| tiny | Tiny | Small and neat | no | none |
| chunky | Chunky | Round and sturdy | no | none |
| calm | Calm colours | Soft, quiet colours | no | none |
| bright | Bright colours | Bold, happy colours | no | none |
| earthy | Earthy | Natural, warm tones | no | none |

### 3.20 Rights for logos and characters

Required when a logo or branded finish is chosen. Notice shown: "We can only make characters and logos you own or have permission to use." Explanation: Cartoon, film and brand characters belong to other people. Making a copy without a licence can break their rights, and it puts you and us at risk. If you are not sure, tell us and we will talk it through.

| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| own | It is mine, or my organisation's | We own the logo or character | no | none |
| permission | I have written permission | I can show it if asked | no | none |
| unsure | I am not sure yet | Please talk it through with me | no | none |
| none | Not applicable | No logo or character | no | none |

### 3.21 Occasions (select all that apply)

Day and month only, never a year, a name or a relation (strategy/17 section 2.1).

| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| birthday | Birthday | A birthday | no | none |
| baby | Baby arrival or shower | A new baby | no | none |
| wedding | Wedding | A wedding | no | none |
| graduation | Graduation | A graduation | no | none |
| anniversary | Anniversary | An anniversary | no | none |
| christmas | Christmas | Christmas | no | none |
| easter | Easter | Easter | no | none |
| mothers-day | Mother's Day or Father's Day | A parent's day | no | none |
| valentines | Valentine's Day | Valentine's Day | no | none |
| eid | Eid | Eid | no | none |
| corporate | Corporate or brand event | A company event | no | none |
| school | School or community event | A school or community event | no | none |
| remembering | Remembering someone | A remembrance | no | none |
| none | No special occasion | Just because | no | none |

### 3.22 Deadline types

A firm date takes a calendar date. No lead time is stated anywhere. SOON_DAYS is a placeholder (14) that only drives a gentle hint.

| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| hard | I have a firm date | It must be there by this date | no | none |
| flexible | My date is flexible | Earlier is welcome, later is fine | no | none |
| unsure | I am not sure yet | Tell me what is possible | no | none |

### 3.23 Rush interest

Pending. The owner has not said a faster option exists.

| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| yes | I would like to ask about a faster option | We tell you if one exists | yes | high |
| no | No rush | Standard timing is fine | no | none |

### 3.24 Delivery methods (several addresses allowed)

Fees always read to be confirmed. International and diaspora enquiries are pending. Gift direct needs an adult recipient name and phone. Business and bulk orders offer up to 20 addresses with a site name and a count each.

| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| pickup | Pickup | Collect from Mikono | no | none |
| nairobi | Delivery in Nairobi | To an area in Nairobi | yes | low |
| town | Another Kenyan town | Sent to a town outside Nairobi | yes | medium |
| courier | A courier I choose | I book the courier or you use mine | yes | low |
| gift-direct | Straight to the person receiving it | Delivered to an adult recipient. Not a child | yes | low |
| international | Outside Kenya | An enquiry for abroad or for family in the diaspora | yes | high |

### 3.25 Budget

Bands list is **empty by default** (`budgetBands` in data/studio/budget.ts). The Studio offers "I would rather you suggest" and a free "Tell us your range" field. To add bands, append `{ id, label: "Under X", pending: true }` once the owner gives the amounts. An optional switch says whether the range is for the whole order or each piece.

### 3.26 Contact channels (select all that apply)



| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| whatsapp | WhatsApp | Message me on WhatsApp | no | none |
| call | Phone call | Call me | no | none |
| email | Email | Write to me by email | no | none |

### 3.27 Best hours (select all that apply)



| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| morning | Morning | Before noon | no | none |
| afternoon | Afternoon | Noon to 5pm | no | none |
| evening | Evening | After 5pm | no | none |
| any | Any time | Whenever suits you | no | none |

### 3.28 Language (select all that apply)



| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| english | English | English | no | none |
| kiswahili | Kiswahili | Kiswahili | no | none |

### 3.29 Business type

Business details also ask name, role, invoice name, PO number and an optional KRA PIN (soft field, format hint only, message only).

| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| company | Company | A registered company | no | none |
| shop | Shop or boutique | A retail shop | no | none |
| lodge | Lodge, hotel or restaurant | Hospitality | no | none |
| school | School or ECD centre | Education | no | none |
| ngo | NGO or charity | A non-profit | no | none |
| planner | Event planner | Events | no | none |
| club | Club or association | A club or community group | no | none |
| other | Something else | Another kind of organisation | no | none |

### 3.30 Photo updates



| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| yes | Yes, send me photos while it is made | A photo at some stages | yes | low |
| no | No, surprise me | Just the finished piece | no | none |

### 3.31 Approval before finishing



| id | label | description | pending | impacts quote |
|---|---|---|---|---|
| yes | Yes, let me approve a photo before it is finished | A prototype or progress photo | yes | medium |
| no | No, go ahead and finish it | Trust the maker | no | none |

### 3.32 Fixed lines

- Sustainability: "Every piece is crocheted from recycled acrylic yarn." with an optional tick "Tell me more about the yarn".
- Child rule line: "An adult fills this in. We never ask for a child's name, age, school or photo."
- Consent: the terms box is required and unticked. Text, links and version ids come from content/legal/acceptance.ts (custom brief variant): Custom Order Terms (/terms/custom, custom-order-terms@v0.1-draft); Terms of Sale (/terms, terms-of-sale@v0.1-draft); Privacy Policy (/privacy, privacy-policy@v0.1-draft). Marketing boxes (WhatsApp, email) are optional and unticked. Marketing text version: consent-v1-draft. When photos will be attached a photo rights box is also required.

### 3.33 Summary fields and completeness meter

Weights add up to 100. The meter never blocks sending and shows one gentle suggestion, the most useful missing detail.

| field | weight | suggestion | needed to send |
|---|---|---|---|
| Kind of order | 10 | Tell us what kind of order this is. | yes |
| Shape | 12 | Pick the animal closest to your idea. | yes |
| Size | 10 | A size helps us plan. | yes |
| How many | 8 | Tell us how many you need. | yes |
| Colours | 12 | Choosing colours helps us quote well. | yes |
| Markings and features | 8 | Markings, eyes or a mane make it more like your idea. | no |
| Personal touches | 5 | A name, a date or an outfit makes it yours. | no |
| Inspiration | 12 | A photo, link or short description helps a lot. | no |
| Date | 8 | Tell us your date, or that it is flexible. | yes |
| Delivery | 7 | Say where it should go. | yes |
| Budget | 3 | A range, if you have one, helps us suggest what fits. | no |
| Preferences | 5 | Say whether you want progress photos. | no |

Levels: 0+ Just started, 35+ A good start, 60+ Clear and useful, 85+ Very detailed.

## 4. Helper tools

- Gift Finder: every question is multi-select (select all that apply); "Surprise me", "Not sure yet" and "Any colour" clear the other choices. A person can add up to 20 recipients ("Person 1", "Person 2", no names), each with their own five questions and their own three picks. Share message groups the picks by person.
- Size Finder: several uses can be ticked and compared side by side; each use keeps its own suggestion and the combined sizes are highlighted.
- Build a Safari Family: tapping an animal again, or "Add another size or colour" on a line, adds the same animal as a separate line in a new size or colour (up to 24 lines).
- Sizes appear as Small, Medium, Large, Extra large everywhere in these tools and in their WhatsApp messages. The SKU keeps its internal code.

## 5. What the owner must confirm

1. Which order types she takes (all 22 pending types), and removing any she will not take.
2. Reply time, lead times by size and quantity, and whether a faster option exists (rush).
3. Approved plain word size comparisons, or centimetres (the four sentences are placeholders).
4. Which markings, eyes, noses, textures, postures and the hanging loop she can make.
5. Which personalisation exists: stitched name, initials, date, message; outfits and accessories; branded tag; logo; packaging; wrapping; gift card.
6. Budget bands (amounts), or no bands at all.
7. Minimum order quantities for branded and bulk work, and whether logo files are accepted.
8. Delivery: methods and areas beyond Nairobi, courier, direct to an adult recipient, multiple addresses, international or diaspora shipping, fees.
9. Whether progress photos are sent and at which stages, and whether a photo is approved before finishing.
10. Which catalogue colours can be reproduced, and whether yarn lots vary.
11. Whether wall pieces, accessories and dolls can be customised.
12. A phone call for remembrance pieces and who makes it.
13. Final wording and anchors of the Custom Order Terms, Terms of Sale and Privacy Policy, and the version id once final (currently draft ids).
14. Retention and deletion promise for briefs and photos, and the written staff rule on who sees them.


## 6. Inclusivity sweep (2026-10-04): caps and lists

Caps are safety guards. Nothing in the screens shows a cap until it is reached, and the message then says what to do next.

| Constant | Old | New | File |
|---|---|---|---|
| MAX_TYPES | 4 | 40 | data/studio/orderTypes.ts |
| MAX_LIST (any other multi-select) | 3 to 10 | 40 | data/studio/inspiration.ts |
| MAX_COLOURS | 5 | 12 | data/studio/features.ts |
| MAX_COLOUR_REFS | 5 | 12 | data/studio/inspiration.ts |
| MAX_PIECES | 12 | 30 | data/studio/quantity.ts |
| MAX_EXACT | 9999 | 99999 | data/studio/quantity.ts |
| MAX_ADDRESSES | 6 | 20 | data/studio/delivery.ts |
| MAX_PICKS / MAX_LINKS / MAX_PHOTOS / MAX_NOTES | 6 / 5 / 10 / 4 | 12 / 10 / 20 / 10 | data/studio/inspiration.ts |
| MAX_QTY_PER_LINE, MAX_LINES | 20, 40 | 500, 100 | lib/site.ts |
| FAMILY_MAX_LINES, FAMILY_MAX_QTY | 12, 20 | 24, 200 | data/helpers.ts |
| MAX_RECIPIENTS, SHARE_MAX_LINES, MAX_DROPS | 6, 24, 6 | 20, 60, 20 | data/helpers.ts, lib/shareList.ts, lib/split.ts |
| MAX_OCCASIONS (order form) | 5 | 20 | data/checkout.ts |
| MAX_PRODUCTS / MAX_OUTLETS / MAX_CONTACTS (enquiries) | 12 / 8 / 4 | 40 / 40 / 20 | lib/enquiryForm.ts |

Every list that could be incomplete ends with "Other, tell us" and opens a free text field. The text travels in the WhatsApp message as "Other: what they typed". Stored in `brief.others` (by list) and `piece.others` (by list). It is a short device-only draft like the rest of the brief.

New or changed lists: customer types 19 (individual, gift buyer, family or carer, outside Kenya, collector, teacher, school or ECD centre, hospital or clinic, church or faith group, community group, NGO, lodge or hotel, restaurant, shop, wholesaler, event planner, company, government, other; never the word parent); order types 29 (adds new baby gift, ceremony or tradition, church or faith group, gift for family in Kenya or abroad, display and decor, sympathy or get well); occasions 29 (adds naming ceremony, engagement, traditional or cultural ceremony, new home, retirement, Diwali, Father's Day, Madaraka, Mashujaa and Jamhuri Day, get well, sympathy, thank you, fundraiser, just because, other; day and month only); generic base forms add bird, sea animal, insect, farm animal and "Other, tell us"; delivery methods: pickup point, someone else collects, Nairobi, another Kenyan town (all 47 counties), courier or bus parcel service of my choice, straight to the person, send abroad (ask us), other; contact channels add SMS and other; best times add weekends and other; languages add other (replies may be in the language used); deadline adds "As soon as possible"; budget always offers "not sure yet" and "prefer not to say"; colours add "Surprise me" and any colour by name; outfits add headwrap, traditional outfit, badge; packaging adds packed in bulk, each in its own bag.

Contact: one "full name" field (any name, one name is enough, non-Latin scripts, apostrophes and hyphens allowed). Phone accepts Kenyan numbers in every form (07xx, 01xx, 020 and other landlines, 254, +254) and international numbers by E.164 shape (7 to 15 digits, country code). Optional "Anything that would make this easier for you?" and a payment note go only into the outgoing message and are never written to the draft (tested).

Helpers: Gift Finder offers 14 who answers, 29 occasions, kinds safari, farm and pets, sea, birds and insects, wall art, dolls, more animals, surprise, other; sizes add "not sure, help me choose" and "other size"; colour moods add "other colours". Every catalogue product (30) is offered, including wall art and dolls. Family builder allows any animal in any colourway, size and quantity.


## 7. Owner answers applied (2026-10-05)

- Order types: all 23 offered plus the extra inclusive ones, none pending. Extras, features, packaging, wearables, finishes and delivery methods: all offered, none pending. Where something cannot be done exactly: "If we cannot do something exactly, we tell you before we start." (EXACT_LINE). Still to be confirmed: faster option, sizes wording, ways to pay.
- Reply time: "We usually reply within a few minutes to a couple of hours during working hours." (REPLY_TIME, data/studio/timing.ts). Only ever "usually".
- Lead time for custom pieces: "usually from 3 days to 1 week", depending on quantity and design, exact time confirmed in the quote (LEAD_TIME, LEAD_NOTICE). SOON_DAYS is 7. The legal text [CUSTOM LEAD TIME] now reads "3 days to 1 week, depending on quantity and design, confirmed in the quote".
- Colours: any colour is welcome, matching a colour from a photo is welcome, if we cannot get a colour we say so and suggest the nearest.
- Minimums: bulk starts at 20 pieces (BULK_FROM, equal to QUOTE_THRESHOLD_UNITS). Bands: 1, 2 to 5, 6 to 19, 20 to 49, 50 to 99, 100 plus (old ids 6-20, 21-50, 51-100 are mapped on load). No minimum for a single custom piece. "Bulk orders start at 20 pieces. Smaller branded runs: ask us."
- Budget bands (data/studio/budget.ts), titled "Rough budget guide (an estimate, we confirm the price in your quote)": Under KES 2,000; KES 2,000 to 5,000; 5,000 to 10,000; 10,000 to 25,000; 25,000 to 50,000; 50,000 and above; plus Not sure yet, Prefer not to say, I would rather you suggest.
- Rough estimates (data/studio/estimates.ts), ROUGH ESTIMATES set by the lead on the owner's instruction, to be refined by the client, not published as prices: per piece Small 1,200 to 2,500; Medium 2,500 to 5,000; Large 5,000 to 9,000; Extra large 9,000 to 18,000 KES; complexity adds 20 to 60 percent (new shapes, extras); bulk from 20 pieces takes roughly 5 to 20 percent off. Used only for the Brief Card note ("This looks like roughly KES X to Y at these sizes. We confirm the exact price in your quote.", only when every piece has a size class) and one WhatsApp line ("Rough guide shown on the site: ..."). Never in the catalogue or on product pages (pricesConfirmed stays false).
- Payment (data/studio/payment.ts): one timing choice (pay on order in full; a deposit now and the balance later; on delivery (POD); on pickup; not sure, let us suggest), an optional list of ways to pay with Other (mobile money such as M-Pesa, bank transfer, cash on delivery or pickup, card if available, other), each to be confirmed, and a free note. Deposit wording "a deposit, confirmed in your quote" (DEPOSIT_PERCENT_PLACEHOLDER is null). Same fields in the Studio (step "Budget, payment and packaging"), the order wizard review, and the wholesale form. Legal text keeps [DEPOSIT AMOUNT].
- Progress photos and approval before finishing: removed from the Studio, the message, the meter, the sent page and all copy. Not promised anywhere.
- Delivery: all options kept (pickup point, someone else collects, Nairobi areas, all 47 counties, other towns free text, courier or bus parcel service, send abroad (ask us), multiple addresses). "Delivery cost depends on where it is going and is confirmed in your quote." No fees invented; zone fee fields stay null.
- One business number (254724592115) for every order, brief and enquiry. NEXT_PUBLIC_WHATSAPP_NUMBER_TRADE logic is removed.
