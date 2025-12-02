'use client'

import { motion } from 'framer-motion'

/**
 * ZachXBT Tweet Card
 *
 * Styled quote card referencing the refund address linkability issue
 * discovered by ZachXBT. Used in pitch-deck for instant credibility.
 */
export function ZachXBTTweet() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="max-w-2xl mx-auto"
    >
      <a
        href="https://x.com/zachxbt/status/1980612190609576229"
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="relative rounded-2xl border border-gray-700 bg-gray-900/80 p-6 hover:border-gray-600 transition-colors">
          {/* Twitter/X Logo */}
          <div className="absolute top-4 right-4">
            <svg className="h-5 w-5 text-gray-600 group-hover:text-gray-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>

          {/* Author */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-lg font-bold text-white">Z</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">ZachXBT</span>
                <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.52 3.59a3.51 3.51 0 016.96 0l.08.5a1.51 1.51 0 002.17.95l.43-.26a3.51 3.51 0 014.92 4.92l-.26.43a1.51 1.51 0 00.95 2.17l.5.08a3.51 3.51 0 010 6.96l-.5.08a1.51 1.51 0 00-.95 2.17l.26.43a3.51 3.51 0 01-4.92 4.92l-.43-.26a1.51 1.51 0 00-2.17.95l-.08.5a3.51 3.51 0 01-6.96 0l-.08-.5a1.51 1.51 0 00-2.17-.95l-.43.26a3.51 3.51 0 01-4.92-4.92l.26-.43a1.51 1.51 0 00-.95-2.17l-.5-.08a3.51 3.51 0 010-6.96l.5-.08a1.51 1.51 0 00.95-2.17l-.26-.43a3.51 3.51 0 014.92-4.92l.43.26a1.51 1.51 0 002.17-.95l.08-.5z" />
                  <path fill="white" d="M9.307 12.248a.75.75 0 10-1.114 1.004l1.114-1.004zM11 14.25l-.557.502a.75.75 0 001.114 0L11 14.25zm4.807-4.002a.75.75 0 00-1.114-1.004l1.114 1.004zm-7.5 1.504l2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004zm3.364 2.5l3.75-4.166-1.114-1.004-3.75 4.166 1.114 1.004z" />
                </svg>
              </div>
              <span className="text-sm text-gray-500">@zachxbt</span>
            </div>
          </div>

          {/* Tweet Content */}
          <div className="space-y-3">
            <p className="text-lg text-gray-200 leading-relaxed">
              &ldquo;Refund address linkability de-anonymizes users of shielded pools.
              <span className="text-red-400 font-medium"> The same address used for deposits
              appears in refunds</span>, breaking privacy guarantees.&rdquo;
            </p>

            {/* Highlighted Problem */}
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-400">The Problem</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Cross-chain privacy breaks when refund addresses link back to your wallet
                  </p>
                </div>
              </div>
            </div>

            {/* SIP Solution */}
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-400">SIP&apos;s Solution</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Stealth addresses generate unique, unlinkable refund destinations
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
            <span className="text-sm text-gray-500">Oct 2025</span>
            <span className="text-sm text-gray-500 group-hover:text-purple-400 transition-colors">
              View on X →
            </span>
          </div>
        </div>
      </a>
    </motion.div>
  )
}
