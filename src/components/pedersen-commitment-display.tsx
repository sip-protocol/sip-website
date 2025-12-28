'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { PrivacyLevel } from '@sip-protocol/types'
import type { NetworkId } from '@/lib'

// Dynamic SDK import to avoid WASM loading during SSG
const loadSDK = () => import('@sip-protocol/sdk')

// Base58 alphabet (Bitcoin/Solana style)
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

/**
 * Convert hex string to base58 (Solana-style)
 */
function hexToBase58(hex: string): string {
  // Remove 0x prefix if present
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex

  // Convert hex to bytes
  const bytes: number[] = []
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes.push(parseInt(cleanHex.slice(i, i + 2), 16))
  }

  // Count leading zeros
  let leadingZeros = 0
  for (const byte of bytes) {
    if (byte === 0) leadingZeros++
    else break
  }

  // Convert to base58
  let num = BigInt('0x' + cleanHex)
  let result = ''
  while (num > 0n) {
    const remainder = Number(num % 58n)
    result = BASE58_ALPHABET[remainder] + result
    num = num / 58n
  }

  // Add leading '1's for each leading zero byte
  return '1'.repeat(leadingZeros) + result
}

/**
 * Truncate base58 string for display
 */
function truncateBase58(str: string, startChars = 6, endChars = 4): string {
  if (str.length <= startChars + endChars + 3) return str
  return `${str.slice(0, startChars)}...${str.slice(-endChars)}`
}

/**
 * Generate real Pedersen commitment using @sip-protocol/sdk
 *
 * Uses actual elliptic curve math: C = v*G + r*H
 * where G and H are generator points on secp256k1.
 */
async function generateRealCommitment(amount: string): Promise<{
  commitment: string
  blinding: string
  amountHex: string
}> {
  const sdk = await loadSDK()

  // Convert amount to bigint (SDK uses bigint for precision)
  const amountNum = parseFloat(amount) || 0
  const amountBigInt = BigInt(Math.floor(amountNum * 1e8)) // 8 decimals precision

  // Create real Pedersen commitment using SDK
  // Returns { commitment: HexString, blinding: HexString }
  const result = sdk.commit(amountBigInt)

  // Convert amount to hex for display
  const amountHex = '0x' + amountBigInt.toString(16).padStart(16, '0')

  return {
    commitment: result.commitment,
    blinding: result.blinding,
    amountHex,
  }
}

/**
 * Verify commitment opening using real SDK
 */
async function verifyRealCommitment(
  commitment: string,
  amount: string,
  blinding: string
): Promise<boolean> {
  const sdk = await loadSDK()

  const amountNum = parseFloat(amount) || 0
  const amountBigInt = BigInt(Math.floor(amountNum * 1e8))

  // verifyOpening takes raw hex strings
  return sdk.verifyOpening(commitment as `0x${string}`, amountBigInt, blinding as `0x${string}`)
}

/**
 * Add two commitments homomorphically using real SDK
 */
async function addRealCommitments(
  c1: string,
  c2: string,
  b1: string,
  b2: string
): Promise<{ commitment: string; blinding: string }> {
  const sdk = await loadSDK()

  // addCommitments takes raw hex strings and returns CommitmentPoint
  const sumCommitment = sdk.addCommitments(c1 as `0x${string}`, c2 as `0x${string}`)
  const sumBlinding = sdk.addBlindings(b1 as `0x${string}`, b2 as `0x${string}`)

  return {
    commitment: sumCommitment.commitment,
    blinding: sumBlinding,
  }
}

interface PedersenCommitmentDisplayProps {
  /** Current privacy level */
  privacyLevel: PrivacyLevel
  /** Amount being committed (for visualization) */
  amount?: string
  /** Show interactive demo mode */
  showDemo?: boolean
  /** Source chain for display formatting (solana = base58, others = hex) */
  chain?: NetworkId
}

/**
 * Truncate hex for display
 */
function truncateHex(hex: string, startChars = 10, endChars = 8): string {
  if (hex.length <= startChars + endChars + 3) return hex
  return `${hex.slice(0, startChars)}...${hex.slice(-endChars)}`
}

/**
 * Pedersen Commitment Display Component
 *
 * Shows how amounts are hidden using Pedersen commitments.
 * Demonstrates C = v*G + r*H construction.
 */
