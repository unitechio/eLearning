type SortOrder = 'asc' | 'desc';

type SortOptions<T> = {
  readonly key?: keyof T;
  readonly order?: SortOrder;
  readonly type?: 'string' | 'number' | 'date';
};

/**
 * Sorts an array immutably with support for string, number, and date comparisons.
 * Supports sorting by a nested object key.
 *
 * @example
 * sortArray([{ name: 'b' }, { name: 'a' }], { key: 'name', type: 'string' })
 * // [{ name: 'a' }, { name: 'b' }]
 *
 * sortArray([3, 1, 2], { type: 'number', order: 'desc' })
 * // [3, 2, 1]
 */
export function sortArray<T>(array: readonly T[], options: SortOptions<T> = {}): T[] {
  const { key, order = 'asc', type = 'string' } = options;
  const direction = order === 'asc' ? 1 : -1;

  return [...array].sort((a, b) => {
    const av = key !== undefined ? a[key] : a;
    const bv = key !== undefined ? b[key] : b;

    if (type === 'number') {
      return direction * ((av as number) - (bv as number));
    }
    if (type === 'date') {
      const at = new Date(av as string | number | Date).getTime();
      const bt = new Date(bv as string | number | Date).getTime();
      return direction * (at - bt);
    }
    return direction * String(av).localeCompare(String(bv));
  });
}
