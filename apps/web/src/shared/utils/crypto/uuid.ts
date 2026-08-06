/**
 * Generates a cryptographically secure UUID v4.
 * Uses `crypto.randomUUID` when available (modern browsers/Node 19+),
 * falls back to `crypto.getRandomValues` for older environments.
 *
 * @example
 * generateUUID() // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
 */
export function generateUUID(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback: manually construct UUID v4 from random bytes
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6]! & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variant bits (RFC 4122)
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0'));
  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join(''),
  ].join('-');
}
