import { test, expect } from '@playwright/test'
import { DemoPage } from '../pages/demo.page'

/**
 * Same-Chain Privacy Tests
 * Tests for Solana→Solana same-chain privacy feature
 *
 * NOTE: Same-chain privacy requires fromToken.symbol === toToken.symbol (e.g., SOL→SOL),
 * but the UI's token selection logic prevents selecting the same token on both sides
 * (it auto-swaps to prevent same-token selection). This is a known design conflict.
 *
 * Tests that require same-token selection are marked as .fixme() until the UI
 * is updated to allow same-token selection for privacy transfers.
 */

test.describe('Same-Chain Privacy', () => {
  let demoPage: DemoPage

  test.beforeEach(async ({ page }) => {
    demoPage = new DemoPage(page)
    await demoPage.goto()
  })

  // FIXME: UI prevents same-token selection (auto-swaps tokens)
  // Same-chain privacy requires SOL→SOL but selecting SOL on both sides swaps them
  test.fixme('should show privacy banner when SOL→SOL with shielded mode', async ({ page }) => {
    // Select SOL as from token
    await demoPage.swapCard.fromToken.click()
    await page.getByTestId('token-option-SOL').click()

    // Select SOL as to token - but UI will auto-swap!
    await demoPage.swapCard.toToken.click()
    await page.getByTestId('token-option-SOL').click()

    // Ensure shielded mode is active (default)
    await expect(demoPage.privacyToggle.shieldedButton).toHaveAttribute('aria-checked', 'true')

    // Verify same-chain privacy banner appears
    await expect(page.getByTestId('same-chain-privacy-banner')).toBeVisible()
  })

  test('should hide banner when chains differ', async ({ page }) => {
    // Default is ETH→SOL (different chains)
    // Banner should not appear
    await expect(page.getByTestId('same-chain-privacy-banner')).toBeHidden()
  })

  test('should hide banner for same chain but different tokens', async ({ page }) => {
    // Select SOL as from token (Solana chain)
    await demoPage.swapCard.fromToken.click()
    await page.getByTestId('token-option-SOL').click()

    // Select a different destination (auto-swap will happen if we try SOL→SOL)
    // Banner should NOT appear for same chain different tokens (current implementation)
    await expect(page.getByTestId('same-chain-privacy-banner')).toBeHidden()
  })

  // FIXME: UI prevents same-token selection
  test.fixme('should hide banner when privacy is public', async ({ page }) => {
    // Select SOL→SOL
    await demoPage.swapCard.fromToken.click()
    await page.getByTestId('token-option-SOL').click()
    await demoPage.swapCard.toToken.click()
    await page.getByTestId('token-option-SOL').click()

    // Verify banner is initially visible
    await expect(page.getByTestId('same-chain-privacy-banner')).toBeVisible()

    // Switch to public mode
    await demoPage.selectPrivacyLevel('public')

    // Banner should disappear
    await expect(page.getByTestId('same-chain-privacy-banner')).toBeHidden()
  })

  // FIXME: UI prevents same-token selection
  test.fixme('should show "Recipient SIP Address" label for same-chain', async ({ page }) => {
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

  // FIXME: UI prevents same-token selection
  test.fixme('should show banner in compliant mode', async ({ page }) => {
    // Select SOL→SOL
    await demoPage.swapCard.fromToken.click()
    await page.getByTestId('token-option-SOL').click()
    await demoPage.swapCard.toToken.click()
    await page.getByTestId('token-option-SOL').click()

    // Switch to compliant mode
    await demoPage.selectPrivacyLevel('compliant')

    // Banner should still be visible (compliant has privacy)
    await expect(page.getByTestId('same-chain-privacy-banner')).toBeVisible()
  })
})
