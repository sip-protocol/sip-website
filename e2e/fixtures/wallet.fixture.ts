import { test as base, type Page } from '@playwright/test'

/**
 * Mock wallet fixture for E2E testing
 * Injects fake wallet providers into the page
 */

export interface MockWalletOptions {
  address?: string
  chain?: 'solana' | 'ethereum'
  balance?: string
  shouldReject?: boolean
  shouldTimeout?: boolean
}

export interface WalletFixtures {
  mockPhantom: (options?: MockWalletOptions) => Promise<void>
  mockMetaMask: (options?: MockWalletOptions) => Promise<void>
  mockWalletConnection: (options?: MockWalletOptions) => Promise<void>
}

const DEFAULT_SOLANA_ADDRESS = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
const DEFAULT_ETH_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD98'

async function injectMockPhantom(page: Page, options: MockWalletOptions = {}) {
  const {
    address = DEFAULT_SOLANA_ADDRESS,
    balance = '10.5',
    shouldReject = false,
    shouldTimeout = false,
  } = options

  await page.addInitScript(({ address, balance, shouldReject, shouldTimeout }) => {
    // Mock Phantom wallet
    const mockPhantom = {
      isPhantom: true,
      isConnected: false,
      publicKey: null as { toString: () => string } | null,

      connect: async () => {
        if (shouldTimeout) {
          await new Promise(() => {}) // Never resolves
        }
        if (shouldReject) {
          throw new Error('User rejected the request')
        }
        mockPhantom.isConnected = true
        mockPhantom.publicKey = {
          toString: () => address,
          toBase58: () => address,
        } as unknown as { toString: () => string }
        return { publicKey: mockPhantom.publicKey }
      },

      disconnect: async () => {
        mockPhantom.isConnected = false
        mockPhantom.publicKey = null
      },

      signTransaction: async (tx: unknown) => {
        if (shouldReject) {
          throw new Error('User rejected the request')
        }
        return tx
      },

      signAllTransactions: async (txs: unknown[]) => {
        if (shouldReject) {
          throw new Error('User rejected the request')
        }
        return txs
      },

      signMessage: async (message: Uint8Array) => {
        if (shouldReject) {
          throw new Error('User rejected the request')
        }
        // Return mock signature
        return { signature: new Uint8Array(64).fill(1) }
      },

      on: (event: string, callback: () => void) => {
        // Mock event listener
      },

      off: (event: string, callback: () => void) => {
        // Mock event removal
      },
    }

    // Inject into window
    Object.defineProperty(window, 'phantom', {
      value: { solana: mockPhantom },
      writable: false,
    })

    // Also set solana directly for compatibility
    Object.defineProperty(window, 'solana', {
      value: mockPhantom,
      writable: false,
    })

    // Store balance for later retrieval
    ;(window as unknown as { __mockBalance: string }).__mockBalance = balance
  }, { address, balance, shouldReject, shouldTimeout })
}

async function injectMockMetaMask(page: Page, options: MockWalletOptions = {}) {
  const {
    address = DEFAULT_ETH_ADDRESS,
    balance = '2.5',
    shouldReject = false,
    shouldTimeout = false,
  } = options

  await page.addInitScript(({ address, balance, shouldReject, shouldTimeout }) => {
    const mockEthereum = {
      isMetaMask: true,
      selectedAddress: null as string | null,
      chainId: '0x1', // Mainnet

      request: async ({ method, params }: { method: string; params?: unknown[] }) => {
        if (shouldTimeout) {
          await new Promise(() => {}) // Never resolves
        }

        switch (method) {
          case 'eth_requestAccounts':
          case 'eth_accounts':
            if (shouldReject) {
              throw { code: 4001, message: 'User rejected the request' }
            }
            mockEthereum.selectedAddress = address
            return [address]

          case 'eth_chainId':
            return mockEthereum.chainId

          case 'eth_getBalance':
            // Return balance in wei
            const balanceWei = BigInt(Math.floor(parseFloat(balance) * 1e18))
            return '0x' + balanceWei.toString(16)

          case 'personal_sign':
          case 'eth_signTypedData_v4':
            if (shouldReject) {
              throw { code: 4001, message: 'User rejected the request' }
            }
            // Return mock signature
            return '0x' + '1'.repeat(130)

          case 'eth_sendTransaction':
            if (shouldReject) {
              throw { code: 4001, message: 'User rejected the request' }
            }
            // Return mock tx hash
            return '0x' + '2'.repeat(64)

          case 'wallet_switchEthereumChain':
            return null

          default:
            console.warn('Unhandled MetaMask method:', method)
            return null
        }
      },

      on: (event: string, callback: (...args: unknown[]) => void) => {
        // Mock event listener
      },

      removeListener: (event: string, callback: (...args: unknown[]) => void) => {
        // Mock event removal
      },
    }

    // Inject into window
    Object.defineProperty(window, 'ethereum', {
      value: mockEthereum,
      writable: false,
    })

    // Store balance for later retrieval
    ;(window as unknown as { __mockBalance: string }).__mockBalance = balance
  }, { address, balance, shouldReject, shouldTimeout })
}

/**
 * Extended test with wallet fixtures
 */
export const test = base.extend<WalletFixtures>({
  mockPhantom: async ({ page }, use) => {
    const mock = async (options?: MockWalletOptions) => {
      await injectMockPhantom(page, options)
    }
    await use(mock)
  },

  mockMetaMask: async ({ page }, use) => {
    const mock = async (options?: MockWalletOptions) => {
      await injectMockMetaMask(page, options)
    }
    await use(mock)
  },

  mockWalletConnection: async ({ page }, use) => {
    const mock = async (options?: MockWalletOptions) => {
      const chain = options?.chain || 'solana'
      if (chain === 'solana') {
        await injectMockPhantom(page, options)
      } else {
        await injectMockMetaMask(page, options)
      }
    }
    await use(mock)
  },
})

export { expect } from '@playwright/test'
