'use client'

import { useState } from 'react'
import { PrivacyLevel } from '@/types'

interface PrivacyLevelComparisonProps {
  /** Currently selected privacy level (optional - for syncing with parent) */
  selectedLevel?: PrivacyLevel
  /** Callback when user clicks on a level */
  onSelectLevel?: (level: PrivacyLevel) => void
}

/**
 * Privacy Level A/B/C Comparison
 *
 * Shows the SAME transaction across all 3 privacy modes side-by-side,
 * helping users understand what's hidden at each level.
 */
export function PrivacyLevelComparison({
  selectedLevel,
  onSelectLevel,
}: PrivacyLevelComparisonProps) {
  const [activeLevel, setActiveLevel] = useState<PrivacyLevel>(
    selectedLevel ?? PrivacyLevel.SHIELDED
  )
  const [showViewingKeyFlow, setShowViewingKeyFlow] = useState(false)

  const handleLevelSelect = (level: PrivacyLevel) => {
    setActiveLevel(level)
    onSelectLevel?.(level)
    if (level === PrivacyLevel.COMPLIANT) {
      setShowViewingKeyFlow(true)
    } else {
      setShowViewingKeyFlow(false)
    }
  }

  // Sample transaction data
  const txData = {
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    amount: '100.00 USDC',
    timestamp: 'Dec 2, 2025 10:30 AM',
  }

  return (
    <div className="space-y-6">
      {/* Header with toggle buttons */}
      <div className="text-center">
        <h3 className="text-xl font-bold sm:text-2xl">Same Transaction, Three Privacy Levels</h3>
        <p className="mt-2 text-sm text-gray-400 sm:text-base">
          Click on a mode to see what observers can see
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {[
          { level: PrivacyLevel.TRANSPARENT, label: 'Transparent', color: 'gray' },
          { level: PrivacyLevel.SHIELDED, label: 'Shielded', color: 'purple' },
          { level: PrivacyLevel.COMPLIANT, label: 'Compliant', color: 'blue' },
        ].map(({ level, label, color }) => (
          <button
            key={level}
            onClick={() => handleLevelSelect(level)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all sm:px-5 sm:py-3 sm:text-base ${
              activeLevel === level
                ? color === 'gray'
                  ? 'bg-gray-700 text-white ring-2 ring-gray-500'
                  : color === 'purple'
                    ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                    : 'bg-blue-600 text-white ring-2 ring-blue-400'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {level === PrivacyLevel.TRANSPARENT && <EyeOpenIcon className="h-4 w-4" />}
            {level === PrivacyLevel.SHIELDED && <ShieldIcon className="h-4 w-4" />}
            {level === PrivacyLevel.COMPLIANT && <KeyIcon className="h-4 w-4" />}
            {label}
          </button>
        ))}
      </div>

      {/* Three-Column Comparison */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* TRANSPARENT */}
        <TransactionCard
          mode="transparent"
          isActive={activeLevel === PrivacyLevel.TRANSPARENT}
          onClick={() => handleLevelSelect(PrivacyLevel.TRANSPARENT)}
          txData={txData}
          visibleTo="Everyone on chain"
          tooltip={{
            question: 'Why choose transparent?',
            answer: 'Lower gas fees, full interoperability with existing dApps, and simpler transaction flow.',
          }}
        />

        {/* SHIELDED */}
        <TransactionCard
          mode="shielded"
          isActive={activeLevel === PrivacyLevel.SHIELDED}
          onClick={() => handleLevelSelect(PrivacyLevel.SHIELDED)}
          txData={txData}
          visibleTo="No one"
          tooltip={{
            question: 'Why choose shielded?',
            answer: 'Maximum privacy - sender, recipient, and amount are all hidden from chain observers.',
          }}
        />

        {/* COMPLIANT */}
        <TransactionCard
          mode="compliant"
          isActive={activeLevel === PrivacyLevel.COMPLIANT}
          onClick={() => handleLevelSelect(PrivacyLevel.COMPLIANT)}
          txData={txData}
          visibleTo="Auditor with viewing key"
          tooltip={{
            question: 'Why choose compliant?',
            answer: 'Institutional requirements, tax reporting, regulatory compliance while maintaining privacy from public.',
          }}
          showKeyIcon={true}
        />
      </div>

      {/* Viewing Key Disclosure Flow (shown when Compliant is selected) */}
      {showViewingKeyFlow && (
        <ViewingKeyFlow />
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 sm:gap-6 sm:text-sm">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/50" />
          <span>Exposed (visible)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-green-500/50" />
          <span>Hidden (private)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-blue-500/50" />
          <span>Selectively disclosed</span>
        </div>
      </div>
    </div>
  )
}

interface TransactionCardProps {
  mode: 'transparent' | 'shielded' | 'compliant'
  isActive: boolean
  onClick: () => void
  txData: {
    from: string
    to: string
    amount: string
    timestamp: string
  }
  visibleTo: string
  tooltip: {
    question: string
    answer: string
  }
  showKeyIcon?: boolean
}

function TransactionCard({
  mode,
  isActive,
  onClick,
  txData,
  visibleTo,
  tooltip,
  showKeyIcon,
}: TransactionCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const config = {
    transparent: {
      title: 'TRANSPARENT',
      borderColor: 'border-gray-600',
      activeBorder: 'border-gray-400 ring-2 ring-gray-400/50',
      bgGradient: 'from-gray-900/50 to-gray-950/50',
      titleColor: 'text-gray-300',
      showFrom: true,
      showTo: true,
      showAmount: true,
      fieldStatus: 'exposed' as const,
    },
    shielded: {
      title: 'SHIELDED',
      borderColor: 'border-purple-600/40',
      activeBorder: 'border-purple-500 ring-2 ring-purple-500/50',
      bgGradient: 'from-purple-950/30 to-gray-950/50',
      titleColor: 'text-purple-400',
      showFrom: false,
      showTo: false,
      showAmount: false,
      fieldStatus: 'hidden' as const,
    },
    compliant: {
      title: 'COMPLIANT',
      borderColor: 'border-blue-600/40',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/50',
      bgGradient: 'from-blue-950/30 to-gray-950/50',
      titleColor: 'text-blue-400',
      showFrom: false,
      showTo: false,
      showAmount: false,
      fieldStatus: 'selective' as const,
    },
  }

  const c = config[mode]

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl border-2 bg-gradient-to-b p-4 transition-all duration-300 hover:scale-[1.02] sm:rounded-2xl sm:p-6 ${c.bgGradient} ${
        isActive ? c.activeBorder : c.borderColor
      }`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {mode === 'transparent' && <EyeOpenIcon className="h-5 w-5 text-gray-400" />}
          {mode === 'shielded' && <ShieldIcon className="h-5 w-5 text-purple-400" />}
          {mode === 'compliant' && <KeyIcon className="h-5 w-5 text-blue-400" />}
          <span className={`text-sm font-bold tracking-wider ${c.titleColor}`}>{c.title}</span>
        </div>

        {/* Tooltip trigger */}
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={(e) => {
            e.stopPropagation()
            setShowTooltip(!showTooltip)
          }}
          className="rounded-full p-1 text-gray-500 hover:bg-gray-800 hover:text-gray-300"
        >
          <QuestionIcon className="h-4 w-4" />
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute right-4 top-14 z-10 w-64 rounded-lg border border-gray-700 bg-gray-900 p-3 shadow-xl">
            <p className="mb-1 text-xs font-semibold text-gray-300">{tooltip.question}</p>
            <p className="text-xs text-gray-400">{tooltip.answer}</p>
          </div>
        )}
      </div>

      {/* Transaction Fields */}
      <div className="space-y-3">
        <TransactionField
          label="From"
          value={txData.from}
          isHidden={!c.showFrom}
          status={c.fieldStatus}
          showKeyIcon={showKeyIcon && !c.showFrom}
        />
        <TransactionField
          label="To"
          value={txData.to}
          isHidden={!c.showTo}
          status={c.fieldStatus}
          showKeyIcon={showKeyIcon && !c.showTo}
        />
        <TransactionField
          label="Amount"
          value={txData.amount}
          isHidden={!c.showAmount}
          status={c.fieldStatus}
          showKeyIcon={showKeyIcon && !c.showAmount}
        />
      </div>

      {/* Visible To */}
      <div className="mt-4 border-t border-gray-800 pt-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">
          Visible to
        </p>
        <p
          className={`mt-1 text-sm font-medium ${
            mode === 'transparent'
              ? 'text-red-400'
              : mode === 'shielded'
                ? 'text-green-400'
                : 'text-blue-400'
          }`}
        >
          {visibleTo}
          {showKeyIcon && <span className="text-xs text-gray-500">*</span>}
        </p>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              mode === 'transparent'
                ? 'bg-gray-600 text-white'
                : mode === 'shielded'
                  ? 'bg-purple-600 text-white'
                  : 'bg-blue-600 text-white'
            }`}
          >
            SELECTED
          </span>
        </div>
      )}
    </div>
  )
}

