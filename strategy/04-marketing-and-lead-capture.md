# 04. Marketing and Lead Capture

Status: build-ready draft for the Phase 2 gate. Obeys `00-CHARTER.md`: no em or en dashes, no invented facts, no dark patterns, child-first, Kenya first. Anything unknown is marked TODO or ASSUMPTION so the build can list it.

## 0. Ground rules for every marketing feature

1. Nothing opens on first paint. No pop-ups, no exit-intent overlays, no countdowns, no "only 2 left" unless the number comes from real stock data.
2. Every form asks for the minimum. Every form states in one line what we will send and how often, and how to stop.
3. Incentives are honest: useful things (guides, early access to restocks, a printable price list), never fake discounts or fake "was" prices.
4. Consent before tracking. Tracking slots (GA4, Meta Pixel, TikTok Pixel, GTM) load only after the consent banner is accepted. IDs are TODO until the client supplies them.
5. No photos of identifiable people or children go live until the manifest marks them cleared.
6. Kenya Data Protection Act, 2019: confirm with a legal adviser whether Mikono must register with the Office of the Data Protection Commissioner, and have a privacy page. TODO (client).
7. Placeholders to list for the build: WhatsApp number, email domain, prices, delivery zones and fees, tracking IDs, partner names and logos, review text, impact numbers beyond "25+ women".

## 1. Funnel map

### B2C (parents, gifters, diaspora)

| Stage | What the person is thinking | Site feature that serves it | Primary action |
|---|---|---|---|
| Awareness | "I saw a crocheted giraffe on Instagram" | Landing pages per animal, blog posts, Reels links, Pinterest pins that land on the exact product, OG images | Click through to a product or guide |
| Consideration | "Is it safe? What size? Will it arrive in time?" | Product page with size and colour variants, size guide, care guide, safety and materials block, gift finder, size and colour quiz, maker profiles, reviews (real only), FAQ | Add to cart, or save via restock or reminder sign-up |
| Order | "How do I pay and when does it arrive?" | Cart drawer, order wizard to WhatsApp, delivery zones and fees shown before checkout, WhatsApp click to chat from every page | Send the order message |
| Delivery | "Where is my order?" | Order confirmation page with the WhatsApp message recap, delivery expectations, care card, pack-in insert with QR code to care guide | Confirm receipt |
| Advocacy | "I want to show this to someone" | Review request, photo programme with consent, referral by WhatsApp share, gift reminder club | Review, share, or reorder as a gift |

### B2B (retailers, lodges, corporates, schools, NGOs)

| Stage | Site feature | Primary action |
|---|---|---|
| Awareness | Wholesale page, stockist locator (shows existing stockists, which is proof), LinkedIn and Instagram posts, outreach emails with a link | Visit the wholesale page |
| Consideration | Catalogue PDF, wholesale price list request, minimum order and lead time (TODO values), sample policy (TODO), partner showcase, impact page | Request price list or catalogue |
| Order | Quote request form, WhatsApp click to chat, partner enquiry form | Send quote request |
| Delivery | Order recap by WhatsApp, delivery timeline note, reorder link prefilled with last order | Confirm delivery |
| Advocacy | Stockist listing on locator, co-branded shelf photo programme, case study, reorder reminder | Reorder, refer another shop |

Stockists named in the brief that may appear on the locator, each subject to written permission: Blue Rhino Shop, Spinners, Yaya Centre pop up, Giraffe Centre, Beth International JKIA, Marula Green Market, New Muthaiga Mall. Logos and addresses are TODO.

## 2. Lead capture inventory

No backend yet. Three destinations only:

- **W** = WhatsApp (a prefilled message the person sends themselves from their own phone, or a click to chat).
- **E** = email service connected through a Vercel Marketplace integration or a hosted form service (TODO choose; the form posts via a Next.js route handler or server action). Lists are kept separate: B2C, B2B.
- **S** = Google Sheet written through the same route handler (service account, TODO) as a plain backup of every lead, so nothing depends on one vendor.

