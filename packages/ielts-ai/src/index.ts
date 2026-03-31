import { IELTSSpeakingResult, IELTSWritingResult } from "./types";

/**
 * Rounds an IELTS score according to official rules.
 * .25 -> .5, .75 -> .0.
 * In a more complex rounding (.375 and .875), they round up to .5 and .0 respectively.
 * Basically, it rounds to the nearest 0.5.
 */
export function calculateOverallBand(criteria: number[]): number {
  if (criteria.length === 0) return 0;
  const average = criteria.reduce((a, b) => a + b, 0) / criteria.length;
  
  // Official IELTS rounding rules:
  // If the average is .25 or higher, it rounds up to .5
  // If it's .75 or higher, it rounds up to the next whole number.
  // Below .25 rounds to .0, and .25 to .75 rounds to .5.
  
  const fractional = average % 1;
  const whole = Math.floor(average);
  
  if (fractional < 0.25) return whole;
  if (fractional < 0.75) return whole + 0.5;
  return whole + 1;
}

export * from "./types";
export * from "./prompts/speaking";
export * from "./prompts/writing";
