'use client'

import { useState, useCallback } from 'react'

/**
 * Zcash SDK Capabilities Showcase
 *
 * Demonstrates the Zcash integration features from @sip-protocol/sdk:
 * - ZcashRPCClient for zcashd interaction
 * - ZcashShieldedService for high-level operations
 * - ZIP-317 fee estimation
 * - Pool balance visualization
 * - Viewing key export for compliance
 */

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_UNIFIED_ADDRESS =
  'u1qxkrh8q...7vj9 (Unified: Sapling + Orchard)'

const MOCK_BALANCE = {
  confirmed: 12.54876,
  unconfirmed: 0.5,
  pools: {
    transparent: 0.0,
    sapling: 7.25,
    orchard: 5.29876,
  },
  spendableNotes: 8,
}

const MOCK_VIEWING_KEY = {
  key: 'zxviews1q0duytgcqqqqpqre26wkl45gvwwwd706xw608hucmvfalr759ejwf7qshjf5r9aa7323zulvz6plhttp5mltqcgs9t039cx2d09mgq05ts63n8u35hyv6h9nc9ctqqtue2u7cer2mqegunuulq2luhq3ywjcz35yyljewa4mgkgjzyfwh6fr6jd0dzd44ghk0nxdv2hnv4j5nxfwv24rwdmgllhe0p8568sgqt9ckt02v2kxf5ahtql6s0ltjpkckw8gtymxtxuu9gcr0swvz',
  address: 'u1qxkrh8q...7vj9',
  account: 0,
  exportedAt: Date.now(),
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface TabProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function Tab({ active, onClick, children }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'border-b-2 border-purple-500 text-purple-400'
          : 'text-gray-400 hover:text-gray-300'
      }`}
    >
      {children}
    </button>
  )
}

export function ZcashShowcase() {
  const [activeTab, setActiveTab] = useState<
    'address' | 'balance' | 'fees' | 'viewing' | 'code'
  >('address')
  const [generatedAddress, setGeneratedAddress] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [feeInputs, setFeeInputs] = useState(1)
  const [feeOutputs, setFeeOutputs] = useState(2)
  const [viewingKeyCopied, setViewingKeyCopied] = useState(false)

  // Simulate address generation
  const handleGenerateAddress = useCallback(async () => {
    setIsGenerating(true)
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800))
    setGeneratedAddress(MOCK_UNIFIED_ADDRESS)
    setIsGenerating(false)
  }, [])

  // Calculate ZIP-317 fee
  const calculateZip317Fee = useCallback(
    (inputs: number, outputs: number) => {
      const MARGINAL_FEE = 5000 // zatoshi
      const GRACE_ACTIONS = 2
      const logicalActions = Math.max(inputs, outputs)
      const billableActions = Math.max(GRACE_ACTIONS, logicalActions)
      const feeZatoshi = billableActions * MARGINAL_FEE
      return feeZatoshi / 100000000 // Convert to ZEC
    },
    []
  )

  const handleCopyViewingKey = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(MOCK_VIEWING_KEY.key)
      setViewingKeyCopied(true)
      setTimeout(() => setViewingKeyCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }, [])

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 to-gray-900/50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
          <ZcashIcon className="h-7 w-7 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-purple-300">Zcash SDK Integration</h3>
          <p className="text-sm text-purple-400/70">@sip-protocol/sdk Zcash capabilities</p>
        </div>
      </div>

      {/* SDK Import Example */}
      <div className="mb-6 rounded-lg bg-gray-900/70 p-3">
        <code className="text-xs text-gray-400">
          <span className="text-purple-400">import</span> {'{'}{' '}
          <span className="text-green-400">ZcashShieldedService</span>,{' '}
          <span className="text-green-400">createZcashClient</span> {'}'}{' '}
          <span className="text-purple-400">from</span>{' '}
          <span className="text-amber-400">&apos;@sip-protocol/sdk&apos;</span>
        </code>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-gray-700">
        <Tab active={activeTab === 'address'} onClick={() => setActiveTab('address')}>
          Addresses
        </Tab>
        <Tab active={activeTab === 'balance'} onClick={() => setActiveTab('balance')}>
          Pools
        </Tab>
        <Tab active={activeTab === 'fees'} onClick={() => setActiveTab('fees')}>
          ZIP-317 Fees
        </Tab>
        <Tab active={activeTab === 'viewing'} onClick={() => setActiveTab('viewing')}>
          Viewing Keys
        </Tab>
        <Tab active={activeTab === 'code'} onClick={() => setActiveTab('code')}>
          Code
        </Tab>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {/* Address Generation Tab */}
        {activeTab === 'address' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-purple-500/20 bg-purple-950/10 p-4">
              <h4 className="mb-2 font-semibold text-purple-300">
                Unified Address Generation
              </h4>
              <p className="mb-4 text-sm text-gray-400">
                Generate unified addresses with multiple receiver types (Sapling + Orchard)
                for maximum privacy and compatibility.
              </p>

              <button
                onClick={handleGenerateAddress}
                disabled={isGenerating}
                className="mb-4 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Unified Address'}
              </button>

              {generatedAddress && (
                <div className="rounded-lg bg-gray-900/50 p-3">
                  <p className="mb-1 text-xs text-gray-500">Generated Address:</p>
                  <code className="break-all text-sm text-green-400">
                    {generatedAddress}
                  </code>
                </div>
              )}
            </div>

            {/* Address Types */}
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-gray-800/50 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium text-gray-300">Transparent</span>
                </div>
                <p className="text-xs text-gray-500">t1/t3 prefix - Public on chain</p>
              </div>
              <div className="rounded-lg bg-gray-800/50 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium text-gray-300">Sapling</span>
                </div>
                <p className="text-xs text-gray-500">zs prefix - Shielded (legacy)</p>
              </div>
              <div className="rounded-lg bg-gray-800/50 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="text-sm font-medium text-gray-300">Orchard</span>
                </div>
                <p className="text-xs text-gray-500">u prefix - Unified (latest)</p>
              </div>
            </div>
          </div>
        )}

        {/* Balance/Pools Tab */}
        {activeTab === 'balance' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-purple-500/20 bg-purple-950/10 p-4">
              <h4 className="mb-4 font-semibold text-purple-300">
                Shielded Pool Balances
              </h4>

              {/* Total Balance */}
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-500">Total Confirmed</p>
                <p className="text-3xl font-bold text-white">
                  {MOCK_BALANCE.confirmed.toFixed(8)}{' '}
                  <span className="text-lg text-purple-400">ZEC</span>
                </p>
                {MOCK_BALANCE.unconfirmed > 0 && (
                  <p className="text-sm text-amber-400">
                    +{MOCK_BALANCE.unconfirmed} pending
                  </p>
                )}
              </div>

              {/* Pool Breakdown */}
              <div className="space-y-3">
                {/* Transparent */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="text-sm text-gray-300">Transparent</span>
                  </div>
                  <span className="font-mono text-sm text-gray-400">
                    {MOCK_BALANCE.pools.transparent.toFixed(8)} ZEC
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-amber-500"
                    style={{
                      width: `${(MOCK_BALANCE.pools.transparent / MOCK_BALANCE.confirmed) * 100}%`,
                    }}
                  />
                </div>

                {/* Sapling */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-300">Sapling Pool</span>
                  </div>
                  <span className="font-mono text-sm text-gray-400">
                    {MOCK_BALANCE.pools.sapling.toFixed(8)} ZEC
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{
                      width: `${(MOCK_BALANCE.pools.sapling / MOCK_BALANCE.confirmed) * 100}%`,
                    }}
                  />
                </div>

                {/* Orchard */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                    <span className="text-sm text-gray-300">Orchard Pool</span>
                  </div>
                  <span className="font-mono text-sm text-gray-400">
                    {MOCK_BALANCE.pools.orchard.toFixed(8)} ZEC
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-purple-500"
                    style={{
                      width: `${(MOCK_BALANCE.pools.orchard / MOCK_BALANCE.confirmed) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Note Count */}
              <div className="mt-4 rounded-lg bg-gray-900/50 p-3 text-center">
                <span className="text-2xl font-bold text-purple-400">
                  {MOCK_BALANCE.spendableNotes}
                </span>
                <span className="ml-2 text-sm text-gray-500">spendable notes</span>
              </div>
            </div>
          </div>
        )}

        {/* ZIP-317 Fees Tab */}
        {activeTab === 'fees' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-purple-500/20 bg-purple-950/10 p-4">
              <h4 className="mb-2 font-semibold text-purple-300">
                ZIP-317 Fee Calculator
              </h4>
              <p className="mb-4 text-sm text-gray-400">
                Calculate transaction fees based on the ZIP-317 standard. Fees depend on
                the number of logical actions (max of inputs and outputs).
              </p>

              <div className="mb-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    Input Notes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={feeInputs}
                    onChange={(e) => setFeeInputs(parseInt(e.target.value) || 1)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    Output Recipients
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={feeOutputs}
                    onChange={(e) => setFeeOutputs(parseInt(e.target.value) || 1)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Fee Result */}
              <div className="rounded-lg bg-gray-900/50 p-4 text-center">
                <p className="mb-1 text-sm text-gray-500">Estimated Fee</p>
                <p className="text-2xl font-bold text-green-400">
                  {calculateZip317Fee(feeInputs, feeOutputs).toFixed(8)}{' '}
                  <span className="text-lg text-gray-400">ZEC</span>
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  {Math.max(2, Math.max(feeInputs, feeOutputs))} logical actions ×
                  5,000 zatoshi
                </p>
              </div>

              {/* Fee Formula */}
              <div className="mt-4 rounded-lg bg-gray-800/50 p-3">
                <p className="mb-2 text-xs font-medium text-gray-400">ZIP-317 Formula:</p>
                <code className="text-xs text-purple-400">
                  fee = max(2, max(inputs, outputs)) × 5,000 zatoshi
                </code>
              </div>
            </div>
          </div>
        )}

        {/* Viewing Keys Tab */}
        {activeTab === 'viewing' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-4">
              <h4 className="mb-2 font-semibold text-amber-300">
                Viewing Key Export (Compliance)
              </h4>
              <p className="mb-4 text-sm text-gray-400">
                Export viewing keys for regulatory compliance. Auditors can see incoming
                transactions without spending authority.
              </p>

              {/* Viewing Key Display */}
              <div className="mb-4 rounded-lg bg-gray-900/50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Full Viewing Key:</span>
                  <button
                    onClick={handleCopyViewingKey}
                    className="text-xs text-amber-400 hover:text-amber-300"
                  >
                    {viewingKeyCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <code className="block break-all text-xs text-amber-400">
                  {MOCK_VIEWING_KEY.key.slice(0, 80)}...
                </code>
              </div>

              {/* Key Properties */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-gray-800/50 p-3">
                  <p className="text-xs text-gray-500">Can See</p>
                  <ul className="mt-1 space-y-1 text-sm text-green-400">
                    <li className="flex items-center gap-1">
                      <CheckIcon className="h-3 w-3" /> Incoming transactions
                    </li>
                    <li className="flex items-center gap-1">
                      <CheckIcon className="h-3 w-3" /> Transaction amounts
                    </li>
                    <li className="flex items-center gap-1">
                      <CheckIcon className="h-3 w-3" /> Memo contents
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-gray-800/50 p-3">
                  <p className="text-xs text-gray-500">Cannot Do</p>
                  <ul className="mt-1 space-y-1 text-sm text-red-400">
                    <li className="flex items-center gap-1">
                      <CrossIcon className="h-3 w-3" /> Spend funds
                    </li>
                    <li className="flex items-center gap-1">
                      <CrossIcon className="h-3 w-3" /> Create transactions
                    </li>
                    <li className="flex items-center gap-1">
                      <CrossIcon className="h-3 w-3" /> Access spending key
                    </li>
                  </ul>
                </div>
              </div>

              {/* Warning */}
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <WarningIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                <p className="text-xs text-amber-400">
                  <strong>Privacy Note:</strong> Share viewing keys only with authorized
                  auditors. They reveal all incoming transaction details.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Code Examples Tab */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            {/* Shielded Service Example */}
            <div className="rounded-lg bg-gray-900/70 p-4">
              <p className="mb-2 text-xs font-medium text-purple-400">
                {`// Initialize Zcash Shielded Service`}
              </p>
              <pre className="overflow-x-auto text-xs">
                <code className="text-gray-300">
                  {`const service = createZcashShieldedService({
  rpcConfig: {
    host: 'localhost',
    port: 8232,
    username: 'user',
    password: 'pass',
    testnet: true,
  },
})

await service.initialize()

// Get shielded balance
const balance = await service.getBalance()
console.log('Orchard:', balance.pools.orchard)
console.log('Sapling:', balance.pools.sapling)`}
                </code>
              </pre>
            </div>

            {/* Shielded Send Example */}
            <div className="rounded-lg bg-gray-900/70 p-4">
              <p className="mb-2 text-xs font-medium text-green-400">
                {`// Send shielded transaction`}
              </p>
              <pre className="overflow-x-auto text-xs">
                <code className="text-gray-300">
                  {`const result = await service.sendShielded({
  to: 'u1recipient...',
  amount: 1.5,
  memo: 'Payment for services',
  privacyLevel: PrivacyLevel.SHIELDED,
})

console.log('Txid:', result.txid)
console.log('Fee paid:', result.fee, 'ZEC')`}
                </code>
              </pre>
            </div>

            {/* Fee Calculation Example */}
            <div className="rounded-lg bg-gray-900/70 p-4">
              <p className="mb-2 text-xs font-medium text-amber-400">
                {`// Calculate ZIP-317 fee`}
              </p>
              <pre className="overflow-x-auto text-xs">
                <code className="text-gray-300">
                  {`const fee = service.estimateFee({
  inputs: 3,
  outputs: 2,
})
// fee = max(2, max(3, 2)) * 5000 zatoshi
// fee = 3 * 5000 = 15000 zatoshi = 0.00015 ZEC`}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Footer - SDK Version */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-700 pt-4">
        <span className="text-xs text-gray-500">
          Powered by @sip-protocol/sdk v0.1.9
        </span>
        <a
          href="https://docs.sip-protocol.org/sdk/zcash"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-purple-400 hover:text-purple-300"
        >
          View Docs →
        </a>
      </div>
    </div>
  )
}

// ─── Icons ─────────────────────────────────────────────────────────────────────

function ZcashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm0 29.5C8.556 29.5 2.5 23.444 2.5 16S8.556 2.5 16 2.5 29.5 8.556 29.5 16 23.444 29.5 16 29.5zm1.5-18.5h5v2.5h-7.25L22 21h-5v2.5h7.25L17.5 16V11z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function WarningIcon({ className }: { className?: string }) {
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
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  )
}
