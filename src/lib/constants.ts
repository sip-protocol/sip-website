/**
 * Centralized constants for marketing pages
 *
 * Keep these in sync with actual metrics:
 * - SDK tests: pnpm test --run (in sip-protocol/packages/sdk)
 * - Website tests: pnpm test --run (in sip-website)
 */

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
