'use client'

import { useState, useRef, type KeyboardEvent } from 'react'
import { PrivacyLevel } from '@/types'

interface PrivacyToggleProps {
  value: PrivacyLevel
  onChange: (level: PrivacyLevel) => void
}

interface LevelConfig {
  value: PrivacyLevel
  label: string
  description: string
  hint: {
    icon: string
    text: string
    className: string
  }
  recommendation?: string
}

const levels: LevelConfig[] = [
  {
    value: PrivacyLevel.TRANSPARENT,
    label: 'Public',
    description: 'Standard transaction (current NEAR Intents)',
    hint: {
      icon: '👁️',
      text: 'Transaction details visible to everyone on-chain',
      className: 'text-gray-400',
    },
    recommendation: 'Want more privacy? Try Shielded mode',
  },
  {
    value: PrivacyLevel.SHIELDED,
    label: 'Shielded',
    description: 'Full privacy via Zcash',
    hint: {
      icon: '🔒',
      text: 'Maximum privacy — sender, amount, and recipient hidden',
      className: 'text-green-400',
    },
  },
  {
    value: PrivacyLevel.COMPLIANT,
    label: 'Compliant',
    description: 'Private with viewing key',
    hint: {
      icon: '📋',
      text: 'Audit-ready — save your viewing key for tax reporting',
      className: 'text-blue-400',
    },
  },
]

export function PrivacyToggle({ value, onChange }: PrivacyToggleProps) {
  const [showComparison, setShowComparison] = useState(false)
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
    <>
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

        {/* Description with Compare link */}
        <div className="flex items-center gap-2 text-center text-xs sm:text-sm">
          <p className="text-gray-400" aria-live="polite" aria-atomic="true">
            {currentLevel?.description}
          </p>
          <button
            onClick={() => setShowComparison(true)}
            className="text-purple-400 hover:text-purple-300 underline underline-offset-2"
            aria-label="Compare privacy levels"
          >
            Compare
          </button>
        </div>

        {/* Inline hint based on current selection */}
        {currentLevel && (
          <div
            className={`flex items-center gap-1.5 text-xs ${currentLevel.hint.className}`}
            role="status"
            aria-live="polite"
          >
            <span aria-hidden="true">{currentLevel.hint.icon}</span>
            <span>{currentLevel.hint.text}</span>
          </div>
        )}

        {/* Recommendation for transparent mode */}
        {currentLevel?.recommendation && (
          <button
            onClick={() => onChange(PrivacyLevel.SHIELDED)}
            className="text-xs text-yellow-400/80 hover:text-yellow-400 flex items-center gap-1"
          >
            <span aria-hidden="true">💡</span>
            <span className="underline underline-offset-2">{currentLevel.recommendation}</span>
          </button>
        )}
      </div>

      {/* Comparison Modal */}
      {showComparison && (
        <PrivacyComparisonModal
          onClose={() => setShowComparison(false)}
          onSelectLevel={(level) => {
            onChange(level)
            setShowComparison(false)
          }}
          selectedLevel={value}
        />
      )}
    </>
  )
}

/**
 * Privacy Level Comparison Modal
 */
function PrivacyComparisonModal({
  onClose,
  onSelectLevel,
  selectedLevel,
}: {
  onClose: () => void
  onSelectLevel: (level: PrivacyLevel) => void
  selectedLevel: PrivacyLevel
}) {
  const features = [
    { name: 'Sender hidden', transparent: false, shielded: true, compliant: true },
    { name: 'Amount hidden', transparent: false, shielded: true, compliant: true },
    { name: 'Recipient hidden', transparent: false, shielded: true, compliant: true },
    { name: 'Auditable', transparent: '✅ (public)', shielded: false, compliant: '✅ (with key)' },
    { name: 'Tax reporting', transparent: 'Easy', shielded: 'Manual', compliant: 'Easy' },
    { name: 'Speed', transparent: 'Fast', shielded: 'Medium', compliant: 'Medium' },
    { name: 'Best for', transparent: 'Public txs', shielded: 'Max privacy', compliant: 'Institutions' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 id="comparison-title" className="text-xl font-bold">Privacy Level Comparison</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
            aria-label="Close comparison"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-2 text-gray-400 font-normal"></th>
                <th className="py-3 px-2 text-center">
                  <button
                    onClick={() => onSelectLevel(PrivacyLevel.TRANSPARENT)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      selectedLevel === PrivacyLevel.TRANSPARENT
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    Transparent
                  </button>
                </th>
                <th className="py-3 px-2 text-center">
                  <button
                    onClick={() => onSelectLevel(PrivacyLevel.SHIELDED)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      selectedLevel === PrivacyLevel.SHIELDED
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/20'
                    }`}
                  >
                    Shielded
                  </button>
                </th>
                <th className="py-3 px-2 text-center">
                  <button
                    onClick={() => onSelectLevel(PrivacyLevel.COMPLIANT)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      selectedLevel === PrivacyLevel.COMPLIANT
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20'
                    }`}
                  >
                    Compliant
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr key={feature.name} className={i !== features.length - 1 ? 'border-b border-gray-800' : ''}>
                  <td className="py-3 px-2 text-gray-300">{feature.name}</td>
                  <td className="py-3 px-2 text-center">
                    <FeatureValue value={feature.transparent} />
                  </td>
                  <td className="py-3 px-2 text-center">
                    <FeatureValue value={feature.shielded} />
                  </td>
                  <td className="py-3 px-2 text-center">
                    <FeatureValue value={feature.compliant} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommendations */}
        <div className="mt-6 p-4 rounded-xl bg-gray-800/50">
          <h4 className="font-medium mb-3">Recommendations</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <ShieldIcon className="h-4 w-4 text-purple-400" />
              <span><strong className="text-purple-400">Personal use:</strong> Shielded for maximum privacy</span>
            </li>
            <li className="flex items-center gap-2">
              <KeyIcon className="h-4 w-4 text-blue-400" />
              <span><strong className="text-blue-400">Business/DAO:</strong> Compliant for audit trail</span>
            </li>
            <li className="flex items-center gap-2">
              <EyeOpenIcon className="h-4 w-4 text-gray-400" />
              <span><strong className="text-gray-300">Public payments:</strong> Transparent for visibility</span>
            </li>
          </ul>
        </div>

        {/* Action */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return <span className="text-green-400">✓</span>
  }
  if (value === false) {
    return <span className="text-red-400/60">✗</span>
  }
  return <span className="text-gray-300">{value}</span>
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
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
