import { toDate, isValidDate, type DateInput } from './format-date';

type FormatRelativeOptions = {
  readonly locale?: string;
  readonly now?: Date;
};

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Formats a date as a relative time string (e.g. '3 minutes ago').
 * Uses Intl.RelativeTimeFormat.
 *
 * @example
 * formatRelative(Date.now() - 60_000) // '1 minute ago'
 * formatRelative(Date.now() + 86_400_000) // 'tomorrow'
 */
export function formatRelative(date: DateInput, options: FormatRelativeOptions = {}): string {
  const { locale = 'en-US', now = new Date() } = options;
  const d = toDate(date);
  if (!isValidDate(d)) return 'Invalid Date';
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const diff = d.getTime() - now.getTime();
  const absDiff = Math.abs(diff);

  if (absDiff < MINUTE) return rtf.format(Math.round(diff / SECOND), 'second');
  if (absDiff < HOUR) return rtf.format(Math.round(diff / MINUTE), 'minute');
  if (absDiff < DAY) return rtf.format(Math.round(diff / HOUR), 'hour');
  if (absDiff < WEEK) return rtf.format(Math.round(diff / DAY), 'day');
  if (absDiff < MONTH) return rtf.format(Math.round(diff / WEEK), 'week');
  if (absDiff < YEAR) return rtf.format(Math.round(diff / MONTH), 'month');
  return rtf.format(Math.round(diff / YEAR), 'year');
}
