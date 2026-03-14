import type { Metadata } from 'next'
import { T2ProgressContent } from './content'

export const metadata: Metadata = {
  title: 'T2 Progress Report - Superteam Indonesia Grant | SIP Protocol',
  description: 'SIP Protocol T2 tranche progress report. All 4 deliverables shipped: Solana Privacy SDK v0.9.0, Jupiter DEX integration, production app, developer resources. Plus mainnet program, mobile wallet, and hackathon win.',
  openGraph: {
    title: 'T2 Progress Report - Superteam Indonesia Grant',
    description: 'All 4 grant deliverables shipped. 803 commits, 11,100+ tests, mainnet program live, Seeker wallet built.',
    url: 'https://sip-protocol.org/grants/superteam/t2',
    siteName: 'SIP Protocol',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SIP Protocol - T2 Progress Report',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T2 Progress Report - Superteam Indonesia Grant',
    description: 'All 4 grant deliverables shipped. 803 commits, 11,100+ tests, mainnet program live.',
    images: ['/og-image.png'],
  },
}

export default function T2ProgressPage() {
  return <T2ProgressContent />
}
