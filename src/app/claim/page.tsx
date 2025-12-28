'use client'

import { useState } from 'react'
import { useScan, useClaim, type ScannedPayment } from '@/hooks'
import type { HexString } from '@sip-protocol/types'

export default function ClaimPage() {
  // Keys input
  const [viewingKey, setViewingKey] = useState('')
  const [spendingKey, setSpendingKey] = useState('')
  const [destinationAddress, setDestinationAddress] = useState('')

  // Hooks
  const { payments, isScanning, error: scanError, lastScanTime, scan, reset: resetScan } = useScan()
  const { status: claimStatus, txHash, explorerUrl, amount, error: claimError, claim, reset: resetClaim } = useClaim()

  // Selected payment for claiming
  const [selectedPayment, setSelectedPayment] = useState<ScannedPayment | null>(null)

  const handleScan = async () => {
    if (!viewingKey || !spendingKey) return

    await scan({
      viewingPrivateKey: viewingKey as HexString,
      spendingPublicKey: spendingKey as HexString,
    })
  }

  const handleClaim = async (payment: ScannedPayment) => {
    if (!viewingKey || !spendingKey || !destinationAddress) return

    setSelectedPayment(payment)
    await claim({
      stealthAddress: payment.stealthAddress,
      ephemeralPublicKey: payment.ephemeralPublicKey,
      mint: payment.mint,
      viewingPrivateKey: viewingKey as HexString,
      spendingPrivateKey: spendingKey as HexString,
      destinationAddress,
    })
  }

  const formatAmount = (amount: bigint, decimals: number = 6) => {
    const divisor = BigInt(10 ** decimals)
    const whole = amount / divisor
    const fraction = amount % divisor
    return `${whole}.${fraction.toString().padStart(decimals, '0').slice(0, 4)}`
  }

  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return 'Unknown'
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white" data-testid="claim-page">
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Claim Private Payments</h1>
          <p className="text-gray-400">
            Scan the Solana blockchain for incoming stealth payments
          </p>
        </div>

        {/* Keys Input Card */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <KeyIcon className="h-5 w-5 text-purple-400" />
            Your Keys
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Viewing Private Key
              </label>
              <input
                type="password"
                value={viewingKey}
                onChange={(e) => setViewingKey(e.target.value)}
                placeholder="0x..."
                data-testid="viewing-key-input"
                className="w-full rounded-lg bg-gray-800 px-4 py-3 text-sm outline-none placeholder:text-gray-600 focus:ring-2 focus:ring-purple-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Used to scan for payments addressed to you
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Spending Key (Private or Public for scan, Private for claim)
              </label>
              <input
                type="password"
                value={spendingKey}
                onChange={(e) => setSpendingKey(e.target.value)}
                placeholder="0x..."
                data-testid="spending-key-input"
                className="w-full rounded-lg bg-gray-800 px-4 py-3 text-sm outline-none placeholder:text-gray-600 focus:ring-2 focus:ring-purple-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Public key for scanning, private key required for claiming
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Destination Address
              </label>
              <input
                type="text"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                placeholder="Your Solana wallet address"
                data-testid="destination-address-input"
                className="w-full rounded-lg bg-gray-800 px-4 py-3 text-sm outline-none placeholder:text-gray-600 focus:ring-2 focus:ring-purple-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Where claimed funds will be sent
              </p>
            </div>
          </div>

          <button
            onClick={handleScan}
            disabled={!viewingKey || !spendingKey || isScanning}
            data-testid="scan-button"
            className={`mt-6 w-full rounded-xl py-3 font-semibold transition-all ${
              !viewingKey || !spendingKey
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : isScanning
                  ? 'bg-purple-600/50 text-white cursor-wait'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isScanning ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner />
                Scanning...
              </span>
            ) : (
              'Scan for Payments'
            )}
          </button>

          {scanError && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400" data-testid="scan-error">
              {scanError}
            </div>
          )}
        </div>

        {/* Results */}
        {lastScanTime && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <WalletIcon className="h-5 w-5 text-green-400" />
                Found Payments
              </h2>
              <span className="text-xs text-gray-500">
                Last scan: {new Date(lastScanTime).toLocaleTimeString()}
              </span>
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-8 text-gray-500" data-testid="no-payments-message">
                <SearchIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No payments found</p>
                <p className="text-sm mt-1">Try scanning more slots or check your keys</p>
              </div>
            ) : (
              <div className="space-y-3" data-testid="payment-list">
                {payments.map((payment) => (
                  <div
                    key={payment.txSignature}
                    className="rounded-xl border border-gray-700 bg-gray-800/50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-lg">
                            {formatAmount(payment.amount)} {payment.tokenSymbol || 'tokens'}
                          </span>
                          {claimStatus === 'success' && selectedPayment?.txSignature === payment.txSignature && (
                            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                              Claimed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate" title={payment.stealthAddress}>
                          Stealth: {payment.stealthAddress}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimestamp(payment.timestamp)}
                        </p>
                      </div>

                      {claimStatus === 'success' && selectedPayment?.txSignature === payment.txSignature ? (
                        <a
                          href={explorerUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-green-600/20 px-3 py-2 text-sm font-medium text-green-400 hover:bg-green-600/30"
                        >
                          View Tx
                        </a>
                      ) : (
                        <button
                          onClick={() => handleClaim(payment)}
                          disabled={!destinationAddress || claimStatus === 'pending' || claimStatus === 'signing'}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                            !destinationAddress
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : claimStatus === 'pending' || claimStatus === 'signing'
                                ? 'bg-purple-600/50 text-white cursor-wait'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {(claimStatus === 'pending' || claimStatus === 'signing') &&
                           selectedPayment?.txSignature === payment.txSignature ? (
                            <span className="flex items-center gap-2">
                              <LoadingSpinner size="sm" />
                              Claiming...
                            </span>
                          ) : (
                            'Claim'
                          )}
                        </button>
                      )}
                    </div>

                    {claimError && selectedPayment?.txSignature === payment.txSignature && (
                      <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-400">
                        {claimError}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">How it works</h3>
          <ol className="space-y-2 text-sm text-gray-500">
            <li className="flex gap-2">
              <span className="text-purple-400">1.</span>
              Enter your viewing key and spending key (from your SIP meta-address)
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400">2.</span>
              Click &ldquo;Scan&rdquo; to search for payments sent to your stealth addresses
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400">3.</span>
              Enter your destination wallet address
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400">4.</span>
              Click &ldquo;Claim&rdquo; to transfer funds to your wallet
            </li>
          </ol>
        </div>
      </div>
    </main>
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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  )
}

function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <svg
      className={size === 'sm' ? 'h-4 w-4 animate-spin' : 'h-5 w-5 animate-spin'}
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
