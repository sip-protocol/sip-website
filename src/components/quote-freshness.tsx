'use client'

import { useCallback } from 'react'
import type { QuoteFreshness } from '@/hooks'

interface QuoteFreshnessIndicatorProps {
  /** Current freshness status */
  freshness: QuoteFreshness
  /** Seconds until expiry */
  expiresIn: number | null
  /** Whether quote is currently loading/refreshing */
  isLoading: boolean
  /** Whether auto-refresh is enabled */
  autoRefreshEnabled: boolean
  /** Callback to refresh quote */
  onRefresh: () => void
  /** Callback to toggle auto-refresh */
  onToggleAutoRefresh: (enabled: boolean) => void
  /** Compact display mode */
  compact?: boolean
}

/**
 * QuoteFreshnessIndicator - Shows quote freshness status with countdown and refresh controls
 */
export function QuoteFreshnessIndicator({
  freshness,
  expiresIn,
  isLoading,
  autoRefreshEnabled,
  onRefresh,
  onToggleAutoRefresh,
  compact = false,
}: QuoteFreshnessIndicatorProps) {
  const handleRefresh = useCallback(() => {
    if (!isLoading) {
      onRefresh()
    }
  }, [isLoading, onRefresh])

  const toggleAutoRefresh = useCallback(() => {
    onToggleAutoRefresh(!autoRefreshEnabled)
  }, [autoRefreshEnabled, onToggleAutoRefresh])

  // Color classes based on freshness
  const colorClass = {
    fresh: 'text-green-400',
    stale: 'text-amber-400',
    expired: 'text-red-400',
  }[freshness]

  const bgClass = {
    fresh: 'bg-green-500/10 border-green-500/30',
    stale: 'bg-amber-500/10 border-amber-500/30',
    expired: 'bg-red-500/10 border-red-500/30',
  }[freshness]

  const dotClass = {
    fresh: 'bg-green-400',
    stale: 'bg-amber-400',
    expired: 'bg-red-400',
  }[freshness]

  const statusText = {
    fresh: 'Quote fresh',
    stale: 'Quote stale',
    expired: 'Quote expired',
  }[freshness]

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* Status indicator */}
        <div className={`flex items-center gap-1.5 ${colorClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotClass} ${freshness === 'fresh' ? 'animate-pulse' : ''}`} />
          {expiresIn !== null && expiresIn > 0 && (
            <span className="text-xs font-mono">{expiresIn}s</span>
          )}
        </div>

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={`p-1 rounded transition-colors ${
            isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-700/50'
          }`}
          title={isLoading ? 'Refreshing...' : 'Refresh quote'}
        >
          <RefreshIcon className={`h-3.5 w-3.5 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-between rounded-lg border px-3 py-2 ${bgClass}`}>
      {/* Status */}
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotClass} ${freshness === 'fresh' ? 'animate-pulse' : ''}`} />
        <span className={`text-sm ${colorClass}`}>
          {statusText}
          {expiresIn !== null && expiresIn > 0 && (
            <span className="font-mono ml-1">({expiresIn}s)</span>
          )}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Auto-refresh toggle */}
        <button
          onClick={toggleAutoRefresh}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            autoRefreshEnabled ? 'text-green-400' : 'text-gray-500'
          } hover:text-white`}
          title={autoRefreshEnabled ? 'Disable auto-refresh' : 'Enable auto-refresh'}
        >
          <AutoRefreshIcon className="h-3.5 w-3.5" />
          Auto
        </button>

        {/* Manual refresh */}
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors ${
            isLoading
              ? 'text-gray-500 cursor-not-allowed'
              : freshness === 'expired'
                ? 'text-red-300 bg-red-500/20 hover:bg-red-500/30'
                : 'text-gray-300 hover:bg-gray-700/50'
          }`}
        >
          <RefreshIcon className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </div>
  )
}

/**
 * Inline quote status for the swap card
 */
export function QuoteStatusBadge({
  freshness,
  expiresIn,
  isLoading,
  onRefresh,
}: {
  freshness: QuoteFreshness
  expiresIn: number | null
  isLoading: boolean
  onRefresh: () => void
}) {
  if (freshness === 'fresh' && !isLoading) {
    return null // Don't show anything when fresh
  }

  const colorClass = {
    fresh: 'text-green-400',
    stale: 'text-amber-400',
    expired: 'text-red-400',
  }[freshness]

  return (
    <button
      onClick={onRefresh}
      disabled={isLoading}
      className={`flex items-center gap-1.5 text-xs ${colorClass} hover:opacity-80 transition-opacity`}
    >
      {isLoading ? (
        <>
          <RefreshIcon className="h-3 w-3 animate-spin" />
          <span>Updating...</span>
        </>
      ) : freshness === 'stale' ? (
        <>
          <WarningIcon className="h-3 w-3" />
          <span>Stale ({expiresIn}s)</span>
        </>
      ) : freshness === 'expired' ? (
        <>
          <RefreshIcon className="h-3 w-3" />
          <span>Refresh quote</span>
        </>
      ) : null}
    </button>
  )
}

// Icons

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  )
}

function AutoRefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
      />
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
