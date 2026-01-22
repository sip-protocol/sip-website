'use client'

import { motion } from 'framer-motion'
import { Code } from 'lucide-react'
import { FounderProfile } from '@/components/founder-profile'
import type { FounderData } from '@/lib/founder-data'

interface FounderSectionProps {
  founderData: FounderData
  /** Badge text, defaults to "The Founder" */
  badge?: string
  /** Title text, defaults to "Built by a Developer, for Developers" */
  title?: string
  /** Subtitle text */
  subtitle?: string
}

export function FounderSection({
  founderData,
  badge = 'The Founder',
  title = 'Built by a Developer, for Developers',
  subtitle,
}: FounderSectionProps) {
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
            <Code className="w-4 h-4" />
            {badge}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-4xl font-bold"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mt-4 text-gray-400"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        <FounderProfile data={founderData} />
      </div>
    </section>
  )
}
