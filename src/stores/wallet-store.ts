import { create } from 'zustand'
import type { ChainId, HexString } from '@sip-protocol/types'

export type WalletType = 'phantom' | 'solflare' | 'metamask' | 'walletconnect'
export type ChainType = 'solana' | 'ethereum'

export interface WalletState {
  // Connection state
  isConnected: boolean
  isConnecting: boolean
  address: HexString | null
  chain: ChainType | null
  walletType: WalletType | null

  // Available wallets (detected)
  availableWallets: {
    solana: WalletType[]
    ethereum: WalletType[]
  }

  // Modal state
  isModalOpen: boolean

  // Actions
  setConnecting: (connecting: boolean) => void
  connect: (walletType: WalletType, chain: ChainType, address: HexString) => void
  disconnect: () => void
  openModal: () => void
  closeModal: () => void
  setAvailableWallets: (wallets: { solana: WalletType[]; ethereum: WalletType[] }) => void
}

export const useWalletStore = create<WalletState>((set) => ({
  // Initial state
  isConnected: false,
  isConnecting: false,
  address: null,
  chain: null,
  walletType: null,
  availableWallets: {
    solana: [],
    ethereum: [],
  },
  isModalOpen: false,

  // Actions
  setConnecting: (connecting) => set({ isConnecting: connecting }),

  connect: (walletType, chain, address) => set({
    isConnected: true,
    isConnecting: false,
    walletType,
    chain,
    address,
    isModalOpen: false,
  }),

  disconnect: () => set({
    isConnected: false,
    isConnecting: false,
    address: null,
    chain: null,
    walletType: null,
  }),

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  setAvailableWallets: (wallets) => set({ availableWallets: wallets }),
}))

// Utility to format address for display
export function formatAddress(address: string | null): string {
  if (!address) return ''
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Wallet metadata
export const WALLET_INFO: Record<WalletType, {
  name: string
  icon: string
  chain: ChainType
  downloadUrl: string
}> = {
  phantom: {
    name: 'Phantom',
    icon: '/wallets/phantom.svg',
    chain: 'solana',
    downloadUrl: 'https://phantom.app/',
  },
  solflare: {
    name: 'Solflare',
    icon: '/wallets/solflare.svg',
    chain: 'solana',
    downloadUrl: 'https://solflare.com/',
  },
  metamask: {
    name: 'MetaMask',
    icon: '/wallets/metamask.svg',
    chain: 'ethereum',
    downloadUrl: 'https://metamask.io/',
  },
  walletconnect: {
    name: 'WalletConnect',
    icon: '/wallets/walletconnect.svg',
    chain: 'ethereum',
    downloadUrl: 'https://walletconnect.com/',
  },
}
