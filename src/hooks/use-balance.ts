'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWalletStore, type ChainType } from '@/stores'
import { NETWORKS, formatAmount } from '@/lib'

interface UseBalanceResult {
  /** Raw balance in smallest units (lamports, wei) */
  balance: bigint | null
  /** Formatted balance string for display */
  formatted: string
  /** Token symbol */
  symbol: string
  /** Loading state */
  isLoading: boolean
  /** Error message if fetch failed */
  error: string | null
  /** Refresh balance manually */
  refresh: () => Promise<void>
}

/**
 * Hook to fetch and display wallet balance for the connected chain
 */
export function useBalance(): UseBalanceResult {
  const { isConnected, address, chain } = useWalletStore()

  const [balance, setBalance] = useState<bigint | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    if (!isConnected || !address || !chain) {
      setBalance(null)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const rawBalance = await getBalanceForChain(address, chain)
      setBalance(rawBalance)
    } catch (err) {
      console.error('Failed to fetch balance:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch balance')
      setBalance(null)
    } finally {
      setIsLoading(false)
    }
  }, [isConnected, address, chain])

  // Fetch balance on mount and when wallet changes
  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  // Auto-refresh balance every 30 seconds when connected
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(fetchBalance, 30000)
    return () => clearInterval(interval)
  }, [isConnected, fetchBalance])

  // Get network config for formatting
  const network = chain ? NETWORKS[chain] : null
  const decimals = network?.decimals ?? 18
  const symbol = network?.nativeToken ?? ''

  // Format balance for display
  const formatted = balance !== null ? formatAmount(balance, decimals, 4) : '0'

  return {
    balance,
    formatted,
    symbol,
    isLoading,
    error,
    refresh: fetchBalance,
  }
}

/**
 * Fetch balance from the appropriate chain RPC
 */
async function getBalanceForChain(address: string, chain: ChainType): Promise<bigint> {
  const network = NETWORKS[chain]

  switch (chain) {
    case 'solana':
      return fetchSolanaBalance(address, network.rpcEndpoint)
    case 'ethereum':
      return fetchEthereumBalance(address, network.rpcEndpoint)
    default:
      throw new Error(`Unsupported chain: ${chain}`)
  }
}

/**
 * Fetch Solana balance via JSON-RPC
 */
async function fetchSolanaBalance(address: string, rpcEndpoint: string): Promise<bigint> {
  const response = await fetch(rpcEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [address],
    }),
  })

  if (!response.ok) {
    throw new Error(`Solana RPC error: ${response.status}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error.message || 'Solana RPC error')
  }

  // Balance is in lamports (1 SOL = 10^9 lamports)
  return BigInt(data.result?.value ?? 0)
}

/**
 * Fetch Ethereum balance via JSON-RPC
 */
async function fetchEthereumBalance(address: string, rpcEndpoint: string): Promise<bigint> {
  const response = await fetch(rpcEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBalance',
      params: [address, 'latest'],
    }),
  })

  if (!response.ok) {
    throw new Error(`Ethereum RPC error: ${response.status}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error.message || 'Ethereum RPC error')
  }

  // Balance is in wei (hex string), 1 ETH = 10^18 wei
  const hexBalance = data.result ?? '0x0'
  return BigInt(hexBalance)
}
