/**
 * Price Service
 *
 * Fetches real-time cryptocurrency prices from CoinGecko.
 * Includes caching with TTL and fallback to hardcoded prices.
 */

// CoinGecko ID mapping for supported tokens
const COINGECKO_IDS: Record<string, string> = {
  SOL: 'solana',
  ETH: 'ethereum',
  NEAR: 'near',
  ZEC: 'zcash',
  USDC: 'usd-coin',
  WETH: 'ethereum', // WETH tracks ETH price
  // New chains
  BTC: 'bitcoin',
  ARB: 'arbitrum', // ARB token (network uses ETH)
  BASE: 'ethereum', // Base uses ETH
  OP: 'optimism', // OP token (network uses ETH)
  POL: 'matic-network', // Polygon (formerly MATIC)
  BNB: 'binancecoin',
  AVAX: 'avalanche-2',
  APT: 'aptos',
}

// Fallback prices (last known approximate values as of Dec 2025)
const FALLBACK_PRICES: Record<string, number> = {
  SOL: 230,
  ETH: 3600,
  NEAR: 6,
  ZEC: 60,
  USDC: 1,
  WETH: 3600,
  // New tokens
  BTC: 97000,
  ARB: 1,
  BASE: 3600, // Uses ETH
  OP: 2.5,
  POL: 0.6,
  BNB: 650,
  AVAX: 45,
  APT: 14,
}

// Cache configuration
const CACHE_TTL_MS = 60_000 // 60 seconds
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price'

interface PriceCache {
  prices: Record<string, number>
  timestamp: number
}

let priceCache: PriceCache | null = null
let fetchPromise: Promise<Record<string, number>> | null = null

/**
 * Get USD prices for all supported tokens
 * Uses caching to avoid excessive API calls
 */
export async function getUSDPrices(): Promise<Record<string, number>> {
  // Return cached prices if still valid
  if (priceCache && Date.now() - priceCache.timestamp < CACHE_TTL_MS) {
    return priceCache.prices
  }

  // If a fetch is already in progress, wait for it
  if (fetchPromise) {
    return fetchPromise
  }

  // Start new fetch
  fetchPromise = fetchPricesFromAPI()

  try {
    const prices = await fetchPromise
    return prices
  } finally {
    fetchPromise = null
  }
}

/**
 * Get exchange rate between two tokens
 */
export async function getExchangeRate(fromToken: string, toToken: string): Promise<number> {
  const prices = await getUSDPrices()

  const fromPrice = prices[fromToken] ?? FALLBACK_PRICES[fromToken] ?? 1
  const toPrice = prices[toToken] ?? FALLBACK_PRICES[toToken] ?? 1

  return fromPrice / toPrice
}

/**
 * Get exchange rate synchronously using cached data
 * Falls back to hardcoded prices if cache is empty
 */
export function getExchangeRateSync(fromToken: string, toToken: string): number {
  const prices = priceCache?.prices ?? FALLBACK_PRICES

  const fromPrice = prices[fromToken] ?? FALLBACK_PRICES[fromToken] ?? 1
  const toPrice = prices[toToken] ?? FALLBACK_PRICES[toToken] ?? 1

  return fromPrice / toPrice
}

/**
 * Check if price cache is fresh
 */
export function isCacheFresh(): boolean {
  return priceCache !== null && Date.now() - priceCache.timestamp < CACHE_TTL_MS
}

/**
 * Force refresh prices (bypasses cache)
 */
export async function refreshPrices(): Promise<Record<string, number>> {
  priceCache = null
  return getUSDPrices()
}

/**
 * Fetch prices from CoinGecko API
 */
async function fetchPricesFromAPI(): Promise<Record<string, number>> {
  try {
    const coinIds = [...new Set(Object.values(COINGECKO_IDS))].join(',')
    const url = `${COINGECKO_API}?ids=${coinIds}&vs_currencies=usd`

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      // CoinGecko free API has rate limits, use cache-first strategy
      cache: 'no-store',
    })

    if (!response.ok) {
      // Handle rate limiting (429) gracefully - use fallback prices
      if (response.status === 429) {
        return getCachedOrFallbackPrices()
      }
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    // Map CoinGecko response to token symbols
    const prices: Record<string, number> = {}

    for (const [symbol, coinId] of Object.entries(COINGECKO_IDS)) {
      const coinData = data[coinId]
      if (coinData?.usd) {
        prices[symbol] = coinData.usd
      } else {
        // Use fallback if specific coin not found
        prices[symbol] = FALLBACK_PRICES[symbol] ?? 1
      }
    }

    // Update cache
    priceCache = {
      prices,
      timestamp: Date.now(),
    }

    return prices
  } catch (err) {
    // Expected failure: Network error or API rate limit - use cached or fallback prices
    console.debug('[Prices] Fetch failed, using cache/fallback:', err instanceof Error ? err.message : 'Unknown error')
    return getCachedOrFallbackPrices()
  }
}

/**
 * Get cached prices or fallback if no cache exists
 */
function getCachedOrFallbackPrices(): Record<string, number> {
  if (priceCache) {
    // Return stale cache rather than nothing
    return priceCache.prices
  }
  return { ...FALLBACK_PRICES }
}

/**
 * Clear price cache (useful for testing)
 */
export function clearPriceCache(): void {
  priceCache = null
  fetchPromise = null
}
