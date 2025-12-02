'use client'

import Link from 'next/link'
import { ArchitectureDiagram } from '@/components/architecture-diagram'
import { TeamSection } from '@/components/team-section'
import { VideoDemo } from '@/components/video-demo'
import { ZachXBTTweet } from '@/components/zachxbt-tweet'
import { HowItWorks } from '@/components/how-it-works'

export default function PitchDeckPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 border-b border-gray-800/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Privacy Protocol
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Zcash Powered
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            SIP Protocol
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-gray-300">
            The Privacy Standard for Web3
          </p>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            One toggle to shield sender, amount, and recipient across any chain.
            Like HTTPS for the internet — but for blockchain transactions.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Try Live Demo
            </Link>
            <a
              href="https://github.com/sip-protocol/sip-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 text-base font-medium text-gray-300 border border-gray-700 rounded-lg hover:border-gray-500 hover:text-white transition-colors"
            >
              View Source
            </a>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-16 border-b border-gray-800/50 bg-gradient-to-b from-purple-900/5 to-transparent">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Demo"
            title="See SIP in Action"
          />
          <div className="mt-10">
            <VideoDemo
              config={{
                youtubeId: 'dQw4w9WgXcQ', // TODO: Replace with actual SIP demo video ID
                title: 'SIP Protocol Demo',
              }}
              caption="One toggle to shield sender, amount, and recipient"
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 border-b border-gray-800/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="The Problem"
            title="Blockchain Transparency is a Bug, Not a Feature"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <ProblemCard
              icon="👁️"
              title="Full Transparency"
              description="Every transaction is publicly visible. Wallet balances, trading patterns, and financial relationships are exposed to anyone."
            />
            <ProblemCard
              icon="🔗"
              title="No Privacy Standard"
              description="Unlike HTTPS for web, there's no unified privacy layer for blockchain. Each chain has fragmented, incompatible solutions."
            />
            <ProblemCard
              icon="⛓️"
              title="Single-Chain Only"
              description="Existing privacy solutions (Aztec, Railgun, Penumbra) work on one chain. Cross-chain privacy doesn't exist."
            />
          </div>
        </div>
      </section>

      {/* ZachXBT Tweet Section */}
      <section className="py-16 border-b border-gray-800/50 bg-gradient-to-b from-red-900/5 to-transparent">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Real World Problem"
            title="This Isn't Theoretical"
          />
          <div className="mt-10">
            <ZachXBTTweet />
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 border-b border-gray-800/50 bg-gradient-to-b from-purple-900/5 to-transparent">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="The Solution"
            title="Privacy as a Standard, Not a Feature"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <SolutionCard
              icon={<ShieldIcon />}
              title="Stealth Addresses"
              description="One-time recipient addresses prevent transaction linkability. Based on EIP-5564 standard."
            />
            <SolutionCard
              icon={<LockIcon />}
              title="Pedersen Commitments"
              description="Cryptographically hide transaction amounts while maintaining verifiability. Homomorphic properties enable proofs."
            />
            <SolutionCard
              icon={<KeyIcon />}
              title="Viewing Keys"
              description="Selective disclosure for compliance. Share keys with auditors without revealing to the public."
            />
          </div>
          <div className="mt-10 p-6 rounded-2xl bg-gray-900/50 border border-gray-800 text-center">
            <p className="text-lg text-gray-300">
              <span className="text-purple-400 font-semibold">Chain-agnostic</span> • Works with any blockchain
            </p>
            <p className="text-lg text-gray-300 mt-2">
              <span className="text-purple-400 font-semibold">Settlement-agnostic</span> • Pluggable backend (NEAR Intents, Mina, direct)
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 border-b border-gray-800/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="How It Works"
            title="Four Steps to Privacy"
          />
          <div className="mt-10">
            <HowItWorks />
          </div>
        </div>
      </section>

      {/* Zcash Integration Section */}
      <section className="py-16 border-b border-gray-800/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Zcash Integration"
            title="Built on Zcash Privacy Technology"
            highlight
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <ZcashFeature
                title="Zcash RPC Client"
                description="Full integration with Zcash's shielded transaction infrastructure. z_sendmany, z_getbalance, and shielded pool operations."
                status="Implemented"
              />
              <ZcashFeature
                title="Viewing Key Design"
                description="SIP's viewing keys are inspired by Zcash's incoming/outgoing viewing key architecture. Selective disclosure for compliance."
                status="Implemented"
              />
              <ZcashFeature
                title="Proof Composition (Future)"
                description="Compose proofs from multiple systems — Zcash's Halo2 for privacy execution, combined with Mina for succinct verification."
                status="Planned"
              />
            </div>
            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-4">
                <ZcashLogo />
                <span className="text-lg font-semibold text-amber-400">Why Zcash?</span>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">✓</span>
                  <span>Battle-tested privacy since 2016 — billions in shielded transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">✓</span>
                  <span>Halo2 proving system — no trusted setup, efficient recursion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">✓</span>
                  <span>Strongest privacy guarantees in production</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">✓</span>
                  <span>Active research community (ECC, Zcash Foundation)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-16 border-b border-gray-800/50 bg-gray-900/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Architecture"
            title="Privacy Middleware for Any Chain"
          />
          <div className="mt-10">
            <ArchitectureDiagram />
          </div>
        </div>
      </section>

      {/* Technical Progress Section */}
      <section className="py-16 border-b border-gray-800/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Technical Progress"
            title="Production-Ready Infrastructure"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard value="837+" label="Tests Passing" sublabel="SDK + Demo" />
            <StatCard value="v0.1.9" label="SDK Version" sublabel="Published on npm" />
            <StatCard value="2" label="Curve Support" sublabel="secp256k1 + ed25519" />
            <StatCard value="3" label="ZK Circuits" sublabel="Noir compiled" />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <ProgressItem
              title="@sip-protocol/sdk"
              description="Core TypeScript SDK with stealth addresses, commitments, viewing keys"
              status="Published"
            />
            <ProgressItem
              title="@sip-protocol/types"
              description="Shared TypeScript types for the ecosystem"
              status="Published"
            />
            <ProgressItem
              title="NEAR Intents Adapter"
              description="Integration with NEAR's cross-chain intent system"
              status="Complete"
            />
            <ProgressItem
              title="Zcash RPC Client"
              description="Full shielded transaction support"
              status="Complete"
            />
            <ProgressItem
              title="Multi-curve Stealth"
              description="Support for both secp256k1 (EVM) and ed25519 (Solana/NEAR)"
              status="Complete"
            />
            <ProgressItem
              title="Noir ZK Circuits"
              description="Funding, Validity, and Fulfillment proofs"
              status="In Progress"
            />
          </div>
        </div>
      </section>

      {/* Competitive Advantage Section */}
      <section className="py-16 border-b border-gray-800/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Competitive Landscape"
            title="How SIP Compares"
          />
          <div className="mt-10 overflow-x-auto">
            <ComparisonTable />
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-16 border-b border-gray-800/50 bg-gradient-to-b from-purple-900/5 to-transparent">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Roadmap"
            title="Path to the Privacy Standard"
          />
          <div className="mt-10">
            <RoadmapTimeline />
          </div>
        </div>
      </section>

      {/* Links Section */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold">Explore SIP Protocol</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <LinkCard
              href="https://github.com/sip-protocol/sip-protocol"
              icon="📦"
              title="GitHub"
              description="Source code & SDK"
            />
            <LinkCard
              href="https://docs.sip-protocol.org"
              icon="📚"
              title="Documentation"
              description="Guides & API reference"
            />
            <LinkCard
              href="/demo"
              icon="🎮"
              title="Live Demo"
              description="Try it yourself"
              internal
            />
            <LinkCard
              href="https://www.npmjs.com/package/@sip-protocol/sdk"
              icon="📦"
              title="npm"
              description="@sip-protocol/sdk"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 border-b border-gray-800/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Built By"
            title="The Team"
          />
          <div className="mt-10">
            <TeamSection />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 border-t border-gray-800/50 bg-gradient-to-t from-purple-900/10 to-transparent">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to add privacy?</h2>
          <p className="mt-4 text-lg text-gray-400">
            Integrate SIP Protocol in minutes. One SDK, any chain, full privacy.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://docs.sip-protocol.org/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Get Started
            </a>
            <Link
              href="/demo"
              className="px-8 py-4 text-lg font-medium text-gray-300 border border-gray-700 rounded-lg hover:border-gray-500 hover:text-white transition-colors"
            >
              Try Demo First
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// ============ HELPER COMPONENTS ============

function SectionHeader({ badge, title, highlight }: { badge: string; title: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
        highlight
          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
      }`}>
        {badge}
      </span>
      <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
    </div>
  )
}

function ProblemCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-red-400 mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

function SolutionCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-500/10 text-green-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-green-400 mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

function ZcashFeature({ title, description, status }: { title: string; description: string; status: string }) {
  return (
    <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          status === 'Implemented' ? 'bg-green-500/20 text-green-400' :
          status === 'Planned' ? 'bg-amber-500/20 text-amber-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

// ArchitectureDiagram is now imported from @/components/architecture-diagram

function StatCard({ value, label, sublabel }: { value: string; label: string; sublabel: string }) {
  return (
    <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 text-center">
      <div className="text-3xl font-bold text-purple-400">{value}</div>
      <div className="mt-1 font-medium">{label}</div>
      <div className="text-sm text-gray-500">{sublabel}</div>
    </div>
  )
}

function ProgressItem({ title, description, status }: { title: string; description: string; status: string }) {
  return (
    <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 flex items-start gap-3">
      <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
        status === 'Published' || status === 'Complete' ? 'bg-green-400' :
        status === 'In Progress' ? 'bg-amber-400' : 'bg-gray-400'
      }`} />
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">{title}</h4>
          <span className={`px-1.5 py-0.5 rounded text-xs ${
            status === 'Published' || status === 'Complete' ? 'bg-green-500/20 text-green-400' :
            status === 'In Progress' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {status}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  )
}

function ComparisonTable() {
  const features = [
    { name: 'Cross-chain', sip: true, aztec: false, railgun: false, penumbra: false },
    { name: 'Chain-agnostic', sip: true, aztec: false, railgun: false, penumbra: false },
    { name: 'Viewing keys (compliance)', sip: true, aztec: false, railgun: true, penumbra: true },
    { name: 'Stealth addresses', sip: true, aztec: true, railgun: true, penumbra: true },
    { name: 'Hidden amounts', sip: true, aztec: true, railgun: true, penumbra: true },
    { name: 'TypeScript SDK', sip: true, aztec: true, railgun: true, penumbra: false },
    { name: 'Zcash integration', sip: true, aztec: false, railgun: false, penumbra: false },
    { name: 'Settlement abstraction', sip: true, aztec: false, railgun: false, penumbra: false },
  ]

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-800">
          <th className="py-3 px-4 text-left font-medium text-gray-400">Feature</th>
          <th className="py-3 px-4 text-center font-medium text-purple-400">SIP</th>
          <th className="py-3 px-4 text-center font-medium text-gray-400">Aztec</th>
          <th className="py-3 px-4 text-center font-medium text-gray-400">Railgun</th>
          <th className="py-3 px-4 text-center font-medium text-gray-400">Penumbra</th>
        </tr>
      </thead>
      <tbody>
        {features.map((f) => (
          <tr key={f.name} className="border-b border-gray-800/50">
            <td className="py-3 px-4 text-gray-300">{f.name}</td>
            <td className="py-3 px-4 text-center">{f.sip ? <Check /> : <Cross />}</td>
            <td className="py-3 px-4 text-center">{f.aztec ? <Check /> : <Cross />}</td>
            <td className="py-3 px-4 text-center">{f.railgun ? <Check /> : <Cross />}</td>
            <td className="py-3 px-4 text-center">{f.penumbra ? <Check /> : <Cross />}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Check() {
  return <span className="text-green-400">✓</span>
}

function Cross() {
  return <span className="text-gray-600">—</span>
}

function RoadmapTimeline() {
  const phases = [
    {
      phase: 'Phase 1',
      title: 'Foundation',
      period: '2024-2025',
      status: 'complete',
      items: ['Core SDK', 'NEAR Intents', 'Zcash RPC', 'Multi-curve stealth', 'npm publish'],
    },
    {
      phase: 'Phase 2',
      title: 'Standard',
      period: '2025-2026',
      status: 'current',
      items: ['Multi-foundation grants', 'Settlement abstraction', 'Wallet partnerships', 'Enterprise features'],
    },
    {
      phase: 'Phase 3',
      title: 'Ecosystem',
      period: '2026+',
      status: 'future',
      items: ['Proof composition', 'SIP-EIP proposal', 'Industry working group', 'Multi-lang SDKs'],
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {phases.map((p) => (
        <div
          key={p.phase}
          className={`p-6 rounded-2xl border ${
            p.status === 'complete' ? 'bg-green-500/5 border-green-500/20' :
            p.status === 'current' ? 'bg-purple-500/5 border-purple-500/30' :
            'bg-gray-900/50 border-gray-800'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              p.status === 'complete' ? 'bg-green-500/20 text-green-400' :
              p.status === 'current' ? 'bg-purple-500/20 text-purple-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {p.phase}
            </span>
            <span className="text-xs text-gray-500">{p.period}</span>
          </div>
          <h3 className="text-lg font-semibold mb-3">{p.title}</h3>
          <ul className="space-y-2">
            {p.items.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  p.status === 'complete' ? 'bg-green-400' :
                  p.status === 'current' ? 'bg-purple-400' : 'bg-gray-600'
                }`} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function LinkCard({ href, icon, title, description, internal }: {
  href: string
  icon: string
  title: string
  description: string
  internal?: boolean
}) {
  const Wrapper = internal ? Link : 'a'
  const props = internal ? { href } : { href, target: '_blank', rel: 'noopener noreferrer' }

  return (
    <Wrapper
      {...props}
      className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/30 transition-colors block"
    >
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Wrapper>
  )
}

// ============ ICONS ============

function ShieldIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

function KeyIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  )
}

function ZcashLogo() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" stroke="#F4B728" strokeWidth="2" />
      <path d="M16 7v4m0 10v4M9 16h4m6 0h4" stroke="#F4B728" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 11l3 3m4 4l3 3M21 11l-3 3m-4 4l-3 3" stroke="#F4B728" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
