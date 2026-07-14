<!-- Satellite context file — extends the global hub (~/.claude/CLAUDE.md | ~/.pi/agent/AGENTS.md). Host-neutral; project-specific only. Do not duplicate hub standards here. -->

# SIP Website

> Marketing website for SIP Protocol (demo pages deprecated → 301 redirects to sip-app).

**Ecosystem hub:** See [sip-protocol/sip-protocol/AGENTS.md](https://github.com/sip-protocol/sip-protocol/blob/main/AGENTS.md) for full ecosystem context.

## Deprecation Notice

Demo/POC pages removed with 301 redirects to `app.sip-protocol.org`:

| Deprecated Page | New Location |
|-----------------|--------------|
| `/demo` | `app.sip-protocol.org/dex` |
| `/claim` | `app.sip-protocol.org/payments/receive` |
| `/phantom-poc` | `app.sip-protocol.org/wallet` |
| `/jupiter-poc` | `app.sip-protocol.org/dex/jupiter` |
| `/compliance-dashboard` | `app.sip-protocol.org/enterprise/compliance` |
| `/demo/toggle-*` | DELETED (internal testing) |

`/pitch-deck` now 301-redirects to `/showcase/zypherpunk-2025` (see `next.config.js`).

**Kept in sip-website (marketing):** `/` landing · `/sdk` showcase · `/grants/*` pitches (superteam, superteam/t2, solana-foundation, audit-subsidy) · `/showcase/*` (zypherpunk-2025, solana-privacy-2026, monolith-2026) · `/about` · `/features` · `/roadmap` · `/privacy` · `/terms` · `/license` · `/security`.

## Quick Reference

**Tech Stack:** Next.js 16 (Turbopack), React 19, Tailwind CSS 4, Zustand, Vitest
**Deployment:** sip-protocol.org (Vercel — Git auto-deploy; migrated off VPS 2026-06-02). Docker/GHCR retained as VPS rollback only.

```bash
pnpm install
pnpm dev            # Dev server (localhost:3000)
pnpm test -- --run  # 157 tests
pnpm build
pnpm typecheck
```

## Key Files

| Path | Description |
|------|-------------|
| `src/app/` | Next.js app router pages |
| `src/app/sdk/` | SDK showcase page with syntax highlighting |
| `src/app/grants/superteam/` | Superteam $10K grant pitch (M16) |
| `src/app/grants/solana-foundation/` | Solana Foundation $100K grant pitch (M17) |
| `src/components/` | React components (swap UI, wallet) |
| `src/hooks/use-swap.ts` · `src/hooks/use-quote.ts` | Swap / quote logic |
| `src/stores/wallet-store.ts` · `src/stores/toast-store.ts` | Wallet + toast state |
| `src/lib/sip-client.ts` | SDK client with BrowserNoirProvider |
| `src/lib/constants.ts` | Test counts, SDK version constants |
| `src/components/video-demo.tsx` | YouTube demo video embed |

## Grant Pages

- **Superteam Microgrant ($10K)** `/grants/superteam` — M16 Narrative Capture; 2 months (Jan-Feb 2026); SIP Labs Inc. registration for fundraising readiness.
- **Solana Foundation Grant ($100K)** `/grants/solana-foundation` — M17 Solana Same-Chain Privacy; 6 months (Feb-Aug 2026); same-chain SDK + Jupiter DEX + Mobile SDK + security audit.

## Features

Wallet connection (Solana, Ethereum, Hardware); quote fetching (NEAR Intents); swap execution with privacy toggle; **real ZK proofs** via BrowserNoirProvider (Noir); transaction status tracking; toast notifications; SDK showcase; grant pitches; pitch deck; team/about; demo video (YouTube).

## Test Suites (157 total)

Toast store 14 · wallet store 25 · useQuote 12 · useSwap 26 · useBalance 10 · TransactionStatus 21 · ErrorBoundary 12 · Prices lib 18 · Health API 19.

## Repo-Specific Guidelines

**DO:** run `pnpm test -- --run` after changes; use Zustand stores for state; follow existing component patterns; keep grant pages updated with current milestone status.
**DON'T:** import SDK internals directly (use public API); skip accessibility in UI; hard-code test counts (use `src/lib/constants.ts`).

## Dependencies

`@sip-protocol/sdk` (Core SDK) · `@sip-protocol/types` (TypeScript types).