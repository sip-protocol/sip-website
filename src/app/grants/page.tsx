'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  FileText,
  DollarSign,
  Users,
  Github,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { TEST_COUNTS, SDK_VERSION, ACHIEVEMENTS, PROJECT_STATUS } from '@/lib/constants'

export default function GrantsPage() {
  return (
    <>
      <HeroSection />
      <GrantCardsSection />
      <WhyFundSection />
      <TractionSection />
      <QuickLinksSection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <DollarSign className="w-4 h-4" />
              Grant Applications
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold"
          >
            Fund the Future of{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Privacy
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto"
          >
            SIP Protocol is seeking funding to accelerate privacy adoption on Solana
            and the broader cross-chain ecosystem. Help us build the privacy layer
            that Web3 deserves.
          </motion.p>

          {/* Achievement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <a
              href={ACHIEVEMENTS[0].link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30 hover:border-yellow-500/50 transition-colors"
            >
              <span className="text-lg">🏆</span>
              {ACHIEVEMENTS[0].title} — {ACHIEVEMENTS[0].prize}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-center gap-8"
          >
            {[
              { value: TEST_COUNTS.totalDisplay, label: 'Tests Passing' },
              { value: SDK_VERSION.display, label: 'npm Published' },
              { value: `M${PROJECT_STATUS.completedMilestones}`, label: 'Phase 1-3 Complete' },
              { value: '100%', label: 'Open Source' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function GrantCardsSection() {
  const grants = [
    {
      title: 'Solana Audit Subsidy',
      amount: 'Up to $50K',
      description: 'Security audit subsidy for Solana Anchor program (~1,050 LOC Rust).',
      href: '/grants/audit-subsidy',
      color: 'from-emerald-500 to-teal-500',
      borderColor: 'border-emerald-500/20 hover:border-emerald-500/50',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      features: [
        '~1,050 LOC audit scope',
        'Pedersen commitments',
        'ZK proof verification',
        'Pre-mainnet critical',
      ],
    },
    {
      title: 'Superteam Microgrant',
      amount: '$10K',
      description: 'Community building, developer advocacy, and ecosystem awareness.',
      href: '/grants/superteam',
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500/20 hover:border-blue-500/50',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      features: [
        'Community events',
        'Documentation',
        'Hackathon participation',
        'Marketing',
      ],
    },
    {
      title: 'Solana Foundation',
      amount: '$100K',
      description: 'Milestone-based grant for SDK expansion and DeFi integrations.',
      href: '/grants/solana-foundation',
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500/20 hover:border-purple-500/50',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
      features: [
        'Jupiter DEX integration',
        'Mobile wallet SDK',
        'Noir circuits mainnet',
        'Security audit',
      ],
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
            Active Grant Applications
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-gray-400"
          >
            View our pitch decks and support our mission
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {grants.map((grant, index) => (
            <motion.div
              key={grant.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={grant.href}
                className={`block p-8 rounded-2xl bg-gray-900/50 border ${grant.borderColor} transition-all duration-300 hover:scale-[1.02] group`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${grant.bgColor} ${grant.textColor}`}>
                    {grant.amount}
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3">{grant.title}</h3>
                <p className="text-gray-400 mb-6">{grant.description}</p>

                {/* Features */}
                <ul className="space-y-2">
                  {grant.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className={`w-4 h-4 ${grant.textColor}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`mt-6 pt-6 border-t border-gray-800 text-center font-medium bg-gradient-to-r ${grant.color} bg-clip-text text-transparent`}>
                  View Full Pitch →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyFundSection() {
  const reasons = [
    {
      icon: Shield,
      title: 'First Stealth Address SDK',
      description: 'No EIP-5564 implementation exists for Solana. We built it.',
    },
    {
      icon: Zap,
      title: 'Fills Market Vacuum',
      description: 'Elusiv sunset, Light Protocol pivoted. We\'re shipping.',
    },
    {
      icon: Users,
      title: 'Cross-Chain Privacy',
      description: 'NEAR Intents integration with $6B+ volume. Privacy for all chains.',
    },
    {
      icon: FileText,
      title: 'Compliance Ready',
      description: 'Viewing keys enable selective disclosure for institutional use.',
    },
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
              <Sparkles className="w-4 h-4" />
              Gap Advantage
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Why Fund SIP Protocol?
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
              className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-colors"
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
  const traction = [
    { metric: TEST_COUNTS.totalDisplay, label: 'Tests Passing', detail: TEST_COUNTS.detailDisplay },
    { metric: SDK_VERSION.display, label: 'npm Package', detail: SDK_VERSION.full },
    { metric: `M1-M${PROJECT_STATUS.completedMilestones}`, label: 'Milestones', detail: 'Phase 1-3 Complete' },
    { metric: 'Live', label: 'Demo', detail: 'sip-protocol.org' },
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 overflow-hidden">
          {/* Background effect */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
          </div>

          <div className="px-8 py-16 sm:px-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold">Proven Traction</h2>
              <p className="mt-4 text-gray-400">We ship, not vaporware</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {traction.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    {item.metric}
                  </div>
                  <div className="mt-2 text-white font-medium">{item.label}</div>
                  <div className="mt-1 text-sm text-gray-500">{item.detail}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function QuickLinksSection() {
  const links = [
    {
      title: 'Live Demo',
      description: 'Try the privacy toggle',
      href: 'https://app.sip-protocol.org/dex',
      icon: Zap,
      external: true,
    },
    {
      title: 'Documentation',
      description: 'docs.sip-protocol.org',
      href: 'https://docs.sip-protocol.org',
      icon: FileText,
      external: true,
    },
    {
      title: 'GitHub',
      description: 'View source code',
      href: 'https://github.com/sip-protocol/sip-protocol',
      icon: Github,
      external: true,
    },
    {
      title: 'npm Package',
      description: '@sip-protocol/sdk',
      href: 'https://www.npmjs.com/package/@sip-protocol/sdk',
      icon: ExternalLink,
      external: true,
    },
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">Quick Links</h2>
          <p className="mt-4 text-gray-400">Explore the project</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
          {links.map((link, index) => (
            <motion.a
              key={link.title}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <link.icon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="font-medium group-hover:text-purple-400 transition-colors">
                  {link.title}
                  {link.external && <ExternalLink className="w-3 h-3 inline ml-1" />}
                </div>
                <div className="text-sm text-gray-500">{link.description}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
