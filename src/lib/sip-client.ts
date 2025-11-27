/**
 * SIP SDK Client Configuration
 *
 * Initializes the SIP client with appropriate configuration for demo/testnet use.
 */

import {
  SIP,
  MockProofProvider,
  type SIPConfig,
} from '@sip-protocol/sdk'

/**
 * Default configuration for demo/testnet environment
 */
export const SIP_CONFIG: SIPConfig = {
  network: 'testnet',
  proofProvider: new MockProofProvider(),
}

/**
 * Create a configured SIP client instance
 */
export function createSIPClient(config?: Partial<SIPConfig>): SIP {
  return new SIP({
    ...SIP_CONFIG,
    ...config,
  })
}

/**
 * Singleton instance for client-side usage
 * Lazy-initialized to avoid SSR issues
 */
let sipInstance: SIP | null = null

export function getSIPClient(): SIP {
  if (!sipInstance) {
    sipInstance = createSIPClient()
  }
  return sipInstance
}

/**
 * Reset the singleton (useful for testing or reconfiguration)
 */
export function resetSIPClient(): void {
  sipInstance = null
}
