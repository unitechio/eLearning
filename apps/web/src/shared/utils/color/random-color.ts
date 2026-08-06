/**
 * Generates a random hex color.
 *
 * @example
 * randomColor() // '#a3f4b2' (random)
 */
export function randomColor(): string {
  const value = Math.floor(Math.random() * 0xffffff);
  return `#${value.toString(16).padStart(6, '0')}`;
}

/**
 * Generates a random hex color with a specified hue range (HSL-based).
 * Hue values are 0-360.
 *
 * @example
 * randomColorInRange(120, 180) // random green-ish hex
 */
export function randomColorInRange(
  hueMin: number,
  hueMax: number,
  saturation = 70,
  lightness = 55
): string {
  const hue = Math.floor(Math.random() * (hueMax - hueMin) + hueMin);
  // Convert HSL to RGB
  const s = saturation / 100;
  const l = lightness / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number): number => {
    const k = (n + hue / 30) % 12;
    return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
  };
  const r = f(0);
  const g = f(8);
  const b = f(4);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
