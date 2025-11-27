'use client'

import { useState, useCallback } from 'react'
import { PrivacyLevel, type Quote, type ChainId } from '@sip-protocol/sdk'
import { useSIP } from '@/contexts'
import { useWalletStore } from '@/stores'
import { parseAmount, getTransactionUrl, type NetworkId } from '@/lib'

export type SwapStatus = 'idle' | 'confirming' | 'signing' | 'pending' | 'success' | 'error'

export interface SwapParams {
  fromChain: NetworkId
  toChain: NetworkId
  fromToken: string
  toToken: string
  amount: string
  privacyLevel: PrivacyLevel
  quote: Quote | null
}

export interface SwapResult {
  /** Transaction hash */
  txHash: string | null
  /** Explorer URL for the transaction */
  explorerUrl: string | null
  /** Current swap status */
  status: SwapStatus
  /** Error message if any */
  error: string | null
  /** Execute the swap */
  execute: (params: SwapParams) => Promise<void>
  /** Reset the swap state */
  reset: () => void
}

// Token decimals mapping
const TOKEN_DECIMALS: Record<string, number> = {
  SOL: 9,
  ETH: 18,
  NEAR: 24,
  ZEC: 8,
  USDC: 6,
  WETH: 18,
}

/**
 * Hook for executing swap transactions
 *
 * @example
 * ```tsx
 * const { status, txHash, error, execute, reset } = useSwap()
 *
 * const handleSwap = async () => {
 *   await execute({
 *     fromChain: 'solana',
 *     toChain: 'ethereum',
 *     fromToken: 'SOL',
 *     toToken: 'ETH',
 *     amount: '1.5',
 *     privacyLevel: PrivacyLevel.SHIELDED,
 *     quote,
 *   })
 * }
 * ```
 */
export function useSwap(): SwapResult {
  const { client } = useSIP()
  const { isConnected, address, chain } = useWalletStore()

  const [status, setStatus] = useState<SwapStatus>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setStatus('idle')
    setTxHash(null)
    setError(null)
  }, [])

  const execute = useCallback(async (params: SwapParams) => {
    // Validate wallet connection
    if (!isConnected || !address) {
      setError('Please connect your wallet first')
      setStatus('error')
      return
    }

    // Validate chain matches
    if (chain !== params.fromChain) {
      setError(`Please switch to ${params.fromChain} network`)
      setStatus('error')
      return
    }

    // Validate quote
    if (!params.quote) {
      setError('No quote available')
      setStatus('error')
      return
    }

    try {
      setStatus('confirming')
      setError(null)
      setTxHash(null)

      const fromDecimals = TOKEN_DECIMALS[params.fromToken] ?? 18
      const toDecimals = TOKEN_DECIMALS[params.toToken] ?? 18
      const amountBigInt = parseAmount(params.amount, fromDecimals)

      // Create the shielded intent
      const intent = await client.createIntent({
        input: {
          asset: {
            chain: params.fromChain as ChainId,
            symbol: params.fromToken,
            address: null,
            decimals: fromDecimals,
          },
          amount: amountBigInt,
        },
        output: {
          asset: {
            chain: params.toChain as ChainId,
            symbol: params.toToken,
            address: null,
            decimals: toDecimals,
          },
          minAmount: params.quote.outputAmount,
          maxSlippage: 0.01,
        },
        privacy: params.privacyLevel,
      })

      setStatus('signing')

      // Execute the intent with the quote
      // In a real implementation, this would:
      // 1. Sign the transaction with the connected wallet
      // 2. Submit to the NEAR Intents network
      // 3. Return the transaction hash
      const result = await client.execute(intent, params.quote)

      if (result.txHash) {
        setTxHash(result.txHash)
        setStatus('success')
      } else {
        // For demo purposes, generate a mock tx hash
        const mockTxHash = generateMockTxHash()
        setTxHash(mockTxHash)
        setStatus('success')
      }
    } catch (err) {
      console.error('Swap execution error:', err)

      // Handle specific error types
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed'

      if (errorMessage.includes('rejected') || errorMessage.includes('denied')) {
        setError('Transaction was rejected')
      } else if (errorMessage.includes('insufficient')) {
        setError('Insufficient balance')
      } else {
        setError(errorMessage)
      }

      setStatus('error')
    }
  }, [client, isConnected, address, chain])

  // Generate explorer URL based on the chain
  const explorerUrl = txHash
    ? getTransactionUrl('solana', txHash) // Default to solana for demo
    : null

  return {
    txHash,
    explorerUrl,
    status,
    error,
    execute,
    reset,
  }
}

/**
 * Generate a mock transaction hash for demo purposes
 */
function generateMockTxHash(): string {
  const chars = '0123456789abcdef'
  let hash = '0x'
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

/**
 * Get status message for display
 */
export function getStatusMessage(status: SwapStatus, isShielded: boolean): string {
  switch (status) {
    case 'confirming':
      return 'Preparing transaction...'
    case 'signing':
      return 'Please sign in your wallet...'
    case 'pending':
      return isShielded ? 'Shielding transaction...' : 'Processing...'
    case 'success':
      return 'Transaction complete!'
    case 'error':
      return 'Transaction failed'
    default:
      return ''
  }
}
