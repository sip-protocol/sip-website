'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ChainId } from '@sip-protocol/types'

// Dynamic SDK import
const loadSDK = () => import('@sip-protocol/sdk')

interface TransactionData {
  stealthAddress: string
  ephemeralKey: string
  commitment: string
  blinding: string
  viewingKeyHash: string
}

/**
 * Generate real cryptographic proof data using SDK
 */
async function generateProofData(amount: number): Promise<TransactionData> {
  const sdk = await loadSDK()

  // Generate real stealth address
  const { metaAddress } = sdk.generateStealthMetaAddress('ethereum' as ChainId)
  const { stealthAddress } = sdk.generateStealthAddress(metaAddress)

  // Generate real Pedersen commitment
  const amountBigInt = BigInt(Math.floor(amount * 1e8))
  const commitmentResult = sdk.commit(amountBigInt)

  // Generate viewing key
  const viewingKey = sdk.generateViewingKey(`proof/${Date.now()}`)

  return {
    stealthAddress: stealthAddress.address,
    ephemeralKey: stealthAddress.ephemeralPublicKey,
    commitment: commitmentResult.commitment,
    blinding: commitmentResult.blinding,
    viewingKeyHash: viewingKey.hash,
  }
}

/**
 * Transaction Proof Component
 *
 * Shows the difference between transparent and shielded transactions
 * using REAL SDK-generated cryptographic values.
 */
