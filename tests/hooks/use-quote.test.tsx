import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { PrivacyLevel } from '@sip-protocol/sdk'

// Mock the SIP context
const mockClient = {
  createIntent: vi.fn(),
  getQuotes: vi.fn(),
}

vi.mock('@/contexts', () => ({
  useSIP: () => ({ client: mockClient, isProductionMode: false }),
}))

vi.mock('@/stores', () => ({
  useWalletStore: () => ({
    address: '0x1234567890abcdef1234567890abcdef12345678',
  }),
  toast: {
    warning: vi.fn(),
  },
}))

// Import after mocking
import { useQuote, type QuoteParams } from '@/hooks/use-quote'

describe('useQuote', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementations
    mockClient.createIntent.mockResolvedValue({ id: 'test-intent' })
    mockClient.getQuotes.mockResolvedValue([
      {
        id: 'quote-1',
        outputAmount: 100000000n,
        fee: 1000000n,
        estimatedTime: 30,
      },
    ])
  })

  const defaultParams: QuoteParams = {
    fromChain: 'solana',
    toChain: 'ethereum',
    fromToken: 'SOL',
    toToken: 'ETH',
    amount: '1.5',
    privacyLevel: PrivacyLevel.SHIELDED,
  }

  it('should return initial state with null params', () => {
    const { result } = renderHook(() => useQuote(null))

    expect(result.current.quote).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.outputAmount).toBe('0') // Returns '0' when no params
    expect(result.current.rate).toBe('0')
  })

  it('should fetch quote with valid params', async () => {
    const { result } = renderHook(() => useQuote(defaultParams))

    await waitFor(() => {
      expect(result.current.quote).not.toBeNull()
    }, { timeout: 2000 })

    expect(result.current.quote?.outputAmount).toBe(100000000n)
    expect(mockClient.getQuotes).toHaveBeenCalled()
  })

  it('should set error when no quotes available', async () => {
    mockClient.getQuotes.mockResolvedValue([])

    const { result } = renderHook(() => useQuote(defaultParams))

    await waitFor(() => {
      expect(result.current.error).toBe('No quotes available for this pair')
    }, { timeout: 2000 })
  })

  it('should handle network error', async () => {
    mockClient.getQuotes.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useQuote(defaultParams))

    await waitFor(() => {
      expect(result.current.error).toBe('Network error. Please check your connection')
    }, { timeout: 2000 })
  })

  it('should handle expired quote error', async () => {
    mockClient.getQuotes.mockRejectedValue(new Error('Quote has expired'))

    const { result } = renderHook(() => useQuote(defaultParams))

    await waitFor(() => {
      expect(result.current.error).toBe('Quote expired. Please refresh')
    }, { timeout: 2000 })
  })

  it('should handle insufficient liquidity error', async () => {
    mockClient.getQuotes.mockRejectedValue(new Error('Insufficient liquidity'))

    const { result } = renderHook(() => useQuote(defaultParams))

    await waitFor(() => {
      expect(result.current.error).toBe('Insufficient liquidity for this amount')
    }, { timeout: 2000 })
  })

  it('should calculate output amount', async () => {
    const { result } = renderHook(() => useQuote(defaultParams))

    await waitFor(() => {
      expect(result.current.outputAmount).not.toBeNull()
    }, { timeout: 2000 })
  })

  it('should calculate exchange rate', async () => {
    const { result } = renderHook(() => useQuote(defaultParams))

    await waitFor(() => {
      expect(result.current.rate).not.toBeNull()
    }, { timeout: 2000 })
  })

  it('should calculate fee percent', async () => {
    const { result } = renderHook(() => useQuote(defaultParams))

    await waitFor(() => {
      expect(result.current.quote).not.toBeNull()
    }, { timeout: 2000 })

    expect(result.current.feePercent).toBeDefined()
  })

  it('should provide refresh function', async () => {
    const { result } = renderHook(() => useQuote(defaultParams))

    await waitFor(() => {
      expect(result.current.quote).not.toBeNull()
    }, { timeout: 2000 })

    expect(result.current.refresh).toBeInstanceOf(Function)
  })

  it('should not fetch when amount is empty', async () => {
    const params = { ...defaultParams, amount: '' }
    renderHook(() => useQuote(params))

    // Wait a bit to ensure no fetch happens
    await new Promise(resolve => setTimeout(resolve, 600))

    expect(mockClient.createIntent).not.toHaveBeenCalled()
  })

  it('should not fetch when amount is zero', async () => {
    const params = { ...defaultParams, amount: '0' }
    renderHook(() => useQuote(params))

    await new Promise(resolve => setTimeout(resolve, 600))

    expect(mockClient.createIntent).not.toHaveBeenCalled()
  })
})
