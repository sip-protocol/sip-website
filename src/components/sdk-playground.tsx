'use client'

import { useState, useCallback } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

/**
 * SDK Playground Component
 *
 * Interactive code playground showing real SDK examples.
 * Engineers can run code directly via StackBlitz.
 *
 * @see https://github.com/sip-protocol/sip-website/issues/88
 */

interface CodeExample {
  id: string
  title: string
  description: string
  code: string
}

const CODE_EXAMPLES: CodeExample[] = [
  {
    id: 'stealth',
    title: 'Stealth Addresses',
    description: 'Generate one-time addresses that prevent transaction linkability',
    code: `import {
  generateStealthMetaAddress,
  generateStealthAddress,
  deriveStealthPrivateKey,
  checkStealthAddress
} from '@sip-protocol/sdk'

// Step 1: Recipient generates their meta-address (do once, share publicly)
const meta = generateStealthMetaAddress()
console.log('Meta-address (share this):', {
  spendingKey: meta.spendingKey.slice(0, 20) + '...',
  viewingKey: meta.viewingKey.slice(0, 20) + '...'
})

// Step 2: Sender creates a one-time stealth address
const stealth = generateStealthAddress(meta.spendingKey, meta.viewingKey)
console.log('Stealth address:', stealth.address.slice(0, 20) + '...')
console.log('Ephemeral public key:', stealth.ephemeralPublicKey.slice(0, 20) + '...')

// Step 3: Recipient checks if address belongs to them
const isForMe = checkStealthAddress(
  stealth.address,
  stealth.ephemeralPublicKey,
  meta.viewingKey,
  meta.spendingKey
)
console.log('Address belongs to recipient:', isForMe)

// Step 4: Recipient derives private key to spend
if (isForMe) {
  const privateKey = deriveStealthPrivateKey(
    stealth.ephemeralPublicKey,
    meta.viewingPrivateKey!,
    meta.spendingPrivateKey!
  )
  console.log('Can spend from stealth address!')
}`,
  },
  {
    id: 'commitment',
    title: 'Pedersen Commitments',
    description: 'Hide amounts while maintaining cryptographic verifiability',
    code: `import {
  commit,
  verifyOpening,
  addCommitments,
  generateBlinding
} from '@sip-protocol/sdk'

// Create a commitment to hide an amount
const amount = 1000n // 1000 tokens
const blinding = generateBlinding()

const commitment = commit(amount, blinding)
console.log('Commitment:', commitment.point.slice(0, 30) + '...')

// Commitment reveals nothing about the amount!
// But we can prove we know the opening:
const isValid = verifyOpening(commitment, amount, blinding)
console.log('Opening verified:', isValid) // true

// Homomorphic property: commitments can be added
const amount2 = 500n
const blinding2 = generateBlinding()
const commitment2 = commit(amount2, blinding2)

// C(1000) + C(500) = C(1500)
const sumCommitment = addCommitments(commitment, commitment2)
console.log('Sum commitment:', sumCommitment.point.slice(0, 30) + '...')

// Verify the sum (blindings also add)
const sumBlinding = (blinding + blinding2) % 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141n
const sumValid = verifyOpening(sumCommitment, 1500n, sumBlinding)
console.log('Sum verified:', sumValid) // true`,
  },
  {
    id: 'viewing-key',
    title: 'Viewing Keys',
    description: 'Selective disclosure for compliance - you control who sees what',
    code: `import {
  generateViewingKey,
  encryptForViewing,
  decryptWithViewing,
  PrivacyLevel
} from '@sip-protocol/sdk'

// Generate a viewing key for selective disclosure
const viewingKey = generateViewingKey()
console.log('Viewing Key (share with auditor):')
console.log('  Public:', viewingKey.publicKey.slice(0, 30) + '...')

// Encrypt transaction data for the viewer
const transactionData = {
  sender: '0x1234...sender',
  recipient: '0x5678...recipient',
  amount: '1000',
  timestamp: Date.now()
}

const encrypted = encryptForViewing(
  viewingKey.publicKey,
  JSON.stringify(transactionData)
)
console.log('Encrypted:', encrypted.slice(0, 40) + '...')

// Only the viewing key holder can decrypt
const decrypted = decryptWithViewing(viewingKey.privateKey, encrypted)
const revealed = JSON.parse(decrypted)
console.log('Decrypted by auditor:', revealed)

// Privacy level determines what's encrypted
console.log('\\nPrivacy Levels:')
console.log('  TRANSPARENT - Nothing hidden (for testing)')
console.log('  SHIELDED - Full privacy (sender, amount, recipient hidden)')
console.log('  COMPLIANT - Privacy + viewing key for auditors')`,
  },
  {
    id: 'intent',
    title: 'Create Shielded Intent',
    description: 'Build a privacy-preserving cross-chain swap intent',
    code: `import {
  SIP,
  IntentBuilder,
  PrivacyLevel
} from '@sip-protocol/sdk'

// Initialize the SIP client
const sip = new SIP({
  network: 'testnet',
  mode: 'demo'
})

// Build a shielded intent using the fluent builder
const intent = new IntentBuilder()
  .from({
    chain: 'solana',
    token: 'SOL',
    amount: 10n * 10n ** 9n  // 10 SOL
  })
  .to({
    chain: 'ethereum',
    token: 'ETH'
  })
  .withPrivacy(PrivacyLevel.SHIELDED)
  .withSlippage(0.5) // 0.5% slippage tolerance
  .withExpiry(30 * 60 * 1000) // 30 minutes
  .build()

console.log('Shielded Intent Created:')
console.log('  ID:', intent.id.slice(0, 20) + '...')
console.log('  Privacy:', intent.privacy)
console.log('  From:', intent.input.chain, intent.input.token)
console.log('  To:', intent.output.chain, intent.output.token)

// The commitment hides the actual amount
console.log('  Amount Commitment:', intent.inputCommitment?.value.slice(0, 20) + '...')
console.log('  (Actual amount is hidden from observers)')

// Get quotes from solvers
const quotes = await sip.getQuotes(intent)
console.log('\\nReceived', quotes.length, 'quotes from solvers')`,
  },
]

