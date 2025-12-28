import { type Page, type Locator, expect } from '@playwright/test'

/**
 * Page Object Model for /claim page
 * Uses data-testid attributes for reliable selectors
 */
export class ClaimPage {
  readonly page: Page

  // Key inputs
  readonly viewingKeyInput: Locator
  readonly spendingKeyInput: Locator
  readonly destinationInput: Locator

  // Actions
  readonly scanButton: Locator

  // Results
  readonly noPaymentsMessage: Locator
  readonly paymentList: Locator
  readonly scanError: Locator

  constructor(page: Page) {
    this.page = page

    // Key inputs
    this.viewingKeyInput = page.locator('[data-testid="viewing-key-input"]')
    this.spendingKeyInput = page.locator('[data-testid="spending-key-input"]')
    this.destinationInput = page.locator('[data-testid="destination-address-input"]')

    // Actions
    this.scanButton = page.locator('[data-testid="scan-button"]')

    // Results
    this.noPaymentsMessage = page.locator('[data-testid="no-payments-message"]')
    this.paymentList = page.locator('[data-testid="payment-list"]')
    this.scanError = page.locator('[data-testid="scan-error"]')
  }

  // Navigation
  async goto() {
    await this.page.goto('/claim')
    await this.page.waitForLoadState('load')
    // Wait for page to be visible
    await this.page.locator('[data-testid="claim-page"]').waitFor({ state: 'visible', timeout: 10000 })
  }

  // Key input actions
  async enterViewingKey(key: string) {
    await this.viewingKeyInput.fill(key)
  }

  async enterSpendingKey(key: string) {
    await this.spendingKeyInput.fill(key)
  }

  async enterDestination(address: string) {
    await this.destinationInput.fill(address)
  }

  async enterAllKeys(viewingKey: string, spendingKey: string, destination?: string) {
    await this.enterViewingKey(viewingKey)
    await this.enterSpendingKey(spendingKey)
    if (destination) {
      await this.enterDestination(destination)
    }
  }

  // Actions
  async clickScan() {
    await this.scanButton.click()
  }

  // Assertions
  async expectScanButtonDisabled() {
    await expect(this.scanButton).toBeDisabled()
  }

  async expectScanButtonEnabled() {
    await expect(this.scanButton).toBeEnabled()
  }

  async expectNoPaymentsMessage() {
    await expect(this.noPaymentsMessage).toBeVisible()
  }

  async expectPaymentListVisible() {
    await expect(this.paymentList).toBeVisible()
  }

  async expectScanError(errorText?: string | RegExp) {
    await expect(this.scanError).toBeVisible()
    if (errorText) {
      await expect(this.scanError).toContainText(errorText)
    }
  }

  async expectNoScanError() {
    await expect(this.scanError).toBeHidden()
  }
}
