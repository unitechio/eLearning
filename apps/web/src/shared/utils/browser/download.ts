/**
 * Downloads a Blob as a file with the given filename.
 * Automatically revokes the object URL after triggering the download.
 *
 * @example
 * downloadBlob(new Blob(['hello, world'], { type: 'text/plain' }), 'hello.txt')
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  downloadUrl(url, filename);
  // Revoke after a short delay to allow the browser to initiate the download
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Triggers a file download from a URL by creating a hidden anchor element.
 *
 * @example
 * downloadUrl('https://example.com/report.pdf', 'report.pdf')
 */
export function downloadUrl(url: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
