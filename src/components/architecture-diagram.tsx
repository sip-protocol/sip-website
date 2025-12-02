'use client'

import { motion } from 'framer-motion'

// Application badges for the top layer
const applications = [
  { name: 'Wallets', icon: '👛' },
  { name: 'DEXs', icon: '🔄' },
  { name: 'DAOs', icon: '🏛️' },
  { name: 'Payments', icon: '💳' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'Enterprise', icon: '🏢' },
]

// Privacy layer features
const privacyFeatures = [
  'Stealth Addresses',
  'Pedersen Commitments',
  'Viewing Keys',
  'Privacy Levels',
  'Unified API',
  'Compliance Ready',
]

// Proof composition features
const proofFeatures = [
  { name: 'Zcash', description: 'Privacy execution' },
  { name: 'Mina', description: 'Succinct verification' },
  { name: 'Noir', description: 'Validity proofs' },
]

// Settlement options
const settlements = [
  { name: 'NEAR Intents', status: 'live' },
  { name: 'Mina', status: 'planned' },
  { name: 'Direct Chain', status: 'planned' },
]

// Blockchain layer
const chains = [
  { name: 'Ethereum', short: 'ETH' },
  { name: 'Solana', short: 'SOL' },
  { name: 'NEAR', short: 'NEAR' },
  { name: 'Bitcoin', short: 'BTC' },
  { name: 'Cosmos', short: 'ATOM' },
  { name: 'Move', short: 'MOVE' },
]

// Animated arrow component
function ConnectorArrow({ label, delay = 0 }: { label?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      className="flex flex-col items-center py-3 sm:py-4"
    >
      <div className="h-6 sm:h-8 w-px bg-gradient-to-b from-purple-500/50 to-purple-500/20" />
      {label && (
        <span className="my-2 text-xs sm:text-sm text-gray-500 italic text-center px-2">
          &ldquo;{label}&rdquo;
        </span>
      )}
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="text-purple-400"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

// Layer wrapper component
function Layer({
  children,
  highlighted,
  delay = 0,
}: {
  children: React.ReactNode
  highlighted?: boolean
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`rounded-2xl border p-4 sm:p-6 ${
        highlighted
          ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/10 border-purple-500/30 shadow-lg shadow-purple-500/10'
          : 'bg-gray-900/50 border-gray-800'
      }`}
    >
      {children}
    </motion.div>
  )
}

// Badge component
function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'purple' | 'amber' | 'green'
}) {
  const variants = {
    default: 'bg-gray-800 text-gray-300 border-gray-700',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border ${variants[variant]}`}
    >
      {children}
    </span>
  )
}

export function ArchitectureDiagram() {
  return (
    <div className="space-y-2">
      {/* Applications Layer */}
      <Layer delay={0}>
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Applications
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {applications.map((app, i) => (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              viewport={{ once: true }}
            >
              <Badge>
                <span className="mr-1.5">{app.icon}</span>
                {app.name}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Layer>

      <ConnectorArrow label="Add privacy with one toggle" delay={0.2} />

      {/* SIP Protocol Layer - Highlighted */}
      <Layer highlighted delay={0.3}>
        <div className="text-center mb-4 sm:mb-6">
          <Badge variant="purple">◄ WE ARE HERE</Badge>
          <h3 className="mt-3 text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            SIP Protocol — The Privacy Standard
          </h3>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* Privacy Layer Card */}
          <div className="p-4 rounded-xl bg-gray-900/70 border border-gray-700">
            <h4 className="text-sm font-semibold text-purple-400 mb-3">Privacy Layer</h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {privacyFeatures.map((feature, i) => (
                <motion.span
                  key={feature}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  viewport={{ once: true }}
                  className="inline-block px-2 py-1 text-xs rounded bg-purple-500/10 text-purple-300 border border-purple-500/20"
                >
                  {feature}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Proof Composition Card */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
            <h4 className="text-sm font-semibold text-amber-400 mb-3">
              Proof Composition
              <span className="ml-2 text-xs font-normal text-gray-500">(Future)</span>
            </h4>
            <div className="space-y-2">
              {proofFeatures.map((proof, i) => (
                <motion.div
                  key={proof.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="text-amber-400 font-medium">{proof.name}</span>
                  <span className="text-gray-500">→</span>
                  <span className="text-gray-400">{proof.description}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Layer>

      <ConnectorArrow label="Settle anywhere" delay={0.5} />

      {/* Settlement Layer */}
      <Layer delay={0.6}>
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Settlement Layer
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {settlements.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
              viewport={{ once: true }}
            >
              <Badge variant={s.status === 'live' ? 'green' : 'default'}>
                {s.name}
                {s.status === 'live' && (
                  <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                )}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Layer>

      <ConnectorArrow delay={0.8} />

      {/* Blockchain Layer */}
      <Layer delay={0.9}>
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Blockchain Layer
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {chains.map((chain, i) => (
            <motion.div
              key={chain.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.0 + i * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <Badge>
                <span className="group-hover:hidden">{chain.short}</span>
                <span className="hidden group-hover:inline">{chain.name}</span>
              </Badge>
            </motion.div>
          ))}
        </div>
      </Layer>
    </div>
  )
}
