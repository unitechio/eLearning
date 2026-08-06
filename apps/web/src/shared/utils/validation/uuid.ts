/**
 * UUID v4 pattern (case-insensitive).
 * @internal
 */
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates that a string is a valid UUID v4.
 *
 * @example
 * isValidUuid('f47ac10b-58cc-4372-a567-0e02b2c3d479') // true
 * isValidUuid('550e8400-e29b-41d4-a716-446655440000') // false (v1 UUID)
 * isValidUuid('not-a-uuid')                           // false
 */
export function isValidUuid(uuid: string): boolean {
  return UUID_V4_REGEX.test(uuid.trim());
}
