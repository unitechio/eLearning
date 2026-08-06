import { hexToRgb, rgbToHex } from './hex';

type RGB = { readonly r: number; readonly g: number; readonly b: number };

/**
 * Parses an `rgb(r, g, b)` CSS string into an RGB object.
 *
 * @example
 * parseRgbString('rgb(26, 43, 60)') // { r: 26, g: 43, b: 60 }
 */
export function parseRgbString(css: string): RGB {
  const match = css.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (!match) throw new Error(`parseRgbString: cannot parse '${css}'`);
  return {
    r: parseInt(match[1]!, 10),
    g: parseInt(match[2]!, 10),
    b: parseInt(match[3]!, 10),
  };
}

/**
 * Converts an RGB object to a hex string.
 *
 * @example
 * rgbObjectToHex({ r: 26, g: 43, b: 60 }) // '#1a2b3c'
 */
export function rgbObjectToHex(rgb: RGB): string {
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Converts a hex color to an `rgb(...)` CSS string.
 *
 * @example
 * hexToRgbString('#1a2b3c') // 'rgb(26, 43, 60)'
 */
export function hexToRgbString(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Adjusts the lightness of a hex color by mixing with white or black.
 *
 * @param amount - Positive to lighten (0-1), negative to darken.
 * @example
 * adjustColor('#888888', 0.2) // lighter
 * adjustColor('#888888', -0.2) // darker
 */
export function adjustColor(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const clamp = (v: number): number => Math.min(255, Math.max(0, Math.round(v)));
  const mix = amount > 0 ? 255 : 0;
  const t = Math.abs(amount);
  return rgbToHex(
    clamp(r + (mix - r) * t),
    clamp(g + (mix - g) * t),
    clamp(b + (mix - b) * t)
  );
}
