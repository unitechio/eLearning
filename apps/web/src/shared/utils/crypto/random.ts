const DEFAULT_CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a cryptographically secure random string of the given length.
 * Uses `crypto.getRandomValues` with rejection sampling for uniform distribution.
 *
 * @example
 * secureRandomString(16)             // e.g. 'aX9kZQ2mBv8nRpYc'
 * secureRandomString(8, '0123456789') // e.g. '48291056'
 */
export function secureRandomString(length: number, charset: string = DEFAULT_CHARSET): string {
  if (length <= 0) throw new RangeError(`secureRandomString: length must be > 0, got ${length}`);
  if (charset.length === 0) throw new Error('secureRandomString: charset must not be empty');

  const charsetLength = charset.length;
  // Rejection sampling limit to ensure uniform distribution
  const limit = 256 - (256 % charsetLength);

  let result = '';
  while (result.length < length) {
    const batch = new Uint8Array(Math.ceil((length - result.length) * 1.5));
    crypto.getRandomValues(batch);
    for (const byte of batch) {
      if (byte < limit) {
        result += charset[byte % charsetLength];
        if (result.length === length) break;
      }
    }
  }
  return result;
}

/**
 * Generates a cryptographically secure random integer in [min, max).
 *
 * @example
 * secureRandomInt(1, 100) // e.g. 42
 */
export function secureRandomInt(min: number, max: number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new TypeError(`secureRandomInt: min and max must be integers`);
  }
  if (min >= max) {
    throw new RangeError(`secureRandomInt: min (${min}) must be < max (${max})`);
  }
  const range = max - min;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8) || 1;
  const limit = Math.pow(256, bytesNeeded) - (Math.pow(256, bytesNeeded) % range);
  const buffer = new Uint8Array(bytesNeeded);
  let value: number;
  do {
    crypto.getRandomValues(buffer);
    value = buffer.reduce((acc, byte) => acc * 256 + byte, 0);
  } while (value >= limit);
  return min + (value % range);
}
