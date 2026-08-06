type TruncateOptions = {
  /** Maximum total length including suffix. Default: 100. */
  readonly length?: number;
  /** String appended when truncated. Default: '...'. */
  readonly suffix?: string;
  /** When true, truncates at the last word boundary. Default: false. */
  readonly wordBoundary?: boolean;
};

/**
 * Truncates a string to a maximum length, appending a suffix if truncated.
 *
 * @example
 * truncate('Hello World', { length: 7 })                        // 'Hell...'
 * truncate('Hello World', { length: 8, wordBoundary: true })    // 'Hello...'
 * truncate('Hi', { length: 100 })                               // 'Hi'
 */
export function truncate(str: string, options: TruncateOptions = {}): string {
  const { length = 100, suffix = '...', wordBoundary = false } = options;
  if (str.length <= length) return str;
  const maxLength = length - suffix.length;
  if (maxLength <= 0) return suffix.slice(0, length);
  const truncated = str.slice(0, maxLength);
  if (!wordBoundary) return truncated + suffix;
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + suffix;
}
