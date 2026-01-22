'use client'

import { motion } from 'framer-motion'
import {
  Shield,
  Layers,
  Zap,
  Target,
  Users,
  Github,
  ExternalLink,
  Check,
  ArrowRight,
  BookOpen,
  Package
} from 'lucide-react'
import Link from 'next/link'
import { TEST_COUNTS, PROJECT_STATUS } from '@/lib/constants'
import { FounderProfile } from '@/components/founder-profile'
import { ALL_PHASES, getCompletedMilestoneCount, getTotalMilestoneCount } from '@/lib/data'
import type { FounderData } from '@/lib/founder-data'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              About SIP
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Privacy as a{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
              Feature
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto"
          >
            The Privacy Standard for Web3. One toggle to shield sender, amount, and recipient.
            Open source, auditable, and compliance-ready with viewing keys.
          </motion.p>
        </div>
      </div>
    </section>
  )
}

export function MissionSection() {
  const values = [
    {
      icon: Shield,
      title: 'Privacy by Default',
      description: 'Financial privacy is a fundamental right. SIP makes it accessible with a single toggle, not a complex setup.'
    },
    {
      icon: Layers,
      title: 'Application Layer',
      description: 'We complement existing infrastructure, not compete with it. SIP works with NEAR Intents and Zcash, not against them.'
    },
    {
      icon: Target,
      title: 'Compliance Ready',
      description: 'Privacy and compliance can coexist. Viewing keys enable selective disclosure for auditors and regulators.'
    }
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Why We Build SIP
            </h2>
            <p className="mt-6 text-lg text-gray-400">
              On-chain investigation incidents have exposed a critical vulnerability: transparent
              activity enables coordinated attacks on traders. Market makers, DAOs, and individuals
              all face risks when their transaction history is public.
            </p>
            <p className="mt-4 text-lg text-gray-400">
              SIP Protocol addresses this by bringing Zcash-level privacy to cross-chain transactions.
              Not as a separate chain, but as a privacy layer that works with the intent-based
              infrastructure you already use.
            </p>
            <p className="mt-4 text-lg text-gray-400">
              Our vision: privacy should be a toggle, not a tradeoff.
            </p>
          </div>

          <div className="space-y-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 flex-shrink-0">
                  <value.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-gray-400">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function HowItWorksSection() {
  return (
    <section className="py-24 border-t border-gray-800/50 bg-gray-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            How SIP Works
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            A privacy layer built on proven cryptographic primitives
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl" />
          <div className="relative rounded-2xl bg-gray-900 border border-gray-800 p-8 overflow-hidden">
            <div className="space-y-4 font-mono text-sm">
              {/* User Intent */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="w-32 text-right text-gray-500">User</div>
                <div className="flex-1 p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <span className="text-purple-400">Intent</span>
                  <span className="text-gray-400"> → Swap 1 ETH for SOL (shielded)</span>
                </div>
              </motion.div>

              {/* Arrow */}
              <div className="flex items-center gap-4">
                <div className="w-32"></div>
                <div className="flex-1 flex justify-center text-gray-600">↓</div>
              </div>

              {/* Privacy Layer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-32 text-right text-purple-400">SIP Layer</div>
                <div className="flex-1 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-purple-400 text-xs mb-1">Stealth Address</div>
                      <div className="text-gray-500 text-xs">Hide recipient</div>
                    </div>
                    <div>
                      <div className="text-purple-400 text-xs mb-1">Commitment</div>
                      <div className="text-gray-500 text-xs">Hide amount</div>
                    </div>
                    <div>
                      <div className="text-purple-400 text-xs mb-1">Viewing Key</div>
                      <div className="text-gray-500 text-xs">Compliance</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Arrow */}
              <div className="flex items-center gap-4">
                <div className="w-32"></div>
                <div className="flex-1 flex justify-center text-gray-600">↓</div>
              </div>

              {/* NEAR Intents */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="w-32 text-right text-[#00C08B]">NEAR Intents</div>
                <div className="flex-1 p-4 rounded-lg bg-[#00C08B]/10 border border-[#00C08B]/30">
                  <span className="text-[#00C08B]">Solver Network</span>
                  <span className="text-gray-400"> → Best execution, no recipient knowledge</span>
                </div>
              </motion.div>

              {/* Arrow */}
              <div className="flex items-center gap-4">
                <div className="w-32"></div>
                <div className="flex-1 flex justify-center text-gray-600">↓</div>
              </div>

              {/* Settlement */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="w-32 text-right text-gray-500">Settlement</div>
                <div className="flex-1 grid grid-cols-4 gap-2">
                  {['ETH', 'SOL', 'NEAR', 'ZEC'].map((chain) => (
                    <div key={chain} className="p-2 rounded bg-gray-800/50 border border-gray-700 text-center text-xs text-gray-400">
                      {chain}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Key Technologies */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-[#00C08B]" />
              <h3 className="text-lg font-semibold">NEAR Intents</h3>
            </div>
            <p className="text-sm text-gray-400">
              We leverage NEAR&apos;s intent-based architecture and solver network for cross-chain
              execution. SIP adds privacy to intents without modifying the underlying infrastructure.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-[#F4B728]" />
              <h3 className="text-lg font-semibold">Zcash Cryptography</h3>
            </div>
            <p className="text-sm text-gray-400">
              Battle-tested privacy primitives from Zcash: Pedersen commitments for hiding amounts,
              and techniques adapted from the shielded pool for transaction privacy.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function RoadmapSection() {
  const completedCount = getCompletedMilestoneCount()
  const totalCount = getTotalMilestoneCount()

  // Colors for each phase
  const phaseColors: Record<number, { bg: string; border: string; text: string }> = {
    1: { bg: 'bg-indigo-500/20', border: 'border-indigo-500', text: 'text-indigo-400' },
    2: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400' },
    3: { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400' },
    4: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400' },
    5: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400' },
  }

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Roadmap
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            {completedCount} of {totalCount} milestones complete — Phase {PROJECT_STATUS.currentPhase} active
          </p>
        </div>

        {/* Phase Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 max-w-6xl mx-auto mb-12">
          {ALL_PHASES.map((phase, index) => {
            const colors = phaseColors[phase.id]
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl bg-gray-900/50 border ${
                  phase.status === 'active' ? colors.border : 'border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium ${colors.text}`}>Phase {phase.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    phase.status === 'complete' ? 'bg-green-500/10 text-green-400' :
                    phase.status === 'active' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-gray-500/10 text-gray-500'
                  }`}>
                    {phase.status === 'complete' ? '100%' : phase.status === 'active' ? `${phase.progress}%` : 'Upcoming'}
                  </span>
                </div>
                <h3 className="font-semibold text-sm">{phase.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{phase.subtitle}</p>
                <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${phase.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full rounded-full ${
                      phase.status === 'complete' ? 'bg-green-500' :
                      phase.status === 'active' ? 'bg-blue-500' :
                      'bg-gray-700'
                    }`}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  M{phase.milestones[0].id.replace('M', '')}–M{phase.milestones[phase.milestones.length - 1].id.replace('M', '')}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Current Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto p-6 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-center"
        >
          <div className="text-sm text-blue-400 font-medium mb-2">Currently Active</div>
          <h3 className="text-xl font-bold">
            {PROJECT_STATUS.currentMilestone}: {PROJECT_STATUS.currentPhaseName}
          </h3>
          <p className="mt-2 text-gray-400 text-sm">
            Narrative capture, community building, and competitive positioning vs PrivacyCash
          </p>
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            View Full Roadmap
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

interface TeamSectionProps {
  founderData: FounderData
}

export function TeamSection({ founderData }: TeamSectionProps) {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Meet the Team
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Building the privacy layer that Web3 deserves
          </p>
        </div>

        {/* Use the rich FounderProfile component with live data */}
        <FounderProfile data={founderData} />

        {/* Join the team CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Interested in contributing to privacy infrastructure?
          </p>
          <a
            href="https://github.com/sip-protocol/sip-protocol/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>Check out open issues on GitHub</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

export function CommunitySection() {
  return (
    <section className="py-24 border-t border-gray-800/50 bg-gray-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400">
              <Users className="h-8 w-8" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold">
            Community Driven
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            SIP Protocol is open source and built in public. We believe privacy technology
            should be transparent, auditable, and community-owned.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>MIT Licensed</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>{TEST_COUNTS.totalDisplay} Tests</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Security Audit Ready</span>
            </div>
          </div>

          <div className="mt-8">
            <a
              href="https://github.com/sip-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              <Github className="h-5 w-5" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function LinksSection() {
  const links = [
    {
      icon: Github,
      title: 'GitHub',
      description: 'Source code, issues, and contributions',
      href: 'https://github.com/sip-protocol/sip-protocol',
      label: 'sip-protocol/sip-protocol'
    },
    {
      icon: BookOpen,
      title: 'Documentation',
      description: 'Guides, API reference, and examples',
      href: 'https://docs.sip-protocol.org',
      label: 'docs.sip-protocol.org'
    },
    {
      icon: Package,
      title: 'npm Package',
      description: 'Install the SDK in your project',
      href: 'https://www.npmjs.com/package/@sip-protocol/sdk',
      label: '@sip-protocol/sdk'
    }
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold">Resources</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {links.map((link, index) => (
            <motion.a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-colors mb-4">
                <link.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {link.title}
                <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
              </h3>
              <p className="mt-1 text-sm text-gray-400">{link.description}</p>
              <p className="mt-2 text-sm text-purple-400 font-mono">{link.label}</p>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Ready to add privacy to your application?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://app.sip-protocol.org/dex"
              className="flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25"
            >
              Try the Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://docs.sip-protocol.org/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 text-base font-medium text-gray-300 border border-gray-700 rounded-lg hover:border-gray-600 hover:text-white transition-colors"
            >
              Get Started
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
