'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Github,
  Globe,
  ChevronDown,
} from 'lucide-react'
import { TEST_COUNTS, SDK_VERSION } from '@/lib/constants'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 w-full">
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

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Globe className="w-4 h-4" />
                Privacy Standard for Web3
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              SIP Protocol
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl sm:text-2xl text-gray-400"
            >
              The Privacy Standard for Solana Ecosystem
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 text-gray-500 max-w-lg"
            >
              Privacy middleware for Web3 — like HTTPS for the internet. One toggle to shield
              any transaction. Chain-agnostic. Settlement-agnostic. Starting with Solana.
            </motion.p>

            {/* Amount */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-purple-500/10 border border-purple-500/20"
            >
              <div>
                <div className="text-sm text-gray-400">Requesting</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  $100,000
                </div>
              </div>
              <div className="h-12 w-px bg-purple-500/20" />
              <div>
                <div className="text-sm text-gray-400">Timeline</div>
                <div className="text-xl font-semibold text-white">6 Months</div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a
                href="https://app.sip-protocol.org/dex"
                className="px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
              >
                Try Live Demo
              </a>
              <a
                href="https://github.com/sip-protocol/sip-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-gray-300 border border-gray-700 rounded-lg hover:text-white hover:border-gray-600 transition-all font-medium flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                View Source
              </a>
            </motion.div>
          </div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-8 rounded-3xl bg-gray-900/50 border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-6 text-gray-400">Key Metrics</h3>
            <div className="space-y-6">
              {[
                { label: 'Tests Passing', value: TEST_COUNTS.totalDisplay, detail: TEST_COUNTS.detailDisplay },
                { label: 'npm Package', value: 'Published', detail: SDK_VERSION.full },
                { label: 'Phase 1', value: '95%', detail: 'M1-M8 in progress' },
                { label: 'Status', value: 'Live', detail: 'sip-protocol.org' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-400">{item.label}</div>
                    <div className="text-sm text-gray-600">{item.detail}</div>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-gray-600 animate-bounce" />
        </motion.div>
      </div>
    </section>
  )
}
