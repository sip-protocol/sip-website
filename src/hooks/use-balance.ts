'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWalletStore, type ChainType } from '@/stores'
import { NETWORKS, formatAmount } from '@/lib'

interface UseBalanceOptions {
  /** SPL token mint address (Solana only). If provided, fetches token balance instead of native SOL */
  tokenMint?: string
  /** Token symbol to display */
  tokenSymbol?: string
  /** Token decimals (default: 6 for USDC, 9 for SOL) */
  tokenDecimals?: number
}

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
 * Supports both native tokens (SOL, ETH) and SPL tokens (USDC, etc.)
 */
export function useBalance(options?: UseBalanceOptions): UseBalanceResult {
  const { isConnected, address, chain } = useWalletStore()

  const [balance, setBalance] = useState<bigint | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tokenMint = options?.tokenMint
  const tokenSymbol = options?.tokenSymbol
  const tokenDecimals = options?.tokenDecimals

  const fetchBalance = useCallback(async () => {
    if (!isConnected || !address || !chain) {
      setBalance(null)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const rawBalance = await getBalanceForChain(address, chain, tokenMint)
      setBalance(rawBalance)
    } catch (err) {
      // Balance fetch failed - error handled via state
      setError(err instanceof Error ? err.message : 'Failed to fetch balance')
      setBalance(null)
    } finally {
      setIsLoading(false)
    }
  }, [isConnected, address, chain, tokenMint])

  // Fetch balance on mount and when wallet/token changes
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
  // Use token decimals if provided, otherwise use network default
  const decimals = tokenDecimals ?? network?.decimals ?? 18
  // Use token symbol if provided, otherwise use native token
  const symbol = tokenSymbol ?? network?.nativeToken ?? ''

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
async function getBalanceForChain(address: string, chain: ChainType, tokenMint?: string): Promise<bigint> {
  const network = NETWORKS[chain]

  switch (chain) {
    case 'solana':
      // If tokenMint is provided, fetch SPL token balance
      if (tokenMint) {
        return fetchSolanaTokenBalance(address, tokenMint, network.rpcEndpoint)
      }
      return fetchSolanaBalance(address, network.rpcEndpoint)
    case 'ethereum':
      return fetchEthereumBalance(address, network.rpcEndpoint)
    default:
      throw new Error(`Unsupported chain: ${chain}`)
  }
}

/**
 * Fetch Solana native balance via JSON-RPC
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
 * Fetch Solana SPL token balance via JSON-RPC
 * Uses getTokenAccountsByOwner to find token accounts for the given mint
 */
async function fetchSolanaTokenBalance(address: string, mint: string, rpcEndpoint: string): Promise<bigint> {
  const response = await fetch(rpcEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenAccountsByOwner',
      params: [
        address,
        { mint },
        { encoding: 'jsonParsed' },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Solana RPC error: ${response.status}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error.message || 'Solana RPC error')
  }

  // Sum balances from all token accounts for this mint
  const accounts = data.result?.value ?? []
  let totalBalance = 0n

  for (const account of accounts) {
    const tokenAmount = account.account?.data?.parsed?.info?.tokenAmount?.amount
    if (tokenAmount) {
      totalBalance += BigInt(tokenAmount)
    }
  }

  return totalBalance
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
