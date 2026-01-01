'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Wallet, Shield, Key, Eye, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react'

// Dynamic SDK import to avoid WASM loading during SSG
const loadSDK = () => import('@sip-protocol/sdk')

interface StealthMetaAddressData {
  spendingKey: string
  viewingKey: string
  chain: string
  label?: string
}

interface StealthAddress {
  address: string
  ephemeralPublicKey: string
}

type Step = 'connect' | 'generate-meta' | 'generate-stealth' | 'complete'

export default function PhantomPOCPage() {
  // Wallet state
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Stealth address state
  const [metaAddress, setMetaAddress] = useState<StealthMetaAddressData | null>(null)
  const [stealthAddress, setStealthAddress] = useState<StealthAddress | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // UI state
  const [currentStep, setCurrentStep] = useState<Step>('connect')
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if Phantom is installed
  const [phantomAvailable, setPhantomAvailable] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPhantomAvailable(!!window.solana?.isPhantom)
    }
  }, [])

  // Connect to Phantom
  const connectPhantom = useCallback(async () => {
    setError(null)
    setIsConnecting(true)

    try {
      const sdk = await loadSDK()
      const adapter = sdk.createSolanaAdapter({
        wallet: 'phantom',
        cluster: 'devnet',
      })

      await adapter.connect()
      const address = adapter.address

      if (address) {
        setWalletAddress(address)
        setIsConnected(true)
        setCurrentStep('generate-meta')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect'
      setError(message.includes('rejected') ? 'Connection rejected by user' : message)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  // Generate stealth meta-address
  const generateMetaAddress = useCallback(async () => {
    setError(null)
    setIsGenerating(true)

    try {
      const sdk = await loadSDK()

      // Generate Ed25519 stealth meta-address for Solana
      const result = sdk.generateEd25519StealthMetaAddress('solana')

      // Store the meta-address object (has spendingKey, viewingKey, chain)
      setMetaAddress({
        spendingKey: result.metaAddress.spendingKey,
        viewingKey: result.metaAddress.viewingKey,
        chain: result.metaAddress.chain,
        label: result.metaAddress.label,
      })
      setCurrentStep('generate-stealth')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate meta-address')
    } finally {
      setIsGenerating(false)
    }
  }, [])

  // Generate one-time stealth address
  const generateStealthAddress = useCallback(async () => {
    if (!metaAddress) return

    setError(null)
    setIsGenerating(true)

    try {
      const sdk = await loadSDK()

      // Derive stealth address from meta-address
      // Need to reconstruct the StealthMetaAddress object format expected by SDK
      const result = sdk.generateEd25519StealthAddress({
        spendingKey: metaAddress.spendingKey as `0x${string}`,
        viewingKey: metaAddress.viewingKey as `0x${string}`,
        chain: metaAddress.chain as 'solana',
        label: metaAddress.label,
      })

      setStealthAddress({
        address: result.stealthAddress.address,
        ephemeralPublicKey: result.stealthAddress.ephemeralPublicKey,
      })
      setCurrentStep('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate stealth address')
    } finally {
      setIsGenerating(false)
    }
  }, [metaAddress])

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Clipboard API not available
    }
  }, [])

  // Truncate address
  const truncate = (addr: string, start = 8, end = 6) => {
    if (addr.length <= start + end + 3) return addr
    return `${addr.slice(0, start)}...${addr.slice(-end)}`
  }

  // Format meta-address as sip:<chain>:<spendingKey>:<viewingKey>
  const formatMetaAddress = (meta: StealthMetaAddressData) => {
    return `sip:${meta.chain}:${meta.spendingKey}:${meta.viewingKey}`
  }

  // Reset flow
  const reset = useCallback(() => {
    setMetaAddress(null)
    setStealthAddress(null)
    setCurrentStep(isConnected ? 'generate-meta' : 'connect')
  }, [isConnected])

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <section className="border-b border-gray-800/50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Phantom Integration POC
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                Solana Devnet
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Stealth Addresses with Phantom
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Connect your Phantom wallet and generate cryptographic stealth addresses
              for private transactions on Solana.
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 border-b border-gray-800/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4">
            <StepIndicator
              step={1}
              label="Connect Wallet"
              active={currentStep === 'connect'}
              completed={isConnected}
            />
            <ArrowRight className="h-4 w-4 text-gray-600" />
            <StepIndicator
              step={2}
              label="Generate Meta-Address"
              active={currentStep === 'generate-meta'}
              completed={!!metaAddress}
            />
            <ArrowRight className="h-4 w-4 text-gray-600" />
            <StepIndicator
              step={3}
              label="Generate Stealth"
              active={currentStep === 'generate-stealth'}
              completed={!!stealthAddress}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1: Connect Wallet */}
          <AnimatePresence mode="wait">
            {currentStep === 'connect' && (
              <motion.div
                key="connect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto"
              >
                <div className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800">
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                      <Wallet className="h-8 w-8 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Connect Phantom Wallet
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">
                      Connect your Phantom wallet to generate stealth addresses
                      for private receiving on Solana.
                    </p>

                    {phantomAvailable ? (
                      <button
                        onClick={connectPhantom}
                        disabled={isConnecting}
                        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isConnecting ? (
                          <span className="flex items-center justify-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Connecting...
                          </span>
                        ) : (
                          'Connect Phantom'
                        )}
                      </button>
                    ) : (
                      <a
                        href="https://phantom.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors"
                      >
                        Install Phantom
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Generate Meta-Address */}
            {currentStep === 'generate-meta' && (
              <motion.div
                key="generate-meta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                {/* Connected wallet display */}
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm text-green-400 font-medium">Phantom Connected</div>
                      <div className="text-xs text-gray-400 font-mono">{truncate(walletAddress || '', 12, 8)}</div>
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800">
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                      <Key className="h-8 w-8 text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Generate Stealth Meta-Address
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">
                      A meta-address contains your spending and viewing public keys.
                      Share this with senders so they can generate one-time stealth addresses for you.
                    </p>

                    <button
                      onClick={generateMetaAddress}
                      disabled={isGenerating}
                      className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isGenerating ? (
                        <span className="flex items-center justify-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Generating...
                        </span>
                      ) : (
                        'Generate Meta-Address'
                      )}
                    </button>
                  </div>
                </div>

                {/* How it works */}
                <div className="mt-8 p-6 rounded-xl bg-gray-900/30 border border-gray-800">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">How Meta-Addresses Work</h3>
                  <div className="space-y-3 text-sm text-gray-400">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white shrink-0">1</span>
                      <span><strong className="text-gray-200">Spending Key:</strong> Used to derive stealth addresses you can spend from</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white shrink-0">2</span>
                      <span><strong className="text-gray-200">Viewing Key:</strong> Used to scan for incoming payments without spending ability</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white shrink-0">3</span>
                      <span><strong className="text-gray-200">Meta-Address:</strong> Combined public format you share with senders</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Generate Stealth Address */}
            {currentStep === 'generate-stealth' && metaAddress && (
              <motion.div
                key="generate-stealth"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                {/* Meta-address display */}
                <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6">
                  <h3 className="text-sm font-medium text-blue-400 mb-4 flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Your Stealth Meta-Address
                  </h3>
                  <div className="space-y-3">
                    <KeyDisplay
                      label="Meta-Address (shareable)"
                      value={formatMetaAddress(metaAddress)}
                      onCopy={() => copyToClipboard(formatMetaAddress(metaAddress), 'meta')}
                      copied={copied === 'meta'}
                    />
                    <KeyDisplay
                      label="Spending Public Key"
                      value={metaAddress.spendingKey}
                      onCopy={() => copyToClipboard(metaAddress.spendingKey, 'spending')}
                      copied={copied === 'spending'}
                    />
                    <KeyDisplay
                      label="Viewing Public Key"
                      value={metaAddress.viewingKey}
                      onCopy={() => copyToClipboard(metaAddress.viewingKey, 'viewing')}
                      copied={copied === 'viewing'}
                    />
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800">
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                      <Shield className="h-8 w-8 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Generate One-Time Stealth Address
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">
                      Simulate what a sender does: they take your meta-address and derive
                      a unique, unlinkable stealth address just for this payment.
                    </p>

                    <button
                      onClick={generateStealthAddress}
                      disabled={isGenerating}
                      className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isGenerating ? (
                        <span className="flex items-center justify-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Generating...
                        </span>
                      ) : (
                        'Generate Stealth Address'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Complete */}
            {currentStep === 'complete' && stealthAddress && metaAddress && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                {/* Success banner */}
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm text-green-400 font-medium">Stealth Address Generated</div>
                      <div className="text-xs text-gray-400">This address is unlinkable to your wallet</div>
                    </div>
                  </div>
                </div>

                {/* Stealth address display */}
                <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-6">
                  <h3 className="text-sm font-medium text-purple-400 mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    One-Time Stealth Address
                  </h3>
                  <div className="space-y-3">
                    <KeyDisplay
                      label="Stealth Address"
                      value={stealthAddress.address}
                      onCopy={() => copyToClipboard(stealthAddress.address, 'stealth')}
                      copied={copied === 'stealth'}
                      highlight
                    />
                    <KeyDisplay
                      label="Ephemeral Public Key"
                      value={stealthAddress.ephemeralPublicKey}
                      onCopy={() => copyToClipboard(stealthAddress.ephemeralPublicKey, 'ephemeral')}
                      copied={copied === 'ephemeral'}
                    />
                  </div>
                </div>

                {/* Privacy explanation */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Without Stealth
                    </h4>
                    <p className="text-xs text-gray-400">
                      Your wallet address: <span className="font-mono text-gray-300">{truncate(walletAddress || '', 6, 4)}</span>
                      <br />
                      Everyone can link payments to your identity.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      With Stealth
                    </h4>
                    <p className="text-xs text-gray-400">
                      Stealth address: <span className="font-mono text-gray-300">{truncate(stealthAddress.address, 6, 4)}</span>
                      <br />
                      Unlinkable. Only you can spend.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={reset}
                    className="flex-1 px-6 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors"
                  >
                    Generate Another
                  </button>
                  <a
                    href="https://docs.sip-protocol.org/concepts/stealth-addresses"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                  >
                    Read the Docs
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Code Sample Section */}
      <section className="py-12 border-t border-gray-800/50 bg-gray-900/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Integration Code</h2>
          <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-gray-500 ml-2">stealth-address.ts</span>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
              <code className="text-gray-300">{`import {
  createSolanaAdapter,
  generateEd25519StealthMetaAddress,
  generateEd25519StealthAddress
} from '@sip-protocol/sdk'

// 1. Connect Phantom wallet
const adapter = createSolanaAdapter({
  wallet: 'phantom',
  cluster: 'devnet',
})
await adapter.connect()
console.log('Connected:', adapter.address)

// 2. Generate stealth meta-address (recipient does this once)
const { metaAddress, spendingPublicKey, viewingPublicKey } =
  generateEd25519StealthMetaAddress('solana')

// Share metaAddress with senders

// 3. Generate one-time stealth address (sender does this per payment)
const { stealthAddress } = generateEd25519StealthAddress(metaAddress)

// Send funds to stealthAddress.address
// Only the recipient can spend (they have the spending private key)`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 border-t border-gray-800/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Add Privacy?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Integrate stealth addresses into your Solana dApp with just a few lines of code.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://www.npmjs.com/package/@sip-protocol/sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              npm install @sip-protocol/sdk
            </a>
            <a
              href="https://github.com/sip-protocol/sip-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-base font-medium text-gray-300 border border-gray-700 rounded-lg hover:border-gray-600 hover:text-white transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

// Step Indicator Component
function StepIndicator({
  step,
  label,
  active,
  completed,
}: {
  step: number
  label: string
  active: boolean
  completed: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
          completed
            ? 'bg-green-500 text-white'
            : active
              ? 'bg-purple-500 text-white'
              : 'bg-gray-800 text-gray-500'
        }`}
      >
        {completed ? <Check className="h-4 w-4" /> : step}
      </div>
      <span
        className={`text-sm hidden sm:block ${
          active ? 'text-white font-medium' : completed ? 'text-green-400' : 'text-gray-500'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

// Key Display Component
function KeyDisplay({
  label,
  value,
  onCopy,
  copied,
  highlight,
}: {
  label: string
  value: string
  onCopy: () => void
  copied: boolean
  highlight?: boolean
}) {
  const truncate = (v: string) => {
    if (v.length <= 24) return v
    return `${v.slice(0, 12)}...${v.slice(-10)}`
  }

  return (
    <div className={`p-3 rounded-lg ${highlight ? 'bg-purple-500/20' : 'bg-gray-900/50'}`}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <code className={`flex-1 font-mono text-sm break-all ${highlight ? 'text-purple-300' : 'text-gray-300'}`}>
          {truncate(value)}
        </code>
        <button
          onClick={onCopy}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors shrink-0"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  )
}
