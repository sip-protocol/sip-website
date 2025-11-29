# Manual Testing Checklist - SIP Demo

**URL:** https://sip-protocol.org/demo (or `localhost:3000/demo`)
**Last Updated:** 2024-11-29

---

## Pre-Test Setup

- [ ] Browser: Chrome/Firefox/Safari (latest)
- [ ] DevTools open (F12) → Network tab visible
- [ ] Wallet extension installed (Phantom/MetaMask) - optional for full testing
- [ ] Clear browser cache if testing fresh state

---

## 1. Page Load

| # | Test | Expected Result | Status |
|---|------|-----------------|--------|
| 1.1 | Navigate to /demo | Page loads without errors | ☐ |
| 1.2 | Check console | No JavaScript errors | ☐ |
| 1.3 | Check Network tab | CoinGecko API call visible (prices fetched) | ☐ |
| 1.4 | Swap card visible | Card with "Swap" title displayed | ☐ |
| 1.5 | Default state | "Shielded" badge visible, SOL → ETH selected | ☐ |

---

## 2. Privacy Toggle

| # | Test | Steps | Expected Result | Status |
|---|------|-------|-----------------|--------|
| 2.1 | Default state | Load page | "Shielded" button highlighted (purple) | ☐ |
| 2.2 | Switch to Public | Click "Public" | Button highlights, privacy info box **hides** | ☐ |
| 2.3 | Switch to Compliant | Click "Compliant" | Button highlights, shows "viewing key" text | ☐ |
| 2.4 | Switch to Shielded | Click "Shielded" | Button highlights, privacy info shows | ☐ |
| 2.5 | Badge updates | Toggle privacy levels | Badge in card header updates accordingly | ☐ |
| 2.6 | Privacy info - Shielded | Select Shielded | Shows "Privacy Protected" with hidden info | ☐ |
| 2.7 | Privacy info - Public | Select Public | Privacy info box not visible | ☐ |
| 2.8 | Privacy info - Compliant | Select Compliant | Shows viewing key disclosure info | ☐ |

---

## 3. Token Selection

| # | Test | Steps | Expected Result | Status |
|---|------|-------|-----------------|--------|
| 3.1 | From token default | Load page | SOL selected as "From" token | ☐ |
| 3.2 | To token default | Load page | ETH selected as "To" token | ☐ |
| 3.3 | Open From dropdown | Click SOL button | Dropdown shows: SOL, ETH, NEAR | ☐ |
| 3.4 | Open To dropdown | Click ETH button | Dropdown shows: SOL, ETH, NEAR | ☐ |
| 3.5 | Select different token | Click dropdown → Select ETH | Token changes to ETH with icon | ☐ |
| 3.6 | Close dropdown | Click outside dropdown | Dropdown closes | ☐ |
| 3.7 | Token icons | Check all tokens | Each has correct icon displayed | ☐ |

---

## 4. Quote Fetching

| # | Test | Steps | Expected Result | Status |
|---|------|-------|-----------------|--------|
| 4.1 | Enter amount | Type "1" in From field | Input accepts value | ☐ |
| 4.2 | Quote loading | After entering amount | Brief loading state (~500ms debounce) | ☐ |
| 4.3 | Output displayed | Wait for quote | To field shows estimated output (e.g., 0.046) | ☐ |
| 4.4 | Rate displayed | Check details | "Rate: 1 SOL ≈ X.XX ETH" visible | ☐ |
| 4.5 | Solver fee | Check details | "Solver Fee: X.XX%" visible | ☐ |
| 4.6 | Route displayed | Check details | "Route: Solana → Ethereum" visible | ☐ |
| 4.7 | Privacy status | Check details | "Privacy: Full shielding" (or current level) | ☐ |
| 4.8 | Decimal input | Type "0.001" | Accepts decimal values | ☐ |
| 4.9 | Large amount | Type "999999" | Accepts large values | ☐ |
| 4.10 | Clear input | Delete amount | Output resets, transaction details hide | ☐ |
| 4.11 | Stealth address | Enter amount (Shielded mode) | "Stealth Address" label visible | ☐ |

---

## 5. Swap Button States

| # | Test | Steps | Expected Result | Status |
|---|------|-------|-----------------|--------|
| 5.1 | No wallet - no amount | Load page fresh | Button: "Connect Wallet" | ☐ |
| 5.2 | No wallet - with amount | Enter "1" | Button: "Connect Wallet" | ☐ |
| 5.3 | Button clickable | Click button | Opens wallet modal | ☐ |

---

## 6. Wallet Modal

