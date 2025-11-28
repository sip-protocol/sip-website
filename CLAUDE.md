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
pnpm test -- --run        # Run tests (92 tests)
pnpm build                # Build for production
pnpm typecheck            # Type check
```

---

## Key Files

| Path | Description |
|------|-------------|
| `src/app/` | Next.js app router pages |
| `src/components/` | React components (swap UI, wallet) |
| `src/hooks/use-swap.ts` | Swap execution logic |
| `src/hooks/use-quote.ts` | Quote fetching logic |
| `src/stores/wallet-store.ts` | Wallet connection state |
| `src/stores/toast-store.ts` | Toast notifications |
| `tests/` | Test suites (92 tests) |

---

## Features

- Wallet connection (Solana, Ethereum)
- Quote fetching from NEAR Intents
- Swap execution with privacy toggle
- Transaction status tracking
- Toast notifications

---

## Test Suites

| Suite | Count | Location |
|-------|-------|----------|
| Toast store | 14 | `tests/stores/toast-store.test.ts` |
| Wallet store | 21 | `tests/stores/wallet-store.test.ts` |
| useQuote hook | 12 | `tests/hooks/use-quote.test.tsx` |
| useSwap hook | 24 | `tests/hooks/use-swap.test.tsx` |
| TransactionStatus | 21 | `tests/components/transaction-status.test.tsx` |

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

**Last Updated:** 2025-11-28
