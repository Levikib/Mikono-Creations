import { tokens as t } from "../../scripts/tokens-data.mjs";

export const tokens = Object.entries(t).map(([name, hex]) => ({ name, hex }));
