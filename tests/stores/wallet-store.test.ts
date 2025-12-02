import { describe, it, expect, beforeEach } from 'vitest'
import {
  useWalletStore,
  formatAddress,
  WALLET_INFO,
  type WalletType,
  type ChainType,
} from '@/stores/wallet-store'

describe('Wallet Store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useWalletStore.setState({
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
    })
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useWalletStore.getState()

      expect(state.isConnected).toBe(false)
      expect(state.isConnecting).toBe(false)
      expect(state.address).toBeNull()
      expect(state.chain).toBeNull()
      expect(state.walletType).toBeNull()
      expect(state.isModalOpen).toBe(false)
    })
  })

  describe('setConnecting', () => {
    it('should set connecting state to true', () => {
      useWalletStore.getState().setConnecting(true)
      expect(useWalletStore.getState().isConnecting).toBe(true)
    })

    it('should set connecting state to false', () => {
      useWalletStore.setState({ isConnecting: true })
      useWalletStore.getState().setConnecting(false)
      expect(useWalletStore.getState().isConnecting).toBe(false)
    })
  })

  describe('connect', () => {
    it('should connect with Solana wallet', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678' as `0x${string}`

      useWalletStore.getState().connect('phantom', 'solana', address)

      const state = useWalletStore.getState()
      expect(state.isConnected).toBe(true)
      expect(state.isConnecting).toBe(false)
      expect(state.walletType).toBe('phantom')
      expect(state.chain).toBe('solana')
      expect(state.address).toBe(address)
      expect(state.isModalOpen).toBe(false)
    })

    it('should connect with Ethereum wallet', () => {
      const address = '0xabcdef1234567890abcdef1234567890abcdef12' as `0x${string}`

      useWalletStore.getState().connect('metamask', 'ethereum', address)

      const state = useWalletStore.getState()
      expect(state.isConnected).toBe(true)
      expect(state.walletType).toBe('metamask')
      expect(state.chain).toBe('ethereum')
      expect(state.address).toBe(address)
    })

    it('should close modal on successful connection', () => {
      useWalletStore.setState({ isModalOpen: true })

      useWalletStore.getState().connect(
        'phantom',
        'solana',
        '0x123' as `0x${string}`
      )

      expect(useWalletStore.getState().isModalOpen).toBe(false)
    })

    it('should reset connecting state on connection', () => {
      useWalletStore.setState({ isConnecting: true })

      useWalletStore.getState().connect(
        'phantom',
        'solana',
        '0x123' as `0x${string}`
      )

      expect(useWalletStore.getState().isConnecting).toBe(false)
    })
  })

  describe('disconnect', () => {
    it('should reset all connection state', () => {
      // First connect
      useWalletStore.getState().connect(
        'phantom',
        'solana',
        '0x123' as `0x${string}`
      )

      // Then disconnect
      useWalletStore.getState().disconnect()

      const state = useWalletStore.getState()
      expect(state.isConnected).toBe(false)
      expect(state.isConnecting).toBe(false)
      expect(state.address).toBeNull()
      expect(state.chain).toBeNull()
      expect(state.walletType).toBeNull()
    })
  })

  describe('modal state', () => {
    it('should open modal', () => {
      useWalletStore.getState().openModal()
      expect(useWalletStore.getState().isModalOpen).toBe(true)
    })

    it('should close modal', () => {
      useWalletStore.setState({ isModalOpen: true })
      useWalletStore.getState().closeModal()
      expect(useWalletStore.getState().isModalOpen).toBe(false)
    })
  })

  describe('setAvailableWallets', () => {
    it('should set available wallets for all chains', () => {
      useWalletStore.getState().setAvailableWallets({
        solana: ['phantom', 'solflare'],
        ethereum: ['metamask'],
        near: ['meteor', 'mynearwallet'],
        hardware: ['ledger', 'trezor'],
      })

      const state = useWalletStore.getState()
      expect(state.availableWallets.solana).toEqual(['phantom', 'solflare'])
      expect(state.availableWallets.ethereum).toEqual(['metamask'])
      expect(state.availableWallets.near).toEqual(['meteor', 'mynearwallet'])
      expect(state.availableWallets.hardware).toEqual(['ledger', 'trezor'])
    })

    it('should handle empty wallet arrays', () => {
      useWalletStore.getState().setAvailableWallets({
        solana: [],
        ethereum: [],
        near: [],
        hardware: [],
      })

      const state = useWalletStore.getState()
      expect(state.availableWallets.solana).toEqual([])
      expect(state.availableWallets.ethereum).toEqual([])
      expect(state.availableWallets.near).toEqual([])
      expect(state.availableWallets.hardware).toEqual([])
    })

    it('should default hardware to empty array if not provided', () => {
      useWalletStore.getState().setAvailableWallets({
        solana: ['phantom'],
        ethereum: ['metamask'],
        near: ['meteor'],
      })

      const state = useWalletStore.getState()
      expect(state.availableWallets.hardware).toEqual([])
    })
  })
})

describe('formatAddress', () => {
  it('should return empty string for null address', () => {
    expect(formatAddress(null)).toBe('')
  })

  it('should return full address if 10 chars or less', () => {
    expect(formatAddress('0x12345678')).toBe('0x12345678')
  })

  it('should truncate long addresses', () => {
    const longAddress = '0x1234567890abcdef1234567890abcdef12345678'
    expect(formatAddress(longAddress)).toBe('0x1234...5678')
  })

  it('should handle edge case of exactly 11 characters', () => {
    const address = '0x123456789'
    expect(formatAddress(address)).toBe('0x1234...6789')
  })
})

describe('WALLET_INFO', () => {
  it('should have correct info for Phantom', () => {
    expect(WALLET_INFO.phantom).toEqual({
      name: 'Phantom',
      icon: '/wallets/phantom.svg',
      chain: 'solana',
      downloadUrl: 'https://phantom.app/',
    })
  })

  it('should have correct info for MetaMask', () => {
    expect(WALLET_INFO.metamask).toEqual({
      name: 'MetaMask',
      icon: '/wallets/metamask.svg',
      chain: 'ethereum',
      downloadUrl: 'https://metamask.io/',
    })
  })

  it('should have correct info for Solflare', () => {
    expect(WALLET_INFO.solflare.chain).toBe('solana')
  })

  it('should have correct info for WalletConnect', () => {
    expect(WALLET_INFO.walletconnect.chain).toBe('ethereum')
  })

  it('should have correct info for Meteor (NEAR)', () => {
    expect(WALLET_INFO.meteor).toEqual({
      name: 'Meteor Wallet',
      icon: '/wallets/meteor.svg',
      chain: 'near',
      downloadUrl: 'https://meteorwallet.app/',
    })
  })

  it('should have all required wallet types', () => {
    const expectedWallets: WalletType[] = [
      'phantom', 'solflare', 'metamask', 'walletconnect',
      'meteor', 'mynearwallet', 'here', 'sender',
      'ledger', 'trezor'
    ]
    expectedWallets.forEach(wallet => {
      expect(WALLET_INFO[wallet]).toBeDefined()
    })
  })

  it('should have correct info for Ledger', () => {
    expect(WALLET_INFO.ledger).toEqual({
      name: 'Ledger',
      icon: '/wallets/ledger.svg',
      chain: 'ethereum',
      downloadUrl: 'https://www.ledger.com/',
    })
  })

  it('should have correct info for Trezor', () => {
    expect(WALLET_INFO.trezor).toEqual({
      name: 'Trezor',
      icon: '/wallets/trezor.svg',
      chain: 'ethereum',
      downloadUrl: 'https://trezor.io/',
    })
  })
})
