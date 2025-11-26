'use client'

import { PrivacyLevel } from '@sip-protocol/types'

interface ComparisonViewProps {
  privacyLevel: PrivacyLevel
}

export function ComparisonView({ privacyLevel }: ComparisonViewProps) {
  const isShielded = privacyLevel !== PrivacyLevel.TRANSPARENT

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Current System (Vulnerable) */}
      <div className="card border-red-500/30">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
            <WarningIcon className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-red-400">Current System</h3>
            <p className="text-xs text-gray-500">ZachXBT Vulnerability</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Transaction visualization */}
          <div className="rounded-lg bg-gray-800/50 p-4">
            <p className="mb-3 text-sm font-medium text-gray-300">
              Transaction Flow
            </p>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">From:</span>
                <span className="text-red-400">0x1234...5678</span>
                <span className="rounded bg-red-500/20 px-1 text-red-400">
                  VISIBLE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Amount:</span>
                <span className="text-red-400">10 SOL</span>
                <span className="rounded bg-red-500/20 px-1 text-red-400">
                  VISIBLE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">To:</span>
                <span className="text-red-400">0xabcd...efgh</span>
                <span className="rounded bg-red-500/20 px-1 text-red-400">
                  VISIBLE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Refund:</span>
                <span className="text-red-400">t1XYZ...789</span>
                <span className="rounded bg-red-500/20 px-1 text-red-400">
                  REUSED!
                </span>
              </div>
            </div>
          </div>

          {/* Problem explanation */}
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
            <p className="text-sm text-red-300">
              <strong>Problem:</strong> The same transparent address is reused
              for all refunds, linking shielded funds to public transactions.
            </p>
          </div>

          {/* Chain analysis */}
          <div className="rounded-lg bg-gray-800/50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-300">
              Chain Analysis Can See:
            </p>
            <ul className="space-y-1 text-sm text-red-400">
              <li>• Your wallet address</li>
              <li>• All transaction amounts</li>
              <li>• Complete transaction history</li>
              <li>• Linked shielded pool activity</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SIP System (Fixed) */}
      <div
        className={`card ${
          isShielded ? 'border-green-500/30' : 'border-gray-700'
        }`}
      >
        <div className="mb-4 flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              isShielded ? 'bg-green-500/20' : 'bg-gray-700'
            }`}
          >
            <ShieldIcon
              className={`h-5 w-5 ${
                isShielded ? 'text-green-400' : 'text-gray-400'
              }`}
            />
          </div>
          <div>
            <h3
              className={`font-semibold ${
                isShielded ? 'text-green-400' : 'text-gray-400'
              }`}
            >
              With SIP Protocol
            </h3>
            <p className="text-xs text-gray-500">
              {isShielded ? 'Privacy Protected' : 'Toggle to Shielded mode'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Transaction visualization */}
          <div className="rounded-lg bg-gray-800/50 p-4">
            <p className="mb-3 text-sm font-medium text-gray-300">
              Transaction Flow
            </p>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">From:</span>
                {isShielded ? (
                  <>
                    <span className="text-green-400">••••••••••••</span>
                    <span className="rounded bg-green-500/20 px-1 text-green-400">
                      HIDDEN
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400">0x1234...5678</span>
                    <span className="rounded bg-gray-600 px-1 text-gray-300">
                      visible
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Amount:</span>
                {isShielded ? (
                  <>
                    <span className="text-green-400">commitment</span>
                    <span className="rounded bg-green-500/20 px-1 text-green-400">
                      HIDDEN
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400">10 SOL</span>
                    <span className="rounded bg-gray-600 px-1 text-gray-300">
                      visible
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">To:</span>
                {isShielded ? (
                  <>
                    <span className="text-green-400">stealth_addr</span>
                    <span className="rounded bg-green-500/20 px-1 text-green-400">
                      UNIQUE
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400">0xabcd...efgh</span>
                    <span className="rounded bg-gray-600 px-1 text-gray-300">
                      visible
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Refund:</span>
                {isShielded ? (
                  <>
                    <span className="text-green-400">new_stealth</span>
                    <span className="rounded bg-green-500/20 px-1 text-green-400">
                      FRESH
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400">t1XYZ...789</span>
                    <span className="rounded bg-gray-600 px-1 text-gray-300">
                      visible
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Solution explanation */}
          <div
            className={`rounded-lg border p-3 ${
              isShielded
                ? 'border-green-500/20 bg-green-500/5'
                : 'border-gray-700 bg-gray-800/30'
            }`}
          >
            <p
              className={`text-sm ${
                isShielded ? 'text-green-300' : 'text-gray-400'
              }`}
            >
              <strong>Solution:</strong> Each transaction uses a unique stealth
              address. No address reuse, no linkability.
            </p>
          </div>

          {/* Chain analysis blocked */}
          <div className="rounded-lg bg-gray-800/50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-300">
              Chain Analysis Can See:
            </p>
            {isShielded ? (
              <ul className="space-y-1 text-sm text-green-400">
                <li>• Intent exists (not who created it)</li>
                <li>• Output requirements (not input amounts)</li>
                <li>• Nothing else - cryptographically enforced</li>
              </ul>
            ) : (
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Everything (transparent mode)</li>
                <li>• Toggle to Shielded for privacy</li>
              </ul>
            )}
          </div>

          {/* Viewing key note */}
          {privacyLevel === PrivacyLevel.COMPLIANT && (
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
              <p className="text-sm text-blue-300">
                <strong>Compliant Mode:</strong> Auditors with your viewing key
                can verify transactions, but public cannot see them.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  )
}
