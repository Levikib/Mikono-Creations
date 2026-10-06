// Option lists for the order form (strategy/16 section 2, strategy/17). Plain labels only. Never "parent".

export type CustomerType =
  | "personal" | "gift" | "family" | "diaspora" | "collector" | "teacher" | "school" | "health" | "faith" | "community" | "ngo"
  | "lodge" | "restaurant" | "shop" | "wholesale" | "planner" | "corporate" | "government" | "other";

/** Anyone can order, so the list is wide and ends with Other. Never the word "parent" and never a child (strategy/17). */
export const customerTypes: Array<{ value: CustomerType; label: string; b2b: boolean }> = [
  { value: "personal", label: "An individual", b2b: false },
  { value: "gift", label: "A gift buyer", b2b: false },
  { value: "family", label: "Family or carer", b2b: false },
  { value: "diaspora", label: "Buying from outside Kenya", b2b: false },
  { value: "collector", label: "A collector", b2b: false },
  { value: "teacher", label: "A teacher or educator", b2b: false },
  { value: "school", label: "A school or ECD centre", b2b: true },
  { value: "health", label: "A hospital or clinic", b2b: true },
  { value: "faith", label: "A church or faith group", b2b: true },
  { value: "community", label: "A community group", b2b: true },
  { value: "ngo", label: "An NGO or charity", b2b: true },
  { value: "lodge", label: "A lodge or hotel", b2b: true },
  { value: "restaurant", label: "A restaurant or cafe", b2b: true },
  { value: "shop", label: "A shop, boutique or retailer", b2b: true },
  { value: "wholesale", label: "A wholesaler or stockist", b2b: true },
  { value: "planner", label: "An event planner", b2b: true },
  { value: "corporate", label: "A company or corporate gift", b2b: true },
  { value: "government", label: "Government or a public office", b2b: true },
  { value: "other", label: "Other, tell us", b2b: false },
];
export const CUSTOMER_OTHER_MAX = 80;
export const customerTypeLabel = (v: string): string => customerTypes.find((c) => c.value === v)?.label ?? "";
export const isB2b = (v: string | readonly string[]): boolean => (Array.isArray(v) ? v : [v]).some((x) => customerTypes.find((c) => c.value === x)?.b2b);
/** Labels joined with a semicolon. The Other choice carries what the person typed. */
export const customerTypesLabel = (v: readonly string[], other = ""): string =>
  v.map((x) => (x === "other" ? (other.trim() ? `Other: ${other.trim()}` : "Other") : customerTypeLabel(x))).filter(Boolean).join("; ");

export type ContactChannel = "whatsapp" | "call" | "sms" | "email" | "other";
export const contactChannels: Array<{ value: ContactChannel; label: string }> = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "call", label: "Phone call" },
  { value: "sms", label: "SMS" },
  { value: "email", label: "Email" },
  { value: "other", label: "Other, tell us" },
];
export type ContactHours = "anytime" | "morning" | "afternoon" | "evening" | "weekend";
export const contactHoursOptions: Array<{ value: ContactHours; label: string }> = [
  { value: "anytime", label: "Any time" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "weekend", label: "Weekends" },
];
export type Language = "en" | "sw" | "other";
export const languages: Array<{ value: Language; label: string }> = [
  { value: "en", label: "English" },
  { value: "sw", label: "Kiswahili" },
  { value: "other", label: "Other, tell us" },
];
export const LANGUAGE_NOTE = "We reply in the language you write in, where we can.";
export type TimeWindow = "anytime" | "morning" | "afternoon";
export const timeWindows: Array<{ value: TimeWindow; label: string }> = [
  { value: "anytime", label: "Any time" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
];

export const businessTypes = ["Gift shop", "Boutique", "Wholesaler or distributor", "Lodge or camp", "Hotel", "Restaurant or cafe", "School or ECD centre", "Hospital or clinic", "Church or faith group", "Community group or chama", "Organisation or charity", "Event planner", "Company", "Government or public body", "Online shop", "Market stall or trader", "Other, tell us"] as const;
export const BUSINESS_OTHER = "Other, tell us";
export const volumeBands = ["Under 20 a month", "20 to 49 a month", "50 to 99 a month", "100 to 499 a month", "500 or more a month", "Not sure yet", "Prefer not to say"] as const;

/** Generic occasion types only, with day and month (strategy/17 section 2.1). No "for whom", no year, no relation. */
export const MAX_OCCASIONS = 20;
export const occasionTypes = [
  "Birthday", "Baby shower or new baby", "Naming ceremony", "Wedding", "Engagement", "Traditional or cultural ceremony", "Graduation", "New home",
  "Anniversary", "Retirement", "Christmas", "Easter", "Eid", "Diwali", "Mother's Day", "Father's Day", "Valentine's Day", "Madaraka Day", "Mashujaa Day",
  "Jamhuri Day", "Get well", "Sympathy", "Thank you", "School event", "Corporate event", "Fundraiser", "Just because", "Gift", "Corporate", "Other, tell us",
] as const;
export const OCCASION_OTHER = "Other, tell us";
export const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const;
/** Days in each month, February allowed 29 because the year is not stored. */
export const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;

export const interestOptions = [
  "Safari animals", "Farm and pet animals", "More animals", "Sea animals", "Birds and insects", "Wall art", "Dolls", "Gifts for babies and families", "Home decor",
  "Neutral colours", "Warm colours", "Bright colours", "Cool colours", "Pastel colours", "Custom or personalised pieces", "Bulk or wholesale", "Other, tell us",
] as const;
export const INTEREST_OTHER = "Other, tell us";
export const heardFromOptions = [
  "Instagram", "Facebook", "TikTok", "WhatsApp status or a friend", "Google search", "A shop or stockist", "An event or market", "A school or church", "News, radio or a blog", "Other, tell us",
] as const;
export const HEARD_OTHER = "Other, tell us";
export const OTHER_TEXT_MAX = 80;
