import { test, expect } from '@playwright/test'
import { DemoPage } from '../pages/demo.page'

/**
 * Same-Chain Privacy Tests
 * Tests for Solana→Solana same-chain privacy feature
 *
 * Same-chain privacy requires fromToken.symbol === toToken.symbol (e.g., SOL→SOL).
 * The UI allows same-token selection when privacy mode is enabled (shielded/compliant),
 * but auto-swaps in transparent mode to prevent accidental same-token selection.
 */

// SKIPPED: The /demo page has been deprecated and migrated to sip-app. See: https://github.com/sip-protocol/sip-website/issues/156
test.describe.skip('Same-Chain Privacy', () => {
  let demoPage: DemoPage

  test.beforeEach(async ({ page }) => {
    demoPage = new DemoPage(page)
    await demoPage.goto()
  })

  test('should show privacy banner when SOL→SOL with shielded mode', async ({ page }) => {
    // Ensure shielded mode is active (default) - this allows same-token selection
    await expect(demoPage.privacyToggle.shieldedButton).toHaveAttribute('aria-checked', 'true')

    // Select SOL as from token
    await demoPage.swapCard.fromToken.click()
    await page.getByTestId('token-option-SOL').click()

    // Select SOL as to token - allowed in shielded mode
    await demoPage.swapCard.toToken.click()
    await page.getByTestId('token-option-SOL').click()

    // Verify same-chain privacy banner appears
    await expect(page.getByTestId('same-chain-privacy-banner')).toBeVisible()
  })

  test('should hide banner when chains differ', async ({ page }) => {
    // Default is ETH→SOL (different chains)
    // Banner should not appear
    await expect(page.getByTestId('same-chain-privacy-banner')).toBeHidden()
  })

  test('should hide banner for cross-chain with SOL as source', async ({ page }) => {
    // Select SOL as from token
    await demoPage.swapCard.fromToken.click()
    await page.getByTestId('token-option-SOL').click()

    // Select NEAR as to token (different chain)
    await demoPage.swapCard.toToken.click()
    await page.getByTestId('token-option-NEAR').click()

    // Banner should NOT appear for different chains (SOL→NEAR)
    await expect(page.getByTestId('same-chain-privacy-banner')).toBeHidden()
  })

  test('should hide banner when privacy is public', async ({ page }) => {
    // Ensure shielded mode first to allow SOL→SOL selection
    await expect(demoPage.privacyToggle.shieldedButton).toHaveAttribute('aria-checked', 'true')

    // Select SOL→SOL while in shielded mode
    await demoPage.swapCard.fromToken.click()
    await page.getByTestId('token-option-SOL').click()
    await demoPage.swapCard.toToken.click()
    await page.getByTestId('token-option-SOL').click()

    // Verify banner is initially visible
    await expect(page.getByTestId('same-chain-privacy-banner')).toBeVisible()

    // Switch to public mode
    await demoPage.selectPrivacyLevel('public')

    // Banner should disappear (public mode = no privacy)
    await expect(page.getByTestId('same-chain-privacy-banner')).toBeHidden()
  })

  test('should show "Recipient SIP Address" label for same-chain', async ({ page }) => {
    // Ensure shielded mode is active (default)
    await expect(demoPage.privacyToggle.shieldedButton).toHaveAttribute('aria-checked', 'true')

    // Select SOL→SOL with shielded mode
    await demoPage.swapCard.fromToken.click()
    await page.getByTestId('token-option-SOL').click()
    await demoPage.swapCard.toToken.click()
    await page.getByTestId('token-option-SOL').click()

    // Verify destination input label changes to SIP address
    await expect(page.locator('text=Recipient SIP Address')).toBeVisible()
  })

  test('should show "Destination Address" label for cross-chain', async ({ page }) => {
    // Default ETH→SOL setup
    // Verify destination input shows standard label
    await expect(page.locator('text=Destination Address')).toBeVisible()
  })

  test('should show banner in compliant mode', async ({ page }) => {
    // Ensure shielded mode first to allow SOL→SOL selection
    await expect(demoPage.privacyToggle.shieldedButton).toHaveAttribute('aria-checked', 'true')

    // Select SOL→SOL
    await demoPage.swapCard.fromToken.click()
    await page.getByTestId('token-option-SOL').click()
    await demoPage.swapCard.toToken.click()
    await page.getByTestId('token-option-SOL').click()

    // Switch to compliant mode (still has privacy)
    await demoPage.selectPrivacyLevel('compliant')

    // Banner should still be visible (compliant has privacy)
    await expect(page.getByTestId('same-chain-privacy-banner')).toBeVisible()
  })
})
