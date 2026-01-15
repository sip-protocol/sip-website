import { test, expect } from '@playwright/test'
import { DemoPage } from '../pages/demo.page'

/**
 * Token Selection Tests
 * Tests token selectors, cross-chain flows, and quote updates
 */

// SKIPPED: The /demo page has been deprecated and migrated to sip-app. See: https://github.com/sip-protocol/sip-website/issues/156
test.describe.skip('Token Selection', () => {
  let demoPage: DemoPage

  test.beforeEach(async ({ page }) => {
    demoPage = new DemoPage(page)
    await demoPage.goto()
  })

  test.describe('From Token Selector', () => {
    test('should display all source chains', async ({ page }) => {
      await demoPage.swapCard.fromToken.click()
      await page.waitForTimeout(200)

      // Core chains with reliable 1Click API quote support
      const chains = ['ETH', 'SOL', 'NEAR']
      for (const chain of chains) {
        await expect(page.getByTestId(`token-option-${chain}`)).toBeVisible()
      }
    })

    test('should close dropdown after selection', async ({ page }) => {
      await demoPage.swapCard.fromToken.click()
      await page.getByTestId('token-option-SOL').click()

      // Dropdown should be closed
      await expect(page.getByTestId('token-dropdown')).toBeHidden()
    })

    test('should update token display after selection', async ({ page }) => {
      await demoPage.swapCard.fromToken.click()
      await page.getByTestId('token-option-SOL').click()

      await expect(demoPage.swapCard.fromToken).toContainText('SOL')
    })

    test('should have default token selected (ETH)', async () => {
      await expect(demoPage.swapCard.fromToken).toContainText('ETH')
    })
  })

  test.describe('To Token Selector', () => {
    test('should display all destination tokens (including ZEC)', async ({ page }) => {
      await demoPage.swapCard.toToken.click()
      await page.waitForTimeout(200)

      // Destination tokens: ZEC (privacy), ETH, SOL, NEAR
      // ZEC is the privacy output - users swap TO Zcash for shielded transactions
      const tokens = ['ZEC', 'ETH', 'SOL', 'NEAR']
      for (const token of tokens) {
        await expect(page.getByTestId(`token-option-${token}`)).toBeVisible()
      }
    })

    test('should show ZEC with shield icon', async ({ page }) => {
      await demoPage.swapCard.toToken.click()

      const zecOption = page.getByTestId('token-option-ZEC')
      await expect(zecOption).toBeVisible()
      await expect(zecOption).toContainText('Zcash')
    })
  })

  test.describe('Cross-Chain Quote Updates', () => {
    test('should fetch new quote when source token changes', async ({ page }) => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()
      const firstOutput = await demoPage.getOutputAmount()

      // Change source token
      await demoPage.swapCard.fromToken.click()
      await page.getByTestId('token-option-SOL').click()
      await demoPage.waitForQuote()

      // Output should potentially change (or at least not crash)
      const secondOutput = await demoPage.getOutputAmount()
      expect(secondOutput).toBeDefined()
    })

    test('should fetch new quote when destination token changes', async ({ page }) => {
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      // Change destination token
      await demoPage.swapCard.toToken.click()
      await page.getByTestId('token-option-NEAR').click()
      await demoPage.waitForQuote()

      // Should show new route
      await expect(page.locator('text=/→ NEAR/i')).toBeVisible()
    })

    test('should update route display for SOL → ETH', async ({ page }) => {
      await demoPage.swapCard.fromToken.click()
      await page.getByTestId('token-option-SOL').click()

      await demoPage.swapCard.toToken.click()
      await page.getByTestId('token-option-ETH').click()

      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      await expect(page.locator('text=Solana → Ethereum')).toBeVisible()
    })

    test('should update route display for ETH → ZEC', async ({ page }) => {
      await demoPage.swapCard.fromToken.click()
      await page.getByTestId('token-option-ETH').click()

      await demoPage.swapCard.toToken.click()
      await page.getByTestId('token-option-ZEC').click()

      await demoPage.enterAmount('0.1')
      await demoPage.waitForQuote()

      await expect(page.locator('text=Ethereum → Zcash')).toBeVisible()
    })
  })

  test.describe('Swap Direction Button', () => {
    test('should have swap direction button visible', async ({ page }) => {
      const swapDirectionBtn = page.locator('button[aria-label="Swap direction"]')
      await expect(swapDirectionBtn).toBeVisible()
    })

    test('swap direction button should be clickable', async ({ page }) => {
      // Note: The swap direction button is currently a visual indicator only
      // and doesn't swap tokens. This test verifies the button is interactive.
      const swapDirectionBtn = page.locator('button[aria-label="Swap direction"]')
      await expect(swapDirectionBtn).toBeEnabled()

      // Button should respond to interaction without errors
      await swapDirectionBtn.click()
      // Page should still be functional
      await expect(demoPage.swapCard.container).toBeVisible()
    })
  })

  test.describe('Token Icons', () => {
    test('should display token icon in selector', async () => {
      // ETH should have icon
      const fromToken = demoPage.swapCard.fromToken
      const hasIcon = await fromToken.locator('img, svg, span').first().isVisible()
      expect(hasIcon).toBeTruthy()
    })
  })

  test.describe('Same-Token Prevention (Transparent Mode)', () => {
    test('should auto-swap tokens when selecting same token as destination', async ({ page }) => {
      // Auto-swap only happens in transparent mode (privacy modes allow same-token for same-chain privacy)
      await demoPage.selectPrivacyLevel('public')

      // Start with ETH → SOL
      await expect(demoPage.swapCard.fromToken).toContainText('ETH')
      await expect(demoPage.swapCard.toToken).toContainText('SOL')

      // Try to select ETH as TO token (same as FROM)
      await demoPage.swapCard.toToken.click()
      await page.getByTestId('token-option-ETH').click()
      await page.waitForTimeout(200)

      // Should auto-swap: SOL → ETH (FROM becomes SOL, TO becomes ETH)
      await expect(demoPage.swapCard.fromToken).toContainText('SOL')
      await expect(demoPage.swapCard.toToken).toContainText('ETH')
    })

    test('should auto-swap tokens when selecting same token as source', async ({ page }) => {
      // Auto-swap only happens in transparent mode (privacy modes allow same-token for same-chain privacy)
      await demoPage.selectPrivacyLevel('public')

      // Start with ETH → SOL
      await expect(demoPage.swapCard.fromToken).toContainText('ETH')
      await expect(demoPage.swapCard.toToken).toContainText('SOL')

      // Try to select SOL as FROM token (same as TO)
      await demoPage.swapCard.fromToken.click()
      await page.getByTestId('token-option-SOL').click()
      await page.waitForTimeout(200)

      // Should auto-swap: SOL → ETH (FROM becomes SOL, TO becomes ETH)
      await expect(demoPage.swapCard.fromToken).toContainText('SOL')
      await expect(demoPage.swapCard.toToken).toContainText('ETH')
    })

    test('should allow same-token selection in shielded mode', async ({ page }) => {
      // Shielded mode allows same-token selection for same-chain privacy transfers
      await expect(demoPage.privacyToggle.shieldedButton).toHaveAttribute('aria-checked', 'true')

      // Select SOL as FROM
      await demoPage.swapCard.fromToken.click()
      await page.getByTestId('token-option-SOL').click()

      // Select SOL as TO (same token) - should be allowed in shielded mode
      await demoPage.swapCard.toToken.click()
      await page.getByTestId('token-option-SOL').click()
      await page.waitForTimeout(200)

      // Both should be SOL (no auto-swap)
      await expect(demoPage.swapCard.fromToken).toContainText('SOL')
      await expect(demoPage.swapCard.toToken).toContainText('SOL')
    })
  })
})
