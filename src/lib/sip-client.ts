/**
 * SIP SDK Client Configuration
 *
 * Initializes the SIP client with appropriate configuration for demo/testnet use.
 * Uses NoirProofProvider for real ZK proofs (with MockProofProvider fallback).
 */

import {
  SIP,
  NoirProofProvider,
  MockProofProvider,
  type SIPConfig,
  type ProofProvider,
} from '@sip-protocol/sdk'

/**
 * Proof provider instance (lazy-initialized)
 */
let proofProvider: ProofProvider | null = null
let providerInitPromise: Promise<ProofProvider> | null = null

/**
 * Initialize the proof provider
 * Uses NoirProofProvider if WASM is available, falls back to MockProofProvider
 */
async function initializeProofProvider(): Promise<ProofProvider> {
  if (proofProvider) {
    return proofProvider
  }

  try {
    const noirProvider = new NoirProofProvider({ verbose: false })
    await noirProvider.initialize()
    proofProvider = noirProvider
    console.log('[SIP] NoirProofProvider initialized successfully')
  } catch (error) {
    // Fallback to mock provider if Noir fails (e.g., WASM not available)
    console.warn('[SIP] NoirProofProvider failed, using MockProofProvider:', error)
    proofProvider = new MockProofProvider()
  }

  return proofProvider
}

/**
 * Get the proof provider (initializes if needed)
 */
export function getProofProvider(): Promise<ProofProvider> {
  if (!providerInitPromise) {
    providerInitPromise = initializeProofProvider()
  }
  return providerInitPromise
}

/**
 * Default configuration for demo/testnet environment
 * Note: proofProvider is set dynamically after initialization
 */
export const SIP_CONFIG: SIPConfig = {
  network: 'testnet',
  proofProvider: new MockProofProvider(), // Default, replaced after init
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
 * Track if client has been initialized with real provider
 */
let clientInitialized = false

/**
 * Get an initialized SIP client with NoirProofProvider
 * Use this for operations that require real ZK proofs
 */
export async function getInitializedSIPClient(): Promise<SIP> {
  const provider = await getProofProvider()

  if (!sipInstance || !clientInitialized) {
    sipInstance = createSIPClient({ proofProvider: provider })
    clientInitialized = true
  }

  return sipInstance
}

/**
 * Reset the singleton (useful for testing or reconfiguration)
 */
export function resetSIPClient(): void {
  sipInstance = null
  proofProvider = null
  providerInitPromise = null
  clientInitialized = false
}
