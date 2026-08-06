type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly QueryValue[];

type QueryParams = Record<string, QueryValue>;

/**
 * Builds a URL query string from a params object.
 * Handles arrays (repeated keys), null/undefined (omitted), and proper encoding.
 *
 * @example
 * buildQuery({ search: 'hello world', page: 1 }) // '?search=hello+world&page=1'
 * buildQuery({ tags: ['a', 'b'] })                // '?tags=a&tags=b'
 * buildQuery({ empty: null, skip: undefined })     // ''
 */
export function buildQuery(params: QueryParams): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    appendQueryValue(searchParams, key, value);
  }
  const str = searchParams.toString();
  return str ? `?${str}` : '';
}

function appendQueryValue(params: URLSearchParams, key: string, value: QueryValue): void {
  if (value === null || value === undefined) return;
  if (Array.isArray(value)) {
    for (const item of value) {
      appendQueryValue(params, key, item as QueryValue);
    }
    return;
  }
  params.append(key, String(value));
}
