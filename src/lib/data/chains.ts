/**
 * Centralized chain support data
 * Single source of truth for all chain and VM information
 *
 * Last synced with ROADMAP.md: December 29, 2025
 */

export type ChainStatus = 'active' | 'coming' | 'future' | 'research'
export type VMType = 'EVM' | 'SVM' | 'NearVM' | 'MoveVM' | 'Zcash' | 'Bitcoin' | 'Cosmos' | 'Mina'
export type CurveType = 'secp256k1' | 'ed25519' | 'bls12-381'

export interface Chain {
  id: string
  name: string
  vm: VMType
  curve: CurveType
  status: ChainStatus
  color: string
  priority: 'tier1' | 'tier2' | 'tier3'
  notes?: string
}

export interface VM {
  name: VMType
  displayName: string
  curve: CurveType
  status: 'supported' | 'coming' | 'research'
  chains: string[]
}

// ============================================================================
// CHAINS BY STATUS
// ============================================================================

export const CHAINS: Chain[] = [
  // Tier 1 - Active (SDK fully supports)
  {
    id: 'near',
    name: 'NEAR',
    vm: 'NearVM',
    curve: 'ed25519',
    status: 'active',
    color: '#00C08B',
    priority: 'tier1',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    vm: 'EVM',
    curve: 'secp256k1',
    status: 'active',
    color: '#627EEA',
    priority: 'tier1',
  },
  {
    id: 'solana',
    name: 'Solana',
    vm: 'SVM',
    curve: 'ed25519',
    status: 'active',
    color: '#9945FF',
    priority: 'tier1',
  },
  {
    id: 'zcash',
    name: 'Zcash',
    vm: 'Zcash',
    curve: 'bls12-381',
    status: 'active',
    color: '#F4B728',
    priority: 'tier1',
  },

  // Tier 1 L2s - Coming (M18)
  {
    id: 'base',
    name: 'Base',
    vm: 'EVM',
    curve: 'secp256k1',
    status: 'coming',
    color: '#0052FF',
    priority: 'tier1',
    notes: '60%+ L2 tx share',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    vm: 'EVM',
    curve: 'secp256k1',
    status: 'coming',
    color: '#28A0F0',
    priority: 'tier1',
    notes: '44% L2 TVL',
  },
  {
    id: 'optimism',
    name: 'Optimism',
    vm: 'EVM',
    curve: 'secp256k1',
    status: 'coming',
    color: '#FF0420',
    priority: 'tier1',
    notes: 'OP Stack ecosystem',
  },

  // Tier 2 - Coming
  {
    id: 'polygon',
    name: 'Polygon',
    vm: 'EVM',
    curve: 'secp256k1',
    status: 'coming',
    color: '#8247E5',
    priority: 'tier2',
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    vm: 'Bitcoin',
    curve: 'secp256k1',
    status: 'coming',
    color: '#F7931A',
    priority: 'tier2',
    notes: 'Silent Payments (BIP-352)',
  },
  {
    id: 'bnb',
    name: 'BNB Chain',
    vm: 'EVM',
    curve: 'secp256k1',
    status: 'coming',
    color: '#F0B90B',
    priority: 'tier2',
    notes: '4.32M daily active wallets',
  },

  // Tier 3 - Future/Research
  {
    id: 'mina',
    name: 'Mina',
    vm: 'Mina',
    curve: 'bls12-381',
    status: 'coming',
    color: '#7B61FF',
    priority: 'tier1',
    notes: 'Proof composition partner',
  },
  {
    id: 'aptos',
    name: 'Aptos',
    vm: 'MoveVM',
    curve: 'ed25519',
    status: 'future',
    color: '#4CC9F0',
    priority: 'tier3',
  },
  {
    id: 'sui',
    name: 'Sui',
    vm: 'MoveVM',
    curve: 'ed25519',
    status: 'future',
    color: '#6FBCF0',
    priority: 'tier3',
  },
  {
    id: 'cosmos',
    name: 'Cosmos IBC',
    vm: 'Cosmos',
    curve: 'secp256k1',
    status: 'future',
    color: '#2E3148',
    priority: 'tier3',
  },
]

// ============================================================================
// VM SUPPORT
// ============================================================================

export const VMS: VM[] = [
  {
    name: 'EVM',
    displayName: 'Ethereum VMs',
    curve: 'secp256k1',
    status: 'supported',
    chains: ['ethereum', 'base', 'arbitrum', 'optimism', 'polygon', 'bnb'],
  },
  {
    name: 'SVM',
    displayName: 'Solana VM',
    curve: 'ed25519',
    status: 'supported',
    chains: ['solana'],
  },
  {
    name: 'NearVM',
    displayName: 'NEAR VM',
    curve: 'ed25519',
    status: 'supported',
    chains: ['near'],
  },
  {
    name: 'MoveVM',
    displayName: 'Move VMs',
    curve: 'ed25519',
    status: 'coming',
    chains: ['aptos', 'sui'],
  },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getChainById(id: string): Chain | undefined {
  return CHAINS.find((chain) => chain.id === id)
}

export function getChainsByStatus(status: ChainStatus): Chain[] {
  return CHAINS.filter((chain) => chain.status === status)
}

export function getChainsByVM(vm: VMType): Chain[] {
  return CHAINS.filter((chain) => chain.vm === vm)
}

export function getChainsByPriority(priority: 'tier1' | 'tier2' | 'tier3'): Chain[] {
  return CHAINS.filter((chain) => chain.priority === priority)
}

export function getActiveChains(): Chain[] {
  return getChainsByStatus('active')
}

export function getComingChains(): Chain[] {
  return getChainsByStatus('coming')
}

export function getSupportedChainCount(): number {
  return CHAINS.filter((chain) => chain.status === 'active' || chain.status === 'coming').length
}

// ============================================================================
// DISPLAY HELPERS
// ============================================================================

export const CHAIN_STATUS_LABELS: Record<ChainStatus, string> = {
  active: 'Supported',
  coming: 'Coming Soon',
  future: 'Planned',
  research: 'Research',
}

export const VM_STATUS_LABELS: Record<VM['status'], string> = {
  supported: 'Supported',
  coming: 'Coming Soon',
  research: 'Research',
}
