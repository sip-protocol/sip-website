import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getUSDPrices,
  getExchangeRate,
  getExchangeRateSync,
  isCacheFresh,
  refreshPrices,
  clearPriceCache,
} from '@/lib/prices'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Price Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearPriceCache()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const mockCoinGeckoResponse = {
    solana: { usd: 150 },
    ethereum: { usd: 4000 },
    near: { usd: 6 },
    zcash: { usd: 60 },
    'usd-coin': { usd: 1 },
  }

  describe('getUSDPrices', () => {
    it('should fetch prices from CoinGecko API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCoinGeckoResponse,
      })

      const prices = await getUSDPrices()

      expect(mockFetch).toHaveBeenCalledOnce()
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('api.coingecko.com'),
        expect.any(Object)
      )
      expect(prices.SOL).toBe(150)
      expect(prices.ETH).toBe(4000)
      expect(prices.NEAR).toBe(6)
      expect(prices.ZEC).toBe(60)
      expect(prices.USDC).toBe(1)
    })

    it('should cache prices and not refetch within TTL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCoinGeckoResponse,
      })

      // First call
      await getUSDPrices()
      expect(mockFetch).toHaveBeenCalledOnce()

      // Second call should use cache
      await getUSDPrices()
      expect(mockFetch).toHaveBeenCalledOnce() // Still 1 call
    })

    it('should refetch after cache expires', async () => {
      vi.useFakeTimers()

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockCoinGeckoResponse,
      })

      // First call
      await getUSDPrices()
      expect(mockFetch).toHaveBeenCalledOnce()

      // Advance time past TTL (60 seconds)
      vi.advanceTimersByTime(61_000)

      // Second call should refetch
      await getUSDPrices()
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('should return fallback prices on API error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const prices = await getUSDPrices()

      // Should return fallback prices (updated Dec 2025)
      expect(prices.SOL).toBe(230)
      expect(prices.ETH).toBe(3600)
      expect(prices.NEAR).toBe(6)
    })

    it('should handle rate limiting (429) gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
      })

      const prices = await getUSDPrices()

      // Should return fallback prices without throwing (updated Dec 2025)
      expect(prices.SOL).toBe(230)
      expect(prices.ETH).toBe(3600)
    })

    it('should handle non-OK response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const prices = await getUSDPrices()

      // Should return fallback prices (updated Dec 2025)
      expect(prices.SOL).toBe(230)
    })

    it('should dedupe concurrent requests', async () => {
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => mockCoinGeckoResponse,
                }),
              100
            )
          )
      )

      // Make multiple concurrent calls
      const [result1, result2, result3] = await Promise.all([
        getUSDPrices(),
        getUSDPrices(),
        getUSDPrices(),
      ])

      // Should only have made one fetch call
      expect(mockFetch).toHaveBeenCalledOnce()

      // All results should be the same
      expect(result1).toEqual(result2)
      expect(result2).toEqual(result3)
    })
  })

  describe('getExchangeRate', () => {
    it('should calculate exchange rate between tokens', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCoinGeckoResponse,
      })

      const rate = await getExchangeRate('SOL', 'ETH')

      // SOL: 150, ETH: 4000
      // 150 / 4000 = 0.0375
      expect(rate).toBeCloseTo(0.0375)
    })

    it('should handle same token (rate = 1)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCoinGeckoResponse,
      })

      const rate = await getExchangeRate('ETH', 'ETH')

      expect(rate).toBe(1)
    })

    it('should handle USDC as quote (USD value)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCoinGeckoResponse,
      })

      const rate = await getExchangeRate('SOL', 'USDC')

      // SOL: 150, USDC: 1
      // 150 / 1 = 150
      expect(rate).toBe(150)
    })
  })

  describe('getExchangeRateSync', () => {
    it('should return fallback rate when cache is empty', () => {
      const rate = getExchangeRateSync('SOL', 'ETH')

      // Fallback (Dec 2025): SOL: 230, ETH: 3600
      // 230 / 3600 ≈ 0.0639
      expect(rate).toBeCloseTo(230 / 3600, 4)
    })

    it('should use cached prices when available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCoinGeckoResponse,
      })

      // Populate cache
      await getUSDPrices()

      const rate = getExchangeRateSync('SOL', 'ETH')

      // Cached: SOL: 150, ETH: 4000
      expect(rate).toBeCloseTo(0.0375)
    })

    it('should handle unknown tokens with fallback to 1', () => {
      const rate = getExchangeRateSync('UNKNOWN', 'ETH')

      // UNKNOWN: 1 (fallback), ETH: 3600 (Dec 2025)
      expect(rate).toBeCloseTo(1 / 3600, 6)
    })
  })

  describe('isCacheFresh', () => {
    it('should return false when cache is empty', () => {
      expect(isCacheFresh()).toBe(false)
    })

    it('should return true after successful fetch', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCoinGeckoResponse,
      })

      await getUSDPrices()

      expect(isCacheFresh()).toBe(true)
    })

    it('should return false after cache expires', async () => {
      vi.useFakeTimers()

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCoinGeckoResponse,
      })

      await getUSDPrices()
      expect(isCacheFresh()).toBe(true)

      // Advance past TTL
      vi.advanceTimersByTime(61_000)

      expect(isCacheFresh()).toBe(false)
    })
  })

  describe('refreshPrices', () => {
    it('should bypass cache and fetch fresh prices', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockCoinGeckoResponse,
      })

      // First fetch
      await getUSDPrices()
      expect(mockFetch).toHaveBeenCalledOnce()

      // Force refresh should make another call
      await refreshPrices()
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('clearPriceCache', () => {
    it('should clear the cache', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCoinGeckoResponse,
      })

      await getUSDPrices()
      expect(isCacheFresh()).toBe(true)

      clearPriceCache()
      expect(isCacheFresh()).toBe(false)
    })
  })
})
