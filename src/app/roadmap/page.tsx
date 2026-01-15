'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { TEST_COUNTS, PROJECT_STATUS, ACHIEVEMENTS } from '@/lib/constants'
import {
  ALL_PHASES,
  COMPETITORS,
  AMOUNT_CORRELATION_ATTACK,
  type Phase,
  type Milestone,
} from '@/lib/data/roadmap'
import {
  Shield,
  Zap,
  CheckCircle2,
  Circle,
  Target,
  Layers,
  Globe,
  Code,
  Lock,
  Network,
  ArrowRight,
  Github,
  ExternalLink,
  Sparkles,
  Trophy,
  TrendingUp,
  Users,
  Blocks,
  Building,
  AlertTriangle,
  Check,
  X,
} from 'lucide-react'

export default function RoadmapPage() {
  return (
    <>
      <HeroSection />
      <CurrentPhaseSection />
      <PhaseSection phase={ALL_PHASES[0]} />
      <PhaseSection phase={ALL_PHASES[1]} />
      <PhaseSection phase={ALL_PHASES[2]} />
      <PhaseSection phase={ALL_PHASES[3]} />
      <PhaseSection phase={ALL_PHASES[4]} />
      <CompetitiveSection />
      <VisionSection />
      <CTASection />
    </>
  )
}