| # | Test | Steps | Expected Result | Status |
|---|------|-------|-----------------|--------|
| 6.1 | Open modal | Click "Connect Wallet" | Modal appears with overlay | ☐ |
| 6.2 | Chain tabs | Check modal | "Solana" and "Ethereum" tabs visible | ☐ |
| 6.3 | Solana tab (default) | Modal opens | Phantom wallet option visible | ☐ |
| 6.4 | Ethereum tab | Click "Ethereum" | MetaMask option visible | ☐ |
| 6.5 | Wallet icons | Check options | Each wallet has correct icon | ☐ |
| 6.6 | Close modal - X button | Click X or close button | Modal closes | ☐ |
| 6.7 | Close modal - overlay | Click outside modal | Modal closes | ☐ |
| 6.8 | Close modal - Escape | Press Escape key | Modal closes | ☐ |

---

## 7. Wallet Connection (Requires Extension)

> **Note:** These tests require Phantom or MetaMask extension installed

| # | Test | Steps | Expected Result | Status |
|---|------|-------|-----------------|--------|
| 7.1 | Click Phantom | Click Phantom option | Phantom popup appears | ☐ |
| 7.2 | Approve connection | Approve in Phantom | Wallet connected, address shown | ☐ |
| 7.3 | Balance displayed | After connection | "Balance: X.XX" shown | ☐ |
| 7.4 | Button state change | After connection | Button shows "Swap" or "Enter Amount" | ☐ |
| 7.5 | Wallet dropdown | Click connected wallet | Shows address, copy, disconnect options | ☐ |
| 7.6 | Copy address | Click copy button | Address copied to clipboard | ☐ |
| 7.7 | Disconnect | Click disconnect | Returns to "Connect Wallet" state | ☐ |

---

## 8. Price Verification

| # | Test | Steps | Expected Result | Status |
|---|------|-------|-----------------|--------|
| 8.1 | Check Network tab | Look for coingecko.com | API request made on load | ☐ |
| 8.2 | Verify rate accuracy | Compare with CoinGecko.com | Rate within ~1% of market rate | ☐ |
| 8.3 | Rate updates | Wait 60+ seconds, enter new amount | Rate may update from fresh API call | ☐ |

**Current Fallback Prices (if API fails):**
- SOL: $100
- ETH: $3500
- NEAR: $5
- ZEC: $50

---

## 9. Responsive Design

| # | Test | Steps | Expected Result | Status |
|---|------|-------|-----------------|--------|
| 9.1 | Desktop (1920px) | Full screen | Card centered, readable | ☐ |
| 9.2 | Tablet (768px) | Resize or DevTools | Layout adapts, still usable | ☐ |
| 9.3 | Mobile (375px) | DevTools mobile view | Full width, touch-friendly | ☐ |
| 9.4 | Touch targets | Check buttons on mobile | Buttons large enough to tap | ☐ |

---

## 10. Error States

| # | Test | Steps | Expected Result | Status |
|---|------|-------|-----------------|--------|
| 10.1 | Network offline | Disable network, enter amount | Graceful error, fallback prices used | ☐ |
| 10.2 | Invalid amount | Try entering letters | Input rejects non-numeric | ☐ |
| 10.3 | Negative amount | Try entering "-1" | Input rejects or shows error | ☐ |

---

## Quick Smoke Test (5 minutes)

For rapid verification, run through these core tests:

1. [ ] Page loads without console errors
2. [ ] Enter "1" → Output amount appears
3. [ ] Toggle Public → Privacy info hides
4. [ ] Toggle Shielded → Privacy info shows
5. [ ] Click "Connect Wallet" → Modal opens
6. [ ] Switch to Ethereum tab → MetaMask visible
7. [ ] Close modal → Returns to swap card
8. [ ] Change From token to ETH → Token updates
9. [ ] Rate and Solver Fee visible in details

---

## Test Results Summary

| Section | Passed | Failed | Blocked | Total |
|---------|--------|--------|---------|-------|
| Page Load | | | | 5 |
| Privacy Toggle | | | | 8 |
| Token Selection | | | | 7 |
| Quote Fetching | | | | 11 |
| Swap Button | | | | 3 |
| Wallet Modal | | | | 8 |
| Wallet Connection | | | | 7 |
| Price Verification | | | | 3 |
| Responsive | | | | 4 |
| Error States | | | | 3 |
| **TOTAL** | | | | **59** |

---

## Notes

**Tester:**
**Date:**
**Browser/Version:**
**OS:**

**Issues Found:**
1.
2.
3.

**Comments:**


