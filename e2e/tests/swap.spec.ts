import { test, expect } from '../fixtures/wallet.fixture'
import { DemoPage } from '../pages/demo.page'

/**
 * Flow 4: Swap Execution Tests
 * Tests swap button states and execution flow
 */

// SKIPPED: The /demo page has been deprecated and migrated to sip-app. See: https://github.com/sip-protocol/sip-website/issues/156
test.describe.skip('Swap Execution', () => {
  let demoPage: DemoPage

  test.beforeEach(async ({ page }) => {
    demoPage = new DemoPage(page)
  })

  test('should show Connect Wallet when not connected', async () => {
    await demoPage.goto()
    await demoPage.expectSwapButtonText(/connect/i)
  })

  // Note: Tests requiring wallet connection are simplified
  // Full wallet integration tests require SDK-level mocking

  test('should show Connect Wallet text when not connected and no amount', async () => {
    await demoPage.goto()
    await demoPage.expectSwapButtonText(/connect/i)
  })

  test('should still show Connect Wallet after entering amount (when not connected)', async () => {
    await demoPage.goto()
    await demoPage.enterAmount('1')
    await demoPage.waitForQuote()

    // Without wallet, button should still prompt to connect
    await demoPage.expectSwapButtonText(/connect/i)
  })

  test('should display privacy info when shielded', async () => {
    await demoPage.goto()
    await demoPage.expectPrivacyInfoVisible()
  })

  test('should show viewing key info in compliant mode', async ({ page }) => {
    await demoPage.goto()
    await demoPage.selectPrivacyLevel('compliant')

    await demoPage.expectPrivacyInfoVisible()
    // Look for viewing key text within the privacy info box
    await expect(demoPage.swapCard.privacyInfo.locator('text=/viewing key/i')).toBeVisible()
  })

  test('should hide privacy info in public mode', async () => {
    await demoPage.goto()
    await demoPage.selectPrivacyLevel('public')
    await demoPage.expectPrivacyInfoHidden()
  })

  test('should display token selectors', async () => {
    await demoPage.goto()

    await expect(demoPage.swapCard.fromToken).toBeVisible()
    await expect(demoPage.swapCard.toToken).toBeVisible()
  })

  test('should open token selector on click', async ({ page }) => {
    await demoPage.goto()

    await demoPage.swapCard.fromToken.click()
    await page.waitForTimeout(200)

    // Token dropdown should show all token options (button text includes symbol + name)
    await expect(page.locator('button').filter({ hasText: /SOL.*Solana/i })).toBeVisible()
    await expect(page.locator('button').filter({ hasText: /ETH.*Ethereum/i })).toBeVisible()
    await expect(page.locator('button').filter({ hasText: /NEAR/i })).toBeVisible()
  })

  test('should change token when selected', async ({ page }) => {
    await demoPage.goto()

    // Click from token selector
    await demoPage.swapCard.fromToken.click()

    // Wait for dropdown to appear
    const dropdown = page.getByTestId('token-dropdown')
    await expect(dropdown).toBeVisible()

    // Select ETH using specific data-testid
    const ethOption = page.getByTestId('token-option-ETH')
    await ethOption.click()

    // Verify token changed
    await expect(demoPage.swapCard.fromToken).toContainText('ETH')
  })
})
