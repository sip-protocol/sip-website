import { Shield, AlertTriangle, Lock, Eye, FileText, Mail } from 'lucide-react'
import Link from 'next/link'

export default function SecurityPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-gray-800/50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Security</h1>
          </div>
          <p className="text-lg text-gray-400">
            SIP Protocol is built with security as a foundational principle. This page outlines
            our threat model, security properties, and responsible disclosure process.
          </p>
        </div>
      </section>

      {/* Threat Model Summary */}
      <section className="py-12 border-b border-gray-800/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Threat Model
          </h2>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3">What SIP Protects Against</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong className="text-white">Transaction Linkability</strong> — Stealth addresses prevent linking sender to recipient</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong className="text-white">Amount Disclosure</strong> — Pedersen commitments hide transaction amounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong className="text-white">Address Reuse Analysis</strong> — One-time addresses for each transaction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong className="text-white">Balance Inference</strong> — Commitment scheme prevents balance calculation</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3">Known Limitations</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">⚠</span>
                  <span><strong className="text-white">Timing Analysis</strong> — Transaction timing may leak information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">⚠</span>
                  <span><strong className="text-white">Network Layer</strong> — IP addresses visible without additional protection (use Tor/VPN)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">⚠</span>
                  <span><strong className="text-white">Metadata</strong> — On-chain metadata not covered by privacy layer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">⚠</span>
                  <span><strong className="text-white">Solver Trust</strong> — NEAR Intents solvers can observe some intent metadata</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3">Trust Assumptions</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>Cryptographic primitives (secp256k1, SHA-256, XChaCha20-Poly1305) are secure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>NEAR Intents infrastructure operates honestly for settlement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>User&apos;s local environment is not compromised</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>Random number generation (CSPRNG) is unpredictable</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security Properties */}
      <section className="py-12 border-b border-gray-800/50 bg-gray-900/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5 text-purple-400" />
            Security Properties
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-5 rounded-xl bg-gray-800/50 border border-gray-700">
              <h3 className="font-semibold mb-2">Sender Privacy</h3>
              <p className="text-sm text-gray-400">
                Transaction origin is obscured through stealth address generation and commitment schemes.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gray-800/50 border border-gray-700">
              <h3 className="font-semibold mb-2">Recipient Privacy</h3>
              <p className="text-sm text-gray-400">
                One-time stealth addresses prevent recipient identification and address reuse analysis.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gray-800/50 border border-gray-700">
              <h3 className="font-semibold mb-2">Amount Privacy</h3>
              <p className="text-sm text-gray-400">
                Pedersen commitments (C = v·G + r·H) hide amounts while preserving verifiability.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gray-800/50 border border-gray-700">
              <h3 className="font-semibold mb-2">Selective Disclosure</h3>
              <p className="text-sm text-gray-400">
                Viewing keys enable compliance without compromising user privacy broadly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Status */}
      <section className="py-12 border-b border-gray-800/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-400" />
            Audit Status
          </h2>

          <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-400 mb-2">Pre-Audit Stage</h3>
                <p className="text-sm text-gray-400 mb-3">
                  SIP Protocol has not yet undergone a formal security audit. The codebase is
                  designed with audit-readiness in mind, featuring comprehensive test coverage
                  (1,331+ tests) and documented security assumptions.
                </p>
                <p className="text-sm text-gray-400">
                  We recommend using small amounts ($5-10) for testing until a formal audit is completed.
                  Note: NEAR Intents operates on mainnet only—there is no testnet deployment.
                  A security audit is planned for Milestone 8 (Production Hardening).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible Disclosure */}
      <section className="py-12 border-b border-gray-800/50 bg-gray-900/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-500" />
            Responsible Disclosure
          </h2>

          <div className="space-y-6">
            <p className="text-gray-400">
              We take security vulnerabilities seriously. If you discover a security issue,
              please follow our responsible disclosure process.
            </p>

            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Reporting Process</h3>
              <ol className="space-y-3 text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold flex-shrink-0">1</span>
                  <span><strong className="text-white">Do not</strong> disclose the vulnerability publicly until it has been addressed</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold flex-shrink-0">2</span>
                  <span>Email details to <strong className="text-white">security@sip-protocol.org</strong> with &quot;SECURITY&quot; in subject</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold flex-shrink-0">3</span>
                  <span>Include: description, steps to reproduce, potential impact, and suggested fix if any</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold flex-shrink-0">4</span>
                  <span>We will acknowledge within 48 hours and provide regular updates</span>
                </li>
              </ol>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <Mail className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Security Contact</p>
                <a href="mailto:security@sip-protocol.org" className="text-purple-400 hover:text-purple-300 transition-colors">
                  security@sip-protocol.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-6">Related Resources</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://docs.sip-protocol.org/security/threat-model"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded-lg hover:border-purple-500/50 hover:text-white transition-colors"
            >
              Full Threat Model →
            </a>
            <a
              href="https://docs.sip-protocol.org/security/security-properties"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded-lg hover:border-purple-500/50 hover:text-white transition-colors"
            >
              Security Properties →
            </a>
            <a
              href="https://github.com/sip-protocol/sip-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded-lg hover:border-purple-500/50 hover:text-white transition-colors"
            >
              Source Code →
            </a>
            <Link
              href="/license"
              className="px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded-lg hover:border-purple-500/50 hover:text-white transition-colors"
            >
              License →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
