const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
    NEXT_PUBLIC_GIT_COMMIT: process.env.GIT_COMMIT || 'dev',
    NEXT_PUBLIC_GIT_BRANCH: process.env.GIT_BRANCH || 'local',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
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
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://avatars.githubusercontent.com https://img.youtube.com",
              "font-src 'self'",
              "connect-src 'self' https://api.1click.fi https://*.solana.com https://*.helius-rpc.com wss://*.solana.com",
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
  webpack: (config, { isServer }) => {
    // Resolve Ledger packages from website's node_modules for linked SDK
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ledgerhq/hw-transport-webusb': path.resolve(__dirname, 'node_modules/@ledgerhq/hw-transport-webusb'),
      '@ledgerhq/hw-transport-webhid': path.resolve(__dirname, 'node_modules/@ledgerhq/hw-transport-webhid'),
      '@ledgerhq/hw-app-eth': path.resolve(__dirname, 'node_modules/@ledgerhq/hw-app-eth'),
      '@ledgerhq/hw-app-solana': path.resolve(__dirname, 'node_modules/@ledgerhq/hw-app-solana'),
      '@trezor/connect-web': path.resolve(__dirname, 'node_modules/@trezor/connect-web'),
    }

    // Handle WASM loading for @aztec/bb.js and similar packages
    if (!isServer) {
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
        topLevelAwait: true,
      }
    }

    return config
  },
}

module.exports = nextConfig
