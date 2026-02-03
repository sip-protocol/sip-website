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
  Clock,
  Users,
  Video,
  BookOpen,
  Package,
  Download,
  GitCommit,
  FolderGit2,
  ChevronRight,
  Copy,
  Check,
  Pause,
  RotateCcw,
  Send,
  Wallet,
} from 'lucide-react'
import { PhoneMockup, PhoneScreen } from '@/components/ui/PhoneMockup'
import { FounderProfile } from '@/components/founder-profile'
import type { FounderData } from '@/lib/founder-data'
import {
  videos,
  features,
  techStack,
  resources,
  SIP_NATIVE_PROGRAM,
  ARCIUM_PROGRAM,
  TIMELINE_DATA,
  TRANSACTION_FLOW_STEPS,
  type FlowStep,
} from './data'

// ============================================================================
// Types
// ============================================================================

type TabId = 'overview' | 'videos' | 'contracts' | 'timeline' | 'team' | 'resources'

interface Tab {
  id: TabId
  label: string
  icon: React.ElementType
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: Zap },
  { id: 'videos', label: 'Demo Videos', icon: Video },
  { id: 'contracts', label: 'Smart Contracts', icon: Blocks },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'resources', label: 'Resources', icon: BookOpen },
]

// ============================================================================
// Icon Components (for dynamic rendering)
// ============================================================================

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Lock,
  Key,
  Eye,
  Smartphone,
  Package,
  Globe,
  FileText,
  Blocks,
  BookOpen,
  Download,
  Send,
  Wallet,
  CheckCircle2,
}

// Color classes for transaction flow steps
const stepColorClasses = {
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-400',
    text: 'text-green-400',
    icon: 'text-green-400',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-400',
    text: 'text-cyan-400',
    icon: 'text-cyan-400',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-400',
    text: 'text-purple-400',
    icon: 'text-purple-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-400',
    text: 'text-amber-400',
    icon: 'text-amber-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400',
    text: 'text-emerald-400',
    icon: 'text-emerald-400',
  },
}

// ============================================================================
// Helper Components
// ============================================================================

