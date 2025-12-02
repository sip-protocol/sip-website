'use client'

import { useState, useMemo, useCallback } from 'react'
import { PrivacyLevel } from '@sip-protocol/types'
import { useQuote, useSwap, useBalance, getStatusMessage } from '@/hooks'
import { useWalletStore, useSwapModeStore } from '@/stores'
import {
  NETWORKS,
  parseAmount,
  validateZcashAddress,
  getAddressTypeLabel,
  getPrivacyColorClass,
} from '@/lib'
import { TransactionStatus } from '@/components/transaction-status'
import { SwapModeToggle } from '@/components/swap-mode-toggle'
import { StealthAddressDisplay } from '@/components/stealth-address-display'
import { ViewingKeyDisplay } from '@/components/viewing-key-display'
import { PedersenCommitmentDisplay } from '@/components/pedersen-commitment-display'
import type { NetworkId } from '@/lib'

interface SwapCardProps {
  privacyLevel: PrivacyLevel
}

interface Token {
  symbol: string
  name: string
  chain: NetworkId
  icon: string
}

// Tokens available as SOURCE (must have deposit callback implemented)
const fromTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', chain: 'ethereum', icon: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', chain: 'solana', icon: '◎' },
  { symbol: 'NEAR', name: 'NEAR', chain: 'near', icon: 'Ⓝ' },
]

// Tokens available as DESTINATION (includes NEAR, ZEC - deposit not required for destination)
const toTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', chain: 'ethereum', icon: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', chain: 'solana', icon: '◎' },
  { symbol: 'NEAR', name: 'NEAR', chain: 'near', icon: 'Ⓝ' },
  { symbol: 'ZEC', name: 'Zcash', chain: 'zcash', icon: '🛡️' },
]

