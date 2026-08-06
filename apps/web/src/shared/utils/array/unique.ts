/**
 * Removes duplicate values from an array, preserving insertion order.
 * Supports a custom key selector for object deduplication.
 *
 * @example
 * unique([1, 2, 2, 3]) // [1, 2, 3]
 * unique([{ id: 1 }, { id: 1 }], (x) => x.id) // [{ id: 1 }]
 */
export function unique<T>(array: readonly T[], selector?: (item: T) => unknown): T[] {
  if (!selector) {
    return [...new Set(array)];
  }
  const seen = new Set<unknown>();
  const result: T[] = [];
  for (const item of array) {
    const key = selector(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}
