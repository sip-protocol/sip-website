'use client'

import { useSwapModeStore } from '@/stores'

interface SwapModeToggleProps {
  className?: string
}

export function SwapModeToggle({ className }: SwapModeToggleProps) {
  const { mode, setMode } = useSwapModeStore()
  const isPreview = mode === 'preview'

  return (
    <button
      onClick={() => setMode(isPreview ? 'execute' : 'preview')}
      className={`flex items-center gap-2 text-sm ${className ?? ''}`}
      data-testid="swap-mode-toggle"
      aria-label={`Switch to ${isPreview ? 'execute' : 'preview'} mode`}
    >
      <span
        className={`transition-colors ${isPreview ? 'text-amber-400' : 'text-gray-500'}`}
        data-testid="swap-mode-preview"
        aria-pressed={isPreview}
      >
        Preview
      </span>
      <div
        className={`relative h-5 w-9 rounded-full transition-colors ${
          isPreview ? 'bg-amber-600' : 'bg-green-600'
        }`}
      >
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            isPreview ? 'left-0.5' : 'left-4'
          }`}
        />
      </div>
      <span
        className={`transition-colors ${!isPreview ? 'text-green-400' : 'text-gray-500'}`}
        data-testid="swap-mode-execute"
        aria-pressed={!isPreview}
      >
        Execute
      </span>
    </button>
  )
}
