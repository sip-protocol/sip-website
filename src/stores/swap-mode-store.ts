import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Swap execution mode
 *
 * - 'preview': Dry-run mode - shows quotes without deposit addresses, execution disabled
 * - 'execute': Live mode - real quotes with deposit addresses, execution enabled
 */
export type SwapMode = 'preview' | 'execute'

interface SwapModeStore {
  /** Current swap mode */
  mode: SwapMode
  /** Toggle between preview and execute modes */
  toggleMode: () => void
  /** Set mode explicitly */
  setMode: (mode: SwapMode) => void
  /** Check if in preview (dry-run) mode */
  isPreviewMode: () => boolean
}

export const useSwapModeStore = create<SwapModeStore>()(
  persist(
    (set, get) => ({
      mode: 'preview', // Default to preview mode for safety

      toggleMode: () => {
        set((state) => ({
          mode: state.mode === 'preview' ? 'execute' : 'preview',
        }))
      },

      setMode: (mode) => {
        set({ mode })
      },

      isPreviewMode: () => {
        return get().mode === 'preview'
      },
    }),
    {
      name: 'sip-swap-mode',
    }
  )
)
