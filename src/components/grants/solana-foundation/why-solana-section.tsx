'use client'

import { motion } from 'framer-motion'
import { Globe, Target, TrendingUp, Wallet, Zap } from 'lucide-react'

export function WhySolanaSection() {
  const reasons = [
    {
      icon: Zap,
      title: 'High Throughput',
      description: 'Privacy operations require compute. Solana handles it at scale.',
    },
    {
      icon: TrendingUp,
      title: 'Growing DeFi',
      description: 'Jupiter, Raydium, Meteora. Privacy unlocks institutional capital.',
    },
    {
      icon: Wallet,
      title: 'Wallet Ecosystem',
      description: 'Phantom, Solflare, Backpack. Native integration opportunities.',
    },
    {
      icon: Globe,
      title: 'Cross-Chain Hub',
      description: 'Wormhole, NEAR bridge. Privacy makes Solana the private gateway.',
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
            <Target className="w-4 h-4" />
            Why Solana First?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Perfect Fit for Privacy Standard
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
              className="p-6 rounded-2xl bg-purple-950/20 border border-purple-500/20"
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
