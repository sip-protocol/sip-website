/**
 * Network Configuration
 *
 * Mainnet configurations for production use with real NEAR Intents API.
 * Note: testnet field is kept for reference but not actively used.
 */

export type NetworkId =
  | 'solana'
  | 'ethereum'
  | 'near'
  | 'arbitrum'
  | 'zcash'
  | 'base'
  | 'bitcoin'
  | 'optimism'
  | 'polygon'
  | 'bsc'
  | 'avalanche'
  | 'aptos'

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
 * Network Configurations (Mainnet for production demo)
 */
export const NETWORKS: Record<NetworkId, NetworkConfig> = {
  solana: {
    id: 'solana',
    name: 'Solana',
    testnet: 'Devnet',
    // Using reliable public mainnet RPC for balance display
    rpcEndpoint: 'https://solana-rpc.publicnode.com',
    wsEndpoint: 'wss://solana-rpc.publicnode.com',
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
    chainId: 1, // Mainnet chain ID
    // Using reliable public mainnet RPC for balance display
    rpcEndpoint: 'https://ethereum-rpc.publicnode.com',
    wsEndpoint: 'wss://ethereum-rpc.publicnode.com',
    explorerUrl: 'https://etherscan.io',
    faucetUrl: 'https://sepoliafaucet.com/',
    nativeToken: 'ETH',
    decimals: 18,
    icon: '/networks/ethereum.svg',
  },
  near: {
    id: 'near',
    name: 'NEAR',
    testnet: 'Testnet',
    // Using mainnet for production - 1Click API operates on mainnet
    rpcEndpoint: 'https://rpc.mainnet.near.org',
    explorerUrl: 'https://nearblocks.io',
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
  zcash: {
    id: 'zcash',
    name: 'Zcash',
    testnet: 'Testnet',
    rpcEndpoint: 'https://testnet.zcash.com:8232', // Zcash testnet RPC (requires local node)
    explorerUrl: 'https://testnet.zcashblockexplorer.com',
    faucetUrl: 'https://faucet.zcash.com/',
    nativeToken: 'ZEC',
    decimals: 8,
    icon: '/networks/zcash.svg',
  },
  base: {
    id: 'base',
    name: 'Base',
    testnet: 'Sepolia',
    chainId: 84532,
    rpcEndpoint: 'https://sepolia.base.org',
    explorerUrl: 'https://sepolia.basescan.org',
    faucetUrl: 'https://www.coinbase.com/faucets/base-ethereum-goerli-faucet',
    nativeToken: 'ETH',
    decimals: 18,
    icon: '/networks/base.svg',
  },
  bitcoin: {
    id: 'bitcoin',
    name: 'Bitcoin',
    testnet: 'Testnet',
    rpcEndpoint: 'https://blockstream.info/testnet/api',
    explorerUrl: 'https://blockstream.info/testnet',
    faucetUrl: 'https://testnet-faucet.com/btc-testnet/',
    nativeToken: 'BTC',
    decimals: 8,
    icon: '/networks/bitcoin.svg',
  },
  optimism: {
    id: 'optimism',
    name: 'Optimism',
    testnet: 'Sepolia',
    chainId: 11155420,
    rpcEndpoint: 'https://sepolia.optimism.io',
    explorerUrl: 'https://sepolia-optimism.etherscan.io',
    faucetUrl: 'https://www.alchemy.com/faucets/optimism-sepolia',
    nativeToken: 'ETH',
    decimals: 18,
    icon: '/networks/optimism.svg',
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    testnet: 'Amoy',
    chainId: 80002,
    rpcEndpoint: 'https://rpc-amoy.polygon.technology',
    explorerUrl: 'https://amoy.polygonscan.com',
    faucetUrl: 'https://faucet.polygon.technology/',
    nativeToken: 'POL',
    decimals: 18,
    icon: '/networks/polygon.svg',
  },
  bsc: {
    id: 'bsc',
    name: 'BNB Chain',
    testnet: 'Testnet',
    chainId: 97,
    rpcEndpoint: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    explorerUrl: 'https://testnet.bscscan.com',
    faucetUrl: 'https://testnet.bnbchain.org/faucet-smart',
    nativeToken: 'BNB',
    decimals: 18,
    icon: '/networks/bsc.svg',
  },
  avalanche: {
    id: 'avalanche',
    name: 'Avalanche',
    testnet: 'Fuji',
    chainId: 43113,
    rpcEndpoint: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorerUrl: 'https://testnet.snowtrace.io',
    faucetUrl: 'https://faucet.avax.network/',
    nativeToken: 'AVAX',
    decimals: 18,
    icon: '/networks/avalanche.svg',
  },
  aptos: {
    id: 'aptos',
    name: 'Aptos',
    testnet: 'Testnet',
    rpcEndpoint: 'https://fullnode.testnet.aptoslabs.com/v1',
    explorerUrl: 'https://explorer.aptoslabs.com/?network=testnet',
    faucetUrl: 'https://www.aptosfaucet.com/',
    nativeToken: 'APT',
    decimals: 8,
    icon: '/networks/aptos.svg',
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
  // Zcash Testnet
  {
    symbol: 'ZEC',
    name: 'Zcash',
    address: null, // Native token
    decimals: 8,
    icon: '/tokens/zec.svg',
    network: 'zcash',
  },
  // Arbitrum
  {
    symbol: 'ARB',
    name: 'Arbitrum',
    address: null, // Uses ETH as native, ARB is the token
    decimals: 18,
    icon: '/tokens/arb.svg',
    network: 'arbitrum',
  },
  // Base
  {
    symbol: 'BASE',
    name: 'Base',
    address: null, // Uses ETH as native
    decimals: 18,
    icon: '/tokens/base.svg',
    network: 'base',
  },
  // Bitcoin
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    address: null,
    decimals: 8,
    icon: '/tokens/btc.svg',
    network: 'bitcoin',
  },
  // Optimism
  {
    symbol: 'OP',
    name: 'Optimism',
    address: null, // Uses ETH as native, OP is the token
    decimals: 18,
    icon: '/tokens/op.svg',
    network: 'optimism',
  },
  // Polygon
  {
    symbol: 'POL',
    name: 'Polygon',
    address: null,
    decimals: 18,
    icon: '/tokens/pol.svg',
    network: 'polygon',
  },
  // BNB Chain
  {
    symbol: 'BNB',
    name: 'BNB',
    address: null,
    decimals: 18,
    icon: '/tokens/bnb.svg',
    network: 'bsc',
  },
  // Avalanche
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    address: null,
    decimals: 18,
    icon: '/tokens/avax.svg',
    network: 'avalanche',
  },
  // Aptos
  {
    symbol: 'APT',
    name: 'Aptos',
    address: null,
    decimals: 8,
    icon: '/tokens/apt.svg',
    network: 'aptos',
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
      return `${network.explorerUrl}/tx/${txHash}` // Mainnet (no cluster param needed)
    case 'ethereum':
    case 'arbitrum':
    case 'base':
    case 'optimism':
    case 'polygon':
    case 'bsc':
    case 'avalanche':
      return `${network.explorerUrl}/tx/${txHash}`
    case 'near':
      return `${network.explorerUrl}/txns/${txHash}`
    case 'zcash':
    case 'bitcoin':
      return `${network.explorerUrl}/tx/${txHash}`
    case 'aptos':
      return `${network.explorerUrl}/txn/${txHash}`
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
      return `${network.explorerUrl}/account/${address}` // Mainnet (no cluster param needed)
    case 'ethereum':
    case 'arbitrum':
    case 'base':
    case 'optimism':
    case 'polygon':
    case 'bsc':
    case 'avalanche':
      return `${network.explorerUrl}/address/${address}`
    case 'near':
      return `${network.explorerUrl}/address/${address}`
    case 'zcash':
    case 'bitcoin':
      return `${network.explorerUrl}/address/${address}`
    case 'aptos':
      return `${network.explorerUrl}/account/${address}`
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
