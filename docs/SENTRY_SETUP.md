# Sentry Integration Setup

This document explains how to set up Sentry error monitoring for the SIP Website.

## Prerequisites

1. Install the Sentry Next.js SDK:
   ```bash
   pnpm add @sentry/nextjs
   ```

2. Create a Sentry project at [sentry.io](https://sentry.io)

## Configuration

### 1. Environment Variables

Add the following to your `.env.local` file:

```bash
# Required for error tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-project-key@o123456.ingest.sentry.io/7890123

# Optional: For source map uploads (CI/CD only)
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=sip-website
```

**Where to find these values:**
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry Dashboard → Settings → Projects → [Your Project] → Client Keys (DSN)
- `SENTRY_AUTH_TOKEN`: Sentry Dashboard → Settings → Account → API → Auth Tokens (create with `project:releases` and `org:read` scopes)
- `SENTRY_ORG`: Your organization slug (visible in Sentry URL)
- `SENTRY_PROJECT`: Your project slug (visible in Sentry URL)

### 2. Configuration Files

The following Sentry configuration files are already set up:

- `sentry.client.config.ts` - Client-side error tracking with Replay
- `sentry.server.config.ts` - Server-side error tracking
- `sentry.edge.config.ts` - Edge runtime error tracking
- `next.config.js` - Webpack plugin configuration for source maps

### 3. ErrorBoundary Integration

The existing `ErrorBoundary` component (`src/components/error-boundary.tsx`) is already configured to send errors to Sentry when available.

## Features Enabled

### Error Tracking
- Automatic error capture on client and server
- React error boundary integration
- Component stack traces
- Filtered wallet-related user rejections

### Performance Monitoring
- 100% transaction sampling (adjust `tracesSampleRate` for production)
- Performance profiling enabled
- Release tracking via git commit hash

### Session Replay
- 100% replay on errors
- 10% replay on normal sessions (adjust for production)
- Privacy: All text masked, all media blocked

## CI/CD Integration

### GitHub Actions

Add Sentry environment variables to your GitHub repository secrets:
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

### Docker Deployment

Add to your `docker-compose.yml`:

```yaml
environment:
  - NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}
  - SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
  - SENTRY_ORG=${SENTRY_ORG}
  - SENTRY_PROJECT=${SENTRY_PROJECT}
```

## Production Recommendations

### Sampling Rates

Adjust in `sentry.client.config.ts` and `sentry.server.config.ts`:

```typescript
tracesSampleRate: 0.1,        // 10% of transactions
profilesSampleRate: 0.1,      // 10% of sampled transactions
replaysOnErrorSampleRate: 1.0, // 100% of errors
replaysSessionSampleRate: 0.01, // 1% of normal sessions
```

### Source Maps

Source maps are automatically uploaded during build when `SENTRY_AUTH_TOKEN` is set. They are excluded from the production bundle and only sent to Sentry.

### Alert Rules

See [sip-protocol/docs/sentry-alerts.md](https://github.com/sip-protocol/sip-protocol/blob/main/docs/sentry-alerts.md) for recommended alert configurations.

## Verification

After deploying with Sentry configured:

1. Visit your application
2. Trigger an error (e.g., throw an error in a component)
3. Check Sentry Dashboard → Issues to see the error
4. Verify source maps are working (stack traces show original TypeScript code)

## Troubleshooting

### Source Maps Not Uploading

- Verify `SENTRY_AUTH_TOKEN` is set during build
- Check token has `project:releases` and `org:read` scopes
- Ensure `SENTRY_ORG` and `SENTRY_PROJECT` match your Sentry configuration

### Errors Not Appearing

- Verify `NEXT_PUBLIC_SENTRY_DSN` is set and correct
- Check browser console for Sentry initialization errors
- Ensure error is not filtered by `ignoreErrors` in config

### Local Development

In local development without `NEXT_PUBLIC_SENTRY_DSN`, Sentry will not initialize and errors will only log to console. This is expected behavior.

## Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Error Filtering](https://docs.sentry.io/platforms/javascript/configuration/filtering/)
- [Sentry Session Replay](https://docs.sentry.io/platforms/javascript/session-replay/)
