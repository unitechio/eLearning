/**
 * Validates a hex color string (3, 4, 6 or 8 character forms).
 *
 * @example
 * isValidHex('#fff') // true
 * isValidHex('#gggggg') // false
 */
export function isValidHex(hex: string): boolean {
  return /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex);
}

/**
 * Converts a hex color string to an RGB object.
 * Supports 3, 6 character formats.
 *
 * @example
 * hexToRgb('#fff') // { r: 255, g: 255, b: 255 }
 * hexToRgb('#1a2b3c') // { r: 26, g: 43, b: 60 }
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  if (!isValidHex(hex)) throw new Error(`hexToRgb: invalid hex color '${hex}'`);
  let h = hex.slice(1);
  if (h.length === 3 || h.length === 4) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const bigint = parseInt(h.slice(0, 6), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

/**
 * Converts an RGB color to a hex string.
 *
 * @example
 * rgbToHex(255, 255, 255) // '#ffffff'
 * rgbToHex(26, 43, 60) // '#1a2b3c'
 */
export function rgbToHex(r: number, g: number, b: number): string {
  for (const [label, val] of [['r', r], ['g', g], ['b', b]] as const) {
    if (val < 0 || val > 255 || !Number.isInteger(val)) {
      throw new RangeError(`rgbToHex: channel '${label}' must be an integer 0-255, got ${val}`);
    }
  }
  return (
    '#' +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}
