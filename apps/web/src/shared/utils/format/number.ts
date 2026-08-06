type NumberFormatOptions = {
  readonly locale?: string;
  readonly decimals?: number;
  readonly compact?: boolean;
};

/**
 * Formats a number with thousands separators, optional decimal precision, and compact notation.
 *
 * @example
 * formatNumber(1_234_567.89, { decimals: 2 }) // '1,234,567.89'
 * formatNumber(1_500_000, { compact: true })   // '1.5M'
 * formatNumber(0.12345, { decimals: 3 })        // '0.123'
 */
export function formatNumber(value: number, options: NumberFormatOptions = {}): string {
  const { locale = 'en-US', decimals, compact = false } = options;
  return new Intl.NumberFormat(locale, {
    notation: compact ? 'compact' : 'standard',
    ...(decimals !== undefined && {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  }).format(value);
}
