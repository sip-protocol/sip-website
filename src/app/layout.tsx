import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Header, Footer } from '@/components/layout'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://sip-protocol.org'),
  title: 'SIP Protocol - The Privacy Standard for Web3',
  description: 'One toggle to shield sender, amount, and recipient. Stealth addresses, Pedersen commitments, and viewing keys for compliance. Any chain.',
  keywords: ['privacy', 'web3', 'blockchain', 'stealth addresses', 'pedersen commitments', 'viewing keys', 'DeFi', 'Solana', 'Ethereum', 'NEAR'],
  authors: [{ name: 'SIP Protocol' }],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/logo-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/logo-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'SIP Protocol - The Privacy Standard for Web3',
    description: 'One toggle to shield sender, amount, and recipient. Stealth addresses, Pedersen commitments, and viewing keys for compliance.',
    url: 'https://sip-protocol.org',
    siteName: 'SIP Protocol',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SIP Protocol - The Privacy Standard for Web3',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIP Protocol - The Privacy Standard for Web3',
    description: 'One toggle to shield sender, amount, and recipient. Stealth addresses, Pedersen commitments, and viewing keys for compliance.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-gray-950 text-white antialiased`}
      >
        {/* Umami Analytics (self-hosted, privacy-first) */}
        <Script
          src="https://analytics.sip-protocol.org/script.js"
          data-website-id="ad016e04-ff09-4cf0-be5d-6c4de4bda1b9"
          strategy="afterInteractive"
        />
        <Providers>
          <Header />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
