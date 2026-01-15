import { test, expect } from '../fixtures/wallet.fixture'
import { DemoPage } from '../pages/demo.page'

/**
 * Flow 1: Wallet Connection Tests
 * Tests wallet UI states with mocked wallet providers
 *
 * SKIPPED: The /demo page has been deprecated and migrated to sip-app.
 * These tests should be moved to the sip-app E2E suite.
 * See: https://github.com/sip-protocol/sip-website/issues/156
 */

test.describe.skip('Wallet Connection', () => {
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

    // Wait for modal animation and dynamic import to complete
    // Use data-testid for reliable detection
    await expect(page.locator('[data-testid="wallet-modal"]')).toBeVisible({ timeout: 10000 })

    // Wallet options are always visible (either as "Connect" or "Not installed")
    // The wallet name is shown regardless of detection status
    await expect(page.locator('button').filter({ hasText: /phantom/i }).first()).toBeVisible({ timeout: 5000 })
  })

  test('should display wallet options in modal', async ({ page }) => {
    await demoPage.goto()
    await demoPage.swapCard.swapButton.click()

    // Wait for modal to appear first by checking for chain tabs
    await expect(page.locator('[data-testid="wallet-tab-solana"], [data-testid="wallet-tab-ethereum"]').first()).toBeVisible({ timeout: 5000 })

    // Look for any wallet option (Phantom on Solana tab)
    // Wallet buttons show wallet name regardless of installation status
    const walletOption = page.locator('button').filter({ hasText: /phantom/i }).first()
    await expect(walletOption).toBeVisible({ timeout: 3000 })
  })

  // Note: Wallet connection tests require SDK-level mocking
  // These tests verify the wallet detection shows properly
  test.describe('Wallet Detection', () => {
    test('should show Phantom wallet option', async ({ page }) => {
      await demoPage.goto()
      await demoPage.swapCard.swapButton.click()

      // Wait for modal to open using data-testid
      await expect(page.locator('[data-testid="wallet-modal"]')).toBeVisible({ timeout: 10000 })

      // Phantom option is always visible (shows "Not installed" if not detected)
      const phantomOption = page.locator('button').filter({ hasText: /phantom/i })
      await expect(phantomOption).toBeVisible({ timeout: 5000 })
    })

    test('should show MetaMask wallet option on Ethereum tab', async ({ page }) => {
      await demoPage.goto()
      await demoPage.swapCard.swapButton.click()

      // Wait for modal to open using data-testid
      await expect(page.locator('[data-testid="wallet-modal"]')).toBeVisible({ timeout: 10000 })

      // Switch to Ethereum tab using data-testid
      await page.locator('[data-testid="wallet-tab-ethereum"]').click()

      // MetaMask option is always visible on Ethereum tab
      const metamaskOption = page.locator('button').filter({ hasText: /metamask/i })
      await expect(metamaskOption).toBeVisible({ timeout: 5000 })
    })

    test('should show chain tabs in wallet modal', async ({ page }) => {
      await demoPage.goto()
      await demoPage.swapCard.swapButton.click()

      // Wait for modal to open first using data-testid
      await expect(page.locator('[data-testid="wallet-modal"]')).toBeVisible({ timeout: 10000 })

      // Use data-testid for reliable selection
      await expect(page.locator('[data-testid="wallet-tab-solana"]')).toBeVisible()
      await expect(page.locator('[data-testid="wallet-tab-ethereum"]')).toBeVisible()
    })
  })
})
