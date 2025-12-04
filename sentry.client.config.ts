/**
 * Sentry Client Configuration
 *
 * This file configures Sentry for client-side error tracking and performance monitoring.
 *
 * Prerequisites:
 * - Install @sentry/nextjs: pnpm add @sentry/nextjs
 * - Set NEXT_PUBLIC_SENTRY_DSN in your environment variables
 *
 * See docs/SENTRY_SETUP.md for complete setup instructions.
 */

// @ts-ignore - Sentry not installed yet, will work once @sentry/nextjs is added
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Adjust this value in production to reduce volume and costs
  tracesSampleRate: 1.0,

  // Set profilesSampleRate to 1.0 to profile 100% of sampled transactions.
  // Adjust this value in production to reduce volume and costs
  profilesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Replay may be enabled during development, but we typically disable it in production to reduce costs
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Environment based on build
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.NEXT_PUBLIC_GIT_COMMIT || 'dev',

  // Filter out common browser extension errors
  ignoreErrors: [
    // Browser extension errors
    'Non-Error promise rejection captured',
    'ResizeObserver loop limit exceeded',
    // Network errors
    'NetworkError',
    'Failed to fetch',
    // Wallet extension errors
    'User rejected',
    'User denied',
  ],

  beforeSend(event: any, hint: any) {
    // Filter out wallet-related user rejections
    if (event.exception?.values?.[0]?.value?.includes('User rejected')) {
      return null
    }
    return event
  },
})
