# E2E Testing Guide - SIP Protocol Demo

## Overview

End-to-end UI testing for **sip-protocol.org/demo** to ensure critical user flows work correctly across browsers and devices.

**Demo URL:** https://sip-protocol.org/demo
**Local URL:** http://localhost:3000/demo

---

## KPIs (Key Performance Indicators)

### Coverage KPIs

| KPI | Target | Current | Priority |
|-----|--------|---------|----------|
| Critical Flow Coverage | 100% | 0% | P0 |
| Component Integration Coverage | 80%+ | 0% | P1 |
| Error State Coverage | 90%+ | 0% | P1 |
| Cross-Browser Pass Rate | 100% | N/A | P0 |
| Mobile Viewport Coverage | 100% | 0% | P2 |

### Quality KPIs

| KPI | Target | Measurement |
|-----|--------|-------------|
| **Test Stability** | <2% flaky tests | Consecutive runs without intermittent failures |
| **Test Speed** | <60s full suite | Total E2E execution time |
| **False Positive Rate** | <1% | Tests failing without actual bugs |
| **Bug Detection Rate** | 80%+ pre-production | Bugs caught before deployment |

### Operational KPIs

| KPI | Target | Description |
|-----|--------|-------------|
| **CI Integration** | 100% | All E2E tests run on every PR |
| **Test Maintenance Ratio** | <10% | Time spent fixing tests vs writing features |
| **Coverage Growth** | +5 tests/sprint | Progressive test additions |

---

## Critical User Flows (P0)

### Flow 1: Wallet Connection

```
User Journey:
1. Visit /demo page
2. Click "Connect" button in header
3. Wallet modal opens
4. Select wallet type (Phantom/MetaMask)
5. Approve connection in wallet
6. Address displayed, modal closes
7. Balance shown in SwapCard
```

**Test Scenarios:**
- [ ] Connect Phantom wallet (Solana)
- [ ] Connect MetaMask wallet (Ethereum)
- [ ] Disconnect wallet
- [ ] Reconnect after page refresh
- [ ] Handle wallet rejection
- [ ] Handle no wallet installed

### Flow 2: Privacy Toggle

```
User Journey:
1. Page loads with Shielded privacy (default)
2. Toggle to Public - UI updates
3. Toggle to Compliant - UI updates
4. Comparison view reflects changes
5. Swap button text changes per mode
```

**Test Scenarios:**
- [ ] Default state is Shielded
- [ ] Public toggle updates comparison cards
- [ ] Shielded toggle shows stealth address info
- [ ] Compliant toggle shows viewing key info
- [ ] Privacy badge updates in SwapCard
- [ ] Toggle state persists during interaction

### Flow 3: Quote Fetching

```
User Journey:
1. Enter amount in "From" field
2. Loading spinner appears (debounce 500ms)
3. Quote populates output amount
4. Exchange rate, fee, route displayed
5. Change token - quote refreshes
6. Handle quote errors gracefully
```

**Test Scenarios:**
- [ ] Enter valid amount, get quote
- [ ] Change from token, quote refreshes
- [ ] Change to token, quote refreshes
- [ ] Zero amount shows no quote
- [ ] Invalid amount shows error
- [ ] Network error shows retry option

### Flow 4: Swap Execution

```
User Journey:
1. Enter amount, get quote
2. Click "Shielded Swap" button
3. Status: Confirming (building intent)
4. Wallet signature popup
5. Status: Signing → Pending → Success
6. Show transaction hash + explorer link
7. Click "New Swap" to reset
```

**Test Scenarios:**
- [ ] Execute swap with mocked wallet
- [ ] Show progress steps correctly
- [ ] Display success with explorer link
- [ ] Handle user rejection
- [ ] Handle insufficient balance
- [ ] Handle network errors
- [ ] Reset state after new swap

---

## Component Integration Tests (P1)

### SwapCard Integration

| Test | Description |
|------|-------------|
| Token selector interaction | Open dropdown, select token, close |
| Amount input validation | Only numbers, max decimals |
| Quote display states | Loading, success, error |
| Button states | Disabled when invalid, loading text |
| Privacy indicator | Badge updates with toggle |

### TransactionStatus Integration

| Test | Description |
|------|-------------|
| Pending state | Shows spinner, progress steps |
| Success state | Shows hash, explorer link, new swap button |
| Error state | Shows message, retry button |
| Explorer links | Correct URL per chain (Solscan/Etherscan/NEARBlocks) |

### ComparisonView Integration

| Test | Description |
|------|-------------|
| Default rendering | Both cards visible |
| Privacy toggle response | Cards update content |
| Animation/transitions | Smooth state changes |

---

## Error State Coverage (P1)

