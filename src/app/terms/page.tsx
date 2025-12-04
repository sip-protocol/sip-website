import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - SIP Protocol',
  description: 'Terms of Service for SIP Protocol',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-invert prose-purple max-w-none">
        <p className="text-gray-400 mb-8">
          <strong>Last Updated:</strong> December 4, 2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-300 mb-4">
            Welcome to SIP Protocol (&ldquo;SIP,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). By accessing or using our website,
            services, or protocol (collectively, the &ldquo;Services&rdquo;), you agree to be bound by these Terms
            of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use our Services.
          </p>
          <p className="text-gray-300 mb-4">
            These Terms constitute a legally binding agreement between you and SIP Protocol. We may update
            these Terms from time to time, and your continued use of the Services constitutes acceptance
            of any changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
          <p className="text-gray-300 mb-4">
            SIP Protocol is a privacy layer for cross-chain transactions that enables shielded intents
            through cryptographic techniques including stealth addresses, Pedersen commitments, and viewing
            keys. Our Services include:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li>Software development kits (SDKs) for integrating privacy features</li>
            <li>Web interface for interacting with the protocol</li>
            <li>Documentation and developer tools</li>
            <li>Privacy-enhanced transaction routing across blockchain networks</li>
          </ul>
          <p className="text-gray-300 mb-4">
            The Services are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We reserve the right to
            modify, suspend, or discontinue any aspect of the Services at any time without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Eligibility and Account Requirements</h2>
          <p className="text-gray-300 mb-4">
            To use our Services, you must:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li>Be at least 18 years of age or the age of majority in your jurisdiction</li>
            <li>Have the legal capacity to enter into binding contracts</li>
            <li>Not be prohibited from using the Services under applicable laws or regulations</li>
            <li>Not be located in or a resident of any jurisdiction where the Services are prohibited</li>
            <li>Comply with all applicable laws and regulations, including sanctions and anti-money laundering laws</li>
          </ul>
          <p className="text-gray-300 mb-4">
            You are responsible for maintaining the security of your wallet, private keys, and any other
            credentials used to access the Services. We are not liable for any loss or damage arising from
            unauthorized access to your account or wallet.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
          <p className="text-gray-300 mb-4">You agree to use the Services only for lawful purposes. You must not:</p>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li>Use the Services to engage in illegal activities, including money laundering, terrorist financing, or sanctions evasion</li>
            <li>Attempt to gain unauthorized access to the Services or other users&apos; accounts</li>
            <li>Interfere with or disrupt the operation of the Services or servers</li>
            <li>Use the Services to transmit malware, viruses, or other harmful code</li>
            <li>Violate any applicable laws, regulations, or third-party rights</li>
            <li>Engage in market manipulation, fraud, or deceptive practices</li>
            <li>Reverse engineer, decompile, or attempt to extract source code from the Services</li>
            <li>Use automated tools (bots, scrapers) without our express written permission</li>
          </ul>
          <p className="text-gray-300 mb-4">
            We reserve the right to investigate and take appropriate action against anyone who violates
            these Terms, including suspending or terminating access to the Services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Cryptocurrency and Blockchain Transactions</h2>

          <h3 className="text-xl font-semibold mb-3">5.1 Transaction Responsibility</h3>
          <p className="text-gray-300 mb-4">
            You are solely responsible for all transactions you initiate through the Services. Blockchain
            transactions are generally irreversible, and we cannot reverse, cancel, or refund transactions
            once they are confirmed on the blockchain.
          </p>

          <h3 className="text-xl font-semibold mb-3">5.2 Network Fees</h3>
          <p className="text-gray-300 mb-4">
            You are responsible for paying all network fees (gas fees, transaction fees) associated with
            your use of the Services. These fees are collected by blockchain networks and validators, not
            by SIP Protocol.
          </p>

          <h3 className="text-xl font-semibold mb-3">5.3 Third-Party Protocols</h3>
          <p className="text-gray-300 mb-4">
            The Services integrate with third-party blockchain networks, protocols, and services. We are
            not responsible for the operation, security, or availability of these third-party services.
          </p>

          <h3 className="text-xl font-semibold mb-3">5.4 Privacy Features</h3>
          <p className="text-gray-300 mb-4">
            While SIP Protocol provides privacy-enhancing features, we cannot guarantee absolute privacy
            or anonymity. Users should understand the privacy characteristics and limitations of the
            cryptographic techniques used.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Risks and Disclaimers</h2>

          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">⚠️ Important Risk Disclosures</h3>
            <p className="text-gray-300 mb-4">
              Using cryptocurrency and blockchain technology involves significant risks. Please read
              these risk disclosures carefully before using the Services.
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-3">6.1 Technology Risks</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li><strong>Software Risks:</strong> The Services may contain bugs, vulnerabilities, or errors that could result in loss of funds or data.</li>
            <li><strong>Smart Contract Risks:</strong> Smart contracts may have vulnerabilities or behave unexpectedly, potentially resulting in loss of assets.</li>
            <li><strong>Network Risks:</strong> Blockchain networks may experience congestion, forks, attacks, or failures that affect transaction processing.</li>
            <li><strong>Cryptographic Risks:</strong> Cryptographic systems may be compromised by advances in computing or mathematics.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">6.2 Market Risks</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li><strong>Volatility:</strong> Cryptocurrency prices are highly volatile and can result in significant losses.</li>
            <li><strong>Liquidity:</strong> There may be insufficient liquidity to execute transactions at desired prices or at all.</li>
            <li><strong>Slippage:</strong> Actual transaction prices may differ from expected prices due to market movements.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">6.3 Regulatory Risks</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li><strong>Legal Uncertainty:</strong> Cryptocurrency and privacy technology regulations are evolving and uncertain.</li>
            <li><strong>Compliance:</strong> You are responsible for complying with all applicable laws, including tax obligations.</li>
            <li><strong>Restrictions:</strong> Services may be restricted or prohibited in certain jurisdictions.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">6.4 Operational Risks</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li><strong>Loss of Access:</strong> Loss of private keys or wallet credentials may result in permanent loss of assets.</li>
            <li><strong>Human Error:</strong> Incorrect addresses, amounts, or settings may result in irreversible loss.</li>
            <li><strong>Third-Party Dependencies:</strong> Services depend on third-party infrastructure that may fail or be compromised.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. No Financial Advice</h2>
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 mb-6">
            <p className="text-gray-300 mb-4">
              <strong className="text-red-400">IMPORTANT:</strong> SIP Protocol does not provide financial,
              investment, tax, or legal advice. Nothing in the Services should be construed as financial
              advice or a recommendation to buy, sell, or hold any asset.
            </p>
            <p className="text-gray-300 mb-4">
              You should conduct your own research and consult with qualified professionals before making
              any financial decisions. We do not recommend or endorse any specific tokens, protocols, or
              investment strategies.
            </p>
            <p className="text-gray-300 mb-0">
              <strong>Never invest more than you can afford to lose.</strong> Cryptocurrency transactions
              involve substantial risk of loss.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
          <p className="text-gray-300 mb-4">
            The Services and all content, features, and functionality are owned by SIP Protocol and its
            licensors and are protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p className="text-gray-300 mb-4">
            Our open-source code is licensed under the MIT License. You may use, modify, and distribute
            the code in accordance with the license terms. Other content and trademarks remain our property.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <p className="text-gray-300 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SIP PROTOCOL AND ITS AFFILIATES, OFFICERS, DIRECTORS,
              EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
              OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR USE, ARISING OUT OF OR RELATED
              TO YOUR USE OF THE SERVICES.
            </p>
            <p className="text-gray-300 mb-0">
              IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES EXCEED THE AMOUNT YOU PAID TO
              US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER
              IS GREATER.
            </p>
          </div>
          <p className="text-gray-300 mb-4">
            This limitation applies to claims based on warranty, contract, tort, strict liability, or any
            other legal theory, even if we have been advised of the possibility of such damages.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
          <p className="text-gray-300 mb-4">
            You agree to indemnify, defend, and hold harmless SIP Protocol and its affiliates, officers,
            directors, employees, and agents from and against any claims, liabilities, damages, losses,
            costs, and expenses (including reasonable attorneys&apos; fees) arising out of or related to:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li>Your use of the Services</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any applicable laws or regulations</li>
            <li>Your violation of third-party rights</li>
            <li>Your transactions conducted through the Services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Disclaimer of Warranties</h2>
          <p className="text-gray-300 mb-4">
            THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
            FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
          </p>
          <p className="text-gray-300 mb-4">
            We do not warrant that the Services will be uninterrupted, error-free, secure, or free from
            viruses or other harmful components. We do not warrant the accuracy, completeness, or reliability
            of any content or information provided through the Services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
          <p className="text-gray-300 mb-4">
            We reserve the right to suspend or terminate your access to the Services at any time, with or
            without cause or notice, including for violation of these Terms. You may stop using the Services
            at any time.
          </p>
          <p className="text-gray-300 mb-4">
            Upon termination, your right to use the Services will immediately cease. Provisions that by
            their nature should survive termination (including disclaimers, limitations of liability, and
            indemnification) will continue to apply.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Dispute Resolution</h2>

          <h3 className="text-xl font-semibold mb-3">13.1 Governing Law</h3>
          <p className="text-gray-300 mb-4">
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
            in which SIP Protocol operates, without regard to conflict of law principles.
          </p>

          <h3 className="text-xl font-semibold mb-3">13.2 Arbitration</h3>
          <p className="text-gray-300 mb-4">
            Any dispute arising out of or relating to these Terms or the Services shall be resolved through
            binding arbitration in accordance with the rules of a recognized arbitration association. The
            arbitration shall be conducted in English.
          </p>

          <h3 className="text-xl font-semibold mb-3">13.3 Class Action Waiver</h3>
          <p className="text-gray-300 mb-4">
            You agree that any dispute resolution proceedings will be conducted only on an individual basis
            and not as a class action or other representative action.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Privacy</h2>
          <p className="text-gray-300 mb-4">
            Your use of the Services is subject to our Privacy Policy, which is incorporated by reference
            into these Terms. Please review our{' '}
            <a href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</a> to
            understand our data practices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. Changes to Terms</h2>
          <p className="text-gray-300 mb-4">
            We may update these Terms from time to time. We will notify you of material changes by posting
            the updated Terms on our website with a new &ldquo;Last Updated&rdquo; date. Your continued use of the
            Services after such changes constitutes acceptance of the updated Terms.
          </p>
          <p className="text-gray-300 mb-4">
            We recommend reviewing these Terms periodically. If you do not agree to the updated Terms, you
            must stop using the Services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">16. Miscellaneous</h2>

          <h3 className="text-xl font-semibold mb-3">16.1 Entire Agreement</h3>
          <p className="text-gray-300 mb-4">
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and
            SIP Protocol regarding the Services and supersede all prior agreements and understandings.
          </p>

          <h3 className="text-xl font-semibold mb-3">16.2 Severability</h3>
          <p className="text-gray-300 mb-4">
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions
            will continue in full force and effect.
          </p>

          <h3 className="text-xl font-semibold mb-3">16.3 Waiver</h3>
          <p className="text-gray-300 mb-4">
            Our failure to enforce any right or provision of these Terms will not constitute a waiver of
            that right or provision.
          </p>

          <h3 className="text-xl font-semibold mb-3">16.4 Assignment</h3>
          <p className="text-gray-300 mb-4">
            You may not assign or transfer these Terms or your rights under these Terms without our prior
            written consent. We may assign or transfer these Terms without restriction.
          </p>

          <h3 className="text-xl font-semibold mb-3">16.5 Force Majeure</h3>
          <p className="text-gray-300 mb-4">
            We shall not be liable for any failure or delay in performance due to circumstances beyond our
            reasonable control, including acts of God, natural disasters, war, terrorism, cyberattacks, or
            government actions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">17. Contact Information</h2>
          <p className="text-gray-300 mb-4">
            If you have questions or concerns about these Terms, please contact us:
          </p>
          <ul className="list-none text-gray-300 mb-4 space-y-2">
            <li><strong>Website:</strong> <a href="https://sip-protocol.org" className="text-purple-400 hover:text-purple-300">https://sip-protocol.org</a></li>
            <li><strong>GitHub:</strong> <a href="https://github.com/sip-protocol" className="text-purple-400 hover:text-purple-300">https://github.com/sip-protocol</a></li>
            <li><strong>Documentation:</strong> <a href="https://docs.sip-protocol.org" className="text-purple-400 hover:text-purple-300">https://docs.sip-protocol.org</a></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">18. Acknowledgment</h2>
          <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6">
            <p className="text-gray-300 mb-4">
              By using the Services, you acknowledge that:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>You have read and understood these Terms</li>
              <li>You agree to be bound by these Terms</li>
              <li>You understand the risks associated with cryptocurrency and blockchain technology</li>
              <li>You are solely responsible for your use of the Services and any transactions you conduct</li>
              <li>You have consulted with appropriate professionals regarding legal, tax, and financial matters</li>
            </ul>
            <p className="text-gray-300 mb-0">
              <strong>If you do not agree to these Terms, do not use the Services.</strong>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