Every route handler also fires a conversion event (only if consent is given) and stores UTM values with the lead.

| # | Capture point | Where on site | Fields (minimum) | Honest incentive | Destination |
|---|---|---|---|---|---|
| 1 | Newsletter | Footer, blog posts end, home page low section (inline, never a pop-up) | Email. First name optional | A short monthly note: new animals, restocks, maker stories. Say "monthly, unsubscribe any time" | E + S |
| 2 | Back in stock and restock alert | Product page when a size or colour is unavailable (button replaces nothing, sits beside the variant) | Email or WhatsApp number (one, their choice), the variant picked | Tell them first when it is back. No promise of date | E or W, plus S |
| 3 | Size and colour finder quiz | Shop header link, product pages, home | Quiz answers (age, room, who for). Contact asked only at the end and optional | A clear recommendation with the product link, saved by emailing it to them if they choose | Result on screen. Optional E + S |
| 4 | Gift finder | Home, gifting landing page | Occasion, recipient age band, budget band in KES. Contact optional at end | Matched shortlist, and the option to get it by WhatsApp | Result on screen. Optional W |
| 5 | Wholesale price list request | Wholesale page | Business name, contact name, email or WhatsApp, business type (dropdown), town | The current wholesale price list and minimum order terms, sent by a person within a stated time (TODO, client sets) | W (preferred) or E, plus S. Staff notified |
| 6 | Catalogue PDF download | Wholesale page, partner pages | Email and business type. Offer a "skip, just download" link that needs no email | The catalogue itself. No gating by guilt: direct download remains available | E + S for those who give email |
| 7 | Birthday and baby shower reminder club | Gift finder end, footer, gifting page | Email or WhatsApp, occasion, month and day of the occasion (no child name needed, no child birth year) | A reminder 3 weeks before, with ideas. Nothing else | E or W, plus S |
| 8 | Project and workshop sign up | Projects page, blog posts about projects | Name, email or WhatsApp, which project, group size if a school or group | A place on the list and the date once set (TODO) | E + S |
| 9 | WhatsApp click to chat | Persistent button on all pages, product page "Ask about this animal", cart | None. Prefilled text includes page and product name | A real reply from a person. State hours (TODO) | W. Click event logged |
| 10 | Partner enquiry | Partners page: stockist, corporate, hotel and lodge, school, NGO, diaspora gifting | Organisation, contact name, email or WhatsApp, partner type, one free text box | A reply within a stated time (TODO) | W or E, plus S. Staff notified |
| 11 | Order wizard | Cart | Per the WhatsApp checkout spec (separate report) | The order itself | W |
| 12 | Review submission | Post-order link, product page | Product, rating, text, name (first name only), photo optional with consent tick | None offered for the review, to keep reviews clean | E + S, moderated |

Rules for all forms:
- Labels above fields, 16px or larger text, 44px minimum targets, forgiving validation (accept spaces and +254 or 07 formats), no field cleared on error.
- Honeypot field and server-side rate limit for spam. No CAPTCHA puzzles that block children or parents with low vision.
- Under each form: one-line purpose, link to privacy page, and an unsubscribe note.
- Parents only. We do not collect data from children. Forms say so in plain words: "For adults. Please ask a grown up to fill this in."
- Consent stored with a timestamp and the exact wording shown.

Lead routing and speed: WhatsApp and wholesale leads are answered by a named person. Target first reply inside business hours (TODO set). Sheet columns: timestamp, source, form, name, contact, consent text version, UTM source, UTM medium, UTM campaign, status, owner.

## 3. Lifecycle messaging

Channel rules: WhatsApp messages are sent manually or through WhatsApp Business app labels and quick replies at the start. Only message people who gave their number for that purpose. Automation through the WhatsApp Business Platform needs approved templates and opt-in (TODO, phase 2 of rollout). Email goes through the email service. Every message has a stop option in plain words ("Reply STOP" on WhatsApp). Tone: warm, short, concrete. No exclamation spam.