| Error Type | UI Response | Test Priority |
|------------|-------------|---------------|
| Wallet not installed | Show install prompt | P1 |
| Wallet connection rejected | Toast + retry option | P1 |
| Quote fetch failed | Error message + retry | P1 |
| Insufficient balance | Disable swap, show message | P0 |
| Transaction rejected | Error status, retry button | P0 |
| Network error | Toast notification | P1 |
| Slippage exceeded | Warning message | P2 |

---

## Browser Matrix

| Browser | Desktop | Mobile | Priority |
|---------|---------|--------|----------|
| Chrome | Required | Required | P0 |
| Firefox | Required | Optional | P1 |
| Safari | Required | Required (iOS) | P1 |
| Edge | Optional | Optional | P2 |

---

## Viewport Testing

| Viewport | Size | Priority |
|----------|------|----------|
| Desktop Large | 1920x1080 | P0 |
| Desktop Medium | 1366x768 | P1 |
| Tablet | 768x1024 | P1 |
| Mobile | 375x667 | P0 |
| Mobile Large | 414x896 | P2 |

---

## Test File Structure

```
e2e/
├── fixtures/
│   ├── wallet-mock.ts       # Mock wallet providers
│   └── quote-mock.ts        # Mock 1Click API responses
├── pages/
│   └── demo.page.ts         # Page Object Model for /demo
├── tests/
│   ├── wallet.spec.ts       # Flow 1: Wallet connection
│   ├── privacy.spec.ts      # Flow 2: Privacy toggle
│   ├── quote.spec.ts        # Flow 3: Quote fetching
│   ├── swap.spec.ts         # Flow 4: Swap execution
│   ├── error-states.spec.ts # Error handling
│   └── mobile.spec.ts       # Mobile-specific tests
└── playwright.config.ts
```

---

## Page Object Model (POM)

```typescript
// e2e/pages/demo.page.ts
export class DemoPage {
  constructor(private page: Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/demo')
  }

  // Locators
  get connectButton() {
    return this.page.getByRole('button', { name: /connect/i })
  }

  get privacyToggle() {
    return {
      public: this.page.getByRole('button', { name: /public/i }),
      shielded: this.page.getByRole('button', { name: /shielded/i }),
      compliant: this.page.getByRole('button', { name: /compliant/i }),
    }
  }

  get swapCard() {
    return {
      fromInput: this.page.getByPlaceholder('0.0'),
      fromToken: this.page.locator('[data-testid="from-token"]'),
      toToken: this.page.locator('[data-testid="to-token"]'),
      swapButton: this.page.getByRole('button', { name: /swap/i }),
      outputAmount: this.page.locator('[data-testid="output-amount"]'),
    }
  }

  get transactionStatus() {
    return {
      pending: this.page.locator('[data-testid="status-pending"]'),
      success: this.page.locator('[data-testid="status-success"]'),
      error: this.page.locator('[data-testid="status-error"]'),
      explorerLink: this.page.getByRole('link', { name: /view on/i }),
    }
  }

  // Actions
  async selectPrivacyLevel(level: 'public' | 'shielded' | 'compliant') {
    await this.privacyToggle[level].click()
  }

  async enterAmount(amount: string) {
    await this.swapCard.fromInput.fill(amount)
  }

  async executeSwap() {
    await this.swapCard.swapButton.click()
  }
}
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: Build
        run: pnpm build

      - name: Run E2E tests
        run: pnpm test:e2e

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Success Criteria

### Phase 1: Foundation (Week 1)
- [ ] Playwright installed and configured
- [ ] Page Object Model created for /demo
- [ ] 4 critical flow tests passing
- [ ] CI integration working

### Phase 2: Coverage (Week 2)
- [ ] Error state tests complete
- [ ] Cross-browser tests passing
- [ ] Mobile viewport tests passing
- [ ] 80%+ component coverage

### Phase 3: Stability (Week 3)
- [ ] <2% flaky test rate
- [ ] <60s full suite runtime
- [ ] Documentation complete
- [ ] Team onboarded

---

## Metrics Dashboard

Track these metrics weekly:

| Metric | Week 1 | Week 2 | Week 3 | Target |
|--------|--------|--------|--------|--------|
| Total E2E Tests | - | - | - | 25+ |
| Pass Rate | - | - | - | 100% |
| Avg Run Time | - | - | - | <60s |
| Flaky Tests | - | - | - | <2% |
| Bugs Caught | - | - | - | Track |

---

## Commands Reference

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e tests/wallet.spec.ts

# Run with UI mode (debug)
pnpm test:e2e --ui

# Run headed (see browser)
pnpm test:e2e --headed

# Run specific browser
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit

# Generate report
pnpm test:e2e --reporter=html

# Update snapshots (if using visual regression)
pnpm test:e2e --update-snapshots
```

---

*Last updated: 2025-11-29*
