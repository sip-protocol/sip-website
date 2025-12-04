'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, TrendingUp } from 'lucide-react'
import { TEST_COUNTS, SDK_VERSION } from '@/lib/constants'

export function TractionSection() {
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
            Production-Ready, Not Vaporware
          </motion.h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800"
          >
            <h3 className="text-xl font-semibold mb-6">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: TEST_COUNTS.totalDisplay, label: 'Tests Passing' },
                { value: '100%', label: 'Pass Rate' },
                { value: SDK_VERSION.display, label: 'npm Published' },
                { value: 'M8', label: 'Phase 1: 95%' },
              ].map((metric) => (
                <div key={metric.label} className="text-center p-4 rounded-xl bg-gray-800/50">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{metric.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800"
          >
            <h3 className="text-xl font-semibold mb-6">What&apos;s Built</h3>
            <ul className="space-y-3">
              {[
                'Stealth addresses (secp256k1 + ed25519)',
                'Solana native address derivation',
                'Pedersen commitments',
                'Viewing keys for compliance',
                'NEAR Intents adapter',
                'Solana wallet adapter',
                'Noir ZK circuits (compiled)',
                'E2E test coverage (128 tests)',
                'Secure memory handling',
                'npm packages published',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
