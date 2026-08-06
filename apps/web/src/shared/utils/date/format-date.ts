export type DateInput = Date | string | number;

type FormatDateOptions = {
  readonly locale?: string;
  readonly timeZone?: string;
  readonly dateStyle?: Intl.DateTimeFormatOptions['dateStyle'];
  readonly timeStyle?: Intl.DateTimeFormatOptions['timeStyle'];
};

/**
 * Formats a date using Intl.DateTimeFormat.
 * Returns 'Invalid Date' for invalid inputs instead of throwing.
 *
 * @example
 * formatDate(new Date(), { dateStyle: 'medium' }) // 'Aug 6, 2025'
 * formatDate('2025-01-01', { locale: 'vi-VN', dateStyle: 'short' }) // '1/1/2025'
 */
export function formatDate(date: DateInput, options: FormatDateOptions = {}): string {
  const { locale = 'en-US', timeZone, dateStyle = 'medium', timeStyle } = options;
  const d = toDate(date);
  if (!isValidDate(d)) return 'Invalid Date';
  return new Intl.DateTimeFormat(locale, {
    ...(dateStyle && { dateStyle }),
    ...(timeStyle && { timeStyle }),
    ...(timeZone && { timeZone }),
  }).format(d);
}

/**
 * Converts a DateInput value to a Date object.
 * @internal
 */
export function toDate(input: DateInput): Date {
  if (input instanceof Date) return input;
  return new Date(input);
}

/**
 * Returns true if the Date object represents a valid date.
 * @internal
 */
export function isValidDate(d: Date): boolean {
  return !isNaN(d.getTime());
}
