'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import {
  Shield,
  Zap,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Users,
  FileText,
  Code,
  AlertTriangle,
  TrendingUp,
  Eye,
  Lock,
  Github,
  ExternalLink,
  DollarSign,
  Target,
  Layers,
  Globe,
  ChevronDown,
  Calendar,
  Award,
  Search,
  Smartphone,
  ShieldCheck,
} from 'lucide-react'

export default function SolanaFoundationPitchPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <WhySolanaSection />
      <TractionSection />
      <CompetitorSection />
      <ArchitectureSection />
      <MilestonesSection />
      <BudgetSection />
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
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/grants"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Grants
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ShieldCheck className="w-4 h-4" />
                Security Audit Grant Application
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              SIP Protocol
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl sm:text-2xl text-gray-400"
            >
              Security Audit for Production Readiness
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 text-gray-500 max-w-lg"
            >
              M1-M8 complete. 837 tests passing. SDK published. Now we need a professional
              security audit to verify our ZK circuits and cryptographic primitives before mainnet.
            </motion.p>

            {/* Amount */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-purple-500/10 border border-purple-500/20"
            >
              <div>
                <div className="text-sm text-gray-400">Requesting</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  $50,000
                </div>
              </div>
              <div className="h-12 w-px bg-purple-500/20" />
              <div>
                <div className="text-sm text-gray-400">Timeline</div>
                <div className="text-xl font-semibold text-white">3 Months</div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a
                href="/demo"
                className="px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
              >
                Try Live Demo
              </a>
              <a
                href="https://github.com/sip-protocol/sip-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-gray-300 border border-gray-700 rounded-lg hover:text-white hover:border-gray-600 transition-all font-medium flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                View Source
              </a>
            </motion.div>
          </div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-8 rounded-3xl bg-gray-900/50 border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-6 text-gray-400">Key Metrics</h3>
            <div className="space-y-6">
              {[
                { label: 'Tests Passing', value: '837', detail: '745 SDK + 92 demo' },
                { label: 'npm Package', value: 'Published', detail: '@sip-protocol/sdk v0.1.0' },
                { label: 'Milestones', value: 'M1-M8', detail: 'Audit pending' },
                { label: 'Demo', value: 'Live', detail: 'sip-protocol.org' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-400">{item.label}</div>
                    <div className="text-sm text-gray-600">{item.detail}</div>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    {item.value}
                  </div>
                </div>
              ))}
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

function ProblemSection() {
  const problems = [
    {
      icon: AlertTriangle,
      title: 'Privacy Projects Failed',
      points: [
        'Elusiv sunset Feb 2024',
        'Light Protocol pivoted to ZK Compression',
        'Otter Cash never launched',
      ],
    },
    {
      icon: Search,
      title: 'No Stealth Address SDK',
      points: [
        'EIP-5564 exists only for Ethereum',
        'Solana has no equivalent',
        'Developers have no tools',
      ],
    },
    {
      icon: Globe,
      title: 'Cross-Chain Privacy Gap',
      points: [
        'NEAR Intents: $6B+ volume',
        'Zolana bridge: NO privacy',
        'Wrapped tokens are transparent',
      ],
    },
    {
      icon: Eye,
      title: 'Institutional Blockers',
      points: [
        'No compliance features',
        'All-or-nothing privacy',
        'Regulatory uncertainty',
      ],
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20"
          >
            <AlertTriangle className="w-4 h-4" />
            The Problem
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Privacy on Solana Has a Critical Gap
          </motion.h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{problem.title}</h3>
              <ul className="space-y-2">
                {problem.points.map((point) => (
                  <li key={point} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    {point}
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

function SolutionSection() {
  const solutions = [
    {
      icon: Shield,
      title: 'Stealth Addresses',
      description: 'EIP-5564 adapted for Solana. One-time addresses prevent recipient linkability.',
    },
    {
      icon: Lock,
      title: 'Pedersen Commitments',
      description: 'Homomorphic commitments hide amounts while enabling mathematical verification.',
    },
    {
      icon: Eye,
      title: 'Viewing Keys',
      description: 'Selective disclosure for compliance. Auditors can verify without exposing user data.',
    },
    {
      icon: Layers,
      title: 'Privacy Levels',
      description: 'Transparent, Shielded, or Compliant. Users choose their privacy level.',
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
            SIP Protocol: Privacy That Ships
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Application-layer privacy for cross-chain intents. No new consensus layer.
            Just plug in our SDK and enable privacy.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-green-500/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <solution.icon className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{solution.title}</h3>
              <p className="text-sm text-gray-400">{solution.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhySolanaSection() {
  const reasons = [
    {
      icon: Zap,
      title: 'High Throughput',
      description: 'Privacy operations require compute. Solana handles it at scale.',
    },
    {
      icon: TrendingUp,
      title: 'Growing DeFi',
      description: 'Jupiter, Raydium, Meteora. Privacy unlocks institutional capital.',
    },
    {
      icon: Users,
      title: 'Institutional Interest',
      description: 'Confidential Balances shows demand. We extend it cross-chain.',
    },
    {
      icon: Globe,
      title: 'NEAR Bridge',
      description: 'NEAR Intents brings cross-chain users. Privacy brings them to Solana.',
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
            <Target className="w-4 h-4" />
            Why Solana?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Perfect Fit for Privacy
          </motion.h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-purple-950/20 border border-purple-500/20"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <reason.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{reason.title}</h3>
              <p className="text-sm text-gray-400">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TractionSection() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
          >
            <TrendingUp className="w-4 h-4" />
            Traction
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Production-Ready, Not Vaporware
          </motion.h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800"
          >
            <h3 className="text-xl font-semibold mb-6">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '837', label: 'Tests Passing' },
                { value: '100%', label: 'Pass Rate' },
                { value: 'v0.1.0', label: 'npm Published' },
                { value: 'M8', label: 'Milestones Done' },
              ].map((metric) => (
                <div key={metric.label} className="text-center p-4 rounded-xl bg-gray-800/50">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{metric.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800"
          >
            <h3 className="text-xl font-semibold mb-6">What&apos;s Built</h3>
            <ul className="space-y-3">
              {[
                'Stealth addresses (EIP-5564 adapted)',
                'Pedersen commitments',
                'Viewing keys for compliance',
                'NEAR Intents adapter',
                'Solana wallet adapter',
                'Ethereum wallet adapter',
                'Zcash RPC client',
                'Noir ZK circuits (compiled, integrated)',
                'E2E test coverage (128 tests)',
                'Secure memory handling (zeroization)',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CompetitorSection() {
  const competitors = [
    { name: 'Elusiv', status: 'Sunset', statusColor: 'text-red-400', advantage: 'We\'re shipping' },
    { name: 'Light Protocol', status: 'Pivoted', statusColor: 'text-yellow-400', advantage: 'We\'re privacy-focused' },
    { name: 'Arcium', status: 'Testnet only', statusColor: 'text-blue-400', advantage: 'We\'re live, they\'re Q4 2025' },
    { name: 'Wormhole/deBridge', status: 'No privacy', statusColor: 'text-gray-400', advantage: 'Only private cross-chain' },
    { name: 'Confidential Balances', status: 'Single-chain', statusColor: 'text-purple-400', advantage: 'We\'re cross-chain' },
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20"
          >
            <Target className="w-4 h-4" />
            Competitive Landscape
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            We Fill the Gap
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-gray-800">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Project</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">SIP Advantage</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((comp, index) => (
                  <motion.tr
                    key={comp.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="border-t border-gray-800"
                  >
                    <td className="px-6 py-4 font-medium">{comp.name}</td>
                    <td className={`px-6 py-4 ${comp.statusColor}`}>{comp.status}</td>
                    <td className="px-6 py-4 text-green-400">{comp.advantage}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

function ArchitectureSection() {
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
            <Layers className="w-4 h-4" />
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800 font-mono text-sm">
            <div className="text-gray-500 mb-4">{`// Transaction Flow`}</div>
            <div className="space-y-2">
              <div className="text-cyan-400">User Intent</div>
              <div className="text-gray-600 pl-4">↓</div>
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20">
                <div className="text-purple-400 font-semibold mb-2">PRIVACY LAYER (SIP)</div>
                <div className="text-gray-400 text-xs space-y-1">
                  <div>• Stealth Addresses</div>
                  <div>• Pedersen Commitments</div>
                  <div>• Viewing Keys</div>
                  <div>• ZK Proofs</div>
                </div>
              </div>
              <div className="text-gray-600 pl-4">↓</div>
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20">
                <div className="text-blue-400 font-semibold mb-2">INTENT LAYER (NEAR)</div>
                <div className="text-gray-400 text-xs space-y-1">
                  <div>• Cross-chain routing</div>
                  <div>• Chain signatures</div>
                </div>
              </div>
              <div className="text-gray-600 pl-4">↓</div>
              <div className="p-4 rounded-xl bg-green-950/30 border border-green-500/20">
                <div className="text-green-400 font-semibold mb-2">SETTLEMENT</div>
                <div className="text-gray-400 text-xs">Solana • Ethereum • Bitcoin • ...</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function MilestonesSection() {
  const milestones = [
    {
      id: 'M1',
      title: 'Security Audit - ZK Circuits',
      description: 'Professional audit of Noir circuits (Funding, Validity, Fulfillment proofs) by ZK-specialized firm',
      budget: '$25,000',
      timeline: 'Month 1-2',
      icon: ShieldCheck,
    },
    {
      id: 'M2',
      title: 'Security Audit - Cryptographic SDK',
      description: 'Audit of stealth addresses, Pedersen commitments, viewing keys, and encryption primitives',
      budget: '$15,000',
      timeline: 'Month 2',
      icon: Lock,
    },
    {
      id: 'M3',
      title: 'Audit Remediation & Fixes',
      description: 'Address all findings, implement fixes, and obtain final audit report',
      budget: '$5,000',
      timeline: 'Month 3',
      icon: Code,
    },
    {
      id: 'M4',
      title: 'Documentation & Publication',
      description: 'Publish audit report, update security docs, and announce mainnet readiness',
      budget: '$5,000',
      timeline: 'Month 3',
      icon: FileText,
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20"
          >
            <ShieldCheck className="w-4 h-4" />
            Audit Milestones
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Path to Mainnet Security
          </motion.h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-green-500/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <milestone.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                        {milestone.id}
                      </span>
                      <h3 className="font-semibold">{milestone.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{milestone.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 sm:flex-shrink-0">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Timeline</div>
                    <div className="text-sm font-medium">{milestone.timeline}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Budget</div>
                    <div className="text-lg font-bold text-green-400">{milestone.budget}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BudgetSection() {
  const budget = [
    { category: 'ZK Circuit Audit', amount: 25000, color: 'bg-purple-500' },
    { category: 'Crypto SDK Audit', amount: 15000, color: 'bg-blue-500' },
    { category: 'Remediation & Fixes', amount: 5000, color: 'bg-green-500' },
    { category: 'Docs & Publication', amount: 5000, color: 'bg-yellow-500' },
  ]

  const total = budget.reduce((sum, item) => sum + item.amount, 0)

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
            <DollarSign className="w-4 h-4" />
            Budget Breakdown
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Total Request: $50,000
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Progress bar visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="h-8 rounded-full overflow-hidden flex bg-gray-800">
              {budget.map((item) => (
                <motion.div
                  key={item.category}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(item.amount / total) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={`h-full ${item.color}`}
                  title={`${item.category}: $${item.amount.toLocaleString()}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Legend */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {budget.map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-gray-800"
              >
                <div className={`w-4 h-4 rounded ${item.color}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.category}</div>
                  <div className="text-xs text-gray-500">{((item.amount / total) * 100).toFixed(0)}%</div>
                </div>
                <div className="font-semibold">${item.amount.toLocaleString()}</div>
              </motion.div>
            ))}
          </div>

          {/* Total */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20 text-center"
          >
            <div className="text-gray-400">Total Grant Request</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              $50,000
            </div>
            <div className="text-sm text-gray-500 mt-2">Milestone-based payments over 3 months</div>
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
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20 overflow-hidden">
          {/* Background effect */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
          </div>

          <div className="px-8 py-16 sm:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">Help Us Ship Secure Privacy to Solana</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              M1-M8 complete. 837 tests passing. SDK published. We&apos;re one security audit
              away from mainnet. Help us verify our ZK circuits and cryptographic primitives.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/demo"
                className="px-8 py-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
              >
                Try Live Demo
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

            {/* Quick stats */}
            <div className="mt-12 pt-8 border-t border-purple-500/20">
              <div className="flex flex-wrap justify-center gap-8">
                {[
                  { value: '837', label: 'Tests' },
                  { value: 'Published', label: 'npm' },
                  { value: 'Live', label: 'Demo' },
                  { value: 'MIT', label: 'License' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
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
      </div>
    </section>
  )
}
