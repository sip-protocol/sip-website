'use client'

/**
 * Pitch Deck Page Content (Client Component)
 * Contains all animated sections with framer-motion
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Target,
  Blocks,
  Building2,
  LineChart,
  DollarSign,
  Layers,
  Globe,
  FileText,
  Github,
  ChevronDown,
  ExternalLink
} from 'lucide-react'
import { TEST_COUNTS, SDK_VERSION, PROJECT_STATUS } from '@/lib/constants'
import { FounderProfile } from '@/components/founder-profile'
import { ArchitectureDiagram } from '@/components/architecture-diagram'
import { VideoDemo } from '@/components/video-demo'
import type { FounderData } from '@/lib/founder-data'

interface PitchDeckContentProps {
  founderData: FounderData
}

export function PitchDeckContent({ founderData }: PitchDeckContentProps) {
  return (
    <>
      <HeroSection />
      <VideoDemoSection />
      <ProblemSection />
      <SolutionSection />
      <ArchitectureSection />
      <DifferentiationSection />
      <TractionSection />
      <FounderSection founderData={founderData} />
      <RoadmapSection />
      <AskSection />
      <CTASection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Shield className="w-4 h-4" />
                The Privacy Standard for Web3
              </span>
            </motion.div>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 flex items-center gap-4"
            >
              <Image
                src="/logo-mark-512.png"
                alt="SIP Protocol"
                width={64}
                height={64}
                className="rounded-2xl"
              />
              <h1 className="text-4xl sm:text-5xl font-bold">SIP Protocol</h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-xl text-gray-400"
            >
              Privacy middleware for cross-chain intents. One toggle to hide sender, amount, and recipient.
            </motion.p>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400">{TEST_COUNTS.totalDisplay}</div>
                <div className="text-xs text-gray-500">Tests Passing</div>
              </div>
              <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">{SDK_VERSION.display}</div>
                <div className="text-xs text-gray-500">Published SDK</div>
              </div>
              <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400">{PROJECT_STATUS.currentMilestone}</div>
                <div className="text-xs text-gray-500">Current Milestone</div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a
                href="https://app.sip-protocol.org/dex"
                className="px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
              >
                Try Live Demo
              </a>
              <a
                href="https://docs.sip-protocol.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-gray-300 border border-gray-700 rounded-lg hover:text-white hover:border-gray-600 transition-all font-medium"
              >
                Read Documentation
              </a>
            </motion.div>
          </div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
            <div className="relative p-8 rounded-3xl bg-gray-900/50 border border-gray-800">
              <div className="space-y-4 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">const</span>
                  <span className="text-white">intent</span>
                  <span className="text-gray-500">=</span>
                  <span className="text-green-400">{`createShieldedIntent(`}</span>
                </div>
                <div className="pl-4 space-y-1 text-gray-400">
                  <div><span className="text-purple-300">from:</span> <span className="text-yellow-300">&quot;ETH&quot;</span>,</div>
                  <div><span className="text-purple-300">to:</span> <span className="text-yellow-300">&quot;SOL&quot;</span>,</div>
                  <div><span className="text-purple-300">amount:</span> <span className="text-cyan-300">1.0</span>,</div>
                  <div><span className="text-purple-300">privacy:</span> <span className="text-yellow-300">&quot;shielded&quot;</span></div>
                </div>
                <div className="text-green-400">{`)`}</div>
                <div className="mt-4 pt-4 border-t border-gray-800 text-gray-500">
                  <span className="text-green-400">✓</span> Sender hidden
                  <span className="mx-2">•</span>
                  <span className="text-green-400">✓</span> Amount hidden
                  <span className="mx-2">•</span>
                  <span className="text-green-400">✓</span> Recipient hidden
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-gray-600 animate-bounce" />
        </motion.div>
      </div>
    </section>
  )
}

function VideoDemoSection() {
  return (
    <section className="py-16 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold"
          >
            See SIP in Action
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-gray-400"
          >
            2-minute demo of cryptographic privacy in action
          </motion.p>
        </div>
        <VideoDemo caption="Watch how SIP enables private transactions with viewing keys for compliance" />
      </div>
    </section>
  )
}

function ProblemSection() {
  const problems = [
    {
      stat: '$300M+',
      title: 'Lost to On-Chain Surveillance',
      description: 'Transaction tracking enables front-running, sandwich attacks, and coordinated manipulation of visible positions.'
    },
    {
      stat: '100%',
      title: 'Transparent by Default',
      description: 'Every swap, every transfer visible. Competitors, adversaries, and attackers see everything.'
    },
    {
      stat: 'Zero',
      title: 'Privacy Options That Work',
      description: 'Current solutions: chain-specific, require new wallets, break composability, or lack compliance options.'
    }
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20"
          >
            The Problem
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Web3&apos;s Privacy Problem
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20"
            >
              <div className="text-3xl font-bold text-red-400 mb-2">{problem.stat}</div>
              <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
              <p className="text-sm text-gray-400">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SolutionSection() {
  const features = [
    {
      icon: Shield,
      title: 'Stealth Addresses',
      description: 'One-time addresses for every transaction. No linkability.'
    },
    {
      icon: Layers,
      title: 'Pedersen Commitments',
      description: 'Cryptographically hide amounts. Verifiable without revealing.'
    },
    {
      icon: Target,
      title: 'Viewing Keys',
      description: 'Selective disclosure for compliance. Privacy + auditability.'
    },
    {
      icon: Zap,
      title: 'Intent Integration',
      description: 'Works with NEAR Intents. Solvers never see real recipient.'
    }
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            The Solution
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            SIP: Privacy as a Feature
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            One toggle to shield your transactions. Works with existing wallets and infrastructure.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-green-500/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ArchitectureSection() {
  return (
    <section className="py-24 border-t border-gray-800/50 bg-gray-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
          >
            <Blocks className="w-4 h-4" />
            Architecture
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            How It Works
          </motion.h2>
        </div>

        <ArchitectureDiagram />
      </div>
    </section>
  )
}

function DifferentiationSection() {
  const comparisons = [
    { feature: 'Cross-chain Support', sip: true, mixers: false, zkChains: false },
    { feature: 'Works with Existing Wallets', sip: true, mixers: true, zkChains: false },
    { feature: 'Compliance (Viewing Keys)', sip: true, mixers: false, zkChains: 'Limited' },
    { feature: 'Intent-Based Architecture', sip: true, mixers: false, zkChains: false },
    { feature: 'No New Token Required', sip: true, mixers: false, zkChains: false },
    { feature: 'Composable with DeFi', sip: true, mixers: false, zkChains: 'Limited' },
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
            Differentiation
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Why SIP Wins
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-gray-800"
        >
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900/80">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Feature</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-purple-400">SIP Protocol</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Mixers</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">ZK Chains</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {comparisons.map((row) => (
                <tr key={row.feature} className="bg-gray-900/30">
                  <td className="px-6 py-4 text-sm text-gray-300">{row.feature}</td>
                  <td className="px-6 py-4 text-center">
                    {row.sip === true ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                    ) : (
                      <span className="text-yellow-400">{row.sip}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.mixers === true ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                    ) : row.mixers === false ? (
                      <span className="text-gray-600">—</span>
                    ) : (
                      <span className="text-yellow-400">{row.mixers}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.zkChains === true ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                    ) : row.zkChains === false ? (
                      <span className="text-gray-600">—</span>
                    ) : (
                      <span className="text-yellow-400">{row.zkChains}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}

function TractionSection() {
  const metrics = [
    { value: TEST_COUNTS.totalDisplay, label: 'Tests Passing', detail: TEST_COUNTS.detailDisplay },
    { value: 'Live', label: 'Working Demo', detail: 'sip-protocol.org' },
    { value: SDK_VERSION.display, label: 'npm Published', detail: '@sip-protocol/sdk' },
    { value: PROJECT_STATUS.currentMilestone, label: 'Current Phase', detail: PROJECT_STATUS.currentPhaseName },
  ]

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
            <LineChart className="w-4 h-4" />
            Traction
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Built, Not Vaporware
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/20 text-center"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {metric.value}
              </div>
              <div className="mt-2 text-white font-medium">{metric.label}</div>
              <div className="mt-1 text-sm text-gray-500">{metric.detail}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FounderSection({ founderData }: { founderData: FounderData }) {
  return (
    <section className="py-24 border-t border-gray-800/50 bg-gray-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"
          >
            <Building2 className="w-4 h-4" />
            Founder
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Solo Founder, Maximum Execution
          </motion.h2>
        </div>

        <FounderProfile data={founderData} />
      </div>
    </section>
  )
}

function RoadmapSection() {
  const phases = [
    { phase: '1-3', name: 'Foundation + Standard + Ecosystem', status: 'complete', items: ['Core SDK', 'Stealth Addresses', 'NEAR Integration', 'Multi-chain Support', 'Compliance Layer'] },
    { phase: '4', name: 'Same-Chain Expansion', status: 'active', items: ['Narrative Capture (M16)', 'Solana Same-Chain (M17)', 'Ethereum Same-Chain (M18)'] },
    { phase: '5', name: 'Technical Moat', status: 'future', items: ['Proof Composition', 'Multi-lang SDK', 'SIP-EIP Standard'] },
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
            <Globe className="w-4 h-4" />
            Roadmap
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Path to Privacy Standard
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl border ${
                phase.status === 'complete' ? 'bg-green-950/20 border-green-500/30' :
                phase.status === 'active' ? 'bg-blue-950/20 border-blue-500/30' :
                'bg-gray-900/50 border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-medium ${
                  phase.status === 'complete' ? 'text-green-400' :
                  phase.status === 'active' ? 'text-blue-400' :
                  'text-gray-500'
                }`}>
                  Phase {phase.phase}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  phase.status === 'complete' ? 'bg-green-500/10 text-green-400' :
                  phase.status === 'active' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-gray-500/10 text-gray-500'
                }`}>
                  {phase.status === 'complete' ? '✓ Complete' : phase.status === 'active' ? '● Active' : 'Upcoming'}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-3">{phase.name}</h3>
              <ul className="space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      phase.status === 'complete' ? 'bg-green-400' :
                      phase.status === 'active' ? 'bg-blue-400' :
                      'bg-gray-600'
                    }`} />
                    {item}
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

function AskSection() {
  return (
    <section className="py-24 border-t border-gray-800/50 bg-gray-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20"
          >
            <DollarSign className="w-4 h-4" />
            The Ask
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Investment Opportunity
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 text-center"
          >
            <div className="text-sm text-green-400 mb-2">Seeking</div>
            <div className="text-5xl font-bold text-white mb-4">Grant Funding</div>
            <p className="text-gray-400 mb-6">
              To accelerate Solana same-chain privacy (M17) and expand to Ethereum (M18)
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-xl bg-gray-900/50">
                <div className="text-2xl font-bold text-green-400">$10K</div>
                <div className="text-sm text-gray-500">Superteam Microgrant</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-900/50">
                <div className="text-2xl font-bold text-green-400">$100K</div>
                <div className="text-sm text-gray-500">Solana Foundation</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-900/50">
                <div className="text-2xl font-bold text-green-400">Seed</div>
                <div className="text-sm text-gray-500">VC Round (Q2 2026)</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20 overflow-hidden"
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
          </div>

          <div className="px-8 py-16 sm:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to Learn More?</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Try the live demo, read the documentation, or reach out directly.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://app.sip-protocol.org/dex"
                className="px-8 py-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium flex items-center gap-2"
              >
                Try Live Demo
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://docs.sip-protocol.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 text-gray-300 border border-gray-600 rounded-lg hover:text-white hover:border-gray-500 transition-all font-medium flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Documentation
              </a>
              <a
                href="https://github.com/sip-protocol/sip-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 text-gray-300 border border-gray-600 rounded-lg hover:text-white hover:border-gray-500 transition-all font-medium flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                View Code
              </a>
            </div>

            {/* Quick links */}
            <div className="mt-12 pt-8 border-t border-purple-500/20">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                <a href="https://sip-protocol.org" className="hover:text-white transition-colors flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  sip-protocol.org
                </a>
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
        </motion.div>
      </div>
    </section>
  )
}
