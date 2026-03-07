'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import {
  Shield,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Play,
  Eye,
  Lock,
  Key,
  Blocks,
  Zap,
  Globe,
  FileText,
  Users,
  Video,
  BookOpen,
  Package,
  Download,
  ChevronRight,
  Copy,
  Check,
  Target,
  Sparkles,
  Lightbulb,
  Presentation,
  ArrowLeftRight,
  Wallet,
  Coins,
  Settings,
} from 'lucide-react'
import { PhoneMockup, PhoneScreen } from '@/components/ui/PhoneMockup'
import { FounderProfile } from '@/components/founder-profile'
import type { FounderData } from '@/lib/founder-data'
import {
  videos,
  whatsNew,
  judgingCriteria,
  PRIVATE_SWAP_FLOW,
  SIP_PROGRAM,
  MAINNET_PROOF,
  stats,
  techStack,
  resources,
} from './data'

// ============================================================================
// Types
// ============================================================================

type TabId = 'overview' | 'videos' | 'architecture' | 'team' | 'resources'

interface Tab {
  id: TabId
  label: string
  icon: React.ElementType
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: Zap },
  { id: 'videos', label: 'Demo Videos', icon: Video },
  { id: 'architecture', label: 'Architecture', icon: Blocks },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'resources', label: 'Resources', icon: BookOpen },
]

// ============================================================================
// Icon Maps
// ============================================================================

const iconMap: Record<string, React.ElementType> = {
  Shield, Lock, Key, Eye, Smartphone, Package, Globe, FileText,
  Blocks, BookOpen, Download, Wallet, CheckCircle2, Target,
  Sparkles, Lightbulb, Presentation, ArrowLeftRight, Coins, Settings,
}

const colorClasses = {
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    borderStrong: 'border-green-500/30',
    text: 'text-green-400',
    gradient: 'from-green-500 to-emerald-500',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    borderStrong: 'border-cyan-500/30',
    text: 'text-cyan-400',
    gradient: 'from-cyan-500 to-blue-500',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    borderStrong: 'border-purple-500/30',
    text: 'text-purple-400',
    gradient: 'from-purple-500 to-pink-500',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    borderStrong: 'border-amber-500/30',
    text: 'text-amber-400',
    gradient: 'from-amber-500 to-yellow-500',
  },
}

// ============================================================================
// Helper Components
// ============================================================================

function AnimatedCounter({ value, suffix = '' }: { value: number | string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/,/g, ''), 10) : value

  useEffect(() => {
    if (!isInView || isNaN(numericValue)) return

    const duration = 1500
    const steps = 60
    const increment = numericValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setCount(numericValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, numericValue])

  return (
    <span ref={ref}>
      {isNaN(numericValue) ? value : count.toLocaleString()}
      {suffix}
    </span>
  )
}

