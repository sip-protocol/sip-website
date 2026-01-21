/**
 * Centralized roadmap data
 * Single source of truth for all milestone and phase information
 *
 * Last synced with ROADMAP.md: December 29, 2025
 */

export type MilestoneStatus = 'complete' | 'in-progress' | 'planned'
export type PhaseStatus = 'complete' | 'active' | 'upcoming'

export interface Milestone {
  id: string
  title: string
  description: string
  status: MilestoneStatus
  highlights?: string[]
  githubIssue?: number
}

export interface Phase {
  id: number
  name: string
  subtitle: string
  status: PhaseStatus
  progress: number
  period: string
  color: 'indigo' | 'green' | 'emerald' | 'blue' | 'purple' | 'pink'
  milestones: Milestone[]
}

// ============================================================================
// PHASE 1: FOUNDATION (M1-M8) - COMPLETE
// ============================================================================
export const PHASE_1: Phase = {
  id: 1,
  name: 'Foundation',
  subtitle: 'Core SDK & Infrastructure',
  status: 'complete',
  progress: 100,
  period: '2024-2025',
  color: 'indigo',
  milestones: [
    {
      id: 'M1',
      title: 'Architecture & Specification',
      description: 'System design, ZK proof specifications, security model',
      status: 'complete',
      highlights: ['Noir ZK framework', 'EIP-5564 stealth addresses', '3 proof types specified'],
    },
    {
      id: 'M2',
      title: 'Cryptographic Core',
      description: 'Pedersen commitments, stealth addresses (secp256k1 + ed25519)',
      status: 'complete',
      highlights: ['@noble/curves cryptography', 'Multi-curve support', 'XChaCha20-Poly1305 encryption'],
    },
    {
      id: 'M3',
      title: 'SDK Production',
      description: 'TypeScript SDK with comprehensive test coverage',
      status: 'complete',
      highlights: ['2,474 SDK tests', 'Full type safety', 'Tree-shakeable'],
    },
    {
      id: 'M4',
      title: 'Network Integration',
      description: 'NEAR Intents adapter, Zcash RPC client, wallet adapters',
      status: 'complete',
      highlights: ['NEAR 1Click API', 'Zcash shielded support', 'Solana + Ethereum wallets'],
    },
    {
      id: 'M5',
      title: 'Documentation & Launch',
      description: 'API docs, tutorials, Astro Starlight docs site',
      status: 'complete',
      highlights: ['docs.sip-protocol.org', 'Protocol whitepaper', 'Integration guides'],
    },
    {
      id: 'M6',
      title: 'npm Publish',
      description: '@sip-protocol/sdk published to npm registry',
      status: 'complete',
      highlights: ['6 packages published', 'Semantic versioning', 'CI/CD automation'],
    },
    {
      id: 'M7',
      title: 'Demo Integration',
      description: 'Live demo with wallet connection, quotes, swaps',
      status: 'complete',
      highlights: ['sip-protocol.org live', 'Phantom/MetaMask support', 'Real quote fetching'],
    },
    {
      id: 'M8',
      title: 'Production Hardening',
      description: 'Noir circuits, multi-curve stealth, memory zeroization',
      status: 'complete',
      highlights: ['Noir circuits compiled', 'Ed25519 + secp256k1', 'Secure memory handling'],
    },
  ],
}

// ============================================================================
// PHASE 2: STANDARD (M9-M12) - COMPLETE
// ============================================================================
export const PHASE_2: Phase = {
  id: 2,
  name: 'Standard',
  subtitle: 'Multi-Backend & Multi-Chain',
  status: 'complete',
  progress: 100,
  period: '2025',
  color: 'green',
  milestones: [
    {
      id: 'M9',
      title: 'Stable Core',
      description: '100% test passing, Zcash swaps, CI/CD validation pipeline',
      status: 'complete',
      highlights: ['Rock-solid foundation', 'Comprehensive E2E tests', 'Automated CI validation'],
    },
    {
      id: 'M10',
      title: 'ZK Production',
      description: 'Noir wired to SDK, WASM browser proving, Web Worker support',
      status: 'complete',
      highlights: ['BrowserNoirProvider', 'Web Worker proofs', 'No trusted setup'],
    },
    {
      id: 'M11',
      title: 'Multi-Settlement',
      description: 'SettlementBackend interface, SmartRouter, 3 backends',
      status: 'complete',
      highlights: ['NEAR Intents', 'Zcash backend', 'Direct chain backend'],
    },
    {
      id: 'M12',
      title: 'Multi-Chain',
      description: 'Bitcoin Silent Payments, Cosmos IBC, Aptos/Sui support',
      status: 'complete',
      highlights: ['15+ chains supported', 'Bitcoin Silent Payments', 'Move chain derivation'],
    },
  ],
}

