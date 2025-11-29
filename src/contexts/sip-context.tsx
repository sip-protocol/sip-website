'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import type { SIP } from '@sip-protocol/sdk'
import { getSIPClientAsync, isRealSwapsEnabled } from '@/lib/sip-client'

/**
 * SIP Context value type
 */
interface SIPContextValue {
  /** The SIP SDK client instance (null while loading) */
  client: SIP | null
  /** Whether the SDK is ready for use */
  isReady: boolean
  /** Network the SDK is configured for */
  network: 'mainnet' | 'testnet'
  /** Whether real swaps (production mode) are enabled */
  isProductionMode: boolean
}

const SIPContext = createContext<SIPContextValue | null>(null)

/**
 * Provider props
 */
interface SIPProviderProps {
  children: ReactNode
}

/**
 * SIP Provider Component
 *
 * Provides the SIP SDK client to all child components via React context.
 * Handles async initialization of the SDK.
 *
 * @example
 * ```tsx
 * // In your app layout
 * <SIPProvider>
 *   <App />
 * </SIPProvider>
 *
 * // In any component
 * const { client, isReady } = useSIP()
 * if (isReady && client) {
 *   const intent = await client.createIntent({...})
 * }
 * ```
 */
export function SIPProvider({ children }: SIPProviderProps) {
  const [client, setClient] = useState<SIP | null>(null)
  const [isReady, setIsReady] = useState(false)
  const isProductionMode = isRealSwapsEnabled()

  useEffect(() => {
    getSIPClientAsync().then((sipClient) => {
      setClient(sipClient)
      setIsReady(true)
    })
  }, [])

  const value: SIPContextValue = {
    client,
    isReady,
    network: 'testnet',
    isProductionMode,
  }

  return (
    <SIPContext.Provider value={value}>
      {children}
    </SIPContext.Provider>
  )
}

/**
 * Hook to access the SIP SDK client
 *
 * @throws Error if used outside of SIPProvider
 *
 * @example
 * ```tsx
 * function SwapForm() {
 *   const { client, isReady } = useSIP()
 *
 *   const handleSwap = async () => {
 *     if (!isReady) return
 *
 *     const intent = await client.createIntent({
 *       input: { chain: 'solana', token: 'SOL', amount: 1000000000n },
 *       output: { chain: 'ethereum', token: 'ETH' },
 *       privacy: PrivacyLevel.SHIELDED,
 *     })
 *   }
 *
 *   return <button onClick={handleSwap}>Swap</button>
 * }
 * ```
 */
export function useSIP(): SIPContextValue {
  const context = useContext(SIPContext)

  if (!context) {
    throw new Error('useSIP must be used within a SIPProvider')
  }

  return context
}

/**
 * Hook to safely access SIP context (returns null if not in provider)
 *
 * Useful for components that may be rendered outside the provider context.
 */
export function useSIPSafe(): SIPContextValue | null {
  return useContext(SIPContext)
}
