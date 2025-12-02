'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Zcash RPC connection state and data hook
 *
 * Connects to the backend API proxy to interact with zcashd.
 * Falls back to demo mode when RPC is not configured.
 */

export interface ZcashBalance {
  pools: {
    transparent: { valueZat: number }
    sapling: { valueZat: number }
    orchard: { valueZat: number }
  }
}

export interface ZcashAddress {
  account: number
  address: string
  diversifier_index: number
}

export interface ZcashConnectionStatus {
  configured: boolean
  connected: boolean
  testnet?: boolean
  blockHeight?: number
  chain?: string
  error?: string
}

interface UseZcashRpcReturn {
  // Connection state
  status: ZcashConnectionStatus | null
  isLoading: boolean
  isDemoMode: boolean

  // Data
  balance: ZcashBalance | null
  balanceZec: {
    transparent: number
    sapling: number
    orchard: number
    total: number
  } | null
  address: ZcashAddress | null

  // Actions
  checkConnection: () => Promise<ZcashConnectionStatus | null>
  fetchBalance: (account?: number) => Promise<ZcashBalance | null>
  generateAddress: (account?: number) => Promise<ZcashAddress | null>
  refreshAll: () => Promise<void>
}

// Convert zatoshi to ZEC
function zatToZec(zat: number): number {
  return zat / 100_000_000
}

export function useZcashRpc(): UseZcashRpcReturn {
  const [status, setStatus] = useState<ZcashConnectionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [balance, setBalance] = useState<ZcashBalance | null>(null)
  const [address, setAddress] = useState<ZcashAddress | null>(null)

  // Check if RPC is configured and connected
  const checkConnection = useCallback(async () => {
    try {
      const response = await fetch('/api/zcash')
      const data = await response.json() as ZcashConnectionStatus
      setStatus(data)
      return data
    } catch {
      setStatus({ configured: false, connected: false, error: 'API unavailable' })
      return null
    }
  }, [])

  // Fetch balance for an account
  const fetchBalance = useCallback(async (account: number = 0): Promise<ZcashBalance | null> => {
    try {
      const response = await fetch('/api/zcash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'getbalance', params: [account] }),
      })

      if (!response.ok) return null

      const data = await response.json()
      if (data.error) return null

      const bal = data.result as ZcashBalance
      setBalance(bal)
      return bal
    } catch {
      return null
    }
  }, [])

  // Generate a new address for an account
  const generateAddress = useCallback(async (account: number = 0): Promise<ZcashAddress | null> => {
    try {
      const response = await fetch('/api/zcash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'getaddress', params: [account] }),
      })

      if (!response.ok) return null

      const data = await response.json()
      if (data.error) return null

      const addr = data.result as ZcashAddress
      setAddress(addr)
      return addr
    } catch {
      return null
    }
  }, [])

  // Refresh all data
  const refreshAll = useCallback(async () => {
    setIsLoading(true)
    const connectionStatus = await checkConnection()

    if (connectionStatus?.connected) {
      await Promise.all([
        fetchBalance(),
        generateAddress(),
      ])
    }

    setIsLoading(false)
  }, [checkConnection, fetchBalance, generateAddress])

  // Initial connection check on mount
  useEffect(() => {
    refreshAll()
  }, [refreshAll])

  // Computed values
  const isDemoMode = !status?.connected
  const balanceZec = balance ? {
    transparent: zatToZec(balance.pools.transparent?.valueZat ?? 0),
    sapling: zatToZec(balance.pools.sapling?.valueZat ?? 0),
    orchard: zatToZec(balance.pools.orchard?.valueZat ?? 0),
    total: zatToZec(
      (balance.pools.transparent?.valueZat ?? 0) +
      (balance.pools.sapling?.valueZat ?? 0) +
      (balance.pools.orchard?.valueZat ?? 0)
    ),
  } : null

  return {
    status,
    isLoading,
    isDemoMode,
    balance,
    balanceZec,
    address,
    checkConnection,
    fetchBalance,
    generateAddress,
    refreshAll,
  }
}
