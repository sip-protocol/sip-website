'use client'

/**
 * Solana Foundation Grant Pitch Page
 * Updated Dec 2025 - Focus on Solana Same-Chain Privacy (M17)
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
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
  Users,
  Handshake,
  Code,
  BookOpen,
} from 'lucide-react'
import { TEST_COUNTS, SDK_VERSION } from '@/lib/constants'

export default function SolanaFoundationPitchPage() {
  return (
    <>
      <HeroSection />
      <AchievementSection />
      <ProblemSection />
      <SolutionSection />
      <CompetitorSection />
      <TractionSection />
      <TeamSection />
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
                  $100,000
                </div>
              </div>
              <div className="h-12 w-px bg-purple-500/20" />
              <div>
                <div className="text-sm text-gray-400">Timeline</div>
                <div className="text-xl font-semibold text-white">6 Months</div>
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
                { label: 'Tests Passing', value: TEST_COUNTS.totalDisplay, detail: TEST_COUNTS.detailDisplay },
                { label: 'npm Package', value: 'Published', detail: SDK_VERSION.full },
                { label: 'Phase 1-3', value: '100%', detail: 'M1-M15 Complete' },
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
    <section className="py-12 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30"
        >
          <Trophy className="w-10 h-10 text-yellow-400" />
          <div className="text-center sm:text-left">
            <div className="text-lg font-bold text-yellow-400">
              Zypherpunk Hackathon Winner
            </div>
            <div className="text-sm text-gray-400">
              NEAR Track - $4,000 Prize | December 2025
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
      title: 'Pool Mixing is Broken',
      description: 'PrivacyCash uses Tornado Cash architecture. Fixed pools, amount correlation attacks, no compliance option.',
    },
    {
      icon: TrendingUp,
      title: 'Privacy Vacuum on Solana',
      description: 'Elusiv sunset. Light Protocol pivoted. PrivacyCash fills the gap with 2020 tech. Solana deserves better.',
    },
    {
      icon: Eye,
      title: 'No Viewing Keys',
      description: 'Mixers have zero compliance options. DAOs, institutions, and regulated entities cannot use them.',
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
            Solana Privacy is Stuck in 2020
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            PrivacyCash is a Tornado Cash clone. Same architecture, same weaknesses, same regulatory risk.
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
    { feature: 'Amount Privacy', sip: 'Any amount hidden', privacycash: 'Fixed pools only', arcium: 'Compute privacy' },
    { feature: 'Viewing Keys', sip: 'Yes (compliance)', privacycash: 'No', arcium: 'No' },
    { feature: 'Same-Chain Transfers', sip: 'Yes (M17)', privacycash: 'Yes', arcium: 'No (compute only)' },
    { feature: 'Cross-Chain Ready', sip: 'Yes (pluggable)', privacycash: 'No', arcium: 'No' },
    { feature: 'Production Status', sip: 'Live SDK, M15 Complete', privacycash: 'Mainnet', arcium: 'Testnet only' },
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

        {/* Key Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 max-w-3xl mx-auto text-center"
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
    { value: 'M15', label: 'Milestone Complete', detail: 'Phase 1-3 Done' },
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

function TeamSection() {
  const team = [
    {
      name: 'RECTOR',
      role: 'Founder & Lead Developer',
      bio: 'Full-stack developer with 10+ years experience in cryptography, blockchain, and privacy-preserving technologies. Previously built fintech solutions and decentralized applications.',
      focus: ['SDK Architecture', 'Cryptographic Primitives', 'System Design'],
      icon: Code,
    },
  ]

  const stats = [
    { label: 'Lines of TypeScript', value: '15,000+' },
    { label: 'Test Coverage', value: '95%+' },
    { label: 'Commits', value: '500+' },
    { label: 'Development Hours', value: '1,000+' },
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
            <Users className="w-4 h-4" />
            The Team
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Built by Developers, for Developers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Lean team, focused execution. {TEST_COUNTS.totalDisplay} tests don&apos;t write themselves.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <member.icon className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <div className="text-purple-400 font-medium">{member.role}</div>
                  <p className="mt-3 text-gray-400">{member.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.focus.map((skill) => (
                      <span key={skill} className="px-3 py-1 text-xs bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-3">
                    <a
                      href="https://github.com/sip-protocol"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Development Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 text-center">
                <div className="text-xl font-bold text-purple-400">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
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
        'Phantom, Solflare, Backpack wallet support',
        'SPL token privacy for any Solana token',
      ],
    },
    {
      title: 'dApp Partnerships Pipeline',
      description: 'Active conversations with Solana ecosystem projects. Target: 10+ integration LOIs by Month 6.',
      icon: Handshake,
      items: [
        'Wallet providers (Phantom, Solflare)',
        'DEX aggregators (Jupiter, Orca)',
        'DeFi protocols (Marinade, Raydium)',
        'DAO tooling platforms',
      ],
    },
    {
      title: 'Open Source Commitment',
      description: 'MIT licensed. All code public. No vendor lock-in. Community-driven development.',
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

        {/* Partnership Target */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 max-w-2xl mx-auto p-6 rounded-2xl bg-green-950/20 border border-green-500/20 text-center"
        >
          <div className="text-2xl font-bold text-green-400 mb-2">10+ dApp LOIs Target</div>
          <p className="text-gray-400">
            Signed Letters of Intent from Solana ecosystem projects by Month 6.
            Wallet integrations, DEX partnerships, and DeFi protocol collaborations.
          </p>
        </motion.div>
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
            Same-Chain Privacy Module
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Privacy for Solana-to-Solana transfers. Native integration with existing infrastructure.
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {/* Same-Chain Module */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-purple-950/20 border border-purple-500/20"
          >
            <div className="text-purple-400 font-semibold text-lg mb-4">Solana Same-Chain Privacy</div>
            <p className="text-gray-400 mb-4">Native Solana transfers with full privacy</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Stealth addresses (ed25519 native)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Pedersen commitments for amounts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Viewing keys for compliance
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Jupiter DEX integration
              </li>
            </ul>
            <div className="mt-4 px-3 py-1 bg-purple-500/10 rounded-full inline-block text-xs text-purple-300">
              M17 Deliverable
            </div>
          </motion.div>

          {/* Technical Stack */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-pink-950/20 border border-pink-500/20"
          >
            <div className="text-pink-400 font-semibold text-lg mb-4">Technical Stack</div>
            <p className="text-gray-400 mb-4">Production-ready with Noir ZK proofs</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                Noir circuits (Barretenberg WASM)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                Browser-side proof generation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                React Native mobile SDK
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                TypeScript SDK ({TEST_COUNTS.sdk.toLocaleString()} tests)
              </li>
            </ul>
            <div className="mt-4 px-3 py-1 bg-pink-500/10 rounded-full inline-block text-xs text-pink-300">
              Already Built
            </div>
          </motion.div>
        </div>
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
      milestones: 'M1-M15',
      progress: 100,
      items: ['SDK Core', 'Stealth Addresses', 'NEAR Integration', 'Multi-chain', 'Compliance Layer'],
    },
    {
      phase: 'Phase 4',
      title: 'Same-Chain Expansion',
      status: 'current',
      milestones: 'M16-M18',
      progress: 10,
      items: ['Narrative Capture (M16)', 'Solana Same-Chain (M17)', 'Ethereum Same-Chain (M18)'],
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
      title: 'Solana Same-Chain Privacy SDK',
      description: 'Native Solana-to-Solana private transfers with stealth addresses and Pedersen commitments',
      budget: '$35,000',
      timeline: 'Month 1-2',
      icon: Shield,
    },
    {
      id: 'M17-2',
      title: 'Jupiter DEX Integration',
      description: 'Private swaps via Jupiter aggregator with hidden amounts and recipients',
      budget: '$20,000',
      timeline: 'Month 2-3',
      icon: TrendingUp,
    },
    {
      id: 'M17-3',
      title: 'Mobile SDK (React Native)',
      description: 'iOS and Android SDK for mobile wallet integration with native Solana privacy',
      budget: '$20,000',
      timeline: 'Month 3-4',
      icon: Wallet,
    },
    {
      id: 'M17-4',
      title: 'Targeted Security Audit',
      description: 'Focused audit on cryptographic core (stealth addresses, commitments) + Solana program security. $15K covers SDK crypto review — additional program audit via Solana audit pool.',
      budget: '$15,000',
      timeline: 'Month 4-5',
      icon: ShieldCheck,
    },
    {
      id: 'M17-5',
      title: 'Documentation & dApp Partnerships',
      description: 'Comprehensive docs, video tutorials, and 10+ dApp integration pipeline',
      budget: '$10,000',
      timeline: 'Month 5-6',
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
            6-Month Deliverables: M17
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Focused on Solana Same-Chain Privacy — beating PrivacyCash on their own turf.
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
    { category: 'Solana Same-Chain SDK', amount: 35000, color: 'bg-purple-500' },
    { category: 'Jupiter DEX Integration', amount: 20000, color: 'bg-blue-500' },
    { category: 'Mobile SDK (React Native)', amount: 20000, color: 'bg-green-500' },
    { category: 'Security Audit', amount: 15000, color: 'bg-yellow-500' },
    { category: 'Docs & Partnerships', amount: 10000, color: 'bg-pink-500' },
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
            Total Request: $100,000
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
              $100,000
            </div>
            <div className="text-sm text-gray-500 mt-2">Milestone-based payments over 6 months</div>
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
            <h2 className="text-3xl sm:text-4xl font-bold">Make Solana the Privacy Standard</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Help us bring compliant privacy to Solana. Beat PrivacyCash with cryptographic privacy + viewing keys.
              {TEST_COUNTS.totalDisplay} tests. Production SDK. Live demo. Ready to scale.
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
                  { value: TEST_COUNTS.totalDisplay, label: 'Tests' },
                  { value: SDK_VERSION.display, label: 'npm' },
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
