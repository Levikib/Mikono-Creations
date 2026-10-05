// Occasion and timing. Occasions hold a day and month only, never a year, a name or a relation (strategy/17 section 2.1).
// Owner answer: custom pieces depend on the quantity and design and usually take 3 days to 1 week. The exact time is confirmed in the quote.
import type { Opt } from "./option";

const o = (id: string, label: string, help: string, extra: Partial<Opt> = {}): Opt => ({ id, label, help, impactsQuote: "none", ...extra });

export const SOON_DAYS = 7;

export const occasions: Opt[] = [
  o("birthday", "Birthday", "A birthday"),
  o("baby", "Baby shower or new baby", "A baby shower or a new arrival"),
  o("naming", "Naming ceremony", "A naming or welcome ceremony"),
  o("wedding", "Wedding", "A wedding"),
  o("engagement", "Engagement", "An engagement"),
  o("cultural", "Traditional or cultural ceremony", "For example ruracio or dowry, or another ceremony"),
  o("graduation", "Graduation", "A graduation"),
  o("new-home", "New home", "A housewarming"),
  o("anniversary", "Anniversary", "An anniversary"),
  o("retirement", "Retirement", "A retirement"),
  o("christmas", "Christmas", "Christmas"),
  o("easter", "Easter", "Easter"),
  o("eid", "Eid", "Eid"),
  o("diwali", "Diwali", "Diwali"),
  o("mothers-day", "Mother's Day", "Mother's Day"),
  o("fathers-day", "Father's Day", "Father's Day"),
  o("valentines", "Valentine's Day", "Valentine's Day"),
  o("madaraka", "Madaraka Day", "1 June"),
  o("mashujaa", "Mashujaa Day", "20 October"),
  o("jamhuri", "Jamhuri Day", "12 December"),
  o("get-well", "Get well", "Wishing someone well"),
  o("sympathy", "Sympathy", "Thinking of someone in a hard time"),
  o("remembering", "Remembering someone", "A remembrance"),
  o("thank-you", "Thank you", "Saying thanks"),
  o("corporate", "Corporate or brand event", "A company event"),
  o("school", "School or community event", "A school or community event"),
  o("fundraiser", "Fundraiser", "Raising money for a cause"),
  o("none", "Just because", "No special occasion"),
  o("other", "Other, tell us", "Another occasion"),
];

export const deadlineTypes: Opt[] = [
  o("hard", "I have a firm date", "It must be there by this date"),
  o("asap", "As soon as possible", "As early as you can, no set date"),
  o("flexible", "My date is flexible", "Earlier is welcome, later is fine"),
  o("unsure", "I am not sure yet", "Tell me what is possible"),
];

export const rushOptions: Opt[] = [
  o("yes", "I would like to ask about a faster option", "We tell you if one exists", { pending: true, impactsQuote: "high" }),
  o("no", "No rush", "Standard timing is fine"),
];

export const deadlinePresets: { id: string; label: string; weeks: number }[] = [
  { id: "w4", label: "In about a month", weeks: 4 },
  { id: "w8", label: "In about two months", weeks: 8 },
  { id: "w12", label: "In about three months", weeks: 12 },
];

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const;
export const LEAD_TIME = "usually from 3 days to 1 week";
export const LEAD_NOTICE = "Custom pieces depend on the quantity and design and usually take from 3 days to 1 week. The exact time is confirmed in your quote.";
/** How fast we answer on WhatsApp. Always "usually", never a promise. */
export const REPLY_TIME = "We usually reply within a few minutes to a couple of hours during working hours.";
export const SOON_NOTICE = "That is sooner than usual for handmade pieces. Tell us the date and we tell you honestly if it is possible.";
export const EVENT_LABEL_MAX = 60;
