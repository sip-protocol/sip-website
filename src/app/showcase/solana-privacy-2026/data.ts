/**
 * Static data for Solana Privacy 2026 Showcase
 *
 * Contains smart contract information, timeline data, and video configuration
 */

// ============================================================================
// CDN Configuration
// ============================================================================

export const CDN_BASE = 'https://cdn.sip-protocol.org/videos/showcase/solana-privacy-2026'

// ============================================================================
// Video Data
// ============================================================================

export interface Video {
  id: string
  title: string
  description: string
  src: string
  category: 'Getting Started' | 'Privacy Transactions' | 'Compliance'
}

export const videos: Video[] = [
  {
    id: '01-onboarding',
    title: 'Onboarding & Education',
    description: 'Interactive education slides explaining privacy concepts',
    src: `${CDN_BASE}/01-onboarding-education.mp4`,
    category: 'Getting Started',
  },
  {
    id: '02-wallet',
    title: 'Wallet Setup',
    description: 'Create or import wallet with secure key storage',
    src: `${CDN_BASE}/02-wallet-setup.mp4`,
    category: 'Getting Started',
  },
  {
    id: '03-settings',
    title: 'Settings & Navigation',
    description: 'All tabs and settings menu walkthrough',
    src: `${CDN_BASE}/03-settings-all-menus.mp4`,
    category: 'Getting Started',
  },
  {
    id: '04-devnet',
    title: 'Devnet E2E Flow',
    description: 'Send → Scan → Claim cycle on devnet',
    src: `${CDN_BASE}/04-devnet-send-scan-claim.mp4`,
    category: 'Privacy Transactions',
  },
  {
    id: '05-mainnet',
    title: 'Mainnet E2E Flow',
    description: 'Send → Scan → Claim cycle on mainnet',
    src: `${CDN_BASE}/05-mainnet-send-scan-claim.mp4`,
    category: 'Privacy Transactions',
  },
  {
    id: '06-explorer',
    title: 'On-Chain Verification',
    description: 'View transaction on Solscan explorer',
    src: `${CDN_BASE}/06-view-on-explorer.mp4`,
    category: 'Privacy Transactions',
  },
  {
    id: '07-compliant',
    title: 'Compliant Privacy Flow',
    description: 'Send → Scan → Claim with Compliant privacy level',
    src: `${CDN_BASE}/07-compliant-send-scan-claim.mp4`,
    category: 'Compliance',
  },
  {
    id: '08-viewing-keys',
    title: 'Viewing Keys & Compliance',
    description: 'Export viewing keys and compliance dashboard',
    src: `${CDN_BASE}/08-viewing-keys-compliance.mp4`,
    category: 'Compliance',
  },
]

// ============================================================================
// Smart Contracts
// ============================================================================

export interface ProgramInstruction {
  name: string
  description: string
}

export interface ProgramAccount {
  name: string
  description: string
}

export interface MPCCircuit {
  name: string
  purpose: string
  inputs?: string[]
  outputs?: string[]
}

export const SIP_NATIVE_PROGRAM = {
  name: 'SIP Native Program',
  network: 'mainnet-beta' as const,
  programId: 'S1PMFspo4W6BYKHWkHNF7kZ3fnqibEXg3LQjxepS9at',
  configPda: 'BVawZkppFewygA5nxdrLma4ThKx8Th7bW4KTCkcWTZwZ',
  deployTx: '2akhczwV94LJ8HL3xbAmNddBSACZTbYMAoow4LmgjkeVS1hu1H7DTKHFfZrm8DHZ6BBrVn93AjiAQUZjg78iFe8R',
  deployDate: 'Jan 31, 2026',
  instructions: [
    { name: 'shielded_transfer', description: 'Private SOL transfer with Pedersen commitment' },
    { name: 'shielded_token_transfer', description: 'Private SPL token transfer' },
    { name: 'claim_transfer', description: 'Recipient claims with nullifier proof' },
    { name: 'verify_commitment', description: 'On-chain Pedersen verification' },
    { name: 'verify_zk_proof', description: 'ZK proof validation (funding/validity/fulfillment)' },
    { name: 'initialize_config', description: 'Initialize program configuration' },
  ] as ProgramInstruction[],
  accounts: [
    { name: 'Config', description: 'Authority, fees (50 bps), pause status' },
    { name: 'TransferRecord', description: 'Commitment, stealth pubkey, viewing key hash' },
    { name: 'NullifierRecord', description: 'Prevents double-claims' },
  ] as ProgramAccount[],
  securityFeatures: [
    'Pedersen Commitments (hide amounts)',
    'Stealth Addresses (hide recipients)',
    'Viewing Keys (compliance)',
    'Nullifiers (prevent double-spend)',
  ],
}

export const ARCIUM_PROGRAM = {
  name: 'SIP Arcium MPC',
  network: 'devnet' as const,
  status: 'experimental' as const,
  programId: 'S1P5q5497A6oRCUutUFb12LkNQynTNoEyRyUvotmcX9',
  mxeAccount: '5qy4Njk4jCJE4QgZ5dsg8uye3vzFypFTV7o7RRSQ8vr4',
  clusterOffset: 456,
  circuits: [
    {
      name: 'private_transfer',
      purpose: 'Encrypted balance transfer validation',
      inputs: ['sender_balance', 'amount', 'min_balance'],
      outputs: ['is_valid', 'new_balance'],
    },
    {
      name: 'check_balance',
      purpose: 'Threshold check without revealing',
      inputs: ['balance', 'minimum'],
      outputs: ['meets_minimum'],
    },
    {
      name: 'validate_swap',
      purpose: 'Confidential DEX swap verification',
      inputs: ['input_balance', 'input_amount', 'min_output', 'actual_output'],
      outputs: ['is_valid', 'new_balance', 'slippage_ok'],
    },
  ] as MPCCircuit[],
}

