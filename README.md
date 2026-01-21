# sip-website

> Official website for SIP Protocol — https://sip-protocol.org

**🏆 Winner — [Zypherpunk Hackathon](https://zypherpunk.xyz) 3 Tracks ($6,500: NEAR $4,000 + Tachyon $500 + pumpfun $2,000)**

---

## Overview

Marketing website and interactive demo for **SIP Protocol** (Shielded Intents Protocol), a privacy layer for cross-chain transactions.

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Deployment:** Vercel / Cloudflare Pages
- **Domain:** sip-protocol.org

## Structure

```
sip-website/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── demo/
│   │   │   └── page.tsx       # Interactive demo
│   │   ├── features/
│   │   └── about/
│   ├── components/
│   │   ├── hero/
│   │   ├── features/
│   │   ├── demo/
│   │   └── ui/
│   └── lib/
├── public/
│   └── assets/
├── tailwind.config.ts
└── package.json
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, CTA |
| `/demo` | Interactive SDK demo |
| `/features` | Detailed feature breakdown |
| `/about` | Team, mission, roadmap |

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm start
```

## Domain Structure

| Domain | Purpose | Repo |
|--------|---------|------|
| `sip-protocol.org` | Marketing + Demo | This repo |
| `docs.sip-protocol.org` | Documentation | [docs-sip](https://github.com/sip-protocol/docs-sip) |

## Related

- [sip-protocol](https://github.com/sip-protocol/sip-protocol) - Core SDK
- [docs-sip](https://github.com/sip-protocol/docs-sip) - Documentation
- [circuits](https://github.com/sip-protocol/circuits) - ZK Circuits

---

*Part of the [SIP Protocol](https://github.com/sip-protocol) ecosystem*


