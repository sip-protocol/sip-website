'use client'

import { useState } from 'react'
import { PrivacyLevel } from '@sip-protocol/types'

interface SwapCardProps {
  privacyLevel: PrivacyLevel
}

interface Token {
  symbol: string
  name: string
  chain: string
  icon: string
}

const tokens: Token[] = [
  { symbol: 'SOL', name: 'Solana', chain: 'solana', icon: '◎' },
  { symbol: 'ETH', name: 'Ethereum', chain: 'ethereum', icon: 'Ξ' },
  { symbol: 'ZEC', name: 'Zcash', chain: 'zcash', icon: 'ⓩ' },
  { symbol: 'NEAR', name: 'NEAR', chain: 'near', icon: 'Ⓝ' },
]

export function SwapCard({ privacyLevel }: SwapCardProps) {
  const [fromToken, setFromToken] = useState(tokens[0])
  const [toToken, setToToken] = useState(tokens[2]) // ZEC
  const [amount, setAmount] = useState('')
  const [isSwapping, setIsSwapping] = useState(false)

  const handleSwap = async () => {
    setIsSwapping(true)
    // Simulate swap
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSwapping(false)
    setAmount('')
  }

  const isShielded = privacyLevel !== PrivacyLevel.TRANSPARENT

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Swap</h3>
        <div
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            isShielded
              ? 'bg-purple-600/20 text-purple-400'
              : 'bg-gray-700/50 text-gray-400'
          }`}
        >
          {isShielded ? (
            <>
              <ShieldIcon className="h-3 w-3" />
              Shielded
            </>
          ) : (
            <>
              <EyeIcon className="h-3 w-3" />
              Public
            </>
          )}
        </div>
      </div>

      {/* From */}
      <div className="mb-2 rounded-xl bg-gray-800/50 p-4">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
          <span>From</span>
          <span>Balance: 12.5</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="flex-1 bg-transparent text-2xl font-medium outline-none placeholder:text-gray-600"
          />
          <TokenSelector
            token={fromToken}
            onSelect={setFromToken}
            tokens={tokens}
          />
        </div>
      </div>

      {/* Swap direction */}
      <div className="-my-2 flex justify-center">
        <button className="z-10 rounded-xl border border-gray-700 bg-gray-900 p-2 transition-colors hover:border-purple-500">
          <ArrowDownIcon className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* To */}
      <div className="mb-6 mt-2 rounded-xl bg-gray-800/50 p-4">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
          <span>To</span>
          {isShielded && (
            <span className="flex items-center gap-1 text-purple-400">
              <ShieldIcon className="h-3 w-3" />
              Stealth Address
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex-1 text-2xl font-medium text-gray-400">
            {amount ? (parseFloat(amount) * 0.15).toFixed(4) : '0.0'}
          </span>
          <TokenSelector
            token={toToken}
            onSelect={setToToken}
            tokens={tokens}
          />
        </div>
      </div>

      {/* Privacy info */}
      {isShielded && (
        <div className="mb-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
          <div className="flex items-start gap-2">
            <ShieldIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400" />
            <div className="text-sm">
              <p className="font-medium text-purple-300">Privacy Protected</p>
              <p className="text-purple-400/80">
                {privacyLevel === PrivacyLevel.COMPLIANT
                  ? 'Transaction hidden with viewing key for auditors'
                  : 'Sender, amount, and recipient are hidden'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Swap button */}
      <button
        onClick={handleSwap}
        disabled={!amount || isSwapping}
        className={`w-full rounded-xl py-4 text-lg font-semibold transition-all ${
          !amount
            ? 'cursor-not-allowed bg-gray-800 text-gray-500'
            : isSwapping
              ? 'cursor-wait bg-purple-600/50 text-white'
              : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {isSwapping ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner />
            {isShielded ? 'Shielding Transaction...' : 'Swapping...'}
          </span>
        ) : (
          <span>{isShielded ? 'Shielded Swap' : 'Swap'}</span>
        )}
      </button>

      {/* Transaction details */}
      {amount && (
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Rate</span>
            <span>
              1 {fromToken.symbol} = 0.15 {toToken.symbol}
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Solver Fee</span>
            <span>0.3%</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Privacy</span>
            <span className={isShielded ? 'text-purple-400' : 'text-gray-500'}>
              {privacyLevel === PrivacyLevel.TRANSPARENT
                ? 'None'
                : privacyLevel === PrivacyLevel.COMPLIANT
                  ? 'With viewing key'
                  : 'Full shielding'}
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
}: {
  token: Token
  onSelect: (token: Token) => void
  tokens: Token[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl bg-gray-700/50 px-3 py-2 font-medium transition-colors hover:bg-gray-700"
      >
        <span className="text-lg">{token.icon}</span>
        <span>{token.symbol}</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-gray-700 bg-gray-900 p-2 shadow-xl">
            {tokens.map((t) => (
              <button
                key={t.symbol}
                onClick={() => {
                  onSelect(t)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-800 ${
                  t.symbol === token.symbol ? 'bg-gray-800' : ''
                }`}
              >
                <span className="text-lg">{t.icon}</span>
                <div>
                  <div className="font-medium">{t.symbol}</div>
                  <div className="text-xs text-gray-400">{t.name}</div>
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
