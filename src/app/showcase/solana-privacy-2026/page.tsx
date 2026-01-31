'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Shield,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Github,
  ExternalLink,
  Play,
  Eye,
  Lock,
  Key,
  Blocks,
  Zap,
  Globe,
  FileText,
} from 'lucide-react'

// CDN base URL for videos
const CDN_BASE = 'https://cdn.sip-protocol.org/videos/showcase/solana-privacy-2026'

// Video data for the showcase
const videos = [
  {
    id: '01-onboarding',
    title: 'Onboarding & Education',
    description: 'Interactive education slides explaining privacy concepts',
    src: `${CDN_BASE}/01-onboarding-education.mp4`,
    category: 'Getting Started',
  },
  {
    id: '02-wallet',
    title: 'Wallet Setup',
    description: 'Create or import wallet with secure key storage',
    src: `${CDN_BASE}/02-wallet-setup.mp4`,
    category: 'Getting Started',
  },
  {
    id: '03-settings',
    title: 'Settings & Navigation',
    description: 'All tabs and settings menu walkthrough',
    src: `${CDN_BASE}/03-settings-all-menus.mp4`,
    category: 'Getting Started',
  },
  {
    id: '04-devnet',
    title: 'Devnet E2E Flow',
    description: 'Send → Scan → Claim cycle on devnet',
    src: `${CDN_BASE}/04-devnet-send-scan-claim.mp4`,
    category: 'Privacy Transactions',
  },
  {
    id: '05-mainnet',
    title: 'Mainnet E2E Flow',
    description: 'Send → Scan → Claim cycle on mainnet',
    src: `${CDN_BASE}/05-mainnet-send-scan-claim.mp4`,
    category: 'Privacy Transactions',
  },
  {
    id: '06-explorer',
    title: 'On-Chain Verification',
    description: 'View transaction on Solscan explorer',
    src: `${CDN_BASE}/06-view-on-explorer.mp4`,
    category: 'Privacy Transactions',
  },
  {
    id: '07-compliant',
    title: 'Compliant Privacy Flow',
    description: 'Send → Scan → Claim with Compliant privacy level',
    src: `${CDN_BASE}/07-compliant-send-scan-claim.mp4`,
    category: 'Compliance',
  },
  {
    id: '08-viewing-keys',
    title: 'Viewing Keys & Compliance',
    description: 'Export viewing keys and compliance dashboard',
    src: `${CDN_BASE}/08-viewing-keys-compliance.mp4`,
    category: 'Compliance',
  },
]

const features = [
  {
    icon: Shield,
    title: 'Stealth Addresses',
    description: 'DKSAP (Dual-Key Stealth Address Protocol) for unlinkable transactions',
  },
  {
    icon: Lock,
    title: 'Compliant Privacy',
    description: 'Three privacy levels: Transparent, Shielded, and Compliant',
  },
  {
    icon: Key,
    title: 'Viewing Keys',
    description: 'Selective disclosure for auditors without spending ability',
  },
  {
    icon: Eye,
    title: 'Audit Trail',
    description: 'Track who you\'ve shared viewing keys with, revoke anytime',
  },
]

const techStack = [
  { name: 'Expo SDK 52', description: 'React Native framework' },
  { name: 'NativeWind 4.0', description: 'Tailwind for React Native' },
  { name: 'Anchor', description: 'Solana program framework' },
  { name: 'noble/curves', description: 'Cryptographic primitives' },
  { name: 'Zustand', description: 'State management' },
  { name: 'SecureStore', description: 'Encrypted key storage' },
]

export default function SolanaPrivacyShowcase() {
  return (
    <>
      <HeroSection />
      <VideoGallerySection />
      <FeaturesSection />
      <TechStackSection />
      <LinksSection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/showcase" className="text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Showcase
          </Link>
        </motion.div>

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
              className="mt-8 flex flex-wrap gap-4"
            >
              <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">Mainnet</div>
                <div className="text-xs text-gray-500">Live on Solana</div>
              </div>
              <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-2xl font-bold text-emerald-400">647+</div>
                <div className="text-xs text-gray-500">Tests Passing</div>
              </div>
              <div className="px-4 py-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                <div className="text-2xl font-bold text-teal-400">8</div>
                <div className="text-xs text-gray-500">Demo Videos</div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a
                href="https://github.com/sip-protocol/sip-mobile"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                View Source
              </a>
              <a
                href="https://docs.sip-protocol.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-gray-300 border border-gray-700 rounded-lg hover:text-white hover:border-gray-600 transition-all font-medium"
              >
                Documentation
              </a>
            </motion.div>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl" />
            <div className="relative p-8 rounded-3xl bg-gray-900/50 border border-gray-800">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
                  <Shield className="w-8 h-8 text-green-400" />
                  <div>
                    <div className="font-medium text-white">Stealth Addresses</div>
                    <div className="text-sm text-gray-500">DKSAP Protocol</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
                  <Lock className="w-8 h-8 text-cyan-400" />
                  <div>
                    <div className="font-medium text-white">Compliant Privacy</div>
                    <div className="text-sm text-gray-500">Institution Ready</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
                  <Key className="w-8 h-8 text-purple-400" />
                  <div>
                    <div className="font-medium text-white">Viewing Keys</div>
                    <div className="text-sm text-gray-500">Selective Disclosure</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function VideoGallerySection() {
  const categories = [...new Set(videos.map(v => v.category))]

  return (
    <section className="py-16 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold"
          >
            Demo Videos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
              {category === 'Compliance' && <Lock className="w-5 h-5 text-cyan-400" />}
              {category}
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos
                .filter(v => v.category === category)
                .map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl overflow-hidden bg-gray-900/50 border border-gray-800 hover:border-green-500/50 transition-colors"
                  >
                    <div className="relative aspect-video bg-gray-800">
                      <video
                        src={video.src}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                        playsInline
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-white">{video.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{video.description}</p>
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

function FeaturesSection() {
  return (
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-green-500/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TechStackSection() {
  return (
    <section className="py-16 border-t border-gray-800/50 bg-gray-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"
          >
            <Blocks className="w-4 h-4" />
            Tech Stack
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Built With
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-gray-800/50 text-center"
            >
              <div className="font-medium text-white text-sm">{tech.name}</div>
              <div className="text-xs text-gray-500 mt-1">{tech.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LinksSection() {
  const links = [
    {
      title: 'GitHub Repository',
      description: 'sip-protocol/sip-mobile',
      href: 'https://github.com/sip-protocol/sip-mobile',
      icon: Github,
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
      title: 'Solana Program',
      description: 'S1PMFs...cX9 (Mainnet)',
      href: 'https://solscan.io/account/S1PMFspo4W6BYKHWkHNF7kZ3fnqibEXg3LQjxepS9at',
      icon: Globe,
      external: true,
    },
    {
      title: 'Core SDK',
      description: '@sip-protocol/sdk',
      href: 'https://www.npmjs.com/package/@sip-protocol/sdk',
      icon: Zap,
      external: true,
    },
  ]

  return (
    <section className="py-16 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">Resources</h2>
          <p className="mt-4 text-gray-400">Explore the code and documentation</p>
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
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-green-500/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <link.icon className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium group-hover:text-green-400 transition-colors flex items-center gap-1">
                  {link.title}
                  {link.external && <ExternalLink className="w-3 h-3" />}
                </div>
                <div className="text-sm text-gray-500 truncate">{link.description}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
