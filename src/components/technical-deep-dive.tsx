'use client'

import { useState } from 'react'

interface DeepDiveSection {
  id: string
  title: string
  summary: string
  icon: React.ReactNode
  standard?: string
  formula?: string
  properties?: string[]
  codeSnippet: string
  codeFile: string
  githubUrl: string
  explanation: string[]
}

const sections: DeepDiveSection[] = [
  {
    id: 'stealth',
    title: 'Stealth Addresses',
    summary: 'One-time recipient addresses prevent transaction linkability',
    icon: <ShieldIcon />,
    standard: 'EIP-5564',
    formula: 'A = Q + hash(r · P) · G',
    properties: [
      'Unlinkable: Each transaction uses unique address',
      'Non-interactive: Sender derives without recipient online',
      'Scannable: Recipient can detect incoming funds',
    ],
    codeSnippet: `// Generate stealth meta-address
const { metaAddress, spendingPrivateKey, viewingPrivateKey } =
  generateStealthMetaAddress('ethereum')

// metaAddress contains:
// - spendingKey (P): for receiving funds
// - viewingKey (Q): for scanning transactions

// Sender generates stealth address for recipient
const { stealthAddress, ephemeralPublicKey } =
  generateStealthAddress(recipientMetaAddress)

// Recipient scans and recovers
const recovered = recoverStealthAddress(
  ephemeralPublicKey,
  viewingPrivateKey,
  spendingPrivateKey
)`,
    codeFile: 'packages/sdk/src/stealth.ts',
    githubUrl: 'https://github.com/sip-protocol/sip-protocol/blob/main/packages/sdk/src/stealth.ts',
    explanation: [
      'Recipient publishes meta-address (P, Q) - spending and viewing public keys',
      'Sender generates random ephemeral keypair (r, R = r·G)',
      'Sender computes shared secret: S = r · P',
      'Sender derives stealth address: A = Q + hash(S) · G',
      'Recipient scans: for each R, compute S = p · R, check if A matches',
    ],
  },
  {
    id: 'pedersen',
    title: 'Pedersen Commitments',
    summary: 'Cryptographically hide amounts while maintaining verifiability',
    icon: <LockIcon />,
    formula: 'C = v · G + r · H',
    properties: [
      'Hiding: Cannot determine value from commitment',
      'Binding: Cannot open to different value',
      'Homomorphic: C(a) + C(b) = C(a + b)',
    ],
    codeSnippet: `import { commit, verifyOpening, add } from '@sip-protocol/sdk'

// Create commitment to amount (hides the value)
const { commitment, blinding } = commit(1000000n) // 1 USDC

// Verify opening (proves you know value + blinding)
const valid = verifyOpening(commitment, 1000000n, blinding)

// Homomorphic addition (for balance proofs)
const c1 = commit(500n, blinding1)
const c2 = commit(300n, blinding2)
const sum = add(c1.commitment, c2.commitment)
// sum commits to 800 with combined blinding`,
    codeFile: 'packages/sdk/src/commitment.ts',
    githubUrl: 'https://github.com/sip-protocol/sip-protocol/blob/main/packages/sdk/src/commitment.ts',
    explanation: [
      'G is the secp256k1 generator (base point)',
      'H is a "nothing-up-my-sleeve" point where log_G(H) is unknown',
      'v is the value being committed, r is random blinding factor',
      'Hiding: Without r, cannot distinguish C(100) from C(1000000)',
      'Homomorphic property enables range proofs and balance verification',
    ],
  },
  {
    id: 'viewing',
    title: 'Viewing Keys',
    summary: 'Selective disclosure for compliance without compromising privacy',
    icon: <KeyIcon />,
    standard: 'XChaCha20-Poly1305',
    properties: [
      'Hierarchical: Derive scoped keys from master',
      'Revocable: Time-limited or scope-limited access',
      'Auditable: Prove transaction details to regulators',
    ],
    codeSnippet: `import {
  generateViewingKey,
  deriveViewingKey,
  encryptForViewing,
  decryptWithViewing
} from '@sip-protocol/sdk'

// Generate master viewing key
const masterKey = generateViewingKey()

// Derive scoped key for auditor (2024 only)
const auditorKey = deriveViewingKey(masterKey, 'auditor/2024')

// Encrypt transaction details
const encrypted = encryptForViewing(txDetails, masterKey)

// Auditor decrypts with their scoped key
const decrypted = decryptWithViewing(encrypted, auditorKey)`,
    codeFile: 'packages/sdk/src/privacy.ts',
    githubUrl: 'https://github.com/sip-protocol/sip-protocol/blob/main/packages/sdk/src/privacy.ts',
    explanation: [
      'Master key derived from wallet signature or generated randomly',
      'Child keys derived via HKDF with path-based scoping',
      'Encryption uses XChaCha20-Poly1305 (24-byte nonce, authenticated)',
      'Path format: "purpose/scope" e.g., "auditor/2024", "legal/compliance"',
      'Revocation: Simply stop sharing the derived key path',
    ],
  },
]

