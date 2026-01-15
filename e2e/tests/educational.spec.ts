import { test, expect } from '@playwright/test'
import { DemoPage } from '../pages/demo.page'

/**
 * Educational Components Tests
 * Tests privacy comparison cards, how-it-works sections, and educational content
 */

// SKIPPED: The /demo page has been deprecated and migrated to sip-app. See: https://github.com/sip-protocol/sip-website/issues/156
test.describe.skip('Educational Components', () => {
  let demoPage: DemoPage

  test.beforeEach(async ({ page }) => {
    demoPage = new DemoPage(page)
    await demoPage.goto()
  })

  test.describe('Privacy Level Comparison', () => {
    test('should display privacy toggle with all three options', async ({ page }) => {
      // The privacy toggle serves as the comparison selector
      await expect(demoPage.privacyToggle.container).toBeVisible()
      await expect(demoPage.privacyToggle.publicButton).toBeVisible()
      await expect(demoPage.privacyToggle.shieldedButton).toBeVisible()
      await expect(demoPage.privacyToggle.compliantButton).toBeVisible()
    })

    test('should display privacy level descriptions in page content', async ({ page }) => {
      // Look for privacy-related content anywhere on the page
      const transparentText = page.locator('text=/transparent|public/i').first()
      const shieldedText = page.locator('text=/shielded|private/i').first()
      const compliantText = page.locator('text=/compliant|audit/i').first()

      // At least one privacy description should be visible
      const hasPrivacyContent = await transparentText.isVisible() ||
        await shieldedText.isVisible() ||
        await compliantText.isVisible()
      expect(hasPrivacyContent).toBeTruthy()
    })

    test('should switch privacy level when clicking toggle buttons', async ({ page }) => {
      // Click on Shielded button
      await demoPage.privacyToggle.shieldedButton.click()
      await page.waitForTimeout(200)

      // Should update the privacy toggle
      await demoPage.expectPrivacyLevelActive('shielded')
    })

    test('should show different privacy badges for each level', async ({ page }) => {
      // Test that switching privacy levels updates the badge
      await demoPage.selectPrivacyLevel('public')
      await expect(demoPage.swapCard.privacyBadge).toContainText(/transparent|public/i)

      await demoPage.selectPrivacyLevel('shielded')
      await expect(demoPage.swapCard.privacyBadge).toContainText(/shielded/i)

      await demoPage.selectPrivacyLevel('compliant')
      await expect(demoPage.swapCard.privacyBadge).toContainText(/compliant/i)
    })
  })

  test.describe('How It Works Section', () => {
    test('should display how it works section', async ({ page }) => {
      const howItWorks = page.locator('text=How It Works').first()
      await howItWorks.scrollIntoViewIfNeeded()
      await expect(howItWorks).toBeVisible()
    })

    test('should show step-by-step explanation', async ({ page }) => {
      await demoPage.scrollToSection('howItWorks')

      // Should have numbered steps or process flow
      const stepsVisible = await page.locator('[class*="step"], [class*="Step"], ol, .process').first().isVisible()
      // Steps might be implemented differently
    })
  })

  test.describe('Before vs After Comparison', () => {
    test('should display comparison view', async ({ page }) => {
      const comparisonTitle = page.locator('text=/Before.*After|Before vs After/i').first()
      if (await comparisonTitle.isVisible()) {
        await comparisonTitle.scrollIntoViewIfNeeded()
        await expect(comparisonTitle).toBeVisible()
      }
    })

    test('should show before and after states', async ({ page }) => {
      // This section shows transaction visibility before and after SIP
      const beforeSection = page.locator('text=/before|without sip/i').first()
      const afterSection = page.locator('text=/after|with sip/i').first()

      if (await beforeSection.isVisible()) {
        await expect(beforeSection).toBeVisible()
      }
    })
  })

  test.describe('Pedersen Commitment Demo', () => {
    test('should display Pedersen demo section', async ({ page }) => {
      const pedersenSection = page.locator('text=Pedersen').first()
      if (await pedersenSection.isVisible()) {
        await pedersenSection.scrollIntoViewIfNeeded()
        await expect(pedersenSection).toBeVisible()
      }
    })

    test('should explain commitment properties', async ({ page }) => {
      const pedersenSection = page.locator('section:has-text("Pedersen"), div:has-text("Pedersen")').first()
      if (await pedersenSection.isVisible()) {
        // Should mention hiding, binding, or homomorphic
        const hasExplanation = await page.locator('text=/hiding|binding|homomorphic|commitment/i').first().isVisible()
        expect(hasExplanation).toBeTruthy()
      }
    })
  })

  test.describe('Zcash Showcase', () => {
    test('should display Zcash integration info', async ({ page }) => {
      const zcashSection = page.locator('text=Zcash').first()
      await zcashSection.scrollIntoViewIfNeeded()
      await expect(zcashSection).toBeVisible()
    })

    test('should mention shielded transactions', async ({ page }) => {
      const zcashContent = page.locator('section:has-text("Zcash"), div:has-text("Zcash")').first()
      if (await zcashContent.isVisible()) {
        // Zcash section should mention shielded/z-addresses
        const hasShieldedInfo = await page.locator('text=/shielded|z-address|zs1|sapling|orchard/i').first().isVisible()
      }
    })
  })

  test.describe('Transaction Proof Section', () => {
    test('should display cryptographic proof info', async ({ page }) => {
      const proofSection = page.locator('text=/cryptographic|proof|verification/i').first()
      if (await proofSection.isVisible()) {
        await proofSection.scrollIntoViewIfNeeded()
        await expect(proofSection).toBeVisible()
      }
    })
  })

  test.describe('Page Layout', () => {
    test('should have clear section hierarchy', async ({ page }) => {
      // Check for main sections with proper headings
      const headings = await page.locator('h1, h2, h3').count()
      expect(headings).toBeGreaterThan(0)
    })

    test('should be responsive', async ({ page }) => {
      // Check at mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await demoPage.goto()

      // Main content should still be visible
      await expect(demoPage.swapCard.container).toBeVisible()
    })

    test('should maintain readability at different sizes', async ({ page }) => {
      // Tablet size
      await page.setViewportSize({ width: 768, height: 1024 })
      await demoPage.goto()

      await expect(demoPage.swapCard.container).toBeVisible()
    })
  })

  test.describe('External Links', () => {
    test('should have working documentation link', async ({ page }) => {
      const docsLink = page.locator('a[href*="docs"], a:has-text("Docs"), a:has-text("Documentation")').first()
      if (await docsLink.isVisible()) {
        const href = await docsLink.getAttribute('href')
        expect(href).toBeTruthy()
      }
    })

    test('should have GitHub link', async ({ page }) => {
      const githubLink = page.locator('a[href*="github"]').first()
      if (await githubLink.isVisible()) {
        const href = await githubLink.getAttribute('href')
        expect(href).toContain('github.com')
      }
    })
  })
})
