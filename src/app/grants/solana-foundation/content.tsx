'use client'

/**
 * Solana Foundation Grant Pitch Page - Client Content
 * Updated Jan 2026 - 3x Value Strategy: Request $100K, Deliver $300K
 *
 * Philosophy: Code fundamentals first. Marketing is ongoing activity, not measured KPI.
 * Technical deliverables are the REAL milestones.
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  Target,
  Blocks,
  DollarSign,
  FileText,
  Github,
  ExternalLink,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Trophy,
  AlertTriangle,
  Eye,
  Lock,
  Zap,
  ArrowLeft,
  Globe,
  ChevronDown,
  Handshake,
  Code,
  BookOpen,
  Sparkles,
  Layers,
  Radio,
  Smartphone,
  Database,
  FileCode,
} from 'lucide-react'
import { TEST_COUNTS, SDK_VERSION } from '@/lib/constants'
import { VideoDemo } from '@/components/video-demo'
import { FounderProfile } from '@/components/founder-profile'
import { ZachXBTTweet } from '@/components/zachxbt-tweet'
import { ArchitectureDiagram } from '@/components/architecture-diagram'
import { TechnicalDeepDive } from '@/components/technical-deep-dive'
import type { FounderData } from '@/lib/founder-data'

interface SolanaFoundationContentProps {
  founderData: FounderData
}

export function SolanaFoundationContent({ founderData }: SolanaFoundationContentProps) {
  return (
    <>
      <HeroSection />
      <AchievementSection />
      <VideoDemoSection />
      <ValuePropositionSection />
      <ProblemSection />
      <SolutionSection />
      <TechnicalSection />
      <CompetitorSection />
      <TractionSection />
      <SocialProofSection />
      <FounderSection founderData={founderData} />
      <EcosystemCommitmentSection />
      <ArchitectureSection />
      <RoadmapSection />
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
                <Globe className="w-4 h-4" />
                Same-Chain Privacy for Solana
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
              The Privacy Standard for Solana
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 text-gray-500 max-w-lg"
            >
              Cryptographic privacy for Solana-to-Solana transfers. Not a mixer. Not a pool.
              Stealth addresses + Pedersen commitments + viewing keys for compliance.
            </motion.p>

            {/* Amount with 3x Value */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-col gap-2"
            >
              <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <div>
                  <div className="text-sm text-gray-400">Requesting</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    $100,000
                  </div>
                </div>
                <div className="h-12 w-px bg-purple-500/20" />
                <div>
                  <div className="text-sm text-gray-400">Timeline</div>
                  <div className="text-xl font-semibold text-white">6 Months</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Delivering $300,000+ in value — full Anchor program, Jito relayers, multi-wallet, M18 prep included</span>
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
                href="https://app.sip-protocol.org/dex"
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
                { label: 'Tests Passing', value: TEST_COUNTS.totalDisplay, detail: TEST_COUNTS.detailDisplay },
                { label: 'npm Package', value: 'Published', detail: SDK_VERSION.full },
                { label: 'Phase 1-3', value: '100%', detail: 'M1-M16 Complete' },
                { label: 'Status', value: 'Live', detail: 'sip-protocol.org' },
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

