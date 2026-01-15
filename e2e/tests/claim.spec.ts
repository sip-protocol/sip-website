import { test, expect } from '@playwright/test'
import { ClaimPage } from '../pages/claim.page'

/**
 * Claim Page Tests
 * Tests for the /claim page where recipients scan and claim stealth payments
 *
 * SKIPPED: The /claim page has been deprecated and migrated to sip-app.
 * See: https://github.com/sip-protocol/sip-website/issues/156
 */

// SKIPPED: The /claim page has been deprecated and migrated to sip-app. See: https://github.com/sip-protocol/sip-website/issues/156
test.describe.skip('Claim Page', () => {
  let claimPage: ClaimPage

  test.beforeEach(async ({ page }) => {
    claimPage = new ClaimPage(page)
    await claimPage.goto()
  })

  test('should render claim page with header', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1')).toContainText('Claim Private Payments')

    // Verify page description
    await expect(page.locator('text=Scan the Solana blockchain')).toBeVisible()
  })

  test('should render all key input fields', async () => {
    await expect(claimPage.viewingKeyInput).toBeVisible()
    await expect(claimPage.spendingKeyInput).toBeVisible()
    await expect(claimPage.destinationInput).toBeVisible()
  })

  test('should render scan button', async () => {
    await expect(claimPage.scanButton).toBeVisible()
    await expect(claimPage.scanButton).toContainText('Scan for Payments')
  })

  test('should have scan button disabled without keys', async () => {
    await claimPage.expectScanButtonDisabled()
  })

  test('should keep scan button disabled with only viewing key', async () => {
    await claimPage.enterViewingKey('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')
    await claimPage.expectScanButtonDisabled()
  })

  test('should keep scan button disabled with only spending key', async () => {
    await claimPage.enterSpendingKey('0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321')
    await claimPage.expectScanButtonDisabled()
  })

  test('should enable scan button with both keys', async () => {
    await claimPage.enterViewingKey('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')
    await claimPage.enterSpendingKey('0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321')

    await claimPage.expectScanButtonEnabled()
  })

  test('should show input labels', async ({ page }) => {
    await expect(page.locator('label:text("Viewing Private Key")')).toBeVisible()
    await expect(page.locator('label:text("Spending Key")')).toBeVisible()
    await expect(page.locator('label:text("Destination Address")')).toBeVisible()
  })

  test('should show how it works section', async ({ page }) => {
    await expect(page.locator('text=How it works')).toBeVisible()
    await expect(page.locator('text=Enter your viewing key')).toBeVisible()
  })

  test('should have password type for key inputs', async () => {
    await expect(claimPage.viewingKeyInput).toHaveAttribute('type', 'password')
    await expect(claimPage.spendingKeyInput).toHaveAttribute('type', 'password')
  })

  test('should have text type for destination input', async () => {
    await expect(claimPage.destinationInput).toHaveAttribute('type', 'text')
  })

  test('should show placeholder text on inputs', async () => {
    await expect(claimPage.viewingKeyInput).toHaveAttribute('placeholder', '0x...')
    await expect(claimPage.spendingKeyInput).toHaveAttribute('placeholder', '0x...')
    await expect(claimPage.destinationInput).toHaveAttribute('placeholder', 'Your Solana wallet address')
  })

  test('should not show results section initially', async ({ page }) => {
    // No scan has been performed, so no results section
    await expect(page.locator('text=Found Payments')).toBeHidden()
    await expect(claimPage.noPaymentsMessage).toBeHidden()
    await expect(claimPage.paymentList).toBeHidden()
  })

  test('should not show error initially', async () => {
    await claimPage.expectNoScanError()
  })
})
