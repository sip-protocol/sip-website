import Link from 'next/link'
import Image from 'next/image'
import { Github, Twitter, ExternalLink } from 'lucide-react'

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
      { href: 'https://x.com/sipprotocol', label: 'Twitter', external: true },
    ],
  },
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
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
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
