export type PasswordStrengthOptions = {
  /**
   * Minimum password length to count towards the score.
   * Defaults to 8 characters.
   */
  minimumLength?: number;
  /**
   * Include a lowercase letter requirement in the score calculation.
   * Disabled by default to preserve existing login behaviour.
   */
  includeLowercase?: boolean;
};

export type PasswordStrengthResult = {
  score: number;
  maxScore: number;
};

/**
 * Calculates a password strength score based on a small set of heuristics.
 * The score is intentionally simple and returns both the achieved score
 * and the maximum possible score so the caller can derive percentages,
 * labels, or colours without duplicating logic.
 */
export function calculatePasswordStrength(
  password: string,
  options: PasswordStrengthOptions = {}
): PasswordStrengthResult {
  const { minimumLength = 8, includeLowercase = false } = options;

  const checks: Array<boolean | null> = [
    password.length >= minimumLength,
    /[A-Z]/.test(password),
    includeLowercase ? /[a-z]/.test(password) : null,
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  const activeChecks = checks.filter((check): check is boolean => check !== null);
  const score = activeChecks.reduce((total, passed) => total + Number(passed), 0);

  return { score, maxScore: activeChecks.length };
}
