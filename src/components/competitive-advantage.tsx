'use client'

import { useState, useEffect } from 'react'

interface Competitor {
  name: string
  color: string
  singleChain: number // 0-100 percentage
  crossChain: number
  compliance: number
  settlement: number
  description: string
}

const competitors: Competitor[] = [
  {
    name: 'Aztec',
    color: 'bg-blue-500',
    singleChain: 90,
    crossChain: 0,
    compliance: 30,
    settlement: 0,
    description: 'Ethereum L2 with private transactions. Single-chain only.',
  },
  {
    name: 'Railgun',
    color: 'bg-orange-500',
    singleChain: 85,
    crossChain: 0,
    compliance: 60,
    settlement: 0,
    description: 'EVM privacy system with shielded balances. EVM chains only.',
  },
  {
    name: 'Penumbra',
    color: 'bg-cyan-500',
    singleChain: 80,
    crossChain: 20,
    compliance: 70,
    settlement: 0,
    description: 'Cosmos-based private DEX. Limited to IBC ecosystem.',
  },
  {
    name: 'SIP Protocol',
    color: 'bg-purple-500',
    singleChain: 95,
    crossChain: 95,
    compliance: 95,
    settlement: 90,
    description: 'Chain-agnostic privacy layer. Works with any blockchain.',
  },
]

const features = [
  {
    id: 'cross-chain',
    name: 'Cross-Chain Privacy',
    tooltip: 'Privacy that works across different blockchains (ETH → SOL, etc.)',
    whyMatters: 'Users hold assets on multiple chains. Single-chain privacy is incomplete.',
  },
  {
    id: 'compliance',
    name: 'Compliance Ready',
    tooltip: 'Viewing keys allow selective disclosure for audits and regulations',
    whyMatters: 'Institutions need privacy AND auditability. Most protocols offer neither.',
  },
  {
    id: 'settlement',
    name: 'Settlement Agnostic',
    tooltip: 'Pluggable backend: NEAR Intents, Mina, direct chain settlement',
    whyMatters: 'No vendor lock-in. Adapt to best settlement option over time.',
  },
  {
    id: 'stealth',
    name: 'Stealth Addresses',
    tooltip: 'One-time addresses prevent transaction linkability (EIP-5564)',
    whyMatters: 'Prevents the refund address attack that breaks other privacy solutions.',
  },
]

const featureMatrix: Record<string, Record<string, boolean>> = {
  'Aztec': { 'cross-chain': false, 'compliance': false, 'settlement': false, 'stealth': true },
  'Railgun': { 'cross-chain': false, 'compliance': true, 'settlement': false, 'stealth': true },
  'Penumbra': { 'cross-chain': false, 'compliance': true, 'settlement': false, 'stealth': true },
  'SIP Protocol': { 'cross-chain': true, 'compliance': true, 'settlement': true, 'stealth': true },
}

