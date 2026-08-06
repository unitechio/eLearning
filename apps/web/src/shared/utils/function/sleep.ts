/**
 * Returns a Promise that resolves after the given number of milliseconds.
 * Useful for adding artificial delays in async flows or tests.
 *
 * @example
 * await sleep(1000) // waits 1 second
 * await sleep(0)    // yields to the event loop
 */
export function sleep(ms: number): Promise<void> {
  if (ms < 0) throw new RangeError(`sleep: ms must be >= 0, got ${ms}`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