export function TransactionProof() {
  const [isLoading, setIsLoading] = useState(false)
  const [proofData, setProofData] = useState<TransactionData | null>(null)
  const [activeStep, setActiveStep] = useState(0)

  // Example transaction data
  const transparentTx = {
    sender: '0x742d35Cc6634C0532925a3b844Bc9e7595f8a12B',
    recipient: '0x8Ba1f109551bD432803012645Hac136E56e5d4F8',
    amount: '100',
    token: 'USDC',
    txHash: '0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b',
  }

  const handleGenerateProof = useCallback(async () => {
    setIsLoading(true)
    setActiveStep(0)
    try {
      const data = await generateProofData(100)
      setProofData(data)

      // Animate through steps
      for (let i = 1; i <= 4; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setActiveStep(i)
      }
    } catch {
      // Error handled silently
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Auto-generate on mount
  useEffect(() => {
    handleGenerateProof()
  }, [handleGenerateProof])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Real Cryptographic Proof</h3>
        <p className="text-gray-400">
          Compare transparent vs shielded transactions using actual SDK-generated values
        </p>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Transparent Transaction */}
        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/30">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              👁️
            </span>
            <h4 className="text-lg font-semibold text-red-400">Transparent Transaction</h4>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Anyone can see all transaction details on the blockchain explorer
          </p>

          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg bg-gray-900/50">
              <div className="text-gray-500 text-xs mb-1">Sender (Visible)</div>
              <code className="text-red-400 break-all">{transparentTx.sender}</code>
            </div>
            <div className="p-3 rounded-lg bg-gray-900/50">
              <div className="text-gray-500 text-xs mb-1">Recipient (Visible)</div>
              <code className="text-red-400 break-all">{transparentTx.recipient}</code>
            </div>
            <div className="p-3 rounded-lg bg-gray-900/50">
              <div className="text-gray-500 text-xs mb-1">Amount (Visible)</div>
              <code className="text-red-400">{transparentTx.amount} {transparentTx.token}</code>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-start gap-2">
              <span className="text-red-400">⚠️</span>
              <div className="text-xs text-red-400/80">
                <strong>Exposed:</strong> Wallet balance, trading patterns, counterparty relationships, financial history
              </div>
            </div>
          </div>
        </div>

        {/* Shielded Transaction */}
        <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/30">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-400">
              🛡️
            </span>
            <h4 className="text-lg font-semibold text-green-400">Shielded Transaction</h4>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Privacy-preserving using real cryptographic primitives
          </p>

          {!proofData ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400" />
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-gray-900/50">
                <div className="text-gray-500 text-xs mb-1">Recipient (Stealth Address)</div>
                <code className="text-green-400 break-all text-xs">{truncate(proofData.stealthAddress, 20, 16)}</code>
                <div className="text-xs text-gray-600 mt-1">One-time, unlinkable address</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-900/50">
                <div className="text-gray-500 text-xs mb-1">Amount (Pedersen Commitment)</div>
                <code className="text-green-400 break-all text-xs">{truncate(proofData.commitment, 20, 16)}</code>
                <div className="text-xs text-gray-600 mt-1">Cryptographically hidden, verifiable</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-900/50">
                <div className="text-gray-500 text-xs mb-1">Sender</div>
                <code className="text-green-400">Hidden by protocol</code>
              </div>
            </div>
          )}

          <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <div className="text-xs text-green-400/80">
                <strong>Protected:</strong> Sender, recipient, amount all hidden. Transaction is verifiable but private.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Process */}
      {proofData && (
        <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
          <h4 className="text-lg font-semibold mb-6 text-center">How SIP Shields Your Transaction</h4>
          <div className="space-y-4">
            <ProcessStep
              step={1}
              title="Generate Stealth Address"
              description="Create one-time recipient address that's unlinkable to the real wallet"
              value={proofData.stealthAddress}
              active={activeStep >= 1}
            />
            <ProcessStep
              step={2}
              title="Commit Amount"
              description="Hide the amount using Pedersen commitment (C = v·G + r·H)"
              value={proofData.commitment}
              active={activeStep >= 2}
            />
            <ProcessStep
              step={3}
              title="Generate Ephemeral Key"
              description="Create one-time key for recipient to claim funds"
              value={proofData.ephemeralKey}
              active={activeStep >= 3}
            />
            <ProcessStep
              step={4}
              title="Create Viewing Key"
              description="Optional: Generate key for selective disclosure to auditors"
              value={proofData.viewingKeyHash}
              active={activeStep >= 4}
            />
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleGenerateProof}
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Generating...' : 'Regenerate Proof'}
            </button>
          </div>
        </div>
      )}

      {/* Technical Verification */}
      {proofData && (
        <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/30">
          <h4 className="text-lg font-semibold text-purple-400 mb-4 text-center">
            Verify: These Are Real Cryptographic Values
          </h4>
          <div className="grid gap-4 md:grid-cols-2 text-xs">
            <div className="p-3 rounded-lg bg-gray-900/50">
              <div className="text-gray-500 mb-1">Blinding Factor (256-bit random)</div>
              <code className="text-purple-400 break-all">{truncate(proofData.blinding, 24, 20)}</code>
            </div>
            <div className="p-3 rounded-lg bg-gray-900/50">
              <div className="text-gray-500 mb-1">Viewing Key Hash (SHA-256)</div>
              <code className="text-purple-400 break-all">{truncate(proofData.viewingKeyHash, 24, 20)}</code>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-gray-400">
            All values generated using <code className="text-purple-400">@sip-protocol/sdk</code> with real elliptic curve math (secp256k1)
          </p>
        </div>
      )}
    </div>
  )
}

function ProcessStep({
  step,
  title,
  description,
  value,
  active,
}: {
  step: number
  title: string
  description: string
  value: string
  active: boolean
}) {
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-500 ${
        active ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-gray-800/30 border border-transparent opacity-40'
      }`}
    >
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold text-sm ${
          active ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
        }`}
      >
        {step}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white">{title}</div>
        <div className="text-xs text-gray-400 mt-0.5">{description}</div>
        {active && (
          <code className="mt-2 block text-xs text-purple-400 break-all bg-gray-900/50 p-2 rounded">
            {truncate(value, 28, 20)}
          </code>
        )}
      </div>
    </div>
  )
}

function truncate(str: string, start: number, end: number): string {
  if (str.length <= start + end + 3) return str
  return `${str.slice(0, start)}...${str.slice(-end)}`
}
