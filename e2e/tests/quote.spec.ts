import { test, expect } from '@playwright/test'
import { DemoPage } from '../pages/demo.page'

/**
 * Flow 3: Quote Fetching Tests
 * Tests quote display, loading states, and input handling
 */

// SKIPPED: The /demo page has been deprecated and migrated to sip-app. See: https://github.com/sip-protocol/sip-website/issues/156
test.describe.skip('Quote Fetching', () => {
  let demoPage: DemoPage

  test.beforeEach(async ({ page }) => {
    demoPage = new DemoPage(page)
    await demoPage.goto()
  })

  test('should accept numeric input', async () => {
    await demoPage.enterAmount('1.5')
    const value = await demoPage.swapCard.fromInput.inputValue()
    expect(value).toBe('1.5')
  })

  test('should show output after entering amount', async () => {
    await demoPage.enterAmount('1')
    await demoPage.waitForQuote()

    const output = await demoPage.getOutputAmount()
    expect(output).not.toBe('0')
  })

  test('should display exchange rate', async ({ page }) => {
    await demoPage.enterAmount('1')
    await demoPage.waitForQuote()

    // Look for Rate within the swap card
    await expect(demoPage.swapCard.container.locator('text=Rate').first()).toBeVisible()
  })

  test('should display solver fee', async ({ page }) => {
    await demoPage.enterAmount('1')
    await demoPage.waitForQuote()

    await expect(page.locator('text=Solver Fee')).toBeVisible()
  })

  test('should handle decimal amounts', async () => {
    await demoPage.enterAmount('0.001')
    const value = await demoPage.swapCard.fromInput.inputValue()
    expect(value).toBe('0.001')
  })

  test('should handle large amounts', async () => {
    await demoPage.enterAmount('999999')
    const value = await demoPage.swapCard.fromInput.inputValue()
    expect(value).toBe('999999')
  })

  test('should clear output when amount cleared', async ({ page }) => {
    await demoPage.enterAmount('1')
    await demoPage.waitForQuote()

    await demoPage.swapCard.fromInput.clear()
    await page.waitForTimeout(100)

    // Transaction details should hide (Rate within swap card)
    await expect(demoPage.swapCard.container.locator('text=Rate').first()).toBeHidden()
  })

  test('should display route information', async ({ page }) => {
    await demoPage.enterAmount('1')
    await demoPage.waitForQuote()

    await expect(demoPage.swapCard.container.locator('text=Route')).toBeVisible()
  })

  test('should display privacy status', async ({ page }) => {
    await demoPage.enterAmount('1')
    await demoPage.waitForQuote()

    // Look for Privacy label in swap card transaction details
    await expect(demoPage.swapCard.container.locator('text=Privacy').first()).toBeVisible()
  })

  test('should change privacy status when toggle changes', async ({ page }) => {
    await demoPage.enterAmount('1')
    await demoPage.waitForQuote()

    // Default is shielded - should show "Full shielding"
    await expect(page.locator('text=Full shielding')).toBeVisible()

    // Switch to public - should show "None"
    await demoPage.selectPrivacyLevel('public')
    await expect(page.locator('text=None')).toBeVisible()
  })
})
