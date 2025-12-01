'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Shield,
  Zap,
  CheckCircle2,
  ArrowLeft,
  Users,
  FileText,
  Megaphone,
  Code,
  Trophy,
  AlertTriangle,
  TrendingUp,
  Eye,
  Lock,
  Github,
  ExternalLink,
  DollarSign,
} from 'lucide-react'

export default function SuperteamPitchPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <TractionSection />
      <BudgetSection />
      <TeamSection />
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
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <DollarSign className="w-4 h-4" />
              Microgrant Application
            </span>
          </motion.div>

          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
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
            The Privacy Standard for Web3
          </motion.p>

          {/* Amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20"
          >
            <span className="text-gray-400">Requesting</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              $10,000
            </span>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <a
              href="/demo"
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

function ProblemSection() {
  const problems = [
    {
      icon: AlertTriangle,
      title: 'No Stealth Address SDK',
      description: 'EIP-5564 exists for Ethereum, but Solana has no equivalent. Privacy-conscious users have no tools.',
    },
    {
      icon: TrendingUp,
      title: 'Privacy Projects Failed',
      description: 'Elusiv sunset in Feb 2024. Light Protocol pivoted to ZK Compression. The market has a vacuum.',
    },
    {
      icon: Eye,
      title: 'Cross-Chain Privacy Gap',
      description: 'NEAR Intents, Wormhole, deBridge - all transparent. No private cross-chain solution exists today.',
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
            Privacy on Solana is Broken
          </motion.h2>
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
      description: 'First EIP-5564 implementation adapted for Solana. One-time recipient addresses prevent linkability.',
    },
    {
      icon: Lock,
      title: 'Pedersen Commitments',
      description: 'Homomorphic commitments hide transaction amounts while enabling verification.',
    },
    {
      icon: Eye,
      title: 'Viewing Keys',
      description: 'Selective disclosure for compliance. Institutions can audit without compromising user privacy.',
    },
    {
      icon: Zap,
      title: 'NEAR Intents Integration',
      description: 'Cross-chain privacy via NEAR Intents. Privacy layer for the $6B+ ecosystem.',
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
            SIP Protocol Delivers
          </motion.h2>
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

function TractionSection() {
  const metrics = [
    { value: '867+', label: 'Tests Passing', detail: '745 SDK + 122 website' },
    { value: 'Published', label: 'npm Package', detail: '@sip-protocol/sdk v0.1.9' },
    { value: 'Live', label: 'Demo Deployed', detail: 'sip-protocol.org' },
    { value: 'M8', label: 'Current Milestone', detail: 'Phase 1: 95% complete' },
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
            <Code className="w-4 h-4" />
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
    { category: 'Community Building', amount: '$4,000', percent: 40, icon: Users },
    { category: 'Documentation', amount: '$2,500', percent: 25, icon: FileText },
    { category: 'Hackathon Participation', amount: '$2,500', percent: 25, icon: Trophy },
    { category: 'Marketing & Awareness', amount: '$1,000', percent: 10, icon: Megaphone },
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
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {budget.map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-gray-900/50 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="font-medium">{item.category}</span>
                </div>
                <span className="text-blue-400 font-semibold">{item.amount}</span>
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
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

        {/* Total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <span className="text-gray-400">Total Request</span>
            <span className="text-3xl font-bold text-white">$10,000</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function TeamSection() {
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
            Built by Developers, for Developers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-gray-400"
          >
            Passionate about privacy and open source
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto p-8 rounded-2xl bg-gray-900/50 border border-gray-800 text-center"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold">SIP Protocol Team</h3>
          <p className="mt-2 text-gray-400">
            Full-stack developers with experience in cryptography, blockchain, and privacy-preserving technologies.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <a
              href="https://github.com/sip-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
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
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-blue-500/20 overflow-hidden">
          {/* Background effect */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
          </div>

          <div className="px-8 py-16 sm:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to Support Privacy?</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Help us build the privacy layer that Solana deserves. Your support accelerates
              adoption and brings privacy to millions of users.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/demo"
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
