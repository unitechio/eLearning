/**
 * Returns true if the application is running in development mode.
 *
 * Resolution order:
 * 1. `import.meta.env.DEV` (Vite)
 * 2. `process.env.NODE_ENV === 'development'` (Node / CRA)
 * 3. Falls back to `false` in unknown environments.
 *
 * @example
 * if (isDev()) {
 *   console.log('Debug info');
 * }
 */
export function isDev(): boolean {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV !== undefined) {
      return Boolean(import.meta.env.DEV);
    }
  } catch {
    // Not a Vite environment
  }
  try {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== undefined) {
      return process.env.NODE_ENV === 'development';
    }
  } catch {
    // process is not defined
  }
  return false;
}
