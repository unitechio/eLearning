type InitialsOptions = {
  /** Maximum number of words to extract initials from. Default: 2. */
  readonly maxLength?: number;
  /** Separator between initials. Default: ''. */
  readonly separator?: string;
};

/**
 * Returns the uppercase initials extracted from a name string.
 *
 * @example
 * initials('John Doe')                            // 'JD'
 * initials('Anna Marie Burns', { maxLength: 2 })  // 'AM'
 * initials('John', { maxLength: 1 })              // 'J'
 */
export function initials(name: string, options: InitialsOptions = {}): string {
  const { maxLength = 2, separator = '' } = options;
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxLength)
    .map((word) => word.charAt(0).toUpperCase())
    .join(separator);
}
