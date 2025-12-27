import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { PrivacyLevel } from '@sip-protocol/sdk'

// Mock the SIP context
const mockClient = {
  createIntent: vi.fn(),
  execute: vi.fn(),
}

vi.mock('@/contexts', () => ({
  useSIP: () => ({ client: mockClient }),
}))

// Mock wallet store
const mockWalletState: {
  isConnected: boolean
  address: string | null
  chain: 'solana' | 'ethereum' | null
} = {
  isConnected: true,
  address: '0x1234567890abcdef1234567890abcdef12345678',
  chain: 'solana',
}

// Mock swap mode store
const mockSwapModeState = {
  mode: 'execute' as 'preview' | 'execute',
}

// Mock swap history store
const mockSwapHistoryState = {
  swaps: [],
  addSwap: vi.fn(),
  updateSwap: vi.fn(),
  getSwap: vi.fn(),
  clearHistory: vi.fn(),
}

vi.mock('@/stores', () => ({
  useWalletStore: () => mockWalletState,
  useSwapModeStore: () => mockSwapModeState,
  useSwapHistoryStore: () => mockSwapHistoryState,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}))

import { useSwap, getStatusMessage, type SwapParams } from '@/hooks/use-swap'
import { toast } from '@/stores'

describe('useSwap', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Reset wallet state
    mockWalletState.isConnected = true
    mockWalletState.address = '0x1234567890abcdef1234567890abcdef12345678'
    mockWalletState.chain = 'solana'

    // Reset swap mode state
    mockSwapModeState.mode = 'execute'

    // Default mock implementations
    mockClient.createIntent.mockResolvedValue({ id: 'test-intent' })
    mockClient.execute.mockResolvedValue({ txHash: '0xabcd1234' })
  })

  const defaultParams: SwapParams = {
    fromChain: 'solana',
    toChain: 'ethereum',
    fromToken: 'SOL',
    toToken: 'ETH',
    amount: '1.5',
    privacyLevel: PrivacyLevel.SHIELDED,
    quote: {
      quoteId: 'quote-1',
      intentId: 'intent-1',
      solverId: 'mock-solver',
      outputAmount: 100000000n,
      fee: 1000000n,
      estimatedTime: 30,
      expiry: Date.now() + 60000,
    },
  }

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useSwap())

      expect(result.current.status).toBe('idle')
      expect(result.current.txHash).toBeNull()
      expect(result.current.explorerUrl).toBeNull()
      expect(result.current.txChain).toBeNull()
      expect(result.current.error).toBeNull()
    })
  })

  describe('execute', () => {
    it('should block execution in preview mode', async () => {
      mockSwapModeState.mode = 'preview'

      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(defaultParams)
      })

      // Preview mode should not change status or call client
      expect(result.current.status).toBe('idle')
      expect(mockClient.createIntent).not.toHaveBeenCalled()
      expect(toast.info).toHaveBeenCalledWith('Preview Mode', expect.any(String))
    })

    it('should require wallet connection', async () => {
      mockWalletState.isConnected = false
      mockWalletState.address = null

      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(defaultParams)
      })

      expect(result.current.status).toBe('error')
      expect(result.current.error).toBe('Please connect your wallet first')
      expect(toast.warning).toHaveBeenCalledWith('Wallet Required', expect.any(String))
    })

    it('should require matching chain', async () => {
      mockWalletState.chain = 'ethereum' // Wallet on ethereum

      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(defaultParams) // fromChain is solana
      })

      expect(result.current.status).toBe('error')
      expect(result.current.error).toContain('switch to Solana')
      expect(toast.warning).toHaveBeenCalledWith('Wrong Network', expect.any(String))
    })

    it('should require quote', async () => {
      const paramsWithoutQuote = { ...defaultParams, quote: null }

      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(paramsWithoutQuote)
      })

      expect(result.current.status).toBe('error')
      expect(result.current.error).toContain('No quote available')
    })

    it('should execute swap successfully', async () => {
      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(defaultParams)
      })

      expect(result.current.status).toBe('success')
      expect(result.current.txHash).toBe('0xabcd1234')
      expect(result.current.txChain).toBe('solana')
      expect(toast.success).toHaveBeenCalled()
    })

    it('should handle shielded mode with no txHash', async () => {
      mockClient.execute.mockResolvedValue({})

      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(defaultParams) // defaultParams uses SHIELDED
      })

      // Shielded mode: success without txHash is expected (privacy protection)
      expect(result.current.status).toBe('success')
      expect(result.current.txHash).toBeNull()
      expect(toast.success).toHaveBeenCalledWith('Shielded Swap Complete', expect.any(String))
    })

    it('should handle transparent mode with no txHash', async () => {
      mockClient.execute.mockResolvedValue({})

      const transparentParams = { ...defaultParams, privacyLevel: PrivacyLevel.TRANSPARENT }
      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(transparentParams)
      })

      // Transparent mode: success but no explorer link
      expect(result.current.status).toBe('success')
      expect(result.current.txHash).toBeNull()
      expect(toast.success).toHaveBeenCalledWith('Swap Complete', expect.any(String))
    })

    it('should call createIntent with correct parameters', async () => {
      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(defaultParams)
      })

      // Note: When no destinationAddress is provided, effectivePrivacyLevel = privacyLevel
      // The createIntent is called with the effective privacy level
      expect(mockClient.createIntent).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            asset: expect.objectContaining({
              chain: 'solana',
              symbol: 'SOL',
            }),
          }),
          output: expect.objectContaining({
            asset: expect.objectContaining({
              chain: 'ethereum',
              symbol: 'ETH',
            }),
          }),
          // Privacy level is passed through when no destination address
          privacy: PrivacyLevel.SHIELDED,
        }),
        expect.objectContaining({
          senderSecret: expect.any(Uint8Array),
        })
      )
    })
  })

  describe('error handling', () => {
    it('should handle user rejection', async () => {
      mockClient.execute.mockRejectedValue(new Error('User rejected the transaction'))

      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(defaultParams)
      })

      expect(result.current.status).toBe('error')
      expect(result.current.error).toContain('rejected')
      expect(toast.error).toHaveBeenCalledWith('Transaction Rejected', expect.any(String))
    })

    it('should handle insufficient balance', async () => {
      mockClient.execute.mockRejectedValue(new Error('Insufficient balance'))

      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(defaultParams)
      })

      expect(result.current.status).toBe('error')
      expect(result.current.error).toContain('Insufficient balance')
      expect(toast.error).toHaveBeenCalledWith('Insufficient Balance', expect.any(String))
    })

    it('should handle quote expired', async () => {
      mockClient.execute.mockRejectedValue(new Error('Quote expired'))

      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(defaultParams)
      })

      expect(result.current.status).toBe('error')
      expect(result.current.error).toContain('expired')
    })

    it('should handle network error', async () => {
      mockClient.execute.mockRejectedValue(new Error('Network timeout'))

      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(defaultParams)
      })

      expect(result.current.status).toBe('error')
      expect(result.current.error).toContain('Network error')
    })

    it('should handle slippage error', async () => {
      mockClient.execute.mockRejectedValue(new Error('Slippage too high'))

      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(defaultParams)
      })

      expect(result.current.status).toBe('error')
      expect(result.current.error).toContain('slippage')
    })

    it('should handle gas error', async () => {
      mockClient.execute.mockRejectedValue(new Error('gas estimation error'))

      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(defaultParams)
      })

      expect(result.current.status).toBe('error')
      expect(result.current.error).toContain('gas')
    })
  })

  describe('reset', () => {
    it('should reset all state', async () => {
      const { result } = renderHook(() => useSwap())

      // First execute to set state
      await act(async () => {
        await result.current.execute(defaultParams)
      })

      expect(result.current.status).toBe('success')
      expect(result.current.txHash).not.toBeNull()

      // Then reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.status).toBe('idle')
      expect(result.current.txHash).toBeNull()
      expect(result.current.explorerUrl).toBeNull()
      expect(result.current.txChain).toBeNull()
      expect(result.current.error).toBeNull()
    })
  })

  describe('explorerUrl', () => {
    // Note: explorerUrl is now based on settlementChain (destination), not source chain
    // depositExplorerUrl is based on txChain (source)
    it('should generate explorer URL for settlement chain (destination)', async () => {
      mockClient.execute.mockResolvedValue({ txHash: '0xabcd1234' })

      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(defaultParams)
      })

      // defaultParams has toChain: 'ethereum', so explorer should be etherscan
      expect(result.current.explorerUrl).toContain('etherscan.io')
      expect(result.current.explorerUrl).toContain('0xabcd1234')
    })

    it('should generate NEAR explorer URL for NEAR destination', async () => {
      mockClient.execute.mockResolvedValue({ txHash: '0xnear123' })

      const nearParams = { ...defaultParams, toChain: 'near' as const }

      const { result } = renderHook(() => useSwap())

      await act(async () => {
        await result.current.execute(nearParams)
      })

      expect(result.current.explorerUrl).toContain('nearblocks.io')
    })

    it('should be null when no txHash', () => {
      const { result } = renderHook(() => useSwap())
      expect(result.current.explorerUrl).toBeNull()
    })
  })
})

describe('getStatusMessage', () => {
  it('should return correct message for confirming', () => {
    expect(getStatusMessage('confirming', false)).toBe('Preparing transaction...')
  })

  it('should return correct message for signing', () => {
    expect(getStatusMessage('signing', false)).toBe('Please sign in your wallet...')
  })

  it('should return correct message for pending (not shielded)', () => {
    expect(getStatusMessage('pending', false)).toBe('Processing...')
  })

  it('should return correct message for pending (shielded)', () => {
    expect(getStatusMessage('pending', true)).toBe('Shielding transaction...')
  })

  it('should return correct message for success', () => {
    expect(getStatusMessage('success', false)).toBe('Transaction complete!')
  })

  it('should return correct message for error', () => {
    expect(getStatusMessage('error', false)).toBe('Transaction failed')
  })

  it('should return empty string for idle', () => {
    expect(getStatusMessage('idle', false)).toBe('')
  })
})
