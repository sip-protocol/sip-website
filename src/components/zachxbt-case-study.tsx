'use client'

import { useState, useCallback } from 'react'

// Deterministic initial addresses to prevent hydration mismatch
const INITIAL_ALICE_ADDRESS = '0xd704a8b3c2e1f9a6b5d8c7e4f2a1b3c9d8e7f4b0'
const INITIAL_STEALTH_ADDRESSES = [
  '0x8a2f3b1c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
  '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
  '0x9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d',
]

// Generate a realistic-looking address (mock for demo purposes)
function generateMockAddress(prefix: string = '0x'): string {
  const chars = '0123456789abcdef'
  let result = prefix
  for (let i = 0; i < 40; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

// Truncate address for display
function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function ZachXBTCaseStudy() {
  const [aliceAddress] = useState(INITIAL_ALICE_ADDRESS)
  const [stealthAddresses, setStealthAddresses] = useState<string[]>(INITIAL_STEALTH_ADDRESSES)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const generateNewStealth = useCallback(() => {
    setIsGenerating(true)
    // Simulate generation delay for visual effect
    setTimeout(() => {
      setStealthAddresses([
        generateMockAddress(),
        generateMockAddress(),
        generateMockAddress(),
      ])
      setIsGenerating(false)
    }, 300)
  }, [])

  return (
    <div className="space-y-8">
      {/* Main comparison grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Before SIP - The Problem */}
        <div className="relative">
          <div className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            WITHOUT SIP
          </div>
          <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 h-full">
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔓</span>
              The Linkability Problem
            </h3>

            <div className="space-y-3 font-mono text-sm">
              <TransactionLine
                label="Alice deposits to pool"
                address={aliceAddress}
                addressColor="text-red-400"
                icon="→"
              />
              <TransactionLine
                label="Alice withdraws"
                address={aliceAddress}
                addressColor="text-red-400"
                icon="←"
                highlight
              />
              <TransactionLine
                label="Refund goes to"
                address={aliceAddress}
                addressColor="text-red-400"
                icon="↩"
                highlight
              />
            </div>

            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-semibold text-red-400">Privacy Broken</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Same address appears 3 times. Anyone watching can link deposit → withdraw → refund.
                    This is how ZachXBT traces funds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* With SIP - The Solution */}
        <div className="relative">
          <div className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
            WITH SIP
          </div>
          <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20 h-full">
            <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              Stealth Address Solution
            </h3>

            <div className="space-y-3 font-mono text-sm">
              <TransactionLine
                label="Alice deposits to pool"
                address={aliceAddress}
                addressColor="text-gray-400"
                icon="→"
              />
              <TransactionLine
                label="Alice receives via stealth"
                address={stealthAddresses[0]}
                addressColor="text-green-400"
                icon="←"
                isNew
                isGenerating={isGenerating}
              />
              <TransactionLine
                label="Refund goes to stealth"
                address={stealthAddresses[1]}
                addressColor="text-green-400"
                icon="↩"
                isNew
                isGenerating={isGenerating}
              />
            </div>

            <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-semibold text-green-400">Privacy Preserved</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Each stealth address is unique and unlinkable. No on-chain connection between deposit and outputs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="p-6 rounded-2xl bg-gray-900/50 border border-purple-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="text-xl">🔬</span>
              See For Yourself
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Generate new stealth addresses to prove they&apos;re always unique
            </p>
          </div>
          <button
            onClick={generateNewStealth}
            disabled={isGenerating}
            className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-colors font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin">⚡</span>
                Generating...
              </>
            ) : (
              <>
                <span>🎲</span>
                Generate New Addresses
              </>
            )}
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {stealthAddresses.map((addr, i) => (
            <div
              key={`${addr}-${i}`}
              className={`p-3 rounded-xl bg-gray-800/50 border border-gray-700 font-mono text-xs transition-all ${
                isGenerating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="text-gray-500 mb-1">Stealth #{i + 1}</div>
              <div className="text-green-400 break-all">{truncateAddress(addr)}</div>
              <div className="text-gray-600 text-[10px] mt-1 break-all">{addr}</div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-gray-500 text-center">
          Each address is cryptographically unique. Only Alice (with her viewing key) can prove ownership.
        </p>
      </div>

      {/* Technical Explanation (Collapsible) */}
      <div className="rounded-2xl border border-gray-800 overflow-hidden">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full p-4 bg-gray-900/50 flex items-center justify-between hover:bg-gray-900/70 transition-colors"
        >
          <span className="flex items-center gap-2 font-semibold">
            <span>📖</span>
            Technical Explanation
          </span>
          <span className={`transition-transform ${showExplanation ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {showExplanation && (
          <div className="p-6 border-t border-gray-800 space-y-6">
            {/* How Stealth Addresses Work */}
            <div>
              <h4 className="font-semibold text-purple-400 mb-3">How Stealth Addresses Break The Link</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl bg-gray-800/50">
                  <div className="text-sm font-mono text-gray-400 mb-2">1. Alice publishes</div>
                  <code className="text-xs text-purple-400 block">
                    meta_address = (spending_key, viewing_key)
                  </code>
                </div>
                <div className="p-4 rounded-xl bg-gray-800/50">
                  <div className="text-sm font-mono text-gray-400 mb-2">2. Sender generates</div>
                  <code className="text-xs text-green-400 block">
                    stealth = hash(ephemeral * viewing_key) + spending_key
                  </code>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Each transaction uses a random ephemeral key, producing a unique stealth address.
                Only Alice can compute the private key to spend from it.
              </p>
            </div>

            {/* Why Existing Solutions Fail */}
            <div>
              <h4 className="font-semibold text-red-400 mb-3">Why Existing Pools Have This Vulnerability</h4>
              <div className="space-y-3">
                <VulnerabilityItem
                  protocol="Aztec Connect"
                  issue="Refund addresses link deposits to withdrawals"
                  status="Sunset 2023"
                />
                <VulnerabilityItem
                  protocol="Railgun"
                  issue="Relayer fees can create timing correlations"
                  status="Partial fix"
                />
                <VulnerabilityItem
                  protocol="Tornado Cash"
                  issue="Fixed denominations create statistical patterns"
                  status="Sanctioned"
                />
              </div>
            </div>

            {/* SIP's Approach */}
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <h4 className="font-semibold text-purple-400 mb-2">SIP&apos;s Approach</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong>Stealth addresses</strong> for every output (recipient + refund)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong>Pedersen commitments</strong> hide amounts (no fixed denominations)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong>Viewing keys</strong> for compliance without compromising privacy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong>Cross-chain</strong> via NEAR Intents (not single-chain pools)</span>
                </li>
              </ul>
            </div>

            {/* Link to ZachXBT profile */}
            <div className="text-center">
              <a
                href="https://x.com/zachxbt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors"
              >
                <span>📎</span>
                Learn more about ZachXBT&apos;s crypto tracing work
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper Components

function TransactionLine({
  label,
  address,
  addressColor,
  icon,
  highlight,
  isNew,
  isGenerating,
}: {
  label: string
  address: string
  addressColor: string
  icon: string
  highlight?: boolean
  isNew?: boolean
  isGenerating?: boolean
}) {
  return (
    <div className={`p-3 rounded-lg ${highlight ? 'bg-red-500/10' : isNew ? 'bg-green-500/10' : 'bg-gray-800/50'}`}>
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className={`${addressColor} ${isGenerating ? 'animate-pulse' : ''} transition-opacity`}>
        {truncateAddress(address)}
        {isNew && (
          <span className="ml-2 text-xs text-green-400/60">(unique!)</span>
        )}
      </div>
    </div>
  )
}

function VulnerabilityItem({
  protocol,
  issue,
  status,
}: {
  protocol: string
  issue: string
  status: string
}) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/50">
      <div className="flex-1">
        <div className="font-medium text-white">{protocol}</div>
        <div className="text-sm text-gray-400">{issue}</div>
      </div>
      <span className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-400">
        {status}
      </span>
    </div>
  )
}
