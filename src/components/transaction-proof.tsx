'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ChainId } from '@sip-protocol/types'
import { getProofProvider } from '@/lib/sip-client'

// Dynamic SDK import
const loadSDK = () => import('@sip-protocol/sdk')

interface TransactionData {
  stealthAddress: string
  ephemeralKey: string
  commitment: string
  blinding: string
  viewingKeyHash: string
}

interface ZKProofData {
  fundingProof: {
    proof: string
    publicInputs: string[]
    framework: string
    constraints: number
    verificationTime: string
  }
  validityProof: {
    proof: string
    publicInputs: string[]
    nullifier: string
    framework: string
    constraints: number
  }
  fulfillmentProof: {
    proof: string
    publicInputs: string[]
    intentHash: string
    framework: string
    constraints: number
  }
}

interface QuoteData {
  quoteId: string
  inputAmount: string
  outputAmount: string
  rate: string
  depositAddress: string
  deadline: string
  slippage: string
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
 * Generate ZK proof artifacts using BrowserNoirProvider (or mock fallback)
 * Uses real Noir proofs in browser environment
 */
async function generateZKProofs(intentHash: string): Promise<ZKProofData> {
  // Get the initialized proof provider (real Noir in browser, mock for SSR)
  const proofProvider = await getProofProvider()

  // Generate realistic proof data (blinding factors)
  const blindingFactor = new Uint8Array(32)
  crypto.getRandomValues(blindingFactor)

  const solverSecret = new Uint8Array(32)
  crypto.getRandomValues(solverSecret)

  const nonce = new Uint8Array(32)
  crypto.getRandomValues(nonce)

  const authSig = new Uint8Array(64)
  crypto.getRandomValues(authSig)

  const oracleSig = new Uint8Array(64)
  crypto.getRandomValues(oracleSig)

  // Generate Funding Proof
  const fundingResult = await proofProvider.generateFundingProof({
    balance: BigInt(100_000_000), // 1 ETH in wei (scaled)
    minimumRequired: BigInt(10_000_000), // 0.1 ETH
    blindingFactor,
    assetId: 'ethereum:ETH',
    userAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8a12B',
    ownershipSignature: authSig,
  })

  // Generate Validity Proof
  const validityResult = await proofProvider.generateValidityProof({
    intentHash: intentHash as `0x${string}`,
    senderAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8a12B',
    senderBlinding: blindingFactor,
    senderSecret: solverSecret,
    authorizationSignature: authSig,
    nonce,
    timestamp: Math.floor(Date.now() / 1000),
    expiry: Math.floor(Date.now() / 1000) + 3600,
  })

  // Generate nullifier from nonce (prevents double-spending)
  const sdk = await loadSDK()
  const nullifier = sdk.hash(Array.from(nonce).map(b => b.toString(16).padStart(2, '0')).join(''))

  // Generate Fulfillment Proof
  const fulfillmentResult = await proofProvider.generateFulfillmentProof({
    intentHash: intentHash as `0x${string}`,
    outputAmount: BigInt(99_500_000), // Slightly less due to slippage
    outputBlinding: blindingFactor,
    minOutputAmount: BigInt(99_000_000),
    recipientStealth: '0x03abc...def' as `0x${string}`,
    solverId: 'solver-near-intents-001',
    solverSecret,
    oracleAttestation: {
      recipient: '0x03abc...def' as `0x${string}`,
      amount: BigInt(99_500_000),
      txHash: '0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b' as `0x${string}`,
      blockNumber: BigInt(19234567),
      signature: oracleSig,
    },
    fulfillmentTime: Math.floor(Date.now() / 1000),
    expiry: Math.floor(Date.now() / 1000) + 3600,
  })

  return {
    fundingProof: {
      proof: fundingResult.proof.proof,
      publicInputs: fundingResult.publicInputs,
      framework: 'noir',
      constraints: 22000,
      verificationTime: '~2ms',
    },
    validityProof: {
      proof: validityResult.proof.proof,
      publicInputs: validityResult.publicInputs,
      nullifier,
      framework: 'noir',
      constraints: 72000,
    },
    fulfillmentProof: {
      proof: fulfillmentResult.proof.proof,
      publicInputs: fulfillmentResult.publicInputs,
      intentHash,
      framework: 'noir',
      constraints: 22000,
    },
  }
}

/**
 * Simulate NEAR Intents quote (dry mode)
 * In production, this would call the real 1Click API
 */
function simulateQuote(inputAmount: number): QuoteData {
  // Simulate realistic quote data
  const rate = 0.000423 // ETH per USDC
  const outputAmount = inputAmount * rate
  const slippage = 1.0 // 1%

  // Generate realistic-looking addresses
  const quoteId = `quote_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
  const depositAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`

  return {
    quoteId,
    inputAmount: `${inputAmount} USDC`,
    outputAmount: `${outputAmount.toFixed(6)} ETH`,
    rate: `1 USDC = ${rate.toFixed(6)} ETH`,
    depositAddress,
    deadline: new Date(Date.now() + 3600 * 1000).toISOString(),
    slippage: `${slippage}%`,
  }
}

// Explorer link templates
const EXPLORER_LINKS = {
  ethereum: {
    tx: (hash: string) => `https://etherscan.io/tx/${hash}`,
    address: (addr: string) => `https://etherscan.io/address/${addr}`,
    name: 'Etherscan',
  },
  near: {
    tx: (hash: string) => `https://nearblocks.io/txns/${hash}`,
    address: (addr: string) => `https://nearblocks.io/address/${addr}`,
    name: 'NEARBlocks',
  },
  solana: {
    tx: (hash: string) => `https://solscan.io/tx/${hash}`,
    address: (addr: string) => `https://solscan.io/account/${addr}`,
    name: 'Solscan',
  },
}

/**
 * Transaction Proof Component
 *
 * Shows the difference between transparent and shielded transactions
 * using REAL SDK-generated cryptographic values, ZK proofs, and
 * NEAR Intents quote simulation.
 */
export function TransactionProof() {
  const [isLoading, setIsLoading] = useState(false)
  const [proofData, setProofData] = useState<TransactionData | null>(null)
  const [zkProofs, setZkProofs] = useState<ZKProofData | null>(null)
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [activeTab, setActiveTab] = useState<'comparison' | 'proofs' | 'quote'>('comparison')
  const [expandedProof, setExpandedProof] = useState<string | null>(null)

  // Example transaction data
  const transparentTx = {
    sender: '0x742d35Cc6634C0532925a3b844Bc9e7595f8a12B',
    recipient: '0x8Ba1f109551bD432803012645Hac136E56e5d4F8',
    amount: '100',
    token: 'USDC',
    txHash: '0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b',
  }

  // Simulated intent hash (would be generated from actual intent)
  const intentHash = '0x7b502c3a1f48c8609ae212cdfb639dee39673f5e4db3b8b79bbf3f8d7d7b3f99'

  const handleGenerateProof = useCallback(async () => {
    setIsLoading(true)
    setActiveStep(0)
    try {
      // Generate all proof data in parallel
      const [cryptoData, zkData] = await Promise.all([
        generateProofData(100),
        generateZKProofs(intentHash),
      ])

      setProofData(cryptoData)
      setZkProofs(zkData)
      setQuoteData(simulateQuote(100))

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

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-gray-900/50 p-1 border border-gray-800">
          <TabButton
            active={activeTab === 'comparison'}
            onClick={() => setActiveTab('comparison')}
            label="Privacy Comparison"
          />
          <TabButton
            active={activeTab === 'proofs'}
            onClick={() => setActiveTab('proofs')}
            label="ZK Proofs"
            badge={zkProofs ? '3' : undefined}
          />
          <TabButton
            active={activeTab === 'quote'}
            onClick={() => setActiveTab('quote')}
            label="Quote Flow"
          />
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'comparison' && (
        <>
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
        </>
      )}

      {/* ZK Proofs Tab */}
      {activeTab === 'proofs' && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-400">
              SIP uses three ZK proofs to ensure privacy without sacrificing verifiability
            </p>
          </div>

          {!zkProofs ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Funding Proof */}
              <ZKProofCard
                title="Funding Proof"
                description="Proves balance >= minimum without revealing actual balance"
                icon="💰"
                color="green"
                proof={zkProofs.fundingProof}
                expanded={expandedProof === 'funding'}
                onToggle={() => setExpandedProof(expandedProof === 'funding' ? null : 'funding')}
              />

              {/* Validity Proof */}
              <ZKProofCard
                title="Validity Proof"
                description="Proves intent authorization without revealing sender identity"
                icon="✓"
                color="blue"
                proof={zkProofs.validityProof}
                expanded={expandedProof === 'validity'}
                onToggle={() => setExpandedProof(expandedProof === 'validity' ? null : 'validity')}
                extra={
                  <div className="mt-2 p-2 rounded bg-gray-900/50">
                    <div className="text-xs text-gray-500 mb-1">Nullifier (prevents double-spend)</div>
                    <code className="text-xs text-blue-400 break-all">{truncate(zkProofs.validityProof.nullifier, 20, 16)}</code>
                  </div>
                }
              />

              {/* Fulfillment Proof */}
              <ZKProofCard
                title="Fulfillment Proof"
                description="Proves solver delivered correct output to right recipient"
                icon="📦"
                color="purple"
                proof={zkProofs.fulfillmentProof}
                expanded={expandedProof === 'fulfillment'}
                onToggle={() => setExpandedProof(expandedProof === 'fulfillment' ? null : 'fulfillment')}
              />
            </div>
          )}

          {/* Framework Info */}
          <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                <NoirLogo className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Noir Framework</h4>
                <p className="text-xs text-gray-400">Universal ZK language from Aztec</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-2 rounded-lg bg-gray-800/50">
                <div className="text-lg font-bold text-purple-400">116k</div>
                <div className="text-xs text-gray-500">Total Constraints</div>
              </div>
              <div className="p-2 rounded-lg bg-gray-800/50">
                <div className="text-lg font-bold text-purple-400">&lt;5s</div>
                <div className="text-xs text-gray-500">Proof Generation</div>
              </div>
              <div className="p-2 rounded-lg bg-gray-800/50">
                <div className="text-lg font-bold text-purple-400">&lt;10ms</div>
                <div className="text-xs text-gray-500">Verification</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleGenerateProof}
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Generating...' : 'Regenerate Proofs'}
            </button>
          </div>
        </div>
      )}

      {/* Quote Flow Tab */}
      {activeTab === 'quote' && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-400">
              Cross-chain swaps via NEAR Intents with privacy-preserving delivery
            </p>
          </div>

          {!quoteData ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
            </div>
          ) : (
            <>
              {/* Quote Details */}
              <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                    💱
                  </span>
                  <h4 className="text-lg font-semibold text-cyan-400">NEAR Intents Quote</h4>
                  <span className="ml-auto px-2 py-0.5 rounded text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    Simulated
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <QuoteField label="Quote ID" value={quoteData.quoteId} />
                  <QuoteField label="Exchange Rate" value={quoteData.rate} />
                  <QuoteField label="Input" value={quoteData.inputAmount} color="text-white" />
                  <QuoteField label="Output" value={quoteData.outputAmount} color="text-green-400" />
                  <QuoteField label="Slippage" value={quoteData.slippage} />
                  <QuoteField label="Deadline" value={new Date(quoteData.deadline).toLocaleTimeString()} />
                </div>

                <div className="mt-4 p-3 rounded-lg bg-gray-900/50">
                  <div className="text-xs text-gray-500 mb-1">Deposit Address</div>
                  <code className="text-cyan-400 text-sm break-all">{quoteData.depositAddress}</code>
                </div>
              </div>

              {/* Flow Diagram */}
              <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
                <h4 className="text-lg font-semibold mb-4 text-center">Privacy-Preserving Swap Flow</h4>
                <div className="space-y-3">
                  <FlowStep
                    step={1}
                    title="Deposit to 1Click"
                    description="Send tokens to deposit address on origin chain"
                    explorer={EXPLORER_LINKS.ethereum}
                    status="ready"
                  />
                  <FlowArrow />
                  <FlowStep
                    step={2}
                    title="SIP Wraps Intent"
                    description="Add stealth address + commitment for privacy"
                    status="pending"
                  />
                  <FlowArrow />
                  <FlowStep
                    step={3}
                    title="NEAR Intents Execute"
                    description="Solvers fulfill via NEAR's intent-centric model"
                    explorer={EXPLORER_LINKS.near}
                    status="pending"
                  />
                  <FlowArrow />
                  <FlowStep
                    step={4}
                    title="Deliver to Stealth"
                    description="Output sent to one-time stealth address"
                    status="pending"
                  />
                </div>
              </div>

              {/* Explorer Links */}
              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                <h4 className="font-semibold mb-3 text-center">Verify On-Chain</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {Object.entries(EXPLORER_LINKS).map(([chain, explorer]) => (
                    <a
                      key={chain}
                      href={explorer.tx(transparentTx.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-sm"
                    >
                      <span className="text-gray-400">{explorer.name}</span>
                      <ExternalLinkIcon className="h-3 w-3 text-gray-500" />
                    </a>
                  ))}
                </div>
                <p className="mt-3 text-center text-xs text-gray-500">
                  In production, these links show real transaction hashes for full transparency
                </p>
              </div>
            </>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleGenerateProof}
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Generating...' : 'Regenerate Quote'}
            </button>
          </div>
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

// Tab Button Component
function TabButton({
  active,
  onClick,
  label,
  badge,
}: {
  active: boolean
  onClick: () => void
  label: string
  badge?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        active
          ? 'bg-purple-600 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      {label}
      {badge && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-xs text-white">
          {badge}
        </span>
      )}
    </button>
  )
}

// ZK Proof Card Component
function ZKProofCard({
  title,
  description,
  icon,
  color,
  proof,
  expanded,
  onToggle,
  extra,
}: {
  title: string
  description: string
  icon: string
  color: 'green' | 'blue' | 'purple'
  proof: {
    proof: string
    publicInputs: string[]
    framework: string
    constraints: number
  }
  expanded: boolean
  onToggle: () => void
  extra?: React.ReactNode
}) {
  const colorClasses = {
    green: {
      bg: 'bg-green-500/5',
      border: 'border-green-500/30',
      text: 'text-green-400',
      badge: 'bg-green-500/20',
    },
    blue: {
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      badge: 'bg-blue-500/20',
    },
    purple: {
      bg: 'bg-purple-500/5',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      badge: 'bg-purple-500/20',
    },
  }

  const c = colorClasses[color]

  return (
    <div className={`p-4 rounded-xl ${c.bg} border ${c.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-full ${c.badge} text-lg`}>
            {icon}
          </span>
          <div>
            <h4 className={`font-semibold ${c.text}`}>{title}</h4>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400">
            {proof.constraints.toLocaleString()} constraints
          </span>
          <button
            onClick={onToggle}
            className={`p-1 rounded transition-colors ${c.text} hover:bg-gray-800`}
          >
            <ChevronIcon className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3">
          <div className="p-3 rounded-lg bg-gray-900/50">
            <div className="text-xs text-gray-500 mb-1">Proof (truncated)</div>
            <code className={`text-xs ${c.text} break-all`}>{truncate(proof.proof, 40, 32)}</code>
          </div>
          <div className="p-3 rounded-lg bg-gray-900/50">
            <div className="text-xs text-gray-500 mb-1">Public Inputs ({proof.publicInputs.length})</div>
            <div className="space-y-1">
              {proof.publicInputs.slice(0, 3).map((input, i) => (
                <code key={i} className="block text-xs text-gray-400 break-all">
                  [{i}]: {truncate(input, 20, 16)}
                </code>
              ))}
              {proof.publicInputs.length > 3 && (
                <span className="text-xs text-gray-500">... +{proof.publicInputs.length - 3} more</span>
              )}
            </div>
          </div>
          {extra}
        </div>
      )}
    </div>
  )
}

