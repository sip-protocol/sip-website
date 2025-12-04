'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Eye, Globe, Users } from 'lucide-react'

export function ProblemSection() {
  const problems = [
    {
      icon: AlertTriangle,
      title: 'Privacy Projects Failed',
      points: [
        'Elusiv sunset Feb 2024',
        'Light Protocol pivoted to ZK Compression',
        'Otter Cash never launched',
      ],
    },
    {
      icon: Eye,
      title: 'No Privacy Standard',
      points: [
        'No EIP-5564 for Solana',
        'Developers have no tools',
        'Each project builds from scratch',
      ],
    },
    {
      icon: Globe,
      title: 'Cross-Chain Privacy Gap',
      points: [
        'Wormhole: transparent',
        'deBridge: transparent',
        'All bridges leak data',
      ],
    },
    {
      icon: Users,
      title: 'Institutional Blockers',
      points: [
        'No compliance features',
        'All-or-nothing privacy',
        'Regulatory uncertainty',
      ],
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
            Privacy on Solana Has No Standard
          </motion.h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
              <h3 className="text-lg font-semibold mb-3">{problem.title}</h3>
              <ul className="space-y-2">
                {problem.points.map((point) => (
                  <li key={point} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
