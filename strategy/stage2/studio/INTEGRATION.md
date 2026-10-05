# Custom Studio integration notes

Route: `/custom/studio` (sent page `/custom/studio/sent`). Not linked from anywhere yet. Every CTA should append `?src=<entry>` (nav, home, product, cart, 404, journal, gifts, wholesale, footer, post_order). The Studio reads `src` for the `studio_view` event, `?base=<slug>` (preselects the base animal and sets type to "Make it my way") and `?type=<type>`.

Valid `type` values: base_variation, new_animal, pet_or_character, child_drawing, keepsake, wedding_shower, event_favours, branded_mascot, corporate_gift, hotel_lodge_shop, school_ngo_project, wall_or_special.

| Placement | File | Label | Href |
|---|---|---|---|
| Menu (Shop panel and mobile menu) | lib/menu.ts | Design your own animal | /custom/studio?src=nav |
| Home closing band | app/page.tsx | Want something that is not on the shelf? Start your brief | /custom/studio?src=home |
| Product page, under the variant selectors | app/shop/[slug] | Want it different? Customise this animal | /custom/studio?base={slug}&src=product |
| Shop listing end (after the grid) | app/shop/page.tsx | Cannot find your animal? Tell us about it | /custom/studio?type=new_animal&src=shop |
| Cart and cart drawer (not the order wizard) | components/CartView.tsx | Want a custom piece too? Start a brief | /custom/studio?src=cart |
| 404 | app/not-found.tsx | Looking for something special? Design your own | /custom/studio?src=404 |
| Journal posts end panel | journal layout | Make an animal like this one | /custom/studio?src=journal |
| Gifts top, plus one card per occasion | app/gifts/page.tsx | A gift that is just right: design your own | /custom/studio?type=wedding_shower&src=gifts |
| Wholesale | app/wholesale/page.tsx | Need a branded or mascot animal? Start a custom brief | /custom/studio?type=branded_mascot&src=wholesale |
| Projects and Impact | app/projects, app/impact | Plan an animal for your school or project | /custom/studio?type=school_ngo_project&src=impact |
| Footer, Shop column | lib/site.ts footerGroups | Custom orders | /custom/studio?src=footer |
| Post-order page | app/order/sent | Planning something special? Start a custom brief | /custom/studio?src=post_order |
| FAQ | content faq | Can you make my idea? (honest answer plus link) | /custom/studio?src=faq |
| Existing /custom page | app/custom/page.tsx | Start your brief | /custom/studio?src=custom (or replace the form) |

Also: add `/custom/studio` to `staticRoutes` in lib/site.ts for the sitemap. The WhatsApp float already hides on the Studio through `html[data-sticky-bar="on"]`.

Findings for later: `lib/track.ts` types events as a closed union, so Studio events are cast in `lib/studio/track.ts`; add the `studio_*` names to `TRACK_EVENTS` when convenient. Pixels only map generate_lead and whatsapp_click, which the Studio reuses.
