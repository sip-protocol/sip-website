'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { WalletSelector, WalletModuleFactory, Wallet } from '@near-wallet-selector/core'
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

export interface UseNearWalletReturn {
  selector: WalletSelector | null
  accountId: string | null
  isConnecting: boolean
  error: string | null
  connect: (walletType: WalletType) => Promise<string | null>
  disconnect: () => Promise<void>
  detectWallets: () => WalletType[]
  isReady: boolean
}

export function useNearWallet(networkId: NearNetworkId = 'testnet'): UseNearWalletReturn {
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

        setSelector(walletSelector)
        setIsReady(true)

        // Check if already signed in
        const state = walletSelector.store.getState()
        if (state.accounts.length > 0) {
          setAccountId(state.accounts[0].accountId)
        }

        // Subscribe to account changes
        walletSelector.store.observable.subscribe((state) => {
          if (state.accounts.length > 0) {
            setAccountId(state.accounts[0].accountId)
          } else {
            setAccountId(null)
          }
        })
      } catch {
        // NEAR wallet initialization failed - error handled via state
        setError('Failed to initialize NEAR wallets')
      }
    }

    init()
  }, [networkId])

  // Detect available wallets
  const detectWallets = useCallback((): WalletType[] => {
    if (!selector) return []

    const modules = selector.store.getState().modules
    const detected: WalletType[] = []

    for (const walletModule of modules) {
      // Map module ID back to our WalletType
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
  const connect = useCallback(async (walletType: WalletType): Promise<string | null> => {
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
        return account
      }

      setError('No accounts found after sign in')
      return null
    } catch (err) {
      // NEAR wallet connection failed - error handled via state
      const message = err instanceof Error ? err.message : 'Connection failed'

      // Parse common error messages
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
  }, [selector])

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    if (!selector) return

    try {
      const wallet = await selector.wallet()
      await wallet.signOut()
      setAccountId(null)
    } catch {
      // NEAR wallet disconnect failed - silent failure acceptable
    }
  }, [selector])

  return {
    selector,
    accountId,
    isConnecting,
    error,
    connect,
    disconnect,
    detectWallets,
    isReady,
  }
}
