'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Trophy,
  ArrowRight,
  Shield,
  Smartphone,
  Code,
  Zap,
  ExternalLink,
} from 'lucide-react'

const showcases = [
  {
    id: 'solana-privacy-2026',
    title: 'Solana Privacy Hackathon',
    subtitle: 'January 2026',
    description: 'Privacy-first mobile wallet with compliant privacy, viewing keys for auditors, and full E2E transaction flows on Solana mainnet.',
    status: 'active',
    prize: null,
    tags: ['Mobile', 'Privacy', 'Compliance', 'Mainnet'],
    href: '/showcase/solana-privacy-2026',
    color: 'from-green-500 to-emerald-500',
    borderColor: 'border-green-500/20 hover:border-green-500/50',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    icon: Smartphone,
  },
  {
    id: 'zypherpunk-2025',
    title: 'Zypherpunk Hackathon',
    subtitle: 'December 2025',
    description: 'Cross-chain privacy SDK with stealth addresses, Pedersen commitments, and viewing keys. Won 3 tracks.',
    status: 'winner',
    prize: '$6,500',
    tags: ['SDK', 'ZK', 'Cross-chain', 'NEAR'],
    href: '/showcase/zypherpunk-2025',
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500/20 hover:border-purple-500/50',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    icon: Code,
  },
]

export default function ShowcasePage() {
  return (
    <>
      <HeroSection />
      <ShowcaseCardsSection />
      <StatsSection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Trophy className="w-4 h-4" />
              Hackathon Submissions
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold"
          >
            Project{' '}
            <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              Showcase
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Hackathon submissions, demos, and pitch decks showcasing SIP Protocol&apos;s
            privacy technology across different platforms and use cases.
          </motion.p>
        </div>
      </div>
    </section>
  )
}

function ShowcaseCardsSection() {
  return (
    <section className="py-16 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {showcases.map((showcase, index) => (
            <motion.div
              key={showcase.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={showcase.href}
                className={`block p-8 rounded-2xl bg-gray-900/50 border ${showcase.borderColor} transition-all duration-300 hover:scale-[1.02] group h-full`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${showcase.bgColor} flex items-center justify-center`}>
                      <showcase.icon className={`w-5 h-5 ${showcase.textColor}`} />
                    </div>
                    {showcase.status === 'winner' && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Winner
                      </span>
                    )}
                    {showcase.status === 'active' && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        Active
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-1">{showcase.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{showcase.subtitle}</p>
                <p className="text-gray-400 mb-6">{showcase.description}</p>

                {/* Prize */}
                {showcase.prize && (
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${showcase.bgColor} ${showcase.textColor} mb-4`}>
                    {showcase.prize}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {showcase.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const stats = [
    { value: '2', label: 'Hackathons', icon: Trophy },
    { value: '$6,500', label: 'Prize Won', icon: Zap },
    { value: '6,800+', label: 'Tests Passing', icon: Shield },
  ]

  return (
    <section className="py-16 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Explore more</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/sip-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://docs.sip-protocol.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              Documentation
              <ExternalLink className="w-3 h-3" />
            </a>
            <Link
              href="/grants"
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Grant Applications
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
