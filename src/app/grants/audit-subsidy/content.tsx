'use client'

/**
 * Solana Audit Subsidy Program - Cohort V Application Page
 * Created Jan 2026
 *
 * Focus: Security audit for Solana Anchor program
 * Deadline: February 7, 2026
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Shield,
  Zap,
  ArrowLeft,
  FileText,
  Trophy,
  AlertTriangle,
  Eye,
  Lock,
  Github,
  ExternalLink,
  Target,
  Code,
  Terminal,
  ShieldCheck,
  FileCode,
  Bug,
  Calendar,
  Award,
} from 'lucide-react'
import { TEST_COUNTS, SDK_VERSION } from '@/lib/constants'
import { FounderProfile } from '@/components/founder-profile'
import type { FounderData } from '@/lib/founder-data'

interface AuditSubsidyContentProps {
  founderData: FounderData
}

export function AuditSubsidyContent({ founderData }: AuditSubsidyContentProps) {
  return (
    <>
      <HeroSection />
      <AchievementSection />
      <WhyAuditSection />
      <AuditScopeSection />
      <TechnologySection />
      <CompetitiveAdvantageSection />
      <TractionSection />
      <TimelineSection />
      <FounderSection founderData={founderData} />
      <LinksSection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
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
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              Solana Security Subsidy Program
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Calendar className="w-4 h-4" />
              Cohort V - Feb 2026
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
            Privacy Infrastructure for Solana
          </motion.p>

          {/* Sub-tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-2 text-lg text-gray-500"
          >
            Stealth addresses + Pedersen commitments + Viewing keys for compliance
          </motion.p>

          {/* Audit Scope Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 inline-flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-gray-400">Audit Scope</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                ~1,050 LOC
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400">Rust / Anchor</span>
            </div>
            <div className="text-sm text-gray-500">
              Solana program for shielded transfers with ZK verification
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
              href="https://github.com/sip-protocol/sip-protocol/tree/main/programs/sip-privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all font-medium flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              View Audit Scope
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
              href="https://app.sip-protocol.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-gray-300 border border-gray-700 rounded-lg hover:text-white hover:border-gray-600 transition-all font-medium"
            >
              Try Live App
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
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/30 mb-4"
              >
                <Trophy className="w-8 h-8 text-yellow-950" />
              </motion.div>

              <div className="text-xs font-semibold tracking-[0.2em] uppercase text-yellow-500/80 mb-2">
                Validated
              </div>

              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mx-auto mb-3" />

              <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent mb-2">
                Zypherpunk Hackathon Winner
              </h3>

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

function WhyAuditSection() {
  const reasons = [
    {
      icon: Shield,
      title: 'Handles Real Value',
      description: 'The Solana program processes shielded transfers of SOL and SPL tokens. User funds must be protected.',
    },
    {
      icon: Lock,
      title: 'Cryptographic Complexity',
      description: 'Pedersen commitments, stealth addresses, and ZK proof verification require expert review.',
    },
    {
      icon: Bug,
      title: 'Pre-Mainnet Critical Path',
      description: 'Security audit is the gating item for mainnet deployment. No audit = no mainnet.',
    },
    {
      icon: Award,
      title: 'Institutional Trust',
      description: 'Audited code unlocks enterprise adoption. DAOs and institutions require audit reports.',
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
            Why Audit Matters
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Security is Non-Negotiable
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Our program handles user funds with complex cryptography. Professional audit is mandatory before mainnet.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-emerald-500/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <reason.icon className="w-6 h-6 text-emerald-400" />
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

function AuditScopeSection() {
  const scopeItems = [
    {
      file: 'lib.rs',
      loc: '~650',
      description: 'Main program: initialize, shielded_transfer, claim_transfer, admin functions',
      critical: true,
    },
    {
      file: 'commitment/mod.rs',
      loc: '~200',
      description: 'Pedersen commitment verification and format validation',
      critical: true,
    },
    {
      file: 'zk_verifier/mod.rs',
      loc: '~200',
      description: 'ZK proof deserialization and verification logic',
      critical: true,
    },
  ]

  const instructions = [
    { name: 'initialize', risk: 'Low', description: 'One-time config setup with authority' },
    { name: 'shielded_transfer', risk: 'Critical', description: 'SOL/SPL transfers with hidden amounts' },
    { name: 'shielded_token_transfer', risk: 'Critical', description: 'SPL token variant with mint validation' },
    { name: 'claim_transfer', risk: 'Critical', description: 'Recipient claims with nullifier + ZK proof' },
    { name: 'claim_token_transfer', risk: 'Critical', description: 'SPL token claim variant' },
    { name: 'verify_commitment', risk: 'Medium', description: 'On-chain Pedersen verification utility' },
    { name: 'verify_zk_proof', risk: 'High', description: 'ZK proof verification for Noir proofs' },
    { name: 'set_paused / update_fee', risk: 'Low', description: 'Admin functions with authority check' },
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          >
            <FileCode className="w-4 h-4" />
            Audit Scope
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            ~1,050 Lines of Rust
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Focused scope: Solana Anchor program for privacy-preserving transfers
          </motion.p>
        </div>

        {/* Files Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-12"
        >
          <h3 className="text-lg font-semibold mb-4">Source Files</h3>
          <div className="overflow-hidden rounded-xl border border-gray-800">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/80">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">File</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-400">LOC</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {scopeItems.map((item) => (
                  <tr key={item.file} className="bg-gray-900/30">
                    <td className="px-6 py-4">
                      <code className="text-emerald-400 text-sm">{item.file}</code>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-white font-medium">{item.loc}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{item.description}</td>
                  </tr>
                ))}
                <tr className="bg-emerald-950/30">
                  <td className="px-6 py-4 font-semibold text-emerald-400">Total</td>
                  <td className="px-6 py-4 text-center font-bold text-white">~1,050</td>
                  <td className="px-6 py-4 text-sm text-gray-400">Solana Anchor program</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Instructions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="text-lg font-semibold mb-4">Program Instructions</h3>
          <div className="overflow-hidden rounded-xl border border-gray-800">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/80">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Instruction</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-400">Risk</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {instructions.map((item) => (
                  <tr key={item.name} className="bg-gray-900/30">
                    <td className="px-6 py-3">
                      <code className="text-white text-sm">{item.name}</code>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.risk === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        item.risk === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        item.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {item.risk}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-400">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* GitHub Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <a
            href="https://github.com/sip-protocol/sip-protocol/tree/main/programs/sip-privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Github className="w-4 h-4" />
            View full source on GitHub
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function TechnologySection() {
  const techStack = [
    {
      icon: Shield,
      title: 'Stealth Addresses',
      description: 'EIP-5564 style one-time recipient addresses. Prevents linkability between transactions.',
    },
    {
      icon: Lock,
      title: 'Pedersen Commitments',
      description: 'C = v*G + r*H hides amounts cryptographically. Any amount, no fixed pools.',
    },
    {
      icon: Eye,
      title: 'Viewing Keys',
      description: 'Selective disclosure for compliance. Auditors can verify without compromising user privacy.',
    },
    {
      icon: Zap,
      title: 'Noir ZK Proofs',
      description: 'Funding, validity, and fulfillment proofs. Browser-compatible WASM verification.',
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
            <Terminal className="w-4 h-4" />
            Technology
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Cryptographic Privacy Stack
          </motion.h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-purple-950/20 border border-purple-500/20"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <tech.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{tech.title}</h3>
              <p className="text-sm text-gray-400">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CompetitiveAdvantageSection() {
  const comparison = [
    { feature: 'Privacy Method', sip: 'Cryptographic (Pedersen)', other: 'Pool Mixing' },
    { feature: 'Amount Privacy', sip: 'Hidden (commitments)', other: 'Visible on-chain' },
    { feature: 'Viewing Keys', sip: 'Native support', other: 'None' },
    { feature: 'Amount Correlation', sip: 'Impossible', other: 'Vulnerable' },
    { feature: 'Pool Constraints', sip: 'Any amount', other: 'Fixed sizes' },
    { feature: 'Regulatory Risk', sip: 'Low (compliance-first)', other: 'High (mixer)' },
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
            Differentiation
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Why SIP, Not Mixers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Pool-based privacy exposes amounts. Cryptographic privacy hides everything.
          </motion.p>
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
                <th className="px-6 py-4 text-center text-sm font-medium text-emerald-400">SIP Protocol</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Pool Mixers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {comparison.map((row) => (
                <tr key={row.feature} className="bg-gray-900/30">
                  <td className="px-6 py-4 text-sm text-gray-300">{row.feature}</td>
                  <td className="px-6 py-4 text-sm text-center text-emerald-400">{row.sip}</td>
                  <td className="px-6 py-4 text-sm text-center text-gray-500">{row.other}</td>
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
    { value: TEST_COUNTS.totalDisplay, label: 'Tests Passing', detail: 'SDK + React + CLI + API' },
    { value: SDK_VERSION.display, label: 'npm Published', detail: '@sip-protocol/sdk' },
    { value: 'Live', label: 'App Deployed', detail: 'app.sip-protocol.org' },
    { value: 'M16', label: 'Phase 4 Active', detail: 'Solana Same-Chain' },
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/20 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
          </div>

          <div className="px-8 py-16 sm:px-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold">Proven Traction</h2>
              <p className="mt-4 text-gray-400">Production-ready code, not vaporware</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    {item.value}
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

function TimelineSection() {
  const timeline = [
    {
      date: 'Feb 2026',
      title: 'Devnet Deploy',
      description: 'sip-privacy program deployed to Solana devnet with ZK verification',
      status: 'current',
    },
    {
      date: 'Mar 2026',
      title: 'Testnet Beta',
      description: 'Public beta with Helius DAS integration and Jupiter DEX',
      status: 'upcoming',
    },
    {
      date: 'Apr 2026',
      title: 'Security Audit',
      description: 'External audit via Solana Security Subsidy Program',
      status: 'upcoming',
      highlight: true,
    },
    {
      date: 'May 2026',
      title: 'Mainnet Launch',
      description: 'Production deployment after successful audit',
      status: 'upcoming',
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
            <Calendar className="w-4 h-4" />
            Timeline
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Path to Mainnet
          </motion.h2>
        </div>

        <div className="max-w-2xl mx-auto">
          {timeline.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 pb-8 last:pb-0"
            >
              {/* Line */}
              {index < timeline.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-800" />
              )}

              {/* Dot */}
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                item.highlight ? 'bg-emerald-500' :
                item.status === 'current' ? 'bg-blue-500' : 'bg-gray-700'
              }`}>
                {item.highlight ? (
                  <ShieldCheck className="w-3 h-3 text-white" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>

              {/* Content */}
              <div className={`p-4 rounded-xl ${
                item.highlight ? 'bg-emerald-950/30 border border-emerald-500/30' : 'bg-gray-900/50 border border-gray-800'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-sm font-medium ${item.highlight ? 'text-emerald-400' : 'text-blue-400'}`}>
                    {item.date}
                  </span>
                  {item.highlight && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                      Audit
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
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
            The Builder
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Built by a Developer
          </motion.h2>
        </div>

        <FounderProfile data={founderData} />
      </div>
    </section>
  )
}

function LinksSection() {
  const links = [
    {
      title: 'Live App',
      description: 'app.sip-protocol.org',
      href: 'https://app.sip-protocol.org',
      icon: Zap,
    },
    {
      title: 'Documentation',
      description: 'docs.sip-protocol.org',
      href: 'https://docs.sip-protocol.org',
      icon: FileText,
    },
    {
      title: 'GitHub',
      description: 'sip-protocol/sip-protocol',
      href: 'https://github.com/sip-protocol/sip-protocol',
      icon: Github,
    },
    {
      title: 'npm Package',
      description: '@sip-protocol/sdk',
      href: 'https://www.npmjs.com/package/@sip-protocol/sdk',
      icon: ExternalLink,
    },
  ]

  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 overflow-hidden">
          <div className="px-8 py-16 sm:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">Explore SIP Protocol</h2>
            <p className="mt-4 text-lg text-gray-400">
              Open source. Production ready. Audit-ready.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
              {links.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-emerald-500/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <link.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium group-hover:text-emerald-400 transition-colors">
                      {link.title}
                    </div>
                    <div className="text-sm text-gray-500">{link.description}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-gray-700">
              <a
                href="https://devfolio.co/projects/sip-protocol-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <Trophy className="w-4 h-4" />
                View Zypherpunk Hackathon Submission
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
