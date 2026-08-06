type HashAlgorithm = 'SHA-256' | 'SHA-512';

/**
 * Hashes a UTF-8 string using the Web Crypto API.
 * Returns a lowercase hex-encoded digest.
 *
 * @example
 * await hashString('hello')            // '2cf24dba5...' (SHA-256)
 * await hashString('hello', 'SHA-512') // '9b71d224b...'
 */
export async function hashString(
  input: string,
  algorithm: HashAlgorithm = 'SHA-256'
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const buffer = await crypto.subtle.digest(algorithm, data);
  return bufferToHex(buffer);
}

/**
 * Hashes an ArrayBuffer using the Web Crypto API.
 *
 * @example
 * await hashBuffer(myBuffer, 'SHA-512')
 */
export async function hashBuffer(
  buffer: ArrayBuffer,
  algorithm: HashAlgorithm = 'SHA-256'
): Promise<string> {
  const result = await crypto.subtle.digest(algorithm, buffer);
  return bufferToHex(result);
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