export function PedersenCommitmentDisplay({
  privacyLevel,
  amount,
  showDemo = false,
  chain,
}: PedersenCommitmentDisplayProps) {
  const [commitment, setCommitment] = useState<string | null>(null)
  const [blinding, setBlinding] = useState<string | null>(null)
  const [amountHex, setAmountHex] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  // Determine if we should use base58 format (Solana) or hex (Ethereum/others)
  const useBase58 = chain === 'solana'

  // Format value based on chain - use base58 for Solana, hex for others
  const formatValue = useCallback((hex: string, truncateStart = 10, truncateEnd = 8): string => {
    if (useBase58) {
      const base58 = hexToBase58(hex)
      return truncateBase58(base58, truncateStart, truncateEnd)
    }
    return truncateHex(hex, truncateStart, truncateEnd)
  }, [useBase58])

  // Get full formatted value (for copy)
  const getFullValue = useCallback((hex: string): string => {
    if (useBase58) {
      return hexToBase58(hex)
    }
    return hex
  }, [useBase58])

  // Demo state
  const [demoAmount, setDemoAmount] = useState('100')
  const [demoCommitment, setDemoCommitment] = useState<string | null>(null)
  const [demoBlinding, setDemoBlinding] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState<'commitment' | 'homomorphic'>('commitment')

  // Homomorphic demo state
  const [homoAmount1, setHomoAmount1] = useState('50')
  const [homoAmount2, setHomoAmount2] = useState('30')
  const [homoC1, setHomoC1] = useState<string | null>(null)
  const [homoC2, setHomoC2] = useState<string | null>(null)
  const [homoSum, setHomoSum] = useState<string | null>(null)

  const hasPrivacy = privacyLevel !== PrivacyLevel.TRANSPARENT

  // Generate commitment using real SDK when amount changes
  useEffect(() => {
    if (!hasPrivacy || !amount || parseFloat(amount) <= 0) {
      setCommitment(null)
      setBlinding(null)
      setAmountHex(null)
      return
    }

    generateRealCommitment(amount)
      .then(({ commitment: c, blinding: b, amountHex: a }) => {
        setCommitment(c)
        setBlinding(b)
        setAmountHex(a)
      })
      .catch((err) => {
        // Expected failure: SDK not loaded or invalid amount - clear state for retry
        console.debug('[Commitment] Generation failed:', err instanceof Error ? err.message : 'Unknown error')
        setCommitment(null)
        setBlinding(null)
        setAmountHex(null)
      })
  }, [amount, hasPrivacy])

  // Demo: Generate commitment using real SDK
  const handleDemoGenerate = useCallback(async () => {
    try {
      const { commitment: c, blinding: b } = await generateRealCommitment(demoAmount)
      setDemoCommitment(c)
      setDemoBlinding(b)
      setIsVerified(null)
    } catch (err) {
      // User-triggered action failed - log for debugging
      console.error('[Commitment Demo] Generation failed:', err instanceof Error ? err.message : 'Unknown error')
      setDemoCommitment(null)
      setDemoBlinding(null)
    }
  }, [demoAmount])

  // Demo: Verify commitment using real SDK
  const handleDemoVerify = useCallback(async () => {
    if (!demoCommitment || !demoBlinding) return
    try {
      const valid = await verifyRealCommitment(demoCommitment, demoAmount, demoBlinding)
      setIsVerified(valid)
      setTimeout(() => setIsVerified(null), 2000)
    } catch (err) {
      // Verification failed - show error state to user
      console.error('[Commitment Demo] Verification failed:', err instanceof Error ? err.message : 'Unknown error')
      setIsVerified(false)
      setTimeout(() => setIsVerified(null), 2000)
    }
  }, [demoCommitment, demoBlinding, demoAmount])

  // Homomorphic demo: Generate sum using real SDK point addition
  const handleHomomorphicDemo = useCallback(async () => {
    try {
      // Generate two real commitments
      const [c1Result, c2Result] = await Promise.all([
        generateRealCommitment(homoAmount1),
        generateRealCommitment(homoAmount2),
      ])
      setHomoC1(c1Result.commitment)
      setHomoC2(c2Result.commitment)

      // Use real homomorphic addition: C(a) + C(b) = C(a+b)
      const sumResult = await addRealCommitments(
        c1Result.commitment,
        c2Result.commitment,
        c1Result.blinding,
        c2Result.blinding
      )
      setHomoSum(sumResult.commitment)
    } catch (err) {
      // Homomorphic operation failed - log for debugging
      console.error('[Commitment Demo] Homomorphic addition failed:', err instanceof Error ? err.message : 'Unknown error')
      setHomoC1(null)
      setHomoC2(null)
      setHomoSum(null)
    }
  }, [homoAmount1, homoAmount2])

  const handleCopy = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Clipboard API not available
    }
  }, [])

  // Calculated sum for display
  const homoSumDisplay = useMemo(() => {
    const a1 = parseFloat(homoAmount1) || 0
    const a2 = parseFloat(homoAmount2) || 0
    return (a1 + a2).toString()
  }, [homoAmount1, homoAmount2])

  // Don't render if transparent and not demo mode
  if (!hasPrivacy && !showDemo) {
    return null
  }

  // Don't render if no commitment generated (and not demo mode)
  if (!commitment && !showDemo) {
    return null
  }

  return (
    <div
      className="rounded-xl border border-green-500/30 bg-green-500/10 p-4"
      data-testid="pedersen-commitment-display"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LockIcon className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-green-300">Pedersen Commitment</span>
          <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-xs text-green-400">
            Amount Hidden
          </span>
        </div>
        {!showDemo && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-green-400 hover:text-green-300"
          >
            {showDetails ? 'Hide details' : 'How it works'}
          </button>
        )}
      </div>

      {/* Main Commitment Display (non-demo) */}
      {!showDemo && commitment && (
        <>
          {/* Commitment value */}
          <div className="rounded-lg bg-gray-900/50 p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-gray-500">Commitment (C = v·G + r·H):</span>
              <span className="text-xs text-green-400">{useBase58 ? 'base58' : 'secp256k1'}</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 break-all font-mono text-sm text-white">
                {formatValue(commitment, 12, 10)}
              </code>
              <button
                onClick={() => handleCopy(getFullValue(commitment), 'commitment')}
                className="rounded-lg p-2 text-green-400 transition-colors hover:bg-green-500/20 hover:text-green-300"
                title="Copy commitment"
              >
                {copied === 'commitment' ? (
                  <CheckIcon className="h-4 w-4 text-green-400" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Visual representation */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs">
            <span className="rounded bg-gray-800 px-2 py-1 font-mono text-gray-400">
              {amountHex ? formatValue(amountHex, 6, 4) : '???'}
            </span>
            <span className="text-gray-500">→</span>
            <span className="rounded bg-green-500/20 px-2 py-1 font-mono text-green-400">
              {formatValue(commitment, 8, 6)}
            </span>
          </div>

          {/* Privacy explanation */}
          <div className="mt-3 flex items-start gap-2 text-xs text-green-400/80">
            <InfoIcon className="mt-0.5 h-3 w-3 flex-shrink-0" />
            <span>
              The amount is cryptographically hidden. Only someone with the blinding factor can
              verify the original value.
            </span>
          </div>
        </>
      )}

      {/* Technical details (expandable) */}
      {showDetails && !showDemo && (
        <div className="mt-4 space-y-3 border-t border-green-500/20 pt-4">
          <div className="text-xs text-gray-400">
            <span className="font-medium text-green-300">How Pedersen commitments work:</span>
          </div>

          {/* Formula */}
          <div className="rounded-lg bg-gray-900/30 p-3">
            <div className="mb-2 text-center font-mono text-sm text-green-400">
              C = v·G + r·H
            </div>
            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>v (value)</span>
                <span className="text-gray-500">Your amount (hidden)</span>
              </div>
              <div className="flex justify-between">
                <span>r (blinding)</span>
                <span className="text-gray-500">Random 256-bit scalar</span>
              </div>
              <div className="flex justify-between">
                <span>G, H</span>
                <span className="text-gray-500">Generator points (public)</span>
              </div>
            </div>
          </div>

          {/* Properties */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold">
                ✓
              </span>
              <span className="text-gray-300">
                <strong className="text-green-400">Hiding:</strong> Cannot determine v from C
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold">
                ✓
              </span>
              <span className="text-gray-300">
                <strong className="text-green-400">Binding:</strong> Cannot open to different value
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold">
                ✓
              </span>
              <span className="text-gray-300">
                <strong className="text-green-400">Homomorphic:</strong> C(a) + C(b) = C(a+b)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Demo Mode */}
      {showDemo && (
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('commitment')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'commitment'
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-gray-400 hover:text-green-400'
              }`}
            >
              Create Commitment
            </button>
            <button
              onClick={() => setActiveTab('homomorphic')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'homomorphic'
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-gray-400 hover:text-green-400'
              }`}
            >
              Homomorphic Addition
            </button>
          </div>

          {/* Create Commitment Tab */}
          {activeTab === 'commitment' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400">
                Enter any amount to see how it gets hidden in a cryptographic commitment.
              </p>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="number"
                  value={demoAmount}
                  onChange={(e) => setDemoAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 rounded-lg bg-gray-800 px-3 py-2 text-sm outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-green-500/50"
                />
                <button
                  onClick={handleDemoGenerate}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  Commit
                </button>
              </div>

              {/* Result */}
              {demoCommitment && (
                <div className="space-y-2 rounded-lg bg-gray-900/50 p-3">
                  <div className="text-xs text-gray-500">Generated Commitment:</div>
                  <code className="block break-all font-mono text-sm text-green-400">
                    {truncateHex(demoCommitment, 14, 10)}
                  </code>

                  <div className="flex items-center gap-2 border-t border-gray-800 pt-2">
                    <button
                      onClick={handleDemoVerify}
                      className="rounded bg-gray-700 px-3 py-1 text-xs text-gray-300 transition-colors hover:bg-gray-600"
                    >
                      Verify Opening
                    </button>
                    {isVerified !== null && (
                      <span className={`text-xs ${isVerified ? 'text-green-400' : 'text-red-400'}`}>
                        {isVerified ? '✓ Valid commitment!' : '✗ Invalid'}
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] text-gray-600">
                    Blinding factor: {demoBlinding ? truncateHex(demoBlinding, 8, 6) : '...'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Homomorphic Addition Tab */}
          {activeTab === 'homomorphic' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400">
                Pedersen commitments are <strong className="text-green-400">homomorphic</strong>:
                adding commitments gives a commitment to the sum.
              </p>

              {/* Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">Amount 1</label>
                  <input
                    type="number"
                    value={homoAmount1}
                    onChange={(e) => setHomoAmount1(e.target.value)}
                    className="w-full rounded-lg bg-gray-800 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">Amount 2</label>
                  <input
                    type="number"
                    value={homoAmount2}
                    onChange={(e) => setHomoAmount2(e.target.value)}
                    className="w-full rounded-lg bg-gray-800 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500/50"
                  />
                </div>
              </div>

              <button
                onClick={handleHomomorphicDemo}
                className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                Demonstrate Addition
              </button>

              {/* Result */}
              {homoC1 && homoC2 && homoSum && (
                <div className="space-y-2 rounded-lg bg-gray-900/50 p-3">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">C({homoAmount1}):</span>
                      <code className="font-mono text-green-400">{truncateHex(homoC1, 8, 6)}</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">C({homoAmount2}):</span>
                      <code className="font-mono text-green-400">{truncateHex(homoC2, 8, 6)}</code>
                    </div>
                    <div className="border-t border-gray-700 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-green-400">C({homoSumDisplay}):</span>
                        <code className="font-mono text-green-300">{truncateHex(homoSum, 8, 6)}</code>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-center text-xs text-gray-500">
                    C({homoAmount1}) + C({homoAmount2}) = C({homoSumDisplay})
                  </div>
                </div>
              )}

              {/* Explanation */}
              <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-2 text-xs text-green-400/80">
                <strong>Why this matters:</strong> Validators can verify that inputs = outputs
                without knowing the actual amounts. This enables private balance proofs.
              </div>
            </div>
          )}

          {/* SDK Code Example */}
          <div className="rounded-lg bg-gray-900/50 p-3">
            <div className="mb-2 text-xs text-gray-500">SDK Usage:</div>
            <SyntaxHighlighter
              language="typescript"
              style={oneDark}
              customStyle={{
                margin: 0,
                padding: 0,
                background: 'transparent',
                fontSize: '0.75rem',
              }}
              codeTagProps={{
                style: {
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                }
              }}
            >
              {`import { commit, verifyOpening } from '@sip-protocol/sdk'

// Create commitment
const { commitment, blinding } = commit(100n)

// Verify opening
const valid = verifyOpening(commitment, 100n, blinding)`}
            </SyntaxHighlighter>
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
