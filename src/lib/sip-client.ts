/**
 * SIP SDK Client Configuration
 *
 * Initializes the SIP client with appropriate configuration for demo/testnet use.
 * Uses dynamic imports to avoid SSR/WASM issues with Barretenberg.
 *
 * Production mode (real NEAR 1Click API):
 * - Set NEXT_PUBLIC_REAL_SWAPS=true in .env.local
 * - Optionally set NEXT_PUBLIC_NEAR_INTENTS_JWT for authenticated API access
 */

// Type-only imports (no runtime dependency)
import type { SIP, SIPConfig, ProofProvider } from '@sip-protocol/sdk'

// Dynamic SDK import to avoid WASM loading during SSG
const loadSDK = () => import('@sip-protocol/sdk')

/**
 * Check if real swaps are enabled via environment variable
 */
export const isRealSwapsEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_REAL_SWAPS === 'true'
}

/**
 * Get NEAR Intents JWT token from environment (optional)
 */
export const getNearIntentsJwt = (): string | undefined => {
  return process.env.NEXT_PUBLIC_NEAR_INTENTS_JWT
}

/**
 * Lazy SDK module cache
 */
let sdkModule: typeof import('@sip-protocol/sdk') | null = null
let sdkLoadPromise: Promise<typeof import('@sip-protocol/sdk')> | null = null

/**
 * Load SDK module (cached)
 */
async function getSDK(): Promise<typeof import('@sip-protocol/sdk')> {
  if (sdkModule) return sdkModule
  if (sdkLoadPromise) return sdkLoadPromise

  sdkLoadPromise = loadSDK().then((mod) => {
    sdkModule = mod
    return mod
  })

  return sdkLoadPromise
}

/**
 * Proof provider instance (lazy-initialized)
 */
let proofProvider: ProofProvider | null = null
let providerInitPromise: Promise<ProofProvider> | null = null

/**
 * Initialize the proof provider
 * Uses MockProofProvider (NoirProofProvider requires WASM which causes SSR issues)
 */
async function initializeProofProvider(): Promise<ProofProvider> {
  if (proofProvider) {
    return proofProvider
  }

  const sdk = await getSDK()

  try {
    const noirProvider = new sdk.NoirProofProvider({ verbose: false })
    await noirProvider.initialize()
    proofProvider = noirProvider
    // NoirProofProvider initialized successfully
  } catch {
    // Fallback to mock provider if Noir fails (e.g., WASM not available)
    proofProvider = new sdk.MockProofProvider()
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
 * Get base configuration for demo/testnet environment
 */
async function getSIPConfigAsync(sdk: typeof import('@sip-protocol/sdk')): Promise<SIPConfig> {
  const baseConfig: SIPConfig = {
    network: 'testnet',
    proofProvider: new sdk.MockProofProvider(),
  }

  // Enable production mode for real NEAR 1Click swaps
  if (isRealSwapsEnabled()) {
    baseConfig.mode = 'production'
    baseConfig.intentsAdapter = {
      jwtToken: getNearIntentsJwt(),
    }
    // Production mode enabled - using real NEAR 1Click API
  }

  return baseConfig
}

/**
 * Create a configured SIP client instance
 */
export async function createSIPClientAsync(config?: Partial<SIPConfig>): Promise<SIP> {
  const sdk = await getSDK()
  const baseConfig = await getSIPConfigAsync(sdk)
  return new sdk.SIP({
    ...baseConfig,
    ...config,
  })
}

/**
 * Singleton instance for client-side usage
 * Lazy-initialized to avoid SSR issues
 */
let sipInstance: SIP | null = null
let clientInitPromise: Promise<SIP> | null = null

/**
 * Get or create the singleton SIP client (async)
 */
export async function getSIPClientAsync(): Promise<SIP> {
  if (sipInstance) return sipInstance
  if (clientInitPromise) return clientInitPromise

  clientInitPromise = createSIPClientAsync().then((client) => {
    sipInstance = client
    return client
  })

  return clientInitPromise
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
    sipInstance = await createSIPClientAsync({ proofProvider: provider })
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
  clientInitPromise = null
  clientInitialized = false
}
