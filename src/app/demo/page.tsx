'use client'

import { useState } from 'react'
import { PrivacyLevel } from '@/types'
import { SwapCard } from '@/components/swap-card'
import { PrivacyToggle } from '@/components/privacy-toggle'
import { ComparisonView } from '@/components/comparison-view'
import { ZcashShowcase } from '@/components/zcash-showcase'
import { PedersenCommitmentDisplay } from '@/components/pedersen-commitment-display'
import { TransactionProof } from '@/components/transaction-proof'

export default function DemoPage() {
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(PrivacyLevel.SHIELDED)

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="border-b border-gray-800/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Interactive Demo
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Real Quotes • Mainnet Execution
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              Try SIP Protocol
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Experience the difference between transparent and shielded transactions.
              Toggle privacy modes and see how your data is protected.
            </p>
            <p className="mt-3 text-sm text-gray-500 max-w-xl mx-auto">
              Quotes are fetched from NEAR Intents (mainnet). Swap execution requires real tokens.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Toggle */}
      <section className="py-8 border-b border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <PrivacyToggle value={privacyLevel} onChange={setPrivacyLevel} />
          </div>
        </div>
      </section>

      {/* Swap Interface */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-md">
              <SwapCard privacyLevel={privacyLevel} />
            </div>
          </div>

          {/* Comparison View */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Privacy Comparison</h2>
              <p className="mt-2 text-gray-400">
                See what chain analysis can observe in each mode
              </p>
            </div>
            <ComparisonView privacyLevel={privacyLevel} />
          </div>

          {/* Real Transaction Proof */}
          <div className="mt-16 border-t border-gray-800/50 pt-16">
            <TransactionProof />
          </div>

          {/* Pedersen Commitment Demo */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Pedersen Commitments</h2>
              <p className="mt-2 text-gray-400">
                See how amounts are cryptographically hidden while remaining verifiable
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <PedersenCommitmentDisplay
                privacyLevel={PrivacyLevel.SHIELDED}
                showDemo={true}
              />
            </div>
          </div>

          {/* Zcash SDK Showcase */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Zcash Integration</h2>
              <p className="mt-2 text-gray-400">
                Explore the SDK&apos;s Zcash shielded transaction capabilities
              </p>
            </div>
            <ZcashShowcase />
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-12 border-t border-gray-800/50 bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <TechCard
              step="1"
              title="Create Intent"
              description="Your swap request is transformed into a shielded intent with hidden amounts using Pedersen commitments."
            />
            <TechCard
              step="2"
              title="Generate Stealth Address"
              description="A unique one-time address is generated for the recipient, preventing transaction linkability."
            />
            <TechCard
              step="3"
              title="Execute via Zcash"
              description="The transaction routes through Zcash's shielded pool, breaking the on-chain trail completely."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Integrate?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Add privacy to your dApp in minutes with our TypeScript SDK.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://docs.sip-protocol.org/getting-started"
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

function TechCard({
  step,
  title,
  description,
}: {
  step: string
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 font-bold mb-4">
        {step}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}