### 3.1 Welcome (newsletter, club, quiz)
- Message 1, immediately: thank you, what to expect and how often, one link to the story page and one to the shop. No discount.
- Message 2, day 3: how a Mikono animal is made (recycled yarn, zero plastic, child safe, by 25+ women in Nairobi). One photo, cleared.
- Message 3, day 7: size guide and care guide, plus the quiz link. Then stop. Move to monthly.

### 3.2 Post-order
- On order received (WhatsApp, by a person): confirm items, size, colour, delivery area, fee, and expected date (TODO delivery rules).
- On dispatch: courier or rider name and phone if applicable.
- Day after delivery: "Did it arrive well?" with a way to reply to a person.
- Inside the parcel: care card with QR code to the care guide and a note from the maker team. Maker name only with her permission.

### 3.3 Review request
- Day 7 after delivery, one message and one reminder at day 14. Then never again.
- Copy outline: thank you, two sentences asking how the animal is doing, a link to the review form, a tick box to allow a photo (with the child not identifiable unless a parent consents in writing), and a line saying honest reviews are welcome, good or not.
- No gift or discount in exchange for a review. Do not edit review text beyond typos and never delete negative reviews that are not abusive.

### 3.4 Restock
- When a variant returns, message everyone on that variant's list once, in sign-up order. Copy outline: "The [colour] [animal] in [size] is back. We made [TODO number] pieces so it may sell out again." Only state the number if real. Link straight to the product. Remove them from the list after the message.

### 3.5 Gifting occasions in Kenya
Dates change by year; the calendar owner confirms each one. TODO for exact dates (Eid especially, which follows the lunar calendar).

| Occasion | When to start messaging | Outline |
|---|---|---|
| Christmas | Early November for orders, with a clearly stated last order date for delivery (TODO from courier lead times, in Nairobi and upcountry, and a separate date for diaspora shipping) | Gift finder, size guide, delivery cut off dates, gift note option |
| Easter | About 4 weeks before | Small sizes (S) as gifts for children, domestic animals such as a rabbit or lamb only if they exist in the catalogue (check) |
| Mother's Day (May) | 3 weeks before | Gifts from children, and a message about the 25+ women who make each piece. Do not guilt |
| Eid | About 2 weeks before | Respectful, plain greeting and gift finder. No stock imagery of stereotypes. Review the copy with a Muslim reviewer before sending (TODO) |
| Baby showers | Always on, via the reminder club | Soft, newborn-appropriate guidance. Only recommend the sizes and designs the client confirms are suitable for babies. TODO safety age statement from the client, no invented certifications |
| Birthdays | Reminder club, 3 weeks before | Age band suggestions in the gift finder, WhatsApp order |
| Graduation (ECD, primary, secondary, university) | About 4 weeks before the school calendar's graduation season (TODO dates) | Larger sizes (L, XL) as keepsakes, bulk request for schools and families via partner enquiry |

### 3.6 B2B reorder reminders
- At first order, record the date and quantities in the Sheet.
- Reminder timing: a person decides per stockist, starting at 8 weeks after delivery (ASSUMPTION, adjust with real sell-through).
- Copy outline: "Hello [name]. Here is what you ordered last time. Tell us what has sold and we will suggest a reorder." Include one link to a prefilled reorder form and the current lead time.
- Pre-season note to stockists: 6 weeks before Christmas and the tourist high season (TODO confirm seasons with client).
- Ask for a shelf photo and permission to use it.

## 4. Social and content engine

Principle: every post points to a page on the site that exists, with UTM tags. Content comes from the cleared media manifest first, then from new shoots.