export function SwapCard({ privacyLevel }: SwapCardProps) {
  // Default to ETH→SOL: Cross-chain swap demo
  const [fromToken, setFromToken] = useState(fromTokens[0]) // ETH
  const [toToken, setToToken] = useState(toTokens[1]) // SOL
  const [amount, setAmount] = useState('')
  const [zecRecipient, setZecRecipient] = useState('') // ZEC recipient address (z-addr or t-addr)

  // Wallet state
  const { isConnected, openModal } = useWalletStore()

  // Swap mode (preview vs execute)
  const { mode: swapMode } = useSwapModeStore()
  const isPreviewMode = swapMode === 'preview'

  // Balance fetching
  const { balance: rawBalance, formatted: balance, symbol: balanceSymbol, isLoading: isBalanceLoading } = useBalance()

  // Check if balance matches source token chain
  const { chain: connectedChain } = useWalletStore()
  const isBalanceForSourceToken = connectedChain === fromToken.chain

  // Calculate insufficient balance
  const hasInsufficientBalance = useMemo(() => {
    if (!isConnected || !rawBalance || !amount || !isBalanceForSourceToken) return false
    try {
      const decimals = NETWORKS[fromToken.chain]?.decimals ?? 18
      const amountBigInt = parseAmount(amount, decimals)
      return amountBigInt > rawBalance
    } catch {
      return false
    }
  }, [isConnected, rawBalance, amount, fromToken.chain, isBalanceForSourceToken])

  // MAX button handler - leave small amount for gas
  const handleMaxClick = useCallback(() => {
    if (!rawBalance || !isBalanceForSourceToken) return
    const decimals = NETWORKS[fromToken.chain]?.decimals ?? 18
    // Leave ~0.01 for gas fees (varies by chain)
    const gasReserve = BigInt(10 ** (decimals - 2)) // 0.01 in native units
    const maxAmount = rawBalance > gasReserve ? rawBalance - gasReserve : rawBalance
    // Convert to string with proper decimals
    const divisor = BigInt(10 ** decimals)
    const whole = maxAmount / divisor
    const fraction = maxAmount % divisor
    const fractionStr = fraction.toString().padStart(decimals, '0').replace(/0+$/, '')
    const formattedMax = fractionStr ? `${whole}.${fractionStr}` : whole.toString()
    setAmount(formattedMax)
  }, [rawBalance, fromToken.chain, isBalanceForSourceToken])

  // Build quote params
  const quoteParams = useMemo(() => {
    if (!amount || parseFloat(amount) <= 0) return null
    return {
      fromChain: fromToken.chain,
      toChain: toToken.chain,
      fromToken: fromToken.symbol,
      toToken: toToken.symbol,
      amount,
      privacyLevel,
    }
  }, [fromToken, toToken, amount, privacyLevel])

  // Fetch quote
  const { quote, outputAmount, rate, feePercent, isLoading: isQuoteLoading, error: quoteError } = useQuote(quoteParams)

  // Swap execution
  const { status, txHash, explorerUrl, txChain, error: swapError, execute, reset } = useSwap()

  const isTransparent = privacyLevel === PrivacyLevel.TRANSPARENT
  const isShielded = privacyLevel === PrivacyLevel.SHIELDED
  const isCompliant = privacyLevel === PrivacyLevel.COMPLIANT
  const hasPrivacy = !isTransparent // Either shielded or compliant
  const isSwapping = status === 'confirming' || status === 'signing' || status === 'pending'
  const isSuccess = status === 'success'
  const isError = status === 'error'
  const isZecDestination = toToken.symbol === 'ZEC'

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

  const handleSwap = async () => {
    if (!isConnected) {
      openModal()
      return
    }

    if (!quoteParams || !quote) return

    await execute({
      ...quoteParams,
      quote,
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
        <h3 className="text-lg font-semibold">Swap</h3>
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
                className="min-h-[44px] min-w-[44px] rounded bg-purple-500/20 px-3 py-2 text-xs font-medium text-purple-400 transition-colors hover:bg-purple-500/30 active:bg-purple-500/40"
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
            onSelect={setFromToken}
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
        <button className="z-10 rounded-xl border border-gray-700 bg-gray-900 p-2 transition-colors hover:border-purple-500">
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
            onSelect={setToToken}
            tokens={toTokens}
            testId="to-token"
          />
        </div>
        {quoteError && (
          <p className="mt-2 text-xs text-red-400">{quoteError}</p>
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

      {/* Privacy info */}
      {hasPrivacy && (
        <div className="mb-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-3" data-testid="privacy-info">
          <div className="flex items-start gap-2">
            {isCompliant ? (
              <KeyIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400" />
            ) : (
              <ShieldIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400" />
            )}
            <div className="text-sm">
              <p className="font-medium text-purple-300">Privacy Protected</p>
              <p className="text-purple-400/80">
                {isCompliant
                  ? 'Transaction hidden with viewing key for auditors'
                  : 'Sender, amount, and recipient are hidden'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stealth Address Visualization */}
      {hasPrivacy && amount && parseFloat(amount) > 0 && (
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
        chain={txChain}
        error={swapError}
        isShielded={hasPrivacy}
        isCompliant={isCompliant}
        onReset={handleReset}
        onRetry={reset}
      />

      {/* Swap button */}
      {!isSuccess && (
        <button
          onClick={handleSwap}
          disabled={(!amount || isSwapping || hasInsufficientBalance || !isZecAddressValid) && isConnected}
          data-testid="swap-button"
          className={`min-h-[52px] w-full rounded-xl py-3 text-base font-semibold transition-all sm:py-4 sm:text-lg ${
            !isConnected
              ? 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800'
              : !amount || hasInsufficientBalance || !isZecAddressValid
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
            <span>Rate</span>
            <span className="text-right">
              1 {fromToken.symbol} ≈ {rate} {toToken.symbol}
            </span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Solver Fee</span>
            <span>{feePercent}%</span>
          </div>
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
  const isFrom = testId === 'from-token'
  const label = isFrom ? 'Source token' : 'Destination token'

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        data-testid={testId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${token.symbol} (${token.name}). Click to change`}
        className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-gray-700/50 px-2.5 py-2 font-medium transition-colors hover:bg-gray-700 active:bg-gray-600 sm:gap-2 sm:px-3"
      >
        <span className="text-base sm:text-lg" aria-hidden="true">{token.icon}</span>
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
            data-testid="token-dropdown"
            role="listbox"
            aria-label={`Select ${label.toLowerCase()}`}
            className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-gray-700 bg-gray-900 p-1.5 shadow-xl sm:w-48 sm:p-2"
          >
            {tokens.map((t) => (
              <button
                key={t.symbol}
                data-testid={`token-option-${t.symbol}`}
                role="option"
                aria-selected={t.symbol === token.symbol}
                aria-label={`${t.symbol} - ${t.name}`}
                onClick={() => {
                  onSelect(t)
                  setOpen(false)
                }}
                className={`flex min-h-[44px] w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-gray-800 active:bg-gray-700 sm:gap-3 sm:px-3 ${
                  t.symbol === token.symbol ? 'bg-gray-800' : ''
                }`}
              >
                <span className="text-base sm:text-lg" aria-hidden="true">{t.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{t.symbol}</div>
                  <div className="truncate text-xs text-gray-400">{t.name}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
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

