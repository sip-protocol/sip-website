<div align="center">

<pre>
███████╗ ██╗ ██████╗     ██╗    ██╗███████╗██████╗ ███████╗██╗████████╗███████╗
██╔════╝ ██║ ██╔══██╗    ██║    ██║██╔════╝██╔══██╗██╔════╝██║╚══██╔══╝██╔════╝
███████╗ ██║ ██████╔╝    ██║ █╗ ██║█████╗  ██████╔╝███████╗██║   ██║   █████╗
╚════██║ ██║ ██╔═══╝     ██║███╗██║██╔══╝  ██╔══██╗╚════██║██║   ██║   ██╔══╝
███████║ ██║ ██║         ╚███╔███╔╝███████╗██████╔╝███████║██║   ██║   ███████╗
╚══════╝ ╚═╝ ╚═╝          ╚══╝╚══╝ ╚══════╝╚═════╝ ╚══════╝╚═╝   ╚═╝   ╚══════╝
</pre>

# SIP Website

> **Privacy is not a feature. It's a right.**

**Official marketing website for SIP Protocol — the privacy standard for Web3**

*Landing page • SDK showcase • Grant pitches • Investor deck • Hackathon showcases*

[![CI](https://github.com/sip-protocol/sip-website/actions/workflows/ci.yml/badge.svg)](https://github.com/sip-protocol/sip-website/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Tests-157-brightgreen)](tests/)

**🏆 Winner — [Zypherpunk Hackathon](https://zypherpunk.xyz) ($6,500: NEAR $4,000 + Tachyon $500 + pumpfun $2,000) | #9 of 93 | 3 Tracks**

**Live:** [sip-protocol.org](https://sip-protocol.org)

</div>

---

## Table of Contents

- [What is SIP Website?](#-what-is-sip-website)
- [Domain Structure](#-domain-structure)
- [Pages](#-pages)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Architecture](#%EF%B8%8F-architecture)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Development](#-development)
- [Deployment](#-deployment)
- [Related Projects](#-related-projects)
- [License](#-license)

---

## 🛡️ What is SIP Website?

SIP Website is the **official marketing site** for SIP Protocol. It answers the question "What is SIP?" and drives visitors to the product.

```
sip-protocol.org     → "What is SIP?" (marketing, grants, SDK showcase)
app.sip-protocol.org → "Use SIP now" (the actual product)
```

**Focus:** Marketing, fundraising, developer adoption, hackathon showcases.

---

## 🌐 Domain Structure

SIP Protocol uses a multi-domain architecture:

| Domain | Purpose | Repository |
|--------|---------|------------|
| **sip-protocol.org** | Marketing website | This repo |
| **app.sip-protocol.org** | Privacy application | [sip-app](https://github.com/sip-protocol/sip-app) |
| **docs.sip-protocol.org** | Documentation | [docs-sip](https://github.com/sip-protocol/docs-sip) |
| **blog.sip-protocol.org** | Technical blog | [blog-sip](https://github.com/sip-protocol/blog-sip) |

### Deprecated Pages (Redirects)

Demo/POC pages have been migrated to `app.sip-protocol.org`:

| Old Route | New Location | Status |
|-----------|--------------|--------|
| `/demo` | `app.sip-protocol.org/dex` | 301 Redirect |
| `/claim` | `app.sip-protocol.org/payments/receive` | 301 Redirect |
| `/phantom-poc` | `app.sip-protocol.org/wallet` | 301 Redirect |
| `/jupiter-poc` | `app.sip-protocol.org/dex/jupiter` | 301 Redirect |
| `/compliance-dashboard` | `app.sip-protocol.org/enterprise` | 301 Redirect |

---

## 📄 Pages

### Marketing (5 pages)

| Route | Purpose | Description |
|-------|---------|-------------|
| `/` | Landing page | Hero, features, CTA, social proof |
| `/about` | Team & mission | Team section, advisors, roadmap |
| `/features` | Feature breakdown | Detailed feature comparison |
| `/roadmap` | Public roadmap | Milestone tracking |
| `/sdk` | SDK showcase | Code examples, integration guide |

### Fundraising (3 pages)

| Route | Purpose | Amount |
|-------|---------|--------|
| `/pitch-deck` | Investor deck | Seed round |
| `/grants/superteam` | Superteam grant | $10,000 ✅ Approved |
| `/grants/solana-foundation` | Solana Foundation | $100,000 (Pending) |

### Hackathon Showcases (2 pages)

| Route | Hackathon | Result |
|-------|-----------|--------|
| `/showcase/zypherpunk-2025` | Zypherpunk 2025 | 🏆 Winner ($6,500) |
| `/showcase/solana-privacy-2026` | Solana Privacy 2026 | Submission |

### Legal (4 pages)

| Route | Purpose |
|-------|---------|
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/license` | License information |
| `/security` | Security policy |

---

## ✨ Features

### 🎨 Marketing Site
- Modern landing page with hero section
- Feature comparison tables
- Social proof (hackathon wins, grant approvals)
- Call-to-action driving to app.sip-protocol.org

### 📦 SDK Showcase
- Interactive code examples
- Syntax highlighting
- Copy-to-clipboard functionality
- Integration guides

### 💰 Grant Pitches
- Professional grant applications
- Architecture diagrams
- Milestone tracking
- Competitive positioning (vs PrivacyCash)

### 🏆 Hackathon Showcases
- Demo videos (phone mockups)
- Feature breakdowns
- Track alignment
- Download links (APK)

### ⚡ Performance
- Next.js 15 App Router
- Static generation where possible
- Optimized images
- Fast page transitions

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/sip-protocol/sip-website.git
cd sip-website

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

---

## 🏗️ Architecture

### Project Structure

```
sip-website/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page (/)
│   │   │
│   │   ├── about/                # Team & mission
│   │   ├── features/             # Feature breakdown
│   │   ├── roadmap/              # Public roadmap
│   │   ├── sdk/                  # SDK showcase
│   │   │
│   │   ├── pitch-deck/           # Investor deck
│   │   ├── grants/
│   │   │   ├── superteam/        # $10K grant ✅
│   │   │   └── solana-foundation/# $100K grant
│   │   │
│   │   ├── showcase/
│   │   │   ├── zypherpunk-2025/  # 🏆 Winner
│   │   │   └── solana-privacy-2026/
│   │   │
│   │   ├── privacy/              # Privacy policy
│   │   ├── terms/                # Terms of service
│   │   ├── license/              # License info
│   │   └── security/             # Security policy
│   │
│   ├── components/
│   │   ├── ui/                   # Base components
│   │   ├── landing/              # Landing page sections
│   │   ├── showcase/             # Hackathon showcase components
│   │   └── shared/               # Shared components
│   │
│   ├── lib/
│   │   ├── constants.ts          # Test counts, SDK version
│   │   └── sip-client.ts         # SDK integration
│   │
│   └── stores/                   # Zustand stores
│
├── tests/                        # 157 tests
├── public/                       # Static assets
└── docker-compose.yml            # Production deployment
```

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Next.js 15 | Full-stack React |
| **UI** | React 19 | Component library |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Animations** | Framer Motion | Page transitions, micro-interactions |
| **State** | Zustand | Client state management |
| **Testing** | Vitest + Playwright | Unit + E2E tests |
| **Icons** | Lucide React | Icon library |
| **SDK** | @sip-protocol/sdk | Core privacy SDK |

---

## 💻 Development

### Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run tests in watch mode
pnpm test:run         # Run tests once (157 tests)
pnpm typecheck        # Type check with TypeScript
pnpm lint             # Lint with ESLint
pnpm test:e2e         # Run E2E tests
```

### Test Suites

| Suite | Tests | Location |
|-------|-------|----------|
| Toast store | 14 | `tests/stores/toast-store.test.ts` |
| Wallet store | 21 | `tests/stores/wallet-store.test.ts` |
| useQuote hook | 12 | `tests/hooks/use-quote.test.tsx` |
| useSwap hook | 24 | `tests/hooks/use-swap.test.tsx` |
| TransactionStatus | 21 | `tests/components/transaction-status.test.tsx` |
| SwapCard | 31 | `tests/components/swap-card.test.tsx` |
| **Total** | **157** | |

---

## 🚀 Deployment

### Docker (Production)

```bash
# Build Docker image
docker build -t sip-website .

# Run locally
docker run -p 3000:3000 sip-website
```

### VPS Configuration

| Service | Port | Domain |
|---------|------|--------|
| sip-website | 5000 | sip-protocol.org |

```yaml
# docker-compose.yml
name: sip-website

services:
  web:
    image: ghcr.io/sip-protocol/sip-website:latest
    container_name: sip-website
    ports:
      - "5000:3000"
    restart: unless-stopped
```

### CI/CD Pipeline

```
Push to main → GitHub Actions → Build Docker → Push to GHCR → SSH Deploy → Live
```

---

## 🔗 Related Projects

| Project | Description | Link |
|---------|-------------|------|
| **sip-protocol** | Core SDK (6,600+ tests) | [GitHub](https://github.com/sip-protocol/sip-protocol) |
| **sip-app** | Privacy application | [GitHub](https://github.com/sip-protocol/sip-app) |
| **sip-mobile** | Mobile wallet | [GitHub](https://github.com/sip-protocol/sip-mobile) |
| **docs-sip** | Documentation | [docs.sip-protocol.org](https://docs.sip-protocol.org) |
| **blog-sip** | Technical blog | [blog.sip-protocol.org](https://blog.sip-protocol.org) |

---

## 📄 License

[MIT License](LICENSE) — see LICENSE file for details.

---

<div align="center">

**🏆 Zypherpunk Hackathon Winner ($6,500) | #9 of 93 | 3 Tracks**

*Privacy is not a feature. It's a right.*

[Live Site](https://sip-protocol.org) · [Documentation](https://docs.sip-protocol.org) · [Report Bug](https://github.com/sip-protocol/sip-website/issues)

*Part of the [SIP Protocol](https://github.com/sip-protocol) ecosystem*

</div>
