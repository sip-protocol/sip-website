import { test as base, type Page, type Route } from '@playwright/test'

/**
 * Mock quote/API fixture for E2E testing
 * Intercepts API calls and returns mock responses
 */

export interface MockQuoteOptions {
  outputAmount?: string
  rate?: string
  fee?: string
  estimatedTime?: string
  shouldFail?: boolean
  delay?: number
}

export interface QuoteFixtures {
  mockQuoteAPI: (options?: MockQuoteOptions) => Promise<void>
  mockQuoteError: (errorMessage?: string) => Promise<void>
}

const DEFAULT_QUOTE = {
  outputAmount: '45.23',
  rate: '45.23',
  fee: '0.3',
  estimatedTime: '30s',
  solver: 'SIP Solver',
  route: ['SOL', 'USDC', 'ETH'],
}

async function interceptQuoteAPI(page: Page, options: MockQuoteOptions = {}) {
  const {
    outputAmount = DEFAULT_QUOTE.outputAmount,
    rate = DEFAULT_QUOTE.rate,
    fee = DEFAULT_QUOTE.fee,
    estimatedTime = DEFAULT_QUOTE.estimatedTime,
    shouldFail = false,
    delay = 100,
  } = options

  // Intercept 1Click API calls
  await page.route('**/api/quote**', async (route: Route) => {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    if (shouldFail) {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Quote service unavailable' }),
      })
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        outputAmount,
        rate,
        fee,
        estimatedTime,
        solver: DEFAULT_QUOTE.solver,
        route: DEFAULT_QUOTE.route,
      }),
    })
  })

  // Also intercept direct 1Click API if used
  await page.route('**/1click**', async (route: Route) => {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    if (shouldFail) {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service unavailable' }),
      })
      return
    }

    // Return mock 1Click response
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        quoteId: 'mock-quote-id-' + Date.now(),
        outputAmount,
        exchangeRate: rate,
        fee: {
          amount: fee,
          currency: 'USDC',
        },
        estimatedTime,
        expiresAt: new Date(Date.now() + 60000).toISOString(),
      }),
    })
  })
}

async function interceptTransactionAPI(page: Page, options: { shouldFail?: boolean; delay?: number } = {}) {
  const { shouldFail = false, delay = 500 } = options

  // Intercept transaction submission
  await page.route('**/api/swap**', async (route: Route) => {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    if (shouldFail) {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Transaction failed' }),
      })
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        txHash: '5wHGk...mock' + Date.now().toString(36),
        status: 'success',
        chain: 'solana',
        explorerUrl: 'https://solscan.io/tx/mock-tx-hash',
      }),
    })
  })
}

/**
 * Extended test with quote fixtures
 */
export const test = base.extend<QuoteFixtures>({
  mockQuoteAPI: async ({ page }, use) => {
    const mock = async (options?: MockQuoteOptions) => {
      await interceptQuoteAPI(page, options)
      await interceptTransactionAPI(page, { shouldFail: options?.shouldFail })
    }
    await use(mock)
  },

  mockQuoteError: async ({ page }, use) => {
    const mock = async (errorMessage?: string) => {
      await page.route('**/api/quote**', async (route: Route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: errorMessage || 'Service unavailable' }),
        })
      })
    }
    await use(mock)
  },
})

export { expect } from '@playwright/test'
