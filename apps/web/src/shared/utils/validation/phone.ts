/**
 * E.164 phone number format: '+' followed by 2–15 digits,
 * where the first digit after '+' is 1–9.
 * @internal
 */
const E164_REGEX = /^\+[1-9]\d{1,14}$/;

/**
 * Validates a phone number in E.164 international format.
 *
 * @example
 * isValidPhone('+15551234567') // true
 * isValidPhone('+84912345678') // true
 * isValidPhone('05551234567')  // false (no leading +)
 * isValidPhone('+1')           // false (too short)
 */
export function isValidPhone(phone: string): boolean {
  return E164_REGEX.test(phone.trim());
}
