/**
 * Creates a deep clone of a value.
 * Uses structuredClone when available (ES2022+), falls back to JSON round-trip.
 *
 * Note: The JSON fallback cannot clone functions, Symbols, or circular references.
 * structuredClone handles all structured-serializable types correctly.
 *
 * @example
 * deepClone({ a: { b: 1 } }) // { a: { b: 1 } } — new object in memory
 * deepClone([1, [2, 3]])      // [1, [2, 3]]
 */
export function deepClone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}
