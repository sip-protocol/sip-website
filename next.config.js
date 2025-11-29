/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_GIT_COMMIT: process.env.GIT_COMMIT || 'dev',
    NEXT_PUBLIC_GIT_BRANCH: process.env.GIT_BRANCH || 'local',
  },
  // Externalize packages with WASM/browser-only code from SSR
  serverExternalPackages: [
    '@aztec/bb.js',
    '@sip-protocol/sdk',
  ],
  experimental: {
    // Prevent WASM-related modules from being bundled on server
    serverComponentsExternalPackages: [
      '@aztec/bb.js',
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle WASM files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }

    // Externalize browser-only packages on server
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        '@aztec/bb.js': 'commonjs @aztec/bb.js',
      })
    }

    return config
  },
}

module.exports = nextConfig
