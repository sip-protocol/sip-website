/**
 * NEAR Network Configuration
 *
 * Configuration for connecting to NEAR mainnet and testnet
 */

export type NearNetworkId = 'mainnet' | 'testnet'

export interface NearNetworkConfig {
  networkId: NearNetworkId
  nodeUrl: string
  helperUrl: string
  explorerUrl: string
  walletUrl: string
}

export const NEAR_NETWORKS: Record<NearNetworkId, NearNetworkConfig> = {
  mainnet: {
    networkId: 'mainnet',
    nodeUrl: 'https://rpc.mainnet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    explorerUrl: 'https://nearblocks.io',
    walletUrl: 'https://wallet.near.org',
  },
  testnet: {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://testnet.nearblocks.io',
    walletUrl: 'https://testnet.mynearwallet.com',
  },
}

// Default to testnet for demo
export const DEFAULT_NEAR_NETWORK: NearNetworkId = 'testnet'

export function getNearConfig(networkId: NearNetworkId = DEFAULT_NEAR_NETWORK): NearNetworkConfig {
  return NEAR_NETWORKS[networkId]
}

// Contract IDs for SIP Protocol on NEAR
export const NEAR_CONTRACTS = {
  mainnet: {
    // Placeholder - update when contracts are deployed
    intentRouter: 'sip-intent.near',
  },
  testnet: {
    // Placeholder - update when contracts are deployed
    intentRouter: 'sip-intent.testnet',
  },
}
