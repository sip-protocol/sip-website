'use client'

import { useState } from 'react'
import { PrivacyToggle } from '@/components/privacy-toggle'
import { SwapCard } from '@/components/swap-card'
import { ComparisonView } from '@/components/comparison-view'
import { PrivacyLevel } from '@sip-protocol/types'

export default function Home() {
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(PrivacyLevel.SHIELDED)
  const [showComparison, setShowComparison] = useState(false)

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <ShieldIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SIP Protocol</h1>
              <p className="text-xs text-gray-400">Shielded Intents</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-purple-500 hover:text-white"
            >
              {showComparison ? 'Hide' : 'Show'} Vulnerability Demo
            </button>
            <WalletButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            <span className="gradient-text">HTTPS</span> for Cross-Chain Intents
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Privacy should be a toggle, not a tradeoff. SIP adds shielded transactions
            to any intent-based cross-chain system.
          </p>
        </div>

        {/* Privacy Toggle */}
        <div className="mb-8 flex justify-center">
          <PrivacyToggle value={privacyLevel} onChange={setPrivacyLevel} />
        </div>

        {/* Main Content */}
        {showComparison ? (
          <ComparisonView privacyLevel={privacyLevel} />
        ) : (
          <div className="mx-auto max-w-md">
            <SwapCard privacyLevel={privacyLevel} />
          </div>
        )}

        {/* Features */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<ShieldIcon className="h-6 w-6" />}
            title="Stealth Addresses"
            description="One-time addresses prevent linkability. Each transaction uses a unique recipient address."
          />
          <FeatureCard
            icon={<LockIcon className="h-6 w-6" />}
            title="Hidden Amounts"
            description="Transaction amounts are hidden using Pedersen commitments. Solvers only see minimum output."
          />
          <FeatureCard
            icon={<EyeIcon className="h-6 w-6" />}
            title="Viewing Keys"
            description="Selective disclosure for compliance. Share transaction details with auditors without exposing all history."
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
          <p>Privacy is not a feature. It&apos;s a right.</p>
          <p className="mt-2">
            Built for{' '}
            <a
              href="https://zypherpunk.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              Zypherpunk Hackathon
            </a>
          </p>
        </div>
      </footer>
    </main>
  )
}

function WalletButton() {
  const [connected, setConnected] = useState(false)

  return (
    <button
      onClick={() => setConnected(!connected)}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        connected
          ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
          : 'bg-purple-600 text-white hover:bg-purple-700'
      }`}
    >
      {connected ? '0x1234...5678' : 'Connect Wallet'}
    </button>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="card">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}
