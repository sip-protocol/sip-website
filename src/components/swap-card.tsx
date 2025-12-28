'use client'

import { useState, useMemo, useCallback, useRef, useEffect, type KeyboardEvent } from 'react'
import Image from 'next/image'
import { PrivacyLevel } from '@sip-protocol/types'
import { useQuote, useSwap, useBalance, getStatusMessage } from '@/hooks'
import { useWalletStore, useSwapModeStore, useSettingsStore } from '@/stores'
import { SlippageSettings, SlippageDisplay } from '@/components/slippage-settings'
import {
  NETWORKS,
  parseAmount,
  validateZcashAddress,
  getAddressTypeLabel,
  getPrivacyColorClass,
  calculatePriceImpact,
  getImpactColorClass,
  formatImpact,
  getExchangeRateSync,
} from '@/lib'
import { TransactionStatus } from '@/components/transaction-status'
import { SwapModeToggle } from '@/components/swap-mode-toggle'
import { StealthAddressDisplay } from '@/components/stealth-address-display'
import { ViewingKeyDisplay } from '@/components/viewing-key-display'
import { PedersenCommitmentDisplay } from '@/components/pedersen-commitment-display'
import { QuoteErrorCard } from '@/components/error-card'
import { QuoteStatusBadge } from '@/components/quote-freshness'
import { RecentSwaps } from '@/components/recent-swaps'
import type { NetworkId } from '@/lib'

interface SwapCardProps {
  privacyLevel: PrivacyLevel
}

interface Token {
  symbol: string
  name: string
  chain: NetworkId
  logo: string
  /** SPL token mint address (Solana only). Native tokens (SOL) don't have this */
  mint?: string
  /** Token decimals (default: chain native decimals) */
  decimals?: number
}

// USDC SPL token mint address on Solana mainnet
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
const USDC_DECIMALS = 6

// Tokens available as SOURCE (chains with wallet deposit support)
// Only native tokens - NEAR Intents solver doesn't support SPL token deposits yet
const fromTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', chain: 'ethereum', logo: '/tokens/eth.png' },
  { symbol: 'SOL', name: 'Solana', chain: 'solana', logo: '/tokens/sol.png' },
  { symbol: 'NEAR', name: 'NEAR', chain: 'near', logo: '/tokens/near.png' },
]

// Tokens available as DESTINATION (NEAR Intents supported chains)
// ZEC is the privacy output - users swap TO Zcash for shielded transactions
const toTokens: Token[] = [
  { symbol: 'ZEC', name: 'Zcash', chain: 'zcash', logo: '/tokens/zec.png' },
  { symbol: 'ETH', name: 'Ethereum', chain: 'ethereum', logo: '/tokens/eth.png' },
  { symbol: 'SOL', name: 'Solana', chain: 'solana', logo: '/tokens/sol.png' },
  { symbol: 'NEAR', name: 'NEAR', chain: 'near', logo: '/tokens/near.png' },
  { symbol: 'USDC', name: 'USDC (Solana)', chain: 'solana', logo: '/tokens/usdc.png', mint: USDC_MINT, decimals: USDC_DECIMALS },
]

