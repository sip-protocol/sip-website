'use client'

/**
 * Solana Foundation Grant Pitch Page
 * Components split into /components/grants/solana-foundation/ for better maintainability
 */

import {
  HeroSection,
  VisionSection,
  ProblemSection,
  SolutionSection,
  WhySolanaSection,
  TractionSection,
} from '@/components/grants/solana-foundation'

// Remaining sections (to be split in future refactor)
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
} from 'lucide-react'
import { TEST_COUNTS, SDK_VERSION } from '@/lib/constants'

export default function SolanaFoundationPitchPage() {
  return (
    <>
      <HeroSection />
      <VisionSection />
      <ProblemSection />
      <SolutionSection />
      <WhySolanaSection />
      <TractionSection />
      <CompetitorSection />
      <ArchitectureSection />
      <RoadmapSection />
      <MilestonesSection />
      <BudgetSection />
      <CTASection />
    </>
  )
}

// TODO: Split these remaining sections into separate component files
// Located in /components/grants/solana-foundation/

function CompetitorSection() {
  const competitors = [
    { name: 'Elusiv', status: 'Sunset', statusColor: 'text-red-400', sip: 'We\'re shipping' },
    { name: 'Light Protocol', status: 'Pivoted', statusColor: 'text-yellow-400', sip: 'We\'re privacy-focused' },
    { name: 'Wormhole', status: 'No privacy', statusColor: 'text-gray-400', sip: 'We add privacy layer' },
    { name: 'Aztec', status: 'ETH only', statusColor: 'text-purple-400', sip: 'We\'re multi-chain' },
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
            SIP vs Arcium: Different Layers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Arcium is confidential compute infrastructure. SIP is privacy middleware. We complement, not compete.
          </motion.p>
        </div>

        {/* Arcium vs SIP Deep Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-950/30 to-purple-950/30 border border-blue-500/20">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Arcium */}
              <div className="p-6 rounded-xl bg-blue-950/30 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Blocks className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-400">Arcium</h3>
                    <span className="text-xs text-gray-500">Confidential Compute</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    MPC network for confidential computation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    Solana-native infrastructure layer
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    Focuses on compute privacy (processing)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    Requires apps to integrate MPC
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">⚠</span>
                    Testnet only (mainnet TBD)
                  </li>
                </ul>
              </div>

              {/* SIP */}
              <div className="p-6 rounded-xl bg-purple-950/30 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-400">SIP Protocol</h3>
                    <span className="text-xs text-gray-500">Privacy Middleware</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    Transaction privacy (stealth addresses, commitments)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    Chain-agnostic middleware layer
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    Focuses on transfer privacy (sending/receiving)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    Simple SDK integration (&ldquo;one toggle&rdquo;)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    Live SDK, {TEST_COUNTS.totalDisplay} tests, npm published
                  </li>
                </ul>
              </div>
            </div>

            {/* Complement Message */}
            <div className="mt-6 p-4 rounded-lg bg-gray-900/50 border border-gray-700 text-center">
              <p className="text-sm text-gray-400">
                <span className="text-white font-medium">They can work together:</span> Arcium for confidential compute, SIP for transaction privacy.
                <br />
                Future integration possible: Use Arcium MPC for SIP&apos;s proof generation.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Other Competitors Table */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-400">Other Privacy Solutions</h3>
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
                    <td className="px-6 py-4 text-green-400">{comp.sip}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Differentiator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 max-w-3xl mx-auto text-center"
        >
          <div className="p-6 rounded-xl bg-green-950/20 border border-green-500/20">
            <p className="text-green-400 font-medium">
              Key Differentiator: SIP is the ONLY cross-chain privacy middleware with compliance features (viewing keys).
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Arcium = Infrastructure | SIP = Application Layer | We complement the ecosystem.
            </p>
          </div>
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
            Hybrid Architecture
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Technical Architecture
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            SIP combines settlement flexibility with proof composition for a unique privacy standard.
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {/* Settlement Aggregator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-purple-950/20 border border-purple-500/20"
          >
            <div className="text-purple-400 font-semibold text-lg mb-4">Settlement Aggregator</div>
            <p className="text-gray-400 mb-4">One privacy layer, settle anywhere</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Unified API regardless of backend
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                NEAR Intents → Mina → Direct Chain
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Creates standardization & switching costs
              </li>
            </ul>
            <div className="mt-4 px-3 py-1 bg-purple-500/10 rounded-full inline-block text-xs text-purple-300">
              Core Value
            </div>
          </motion.div>

          {/* Proof Aggregator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-pink-950/20 border border-pink-500/20"
          >
            <div className="text-pink-400 font-semibold text-lg mb-4">Proof Aggregator</div>
            <p className="text-gray-400 mb-4">Compose proofs for unique capabilities</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                Zcash privacy + Mina verification
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                Noir validity proofs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                Technical moat, hard to replicate
              </li>
            </ul>
            <div className="mt-4 px-3 py-1 bg-pink-500/10 rounded-full inline-block text-xs text-pink-300">
              Technical Moat
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
      phase: 'Phase 1',
      title: 'Foundation',
      status: 'current',
      milestones: 'M1-M8',
      progress: 95,
      items: ['SDK Core', 'Stealth Addresses', 'NEAR Integration', 'Demo Launch'],
    },
    {
      phase: 'Phase 2',
      title: 'Standard',
      status: 'upcoming',
      milestones: 'M9-M12',
      progress: 0,
      items: ['Wallet Integrations', 'DEX Partnerships', 'Multi-chain Settlement'],
    },
    {
      phase: 'Phase 3',
      title: 'Ecosystem',
      status: 'future',
      milestones: 'M13-M15',
      progress: 0,
      items: ['Proof Aggregation', 'Enterprise Features', 'Protocol Standard'],
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
                    : 'bg-gray-900/50 border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-mono px-2 py-1 rounded ${
                    phase.status === 'current'
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-gray-800 text-gray-500'
                  }`}>
                    {phase.milestones}
                  </span>
                  {phase.status === 'current' && (
                    <span className="text-xs text-indigo-400 animate-pulse">● Active</span>
                  )}
                </div>
                <h3 className={`text-lg font-semibold mb-1 ${
                  phase.status === 'current' ? 'text-indigo-400' : 'text-gray-400'
                }`}>
                  {phase.phase}: {phase.title}
                </h3>
                {phase.progress > 0 && (
                  <div className="mb-3">
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{phase.progress}% complete</span>
                  </div>
                )}
                <ul className="space-y-1 mt-3">
                  {phase.items.map((item) => (
                    <li key={item} className="text-sm text-gray-500 flex items-center gap-2">
                      <span className={phase.status === 'current' ? 'text-indigo-400' : 'text-gray-600'}>•</span>
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
      id: 'M1',
      title: 'Jupiter DEX Integration',
      description: 'Integrate SIP privacy layer with Jupiter aggregator for private swaps',
      budget: '$25,000',
      timeline: 'Month 1-2',
      icon: TrendingUp,
    },
    {
      id: 'M2',
      title: 'Mobile Wallet SDK',
      description: 'React Native SDK for mobile wallet integration (iOS & Android)',
      budget: '$20,000',
      timeline: 'Month 2-3',
      icon: Wallet,
    },
    {
      id: 'M3',
      title: 'Noir Circuits Mainnet',
      description: 'Deploy production ZK circuits to mainnet with verifier contracts',
      budget: '$30,000',
      timeline: 'Month 3-4',
      icon: Blocks,
    },
    {
      id: 'M4',
      title: 'Developer Docs & Tutorials',
      description: 'Comprehensive documentation, video tutorials, and example projects',
      budget: '$10,000',
      timeline: 'Month 4',
      icon: FileText,
    },
    {
      id: 'M5',
      title: 'Third-Party Security Audit',
      description: 'Independent security audit by reputable firm with public disclosure',
      budget: '$15,000',
      timeline: 'Month 5',
      icon: ShieldCheck,
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
            Milestones
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            6-Month Deliverables
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
    { category: 'Noir Circuits Mainnet', amount: 30000, color: 'bg-purple-500' },
    { category: 'Jupiter DEX Integration', amount: 25000, color: 'bg-blue-500' },
    { category: 'Mobile Wallet SDK', amount: 20000, color: 'bg-green-500' },
    { category: 'Security Audit', amount: 15000, color: 'bg-yellow-500' },
    { category: 'Docs & Tutorials', amount: 10000, color: 'bg-pink-500' },
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
              Help us establish the privacy standard for Web3, starting with Solana.
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
