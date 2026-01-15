'use client'

import { useState } from 'react'
import { SDK_VERSION } from '@/lib/constants'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { PrivacyLevel } from '@/types'
import { StealthAddressDisplay } from '@/components/stealth-address-display'
import { PedersenCommitmentDisplay } from '@/components/pedersen-commitment-display'
import { ViewingKeyDisplay } from '@/components/viewing-key-display'
import { ZcashShowcase } from '@/components/zcash-showcase'
import type { NetworkId } from '@/lib'

export default function SDKShowcasePage() {
  const [selectedChain, setSelectedChain] = useState<NetworkId>('solana')

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-gray-800/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {`SDK ${SDK_VERSION.display}`}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                Production Ready
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Privacy SDK for Web3
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Add privacy to any dApp with one toggle. Stealth addresses, Pedersen commitments,
              and viewing keys for compliance.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.npmjs.com/package/@sip-protocol/sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                npm install @sip-protocol/sdk
              </a>
              <a
                href="https://docs.sip-protocol.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-base font-medium text-gray-300 border border-gray-700 rounded-lg hover:border-gray-600 hover:text-white transition-colors"
              >
                Read the Docs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Install */}
      <section className="py-8 border-b border-gray-800/50 bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <CodeBlock
              title="Quick Start"
              code={`import { SIP, PrivacyLevel } from '@sip-protocol/sdk'

const sip = new SIP({ network: 'mainnet' })

// Create a shielded intent
const intent = await sip.createIntent({
  fromChain: 'solana',
  toChain: 'ethereum',
  amount: 100,
  privacyLevel: PrivacyLevel.SHIELDED,
})`}
            />
          </div>
        </div>
      </section>

      {/* Cryptographic Primitives */}
      <section className="py-16 border-b border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Cryptographic Primitives</h2>
            <p className="mt-2 text-gray-400">
              Battle-tested cryptography based on proven standards
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Stealth Addresses Demo */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <LockIcon className="h-5 w-5 text-purple-400" />
                  Stealth Addresses
                </h3>
                <span className="text-xs text-gray-500">EIP-5564</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Generate one-time addresses that are unlinkable to your public wallet.
                Supports both secp256k1 (Ethereum) and ed25519 (Solana/NEAR) curves.
              </p>

              {/* Chain Selector */}
              <div className="mb-4 flex gap-2">
                {(['solana', 'ethereum', 'near', 'arbitrum'] as NetworkId[]).map((chain) => (
                  <button
                    key={chain}
                    onClick={() => setSelectedChain(chain)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      selectedChain === chain
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {chain.charAt(0).toUpperCase() + chain.slice(1)}
                  </button>
                ))}
              </div>

              <StealthAddressDisplay
                toChain={selectedChain}
                privacyLevel={PrivacyLevel.SHIELDED}
                showOnlyWhenPrivate={false}
              />

              <div className="mt-4">
                <CodeBlock
                  code={`const stealth = generateStealthAddress({
  recipientMeta: 'sip:solana:0x02abc...123:0x03def...456',
  curve: '${selectedChain === 'solana' || selectedChain === 'near' ? 'ed25519' : 'secp256k1'}',
})`}
                  compact
                />
              </div>
            </div>

            {/* Pedersen Commitments Demo */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <HashIcon className="h-5 w-5 text-purple-400" />
                  Pedersen Commitments
                </h3>
                <span className="text-xs text-gray-500">Homomorphic</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Hide transaction amounts while keeping them verifiable. Supports
                homomorphic addition for range proofs.
              </p>

              <PedersenCommitmentDisplay
                privacyLevel={PrivacyLevel.SHIELDED}
                showDemo={true}
              />
            </div>
          </div>

          {/* Viewing Keys */}
          <div className="mt-12">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <KeyIcon className="h-5 w-5 text-amber-400" />
                Viewing Keys
              </h3>
              <span className="text-xs text-gray-500">Selective Disclosure</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 max-w-2xl">
              Enable compliance without sacrificing privacy. Share viewing keys with
              auditors to prove transaction details while keeping spending authority private.
            </p>

            <div className="max-w-xl">
              <ViewingKeyDisplay privacyLevel={PrivacyLevel.COMPLIANT} />
            </div>

            <div className="mt-4 max-w-2xl">
              <CodeBlock
                code={`// Generate viewing key for compliance
const { viewingKey, keyHash } = generateViewingKey({
  intentId: intent.id,
  purpose: 'audit',
})

// Share with auditor - they can view but not spend
await shareWithAuditor(viewingKey, auditorPublicKey)`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Network Integration */}
      <section className="py-16 border-b border-gray-800/50 bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Network Integration</h2>
            <p className="mt-2 text-gray-400">
              Production-ready adapters for major protocols
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <NetworkCard
              name="NEAR Intents"
              description="1Click API integration for cross-chain settlement"
              status="live"
              network="Mainnet"
              icon={<NearIcon className="h-6 w-6" />}
            />
            <NetworkCard
              name="Zcash"
              description="Shielded transactions via zcashd RPC"
              status="live"
              network="Mainnet/Testnet"
              icon={<ZcashIcon className="h-6 w-6" />}
            />
            <NetworkCard
              name="Solana"
              description="Phantom, Solflare wallet adapters"
              status="live"
              network="All networks"
              icon={<SolanaIcon className="h-6 w-6" />}
            />
            <NetworkCard
              name="Ethereum"
              description="MetaMask, WalletConnect support"
              status="live"
              network="Mainnet/L2s"
              icon={<EthereumIcon className="h-6 w-6" />}
            />
            <NetworkCard
              name="Hardware Wallets"
              description="Ledger, Trezor integration"
              status="coming"
              network="All chains"
              icon={<HardwareIcon className="h-6 w-6" />}
            />
            <NetworkCard
              name="Noir Circuits"
              description="ZK proofs for validity and funding"
              status="coming"
              network="M8"
              icon={<CircuitIcon className="h-6 w-6" />}
            />
          </div>

          {/* Zcash SDK Showcase */}
          <div className="max-w-4xl mx-auto">
            <ZcashShowcase />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 border-b border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Use Cases</h2>
            <p className="mt-2 text-gray-400">
              Privacy solutions for every Web3 scenario
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <UseCaseCard
              title="Private Payments"
              description="Send funds without revealing sender, amount, or recipient to chain observers."
              features={['Stealth addresses', 'Hidden amounts', 'No transaction linking']}
              gradient="from-purple-500/20 to-pink-500/20"
            />
            <UseCaseCard
              title="DAO Treasury"
              description="Manage treasury operations privately while maintaining auditability for governance."
              features={['Compliant mode', 'Viewing key sharing', 'Multi-sig support']}
              gradient="from-blue-500/20 to-purple-500/20"
            />
            <UseCaseCard
              title="Enterprise Compliance"
              description="Meet regulatory requirements with selective disclosure and audit trails."
              features={['Viewing key export', 'Transaction proofs', 'Auditor access']}
              gradient="from-amber-500/20 to-orange-500/20"
            />
          </div>
        </div>
      </section>

      {/* SDK Stats */}
      <section className="py-16 border-b border-gray-800/50 bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <StatCard value="1,208+" label="Test Cases" />
            <StatCard value="6" label="Chains Supported" />
            <StatCard value="3" label="Privacy Levels" />
            <StatCard value="<50ms" label="Intent Creation" />
          </div>
        </div>
      </section>

      {/* Integration Examples */}
      <section className="py-16 border-b border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Integration Examples</h2>
            <p className="mt-2 text-gray-400">
              Copy-paste code to add privacy to your dApp
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <CodeBlock
              title="Create Shielded Swap"
              code={`import { SIP, PrivacyLevel } from '@sip-protocol/sdk'
import { PhantomWalletAdapter } from '@sip-protocol/sdk/adapters'

const sip = new SIP({
  network: 'mainnet',
  walletAdapter: new PhantomWalletAdapter(),
})

const intent = await sip.createIntent({
  fromChain: 'solana',
  toChain: 'ethereum',
  fromToken: 'SOL',
  toToken: 'ETH',
  amount: 100,
  privacyLevel: PrivacyLevel.SHIELDED,
})

// Execute through NEAR Intents
const result = await sip.executeIntent(intent)`}
            />

            <CodeBlock
              title="Compliant Mode with Viewing Key"
              code={`import { SIP, PrivacyLevel } from '@sip-protocol/sdk'

const intent = await sip.createIntent({
  fromChain: 'ethereum',
  toChain: 'solana',
  amount: 1000,
  privacyLevel: PrivacyLevel.COMPLIANT,
})

// Get viewing key for auditors
const viewingKey = intent.getViewingKey()

// Share with compliance team
await shareWithAuditor({
  key: viewingKey,
  purpose: 'quarterly-audit',
  expiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
})`}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Add Privacy?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Start building with the SIP Protocol SDK today. One toggle, full privacy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://app.sip-protocol.org/dex"
              className="px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Try the Demo
            </a>
            <a
              href="https://github.com/sip-protocol/sip-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 text-lg font-medium text-gray-300 border border-gray-700 rounded-lg hover:border-gray-600 hover:text-white transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── Sub-Components ─────────────────────────────────────────────────────────────

function CodeBlock({
  title,
  code,
  compact = false,
}: {
  title?: string
  code: string
  compact?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <div className={`rounded-xl bg-gray-900/70 border border-gray-800 overflow-hidden ${compact ? '' : ''}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
          <span className="text-sm font-medium text-gray-300">{title}</span>
          <button
            onClick={handleCopy}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <div className="relative">
        {!title && (
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 z-10 text-xs text-gray-500 hover:text-white transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
        <SyntaxHighlighter
          language="typescript"
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: compact ? '0.75rem' : '1rem',
            background: 'transparent',
            fontSize: compact ? '0.75rem' : '0.875rem',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

function NetworkCard({
  name,
  description,
  status,
  network,
  icon,
}: {
  name: string
  description: string
  status: 'live' | 'coming'
  network: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
            {icon}
          </div>
          <div>
            <h4 className="font-semibold">{name}</h4>
            <span className="text-xs text-gray-500">{network}</span>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 text-xs rounded-full ${
            status === 'live'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}
        >
          {status === 'live' ? 'Live' : 'Coming'}
        </span>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

function UseCaseCard({
  title,
  description,
  features,
  gradient,
}: {
  title: string
  description: string
  features: string[]
  gradient: string
}) {
  return (
    <div className={`rounded-2xl border border-gray-800 bg-gradient-to-br ${gradient} p-6`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
            <CheckIcon className="h-4 w-4 text-green-400" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  )
}

// ─── Icons ─────────────────────────────────────────────────────────────────────

function LockIcon({ className }: { className?: string }) {
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

function HashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"
      />
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function NearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.1 3.6L13.6 9.3c-.2.4.1.8.5.7l3.8-.8c.4-.1.7.3.5.7L12.1 21c-.2.4-.8.3-.9-.2L9.3 13c-.1-.3-.4-.5-.7-.4l-3.8.8c-.4.1-.7-.3-.5-.7L10.6 2c.2-.4.8-.3.9.2l1.9 7.8c.1.3.4.5.7.4l3.8-.8c.5-.1.8.3.6.7l-.4.7" />
    </svg>
  )
}

function ZcashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm0 29.5C8.556 29.5 2.5 23.444 2.5 16S8.556 2.5 16 2.5 29.5 8.556 29.5 16 23.444 29.5 16 29.5zm1.5-18.5h5v2.5h-7.25L22 21h-5v2.5h7.25L17.5 16V11z" />
    </svg>
  )
}

function SolanaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.5 18.5l3.5-3.5h12.5l-3.5 3.5H4.5zm0-6.5l3.5-3.5h12.5L17 12H4.5zm12.5-7H4.5l3.5 3.5h12.5L17 5z" />
    </svg>
  )
}

function EthereumIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1.5l-7.5 11 7.5 4.5 7.5-4.5L12 1.5zm0 16.5l-7.5-4.5L12 22.5l7.5-9-7.5 4.5z" />
    </svg>
  )
}

function HardwareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
      />
    </svg>
  )
}

function CircuitIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
      />
    </svg>
  )
}
