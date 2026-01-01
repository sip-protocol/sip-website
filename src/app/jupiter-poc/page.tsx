'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy,
  Check,
  Wallet,
  Shield,
  ArrowDown,
  RefreshCw,
  ExternalLink,
  Zap,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
} from 'lucide-react'

// Dynamic SDK import to avoid WASM loading during SSG
const loadSDK = () => import('@sip-protocol/sdk')

// Jupiter API endpoints
const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote'

// Common Solana token mints
const TOKENS = {
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    mint: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    icon: '/tokens/sol.svg',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    icon: '/tokens/usdc.svg',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether',
    mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: 6,
    icon: '/tokens/usdt.svg',
  },
  BONK: {
    symbol: 'BONK',
    name: 'Bonk',
    mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    decimals: 5,
    icon: '/tokens/bonk.svg',
  },
} as const

type TokenSymbol = keyof typeof TOKENS

interface JupiterQuote {
  inputMint: string
  outputMint: string
  inAmount: string
  outAmount: string
  priceImpactPct: string
  routePlan: Array<{
    swapInfo: {
      ammKey: string
      label: string
      inputMint: string
      outputMint: string
      inAmount: string
      outAmount: string
      feeAmount: string
      feeMint: string
    }
    percent: number
  }>
}

interface PrivacyLayer {
  stealthAddress: string
  ephemeralKey: string
  viewingKey?: string
}