| Channel | Role | Content types | Tie to site |
|---|---|---|---|
| Instagram (@mikonocreations) Reels and Stories | Primary B2C awareness | Making-of Reels (hands, yarn, stitches), animal reveal, size comparisons (S to XL next to a household object), stockist shelf tours, parent photos with consent | Link in bio to a link hub page `/links`, product tags, story link stickers to product pages |
| TikTok | Reach, younger parents and gifters | The same short videos, no new production. Trend audio used only if licensed for business use | Profile link to `/links`, Pixel for later paid tests |
| Facebook (@mikonocreations) | Parents' groups, local reach, events | Albums, pop-up announcements, stockist news. Only post in groups where rules allow | Event links, shop links |
| Pinterest | Slow-burn search traffic | Pins for nursery decor, safari themed birthday ideas, baby shower gifts. One pin per blog post and per product, on accurate images | Pin links to blog and product pages with Rich Pins from schema.org |
| WhatsApp Channel | Broadcast without sharing numbers | New animals, restocks, maker notes, occasion nudges, monthly | Channel link in footer and thank you page |
| WhatsApp Status | Daily behind the scenes for existing customers and stockists | One photo or clip a day at most | Click to chat reply |

Content pillars (weekly rhythm, ASSUMPTION): makers and process, animals of the week with facts that are true, parent moments, stockist spotlight, how to care, project and workshop news. Aim for 3 Reels, 3 Stories days, 2 Facebook posts, 3 pins and 1 channel update per week as a starting target, scaled to what the team can sustain.

Blog posts that feed social and search (titles are outlines, the content report has detail): size guide in plain words, how to wash a crocheted toy, safari animals for a nursery, baby shower gifts in Nairobi, corporate gifts from Kenya, meet the makers (with permission).

### UGC and parent photo programme
- Invite via post-order message, packaging card and WhatsApp Status. Hashtag TODO (client picks, check it is unused).
- A written consent step before any use: what photo, where it appears (site, Instagram, ads), for how long, how to withdraw. The parent signs by reply or form tick. Store the consent record in the Sheet.
- Children: prefer photos of the toy with a child's hands, back, or no child in frame. Never show a child's full name or school. Consent given by a parent or guardian only.
- Nothing is published until the manifest entry is marked cleared. Default is not cleared.
- Paid ads using parent photos need separate consent wording that names advertising.
- Credit by first name only if the parent agrees.
- Thank every contributor personally. No cash or discount for photos in the first phase (keeps it honest and simple).

## 5. Partnership and retail channel growth

| Channel | What the site provides | Outreach approach | Notes |
|---|---|---|---|
| Stockist locator | Map and list page of current stockists, with name, area, link. Each entry needs the stockist's permission and verified address (TODO) | Share the link with each stockist so customers can find them. They share it back | Only real, confirmed stockists. Show "last verified" date |
| Become a stockist funnel | Wholesale page, steps: see catalogue, request price list, get a call, small first order, shelf photo, listing on locator | Visit shops in Nairobi, send the link, offer a sample set if the client agrees (TODO policy) | One page, four steps, one form |
| Corporate gifting | Page with sample bundles, size options, branded tag option (only if feasible, TODO), lead time, quote form | Email HR and procurement leads before Q4 | Offer a story card about the makers inside each gift |
| Hotels and lodges | Page for in-room and shop gifts, safari animal range, wholesale flow | Direct outreach, sample visit, existing stockists such as Giraffe Centre as reference only with permission | |
| Diaspora gifting | Gift finder with "deliver to someone in Nairobi" option, WhatsApp order, pay method info (TODO payment options) | Facebook groups and pages for Kenyans abroad, Instagram, WhatsApp referral | State delivery timelines honestly and clearly |
| Schools and ECD | Page for classroom sets, project and workshop sign up, safety statement (TODO) | Direct outreach to ECD centres and school gift shops | Child-first language, adults only for forms |
| NGOs | Partner enquiry with type NGO, impact story, co-branded gift packs | Introductions through existing relationships | Impact claims only with data |
| Tourist outlets | Airport and attraction shop listings on the locator, wholesale route | Visit and call. Existing: Beth International JKIA, Giraffe Centre | Packaging and price tags suitable for visitors, simple multi-language labels (TODO) |

Measure each channel by enquiries, first orders, reorders and revenue per partner.

