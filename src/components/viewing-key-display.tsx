'use client'

import { useState, useEffect, useCallback } from 'react'
import { PrivacyLevel } from '@sip-protocol/types'

// Dynamic SDK import to avoid WASM loading during SSG
const loadSDK = () => import('@sip-protocol/sdk')

// Check if this is user's first viewing key
const STORAGE_KEY = 'sip-viewing-key-seen'
function hasSeenViewingKeyGuide(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(STORAGE_KEY) === 'true'
}
function markViewingKeyGuideSeen(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, 'true')
}

/**
 * Generate real viewing key using @sip-protocol/sdk
 *
 * Creates a cryptographic viewing key with:
 * - Secure random key generation
 * - SHA-256 hash for on-chain reference
 * - Optional derivation path for hierarchical key management
 */
async function generateRealViewingKey(transactionId?: string): Promise<{
  key: string
  hash: string
  path: string
}> {
  const sdk = await loadSDK()

  // Generate viewing key with optional transaction-based path
  const path = transactionId ? `tx/${transactionId}` : `swap/${Date.now()}`
  const viewingKey = sdk.generateViewingKey(path)

  return {
    key: viewingKey.key,
    hash: viewingKey.hash,
    path: viewingKey.path,
  }
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
function formatViewingKeyForExport(key: string, hash: string, path: string | null, timestamp: number) {
  return {
    format: 'sip-viewing-key-v1',
    key,
    hash,
    path: path || 'root',
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
  const [keyPath, setKeyPath] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const isCompliant = privacyLevel === PrivacyLevel.COMPLIANT

  // Generate viewing key using real SDK when component mounts in compliant mode
  useEffect(() => {
    if (!isCompliant) {
      setViewingKey(null)
      setKeyHash(null)
      setKeyPath(null)
      setGeneratedAt(null)
      setConfirmed(false)
      return
    }

    generateRealViewingKey(transactionId)
      .then(({ key, hash, path }) => {
        setViewingKey(key)
        setKeyHash(hash)
        setKeyPath(path)
        setGeneratedAt(Date.now())
        // Show guide on first viewing key generation
        if (!hasSeenViewingKeyGuide()) {
          setShowGuide(true)
        }
      })
      .catch((err) => {
        // Expected failure: SDK not loaded - clear state for retry
        console.debug('[Viewing Key] Generation failed:', err instanceof Error ? err.message : 'Unknown error')
        setViewingKey(null)
        setKeyHash(null)
        setKeyPath(null)
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

    const exportData = formatViewingKeyForExport(viewingKey, keyHash, keyPath, generatedAt)
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `sip-viewing-key-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [viewingKey, keyHash, keyPath, generatedAt])

  // Download as human-readable text file
  const handleDownloadText = useCallback(() => {
    if (!viewingKey || !keyHash || !generatedAt) return

    const content = `SIP Protocol Viewing Key
========================

Key:        ${viewingKey}
Fingerprint: ${keyHash}
Generated:  ${new Date(generatedAt).toISOString()}

IMPORTANT - KEEP THIS FILE SECURE
─────────────────────────────────
This key grants read-only access to your transaction details.

What this key reveals:
• Transaction amount
• Sender address
• Recipient address
• Transaction timestamp

Security recommendations:
• Store in a password manager (1Password, Bitwarden, etc.)
• Keep offline backup in secure location
• Share ONLY with authorized auditors or tax advisors
• Never share publicly or in unsecured channels

This file format: sip-viewing-key-v1
`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `sip-viewing-key-${keyHash?.slice(0, 8) || Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [viewingKey, keyHash, generatedAt])

  const handleCloseGuide = useCallback(() => {
    if (confirmed) {
      markViewingKeyGuideSeen()
      setShowGuide(false)
    }
  }, [confirmed])

  // Only show for compliant mode
  if (!isCompliant || !viewingKey) {
    return null
  }

  return (
    <>
      {/* First-time Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" data-testid="viewing-key-guide-modal">
          <div className="max-w-md w-full rounded-2xl border border-amber-500/30 bg-gray-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
                <KeyIcon className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Your Viewing Key</h3>
            </div>

            <p className="mb-4 text-sm text-gray-300">
              This key allows authorized auditors to see your transaction history{' '}
              <strong className="text-amber-400">without accessing your funds</strong>.
            </p>

            <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-400">
                <WarningIcon className="h-4 w-4" />
                Important
              </h4>
              <ul className="space-y-1 text-xs text-amber-300/90">
                <li>• Save this key somewhere secure (password manager recommended)</li>
                <li>• You&apos;ll need it for tax reporting or compliance audits</li>
                <li>• Lost keys cannot be recovered</li>
                <li>• Share only with trusted auditors</li>
              </ul>
            </div>

            <div className="mb-4 rounded-lg bg-gray-800/50 p-3">
              <h4 className="mb-2 text-xs font-medium text-gray-400">Recommended storage:</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li>• <strong>Password manager</strong> (1Password, Bitwarden)</li>
                <li>• <strong>Encrypted backup</strong> on external drive</li>
                <li>• <strong>Secure note</strong> in banking app</li>
              </ul>
            </div>

            <div className="mb-4 flex gap-2">
              <button
                onClick={handleDownloadText}
                className="flex-1 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Download as file
              </button>
              <button
                onClick={handleCopy}
                className="flex-1 rounded-lg border border-amber-500/30 px-4 py-2.5 text-sm font-medium text-amber-400 hover:bg-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {copied ? 'Copied!' : 'Copy to clipboard'}
              </button>
            </div>

            <label className="mb-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-300">
                I&apos;ve saved my viewing key securely
              </span>
            </label>

            <button
              onClick={handleCloseGuide}
              disabled={!confirmed}
              className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                confirmed
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'cursor-not-allowed bg-gray-700 text-gray-500'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

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
          <button
            onClick={() => setShowGuide(true)}
            className="text-xs text-amber-400/70 hover:text-amber-400"
          >
            Learn more
          </button>
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
              className="min-h-[44px] rounded px-2 text-xs text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 active:bg-amber-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {showKey ? 'Hide' : 'Reveal'}
            </button>
          </div>
          <div className="flex items-center gap-1">
            <code className="min-w-0 flex-1 break-all font-mono text-sm text-white">
              {showKey ? truncateKey(viewingKey, 14, 10) : '••••••••••••••••••••••••••••••••'}
            </code>
            <button
              onClick={handleCopy}
              className="min-h-[44px] min-w-[44px] rounded-lg p-2 text-amber-400 transition-colors hover:bg-amber-500/20 hover:text-amber-300 active:bg-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-500"
              title="Copy viewing key"
            >
              {copied ? (
                <CheckIcon className="h-5 w-5 text-green-400" />
              ) : (
                <CopyIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={handleDownloadText}
              className="min-h-[44px] min-w-[44px] rounded-lg p-2 text-amber-400 transition-colors hover:bg-amber-500/20 hover:text-amber-300 active:bg-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-500"
              title="Download as text file"
            >
              <DownloadIcon className="h-5 w-5" />
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

        {/* Secure Storage Recommendations */}
        <div className="mt-3 rounded-lg bg-gray-800/30 p-2">
          <div className="flex items-center gap-2 text-xs">
            <ShieldLockIcon className="h-3.5 w-3.5 text-green-400" />
            <span className="font-medium text-gray-400">Store securely:</span>
            <span className="text-gray-500">Password manager, encrypted backup, or secure note</span>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2">
          <WarningIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
          <div className="text-xs text-amber-400/90">
            <strong>Warning:</strong> Anyone with this key can view this transaction&apos;s details.
            Only share with authorized auditors or tax advisors.
          </div>
        </div>
      </div>
    </>
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

function ShieldLockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  )
}
