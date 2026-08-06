import { toDate, isValidDate, type DateInput } from './format-date';

/**
 * Adds the given number of days to a date, returning a new Date.
 * Use negative values to subtract days.
 *
 * @example
 * addDays(new Date('2025-01-01'), 7) // Date for 2025-01-08
 * addDays('2025-03-01', -1)          // Date for 2025-02-28
 */
export function addDays(date: DateInput, days: number): Date {
  const d = toDate(date);
  if (!isValidDate(d)) {
    throw new TypeError(`addDays: invalid date input '${String(date)}'`);
  }
  const result = new Date(d.getTime());
  result.setDate(result.getDate() + days);
  return result;
}
