import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Header, Footer } from '@/components/layout'
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
  title: 'SIP Protocol - Privacy for Cross-Chain Transactions',
  description: 'Shielded Intents Protocol - One toggle to shield your sender, amount, and recipient. Built on NEAR Intents + Zcash.',
  keywords: ['privacy', 'cross-chain', 'blockchain', 'stealth addresses', 'NEAR', 'Zcash', 'DeFi'],
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
    title: 'SIP Protocol - Privacy for Cross-Chain Transactions',
    description: 'One toggle to shield your sender, amount, and recipient.',
    url: 'https://sip-protocol.org',
    siteName: 'SIP Protocol',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SIP Protocol - Privacy Layer for Cross-Chain Transactions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIP Protocol - Privacy for Cross-Chain Transactions',
    description: 'One toggle to shield your sender, amount, and recipient.',
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
        <Header />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