// Animated counter that counts up when in view
function AnimatedCounter({ value, suffix = '' }: { value: number | string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/,/g, ''), 10) : value

  useEffect(() => {
    if (!isInView || isNaN(numericValue)) return

    const duration = 1500 // ms
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

// Copy to clipboard button
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

interface SolanaPrivacyContentProps {
  founderData: FounderData
}

export function SolanaPrivacyContent({ founderData }: SolanaPrivacyContentProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  return (
    <div className="min-h-screen">
      {/* Header with Breadcrumb */}
      <div className="border-b border-gray-800/50 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="py-3 sm:py-4">
            <Link
              href="/showcase"
              className="text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-180" />
              Back to Showcase
            </Link>
          </div>

          {/* Tab Navigation */}
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
                      ? 'border-green-400 text-green-400'
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
          {activeTab === 'contracts' && <SmartContractsSection />}
          {activeTab === 'timeline' && <TimelineSection />}
          {activeTab === 'team' && <TeamSection founderData={founderData} />}
          {activeTab === 'resources' && <ResourcesSection />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// Overview Section (Hero + Features)
// ============================================================================

function OverviewSection() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
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
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                  <Smartphone className="w-4 h-4" />
                  Solana Privacy Hackathon 2026
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 text-4xl sm:text-5xl font-bold"
              >
                SIP Privacy{' '}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Mobile Wallet
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-lg text-gray-400"
              >
                Privacy-first Solana wallet with compliant privacy. Full stealth address
                implementation with viewing keys for institutional compliance.
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
                  <div className="text-xs text-gray-500">Live on Solana</div>
                </div>
                <div className="px-3 sm:px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                    <AnimatedCounter value={6850} suffix="+" />
                  </div>
                  <div className="text-xs text-gray-500">Tests Passing</div>
                </div>
                <div className="px-3 sm:px-4 py-2 rounded-lg bg-teal-500/10 border border-teal-500/20 hover:border-teal-500/40 transition-colors">
                  <div className="text-xl sm:text-2xl font-bold text-teal-400">
                    <AnimatedCounter value={1457} />
                  </div>
                  <div className="text-xs text-gray-500">Total Commits</div>
                </div>
                <div className="px-3 sm:px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                  <div className="text-xl sm:text-2xl font-bold text-cyan-400">
                    <AnimatedCounter value={8} />
                  </div>
                  <div className="text-xs text-gray-500">Repositories</div>
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
                  href="https://github.com/sip-protocol/sip-mobile/releases/tag/v0.1.6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-100"
                >
                  <Download className="w-4 h-4" />
                  Download APK v0.1.6
                </a>
                <a
                  href="https://github.com/sip-protocol"
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
                  View Organization
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
                <div className="w-64 h-96 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full blur-3xl" />
              </div>

              <PhoneMockup variant="seeker" className="relative z-10">
                <PhoneScreen
                  src="/images/showcase/solana-privacy-2026/home-screen.png"
                  alt="SIP Privacy Mobile Wallet on Seeker"
                />
              </PhoneMockup>

              {/* Floating badges */}
              <div className="absolute -right-4 top-16 z-20 hidden lg:block">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900/90 border border-green-500/30 shadow-lg"
                >
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-medium text-white">Stealth Addresses</span>
                </motion.div>
              </div>

              <div className="absolute -left-4 top-32 z-20 hidden lg:block">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900/90 border border-cyan-500/30 shadow-lg"
                >
                  <Lock className="w-4 h-4 text-white" />
                  <span className="text-xs font-medium text-white">Compliant Privacy</span>
                </motion.div>
              </div>

              <div className="absolute -right-8 bottom-24 z-20 hidden lg:block">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900/90 border border-purple-500/30 shadow-lg"
                >
                  <Key className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-medium text-white">Viewing Keys</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Key Features
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-3xl sm:text-4xl font-bold"
            >
              Privacy + Compliance
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Shield
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="p-5 sm:p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-green-500/50 transition-colors cursor-default"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">{feature.description}</p>
                </motion.div>
              )
            })}
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
            8 videos demonstrating full functionality on Seeker device
          </motion.p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              {category === 'Getting Started' && <Play className="w-5 h-5 text-green-400" />}
              {category === 'Privacy Transactions' && <Shield className="w-5 h-5 text-purple-400" />}
              {category === 'Compliance' && <Lock className="w-5 h-5 text-white" />}
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
                              <video
                                src={video.src}
                                className="w-full h-full object-cover"
                                controls
                                preload="metadata"
                                playsInline
                              />
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
// Smart Contracts Section
// ============================================================================

function SmartContractsSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold"
          >
            Smart Contracts
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-gray-400"
          >
            Two on-chain programs powering SIP privacy infrastructure
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* SIP Native Program */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-gray-900/70 border-2 border-green-500/30"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  {SIP_NATIVE_PROGRAM.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">Native privacy program with ZK proofs</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                Mainnet Live
              </span>
            </div>

            {/* Program ID */}
            <div className="mb-6 p-3 sm:p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Program ID</span>
                <div className="flex items-center gap-1">
                  <CopyButton text={SIP_NATIVE_PROGRAM.programId} />
                  <a
                    href={`https://solscan.io/account/${SIP_NATIVE_PROGRAM.programId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-gray-700/50 text-green-400 hover:text-green-300 transition-colors cursor-pointer"
                    title="View on Solscan"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <code className="text-xs sm:text-sm text-green-400 font-mono break-all">
                {SIP_NATIVE_PROGRAM.programId}
              </code>
            </div>

            {/* Architecture Flow */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Transaction Flow</h4>
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300 bg-gray-800/30 rounded-lg p-2 sm:p-3 overflow-x-auto">
                <span className="flex items-center gap-1 flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Send
                </span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0 mx-1" />
                <span className="flex items-center gap-1 flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Commit
                </span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0 mx-1" />
                <span className="flex items-center gap-1 flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Verify
                </span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0 mx-1" />
                <span className="flex items-center gap-1 flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Claim
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Instructions</h4>
              <div className="grid grid-cols-2 gap-2">
                {SIP_NATIVE_PROGRAM.instructions.map((ix) => (
                  <div
                    key={ix.name}
                    className="p-2 rounded-lg bg-gray-800/50 border border-gray-700"
                  >
                    <code className="text-xs text-green-400">{ix.name}</code>
                    <p className="text-xs text-gray-500 mt-1">{ix.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accounts */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Account Types</h4>
              <div className="space-y-2">
                {SIP_NATIVE_PROGRAM.accounts.map((acc) => (
                  <div
                    key={acc.name}
                    className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/30"
                  >
                    <span className="text-sm font-medium text-white">{acc.name}</span>
                    <span className="text-xs text-gray-500">{acc.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Features */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Security Features</h4>
              <div className="flex flex-wrap gap-2">
                {SIP_NATIVE_PROGRAM.securityFeatures.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Arcium MPC Program */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-gray-900/70 border-2 border-amber-500/30"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  {ARCIUM_PROGRAM.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">Multi-party computation for confidential DeFi</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Devnet / Experimental
              </span>
            </div>

            {/* Program ID */}
            <div className="mb-6 p-3 sm:p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Program ID</span>
                <div className="flex items-center gap-1">
                  <CopyButton text={ARCIUM_PROGRAM.programId} />
                  <a
                    href={`https://solscan.io/account/${ARCIUM_PROGRAM.programId}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-gray-700/50 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                    title="View on Solscan"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <code className="text-xs sm:text-sm text-amber-400 font-mono break-all">
                {ARCIUM_PROGRAM.programId}
              </code>
            </div>

            {/* MPC Architecture */}
            <div className="mb-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <h4 className="text-sm font-medium text-amber-400 mb-2">How MPC Works</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Arcium MPC allows computations on encrypted data without revealing the underlying values.
                Multiple parties compute together, ensuring no single party sees sensitive information.
                Perfect for confidential DeFi operations like balance checks and swap validation.
              </p>
            </div>

            {/* MPC Circuits */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">MPC Circuits</h4>
              <div className="space-y-3">
                {ARCIUM_PROGRAM.circuits.map((circuit) => (
                  <div
                    key={circuit.name}
                    className="p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm text-amber-400">{circuit.name}</code>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{circuit.purpose}</p>
                    <div className="flex gap-4 text-xs">
                      {circuit.inputs && (
                        <div>
                          <span className="text-gray-500">Inputs: </span>
                          <span className="text-gray-300">{circuit.inputs.join(', ')}</span>
                        </div>
                      )}
                      {circuit.outputs && (
                        <div>
                          <span className="text-gray-500">Outputs: </span>
                          <span className="text-green-400">{circuit.outputs.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-3 rounded-lg bg-gray-800/30 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span>MXE Account:</span>
                <code className="text-amber-400/70">{ARCIUM_PROGRAM.mxeAccount.slice(0, 12)}...</code>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span>Cluster Offset:</span>
                <code className="text-amber-400/70">{ARCIUM_PROGRAM.clusterOffset}</code>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transaction Flow Simulator */}
        <TransactionFlowSimulator />
      </div>
    </section>
  )
}

// ============================================================================
// Transaction Flow Simulator
// ============================================================================

function TransactionFlowSimulator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return
    if (currentStep >= TRANSACTION_FLOW_STEPS.length - 1) {
      setIsPlaying(false)
      return
    }
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), 2000)
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep])

  const handleNext = () => {
    if (currentStep < TRANSACTION_FLOW_STEPS.length - 1) {
      setCurrentStep((s) => s + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const handlePlayPause = () => {
    if (currentStep >= TRANSACTION_FLOW_STEPS.length - 1) {
      setCurrentStep(0)
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-12 p-6 sm:p-8 rounded-2xl bg-gray-900/50 border border-gray-800"
    >
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Transaction Flow Simulator
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Click through to see how privacy transactions work
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePlayPause}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white cursor-pointer"
            aria-label="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        {TRANSACTION_FLOW_STEPS.map((step, index) => (
          <FlowStepIndicator
            key={step.id}
            step={step}
            index={index}
            currentStep={currentStep}
            isLast={index === TRANSACTION_FLOW_STEPS.length - 1}
          />
        ))}
      </div>

      {/* Current step detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-xl bg-gray-800/50"
        >
          <FlowStepDetail step={TRANSACTION_FLOW_STEPS[currentStep]} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === TRANSACTION_FLOW_STEPS.length - 1}
          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

function FlowStepIndicator({
  step,
  index,
  currentStep,
  isLast,
}: {
  step: FlowStep
  index: number
  currentStep: number
  isLast: boolean
}) {
  const isComplete = index < currentStep
  const isActive = index === currentStep
  const Icon = iconMap[step.icon] || Shield
  const colors = stepColorClasses[step.color]

  return (
    <>
      <div className="flex flex-col items-center min-w-[70px] sm:min-w-[80px]">
        <motion.div
          animate={{ scale: isActive ? 1.1 : 1 }}
          className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
            isComplete
              ? 'bg-green-500/20 border-green-500'
              : isActive
                ? `${colors.bg} ${colors.border}`
                : 'bg-gray-800 border-gray-700'
          }`}
        >
          {isComplete ? (
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          ) : (
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? colors.icon : 'text-gray-500'}`} />
          )}
          {isActive && (
            <span className={`absolute inset-0 rounded-full animate-ping ${colors.bg} opacity-50`} />
          )}
        </motion.div>
        <span
          className={`text-[10px] sm:text-xs mt-2 text-center whitespace-nowrap ${
            isActive ? 'text-white font-medium' : 'text-gray-500'
          }`}
        >
          {step.title}
        </span>
      </div>

      {/* Connector line */}
      {!isLast && (
        <div
          className={`flex-1 h-0.5 mx-1 sm:mx-2 min-w-[15px] sm:min-w-[20px] transition-colors ${
            isComplete ? 'bg-green-500' : 'bg-gray-700'
          }`}
        />
      )}
    </>
  )
}

function FlowStepDetail({ step }: { step: FlowStep }) {
  const Icon = iconMap[step.icon] || Shield
  const colors = stepColorClasses[step.color]

  return (
    <div className="text-center">
      <div className={`inline-flex p-4 rounded-xl ${colors.bg} mb-4 border ${colors.border}/30`}>
        <Icon className={`w-8 h-8 ${colors.icon}`} />
      </div>
      <h4 className="text-xl font-semibold mb-2 text-white">{step.title}</h4>
      <p className="text-gray-400 mb-4">{step.description}</p>
      <code className="text-sm bg-gray-900 px-4 py-2 rounded-lg text-green-400 font-mono inline-block">
        {step.detail}
      </code>
    </div>
  )
}

// ============================================================================
// Timeline Section
// ============================================================================

function TimelineSection() {
  const totalCommits = TIMELINE_DATA.preHackathon.commits + TIMELINE_DATA.duringHackathon.commits

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold"
          >
            Development Timeline
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-gray-400"
          >
            From foundation to hackathon execution
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Pre-Hackathon */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-gray-900/70 border-2 border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                Pre-Hackathon
              </span>
              <span className="text-sm text-gray-500">{TIMELINE_DATA.preHackathon.period}</span>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400 flex items-center gap-1">
                  <GitCommit className="w-5 h-5 sm:w-6 sm:h-6" />
                  <AnimatedCounter value={TIMELINE_DATA.preHackathon.commits} />
                </div>
                <div className="text-xs text-gray-500">Commits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400 flex items-center gap-1">
                  <FolderGit2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  <AnimatedCounter value={TIMELINE_DATA.preHackathon.repoCount} />
                </div>
                <div className="text-xs text-gray-500">Repos</div>
              </div>
            </div>

            <h4 className="text-sm font-medium text-gray-400 mb-3">Foundation Work</h4>
            <ul className="space-y-2">
              {TIMELINE_DATA.preHackathon.highlights.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-purple-400 mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* During Hackathon */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-gray-900/70 border-2 border-green-500/30"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                During Hackathon
              </span>
              <span className="text-sm text-gray-500">{TIMELINE_DATA.duringHackathon.period}</span>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-400 flex items-center gap-1">
                  <GitCommit className="w-5 h-5 sm:w-6 sm:h-6" />
                  <AnimatedCounter value={TIMELINE_DATA.duringHackathon.commits} />
                </div>
                <div className="text-xs text-gray-500">Commits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-400 flex items-center gap-1">
                  <FolderGit2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  <AnimatedCounter value={TIMELINE_DATA.duringHackathon.repoCount} />
                </div>
                <div className="text-xs text-gray-500">Repos</div>
              </div>
            </div>

            <h4 className="text-sm font-medium text-gray-400 mb-3">Execution Sprint</h4>
            <ul className="space-y-2">
              {TIMELINE_DATA.duringHackathon.highlights.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-green-400 mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Total Commits Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-green-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              <AnimatedCounter value={totalCommits} />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-white">Total Commits</div>
              <div className="text-xs text-gray-500">Across all repositories</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================================
// Team Section
// ============================================================================

interface TeamSectionProps {
  founderData: FounderData
}

function TeamSection({ founderData }: TeamSectionProps) {
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

        {/* Hackathon Wins Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
            <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <span>🏆</span> Hackathon Track Record
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-gray-900/50">
                <div className="text-2xl font-bold text-amber-400">$13,300+</div>
                <div className="text-xs text-gray-500">Total Prizes</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-900/50">
                <div className="text-2xl font-bold text-amber-400">5</div>
                <div className="text-xs text-gray-500">Hackathon Wins</div>
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
            Explore the code, documentation, and deployed programs
          </motion.p>
        </div>

        {/* Links Grid */}
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto mb-12">
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
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-green-500/50 transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-base font-medium group-hover:text-green-400 transition-colors flex items-center gap-1">
                    {resource.title}
                    {resource.external && <ExternalLink className="w-3 h-3" />}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 truncate">{resource.description}</div>
                </div>
              </motion.a>
            )
          })}
        </div>

        {/* Tech Stack */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className="px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-green-500/30 transition-colors"
              >
                <div className="font-medium text-white text-sm">{tech.name}</div>
                <div className="text-xs text-gray-500">{tech.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
