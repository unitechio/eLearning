/**
 * Converts a string to a URL-friendly slug.
 * Normalizes Unicode (NFD), strips diacritics, lowercases,
 * removes non-alphanumeric characters, and collapses hyphens.
 *
 * @example
 * slugify('Hello World!')   // 'hello-world'
 * slugify('  Café Latte  ') // 'cafe-latte'
 * slugify('foo---bar')      // 'foo-bar'
 */
export function slugify(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
