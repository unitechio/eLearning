/**
 * Joins URL path segments, correctly handling leading/trailing slashes.
 * When the first segment contains a protocol (http/https), uses the URL constructor
 * to preserve the origin and set the full path.
 *
 * @example
 * joinUrl('https://example.com/', '/api/', '/users') // 'https://example.com/api/users'
 * joinUrl('/api', 'v1', 'resource')                  // '/api/v1/resource'
 * joinUrl('api', 'v1')                               // 'api/v1'
 */
export function joinUrl(...parts: readonly string[]): string {
  if (parts.length === 0) return '';

  const [first = '', ...rest] = parts;
  const hasProtocol = /^https?:\/\//.test(first);

  if (hasProtocol) {
    const url = new URL(first);
    const pathParts = [url.pathname, ...rest];
    url.pathname = cleanJoin(pathParts);
    return url.toString().replace(/\/$/, '');
  }

  const isAbsolute = first.startsWith('/');
  const joined = cleanJoin([first, ...rest]);
  return isAbsolute && !joined.startsWith('/') ? `/${joined}` : joined;
}

function cleanJoin(parts: readonly string[]): string {
  return parts
    .map((p, i) => {
      const stripped = i === 0 ? p.replace(/\/+$/, '') : p.replace(/^\/+/, '').replace(/\/+$/, '');
      return stripped;
    })
    .filter(Boolean)
    .join('/');
}
