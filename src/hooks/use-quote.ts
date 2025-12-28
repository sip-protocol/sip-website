'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { PrivacyLevel, type Quote, type ChainId } from '@sip-protocol/types'

// ProductionQuote extends Quote with depositAddress for production mode
interface ProductionQuote extends Quote {
  depositAddress?: string
}

import { useSIP } from '@/contexts'
import { useWalletStore, toast } from '@/stores'
import { formatAmount, parseAmount, getExchangeRateSync, getUSDPrices, logger, getSDK, type NetworkId } from '@/lib'

export interface QuoteParams {
  fromChain: NetworkId
  toChain: NetworkId
  fromToken: string
  toToken: string
  amount: string
  privacyLevel: PrivacyLevel
  /** Destination address where funds will be sent (required for all non-ZEC swaps) */
  destinationAddress?: string
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
  // New tokens
  BTC: 8,
  ARB: 18,
  BASE: 18,
  OP: 18,
  POL: 18,
  BNB: 18,
  AVAX: 18,
  APT: 8,
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
  const { address, chain: connectedChain } = useWalletStore()
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

      // Load SDK for privacy-related functions (cached singleton)
      const sdk = await getSDK()

      // Generate viewing key for compliant mode
      let viewingKeyObj: { key: string; path: string; hash: string } | undefined
      if (params.privacyLevel === PrivacyLevel.COMPLIANT) {
        viewingKeyObj = sdk.generateViewingKey(`quote/${Date.now()}`)
      }

      // Generate stealth meta-address for shielded/compliant modes
      // Use appropriate curve based on target chain (ed25519 for Solana/NEAR, secp256k1 for EVM)
      // NOTE: Skip stealth address generation for Zcash - it uses its own z-address format
      // NOTE: When explicit destinationAddress is provided, use TRANSPARENT mode for API
      //       but privacy features still work on sender side (Pedersen commitments, etc.)
      //       This is "sender-shielded" mode - sender privacy, explicit recipient
      let recipientMetaAddress: string | undefined
      let refundStealthAddress: string | undefined // For cross-curve swaps
      const isZcashDestination = params.toChain === 'zcash'
      const hasExplicitDestination = !!params.destinationAddress

      // For API calls: use TRANSPARENT when destination provided (SDK requires stealth for shielded)
      // Privacy UI elements (commitments, etc.) still work client-side
      const effectivePrivacyLevel = hasExplicitDestination ? PrivacyLevel.TRANSPARENT : params.privacyLevel

      if (effectivePrivacyLevel !== PrivacyLevel.TRANSPARENT && !isZcashDestination) {
        const isOutputEd25519 = sdk.isEd25519Chain(params.toChain as ChainId)
        const isInputEd25519 = sdk.isEd25519Chain(params.fromChain as ChainId)

        // Generate recipient stealth for output chain
        const recipientStealth = isOutputEd25519
          ? sdk.generateEd25519StealthMetaAddress(params.toChain as ChainId)
          : sdk.generateStealthMetaAddress(params.toChain as ChainId)
        recipientMetaAddress = recipientStealth.metaAddress as unknown as string
        logger.debug(`Stealth address generated (${isOutputEd25519 ? 'ed25519' : 'secp256k1'})`, 'useQuote')

        // For cross-curve swaps (e.g., ETH→SOL), generate a separate refund stealth address
        // for the input chain curve since we can't derive it from the output meta-address
        if (isOutputEd25519 !== isInputEd25519) {
          const refundMetaObj = isInputEd25519
            ? sdk.generateEd25519StealthMetaAddress(params.fromChain as ChainId)
            : sdk.generateStealthMetaAddress(params.fromChain as ChainId)
          // Generate the actual stealth address (not just meta-address)
          const refundStealth = isInputEd25519
            ? sdk.generateEd25519StealthAddress(refundMetaObj.metaAddress)
            : sdk.generateStealthAddress(refundMetaObj.metaAddress)
          const rawStealthAddress = refundStealth.stealthAddress?.address as string | undefined

          // Convert stealth public key to chain-specific address format
          if (rawStealthAddress) {
            const hexAddress = rawStealthAddress as `0x${string}`
            if (isInputEd25519) {
              // For Solana/NEAR, convert ed25519 public key to chain address
              if (params.fromChain === 'solana') {
                refundStealthAddress = sdk.ed25519PublicKeyToSolanaAddress(hexAddress)
              } else if (params.fromChain === 'near') {
                refundStealthAddress = sdk.ed25519PublicKeyToNearAddress(hexAddress)
              }
            } else {
              // For EVM chains, convert secp256k1 public key to Ethereum address
              refundStealthAddress = sdk.publicKeyToEthAddress(hexAddress)
            }
            logger.debug(`Cross-curve: refund stealth generated (${isInputEd25519 ? 'ed25519' : 'secp256k1'}): ${refundStealthAddress?.slice(0, 10)}...`, 'useQuote')
          }
        }
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
        privacy: effectivePrivacyLevel, // Use effective level (TRANSPARENT when destination provided)
        viewingKey: viewingKeyObj?.key as `0x${string}` | undefined,
      }

