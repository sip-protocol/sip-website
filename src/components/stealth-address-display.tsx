'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { PrivacyLevel } from '@sip-protocol/types'
import type { ChainId } from '@sip-protocol/types'
import type { NetworkId } from '@/lib'

// Dynamic SDK import to avoid WASM loading during SSG
const loadSDK = () => import('@sip-protocol/sdk')

/**
 * Simple Tooltip Component
 * Shows on hover with keyboard accessibility
 */
function Tooltip({
  content,
  children,
  side = 'top',
}: {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'bottom'
}) {
  const [isVisible, setIsVisible] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`absolute z-50 w-64 p-3 rounded-lg bg-gray-800 border border-gray-700 shadow-xl text-sm ${
            side === 'top'
              ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
              : 'top-full mt-2 left-1/2 -translate-x-1/2'
          }`}
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 border-gray-700 transform rotate-45 ${
              side === 'top'
                ? 'top-full -mt-1 border-r border-b'
                : 'bottom-full -mb-1 border-l border-t'
            }`}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Determine the curve type for a chain
 *
 * ed25519: Solana, NEAR (native chain curve)
 * secp256k1: Ethereum, Zcash, Arbitrum (EVM and Bitcoin-derived)
 *
 * SDK fully supports both curves with dedicated functions:
 * - generateEd25519StealthMetaAddress() for Solana/NEAR
 * - generateStealthMetaAddress() for EVM chains
 */
function getCurveForChain(chain: NetworkId): 'ed25519' | 'secp256k1' {
  if (chain === 'solana' || chain === 'near') {
    return 'ed25519'
  }
  return 'secp256k1'
}

/**
 * Generate real stealth address using @sip-protocol/sdk
 *
 * Uses the appropriate curve based on target chain:
 * - ed25519 for Solana/NEAR (native chain curve)
 * - secp256k1 for EVM chains (EIP-5564 compatible)
 */
async function generateRealStealthAddress(chain: NetworkId): Promise<{
  stealthAddress: string
  ephemeralKey: string
  curve: 'secp256k1' | 'ed25519'
}> {
  const sdk = await loadSDK()

  const curve = getCurveForChain(chain)
  const isEd25519 = curve === 'ed25519'

  // Generate stealth meta-address using appropriate curve
  const { metaAddress } = isEd25519
    ? sdk.generateEd25519StealthMetaAddress(chain as ChainId)
    : sdk.generateStealthMetaAddress(chain as ChainId)

  // Derive an actual stealth address from the meta-address
  const { stealthAddress } = isEd25519
    ? sdk.generateEd25519StealthAddress(metaAddress)
    : sdk.generateStealthAddress(metaAddress)

  return {
    stealthAddress: stealthAddress.address,
    ephemeralKey: stealthAddress.ephemeralPublicKey,
    curve,
  }
}

interface StealthAddressDisplayProps {
  /** Destination chain */
  toChain: NetworkId
  /** Current privacy level */
  privacyLevel: PrivacyLevel
  /** Show only when enabled (default: true) */
  showOnlyWhenPrivate?: boolean
  /** Compact mode for smaller display */
  compact?: boolean
}

type CurveType = 'ed25519' | 'secp256k1'

/**
 * Get chain display name
 */
function getChainName(chain: NetworkId): string {
  const names: Record<NetworkId, string> = {
    solana: 'Solana',
    ethereum: 'Ethereum',
    near: 'NEAR',
    zcash: 'Zcash',
    arbitrum: 'Arbitrum',
    base: 'Base',
    bitcoin: 'Bitcoin',
    optimism: 'Optimism',
    polygon: 'Polygon',
    bsc: 'BNB Chain',
    avalanche: 'Avalanche',
    aptos: 'Aptos',
  }
  return names[chain] || chain
}

/**
 * Truncate address for display
 */
function truncateAddress(address: string, startChars = 8, endChars = 6): string {
  if (address.length <= startChars + endChars + 3) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

/**
 * Stealth Address Display Component
 *
 * Visualizes stealth address generation for privacy-enabled swaps.
 * Shows different curves based on destination chain.
 */
export function StealthAddressDisplay({
  toChain,
  privacyLevel,
  showOnlyWhenPrivate = true,
  compact = false,
}: StealthAddressDisplayProps) {
  const [stealthAddress, setStealthAddress] = useState<string | null>(null)
  const [ephemeralKey, setEphemeralKey] = useState<string | null>(null)
  const [curve, setCurve] = useState<CurveType>('secp256k1')
  const [copied, setCopied] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const hasPrivacy = privacyLevel !== PrivacyLevel.TRANSPARENT

  // Generate stealth address using real SDK when chain changes
  useEffect(() => {
    if (!hasPrivacy) {
      setStealthAddress(null)
      setEphemeralKey(null)
      return
    }

    // Generate real stealth address using @sip-protocol/sdk
    generateRealStealthAddress(toChain)
      .then(({ stealthAddress: addr, ephemeralKey: key, curve: curveType }) => {
        setStealthAddress(addr)
        setEphemeralKey(key)
        setCurve(curveType)
      })
      .catch((err) => {
        // Expected failure: SDK not loaded or unsupported chain - clear state for retry
        console.debug('[Stealth Address] Generation failed:', err instanceof Error ? err.message : 'Unknown error')
        setStealthAddress(null)
        setEphemeralKey(null)
      })
  }, [toChain, hasPrivacy])

  const handleCopy = useCallback(async () => {
    if (!stealthAddress) return
    try {
      await navigator.clipboard.writeText(stealthAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }, [stealthAddress])

  // Don't render if transparent and showOnlyWhenPrivate is true
  if (!hasPrivacy && showOnlyWhenPrivate) {
    return null
  }

  // Don't render if no stealth address generated
  if (!stealthAddress) {
    return null
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-purple-400">
        <LockIcon className="h-3 w-3" />
        <span className="font-mono">{truncateAddress(stealthAddress)}</span>
        <button
          onClick={handleCopy}
          className="min-h-[44px] min-w-[44px] rounded p-2 hover:bg-purple-500/20 active:bg-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
          title="Copy stealth address"
        >
          {copied ? <CheckIcon className="h-4 w-4 text-green-400" /> : <CopyIcon className="h-4 w-4" />}
        </button>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4"
      data-testid="stealth-address-display"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LockIcon className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">Stealth Address</span>
          <Tooltip
            side="bottom"
            content={
              <div>
                <h4 className="font-medium text-purple-300 mb-1">What is a Stealth Address?</h4>
                <p className="text-gray-300 text-xs leading-relaxed">
                  A one-time address generated just for this transaction.
                  Even if someone knows your wallet, they cannot link this payment to you.
                </p>
                <a
                  href="https://docs.sip-protocol.org/concepts/stealth-addresses"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 text-xs mt-2 block hover:underline"
                >
                  Learn more →
                </a>
              </div>
            }
          >
            <button
              className="p-1 rounded hover:bg-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="What is a stealth address?"
              tabIndex={0}
            >
              <QuestionIcon className="h-3.5 w-3.5 text-purple-400/70" />
            </button>
          </Tooltip>
          <span
            className={`rounded px-1.5 py-0.5 text-xs ${
              curve === 'ed25519'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {curve}
          </span>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="min-h-[44px] rounded px-2 text-xs text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 active:bg-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {showDetails ? 'Hide details' : 'How it works'}
        </button>
      </div>

      {/* Stealth Address */}
      <div className="rounded-lg bg-gray-900/50 p-3">
        <div className="mb-1 text-xs text-gray-500">Your one-time destination:</div>
        <div className="flex items-center gap-2">
          <code className="flex-1 break-all font-mono text-sm text-white">
            {truncateAddress(stealthAddress, 12, 10)}
          </code>
          <button
            onClick={handleCopy}
            className="min-h-[44px] min-w-[44px] rounded-lg p-2 text-purple-400 transition-colors hover:bg-purple-500/20 hover:text-purple-300 active:bg-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            title="Copy full address"
          >
            {copied ? (
              <CheckIcon className="h-5 w-5 text-green-400" />
            ) : (
              <CopyIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Privacy explanation */}
      <div className="mt-3 flex items-start gap-2 text-xs text-purple-400/80">
        <InfoIcon className="mt-0.5 h-3 w-3 flex-shrink-0" />
        <span>
          This one-time address is unlinkable to your public wallet. Only you can claim funds sent here.
        </span>
      </div>

      {/* Technical details (expandable) */}
      {showDetails && (
        <div className="mt-4 space-y-3 border-t border-purple-500/20 pt-4">
          <div className="text-xs text-gray-400">
            <span className="font-medium text-purple-300">How stealth addresses work:</span>
          </div>

          {/* Visual flow */}
          <div className="space-y-2 rounded-lg bg-gray-900/30 p-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold">
                1
              </span>
              <span className="text-gray-300">Generate ephemeral keypair (one-time use)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold">
                2
              </span>
              <span className="text-gray-300">Combine with recipient&apos;s meta-address</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold">
                3
              </span>
              <span className="text-gray-300">Derive unique stealth address</span>
            </div>
          </div>

          {/* Technical details */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Chain</span>
              <span className="text-gray-300">{getChainName(toChain)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Curve</span>
              <span className={curve === 'ed25519' ? 'text-blue-400' : 'text-amber-400'}>
                {curve === 'ed25519' ? 'Ed25519 (EdDSA)' : 'secp256k1 (ECDSA)'}
              </span>
            </div>
            {ephemeralKey && (
              <div className="flex justify-between">
                <span className="text-gray-500">Ephemeral Key</span>
                <span className="font-mono text-gray-400">{truncateAddress(ephemeralKey, 6, 4)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Privacy Level</span>
              <span className="text-purple-400">
                {privacyLevel === PrivacyLevel.SHIELDED ? 'Shielded' : 'Compliant'}
              </span>
            </div>
          </div>

          {/* Visual Comparison */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <h5 className="text-xs font-medium text-red-300 mb-1.5 flex items-center gap-1">
                <EyeOpenIcon className="h-3 w-3" />
                Without Stealth
              </h5>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Your wallet address is visible. Anyone can see all your transactions and trace your activity.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <h5 className="text-xs font-medium text-green-300 mb-1.5 flex items-center gap-1">
                <LockIcon className="h-3 w-3" />
                With Stealth
              </h5>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Each transaction gets a unique, unlinkable address. Your activity stays private.
              </p>
            </div>
          </div>

          {/* Standard reference */}
          <div className="mt-3 text-[10px] text-gray-600">
            Based on EIP-5564 stealth address standard
          </div>
        </div>
      )}
    </div>
  )
}

// Icons

function LockIcon({ className }: { className?: string }) {
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

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
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