// Generate StackBlitz URL with the code pre-loaded
function generateStackBlitzUrl(code: string): string {
  const files = {
    'index.ts': code,
    'package.json': JSON.stringify({
      name: 'sip-playground',
      version: '1.0.0',
      dependencies: {
        '@sip-protocol/sdk': '^0.2.2',
      },
      scripts: {
        start: 'npx tsx index.ts',
      },
    }, null, 2),
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        moduleResolution: 'node',
        esModuleInterop: true,
        strict: true,
      },
    }, null, 2),
  }

  const project = {
    files,
    title: 'SIP Protocol Playground',
    description: 'Interactive SDK examples',
    template: 'node',
    settings: {
      compile: { trigger: 'auto' },
    },
  }

  // Encode project for URL
  const encoded = btoa(JSON.stringify(project))
  return `https://stackblitz.com/run?project=${encodeURIComponent(encoded)}`
}

// Copy to clipboard with feedback
function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  return { copied, copy }
}

export function SDKPlayground() {
  const [activeTab, setActiveTab] = useState(CODE_EXAMPLES[0].id)
  const { copied, copy } = useCopyToClipboard()
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string | null>(null)

  const activeExample = CODE_EXAMPLES.find((e) => e.id === activeTab)!

  // Generate StackBlitz embed URL
  const stackBlitzUrl = `https://stackblitz.com/fork/node?file=index.ts&terminal=dev`

  // Open in StackBlitz with code
  const openInStackBlitz = () => {
    // Create a form to POST to StackBlitz
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = 'https://stackblitz.com/run'
    form.target = '_blank'

    const projectInput = document.createElement('input')
    projectInput.type = 'hidden'
    projectInput.name = 'project[files][index.ts]'
    projectInput.value = activeExample.code

    const pkgInput = document.createElement('input')
    pkgInput.type = 'hidden'
    pkgInput.name = 'project[files][package.json]'
    pkgInput.value = JSON.stringify({
      name: 'sip-playground',
      version: '1.0.0',
      type: 'module',
      dependencies: {
        '@sip-protocol/sdk': '^0.2.2',
      },
      devDependencies: {
        tsx: '^4.0.0',
        typescript: '^5.0.0',
      },
      scripts: {
        dev: 'tsx watch index.ts',
        start: 'tsx index.ts',
      },
    }, null, 2)

    const titleInput = document.createElement('input')
    titleInput.type = 'hidden'
    titleInput.name = 'project[title]'
    titleInput.value = `SIP SDK - ${activeExample.title}`

    const templateInput = document.createElement('input')
    templateInput.type = 'hidden'
    templateInput.name = 'project[template]'
    templateInput.value = 'node'

    form.appendChild(projectInput)
    form.appendChild(pkgInput)
    form.appendChild(titleInput)
    form.appendChild(templateInput)

    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-gray-900/80 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-sm font-mono text-gray-400">SDK Playground</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">@sip-protocol/sdk@0.2.2</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-800 bg-gray-900/50">
        {CODE_EXAMPLES.map((example) => (
          <button
            key={example.id}
            onClick={() => setActiveTab(example.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === example.id
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            {example.title}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="px-6 py-3 bg-purple-500/5 border-b border-gray-800">
        <p className="text-sm text-gray-300">{activeExample.description}</p>
      </div>

      {/* Code */}
      <div className="relative">
        <SyntaxHighlighter
          language="typescript"
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontSize: '0.875rem',
            maxHeight: '400px',
            overflow: 'auto',
          }}
          showLineNumbers
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1em',
            color: '#4b5563',
          }}
        >
          {activeExample.code}
        </SyntaxHighlighter>

        {/* Copy button */}
        <button
          onClick={() => copy(activeExample.code)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-400" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-800 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={openInStackBlitz}
          className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
        >
          <StackBlitzIcon className="h-4 w-4" />
          Run in StackBlitz
        </button>
        <a
          href="https://docs.sip-protocol.org/sdk"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-300 border border-gray-700 rounded-lg hover:border-gray-500 hover:text-white transition-colors text-center"
        >
          View Full Documentation
        </a>
        <div className="hidden sm:flex items-center gap-2 ml-auto text-xs text-gray-500">
          <span>Try it:</span>
          <code className="px-2 py-1 rounded bg-gray-800 font-mono">
            npm install @sip-protocol/sdk
          </code>
        </div>
      </div>
    </div>
  )
}

// Icons
function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function StackBlitzIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="currentColor">
      <path d="M12.747 16.273h-7.46L18.925 1.5l-3.671 10.227h7.46L9.075 26.5l3.672-10.227z" />
    </svg>
  )
}

export default SDKPlayground