      if (hasExplicitDestination && params.privacyLevel !== PrivacyLevel.TRANSPARENT) {
        logger.debug(`Sender-shielded mode: using TRANSPARENT for API, destination=${params.destinationAddress?.slice(0, 10)}...`, 'useQuote')
      }

      // Get quotes from SDK
      // In production mode, this fetches from NEAR 1Click API
      // In demo mode, this returns mock quotes
      if (!client) {
        setError('SIP client not ready')
        return
      }
      logger.debug('Fetching quotes', 'useQuote')

      // For Zcash destinations, create a mock quote based on exchange rates
      // since Zcash uses z-addresses (not stealth addresses)
      if (isZcashDestination) {
        const exchangeRate = getExchangeRateSync(params.fromToken, params.toToken)
        const outputAmount = BigInt(Math.floor(parseFloat(params.amount) * exchangeRate * (10 ** toDecimals)))
        const mockQuote: Quote = {
          quoteId: `zcash-${Date.now()}`,
          intentId: '',
          solverId: 'zcash-native',
          outputAmount,
          fee: outputAmount / 100n, // 1% fee estimate
          estimatedTime: 60, // 1 minute estimate for Zcash
          expiry: Date.now() + QUOTE_EXPIRY_DURATION,
        }
        setQuote(mockQuote)
        setFetchedAt(Date.now())
        setFreshness('fresh')
        setExpiresIn(Math.round(QUOTE_EXPIRY_DURATION / 1000))
        logger.debug('Zcash quote generated from exchange rate', 'Quote')
        return
      }

      // For Solana same-chain privacy (SOL → SOL or SPL token same-chain)
      // Use direct transfer instead of cross-chain routing
      const isSolanaToSolana = params.fromChain === 'solana' && params.toChain === 'solana'
      const isSameToken = params.fromToken === params.toToken
      const canUseSameChain = isSolanaToSolana && isSameToken && effectivePrivacyLevel !== PrivacyLevel.TRANSPARENT

      if (canUseSameChain) {
        // Same-chain: 1:1 rate minus ~0.000005 SOL gas fee
        // For SPL tokens, gas is paid in SOL separately
        const estimatedGasSol = 0.000005 // ~5000 lamports
        const outputAmount = amountBigInt // Same amount (1:1)
        const sameChainQuote: Quote & { type: 'same-chain' } = {
          quoteId: `same-chain-${Date.now()}`,
          intentId: `sip-same-chain-${Date.now()}`,
          solverId: 'sip-same-chain',
          outputAmount,
          fee: BigInt(Math.floor(estimatedGasSol * 1e9)), // Gas fee in lamports
          estimatedTime: 5, // ~5 seconds for Solana confirmation
          expiry: Date.now() + QUOTE_EXPIRY_DURATION,
          type: 'same-chain', // Mark as same-chain for execution routing
        }
        setQuote(sameChainQuote)
        setFetchedAt(Date.now())
        setFreshness('fresh')
        setExpiresIn(null) // Same-chain quotes don't expire
        logger.debug('Solana same-chain quote generated', 'Quote')
        return
      }

      // Note: recipientMetaAddress as 2nd arg, senderAddress as 3rd arg for refunds
      // Priority:
      // 1. If wallet connected and chain matches input → use wallet address for refunds
      // 2. Else if cross-curve swap → use generated stealth address for refunds
      // 3. Otherwise → let SDK generate from recipient meta-address (same curve)
      let refundAddress: string | undefined
      if (address && connectedChain === params.fromChain) {
        refundAddress = address
        logger.debug('Using connected wallet for refunds', 'useQuote')
      } else if (refundStealthAddress) {
        refundAddress = refundStealthAddress
        logger.debug('Using stealth address for cross-curve refunds', 'useQuote')
      }
      // Pass destinationAddress for ALL modes - this is where funds will be sent
      // SDK signature: getQuotes(params, recipientMetaAddress?, senderAddress?, transparentRecipient?)
      // Even in shielded mode, we need to tell 1Click API where to send the funds
      // The "privacy" is on the sender side (hidden identity), recipient is always explicit
      const recipientAddress = params.destinationAddress || undefined
      const quotes = await client.getQuotes(intentParams, recipientMetaAddress, refundAddress, recipientAddress)

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
  }, [client, isProductionMode, params, address, connectedChain])

  // Prefetch prices on mount for accurate rate display
  useEffect(() => {
    getUSDPrices().catch((err) => {
      // Expected failure: Network issue or API down - fallback prices will be used
      logger.debug('Price prefetch failed, using fallback prices', 'useQuote')
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
