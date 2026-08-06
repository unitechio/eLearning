/**
 * Asserts that a condition is true.
 * Throws a descriptive Error if the condition is false.
 * Narrows the type of the condition for TypeScript.
 *
 * @example
 * assert(user !== null, 'User must not be null');
 * // TypeScript now knows user is non-null after this line
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}
