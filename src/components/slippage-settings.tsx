'use client'

import { useState, useRef, useEffect } from 'react'
import { useSettingsStore, SLIPPAGE_PRESETS } from '@/stores/settings-store'

interface SlippageSettingsProps {
  /** Called when settings panel should close */
  onClose?: () => void
}

export function SlippageSettings({ onClose }: SlippageSettingsProps) {
  const { slippage, setSlippage } = useSettingsStore()
  const [customValue, setCustomValue] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if current slippage matches a preset
  const isPreset = SLIPPAGE_PRESETS.includes(slippage as typeof SLIPPAGE_PRESETS[number])

  // Initialize custom value if not a preset
  useEffect(() => {
    if (!isPreset) {
      setCustomValue(slippage.toString())
      setIsCustom(true)
    }
  }, [slippage, isPreset])

  const handlePresetClick = (preset: number) => {
    setSlippage(preset)
    setIsCustom(false)
    setCustomValue('')
  }

  const handleCustomChange = (value: string) => {
    setCustomValue(value)
    const parsed = parseFloat(value)
    if (!isNaN(parsed) && parsed > 0) {
      setSlippage(parsed)
    }
  }

  const handleCustomFocus = () => {
    setIsCustom(true)
    if (!customValue) {
      setCustomValue(slippage.toString())
    }
  }

  // Warning thresholds
  const isLowSlippage = slippage < 0.5
  const isHighSlippage = slippage > 5
  const isVeryHighSlippage = slippage > 10

  return (
    <div
      className="rounded-xl border border-gray-700 bg-gray-800/90 p-4 backdrop-blur-sm"
      role="region"
      aria-label="Slippage settings"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-200">Slippage Tolerance</h4>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Preset buttons */}
      <div className="flex gap-2 mb-3">
        {SLIPPAGE_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              slippage === preset && !isCustom
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            aria-pressed={slippage === preset && !isCustom}
          >
            {preset}%
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="number"
            value={isCustom ? customValue : ''}
            onChange={(e) => handleCustomChange(e.target.value)}
            onFocus={handleCustomFocus}
            placeholder="Custom"
            min="0.01"
            max="50"
            step="0.1"
            className={`w-full bg-gray-700 rounded-lg px-3 py-2 pr-8 text-sm outline-none placeholder:text-gray-500 ${
              isCustom
                ? 'ring-1 ring-purple-500 text-white'
                : 'text-gray-400'
            }`}
            aria-label="Custom slippage percentage"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            %
          </span>
        </div>
      </div>

      {/* Warnings */}
      {isLowSlippage && (
        <div className="mt-3 flex items-start gap-2 text-xs text-yellow-400">
          <WarningIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>Low slippage may cause transaction to fail in volatile markets</span>
        </div>
      )}

      {isHighSlippage && !isVeryHighSlippage && (
        <div className="mt-3 flex items-start gap-2 text-xs text-orange-400">
          <WarningIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>High slippage may result in an unfavorable rate</span>
        </div>
      )}

      {isVeryHighSlippage && (
        <div className="mt-3 flex items-start gap-2 text-xs text-red-400">
          <WarningIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>Very high slippage! You may receive significantly less than expected</span>
        </div>
      )}

      {/* Current setting display */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Current tolerance</span>
          <span className={`font-medium ${
            isVeryHighSlippage ? 'text-red-400' :
            isHighSlippage ? 'text-orange-400' :
            isLowSlippage ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            {slippage}%
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Inline slippage display with edit button
 */
export function SlippageDisplay({ onClick }: { onClick: () => void }) {
  const { slippage } = useSettingsStore()
  const isHighSlippage = slippage > 5

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors group"
      aria-label={`Slippage tolerance: ${slippage}%. Click to edit`}
    >
      <span>Slippage: {slippage}%</span>
      <EditIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      {isHighSlippage && <WarningIcon className="h-3 w-3 text-orange-400" />}
    </button>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  )
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  )
}
