'use client'

/**
 * T2 Superteam Indonesia Grant — Progress Report
 * Angle D: "Builder Earns, Then Markets"
 *
 * All 4 deliverables shipped. Massive technical overdelivery.
 * Traction gaps acknowledged honestly. T3 = growth phase.
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Shield,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  Code,
  Smartphone,
  Globe,
  Trophy,
  TrendingUp,
  Target,
  ArrowRight,
  Package,
  GitCommit,
  TestTube,
  Rocket,
  AlertTriangle,
  Search,
  Users,
  BookOpen,
  Cpu,
  Layers,
} from 'lucide-react'

export function T2ProgressContent() {
  return (
    <>
      <HeroSection />
      <DeliverablesSection />
      <BeyondScopeSection />
      <MetricsSection />
      <TractionSection />
      <ValidationSection />
      <GrowthPlanSection />
      <EvidenceSection />
    </>
  )
}

// ─── Section 1: Hero ────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/grants/superteam"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Grant Application</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6"
        >
          <CheckCircle2 className="w-4 h-4" />
          T2 Progress Report — All Deliverables Shipped
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
        >
          Built for{' '}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Production
          </span>
          , Not for Demo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg sm:text-xl text-gray-400 max-w-3xl mb-8"
        >
          Superteam Indonesia Grant — Tranche 2 Progress Report. Since T1 payment
          (Jan 30, 2026): 803 commits across 9 repositories, 11,100+ tests passing,
          Solana mainnet program live, and a hackathon win.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-3"
        >
          {[
            { label: 'Grant', value: '$10K USDC' },
            { label: 'T1 Received', value: '$3,000' },
            { label: 'T2 Requesting', value: '$3,000' },
            { label: 'Period', value: 'Jan 30 — Mar 14, 2026' },
          ].map((item) => (
            <div
              key={item.label}
              className="px-4 py-2 rounded-xl bg-gray-900/50 border border-gray-800"
            >
              <span className="text-gray-500 text-sm">{item.label}: </span>
              <span className="text-white font-medium">{item.value}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section 2: Deliverables ────────────────────────────────────────

const deliverables = [
  {
    title: 'Native Solana Privacy SDK',
    description: '@sip-protocol/sdk v0.9.0 — 4 releases since T1, 6,751 SDK tests, stealth addresses + Pedersen commitments + viewing keys',
    evidence: 'https://www.npmjs.com/package/@sip-protocol/sdk',
    evidenceLabel: 'npm',
    stats: '2,485 downloads during grant period',
    icon: Package,
  },
  {
    title: 'Jupiter DEX Integration',
    description: 'Real swap execution with stealth destination routing. VersionedTransaction signing, on-chain confirmation, privacy toggle.',
    evidence: 'https://app.sip-protocol.org/dex/jupiter',
    evidenceLabel: 'Live App',
    stats: 'Mainnet verified — SOL → SKR private swap',
    icon: Layers,
  },
  {
    title: 'Production App',
    description: '14 routes: payments (send/receive/scan/history/disclose), privacy score, compliance dashboard, DEX. 1,186 tests.',
    evidence: 'https://app.sip-protocol.org',
    evidenceLabel: 'Live App',
    stats: '122 test suites, error boundaries, retry logic',
    icon: Globe,
  },
  {
    title: 'Developer Resources',
    description: 'Documentation site, 14 example integrations (target was 3+), 33 blog posts, React hooks package with 543 tests.',
    evidence: 'https://docs.sip-protocol.org',
    evidenceLabel: 'Docs',
    stats: '11+ integration guides',
    icon: BookOpen,
  },
]

function DeliverablesSection() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            Original Deliverables —{' '}
            <span className="text-emerald-400">All Complete</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Every deliverable from the grant application is shipped and live in production.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {deliverables.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 relative"
            >
              <div className="absolute top-4 right-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                  <p className="text-gray-500 text-xs mb-3">{item.stats}</p>
                  <a
                    href={item.evidence}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {item.evidenceLabel}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section 3: Beyond Scope ────────────────────────────────────────

const beyondScope = [
  {
    title: 'Solana Mainnet Program',
    description: '8 instructions: shielded transfers, token transfers, stealth claims, ZK verification. Deployed and live.',
    detail: 'S1PMFspo4W6BYKHWkHNF7kZ3fnqibEXg3LQjxepS9at',
    link: 'https://solscan.io/account/S1PMFspo4W6BYKHWkHNF7kZ3fnqibEXg3LQjxepS9at',
    icon: Rocket,
    color: 'purple',
  },
  {
    title: 'sip-mobile — Seeker Wallet',
    description: 'Native privacy wallet for Solana Seeker. v0.2.3, 1,323 tests, 60 test suites. Pending dApp Store approval.',
    detail: 'iOS + Android + Seeker',
    link: 'https://github.com/sip-protocol/sip-mobile',
    icon: Smartphone,
    color: 'cyan',
  },
  {
    title: 'Sipher — Privacy API',
    description: 'Privacy-as-a-Skill REST API for Solana Agents. 71 endpoints, 573 tests, 17 chain support.',
    detail: 'sipher.sip-protocol.org',
    link: 'https://sipher.sip-protocol.org',
    icon: Cpu,
    color: 'amber',
  },
  {
    title: 'EVM Smart Contracts',
    description: '6 contracts deployed across 7 testnet networks. SIPPrivacy, PedersenVerifier, ZKVerifier, StealthRegistry, SwapRouter, Relayer.',
    detail: '294 Foundry tests, 42 suites',
    link: 'https://github.com/sip-protocol/sip-protocol/tree/main/contracts/sip-ethereum',
    icon: Code,
    color: 'blue',
  },
  {
    title: '1st Place — Graveyard Hackathon',
    description: 'Won Torque sponsor track at Solana Graveyard Hackathon. Privacy middleware + Torque SDK integration.',
    detail: '$750 prize',
    link: 'https://solana.com/graveyard-hack',
    icon: Trophy,
    color: 'yellow',
  },
  {
    title: 'SDK v0.7.3 → v0.9.0',
    description: '4 major releases during grant period. 58 total published versions on npm. Continuous improvement.',
    detail: '2,485 downloads during grant',
    link: 'https://www.npmjs.com/package/@sip-protocol/sdk',
    icon: TrendingUp,
    color: 'emerald',
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
}

function BeyondScopeSection() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            <Rocket className="w-4 h-4" />
            Beyond the Original Proposal
          </div>
          <h2 className="text-3xl font-bold mb-4">
            We Didn&apos;t Stop at the{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Requirements
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            In addition to the 4 deliverables, we shipped production infrastructure
            that wasn&apos;t in the original proposal.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {beyondScope.map((item, index) => {
            const colors = colorMap[item.color]
            return (
              <motion.a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors group"
              >
                <div className={`inline-flex p-3 rounded-xl ${colors.bg} ${colors.border} border mb-4`}>
                  <item.icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                <p className="text-gray-500 text-xs font-mono">{item.detail}</p>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Section 4: By the Numbers ──────────────────────────────────────

const metrics = [
  { value: '803', label: 'Commits', sublabel: 'across 9 repos', icon: GitCommit },
  { value: '11,100+', label: 'Tests Passing', sublabel: 'ecosystem-wide', icon: TestTube },
  { value: '4', label: 'SDK Releases', sublabel: 'v0.7.4 → v0.9.0', icon: Package },
  { value: '9', label: 'Active Repos', sublabel: 'under sip-protocol/', icon: Code },
  { value: '7', label: 'EVM Networks', sublabel: 'contracts deployed', icon: Globe },
  { value: '2,485', label: 'npm Downloads', sublabel: 'Jan 30 — Mar 14', icon: TrendingUp },
  { value: '+34,383', label: 'Lines Added', sublabel: 'core repo only', icon: Layers },
  { value: '294', label: 'Foundry Tests', sublabel: '42 Solidity suites', icon: Shield },
]

function MetricsSection() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">By the Numbers</h2>
          <p className="text-gray-400">
            Since T1 payment (January 30, 2026)
          </p>
        </motion.div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {metrics.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-2xl bg-gray-900/50 border border-gray-800 text-center"
            >
              <item.icon className="w-5 h-5 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {item.value}
              </div>
              <div className="text-sm text-white mt-1">{item.label}</div>
              <div className="text-xs text-gray-500">{item.sublabel}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section 5: Traction — Honest Assessment ────────────────────────

const tractionMetrics = [
  { metric: 'X Followers', target: '500', actual: '119', status: 'below' as const },
  { metric: 'GitHub Stars', target: '60', actual: '3', status: 'below' as const },
  { metric: 'npm Downloads/week', target: '800', actual: '~500', status: 'near' as const },
  { metric: 'Community Forum', target: '250 members', actual: 'Pivoted to blog + docs', status: 'pivoted' as const },
  { metric: 'Blog Views/month', target: '2,500', actual: '184', status: 'below' as const },
]

const statusColors = {
  below: 'text-red-400',
  near: 'text-yellow-400',
  pivoted: 'text-blue-400',
}

function TractionSection() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
            <AlertTriangle className="w-4 h-4" />
            Honest Assessment
          </div>
          <h2 className="text-3xl font-bold mb-4">Traction Metrics</h2>
          <p className="text-gray-400 text-lg max-w-3xl">
            Social proof metrics are below the original targets. Here&apos;s what happened
            and why.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto mb-8"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Metric</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">T2 Target</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actual</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {tractionMetrics.map((item) => (
                <tr key={item.metric} className="border-b border-gray-800/50">
                  <td className="py-3 px-4 text-white">{item.metric}</td>
                  <td className="py-3 px-4 text-gray-400">{item.target}</td>
                  <td className="py-3 px-4 font-medium text-white">{item.actual}</td>
                  <td className={`py-3 px-4 text-sm font-medium capitalize ${statusColors[item.status]}`}>
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
        >
          <h3 className="text-lg font-semibold mb-3">Why the Gap?</h3>
          <p className="text-gray-400 leading-relaxed">
            As a solo founder, I had to choose: prioritize social proof metrics or
            build production infrastructure that actually works on mainnet. I chose to
            build. The Solana program is live on mainnet. The mobile wallet runs on
            Seeker hardware. The SDK has 11,100+ tests. Private swaps are verified
            end-to-end on mainnet. Now that the foundation is solid, T3 shifts entirely
            to growth and distribution.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section 6: External Validation ─────────────────────────────────

const validations = [
  {
    title: '1st Place — Solana Graveyard Hackathon',
    description: 'Won the Torque sponsor track ($750). Privacy middleware evaluated by independent judges.',
    icon: Trophy,
  },
  {
    title: '2,485 npm Downloads',
    description: 'Developers downloading and using @sip-protocol/sdk without any paid promotion.',
    icon: Package,
  },
  {
    title: 'Organic Search Discovery',
    description: 'Blog content found via DuckDuckGo (55%), Bing (25%), ChatGPT (5%), Google. Zero ad spend.',
    icon: Search,
  },
  {
    title: 'Mainnet Program Live',
    description: 'Deployed to Solana mainnet-beta. Real transactions, real privacy, real usage.',
    icon: Shield,
  },
]

function ValidationSection() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">External Validation</h2>
          <p className="text-gray-400 text-lg">
            Third-party proof that the work is real and valuable.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {validations.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <item.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section 7: T3 Growth Plan ──────────────────────────────────────

const growthActions = [
  {
    action: 'Superteam community amplification',
    detail: 'Seeker wallet launch + SDK awareness via Superteam Indonesia channels',
    timeline: 'Apr 2026',
    icon: Users,
  },
  {
    action: '3 SDK tutorials + 5 X threads',
    detail: 'Step-by-step integration guides for Solana developers',
    timeline: 'By Apr 15',
    icon: BookOpen,
  },
  {
    action: '2 conference talk proposals',
    detail: 'Submit to Solana Hacker House and Breakpoint events',
    timeline: 'Apr 2026',
    icon: Target,
  },
  {
    action: 'Wallet integration outreach',
    detail: 'SDK integration proposals to Phantom, Backpack, Solflare, Glow, Ultimate',
    timeline: 'Apr–May 2026',
    icon: Smartphone,
  },
  {
    action: 'Developer workshop',
    detail: 'Host with Superteam Indonesia — target 20+ attendees',
    timeline: 'May 2026',
    icon: Code,
  },
  {
    action: 'Bug bounty program',
    detail: 'GitHub-based program to drive engagement, stars, and security review',
    timeline: 'Apr 2026',
    icon: Shield,
  },
]

function GrowthPlanSection() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
            <ArrowRight className="w-4 h-4" />
            T3: Growth Phase
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Foundation Built.{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Now We Grow.
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            With production infrastructure solid and mainnet-verified, T3 shifts entirely
            to growth, community, and ecosystem partnerships.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {growthActions.map((item, index) => (
            <motion.div
              key={item.action}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-2xl bg-gray-900/50 border border-gray-800"
            >
              <div className="flex items-center gap-3 mb-3">
                <item.icon className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-medium text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                  {item.timeline}
                </span>
              </div>
              <h3 className="text-base font-semibold mb-1">{item.action}</h3>
              <p className="text-gray-400 text-sm">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section 8: Live Evidence ───────────────────────────────────────

const evidenceLinks = [
  { label: 'Production App', url: 'https://app.sip-protocol.org', type: 'Live' },
  { label: 'SDK on npm', url: 'https://www.npmjs.com/package/@sip-protocol/sdk', type: 'npm' },
  { label: 'Documentation', url: 'https://docs.sip-protocol.org', type: 'Live' },
  { label: 'Blog', url: 'https://blog.sip-protocol.org', type: 'Live' },
  { label: 'Sipher API', url: 'https://sipher.sip-protocol.org', type: 'Live' },
  { label: 'Core GitHub', url: 'https://github.com/sip-protocol/sip-protocol', type: 'GitHub' },
  { label: 'Mobile GitHub', url: 'https://github.com/sip-protocol/sip-mobile', type: 'GitHub' },
  { label: 'Solana Program', url: 'https://solscan.io/account/S1PMFspo4W6BYKHWkHNF7kZ3fnqibEXg3LQjxepS9at', type: 'Solscan' },
  { label: 'EVM Contracts (Sepolia)', url: 'https://sepolia.etherscan.io/address/0x1FED19684dC108304960db2818CF5a961d28405E', type: 'Etherscan' },
]

function EvidenceSection() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Live Evidence</h2>
          <p className="text-gray-400">
            Everything is live, public, and verifiable.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Resource</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Link</th>
              </tr>
            </thead>
            <tbody>
              {evidenceLinks.map((item) => (
                <tr key={item.label} className="border-b border-gray-800/50 hover:bg-gray-900/30">
                  <td className="py-3 px-4 text-white">{item.label}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {item.url.replace('https://', '')}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm">
            SIP Protocol — The Privacy Standard for Web3
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Grant: Superteam Indonesia / Solana Foundation | T2 Progress Report | March 2026
          </p>
        </motion.div>
      </div>
    </section>
  )
}
