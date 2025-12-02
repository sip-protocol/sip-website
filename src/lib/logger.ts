/**
 * Development-only Logger
 *
 * Guards all logging behind NODE_ENV checks to ensure
 * no console output in production builds.
 *
 * IMPORTANT: Never log sensitive data (addresses, keys, amounts)
 * even in development mode. Use generic success/failure messages.
 */

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  /**
   * Debug logging - development only
   * Use for general debugging, never for sensitive data
   */
  debug: (message: string, context?: string): void => {
    if (isDev) {
      const prefix = context ? `[${context}]` : '[DEBUG]'
      console.log(`${prefix} ${message}`)
    }
  },

  /**
   * Info logging - development only
   */
  info: (message: string, context?: string): void => {
    if (isDev) {
      const prefix = context ? `[${context}]` : '[INFO]'
      console.log(`${prefix} ${message}`)
    }
  },

  /**
   * Warning logging - development only
   */
  warn: (message: string, context?: string): void => {
    if (isDev) {
      const prefix = context ? `[${context}]` : '[WARN]'
      console.warn(`${prefix} ${message}`)
    }
  },

  /**
   * Error logging - development only
   * In production, errors should be sent to monitoring service
   */
  error: (message: string, error?: unknown, context?: string): void => {
    if (isDev) {
      const prefix = context ? `[${context}]` : '[ERROR]'
      console.error(`${prefix} ${message}`, error instanceof Error ? error.message : error)
    }
    // TODO: In production, send to error monitoring service (e.g., Sentry)
    // if (!isDev && error) {
    //   Sentry.captureException(error)
    // }
  },
}
