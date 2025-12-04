'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Layers, Network, Shield, Sparkles } from 'lucide-react'

export function VisionSection() {
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
            <Sparkles className="w-4 h-4" />
            The Vision
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            Privacy Standard for Web3
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto"
          >
            SIP is to privacy what HTTPS is to the web. One toggle to shield any transaction.
          </motion.p>
        </div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-8 rounded-2xl bg-gray-900/50 border border-gray-800 font-mono text-sm"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-center">
              <div className="text-gray-400 text-xs mb-2">APPLICATIONS</div>
              <div className="text-white">Wallets &bull; DEXs &bull; DAOs &bull; Payments &bull; Enterprise</div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-purple-400 rotate-90" />
            </div>

            <div className="p-6 rounded-xl bg-purple-950/30 border border-purple-500/30">
              <div className="text-purple-400 font-semibold text-center mb-4">SIP PROTOCOL — THE PRIVACY STANDARD</div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-purple-900/20 border border-purple-500/20">
                  <div className="text-purple-300 text-xs mb-1">PRIVACY LAYER (Core)</div>
                  <div className="text-gray-400 text-xs">Stealth Addresses &bull; Commitments &bull; Viewing Keys</div>
                </div>
                <div className="p-3 rounded-lg bg-pink-900/20 border border-pink-500/20">
                  <div className="text-pink-300 text-xs mb-1">PROOF COMPOSITION (Moat)</div>
                  <div className="text-gray-400 text-xs">Zcash &bull; Mina &bull; Noir</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-blue-400 rotate-90" />
            </div>

            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-center">
              <div className="text-blue-400 text-xs mb-1">SETTLEMENT (Pluggable)</div>
              <div className="text-gray-400">NEAR Intents &bull; Mina &bull; Direct Chain</div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-green-400 rotate-90" />
            </div>

            <div className="p-4 rounded-xl bg-green-950/30 border border-green-500/20 text-center">
              <div className="text-green-400 text-xs mb-1">BLOCKCHAINS</div>
              <div className="text-gray-400">Solana &bull; Ethereum &bull; NEAR &bull; Bitcoin &bull; More</div>
            </div>
          </div>
        </motion.div>

        {/* Key Points */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {[
            { icon: Layers, title: 'Chain-Agnostic', desc: 'Enhance every chain, compete with none' },
            { icon: Network, title: 'Settlement-Agnostic', desc: 'One API, multiple backends' },
            { icon: Shield, title: 'Compliance-Ready', desc: 'Viewing keys for institutions' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 text-center"
            >
              <item.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
