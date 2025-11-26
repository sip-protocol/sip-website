/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@sip-protocol/sdk', '@sip-protocol/types'],
  experimental: {
    serverComponentsExternalPackages: ['@noble/curves', '@noble/hashes'],
  },
}

module.exports = nextConfig
