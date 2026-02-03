import { getFounderData } from '@/lib/founder-data'
import { SolanaPrivacyContent } from './content'

export const metadata = {
  title: 'SIP Privacy Mobile Wallet | Solana Privacy Hackathon 2026',
  description:
    'Privacy-first Solana wallet with compliant privacy. Full stealth address implementation with viewing keys for institutional compliance. Live on mainnet.',
  openGraph: {
    title: 'SIP Privacy Mobile Wallet | Solana Privacy Hackathon 2026',
    description:
      'Privacy-first Solana wallet with compliant privacy. Full stealth address implementation with viewing keys for institutional compliance.',
    images: ['/images/showcase/solana-privacy-2026/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIP Privacy Mobile Wallet',
    description:
      'Privacy-first Solana wallet with compliant privacy. Full stealth address implementation with viewing keys.',
    images: ['/images/showcase/solana-privacy-2026/og-image.png'],
  },
}

export default async function SolanaPrivacyShowcasePage() {
  const founderData = await getFounderData()

  return <SolanaPrivacyContent founderData={founderData} />
}
