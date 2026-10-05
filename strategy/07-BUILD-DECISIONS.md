# 07 Build Decisions (binding)

This file overrides strategy reports 01 to 06 wherever they differ. The Phase 2 audit (gates/phase2-audit.md) found 19 contradictions between those reports. The decisions D1 to D40 below resolve them. Rulings by the charter owner are listed first and win over any D item.

## Charter owner rulings (2026-10-01)

R1. **Media rights.** All supplied media is cleared, including photos of makers, customers and children. D28 is amended: there is no `cleared` gate. The manifest still carries `approved` (client review) and `crop` fields. Photos are used wherever they fit best.
R2. **Brief facts are confirmed.** Everything in the client brief is usable: founded 2019 in Nairobi, founder Leah Maina, "Mikono" means hands, 25+ women supported, Facebook and Instagram handle @mikonocreations, the seven outlets by name with their locations. D40 is amended accordingly. Anything not in the brief stays TODO.
R3. **Rule 4 scope.** The muted earthy palette governs the UI: backgrounds, text, borders, badges, illustration, states. Product photographs and the toys' own colours are content and are never filtered, tinted or recoloured. Photo Colour Rule (audit section 4.3) is adopted in full, including the OKLCH chroma cap of 0.13 for UI tokens.
R4. **Card uniformity.** Every repeating card set (products, journal, projects, makers, outlets, features) has equal height, equal image ratio, equal padding and CTAs on one baseline. Only the one-off bento category mosaic on the home page may vary tile width, and each tile keeps its label and arrow in the same corner. D35 is amended accordingly.
R5. **Sizes.** The four size classes S, M, L, XL are the only size information shown. No centimetre values until the client supplies them. The size guide explains classes by relative comparison only.
R6. **Species and colour.** Five independent decider votes resolve unclear species (media/manifest/decisions.json). The majority is used and the client corrects at review. The shop shows every identified animal. Animals outside the safari and domestic groups go to "More animals".
R7. **Prices.** `pricesConfirmed` is false at launch. Product cards show "Price on request" and the product page offers "Ask on WhatsApp" and "Add to order list". When the client supplies prices the flag flips and the build validates every product has a price.
R8. **Content scope.** Journal and Projects ship in release 1, built from the real photos, because the client has extensive media for them. Posts may use general knowledge about animals, crafts and play if accurate and plain. No invented statistics, quotes, studies, testimonials or medical or safety claims. Maker names are not used unless the client supplies them.
R9. **Safety claims.** D26 stands. Allowed: zero plastic, nothing detachable, easy to clean, recycled acrylic yarn, made in Nairobi, 25+ women supported. Not allowed until evidence: child safe, safe for babies, tested, certified, age ranges.
R10. **Wording.** UI nouns: "crocheted animals" and "stuffed animals". Not "toys" in headings. "Dolls" only for the doll product.

## Decisions D1 to D40 (from the audit, with the rulings above applied)

## 7. Decisions the build will follow (40 items)

These override the six reports wherever they differ.

**Routes and naming**
- D1. Routes: `/`, `/shop`, `/shop/safari-animals`, `/shop/domestic-animals`, `/shop/more-animals`, `/shop/[slug]` (flat product URL), `/gifts`, `/wholesale`, `/partners`, `/supply`, `/custom`, `/stockists`, `/story`, `/impact`, `/makers`, `/journal`, `/journal/[slug]`, `/projects`, `/projects/[slug]`, `/gallery`, `/care`, `/size-guide`, `/safety`, `/faq`, `/delivery`, `/contact`, `/cart`, `/order`, `/order/sent`, `/privacy`, `/cookies`, `/terms`; drop `/blog`, `/partner`, `/about`, `/colour-guide`, colour and size landing pages, `/shop/[species]/[slug]`.
- D2. Nav: Shop, Gifts, Wholesale, Our story, Journal, plus Contact link, WhatsApp link and cart; "Trade" is an internal word only; footer carries partners, supply, care, size guide, FAQ, delivery and legal.
- D3. Categories are Safari animals, Domestic animals, More animals (client confirms names); no "Farm" or "Pets"; UI says "animals", and the client decides between "animals", "toys" and "dolls" (Q12).

