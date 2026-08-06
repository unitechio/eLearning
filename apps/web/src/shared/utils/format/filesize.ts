const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;
type FileSizeUnit = (typeof FILE_SIZE_UNITS)[number];

type FileSizeOptions = {
  readonly decimals?: number;
};

/**
 * Formats a byte count as a human-readable file size string.
 *
 * @example
 * formatFileSize(1024)                      // '1.00 KB'
 * formatFileSize(1536, { decimals: 1 })     // '1.5 KB'
 * formatFileSize(1_073_741_824)             // '1.00 GB'
 * formatFileSize(0)                         // '0 B'
 */
export function formatFileSize(bytes: number, options: FileSizeOptions = {}): string {
  if (bytes < 0) throw new RangeError(`formatFileSize: bytes must be >= 0, got ${bytes}`);
  const { decimals = 2 } = options;
  if (bytes === 0) return '0 B';
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    FILE_SIZE_UNITS.length - 1
  );
  const unit = FILE_SIZE_UNITS[unitIndex] as FileSizeUnit;
  const value = bytes / Math.pow(1024, unitIndex);
  return `${value.toFixed(decimals)} ${unit}`;
}
