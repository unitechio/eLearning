import { toDate, isValidDate, type DateInput } from './format-date';

/**
 * Checks whether the given date falls on today's calendar date.
 * Optionally accepts a timezone (IANA timezone string).
 *
 * @example
 * isToday(new Date()) // true
 * isToday('2000-01-01') // false
 * isToday(new Date(), 'America/New_York')
 */
export function isToday(date: DateInput, timeZone?: string): boolean {
  const d = toDate(date);
  if (!isValidDate(d)) return false;
  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(timeZone && { timeZone }),
  };
  const formatter = new Intl.DateTimeFormat('en-CA', opts);
  return formatter.format(d) === formatter.format(new Date());
}
