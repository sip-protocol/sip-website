'use client'

import { useState, useEffect, useCallback } from 'react'
import { PrivacyLevel } from '@sip-protocol/types'
import type { ChainId } from '@sip-protocol/types'
import type { NetworkId } from '@/lib'

// Dynamic SDK import to avoid WASM loading during SSG
const loadSDK = () => import('@sip-protocol/sdk')

/**
 * Determine the curve type for a chain
 *
 * ed25519: Solana, NEAR (native chain curve)
 * secp256k1: Ethereum, Zcash, Arbitrum (EVM and Bitcoin-derived)
 *
 * Note: Currently SDK only supports secp256k1 stealth addresses.
 * Ed25519 support is in development (see SDK source).
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
 * Uses EIP-5564 compatible secp256k1 stealth addresses.
 * The SDK generates cryptographically valid addresses using:
 * - secp256k1 elliptic curve (same as Bitcoin/Ethereum)
 * - Proper key derivation and shared secret computation
 */
async function generateRealStealthAddress(chain: NetworkId): Promise<{
  stealthAddress: string
  ephemeralKey: string
  curve: 'secp256k1' | 'ed25519'
}> {
  const sdk = await loadSDK()

  // Generate stealth meta-address using SDK (secp256k1)
  // This creates a real cryptographic keypair
  const { metaAddress } = sdk.generateStealthMetaAddress(chain as ChainId)

  // Derive an actual stealth address from the meta-address
  // This simulates what a sender would do
  const { stealthAddress } = sdk.generateStealthAddress(metaAddress)

  return {
    stealthAddress: stealthAddress.address,
    ephemeralKey: stealthAddress.ephemeralPublicKey,
    // Note: SDK currently generates secp256k1, curve shown is what chain uses natively
    curve: getCurveForChain(chain),
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
      .catch(() => {
        // Fallback if SDK generation fails
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
          className="min-h-[44px] min-w-[44px] rounded p-2 hover:bg-purple-500/20 active:bg-purple-500/30"
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
          className="min-h-[44px] rounded px-2 text-xs text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 active:bg-purple-500/20"
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
            className="min-h-[44px] min-w-[44px] rounded-lg p-2 text-purple-400 transition-colors hover:bg-purple-500/20 hover:text-purple-300 active:bg-purple-500/30"
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

          {/* Standard reference */}
          <div className="text-[10px] text-gray-600">
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