function AchievementSection() {
  return (
    <section className="py-16 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative max-w-lg mx-auto"
        >
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 rounded-3xl blur-xl" />

          {/* Card */}
          <div className="relative p-8 rounded-2xl bg-gradient-to-b from-yellow-950/40 to-amber-950/20 border border-yellow-500/30 backdrop-blur-sm overflow-hidden">
            {/* Animated sparkles */}
            <div className="absolute top-4 left-6 text-yellow-400/60 animate-pulse">✦</div>
            <div className="absolute top-6 right-8 text-amber-400/50 animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
            <div className="absolute bottom-6 left-10 text-yellow-300/40 animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
            <div className="absolute bottom-4 right-6 text-amber-300/60 animate-pulse" style={{ animationDelay: '0.3s' }}>✦</div>

            {/* Content */}
            <div className="text-center">
              {/* Trophy */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/30 mb-4"
              >
                <Trophy className="w-8 h-8 text-yellow-950" />
              </motion.div>

              {/* Label */}
              <div className="text-xs font-semibold tracking-[0.2em] uppercase text-yellow-500/80 mb-2">
                Hackathon Winner
              </div>

              {/* Divider */}
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mx-auto mb-3" />

              {/* Title */}
              <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent mb-2">
                Zypherpunk Hackathon
              </h3>

              {/* Details */}
              <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium">
                    3 Tracks
                  </span>
                  <span className="font-semibold text-amber-400">$6,500</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium">
                    #9 of 93
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  NEAR + Tachyon + pumpfun • Dec 2025
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ValuePropositionSection() {
  const valueItems = [
    {
      label: 'Requesting',
      value: '$100K',
      icon: DollarSign,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Delivering',
      value: '$300K+',
      icon: Sparkles,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'ROI',
      value: '3x',
      icon: TrendingUp,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
    },
  ]

  const deliverables = [
    { item: 'Full Anchor Program (Devnet)', value: '$80K+', description: 'shielded_transfer + claim_transfer + on-chain verification', icon: Database },
    { item: 'Jito Relayer Integration', value: '$40K+', description: 'Gas abstraction for shielded transfers', icon: Radio },
    { item: 'Multi-Wallet Support', value: '$30K+', description: 'Phantom, Solflare, Backpack, WalletConnect v2', icon: Wallet },
    { item: 'Mobile SDK (React Native)', value: '$25K+', description: 'iOS + Android native support', icon: Smartphone },
    { item: 'Jupiter DEX Integration', value: '$20K+', description: 'Private swaps via aggregator', icon: Zap },
    { item: 'Compliance Dashboard', value: '$20K+', description: 'Viewing key audit trail + report generator', icon: Eye },
    { item: 'Security Audit', value: '$15K+', description: 'Cryptographic core review', icon: ShieldCheck },
    { item: 'M18 Prep (Bonus)', value: '$50K+', description: 'Solidity contract foundation for Ethereum — free head start', icon: FileCode },
    { item: '100+ Integration Tests', value: '$20K+', description: 'Enterprise-grade quality assurance', icon: CheckCircle2 },
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
            <Sparkles className="w-4 h-4" />
            3x Value Proposition
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Request $100K, Deliver $300K
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            We massively over-deliver. Full Anchor program, Jito relayers, multi-wallet, AND M18 Ethereum prep — all included.
          </motion.p>
        </div>

        {/* ROI Cards */}
        <div className="grid gap-6 sm:grid-cols-3 max-w-2xl mx-auto mb-12">
          {valueItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl ${item.bgColor} border border-gray-800 text-center`}
            >
              <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-2`} />
              <div className={`text-3xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-sm text-gray-400">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Deliverables Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
        >
          <h3 className="text-lg font-semibold mb-4 text-center">What Solana Foundation Gets for $100K</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {deliverables.map((d) => (
              <div key={d.item} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <d.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{d.item}</div>
                  <div className="text-xs text-gray-500 truncate">{d.description}</div>
                </div>
                <div className="text-green-400 font-semibold text-sm">{d.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between p-4 rounded-lg bg-green-950/30 border border-green-500/20">
            <div className="font-bold text-green-400">Total Value Delivered</div>
            <div className="text-2xl font-bold text-green-400">$300K+</div>
          </div>
        </motion.div>

        {/* Bonus callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 max-w-4xl mx-auto p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-center"
        >
          <div className="text-purple-400 font-medium">
            Bonus: M18 Ethereum Contract Foundation Included
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Solana Foundation gets a head start on Ethereum privacy too — reusable Solidity contracts for EVM chains.
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ProblemSection() {
  const problems = [
    {
      icon: AlertTriangle,
      title: 'Pool Mixing Exposes Amounts',
      description: 'Pool-based privacy exposes transaction amounts on-chain. Fixed pool sizes and visible amounts enable statistical correlation attacks.',
    },
    {
      icon: TrendingUp,
      title: 'Privacy Vacuum on Solana',
      description: 'Elusiv sunset. Light Protocol pivoted. The market needs cryptographic privacy — amounts hidden, not just mixed.',
    },
    {
      icon: Eye,
      title: 'Limited Compliance Options',
      description: 'Most privacy solutions lack native viewing keys. DAOs, institutions, and regulated entities need compliance-ready privacy.',
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
            Solana Privacy Needs an Upgrade
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Pool mixing exposes amounts. Cryptographic privacy hides everything. Solana deserves the next generation.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
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
  const solutions = [
    {
      icon: Shield,
      title: 'Stealth Addresses',
      description: 'EIP-5564 adapted for Solana (ed25519). One-time recipient addresses prevent linkability.',
    },
    {
      icon: Lock,
      title: 'Pedersen Commitments',
      description: 'Any amount, hidden cryptographically. No fixed pools. No amount correlation attacks.',
    },
    {
      icon: Eye,
      title: 'Viewing Keys',
      description: 'Selective disclosure for compliance. DAOs and institutions can audit without compromising privacy.',
    },
    {
      icon: Zap,
      title: 'Same-Chain Privacy',
      description: 'Native Solana-to-Solana privacy. 10-20x bigger market than cross-chain only.',
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
            SIP: Cryptographic Privacy That Ships
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Not a mixer. Not a pool. True cryptographic privacy with built-in compliance.
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

function CompetitorSection() {
  const comparison = [
    { feature: 'Privacy Method', sip: 'Cryptographic (Pedersen)', privacycash: 'Pool Mixing', arcium: 'MPC Compute' },
    { feature: 'Amount Privacy', sip: 'Hidden (commitments)', privacycash: 'Visible on-chain', arcium: 'Compute only' },
    { feature: 'Viewing Keys', sip: 'Yes (native)', privacycash: 'Via integration', arcium: 'No' },
    { feature: 'Pool Constraints', sip: 'None (any amount)', privacycash: 'Fixed sizes', arcium: 'N/A' },
    { feature: 'Cross-Chain Ready', sip: 'Yes (pluggable)', privacycash: 'No', arcium: 'No' },
    { feature: 'Production Status', sip: 'Live SDK, M16 Done', privacycash: 'Mainnet', arcium: 'Testnet' },
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
            SIP vs Solana Privacy Solutions
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto overflow-hidden rounded-2xl border border-gray-800"
        >
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900/80">
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Feature</th>
                <th className="px-4 py-4 text-center text-sm font-medium text-green-400">SIP Protocol</th>
                <th className="px-4 py-4 text-center text-sm font-medium text-gray-500">PrivacyCash</th>
                <th className="px-4 py-4 text-center text-sm font-medium text-gray-500">Arcium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {comparison.map((row) => (
                <tr key={row.feature} className="bg-gray-900/30">
                  <td className="px-4 py-4 text-sm text-gray-300">{row.feature}</td>
                  <td className="px-4 py-4 text-sm text-center text-green-400">{row.sip}</td>
                  <td className="px-4 py-4 text-sm text-center text-gray-500">{row.privacycash}</td>
                  <td className="px-4 py-4 text-sm text-center text-gray-500">{row.arcium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Market context footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center text-sm text-gray-500 max-w-3xl mx-auto"
        >
          <span className="text-gray-400">Solana privacy landscape:</span> Elusiv sunset Feb 2024. Light Protocol pivoted to ZK compression.
          PrivacyCash is currently the only active privacy solution on Solana — SIP brings cryptographic privacy to fill this gap.
        </motion.p>

        {/* Key Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 max-w-3xl mx-auto text-center"
        >
          <div className="p-6 rounded-xl bg-green-950/20 border border-green-500/20">
            <p className="text-green-400 font-medium">
              SIP is the ONLY Solana privacy solution with compliance features (viewing keys).
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Cryptographic privacy + compliance = DAOs and institutions can adopt.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function TractionSection() {
  const metrics = [
    { value: TEST_COUNTS.totalDisplay, label: 'Tests Passing', detail: TEST_COUNTS.detailDisplay },
    { value: 'Published', label: 'npm Package', detail: SDK_VERSION.full },
    { value: 'Live', label: 'Demo Deployed', detail: 'sip-protocol.org' },
    { value: 'M16', label: 'Milestone Complete', detail: 'Phase 1-3 Done, Phase 4 Active' },
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
            We Ship, Not Vaporware
          </motion.h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 text-center"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                {metric.value}
              </div>
              <div className="mt-2 text-white font-medium">{metric.label}</div>
              <div className="mt-1 text-sm text-gray-500">{metric.detail}</div>
            </motion.div>
          ))}
        </div>

        {/* Code example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl bg-gray-900/80 border border-gray-800"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <FileText className="w-4 h-4" />
            Install in seconds
          </div>
          <code className="text-green-400 font-mono">npm install @sip-protocol/sdk</code>
        </motion.div>
      </div>
    </section>
  )
}

function FounderSection({ founderData }: { founderData: FounderData }) {
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
            <Code className="w-4 h-4" />
            The Founder
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Built by a Developer, for Developers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Lean execution. {TEST_COUNTS.totalDisplay} tests don&apos;t write themselves.
          </motion.p>
        </div>

        <FounderProfile data={founderData} />
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
            2-minute demo of cryptographic privacy on Solana
          </motion.p>
        </div>
        <VideoDemo caption="Watch how SIP enables private transactions with viewing keys for compliance" />
      </div>
    </section>
  )
}

function TechnicalSection() {
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
            <Code className="w-4 h-4" />
            Under the Hood
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Technical Deep Dive
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Real cryptographic primitives. Production-ready code.
          </motion.p>
        </div>
        <TechnicalDeepDive />
      </div>
    </section>
  )
}

function SocialProofSection() {
  return (
    <section className="py-16 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
          >
            <Eye className="w-4 h-4" />
            Why Privacy Matters
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-2xl sm:text-3xl font-bold"
          >
            The Cost of Transparent Wallets
          </motion.h2>
        </div>
        <ZachXBTTweet />
      </div>
    </section>
  )
}

function EcosystemCommitmentSection() {
  const commitments = [
    {
      title: 'Solana Ecosystem Focus',
      description: 'Dedicated to making Solana THE privacy chain. All M17 deliverables are Solana-native.',
      icon: Globe,
      items: [
        'Solana-native stealth addresses (ed25519)',
        'Jupiter DEX integration for private swaps',
        'Jito relayer integration for gas abstraction',
        'SPL token privacy for any Solana token',
      ],
    },
    {
      title: 'Multi-Wallet Support',
      description: 'Native support for major Solana wallets from day one.',
      icon: Wallet,
      items: [
        'Phantom wallet adapter',
        'Solflare wallet adapter',
        'Backpack wallet adapter',
        'WalletConnect v2 support',
      ],
    },
    {
      title: 'Open Source Commitment',
      description: 'MIT licensed. All code public. No vendor lock-in. Community-driven.',
      icon: BookOpen,
      items: [
        'Full SDK source code on GitHub',
        'Comprehensive documentation site',
        'Community Discord for developers',
        'Regular security updates and audits',
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20"
          >
            <Handshake className="w-4 h-4" />
            Ecosystem Commitment
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            All-In on Solana
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            SIP is built for Solana first. Cross-chain comes later — Solana privacy is the priority.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {commitments.map((commitment, index) => (
            <motion.div
              key={commitment.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <commitment.icon className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{commitment.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{commitment.description}</p>
              <ul className="space-y-2">
                {commitment.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
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
            Full-Stack Privacy Solution
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            On-chain Anchor program + TypeScript SDK + Mobile SDK. Complete privacy stack.
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Anchor Program */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-purple-950/20 border border-purple-500/20"
          >
            <div className="text-purple-400 font-semibold text-lg mb-4">Anchor Program</div>
            <p className="text-gray-400 mb-4">On-chain privacy with ZK verification</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                shielded_transfer instruction
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                claim_transfer instruction
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                On-chain Pedersen verification
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                ZK proof verifier (Noir→Solana)
              </li>
            </ul>
            <div className="mt-4 px-3 py-1 bg-purple-500/10 rounded-full inline-block text-xs text-purple-300">
              M17 Deliverable
            </div>
          </motion.div>

          {/* SDK + Relayers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-2xl bg-pink-950/20 border border-pink-500/20"
          >
            <div className="text-pink-400 font-semibold text-lg mb-4">SDK + Relayers</div>
            <p className="text-gray-400 mb-4">TypeScript SDK with gas abstraction</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                TypeScript SDK ({TEST_COUNTS.sdk.toLocaleString()} tests)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                Jito relayer integration
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                Jupiter DEX integration
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                Browser-side proof generation
              </li>
            </ul>
            <div className="mt-4 px-3 py-1 bg-pink-500/10 rounded-full inline-block text-xs text-pink-300">
              SDK: Done | Jito: M17
            </div>
          </motion.div>

          {/* Mobile + Wallets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-2xl bg-cyan-950/20 border border-cyan-500/20"
          >
            <div className="text-cyan-400 font-semibold text-lg mb-4">Mobile + Wallets</div>
            <p className="text-gray-400 mb-4">React Native SDK + multi-wallet</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                React Native SDK (iOS/Android)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Phantom adapter
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Solflare adapter
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Backpack + WalletConnect v2
              </li>
            </ul>
            <div className="mt-4 px-3 py-1 bg-cyan-500/10 rounded-full inline-block text-xs text-cyan-300">
              M17 Deliverable
            </div>
          </motion.div>
        </div>

        {/* Visual Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <ArchitectureDiagram />
        </motion.div>
      </div>
    </section>
  )
}

function RoadmapSection() {
  const phases = [
    {
      phase: 'Phase 1-3',
      title: 'Foundation + Standard + Ecosystem',
      status: 'complete',
      milestones: 'M1-M16',
      progress: 100,
      items: ['SDK Core', 'Stealth Addresses', 'NEAR Integration', 'Multi-chain', 'Compliance Layer'],
    },
    {
      phase: 'Phase 4',
      title: 'Same-Chain Expansion',
      status: 'current',
      milestones: 'M16-M18',
      progress: 33,
      items: ['Narrative Capture (M16) ✓', 'Solana Same-Chain (M17)', 'Ethereum Same-Chain (M18)'],
    },
    {
      phase: 'Phase 5',
      title: 'Technical Moat',
      status: 'future',
      milestones: 'M19-M21',
      progress: 0,
      items: ['Proof Composition', 'Multi-lang SDK', 'SIP-EIP Standard'],
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
            <Target className="w-4 h-4" />
            Development Roadmap
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

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 md:grid-cols-3">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl border ${
                  phase.status === 'current'
                    ? 'bg-indigo-950/30 border-indigo-500/30'
                    : phase.status === 'complete'
                    ? 'bg-green-950/20 border-green-500/20'
                    : 'bg-gray-900/50 border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-mono px-2 py-1 rounded ${
                    phase.status === 'current'
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : phase.status === 'complete'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-800 text-gray-500'
                  }`}>
                    {phase.milestones}
                  </span>
                  {phase.status === 'current' && (
                    <span className="text-xs text-indigo-400 animate-pulse">● Active</span>
                  )}
                  {phase.status === 'complete' && (
                    <span className="text-xs text-green-400">✓ Done</span>
                  )}
                </div>
                <h3 className={`text-lg font-semibold mb-1 ${
                  phase.status === 'current' ? 'text-indigo-400'
                  : phase.status === 'complete' ? 'text-green-400'
                  : 'text-gray-400'
                }`}>
                  {phase.phase}: {phase.title}
                </h3>
                {phase.progress > 0 && (
                  <div className="mb-3">
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${phase.status === 'complete' ? 'bg-green-500' : 'bg-indigo-500'}`}
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{phase.progress}% complete</span>
                  </div>
                )}
                <ul className="space-y-1 mt-3">
                  {phase.items.map((item) => (
                    <li key={item} className="text-sm text-gray-500 flex items-center gap-2">
                      <span className={
                        phase.status === 'current' ? 'text-indigo-400'
                        : phase.status === 'complete' ? 'text-green-400'
                        : 'text-gray-600'
                      }>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Link to full roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
            >
              View Full Roadmap
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function MilestonesSection() {
  const milestones = [
    {
      id: 'M17-1',
      title: 'Full Anchor Program + SDK',
      description: 'Complete Solana program with shielded_transfer, claim_transfer, on-chain Pedersen verification, and ZK proof verifier. 100+ integration tests.',
      budget: '$40,000',
      timeline: 'Month 1-2',
      icon: Database,
      extras: ['On-chain program (not just SDK wrapper)', '100+ integration tests', 'Devnet deployment'],
    },
    {
      id: 'M17-2',
      title: 'Jupiter DEX + Jito Relayers',
      description: 'Private swaps via Jupiter aggregator with Jito relayer integration for gas abstraction. Users can make shielded swaps without holding SOL.',
      budget: '$25,000',
      timeline: 'Month 2-3',
      icon: Radio,
      extras: ['Gas abstraction (no SOL needed)', 'Bundle submission via Jito', 'MEV protection included'],
    },
    {
      id: 'M17-3',
      title: 'Mobile SDK + Multi-Wallet',
      description: 'React Native SDK for iOS/Android plus native support for Phantom, Solflare, Backpack, and WalletConnect v2.',
      budget: '$20,000',
      timeline: 'Month 3-4',
      icon: Smartphone,
      extras: ['4 wallet adapters included', 'iOS + Android native', 'WalletConnect v2 ready'],
    },
    {
      id: 'M17-4',
      title: 'Security Audit + Compliance Dashboard',
      description: 'Focused audit on cryptographic core + viewing key audit dashboard with compliance report generator for institutional demo.',
      budget: '$15,000',
      timeline: 'Month 4-5',
      icon: ShieldCheck,
      extras: ['Crypto core audit', 'Compliance dashboard UI', 'Report generator for auditors'],
    },
    {
      id: 'BONUS',
      title: 'M18 Ethereum Foundation (FREE)',
      description: 'Solidity contract foundation for EVM chains — shieldedTransfer + claimTransfer functions. SF gets Ethereum privacy head start at no cost.',
      budget: '$0',
      timeline: 'Bonus',
      icon: FileCode,
      extras: ['Solidity contracts started', 'Reusable for BNB Chain', '~$50K value FREE'],
      isBonus: true,
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
            <Target className="w-4 h-4" />
            Grant Milestones
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            6-Month Deliverables: M17 (3x Scope)
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Full Anchor program, Jito relayers, multi-wallet, compliance dashboard — all included. Plus M18 Ethereum prep as bonus.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl border ${
                milestone.isBonus
                  ? 'bg-green-950/20 border-green-500/30'
                  : 'bg-gray-900/50 border-gray-800 hover:border-green-500/30'
              } transition-colors`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl ${milestone.isBonus ? 'bg-green-500/20' : 'bg-green-500/10'} flex items-center justify-center flex-shrink-0`}>
                      <milestone.icon className={`w-6 h-6 ${milestone.isBonus ? 'text-green-300' : 'text-green-400'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${milestone.isBonus ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                          {milestone.id}
                        </span>
                        <h3 className="font-semibold">{milestone.title}</h3>
                        {milestone.isBonus && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">FREE</span>
                        )}
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
                      <div className={`text-lg font-bold ${milestone.isBonus ? 'text-green-400' : 'text-green-400'}`}>{milestone.budget}</div>
                    </div>
                  </div>
                </div>
                {/* Extras */}
                <div className="flex flex-wrap gap-2 ml-16">
                  {milestone.extras.map((extra) => (
                    <span key={extra} className={`px-2 py-1 text-xs rounded-full border ${
                      milestone.isBonus
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {extra}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* What's NOT a milestone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 max-w-4xl mx-auto p-4 rounded-xl bg-gray-900/30 border border-gray-800/50 text-center"
        >
          <div className="text-sm text-gray-500">
            <strong className="text-gray-400">Ongoing activities (not milestones):</strong> dApp outreach, Discord community, documentation updates.
            These happen regardless — we focus on shipping code.
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function BudgetSection() {
  const budget = [
    { category: 'Anchor Program + SDK', amount: 40000, color: 'bg-purple-500' },
    { category: 'Jupiter + Jito Relayers', amount: 25000, color: 'bg-blue-500' },
    { category: 'Mobile SDK + Multi-Wallet', amount: 20000, color: 'bg-green-500' },
    { category: 'Security Audit + Compliance', amount: 15000, color: 'bg-yellow-500' },
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
            Total Request: $100,000 → $300K Value
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
          <div className="grid gap-4 sm:grid-cols-2">
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

          {/* Total + Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 grid gap-4 sm:grid-cols-2"
          >
            <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
              <div className="text-gray-400">Grant Request</div>
              <div className="text-3xl font-bold text-white mt-1">$100,000</div>
              <div className="text-sm text-gray-500 mt-1">Milestone-based payments</div>
            </div>
            <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
              <div className="text-gray-400">Value Delivered</div>
              <div className="text-3xl font-bold text-green-400 mt-1">$300,000+</div>
              <div className="text-sm text-gray-500 mt-1">3x ROI for Solana Foundation</div>
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
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20 overflow-hidden">
          {/* Background effect */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
          </div>

          <div className="px-8 py-16 sm:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">$100K Investment → $300K Value</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Full Anchor program. Jito relayers. Multi-wallet. Compliance dashboard. M18 Ethereum prep included.
              {TEST_COUNTS.totalDisplay} tests. Production SDK. Ready to scale.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://app.sip-protocol.org/dex"
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
                  { value: TEST_COUNTS.totalDisplay, label: 'Tests' },
                  { value: SDK_VERSION.display, label: 'npm' },
                  { value: 'Live', label: 'Demo' },
                  { value: '3x', label: 'ROI' },
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