## 6. Paid media starting plan (Kenya)

All budgets below are ASSUMPTIONS for planning. Replace with the client's real budget and Meta and TikTok costs once measured. Currency KES per month.

| Phase | Platform | Budget range (ASSUMPTION) | Goal |
|---|---|---|---|
| Month 1, test | Meta (Instagram and Facebook) | KES 15,000 to 30,000 | Learn which creative earns profile visits and WhatsApp clicks |
| Month 1, test | Google Search (brand and a few specific terms like "crochet toys Nairobi") | KES 5,000 to 15,000 | Capture existing intent |
| Month 2 to 3 | Meta, scale winners | KES 30,000 to 80,000 | Orders via WhatsApp |
| Month 2 to 3 | TikTok | KES 10,000 to 30,000 | Test only if organic videos perform |
| Q4 gifting | Meta plus Search | KES 50,000 to 150,000 | Christmas gifting and diaspora |
| B2B | LinkedIn or Meta lead forms | KES 0 to 20,000 | Mostly outreach, paid optional |

Decision rule: do not scale a campaign until it has produced at least a set number of tracked conversions (ASSUMPTION: 20) and the cost per order is below the margin we set (TODO from pricing report).

Audiences (Meta):
- Nairobi and surroundings, parents and gift buyers aged 25 to 45, interests such as parenting, baby products, handmade, safari.
- Kenyans abroad (diaspora) in the UK, US, UAE and others (TODO client picks), for Christmas.
- Lookalikes only after enough real conversions exist.
- Retargeting: site visitors, product viewers, WhatsApp clickers, within a 30 day window. Frequency capped. Exclude past purchasers from acquisition ads.
- Do not target children. Follow each platform's rules for ads about children's products.

Creative angles (all true and shown with real media):
1. Hands at work: close up of crocheting, with maker permission.
2. Zero plastic and recycled yarn, plainly explained.
3. Size comparison: S, M, L, XL, shown.
4. Gift for a specific occasion with delivery cut off date.
5. Parent photo (consented) of a toy in daily life.
6. Impact: 25+ women supported, said exactly like that.
7. Stockist: "Find us at [verified stockist]" with permission.

Tracking and conversion setup required (consent gated):
- Meta Pixel and Conversions API (TODO ID and access). Standard events: ViewContent, AddToCart, InitiateCheckout, Lead, Contact (for WhatsApp click), Purchase equivalents are not available when payment happens on WhatsApp. Use a custom event "OrderSentToWhatsApp" when the wizard opens WhatsApp, and later import real orders from the Sheet as offline conversions (manual weekly, ASSUMPTION).
- TikTok Pixel, same event set (TODO ID).
- GA4 via GTM: page_view, view_item, add_to_cart, begin_checkout, generate_lead, click_whatsapp, newsletter_signup, quiz_complete, catalogue_download, price_list_request, partner_enquiry.
- UTM conventions: lower case, `utm_source` (instagram, facebook, tiktok, pinterest, whatsapp, google, email, partner), `utm_medium` (organic, paid, referral, email, qr), `utm_campaign` (short slug like `xmas-2026`), `utm_content` (creative id). Persist UTMs in first-party storage after consent and attach them to the WhatsApp message text as a short reference code and to every lead row.
- QR codes on packaging and shelf cards carry `utm_medium=qr`.
- Meta domain verification and Google Search Console set up (TODO owner).

## 7. Referral and loyalty (social enterprise appropriate)

No points systems that push buying. No "refer 5 friends or lose" mechanics. Ideas:
- **Share a gift:** a gift page link that a parent can send on WhatsApp, with the animal and a message. No reward, convenience only.
- **Pass it on:** a thank you card in each parcel with a short link to share the story. Reward is a thank you note from the makers.
- **Referral reward (optional, only if client agrees margins):** a real, stated discount or small add-on for both people. Terms written plainly and honoured. TODO client decision.
- **Stockist referral:** a stockist who introduces another shop gets an agreed benefit (TODO terms, written).
- **Loyalty without gimmicks:** early access to restocks and new animals for repeat buyers, and a handwritten thank you at the third order.
- **Give-back:** a stated, real part of revenue to something real (TODO whether the client does this). Only publish with figures and receipts.
- **Birthday club:** a reminder, not a discount.

