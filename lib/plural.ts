/** "1 animal", "2 animals". One place for count wording so singular and plural never drift. */
export const countAnimals = (n: number) => `${n} ${n === 1 ? "animal" : "animals"}`;
export const countLines = (n: number) => `${n} ${n === 1 ? "line" : "lines"}`;
