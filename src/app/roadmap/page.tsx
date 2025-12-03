'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { SDK_VERSION } from '@/lib/constants'
import {
  Shield,
  Zap,
  CheckCircle2,
  Circle,
  Target,
  Layers,
  Globe,
  Code,
  Wallet,
  TrendingUp,
  Users,
  FileText,
  Lock,
  Network,
  Blocks,
  ArrowRight,
  Github,
  ExternalLink,
  Sparkles,
} from 'lucide-react'

export default function RoadmapPage() {
  return (
    <>
      <HeroSection />
      <CurrentPhaseSection />
      <Phase1Section />
      <Phase2Section />
      <Phase3Section />
      <VisionSection />
      <CTASection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Target className="w-4 h-4" />
              Development Roadmap
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold"
          >
            Path to{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Privacy Standard
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto"
          >
            SIP Protocol is building the privacy standard for Web3 — like HTTPS for the internet.
            One toggle to shield any transaction.
          </motion.p>

          {/* Phase Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 inline-flex items-center gap-4 p-4 rounded-2xl bg-gray-900/50 border border-gray-800"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-sm text-gray-400">Phase 1: Foundation</span>
              <span className="text-xs text-indigo-400 font-mono">95%</span>
            </div>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-600" />
              <span className="text-sm text-gray-500">Phase 2: Standard</span>
            </div>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-700" />
              <span className="text-sm text-gray-600">Phase 3: Ecosystem</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CurrentPhaseSection() {
  return (
    <section className="py-16 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400">
                  Currently Active
                </span>
                <span className="text-sm text-gray-500">Phase 1 of 3</span>
              </div>
              <h2 className="text-2xl font-bold">Phase 1: Foundation</h2>
              <p className="mt-2 text-gray-400">
                Core SDK, cryptographic primitives, and production demo. 95% complete.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-400">M8</div>
                <div className="text-xs text-gray-500">Current</div>
              </div>
              <div className="h-12 w-px bg-gray-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1,331+</div>
                <div className="text-xs text-gray-500">Tests</div>
              </div>
              <div className="h-12 w-px bg-gray-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">Live</div>
                <div className="text-xs text-gray-500">Demo</div>
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-6">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '95%' }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Phase1Section() {
  const milestones = [
    {
      id: 'M1',
      title: 'Architecture & Specification',
      status: 'complete',
      description: 'System design, proof specifications, security model',
      icon: FileText,
    },
    {
      id: 'M2',
      title: 'Cryptographic Core',
      status: 'complete',
      description: 'Pedersen commitments, stealth addresses (secp256k1)',
      icon: Lock,
    },
    {
      id: 'M3',
      title: 'SDK Production',
      status: 'complete',
      description: 'TypeScript SDK with full test coverage',
      icon: Code,
    },
    {
      id: 'M4',
      title: 'Network Integration',
      status: 'complete',
      description: 'NEAR Intents adapter, Zcash RPC client',
      icon: Network,
    },
    {
      id: 'M5',
      title: 'Documentation & Launch',
      status: 'complete',
      description: 'API docs, tutorials, Starlight docs site',
      icon: FileText,
    },
    {
      id: 'M6',
      title: 'npm Publish',
      status: 'complete',
      description: `${SDK_VERSION.full} on npm registry`,
      icon: Zap,
    },
    {
      id: 'M7',
      title: 'Demo Integration',
      status: 'complete',
      description: 'Live demo with wallet connection, quotes, swaps',
      icon: Globe,
    },
    {
      id: 'M8',
      title: 'Production Hardening',
      status: 'in-progress',
      description: 'Security audit, Noir circuits, performance optimization',
      icon: Shield,
    },
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
          >
            <Sparkles className="w-4 h-4" />
            Phase 1: Foundation
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Core SDK & Infrastructure
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Building the foundational cryptographic primitives and production-ready SDK.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800" />

            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-16"
                >
                  {/* Status indicator */}
                  <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    milestone.status === 'complete'
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : milestone.status === 'in-progress'
                      ? 'bg-indigo-500/20 border-2 border-indigo-500 animate-pulse'
                      : 'bg-gray-800 border-2 border-gray-700'
                  }`}>
                    {milestone.status === 'complete' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : milestone.status === 'in-progress' ? (
                      <Circle className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-6 rounded-2xl border ${
                    milestone.status === 'in-progress'
                      ? 'bg-indigo-950/20 border-indigo-500/30'
                      : 'bg-gray-900/50 border-gray-800'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-mono px-2 py-1 rounded ${
                        milestone.status === 'complete'
                          ? 'bg-green-500/20 text-green-400'
                          : milestone.status === 'in-progress'
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'bg-gray-800 text-gray-500'
                      }`}>
                        {milestone.id}
                      </span>
                      <h3 className="font-semibold">{milestone.title}</h3>
                      {milestone.status === 'in-progress' && (
                        <span className="text-xs text-indigo-400">In Progress</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Phase2Section() {
  const milestones = [
    {
      id: 'M9',
      title: 'Horizontal Expansion',
      description: 'Private payments, DAO treasury ops, enterprise compliance, hardware wallets',
      icon: Layers,
    },
    {
      id: 'M10',
      title: 'Multi-Foundation Grants',
      description: 'NEAR, Zcash, Mina, Ethereum Foundation partnerships',
      icon: Users,
    },
    {
      id: 'M11',
      title: 'Settlement Abstraction',
      description: 'Settlement router, Mina Protocol research, direct chain options',
      icon: Network,
    },
    {
      id: 'M12',
      title: 'Partnership & Distribution',
      description: 'Phantom, Solflare, Jupiter integrations, solver partnerships',
      icon: Wallet,
    },
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"
          >
            <Layers className="w-4 h-4" />
            Phase 2: Standard
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Ecosystem Integration
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Native wallet integrations, DEX partnerships, and multi-chain settlement.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-gray-800 text-gray-500">
                  {milestone.id}
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <milestone.icon className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">{milestone.title}</h3>
              <p className="text-sm text-gray-400">{milestone.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Phase3Section() {
  const milestones = [
    {
      id: 'M13',
      title: 'Proof Aggregation',
      description: 'Compose proofs from Zcash, Mina, and Noir for unique capabilities',
      icon: Blocks,
    },
    {
      id: 'M14',
      title: 'Enterprise Features',
      description: 'Advanced compliance tools, institutional APIs, audit integrations',
      icon: Users,
    },
    {
      id: 'M15',
      title: 'Protocol Standard',
      description: 'SIP as the universal privacy standard across all chains',
      icon: Globe,
    },
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20"
          >
            <Globe className="w-4 h-4" />
            Phase 3: Ecosystem
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Universal Privacy Standard
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Proof aggregation, enterprise features, and protocol standardization.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-pink-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-gray-800 text-gray-500">
                  {milestone.id}
                </span>
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <milestone.icon className="w-4 h-4 text-pink-400" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">{milestone.title}</h3>
              <p className="text-sm text-gray-400">{milestone.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function VisionSection() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30 border border-purple-500/20"
        >
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">The Endgame</h2>
            <p className="text-xl text-gray-300 mb-6">
              &ldquo;SIP is to privacy what HTTPS is to the web&rdquo;
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Privacy middleware between applications and blockchains. Chain-agnostic.
              Settlement-agnostic. One toggle to shield any transaction. The universal
              privacy standard for Web3.
            </p>
          </div>

          {/* Architecture Stack */}
          <div className="mt-8 p-6 rounded-2xl bg-gray-900/50 border border-gray-800 font-mono text-sm">
            <div className="space-y-3 text-center">
              <div className="p-3 rounded-lg bg-gray-800/50 text-gray-400">
                Applications (Wallets, DEXs, DAOs)
              </div>
              <div className="text-gray-600">↓</div>
              <div className="p-3 rounded-lg bg-purple-900/30 border border-purple-500/30 text-purple-400 font-semibold">
                SIP PROTOCOL — Privacy Standard
              </div>
              <div className="text-gray-600">↓</div>
              <div className="p-3 rounded-lg bg-gray-800/50 text-gray-400">
                Settlement (NEAR Intents, Mina, Direct)
              </div>
              <div className="text-gray-600">↓</div>
              <div className="p-3 rounded-lg bg-gray-800/50 text-gray-400">
                Blockchains (Solana, ETH, NEAR, BTC, Aptos, Sui, L2s)
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Join the Journey</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Help us build the privacy standard for Web3. Try the demo, read the docs,
            or contribute on GitHub.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/demo"
              className="px-8 py-3 text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all font-medium"
            >
              Try Live Demo
            </Link>
            <Link
              href="/grants"
              className="px-8 py-3 text-gray-300 border border-gray-600 rounded-lg hover:text-white hover:border-gray-500 transition-all font-medium flex items-center gap-2"
            >
              View Grants
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/sip-protocol/sip-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 text-gray-300 border border-gray-600 rounded-lg hover:text-white hover:border-gray-500 transition-all font-medium flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>

          {/* Links */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <a href="https://docs.sip-protocol.org" className="hover:text-white transition-colors flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              docs.sip-protocol.org
            </a>
            <a href="https://www.npmjs.com/package/@sip-protocol/sdk" className="hover:text-white transition-colors flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              npm: @sip-protocol/sdk
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
