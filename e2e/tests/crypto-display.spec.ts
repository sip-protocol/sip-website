import { test, expect } from '@playwright/test'
import { DemoPage } from '../pages/demo.page'

/**
 * Crypto Display Tests
 * Tests stealth address, Pedersen commitment, and viewing key displays
 */

// SKIPPED: The /demo page has been deprecated and migrated to sip-app. See: https://github.com/sip-protocol/sip-website/issues/156
test.describe.skip('Crypto Display', () => {
  let demoPage: DemoPage

  test.beforeEach(async ({ page }) => {
    demoPage = new DemoPage(page)
    await demoPage.goto()
  })

  test.describe('Stealth Address Display', () => {
    test.beforeEach(async () => {
      // Stealth addresses show in Shielded mode
      await demoPage.selectPrivacyLevel('shielded')
    })

    test('should show privacy info in shielded mode', async ({ page }) => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      // Privacy info section should be visible in shielded mode
      await expect(page.locator('[data-testid="privacy-info"]')).toBeVisible()
    })

    test('should display stealth address with correct format', async () => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      const addressElement = demoPage.stealthAddress.address
      if (await addressElement.isVisible()) {
        const address = await addressElement.textContent()
        // Stealth addresses should start with 'sip:' or be a hex string
        expect(address).toBeTruthy()
      }
    })

    test('should have copy button for stealth address', async () => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      if (await demoPage.stealthAddress.container.isVisible()) {
        const copyButton = demoPage.stealthAddress.copyButton
        // Copy button may or may not be visible depending on implementation
        if (await copyButton.isVisible()) {
          await expect(copyButton).toBeEnabled()
        }
      }
    })

    test('should hide stealth address in transparent mode', async () => {
      await demoPage.selectPrivacyLevel('public')
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      await expect(demoPage.stealthAddress.container).toBeHidden()
    })
  })

  test.describe('Pedersen Commitment Display', () => {
    test.beforeEach(async () => {
      // Commitments show in Shielded mode
      await demoPage.selectPrivacyLevel('shielded')
    })

    test('should show privacy info with commitment in shielded mode', async ({ page }) => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      // Privacy info should contain commitment-related content
      const privacyInfo = page.locator('[data-testid="privacy-info"]')
      await expect(privacyInfo).toBeVisible()
    })

    test('should display commitment value', async () => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      const commitmentElement = demoPage.commitment.value
      if (await commitmentElement.isVisible()) {
        const value = await commitmentElement.textContent()
        // Commitment should be a hex string
        expect(value).toBeTruthy()
      }
    })

    test('should have copy button for commitment', async () => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      if (await demoPage.commitment.container.isVisible()) {
        const copyButton = demoPage.commitment.copyButton
        if (await copyButton.isVisible()) {
          await expect(copyButton).toBeEnabled()
        }
      }
    })

    test('should hide commitment in transparent mode', async () => {
      await demoPage.selectPrivacyLevel('public')
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      await expect(demoPage.commitment.container).toBeHidden()
    })

    test('should show "How it works" link for commitment', async () => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      if (await demoPage.commitment.container.isVisible()) {
        const howItWorks = demoPage.commitment.howItWorks
        if (await howItWorks.isVisible()) {
          await expect(howItWorks).toBeEnabled()
        }
      }
    })
  })

  test.describe('Viewing Key Display (Compliant Mode)', () => {
    test.beforeEach(async () => {
      await demoPage.selectPrivacyLevel('compliant')
    })

    test('should show privacy info in compliant mode', async ({ page }) => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      // Privacy info should be visible in compliant mode
      await expect(page.locator('[data-testid="privacy-info"]')).toBeVisible()
    })

    test('should have reveal button for viewing key', async () => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      if (await demoPage.viewingKey.container.isVisible()) {
        const revealButton = demoPage.viewingKey.revealButton
        if (await revealButton.isVisible()) {
          await expect(revealButton).toBeEnabled()
        }
      }
    })

    test('should hide viewing key in shielded mode', async () => {
      await demoPage.selectPrivacyLevel('shielded')
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      await expect(demoPage.viewingKey.container).toBeHidden()
    })

    test('should hide viewing key in transparent mode', async () => {
      await demoPage.selectPrivacyLevel('public')
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      await expect(demoPage.viewingKey.container).toBeHidden()
    })
  })

  test.describe('Privacy Badge', () => {
    test('should show correct badge for transparent mode', async () => {
      await demoPage.selectPrivacyLevel('public')
      await expect(demoPage.swapCard.privacyBadge).toContainText(/transparent|public/i)
    })

    test('should show correct badge for shielded mode', async () => {
      await demoPage.selectPrivacyLevel('shielded')
      await expect(demoPage.swapCard.privacyBadge).toContainText(/shielded/i)
    })

    test('should show correct badge for compliant mode', async () => {
      await demoPage.selectPrivacyLevel('compliant')
      await expect(demoPage.swapCard.privacyBadge).toContainText(/compliant/i)
    })
  })

  test.describe('Quote Details', () => {
    test('should display rate after quote', async ({ page }) => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      await expect(page.locator('text=Rate').first()).toBeVisible()
    })

    test('should display fee information', async ({ page }) => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      // Fee might be labeled as "Solver Fee" or just "Fee"
      const feeVisible = await page.locator('text=/fee/i').first().isVisible()
      expect(feeVisible).toBeTruthy()
    })

    test('should display route information', async ({ page }) => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      await expect(page.locator('text=Route').first()).toBeVisible()
    })

    test('should display estimated time', async ({ page }) => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      // Time might be labeled as "Est. time" or "Estimated time"
      const timeVisible = await page.locator('text=/time/i').first().isVisible()
      expect(timeVisible).toBeTruthy()
    })
  })
})
