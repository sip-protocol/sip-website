/**
 * Centralized constants for marketing pages
 *
 * Keep these in sync with actual metrics:
 * - SDK tests: pnpm test --run (in sip-protocol/packages/sdk)
 * - Website tests: pnpm test --run (in sip-website)
 */

// SDK Version - auto-read from package.json dependency
// This ensures version stays in sync with the actual installed SDK
import packageJson from '../../package.json'

function getSDKVersion(): string {
  const dep = packageJson.dependencies?.['@sip-protocol/sdk'] || '0.0.0'
  // Remove ^ or ~ prefix if present
  return dep.replace(/^[\^~]/, '')
}

export const SDK_VERSION = {
  /** Raw version number (e.g., "0.2.2") */
  version: getSDKVersion(),
  /** Display format with 'v' prefix (e.g., "v0.2.2") */
  get display() {
    return `v${this.version}`
  },
  /** Full package name with version */
  get full() {
    return `@sip-protocol/sdk v${this.version}`
  },
  /** npm URL */
  npmUrl: 'https://www.npmjs.com/package/@sip-protocol/sdk',
}

// Test counts - updated 2026-01-22
export const TEST_COUNTS = {
  sdk: 6604,
  react: 82,
  cli: 10,
  api: 18,
  reactNative: 10,
  website: 126,
  get total() {
    return this.sdk + this.react + this.cli + this.api + this.reactNative + this.website
  },
  // Formatted strings for display
  get sdkDisplay() {
    return `${this.sdk.toLocaleString()}+`
  },
  get websiteDisplay() {
    return `${this.website}+`
  },
  get totalDisplay() {
    return `${this.total.toLocaleString()}+`
  },
  get detailDisplay() {
    return `SDK: ${this.sdk.toLocaleString()} | React: ${this.react} | CLI: ${this.cli} | API: ${this.api} | RN: ${this.reactNative} | Website: ${this.website}`
  },
}

// Project metrics
export const PROJECT_METRICS = {
  testsTotal: TEST_COUNTS.totalDisplay,
  testsDetail: TEST_COUNTS.detailDisplay,
  chains: '15+',
  packages: '7',
  milestones: 'M16',
  proofTime: '<5s',
  proofSize: '~2KB',
}

// Project status - current phase and milestone
export const PROJECT_STATUS = {
  currentPhase: 4,
  currentPhaseName: 'Same-Chain Expansion',
  currentMilestone: 'M17',
  currentMilestoneName: 'Solana Same-Chain Privacy',
  completedMilestones: 16,
  totalMilestones: 22,
  phasesComplete: 3,
  totalPhases: 5,
}

// Achievements and awards
export const ACHIEVEMENTS = [
  {
    id: 'zypherpunk-2025',
    title: 'Zypherpunk Hackathon Winner',
    track: '3 Tracks (NEAR + Tachyon + pumpfun)',
    prize: '$6,500',
    ranking: '#9 of 93',
    date: 'December 2025',
    link: 'https://zypherpunk.xyz',
    badge: 'Winner',
  },
] as const

// Hero messaging - THE Privacy Standard claim
export const HERO = {
  badge: 'Zypherpunk Hackathon Winner',
  tagline: 'The Privacy Standard for Web3',
  subtitle: 'Like HTTPS for the internet. One toggle to shield sender, amount, and recipient.',
  description: 'Privacy middleware between applications and blockchains. Chain-agnostic. Settlement-agnostic. Compliance-ready with viewing keys.',
}
