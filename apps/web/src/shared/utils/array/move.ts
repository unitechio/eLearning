/**
 * Moves an item from index `from` to index `to` in an array, returning a new array.
 * Does not mutate the original array.
 *
 * @example
 * move([1, 2, 3, 4], 0, 2) // [2, 3, 1, 4]
 * move(['a', 'b', 'c'], 2, 0) // ['c', 'a', 'b']
 */
export function move<T>(array: readonly T[], from: number, to: number): T[] {
  if (from < 0 || from >= array.length) {
    throw new RangeError(
      `move: 'from' index ${from} is out of bounds for array of length ${array.length}`
    );
  }
  if (to < 0 || to >= array.length) {
    throw new RangeError(
      `move: 'to' index ${to} is out of bounds for array of length ${array.length}`
    );
  }
  if (from === to) return [...array];
  const result = [...array];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item as T);
  return result;
}