// ============================================================================
// Timeline Data
// ============================================================================

export interface TimelinePhase {
  period: string
  commits: number
  repoCount: number
  highlights: string[]
}

export const TIMELINE_DATA = {
  preHackathon: {
    period: 'Q4 2025 - Jan 11, 2026',
    commits: 469,
    repoCount: 5,
    highlights: [
      'Core cryptography (Pedersen, stealth addresses, viewing keys)',
      'Multi-chain support (15+ chains)',
      'NEAR Intents adapter',
      'Zypherpunk Hackathon winner ($6,500, 3 tracks)',
      '6,600+ tests in SDK',
      'React/CLI/API packages',
    ],
  } as TimelinePhase,
  duringHackathon: {
    period: 'Jan 12 - Feb 3, 2026',
    commits: 988,
    repoCount: 8,
    highlights: [
      '3 new repos (sip-app, sip-mobile, sip-arcium-program)',
      'Mainnet deployment (SIP Native Program)',
      '6 privacy provider integrations',
      'Mobile wallet (Expo 52 + Seeker)',
      '17-article blog series',
      'Jupiter DEX integration',
      '$10K Superteam grant approved',
    ],
  } as TimelinePhase,
}

// ============================================================================
// Features
// ============================================================================

export const features = [
  {
    icon: 'Shield',
    title: 'Stealth Addresses',
    description: 'DKSAP (Dual-Key Stealth Address Protocol) for unlinkable transactions',
  },
  {
    icon: 'Lock',
    title: 'Compliant Privacy',
    description: 'Three privacy levels: Transparent, Shielded, and Compliant',
  },
  {
    icon: 'Key',
    title: 'Viewing Keys',
    description: 'Selective disclosure for auditors without spending ability',
  },
  {
    icon: 'Eye',
    title: 'Audit Trail',
    description: "Track who you've shared viewing keys with, revoke anytime",
  },
]

// ============================================================================
// Tech Stack
// ============================================================================

export const techStack = [
  { name: 'Expo SDK 52', description: 'React Native framework', category: 'Mobile' },
  { name: 'NativeWind 4.0', description: 'Tailwind for React Native', category: 'Mobile' },
  { name: 'Anchor', description: 'Solana program framework', category: 'Blockchain' },
  { name: 'noble/curves', description: 'Cryptographic primitives', category: 'Crypto' },
  { name: 'Zustand', description: 'State management', category: 'Frontend' },
  { name: 'SecureStore', description: 'Encrypted key storage', category: 'Security' },
  { name: 'TypeScript', description: 'Type-safe development', category: 'Language' },
  { name: 'Vitest', description: 'Testing framework', category: 'Testing' },
  { name: 'Next.js 15', description: 'Web framework', category: 'Frontend' },
  { name: 'Noir', description: 'ZK circuit language', category: 'Crypto' },
  { name: 'Arcium SDK', description: 'MPC encryption', category: 'Privacy' },
  { name: 'Rust', description: 'Systems programming', category: 'Language' },
]

// ============================================================================
// Resources / Links
// ============================================================================

export const resources = [
  {
    title: 'Mobile Wallet',
    description: 'sip-protocol/sip-mobile',
    href: 'https://github.com/sip-protocol/sip-mobile',
    icon: 'Smartphone',
    external: true,
  },
  {
    title: 'Core SDK',
    description: '@sip-protocol/sdk (npm)',
    href: 'https://www.npmjs.com/package/@sip-protocol/sdk',
    icon: 'Package',
    external: true,
  },
  {
    title: 'Web App',
    description: 'sip-protocol/sip-app',
    href: 'https://github.com/sip-protocol/sip-app',
    icon: 'Globe',
    external: true,
  },
  {
    title: 'Documentation',
    description: 'docs.sip-protocol.org',
    href: 'https://docs.sip-protocol.org',
    icon: 'FileText',
    external: true,
  },
  {
    title: 'SIP Native Program',
    description: 'Mainnet (Solscan)',
    href: 'https://solscan.io/account/S1PMFspo4W6BYKHWkHNF7kZ3fnqibEXg3LQjxepS9at',
    icon: 'Blocks',
    external: true,
  },
  {
    title: 'Arcium MPC Program',
    description: 'Devnet (Solscan)',
    href: 'https://solscan.io/account/S1P5q5497A6oRCUutUFb12LkNQynTNoEyRyUvotmcX9?cluster=devnet',
    icon: 'Shield',
    external: true,
  },
  {
    title: 'Blog',
    description: 'blog.sip-protocol.org',
    href: 'https://blog.sip-protocol.org',
    icon: 'BookOpen',
    external: true,
  },
  {
    title: 'Download APK',
    description: 'v0.1.6 (Android/Seeker)',
    href: 'https://github.com/sip-protocol/sip-mobile/releases/tag/v0.1.6',
    icon: 'Download',
    external: true,
  },
]