// ============================================================================
// PHASE 3: ECOSYSTEM (M13-M15) - COMPLETE
// ============================================================================
export const PHASE_3: Phase = {
  id: 3,
  name: 'Ecosystem',
  subtitle: 'Compliance, DX & Applications',
  status: 'complete',
  progress: 100,
  period: '2025',
  color: 'emerald',
  milestones: [
    {
      id: 'M13',
      title: 'Compliance Layer',
      description: 'Selective disclosure viewing keys, audit trails, compliance proofs',
      status: 'complete',
      highlights: ['Viewing key system', 'Regulatory reporting', 'Institutional ready'],
    },
    {
      id: 'M14',
      title: 'Developer Experience',
      description: '@sip-protocol/react, CLI, API packages with full test coverage',
      status: 'complete',
      highlights: ['React hooks (57 tests)', 'CLI commands (33 tests)', 'REST API (67 tests)'],
    },
    {
      id: 'M15',
      title: 'Application Layer',
      description: 'Universal wallet adapter, hardware wallets, WalletConnect v2',
      status: 'complete',
      highlights: ['Ledger/Trezor support', 'WalletConnect v2', 'Social recovery'],
    },
  ],
}

// ============================================================================
// PHASE 4: SAME-CHAIN EXPANSION (M16-M18) - ACTIVE
// ============================================================================
export const PHASE_4: Phase = {
  id: 4,
  name: 'Same-Chain Expansion',
  subtitle: 'Solana & Ethereum Native Privacy',
  status: 'active',
  progress: 5,
  period: 'Q1-Q2 2026',
  color: 'blue',
  milestones: [
    {
      id: 'M16',
      title: 'Narrative Capture',
      description: 'Content campaign, community building, competitive positioning vs PrivacyCash',
      status: 'in-progress',
      highlights: ['8 technical articles', '15 Twitter threads', 'Discourse 500+ members', '5 dApp LOIs'],
      githubIssue: 384,
    },
    {
      id: 'M17',
      title: 'Solana Same-Chain Privacy',
      description: 'Anchor program with Pedersen commitments, ZK proof verification, Jito relayer',
      status: 'planned',
      highlights: ['shielded_transfer instruction', 'claim_transfer instruction', 'Jupiter DEX integration', 'Jito gas abstraction'],
      githubIssue: 401,
    },
    {
      id: 'M18',
      title: 'Ethereum Same-Chain Privacy',
      description: 'Solidity contract with EIP-5564 stealth, Gelato/ERC-4337 relayer',
      status: 'planned',
      highlights: ['Base, Arbitrum, Optimism L2s', 'Gelato gas abstraction', 'On-chain ZK verifier'],
      githubIssue: 405,
    },
  ],
}

// ============================================================================
// PHASE 5: TECHNICAL MOAT (M19-M22) - FUTURE
// ============================================================================
export const PHASE_5: Phase = {
  id: 5,
  name: 'Technical Moat',
  subtitle: 'Proof Composition & Institutional',
  status: 'upcoming',
  progress: 0,
  period: 'Q3-Q4 2026+',
  color: 'purple',
  milestones: [
    {
      id: 'M19',
      title: 'Mina Integration & Proof Research',
      description: 'Mina Kimchi integration, Zcash cross-chain route, Halo2 + PCD research',
      status: 'planned',
      highlights: ['Mina zkApp exploration', 'SOL → ZEC → NEAR routing', 'Proof composition feasibility'],
      githubIssue: 412,
    },
    {
      id: 'M20',
      title: 'Technical Moat Building',
      description: 'Proof composition v1, BNB Chain support, Oblivious sync service',
      status: 'planned',
      highlights: ['BNB Chain (4.32M daily wallets)', 'Multi-language SDK', 'Protocol revenue'],
      githubIssue: 425,
    },
    {
      id: 'M21',
      title: 'Standard Proposal',
      description: 'SIP-EIP formal specification, industry working group formation',
      status: 'planned',
      highlights: ['SIP-EIP spec', 'Cross-chain privacy standard', 'Compliance framework'],
    },
    {
      id: 'M22',
      title: 'Institutional Custody',
      description: 'Viewing key APIs for Fireblocks, Anchorage, BitGo, Coinbase Prime',
      status: 'planned',
      highlights: ['Fireblocks integration', 'Compliance REST API', 'Time-bound delegation'],
      githubIssue: 426,
    },
  ],
}

