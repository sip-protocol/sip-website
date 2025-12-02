'use client'

import { useState } from 'react'

export function CypherpunkManifesto() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="relative">
      {/* Terminal-style header */}
      <div className="mb-8 font-mono text-sm text-gray-500">
        <span className="text-green-400">$</span> cat manifesto.txt
      </div>

      {/* Main quote */}
      <blockquote className="relative pl-6 border-l-2 border-green-500/50">
        <p className="text-2xl sm:text-3xl font-light text-gray-200 leading-relaxed">
          &ldquo;Privacy is necessary for an open society in the electronic age.&rdquo;
        </p>
        <footer className="mt-4 text-gray-400">
          <cite className="not-italic">
            — <span className="text-green-400">Eric Hughes</span>, A Cypherpunk&apos;s Manifesto, 1993
          </cite>
        </footer>
      </blockquote>

      {/* Cypherpunk principles */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <PrincipleCard
          icon="🔐"
          title="Privacy is a Right"
          description="Not a privilege granted by corporations or governments. Privacy is fundamental to human dignity and freedom."
          ascii="[ ENCRYPT ]"
        />
        <PrincipleCard
          icon="⚡"
          title="Code is Speech"
          description="We write code because software cannot be uninvented. Mathematics and cryptography are our tools of liberation."
          ascii="[ DEPLOY ]"
        />
        <PrincipleCard
          icon="🌐"
          title="Privacy by Default"
          description="We don't ask permission to be private. Privacy should be the default, not an opt-in afterthought."
          ascii="[ SHIELD ]"
        />
      </div>

      {/* Extended manifesto (collapsible) */}
      <div className="mt-10">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors font-mono"
        >
          <span className="text-green-400">$</span>
          {expanded ? 'less manifesto.txt' : 'more manifesto.txt'}
          <span className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {expanded && (
          <div className="mt-6 p-6 rounded-xl bg-gray-900/80 border border-green-500/20 font-mono text-sm space-y-4">
            <ManifestoLine>
              Privacy is not about having something to hide.
            </ManifestoLine>
            <ManifestoLine>
              Privacy is about having something to protect.
            </ManifestoLine>
            <ManifestoLine>
              We the Cypherpunks are dedicated to building anonymous systems.
            </ManifestoLine>
            <ManifestoLine>
              We are defending our privacy with cryptography, with anonymous mail
              forwarding systems, with digital signatures, and with electronic money.
            </ManifestoLine>
            <ManifestoLine highlight>
              Cypherpunks write code.
            </ManifestoLine>
          </div>
        )}
      </div>

      {/* Cypherpunk lineage */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-gray-900/50 to-green-900/10 border border-green-500/20">
        <h3 className="text-lg font-semibold text-green-400 mb-6 font-mono">
          <span className="text-gray-500"># </span>Standing on the shoulders of giants
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Pioneer
            name="Eric Hughes"
            contribution="A Cypherpunk's Manifesto"
            year="1993"
          />
          <Pioneer
            name="Timothy C. May"
            contribution="The Crypto Anarchist Manifesto"
            year="1988"
          />
          <Pioneer
            name="Nick Szabo"
            contribution="Bit Gold, Smart Contracts"
            year="1998"
          />
          <Pioneer
            name="Zooko Wilcox"
            contribution="Zcash, zk-SNARKs"
            year="2016"
          />
        </div>
      </div>

      {/* Call to action */}
      <div className="mt-10 text-center">
        <p className="text-lg text-gray-300 mb-4">
          SIP continues the cypherpunk mission:
        </p>
        <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Permissionless privacy for everyone.
        </p>
        <p className="mt-4 text-sm text-gray-500 font-mono">
          {/* Terminal-style comment */}
          {'// We don\'t ask permission to be private.'}
        </p>
      </div>
    </div>
  )
}

function PrincipleCard({
  icon,
  title,
  description,
  ascii,
}: {
  icon: string
  title: string
  description: string
  ascii: string
}) {
  return (
    <div className="p-6 rounded-2xl bg-gray-900/50 border border-green-500/20 hover:border-green-500/40 transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span className="text-xs font-mono text-green-400/50 group-hover:text-green-400 transition-colors">
          {ascii}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-green-400 mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

function Pioneer({
  name,
  contribution,
  year,
}: {
  name: string
  contribution: string
  year: string
}) {
  return (
    <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
      <div className="text-xs text-green-400 font-mono mb-1">{year}</div>
      <div className="font-semibold text-white">{name}</div>
      <div className="text-xs text-gray-500 mt-1">{contribution}</div>
    </div>
  )
}

function ManifestoLine({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <p className={`${highlight ? 'text-green-400 font-bold' : 'text-gray-300'}`}>
      <span className="text-gray-600 mr-2">&gt;</span>
      {children}
    </p>
  )
}

// ASCII art version for terminal vibes
export function CypherpunkAscii() {
  return (
    <pre className="text-[8px] sm:text-xs text-green-400/60 font-mono leading-none select-none">
{`
   ██████╗██╗   ██╗██████╗ ██╗  ██╗███████╗██████╗ ██████╗ ██╗   ██╗███╗   ██╗██╗  ██╗
  ██╔════╝╚██╗ ██╔╝██╔══██╗██║  ██║██╔════╝██╔══██╗██╔══██╗██║   ██║████╗  ██║██║ ██╔╝
  ██║      ╚████╔╝ ██████╔╝███████║█████╗  ██████╔╝██████╔╝██║   ██║██╔██╗ ██║█████╔╝
  ██║       ╚██╔╝  ██╔═══╝ ██╔══██║██╔══╝  ██╔══██╗██╔═══╝ ██║   ██║██║╚██╗██║██╔═██╗
  ╚██████╗   ██║   ██║     ██║  ██║███████╗██║  ██║██║     ╚██████╔╝██║ ╚████║██║  ██╗
   ╚═════╝   ╚═╝   ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝
`}
    </pre>
  )
}
