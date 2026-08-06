type DurationUnit = 'hours' | 'minutes' | 'seconds' | 'milliseconds';

type DurationOptions = {
  readonly units?: ReadonlyArray<DurationUnit>;
};

const MS_PER_HOUR = 3_600_000;
const MS_PER_MINUTE = 60_000;
const MS_PER_SECOND = 1_000;

/**
 * Formats a duration in milliseconds to a human-readable string.
 *
 * @example
 * formatDuration(90_061_000)                              // '25h 1m 1s'
 * formatDuration(5_000)                                   // '5s'
 * formatDuration(5_500, { units: ['seconds', 'milliseconds'] }) // '5s 500ms'
 * formatDuration(0)                                       // '0s'
 */
export function formatDuration(ms: number, options: DurationOptions = {}): string {
  if (ms < 0) throw new RangeError(`formatDuration: ms must be >= 0, got ${ms}`);
  const { units = ['hours', 'minutes', 'seconds'] } = options;

  const parts: string[] = [];
  let remaining = Math.floor(ms);

  if (units.includes('hours')) {
    const hours = Math.floor(remaining / MS_PER_HOUR);
    remaining -= hours * MS_PER_HOUR;
    if (hours > 0) parts.push(`${hours}h`);
  }
  if (units.includes('minutes')) {
    const minutes = Math.floor(remaining / MS_PER_MINUTE);
    remaining -= minutes * MS_PER_MINUTE;
    if (minutes > 0) parts.push(`${minutes}m`);
  }
  if (units.includes('seconds')) {
    const seconds = Math.floor(remaining / MS_PER_SECOND);
    remaining -= seconds * MS_PER_SECOND;
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  }
  if (units.includes('milliseconds')) {
    if (remaining > 0 || parts.length === 0) parts.push(`${remaining}ms`);
  }

  return parts.join(' ');
}
