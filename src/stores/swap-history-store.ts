import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PrivacyLevel } from '@sip-protocol/types'

export interface SwapRecord {
  id: string
  fromToken: string
  toToken: string
  fromChain: string
  toChain: string
  fromAmount: string
  toAmount: string
  status: 'pending' | 'completed' | 'failed'
  txHash?: string
  explorerUrl?: string
  timestamp: number
  privacyLevel: PrivacyLevel
  /** Deposit address for production swaps */
  depositAddress?: string
}

interface SwapHistoryStore {
  swaps: SwapRecord[]
  /** Add a new swap to history */
  addSwap: (swap: SwapRecord) => void
  /** Update an existing swap */
  updateSwap: (id: string, updates: Partial<SwapRecord>) => void
  /** Get a swap by ID */
  getSwap: (id: string) => SwapRecord | undefined
  /** Clear all history */
  clearHistory: () => void
}

const MAX_HISTORY = 20

export const useSwapHistoryStore = create<SwapHistoryStore>()(
  persist(
    (set, get) => ({
      swaps: [],

      addSwap: (swap) =>
        set((state) => ({
          swaps: [swap, ...state.swaps].slice(0, MAX_HISTORY),
        })),

      updateSwap: (id, updates) =>
        set((state) => ({
          swaps: state.swaps.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      getSwap: (id) => get().swaps.find((s) => s.id === id),

      clearHistory: () => set({ swaps: [] }),
    }),
    {
      name: 'sip-swap-history',
    }
  )
)
