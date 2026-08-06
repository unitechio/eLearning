/** Common MIME type groups. */
const MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'],
  video: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm', 'audio/aac'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  text: ['text/plain', 'text/csv', 'text/html', 'text/xml', 'application/json'],
  archive: [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/gzip',
    'application/x-tar',
  ],
} as const;

export type MimeCategory = keyof typeof MIME_TYPES;

/**
 * Returns the MIME type of a File object.
 *
 * @example
 * getMimeType(file) // 'image/jpeg'
 */
export function getMimeType(file: File): string {
  return file.type;
}

/**
 * Checks if a file belongs to a given MIME category.
 *
 * @example
 * isFileType(file, 'image') // true
 * isFileType(file, 'video') // false
 */
export function isFileType(file: File, category: MimeCategory): boolean {
  return (MIME_TYPES[category] as readonly string[]).includes(file.type);
}

/**
 * Validates that a file's MIME type matches one of the allowed types.
 *
 * @example
 * isAllowedMimeType(file, ['image/jpeg', 'image/png']) // true
 */
export function isAllowedMimeType(
  file: File,
  allowedTypes: readonly string[]
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Returns the category of a file based on its MIME type.
 * Returns null if no category matches.
 *
 * @example
 * getMimeCategory(file) // 'image'
 */
export function getMimeCategory(file: File): MimeCategory | null {
  for (const [category, types] of Object.entries(MIME_TYPES)) {
    if ((types as readonly string[]).includes(file.type)) {
      return category as MimeCategory;
    }
  }
  return null;
}
