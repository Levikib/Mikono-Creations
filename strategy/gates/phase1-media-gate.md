# Phase 1 gate: media analysis

Date: 2026-10-01

## Mechanical audit (PASS)
- 88 manifest entries (87 images, 1 video), one per source file, no gaps, no extras.
- All required schema fields present on every entry.
- Zero em or en dashes in any manifest text.
- 68 entries flagged needs_human_review. 36 entries show people.

## Blind cross-check (PASS with conditions)
Two agents re-labelled 60 images (all product, stall and low-confidence shots) without seeing the first labels.
- Exact species-set agreement: 44 of 60 (73 percent).
- Remaining 16 differ only on crowded stall piles or genuinely ambiguous toys. No clean single-product image disagreed.
- Hard disagreements: img-017 (turtle vs chick in the background), img-045 (crowded table), img-077 (duck vs goose).
- Both passes were unsure on the same toys: bear vs koala vs monkey (030, 034, 073, 078), hippo vs rhino vs bear (048, 082), duck vs goose (077, 081), cat vs rabbit vs bear (041, 045, 087), turtle vs tortoise (084).

## Conditions carried forward
1. Crowded stall photos (007, 009, 017, 024, 038, 044, 045, 064, 069, 080, 085, 087) are never used to prove a specific product. Gallery, stockist and story use only.
2. Any animal where both passes were unsure gets no product listing until the client confirms what it is.
3. Size is never inferred from a photo. Sizes come from client dimensions. Image 083 and 063 hint at a four size lion ladder.
4. Images showing people stay unpublished until marked cleared.
5. Images marked avoid, or showing third party material (pattern book scans, licensed looking characters, other brands' signs), are excluded.

## Update 2026-10-01: species decisions and rulings
- Condition 2 replaced by the client ruling: five independent deciders (anatomy, reference match, Kenyan wildlife, toy design, zoomed crops) voted on 44 unclear images. Results in media/manifest/decisions.json. Majority wins, client corrects at review.
- Unanimous: bears (030, 034), cats (041), hippo in a dress (048, 082), monkeys (073, 078), goose (081), turtles (084), dinosaur (032), chameleon (036). Near unanimous: goose (077, 4 of 5), bear (004, 4 of 5).
- Conditions 4 and 5 replaced by the client ruling that all media is owned and cleared (charter rule 10).
- Resolved labels per image: media/manifest/resolved.json.