## 8. Social proof plan

Rules to avoid fabricated proof:
1. Reviews are only from real buyers, stored with order reference in the Sheet. Show first name and the month. No generated names.
2. Show all genuine reviews including mixed ones. Average ratings are computed from stored data only, and hidden until there are enough reviews (ASSUMPTION: 5).
3. No star counts, "sold" counts, or "X people viewing" text unless computed from real data. No fake scarcity.
4. Maker profiles: only with the maker's written consent, her words, her chosen photo. Names, roles and quotes verified by the client. Respect and dignity first.
5. Impact counters: "25+ women" is the only confirmed number. Other counters (toys made, kilograms of yarn recycled, schools reached) need a source and a date, shown as "as of [month year]". Without data, no counter.
6. Press: link to the actual article. No "As seen in" strip without a real link.
7. Stockist logos: only with written permission, official logo files, current stockists only. The locator is the proof, the logo strip is optional.
8. Certifications or safety statements: only the ones the client holds and can show. Otherwise describe materials and construction factually. TODO safety documentation.
9. A proof register (Sheet tab) logs every claim, its source, who approved it and the date.
10. Testimonials from B2B partners need the partner's approved text.

## 9. Metrics dashboard and weekly ritual

Tools: GA4, Meta Ads Manager, Search Console, the lead Sheet, and a Looker Studio report or one Sheet tab. One page.

North Star: orders sent to WhatsApp that become confirmed paid orders (B2C), and confirmed wholesale orders (B2B).

| Area | Metric | Source |
|---|---|---|
| Traffic | Sessions by source and medium, new vs returning, top landing pages | GA4 |
| Engagement | Product view rate, add to cart rate, quiz completion | GA4 |
| Leads | Count per capture point, conversion rate per form, cost per lead | Sheet, GA4 |
| Order | OrderSentToWhatsApp count, confirmed orders, confirmed order rate, average order value, revenue | Sheet |
| WhatsApp | Click to chat clicks, first reply time, chats to orders | WhatsApp Business, Sheet |
| Retention | Repeat order rate, restock alert to purchase rate, club reminders to orders | Sheet |
| B2B | Price list requests, calls held, first orders, reorders, active stockists | Sheet |
| Reviews | Review requests sent, reviews received, review rate | Sheet |
| Paid | Spend, reach, CTR, cost per lead, cost per order, ROAS | Meta, Google |
| Content | Reel views, saves, profile visits, link clicks per post | Platforms |
| Quality | Core Web Vitals, LCP under 2.5s, form errors | Search Console, tests |

Targets are set after four weeks of baseline. Do not import generic benchmarks as goals.

Weekly review ritual (30 minutes, same day each week, owner named TODO):
1. 5 min: last week numbers against the previous week.
2. 5 min: leads that have not had a reply. Reply today.
3. 5 min: top and bottom content and ads.
4. 5 min: customer feedback and complaints, verbatim.
5. 5 min: decide next week's experiments (maximum 3). Each has a hypothesis, a metric, a date.
6. 5 min: log decisions in an experiment log with the result after the run.

Monthly: reconcile Sheet revenue to the bank or M-Pesa records (TODO method), review proof register, check consent records, and prune lists of people who asked to stop.

## 10. 30, 60, 90 day launch plan

Launch date is TODO. Day 1 is the site going live.

### Days 1 to 30: foundation and first signals
- Site live with tracking slots, consent banner, UTMs, sitemap, structured data.
- Lead capture 1, 2, 5, 9, 10, 11 live. Sheet and email lists wired and tested end to end.
- Welcome and post-order messages written, saved as WhatsApp quick replies.
- Instagram and Facebook posting rhythm started. Link hub `/links` live. Pinterest account and first 20 pins.
- Contact every current stockist for permission and details for the locator.
- First paid test at the low end of the Month 1 ranges, with 3 to 4 creatives.
- Photo consent form ready.
- Metric baseline recorded.

