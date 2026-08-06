/**
 * Returns true if the value is considered empty.
 *
 * Rules:
 * - `null` / `undefined` → true
 * - `string` → true if empty or whitespace only
 * - `Array` → true if length === 0
 * - `Map` / `Set` → true if size === 0
 * - Plain object → true if no own enumerable keys
 *
 * @example
 * isEmpty({})            // true
 * isEmpty([])            // true
 * isEmpty(new Map())     // true
 * isEmpty('  ')          // true
 * isEmpty({ a: 1 })      // false
 * isEmpty([0])           // false
 */
export function isEmpty(
  value: object | unknown[] | Map<unknown, unknown> | Set<unknown> | string | null | undefined
): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  return Object.keys(value).length === 0;
}
