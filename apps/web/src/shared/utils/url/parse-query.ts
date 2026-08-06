type ParsedQueryValue = string | string[];
type ParsedQuery = Record<string, ParsedQueryValue>;

/**
 * Parses a query string into a typed key-value record.
 * Keys that appear multiple times become string arrays.
 *
 * @example
 * parseQuery('?search=hello&tags=a&tags=b') // { search: 'hello', tags: ['a', 'b'] }
 * parseQuery('page=2')                       // { page: '2' }
 */
export function parseQuery(queryString: string): ParsedQuery {
  const normalized = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  const params = new URLSearchParams(normalized);
  const grouped: Record<string, string[]> = {};

  for (const [key, value] of params.entries()) {
    if (grouped[key]) {
      grouped[key]!.push(value);
    } else {
      grouped[key] = [value];
    }
  }

  return Object.fromEntries(
    Object.entries(grouped).map(([k, v]) => [k, v.length === 1 ? v[0]! : v])
  );
}
