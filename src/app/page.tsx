'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  Shield,
  Lock,
  Eye,
  Zap,
  ArrowRight,
  Check,
  Copy,
  ExternalLink
} from 'lucide-react'

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ChainSection />
      <CodePreviewSection />
      <CTASection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Built on NEAR Intents + Zcash
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Privacy for{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
              Cross-Chain
            </span>
            <br />
            Transactions
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            One toggle to shield your sender, amount, and recipient.
            Privacy should be a feature, not a tradeoff.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://docs.sip-protocol.org/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25"
            >
              Get Started
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/demo"
              className="flex items-center gap-2 px-6 py-3 text-base font-medium text-gray-300 border border-gray-700 rounded-lg hover:border-gray-600 hover:text-white transition-colors"
            >
              Try Demo
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>800+ Tests Passing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>TypeScript First</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>MIT Licensed</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Stealth Addresses',
      description: 'One-time recipient addresses prevent transaction linkability. Each payment uses a unique address derived from the recipient\'s meta-address.',
    },
    {
      icon: Lock,
      title: 'Hidden Amounts',
      description: 'Transaction amounts are hidden using Pedersen commitments. Solvers see cryptographic commitments, not actual values.',
    },
    {
      icon: Eye,
      title: 'Viewing Keys',
      description: 'Selective disclosure for compliance. Share transaction details with auditors without exposing your full history.',
    },
    {
      icon: Zap,
      title: 'Cross-Chain',
      description: 'Privacy works across any NEAR-connected chain. Swap between Ethereum, Solana, Zcash, and more with full privacy.',
    },
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Privacy Made Simple
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Enterprise-grade cryptography with a developer-friendly API
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ChainSection() {
  const chains = [
    { name: 'NEAR', color: 'from-[#00C08B] to-[#00C08B]' },
    { name: 'Ethereum', color: 'from-[#627EEA] to-[#627EEA]' },
    { name: 'Solana', color: 'from-[#9945FF] to-[#14F195]' },
    { name: 'Arbitrum', color: 'from-[#28A0F0] to-[#28A0F0]' },
    { name: 'Aptos', color: 'from-[#4CC9F0] to-[#4CC9F0]' },
    { name: 'Zcash', color: 'from-[#F4B728] to-[#F4B728]' },
    { name: 'Bitcoin', color: 'from-[#F7931A] to-[#F7931A]' },
  ]

  return (
    <section className="py-16 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 mb-8">
          PRIVACY ACROSS CHAINS
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {chains.map((chain) => (
            <div
              key={chain.name}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${chain.color}`} />
              <span className="text-sm font-medium">{chain.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CodePreviewSection() {
  const [copied, setCopied] = useState(false)

  const code = `import { SIP, PrivacyLevel } from '@sip-protocol/sdk'

const sip = new SIP({ network: 'mainnet' })

// Create a shielded cross-chain swap
const intent = await sip
  .intent()
  .input('ethereum', 'ETH', 1_000_000_000_000_000_000n)
  .output('solana', 'SOL')
  .privacy(PrivacyLevel.SHIELDED)  // ← One toggle
  .build()

// Execute with privacy
const result = await sip.execute(intent)`

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Add Privacy in
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                5 Lines of Code
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              SIP integrates seamlessly with your existing codebase.
              No infrastructure changes, no complicated setup.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                'TypeScript-first with full type safety',
                'Works with any NEAR-connected chain',
                'Mock proofs for development, real ZK for production',
                'Viewing keys for regulatory compliance',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />
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
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const [copied, setCopied] = useState(false)
  const installCmd = 'npm install @sip-protocol/sdk'

  const copyInstall = () => {
    navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Add Privacy?
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
              Start building with SIP Protocol today. Full documentation and
              examples available.
            </p>

            {/* Install Command */}
            <div className="mt-8 flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/80 rounded-lg border border-gray-700">
                <code className="text-sm text-gray-300 font-mono">{installCmd}</code>
                <button
                  onClick={copyInstall}
                  className="p-1.5 text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://docs.sip-protocol.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                Read the Docs
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/sip-protocol/sip-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 text-base font-medium text-gray-300 hover:text-white transition-colors"
              >
                View on GitHub
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
