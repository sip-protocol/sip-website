'use client'

import { useRef, type KeyboardEvent } from 'react'
import { PrivacyLevel } from '@/types'

interface PrivacyToggleProps {
  value: PrivacyLevel
  onChange: (level: PrivacyLevel) => void
}

const levels: { value: PrivacyLevel; label: string; description: string }[] = [
  {
    value: PrivacyLevel.TRANSPARENT,
    label: 'Public',
    description: 'Standard transaction (current NEAR Intents)',
  },
  {
    value: PrivacyLevel.SHIELDED,
    label: 'Shielded',
    description: 'Full privacy via Zcash',
  },
  {
    value: PrivacyLevel.COMPLIANT,
    label: 'Compliant',
    description: 'Private with viewing key',
  },
]

export function PrivacyToggle({ value, onChange }: PrivacyToggleProps) {
  const currentLevel = levels.find((l) => l.value === value)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  const currentIndex = levels.findIndex((l) => l.value === value)

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        nextIndex = (index + 1) % levels.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        nextIndex = (index - 1 + levels.length) % levels.length
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = levels.length - 1
        break
      case ' ':
      case 'Enter':
        e.preventDefault()
        onChange(levels[index].value)
        return
      default:
        return
    }

    // Move focus and select the new option
    buttonRefs.current[nextIndex]?.focus()
    onChange(levels[nextIndex].value)
  }

  return (
    <div
      className="inline-flex flex-col items-center gap-2"
      data-testid="privacy-toggle"
      role="group"
      aria-label="Privacy level selection"
    >
      <div
        className="inline-flex flex-wrap justify-center gap-1 rounded-xl border border-gray-700 bg-gray-900 p-1 sm:flex-nowrap"
        role="radiogroup"
        aria-label="Choose privacy level"
      >
        {levels.map((level, index) => (
          <button
            key={level.value}
            ref={(el) => { buttonRefs.current[index] = el }}
            onClick={() => onChange(level.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            data-testid={`privacy-${level.value}`}
            role="radio"
            aria-checked={value === level.value}
            aria-label={`${level.label} privacy: ${level.description}`}
            tabIndex={value === level.value ? 0 : -1}
            className={`relative min-h-[44px] rounded-lg px-3 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95 sm:px-4 ${
              value === level.value
                ? level.value === PrivacyLevel.TRANSPARENT
                  ? 'bg-gray-700 text-white'
                  : level.value === PrivacyLevel.SHIELDED
                    ? 'bg-purple-600 text-white'
                    : 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white active:bg-gray-800'
            }`}
          >
            <span className="flex items-center gap-1.5 sm:gap-2" aria-hidden="true">
              {level.value === PrivacyLevel.TRANSPARENT && <EyeOpenIcon className="h-4 w-4" />}
              {level.value === PrivacyLevel.SHIELDED && <ShieldIcon className="h-4 w-4" />}
              {level.value === PrivacyLevel.COMPLIANT && <KeyIcon className="h-4 w-4" />}
              {level.label}
            </span>
          </button>
        ))}
      </div>
      <p
        className="text-center text-xs text-gray-400 sm:text-sm"
        aria-live="polite"
        aria-atomic="true"
      >
        {currentLevel?.description}
      </p>
    </div>
  )
}

function EyeOpenIcon({ className }: { className?: string }) {
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

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  )
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
      />
    </svg>
  )
}
