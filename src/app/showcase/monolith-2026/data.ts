/**
 * Static data for MONOLITH Hackathon 2026 Showcase
 *
 * 2nd Solana Mobile Hackathon | $125K+ Prize Pool
 * Submission: SIP Privacy — THE Privacy Wallet for Seeker
 */

// ============================================================================
// CDN Configuration
// ============================================================================

export const CDN_BASE = 'https://cdn.sip-protocol.org/videos/showcase/monolith-2026'

// ============================================================================
// Video Data
// ============================================================================

export interface Video {
  id: string
  title: string
  description: string
  src: string
  category: 'Core Privacy' | 'DeFi Privacy' | 'Wallet Management'
  isPlaceholder?: boolean
}

export const videos: Video[] = [
  {
    id: '01-private-swap',
    title: 'Private Swap (Jupiter)',
    description: 'Full swap flow — privacy toggle, Jupiter quote, stealth ATA output, scan, and claim',
    src: `${CDN_BASE}/01-private-swap.mp4`,
    category: 'DeFi Privacy',
    isPlaceholder: false,
  },
  {
    id: '02-core-privacy',
    title: 'Core Privacy',
    description: 'Send shielded payments, receive via stealth address, scan and claim — full privacy cycle',
    src: `${CDN_BASE}/02-core-privacy.mp4`,
    category: 'Core Privacy',
    isPlaceholder: false,
  },
  {
    id: '03-multi-wallet',
    title: 'Multi-Wallet',
    description: 'Create, switch, and manage multiple accounts',
    src: `${CDN_BASE}/03-multi-wallet.mp4`,
    category: 'Wallet Management',
    isPlaceholder: false,
  },
  {
    id: '04-settings-sidebar',
    title: 'Settings & Sidebar',
    description: 'Full settings hub, sidebar navigation, network config, display preferences',
    src: `${CDN_BASE}/04-settings-sidebar.mp4`,
    category: 'Wallet Management',
    isPlaceholder: false,
  },
]

// ============================================================================
// What's New in v0.2.0
// ============================================================================

export interface WhatsNewItem {
  title: string
  description: string
  icon: string
  color: 'green' | 'cyan' | 'purple' | 'amber'
}

export const whatsNew: WhatsNewItem[] = [
  {
    title: 'Private Swaps',
    description: 'Jupiter DEX integration with stealth address output. Swap any token privately — output goes directly to a one-time stealth ATA.',
    icon: 'ArrowLeftRight',
    color: 'green',
  },
  {
    title: 'Multi-Wallet',
    description: 'Create and manage multiple accounts. Switch between wallets instantly from the sidebar with account picker.',
    icon: 'Wallet',
    color: 'cyan',
  },
  {
    title: 'SPL Token Privacy',
    description: 'Full privacy support for any SPL token — not just SOL. Send, receive, and claim tokens like USDC, SKR privately.',
    icon: 'Coins',
    color: 'purple',
  },
  {
    title: 'Settings Hub',
    description: 'Complete settings page with network selection, RPC provider, block explorer preference, and display options.',
    icon: 'Settings',
    color: 'amber',
  },
]

// ============================================================================
// Judging Criteria (from MONOLITH hackathon)
// ============================================================================

export interface JudgingCriterion {
  name: string
  weight: string
  description: string
  sipAnswer: string
  icon: string
  color: 'green' | 'cyan' | 'purple' | 'amber'
}

export const judgingCriteria: JudgingCriterion[] = [
  {
    name: 'Stickiness / PMF',
    weight: '25%',
    description: 'Does the product solve a real problem? Would users come back?',
    sipAnswer: 'Privacy is a permanent need. Every Seeker transaction is public — once users go private, they never go back. Daily-use wallet, not a one-time tool.',
    icon: 'Target',
    color: 'green',
  },
  {
    name: 'User Experience',
    weight: '25%',
    description: 'Is the app intuitive, polished, and delightful to use?',
    sipAnswer: 'Jupiter-adapted swap UI. One-toggle privacy. Native key management — no browser extension needed on Seeker. Settings hub, sidebar navigation.',
    icon: 'Sparkles',
    color: 'cyan',
  },
  {
    name: 'Innovation',
    weight: '25%',
    description: 'Does it push boundaries? Is the technology novel?',
    sipAnswer: 'First stealth address implementation on Solana Mobile. Two-TX privacy architecture for DeFi. SPL token stealth claims. Pedersen commitments on-chain.',
    icon: 'Lightbulb',
    color: 'purple',
  },
  {
    name: 'Presentation',
    weight: '25%',
    description: 'Is the pitch compelling? Does it tell a clear story?',
    sipAnswer: 'Real mainnet transactions, not testnet demos. Verified on Seeker hardware. $10K Superteam grant approved. 1,205 tests, 7,500+ SDK tests.',
    icon: 'Presentation',
    color: 'amber',
  },
]

