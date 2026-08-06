/**
 * Groups array elements by the result of a key selector function.
 *
 * @example
 * groupBy([{ a: 1 }, { a: 2 }, { a: 1 }], (x) => x.a)
 * // Map { 1 => [{ a: 1 }, { a: 1 }], 2 => [{ a: 2 }] }
 */
export function groupBy<T, K extends PropertyKey>(
  array: readonly T[],
  keySelector: (item: T) => K
): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of array) {
    const key = keySelector(item);
    const group = map.get(key);
    if (group) {
      group.push(item);
    } else {
      map.set(key, [item]);
    }
  }
  return map;
}
