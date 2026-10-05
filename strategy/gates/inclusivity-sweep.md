# Inclusivity sweep (2026-10-04 and 2026-10-05)

Rule from the owner: every form, chooser and wizard is comprehensive and inclusive, never restrictive. Caps below are safety guards only. Nothing shows a cap until it is reached.

| Form or chooser | What was restrictive | What changed |
|---|---|---|
| Studio, who is ordering | 8 types, no way to add one | 19 types (individual, gift buyer, family or carer, outside Kenya, collector, teacher, school or ECD, hospital or clinic, church or faith group, community group, NGO, lodge or hotel, restaurant, shop, wholesaler, event planner, company, government) plus "Other, tell us" with free text. No "parent". |
| Studio, kind of order | "up to 4", 23 kinds, some pending | any number (guard 40), 29 kinds plus Other, all offered, none to be confirmed |
| Studio, pieces | 12 | 30, the piece list wraps and scrolls inside itself, the Brief Card list scrolls above 6 |
| Studio, base forms | few generic shapes | adds bird, sea animal, insect, farm animal, and "Other, tell us"; every catalogue product is a base |
| Studio, size | S to XL plus advise | adds "Not sure, help me choose" and "Other size, tell us" with free text |
| Studio, quantity | max 9999, bulk from 6 | any number to 99999, bulk starts at 20 (owner), bands 1, 2 to 5, 6 to 19, 20 to 49, 50 to 99, 100 plus |
| Studio, colours | 5, 3 sources | 12 shown without a visible cap, any colour by name in the note, "Surprise me", match from a photo, 12 references |
| Studio, features and extras | closed lists, pending | every list ends with "Other, tell us" and free text, all offered, "If we cannot do something exactly, we tell you before we start." |
| Studio, inspiration | 6 likes, 5 links, 10 photos, 4 notes | 12 likes, 10 links, 20 photos, 10 notes, no counters like "3 of 5" |
| Studio, occasions | 14 | 29 including naming ceremony, engagement, traditional or cultural ceremony, new home, retirement, Diwali, Father's Day, Madaraka, Mashujaa and Jamhuri Day, get well, sympathy, thank you, fundraiser, just because, other. Day and month only. |
| Studio, timing | firm date, flexible, not sure | adds "As soon as possible" |
| Studio, delivery | 6 addresses, 6 methods | 20 addresses, 8 methods: pickup point, someone else collects, Nairobi, another Kenyan town with a county list of all 47, courier or bus parcel service, straight to a person, send abroad (ask us), other. Delivery cost wording is "depends on where it is going and is confirmed in your quote". |
| Studio, budget | no bands | rough guide bands (owner, estimates), not sure, prefer not to say, own words |
| Studio, payment | none | timing (one choice), ways to pay (optional, Other, to be confirmed), free note |
| Studio, contact | name 80, one number format | one full name field (any name, any script), phone accepts Kenyan numbers in every form and foreign numbers by E.164 shape, channels add SMS and other, times add weekends and other, languages add other, reply note, "Anything that would make this easier for you?" (message only, never saved) |
| Progress photos, approval before finishing | offered | removed everywhere (owner) |
| Gift Finder | 6 people, 9 occasions, 4 kinds | 20 people, 29 occasions, 9 kinds (safari, farm and pets, sea, birds and insects, wall art, dolls, more, surprise, other), 14 "who" answers, sizes add "not sure" and "other", colours add "any colour, surprise me" and "other"; Other opens free text that travels in the share message |
| Size Finder | 4 uses | unchanged list, buttons now 44 px |
| Family builder | 12 lines, 20 each | 24 lines, 200 each, any animal in any colourway and size; the link falls back to a short message and the full list is copied |
| Order wizard | 6 customer types, 3 delivery ways, 6 places | 19 customer types plus Other, 7 ways to receive (pickup, someone collects, Nairobi, other town, courier or bus, abroad, other), up to 20 places each with its own way, flexible or as soon as possible date, foreign phone numbers, Other for channel, language, occasion, interests, how heard, business kind, access question, payment timing and ways, 47 counties |
| Cart and share | 20 per line, 40 lines, 24 shared | 500 per line, 100 lines, 60 shared |
| Wholesale, partners, supply, custom, contact | few request types, 12 animals, 8 places, 4 contacts, no way to add | more kinds plus "Other, tell us", 40 animals, 40 places, 20 contacts, quantity bands to 500 plus and "not sure", reply preferences, access question, payment preferences (wholesale), foreign phone numbers, full name |
| Data request | 7 request types | adds "Other, tell us", reply method, access question |
| Cookie and consent | unchanged | unticked by default, Accept and Reject equal, no change needed |
| One business number | trade number logic | removed, all messages go to the one number |

Tests: scripts/test-*.mjs cover every cap through the exported constants, the largest briefs and carts (30 pieces, 20 addresses, 100 lines, 20 places), the link fallbacks, Other answers, phone shapes, payment, estimates and the removed questions. Phone gate: scripts/mobile-qa/inclusive.mjs.