// ============================================================================
// Privacy Architecture
// ============================================================================

export const PRIVATE_SWAP_FLOW = [
  {
    step: 1,
    title: 'Announce',
    description: 'Register stealth address on-chain',
    detail: 'shielded_transfer with ephemeral pubkey + commitment',
    color: 'green' as const,
  },
  {
    step: 2,
    title: 'Swap',
    description: 'Jupiter routes swap to stealth ATA',
    detail: 'Output token arrives at unlinkable address',
    color: 'cyan' as const,
  },
  {
    step: 3,
    title: 'Scan',
    description: 'Recipient scans for payments',
    detail: 'Viewing key identifies incoming stealth transfers',
    color: 'purple' as const,
  },
  {
    step: 4,
    title: 'Claim',
    description: 'Derive key and claim to main wallet',
    detail: 'Nullifier prevents double-spend',
    color: 'amber' as const,
  },
]

// ============================================================================
// On-chain Program
// ============================================================================

export const SIP_PROGRAM = {
  name: 'SIP Native Program',
  network: 'mainnet-beta',
  programId: 'S1PMFspo4W6BYKHWkHNF7kZ3fnqibEXg3LQjxepS9at',
  deployDate: 'Jan 31, 2026',
  instructions: [
    'shielded_transfer',
    'shielded_token_transfer',
    'claim_transfer',
    'verify_commitment',
    'verify_zk_proof',
  ],
}

// ============================================================================
// Mainnet Proof (real transactions)
// ============================================================================

export const MAINNET_PROOF = {
  privateSwapTx: '3QCoHcJdnMcPHVyaEzSTRqFauKfbpHM4VAcEkYECgp6FfyY9cSaafMqpEXjxnqsDcBJNnNTHBEYmrcmMG8LkHm1a',
  claimTx: '4Hc3vQBwg3ysqF4aPHPxmrMVp7dNXiMxVwrPkqUNgJsejgNeDjRfj5kBxAY9S8hGjJ8LRkXbqwK6y2EaUvMGBxzB',
  stealthAddress: 'BMBaoNZnw3ZxGTzBTAjV3WnPSrQfaaT7jxCDpwzd8P9p',
}

// ============================================================================
// Stats
// ============================================================================

export const stats = {
  mobileTests: 1205,
  sdkTests: 7500,
  testSuites: 55,
  version: '0.2.0',
  sdkVersion: '0.7.3',
  grantAmount: '$10K',
  grantSource: 'Superteam Indonesia',
  hackathonWins: 6,
  totalPrizes: '$24,300+',
}

// ============================================================================
// Tech Stack
// ============================================================================

export const techStack = [
  { name: 'Expo SDK 54', description: 'React Native framework', category: 'Mobile' },
  { name: 'NativeWind 4.0', description: 'Tailwind for React Native', category: 'Mobile' },
  { name: 'React Native 0.81', description: 'Cross-platform UI', category: 'Mobile' },
  { name: '@sip-protocol/sdk', description: 'Privacy primitives', category: 'Privacy' },
  { name: 'Zustand 5', description: 'State management', category: 'Frontend' },
  { name: 'SecureStore', description: 'Encrypted key storage', category: 'Security' },
  { name: 'Jupiter API', description: 'DEX aggregation', category: 'DeFi' },
  { name: 'Anchor', description: 'Solana program framework', category: 'Blockchain' },
  { name: 'noble/curves', description: 'Cryptographic primitives', category: 'Crypto' },
  { name: 'Vitest', description: 'Testing framework', category: 'Testing' },
]

// ============================================================================
// Resources
// ============================================================================

export const resources = [
  {
    title: 'SIP Mobile',
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
    title: 'Download APK',
    description: 'v0.2.0 (Android/Seeker)',
    href: 'https://github.com/sip-protocol/sip-mobile/releases',
    icon: 'Download',
    external: true,
  },
  {
    title: 'Blog',
    description: 'blog.sip-protocol.org',
    href: 'https://blog.sip-protocol.org',
    icon: 'BookOpen',
    external: true,
  },
]
