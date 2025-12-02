import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Slippage presets (as percentages)
 */
export const SLIPPAGE_PRESETS = [0.1, 0.5, 1.0, 3.0] as const

/**
 * Settings store for user preferences
 */
interface SettingsStore {
  /** Slippage tolerance as percentage (e.g., 1.0 = 1%) */
  slippage: number
  /** Set slippage tolerance */
  setSlippage: (slippage: number) => void
  /** Get slippage as decimal (e.g., 0.01 for 1%) */
  getSlippageDecimal: () => number
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      slippage: 1.0, // Default 1%

      setSlippage: (slippage) => {
        // Clamp between 0.01% and 50%
        const clamped = Math.max(0.01, Math.min(50, slippage))
        set({ slippage: clamped })
      },

      getSlippageDecimal: () => {
        return get().slippage / 100
      },
    }),
    {
      name: 'sip-settings',
    }
  )
)
