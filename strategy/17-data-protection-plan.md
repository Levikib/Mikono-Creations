# 17. Data Protection Plan (Kenya)

Status: draft for owner decision and advocate review. D16, D18 and the charter stay in force. Where this plan is stricter than 03 or 04, it wins for anything stored on a server.

**I am not a lawyer. A Kenyan advocate must review this plan before the database goes live.** Marks: **[V]** I read the text in the source named. **[U]** unverified, from secondary sources or memory, check it. Read in full: the Act (https://www.kentrade.go.ke/wp-content/uploads/2022/09/Data-Protection-Act-1.pdf), the General Regulations 2021 (https://www.odpc.go.ke/wp-content/uploads/2024/03/THE-DATA-PROTECTION-GENERAL-REGULATIONS-2021-1.pdf) and the ODPC registration guidance note (https://www.odpc.go.ke/wp-content/uploads/2024/02/ODPC-Guidance-Note-on-Registration-of-Data-Controllers-and-Data-Processors.pdf). Kenya Law and odpc.go.ke/registration returned errors, so the Registration Regulations text was not read; I used the guidance note and the FAQ (https://www.odpc.go.ke/faqs/).

## 0. Where we are today

The site stores nothing on a server (D18), but orders arrive by WhatsApp with names, phones and addresses, so Mikono is already a data controller. A database, marketing profiles and behavioural data raise the duties sharply. The live /privacy page says it "keeps nothing about you on a server"; that becomes false on launch day, so the page changes first.

## 1. Before collecting and storing

### 1.1 Register with the ODPC
- Act s.18: nobody may act as controller or processor unless registered, subject to thresholds. Not registering is an offence (s.19(7)). [V]
- Exempt only if turnover is below KES 5 million AND fewer than 10 employees AND the entity is not in a listed activity. Listed, no exemption at any size: political canvassing, crime prevention, gambling, education, health administration, hospitality, property management, financial services, telecoms, **direct marketing**, transport, genetic data. [V guidance note s.3, s.4]
- Entities outside Kenya that process data of people in Kenya must register too. [V]
- **Owner's likely position:** marketing pipelines (newsletter, WhatsApp updates, reminders, ad pixels) are direct marketing, so assume registration is required even for a tiny business. Whether today's WhatsApp-only handling already needs it is for the advocate.
- Fees [V guidance note and FAQ]: KES 4,000 micro and small (listed-activity entities under KES 5m and under 10 staff also pay 4,000); KES 16,000 medium; KES 40,000 large. Renewal about KES 2,000 / 9,000 / 25,000 and 24 month validity [U, FAQ summary].
- Process [V guidance note]: online application; controller or processor; contact details and a DPO or named contact person; classes of data, data subject categories and purposes (types only); sensitive data yes or no; countries data goes to; risks and safeguards; fee tier; payment by mobile money, card, cheque or deposit; certificate within 14 days of application and payment; report changes to registration@odpc.go.ke. Portal address not verified; start at https://www.odpc.go.ke.

### 1.2 Data Protection Impact Assessment
Act s.31 requires a DPIA before likely high-risk processing. Reg 49 triggers include profiling, sensitive or **children's data**, **combining datasets from different sources for different purposes**, large scale and new technology. [V] Joining behavioural analytics to named order and marketing profiles is the combining trigger, so treat the DPIA as required. Use the Third Schedule template (reg 50), kept short and proportionate. If residual risk is high, consult the Commissioner (60 days; silence for 60 days counts as approval, regs 51 and 52). [V] Redo the DPIA on any change.

### 1.3 DPO or contact
Act s.24: a controller "may" designate a DPO (for regular systematic monitoring, sensitive data, or private bodies generally); contact details must be published and given to the Commissioner. [V] The ODPC form accepts a named contact person. Name one **Privacy Contact** and publish `[PRIVACY CONTACT EMAIL]` and `[PHONE]`. Also required: a published data protection policy (reg 23), written processor contracts (reg 24), a retention schedule (reg 19) and a breach record (s.43(8)).

## 2. Data map by tier

Collect a field only if it has a stated purpose and the form works without it (s.25(d), s.41(3)). Bases: **Contract** s.30(1)(b)(i); **Consent** s.30(1)(a); **LI** legitimate interests s.30(1)(b)(vii), only for security and fraud, never marketing. Sensitive data (s.2) means race, health status, ethnic social origin, conscience, belief, genetic, biometric, property details, marital status, family details including **names of the person's children**, parents, spouse, sex, sexual orientation. [V]

| Field | Purpose | Basis | Retention | Access | Shared with | Sensitive |
|---|---|---|---|---|---|---|
| **Tier 0** events (name, page, product, UTM, consent flags), device type, coarse region (no IP stored) | Count visits, fix the site | Consent (analytics) | 14 months max, then aggregate | Owner | GA4, after consent only | No |
| Ad pixel events | Measure ads | Consent (advertising) | Held by platform; we keep none | Owner | Meta, TikTok, Google | No |
| **Tier 1** name, phone | Take and deliver the order | Contract | Delete or anonymise 90 days after delivery | Owner, packer | Courier (minimum), WhatsApp | No |
| Delivery area, address, notes | Deliver | Contract | Same | Owner, courier for that job | Courier | No, but warn: no child details |
| Order ref, items, amounts | Fulfil, accounts | Contract, legal duty | 5 years, no contact details [U, tax record period] | Owner, accountant | Accountant | No |
| **Tier 2** (each optional, own tick) email | Newsletter | Consent | Until withdrawn, or 24 months inactive then one re-confirm, then delete | Owner | Email provider | No |
| WhatsApp number for marketing | Updates | Consent | Same | Owner | Meta | No |
| Occasion type and day and month (no year, name, relation, age) | Reminder 3 weeks before | Consent | Until the date passes once, then renew or delete | Owner | Email or WhatsApp | See 2.1 |
| Interests, how heard, customer type, adult's own birthday month | Relevant content, channel analysis | Consent | Same as email | Owner | Email provider | No |
| **Tier 3** business name, outlet, volume, contact person | Quote, terms, reorder | Contract; marketing by Consent | Relationship plus 24 months inactive | Owner | Accountant, courier | Named person is personal data |
| Invoice name | Invoice | Contract, legal duty | 5 years [U] | Owner, accountant | Accountant | No |
| KRA PIN | Tax invoice | Legal duty | **Not stored** (D16). Typed on the invoice, then discarded; only flag "PIN supplied" | Owner | None | High risk if leaked |
| Behaviour linked to a customer record | Suggestions, own analysis | Consent, separate from analytics | 12 months | Owner | None outside our DB | No |
| Consent ledger | Prove consent (burden is ours, s.32(1)) | Legal duty, LI | Life of consent plus 6 years [U, advocate] | Owner | DB provider | No |

### 2.1 Occasion data trap
Marital status and health status are sensitive. A wedding, anniversary or baby shower date can reveal them. Offer only generic types (Birthday, Christmas, Gift, Corporate, Other) with day and month, no "for whom". Never copy free text such as "my sister's baby shower" into a profile. Customer type options: Gift for someone, For my home, Business, School or NGO. Never "parent". The advocate confirms the list.

## 3. Children

Customers are adults; no purpose here needs a child's data, so none is collected.
- Law: processing a child's data needs parent or guardian consent and age verification (s.33); a child's name is sensitive "family detail" (s.2); children's data is a DPIA trigger (reg 49(1)(e)); the policy must say how children's data is handled (reg 23(2)(g)). [V]
- **Forms:** no fields for child name, age, birth year, school, photo or class. Gift note hint (D16): "Please do not include a child's name, surname, school or age." No auto-suggest.
- **Volunteered child data** (WhatsApp, note, Studio brief): use only to finish that order, never copy to the database or marketing profile, delete from notes and exports 30 days after delivery. If already in a database field, redact within 14 days and log it.
- **Studio inspiration photos with children:** the upload text asks for photos without identifiable children. If one arrives, use it only to make the item, crop or blur faces where possible, keep it in an owner-only private folder, delete 30 days after the order closes. Never use in marketing without separate written parent or guardian consent naming the use.
- **Existing media:** charter R1 clears supplied media. Identifiable children in published photos are still children's personal data; ask the advocate about parent consents (section 10).
- **Marketing without profiling children:** target adults only. No audience, custom list or event built from a child's data or age cues; no age bucket stored (D16: finder answers stay on the device); copy speaks to the adult; pixel events carry product and value only.

## 4. Marketing consent and trackers

### 4.1 Consent standard
Consent is an express, unequivocal, free, specific and informed statement or clear affirmative action (s.2); we prove it and it is withdrawable at any time (s.32); regs 4 and 15. [V]
- **Unticked**, one box per purpose, never bundled with terms or the order. Reg 4(4): not free if presumed from silence, non-negotiable, not refusable without detriment, merged purposes, or ambiguous.
- **Free:** the order works with every box blank (s.32(4)); no discount for ticking.
- **Informed (reg 4(1)):** who we are, purpose, data used, sharing, risks of transfers abroad, right to withdraw, effect of refusing.
- **Recorded:** timestamp, text version id, language, source (page and step), channel, tick state, later withdrawal.
- **Easy to withdraw:** link in every message, STOP by reply, a web page, the Privacy Contact. Withdrawal stops that purpose (reg 4(5)); objection to direct marketing is absolute (reg 8(4)).

### 4.2 What legitimate interest cannot cover
Direct marketing includes catalogues, targeted online adverts and electronic messages about a sale (reg 14(2)). Act s.37 requires express consent; commercial use without consent is an offence (reg 15(4): fine up to KES 20,000 or six months). [V] So LI never covers: newsletters, WhatsApp or SMS promotions, retargeting, lookalike audiences, sharing data for others' marketing, behavioural profiling for offers, or reusing delivery phone and address for marketing. LI may cover fraud checks, site security logs and order status messages. Order confirmations and dispatch notices are Contract and must carry no promotion. Reg 15(1) also describes an opt-out route; I advise against relying on it, since s.37 says express consent. Advocate confirms.

### 4.3 WhatsApp
Meta policy as reported in secondary sources [U, read business.whatsapp.com messaging policy before launch]: business-started messages need an opt-in naming the business and message types; a number on a website is not an opt-in; outside the 24 hour customer window only approved templates may be sent; opt-outs honoured; unsolicited bulk messaging not allowed. Rules for us: one-to-one replies from the Business app are fine; marketing only to ticked contacts, via approved templates, each ending "Reply STOP to stop"; a customer messaging us to order does not consent to marketing; log consent before the first message; send a welcome message restating what they agreed to.

### 4.4 Email
Use **double opt-in** for the newsletter (confirm link; second timestamp). Every email shows sender identity, a one-click unsubscribe link and a way to stop everything (reg 17(4)). Process unsubscribes within 24 hours (our rule). Never disguise the sender or omit a working opt-out address (reg 15(3)). Keep a suppression list so unsubscribed people are not re-added.

### 4.5 SMS
The Communications Authority reportedly requires opt-in, honoured STOP and DND lists, registered sender IDs, licensed content service providers and daytime hours [U, secondary sources; no CA or KICA text opened]. **No SMS marketing in release 1.** If added later, advocate verifies CA rules first.

### 4.6 Cookies and trackers
No standalone Kenyan cookie law found [U]; the Act's consent rules apply, and reg 6(1)(d) treats browsing information as personal data. As in 03 section 7:
- Before consent: strictly necessary storage only (cart, consent record, drafts the user asked for). **No GA4, Meta Pixel, TikTok Pixel or measurement tags, and no cookieless pings.** Consent Mode basic: tags do not load until a choice exists.
- Two switches, Analytics and Advertising, plus a third for linking behaviour to a record. Reject as easy and visible as Accept. No pop-up on first paint.

### 4.7 Profiling and automated decisions
People may refuse decisions based solely on automated processing with significant effect (s.35, reg 22) and may object to marketing profiling (reg 8(4)). Segmenting a newsletter from consented fields is allowed and disclosed. No automated decision on price, access or wholesale approval; a person decides.

## 5. Data subject rights

| Right | Source [V] | Deadline |
|---|---|---|
| Be informed | s.26, s.29 | At collection |
| Access | reg 9 | **7 days**, free |
| Object | s.36, reg 8 | **14 days**; marketing absolute |
| Rectify | s.40, reg 10 | 14 days; refusal in writing within 7 |
| Erase | s.40, reg 12 | **14 days**, free; processors told (s.40(2)) |
| Restrict | s.34, reg 7 | Check reg 7 |
| Port | s.38 | 30 days |
| Complain | Act | Data Commissioner |

ODPC forms DPG1 to DPG5 exist but a plain request must be honoured.

**DSAR process:** (1) channels WhatsApp, `[PRIVACY CONTACT EMAIL]`, a "Your data" page, one log; (2) log day 0, acknowledge within 2 days; (3) verify minimally: reply from the number or email on file, or order ref plus one detail, never ID copies; (4) search the database, Sheet, WhatsApp chats, email provider, GA4, ad platforms, accountant copies; (5) answer in time with data, purposes, recipients, transfers abroad and retention (reg 9(1)); (6) if refusing, give reasons and the right to complain.

**Erase by phone and reference:** the page asks for a phone number and optional order ref, then always shows "If we hold data for this number, we have sent it a confirmation." Send a code by WhatsApp or SMS to that number. On confirmation delete or anonymise Tier 1 to 3 and behaviour links, keep only the legal minimum (financial record without contact details), add a hash to the suppression list, tell processors, and confirm completion within 14 days. Never reveal whether the number exists.

## 6. Cross-border transfers

- Act s.25(h), s.48, s.49, regs 40 to 48 [V]: no transfer unless safeguards (binding instrument with equivalent protection, or our documented assessment), an adequacy decision, necessity, or explicit consent after being told the risks. Sensitive data abroad needs consent and safeguards. Document each transfer (date, recipient, reason, data; reg 41(2)). No Kenyan adequacy list found [U].
- Local-processing rule (s.50, reg 26) covers civil registration, elections, public finance, protected systems, basic education and health care. Mikono is none; advocate confirms because schools are customers. [V]
- **Vercel:** US company; DPA with standard contractual clauses and Data Privacy Framework certification (https://vercel.com/legal/dpa) [U, seen in search results]. Cape Town function region cpt1 is AWS af-south-1 (https://vercel.com/docs/regions), still outside Kenya. Keep personal data out of cached pages, URLs, query strings and logs.
- **Database region:** I found no Kenyan region at major providers [U]. Recommend Cape Town if offered, else EU (Frankfurt); never a US default. Record the reason in the DPIA and registration.
- **Meta, TikTok, Google:** data goes abroad, hence the advertising consent text names them (reg 4(1)(e), reg 46). Send them no names, phones or emails in release 1.
- **Processor contract (reg 24, 25):** subject, duration, purpose, data types and subjects, our instructions, staff confidentiality, security, deletion or return at the end, audit rights, no sub-processor without our authorisation. Record gaps in standard vendor terms in the DPIA.

## 7. Security and breaches

Act s.41, s.42, regs 27 to 36. [V] Minimum:
- Encryption in transit and at rest; field-level encryption for phone and address.
- Named accounts with multi-factor on Vercel, GitHub, database, email provider and WhatsApp Business; no shared passwords; owner plus at most two people with full read access; database roles separate order staff from marketing.
- Database not public; server-only access with a restricted role; secrets in Vercel environment variables, never the repo.
- Read and export logging; full-list export needs the owner.
- Encrypted backups kept 30 days; erasure reaches backups at natural expiry (say so in the notice).
- Weekly retention job logging deletions; quarterly restore test.

**Breach (s.43, regs 37, 38) [V]:** if data is accessed or acquired without authority and there is a real risk of harm, notify the Data Commissioner without delay and within **72 hours** of becoming aware, with reasons if late. A processor tells the controller within 48 hours. Tell affected people in writing within a reasonably practical period, unless encryption protects the data. Record every breach's facts, effects and remedy.

Plan template:
1. People: incident lead `[NAME, PHONE]`, backup `[NAME]`, advocate `[NAME, PHONE]`.
2. Hour 0: stop the leak (revoke keys, rotate passwords, disable the route), keep logs, note the time we became aware.
3. By hour 24: what data, how many people, how, encrypted or not, likely harm.
4. By hour 72: notify the Commissioner if risk is real (reg 38: date and circumstances, chronology, numbers, harm, steps, contact) via `[CONFIRM CURRENT ODPC BREACH CHANNEL]`.
5. Tell people in plain words: what happened, what to do, who to contact.
6. After: record, fix, update the DPIA, review in 14 days.

## 8. Exact texts

Version id: `consent-v1-draft`; bump on any change and store with each consent. Swahili needs review by a fluent speaker and the advocate. Square brackets are for the owner.

### 8.1 Checkout wizard
Above the boxes: "Optional. Your order does not depend on these. You can change your mind at any time." Four separate unticked boxes:

1. **WhatsApp updates.** EN: "Yes, send me news and offers from [LEGAL ENTITY NAME] on WhatsApp, about [FREQUENCY] a month. I can reply STOP at any time." SW: "Ndiyo, nitumie habari na ofa kutoka [LEGAL ENTITY NAME] kupitia WhatsApp, takriban mara [FREQUENCY] kwa mwezi. Naweza kujibu STOP wakati wowote."
2. **Email newsletter.** EN: "Yes, email me the Mikono newsletter ([FREQUENCY]). I will confirm my email by link and can unsubscribe at any time." SW: "Ndiyo, nitumie jarida la Mikono kwa barua pepe ([FREQUENCY]). Nitathibitisha barua pepe kwa kiungo na naweza kujiondoa wakati wowote."
3. **Occasion reminders.** EN: "Yes, remind me about a gift occasion I choose (day and month only). Use my contact details for this only." SW: "Ndiyo, nikumbushe kuhusu tukio la zawadi nitakalochagua (siku na mwezi pekee). Tumia mawasiliano yangu kwa kusudi hili tu."
4. **Remember me on this device.** EN: "Save my name, phone and delivery details on this device only, to speed up my next order. Not sent to Mikono." SW: "Hifadhi jina, simu na maelezo ya uwasilishaji kwenye kifaa hiki pekee ili kuharakisha oda yangu ijayo. Hayatumwi kwa Mikono."

Notice line under the form (not a tick): EN: "[LEGAL ENTITY NAME] uses your name, phone and delivery details to prepare and deliver your order and keeps them for [90 days after delivery]. Please do not add a child's name, school or age. Your rights: Privacy page." SW: "[LEGAL ENTITY NAME] hutumia jina, simu na maelezo yako ya uwasilishaji kuandaa na kuwasilisha oda yako na huyahifadhi kwa [siku 90 baada ya uwasilishaji]. Tafadhali usiweke jina, shule wala umri wa mtoto. Haki zako: ukurasa wa Faragha."

### 8.2 Cookie bar and panel
Bar. EN: "We use essential storage to run your order list. With your OK we also measure visits and ads. [Accept all] [Reject non-essential] [Choose]" SW: "Tunatumia hifadhi muhimu kuendesha orodha ya oda. Ukikubali, tunapima pia ziara na matangazo. [Kubali yote] [Kataa yasiyo ya lazima] [Chagua]"

Switches, default off:
- **Analytics.** EN: "Allow Google Analytics to count visits and pages so we can improve the site. Data goes to Google, outside Kenya." SW: "Ruhusu Google Analytics kuhesabu ziara na kurasa ili tuboreshe tovuti. Data huenda Google, nje ya Kenya."
- **Advertising.** EN: "Allow Meta, TikTok and Google to measure and show our ads. They receive data about your visit, outside Kenya, and may use it under their own policies." SW: "Ruhusu Meta, TikTok na Google kupima na kuonyesha matangazo yetu. Hupokea data kuhusu ziara yako, nje ya Kenya, na zinaweza kuitumia kulingana na sera zao."
- **Link my visits to my customer record** (only after Analytics, only once a record exists). EN: "Link my browsing to my customer record to improve suggestions. Optional." SW: "Unganisha kuvinjari kwangu na rekodi yangu ya mteja ili kuboresha mapendekezo. Si lazima."

### 8.3 Changes to /privacy
Current sections: In short; What is saved on your device; When you send a message; Analytics and ads; Questions.
- **In short:** replace the "nothing on a server" line with: "We keep your order details so we can deliver and support your order. Marketing, analytics and ads stay off unless you say yes."
- **Add Who we are:** "[LEGAL ENTITY NAME], registration number [REGISTRATION NUMBER], [ADDRESS]. ODPC certificate [CERTIFICATE NUMBER]. Privacy contact [PRIVACY CONTACT EMAIL], [PHONE]."
- **Add What we collect and why:** the section 2 map in plain words, by tier, with basis and retention. Sample: "Name, phone and delivery details: to deliver your order. Email, WhatsApp number, occasion day and month: only if you tick the box, for the messages you chose."
- **Add Who receives it:** hosting, database, email provider, courier (only what delivery needs), WhatsApp (Meta), analytics and ad companies (consent only), accountant.
- **Add Sending data abroad:** countries and safeguards; ad companies are outside Kenya (s.29(d)).
- **Add How long we keep it, Children** ("This site is for adults. We do not want children's names, ages, schools or photos. If sent by mistake we use them only for your order, then delete them."), **Your rights** (all rights, 7 and 14 day limits, 30 for portability, the erase-by-phone page, complaint to the Office of the Data Protection Commissioner, https://www.odpc.go.ke), **Security** (s.29(f)), **What is optional** (s.29(h)), **Changes and version date**.
- **Edit When you send a message:** details are also saved, not only written into the message.

### 8.4 Changes to /cookies
- Add a row for each tracker before it runs, as the page promises: name, provider, purpose, lifetime, consent type, destination. Expected rows: GA4, Meta Pixel, TikTok Pixel, Consent Mode state, remember-me key, any new profile key.
- Rewrite "Your choice" for the three switches and say refusing never affects ordering.
- Keep the Cookie settings footer link.

## 9. Compliance checklist and launch gate

| ID | Test |
|---|---|
| DP-01 | ODPC certificate number is on /privacy and in the DPIA file |
| DP-02 | Signed, dated DPIA exists, names the database region |
| DP-03 | First-load network log shows no GA4, Meta or TikTok request before a choice |
| DP-04 | All boxes unticked by default; order completes with all blank |
| DP-05 | One box per purpose; nothing bundled with terms |
| DP-06 | Consent stored with timestamp, version, language, source, channel; test withdrawal stops sends |
| DP-07 | Every marketing message has an opt-out line; STOP works within 24 hours |
| DP-08 | Newsletter is double opt-in |
| DP-09 | No fields for child name, age, school or photo; gift note hint shown |
| DP-10 | KRA PIN absent from database and logs |
| DP-11 | Database region is Cape Town or EU, documented |
| DP-12 | DPAs on file for Vercel, database, email provider; courier agreement; processor list matches /privacy |
| DP-13 | Retention job test deletes an expired record |
| DP-14 | Erase-by-phone works within 14 days and never reveals whether a number exists |
| DP-15 | DSAR log exists; a test access request answered within 7 days |
| DP-16 | MFA on all admin accounts; roles split; exports logged |
| DP-17 | No personal data in URLs, event params, error logs or cached pages |
| DP-18 | Breach plan has real names and was walked through once |
| DP-19 | /privacy and /cookies match real processing; placeholders filled; EN and SW present |
| DP-20 | Advocate sign-off in writing |

**Launch gate:** the database stays off until DP-01 to DP-06, DP-09 to DP-14, DP-16, DP-17, DP-19 and DP-20 pass. DP-07 and DP-08 must pass before the first marketing message. Until then, collection stays on the WhatsApp-only flow (D18).

## 10. Questions for the owner and an advocate

Owner:
1. What is the legal entity and its registration number?
2. What are annual turnover and headcount? Are the 25+ women employees, contractors or suppliers?
3. Who is the Privacy Contact and who may see customer data?
4. What message frequency is realistic?
5. Is KRA PIN storage really needed, or can the accountant hold it?
6. Do you hold parent or guardian consents for published photos of children?
7. Who is the courier, and is there a written agreement?

Advocate:
1. Must Mikono register now, and in which category?
2. Is a DPIA mandatory here, and is residual risk acceptable without consulting the Commissioner?
3. Does s.37 express consent override the reg 15(1) opt-out route, even for existing customers?
4. Which occasion types avoid the sensitive data definition?
5. Retention: tax record period, consent ledger period.
6. Are Vercel's DPA and DPF enough as appropriate safeguards? Does the ODPC accept Cape Town or EU hosting? Is a Kenyan adequacy list published?
7. Does the ODPC expect prior consent for analytics cookies?
8. Communications Authority and KICA SMS rules; Meta WhatsApp terms for our sending method.
9. Published photos of children under s.33.
10. Current fees and the registration portal route, which I could not open.
