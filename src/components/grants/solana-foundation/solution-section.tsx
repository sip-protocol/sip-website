'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Eye, Layers, Lock, Shield } from 'lucide-react'

export function SolutionSection() {
  const solutions = [
    {
      icon: Shield,
      title: 'Stealth Addresses',
      description: 'EIP-5564 adapted for multi-curve (secp256k1 + ed25519). Native Solana support.',
    },
    {
      icon: Lock,
      title: 'Pedersen Commitments',
      description: 'Homomorphic commitments hide amounts while enabling mathematical verification.',
    },
    {
      icon: Eye,
      title: 'Viewing Keys',
      description: 'Selective disclosure for compliance. Auditors can verify without exposing user data.',
    },
    {
      icon: Layers,
      title: 'Privacy Levels',
      description: 'Transparent, Shielded, or Compliant. Users and apps choose their level.',
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
            SIP Protocol: Privacy That Ships
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
          >
            Privacy middleware for Solana and beyond. Plug in our SDK, enable the toggle, done.
          </motion.p>
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
