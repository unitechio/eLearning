/**
 * Splits an array into chunks of the given size.
 *
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 * chunk([], 3) // []
 */
export function chunk<T>(array: readonly T[], size: number): T[][] {
  if (size <= 0) throw new RangeError(`chunk: size must be > 0, got ${size}`);
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size) as T[]);
  }
  return result;
}
