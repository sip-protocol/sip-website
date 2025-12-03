# CLAUDE.md - SIP Website

> **Ecosystem Hub:** See [sip-protocol/CLAUDE.md](https://github.com/sip-protocol/sip-protocol/blob/main/CLAUDE.md) for full ecosystem context

**Repository:** https://github.com/sip-protocol/sip-website
**Purpose:** Demo application + Marketing website for SIP Protocol

---

## Quick Reference

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, Zustand, Vitest
**Deployment:** sip-protocol.org (Docker + GHCR)

**Key Commands:**
```bash
pnpm install              # Install dependencies
pnpm dev                  # Dev server (localhost:3000)
pnpm test -- --run        # Run tests (126 tests)
pnpm build                # Build for production
pnpm typecheck            # Type check
```

---

## Key Files

| Path | Description |
|------|-------------|
| `src/app/` | Next.js app router pages |
| `src/app/sdk/` | SDK showcase page with syntax highlighting |
| `src/app/grants/` | Grant pitch pages (Superteam, Solana Foundation) |
| `src/app/pitch-deck/` | Investor pitch deck |
| `src/components/` | React components (swap UI, wallet) |
| `src/hooks/use-swap.ts` | Swap execution logic |
| `src/hooks/use-quote.ts` | Quote fetching logic |
| `src/stores/wallet-store.ts` | Wallet connection state |
| `src/stores/toast-store.ts` | Toast notifications |
| `src/lib/sip-client.ts` | SDK client with BrowserNoirProvider |
| `src/app/about/page.tsx` | About page with team section |
| `tests/` | Test suites (126 tests) |

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

**DON'T:**
- Import SDK internals directly (use public API)
- Skip accessibility in UI components

---

## Dependencies

- `@sip-protocol/sdk` - Core SDK
- `@sip-protocol/types` - TypeScript types

---

**Last Updated:** 2025-12-03
