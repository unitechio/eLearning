/**
 * Memoizes a function, caching results by the serialized arguments.
 * Uses a custom key function for cache key generation (default: JSON.stringify).
 *
 * @example
 * const expensiveFn = memoize((n: number) => n * 2);
 * expensiveFn(5); // 10 — computed
 * expensiveFn(5); // 10 — cached
 *
 * // Custom key for object arguments:
 * const fn = memoize(fetch, (url, opts) => `${url}:${opts?.method ?? 'GET'}`);
 */
export function memoize<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyFn: (...args: TArgs) => string = (...args) => JSON.stringify(args)
): (...args: TArgs) => TReturn {
  const cache = new Map<string, TReturn>();

  return (...args: TArgs): TReturn => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key) as TReturn;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
