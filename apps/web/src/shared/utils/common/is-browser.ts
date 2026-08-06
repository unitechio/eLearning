/**
 * Returns true if the code is executing in a browser environment.
 * Safe to call in SSR, Node.js, or Web Worker contexts.
 *
 * @example
 * if (isBrowser()) {
 *   document.title = 'My App';
 * }
 */
export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof navigator !== 'undefined'
  );
}
