'use client'

import { useState, useCallback, useEffect, useRef, type KeyboardEvent } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useZcashRpc } from '@/hooks/use-zcash-rpc'
import { SDK_VERSION } from '@/lib/constants'

// Dynamic SDK import for viewing key generation
const loadSDK = () => import('@sip-protocol/sdk')

/**
 * Zcash SDK Capabilities Showcase
 *
 * Demonstrates the Zcash integration features from @sip-protocol/sdk:
 * - ZcashRPCClient for zcashd interaction (LIVE when configured)
 * - ZcashShieldedService for high-level operations
 * - ZIP-317 fee estimation (real calculation)
 * - Pool balance visualization (live or demo mode)
 * - Viewing key export for compliance (real SDK generation)
 *
 * Configure ZCASH_RPC_* environment variables for live data.
 * Falls back to demo mode when not configured.
 */

// ─── Demo Data (used when RPC not connected) ────────────────────────────────────

// Demo ShieldedBalance (matches SDK ZcashShieldedService.getBalance() return type)
const DEMO_BALANCE = {
  confirmed: 12.54876,
  unconfirmed: 0.5,
  pools: {
    transparent: 0.0,
    sapling: 7.25,
    orchard: 5.29876,
  },
  spendableNotes: 8,
}

// Generate realistic unified address format for demo
function generateDemoUnifiedAddress(): string {
  // Unified addresses start with 'u1' and are ~200 chars
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const body = Array.from({ length: 180 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `u1${body.slice(0, 50)}...${body.slice(-10)}`
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface TabProps {
  active: boolean
  onClick: () => void
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void
  tabIndex?: number
  id?: string
  ariaControls?: string
  children: React.ReactNode
  buttonRef?: (el: HTMLButtonElement | null) => void
}

function Tab({ active, onClick, onKeyDown, tabIndex, id, ariaControls, children, buttonRef }: TabProps) {
  return (
    <button
      ref={buttonRef}
      id={id}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="tab"
      aria-selected={active}
      aria-controls={ariaControls}
      tabIndex={tabIndex}
      className={`min-h-[44px] px-3 py-2.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 active:bg-gray-800/50 sm:px-4 sm:text-sm ${
        active
          ? 'border-b-2 border-purple-500 text-purple-400'
          : 'text-gray-400 hover:text-gray-300'
      }`}
    >
      {children}
    </button>
  )
}

interface ViewingKeyData {
  key: string
  hash: string
  path: string
  generatedAt: number
}

type TabId = 'address' | 'balance' | 'fees' | 'viewing' | 'code'
const TAB_ORDER: TabId[] = ['address', 'balance', 'fees', 'viewing', 'code']

export function ZcashShowcase() {
  const [activeTab, setActiveTab] = useState<TabId>('address')
  const [generatedAddress, setGeneratedAddress] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [feeInputs, setFeeInputs] = useState(1)
  const [feeOutputs, setFeeOutputs] = useState(2)
  const [viewingKeyCopied, setViewingKeyCopied] = useState(false)
  const [viewingKey, setViewingKey] = useState<ViewingKeyData | null>(null)
  const [isLoadingViewingKey, setIsLoadingViewingKey] = useState(false)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Zcash RPC connection (live data when configured)
  const {
    status: rpcStatus,
    isLoading: isRpcLoading,
    isDemoMode,
    balanceZec,
    address: rpcAddress,
    generateAddress: generateRpcAddress,
    refreshAll,
  } = useZcashRpc()

  // Derived balance data (live or demo)
  const displayBalance = isDemoMode
    ? DEMO_BALANCE
    : balanceZec
      ? {
          confirmed: balanceZec.total,
          unconfirmed: 0,
          pools: {
            transparent: balanceZec.transparent,
            sapling: balanceZec.sapling,
            orchard: balanceZec.orchard,
          },
          spendableNotes: 0, // Not available from RPC directly
        }
      : DEMO_BALANCE

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        nextIndex = (index + 1) % TAB_ORDER.length
        break
      case 'ArrowLeft':
        e.preventDefault()
        nextIndex = (index - 1 + TAB_ORDER.length) % TAB_ORDER.length
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = TAB_ORDER.length - 1
        break
      default:
        return
    }

    tabRefs.current[nextIndex]?.focus()
    setActiveTab(TAB_ORDER[nextIndex])
  }

  // Generate real viewing key using SDK on mount
  useEffect(() => {
    async function loadViewingKey() {
      setIsLoadingViewingKey(true)
      try {
        const sdk = await loadSDK()
        const vk = sdk.generateViewingKey('zcash/demo/account-0')
        setViewingKey({
          key: vk.key,
          hash: vk.hash,
          path: vk.path,
          generatedAt: Date.now(),
        })
      } catch {
        // SDK not available, use fallback
        setViewingKey(null)
      } finally {
        setIsLoadingViewingKey(false)
      }
    }
    loadViewingKey()
  }, [])

  // Generate unified address (real RPC when connected, demo otherwise)
  const handleGenerateAddress = useCallback(async () => {
    setIsGenerating(true)

    if (!isDemoMode) {
      // Use real RPC to generate address
      const addr = await generateRpcAddress()
      if (addr?.address) {
        // Truncate for display (unified addresses are very long)
        const truncated = addr.address.length > 70
          ? `${addr.address.slice(0, 50)}...${addr.address.slice(-10)}`
          : addr.address
        setGeneratedAddress(truncated)
        setIsGenerating(false)
        return
      }
    }

    // Fallback to demo mode
    await new Promise((r) => setTimeout(r, 800))
    setGeneratedAddress(generateDemoUnifiedAddress())
    setIsGenerating(false)
  }, [isDemoMode, generateRpcAddress])

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
    if (!viewingKey) return
    try {
      await navigator.clipboard.writeText(viewingKey.key)
      setViewingKeyCopied(true)
      setTimeout(() => setViewingKeyCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }, [viewingKey])

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 to-gray-900/50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
            <ZcashIcon className="h-7 w-7 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-300">Zcash SDK Integration</h3>
            <p className="text-sm text-purple-400/70">@sip-protocol/sdk Zcash capabilities</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {isRpcLoading ? (
            <span className="rounded bg-gray-500/20 px-2 py-0.5 text-xs text-gray-400 border border-gray-500/30">
              Connecting...
            </span>
          ) : isDemoMode ? (
            <>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400 border border-amber-500/30">
                Demo Mode
              </span>
              <span className="text-xs text-gray-500">
                No zcashd connected
              </span>
            </>
          ) : (
            <>
              <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400 border border-green-500/30 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Live {rpcStatus?.testnet ? '(Testnet)' : '(Mainnet)'}
              </span>
              <span className="text-xs text-gray-500">
                Block #{rpcStatus?.blockHeight?.toLocaleString()}
              </span>
            </>
          )}
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
      <div className="mb-6 flex gap-1 border-b border-gray-700" role="tablist" aria-label="Zcash SDK features">
        <Tab
          active={activeTab === 'address'}
          onClick={() => setActiveTab('address')}
          onKeyDown={(e) => handleTabKeyDown(e, 0)}
          tabIndex={activeTab === 'address' ? 0 : -1}
          id="tab-address"
          ariaControls="panel-address"
          buttonRef={(el) => { tabRefs.current[0] = el }}
        >
          Addresses
        </Tab>
        <Tab
          active={activeTab === 'balance'}
          onClick={() => setActiveTab('balance')}
          onKeyDown={(e) => handleTabKeyDown(e, 1)}
          tabIndex={activeTab === 'balance' ? 0 : -1}
          id="tab-balance"
          ariaControls="panel-balance"
          buttonRef={(el) => { tabRefs.current[1] = el }}
        >
          Pools
        </Tab>
        <Tab
          active={activeTab === 'fees'}
          onClick={() => setActiveTab('fees')}
          onKeyDown={(e) => handleTabKeyDown(e, 2)}
          tabIndex={activeTab === 'fees' ? 0 : -1}
          id="tab-fees"
          ariaControls="panel-fees"
          buttonRef={(el) => { tabRefs.current[2] = el }}
        >
          ZIP-317 Fees
        </Tab>
        <Tab
          active={activeTab === 'viewing'}
          onClick={() => setActiveTab('viewing')}
          onKeyDown={(e) => handleTabKeyDown(e, 3)}
          tabIndex={activeTab === 'viewing' ? 0 : -1}
          id="tab-viewing"
          ariaControls="panel-viewing"
          buttonRef={(el) => { tabRefs.current[3] = el }}
        >
          Viewing Keys
        </Tab>
        <Tab
          active={activeTab === 'code'}
          onClick={() => setActiveTab('code')}
          onKeyDown={(e) => handleTabKeyDown(e, 4)}
          tabIndex={activeTab === 'code' ? 0 : -1}
          id="tab-code"
          ariaControls="panel-code"
          buttonRef={(el) => { tabRefs.current[4] = el }}
        >
          Code
        </Tab>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {/* Address Generation Tab */}
        {activeTab === 'address' && (
          <div id="panel-address" role="tabpanel" aria-labelledby="tab-address" tabIndex={0} className="space-y-4">
            <div className="rounded-lg border border-purple-500/20 bg-purple-950/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-purple-300">
                  Unified Address Generation
                </h4>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  isDemoMode
                    ? 'text-gray-500 bg-gray-800'
                    : 'text-green-400 bg-green-500/20'
                }`}>
                  {isDemoMode ? 'Demo' : 'Live RPC'}
                </span>
              </div>
              <p className="mb-4 text-sm text-gray-400">
                {isDemoMode
                  ? 'Generate sample unified addresses (Sapling + Orchard format demo).'
                  : 'Generate real unified addresses via zcashd RPC.'}
              </p>

              <button
                onClick={handleGenerateAddress}
                disabled={isGenerating}
                className="mb-4 min-h-[44px] rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500 active:bg-purple-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                {isGenerating ? 'Generating...' : 'Generate Unified Address'}
              </button>

              {generatedAddress && (
                <div className="rounded-lg bg-gray-900/50 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500">Generated Address:</p>
                    {!isDemoMode && (
                      <span className="text-xs text-green-400">From zcashd</span>
                    )}
                  </div>
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
          <div id="panel-balance" role="tabpanel" aria-labelledby="tab-balance" tabIndex={0} className="space-y-4">
            <div className="rounded-lg border border-purple-500/20 bg-purple-950/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-purple-300">
                  Shielded Pool Balances
                </h4>
                <div className="flex items-center gap-2">
                  {!isDemoMode && (
                    <button
                      onClick={refreshAll}
                      className="text-xs text-purple-400 hover:text-purple-300 px-2 py-0.5 rounded hover:bg-purple-500/10"
                      title="Refresh balance"
                    >
                      Refresh
                    </button>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    isDemoMode
                      ? 'text-gray-500 bg-gray-800'
                      : 'text-green-400 bg-green-500/20'
                  }`}>
                    {isDemoMode ? 'Demo Data' : 'Live Data'}
                  </span>
                </div>
              </div>

              {/* Total Balance */}
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-500">Total Confirmed</p>
                <p className="text-3xl font-bold text-white">
                  {displayBalance.confirmed.toFixed(8)}{' '}
                  <span className="text-lg text-purple-400">ZEC</span>
                </p>
                {displayBalance.unconfirmed > 0 && (
                  <p className="text-sm text-amber-400">
                    +{displayBalance.unconfirmed} pending
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
                    {displayBalance.pools.transparent.toFixed(8)} ZEC
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-amber-500"
                    style={{
                      width: `${displayBalance.confirmed > 0 ? (displayBalance.pools.transparent / displayBalance.confirmed) * 100 : 0}%`,
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
                    {displayBalance.pools.sapling.toFixed(8)} ZEC
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{
                      width: `${displayBalance.confirmed > 0 ? (displayBalance.pools.sapling / displayBalance.confirmed) * 100 : 0}%`,
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
                    {displayBalance.pools.orchard.toFixed(8)} ZEC
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-purple-500"
                    style={{
                      width: `${displayBalance.confirmed > 0 ? (displayBalance.pools.orchard / displayBalance.confirmed) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Note Count (only show in demo mode or if we have the data) */}
              {(isDemoMode || displayBalance.spendableNotes > 0) && (
                <div className="mt-4 rounded-lg bg-gray-900/50 p-3 text-center">
                  <span className="text-2xl font-bold text-purple-400">
                    {displayBalance.spendableNotes}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">spendable notes</span>
                </div>
              )}
            </div>

            {/* SDK Usage Note */}
            <div className="p-3 rounded-lg bg-gray-900/50 text-xs text-gray-400">
              {isDemoMode ? (
                <>
                  <strong className="text-gray-300">Connect to zcashd:</strong> Set{' '}
                  <code className="text-purple-400">ZCASH_RPC_*</code> environment variables to see live pool balances.
                </>
              ) : (
                <>
                  <strong className="text-green-400">Connected:</strong> Showing live balance from{' '}
                  <code className="text-purple-400">ZcashRPCClient.getAccountBalance()</code>
                </>
              )}
            </div>
          </div>
        )}

        {/* ZIP-317 Fees Tab */}
        {activeTab === 'fees' && (
          <div id="panel-fees" role="tabpanel" aria-labelledby="tab-fees" tabIndex={0} className="space-y-4">
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
          <div id="panel-viewing" role="tabpanel" aria-labelledby="tab-viewing" tabIndex={0} className="space-y-4">
            <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-amber-300">
                  Viewing Key Export (Compliance)
                </h4>
                {viewingKey && (
                  <span className="text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded border border-green-500/30">
                    Real SDK Key
                  </span>
                )}
              </div>
              <p className="mb-4 text-sm text-gray-400">
                Export viewing keys for regulatory compliance. Auditors can see incoming
                transactions without spending authority.
              </p>

              {/* Viewing Key Display */}
              {isLoadingViewingKey ? (
                <div className="mb-4 rounded-lg bg-gray-900/50 p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-400 mx-auto" />
                  <p className="mt-2 text-xs text-gray-500">Generating viewing key...</p>
                </div>
              ) : viewingKey ? (
                <div className="mb-4 rounded-lg bg-gray-900/50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      SIP Viewing Key (generated via SDK):
                    </span>
                    <button
                      onClick={handleCopyViewingKey}
                      className="min-h-[44px] min-w-[44px] rounded px-2 text-xs text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 active:bg-amber-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {viewingKeyCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <code className="block break-all text-xs text-amber-400">
                    {viewingKey.key.slice(0, 80)}...
                  </code>
                  <div className="mt-2 flex gap-4 text-xs">
                    <span className="text-gray-500">
                      Path: <code className="text-purple-400">{viewingKey.path}</code>
                    </span>
                    <span className="text-gray-500">
                      Hash: <code className="text-purple-400">{viewingKey.hash.slice(0, 16)}...</code>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-4 rounded-lg bg-gray-900/50 p-3 text-center text-gray-500 text-sm">
                  Viewing key generation failed
                </div>
              )}

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
          <div id="panel-code" role="tabpanel" aria-labelledby="tab-code" tabIndex={0} className="space-y-4">
            {/* Shielded Service Example */}
            <div className="rounded-lg bg-gray-900/70 p-4">
              <p className="mb-2 text-xs font-medium text-purple-400">
                {`// Initialize Zcash Shielded Service`}
              </p>
              <SyntaxHighlighter
                language="typescript"
                style={oneDark}
                customStyle={{
                  margin: 0,
                  padding: 0,
                  background: 'transparent',
                  fontSize: '0.75rem',
                }}
                codeTagProps={{
                  style: {
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                  }
                }}
              >
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
              </SyntaxHighlighter>
            </div>

            {/* Shielded Send Example */}
            <div className="rounded-lg bg-gray-900/70 p-4">
              <p className="mb-2 text-xs font-medium text-green-400">
                {`// Send shielded transaction`}
              </p>
              <SyntaxHighlighter
                language="typescript"
                style={oneDark}
                customStyle={{
                  margin: 0,
                  padding: 0,
                  background: 'transparent',
                  fontSize: '0.75rem',
                }}
                codeTagProps={{
                  style: {
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                  }
                }}
              >
                {`const result = await service.sendShielded({
  to: 'u1recipient...',
  amount: 1.5,
  memo: 'Payment for services',
  privacyLevel: PrivacyLevel.SHIELDED,
})

console.log('Txid:', result.txid)
console.log('Fee paid:', result.fee, 'ZEC')`}
              </SyntaxHighlighter>
            </div>

            {/* Fee Calculation Example */}
            <div className="rounded-lg bg-gray-900/70 p-4">
              <p className="mb-2 text-xs font-medium text-amber-400">
                {`// Calculate ZIP-317 fee`}
              </p>
              <SyntaxHighlighter
                language="typescript"
                style={oneDark}
                customStyle={{
                  margin: 0,
                  padding: 0,
                  background: 'transparent',
                  fontSize: '0.75rem',
                }}
                codeTagProps={{
                  style: {
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                  }
                }}
              >
                {`const fee = service.estimateFee({
  inputs: 3,
  outputs: 2,
})
// fee = max(2, max(3, 2)) * 5000 zatoshi
// fee = 3 * 5000 = 15000 zatoshi = 0.00015 ZEC`}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>

      {/* Footer - SDK Version */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-700 pt-4">
        <span className="text-xs text-gray-500">
          {`Powered by ${SDK_VERSION.full}`}
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
