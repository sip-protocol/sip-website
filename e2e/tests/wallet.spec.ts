import { test, expect } from '../fixtures/wallet.fixture'
import { DemoPage } from '../pages/demo.page'

/**
 * Flow 1: Wallet Connection Tests
 * Tests wallet UI states with mocked wallet providers
 */

test.describe('Wallet Connection', () => {
  let demoPage: DemoPage

  test.beforeEach(async ({ page }) => {
    demoPage = new DemoPage(page)
  })

  test('should show Connect Wallet button initially', async () => {
    await demoPage.goto()
    await demoPage.expectSwapButtonText(/connect/i)
  })

  test('should open wallet modal on swap button click', async ({ page }) => {
    await demoPage.goto()
    await demoPage.swapCard.swapButton.click()

    // Modal should be visible with wallet options
    await expect(page.locator('text=/phantom|metamask|solflare/i').first()).toBeVisible()
  })

  test('should display wallet options in modal', async ({ page }) => {
    await demoPage.goto()
    await demoPage.swapCard.swapButton.click()

    const phantomOption = page.locator('button').filter({ hasText: /phantom/i })
    const metamaskOption = page.locator('button').filter({ hasText: /metamask/i })

    const hasPhantom = await phantomOption.isVisible().catch(() => false)
    const hasMetamask = await metamaskOption.isVisible().catch(() => false)
    expect(hasPhantom || hasMetamask).toBeTruthy()
  })

  // Note: Wallet connection tests require SDK-level mocking
  // These tests verify the wallet detection shows properly
  test.describe('Wallet Detection', () => {
    test('should show Phantom wallet option', async ({ page }) => {
      await demoPage.goto()
      await demoPage.swapCard.swapButton.click()

      const phantomOption = page.locator('button').filter({ hasText: /phantom/i })
      await expect(phantomOption).toBeVisible()
    })

    test('should show MetaMask wallet option on Ethereum tab', async ({ page }) => {
      await demoPage.goto()
      await demoPage.swapCard.swapButton.click()

      // Switch to Ethereum tab using data-testid
      await page.locator('[data-testid="wallet-tab-ethereum"]').click()

      const metamaskOption = page.locator('button').filter({ hasText: /metamask/i })
      await expect(metamaskOption).toBeVisible()
    })

    test('should show chain tabs in wallet modal', async ({ page }) => {
      await demoPage.goto()
      await demoPage.swapCard.swapButton.click()

      // Use data-testid for reliable selection
      await expect(page.locator('[data-testid="wallet-tab-solana"]')).toBeVisible()
      await expect(page.locator('[data-testid="wallet-tab-ethereum"]')).toBeVisible()
    })
  })
})
