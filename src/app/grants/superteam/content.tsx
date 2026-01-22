'use client'

/**
 * Superteam Instagrant Pitch Page - Client Content
 * Updated Jan 2026 - 3x Value Strategy: Request $10K, Deliver $30K
 *
 * Philosophy: Code fundamentals first. Marketing is ongoing activity, not measured KPI.
 * Technical deliverables are the REAL milestones.
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Shield,
  Zap,
  CheckCircle2,
  ArrowLeft,
  FileText,
  Trophy,
  AlertTriangle,
  TrendingUp,
  Eye,
  Lock,
  Github,
  ExternalLink,
  DollarSign,
  Target,
  Code,
  Terminal,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { TEST_COUNTS, SDK_VERSION } from '@/lib/constants'
import { VideoDemo } from '@/components/video-demo'
import { FounderProfile } from '@/components/founder-profile'
import { ZachXBTTweet } from '@/components/zachxbt-tweet'
import type { FounderData } from '@/lib/founder-data'

interface SuperteamContentProps {
  founderData: FounderData
}

export function SuperteamContent({ founderData }: SuperteamContentProps) {
  return (
    <>
      <HeroSection />
      <AchievementSection />
      <VideoDemoSection />
      <ValuePropositionSection />
      <ProblemSection />
      <SolutionSection />
      <CompetitionSection />
      <TractionSection />
      <SocialProofSection />
      <BudgetSection />
      <TimelineSection />
      <SuccessMetricsSection />
      <FounderSection founderData={founderData} />
      <CommitmentsSection />
      <CTASection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
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

        <div className="text-center">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <DollarSign className="w-4 h-4" />
              Instagrant Application
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
              🇮🇩 Indonesian Founder
            </span>
          </motion.div>

          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <Image
              src="/logo-mark-512.png"
              alt="SIP Protocol"
              width={64}
              height={64}
              className="rounded-2xl"
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold"
          >
            SIP Protocol
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 text-xl sm:text-2xl text-gray-400"
          >
            The Privacy Standard for Solana
          </motion.p>

          {/* Sub-tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-2 text-lg text-gray-500"
          >
            Cryptographic privacy, not pool mixing. Compliance-ready from day one.
          </motion.p>

          {/* Amount with Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 inline-flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-gray-400">Requesting</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                $10,000
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400">2 months</span>
            </div>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Delivering $30,000+ in value</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <a
              href="https://app.sip-protocol.org/dex"
              className="px-5 py-2.5 text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all font-medium"
            >
              Try Live Demo
            </a>
            <a
              href="https://docs.sip-protocol.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-gray-300 border border-gray-700 rounded-lg hover:text-white hover:border-gray-600 transition-all font-medium"
            >
              Read Docs
            </a>
            <a
              href="https://github.com/sip-protocol/sip-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-gray-300 border border-gray-700 rounded-lg hover:text-white hover:border-gray-600 transition-all font-medium flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </motion.div>
        </div>
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
      value: '$10K',
      icon: DollarSign,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Delivering',
      value: '$30K+',
      icon: Sparkles,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'ROI',
      value: '3x',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ]

  const deliverables = [
    { item: '3 Working Integration POCs', value: '$10K+', description: 'Phantom, Jupiter, Marinade demos' },
    { item: 'CLI v2 with Guided Wizard', value: '$5K+', description: 'Zero-friction developer onboarding' },
    { item: 'Viewing Key Dashboard', value: '$8K+', description: 'Compliance demo for institutions' },
    { item: 'Devnet Faucet Integration', value: '$3K+', description: 'Test private transfers instantly' },
    { item: 'Technical Content + Community', value: '$4K+', description: 'Articles, threads, Discourse forum (self-hosted)' },
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
            Request $10K, Deliver $30K
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            We over-deliver. Technical deliverables are the real milestones — marketing is ongoing activity, not the goal.
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
          className="max-w-3xl mx-auto p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
        >
          <h3 className="text-lg font-semibold mb-4 text-center">What You Get for $10K</h3>
          <div className="space-y-3">
            {deliverables.map((d) => (
              <div key={d.item} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div>
                  <div className="font-medium">{d.item}</div>
                  <div className="text-xs text-gray-500">{d.description}</div>
                </div>
                <div className="text-green-400 font-semibold">{d.value}</div>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-950/30 border border-green-500/20">
              <div className="font-bold text-green-400">Total Value Delivered</div>
              <div className="text-xl font-bold text-green-400">$30K+</div>
            </div>
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
      description: 'Pool-based privacy solutions expose transaction amounts on-chain. Fixed pool sizes and visible amounts enable correlation attacks.',
    },
    {
      icon: TrendingUp,
      title: 'Privacy Vacuum on Solana',
      description: 'Elusiv sunset in Feb 2024. Light Protocol pivoted to ZK Compression. The market needs cryptographic privacy — not just pool mixing.',
    },
    {
      icon: Eye,
      title: 'Limited Compliance Options',
      description: 'Most privacy solutions lack viewing keys for selective disclosure. DAOs and institutions need compliance-ready privacy.',
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
      description: 'EIP-5564 for Solana. One-time recipient addresses prevent linkability. No fixed pools needed.',
    },
    {
      icon: Lock,
      title: 'Pedersen Commitments',
      description: 'Any amount, hidden cryptographically. No amount correlation attacks possible.',
    },
    {
      icon: Eye,
      title: 'Viewing Keys',
      description: 'Selective disclosure for compliance. DAOs and institutions can audit without compromising user privacy.',
    },
    {
      icon: Zap,
      title: 'Same-Chain Privacy',
      description: 'Privacy for Solana-to-Solana transfers. 10-20x bigger market than cross-chain only.',
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

function CompetitionSection() {
  const comparison = [
    { feature: 'Privacy Method', sip: 'Cryptographic (Pedersen)', privacycash: 'Pool Mixing' },
    { feature: 'Amount Privacy', sip: 'Hidden (commitments)', privacycash: 'Visible on-chain' },
    { feature: 'Viewing Keys', sip: 'Yes (native)', privacycash: 'Via integration' },
    { feature: 'Amount Correlation', sip: 'Impossible', privacycash: 'Vulnerable' },
    { feature: 'Pool Size Constraints', sip: 'None (any amount)', privacycash: 'Fixed sizes' },
    { feature: 'Cross-Chain', sip: 'Yes (NEAR Intents)', privacycash: 'No' },
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
            Why SIP Wins
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            SIP vs PrivacyCash
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto overflow-hidden rounded-2xl border border-gray-800"
        >
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900/80">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Feature</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-green-400">SIP Protocol</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">PrivacyCash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {comparison.map((row) => (
                <tr key={row.feature} className="bg-gray-900/30">
                  <td className="px-6 py-4 text-sm text-gray-300">{row.feature}</td>
                  <td className="px-6 py-4 text-sm text-center text-green-400">{row.sip}</td>
                  <td className="px-6 py-4 text-sm text-center text-gray-500">{row.privacycash}</td>
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
          className="mt-6 text-center text-sm text-gray-500 max-w-2xl mx-auto"
        >
          <span className="text-gray-400">Solana privacy landscape:</span> Elusiv sunset Feb 2024. Light Protocol pivoted to ZK compression.
          PrivacyCash is currently the only active privacy solution on Solana — SIP brings cryptographic privacy to fill this gap.
        </motion.p>
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

function BudgetSection() {
  const budget = [
    {
      category: 'Integration POCs',
      amount: '$4,000',
      percent: 40,
      icon: Code,
      deliverables: [
        '3 working integration POCs (Phantom, Jupiter, Marinade)',
        'Each POC: functional demo, documentation, code samples',
        'Proves SDK integration is friction-free',
      ],
    },
    {
      category: 'Developer Tools',
      amount: '$3,500',
      percent: 35,
      icon: Terminal,
      deliverables: [
        'CLI v2 with guided setup wizard',
        'Devnet faucet integration',
        'Interactive getting-started experience',
      ],
    },
    {
      category: 'Compliance Demo',
      amount: '$2,500',
      percent: 25,
      icon: Layers,
      deliverables: [
        'Viewing key dashboard (web app)',
        'Compliance audit trail visualization',
        'Institutional selling tool',
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
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
            The Ask: $10,000
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            100% allocated to technical deliverables. Marketing and community are ongoing activities, not budget items.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {budget.map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-gray-900/50 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <span className="font-semibold text-lg">{item.category}</span>
                    <div className="text-xs text-gray-500">{item.percent}% of budget</div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-400">{item.amount}</span>
              </div>
              {/* Deliverables list */}
              <ul className="space-y-2 ml-15">
                {item.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>
              {/* Progress bar */}
              <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.percent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total + Ongoing Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 max-w-3xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
              <span className="text-gray-400">Total Request</span>
              <div className="text-3xl font-bold text-white mt-1">$10,000</div>
            </div>
            <div className="flex-1 p-6 rounded-2xl bg-gray-900/50 border border-gray-800 text-center">
              <span className="text-gray-400">Ongoing (No Budget)</span>
              <div className="text-sm text-gray-500 mt-2">
                Discourse forum (self-hosted), Twitter content, ecosystem presentations — we do these anyway
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function TimelineSection() {
  const milestones = [
    {
      month: 'Month 1',
      title: 'Integration POCs + Dev Tools',
      items: [
        'Phantom wallet integration POC (working demo)',
        'Jupiter DEX integration POC (private swap demo)',
        'CLI v2 development: guided wizard, devnet faucet',
        'Begin viewing key dashboard development',
      ],
      deliverables: ['2 working POCs', 'CLI v2 alpha'],
    },
    {
      month: 'Month 2',
      title: 'Completion + Ecosystem',
      items: [
        'Marinade/3rd integration POC',
        'CLI v2 release with full documentation',
        'Viewing key dashboard v1 (compliance demo)',
        'Partnership outreach with POC demos',
      ],
      deliverables: ['3rd POC', 'CLI v2 release', 'Dashboard v1'],
    },
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold"
          >
            2-Month Timeline
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-gray-400"
          >
            Concrete deliverables, not vanity metrics
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto grid gap-6 md:grid-cols-2">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.month}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
            >
              <div className="text-sm text-blue-400 font-medium">{milestone.month}</div>
              <h3 className="mt-2 text-xl font-semibold">{milestone.title}</h3>
              <ul className="mt-4 space-y-2">
                {milestone.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              {/* Concrete deliverables */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <div className="text-xs text-gray-500 mb-2 font-medium">Shipped:</div>
                <div className="flex flex-wrap gap-2">
                  {milestone.deliverables.map((d) => (
                    <span key={d} className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                      {d}
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
          className="mt-8 max-w-3xl mx-auto p-4 rounded-xl bg-gray-900/30 border border-gray-800/50 text-center"
        >
          <div className="text-sm text-gray-500">
            <strong className="text-gray-400">Ongoing activities (not milestones):</strong> Discourse forum (self-hosted), Twitter threads, ecosystem presentations.
            These happen regardless — we don&apos;t gate success on social metrics.
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SuccessMetricsSection() {
  const tranches = [
    {
      id: 'T1',
      payment: '$3,000',
      percent: '30%',
      timeline: 'Month 1',
      deliverables: ['Phantom wallet POC', 'Jupiter DEX POC', 'CLI v2 beta'],
      metrics: [
        { label: 'X Followers', current: '100', target: '250', growth: '+150' },
        { label: 'GitHub Stars', current: '1', target: '30', growth: '+29' },
        { label: 'npm Downloads/wk', current: '217', target: '500', growth: '+283' },
        { label: 'Discourse Members', current: '0', target: '100', growth: '+100' },
        { label: 'Blog Views', current: '0', target: '1,000', growth: '+1,000' },
      ],
    },
    {
      id: 'T2',
      payment: '$3,000',
      percent: '30%',
      timeline: 'Month 2',
      deliverables: ['Marinade POC', 'CLI v2 full release', 'Documentation'],
      metrics: [
        { label: 'X Followers', current: '250', target: '500', growth: '+250' },
        { label: 'GitHub Stars', current: '30', target: '60', growth: '+30' },
        { label: 'npm Downloads/wk', current: '500', target: '800', growth: '+300' },
        { label: 'Discourse Members', current: '100', target: '250', growth: '+150' },
        { label: 'Blog Views', current: '1,000', target: '2,500', growth: '+1,500' },
      ],
    },
    {
      id: 'T3',
      payment: '$4,000',
      percent: '40%',
      timeline: 'Completion',
      deliverables: ['Viewing Key Dashboard v1', 'Partnership outreach', '3 dApp LOIs'],
      metrics: [
        { label: 'X Followers', current: '500', target: '800', growth: '+300' },
        { label: 'GitHub Stars', current: '60', target: '100', growth: '+40' },
        { label: 'npm Downloads/wk', current: '800', target: '1,000', growth: '+200' },
        { label: 'Discourse Members', current: '250', target: '400', growth: '+150' },
        { label: 'Blog Views', current: '2,500', target: '4,000', growth: '+1,500' },
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
          >
            <Target className="w-4 h-4" />
            Success Metrics
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Tranche-Based Funding
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Payment released upon hitting deliverables AND traction targets. 30% → 30% → 40% structure.
          </motion.p>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {tranches.map((tranche, index) => (
            <motion.div
              key={tranche.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-sm">
                    {tranche.id}
                  </span>
                  <span className="text-gray-400">{tranche.timeline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">{tranche.payment}</span>
                  <span className="text-sm text-gray-500">({tranche.percent})</span>
                </div>
              </div>

              {/* Deliverables */}
              <div className="mb-6">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Deliverables</div>
                <div className="flex flex-wrap gap-2">
                  {tranche.deliverables.map((d) => (
                    <span key={d} className="px-3 py-1 text-sm bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics Table */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Traction Targets</div>
                <div className="grid gap-2">
                  {tranche.metrics.map((m) => (
                    <div key={m.label} className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50">
                      <span className="text-sm text-gray-400">{m.label}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">{m.current}</span>
                        <ArrowRight className="w-3 h-3 text-gray-600" />
                        <span className="text-white font-medium">{m.target}</span>
                        <span className="text-cyan-400 text-xs">({m.growth})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Current baseline note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <strong className="text-gray-400">Current baseline (Jan 2026):</strong> 100 X followers, 1 GitHub star, 217 npm downloads/week
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
            className="mt-4 text-gray-400"
          >
            {TEST_COUNTS.totalDisplay} tests don&apos;t write themselves.
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

function CommitmentsSection() {
  const commitments = [
    {
      icon: Github,
      title: '100% Open Source',
      description: 'MIT licensed. All code published to github.com/sip-protocol. Fork it, audit it, build on it.',
      badge: 'MIT License',
    },
    {
      icon: FileText,
      title: 'Weekly Progress Updates',
      description: 'Transparent development. Weekly updates to Superteam Indonesia community on progress and milestones.',
      badge: 'Every Week',
    },
    {
      icon: CheckCircle2,
      title: 'Milestone-Based Delivery',
      description: 'Concrete deliverables, not vanity metrics. Release unlocks after each milestone completion.',
      badge: 'Accountable',
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
            Our Commitments
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Transparent & Accountable
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            We believe in building in public. Here&apos;s what we commit to:
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {commitments.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-green-950/20 border border-green-500/20 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-green-400" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 mb-3">
                {item.badge}
              </span>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.description}</p>
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
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-blue-500/20 overflow-hidden">
          {/* Background effect */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
          </div>

          <div className="px-8 py-16 sm:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">$10K Investment → $30K Value</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Working integration POCs. Developer tools. Compliance dashboard.
              Real deliverables, not social media metrics.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://app.sip-protocol.org/dex"
                className="px-8 py-3 text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all font-medium"
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

            {/* Links */}
            <div className="mt-10 pt-8 border-t border-blue-500/20">
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
        </div>
      </div>
    </section>
  )
}