function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-md hover:bg-gray-700/50 transition-colors cursor-pointer ${className}`}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
      )}
    </button>
  )
}

// ============================================================================
// Main Component
// ============================================================================

interface MonolithContentProps {
  founderData: FounderData
}

export function MonolithContent({ founderData }: MonolithContentProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  return (
    <div className="min-h-screen">
      {/* Header with Breadcrumb */}
      <div className="border-b border-gray-800/50 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-3 sm:py-4">
            <Link
              href="/showcase"
              className="text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-180" />
              Back to Showcase
            </Link>
          </div>

          <nav className="-mb-px flex overflow-x-auto scrollbar-hide gap-0.5 sm:gap-1 pb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'border-purple-400 text-purple-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && <OverviewSection />}
          {activeTab === 'videos' && <VideoGallerySection />}
          {activeTab === 'architecture' && <ArchitectureSection />}
          {activeTab === 'team' && <TeamSection founderData={founderData} />}
          {activeTab === 'resources' && <ResourcesSection />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// Overview Section
// ============================================================================

function OverviewSection() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Smartphone className="w-4 h-4" />
                  MONOLITH 2026
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 text-4xl sm:text-5xl font-bold"
              >
                Every transaction on Seeker is public.{' '}
                <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
                  SIP fixes that.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-lg text-gray-400"
              >
                THE Privacy Wallet for Seeker. One toggle to shield sender, amount, and recipient.
                Now with private swaps via Jupiter and multi-wallet support.
              </motion.p>

              {/* Key Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-3 sm:gap-4"
              >
                <div className="px-3 sm:px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-colors">
                  <div className="text-xl sm:text-2xl font-bold text-green-400 flex items-center gap-2">
                    Mainnet
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">Verified on Seeker</div>
                </div>
                <div className="px-3 sm:px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                  <div className="text-xl sm:text-2xl font-bold text-purple-400">v{stats.version}</div>
                  <div className="text-xs text-gray-500">SIP Mobile</div>
                </div>
                <div className="px-3 sm:px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                    <AnimatedCounter value={stats.mobileTests} suffix="+" />
                  </div>
                  <div className="text-xs text-gray-500">Mobile Tests</div>
                </div>
                <div className="px-3 sm:px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                  <div className="text-xl sm:text-2xl font-bold text-cyan-400">{stats.grantAmount}</div>
                  <div className="text-xs text-gray-500">Grant Approved</div>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex flex-wrap gap-3 sm:gap-4"
              >
                <a
                  href="https://github.com/sip-protocol/sip-mobile/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white bg-gradient-to-r from-purple-500 to-green-500 rounded-lg hover:from-purple-600 hover:to-green-600 transition-all font-medium flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-100"
                >
                  <Download className="w-4 h-4" />
                  Download APK v{stats.version}
                </a>
                <a
                  href="https://github.com/sip-protocol/sip-mobile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-gray-300 border border-gray-700 rounded-lg hover:text-white hover:border-gray-600 transition-all font-medium flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-100"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Source Code
                </a>
              </motion.div>
            </div>

            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative flex justify-center"
            >
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-64 h-96 bg-gradient-to-r from-purple-500/30 to-green-500/30 rounded-full blur-3xl" />
              </div>

              <PhoneMockup variant="seeker" className="relative z-10">
                <PhoneScreen
                  src="/images/showcase/solana-privacy-2026/home-screen.png"
                  alt="SIP Privacy v0.2.0 on Seeker"
                />
              </PhoneMockup>

              {/* Floating badges */}
              <div className="absolute -right-4 top-16 z-20 hidden lg:block">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900/90 border border-purple-500/30 shadow-lg"
                >
                  <ArrowLeftRight className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-medium text-white">Private Swaps</span>
                </motion.div>
              </div>

              <div className="absolute -left-4 top-32 z-20 hidden lg:block">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900/90 border border-green-500/30 shadow-lg"
                >
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-medium text-white">Stealth Addresses</span>
                </motion.div>
              </div>

              <div className="absolute -right-8 bottom-24 z-20 hidden lg:block">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900/90 border border-cyan-500/30 shadow-lg"
                >
                  <Wallet className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-medium text-white">Multi-Wallet</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-500/5 to-orange-500/5 border border-red-500/20"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                The Problem
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Every transaction on Solana is fully transparent. Your balance, who you pay,
                how much you spend — all public. On Seeker, this means your mobile wallet
                activity is an open book. Employers, competitors, and bad actors can track
                every move.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                  <div className="text-red-400 font-semibold mb-1">Balances Exposed</div>
                  <p className="text-sm text-gray-500">Anyone can see how much you hold</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                  <div className="text-red-400 font-semibold mb-1">Payments Tracked</div>
                  <p className="text-sm text-gray-500">Every send links sender to recipient</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                  <div className="text-red-400 font-semibold mb-1">Swaps Monitored</div>
                  <p className="text-sm text-gray-500">DEX trades reveal your strategy</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                The Solution: <span className="text-green-400">One Toggle</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                SIP Privacy adds a single privacy toggle to every transaction. Stealth addresses
                hide recipients, Pedersen commitments hide amounts, and viewing keys enable
                compliance when needed. Privacy by default, transparency by choice.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's New in v0.2.0 */}
      <section className="py-16 border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"
            >
              <Zap className="w-4 h-4" />
              New in v{stats.version}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-3xl sm:text-4xl font-bold"
            >
              What&apos;s New
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {whatsNew.map((item, index) => {
              const Icon = iconMap[item.icon] || Shield
              const colors = colorClasses[item.color]
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`p-5 sm:p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:${colors.borderStrong} transition-colors cursor-default`}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Judging Criteria */}
      <section className="py-16 border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"
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
              Judging Criteria Alignment
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {judgingCriteria.map((criterion, index) => {
              const Icon = iconMap[criterion.icon] || Shield
              const colors = colorClasses[criterion.color]
              return (
                <motion.div
                  key={criterion.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl bg-gray-900/50 border-2 ${colors.borderStrong}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{criterion.name}</h3>
                        <p className="text-xs text-gray-500">{criterion.description}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                      {criterion.weight}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {criterion.sipAnswer}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mainnet Proof */}
      <section className="py-16 border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-green-500/5 to-cyan-500/5 border border-green-500/20"
            >
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                Mainnet Verified
              </h2>
              <p className="text-gray-400 mb-6">Real transactions on Solana mainnet, not testnet demos.</p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-400">Private Swap TX</span>
                    <div className="flex items-center gap-1">
                      <CopyButton text={MAINNET_PROOF.privateSwapTx} />
                      <a
                        href={`https://solscan.io/tx/${MAINNET_PROOF.privateSwapTx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-gray-700/50 text-green-400 hover:text-green-300 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <code className="text-xs text-gray-400 font-mono break-all">
                    {MAINNET_PROOF.privateSwapTx}
                  </code>
                </div>

                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-cyan-400">Stealth Claim TX</span>
                    <div className="flex items-center gap-1">
                      <CopyButton text={MAINNET_PROOF.claimTx} />
                      <a
                        href={`https://solscan.io/tx/${MAINNET_PROOF.claimTx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-gray-700/50 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <code className="text-xs text-gray-400 font-mono break-all">
                    {MAINNET_PROOF.claimTx}
                  </code>
                </div>

                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-400">Program ID</span>
                    <div className="flex items-center gap-1">
                      <CopyButton text={SIP_PROGRAM.programId} />
                      <a
                        href={`https://solscan.io/account/${SIP_PROGRAM.programId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-gray-700/50 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <code className="text-xs text-gray-400 font-mono break-all">
                    {SIP_PROGRAM.programId}
                  </code>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

// ============================================================================
// Video Gallery Section
// ============================================================================

function VideoGallerySection() {
  const categories = [...new Set(videos.map((v) => v.category))]

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold"
          >
            Demo Videos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-gray-400"
          >
            {videos.length} demos showcasing v{stats.version} on Seeker
          </motion.p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              {category === 'Core Privacy' && <Shield className="w-5 h-5 text-green-400" />}
              {category === 'DeFi Privacy' && <ArrowLeftRight className="w-5 h-5 text-purple-400" />}
              {category === 'Wallet Management' && <Wallet className="w-5 h-5 text-cyan-400" />}
              {category}
            </h3>
            <div className="flex flex-wrap gap-4 sm:gap-8 justify-center">
              {videos
                .filter((v) => v.category === category)
                .map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    {/* Phone mockup frame */}
                    <div className="relative w-[160px] sm:w-[200px]">
                      <div className="relative rounded-[2rem] p-2 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                        <div className="relative rounded-[1.5rem] bg-black p-0.5 overflow-hidden">
                          <div className="relative rounded-[1.25rem] overflow-hidden bg-gray-950">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                              <div className="w-14 h-4 bg-black rounded-b-lg flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                              </div>
                            </div>
                            <div className="relative aspect-[9/19.5]">
                              {video.isPlaceholder ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-600">
                                  <Play className="w-8 h-8 mb-2" />
                                  <span className="text-xs">Coming Soon</span>
                                </div>
                              ) : (
                                <video
                                  src={video.src}
                                  className="w-full h-full object-cover"
                                  controls
                                  preload="metadata"
                                  playsInline
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="absolute -right-0.5 top-16 w-0.5 h-8 bg-gray-600 rounded-r-sm" />
                        <div className="absolute -left-0.5 top-14 w-0.5 h-5 bg-gray-600 rounded-l-sm" />
                        <div className="absolute -left-0.5 top-22 w-0.5 h-8 bg-gray-600 rounded-l-sm" />
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <h4 className="font-medium text-white">{video.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{video.description}</p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ============================================================================
// Architecture Section
// ============================================================================

function ArchitectureSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold"
          >
            Privacy Architecture
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-gray-400"
          >
            How private swaps work under the hood
          </motion.p>
        </div>

        {/* Private Swap Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h3 className="text-xl font-semibold mb-6 text-center">Private Swap: Two-TX Architecture</h3>
          <div className="grid sm:grid-cols-4 gap-4">
            {PRIVATE_SWAP_FLOW.map((step, index) => {
              const colors = colorClasses[step.color]
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`relative p-4 rounded-2xl bg-gray-900/50 border-2 ${colors.borderStrong}`}
                >
                  <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center mb-3`}>
                    <span className={`text-sm font-bold ${colors.text}`}>{step.step}</span>
                  </div>
                  <h4 className={`font-semibold ${colors.text} mb-1`}>{step.title}</h4>
                  <p className="text-sm text-gray-300 mb-2">{step.description}</p>
                  <p className="text-xs text-gray-500">{step.detail}</p>

                  {/* Arrow connector */}
                  {index < PRIVATE_SWAP_FLOW.length - 1 && (
                    <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Program Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-12 p-6 rounded-2xl bg-gray-900/70 border-2 border-green-500/30"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              {SIP_PROGRAM.name}
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
              Mainnet Live
            </span>
          </div>

          <div className="mb-6 p-3 sm:p-4 rounded-xl bg-gray-800/50 border border-gray-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Program ID</span>
              <div className="flex items-center gap-1">
                <CopyButton text={SIP_PROGRAM.programId} />
                <a
                  href={`https://solscan.io/account/${SIP_PROGRAM.programId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md hover:bg-gray-700/50 text-green-400 hover:text-green-300 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            <code className="text-xs sm:text-sm text-green-400 font-mono break-all">
              {SIP_PROGRAM.programId}
            </code>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Instructions</h4>
            <div className="flex flex-wrap gap-2">
              {SIP_PROGRAM.instructions.map((ix) => (
                <span
                  key={ix}
                  className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono"
                >
                  {ix}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-xl font-semibold mb-6 text-center">Tech Stack</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 text-center hover:border-purple-500/30 transition-colors"
              >
                <div className="text-sm font-medium text-white">{tech.name}</div>
                <div className="text-xs text-gray-500 mt-1">{tech.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================================
// Team Section
// ============================================================================

function TeamSection({ founderData }: { founderData: FounderData }) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold"
          >
            Solo Founder
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-gray-400"
          >
            One person. Pure execution. Zero committee decisions.
          </motion.p>
        </div>

        <FounderProfile data={founderData} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
            <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <span>🏆</span> Track Record
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-gray-900/50">
                <div className="text-2xl font-bold text-amber-400">{stats.totalPrizes}</div>
                <div className="text-xs text-gray-500">Total Prizes + Grants</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-900/50">
                <div className="text-2xl font-bold text-amber-400">{stats.hackathonWins}</div>
                <div className="text-xs text-gray-500">Competition Wins</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-900/50">
                <div className="text-2xl font-bold text-amber-400">2024-2026</div>
                <div className="text-xs text-gray-500">Active Years</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================================
// Resources Section
// ============================================================================

function ResourcesSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold"
          >
            Resources
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-gray-400"
          >
            Explore the code, documentation, and deployed program
          </motion.p>
        </div>

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto mb-12">
          {resources.map((resource, index) => {
            const Icon = iconMap[resource.icon] || Globe
            return (
              <motion.a
                key={resource.title}
                href={resource.href}
                target={resource.external ? '_blank' : undefined}
                rel={resource.external ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-base font-medium group-hover:text-purple-400 transition-colors flex items-center gap-1">
                    {resource.title}
                    {resource.external && <ExternalLink className="w-3 h-3" />}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{resource.description}</div>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
