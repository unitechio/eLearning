type CurrencyOptions = {
  readonly locale?: string;
  readonly currency?: string;
  readonly minimumFractionDigits?: number;
  readonly maximumFractionDigits?: number;
};

/**
 * Formats a number as a currency string using Intl.NumberFormat.
 *
 * @example
 * formatCurrency(1234.5, { currency: 'USD' }) // '$1,234.50'
 * formatCurrency(9999, { locale: 'vi-VN', currency: 'VND' }) // '9.999 ₫'
 */
export function formatCurrency(value: number, options: CurrencyOptions = {}): string {
  const { locale = 'en-US', currency = 'USD', minimumFractionDigits, maximumFractionDigits } =
    options;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...(minimumFractionDigits !== undefined && { minimumFractionDigits }),
    ...(maximumFractionDigits !== undefined && { maximumFractionDigits }),
  }).format(value);
}