**Product, variants, availability**
- D4. Product (page) has Colourways (key, label, images) and Sizes S, M, L, XL; a Variant is colourway x size with `sku = {slug}-{colourKey}-{size}` lowercase.
- D5. The cart key, event `item_id`, schema `sku`, feed `id` and WhatsApp line all use the SKU (replaces the pipe key in 02 §1.2).
- D6. Images belong to a colourway, not a size; each image carries `shownSize` (nullable); manifest size guesses are never displayed as fact.
- D7. One colour taxonomy file (`key`, `label`, `family`, swatch source) derived from manifest colours and approved by the client; UI palette token names are never used as product colour names unless the photo matches.
- D8. Product H1 and title are "{Colour} {Animal}" with no size; size lives in the selector and variant schema; meta titles are length checked at build.
- D9. Availability per variant: `ready`, `made_to_order`, `limited`, `ask` (default), `unavailable`; schema maps ready to InStock, limited to LimitedAvailability, unavailable to OutOfStock, made to order only if Rich Results Test accepts it; feeds include only `ready`, `limited` and lead-time-confirmed `made_to_order`.
- D10. No stock counts anywhere, including restock messages; remove the count sentence from 04 §3.4.
- D11. `pricesConfirmed` flag: when false, show "Price on request", omit Offer schema, feeds, price filter and "from KES" meta; when true, a product without a price fails the build.
- D12. Listing cards show "Choose size" (links to product), "From KES x" or "Price on request" in a fixed price row; add to cart exists only on the product page.