export function CompetitiveAdvantage() {
  const [animated, setAnimated] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)
  const [showMatrix, setShowMatrix] = useState(false)

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-10">
      {/* Visual Bar Comparison */}
      <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Single-Chain vs Cross-Chain Privacy</h3>
          <button
            onClick={() => setAnimated(!animated)}
            className="text-xs font-mono text-gray-500 hover:text-purple-400 transition-colors"
          >
            [replay animation]
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-gray-600 to-gray-500" />
            <span className="text-gray-400">Single-Chain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-600 to-pink-500" />
            <span className="text-gray-400">Cross-Chain</span>
          </div>
        </div>

        {/* Competitor Bars */}
        <div className="space-y-4">
          {competitors.map((competitor) => (
            <CompetitorBar
              key={competitor.name}
              competitor={competitor}
              animated={animated}
            />
          ))}
        </div>

        {/* The Point */}
        <div className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
          <p className="text-purple-400 font-semibold">
            SIP is the only protocol with full cross-chain privacy support
          </p>
        </div>
      </div>

      {/* Feature Matrix with Animation */}
      <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Feature Matrix</h3>
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className="px-3 py-1.5 text-xs font-mono rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
          >
            {showMatrix ? 'Hide Details' : 'Show All Features'}
          </button>
        </div>

        {/* Matrix Header */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3 px-4 text-left font-medium text-gray-400 w-40">Protocol</th>
                {features.map((feature) => (
                  <th
                    key={feature.id}
                    className="py-3 px-4 text-center font-medium text-gray-400 relative cursor-help"
                    onMouseEnter={() => setHoveredFeature(feature.id)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <span className="flex items-center justify-center gap-1">
                      {feature.name}
                      <span className="text-gray-600">ⓘ</span>
                    </span>

                    {/* Tooltip */}
                    {hoveredFeature === feature.id && (
                      <div className="absolute z-10 top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 p-3 rounded-lg bg-gray-800 border border-gray-700 shadow-xl text-left">
                        <p className="text-white text-xs mb-2">{feature.tooltip}</p>
                        <p className="text-purple-400 text-xs">
                          <strong>Why it matters:</strong> {feature.whyMatters}
                        </p>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(featureMatrix).map(([protocol, featureSupport], rowIndex) => (
                <tr
                  key={protocol}
                  className={`border-b border-gray-800/50 ${
                    protocol === 'SIP Protocol' ? 'bg-purple-500/5' : ''
                  }`}
                >
                  <td className={`py-3 px-4 font-medium ${
                    protocol === 'SIP Protocol' ? 'text-purple-400' : 'text-gray-300'
                  }`}>
                    {protocol}
                    {protocol === 'SIP Protocol' && (
                      <span className="ml-2 text-xs text-purple-400/60">★</span>
                    )}
                  </td>
                  {features.map((feature, colIndex) => (
                    <td key={feature.id} className="py-3 px-4 text-center">
                      <FeatureCell
                        supported={featureSupport[feature.id]}
                        animated={animated}
                        delay={(rowIndex * 100) + (colIndex * 50)}
                        isHighlight={protocol === 'SIP Protocol' && featureSupport[feature.id]}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Extended Details */}
        {showMatrix && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.id} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <h4 className="font-semibold text-white mb-2">{feature.name}</h4>
                <p className="text-sm text-gray-400 mb-2">{feature.tooltip}</p>
                <p className="text-xs text-purple-400">
                  <strong>Why it matters:</strong> {feature.whyMatters}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* The Moat */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <h3 className="text-lg font-semibold text-center mb-6">The SIP Moat</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <MoatCard
            icon="🌐"
            title="Chain Agnostic"
            description="Works with ETH, SOL, NEAR, and any future chain. Others are locked to one ecosystem."
          />
          <MoatCard
            icon="⚖️"
            title="Compliance Ready"
            description="Viewing keys enable auditor access without compromising user privacy. Enterprise-ready."
          />
          <MoatCard
            icon="🔌"
            title="Settlement Abstraction"
            description="Pluggable backend means no vendor lock-in. Adapt to best settlement option."
          />
        </div>
      </div>

      {/* Quote */}
      <div className="text-center p-6 rounded-2xl bg-gray-900/30 border border-gray-800">
        <blockquote className="text-xl text-gray-300 italic">
          &ldquo;Finally, privacy that works across chains.&rdquo;
        </blockquote>
        <p className="mt-4 text-sm text-gray-500">
          The future of privacy is chain-agnostic
        </p>
      </div>
    </div>
  )
}

function CompetitorBar({
  competitor,
  animated,
}: {
  competitor: Competitor
  animated: boolean
}) {
  const isSIP = competitor.name === 'SIP Protocol'

  return (
    <div className={`p-4 rounded-xl ${isSIP ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-gray-800/50'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`font-medium ${isSIP ? 'text-purple-400' : 'text-gray-300'}`}>
          {competitor.name}
          {isSIP && <span className="ml-2 text-xs">← Only one with both!</span>}
        </span>
        <span className="text-xs text-gray-500">{competitor.description}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Single-Chain Bar */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Single-Chain</div>
          <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                isSIP ? 'bg-gradient-to-r from-purple-600 to-purple-400' : 'bg-gradient-to-r from-gray-600 to-gray-500'
              }`}
              style={{
                width: animated ? `${competitor.singleChain}%` : '0%',
              }}
            />
          </div>
        </div>

        {/* Cross-Chain Bar */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Cross-Chain</div>
          <div className="h-6 bg-gray-800 rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out delay-300 ${
                competitor.crossChain > 0
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500'
                  : ''
              }`}
              style={{
                width: animated ? `${competitor.crossChain}%` : '0%',
              }}
            />
            {competitor.crossChain === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-gray-600">—</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCell({
  supported,
  animated,
  delay,
  isHighlight,
}: {
  supported: boolean
  animated: boolean
  delay: number
  isHighlight: boolean
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setShow(true), delay)
      return () => clearTimeout(timer)
    } else {
      setShow(false)
    }
  }, [animated, delay])

  return (
    <span
      className={`inline-flex items-center justify-center h-6 w-6 rounded-full transition-all duration-300 ${
        show ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      } ${
        supported
          ? isHighlight
            ? 'bg-purple-500/30 text-purple-400'
            : 'bg-green-500/20 text-green-400'
          : 'bg-gray-800 text-gray-600'
      }`}
    >
      {supported ? '✓' : '—'}
    </span>
  )
}

function MoatCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="p-4 rounded-xl bg-gray-900/50 border border-purple-500/20 text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="font-semibold text-purple-400 mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}
