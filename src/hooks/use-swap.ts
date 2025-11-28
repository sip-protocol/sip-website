'use client'

import { useState, useCallback } from 'react'
import { PrivacyLevel, type Quote, type ChainId } from '@sip-protocol/sdk'
import { useSIP } from '@/contexts'
import { useWalletStore, toast } from '@/stores'
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
  /** Chain the transaction was submitted on */
  txChain: NetworkId | null
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
  const [txChain, setTxChain] = useState<NetworkId | null>(null)

  const reset = useCallback(() => {
    setStatus('idle')
    setTxHash(null)
    setError(null)
    setTxChain(null)
  }, [])

  const execute = useCallback(async (params: SwapParams) => {
    // Validate wallet connection
    if (!isConnected || !address) {
      const msg = 'Please connect your wallet first'
      setError(msg)
      setStatus('error')
      toast.warning('Wallet Required', msg)
      return
    }

    // Validate chain matches
    if (chain !== params.fromChain) {
      const networkName = params.fromChain === 'solana' ? 'Solana' : 'Ethereum'
      const msg = `Please switch to ${networkName} network`
      setError(msg)
      setStatus('error')
      toast.warning('Wrong Network', msg)
      return
    }

    // Validate quote
    if (!params.quote) {
      const msg = 'No quote available. Please refresh and try again'
      setError(msg)
      setStatus('error')
      toast.error('Quote Required', msg)
      return
    }

    try {
      setStatus('confirming')
      setError(null)
      setTxHash(null)
      setTxChain(params.fromChain)

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
        toast.success('Swap Submitted', 'Your transaction has been submitted to the network')
      } else if (params.privacyLevel !== PrivacyLevel.TRANSPARENT) {
        // Shielded mode: no public txHash is expected (privacy protection)
        setTxHash(null)
        setStatus('success')
        toast.success('Shielded Swap Complete', 'Your private transaction has been processed')
      } else {
        // Transparent mode without txHash: transaction may still be processing
        setTxHash(null)
        setStatus('success')
        toast.success('Swap Complete', 'Your transaction has been processed')
      }
    } catch (err) {
      console.error('Swap execution error:', err)
      const { message, toastTitle } = getSwapErrorMessage(err)
      setError(message)
      setStatus('error')
      toast.error(toastTitle, message)
    }
  }, [client, isConnected, address, chain])

  // Generate explorer URL based on the transaction chain
  const explorerUrl = txHash && txChain
    ? getTransactionUrl(txChain, txHash)
    : null

  return {
    txHash,
    explorerUrl,
    txChain,
    status,
    error,
    execute,
    reset,
  }
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

/**
 * Parse swap error messages into user-friendly format
 */
function getSwapErrorMessage(err: unknown): { message: string; toastTitle: string } {
  if (!(err instanceof Error)) {
    return { message: 'Transaction failed', toastTitle: 'Transaction Failed' }
  }

  const message = err.message.toLowerCase()

  // User rejected the transaction
  if (message.includes('rejected') || message.includes('denied') || message.includes('cancelled')) {
    return {
      message: 'You rejected the transaction in your wallet',
      toastTitle: 'Transaction Rejected',
    }
  }

  // Insufficient balance
  if (message.includes('insufficient') || message.includes('not enough')) {
    return {
      message: 'Insufficient balance for this transaction',
      toastTitle: 'Insufficient Balance',
    }
  }

  // Quote expired
  if (message.includes('expired') || message.includes('stale')) {
    return {
      message: 'Quote has expired. Please get a new quote',
      toastTitle: 'Quote Expired',
    }
  }

  // Slippage too high
  if (message.includes('slippage') || message.includes('price')) {
    return {
      message: 'Price moved too much. Try increasing slippage tolerance',
      toastTitle: 'Price Changed',
    }
  }

  // Network error
  if (message.includes('network') || message.includes('timeout') || message.includes('connection')) {
    return {
      message: 'Network error. Please check your connection and try again',
      toastTitle: 'Network Error',
    }
  }

  // Transaction failed on-chain
  if (message.includes('reverted') || message.includes('failed')) {
    return {
      message: 'Transaction failed on the network. Please try again',
      toastTitle: 'Transaction Failed',
    }
  }

  // Gas estimation failed
  if (message.includes('gas')) {
    return {
      message: 'Failed to estimate gas. The transaction may fail',
      toastTitle: 'Gas Error',
    }
  }

  // Nonce error
  if (message.includes('nonce')) {
    return {
      message: 'Transaction nonce error. Please refresh and try again',
      toastTitle: 'Nonce Error',
    }
  }

  // Default
  return {
    message: err.message || 'Transaction failed',
    toastTitle: 'Transaction Failed',
  }
}
