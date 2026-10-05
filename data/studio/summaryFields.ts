// Fields that make up the brief card and the completeness meter. Weights add up to 100.
// The meter encourages helpful detail. It never blocks sending and never nags: it shows one gentle suggestion.
export interface SummaryField { id: string; label: string; weight: number; /** Gentle suggestion shown when this is the most useful missing detail. */ suggest: string; required?: boolean }

export const summaryFields: SummaryField[] = [
  { id: "type", label: "Kind of order", weight: 10, suggest: "Tell us what kind of order this is.", required: true },
  { id: "base", label: "Shape", weight: 12, suggest: "Pick the animal closest to your idea.", required: true },
  { id: "size", label: "Size", weight: 10, suggest: "A size helps us plan.", required: true },
  { id: "qty", label: "How many", weight: 8, suggest: "Tell us how many you need.", required: true },
  { id: "colours", label: "Colours", weight: 12, suggest: "Choosing colours helps us quote well.", required: true },
  { id: "features", label: "Markings and features", weight: 8, suggest: "Markings, eyes or a mane make it more like your idea." },
  { id: "personal", label: "Personal touches", weight: 5, suggest: "A name, a date or an outfit makes it yours." },
  { id: "inspiration", label: "Inspiration", weight: 12, suggest: "A photo, link or short description helps a lot." },
  { id: "timing", label: "Date", weight: 8, suggest: "Tell us your date, or that it is flexible.", required: true },
  { id: "delivery", label: "Delivery", weight: 7, suggest: "Say where it should go.", required: true },
  { id: "budget", label: "Budget", weight: 3, suggest: "A range, if you have one, helps us suggest what fits." },
  { id: "extras", label: "Payment and packaging", weight: 5, suggest: "Say how you would like to pay, or choose packaging." },
];

export const meterLevels = [
  { min: 0, label: "Just started" },
  { min: 35, label: "A good start" },
  { min: 60, label: "Clear and useful" },
  { min: 85, label: "Very detailed" },
] as const;
