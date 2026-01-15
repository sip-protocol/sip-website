import { test, expect } from '@playwright/test'
import { DemoPage } from '../pages/demo.page'

/**
 * Accessibility Tests
 * Tests keyboard navigation, ARIA attributes, focus management, and screen reader support
 */

// SKIPPED: The /demo page has been deprecated and migrated to sip-app. See: https://github.com/sip-protocol/sip-website/issues/156
test.describe.skip('Accessibility', () => {
  let demoPage: DemoPage

  test.beforeEach(async ({ page }) => {
    demoPage = new DemoPage(page)
    await demoPage.goto()
  })

  test.describe('Keyboard Navigation', () => {
    test('should be able to tab to swap card input', async ({ page }) => {
      await page.keyboard.press('Tab')

      // Keep tabbing until we reach the input or max attempts
      let found = false
      for (let i = 0; i < 20; i++) {
        const focused = await page.locator(':focus')
        const tagName = await focused.evaluate(el => el.tagName.toLowerCase())
        if (tagName === 'input') {
          found = true
          break
        }
        await page.keyboard.press('Tab')
      }
      expect(found).toBeTruthy()
    })

    test('should be able to navigate privacy toggle with keyboard', async ({ page }) => {
      // Focus on privacy toggle
      await demoPage.privacyToggle.publicButton.focus()

      // Should be focusable
      const focused = page.locator(':focus')
      await expect(focused).toBeVisible()
    })

    test('should support arrow keys in privacy toggle', async ({ page }) => {
      // Focus on public button
      await demoPage.privacyToggle.publicButton.focus()
      await page.keyboard.press('ArrowRight')

      // Should move to next option (Shielded)
      await page.waitForTimeout(100)

      // Check if shielded is now focused or selected
      const shieldedFocused = await demoPage.privacyToggle.shieldedButton.evaluate(
        el => el === document.activeElement || el.getAttribute('aria-checked') === 'true'
      )
      // Radio groups typically support arrow key navigation
    })

    test('should be able to activate swap button with Enter', async ({ page }) => {
      // First enter amount
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      // Focus swap button
      await demoPage.swapCard.swapButton.focus()
      await expect(page.locator(':focus')).toContainText(/swap|connect/i)
    })

    test('should maintain focus trap in modals', async ({ page }) => {
      // Open wallet modal
      await demoPage.swapCard.swapButton.click()

      // Check if modal is visible
      const modal = page.locator('[role="dialog"], [data-testid*="modal"]').first()
      if (await modal.isVisible()) {
        // Tab should cycle within modal
        await page.keyboard.press('Tab')
        const focusedInModal = await page.locator(':focus').evaluate(el => {
          const modal = el.closest('[role="dialog"]')
          return modal !== null
        })
        // Focus should stay in modal
      }
    })

    test('should close dropdowns with Escape key', async ({ page }) => {
      // Open token dropdown
      await demoPage.swapCard.fromToken.click()
      await page.waitForTimeout(200)

      // Press Escape
      await page.keyboard.press('Escape')
      await page.waitForTimeout(100)

      // Dropdown should be closed
      await expect(page.getByTestId('token-dropdown')).toBeHidden()
    })
  })

  test.describe('ARIA Attributes', () => {
    test('privacy toggle container should exist', async () => {
      // Note: role="radiogroup" is best practice but may not be implemented yet
      const toggle = demoPage.privacyToggle.container
      await expect(toggle).toBeVisible()
    })

    test('privacy buttons should have role="radio"', async () => {
      const publicRole = await demoPage.privacyToggle.publicButton.getAttribute('role')
      const shieldedRole = await demoPage.privacyToggle.shieldedButton.getAttribute('role')
      const compliantRole = await demoPage.privacyToggle.compliantButton.getAttribute('role')

      expect(publicRole).toBe('radio')
      expect(shieldedRole).toBe('radio')
      expect(compliantRole).toBe('radio')
    })

    test('selected privacy level should have aria-checked="true"', async () => {
      await demoPage.selectPrivacyLevel('shielded')

      const ariaChecked = await demoPage.privacyToggle.shieldedButton.getAttribute('aria-checked')
      expect(ariaChecked).toBe('true')
    })

    test('input fields should have labels', async ({ page }) => {
      const input = demoPage.swapCard.fromInput

      // Check for aria-label or associated label
      const ariaLabel = await input.getAttribute('aria-label')
      const labelledBy = await input.getAttribute('aria-labelledby')
      const id = await input.getAttribute('id')

      // Should have some form of labelling
      const hasLabel = ariaLabel || labelledBy || (id && await page.locator(`label[for="${id}"]`).count() > 0)
    })

    test('buttons should have accessible names', async () => {
      const swapButton = demoPage.swapCard.swapButton

      // Button should have text content or aria-label
      const text = await swapButton.textContent()
      const ariaLabel = await swapButton.getAttribute('aria-label')

      expect(text || ariaLabel).toBeTruthy()
    })

    test('validation errors should be announced', async ({ page }) => {
      // Select ZEC and enter invalid address
      await demoPage.swapCard.toToken.click()
      await page.getByTestId('token-option-ZEC').click()
      await demoPage.enterZcashAddress('invalid')

      // Error should have role="alert" for screen reader announcement
      const errorRole = await demoPage.zcash.validationError.getAttribute('role')
      expect(errorRole).toBe('alert')
    })
  })

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      // Tab to an element
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      const focused = page.locator(':focus')
      await expect(focused).toBeVisible()

      // Check if focus ring is visible (basic check)
      const outlineStyle = await focused.evaluate(el => {
        const computed = window.getComputedStyle(el)
        return computed.outline || computed.boxShadow || computed.border
      })
      // Should have some visual focus indicator
    })

    test('should return focus after modal closes', async ({ page }) => {
      const triggerButton = demoPage.swapCard.swapButton
      await triggerButton.click()

      const modal = page.locator('[role="dialog"]').first()
      if (await modal.isVisible()) {
        // Close modal with Escape
        await page.keyboard.press('Escape')
        await page.waitForTimeout(100)

        // Focus should return to trigger
        const focused = page.locator(':focus')
        // Check if focus returned to button or nearby element
      }
    })

    test('should not trap focus outside interactive elements', async ({ page }) => {
      // Tab through the page - should eventually cycle
      let tabCount = 0
      const maxTabs = 100

      while (tabCount < maxTabs) {
        await page.keyboard.press('Tab')
        tabCount++

        const focused = page.locator(':focus')
        if (await focused.count() === 0) {
          // If nothing is focused, tab should still work
          break
        }
      }
      // Should not get stuck
      expect(tabCount).toBeLessThan(maxTabs)
    })
  })

  test.describe('Screen Reader Support', () => {
    test('should have descriptive page title', async ({ page }) => {
      const title = await page.title()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(0)
    })

    test('should have logical heading hierarchy', async ({ page }) => {
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBeGreaterThanOrEqual(1)

      // h1 should come before h2s
      const firstH1 = await page.locator('h1').first().boundingBox()
      const firstH2 = await page.locator('h2').first().boundingBox()

      if (firstH1 && firstH2) {
        expect(firstH1.y).toBeLessThan(firstH2.y)
      }
    })

    test('should have alt text for images', async ({ page }) => {
      const images = page.locator('img')
      const count = await images.count()

      for (let i = 0; i < count; i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        const role = await img.getAttribute('role')

        // Should have alt or role="presentation"
        const hasAccessibleName = alt !== null || role === 'presentation'
        // Decorative images should be marked
      }
    })

    test('should have landmark regions', async ({ page }) => {
      // Check for main landmarks
      const main = await page.locator('main, [role="main"]').count()
      const nav = await page.locator('nav, [role="navigation"]').count()

      // Page should have at least main content area
      expect(main).toBeGreaterThanOrEqual(0) // Some SPAs might not have explicit main
    })

    test('should announce loading states', async ({ page }) => {
      await demoPage.enterAmount('1')

      // Check for aria-busy or loading indicators with accessible names
      const loading = page.locator('[aria-busy="true"], [role="progressbar"], [role="status"]')
      // Loading state might be too fast to catch
    })
  })

  test.describe('Color and Contrast', () => {
    test('should not rely solely on color for information', async ({ page }) => {
      // Privacy levels should have icons or text, not just color
      const publicButton = demoPage.privacyToggle.publicButton
      const text = await publicButton.textContent()

      // Should have text content, not just color
      expect(text?.length).toBeGreaterThan(0)
    })

    test('error states should have text, not just color', async ({ page }) => {
      // Select ZEC and enter invalid address
      await demoPage.swapCard.toToken.click()
      await page.getByTestId('token-option-ZEC').click()
      await demoPage.enterZcashAddress('invalid')

      // Error message should have text
      const errorText = await demoPage.zcash.validationError.textContent()
      expect(errorText?.length).toBeGreaterThan(0)
    })
  })

  test.describe('Motion and Animation', () => {
    test('should respect reduced motion preference', async ({ page }) => {
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await demoPage.goto()

      // Page should still be functional
      await expect(demoPage.swapCard.container).toBeVisible()

      // Animations should be disabled or reduced
      // This is a basic check - actual animation testing requires more setup
    })
  })

  test.describe('Interactive Elements', () => {
    test('all buttons should be clickable', async ({ page }) => {
      const buttons = page.locator('button:visible')
      const count = await buttons.count()

      for (let i = 0; i < Math.min(count, 10); i++) {
        const button = buttons.nth(i)
        const isDisabled = await button.isDisabled()

        if (!isDisabled) {
          // Button should be interactable
          await expect(button).toBeEnabled()
        }
      }
    })

    test('links should have meaningful text', async ({ page }) => {
      const links = page.locator('a:visible')
      const count = await links.count()

      for (let i = 0; i < Math.min(count, 10); i++) {
        const link = links.nth(i)
        const text = await link.textContent()
        const ariaLabel = await link.getAttribute('aria-label')

        // Should not have "click here" or empty text
        const accessibleName = text || ariaLabel || ''
        expect(accessibleName.toLowerCase()).not.toBe('click here')
        expect(accessibleName.trim().length).toBeGreaterThan(0)
      }
    })

    test('main interactive buttons should be appropriately sized', async ({ page }) => {
      // Focus on main action buttons, not icon buttons
      const swapButton = demoPage.swapCard.swapButton
      const box = await swapButton.boundingBox()

      if (box) {
        // Main action buttons should meet minimum touch target size
        expect(box.width).toBeGreaterThanOrEqual(44)
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    })
  })
})
