import { type Page, type Locator, expect } from '@playwright/test'

/**
 * Page Object Model for /demo page
 * Uses data-testid attributes for reliable selectors
 */
export class DemoPage {
  readonly page: Page

  // Header elements
  readonly header: {
    connectButton: Locator
    connectedButton: Locator
  }

  // Privacy toggle
  readonly privacyToggle: {
    container: Locator
    publicButton: Locator
    shieldedButton: Locator
    compliantButton: Locator
  }

  // Swap card
  readonly swapCard: {
    container: Locator
    fromInput: Locator
    fromToken: Locator
    toOutput: Locator
    toToken: Locator
    swapButton: Locator
    privacyBadge: Locator
    privacyInfo: Locator
    quoteLoading: Locator
  }

  // Wallet dropdown
  readonly wallet: {
    dropdown: Locator
    backdrop: Locator
    copyAddress: Locator
    viewExplorer: Locator
    disconnect: Locator
  }

  constructor(page: Page) {
    this.page = page

    // Header
    this.header = {
      connectButton: page.locator('[data-testid="wallet-connect"]'),
      connectedButton: page.locator('[data-testid="wallet-connected"]'),
    }

    // Privacy toggle - use data-testid
    this.privacyToggle = {
      container: page.locator('[data-testid="privacy-toggle"]'),
      publicButton: page.locator('[data-testid="privacy-transparent"]'),
      shieldedButton: page.locator('[data-testid="privacy-shielded"]'),
      compliantButton: page.locator('[data-testid="privacy-compliant"]'),
    }

    // Swap card
    this.swapCard = {
      container: page.locator('[data-testid="swap-card"]'),
      fromInput: page.locator('[data-testid="from-amount"]'),
      fromToken: page.locator('[data-testid="from-token"]'),
      toOutput: page.locator('[data-testid="to-output"]'),
      toToken: page.locator('[data-testid="to-token"]'),
      swapButton: page.locator('[data-testid="swap-button"]'),
      privacyBadge: page.locator('[data-testid="privacy-badge"]'),
      privacyInfo: page.locator('[data-testid="privacy-info"]'),
      quoteLoading: page.locator('[data-testid="quote-loading"]'),
    }

    // Wallet dropdown
    this.wallet = {
      dropdown: page.locator('[data-testid="wallet-dropdown"]'),
      backdrop: page.locator('[data-testid="wallet-backdrop"]'),
      copyAddress: page.locator('[data-testid="copy-address"]'),
      viewExplorer: page.locator('[data-testid="view-explorer"]'),
      disconnect: page.locator('[data-testid="disconnect-wallet"]'),
    }
  }

  // Navigation
  async goto() {
    await this.page.goto('/demo')
    await this.page.waitForLoadState('networkidle')
  }

  // Privacy toggle actions
  async selectPrivacyLevel(level: 'public' | 'shielded' | 'compliant') {
    const button = {
      public: this.privacyToggle.publicButton,
      shielded: this.privacyToggle.shieldedButton,
      compliant: this.privacyToggle.compliantButton,
    }[level]
    await button.click()
    await this.page.waitForTimeout(100)
  }

  async getActivePrivacyLevel(): Promise<string> {
    // Check aria-pressed attribute
    if (await this.privacyToggle.publicButton.getAttribute('aria-pressed') === 'true') {
      return 'public'
    }
    if (await this.privacyToggle.shieldedButton.getAttribute('aria-pressed') === 'true') {
      return 'shielded'
    }
    if (await this.privacyToggle.compliantButton.getAttribute('aria-pressed') === 'true') {
      return 'compliant'
    }
    return 'shielded'
  }

  // Swap actions
  async enterAmount(amount: string) {
    await this.swapCard.fromInput.clear()
    await this.swapCard.fromInput.fill(amount)
  }

  async waitForQuote(timeout = 5000) {
    await this.page.waitForTimeout(600) // debounce
    try {
      await this.swapCard.quoteLoading.waitFor({ state: 'hidden', timeout })
    } catch {
      // Quote might load instantly
    }
  }

  async getOutputAmount(): Promise<string> {
    const text = await this.swapCard.toOutput.textContent()
    return text?.trim() || '0'
  }

  async clickSwap() {
    await this.swapCard.swapButton.click()
  }

  // Wallet actions
  async openWalletModal() {
    // Try header connect button first, then swap button
    if (await this.header.connectButton.isVisible()) {
      await this.header.connectButton.click()
    } else {
      await this.swapCard.swapButton.click()
    }
  }

  async isWalletConnected(): Promise<boolean> {
    return await this.header.connectedButton.isVisible()
  }

  async selectWallet(type: 'phantom' | 'metamask' | 'solflare') {
    const walletButton = this.page.locator('button').filter({
      hasText: new RegExp(type, 'i')
    })
    if (await walletButton.isVisible()) {
      await walletButton.click()
    }
  }

  async openWalletDropdown() {
    await this.header.connectedButton.click()
  }

  async disconnectWallet() {
    await this.openWalletDropdown()
    await this.wallet.disconnect.click()
  }

  // Token selection
  async selectFromToken(symbol: string) {
    await this.swapCard.fromToken.click()
    await this.page.waitForTimeout(100)
    await this.page.locator('button').filter({ hasText: new RegExp(`^${symbol}$`, 'i') }).click()
  }

  async selectToToken(symbol: string) {
    await this.swapCard.toToken.click()
    await this.page.waitForTimeout(100)
    await this.page.locator('button').filter({ hasText: new RegExp(`^${symbol}$`, 'i') }).click()
  }

  // Assertions
  async expectPrivacyLevelActive(level: 'public' | 'shielded' | 'compliant') {
    const button = {
      public: this.privacyToggle.publicButton,
      shielded: this.privacyToggle.shieldedButton,
      compliant: this.privacyToggle.compliantButton,
    }[level]
    await expect(button).toHaveAttribute('aria-pressed', 'true')
  }

  async expectSwapButtonText(text: string | RegExp) {
    await expect(this.swapCard.swapButton).toContainText(text)
  }

  async expectSwapButtonDisabled() {
    await expect(this.swapCard.swapButton).toBeDisabled()
  }

  async expectSwapButtonEnabled() {
    await expect(this.swapCard.swapButton).toBeEnabled()
  }

  async expectPrivacyInfoVisible() {
    await expect(this.swapCard.privacyInfo).toBeVisible()
  }

  async expectPrivacyInfoHidden() {
    await expect(this.swapCard.privacyInfo).toBeHidden()
  }
}