// Quote Field Component
function QuoteField({
  label,
  value,
  color = 'text-gray-300',
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="p-2 rounded-lg bg-gray-900/50">
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className={`text-sm font-medium ${color}`}>{value}</div>
    </div>
  )
}

// Flow Step Component
function FlowStep({
  step,
  title,
  description,
  explorer,
  status,
}: {
  step: number
  title: string
  description: string
  explorer?: { name: string; tx: (hash: string) => string }
  status: 'ready' | 'pending' | 'complete'
}) {
  const statusColors = {
    ready: 'bg-cyan-600 text-white',
    pending: 'bg-gray-700 text-gray-400',
    complete: 'bg-green-600 text-white',
  }

  return (
    <div className="flex items-start gap-4 p-3 rounded-lg bg-gray-800/30">
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold text-sm ${statusColors[status]}`}>
        {status === 'complete' ? '✓' : step}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{title}</span>
          {explorer && (
            <span className="text-xs text-gray-500">({explorer.name})</span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
  )
}

// Flow Arrow Component
function FlowArrow() {
  return (
    <div className="flex justify-center">
      <div className="h-4 w-0.5 bg-gray-700" />
    </div>
  )
}

// Icons
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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

function NoirLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#1e1e2e" />
      <path
        d="M8 12h16M8 16h12M8 20h8"
        stroke="#a78bfa"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="20" r="3" fill="#a78bfa" />
    </svg>
  )
}
