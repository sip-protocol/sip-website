'use client'

import { useState, useEffect, useCallback } from 'react'
import { PrivacyLevel } from '@sip-protocol/types'

/**
 * Lightweight viewing key generation for demo purposes
 *
 * Uses Web Crypto API to generate demo viewing keys without
 * pulling in heavy SDK dependencies (barretenberg/noir).
 *
 * In production, use @sip-protocol/sdk's generateViewingKey functions.
 */
async function generateDemoViewingKey(): Promise<{
  key: string
  hash: string
}> {
  // Generate random 32 bytes for the viewing key
  const keyBytes = new Uint8Array(32)
  crypto.getRandomValues(keyBytes)

  // Convert to hex
  const toHex = (bytes: Uint8Array) =>
    '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')

  const key = toHex(keyBytes)

  // Generate hash using SubtleCrypto
  const hashBuffer = await crypto.subtle.digest('SHA-256', keyBytes)
  const hash = toHex(new Uint8Array(hashBuffer))

  return { key, hash }
}

interface ViewingKeyDisplayProps {
  /** Current privacy level */
  privacyLevel: PrivacyLevel
  /** Transaction ID (for key derivation path) */
  transactionId?: string
}

/**
 * Truncate key for display
 */
function truncateKey(key: string, startChars = 10, endChars = 8): string {
  if (key.length <= startChars + endChars + 3) return key
  return `${key.slice(0, startChars)}...${key.slice(-endChars)}`
}

/**
 * Format viewing key for export
 */
function formatViewingKeyForExport(key: string, hash: string, timestamp: number) {
  return {
    format: 'sip-viewing-key-v1',
    key,
    hash,
    generatedAt: new Date(timestamp).toISOString(),
    warning: 'Anyone with this key can view the transaction details. Share only with authorized auditors.',
  }
}

/**
 * Viewing Key Display Component
 *
 * Shows viewing key information for compliant mode swaps.
 * Allows users to copy or download the viewing key for auditors.
 */
export function ViewingKeyDisplay({
  privacyLevel,
  transactionId,
}: ViewingKeyDisplayProps) {
  const [viewingKey, setViewingKey] = useState<string | null>(null)
  const [keyHash, setKeyHash] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [showKey, setShowKey] = useState(false)

  const isCompliant = privacyLevel === PrivacyLevel.COMPLIANT

  // Generate viewing key when component mounts in compliant mode
  useEffect(() => {
    if (!isCompliant) {
      setViewingKey(null)
      setKeyHash(null)
      setGeneratedAt(null)
      return
    }

    generateDemoViewingKey()
      .then(({ key, hash }) => {
        setViewingKey(key)
        setKeyHash(hash)
        setGeneratedAt(Date.now())
      })
      .catch(() => {
        setViewingKey(null)
        setKeyHash(null)
      })
  }, [isCompliant, transactionId])

  const handleCopy = useCallback(async () => {
    if (!viewingKey) return
    try {
      await navigator.clipboard.writeText(viewingKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }, [viewingKey])

  const handleDownload = useCallback(() => {
    if (!viewingKey || !keyHash || !generatedAt) return

    const exportData = formatViewingKeyForExport(viewingKey, keyHash, generatedAt)
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `sip-viewing-key-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [viewingKey, keyHash, generatedAt])

  // Only show for compliant mode
  if (!isCompliant || !viewingKey) {
    return null
  }

  return (
    <div
      className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4"
      data-testid="viewing-key-display"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KeyIcon className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-300">Viewing Key</span>
          <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-400">
            Compliant Mode
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mb-3 text-sm text-amber-400/80">
        Your transaction is private, but you can share this viewing key with authorized auditors
        to prove compliance.
      </p>

      {/* Viewing Key Display */}
      <div className="rounded-lg bg-gray-900/50 p-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-gray-500">Your viewing key:</span>
          <button
            onClick={() => setShowKey(!showKey)}
            className="text-xs text-amber-400 hover:text-amber-300"
          >
            {showKey ? 'Hide' : 'Reveal'}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 break-all font-mono text-sm text-white">
            {showKey ? truncateKey(viewingKey, 14, 10) : '••••••••••••••••••••••••••••••••'}
          </code>
          <button
            onClick={handleCopy}
            className="rounded-lg p-2 text-amber-400 transition-colors hover:bg-amber-500/20 hover:text-amber-300"
            title="Copy viewing key"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-400" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={handleDownload}
            className="rounded-lg p-2 text-amber-400 transition-colors hover:bg-amber-500/20 hover:text-amber-300"
            title="Download as JSON"
          >
            <DownloadIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Key Hash (for verification) */}
      {keyHash && (
        <div className="mt-3 text-xs text-gray-500">
          <span className="text-gray-600">Key fingerprint: </span>
          <code className="font-mono text-gray-400">{truncateKey(keyHash, 8, 6)}</code>
        </div>
      )}

      {/* Warning */}
      <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2">
        <WarningIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
        <div className="text-xs text-amber-400/90">
          <strong>Warning:</strong> Anyone with this key can view this transaction&apos;s details,
          including sender, amount, and recipient. Only share with authorized parties.
        </div>
      </div>

      {/* What viewing key reveals */}
      <div className="mt-3 space-y-1 text-xs text-gray-500">
        <div className="font-medium text-gray-400">This key reveals:</div>
        <ul className="ml-4 list-disc space-y-0.5">
          <li>Transaction amount</li>
          <li>Sender address</li>
          <li>Recipient address</li>
          <li>Transaction timestamp</li>
        </ul>
      </div>
    </div>
  )
}

// Icons

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

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
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
