# CLAUDE.md - SIP Website

> **Ecosystem Hub:** See [sip-protocol/CLAUDE.md](https://github.com/sip-protocol/sip-protocol/blob/main/CLAUDE.md) for full ecosystem context

**Repository:** https://github.com/sip-protocol/sip-website
**Purpose:** Marketing website for SIP Protocol (demo pages deprecated → sip-app)

---

## DEPRECATION NOTICE

**Demo/POC pages have been removed with 301 redirects to `app.sip-protocol.org`:**

| Deprecated Page | New Location | Status |
|-----------------|--------------|--------|
| `/demo` | `app.sip-protocol.org/dex` | ✅ Redirected |
| `/demo/toggle-*` | DELETED (internal testing) | ✅ Done |
| `/claim` | `app.sip-protocol.org/payments/receive` | ✅ Redirected |
| `/phantom-poc` | `app.sip-protocol.org/wallet` | ✅ Redirected |
| `/jupiter-poc` | `app.sip-protocol.org/dex/jupiter` | ✅ Redirected |
| `/compliance-dashboard` | `app.sip-protocol.org/enterprise/compliance` | ✅ Redirected |

**Keep in sip-website (marketing):**
- `/` - Landing page
- `/sdk` - SDK showcase
- `/grants/*` - Grant pitch pages
- `/pitch-deck` - Investor deck
- `/about` - Team page
- `/features` - Feature comparison
- `/roadmap` - Public roadmap
- `/privacy`, `/terms`, `/license`, `/security` - Legal pages

---

## Current Focus

**Status:** M17 Complete | M18 Active (Ethereum Same-Chain)
**Strategy:** Same-chain expansion - privacy for ALL transactions, not just cross-chain

### Phase 4 Priorities (Website)
- Grant pages updated for Superteam ($10K) and Solana Foundation ($100K)
- PrivacyCash competitive positioning (pool mixing vs cryptographic privacy)
- Same-chain messaging throughout marketing site
- Demo showcases real privacy vs pool-based mixers

---

## Quick Reference

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 4, Zustand, Vitest
**Deployment:** sip-protocol.org (Docker + GHCR, port 5000)

**Key Commands:**
```bash
pnpm install              # Install dependencies
pnpm dev                  # Dev server (localhost:3000)
pnpm test -- --run        # Run tests (157 tests)
pnpm build                # Build for production
pnpm typecheck            # Type check
```

---

## Key Files

| Path | Description |
|------|-------------|
| `src/app/` | Next.js app router pages |
| `src/app/sdk/` | SDK showcase page with syntax highlighting |
| `src/app/grants/superteam/` | Superteam $10K grant pitch (M16) |
| `src/app/grants/solana-foundation/` | Solana Foundation $100K grant pitch (M17) |
| `src/app/pitch-deck/` | Investor pitch deck |
| `src/components/` | React components (swap UI, wallet) |
| `src/hooks/use-swap.ts` | Swap execution logic |
| `src/hooks/use-quote.ts` | Quote fetching logic |
| `src/stores/wallet-store.ts` | Wallet connection state |
| `src/stores/toast-store.ts` | Toast notifications |
| `src/lib/sip-client.ts` | SDK client with BrowserNoirProvider |
| `src/lib/constants.ts` | Test counts, SDK version constants |
| `src/app/about/page.tsx` | About page with team section |
| `src/components/video-demo.tsx` | YouTube demo video embed |
| `tests/` | Test suites (126 tests) |

---

## Grant Pages

### Superteam Microgrant ($10K) - `/grants/superteam`
- **Focus:** M16 Narrative Capture
- **Timeline:** 2 months (Jan-Feb 2026)
- **Deliverables:** Content campaign, community building, ecosystem presence
- **Key differentiator:** SIP Labs Inc. registration for fundraising readiness

### Solana Foundation Grant ($100K) - `/grants/solana-foundation`
- **Focus:** M17 Solana Same-Chain Privacy
- **Timeline:** 6 months (Feb-Aug 2026)
- **Deliverables:** Same-chain SDK, Jupiter DEX integration, Mobile SDK, Security audit
- **Key differentiator:** Cryptographic privacy vs pool mixing (PrivacyCash comparison)

---

## Features

- Wallet connection (Solana, Ethereum, Hardware wallets)
- Quote fetching from NEAR Intents
- Swap execution with privacy toggle
- **Real ZK proofs** via BrowserNoirProvider (Noir circuits)
- Transaction status tracking
- Toast notifications
- SDK showcase with interactive demos
- Grant pitch pages with architecture diagrams
- Pitch deck for investors
- Team/About page for credibility
- Demo video showcase (YouTube embed)

---

## Test Suites

| Suite | Count | Location |
|-------|-------|----------|
| Toast store | 14 | `tests/stores/toast-store.test.ts` |
| Wallet store | 21 | `tests/stores/wallet-store.test.ts` |
| useQuote hook | 12 | `tests/hooks/use-quote.test.tsx` |
| useSwap hook | 24 | `tests/hooks/use-swap.test.tsx` |
| TransactionStatus | 21 | `tests/components/transaction-status.test.tsx` |
| SwapCard | 31 | `tests/components/swap-card.test.tsx` |

---

## Repo-Specific Guidelines

**DO:**
- Run `pnpm test -- --run` after changes
- Use Zustand stores for state management
- Follow existing component patterns
- Keep grant pages updated with current milestone status

**DON'T:**
- Import SDK internals directly (use public API)
- Skip accessibility in UI components
- Hard-code test counts (use `src/lib/constants.ts`)

---

## Dependencies

- `@sip-protocol/sdk` - Core SDK
- `@sip-protocol/types` - TypeScript types

---

**Last Updated:** 2026-01-25
