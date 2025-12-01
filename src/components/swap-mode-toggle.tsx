'use client'

import { useSwapModeStore, type SwapMode } from '@/stores'

interface SwapModeToggleProps {
  className?: string
}

const modes: { value: SwapMode; label: string; description: string }[] = [
  {
    value: 'preview',
    label: 'Preview',
    description: 'Dry-run mode - explore quotes without executing',
  },
  {
    value: 'execute',
    label: 'Execute',
    description: 'Live mode - real swaps with your wallet',
  },
]

export function SwapModeToggle({ className }: SwapModeToggleProps) {
  const { mode, setMode } = useSwapModeStore()

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className ?? ''}`} data-testid="swap-mode-toggle">
      <div className="inline-flex rounded-xl border border-gray-700 bg-gray-900 p-1">
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            data-testid={`swap-mode-${m.value}`}
            aria-pressed={mode === m.value}
            className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              mode === m.value
                ? m.value === 'preview'
                  ? 'bg-amber-600 text-white'
                  : 'bg-green-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              {m.value === 'preview' && <EyeIcon className="h-4 w-4" />}
              {m.value === 'execute' && <BoltIcon className="h-4 w-4" />}
              {m.label}
            </span>
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-400">
        {modes.find((m) => m.value === mode)?.description}
      </p>
    </div>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  )
}
