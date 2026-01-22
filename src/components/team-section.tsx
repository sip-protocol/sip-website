'use client'

import { Github, ArrowRight } from 'lucide-react'
import { FounderProfile } from '@/components/founder-profile'
import type { FounderData } from '@/lib/founder-data'

interface TeamSectionProps {
  founderData: FounderData
}

export function TeamSection({ founderData }: TeamSectionProps) {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Meet the Team
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Building the privacy layer that Web3 deserves
          </p>
        </div>

        {/* Use the rich FounderProfile component with live data */}
        <FounderProfile data={founderData} />

        {/* Join the team CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Interested in contributing to privacy infrastructure?
          </p>
          <a
            href="https://github.com/sip-protocol/sip-protocol/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>Check out open issues on GitHub</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