**Cart, wizard, data**
- D13. Add to cart shows a toast and updates the count; the drawer opens only when the cart is tapped (06 wins over 02 §1.1); drawer buttons "View cart" and "Continue to order form"; never the word "checkout".
- D14. Wizard steps: Who is ordering, Your details (incl. payment preference and notes), Delivery or pickup (incl. date wish), Gift options (skippable), Review and send; count is computed ("Step 2 of 4"); shop, business and organisation answers lead to `/wholesale` with a "continue as retail" link; KRA PIN, invoice and PO fields are removed from the retail wizard.
- D15. Delivery options at launch: pickup, Nairobi area, other Kenyan town; international address entry is removed until the client confirms; diaspora buyers pay from abroad and send to a recipient in Kenya (payment method TODO).
- D16. No `recipientFirstName` and no `recipientAgeBucket`; `sendDirect` keeps adult contact name and phone only; the gift note hint says "please do not include a child's surname, school or age"; quiz and gift finder answers stay on the device; the reminder club stores contact plus occasion type and date only; `mk.orders.v1` keeps ref and item summary only (no name, phone, address); KRA PIN is never stored.
- D17. Delivery data is `deliveryAreas[]` (`area`, `zone` A or B, `feeKes|null`, `codAllowed`) plus zone C for other Kenya; fees show "to be confirmed" until supplied.
- D18. Release 1 has no server persistence: every form ends in a WhatsApp message with copy fallback; email provider and Google Sheet routes (04 §2 E and S), newsletter, restock alert and review submission wait until the client chooses an email provider and owns the Sheet; marketing consent travels in the message text only.
- D19. Env vars: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_ENV`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`, `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits with country code, no plus), optional `NEXT_PUBLIC_WHATSAPP_NUMBER_TRADE` (falls back to retail), `NEXT_PUBLIC_CONTACT_EMAIL`; reserved server names `META_CAPI_TOKEN`, `TIKTOK_EVENTS_API_TOKEN`, `GA4_API_SECRET`, `EMAIL_PROVIDER_API_KEY`, `LEADS_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_JSON`; one typed `lib/env.ts` lists what is missing at build; no domain is hardcoded.

**Wholesale and trade**
- D20. No wholesale or tier price appears on any public page, PDF, schema, feed or WhatsApp catalogue; the price list is sent by a person on WhatsApp after the form; no price table on `/wholesale`.
- D21. One wholesale form with request type (price list, quote, sample pack, reorder), phone required, email optional, fields from 02 §5.1; one `QUOTE_THRESHOLD_UNITS` constant drives the cart and wizard suggestion (soft prompt, never a block), replacing 20, 30 and 500.

**Tracking**
- D22. Event names: `view_item_list`, `select_item`, `view_item`, `select_variant`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `wizard_step_complete`, `add_shipping_info`, `whatsapp_order_submit` (the Send tap, the single order conversion), `whatsapp_click` (every other WhatsApp link), `generate_lead` (all enquiry forms, with `lead_type` of wholesale, price_list, sample_pack, quote, partnership, supply, custom, contact, catalogue), `newsletter_signup`, `file_download`, `consent_update`, `web_vitals`; remove `click_whatsapp`, `wholesale_request`, `price_list_request`, `partner_enquiry`, `catalogue_download`, `wizard_step`, `OrderSentToWhatsApp`.
- D23. Mapping: `whatsapp_order_submit` to Meta `Lead` and TikTok `SubmitForm` (no Meta `Contact` on the same tap); `whatsapp_click` to `Contact`; `generate_lead` to `Lead` and `SubmitForm`; never `purchase`; no `PlaceAnOrder`; `value` only when real.
- D24. Order ref is `MK-YYMMDD-XXXX` (02 §3.1) with prefixes MK, WS, PT, SP, CU; a `Source:` line (for example `instagram / paid / xmas-2026`) is added to the message only when attribution exists; the site URL comes from env.
- D25. UTMs are held in memory before analytics consent and stored in `mk_attr` after; lower case values per 04 §6.

**Trust and privacy**
- D26. Approved claims only: "Zero plastic", "Nothing detachable", "Easy to clean", "Recycled acrylic yarn", "Made in Nairobi", "25+ women supported"; banned until evidence: child safe, safe for babies, tested, certified, age range, "nothing to swallow", "choking", "cannot be pulled off"; "made by 25+ women" only if the client confirms they are the makers.
- D27. Trust strip is exactly four items (zero plastic, nothing detachable, recycled acrylic yarn, 25+ women supported); the stats band renders only confirmed figures (one figure uses a single stat layout; none hides the band); "Best sellers" is renamed "Featured animals" until sales data exists.
- D28. Add `cleared`, `bg`, `focal`, `fit`, `shownSize`, `approved` to the manifest; people images are unpublished unless `cleared: true`; the home gallery renders only with 4 or more cleared images, otherwise the section is omitted (no placeholders).

**Design**
- D29. Photo Colour Rule (section 4.3) is adopted, subject to charter owner sign-off on rule 4 scope; UI chroma cap is OKLCH 0.13; replace the HSL saturation test.
- D30. Swatches are photo crops or true sampled hex with printed name; no clamping; `multiply` only on manifest `bg: white`.
- D31. The hero blob uses CSS `border-radius` (blob-a), not SVG `clip-path`; clip-path is reserved for non-LCP images; shadows on listing cards use the lighter `clay-sm`; drop-shadow filters are limited to the story pages.
- D32. Fonts: Fraunces and Figtree site wide, Caveat only in the story, journal and projects layouts; loader variables renamed per G11; image quality values follow the Next 16 docs (G9).
- D33. `<html lang="en-KE">`; `/shop` renders all products on one page up to 48 items, "Load more" only above that.
- D34. Bottom UI order: consent bar above everything; the WhatsApp button hides on `/cart`, `/order` and whenever a sticky action bar or the consent bar is on screen; sticky product bar and wizard bar never coexist.
- D35. Cards: bento keeps equal internal structure and closed rows but not equal spans (pending ruling); blog and project feature cards move to a hero block above a uniform grid; QA uses `data-card` type and `data-ratio`; "Clear my data" and "Cookie settings" live together in the footer.

**Scope and content**
- D36. Release 1 excludes search, bundles, build your own, wishlist, reviews, accounts, quiz, gift finder, reminder club, UGC, locator map, workshops, sponsor-a-doll (section 5.2); the header search field and SearchAction are removed.
- D37. `/custom` and `/supply` reuse the enquiry form engine and ship as fast follow; `/partners` and `/wholesale` ship in release 1.
- D38. One content model under `content/`: JSON for animals, colours, faq, microcopy, deliveryAreas, facts; MDX for journal and projects; 02's `copy.ts` is replaced by a typed accessor over `microcopy.json`; the master post list is 05 §4 and 03 §8 and 04 §4 titles map to it.
- D39. Phase 3 starts by reading `node_modules/next/dist/docs/`; JSON-LD escapes `<` as `<`; `scripts/qa-copy.mjs` runs the dash, slop and TODO checks in `prebuild`; the TODO register page is preview only.
- D40. Unconfirmed facts are not used in copy until the client confirms: handles, "Founded in 2019", stockist names and venues, "Mikono means hands", "yarn lots vary", wildlife facts for Pillar A; the scaffold `app/page.tsx` and `app/layout.tsx` are replaced in Phase 3.

## Charter owner ruling R11 (2026-10-02): compact density

The owner finds the interface too large and wants everything much smaller and denser, more content per screen, on phone and desktop. This overrides the earlier 16px minimum text rule and the 17px body size. New floors: body text 14 to 15px, secondary text 13px, mono labels and chips 11 to 12px uppercase with letter spacing. Card gaps 8 to 12px on phones. Visual control height may shrink to 32 to 36px, but every interactive element keeps a hit area of at least 44px by padding or a pseudo-element, so tapping stays reliable. Contrast rules (AA) are unchanged. Layout rules (equal card heights, aligned CTAs) are unchanged.
