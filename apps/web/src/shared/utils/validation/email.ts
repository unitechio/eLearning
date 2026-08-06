/**
 * RFC 5321/5322-inspired email regex suitable for production use.
 * Validates local part, domain labels, and TLD.
 * @internal
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

/**
 * Validates an email address with production-grade accuracy.
 *
 * @example
 * isValidEmail('user@example.com')    // true
 * isValidEmail('user+tag@sub.io')     // true
 * isValidEmail('invalid')             // false
 * isValidEmail('@example.com')        // false
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}
