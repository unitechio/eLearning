/**
 * Capitalizes the first letter of a string. Leaves the rest unchanged.
 *
 * @example
 * capitalize('hello world') // 'Hello world'
 * capitalize('')            // ''
 */
export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
