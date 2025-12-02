'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import type { WalletSelector, WalletModuleFactory, Wallet } from '@near-wallet-selector/core'
import { actionCreators } from '@near-wallet-selector/core'
import { getNearConfig, type NearNetworkId } from '@/lib/near-config'
import type { WalletType } from '@/stores'

// Dynamic imports for wallet modules to avoid SSR issues
const loadWalletSelector = async () => {
  const { setupWalletSelector } = await import('@near-wallet-selector/core')
  return setupWalletSelector
}

const loadMeteorWallet = async () => {
  const { setupMeteorWallet } = await import('@near-wallet-selector/meteor-wallet')
  return setupMeteorWallet
}

const loadMyNearWallet = async () => {
  const { setupMyNearWallet } = await import('@near-wallet-selector/my-near-wallet')
  return setupMyNearWallet
}

const loadHereWallet = async () => {
  const { setupHereWallet } = await import('@near-wallet-selector/here-wallet')
  return setupHereWallet
}

const loadSenderWallet = async () => {
  const { setupSender } = await import('@near-wallet-selector/sender')
  return setupSender
}

// Map WalletType to wallet selector module ID
const WALLET_MODULE_MAP: Record<string, string> = {
  meteor: 'meteor-wallet',
  mynearwallet: 'my-near-wallet',
  here: 'here-wallet',
  sender: 'sender',
}

/**
 * Singleton storage for NEAR wallet selector
 * Allows access from both React components and plain functions
 */
let globalSelector: WalletSelector | null = null
let globalActiveWallet: Wallet | null = null

/**
 * Get the global NEAR wallet selector instance
 * Used by wallet-deposit.ts for sending transactions
 */
export function getNearWalletSelector(): WalletSelector | null {
  return globalSelector
}

/**
 * Get the currently active NEAR wallet
 */
export function getActiveNearWallet(): Wallet | null {
  return globalActiveWallet
}

/**
 * Send NEAR tokens to a deposit address using the global wallet
 * This function can be called from outside React components
 */
export async function sendNearTransaction(
  depositAddress: string,
  amount: string
): Promise<string> {
  if (!globalSelector) {
    throw new Error('NEAR wallet selector not initialized. Please connect a NEAR wallet first.')
  }

  const wallet = await globalSelector.wallet()
  if (!wallet) {
    throw new Error('No NEAR wallet connected. Please connect a wallet first.')
  }

  const state = globalSelector.store.getState()
  if (state.accounts.length === 0) {
    throw new Error('No NEAR account signed in. Please sign in first.')
  }

  const signerId = state.accounts[0].accountId

  // Convert yoctoNEAR amount to proper format
  // The amount from 1Click API is in yoctoNEAR (10^-24 NEAR)
  const yoctoNearAmount = amount

  // Sign and send the transaction using actionCreators
  const result = await wallet.signAndSendTransaction({
    signerId,
    receiverId: depositAddress,
    actions: [actionCreators.transfer(BigInt(yoctoNearAmount))],
  })

  // Handle different wallet response types
  if (!result) {
    throw new Error('Transaction was cancelled or failed')
  }

  // MyNearWallet and similar return void (redirect-based)
  // Other wallets return the transaction outcome
  if (typeof result === 'object' && 'transaction' in result) {
    return result.transaction.hash
  }

  // For redirect-based wallets, we won't have a hash immediately
  // This is a limitation - the user will be redirected and come back
  throw new Error(
    'Transaction submitted. For redirect-based wallets, please check your wallet for confirmation.'
  )
}

interface NearWalletContextValue {
  selector: WalletSelector | null
  accountId: string | null
  isConnecting: boolean
  isReady: boolean
  error: string | null
  connect: (walletType: WalletType) => Promise<string | null>
  disconnect: () => Promise<void>
  detectWallets: () => WalletType[]
  sendTransaction: (depositAddress: string, amount: string) => Promise<string>
}

const NearWalletContext = createContext<NearWalletContextValue | null>(null)

interface NearWalletProviderProps {
  children: ReactNode
  networkId?: NearNetworkId
}

