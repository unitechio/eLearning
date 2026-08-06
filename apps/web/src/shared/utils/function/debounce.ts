type DebouncedFn<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  /** Cancels the pending invocation without calling the function. */
  cancel: () => void;
  /** Immediately invokes the function if there is a pending call, then cancels the timer. */
  flush: (...args: Parameters<T> | readonly []) => ReturnType<T> | undefined;
};

/**
 * Returns a debounced version of a function that delays its invocation by `wait` ms
 * after the last call. Provides `cancel()` and `flush()` control methods.
 *
 * @example
 * const debouncedSearch = debounce(search, 300);
 * input.addEventListener('input', debouncedSearch);
 * // Cancel on unmount:
 * debouncedSearch.cancel();
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): DebouncedFn<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;

  const debounced = (...args: Parameters<T>): void => {
    lastArgs = args;
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, wait);
  };

  debounced.cancel = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  debounced.flush = (...args: Parameters<T> | readonly []): ReturnType<T> | undefined => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
      const resolvedArgs = args.length > 0 ? args : lastArgs;
      if (resolvedArgs) return fn(...(resolvedArgs as Parameters<T>));
    }
    return undefined;
  };

  return debounced;
}
