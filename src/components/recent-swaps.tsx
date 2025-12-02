'use client'

import { PrivacyLevel } from '@sip-protocol/types'
import { useSwapHistoryStore, type SwapRecord } from '@/stores/swap-history-store'

/**
 * Recent Swaps History Component
 *
 * Displays user's recent swap history with status indicators.
 * Data persisted in localStorage via Zustand.
 */
export function RecentSwaps() {
  const { swaps } = useSwapHistoryStore()

  if (swaps.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center">
        <ClockIcon className="mx-auto mb-2 h-8 w-8 text-gray-600" />
        <p className="text-sm text-gray-400">No recent swaps</p>
        <p className="mt-1 text-xs text-gray-500">
          Your swap history will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      <h4 className="mb-3 text-sm font-medium text-gray-300">Recent Swaps</h4>
      <div className="space-y-2">
        {swaps.slice(0, 5).map((swap) => (
          <SwapHistoryItem key={swap.id} swap={swap} />
        ))}
      </div>
    </div>
  )
}

function SwapHistoryItem({ swap }: { swap: SwapRecord }) {
  const isShielded = swap.privacyLevel !== PrivacyLevel.TRANSPARENT

  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-800/50 p-3">
      <div className="flex items-center gap-3">
        {/* Token pair */}
        <div className="flex items-center text-sm">
          <span className="font-medium text-white">{swap.fromToken}</span>
          <ArrowRightIcon className="mx-1.5 h-3 w-3 text-gray-500" />
          <span className="font-medium text-white">{swap.toToken}</span>
        </div>

        {/* Privacy indicator */}
        {isShielded && (
          <span className="flex items-center gap-1 rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] text-purple-400">
            <ShieldIcon className="h-2.5 w-2.5" />
            {swap.privacyLevel === PrivacyLevel.COMPLIANT ? 'Compliant' : 'Shielded'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Amount */}
        <div className="text-right">
          <p className="text-xs text-gray-400">
            {swap.fromAmount} → {swap.toAmount}
          </p>
          <p className="text-[10px] text-gray-500">
            {formatRelativeTime(swap.timestamp)}
          </p>
        </div>

        {/* Status badge */}
        <StatusBadge status={swap.status} />

        {/* Explorer link */}
        {swap.explorerUrl && (
          <a
            href={swap.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            title="View on explorer"
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: SwapRecord['status'] }) {
  const config = {
    pending: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      label: 'Pending',
    },
    completed: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      label: 'Complete',
    },
    failed: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      label: 'Failed',
    },
  }

  const { bg, text, label } = config[status]

  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${bg} ${text}`}>
      {label}
    </span>
  )
}

function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

  return new Date(timestamp).toLocaleDateString()
}

// Icons

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
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

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  )
}
