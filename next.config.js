// Conditionally require Sentry only if installed
let withSentryConfig
try {
  withSentryConfig = require('@sentry/nextjs').withSentryConfig
} catch (e) {
  // Sentry not installed, use passthrough
  withSentryConfig = (config) => config
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // On Vercel use the platform's native output; keep 'standalone' for the VPS Docker rollback image.
  output: process.env.VERCEL ? undefined : 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  env: {
    // The VPS Docker image bakes GIT_COMMIT/GIT_BRANCH via build-args; on Vercel those are absent,
    // so fall back to Vercel's built-in git vars to keep the footer build link resolving to a real commit.
    NEXT_PUBLIC_GIT_COMMIT:
      process.env.GIT_COMMIT ||
      (process.env.VERCEL_GIT_COMMIT_SHA ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7) : 'dev'),
    NEXT_PUBLIC_GIT_BRANCH: process.env.GIT_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || 'local',
  },
  async redirects() {
    return [
      // Deprecated app pages → sip-app (see #156)
      {
        source: '/demo',
        destination: 'https://app.sip-protocol.org/dex',
        permanent: true,
      },
      {
        source: '/demo/:path*',
        destination: 'https://app.sip-protocol.org/dex',
        permanent: true,
      },
      {
        source: '/claim',
        destination: 'https://app.sip-protocol.org/payments/receive',
        permanent: true,
      },
      {
        source: '/phantom-poc',
        destination: 'https://app.sip-protocol.org/wallet',
        permanent: true,
      },
      {
        source: '/jupiter-poc',
        destination: 'https://app.sip-protocol.org/dex/jupiter',
        permanent: true,
      },
      {
        source: '/compliance-dashboard',
        destination: 'https://app.sip-protocol.org/enterprise',
        permanent: true,
      },
      // Showcase migration - pitch-deck moved to showcase
      {
        source: '/pitch-deck',
        destination: '/showcase/zypherpunk-2025',
        permanent: true,
      },
    ]
  },
  async headers() {
    // Base security headers (all pages)
    const baseHeaders = [
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ]

    // CSP for pages WITH YouTube embeds (pitch-deck, grants)
    const cspWithYouTube = {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https://avatars.githubusercontent.com https://img.youtube.com https://i.ytimg.com https://cdn.sip-protocol.org",
        "font-src 'self'",
        "media-src 'self' https://cdn.sip-protocol.org",
        "connect-src 'self' https://api.1click.fi https://*.chaindefuser.com https://api.coingecko.com https://*.solana.com https://*.helius-rpc.com https://*.publicnode.com https://crs.aztec.network https://*.aztec.network wss://*.solana.com wss://*.helius-rpc.com wss://*.publicnode.com wss://*.chaindefuser.com blob: data:",
        "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://youtube-nocookie.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "worker-src 'self' blob:",
      ].join('; '),
    }

    // CSP for pages WITHOUT YouTube (stricter, with COOP/COEP for WASM)
    const cspStrict = {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https://avatars.githubusercontent.com https://img.youtube.com https://cdn.sip-protocol.org",
        "font-src 'self'",
        "media-src 'self' https://cdn.sip-protocol.org",
        "connect-src 'self' https://api.1click.fi https://*.chaindefuser.com https://api.coingecko.com https://*.solana.com https://*.helius-rpc.com https://*.publicnode.com https://crs.aztec.network https://*.aztec.network wss://*.solana.com wss://*.helius-rpc.com wss://*.publicnode.com wss://*.chaindefuser.com blob: data:",
        "frame-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "worker-src 'self' blob:",
      ].join('; '),
    }

    return [
      // All other pages - strict COOP/COEP for WASM support (FIRST - gets overridden by specific routes)
      {
        source: '/:path*',
        headers: [
          ...baseHeaders,
          // COOP/COEP headers for SharedArrayBuffer (required for WASM multi-threading)
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
          cspStrict,
        ],
      },
      // Pages with YouTube embeds - relaxed CSP with YouTube allowed
      {
        source: '/pitch-deck',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: *",
              "font-src 'self'",
              "media-src 'self' https://cdn.sip-protocol.org",
              "connect-src 'self' https: wss:",
              "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://youtube-nocookie.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/grants',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: *",
              "font-src 'self'",
              "media-src 'self' https://cdn.sip-protocol.org",
              "connect-src 'self' https: wss:",
              "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://youtube-nocookie.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // Showcase pages (video content)
      {
        source: '/showcase',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: *",
              "font-src 'self'",
              "media-src 'self' https://cdn.sip-protocol.org",
              "connect-src 'self' https: wss:",
              "frame-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/showcase/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: *",
              "font-src 'self'",
              "media-src 'self' https://cdn.sip-protocol.org",
              "connect-src 'self' https: wss:",
              "frame-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // Nested grant pages (superteam, solana-foundation)
      {
        source: '/grants/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: *",
              "font-src 'self'",
              "media-src 'self' https://cdn.sip-protocol.org",
              "connect-src 'self' https: wss:",
              "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://youtube-nocookie.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
  // Transpile linked SDK and Ledger packages for pnpm compatibility
  transpilePackages: [
    '@sip-protocol/sdk',
    '@ledgerhq/hw-transport-webusb',
    '@ledgerhq/hw-transport-webhid',
    '@ledgerhq/hw-app-eth',
    '@ledgerhq/hw-app-solana',
  ],
  // @sip-protocol/sdk pulls in @triton-one/yellowstone-grpc (Node-only + WASM), reachable only via
  // the server-side /api/zcash route — keep it out of the server bundle. Turbopack covers the rest
  // natively: bb.js WASM + top-level await need no config, and the SDK is imported only via dynamic
  // import() in client components, so its server-only deps stay out of the browser graph. Ledger/
  // Trezor resolve via transpilePackages (above) + their direct deps in this package.
  serverExternalPackages: ['@triton-one/yellowstone-grpc'],
  turbopack: {
    // @sip-protocol/sdk re-exports @triton-one/yellowstone-grpc (→ @grpc/grpc-js, Node-only) from
    // its main entry for the server-side Zcash provider. The browser never uses it — client code
    // only calls SDK crypto — but client components import the SDK, dragging grpc and its Node
    // builtins (net/tls/fs/http2/dns) into the browser graph. Stubbing the individual builtins to an
    // empty module silenced the build but left grpc-js executing `http2.constants.*` at load
    // (browser unhandledRejection). So stub the whole grpc package to empty for the browser instead:
    // grpc-js never loads client-side at all. The server keeps the real package via
    // serverExternalPackages, so the /api/zcash route is unaffected.
    resolveAlias: {
      '@triton-one/yellowstone-grpc': { browser: './turbopack-node-stub.js' },
      // The SDK's optional file-based cache (Node-only, guarded at runtime) imports fs/promises;
      // it reaches the browser via client components that import the SDK but is never used there.
      'fs/promises': { browser: './turbopack-node-stub.js' },
    },
  },
}

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Upload source maps in production only
  silent: true,

  // Automatically upload source maps for error tracking
  // Only upload if SENTRY_AUTH_TOKEN is set (in CI/CD)
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Don't upload source maps if no auth token (local dev)
  dryRun: !process.env.SENTRY_AUTH_TOKEN,
}

// Make sure adding Sentry options is the last code to run before exporting
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
