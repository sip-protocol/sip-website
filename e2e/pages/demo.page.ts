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

  // Zcash recipient
  readonly zcash: {
    recipientContainer: Locator
    recipientInput: Locator
    validationError: Locator
  }

  // Stealth address display
  readonly stealthAddress: {
    container: Locator
    address: Locator
    copyButton: Locator
    howItWorks: Locator
  }

  // Pedersen commitment display
  readonly commitment: {
    container: Locator
    value: Locator
    copyButton: Locator
    howItWorks: Locator
  }

  // Viewing key (Compliant mode)
  readonly viewingKey: {
    container: Locator
    revealButton: Locator
    copyButton: Locator
    downloadButton: Locator
    confirmCheckbox: Locator
    continueButton: Locator
  }

  // Quote details
  readonly quoteDetails: {
    container: Locator
    rate: Locator
    fee: Locator
    slippage: Locator
    estimatedTime: Locator
    minimumReceived: Locator
    route: Locator
    privacy: Locator
  }

  // Privacy Level Comparison section
  readonly privacyComparison: {
    container: Locator
    transparentCard: Locator
    shieldedCard: Locator
    compliantCard: Locator
    transparentButton: Locator
    shieldedButton: Locator
    compliantButton: Locator
  }

  // Educational sections
  readonly educational: {
    comparisonView: Locator
    transactionProof: Locator
    pedersenDemo: Locator
    zcashShowcase: Locator
    howItWorks: Locator
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

    // Zcash recipient
    this.zcash = {
      recipientContainer: page.locator('[data-testid="zec-recipient-section"]'),
      recipientInput: page.locator('[data-testid="zec-recipient-input"]'),
      validationError: page.locator('[data-testid="zec-error-message"]'),
    }

    // Stealth address display
    this.stealthAddress = {
      container: page.locator('[data-testid="stealth-address"]'),
      address: page.locator('[data-testid="stealth-address"] code'),
      copyButton: page.locator('[data-testid="stealth-address"] button:has-text("Copy")'),
      howItWorks: page.locator('[data-testid="stealth-address"] button:has-text("How it works")'),
    }

    // Pedersen commitment display
    this.commitment = {
      container: page.locator('[data-testid="pedersen-commitment"]'),
      value: page.locator('[data-testid="pedersen-commitment"] code'),
      copyButton: page.locator('[data-testid="pedersen-commitment"] button:has-text("Copy")'),
      howItWorks: page.locator('[data-testid="pedersen-commitment"] button:has-text("How it works")'),
    }

    // Viewing key (Compliant mode)
    this.viewingKey = {
      container: page.locator('[data-testid="viewing-key"]'),
      revealButton: page.locator('button:has-text("Reveal")'),
      copyButton: page.locator('[data-testid="viewing-key"] button:has-text("Copy")'),
      downloadButton: page.locator('button:has-text("Download")'),
      confirmCheckbox: page.locator('input[type="checkbox"]'),
      continueButton: page.locator('button:has-text("Continue")'),
    }

    // Quote details
    this.quoteDetails = {
      container: page.locator('[data-testid="quote-details"]'),
      rate: page.locator('text=Rate').locator('..').locator('xpath=following-sibling::*'),
      fee: page.locator('text=Solver Fee').locator('..').locator('xpath=following-sibling::*'),
      slippage: page.locator('text=Slippage').locator('..'),
      estimatedTime: page.locator('text=Est. time').locator('..').locator('xpath=following-sibling::*'),
      minimumReceived: page.locator('text=Minimum received').locator('..').locator('xpath=following-sibling::*'),
      route: page.locator('text=Route').locator('..').locator('xpath=following-sibling::*'),
      privacy: page.locator('text=Privacy').first().locator('..').locator('xpath=following-sibling::*'),
    }

    // Privacy Level Comparison section
    this.privacyComparison = {
      container: page.locator('[data-testid="privacy-comparison"]'),
      transparentCard: page.locator('[data-testid="privacy-card-transparent"]'),
      shieldedCard: page.locator('[data-testid="privacy-card-shielded"]'),
      compliantCard: page.locator('[data-testid="privacy-card-compliant"]'),
      transparentButton: page.locator('button:has-text("Transparent")').first(),
      shieldedButton: page.locator('button:has-text("Shielded")').first(),
      compliantButton: page.locator('button:has-text("Compliant")').first(),
    }

    // Educational sections
    this.educational = {
      comparisonView: page.locator('text=Before vs After SIP').locator('..').locator('..'),
      transactionProof: page.locator('text=Real Cryptographic Proof').locator('..').locator('..'),
      pedersenDemo: page.locator('text=Pedersen Commitments').first().locator('..').locator('..'),
      zcashShowcase: page.locator('text=Zcash Integration').locator('..').locator('..'),
      howItWorks: page.locator('text=How It Works').first().locator('..').locator('..'),
    }
  }

  // Navigation
  async goto() {
    await this.page.goto('/demo')
    // Use 'load' instead of 'networkidle' - more reliable with Next.js
    await this.page.waitForLoadState('load')
    // Wait for swap card to be visible (ensures app is hydrated)
    await this.swapCard.container.waitFor({ state: 'visible', timeout: 10000 })
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
    // Check aria-checked attribute (role="radio" uses aria-checked, not aria-pressed)
    if (await this.privacyToggle.publicButton.getAttribute('aria-checked') === 'true') {
      return 'public'
    }
    if (await this.privacyToggle.shieldedButton.getAttribute('aria-checked') === 'true') {
      return 'shielded'
    }
    if (await this.privacyToggle.compliantButton.getAttribute('aria-checked') === 'true') {
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
    // role="radio" uses aria-checked, not aria-pressed
    await expect(button).toHaveAttribute('aria-checked', 'true')
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

  // Zcash actions
  async enterZcashAddress(address: string) {
    await this.zcash.recipientInput.fill(address)
  }

  async expectZcashFieldVisible() {
    await expect(this.zcash.recipientContainer).toBeVisible()
  }

  async expectZcashFieldHidden() {
    await expect(this.zcash.recipientContainer).toBeHidden()
  }

  async expectZcashValidationError(errorText?: string | RegExp) {
    await expect(this.zcash.validationError).toBeVisible()
    if (errorText) {
      await expect(this.zcash.validationError).toContainText(errorText)
    }
  }

  async expectNoZcashValidationError() {
    await expect(this.zcash.validationError).toBeHidden()
  }

  // Crypto display assertions
  async expectStealthAddressVisible() {
    await expect(this.stealthAddress.container).toBeVisible()
  }

  async expectCommitmentVisible() {
    await expect(this.commitment.container).toBeVisible()
  }

  async expectViewingKeyVisible() {
    await expect(this.viewingKey.container).toBeVisible()
  }

  // Quote details assertions
  async expectQuoteDetailsVisible() {
    await expect(this.page.locator('text=Rate').first()).toBeVisible()
  }

  async expectRouteText(route: string | RegExp) {
    await expect(this.page.locator('text=Route').locator('..').locator('..').locator('div').last()).toContainText(route)
  }

  // Educational section navigation
  async scrollToSection(section: 'comparison' | 'proof' | 'pedersen' | 'zcash' | 'howItWorks') {
    const sectionMap = {
      comparison: this.educational.comparisonView,
      proof: this.educational.transactionProof,
      pedersen: this.educational.pedersenDemo,
      zcash: this.educational.zcashShowcase,
      howItWorks: this.educational.howItWorks,
    }
    await sectionMap[section].scrollIntoViewIfNeeded()
  }

  // Keyboard navigation
  async pressKey(key: string) {
    await this.page.keyboard.press(key)
  }

  async tabToElement(selector: string, maxTabs = 50) {
    for (let i = 0; i < maxTabs; i++) {
      await this.page.keyboard.press('Tab')
      const focused = await this.page.locator(':focus').getAttribute('data-testid')
      if (focused?.includes(selector)) {
        return true
      }
    }
    return false
  }
}
