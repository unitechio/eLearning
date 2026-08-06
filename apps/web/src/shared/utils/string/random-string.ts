const ALPHA_NUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a pseudo-random alphanumeric string of the given length.
 * Uses Math.random — for cryptographically secure strings, use `secureRandomString` from crypto/random.ts.
 *
 * @example
 * randomString(8)                   // e.g. 'aB3kZx9P'
 * randomString(6, '0123456789')     // e.g. '482910'
 */
export function randomString(length: number, charset: string = ALPHA_NUMERIC): string {
  if (length <= 0) throw new RangeError(`randomString: length must be > 0, got ${length}`);
  if (charset.length === 0) throw new Error('randomString: charset must not be empty');
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}
