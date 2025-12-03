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

// Test counts - updated 2024-12-02
export const TEST_COUNTS = {
  sdk: 1292,
  website: 123,
  get total() {
    return this.sdk + this.website
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
    return `${this.sdk.toLocaleString()} SDK + ${this.website} website`
  },
}

// Project metrics
export const PROJECT_METRICS = {
  testsTotal: TEST_COUNTS.totalDisplay,
  testsDetail: TEST_COUNTS.detailDisplay,
  chains: '10+',
  proofTime: '<5s',
  proofSize: '~2KB',
}