interface TransactionFieldProps {
  label: string
  value: string
  isHidden: boolean
  status: 'exposed' | 'hidden' | 'selective'
  showKeyIcon?: boolean
}

function TransactionField({ label, value, isHidden, status, showKeyIcon }: TransactionFieldProps) {
  const truncatedValue = value.length > 20 ? `${value.slice(0, 8)}...${value.slice(-6)}` : value

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-gray-800/50 p-2.5 sm:p-3">
      <span className="text-xs text-gray-400 sm:text-sm">{label}</span>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {isHidden ? (
          <>
            <code className="font-mono text-xs text-gray-500 sm:text-sm">
              {status === 'selective' ? '[ENCRYPTED]' : '[HIDDEN]'}
            </code>
            {showKeyIcon && <KeyIcon className="h-3 w-3 text-blue-400" />}
            <StatusBadge status={status} />
          </>
        ) : (
          <>
            <code className="font-mono text-xs text-gray-300 sm:text-sm">{truncatedValue}</code>
            <StatusBadge status="exposed" />
          </>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: 'exposed' | 'hidden' | 'selective' }) {
  if (status === 'exposed') {
    return (
      <span className="flex items-center gap-1 rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-medium text-red-400">
        <EyeOpenIcon className="h-2.5 w-2.5" />
        <span className="hidden sm:inline">EXPOSED</span>
      </span>
    )
  }

  if (status === 'hidden') {
    return (
      <span className="flex items-center gap-1 rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] font-medium text-green-400">
        <EyeClosedIcon className="h-2.5 w-2.5" />
        <span className="hidden sm:inline">HIDDEN</span>
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1 rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
      <KeyIcon className="h-2.5 w-2.5" />
      <span className="hidden sm:inline">KEY</span>
    </span>
  )
}

function ViewingKeyFlow() {
  return (
    <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 sm:rounded-2xl sm:p-6">
      <h4 className="mb-4 flex items-center gap-2 text-base font-semibold text-blue-300 sm:text-lg">
        <KeyIcon className="h-5 w-5" />
        Viewing Key Disclosure Flow
      </h4>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Step 1 */}
        <div className="relative rounded-lg bg-gray-800/50 p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-sm font-bold text-blue-400">
            1
          </div>
          <h5 className="font-medium text-gray-200">Transaction Encrypted</h5>
          <p className="mt-1 text-xs text-gray-400">
            All fields are hidden using encryption. Only commitment hashes are public.
          </p>
          <ArrowRight className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-gray-600 sm:block" />
        </div>

        {/* Step 2 */}
        <div className="relative rounded-lg bg-gray-800/50 p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-sm font-bold text-blue-400">
            2
          </div>
          <h5 className="font-medium text-gray-200">Auditor Requests</h5>
          <p className="mt-1 text-xs text-gray-400">
            Authorized auditor (tax authority, compliance) requests access with credentials.
          </p>
          <ArrowRight className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-gray-600 sm:block" />
        </div>

        {/* Step 3 */}
        <div className="rounded-lg bg-gray-800/50 p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-sm font-bold text-blue-400">
            3
          </div>
          <h5 className="font-medium text-gray-200">Selective Disclosure</h5>
          <p className="mt-1 text-xs text-gray-400">
            You share viewing key only for specific transactions. Public still sees nothing.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-blue-900/20 p-3">
        <p className="text-xs text-blue-300">
          <strong>Key benefit:</strong> Privacy from public + compliance when required. Best of both worlds.
        </p>
      </div>
    </div>
  )
}

// Icons
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

function EyeClosedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
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

function QuestionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
      />
    </svg>
  )
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  )
}
