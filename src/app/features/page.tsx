'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  Shield,
  Lock,
  Eye,
  Zap,
  Code2,
  Wallet,
  FileCheck,
  Building2,
  Users,
  TrendingUp,
  ShieldCheck,
  Check,
  Copy,
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { CHAINS, VMS, CHAIN_STATUS_LABELS, VM_STATUS_LABELS, getActiveChains, getComingChains } from '@/lib/data'
import { TEST_COUNTS } from '@/lib/constants'

export default function FeaturesPage() {
  return (
    <>
      <HeroSection />
      <PrivacyFeaturesSection />
      <VMSection />
      <ChainsSection />
      <SDKFeaturesSection />
      <UseCasesSection />
      <CTASection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Deep Dive
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Privacy{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
              Features
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Explore the cryptographic primitives and developer tools that power
            SIP Protocol&apos;s privacy layer.
          </motion.p>
        </div>
      </div>
    </section>
  )
}

function PrivacyFeaturesSection() {
  const features = [
    {
      id: 'stealth',
      icon: Shield,
      title: 'Stealth Addresses',
      subtitle: 'Unlinkable Recipients',
      description: 'Each transaction generates a unique one-time address, preventing anyone from linking payments to a single recipient.',
      details: [
        'EIP-5564 compatible meta-address format',
        'Multi-curve support (secp256k1 + ed25519)',
        'Deterministic derivation from shared secret',
        'Recipient scans for incoming payments'
      ],
      code: `// Generate stealth address for recipient
const { stealthAddress, ephemeralPubKey } =
  generateStealthAddress(recipientMetaAddress)

// Format: sip:<chain>:<spendingKey>:<viewingKey>
// Example: sip:solana:0x02abc...123:0x03def...456`
    },
    {
      id: 'commitments',
      icon: Lock,
      title: 'Pedersen Commitments',
      subtitle: 'Hidden Amounts',
      description: 'Transaction amounts are cryptographically hidden while remaining verifiable. Solvers see commitments, not values.',
      details: [
        'Perfectly hiding, computationally binding',
        'Homomorphic addition for balance proofs',
        'NUMS generator for security',
        'Range proofs prevent negative values'
      ],
      code: `// Create hidden amount commitment
const commitment = createCommitment(amount)

// Commitment: value * G + blinding * H
// Verifiable without revealing amount
console.log(commitment.value)  // 0x02a3b...`
    },
    {
      id: 'viewing',
      icon: Eye,
      title: 'Viewing Keys',
      subtitle: 'Selective Disclosure',
      description: 'Share transaction details with auditors or compliance teams without exposing your entire history.',
      details: [
        'Derive from master private key',
        'Grant read-only access to specific transactions',
        'Time-bounded or permanent access',
        'Revocable viewing permissions'
      ],
      code: `// Create viewing key for compliance
const viewingKey = deriveViewingKey(masterKey)

// Share with auditor - they can see transactions
// but cannot spend funds or see other activity
await shareViewingKey(viewingKey, auditorId)`
    }
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Privacy Primitives
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Enterprise-grade cryptography adapted from Zcash, battle-tested with {TEST_COUNTS.totalDisplay} tests
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <FeatureDetail key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureDetail({ feature, index }: { feature: any; index: number }) {
  const [copied, setCopied] = useState(false)
  const isReversed = index % 2 === 1

  const copyCode = () => {
    navigator.clipboard.writeText(feature.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`grid lg:grid-cols-2 gap-12 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}
    >
      <div className={isReversed ? 'lg:order-2' : ''}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400">
            <feature.icon className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-purple-400">{feature.subtitle}</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold">{feature.title}</h3>
        <p className="mt-4 text-gray-400">{feature.description}</p>

        <ul className="mt-6 space-y-3">
          {feature.details.map((detail: string) => (
            <li key={detail} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={isReversed ? 'lg:order-1' : ''}>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl" />
          <div className="relative rounded-xl bg-gray-900 border border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <SyntaxHighlighter
              language="typescript"
              style={oneDark}
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: 'transparent',
                fontSize: '0.875rem',
              }}
              codeTagProps={{
                style: {
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                }
              }}
            >
              {feature.code}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function VMSection() {
  // VM color mapping
  const vmColors: Record<string, string> = {
    'EVM': '#627EEA',
    'SVM': '#9945FF',
    'NearVM': '#00C08B',
    'MoveVM': '#4CC9F0',
    'Zcash': '#F4B728',
    'Bitcoin': '#F7931A',
    'Cosmos': '#2E3148',
    'Mina': '#7B61FF',
  }

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
          >
            VM-Agnostic
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Works Across Virtual Machines
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto"
          >
            SIP is a client-side SDK supporting multiple cryptographic curves. One privacy layer for any blockchain.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {VMS.map((vm, index) => (
            <motion.div
              key={vm.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: vmColors[vm.name] }}
                  />
                  <h3 className="text-lg font-bold">{vm.name}</h3>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  vm.status === 'supported'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {VM_STATUS_LABELS[vm.status]}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">{vm.displayName}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 font-mono">
                  {vm.curve}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {vm.chains.map((chainId) => {
                  const chain = CHAINS.find(c => c.id === chainId)
                  return (
                    <span key={chainId} className="text-xs px-2 py-1 rounded-full bg-gray-800/50 text-gray-400">
                      {chain?.name || chainId}
                    </span>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architecture note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 max-w-2xl mx-auto p-6 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-center"
        >
          <p className="text-sm text-gray-400">
            <span className="text-cyan-400 font-medium">How it works:</span> SIP generates stealth addresses client-side using your wallet&apos;s cryptographic curve. The blockchain only sees normal transactions — no special VM support required.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function ChainsSection() {
  // Chain descriptions for display
  const chainDescriptions: Record<string, string> = {
    'near': 'Native integration via NEAR Intents',
    'ethereum': 'Full EVM support with stealth addresses',
    'solana': 'High-speed privacy transactions',
    'zcash': 'Shielded pool integration',
    'base': '60%+ L2 transaction share',
    'arbitrum': '44% L2 TVL, leading L2',
    'optimism': 'OP Stack ecosystem leader',
    'polygon': 'Massive EVM ecosystem',
    'bitcoin': 'Silent Payments (BIP-352)',
    'bnb': '4.32M daily active wallets',
    'mina': 'Proof composition partner',
    'aptos': 'Move-based privacy via ed25519',
    'sui': 'Object-model privacy support',
    'cosmos': 'IBC cross-chain privacy',
  }

  // Sort chains: active first, then by priority
  const sortedChains = [...CHAINS].sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1
    if (a.status !== 'active' && b.status === 'active') return 1
    const priorityOrder = { tier1: 0, tier2: 1, tier3: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const activeCount = getActiveChains().length
  const comingCount = getComingChains().length

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Supported Chains
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            {activeCount} chains active, {comingCount} coming soon — privacy works seamlessly across the multi-chain ecosystem
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedChains.filter(c => c.status !== 'future' && c.status !== 'research').map((chain, index) => (
            <motion.div
              key={chain.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5) }}
              className="group p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: chain.color }}
                  />
                  <h3 className="text-lg font-semibold">{chain.name}</h3>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  chain.status === 'active'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {CHAIN_STATUS_LABELS[chain.status]}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                {chainDescriptions[chain.id] || chain.notes || `${chain.vm} chain with ${chain.curve} support`}
              </p>
              {chain.priority === 'tier1' && chain.status === 'coming' && (
                <div className="mt-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    High Priority (M18)
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Future chains note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            More chains planned: Cosmos IBC, Aptos, Sui • <Link href="/roadmap" className="text-purple-400 hover:text-purple-300">View full roadmap</Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function SDKFeaturesSection() {
  const features = [
    {
      icon: Code2,
      title: 'TypeScript First',
      description: 'Full type definitions with strict mode. IntelliSense support for every API.'
    },
    {
      icon: Wallet,
      title: 'Wallet Adapters',
      description: 'Pre-built adapters for Ethereum (wagmi), Solana (wallet-adapter), and NEAR.'
    },
    {
      icon: FileCheck,
      title: 'Proof Providers',
      description: 'Pluggable proof system. Mock proofs for dev, Noir circuits for production.'
    },
    {
      icon: Zap,
      title: 'Intent Builder',
      description: 'Fluent API for constructing shielded intents with full validation.'
    }
  ]

  return (
    <section className="py-24 border-t border-gray-800/50 bg-gray-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Developer Experience
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Built for developers who value clean APIs and comprehensive documentation
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-4 p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 flex-shrink-0">
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://docs.sip-protocol.org/sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            View SDK Documentation
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

function UseCasesSection() {
  const useCases = [
    {
      icon: Building2,
      title: 'DAO Treasury',
      description: 'Protect treasury operations from front-running. Hide allocation decisions until execution.',
      benefits: ['MEV protection', 'Strategic confidentiality', 'Audit-ready with viewing keys']
    },
    {
      icon: TrendingUp,
      title: 'Institutional Trading',
      description: 'Execute large orders without signaling intent to the market. Full compliance support.',
      benefits: ['Hidden order flow', 'Regulatory compliance', 'Selective disclosure']
    },
    {
      icon: Users,
      title: 'Personal Privacy',
      description: 'Your financial activity is your business. Shield everyday transactions from surveillance.',
      benefits: ['Transaction privacy', 'Amount hiding', 'Recipient protection']
    },
    {
      icon: ShieldCheck,
      title: 'MEV Protection',
      description: 'Prevent sandwich attacks and front-running by hiding transaction details from mempool observers.',
      benefits: ['Hidden amounts', 'Protected recipients', 'Fair execution']
    }
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Use Cases
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Privacy is not just for hiding - it&apos;s for protecting legitimate interests
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 mb-4">
                <useCase.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{useCase.title}</h3>
              <p className="mt-2 text-gray-400">{useCase.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {useCase.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  >
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Explore?
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
              Try the interactive demo or dive into the documentation.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="https://app.sip-protocol.org/dex"
                className="flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25"
              >
                Try Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://docs.sip-protocol.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 text-base font-medium text-gray-300 border border-gray-700 rounded-lg hover:border-gray-600 hover:text-white transition-colors"
              >
                Read Docs
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
