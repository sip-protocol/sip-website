import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - SIP Protocol',
  description: 'Privacy Policy for SIP Protocol',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-invert prose-purple max-w-none">
        <p className="text-gray-400 mb-8">
          <strong>Last Updated:</strong> December 4, 2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-300 mb-4">
            Welcome to SIP Protocol (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting your privacy
            and providing transparency about our data practices. This Privacy Policy explains how we collect,
            use, and safeguard information when you use our website and services.
          </p>
          <p className="text-gray-300 mb-4">
            SIP Protocol is a privacy-focused protocol designed to provide shielded transactions for cross-chain
            intents. While our core technology is built to enhance privacy, this policy covers data practices
            related to our website and application interface.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

          <h3 className="text-xl font-semibold mb-3">2.1 Information You Provide</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li><strong>Wallet Addresses:</strong> When you connect your wallet to use our services, we temporarily process your wallet address to facilitate transactions.</li>
            <li><strong>Transaction Data:</strong> Information about transactions you initiate through our protocol, including token types, amounts (when not shielded), and blockchain networks.</li>
            <li><strong>Communications:</strong> If you contact us for support or inquiries, we collect the information you provide in those communications.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.2 Information Collected Automatically</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li><strong>Usage Data:</strong> We collect information about how you interact with our website and services, including pages visited, features used, and time spent.</li>
            <li><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers.</li>
            <li><strong>Cookies and Similar Technologies:</strong> We use cookies and local storage to maintain session state, preferences, and improve user experience.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.3 Blockchain Data</h3>
          <p className="text-gray-300 mb-4">
            Transaction data recorded on public blockchains is publicly accessible and permanent. When using
            shielded transactions through SIP Protocol, sender, amount, and recipient information is encrypted
            and not publicly visible on the blockchain.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-300 mb-4">We use collected information for the following purposes:</p>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li><strong>Service Provision:</strong> To enable and facilitate your use of SIP Protocol services and execute transactions.</li>
            <li><strong>User Support:</strong> To respond to your inquiries, provide technical support, and troubleshoot issues.</li>
            <li><strong>Service Improvement:</strong> To analyze usage patterns, improve our services, develop new features, and enhance user experience.</li>
            <li><strong>Security:</strong> To detect, prevent, and respond to fraud, security incidents, and other harmful activities.</li>
            <li><strong>Compliance:</strong> To comply with legal obligations, enforce our terms, and protect our rights and those of our users.</li>
            <li><strong>Communications:</strong> To send service-related announcements, updates, and security alerts.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
          <p className="text-gray-300 mb-4">
            We do not sell, rent, or trade your personal information. We may share information in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li><strong>Service Providers:</strong> With third-party service providers who perform services on our behalf (e.g., hosting, analytics, customer support), under strict confidentiality obligations.</li>
            <li><strong>Blockchain Networks:</strong> Transaction data is broadcast to blockchain networks as necessary to execute your transactions. Shielded transactions encrypt sensitive information.</li>
            <li><strong>Legal Requirements:</strong> When required by law, legal process, or government request, or to protect rights, property, and safety.</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with notice to affected users.</li>
            <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
          <p className="text-gray-300 mb-4">Our services may integrate with or link to third-party services, including:</p>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li><strong>Wallet Providers:</strong> MetaMask, Phantom, and other cryptocurrency wallet providers.</li>
            <li><strong>Blockchain Networks:</strong> Ethereum, Solana, NEAR, and other blockchain networks.</li>
            <li><strong>Analytics Providers:</strong> Tools that help us understand usage patterns and improve our services.</li>
            <li><strong>RPC Providers:</strong> Node infrastructure providers that facilitate blockchain interactions.</li>
          </ul>
          <p className="text-gray-300 mb-4">
            These third parties have their own privacy policies. We are not responsible for their practices
            and encourage you to review their policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p className="text-gray-300 mb-4">
            We implement industry-standard security measures to protect your information from unauthorized
            access, disclosure, alteration, and destruction. These measures include:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Secure development practices</li>
          </ul>
          <p className="text-gray-300 mb-4">
            However, no method of transmission or storage is 100% secure. While we strive to protect your
            information, we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
          <p className="text-gray-300 mb-4">
            We retain information only as long as necessary to provide our services, comply with legal
            obligations, resolve disputes, and enforce agreements. Transaction data recorded on blockchains
            is permanent and cannot be deleted.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Your Rights and Choices</h2>
          <p className="text-gray-300 mb-4">Depending on your jurisdiction, you may have the following rights:</p>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li><strong>Access:</strong> Request access to personal information we hold about you.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information, subject to legal obligations.</li>
            <li><strong>Opt-Out:</strong> Opt out of certain data collection and processing activities.</li>
            <li><strong>Data Portability:</strong> Request a copy of your data in a portable format.</li>
          </ul>
          <p className="text-gray-300 mb-4">
            To exercise these rights, please contact us using the information provided in the Contact section.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Cookies and Tracking Technologies</h2>
          <p className="text-gray-300 mb-4">
            We use cookies and similar technologies to maintain session state, remember preferences, and
            analyze usage. You can control cookies through your browser settings, but disabling cookies
            may affect functionality.
          </p>
          <p className="text-gray-300 mb-4">Types of cookies we use:</p>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for basic functionality and security.</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our services.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Children&apos;s Privacy</h2>
          <p className="text-gray-300 mb-4">
            Our services are not directed to individuals under 18 years of age. We do not knowingly collect
            personal information from children. If we become aware that we have collected information from
            a child without parental consent, we will take steps to delete such information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. International Data Transfers</h2>
          <p className="text-gray-300 mb-4">
            Your information may be transferred to and processed in countries other than your country of
            residence. These countries may have different data protection laws. We take appropriate measures
            to ensure your information receives adequate protection.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
          <p className="text-gray-300 mb-4">
            We may update this Privacy Policy from time to time to reflect changes in our practices,
            technology, legal requirements, or other factors. We will notify you of material changes by
            posting the updated policy on our website with a new &ldquo;Last Updated&rdquo; date. Your continued use
            of our services after such changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
          <p className="text-gray-300 mb-4">
            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices,
            please contact us:
          </p>
          <ul className="list-none text-gray-300 mb-4 space-y-2">
            <li><strong>Website:</strong> <a href="https://sip-protocol.org" className="text-purple-400 hover:text-purple-300">https://sip-protocol.org</a></li>
            <li><strong>GitHub:</strong> <a href="https://github.com/sip-protocol" className="text-purple-400 hover:text-purple-300">https://github.com/sip-protocol</a></li>
            <li><strong>Documentation:</strong> <a href="https://docs.sip-protocol.org" className="text-purple-400 hover:text-purple-300">https://docs.sip-protocol.org</a></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Additional Information for Specific Jurisdictions</h2>

          <h3 className="text-xl font-semibold mb-3">14.1 European Economic Area (EEA) Users</h3>
          <p className="text-gray-300 mb-4">
            If you are located in the EEA, you have additional rights under the General Data Protection
            Regulation (GDPR), including the right to lodge a complaint with a supervisory authority.
          </p>

          <h3 className="text-xl font-semibold mb-3">14.2 California Users</h3>
          <p className="text-gray-300 mb-4">
            California residents have additional rights under the California Consumer Privacy Act (CCPA),
            including the right to know what personal information is collected, the right to delete personal
            information, and the right to opt-out of the sale of personal information (we do not sell
            personal information).
          </p>
        </section>
      </div>
    </div>
  )
}
