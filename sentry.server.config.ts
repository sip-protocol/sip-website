/**
 * Sentry Server Configuration
 *
 * This file configures Sentry for server-side error tracking and performance monitoring.
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

  // Environment based on build
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.NEXT_PUBLIC_GIT_COMMIT || 'dev',

  // Server-specific configuration
  // You may want to add additional server-side options here
})
