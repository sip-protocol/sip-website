/**
 * Network Configuration
 *
 * Testnet configurations for Solana Devnet, Ethereum Sepolia, and NEAR Testnet.
 */

export type NetworkId = 'solana' | 'ethereum' | 'near' | 'arbitrum'

export interface NetworkConfig {
  /** Network identifier */
  id: NetworkId
  /** Display name */
  name: string
  /** Testnet name */
  testnet: string
  /** Chain ID (for EVM chains) */
  chainId?: number
  /** RPC endpoint */
  rpcEndpoint: string
  /** WebSocket endpoint (optional) */
  wsEndpoint?: string
  /** Block explorer URL */
  explorerUrl: string
  /** Faucet URL for getting test tokens */
  faucetUrl: string
  /** Native token symbol */
  nativeToken: string
  /** Native token decimals */
  decimals: number
  /** Logo/icon path */
  icon: string
}

export interface TokenConfig {
  /** Token symbol */
  symbol: string
  /** Token name */
  name: string
  /** Token address (null for native) */
  address: string | null
  /** Decimals */
  decimals: number
  /** Logo/icon path */
  icon: string
  /** Network this token is on */
  network: NetworkId
}

/**
 * Testnet Network Configurations
 */
export const NETWORKS: Record<NetworkId, NetworkConfig> = {
  solana: {
    id: 'solana',
    name: 'Solana',
    testnet: 'Devnet',
    rpcEndpoint: 'https://api.devnet.solana.com',
    wsEndpoint: 'wss://api.devnet.solana.com',
    explorerUrl: 'https://solscan.io',
    faucetUrl: 'https://faucet.solana.com/',
    nativeToken: 'SOL',
    decimals: 9,
    icon: '/networks/solana.svg',
  },
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    testnet: 'Sepolia',
    chainId: 11155111,
    rpcEndpoint: 'https://rpc.sepolia.org',
    wsEndpoint: 'wss://sepolia.drpc.org',
    explorerUrl: 'https://sepolia.etherscan.io',
    faucetUrl: 'https://sepoliafaucet.com/',
    nativeToken: 'ETH',
    decimals: 18,
    icon: '/networks/ethereum.svg',
  },
  near: {
    id: 'near',
    name: 'NEAR',
    testnet: 'Testnet',
    rpcEndpoint: 'https://rpc.testnet.near.org',
    explorerUrl: 'https://testnet.nearblocks.io',
    faucetUrl: 'https://near-faucet.io/',
    nativeToken: 'NEAR',
    decimals: 24,
    icon: '/networks/near.svg',
  },
  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum',
    testnet: 'Sepolia',
    chainId: 421614,
    rpcEndpoint: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorerUrl: 'https://sepolia.arbiscan.io',
    faucetUrl: 'https://faucet.quicknode.com/arbitrum/sepolia',
    nativeToken: 'ETH',
    decimals: 18,
    icon: '/networks/arbitrum.svg',
  },
}

/**
 * Testnet Token Configurations
 */
export const TOKENS: TokenConfig[] = [
  // Solana Devnet
  {
    symbol: 'SOL',
    name: 'Solana',
    address: null, // Native token
    decimals: 9,
    icon: '/tokens/sol.svg',
    network: 'solana',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', // Devnet USDC
    decimals: 6,
    icon: '/tokens/usdc.svg',
    network: 'solana',
  },
  // Ethereum Sepolia
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: null, // Native token
    decimals: 18,
    icon: '/tokens/eth.svg',
    network: 'ethereum',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia USDC
    decimals: 6,
    icon: '/tokens/usdc.svg',
    network: 'ethereum',
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9', // Sepolia WETH
    decimals: 18,
    icon: '/tokens/weth.svg',
    network: 'ethereum',
  },
  // NEAR Testnet
  {
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    address: null, // Native token
    decimals: 24,
    icon: '/tokens/near.svg',
    network: 'near',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: 'usdc.fakes.testnet', // NEAR Testnet USDC
    decimals: 6,
    icon: '/tokens/usdc.svg',
    network: 'near',
  },
]

/**
 * Get network configuration by ID
 */
export function getNetwork(id: NetworkId): NetworkConfig {
  return NETWORKS[id]
}

/**
 * Get all supported networks
 */
export function getAllNetworks(): NetworkConfig[] {
  return Object.values(NETWORKS)
}

/**
 * Get tokens for a specific network
 */
export function getTokensForNetwork(networkId: NetworkId): TokenConfig[] {
  return TOKENS.filter((token) => token.network === networkId)
}

/**
 * Get token by symbol and network
 */
export function getToken(symbol: string, networkId: NetworkId): TokenConfig | undefined {
  return TOKENS.find((token) => token.symbol === symbol && token.network === networkId)
}

/**
 * Get explorer URL for a transaction
 */
export function getTransactionUrl(networkId: NetworkId, txHash: string): string {
  const network = NETWORKS[networkId]
  switch (networkId) {
    case 'solana':
      return `${network.explorerUrl}/tx/${txHash}?cluster=devnet`
    case 'ethereum':
      return `${network.explorerUrl}/tx/${txHash}`
    case 'near':
      return `${network.explorerUrl}/txns/${txHash}`
    default:
      return '#'
  }
}

/**
 * Get explorer URL for an address
 */
export function getAddressUrl(networkId: NetworkId, address: string): string {
  const network = NETWORKS[networkId]
  switch (networkId) {
    case 'solana':
      return `${network.explorerUrl}/account/${address}?cluster=devnet`
    case 'ethereum':
      return `${network.explorerUrl}/address/${address}`
    case 'near':
      return `${network.explorerUrl}/address/${address}`
    default:
      return '#'
  }
}

/**
 * Format amount with proper decimals
 */
export function formatAmount(amount: bigint, decimals: number, maxDecimals = 6): string {
  const divisor = BigInt(10 ** decimals)
  const whole = amount / divisor
  const fraction = amount % divisor

  if (fraction === 0n) {
    return whole.toString()
  }

  const fractionStr = fraction.toString().padStart(decimals, '0')
  const trimmed = fractionStr.slice(0, maxDecimals).replace(/0+$/, '')

  return trimmed ? `${whole}.${trimmed}` : whole.toString()
}

/**
 * Parse amount string to bigint with decimals
 */
export function parseAmount(amountStr: string, decimals: number): bigint {
  const [whole, fraction = ''] = amountStr.split('.')
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals)
  return BigInt(whole + paddedFraction)
}