export function NearWalletProvider({
  children,
  networkId = 'testnet',
}: NearWalletProviderProps) {
  const [selector, setSelector] = useState<WalletSelector | null>(null)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const initRef = useRef(false)

  // Initialize wallet selector
  useEffect(() => {
    if (initRef.current || typeof window === 'undefined') return
    initRef.current = true

    const init = async () => {
      try {
        const config = getNearConfig(networkId)
        const setupWalletSelector = await loadWalletSelector()

        // Load wallet modules
        const [setupMeteor, setupMyNear, setupHere, setupSender] = await Promise.all([
          loadMeteorWallet(),
          loadMyNearWallet(),
          loadHereWallet(),
          loadSenderWallet(),
        ])

        const walletSelector = await setupWalletSelector({
          network: config.networkId,
          modules: [
            setupMeteor() as WalletModuleFactory,
            setupMyNear() as WalletModuleFactory,
            setupHere() as WalletModuleFactory,
            setupSender() as WalletModuleFactory,
          ],
        })

        // Store in global singleton for wallet-deposit.ts access
        globalSelector = walletSelector

        setSelector(walletSelector)
        setIsReady(true)

        // Check if already signed in
        const state = walletSelector.store.getState()
        if (state.accounts.length > 0) {
          setAccountId(state.accounts[0].accountId)
          // Update active wallet
          globalActiveWallet = await walletSelector.wallet()
        }

        // Subscribe to account changes
        walletSelector.store.observable.subscribe(async (state) => {
          if (state.accounts.length > 0) {
            setAccountId(state.accounts[0].accountId)
            globalActiveWallet = await walletSelector.wallet()
          } else {
            setAccountId(null)
            globalActiveWallet = null
          }
        })
      } catch {
        // NEAR wallet initialization failed - error handled via state
        setError('Failed to initialize NEAR wallets')
      }
    }

    init()

    // Cleanup
    return () => {
      globalSelector = null
      globalActiveWallet = null
    }
  }, [networkId])

  // Detect available wallets
  const detectWallets = useCallback((): WalletType[] => {
    if (!selector) return []

    const modules = selector.store.getState().modules
    const detected: WalletType[] = []

    for (const walletModule of modules) {
      const walletType = Object.entries(WALLET_MODULE_MAP).find(
        ([, moduleId]) => moduleId === walletModule.id
      )?.[0] as WalletType | undefined

      if (walletType) {
        detected.push(walletType)
      }
    }

    return detected
  }, [selector])

  // Connect to a specific wallet
  const connect = useCallback(
    async (walletType: WalletType): Promise<string | null> => {
      if (!selector) {
        setError('Wallet selector not initialized')
        return null
      }

      const moduleId = WALLET_MODULE_MAP[walletType]
      if (!moduleId) {
        setError(`Unknown wallet type: ${walletType}`)
        return null
      }

      setIsConnecting(true)
      setError(null)

      try {
        const wallet = await selector.wallet(moduleId)
        const accounts = await wallet.signIn({
          contractId: '', // Empty string for just account access
          accounts: [],
        })

        if (accounts.length > 0) {
          const account = accounts[0].accountId
          setAccountId(account)
          globalActiveWallet = wallet
          return account
        }

        setError('No accounts found after sign in')
        return null
      } catch (err) {
        // NEAR wallet connection failed - error handled via state
        const message = err instanceof Error ? err.message : 'Connection failed'

        if (message.includes('rejected') || message.includes('cancelled')) {
          setError('Connection request was rejected')
        } else if (message.includes('timeout')) {
          setError('Connection timed out')
        } else {
          setError(message)
        }

        return null
      } finally {
        setIsConnecting(false)
      }
    },
    [selector]
  )

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    if (!selector) return

    try {
      const wallet = await selector.wallet()
      await wallet.signOut()
      setAccountId(null)
      globalActiveWallet = null
    } catch {
      // NEAR wallet disconnect failed - silent failure acceptable
    }
  }, [selector])

  // Send transaction wrapper for context
  const sendTransaction = useCallback(
    async (depositAddress: string, amount: string): Promise<string> => {
      return sendNearTransaction(depositAddress, amount)
    },
    []
  )

  const value: NearWalletContextValue = {
    selector,
    accountId,
    isConnecting,
    isReady,
    error,
    connect,
    disconnect,
    detectWallets,
    sendTransaction,
  }

  return (
    <NearWalletContext.Provider value={value}>
      {children}
    </NearWalletContext.Provider>
  )
}

/**
 * Hook to access NEAR wallet context
 */
export function useNearWalletContext(): NearWalletContextValue {
  const context = useContext(NearWalletContext)
  if (!context) {
    throw new Error('useNearWalletContext must be used within a NearWalletProvider')
  }
  return context
}

/**
 * Safe hook that returns null if not in provider
 */
export function useNearWalletContextSafe(): NearWalletContextValue | null {
  return useContext(NearWalletContext)
}