export function TechnicalDeepDive() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleSection = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const expandAll = () => {
    setExpandedIds(new Set(sections.map((s) => s.id)))
  }

  const collapseAll = () => {
    setExpandedIds(new Set())
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex justify-end gap-2 mb-6">
        <button
          onClick={expandAll}
          className="px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-purple-400 transition-colors"
        >
          [expand all]
        </button>
        <button
          onClick={collapseAll}
          className="px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-purple-400 transition-colors"
        >
          [collapse all]
        </button>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <DeepDiveCard
          key={section.id}
          section={section}
          isExpanded={expandedIds.has(section.id)}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  )
}

function DeepDiveCard({
  section,
  isExpanded,
  onToggle,
}: {
  section: DeepDiveSection
  isExpanded: boolean
  onToggle: () => void
}) {
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    await navigator.clipboard.writeText(section.codeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-gray-800 overflow-hidden bg-gray-900/30">
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center gap-4 hover:bg-gray-800/30 transition-colors text-left"
      >
        <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-green-500/10 text-green-400 flex-shrink-0">
          {section.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-white">{section.title}</h3>
            {section.standard && (
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-purple-500/20 text-purple-400">
                {section.standard}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">{section.summary}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500 font-mono hidden sm:block">
            {isExpanded ? 'collapse' : 'expand'}
          </span>
          <span
            className={`text-gray-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          >
            ▼
          </span>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-800 p-6 space-y-6">
          {/* Formula */}
          {section.formula && (
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center">
              <code className="text-xl font-mono text-purple-400">{section.formula}</code>
            </div>
          )}

          {/* Properties */}
          {section.properties && (
            <div className="grid gap-2 sm:grid-cols-3">
              {section.properties.map((prop, i) => (
                <div key={i} className="p-3 rounded-lg bg-gray-800/50 text-sm">
                  <span className="text-green-400">✓</span>{' '}
                  <span className="text-gray-300">{prop}</span>
                </div>
              ))}
            </div>
          )}

          {/* How it works */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">How it works:</h4>
            <ol className="space-y-2">
              {section.explanation.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-800 text-gray-500 text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Code Snippet */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-gray-500">{section.codeFile}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyCode}
                  className="px-2 py-1 text-xs font-mono text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <span className="text-green-400">✓</span> copied
                    </>
                  ) : (
                    <>
                      <CopyIcon /> copy
                    </>
                  )}
                </button>
                <a
                  href={section.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 text-xs font-mono text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  <GithubIcon /> source
                </a>
              </div>
            </div>
            <pre className="p-4 rounded-xl bg-gray-950 border border-gray-800 overflow-x-auto">
              <code className="text-xs sm:text-sm font-mono text-gray-300 whitespace-pre">
                {section.codeSnippet}
              </code>
            </pre>
          </div>

          {/* Try it link */}
          <div className="flex justify-center">
            <a
              href="https://app.sip-protocol.org/dex"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors text-sm"
            >
              <span>🎮</span>
              Try it in the Demo
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// Icons
function ShieldIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  )
}

function KeyIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
      />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
      />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}
