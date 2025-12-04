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
 * Load SDK module (cached singleton)
 * Use this instead of dynamic import in hooks to avoid repeated loading
 */
export async function getSDK(): Promise<typeof import('@sip-protocol/sdk')> {
  if (sdkModule) return sdkModule
  if (sdkLoadPromise) return sdkLoadPromise

  sdkLoadPromise = loadSDK().then((mod) => {
    sdkModule = mod
    return mod
  })

  return sdkLoadPromise
}

/**
 * Preload SDK module in background (fire and forget)
 * Call this early (e.g., on page mount) to warm up the cache
 */
export function preloadSDK(): void {
  getSDK().catch((err) => {
    // Expected failure: SDK preload is opportunistic, will retry on actual use
    console.debug('[SIP SDK] Preload failed (non-critical):', err instanceof Error ? err.message : 'Unknown error')
  })
}

/**
 * Check if SDK is already loaded (for UI indicators)
 */
export function isSDKLoaded(): boolean {
  return sdkModule !== null
}

/**
 * Proof provider instance (lazy-initialized)
 */
let proofProvider: ProofProvider | null = null
let providerInitPromise: Promise<ProofProvider> | null = null

/**
 * Initialize the proof provider
 *
 * Uses BrowserNoirProvider for real ZK proofs in browser environments.
 * Falls back to MockProofProvider (silent) for SSR to avoid WASM issues.
 */
async function initializeProofProvider(): Promise<ProofProvider> {
  if (proofProvider) {
    return proofProvider
  }

  // Browser environment - use real Noir proofs
  if (typeof window !== 'undefined') {
    try {
      const { BrowserNoirProvider } = await import('@sip-protocol/sdk/browser')
      proofProvider = new BrowserNoirProvider()
      await proofProvider.initialize()
      return proofProvider
    } catch (error) {
      // Fallback to mock if Noir fails (e.g., WASM not supported)
      console.warn('[SIP] BrowserNoirProvider failed, falling back to mock:', error)
    }
  }

  // SSR fallback - mock provider (silent to avoid warning in server logs)
  const sdk = await getSDK()
  proofProvider = new sdk.MockProofProvider({ silent: true })

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
  // Get the initialized proof provider (real Noir in browser, mock for SSR)
  const provider = await getProofProvider()

  const baseConfig: SIPConfig = {
    network: 'testnet',
    proofProvider: provider,
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
