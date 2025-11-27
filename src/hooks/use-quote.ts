'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { PrivacyLevel, type Quote, type ChainId } from '@sip-protocol/sdk'
import { useSIP } from '@/contexts'
import { formatAmount, parseAmount, type NetworkId } from '@/lib'

export interface QuoteParams {
  fromChain: NetworkId
  toChain: NetworkId
  fromToken: string
  toToken: string
  amount: string
  privacyLevel: PrivacyLevel
}

export interface QuoteResult {
  /** The quote from the SDK */
  quote: Quote | null
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
 * Get mock exchange rate for demo purposes
 * Real rates would come from the 1Click API
 */
function getMockRate(fromToken: string, toToken: string): number {
  // Mock rates based on approximate market values
  const usdPrices: Record<string, number> = {
    SOL: 100,
    ETH: 3500,
    NEAR: 5,
    ZEC: 50,
    USDC: 1,
    WETH: 3500,
  }

  const fromPrice = usdPrices[fromToken] ?? 1
  const toPrice = usdPrices[toToken] ?? 1

  return fromPrice / toPrice
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
  const { client } = useSIP()
  const [quote, setQuote] = useState<Quote | null>(null)
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

      // Calculate minimum output amount based on mock rate (with 1% slippage)
      const mockRate = getMockRate(params.fromToken, params.toToken)
      const expectedOutput = parseFloat(params.amount) * mockRate
      const minOutput = expectedOutput * 0.99 // 1% slippage
      const minOutputBigInt = parseAmount(minOutput.toString(), toDecimals)

      // Create intent for quote
      const intent = await client.createIntent({
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
      })

      // Get quotes from SDK
      const quotes = await client.getQuotes(intent)

      if (quotes.length > 0) {
        setQuote(quotes[0])
      } else {
        setError('No quotes available')
      }
    } catch (err) {
      console.error('Quote fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch quote')
      setQuote(null)
    } finally {
      setIsLoading(false)
    }
  }, [client, params])

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

    // Fallback: estimate based on mock rates
    const mockRate = getMockRate(params.fromToken, params.toToken)
    const estimated = parseFloat(params.amount) * mockRate
    return estimated.toFixed(6).replace(/\.?0+$/, '')
  }, [params, quote])

  const rate = useMemo(() => {
    if (!params) return '0'
    // Always use mock rate for display (real rate would come from quote)
    const mockRate = getMockRate(params.fromToken, params.toToken)
    return mockRate.toFixed(6).replace(/\.?0+$/, '')
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

  return {
    quote,
    outputAmount,
    rate,
    feePercent,
    estimatedTime,
    isLoading,
    error,
    refresh: fetchQuote,
  }
}
