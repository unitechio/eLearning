/**
 * Invariant assertion. Throws if the condition is falsy.
 * Narrows the type of `condition` to truthy for TypeScript.
 * Prefer over `assert` when checking runtime assumptions (not programmer-controlled values).
 *
 * @example
 * invariant(value != null, 'value must be defined');
 * // TypeScript now knows value is non-nullable after this line
 */
export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Invariant violation: ${message}`);
  }
}

/**
 * Asserts that a value is not null or undefined and returns it.
 * Throws an invariant error if the value is null or undefined.
 *
 * @example
 * const el = notNullable(document.getElementById('root'), 'Root element not found');
 * el.textContent = 'Hello'; // TypeScript knows el is not null
 */
export function notNullable<T>(value: T | null | undefined, message: string): T {
  invariant(value !== null && value !== undefined, message);
  return value;
}
