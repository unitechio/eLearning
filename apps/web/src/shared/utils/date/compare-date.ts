import { toDate, isValidDate, type DateInput } from './format-date';

/**
 * Compares two dates.
 * Returns -1 if a < b, 0 if equal, 1 if a > b.
 *
 * @example
 * compareDate('2025-01-01', '2025-06-01') // -1
 * compareDate('2025-06-01', '2025-01-01') // 1
 * compareDate('2025-01-01', '2025-01-01') // 0
 */
export function compareDate(a: DateInput, b: DateInput): -1 | 0 | 1 {
  const da = toDate(a);
  const db = toDate(b);
  if (!isValidDate(da)) throw new TypeError(`compareDate: invalid first date '${String(a)}'`);
  if (!isValidDate(db)) throw new TypeError(`compareDate: invalid second date '${String(b)}'`);
  const diff = da.getTime() - db.getTime();
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return 0;
}

/**
 * Returns the earlier of two dates.
 *
 * @example
 * minDate('2025-01-01', '2024-06-15') // Date for 2024-06-15
 */
export function minDate(a: DateInput, b: DateInput): Date {
  return compareDate(a, b) <= 0 ? toDate(a) : toDate(b);
}

/**
 * Returns the later of two dates.
 *
 * @example
 * maxDate('2025-01-01', '2024-06-15') // Date for 2025-01-01
 */
export function maxDate(a: DateInput, b: DateInput): Date {
  return compareDate(a, b) >= 0 ? toDate(a) : toDate(b);
}
