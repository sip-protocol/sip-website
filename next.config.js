/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_GIT_COMMIT: process.env.GIT_COMMIT || 'dev',
    NEXT_PUBLIC_GIT_BRANCH: process.env.GIT_BRANCH || 'local',
  },
}

module.exports = nextConfig
