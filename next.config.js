const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_GIT_COMMIT: process.env.GIT_COMMIT || 'dev',
    NEXT_PUBLIC_GIT_BRANCH: process.env.GIT_BRANCH || 'local',
  },
  // Transpile linked SDK and Ledger packages for pnpm compatibility
  transpilePackages: [
    '@sip-protocol/sdk',
    '@ledgerhq/hw-transport-webusb',
    '@ledgerhq/hw-transport-webhid',
    '@ledgerhq/hw-app-eth',
    '@ledgerhq/hw-app-solana',
  ],
  webpack: (config) => {
    // Resolve Ledger packages from website's node_modules for linked SDK
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ledgerhq/hw-transport-webusb': path.resolve(__dirname, 'node_modules/@ledgerhq/hw-transport-webusb'),
      '@ledgerhq/hw-transport-webhid': path.resolve(__dirname, 'node_modules/@ledgerhq/hw-transport-webhid'),
      '@ledgerhq/hw-app-eth': path.resolve(__dirname, 'node_modules/@ledgerhq/hw-app-eth'),
      '@ledgerhq/hw-app-solana': path.resolve(__dirname, 'node_modules/@ledgerhq/hw-app-solana'),
      '@trezor/connect-web': path.resolve(__dirname, 'node_modules/@trezor/connect-web'),
    }
    return config
  },
}

module.exports = nextConfig
