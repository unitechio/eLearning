/**
 * Validates a URL string using the native URL constructor.
 * Accepts `http:` and `https:` protocols by default.
 *
 * @example
 * isValidUrl('https://example.com')          // true
 * isValidUrl('ftp://files.example.com', ['ftp:']) // true
 * isValidUrl('not-a-url')                    // false
 * isValidUrl('javascript:alert(1)')          // false
 */
export function isValidUrl(
  url: string,
  protocols: readonly string[] = ['http:', 'https:']
): boolean {
  try {
    const parsed = new URL(url.trim());
    return protocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}
