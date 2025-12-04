'use client'

import { useState, useEffect } from 'react'
import type { SwapStatus } from '@/hooks'
import type { NetworkId } from '@/lib'
import { NETWORKS } from '@/lib'
import { TransactionTimeline } from './transaction-timeline'

interface TransactionStatusProps {
  status: SwapStatus
  /** Settlement transaction hash (destination chain - e.g., NEAR) */
  txHash: string | null
  /** Explorer URL for settlement transaction */
  explorerUrl: string | null
  /** Deposit transaction hash (source chain - e.g., Solana) */
  depositTxHash?: string | null
  /** Explorer URL for deposit transaction */
  depositExplorerUrl?: string | null
  /** Source chain (where deposit was made) */
  chain: NetworkId | null
  /** Destination chain (where settlement happened) */
  settlementChain?: NetworkId | null
  error: string | null
  isShielded: boolean
  isCompliant?: boolean
  viewingKey?: string | null
  /** Deposit address for production swaps (NEAR Intents) */
  depositAddress?: string | null
  /** Deposit amount (user-friendly string like "100 USDC") */
  depositAmount?: string | null
  /** Token symbol being deposited */
  depositToken?: string | null
  /** Estimated completion time in seconds */
  estimatedTime?: number
  /** Unique swap ID for tracking */
  swapId?: string | null
  onReset: () => void
  onRetry: () => void
  /** Cancel the current swap (before deposit) */
  onCancel?: () => void
}

/**
 * Transaction status display component
 * Shows pending, success, or error states with explorer links
 */
