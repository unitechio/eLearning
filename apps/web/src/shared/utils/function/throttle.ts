type ThrottleOptions = {
  /** Invoke the function on the leading edge. Default: true. */
  readonly leading?: boolean;
  /** Invoke the function on the trailing edge after the wait period. Default: true. */
  readonly trailing?: boolean;
};

type ThrottledFn<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  /** Cancels any pending trailing invocation and resets the throttle state. */
  cancel: () => void;
};

/**
 * Returns a throttled version of a function that invokes at most once per `wait` ms.
 * Supports leading and trailing edge control.
 *
 * @example
 * const throttledScroll = throttle(onScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: ThrottleOptions = {}
): ThrottledFn<T> {
  const { leading = true, trailing = true } = options;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  let lastArgs: Parameters<T> | undefined;

  const invokeTrailing = (): void => {
    timer = undefined;
    if (trailing && lastArgs) {
      fn(...(lastArgs as Parameters<T>));
      lastCallTime = Date.now();
      lastArgs = undefined;
    }
  };

  const throttled = (...args: Parameters<T>): ReturnType<T> | undefined => {
    const now = Date.now();
    const elapsed = lastCallTime !== undefined ? now - lastCallTime : Infinity;
    lastArgs = args;

    if (elapsed >= wait) {
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
      if (leading || lastCallTime !== undefined) {
        lastCallTime = now;
        return fn(...args);
      }
    } else if (trailing && timer === undefined) {
      timer = setTimeout(invokeTrailing, wait - elapsed);
    }
    return undefined;
  };

  throttled.cancel = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
    lastCallTime = undefined;
    lastArgs = undefined;
  };

  return throttled;
}
