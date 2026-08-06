/**
 * Extracts the file extension from a filename or path, including the dot.
 * Returns an empty string if no extension is found.
 *
 * @example
 * getFileExtension('report.pdf') // '.pdf'
 * getFileExtension('archive.tar.gz') // '.gz'
 * getFileExtension('Makefile') // ''
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot <= 0 || lastDot === filename.length - 1) return '';
  return filename.slice(lastDot).toLowerCase();
}

/**
 * Extracts the file extension without the leading dot.
 *
 * @example
 * getFileExtensionWithoutDot('report.pdf') // 'pdf'
 */
export function getFileExtensionWithoutDot(filename: string): string {
  return getFileExtension(filename).slice(1);
}

/**
 * Returns the base filename without the extension.
 *
 * @example
 * getFilenameWithoutExtension('report.pdf') // 'report'
 * getFilenameWithoutExtension('/path/to/file.ts') // 'file'
 */
export function getFilenameWithoutExtension(filename: string): string {
  const base = filename.split('/').pop() ?? filename;
  const lastDot = base.lastIndexOf('.');
  if (lastDot <= 0) return base;
  return base.slice(0, lastDot);
}
