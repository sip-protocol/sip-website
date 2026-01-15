import { test, expect } from '@playwright/test'
import { DemoPage } from '../pages/demo.page'

/**
 * Zcash Recipient Address Validation Tests
 * Tests ZEC destination field visibility and address validation
 */

// SKIPPED: The /demo page has been deprecated and migrated to sip-app. See: https://github.com/sip-protocol/sip-website/issues/156
test.describe.skip('Zcash Recipient', () => {
  let demoPage: DemoPage

  test.beforeEach(async ({ page }) => {
    demoPage = new DemoPage(page)
    await demoPage.goto()
  })

  test.describe('Field Visibility', () => {
    test('should hide ZEC recipient field for non-ZEC destinations', async () => {
      // Default is ETH → SOL, no ZEC field
      await expect(demoPage.zcash.recipientContainer).toBeHidden()
    })

    test('should show ZEC recipient field when ZEC is selected as destination', async ({ page }) => {
      // Select ZEC as destination
      await demoPage.swapCard.toToken.click()
      await page.waitForTimeout(100)
      await page.getByTestId('token-option-ZEC').click()

      // ZEC recipient field should appear
      await expect(demoPage.zcash.recipientContainer).toBeVisible()
    })

    test('should hide ZEC field when switching from ZEC to another token', async ({ page }) => {
      // Select ZEC first
      await demoPage.swapCard.toToken.click()
      await page.getByTestId('token-option-ZEC').click()
      await expect(demoPage.zcash.recipientContainer).toBeVisible()

      // Switch to ETH
      await demoPage.swapCard.toToken.click()
      await page.getByTestId('token-option-ETH').click()
      await expect(demoPage.zcash.recipientContainer).toBeHidden()
    })

    test('should show "Required" label on ZEC field', async ({ page }) => {
      await demoPage.swapCard.toToken.click()
      await page.getByTestId('token-option-ZEC').click()

      await expect(demoPage.zcash.recipientContainer).toContainText('Required')
    })
  })

  test.describe('Address Validation', () => {
    test.beforeEach(async ({ page }) => {
      // Select ZEC as destination for all validation tests
      await demoPage.swapCard.toToken.click()
      await page.getByTestId('token-option-ZEC').click()
    })

    test('should reject invalid address format', async () => {
      await demoPage.enterZcashAddress('invalid_address')
      await demoPage.expectZcashValidationError(/invalid/i)
    })

    test('should reject address with wrong prefix', async () => {
      await demoPage.enterZcashAddress('abc123456789')
      await demoPage.expectZcashValidationError()
    })

    test('should show specific error for wrong length zs1 address', async () => {
      // zs1 addresses must be exactly 78 characters
      await demoPage.enterZcashAddress('zs1short')
      await demoPage.expectZcashValidationError(/78 characters/i)
    })

    test('should accept valid transparent t1 address', async () => {
      // t1 addresses are 35 characters starting with t1
      const validT1 = 't1Rv4exT7bqhZqi2j7xz8bUHDMxwosrjADU'
      await demoPage.enterZcashAddress(validT1)
      // Should not show error for valid address
      await expect(demoPage.zcash.validationError).toBeHidden()
    })

    test('should accept valid transparent t3 address', async () => {
      // t3 addresses are 35 characters starting with t3
      const validT3 = 't3Pnbg7XjP7FGPBUuz75H65aczphHgkpoJW'
      await demoPage.enterZcashAddress(validT3)
      await expect(demoPage.zcash.validationError).toBeHidden()
    })

    test('should show privacy recommendation for transparent addresses', async ({ page }) => {
      // t-addresses are less private
      const validT1 = 't1Rv4exT7bqhZqi2j7xz8bUHDMxwosrjADU'
      await demoPage.enterZcashAddress(validT1)

      // Should suggest using shielded address
      await expect(page.locator('text=/u1.*unified|zs1.*sapling/i')).toBeVisible()
    })

    test('should show input placeholder with address format hints', async () => {
      const placeholder = await demoPage.zcash.recipientInput.getAttribute('placeholder')
      expect(placeholder).toMatch(/zs1|t1/i)
    })

    test('should clear validation error when field is cleared', async () => {
      await demoPage.enterZcashAddress('invalid')
      await demoPage.expectZcashValidationError()

      await demoPage.zcash.recipientInput.clear()
      // Error should be hidden when field is empty (or show different message)
    })
  })

  test.describe('Cross-Chain Quote with ZEC', () => {
    test('should fetch quote for SOL → ZEC', async ({ page }) => {
      // Select SOL as source
      await demoPage.swapCard.fromToken.click()
      await page.getByTestId('token-option-SOL').click()

      // Select ZEC as destination
      await demoPage.swapCard.toToken.click()
      await page.getByTestId('token-option-ZEC').click()

      // Enter amount
      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      // Should show output amount
      const output = await demoPage.getOutputAmount()
      expect(output).not.toBe('0')
    })

    test('should display Solana → Zcash route', async ({ page }) => {
      await demoPage.swapCard.fromToken.click()
      await page.getByTestId('token-option-SOL').click()

      await demoPage.swapCard.toToken.click()
      await page.getByTestId('token-option-ZEC').click()

      await demoPage.enterAmount('1')
      await demoPage.waitForQuote()

      await expect(page.locator('text=Solana → Zcash')).toBeVisible()
    })
  })
})
