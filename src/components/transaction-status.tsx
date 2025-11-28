'use client'

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
  onReset,
  onRetry,
}: TransactionStatusProps) {
  const isSuccess = status === 'success'
  const isError = status === 'error'
  const isPending = status === 'confirming' || status === 'signing' || status === 'pending'

  if (!isPending && !isSuccess && !isError) {
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

      {/* Success State - shielded without txHash (privacy protected) */}
      {isSuccess && !txHash && isShielded && (
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
              <ShieldCheckIcon className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-purple-300">Shielded Swap Complete!</p>
              <p className="text-sm text-purple-400/80">
                Your private transaction has been processed. No public record exists.
              </p>
            </div>
          </div>

          {/* Privacy notice */}
          <div className="mt-3 rounded-lg bg-purple-500/10 px-3 py-2">
            <p className="text-xs text-purple-400/60">Privacy Status</p>
            <p className="text-sm text-purple-300">
              Sender, amount, and recipient are hidden
            </p>
          </div>

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

function getStatusTitle(status: SwapStatus, isShielded: boolean): string {
  switch (status) {
    case 'confirming':
      return 'Preparing Transaction'
    case 'signing':
      return 'Awaiting Signature'
    case 'pending':
      return isShielded ? 'Shielding Transaction' : 'Processing Transaction'
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
    case 'near':
      return 'NEARBlocks'
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
    case 'near':
      return <span className={className}>Ⓝ</span>
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
