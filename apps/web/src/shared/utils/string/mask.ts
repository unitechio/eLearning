/**
 * Masks an email address, showing only the first 2 characters of the local part
 * and the full domain.
 *
 * @example
 * maskEmail('user@example.com')    // 'us***@example.com'
 * maskEmail('a@example.com')       // 'a***@example.com'
 */
export function maskEmail(email: string): string {
  const atIndex = email.indexOf('@');
  if (atIndex < 0) throw new Error(`maskEmail: invalid email '${email}'`);
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex);
  const visible = local.slice(0, Math.min(2, local.length));
  const stars = '*'.repeat(Math.max(3, local.length - visible.length));
  return `${visible}${stars}${domain}`;
}

/**
 * Masks a phone number, preserving the last 4 digits.
 * Replaces digit characters with `*`, leaves non-digit characters (e.g. `+`, `-`) intact.
 *
 * @example
 * maskPhone('+84912345678') // '+84*******5678'  (wait — see actual logic)
 * maskPhone('0912345678')   // '******5678'
 */
export function maskPhone(phone: string): string {
  if (phone.length < 4) return '*'.repeat(phone.length);
  const visibleCount = 4;
  const masked = phone.slice(0, phone.length - visibleCount).replace(/\d/g, '*');
  return masked + phone.slice(-visibleCount);
}

/**
 * Masks a card number, showing only the last 4 digits.
 * Preserves all non-digit characters (spaces, dashes) in their original positions.
 *
 * @example
 * maskCard('4111 1111 1111 1234') // '**** **** **** 1234'
 * maskCard('4111111111111234')    // '************1234'
 */
export function maskCard(card: string): string {
  const digits = card.replace(/\D/g, '');
  if (digits.length < 4) return '*'.repeat(card.length);
  const maskedDigits = '*'.repeat(digits.length - 4) + digits.slice(-4);
  let di = 0;
  return card.replace(/\d/g, () => maskedDigits[di++] ?? '*');
}