export function TransactionStatus({
  status,
  txHash,
  explorerUrl,
  depositTxHash,
  depositExplorerUrl,
  chain,
  settlementChain,
  error,
  isShielded,
  isCompliant = false,
  viewingKey,
  depositAddress,
  depositAmount,
  depositToken,
  estimatedTime = 60,
  swapId,
  onReset,
  onRetry,
  onCancel,
}: TransactionStatusProps) {
  const isSuccess = status === 'success'
  const isError = status === 'error'
  const isPending = status === 'confirming' || status === 'signing' || status === 'pending'
  const isProduction = status === 'awaiting_deposit' || status === 'processing'
  const [copied, setCopied] = useState(false)
  const [depositCopied, setDepositCopied] = useState(false)
  const [startedAt] = useState<number | null>(() => isPending || isProduction ? Date.now() : null)

  const copyViewingKey = async () => {
    if (viewingKey) {
      await navigator.clipboard.writeText(viewingKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const copyDepositAddress = async () => {
    if (depositAddress) {
      try {
        await navigator.clipboard.writeText(depositAddress)
        setDepositCopied(true)
        setTimeout(() => setDepositCopied(false), 2000)
      } catch {
        // Fallback for mobile - create temporary input
        const input = document.createElement('input')
        input.value = depositAddress
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        setDepositCopied(true)
        setTimeout(() => setDepositCopied(false), 2000)
      }
    }
  }

  if (!isPending && !isProduction && !isSuccess && !isError) {
    return null
  }

  // Get chain-specific explorer info
  const explorerName = chain ? getExplorerName(chain) : 'Explorer'
  const networkName = chain ? NETWORKS[chain].name : ''

  return (
    <div className="mb-4">
      {/* Pending State */}
      {isPending && (
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <SpinnerIcon className="h-10 w-10 animate-spin text-purple-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-purple-500/20" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium text-purple-300">
                {getStatusTitle(status, isShielded)}
              </p>
              <p className="text-sm text-purple-400/80">
                {getStatusDescription(status, isShielded)}
              </p>
            </div>
            {/* Cancel button (pre-deposit) */}
            {onCancel && status === 'confirming' && (
              <button
                onClick={onCancel}
                className="rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white"
                data-testid="cancel-swap-button"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Full transaction timeline */}
          <div className="mt-4 pt-4 border-t border-purple-500/20">
            <TransactionTimeline
              status={status}
              isShielded={isShielded}
              isProduction={false}
              startTime={startedAt || undefined}
            />
          </div>

          {/* Timer */}
          {startedAt && estimatedTime > 0 && (
            <TransactionTimer
              estimatedTime={estimatedTime}
              startedAt={startedAt}
              colorClass="purple"
            />
          )}
        </div>
      )}

      {/* Production Mode - Awaiting Deposit */}
      {status === 'awaiting_deposit' && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <SpinnerIcon className="h-10 w-10 animate-spin text-amber-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-amber-500/20" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium text-amber-300">Processing Deposit</p>
              <p className="text-sm text-amber-400/80">
                {depositAmount && depositToken
                  ? `Confirming ${depositAmount} ${depositToken} on-chain...`
                  : 'Waiting for deposit confirmation...'}
              </p>
            </div>
          </div>

          {/* Transaction Details - for transparency */}
          {depositAddress ? (
            <div className="mt-4 rounded-lg bg-amber-950/30 border border-amber-500/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-amber-200">
                  Transaction Details
                </p>
                <span className="text-xs text-amber-400/70 bg-amber-500/10 px-2 py-0.5 rounded">
                  {chain ? NETWORKS[chain]?.name : 'Origin Chain'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 rounded-lg p-3">
                <code className="flex-1 text-sm text-white font-mono break-all select-all">
                  {depositAddress}
                </code>
                <button
                  onClick={copyDepositAddress}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-amber-500/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Copy address"
                  title="Copy to clipboard"
                >
                  {depositCopied ? (
                    <CheckIcon className="h-5 w-5 text-green-400" />
                  ) : (
                    <CopyIcon className="h-5 w-5 text-amber-400" />
                  )}
                </button>
              </div>
              {depositCopied && (
                <p className="mt-2 text-xs text-green-400 text-center">
                  Address copied to clipboard!
                </p>
              )}

              {/* Amount info */}
              {depositAmount && depositToken && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-amber-400/70">Amount:</span>
                  <span className="font-medium text-white">
                    {depositAmount} {depositToken}
                  </span>
                </div>
              )}

              {/* Status info */}
              <div className="mt-3 flex items-start gap-2 text-xs text-amber-400/80">
                <SpinnerIcon className="h-4 w-4 flex-shrink-0 mt-0.5 animate-spin" />
                <div>
                  <p className="text-amber-300">Waiting for blockchain confirmation...</p>
                  <p className="mt-1 text-amber-400/60">This usually takes 15-30 seconds. Please keep this page open.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <WarningIcon className="h-4 w-4" />
                <span>Transaction details not available. Please try again.</span>
              </div>
            </div>
          )}

          {/* Full transaction timeline */}
          <div className="mt-4 pt-4 border-t border-amber-500/20">
            <TransactionTimeline
              status={status}
              isShielded={isShielded}
              isProduction={true}
              startTime={startedAt || undefined}
            />
          </div>
        </div>
      )}

      {/* Production Mode - Processing */}
      {status === 'processing' && (
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <SpinnerIcon className="h-10 w-10 animate-spin text-blue-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-blue-500/20" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-300">Processing Swap</p>
              <p className="text-sm text-blue-400/80">
                Your swap is being processed on NEAR
              </p>
            </div>
          </div>

          {/* Full transaction timeline */}
          <div className="mt-4 pt-4 border-t border-blue-500/20">
            <TransactionTimeline
              status={status}
              isShielded={isShielded}
              isProduction={true}
              startTime={startedAt || undefined}
            />
          </div>

          {/* Timer */}
          {startedAt && estimatedTime > 0 && (
            <TransactionTimer
              estimatedTime={estimatedTime}
              startedAt={startedAt}
              colorClass="blue"
            />
          )}
        </div>
      )}

      {/* Success State - with txHash or depositTxHash */}
      {isSuccess && (txHash || depositTxHash) && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
              <CheckIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-300">Swap Complete!</p>
              <p className="text-sm text-green-400/80">
                Your {isShielded ? 'shielded ' : ''}cross-chain swap has been processed
              </p>
            </div>
          </div>

          {/* Transaction links - show both source and destination */}
          <div className="mt-4 space-y-3">
            {/* Deposit Transaction (Source Chain - e.g., Solana) */}
            {depositTxHash && depositExplorerUrl && chain && (
              <div className="rounded-lg bg-green-500/10 p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-green-400/60 flex items-center gap-1">
                    <ExplorerIcon chain={chain} className="h-3 w-3" />
                    Source ({NETWORKS[chain]?.name || chain})
                  </p>
                </div>
                <p className="font-mono text-xs text-green-300 break-all mb-2">
                  {truncateHash(depositTxHash)}
                </p>
                <a
                  href={depositExplorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-green-500/20 px-3 py-1.5 text-xs font-medium text-green-300 transition-colors hover:bg-green-500/30"
                >
                  View on {getExplorerName(chain)}
                  <ExternalLinkIcon className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Settlement Transaction (Destination Chain - e.g., NEAR) */}
            {txHash && explorerUrl && settlementChain && (
              <div className="rounded-lg bg-cyan-500/10 p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-cyan-400/60 flex items-center gap-1">
                    <ExplorerIcon chain={settlementChain} className="h-3 w-3" />
                    Destination ({NETWORKS[settlementChain]?.name || settlementChain})
                  </p>
                </div>
                <p className="font-mono text-xs text-cyan-300 break-all mb-2">
                  {truncateHash(txHash)}
                </p>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-500/30"
                >
                  View on {getExplorerName(settlementChain)}
                  <ExternalLinkIcon className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Fallback: Show only deposit if no settlement hash */}
            {depositTxHash && depositExplorerUrl && chain && !txHash && !explorerUrl && (
              <p className="text-xs text-green-400/70 text-center">
                Settlement transaction will appear once NEAR confirms the swap
              </p>
            )}
          </div>

          <button
            onClick={onReset}
            className="mt-4 w-full rounded-lg border border-green-500/30 px-4 py-2 text-sm font-medium text-green-300 transition-colors hover:bg-green-500/10"
          >
            New Swap
          </button>
        </div>
      )}

      {/* Success State - shielded/compliant without txHash (privacy protected) */}
      {isSuccess && !txHash && !depositTxHash && isShielded && (
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
              {isCompliant ? (
                <KeyCheckIcon className="h-5 w-5 text-purple-400" />
              ) : (
                <ShieldCheckIcon className="h-5 w-5 text-purple-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-purple-300">
                {isCompliant ? 'Compliant Swap Complete!' : 'Shielded Swap Complete!'}
              </p>
              <p className="text-sm text-purple-400/80">
                {isCompliant
                  ? 'Your private transaction has been processed with viewing key for auditors.'
                  : 'Your private transaction has been processed. No public record exists.'}
              </p>
            </div>
          </div>

          {/* Privacy notice */}
          <div className="mt-3 rounded-lg bg-purple-500/10 px-3 py-2">
            <p className="text-xs text-purple-400/60">Privacy Status</p>
            <p className="text-sm text-purple-300">
              {isCompliant
                ? 'Transaction hidden, auditors can decrypt with viewing key'
                : 'Sender, amount, and recipient are hidden'}
            </p>
          </div>

          {/* Viewing Key for Compliant Mode */}
          {isCompliant && viewingKey && (
            <div className="mt-3 rounded-lg bg-purple-500/10 px-3 py-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-purple-400/60">Viewing Key (for auditors)</p>
                <button
                  onClick={copyViewingKey}
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-3 w-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-xs text-purple-300 break-all mt-1">
                {truncateHash(viewingKey)}
              </p>
            </div>
          )}

          <button
            onClick={onReset}
            className="mt-3 w-full rounded-lg border border-purple-500/30 px-4 py-2 text-sm font-medium text-purple-300 transition-colors hover:bg-purple-500/10"
          >
            New Swap
          </button>
        </div>
      )}

      {/* Success State - transparent without txHash (processed but no hash) */}
      {isSuccess && !txHash && !depositTxHash && !isShielded && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
              <CheckIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-300">Swap Complete!</p>
              <p className="text-sm text-green-400/80">
                Your transaction has been processed
                {networkName && ` on ${networkName}`}
              </p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="mt-3 w-full rounded-lg border border-green-500/30 px-4 py-2 text-sm font-medium text-green-300 transition-colors hover:bg-green-500/10"
          >
            New Swap
          </button>
        </div>
      )}

      {/* Error State */}
      {isError && error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
              <XIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-red-300">Transaction Failed</p>
              <p className="text-sm text-red-400/80">{error}</p>
            </div>
          </div>

          {/* Refund notice for post-deposit failures */}
          {depositAddress && (
            <div className="mt-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
              <div className="flex items-start gap-2">
                <RefundIcon className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-300">About Your Deposit</p>
                  <p className="text-amber-400/80 mt-1">
                    If you already sent funds, they will be automatically refunded to your wallet within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recovery Actions */}
          <div className="mt-4 space-y-2">
            <button
              onClick={onRetry}
              className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500"
              data-testid="retry-swap-button"
            >
              Retry Swap
            </button>
            <button
              onClick={onReset}
              className="w-full rounded-lg border border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
              data-testid="new-swap-button"
            >
              Start New Swap
            </button>
            <a
              href="https://discord.gg/sip-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              data-testid="get-help-button"
            >
              <HelpIcon className="h-4 w-4" />
              Get Help
            </a>
          </div>

          {/* Transaction ID for support */}
          {swapId && (
            <div className="mt-4 pt-3 border-t border-red-500/20">
              <p className="text-xs text-gray-500">
                Transaction ID: <span className="font-mono text-gray-400">{swapId}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


/**
 * Live countdown timer with progress bar
 */
function TransactionTimer({
  estimatedTime,
  startedAt,
  colorClass = 'purple',
}: {
  estimatedTime: number
  startedAt: number
  colorClass?: 'purple' | 'amber' | 'blue'
}) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt])

  const remaining = Math.max(0, estimatedTime - elapsed)
  const progress = Math.min(100, (elapsed / estimatedTime) * 100)
  const isOvertime = elapsed > estimatedTime

  const colors = {
    purple: {
      bar: 'bg-purple-500',
      track: 'bg-purple-500/20',
      text: 'text-purple-400',
      overtime: 'text-yellow-400',
    },
    amber: {
      bar: 'bg-amber-500',
      track: 'bg-amber-500/20',
      text: 'text-amber-400',
      overtime: 'text-yellow-400',
    },
    blue: {
      bar: 'bg-blue-500',
      track: 'bg-blue-500/20',
      text: 'text-blue-400',
      overtime: 'text-yellow-400',
    },
  }

  const c = colors[colorClass]

  return (
    <div className="mt-3">
      {/* Progress bar */}
      <div className={`w-full h-1.5 rounded-full ${c.track}`}>
        <div
          className={`h-1.5 rounded-full transition-all duration-1000 ${isOvertime ? 'bg-yellow-500 animate-pulse' : c.bar}`}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>

      {/* Time display */}
      <div className="flex items-center justify-between mt-2 text-xs">
        <span className={c.text}>
          {formatTimerDuration(elapsed)} elapsed
        </span>
        <span className={isOvertime ? c.overtime : c.text}>
          {isOvertime ? (
            <span className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              Taking longer than expected...
            </span>
          ) : (
            `~${formatTimerDuration(remaining)} remaining`
          )}
        </span>
      </div>

      {/* Overtime warning with help options */}
      {isOvertime && elapsed > estimatedTime * 1.5 && (
        <div className="mt-2 bg-yellow-500/10 rounded-lg p-3" data-testid="stuck-transaction-warning">
          <p className="text-xs text-yellow-400/80">
            Don&apos;t worry, your transaction is still processing. Cross-chain swaps can sometimes take longer during high network activity.
          </p>
          {elapsed > estimatedTime * 2 && (
            <div className="mt-2 flex gap-2">
              <a
                href="https://discord.gg/sip-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center rounded bg-yellow-500/20 px-2 py-1.5 text-xs font-medium text-yellow-300 transition-colors hover:bg-yellow-500/30"
                data-testid="stuck-get-help"
              >
                Get Help
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatTimerDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins < 60) return `${mins}m ${secs}s`
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  return `${hours}h ${remainingMins}m`
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function getStatusTitle(status: SwapStatus, isShielded: boolean): string {
  switch (status) {
    case 'confirming':
      return 'Preparing Transaction'
    case 'signing':
      return 'Awaiting Signature'
    case 'pending':
      return isShielded ? 'Shielding Transaction' : 'Processing Transaction'
    case 'awaiting_deposit':
      return 'Awaiting Deposit'
    case 'processing':
      return 'Processing Swap'
    default:
      return ''
  }
}

function getStatusDescription(status: SwapStatus, isShielded: boolean): string {
  switch (status) {
    case 'confirming':
      return 'Building your swap intent...'
    case 'signing':
      return 'Please sign the transaction in your wallet'
    case 'pending':
      return isShielded
        ? 'Applying privacy protections to your transaction...'
        : 'Submitting to the network...'
    case 'awaiting_deposit':
      return 'Confirming your deposit on-chain...'
    case 'processing':
      return 'Your swap is being processed on NEAR'
    default:
      return ''
  }
}

function getExplorerName(chain: NetworkId): string {
  switch (chain) {
    case 'solana':
      return 'Solscan'
    case 'ethereum':
      return 'Etherscan'
    case 'arbitrum':
      return 'Arbiscan'
    case 'near':
      return 'NEARBlocks'
    case 'zcash':
      return 'Zcash Explorer'
    default:
      return 'Explorer'
  }
}

function truncateHash(hash: string): string {
  if (hash.length <= 20) return hash
  return `${hash.slice(0, 10)}...${hash.slice(-10)}`
}

function ExplorerIcon({ chain, className }: { chain: NetworkId; className?: string }) {
  // Simple icon indicators for different explorers
  switch (chain) {
    case 'solana':
      return <span className={className}>◎</span>
    case 'ethereum':
      return <span className={className}>Ξ</span>
    case 'arbitrum':
      return <span className={className}>⬡</span>
    case 'near':
      return <span className={className}>Ⓝ</span>
    case 'zcash':
      return <span className={className}>ⓩ</span>
    default:
      return null
  }
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ShieldCheckIcon({ className }: { className?: string }) {
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

function KeyCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l2 2" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
  )
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}

function RefundIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
  )
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  )
}
