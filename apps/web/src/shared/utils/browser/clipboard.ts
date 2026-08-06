/**
 * Copies text to the clipboard using the Clipboard API.
 * Falls back to `document.execCommand('copy')` for older browsers.
 *
 * @example
 * await copyToClipboard('Hello World')
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Legacy fallback
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

/**
 * Reads text from the clipboard using the Clipboard API.
 * Throws if the API is not available.
 *
 * @example
 * const text = await readFromClipboard()
 */
export async function readFromClipboard(): Promise<string> {
  if (!navigator.clipboard?.readText) {
    throw new Error('readFromClipboard: Clipboard read API is not supported in this browser.');
  }
  return navigator.clipboard.readText();
}
