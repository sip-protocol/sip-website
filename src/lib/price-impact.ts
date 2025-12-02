/**
 * Price Impact Calculation Utilities
 *
 * Calculates and categorizes price impact for swap quotes.
 */

export type PriceImpactSeverity = 'low' | 'medium' | 'high' | 'severe'

export interface PriceImpact {
  /** Impact percentage (e.g., 2.5 = 2.5%) */
  percentage: number
  /** Severity level for color coding */
  severity: PriceImpactSeverity
  /** Warning message if applicable */
  warning?: string
}

/**
 * Calculate price impact based on quote vs market rate
 *
 * @param inputAmount - Amount being swapped
 * @param outputAmount - Amount received from quote
 * @param marketRate - Expected market rate (1 input = X output)
 * @returns Price impact details
 */
export function calculatePriceImpact(
  inputAmount: number,
  outputAmount: number,
  marketRate: number
): PriceImpact {
  if (inputAmount <= 0 || outputAmount <= 0 || marketRate <= 0) {
    return { percentage: 0, severity: 'low' }
  }

  // Expected output at market rate
  const expectedOutput = inputAmount * marketRate

  // Impact = (expected - actual) / expected * 100
  // Positive impact means you're getting less than expected
  const impact = ((expectedOutput - outputAmount) / expectedOutput) * 100

  // Clamp negative impact (getting MORE than expected is rare but possible)
  const clampedImpact = Math.max(0, impact)

  return categorizeImpact(clampedImpact)
}

/**
 * Categorize impact percentage into severity levels
 */
function categorizeImpact(percentage: number): PriceImpact {
  if (percentage < 1) {
    return {
      percentage,
      severity: 'low',
    }
  }

  if (percentage < 3) {
    return {
      percentage,
      severity: 'medium',
    }
  }

  if (percentage < 10) {
    return {
      percentage,
      severity: 'high',
      warning: 'High price impact! You may receive significantly less than expected.',
    }
  }

  return {
    percentage,
    severity: 'severe',
    warning: 'Extremely high price impact! Consider swapping a smaller amount.',
  }
}

/**
 * Get Tailwind color class for impact severity
 */
export function getImpactColorClass(severity: PriceImpactSeverity): string {
  switch (severity) {
    case 'low':
      return 'text-green-400'
    case 'medium':
      return 'text-yellow-400'
    case 'high':
      return 'text-orange-400'
    case 'severe':
      return 'text-red-400'
  }
}

/**
 * Get background color class for impact severity (for warnings)
 */
export function getImpactBgClass(severity: PriceImpactSeverity): string {
  switch (severity) {
    case 'low':
      return 'bg-green-500/10 border-green-500/30'
    case 'medium':
      return 'bg-yellow-500/10 border-yellow-500/30'
    case 'high':
      return 'bg-orange-500/10 border-orange-500/30'
    case 'severe':
      return 'bg-red-500/10 border-red-500/30'
  }
}

/**
 * Format impact percentage for display
 */
export function formatImpact(percentage: number): string {
  if (percentage < 0.01) return '<0.01%'
  if (percentage < 1) return `${percentage.toFixed(2)}%`
  return `${percentage.toFixed(1)}%`
}