### Days 31 to 60: expand capture and test
- Quiz, gift finder, catalogue download, birthday and baby shower club live.
- First review requests sent. Review display live once real reviews exist.
- Christmas gifting page and cut off dates published (TODO courier dates).
- Become a stockist outreach starts: aim for a target number of conversations (TODO client sets).
- Scale Meta winners, start Google Search, test TikTok if organic video earns attention.
- First WhatsApp Channel broadcasts. First parent photos published with consent.
- First B2B reorder reminders sent.
- Two blog posts per month live, each with pins and a social cut down.

### Days 61 to 90: Christmas push and systems
- Q4 gifting campaign at the chosen budget. Diaspora creative and landing page.
- Corporate gifting outreach with sample bundles.
- Project and workshop sign up live, first event announced if scheduled.
- Referral and loyalty ideas decided by client and live (shareable gift page first).
- Retargeting active, offline conversion import weekly.
- 90 day review: which channels earn orders, cost per order, lead quality, reply times, stockist pipeline. Cut what does not work. Write the next 90 day plan.

## 11. Components and pages the site must include for marketing (checklist)

Pages
- [ ] Home with inline newsletter and gift finder entry
- [ ] Shop listing and product pages with restock alert beside unavailable variants
- [ ] Size and colour finder quiz page
- [ ] Gift finder page and gifting landing pages (Christmas, Easter, Mother's Day, Eid, baby showers, birthdays, graduation)
- [ ] Wholesale page with price list request and catalogue download
- [ ] Become a stockist page (four steps)
- [ ] Stockist locator page (verified, permissioned)
- [ ] Partners page with enquiry form and type selector (corporate, hotel and lodge, school and ECD, NGO, diaspora, tourist outlet)
- [ ] Corporate gifting page
- [ ] Diaspora gifting page
- [ ] Projects and workshop sign up page
- [ ] Impact page with sourced numbers only
- [ ] Maker profiles page (with consent)
- [ ] Reviews display and review submission page
- [ ] Blog index and posts, care guide, size guide, FAQ
- [ ] Parent photo programme page with consent explanation
- [ ] Link hub page `/links` for bios
- [ ] Order confirmation and thank you pages with WhatsApp recap
- [ ] Privacy, cookies and terms pages
- [ ] 404 page with search and WhatsApp link

Components
- [ ] Persistent WhatsApp click to chat button with prefilled context, 44px minimum, not covering content
- [ ] Inline newsletter form (footer and blog)
- [ ] Reusable lead form component with minimal fields, honeypot, validation, consent line, success state
- [ ] Consent banner and preference centre, not blocking content
- [ ] Tracking provider (GA4, GTM, Meta, TikTok slots, ID via env vars)
- [ ] UTM capture and persistence utility
- [ ] Event helper with the named events in section 6
- [ ] Route handlers for lead posting to email service and Sheet
- [ ] Share to WhatsApp button on products and gift pages
- [ ] Review card, rating summary (only shows real data)
- [ ] Maker card, impact counter (data driven, hides when no data)
- [ ] Stockist card and locator map or list
- [ ] Trust strip (materials, child safe statement as approved, zero plastic, recycled yarn, 25+ women)
- [ ] Uniform product and content cards per the charter
- [ ] Open Graph images per page, schema.org Product, Organization, LocalBusiness (if applicable), FAQ and BlogPosting
- [ ] Sitemap, robots, canonical tags, Pinterest verification tag
- [ ] Proof register and TODO list exported from placeholders

Open inputs needed from the client for this report: WhatsApp number and hours, email domain and service choice, prices and wholesale terms, delivery zones and cut off dates, tracking IDs, stockist permissions and logos, safety documentation, photo and maker consents, paid budget, referral decisions, privacy and data registration.
