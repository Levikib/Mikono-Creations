// Things kept in memory for the current page only (never in storage). One reset hook so "Clear my saved details" empties them too.
const resets = new Set<() => void>();
export function onClearMemory(fn: () => void): () => void {
  resets.add(fn);
  return () => { resets.delete(fn); };
}
export function clearAllDeviceMemory() {
  resets.forEach((fn) => fn());
}
