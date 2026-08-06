import { parseError } from './parse-error';

/**
 * Extracts a human-readable error message from any thrown value.
 * Safe to call inside a `catch` block with an `unknown` error.
 *
 * @example
 * try {
 *   await riskyOperation();
 * } catch (e) {
 *   const msg = getErrorMessage(e); // 'Something went wrong'
 * }
 */
export function getErrorMessage(error: unknown): string {
  return parseError(error).message;
}
