import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { Github, XLogo } from '@/components/icons/brand-icons'

interface FooterLink {
  href: string
  label: string
  external?: boolean
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

const footerLinks: Record<string, FooterSection> = {
  product: {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: 'https://app.sip-protocol.org', label: 'Demo', external: true },
      { href: '/roadmap', label: 'Roadmap' },
    ],
  },
  developers: {
    title: 'Developers',
    links: [
      { href: 'https://docs.sip-protocol.org', label: 'Documentation', external: true },
      { href: 'https://docs.sip-protocol.org/getting-started', label: 'SDK Guide', external: true },
      { href: 'https://github.com/sip-protocol', label: 'GitHub', external: true },
      { href: 'https://www.npmjs.com/package/@sip-protocol/sdk', label: 'npm Package', external: true },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { href: '/security', label: 'Security' },
      { href: '/license', label: 'License' },
    ],
  },
  community: {
    title: 'Community',
    links: [
      { href: 'https://github.com/sip-protocol/sip-protocol', label: 'GitHub', external: true },
      { href: 'https://x.com/sipprotocol', label: 'X', external: true },
      { href: 'https://discord.gg/gXRsWkKq9E', label: 'Discord', external: true },
    ],
  },
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
              <Link href="/" className="flex items-center gap-3 group">
                <Image
                  src="/logo-64.png"
                  alt="SIP Protocol"
                  width={36}
                  height={36}
                  className="rounded-lg"
                />
                <span className="text-lg font-bold text-white">SIP Protocol</span>
              </Link>
              <p className="mt-4 text-sm text-gray-400 max-w-xs">
                Privacy layer for cross-chain transactions. One toggle to shield your sender, amount, and recipient.
              </p>
              {/* Social Links */}
              <div className="flex gap-4 mt-6">
                <a
                  href="https://github.com/sip-protocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://x.com/sipprotocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="X"
                >
                  <XLogo className="h-5 w-5" />
                </a>
                <a
                  href="https://discord.gg/gXRsWkKq9E"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Discord"
                >
                  <DiscordIcon className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h3 className="text-sm font-semibold text-white mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          {link.label}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} SIP Protocol. MIT License.
            </p>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-400 flex items-center gap-1">
                Built with
                <span className="text-pink-500">&#9829;</span>
                in stealth mode
              </p>
              <a
                href={`https://github.com/sip-protocol/sip-website/commit/${process.env.NEXT_PUBLIC_GIT_COMMIT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors font-mono"
                title="View commit on GitHub"
              >
                {process.env.NEXT_PUBLIC_GIT_BRANCH}/{process.env.NEXT_PUBLIC_GIT_COMMIT}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
