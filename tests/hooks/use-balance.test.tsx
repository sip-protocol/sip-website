import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useBalance } from '@/hooks/use-balance'

// Mock the wallet store
const mockWalletState = {
  isConnected: false,
  address: null as string | null,
  chain: null as 'solana' | 'ethereum' | null,
}

vi.mock('@/stores', () => ({
  useWalletStore: () => mockWalletState,
}))

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useBalance', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockWalletState.isConnected = false
    mockWalletState.address = null
    mockWalletState.chain = null
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('when wallet is not connected', () => {
    it('should return null balance and dash display', () => {
      const { result } = renderHook(() => useBalance())

      expect(result.current.balance).toBeNull()
      expect(result.current.formatted).toBe('0')
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should not make any fetch calls', () => {
      renderHook(() => useBalance())

      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('when wallet is connected to Solana', () => {
    beforeEach(() => {
      mockWalletState.isConnected = true
      mockWalletState.address = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
      mockWalletState.chain = 'solana'
    })

    it('should fetch Solana balance successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          jsonrpc: '2.0',
          result: { value: 5000000000 }, // 5 SOL in lamports
          id: 1,
        }),
      })

      const { result } = renderHook(() => useBalance())

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.balance).toBe(5000000000n)
      expect(result.current.formatted).toBe('5')
      expect(result.current.symbol).toBe('SOL')
      expect(result.current.error).toBeNull()
    })

    it('should handle Solana RPC error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          jsonrpc: '2.0',
          error: { message: 'Invalid address' },
          id: 1,
        }),
      })

      const { result } = renderHook(() => useBalance())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.balance).toBeNull()
      expect(result.current.error).toBe('Invalid address')
    })

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useBalance())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.balance).toBeNull()
      expect(result.current.error).toBe('Network error')
    })
  })

  describe('when wallet is connected to Ethereum', () => {
    beforeEach(() => {
      mockWalletState.isConnected = true
      mockWalletState.address = '0x742d35Cc6634C0532925a3b844Bc9e7595f1dE2b'
      mockWalletState.chain = 'ethereum'
    })

    it('should fetch Ethereum balance successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          jsonrpc: '2.0',
          result: '0x1bc16d674ec80000', // 2 ETH in wei (hex)
          id: 1,
        }),
      })

      const { result } = renderHook(() => useBalance())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.balance).toBe(2000000000000000000n)
      expect(result.current.formatted).toBe('2')
      expect(result.current.symbol).toBe('ETH')
      expect(result.current.error).toBeNull()
    })

    it('should handle Ethereum RPC error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          jsonrpc: '2.0',
          error: { message: 'Invalid params' },
          id: 1,
        }),
      })

      const { result } = renderHook(() => useBalance())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.balance).toBeNull()
      expect(result.current.error).toBe('Invalid params')
    })
  })

  describe('refresh functionality', () => {
    beforeEach(() => {
      mockWalletState.isConnected = true
      mockWalletState.address = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
      mockWalletState.chain = 'solana'
    })

    it('should allow manual refresh', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            jsonrpc: '2.0',
            result: { value: 1000000000 }, // 1 SOL
            id: 1,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            jsonrpc: '2.0',
            result: { value: 2000000000 }, // 2 SOL
            id: 1,
          }),
        })

      const { result } = renderHook(() => useBalance())

      await waitFor(() => {
        expect(result.current.balance).toBe(1000000000n)
      })

      // Manually refresh
      await act(async () => {
        await result.current.refresh()
      })

      expect(result.current.balance).toBe(2000000000n)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('balance formatting', () => {
    beforeEach(() => {
      mockWalletState.isConnected = true
      mockWalletState.address = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
      mockWalletState.chain = 'solana'
    })

    it('should format fractional balance correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          jsonrpc: '2.0',
          result: { value: 1234567890 }, // 1.23456789 SOL
          id: 1,
        }),
      })

      const { result } = renderHook(() => useBalance())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Should be formatted to 4 decimal places max
      expect(result.current.formatted).toBe('1.2345')
    })

    it('should format zero balance', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          jsonrpc: '2.0',
          result: { value: 0 },
          id: 1,
        }),
      })

      const { result } = renderHook(() => useBalance())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.formatted).toBe('0')
    })
  })
})