// ============================================================================
// ALL PHASES
// ============================================================================
export const ALL_PHASES: Phase[] = [PHASE_1, PHASE_2, PHASE_3, PHASE_4, PHASE_5]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export function getMilestoneById(id: string): Milestone | undefined {
  for (const phase of ALL_PHASES) {
    const milestone = phase.milestones.find((m) => m.id === id)
    if (milestone) return milestone
  }
  return undefined
}

export function getPhaseByMilestoneId(id: string): Phase | undefined {
  return ALL_PHASES.find((phase) => phase.milestones.some((m) => m.id === id))
}

export function getCurrentMilestone(): Milestone | undefined {
  for (const phase of ALL_PHASES) {
    const inProgress = phase.milestones.find((m) => m.status === 'in-progress')
    if (inProgress) return inProgress
  }
  return undefined
}

export function getActivePhase(): Phase | undefined {
  return ALL_PHASES.find((phase) => phase.status === 'active')
}

export function getCompletedMilestoneCount(): number {
  return ALL_PHASES.reduce(
    (count, phase) => count + phase.milestones.filter((m) => m.status === 'complete').length,
    0
  )
}

export function getTotalMilestoneCount(): number {
  return ALL_PHASES.reduce((count, phase) => count + phase.milestones.length, 0)
}

// ============================================================================
// COMPETITIVE POSITIONING
// ============================================================================
export interface Competitor {
  name: string
  chain: string
  privacyMethod: string
  amountHidden: boolean
  arbitraryAmounts: boolean
  viewingKeys: boolean
  compliance: boolean
  crossChain: boolean
  amountCorrelation: 'vulnerable' | 'partial' | 'protected'
  regulatoryRisk: 'high' | 'medium' | 'low'
}

export const COMPETITORS: Competitor[] = [
  {
    name: 'PrivacyCash',
    chain: 'Solana only',
    privacyMethod: 'Pool mixing',
    amountHidden: false,
    arbitraryAmounts: true,
    viewingKeys: false,
    compliance: false,
    crossChain: false,
    amountCorrelation: 'vulnerable',
    regulatoryRisk: 'high',
  },
  {
    name: 'Tornado Cash',
    chain: 'ETH only',
    privacyMethod: 'Pool mixing',
    amountHidden: false,
    arbitraryAmounts: false,
    viewingKeys: false,
    compliance: false,
    crossChain: false,
    amountCorrelation: 'vulnerable',
    regulatoryRisk: 'high',
  },
  {
    name: 'Railgun',
    chain: 'ETH only',
    privacyMethod: 'ZK shielded',
    amountHidden: true,
    arbitraryAmounts: true,
    viewingKeys: false,
    compliance: false,
    crossChain: false,
    amountCorrelation: 'partial',
    regulatoryRisk: 'high',
  },
  {
    name: 'SIP Protocol',
    chain: 'Multi-chain',
    privacyMethod: 'Cryptographic (Pedersen + Stealth)',
    amountHidden: true,
    arbitraryAmounts: true,
    viewingKeys: true,
    compliance: true,
    crossChain: true,
    amountCorrelation: 'protected',
    regulatoryRisk: 'low',
  },
]

export const AMOUNT_CORRELATION_ATTACK = {
  title: 'Amount Correlation Attack',
  description: `Even when a mixer supports arbitrary amounts, if amounts are VISIBLE on-chain,
    they can be correlated. If Alice deposits 1.337 SOL (unique amount), tracking that
    withdrawal is trivial. SIP hides amounts via Pedersen commitments - on-chain observers
    see only opaque cryptographic points.`,
  sipAdvantage: 'Cryptographic privacy, not statistical',
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================
export interface Achievement {
  title: string
  description: string
  date: string
  prize?: string
  link?: string
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    title: 'Zypherpunk Hackathon Winner — 3 Tracks',
    description: 'Won NEAR ($4,000) + Tachyon ($500) + pumpfun ($2,000) tracks at the Zypherpunk Privacy Hackathon',
    date: 'December 2025',
    prize: '$6,500',
    link: 'https://zypherpunk.xyz',
  },
]
