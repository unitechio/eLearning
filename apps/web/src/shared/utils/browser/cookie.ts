type CookieOptions = {
  readonly path?: string;
  readonly domain?: string;
  readonly maxAge?: number;
  readonly expires?: Date;
  readonly secure?: boolean;
  readonly sameSite?: 'Strict' | 'Lax' | 'None';
};

/**
 * Sets a browser cookie with the given name, value, and options.
 *
 * @example
 * setCookie('token', 'abc123', { maxAge: 3600, secure: true })
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  const { path = '/', domain, maxAge, expires, secure, sameSite = 'Lax' } = options;
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  cookie += `; path=${path}`;
  if (domain) cookie += `; domain=${domain}`;
  if (maxAge !== undefined) cookie += `; max-age=${maxAge}`;
  if (expires) cookie += `; expires=${expires.toUTCString()}`;
  if (secure) cookie += '; secure';
  cookie += `; samesite=${sameSite}`;
  document.cookie = cookie;
}

/**
 * Reads a cookie value by name. Returns null if not found.
 *
 * @example
 * getCookie('token') // 'abc123' or null
 */
export function getCookie(name: string): string | null {
  const encoded = encodeURIComponent(name);
  const entry = document.cookie.split('; ').find((c) => c.startsWith(`${encoded}=`));
  if (!entry) return null;
  return decodeURIComponent(entry.slice(encoded.length + 1));
}

/**
 * Deletes a cookie by name by setting its max-age to 0.
 *
 * @example
 * deleteCookie('token')
 */
export function deleteCookie(
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {}
): void {
  setCookie(name, '', { ...options, maxAge: 0 });
}

/**
 * Returns all current cookies as a key-value record.
 *
 * @example
 * getAllCookies() // { token: 'abc', theme: 'dark' }
 */
export function getAllCookies(): Record<string, string> {
  return Object.fromEntries(
    document.cookie
      .split('; ')
      .filter(Boolean)
      .map((c) => {
        const i = c.indexOf('=');
        return [decodeURIComponent(c.slice(0, i)), decodeURIComponent(c.slice(i + 1))];
      })
  );
}
