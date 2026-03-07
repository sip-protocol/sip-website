import { getFounderData } from '@/lib/founder-data'
import { MonolithContent } from './content'

export const metadata = {
  title: 'SIP Privacy | MONOLITH 2026',
  description:
    'THE Privacy Wallet for Seeker. Private swaps via Jupiter, stealth addresses, multi-wallet support. Mainnet verified. $125K+ prize pool.',
  openGraph: {
    title: 'SIP Privacy | MONOLITH 2026',
    description:
      'Every transaction on Seeker is public. SIP fixes that — one toggle. Private swaps, stealth addresses, multi-wallet.',
    images: ['/images/showcase/monolith-2026/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'SIP Privacy | MONOLITH Hackathon 2026',
    description:
      'THE Privacy Wallet for Seeker. Private swaps, stealth addresses, Pedersen commitments. Mainnet verified.',
    images: ['/images/showcase/monolith-2026/og-image.png'],
  },
}

export default async function MonolithShowcasePage() {
  const founderData = await getFounderData()

  return <MonolithContent founderData={founderData} />
}
