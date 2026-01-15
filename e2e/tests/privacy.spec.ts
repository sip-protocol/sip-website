import { test, expect } from '@playwright/test'
import { DemoPage } from '../pages/demo.page'

/**
 * Flow 2: Privacy Toggle Tests
 * Tests privacy level switching and UI updates
 */

// SKIPPED: The /demo page has been deprecated and migrated to sip-app. See: https://github.com/sip-protocol/sip-website/issues/156
test.describe.skip('Privacy Toggle', () => {
  let demoPage: DemoPage

  test.beforeEach(async ({ page }) => {
    demoPage = new DemoPage(page)
    await demoPage.goto()
  })

  test('should display all three privacy options', async () => {
    await expect(demoPage.privacyToggle.publicButton).toBeVisible()
    await expect(demoPage.privacyToggle.shieldedButton).toBeVisible()
    await expect(demoPage.privacyToggle.compliantButton).toBeVisible()
  })

  test('should have Shielded as default', async () => {
    // role="radio" uses aria-checked, not aria-pressed
    await expect(demoPage.privacyToggle.shieldedButton).toHaveAttribute('aria-checked', 'true')
  })

  test('should switch to Public mode', async () => {
    await demoPage.selectPrivacyLevel('public')
    await expect(demoPage.privacyToggle.publicButton).toHaveAttribute('aria-checked', 'true')
    await expect(demoPage.swapCard.privacyBadge).toContainText('Public')
  })

  test('should switch to Compliant mode', async () => {
    await demoPage.selectPrivacyLevel('compliant')
    await expect(demoPage.privacyToggle.compliantButton).toHaveAttribute('aria-checked', 'true')
  })

  test('should switch back to Shielded from Public', async () => {
    await demoPage.selectPrivacyLevel('public')
    await demoPage.selectPrivacyLevel('shielded')
    await expect(demoPage.privacyToggle.shieldedButton).toHaveAttribute('aria-checked', 'true')
  })

  test('should show privacy info box in shielded mode', async () => {
    await demoPage.expectPrivacyInfoVisible()
  })

  test('should hide privacy info in public mode', async () => {
    await demoPage.selectPrivacyLevel('public')
    await demoPage.expectPrivacyInfoHidden()
  })

  test('should show privacy info in compliant mode', async () => {
    await demoPage.selectPrivacyLevel('compliant')
    await demoPage.expectPrivacyInfoVisible()
  })

  test('should update swap button text based on privacy level', async () => {
    // Shielded mode shows "Connect Wallet" or "Shielded Swap"
    await demoPage.expectSwapButtonText(/connect|shielded/i)

    // Switch to Public - should show "Swap" not "Shielded Swap"
    await demoPage.selectPrivacyLevel('public')
    const buttonText = await demoPage.swapCard.swapButton.textContent()
    if (!buttonText?.toLowerCase().includes('connect')) {
      expect(buttonText?.toLowerCase()).not.toContain('shielded')
    }
  })

  test('should update privacy badge based on level', async () => {
    // Default: Shielded
    await expect(demoPage.swapCard.privacyBadge).toContainText('Shielded')

    // Switch to Public
    await demoPage.selectPrivacyLevel('public')
    await expect(demoPage.swapCard.privacyBadge).toContainText('Public')

    // Switch to Shielded
    await demoPage.selectPrivacyLevel('shielded')
    await expect(demoPage.swapCard.privacyBadge).toContainText('Shielded')
  })
})
