type PercentOptions = {
  readonly locale?: string;
  readonly decimals?: number;
};

/**
 * Formats a decimal fraction (0–1) as a percentage string.
 *
 * @example
 * formatPercent(0.75)                   // '75%'
 * formatPercent(0.1234, { decimals: 1 }) // '12.3%'
 */
export function formatPercent(value: number, options: PercentOptions = {}): string {
  const { locale = 'en-US', decimals } = options;
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    ...(decimals !== undefined && {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  }).format(value);
}