function HeroSection() {
  const achievement = ACHIEVEMENTS[0]

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Achievement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a
              href={achievement.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30 hover:border-yellow-500/50 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              {achievement.title} — {achievement.prize}
            </a>
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto"
          >
            SIP Protocol is building the privacy standard for Web3 — like HTTPS for the internet.
            22 milestones across 5 phases. 15 milestones complete.
          </motion.p>

          {/* Phase Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            {ALL_PHASES.map((phase, index) => (
              <div
                key={phase.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                  phase.status === 'complete'
                    ? 'bg-green-500/10 border border-green-500/20'
                    : phase.status === 'active'
                    ? 'bg-blue-500/10 border border-blue-500/30 animate-pulse'
                    : 'bg-gray-800/50 border border-gray-700'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    phase.status === 'complete'
                      ? 'bg-green-500'
                      : phase.status === 'active'
                      ? 'bg-blue-500'
                      : 'bg-gray-600'
                  }`}
                />
                <span
                  className={`text-sm ${
                    phase.status === 'complete'
                      ? 'text-green-400'
                      : phase.status === 'active'
                      ? 'text-blue-400'
                      : 'text-gray-500'
                  }`}
                >
                  Phase {phase.id}
                </span>
                {phase.status === 'complete' && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CurrentPhaseSection() {
  const activePhase = ALL_PHASES.find((p) => p.status === 'active')
  const currentMilestone = activePhase?.milestones.find((m) => m.status === 'in-progress')

  if (!activePhase) return null

  return (
    <section className="py-16 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                  Currently Active
                </span>
                <span className="text-sm text-gray-500">
                  Phase {activePhase.id} of {ALL_PHASES.length}
                </span>
              </div>
              <h2 className="text-2xl font-bold">
                Phase {activePhase.id}: {activePhase.name}
              </h2>
              <p className="mt-2 text-gray-400">{activePhase.subtitle}</p>
              {currentMilestone && (
                <p className="mt-2 text-sm text-blue-400">
                  Current: {currentMilestone.id} — {currentMilestone.title}
                </p>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {currentMilestone?.id || 'M16'}
                </div>
                <div className="text-xs text-gray-500">Current</div>
              </div>
              <div className="h-12 w-px bg-gray-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {TEST_COUNTS.totalDisplay}
                </div>
                <div className="text-xs text-gray-500">Tests</div>
              </div>
              <div className="h-12 w-px bg-gray-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {PROJECT_STATUS.completedMilestones}
                </div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{
                  width: `${(PROJECT_STATUS.completedMilestones / PROJECT_STATUS.totalMilestones) * 100}%`,
                }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>
                {PROJECT_STATUS.completedMilestones} of {PROJECT_STATUS.totalMilestones}{' '}
                milestones complete
              </span>
              <span>
                {Math.round(
                  (PROJECT_STATUS.completedMilestones / PROJECT_STATUS.totalMilestones) * 100
                )}
                %
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function PhaseSection({ phase }: { phase: Phase }) {
  const getPhaseIcon = (id: number) => {
    switch (id) {
      case 1:
        return Sparkles
      case 2:
        return Layers
      case 3:
        return Users
      case 4:
        return TrendingUp
      case 5:
        return Building
      default:
        return Globe
    }
  }

  const getPhaseColors = (status: Phase['status']) => {
    switch (status) {
      case 'complete':
        return {
          badge: 'bg-green-500/10 text-green-400 border-green-500/20',
          border: 'border-green-500/30',
          icon: 'bg-green-500/10 text-green-400',
          card: 'hover:border-green-500/30',
        }
      case 'active':
        return {
          badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          border: 'border-blue-500/30',
          icon: 'bg-blue-500/10 text-blue-400',
          card: 'hover:border-blue-500/30',
        }
      default:
        return {
          badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          border: 'border-gray-700',
          icon: 'bg-purple-500/10 text-purple-400',
          card: 'hover:border-purple-500/30',
        }
    }
  }

  const PhaseIcon = getPhaseIcon(phase.id)
  const colors = getPhaseColors(phase.status)

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3"
          >
            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${colors.badge}`}
            >
              <PhaseIcon className="w-4 h-4" />
              Phase {phase.id}: {phase.name}
            </span>
            {phase.status === 'complete' && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                100% Complete
              </span>
            )}
            {phase.status === 'active' && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 animate-pulse">
                In Progress
              </span>
            )}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            {phase.subtitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            {phase.period}
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800" />

            <div className="space-y-6">
              {phase.milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-16"
                >
                  {/* Status indicator */}
                  <div
                    className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      milestone.status === 'complete'
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : milestone.status === 'in-progress'
                        ? 'bg-blue-500/20 border-2 border-blue-500 animate-pulse'
                        : 'bg-gray-800 border-2 border-gray-700'
                    }`}
                  >
                    {milestone.status === 'complete' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : milestone.status === 'in-progress' ? (
                      <Circle className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`p-6 rounded-2xl border ${
                      milestone.status === 'in-progress'
                        ? 'bg-blue-950/20 border-blue-500/30'
                        : milestone.status === 'complete'
                        ? 'bg-gray-900/50 border-green-500/20'
                        : 'bg-gray-900/50 border-gray-800'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span
                        className={`text-xs font-mono px-2 py-1 rounded ${
                          milestone.status === 'complete'
                            ? 'bg-green-500/20 text-green-400'
                            : milestone.status === 'in-progress'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-800 text-gray-500'
                        }`}
                      >
                        {milestone.id}
                      </span>
                      <h3 className="font-semibold">{milestone.title}</h3>
                      {milestone.status === 'in-progress' && (
                        <span className="text-xs text-blue-400">In Progress</span>
                      )}
                      {milestone.githubIssue && (
                        <a
                          href={`https://github.com/sip-protocol/sip-protocol/issues/${milestone.githubIssue}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-500 hover:text-gray-400"
                        >
                          #{milestone.githubIssue}
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{milestone.description}</p>
                    {milestone.highlights && milestone.highlights.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {milestone.highlights.map((highlight, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}
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

function CompetitiveSection() {
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
            <Shield className="w-4 h-4" />
            Competitive Advantage
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Cryptographic Privacy vs Pool Mixing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            SIP uses Pedersen commitments and stealth addresses — cryptographic privacy, not
            statistical anonymity from pool mixing.
          </motion.p>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-4 px-4 text-left font-medium text-gray-400">Feature</th>
                {COMPETITORS.map((c) => (
                  <th
                    key={c.name}
                    className={`py-4 px-4 text-center font-medium ${
                      c.name === 'SIP Protocol' ? 'text-purple-400' : 'text-gray-400'
                    }`}
                  >
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800/50">
                <td className="py-4 px-4 text-gray-300">Chain Support</td>
                {COMPETITORS.map((c) => (
                  <td key={c.name} className="py-4 px-4 text-center text-gray-400">
                    {c.chain}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800/50">
                <td className="py-4 px-4 text-gray-300">Privacy Method</td>
                {COMPETITORS.map((c) => (
                  <td key={c.name} className="py-4 px-4 text-center text-gray-400">
                    {c.privacyMethod}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800/50">
                <td className="py-4 px-4 text-gray-300">Amount Hidden</td>
                {COMPETITORS.map((c) => (
                  <td key={c.name} className="py-4 px-4 text-center">
                    {c.amountHidden ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800/50">
                <td className="py-4 px-4 text-gray-300">Viewing Keys</td>
                {COMPETITORS.map((c) => (
                  <td key={c.name} className="py-4 px-4 text-center">
                    {c.viewingKeys ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800/50">
                <td className="py-4 px-4 text-gray-300">Cross-Chain</td>
                {COMPETITORS.map((c) => (
                  <td key={c.name} className="py-4 px-4 text-center">
                    {c.crossChain ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800/50">
                <td className="py-4 px-4 text-gray-300">Amount Correlation</td>
                {COMPETITORS.map((c) => (
                  <td key={c.name} className="py-4 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        c.amountCorrelation === 'protected'
                          ? 'bg-green-500/20 text-green-400'
                          : c.amountCorrelation === 'partial'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {c.amountCorrelation === 'protected'
                        ? 'Protected'
                        : c.amountCorrelation === 'partial'
                        ? 'Partial'
                        : 'Vulnerable'}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-300">Regulatory Risk</td>
                {COMPETITORS.map((c) => (
                  <td key={c.name} className="py-4 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        c.regulatoryRisk === 'low'
                          ? 'bg-green-500/20 text-green-400'
                          : c.regulatoryRisk === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {c.regulatoryRisk.toUpperCase()}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* Amount Correlation Attack Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl bg-orange-900/20 border border-orange-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-400">{AMOUNT_CORRELATION_ATTACK.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{AMOUNT_CORRELATION_ATTACK.description}</p>
              <p className="mt-2 text-sm text-purple-400">
                <strong>SIP Advantage:</strong> {AMOUNT_CORRELATION_ATTACK.sipAdvantage}
              </p>
            </div>
          </div>
        </motion.div>
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
              Settlement-agnostic. One toggle to shield any transaction. The universal privacy
              standard for Web3.
            </p>
          </div>

          {/* Architecture Stack */}
          <div className="mt-8 p-6 rounded-2xl bg-gray-900/50 border border-gray-800 font-mono text-sm">
            <div className="space-y-3 text-center">
              <div className="p-3 rounded-lg bg-gray-800/50 text-gray-400">
                Applications (Wallets, DEXs, DAOs, Payments)
              </div>
              <div className="text-gray-600">↓</div>
              <div className="p-3 rounded-lg bg-purple-900/30 border border-purple-500/30 text-purple-400 font-semibold">
                SIP PROTOCOL — The Privacy Standard
              </div>
              <div className="text-gray-600">↓</div>
              <div className="p-3 rounded-lg bg-gray-800/50 text-gray-400">
                Settlement (NEAR Intents, Same-Chain, Mina, Zcash Pool)
              </div>
              <div className="text-gray-600">↓</div>
              <div className="p-3 rounded-lg bg-gray-800/50 text-gray-400">
                Blockchains (Solana, ETH, NEAR, Base, Arbitrum, BTC, L2s, More)
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
            Help us build the privacy standard for Web3. Try the demo, read the docs, or
            contribute on GitHub.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="https://app.sip-protocol.org/dex"
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

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <a
              href="https://docs.sip-protocol.org"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              docs.sip-protocol.org
            </a>
            <a
              href="https://www.npmjs.com/package/@sip-protocol/sdk"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              npm: @sip-protocol/sdk
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
