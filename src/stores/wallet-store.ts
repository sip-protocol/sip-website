import { create } from 'zustand'
import type { ChainId } from '@sip-protocol/types'

export type WalletType = 'phantom' | 'solflare' | 'metamask' | 'walletconnect' | 'meteor' | 'mynearwallet' | 'here' | 'sender' | 'ledger' | 'trezor'
export type ChainType = 'solana' | 'ethereum' | 'near'

export interface WalletState {
  // Connection state
  isConnected: boolean
  isConnecting: boolean
  // Address format varies by chain: Base58 for Solana, 0x hex for Ethereum
  address: string | null
  chain: ChainType | null
  walletType: WalletType | null

  // Available wallets (detected)
  availableWallets: {
    solana: WalletType[]
    ethereum: WalletType[]
    near: WalletType[]
    hardware: WalletType[]
  }

  // Modal state
  isModalOpen: boolean

  // Actions
  setConnecting: (connecting: boolean) => void
  connect: (walletType: WalletType, chain: ChainType, address: string) => void
  disconnect: () => void
  openModal: () => void
  closeModal: () => void
  setAvailableWallets: (wallets: { solana: WalletType[]; ethereum: WalletType[]; near: WalletType[]; hardware?: WalletType[] }) => void
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
    near: [],
    hardware: [],
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

  setAvailableWallets: (wallets) => set({
    availableWallets: {
      solana: wallets.solana,
      ethereum: wallets.ethereum,
      near: wallets.near,
      hardware: wallets.hardware ?? [],
    }
  }),
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
  // NEAR wallets
  meteor: {
    name: 'Meteor Wallet',
    icon: '/wallets/meteor.svg',
    chain: 'near',
    downloadUrl: 'https://meteorwallet.app/',
  },
  mynearwallet: {
    name: 'MyNearWallet',
    icon: '/wallets/mynearwallet.svg',
    chain: 'near',
    downloadUrl: 'https://mynearwallet.com/',
  },
  here: {
    name: 'HERE Wallet',
    icon: '/wallets/here.svg',
    chain: 'near',
    downloadUrl: 'https://herewallet.app/',
  },
  sender: {
    name: 'Sender',
    icon: '/wallets/sender.svg',
    chain: 'near',
    downloadUrl: 'https://sender.org/',
  },
  // Hardware wallets
  ledger: {
    name: 'Ledger',
    icon: '/wallets/ledger.svg',
    chain: 'ethereum', // Default chain, supports multiple
    downloadUrl: 'https://www.ledger.com/',
  },
  trezor: {
    name: 'Trezor',
    icon: '/wallets/trezor.svg',
    chain: 'ethereum', // Default chain, supports multiple
    downloadUrl: 'https://trezor.io/',
  },
}
