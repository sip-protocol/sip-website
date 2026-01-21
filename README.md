# sip-website

> Official marketing website for SIP Protocol — https://sip-protocol.org

**🏆 Winner — [Zypherpunk Hackathon](https://zypherpunk.xyz) 3 Tracks ($6,500: NEAR $4,000 + Tachyon $500 + pumpfun $2,000)**

---

## Overview

Marketing website for **SIP Protocol** (Shielded Intents Protocol), the privacy standard for Web3.

**Note:** Interactive demos have been migrated to [app.sip-protocol.org](https://app.sip-protocol.org). This site focuses on marketing, grants, and documentation.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Deployment:** Docker + GHCR → VPS (port 5000)
- **Domain:** sip-protocol.org
- **Tests:** 157 tests (Vitest)

## Active Pages (13)

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, CTA |
| `/about` | Team, mission, roadmap |
| `/features` | Detailed feature breakdown |
| `/roadmap` | Public roadmap |
| `/sdk` | SDK showcase |
| `/pitch-deck` | Investor pitch deck |
| `/grants/superteam` | Superteam grant application |
| `/grants/solana-foundation` | Solana Foundation grant |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/license` | License information |
| `/security` | Security policy |

## Deprecated Pages (Redirects)

The following pages have been removed with 301 redirects to sip-app:

| Old Route | New Location |
|-----------|--------------|
| `/demo` | `app.sip-protocol.org/dex` |
| `/claim` | `app.sip-protocol.org/payments/receive` |
| `/phantom-poc` | `app.sip-protocol.org/wallet` |
| `/jupiter-poc` | `app.sip-protocol.org/dex/jupiter` |
| `/compliance-dashboard` | `app.sip-protocol.org/enterprise` |

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run tests
pnpm test -- --run

# Build for production
pnpm build

# Preview production build
pnpm start
```

## Domain Structure

| Domain | Purpose | Repo |
|--------|---------|------|
| `sip-protocol.org` | Marketing | This repo |
| `app.sip-protocol.org` | Privacy App | [sip-app](https://github.com/sip-protocol/sip-app) |
| `docs.sip-protocol.org` | Documentation | [docs-sip](https://github.com/sip-protocol/docs-sip) |
| `blog.sip-protocol.org` | Blog | [blog-sip](https://github.com/sip-protocol/blog-sip) |

## Related

- [sip-protocol](https://github.com/sip-protocol/sip-protocol) - Core SDK
- [sip-app](https://github.com/sip-protocol/sip-app) - Privacy App
- [docs-sip](https://github.com/sip-protocol/docs-sip) - Documentation
- [circuits](https://github.com/sip-protocol/circuits) - ZK Circuits

---

*Part of the [SIP Protocol](https://github.com/sip-protocol) ecosystem*


