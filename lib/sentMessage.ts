// The message that was just sent. The full text (which can hold a KRA PIN) lives in memory only, so it survives the move
// to the "order sent" page but not a reload. The draft in storage holds a copy with the KRA PIN line removed.
import { onClearMemory } from "./memory";

export interface SentMemory { ref: string; message: string; text: string; level: string; at: number; pasteRest: boolean }
let current: SentMemory | null = null;

export const setSentMemory = (s: SentMemory) => { current = s; };
export const getSentMemory = (): SentMemory | null => current;
export const clearSentMemory = () => { current = null; };
onClearMemory(clearSentMemory);

/** Removes the "KRA PIN:" line. Works on both the plain message and its URL-encoded form. */
export function stripKraLines(s: string): string {
  return s.split("\n").filter((l) => !/^\s*KRA PIN:/i.test(l)).join("\n");
}
