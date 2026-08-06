/**
 * Returns the size of a File or Blob in bytes.
 *
 * @example
 * getFileSize(file) // 1048576
 */
export function getFileSize(file: File | Blob): number {
  return file.size;
}

/**
 * Returns the size of a File or Blob in kilobytes, rounded to 2 decimal places.
 *
 * @example
 * getFileSizeKB(file) // 1024.00
 */
export function getFileSizeKB(file: File | Blob): number {
  return Math.round((file.size / 1024) * 100) / 100;
}

/**
 * Returns the size of a File or Blob in megabytes, rounded to 2 decimal places.
 *
 * @example
 * getFileSizeMB(file) // 1.00
 */
export function getFileSizeMB(file: File | Blob): number {
  return Math.round((file.size / (1024 * 1024)) * 100) / 100;
}

/**
 * Checks if a file does not exceed the given size limit in bytes.
 *
 * @example
 * isFileSizeAllowed(file, 5 * 1024 * 1024) // true if <= 5MB
 */
export function isFileSizeAllowed(file: File | Blob, maxBytes: number): boolean {
  return file.size <= maxBytes;
}
