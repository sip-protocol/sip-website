'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { PrivacyLevel, type Quote, type ChainId } from '@sip-protocol/types'

// ProductionQuote extends Quote with depositAddress for production mode
interface ProductionQuote extends Quote {
  depositAddress?: string
}

// Dynamically import SDK functions to avoid SSR issues with WASM
const loadSDK = () => import('@sip-protocol/sdk')
import { useSIP } from '@/contexts'
import { useWalletStore, toast } from '@/stores'
import { formatAmount, parseAmount, getExchangeRateSync, getUSDPrices, logger, type NetworkId } from '@/lib'

export interface QuoteParams {
  fromChain: NetworkId
  toChain: NetworkId
  fromToken: string
  toToken: string
  amount: string
  privacyLevel: PrivacyLevel
}

/** Quote freshness status */
export type QuoteFreshness = 'fresh' | 'stale' | 'expired'

/** Auto-refresh configuration */
const QUOTE_FRESH_DURATION = 30_000 // 30 seconds - quote is fresh
const QUOTE_STALE_DURATION = 45_000 // 45 seconds - quote is stale but usable
const QUOTE_EXPIRY_DURATION = 60_000 // 60 seconds - quote is expired
const AUTO_REFRESH_INTERVAL = 25_000 // Refresh every 25 seconds to stay fresh

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
  /** Quote freshness status */
  freshness: QuoteFreshness
  /** Seconds until quote expires (for countdown display) */
  expiresIn: number | null
  /** Timestamp when quote was fetched */
  fetchedAt: number | null
  /** Whether auto-refresh is enabled */
  autoRefreshEnabled: boolean
  /** Toggle auto-refresh */
  setAutoRefresh: (enabled: boolean) => void
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
  const [fetchedAt, setFetchedAt] = useState<number | null>(null)
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const [freshness, setFreshness] = useState<QuoteFreshness>('fresh')
  const [expiresIn, setExpiresIn] = useState<number | null>(null)

  // Refs for intervals
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null)
  const freshnessIntervalRef = useRef<NodeJS.Timeout | null>(null)

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
        logger.debug('Stealth address generated', 'useQuote')
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
      logger.debug('Fetching quotes', 'useQuote')
      // Note: recipientMetaAddress is passed as second argument, not inside intentParams
      const quotes = await client.getQuotes(intentParams, recipientMetaAddress)

      if (quotes.length > 0) {
        setQuote(quotes[0])
        setFetchedAt(Date.now())
        setFreshness('fresh')
        setExpiresIn(Math.round(QUOTE_EXPIRY_DURATION / 1000))
        if (isProductionMode && 'depositAddress' in quotes[0]) {
          logger.debug('Production quote received with deposit address', 'Quote')
        }
      } else {
        setError('No quotes available for this pair')
        setFetchedAt(null)
        setFreshness('expired')
        setExpiresIn(null)
      }
    } catch (err) {
      logger.error('Quote fetch failed', err, 'useQuote')
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

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefreshEnabled || !params || !quote) {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current)
        autoRefreshRef.current = null
      }
      return
    }

    // Set up auto-refresh interval
    autoRefreshRef.current = setInterval(() => {
      if (!isLoading) {
        logger.debug('Auto-refreshing quote', 'useQuote')
        fetchQuote()
      }
    }, AUTO_REFRESH_INTERVAL)

    return () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current)
        autoRefreshRef.current = null
      }
    }
  }, [autoRefreshEnabled, params, quote, isLoading, fetchQuote])

  // Freshness tracking effect
  useEffect(() => {
    if (!fetchedAt || !quote) {
      setFreshness('expired')
      setExpiresIn(null)
      return
    }

    const updateFreshness = () => {
      const elapsed = Date.now() - fetchedAt
      const remaining = Math.max(0, Math.round((QUOTE_EXPIRY_DURATION - elapsed) / 1000))

      setExpiresIn(remaining)

      if (elapsed < QUOTE_FRESH_DURATION) {
        setFreshness('fresh')
      } else if (elapsed < QUOTE_STALE_DURATION) {
        setFreshness('stale')
      } else {
        setFreshness('expired')
      }
    }

    // Update immediately
    updateFreshness()

    // Update every second for countdown
    freshnessIntervalRef.current = setInterval(updateFreshness, 1000)

    return () => {
      if (freshnessIntervalRef.current) {
        clearInterval(freshnessIntervalRef.current)
        freshnessIntervalRef.current = null
      }
    }
  }, [fetchedAt, quote])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current)
      if (freshnessIntervalRef.current) clearInterval(freshnessIntervalRef.current)
    }
  }, [])

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
    freshness,
    expiresIn,
    fetchedAt,
    autoRefreshEnabled,
    setAutoRefresh: setAutoRefreshEnabled,
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