export function SwapCard({ privacyLevel }: SwapCardProps) {
  // Default to ETH→SOL: Cross-chain swap demo
  const [fromToken, setFromToken] = useState(fromTokens[0]) // ETH
  const [toToken, setToToken] = useState(toTokens[2]) // SOL (index 2: ZEC, ETH, SOL, NEAR)
  const [amount, setAmount] = useState('')
  const [zecRecipient, setZecRecipient] = useState('') // ZEC recipient address (z-addr or t-addr)
  const [destinationAddress, setDestinationAddress] = useState('') // Destination address for all swap modes
  const [showSettings, setShowSettings] = useState(false)

  // Token selection handlers
  // Allow same-token selection when privacy is enabled (for same-chain privacy transfers)
  // Only auto-swap in transparent mode to prevent accidental same-token selection
  const handleFromTokenSelect = (token: Token) => {
    if (token.symbol === toToken.symbol && privacyLevel === PrivacyLevel.TRANSPARENT) {
      // Swap tokens to prevent same-token selection in transparent mode
      setToToken(fromToken)
    }
    setFromToken(token)
  }

  const handleToTokenSelect = (token: Token) => {
    if (token.symbol === fromToken.symbol && privacyLevel === PrivacyLevel.TRANSPARENT) {
      // Swap tokens to prevent same-token selection in transparent mode
      setFromToken(toToken)
    }
    setToToken(token)
  }

  // Flip from/to tokens (swap direction)
  const handleFlipTokens = useCallback(() => {
    // Check if the current toToken exists in fromTokens (e.g., ZEC is not a valid source)
    const newFromToken = fromTokens.find(t => t.symbol === toToken.symbol)
    const newToToken = toTokens.find(t => t.symbol === fromToken.symbol)

    if (newFromToken && newToToken) {
      // Both tokens are valid for swapping
      setFromToken(newFromToken)
      setToToken(newToToken)
    } else if (!newFromToken) {
      // toToken (e.g., ZEC) can't be a source - keep it as destination, just swap to first available
      const fallbackFrom = fromTokens.find(t => t.symbol !== toToken.symbol) || fromTokens[0]
      setFromToken(fallbackFrom)
      // Keep toToken as is since it can't be flipped
    }
  }, [fromToken, toToken])

  // Wallet state
  const { isConnected, openModal } = useWalletStore()

  // Settings
  const { slippage } = useSettingsStore()

  // Swap mode (preview vs execute)
  const { mode: swapMode } = useSwapModeStore()
  const isPreviewMode = swapMode === 'preview'

  // Balance fetching - pass token mint for SPL tokens like USDC
  const { balance: rawBalance, formatted: balance, symbol: balanceSymbol, isLoading: isBalanceLoading } = useBalance({
    tokenMint: fromToken.mint,
    tokenSymbol: fromToken.symbol,
    tokenDecimals: fromToken.decimals,
  })

  // Check if balance matches source token chain
  const { chain: connectedChain } = useWalletStore()
  const isBalanceForSourceToken = connectedChain === fromToken.chain

  // Calculate insufficient balance
  const hasInsufficientBalance = useMemo(() => {
    if (!isConnected || !rawBalance || !amount || !isBalanceForSourceToken) return false
    try {
      // Use token decimals if available (e.g., USDC = 6), otherwise use chain native decimals
      const decimals = fromToken.decimals ?? NETWORKS[fromToken.chain]?.decimals ?? 18
      const amountBigInt = parseAmount(amount, decimals)
      return amountBigInt > rawBalance
    } catch {
      return false
    }
  }, [isConnected, rawBalance, amount, fromToken.chain, fromToken.decimals, isBalanceForSourceToken])

  // MAX button handler - leave small amount for gas
  const handleMaxClick = useCallback(() => {
    if (!rawBalance || !isBalanceForSourceToken) return
    // Use token decimals if available (e.g., USDC = 6), otherwise use chain native decimals
    const decimals = fromToken.decimals ?? NETWORKS[fromToken.chain]?.decimals ?? 18
    // For SPL tokens (non-native), use the full balance; for native tokens, leave gas reserve
    const isNativeToken = !fromToken.mint
    const gasReserve = isNativeToken ? BigInt(10 ** (decimals - 2)) : 0n // 0.01 for native, 0 for SPL
    const maxAmount = rawBalance > gasReserve ? rawBalance - gasReserve : rawBalance
    // Convert to string with proper decimals
    const divisor = BigInt(10 ** decimals)
    const whole = maxAmount / divisor
    const fraction = maxAmount % divisor
    const fractionStr = fraction.toString().padStart(decimals, '0').replace(/0+$/, '')
    const formattedMax = fractionStr ? `${whole}.${fractionStr}` : whole.toString()
    setAmount(formattedMax)
  }, [rawBalance, fromToken.chain, fromToken.decimals, fromToken.mint, isBalanceForSourceToken])

  // Build quote params
  const quoteParams = useMemo(() => {
    if (!amount || parseFloat(amount) <= 0) return null
    // Include destination address for all modes (except ZEC which has its own z-address input)
    // This ensures swaps actually deliver funds to user's wallet in all privacy modes
    const isZecDest = toToken.symbol === 'ZEC'
    return {
      fromChain: fromToken.chain,
      toChain: toToken.chain,
      fromToken: fromToken.symbol,
      toToken: toToken.symbol,
      amount,
      privacyLevel,
      // Pass destination for all modes - required for funds to arrive at user's wallet
      destinationAddress: !isZecDest ? destinationAddress.trim() || undefined : undefined,
    }
  }, [fromToken, toToken, amount, privacyLevel, destinationAddress])

  // Fetch quote
  const {
    quote,
    outputAmount,
    rate,
    feePercent,
    estimatedTime,
    isLoading: isQuoteLoading,
    error: quoteError,
    freshness: quoteFreshness,
    expiresIn: quoteExpiresIn,
    refresh: refreshQuote,
  } = useQuote(quoteParams)

  // Swap execution
  const {
    status,
    txHash,
    explorerUrl,
    depositTxHash,
    depositExplorerUrl,
    txChain,
    settlementChain,
    error: swapError,
    swapId,
    depositAddress,
    depositAmount,
    depositToken,
    execute,
    reset,
    cancel,
  } = useSwap()

  const isTransparent = privacyLevel === PrivacyLevel.TRANSPARENT
  const isShielded = privacyLevel === PrivacyLevel.SHIELDED
  const isCompliant = privacyLevel === PrivacyLevel.COMPLIANT
  const hasPrivacy = !isTransparent // Either shielded or compliant
  const isSwapping = status === 'confirming' || status === 'signing' || status === 'pending'
  const isSuccess = status === 'success'
  const isError = status === 'error'
  const isZecDestination = toToken.symbol === 'ZEC'

  // Same-chain privacy detection (Solana → Solana with privacy)
  const isSameChainPrivacy = fromToken.chain === 'solana' && toToken.chain === 'solana' && fromToken.symbol === toToken.symbol && hasPrivacy

  // Calculate price impact (compare quote output vs market rate)
  const priceImpact = useMemo(() => {
    if (!amount || !outputAmount) return null
    const inputNum = parseFloat(amount)
    const outputNum = parseFloat(outputAmount)
    if (inputNum <= 0 || outputNum <= 0) return null
    // Use market rate from CoinGecko, not quote rate
    const marketRate = getExchangeRateSync(fromToken.symbol, toToken.symbol)
    if (marketRate <= 0) return null
    return calculatePriceImpact(inputNum, outputNum, marketRate)
  }, [amount, outputAmount, fromToken.symbol, toToken.symbol])

  // Calculate market rate comparison
  const marketComparison = useMemo(() => {
    if (!rate) return null
    const quoteRate = parseFloat(rate)
    if (quoteRate <= 0) return null

    // Get market rate from CoinGecko prices
    const marketRate = getExchangeRateSync(fromToken.symbol, toToken.symbol)
    if (marketRate <= 0) return null

    // Calculate difference: positive = better than market, negative = worse
    const difference = ((quoteRate - marketRate) / marketRate) * 100

    return {
      marketRate,
      difference,
      isBetter: difference >= 0,
    }
  }, [rate, fromToken.symbol, toToken.symbol])

  // Zcash address validation
  const zecValidation = useMemo(() => {
    if (!isZecDestination || !zecRecipient.trim()) {
      return null
    }
    return validateZcashAddress(zecRecipient)
  }, [isZecDestination, zecRecipient])

  // Check if ZEC address is valid (required for ZEC swaps)
  const isZecAddressValid = !isZecDestination || (zecValidation?.isValid ?? false)
  const isZecTransparent = zecValidation?.type === 'transparent'

  // Check if destination address is valid (required for all non-ZEC swaps)
  // Destination is always required to ensure funds arrive at user's wallet
  const needsDestinationAddress = !isZecDestination
  const isDestinationAddressValid = !needsDestinationAddress || (destinationAddress.trim().length > 0)

  const handleSwap = async () => {
    if (!isConnected) {
      openModal()
      return
    }

    if (!quoteParams || !quote) return

    await execute({
      ...quoteParams,
      quote,
      // Pass destination address for all swaps (ZEC has its own z-address input)
      destinationAddress: needsDestinationAddress ? destinationAddress.trim() : undefined,
    })
  }

  const handleReset = () => {
    reset()
    setAmount('')
  }

  return (
    <div className="card overflow-hidden" data-testid="swap-card">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Swap</h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            aria-label="Open swap settings"
            aria-expanded={showSettings}
            data-testid="settings-button"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        </div>
        <div
          data-testid="privacy-badge"
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
            hasPrivacy
              ? 'bg-purple-600/20 text-purple-400'
              : 'bg-gray-700/50 text-gray-400'
          }`}
        >
          {isShielded ? (
            <>
              <ShieldIcon className="h-3 w-3" />
              Shielded
            </>
          ) : isCompliant ? (
            <>
              <KeyIcon className="h-3 w-3" />
              Compliant
            </>
          ) : (
            <>
              <EyeIcon className="h-3 w-3" />
              Public
            </>
          )}
        </div>
      </div>

      {/* Slippage Settings Panel */}
      {showSettings && (
        <div className="mb-4" data-testid="slippage-settings-panel">
          <SlippageSettings onClose={() => setShowSettings(false)} />
        </div>
      )}

      {/* Swap Mode Toggle */}
      <div className="mb-4">
        <SwapModeToggle />
      </div>

      {/* Preview Mode Banner */}
      {isPreviewMode && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3" data-testid="preview-mode-banner">
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <PreviewIcon className="h-4 w-4" />
            <span className="font-medium">Preview Mode</span>
            <span className="text-amber-400/70">— Explore quotes safely, no real transactions</span>
          </div>
        </div>
      )}

      {/* Same-Chain Privacy Banner */}
      {isSameChainPrivacy && (
        <div className="mb-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-3" data-testid="same-chain-privacy-banner">
          <div className="flex items-center gap-2 text-sm text-purple-400">
            <SolanaLockIcon className="h-4 w-4" />
            <span className="font-medium">Same-Chain Privacy</span>
            <span className="text-purple-400/70">— Direct stealth transfer on Solana</span>
          </div>
          <p className="mt-1 text-xs text-purple-400/60">
            Funds sent to a one-time stealth address. Faster than cross-chain.
          </p>
        </div>
      )}

      {/* From */}
      <div className="mb-2 rounded-xl bg-gray-800/50 p-3 sm:p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-1 text-sm text-gray-400">
          <span>From</span>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm">
              Balance:{' '}
              {isConnected ? (
                isBalanceForSourceToken ? (
                  isBalanceLoading ? (
                    <span className="inline-block h-4 w-12 animate-pulse rounded bg-gray-700" />
                  ) : (
                    `${balance} ${balanceSymbol}`
                  )
                ) : (
                  <span className="text-gray-500">—</span>
                )
              ) : (
                '—'
              )}
            </span>
            {isConnected && isBalanceForSourceToken && !isBalanceLoading && rawBalance && rawBalance > 0n && (
              <button
                onClick={handleMaxClick}
                data-testid="max-button"
                className="min-h-[44px] min-w-[44px] rounded bg-purple-500/20 px-3 py-2 text-xs font-medium text-purple-400 transition-colors hover:bg-purple-500/30 active:bg-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                MAX
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            data-testid="from-amount"
            aria-label={`Amount of ${fromToken.symbol} to swap`}
            aria-describedby={hasInsufficientBalance ? 'insufficient-balance-msg' : undefined}
            aria-invalid={hasInsufficientBalance}
            className={`min-w-0 flex-1 bg-transparent text-xl font-medium outline-none placeholder:text-gray-600 sm:text-2xl ${
              hasInsufficientBalance ? 'text-red-400' : ''
            }`}
          />
          <TokenSelector
            token={fromToken}
            onSelect={handleFromTokenSelect}
            tokens={fromTokens}
            testId="from-token"
          />
        </div>
        {hasInsufficientBalance && (
          <p
            id="insufficient-balance-msg"
            className="mt-2 flex items-center gap-1 text-xs text-red-400"
            data-testid="insufficient-balance-warning"
            role="alert"
          >
            <WarningIcon className="h-3 w-3" aria-hidden="true" />
            Insufficient balance
          </p>
        )}
      </div>

      {/* Swap direction */}
      <div className="-my-2 flex justify-center">
        <button
          onClick={handleFlipTokens}
          aria-label="Swap direction"
          className="z-10 rounded-xl border border-gray-700 bg-gray-900 p-2 transition-all hover:border-purple-500 hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <ArrowDownIcon className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* To */}
      <div className="mb-6 mt-2 rounded-xl bg-gray-800/50 p-3 sm:p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-1 text-sm text-gray-400">
          <span>To (estimated)</span>
          {hasPrivacy && (
            <span className="flex items-center gap-1 text-xs text-purple-400 sm:text-sm">
              <ShieldIcon className="h-3 w-3" />
              Stealth Address
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            {isQuoteLoading ? (
              <span className="flex items-center gap-2 text-xl font-medium text-gray-500 sm:text-2xl" data-testid="quote-loading">
                <LoadingSpinner />
              </span>
            ) : (
              <span className="block truncate text-xl font-medium text-gray-400 sm:text-2xl" data-testid="to-output">
                {outputAmount || '0'}
              </span>
            )}
          </div>
          <TokenSelector
            token={toToken}
            onSelect={handleToTokenSelect}
            tokens={toTokens}
            testId="to-token"
          />
        </div>
        {/* Quote freshness status */}
        {quote && !quoteError && (
          <div className="mt-2 flex items-center justify-between">
            <QuoteStatusBadge
              freshness={quoteFreshness}
              expiresIn={quoteExpiresIn}
              isLoading={isQuoteLoading}
              onRefresh={refreshQuote}
            />
          </div>
        )}
        {/* Quote error with recovery actions */}
        {quoteError && (
          <div className="mt-2">
            <QuoteErrorCard
              error={quoteError}
              onRetry={refreshQuote}
              onClear={() => setAmount('')}
            />
          </div>
        )}
      </div>

      {/* ZEC Recipient Address Input */}
      {isZecDestination && (
        <div className="mb-4 rounded-xl bg-gray-800/50 p-3 sm:p-4" data-testid="zec-recipient-section">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-1 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <ZcashIcon className="h-4 w-4 text-yellow-500" />
              <span className="text-xs sm:text-sm">Zcash Recipient</span>
            </span>
            <span className="text-xs text-yellow-500">Required</span>
          </div>

          {/* Input with validation indicator */}
          <div className="relative">
            <input
              type="text"
              value={zecRecipient}
              onChange={(e) => setZecRecipient(e.target.value)}
              placeholder="Enter z-address (zs1...) or t-address (t1...)"
              data-testid="zec-recipient-input"
              aria-label="Zcash recipient address"
              aria-describedby={zecValidation?.error ? 'zec-validation-error' : 'zec-address-help'}
              aria-invalid={zecValidation ? !zecValidation.isValid : undefined}
              className={`w-full rounded-lg bg-gray-700/50 px-3 py-2 pr-10 text-sm outline-none placeholder:text-gray-500 transition-all ${
                zecValidation
                  ? zecValidation.isValid
                    ? 'ring-1 ring-green-500/50'
                    : 'ring-1 ring-red-500/50'
                  : 'focus:ring-1 focus:ring-yellow-500/50'
              }`}
            />
            {/* Validation Icon */}
            {zecRecipient.trim() && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {zecValidation?.isValid ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-400" data-testid="zec-valid-icon" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-400" data-testid="zec-invalid-icon" />
                )}
              </div>
            )}
          </div>

          {/* Validation Status */}
          {zecValidation && (
            <div className="mt-2 space-y-1">
              {zecValidation.isValid ? (
                <>
                  {/* Address Type Label */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">Type:</span>
                    <span className={getPrivacyColorClass(zecValidation.type)}>
                      {getAddressTypeLabel(zecValidation.type)}
                    </span>
                    {zecValidation.isTestnet && (
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-400">
                        Testnet
                      </span>
                    )}
                  </div>

                  {/* Transparent Address Warning */}
                  {isZecTransparent && (
                    <div
                      className="flex items-start gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 p-2 mt-2"
                      data-testid="zec-transparent-warning"
                    >
                      <WarningIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-400" />
                      <div className="text-xs text-orange-400">
                        <strong>Privacy Warning:</strong> Transparent addresses expose transaction details
                        publicly. Use a <span className="text-yellow-400">zs1...</span> (Sapling) or{' '}
                        <span className="text-purple-400">u1...</span> (Unified) address for privacy.
                      </div>
                    </div>
                  )}

                  {/* Privacy Note for shielded addresses */}
                  {!isZecTransparent && zecValidation.privacyNote && (
                    <p className="text-xs text-green-400/80 mt-1">
                      <ShieldIcon className="inline h-3 w-3 mr-1" />
                      {zecValidation.privacyNote}
                    </p>
                  )}
                </>
              ) : (
                /* Error Message */
                <p
                  id="zec-validation-error"
                  className="flex items-center gap-1 text-xs text-red-400"
                  data-testid="zec-error-message"
                  role="alert"
                >
                  <XCircleIcon className="h-3 w-3" aria-hidden="true" />
                  {zecValidation.error}
                </p>
              )}
            </div>
          )}

          {/* Help Text when no input */}
          {!zecRecipient.trim() && (
            <p id="zec-address-help" className="mt-2 text-xs text-gray-500">
              Use a <span className="text-purple-400">u1...</span> (unified) or{' '}
              <span className="text-yellow-500">zs1...</span> (sapling) for full privacy
            </p>
          )}
        </div>
      )}

      {/* Destination Address Input for all modes (except ZEC which has z-address input) */}
      {!isZecDestination && (
        <div className="mb-4 rounded-xl bg-gray-800/50 p-3 sm:p-4" data-testid="destination-address-section">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-1 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              {isSameChainPrivacy ? (
                <>
                  <ShieldIcon className="h-4 w-4 text-purple-500" />
                  <span className="text-xs sm:text-sm">Recipient SIP Address</span>
                </>
              ) : (
                <>
                  <WalletIcon className="h-4 w-4 text-cyan-500" />
                  <span className="text-xs sm:text-sm">Destination Address</span>
                </>
              )}
            </span>
            <span className={`text-xs ${isSameChainPrivacy ? 'text-purple-500' : 'text-cyan-500'}`}>Required</span>
          </div>

          <input
            type="text"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            placeholder={isSameChainPrivacy
              ? 'sip:solana:ABC... (recipient stealth meta-address)'
              : `Enter ${toToken.name} address to receive funds`}
            data-testid="destination-address-input"
            aria-label={isSameChainPrivacy ? 'Recipient SIP meta-address' : 'Destination address'}
            className={`w-full rounded-lg bg-gray-700/50 px-3 py-2 text-sm outline-none placeholder:text-gray-500 transition-all ${
              isSameChainPrivacy ? 'focus:ring-1 focus:ring-purple-500/50' : 'focus:ring-1 focus:ring-cyan-500/50'
            }`}
          />

          <p className="mt-2 text-xs text-gray-500">
            {isSameChainPrivacy
              ? 'Enter the recipient\'s SIP stealth meta-address for private transfer'
              : hasPrivacy
                ? `Your ${toToken.name} address (swap is private - sender identity hidden)`
                : `Funds will be sent to this ${toToken.name} address after the swap completes`}
          </p>
        </div>
      )}

      {/* Privacy info */}
      {hasPrivacy && (
        <div className="mb-4 rounded-lg border border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-yellow-500/5 to-purple-500/10 p-3" data-testid="privacy-info">
          <div className="flex items-start gap-2">
            {isCompliant ? (
              <KeyIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400" />
            ) : (
              <ShieldIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400" />
            )}
            <div className="text-sm flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-purple-300">Privacy Protected</p>
                <span className="flex items-center gap-1 text-[10px] text-yellow-500">
                  <ZcashIcon className="h-3 w-3" />
                  Zcash Tech
                </span>
              </div>
              <p className="text-purple-400/80">
                {isCompliant
                  ? 'Transaction hidden with viewing key for auditors'
                  : 'Sender, amount, and recipient are hidden'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stealth Address Visualization - hidden when explicit destination provided (sender-shielded mode) */}
      {/* Only show stealth address when NO destination - meaning random stealth will be generated */}
      {hasPrivacy && amount && parseFloat(amount) > 0 && !isZecDestination && !destinationAddress.trim() && (
        <div className="mb-4">
          <StealthAddressDisplay
            toChain={toToken.chain}
            privacyLevel={privacyLevel}
          />
        </div>
      )}

      {/* Pedersen Commitment Display */}
      {hasPrivacy && amount && parseFloat(amount) > 0 && (
        <div className="mb-4">
          <PedersenCommitmentDisplay
            privacyLevel={privacyLevel}
            amount={amount}
            chain={fromToken.chain}
          />
        </div>
      )}

      {/* Viewing Key Export (Compliant Mode Only) */}
      {isCompliant && amount && parseFloat(amount) > 0 && (
        <div className="mb-4">
          <ViewingKeyDisplay privacyLevel={privacyLevel} />
        </div>
      )}

      {/* Transaction Status (pending, success, error) */}
      <TransactionStatus
        status={status}
        txHash={txHash}
        explorerUrl={explorerUrl}
        depositTxHash={depositTxHash}
        depositExplorerUrl={depositExplorerUrl}
        chain={txChain}
        settlementChain={settlementChain}
        error={swapError}
        isShielded={hasPrivacy}
        isCompliant={isCompliant}
        estimatedTime={estimatedTime}
        swapId={swapId}
        depositAddress={depositAddress}
        depositAmount={depositAmount}
        depositToken={depositToken}
        onReset={handleReset}
        onRetry={reset}
        onCancel={cancel}
      />

      {/* High Price Impact Warning */}
      {priceImpact && (priceImpact.severity === 'high' || priceImpact.severity === 'severe') && (
        <div
          className={`mb-4 rounded-xl border p-3 ${
            priceImpact.severity === 'severe'
              ? 'border-red-500/30 bg-red-500/10'
              : 'border-orange-500/30 bg-orange-500/10'
          }`}
          data-testid="price-impact-warning"
        >
          <div className="flex items-start gap-2">
            <WarningIcon
              className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                priceImpact.severity === 'severe' ? 'text-red-400' : 'text-orange-400'
              }`}
            />
            <div className="text-sm">
              <p className={priceImpact.severity === 'severe' ? 'font-medium text-red-300' : 'font-medium text-orange-300'}>
                {priceImpact.severity === 'severe' ? 'Extremely High Price Impact' : 'High Price Impact'}
              </p>
              <p className={priceImpact.severity === 'severe' ? 'text-red-400/80' : 'text-orange-400/80'}>
                This trade has a {formatImpact(priceImpact.percentage)} price impact.
                {priceImpact.severity === 'severe'
                  ? ' Consider trading a smaller amount or waiting for better liquidity.'
                  : ' You may receive less than expected.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Swap button */}
      {/* Destination Verification Banner - shows exactly where funds will go */}
      {!isZecDestination && destinationAddress.trim() && amount && parseFloat(amount) > 0 && !isSuccess && (
        <div className="mb-4 rounded-xl border-2 border-green-500/50 bg-green-500/10 p-3" data-testid="destination-verification">
          <div className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-green-300 text-sm">Funds will be sent to:</p>
              <p className="mt-1 font-mono text-xs text-green-400 break-all" data-testid="verified-destination">
                {destinationAddress.trim()}
              </p>
              <p className="mt-1 text-xs text-green-400/70">
                Verify this is YOUR {toToken.name} wallet address before swapping
              </p>
            </div>
          </div>
        </div>
      )}

      {!isSuccess && (
        <button
          onClick={handleSwap}
          disabled={(!amount || isSwapping || hasInsufficientBalance || !isZecAddressValid || !isDestinationAddressValid) && isConnected}
          data-testid="swap-button"
          className={`min-h-[52px] w-full rounded-xl py-3 text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 sm:py-4 sm:text-lg ${
            !isConnected
              ? 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800'
              : !amount || hasInsufficientBalance || !isZecAddressValid || !isDestinationAddressValid
                ? 'cursor-not-allowed bg-gray-800 text-gray-500'
                : isSwapping
                  ? 'cursor-wait bg-purple-600/50 text-white'
                  : isPreviewMode
                    ? 'bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800'
                    : 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800'
          }`}
        >
          {!isConnected ? (
            <span>Connect Wallet</span>
          ) : hasInsufficientBalance ? (
            <span>Insufficient Balance</span>
          ) : !isZecAddressValid ? (
            <span>Enter Valid Zcash Address</span>
          ) : !isDestinationAddressValid ? (
            <span>Enter Destination Address</span>
          ) : isSwapping ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner />
              {getStatusMessage(status, hasPrivacy)}
            </span>
          ) : isPreviewMode ? (
            <span className="flex items-center justify-center gap-2">
              <PreviewIcon className="h-5 w-5" />
              Preview Quote
            </span>
          ) : (
            <span>
              {isShielded ? 'Shielded Swap' : isCompliant ? 'Compliant Swap' : 'Swap'}
            </span>
          )}
        </button>
      )}

      {/* Transaction details */}
      {amount && parseFloat(amount) > 0 && (
        <div className="mt-4 space-y-2 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center justify-between gap-1 text-gray-400">
            <span className="flex items-center gap-1">
              Rate
              {marketComparison && Math.abs(marketComparison.difference) <= 1 && (
                <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded" data-testid="best-rate-badge">
                  Best rate
                </span>
              )}
            </span>
            <div className="text-right">
              <span>1 {fromToken.symbol} ≈ {rate} {toToken.symbol}</span>
              {marketComparison && (
                <span
                  className={`ml-2 text-xs ${
                    marketComparison.isBetter ? 'text-green-400' : 'text-red-400'
                  }`}
                  data-testid="market-comparison"
                >
                  ({marketComparison.isBetter ? '+' : ''}{marketComparison.difference.toFixed(2)}% vs market)
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Solver Fee</span>
            <span>{feePercent}%</span>
          </div>
          {priceImpact && (
            <div className="flex items-center justify-between text-gray-400">
              <span>Price Impact</span>
              <span className={`flex items-center gap-1 ${getImpactColorClass(priceImpact.severity)}`}>
                {formatImpact(priceImpact.percentage)}
                {(priceImpact.severity === 'high' || priceImpact.severity === 'severe') && (
                  <WarningIcon className="h-3 w-3" />
                )}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-gray-400">
            <span>Slippage</span>
            <SlippageDisplay onClick={() => setShowSettings(true)} />
          </div>
          {estimatedTime > 0 && (
            <div className="flex items-center justify-between text-gray-400">
              <span>Est. time</span>
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                {formatDuration(estimatedTime)}
              </span>
            </div>
          )}
          {outputAmount && parseFloat(outputAmount) > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-1 text-gray-400">
              <span>Minimum received</span>
              <span className="text-right text-green-400">
                {(parseFloat(outputAmount) * (1 - slippage / 100)).toFixed(6).replace(/\.?0+$/, '')} {toToken.symbol}
              </span>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-1 text-gray-400">
            <span>Privacy</span>
            <span className={`text-right ${isShielded ? 'text-purple-400' : 'text-gray-500'}`}>
              {privacyLevel === PrivacyLevel.TRANSPARENT
                ? 'None'
                : privacyLevel === PrivacyLevel.COMPLIANT
                  ? 'With viewing key'
                  : 'Full shielding'}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-1 text-gray-400">
            <span>Route</span>
            <span className="text-right text-gray-500">
              {fromToken.name} → {toToken.name}
            </span>
          </div>
        </div>
      )}

      {/* Recent Swaps History */}
      <div className="mt-6">
        <RecentSwaps />
      </div>

      {/* Powered By: Zcash + NEAR Intents */}
      <div className="mt-6 pt-4 border-t border-gray-800" data-testid="powered-by-section">
        <div className="text-center mb-3">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Powered by</span>
        </div>
        <div className="flex items-center justify-center gap-6">
          {/* Zcash */}
          <a
            href="https://z.cash"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors group"
            aria-label="Powered by Zcash privacy technology"
          >
            <ZcashLogo className="h-6 w-6 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">Zcash</div>
              <div className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors">Privacy Layer</div>
            </div>
          </a>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-700" aria-hidden="true" />

          {/* NEAR Intents */}
          <a
            href="https://near.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors group"
            aria-label="Powered by NEAR Intents settlement"
          >
            <NearLogo className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">NEAR Intents</div>
              <div className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors">Settlement Layer</div>
            </div>
          </a>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
          <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
            Shielded Transactions
          </span>
          <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Stealth Addresses
          </span>
          <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Cross-Chain
          </span>
        </div>
      </div>
    </div>
  )
}

function TokenSelector({
  token,
  onSelect,
  tokens,
  testId,
}: {
  token: Token
  onSelect: (token: Token) => void
  tokens: Token[]
  testId?: string
}) {
  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  const isFrom = testId === 'from-token'
  const label = isFrom ? 'Source token' : 'Destination token'

  // Find current token index for initial highlight
  const currentTokenIndex = tokens.findIndex((t) => t.symbol === token.symbol)

  // Reset highlight when opening, set to current selection
  useEffect(() => {
    if (open) {
      setHighlightedIndex(currentTokenIndex >= 0 ? currentTokenIndex : 0)
      // Focus first option after opening
      setTimeout(() => {
        optionRefs.current[currentTokenIndex >= 0 ? currentTokenIndex : 0]?.focus()
      }, 0)
    } else {
      setHighlightedIndex(-1)
    }
  }, [open, currentTokenIndex])

  const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        e.preventDefault()
        setOpen(true)
        break
      case 'ArrowUp':
        e.preventDefault()
        setOpen(true)
        break
    }
  }

  const handleListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const next = Math.min(prev + 1, tokens.length - 1)
          optionRefs.current[next]?.focus()
          return next
        })
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const next = Math.max(prev - 1, 0)
          optionRefs.current[next]?.focus()
          return next
        })
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < tokens.length) {
          onSelect(tokens[highlightedIndex])
          setOpen(false)
          buttonRef.current?.focus()
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        buttonRef.current?.focus()
        break
      case 'Tab':
        // Close dropdown on tab out
        setOpen(false)
        break
      case 'Home':
        e.preventDefault()
        setHighlightedIndex(0)
        optionRefs.current[0]?.focus()
        break
      case 'End':
        e.preventDefault()
        setHighlightedIndex(tokens.length - 1)
        optionRefs.current[tokens.length - 1]?.focus()
        break
    }
  }

  return (
    <div className="relative flex-shrink-0">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        onKeyDown={handleButtonKeyDown}
        data-testid={testId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${token.symbol} (${token.name}). Click to change`}
        className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-gray-700/50 px-2.5 py-2 font-medium transition-colors hover:bg-gray-700 active:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 sm:gap-2 sm:px-3"
      >
        <Image src={token.logo} alt={token.symbol} width={24} height={24} className="h-5 w-5 sm:h-6 sm:w-6 rounded-full" />
        <span className="text-sm sm:text-base">{token.symbol}</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={listRef}
            data-testid="token-dropdown"
            role="listbox"
            aria-label={`Select ${label.toLowerCase()}`}
            aria-activedescendant={highlightedIndex >= 0 ? `token-option-${tokens[highlightedIndex]?.symbol}` : undefined}
            onKeyDown={handleListKeyDown}
            className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-gray-700 bg-gray-900 p-1.5 shadow-xl sm:w-48 sm:p-2"
          >
            {tokens.map((t, index) => (
              <button
                key={t.symbol}
                ref={(el) => { optionRefs.current[index] = el }}
                id={`token-option-${t.symbol}`}
                data-testid={`token-option-${t.symbol}`}
                role="option"
                aria-selected={t.symbol === token.symbol}
                aria-label={`${t.symbol} - ${t.name}`}
                tabIndex={highlightedIndex === index ? 0 : -1}
                onClick={() => {
                  onSelect(t)
                  setOpen(false)
                  buttonRef.current?.focus()
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`flex min-h-[44px] w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors focus:outline-none sm:gap-3 sm:px-3 ${
                  highlightedIndex === index
                    ? 'bg-purple-600/30 ring-2 ring-inset ring-purple-500'
                    : t.symbol === token.symbol
                      ? 'bg-gray-800'
                      : 'hover:bg-gray-800'
                }`}
              >
                <Image src={t.logo} alt={t.symbol} width={24} height={24} className="h-5 w-5 sm:h-6 sm:w-6 rounded-full" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{t.symbol}</div>
                  <div className="truncate text-xs text-gray-400">{t.name}</div>
                </div>
                {t.symbol === token.symbol && (
                  <CheckIcon className="h-4 w-4 text-purple-400" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
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

function EyeIcon({ className }: { className?: string }) {
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

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

function PreviewIcon({ className }: { className?: string }) {
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

function ZcashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h3v2h-5.5l5.5 4v2h-2v2H9v-2H6v-2h5.5L6 11V9h2V7z" />
    </svg>
  )
}

function ZcashLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="currentColor" fillOpacity="0.15" />
      <path
        d="M16 6L16 10M16 22L16 26M10 16H14L18 12H22M10 20H14L18 16H22M10 12H22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function NearLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="currentColor" fillOpacity="0.15" />
      <path
        d="M10 22V10L16 18V10M16 22V14L22 22V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
    >
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

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
      />
    </svg>
  )
}

function SolanaLockIcon({ className }: { className?: string }) {
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

/** Format seconds to human-readable duration */
function formatDuration(seconds: number): string {
  if (seconds < 60) return `~${seconds}s`
  if (seconds < 3600) return `~${Math.ceil(seconds / 60)} min`
  const hours = Math.floor(seconds / 3600)
  const mins = Math.ceil((seconds % 3600) / 60)
  return `~${hours}h ${mins}m`
}

