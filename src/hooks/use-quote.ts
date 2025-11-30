'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { PrivacyLevel, type Quote, type ChainId } from '@sip-protocol/types'

// ProductionQuote extends Quote with depositAddress for production mode
interface ProductionQuote extends Quote {
  depositAddress?: string
}

// Dynamically import SDK functions to avoid SSR issues with WASM
const loadSDK = () => import('@sip-protocol/sdk')
import { useSIP } from '@/contexts'
import { useWalletStore, toast } from '@/stores'
import { formatAmount, parseAmount, getExchangeRateSync, getUSDPrices, type NetworkId } from '@/lib'

export interface QuoteParams {
  fromChain: NetworkId
  toChain: NetworkId
  fromToken: string
  toToken: string
  amount: string
  privacyLevel: PrivacyLevel
}

export interface QuoteResult {
  /** The quote from the SDK (may include deposit address in production mode) */
  quote: Quote | ProductionQuote | null
  /** Formatted output amount */
  outputAmount: string
  /** Exchange rate (1 fromToken = X toToken) */
  rate: string
  /** Solver fee percentage */
  feePercent: string
  /** Estimated time in seconds */
  estimatedTime: number
  /** Whether quote is loading */
  isLoading: boolean
  /** Error message if any */
  error: string | null
  /** Deposit address (production mode only) */
  depositAddress: string | null
  /** Refresh the quote */
  refresh: () => Promise<void>
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
 * Hook for fetching swap quotes
 *
 * @example
 * ```tsx
 * const { quote, outputAmount, rate, isLoading, error } = useQuote({
 *   fromChain: 'solana',
 *   toChain: 'ethereum',
 *   fromToken: 'SOL',
 *   toToken: 'ETH',
 *   amount: '1.5',
 *   privacyLevel: PrivacyLevel.SHIELDED,
 * })
 * ```
 */
export function useQuote(params: QuoteParams | null): QuoteResult {
  const { client, isProductionMode } = useSIP()
  const { address } = useWalletStore()
  const [quote, setQuote] = useState<Quote | ProductionQuote | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuote = useCallback(async () => {
    if (!params || !params.amount || parseFloat(params.amount) <= 0) {
      setQuote(null)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const fromDecimals = TOKEN_DECIMALS[params.fromToken] ?? 18
      const toDecimals = TOKEN_DECIMALS[params.toToken] ?? 18
      const amountBigInt = parseAmount(params.amount, fromDecimals)

      // Calculate minimum output amount based on exchange rate (with 1% slippage)
      const exchangeRate = getExchangeRateSync(params.fromToken, params.toToken)
      const expectedOutput = parseFloat(params.amount) * exchangeRate
      const minOutput = expectedOutput * 0.99 // 1% slippage
      const minOutputBigInt = parseAmount(minOutput.toString(), toDecimals)

      // Load SDK for privacy-related functions
      const sdk = await loadSDK()

      // Generate viewing key for compliant mode
      let viewingKeyObj: { key: string; path: string; hash: string } | undefined
      if (params.privacyLevel === PrivacyLevel.COMPLIANT) {
        viewingKeyObj = sdk.generateViewingKey(`quote/${Date.now()}`)
      }

      // Generate stealth meta-address for shielded/compliant modes
      let recipientMetaAddress: string | undefined
      if (params.privacyLevel !== PrivacyLevel.TRANSPARENT) {
        const stealth = sdk.generateStealthMetaAddress(params.toChain as ChainId)
        recipientMetaAddress = stealth.metaAddress as unknown as string
        console.log('[useQuote] Generated stealth address:', recipientMetaAddress)
      }

      // Build CreateIntentParams (needed for both demo and production modes)
      const intentParams = {
        input: {
          asset: {
            chain: params.fromChain as ChainId,
            symbol: params.fromToken,
            address: null, // Native token
            decimals: fromDecimals,
          },
          amount: amountBigInt,
        },
        output: {
          asset: {
            chain: params.toChain as ChainId,
            symbol: params.toToken,
            address: null, // Native token
            decimals: toDecimals,
          },
          minAmount: minOutputBigInt,
          maxSlippage: 0.01, // 1%
        },
        privacy: params.privacyLevel,
        viewingKey: viewingKeyObj?.key as `0x${string}` | undefined,
      }

      // Get quotes from SDK
      // In production mode, this fetches from NEAR 1Click API
      // In demo mode, this returns mock quotes
      if (!client) {
        setError('SIP client not ready')
        return
      }
      console.log('[useQuote] Getting quotes with params:', intentParams, 'recipientMetaAddress:', recipientMetaAddress)
      // Note: recipientMetaAddress is passed as second argument, not inside intentParams
      const quotes = await client.getQuotes(intentParams, recipientMetaAddress)

      if (quotes.length > 0) {
        setQuote(quotes[0])
        if (isProductionMode && 'depositAddress' in quotes[0]) {
          console.log('[Quote] Production quote received with deposit address:', quotes[0].depositAddress)
        }
      } else {
        setError('No quotes available for this pair')
      }
    } catch (err) {
      console.error('Quote fetch error:', err)
      const errorMessage = getQuoteErrorMessage(err)
      setError(errorMessage)
      setQuote(null)

      // Only show toast for network/server errors, not for validation errors
      if (isNetworkError(err)) {
        toast.warning('Quote Unavailable', errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }, [client, isProductionMode, params, address])

  // Prefetch prices on mount for accurate rate display
  useEffect(() => {
    getUSDPrices().catch(() => {
      // Silent fail - will use fallback prices
    })
  }, [])

  // Fetch quote when params change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(fetchQuote, 500) // 500ms debounce
    return () => clearTimeout(timeoutId)
  }, [fetchQuote])

  // Calculate derived values
  const outputAmount = useMemo(() => {
    if (!params || !params.amount || parseFloat(params.amount) <= 0) {
      return '0'
    }

    if (quote?.outputAmount) {
      const toDecimals = TOKEN_DECIMALS[params.toToken] ?? 18
      return formatAmount(quote.outputAmount, toDecimals)
    }

    // Fallback: estimate based on exchange rates
    const exchangeRate = getExchangeRateSync(params.fromToken, params.toToken)
    const estimated = parseFloat(params.amount) * exchangeRate
    return estimated.toFixed(6).replace(/\.?0+$/, '')
  }, [params, quote])

  const rate = useMemo(() => {
    if (!params) return '0'
    // Use cached exchange rate (real-time from CoinGecko with fallback)
    const exchangeRate = getExchangeRateSync(params.fromToken, params.toToken)
    return exchangeRate.toFixed(6).replace(/\.?0+$/, '')
  }, [params])

  // Calculate fee percent from quote fee and output amount
  const feePercent = useMemo(() => {
    if (quote?.fee && quote?.outputAmount) {
      const feeRatio = Number(quote.fee) / Number(quote.outputAmount + quote.fee)
      return (feeRatio * 100).toFixed(2)
    }
    return '0.3' // Default fee
  }, [quote])

  const estimatedTime = quote?.estimatedTime ?? 60

  // Extract deposit address from production quotes
  const depositAddress = quote && 'depositAddress' in quote
    ? (quote as ProductionQuote).depositAddress ?? null
    : null

  return {
    quote,
    outputAmount,
    rate,
    feePercent,
    estimatedTime,
    isLoading,
    error,
    depositAddress,
    refresh: fetchQuote,
  }
}

/**
 * Parse quote-specific error messages
 */
function getQuoteErrorMessage(err: unknown): string {
  if (!(err instanceof Error)) return 'Failed to fetch quote'

  const message = err.message.toLowerCase()

  // Quote expired
  if (message.includes('expired') || message.includes('stale')) {
    return 'Quote expired. Please refresh'
  }

  // Insufficient liquidity
  if (message.includes('liquidity') || message.includes('insufficient')) {
    return 'Insufficient liquidity for this amount'
  }

  // Rate limit
  if (message.includes('rate limit') || message.includes('too many')) {
    return 'Too many requests. Please wait a moment'
  }

  // Network/timeout
  if (message.includes('network') || message.includes('timeout') || message.includes('fetch')) {
    return 'Network error. Please check your connection'
  }

  // Invalid pair
  if (message.includes('unsupported') || message.includes('invalid')) {
    return 'This trading pair is not supported'
  }

  // Amount too small/large
  if (message.includes('minimum') || message.includes('too small')) {
    return 'Amount is below minimum'
  }
  if (message.includes('maximum') || message.includes('too large')) {
    return 'Amount exceeds maximum'
  }

  return err.message || 'Failed to fetch quote'
}

/**
 * Check if error is a network-related error (worth showing toast)
 */
function isNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const message = err.message.toLowerCase()
  return (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    message.includes('rate limit')
  )
}
