type PasswordRequirement = 'minLength' | 'uppercase' | 'lowercase' | 'digit' | 'specialChar';

type PasswordStrength = 'weak' | 'fair' | 'strong' | 'very-strong';

export type PasswordValidationResult = {
  readonly valid: boolean;
  readonly score: number;
  readonly strength: PasswordStrength;
  readonly missing: readonly PasswordRequirement[];
};

export type PasswordOptions = {
  readonly minLength?: number;
  readonly requireUppercase?: boolean;
  readonly requireLowercase?: boolean;
  readonly requireDigit?: boolean;
  readonly requireSpecialChar?: boolean;
};

const DEFAULT_OPTIONS: Required<PasswordOptions> = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSpecialChar: true,
};

/**
 * Validates password strength and returns a score (0–5), strength label,
 * and list of missing requirements.
 *
 * @example
 * validatePassword('Abc123!')
 * // { valid: false, score: 4, strength: 'fair', missing: ['minLength'] }
 *
 * validatePassword('Str0ng!Pass')
 * // { valid: true, score: 5, strength: 'very-strong', missing: [] }
 */
export function validatePassword(
  password: string,
  options: PasswordOptions = {}
): PasswordValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const missing: PasswordRequirement[] = [];

  if (password.length < opts.minLength) missing.push('minLength');
  if (opts.requireUppercase && !/[A-Z]/.test(password)) missing.push('uppercase');
  if (opts.requireLowercase && !/[a-z]/.test(password)) missing.push('lowercase');
  if (opts.requireDigit && !/\d/.test(password)) missing.push('digit');
  if (opts.requireSpecialChar && !/[^a-zA-Z0-9]/.test(password)) missing.push('specialChar');

  const maxScore = [
    opts.minLength > 0,
    opts.requireUppercase,
    opts.requireLowercase,
    opts.requireDigit,
    opts.requireSpecialChar,
  ].filter(Boolean).length;

  const score = maxScore - missing.length;
  const ratio = maxScore > 0 ? score / maxScore : 0;

  let strength: PasswordStrength;
  if (ratio <= 0.4) strength = 'weak';
  else if (ratio <= 0.6) strength = 'fair';
  else if (ratio <= 0.8) strength = 'strong';
  else strength = 'very-strong';

  return { valid: missing.length === 0, score, strength, missing };
}
