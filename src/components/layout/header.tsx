'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Menu, X, Github, ExternalLink } from 'lucide-react'

// Dynamic import to avoid SSR issues with SDK's WASM dependencies
const WalletButton = dynamic(
  () => import('@/components/wallet/wallet-button').then((mod) => mod.WalletButton),
  { ssr: false, loading: () => <div className="w-24 h-9" /> }
)

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: 'https://app.sip-protocol.org', label: 'Demo', external: true },
  { href: '/sdk', label: 'SDK' },
  { href: 'https://docs.sip-protocol.org', label: 'Docs', external: true },
  { href: 'https://blog.sip-protocol.org', label: 'Blog', external: true },
  { href: '/about', label: 'About' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-950/80 backdrop-blur-lg border-b border-gray-800/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo-64.png"
              alt="SIP Protocol"
              width={36}
              height={36}
              className="rounded-lg transition-transform group-hover:scale-105"
            />
            <span className="text-lg font-bold text-white">SIP Protocol</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const isExternal = link.external

              if (isExternal) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/sip-protocol/sip-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Star</span>
            </a>
            <WalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800/50">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                const isExternal = link.external

                if (isExternal) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-white bg-gray-800/50'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}

              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-800/50">
                <a
                  href="https://github.com/sip-protocol/sip-protocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-300 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span>Star on GitHub</span>
                </a>
                <div className="flex justify-center">
                  <WalletButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
