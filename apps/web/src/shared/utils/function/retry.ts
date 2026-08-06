type RetryOptions = {
  /** Maximum number of attempts including the first. Default: 3. */
  readonly attempts?: number;
  /** Initial delay in milliseconds between retries. Default: 200. */
  readonly delay?: number;
  /** Exponential backoff multiplier applied each retry. Default: 2. */
  readonly backoff?: number;
  /** Maximum delay cap in milliseconds. Default: 30_000. */
  readonly maxDelay?: number;
  /** Called after each failed attempt with the error and attempt number. */
  readonly onRetry?: (error: Error, attempt: number) => void;
  /** Return true to abort retrying early (e.g., on a 4xx HTTP error). */
  readonly shouldAbort?: (error: Error) => boolean;
};

/**
 * Retries an async function up to `attempts` times with exponential backoff.
 * Throws the last error if all attempts fail.
 *
 * @example
 * const data = await retry(() => fetchData(), { attempts: 3, delay: 500 });
 *
 * // Abort on non-retryable errors:
 * const res = await retry(fetchUser, {
 *   shouldAbort: (e) => e.message.includes('404'),
 * });
 */
export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    attempts = 3,
    delay = 200,
    backoff = 2,
    maxDelay = 30_000,
    onRetry,
    shouldAbort,
  } = options;

  if (attempts < 1) throw new RangeError(`retry: attempts must be >= 1, got ${attempts}`);

  let lastError!: Error;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (shouldAbort?.(lastError)) break;
      if (attempt < attempts) {
        onRetry?.(lastError, attempt);
        const waitTime = Math.min(delay * Math.pow(backoff, attempt - 1), maxDelay);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}
