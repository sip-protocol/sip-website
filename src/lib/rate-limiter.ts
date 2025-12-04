/**
 * Simple in-memory rate limiter for API routes
 *
 * Uses sliding window algorithm with per-IP tracking.
 * Automatically cleans up old entries to prevent memory leaks.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number
  ) {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000)
  }

  /**
   * Check if request should be allowed
   * @param identifier - Usually IP address
   * @returns true if allowed, false if rate limit exceeded
   */
  check(identifier: string): boolean {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    // No previous requests or window expired
    if (!entry || now > entry.resetAt) {
      this.requests.set(identifier, {
        count: 1,
        resetAt: now + this.windowMs
      })
      return true
    }

    // Within window, check count
    if (entry.count < this.maxRequests) {
      entry.count++
      return true
    }

    // Rate limit exceeded
    return false
  }

  /**
   * Get remaining requests for identifier
   */
  getRemaining(identifier: string): number {
    const entry = this.requests.get(identifier)
    if (!entry || Date.now() > entry.resetAt) {
      return this.maxRequests
    }
    return Math.max(0, this.maxRequests - entry.count)
  }

  /**
   * Get reset time for identifier
   */
  getResetTime(identifier: string): number | null {
    const entry = this.requests.get(identifier)
    if (!entry || Date.now() > entry.resetAt) {
      return null
    }
    return entry.resetAt
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetAt) {
        this.requests.delete(key)
      }
    }
  }

  /**
   * Clear all entries (for testing)
   */
  clear(): void {
    this.requests.clear()
  }

  /**
   * Destroy rate limiter and cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.clear()
  }
}

// Create rate limiter instance for Zcash API
// 10 requests per minute (60000ms) per IP
export const zcashRateLimiter = new RateLimiter(10, 60000)

/**
 * Get client IP from request headers
 * Handles various proxy configurations
 */
export function getClientIp(request: Request): string {
  // Try various headers in order of preference
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Take first IP from comma-separated list
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp.trim()
  }

  // Fallback to 'unknown' if no IP found
  return 'unknown'
}
