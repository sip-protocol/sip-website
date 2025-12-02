'use client'

import { useState, useEffect } from 'react'
import type { SwapStatus } from '@/hooks'
import type { NetworkId } from '@/lib'
import { NETWORKS } from '@/lib'

interface TransactionStatusProps {
  status: SwapStatus
  txHash: string | null
  explorerUrl: string | null
  chain: NetworkId | null
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
  onReset: () => void
  onRetry: () => void
}

/**
 * Transaction status display component
 * Shows pending, success, or error states with explorer links
 */
export function TransactionStatus({
  status,
  txHash,
  explorerUrl,
  chain,
  error,
  isShielded,
  isCompliant = false,
  viewingKey,
  depositAddress,
  depositAmount,
  depositToken,
  estimatedTime = 60,
  onReset,
  onRetry,
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
          </div>

          {/* Progress steps */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <StatusStep
              label="Prepare"
              isActive={status === 'confirming'}
              isComplete={status !== 'confirming'}
            />
            <StatusDivider isComplete={status !== 'confirming'} />
            <StatusStep
              label="Sign"
              isActive={status === 'signing'}
              isComplete={status === 'pending'}
            />
            <StatusDivider isComplete={status === 'pending'} />
            <StatusStep
              label={isShielded ? 'Shield' : 'Submit'}
              isActive={status === 'pending'}
              isComplete={false}
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
              <p className="font-medium text-amber-300">Awaiting Deposit</p>
              <p className="text-sm text-amber-400/80">
                {depositAmount && depositToken
                  ? `Send ${depositAmount} ${depositToken} to complete your swap`
                  : 'Send tokens to the deposit address to complete swap'}
              </p>
            </div>
          </div>

          {/* Deposit Address - CRITICAL for user to complete swap */}
          {depositAddress ? (
            <div className="mt-4 rounded-lg bg-amber-950/30 border border-amber-500/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-amber-200">
                  Deposit Address
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
                  aria-label="Copy deposit address"
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

              {/* Amount reminder */}
              {depositAmount && depositToken && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-amber-400/70">Amount to send:</span>
                  <span className="font-medium text-white">
                    {depositAmount} {depositToken}
                  </span>
                </div>
              )}

              {/* Warning / Instructions */}
              <div className="mt-3 flex items-start gap-2 text-xs text-amber-400/80">
                <WarningIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-300">Important:</p>
                  <ul className="mt-1 space-y-0.5 list-disc list-inside">
                    <li>Send exact amount to avoid issues</li>
                    <li>Swap will complete automatically after deposit confirms</li>
                    <li>Do not close this page until complete</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <WarningIcon className="h-4 w-4" />
                <span>Deposit address not available. Please try again.</span>
              </div>
            </div>
          )}

          {/* Production progress steps */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <StatusStep label="Intent" isActive={false} isComplete={true} />
            <StatusDivider isComplete={true} />
            <StatusStep label="Deposit" isActive={true} isComplete={false} />
            <StatusDivider isComplete={false} />
            <StatusStep label="Settle" isActive={false} isComplete={false} />
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

          {/* Production progress steps */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <StatusStep label="Intent" isActive={false} isComplete={true} />
            <StatusDivider isComplete={true} />
            <StatusStep label="Deposit" isActive={false} isComplete={true} />
            <StatusDivider isComplete={true} />
            <StatusStep label="Settle" isActive={true} isComplete={false} />
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

      {/* Success State - with txHash */}
      {isSuccess && txHash && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
              <CheckIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-300">Transaction Submitted!</p>
              <p className="text-sm text-green-400/80">
                Your {isShielded ? 'shielded ' : ''}swap is being processed
                {networkName && ` on ${networkName}`}
              </p>
            </div>
          </div>

          {/* Transaction hash */}
          <div className="mt-3 rounded-lg bg-green-500/10 px-3 py-2">
            <p className="text-xs text-green-400/60">Transaction Hash</p>
            <p className="font-mono text-sm text-green-300 break-all">
              {truncateHash(txHash)}
            </p>
          </div>

          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-green-500/20 px-4 py-2 text-sm font-medium text-green-300 transition-colors hover:bg-green-500/30"
            >
              {chain && <ExplorerIcon chain={chain} className="h-4 w-4" />}
              View on {explorerName}
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={onReset}
            className="mt-2 w-full rounded-lg border border-green-500/30 px-4 py-2 text-sm font-medium text-green-300 transition-colors hover:bg-green-500/10"
          >
            New Swap
          </button>
        </div>
      )}

      {/* Success State - shielded/compliant without txHash (privacy protected) */}
      {isSuccess && !txHash && isShielded && (
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
      {isSuccess && !txHash && !isShielded && (
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
          <button
            onClick={onRetry}
            className="mt-3 w-full rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

function StatusStep({
  label,
  isActive,
  isComplete,
}: {
  label: string
  isActive: boolean
  isComplete: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
          isComplete
            ? 'bg-purple-500 text-white'
            : isActive
              ? 'border-2 border-purple-500 text-purple-400'
              : 'border border-purple-500/30 text-purple-500/50'
        }`}
      >
        {isComplete ? <CheckIcon className="h-3 w-3" /> : null}
      </div>
      <span
        className={`${
          isActive ? 'text-purple-300' : isComplete ? 'text-purple-400' : 'text-purple-500/50'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

function StatusDivider({ isComplete }: { isComplete: boolean }) {
  return (
    <div
      className={`h-0.5 flex-1 mx-2 ${isComplete ? 'bg-purple-500' : 'bg-purple-500/30'}`}
    />
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

      {/* Overtime warning */}
      {isOvertime && elapsed > estimatedTime * 1.5 && (
        <p className="mt-2 text-xs text-yellow-400/80 bg-yellow-500/10 rounded-lg px-2 py-1.5">
          Don&apos;t worry, your transaction is still processing. Cross-chain swaps can sometimes take longer during high network activity.
        </p>
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
      return 'Send tokens to the deposit address to complete swap'
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