export default function JupiterPOCPage() {
  // Wallet state
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Swap state
  const [fromToken, setFromToken] = useState<TokenSymbol>('SOL')
  const [toToken, setToToken] = useState<TokenSymbol>('USDC')
  const [amount, setAmount] = useState('1')
  const [quote, setQuote] = useState<JupiterQuote | null>(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)

  // Privacy state
  const [privacyEnabled, setPrivacyEnabled] = useState(true)
  const [privacyLayer, setPrivacyLayer] = useState<PrivacyLayer | null>(null)
  const [isGeneratingPrivacy, setIsGeneratingPrivacy] = useState(false)

  // UI state
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)

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
        cluster: 'mainnet-beta',
      })

      await adapter.connect()
      const address = adapter.address

      if (address) {
        setWalletAddress(address)
        setIsConnected(true)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect'
      setError(message.includes('rejected') ? 'Connection rejected' : message)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  // Fetch Jupiter quote
  const fetchQuote = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setQuote(null)
      return
    }

    setIsLoadingQuote(true)
    setError(null)

    try {
      const fromMint = TOKENS[fromToken].mint
      const toMint = TOKENS[toToken].mint
      const fromDecimals = TOKENS[fromToken].decimals
      const amountLamports = Math.floor(parseFloat(amount) * Math.pow(10, fromDecimals))

      const url = new URL(JUPITER_QUOTE_API)
      url.searchParams.set('inputMint', fromMint)
      url.searchParams.set('outputMint', toMint)
      url.searchParams.set('amount', amountLamports.toString())
      url.searchParams.set('slippageBps', '50') // 0.5% slippage

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error('Failed to fetch quote')
      }

      const data: JupiterQuote = await response.json()
      setQuote(data)

      // Generate privacy layer when quote is fetched
      if (privacyEnabled) {
        await generatePrivacyLayer()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote')
      setQuote(null)
    } finally {
      setIsLoadingQuote(false)
    }
  }, [amount, fromToken, toToken, privacyEnabled])

  // Generate privacy layer (stealth address)
  const generatePrivacyLayer = useCallback(async () => {
    setIsGeneratingPrivacy(true)

    try {
      const sdk = await loadSDK()

      // Generate Ed25519 stealth meta-address for Solana
      const { metaAddress, viewingPrivateKey } = sdk.generateEd25519StealthMetaAddress('solana')

      // Generate one-time stealth address
      const { stealthAddress } = sdk.generateEd25519StealthAddress(metaAddress)

      setPrivacyLayer({
        stealthAddress: stealthAddress.address,
        ephemeralKey: stealthAddress.ephemeralPublicKey,
        viewingKey: viewingPrivateKey,
      })
    } catch (err) {
      console.error('Failed to generate privacy layer:', err)
    } finally {
      setIsGeneratingPrivacy(false)
    }
  }, [])

  // Fetch quote when inputs change
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (amount && parseFloat(amount) > 0) {
        fetchQuote()
      }
    }, 500)

    return () => clearTimeout(debounce)
  }, [amount, fromToken, toToken, fetchQuote])

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

  // Format output amount
  const formatOutput = (outAmount: string, decimals: number) => {
    const value = parseInt(outAmount) / Math.pow(10, decimals)
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 })
  }

  // Truncate address
  const truncate = (addr: string, start = 6, end = 4) => {
    if (addr.length <= start + end + 3) return addr
    return `${addr.slice(0, start)}...${addr.slice(-end)}`
  }

  // Swap tokens
  const swapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <section className="border-b border-gray-800/50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                Jupiter Integration
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Private Swaps
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Private DEX Swaps on Solana
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Jupiter aggregator quotes wrapped with SIP Protocol privacy primitives.
              Same liquidity, private execution.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
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

          {/* Swap Card */}
          <div className="rounded-2xl bg-gray-900/50 border border-gray-800 overflow-hidden">
            {/* Privacy Toggle */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {privacyEnabled ? (
                  <Shield className="h-5 w-5 text-purple-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
                <span className={`text-sm font-medium ${privacyEnabled ? 'text-purple-400' : 'text-gray-400'}`}>
                  {privacyEnabled ? 'Privacy Enabled' : 'Privacy Disabled'}
                </span>
              </div>
              <button
                onClick={() => setPrivacyEnabled(!privacyEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacyEnabled ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacyEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Wallet Connection or Swap Interface */}
            {!isConnected ? (
              <div className="p-8 text-center">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                  <Wallet className="h-8 w-8 text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Connect Wallet
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Connect Phantom to start swapping with privacy
                </p>

                {phantomAvailable ? (
                  <button
                    onClick={connectPhantom}
                    disabled={isConnecting}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all"
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
            ) : (
              <div className="p-4 space-y-4">
                {/* Connected Address */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Connected:</span>
                  <span className="font-mono text-gray-300">{truncate(walletAddress || '')}</span>
                </div>

                {/* From Token */}
                <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">You pay</span>
                    <span className="text-xs text-gray-500">Balance: --</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      className="flex-1 bg-transparent text-2xl font-medium text-white outline-none placeholder:text-gray-600"
                    />
                    <div className="relative">
                      <button
                        onClick={() => setShowFromDropdown(!showFromDropdown)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        <span className="text-lg">{TOKENS[fromToken].symbol}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                      {showFromDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-40 rounded-lg bg-gray-800 border border-gray-700 shadow-xl z-10">
                          {Object.keys(TOKENS).map((symbol) => (
                            <button
                              key={symbol}
                              onClick={() => {
                                setFromToken(symbol as TokenSymbol)
                                setShowFromDropdown(false)
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                            >
                              {symbol}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-2 relative z-10">
                  <button
                    onClick={swapTokens}
                    className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    <ArrowDown className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                {/* To Token */}
                <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">You receive</span>
                    {privacyEnabled && (
                      <span className="flex items-center gap-1 text-xs text-purple-400">
                        <Lock className="h-3 w-3" />
                        Private
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 text-2xl font-medium text-white">
                      {isLoadingQuote ? (
                        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                      ) : quote ? (
                        formatOutput(quote.outAmount, TOKENS[toToken].decimals)
                      ) : (
                        <span className="text-gray-600">0.0</span>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowToDropdown(!showToDropdown)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        <span className="text-lg">{TOKENS[toToken].symbol}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                      {showToDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-40 rounded-lg bg-gray-800 border border-gray-700 shadow-xl z-10">
                          {Object.keys(TOKENS).map((symbol) => (
                            <button
                              key={symbol}
                              onClick={() => {
                                setToToken(symbol as TokenSymbol)
                                setShowToDropdown(false)
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                            >
                              {symbol}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quote Details */}
                {quote && (
                  <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price Impact</span>
                      <span className={parseFloat(quote.priceImpactPct) > 1 ? 'text-amber-400' : 'text-gray-300'}>
                        {parseFloat(quote.priceImpactPct).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Route</span>
                      <span className="text-gray-300">
                        {quote.routePlan.map(r => r.swapInfo.label).join(' → ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Powered by</span>
                      <span className="text-green-400 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Jupiter
                      </span>
                    </div>
                  </div>
                )}

                {/* Privacy Layer */}
                {privacyEnabled && privacyLayer && (
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-purple-400">
                      <Shield className="h-4 w-4" />
                      Privacy Layer Active
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Stealth Recipient:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-purple-300">{truncate(privacyLayer.stealthAddress)}</span>
                          <button
                            onClick={() => copyToClipboard(privacyLayer.stealthAddress, 'stealth')}
                            className="p-1 hover:bg-purple-500/20 rounded"
                          >
                            {copied === 'stealth' ? (
                              <Check className="h-3 w-3 text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Output will be sent to a one-time unlinkable address
                      </div>
                    </div>
                  </div>
                )}

                {/* Swap Button */}
                <button
                  disabled={!quote || isLoadingQuote}
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoadingQuote ? 'Loading...' : privacyEnabled ? 'Swap Privately' : 'Swap'}
                </button>

                <p className="text-xs text-center text-gray-500">
                  This is a demonstration. Real swaps require transaction signing.
                </p>
              </div>
            )}
          </div>

          {/* How It Works */}
          <div className="mt-8 p-6 rounded-xl bg-gray-900/30 border border-gray-800">
            <h3 className="text-sm font-medium text-gray-300 mb-4">How Private Swaps Work</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white shrink-0">1</span>
                <span><strong className="text-gray-200">Jupiter Quote:</strong> Best route and price from all Solana DEXs</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white shrink-0">2</span>
                <span><strong className="text-gray-200">SIP Privacy:</strong> Generate stealth address for receiving tokens</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white shrink-0">3</span>
                <span><strong className="text-gray-200">Private Execution:</strong> Output tokens go to unlinkable address</span>
              </div>
            </div>
          </div>
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
              <span className="text-xs text-gray-500 ml-2">private-jupiter-swap.ts</span>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
              <code className="text-gray-300">{`import {
  createSolanaAdapter,
  generateEd25519StealthMetaAddress,
  generateEd25519StealthAddress,
} from '@sip-protocol/sdk'

// 1. Connect wallet
const adapter = createSolanaAdapter({ wallet: 'phantom', cluster: 'mainnet-beta' })
await adapter.connect()

// 2. Get Jupiter quote
const quote = await fetch(\`https://quote-api.jup.ag/v6/quote?\${params}\`)
  .then(r => r.json())

// 3. Generate privacy layer
const { metaAddress } = generateEd25519StealthMetaAddress('solana')
const { stealthAddress } = generateEd25519StealthAddress(metaAddress)

// 4. Execute swap with stealth recipient
// Instead of sending to your wallet, output goes to stealthAddress.address
// Only you can spend from this address (you have the private key)

const swapTx = await fetch('https://quote-api.jup.ag/v6/swap', {
  method: 'POST',
  body: JSON.stringify({
    quoteResponse: quote,
    userPublicKey: adapter.address,
    destinationTokenAccount: stealthAddress.address, // Privacy!
  }),
})`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-12 border-t border-gray-800/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Privacy Comparison</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-red-400" />
                <h3 className="text-lg font-semibold text-red-400">Standard Jupiter Swap</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Your wallet address is visible on-chain</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>All swaps linked to your identity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Trading patterns can be analyzed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Portfolio visible to anyone</span>
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-green-400" />
                <h3 className="text-lg font-semibold text-green-400">SIP + Jupiter Swap</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Output goes to stealth address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Each swap uses unique address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Trading patterns hidden</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Same Jupiter liquidity + routing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-gray-800/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Add Privacy to Your DEX</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Integrate SIP Protocol with any Solana DEX aggregator for private swaps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://docs.sip-protocol.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Read the Docs
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
