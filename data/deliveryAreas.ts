// Starter list of common Nairobi areas. Fees stay null until the client supplies them,
// so the site always says "to be confirmed". Zone is a placeholder to confirm.
export type DeliveryArea = { area: string; zone: "A" | "B"; feeKes: number | null };

export const deliveryAreas: DeliveryArea[] = [
  { area: "Westlands", zone: "A", feeKes: null },
  { area: "Kilimani", zone: "A", feeKes: null },
  { area: "Kileleshwa", zone: "A", feeKes: null },
  { area: "Lavington", zone: "A", feeKes: null },
  { area: "Parklands", zone: "A", feeKes: null },
  { area: "CBD", zone: "A", feeKes: null },
  { area: "South B", zone: "A", feeKes: null },
  { area: "South C", zone: "A", feeKes: null },
  { area: "Langata", zone: "A", feeKes: null },
  { area: "Karen", zone: "B", feeKes: null },
  { area: "Kitisuru", zone: "B", feeKes: null },
  { area: "Runda", zone: "B", feeKes: null },
  { area: "Muthaiga", zone: "B", feeKes: null },
  { area: "Gigiri", zone: "B", feeKes: null },
  { area: "Ruaka", zone: "B", feeKes: null },
  { area: "Thika Road", zone: "B", feeKes: null },
  { area: "Embakasi", zone: "B", feeKes: null },
  { area: "Eastlands", zone: "B", feeKes: null },
];

export const OTHER_AREA = "Other Nairobi area";
export const sortedAreaNames = (): string[] => deliveryAreas.map((a) => a.area).sort((a, b) => a.localeCompare(b));
export const findArea = (name: string) => deliveryAreas.find((a) => a.area === name);
