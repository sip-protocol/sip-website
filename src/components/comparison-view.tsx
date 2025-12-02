'use client'

import { PrivacyLevel } from '@/types'

interface ComparisonViewProps {
  privacyLevel: PrivacyLevel
}

/**
 * Vulnerability Comparison View
 *
 * Shows "Before SIP" (vulnerable) vs "After SIP" (protected) side-by-side.
 * Demonstrates the refund address linkability vulnerability discovered by ZachXBT.
 *
 * Animation is now pure CSS (GPU-accelerated) instead of React state updates.
 */
export function ComparisonView({ privacyLevel }: ComparisonViewProps) {
  const isShielded = privacyLevel !== PrivacyLevel.TRANSPARENT

  return (
    <div className="space-y-6">
      {/* ZachXBT Attribution Banner */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 sm:rounded-xl sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 sm:h-10 sm:w-10">
            <AlertIcon className="h-4 w-4 text-amber-400 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-amber-300 sm:text-base">Real Vulnerability</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-400/80 sm:text-sm">
              This refund address linkability issue was{' '}
              <a
                href="https://x.com/zachxbt/status/1980612190609576229"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-amber-300 underline underline-offset-2 hover:text-amber-200"
              >
                discovered by @ZachXBT
              </a>
              , exposing how transparent refund addresses can de-anonymize shielded
              pool users.
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* BEFORE SIP (Vulnerable) */}
        <div className="rounded-xl border-2 border-red-500/40 bg-gradient-to-b from-red-950/20 to-gray-900/50 p-4 sm:rounded-2xl sm:p-6">
          <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/20 sm:h-12 sm:w-12 sm:rounded-xl">
              <CrossIcon className="h-5 w-5 text-red-400 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-red-400 sm:text-xl">Before SIP</h3>
              <p className="text-xs text-red-400/70 sm:text-sm">Privacy Vulnerable</p>
            </div>
          </div>

          {/* Animated Transaction Flow */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Transaction Flow
            </p>

            {/* Sender - CSS animation step 0 (0s delay) */}
            <div className="animate-flow-sender flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-800/50 p-2.5 sm:p-3">
              <span className="text-xs text-gray-400 sm:text-sm">Sender</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <code className="font-mono text-xs text-red-400 sm:text-sm">0x742d...35Cc</code>
                <span className="flex items-center gap-1 rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-medium text-red-400 sm:text-xs">
                  <EyeOpenIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  EXPOSED
                </span>
              </div>
            </div>

            {/* Arrow down - CSS animation step 1 (1.5s delay) */}
            <div className="flex justify-center">
              <ArrowDown className="animate-flow-arrow1 h-5 w-5 text-gray-600 sm:h-6 sm:w-6" />
            </div>

            {/* Shielded Pool - CSS animation step 1 (1.5s delay) */}
            <div className="animate-flow-pool flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-800/50 p-2.5 sm:p-3">
              <span className="text-xs text-gray-400 sm:text-sm">Shielded Pool</span>
              <span className="text-xs text-gray-500 sm:text-sm">
                (privacy should be here)
              </span>
            </div>

            {/* Arrow down - CSS animation step 2 (3s delay) */}
            <div className="flex justify-center">
              <ArrowDown className="animate-flow-arrow2 h-5 w-5 text-gray-600 sm:h-6 sm:w-6" />
            </div>

            {/* Refund Address - THE PROBLEM - CSS animation step 2-3 (3s delay) */}
            <div className="animate-flow-refund relative flex flex-wrap items-center justify-between gap-2 rounded-lg border-2 border-dashed border-red-500/50 bg-red-950/30 p-2.5 sm:p-3">
              <span className="text-xs text-gray-400 sm:text-sm">Refund</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <code className="font-mono text-xs text-red-400 sm:text-sm">0x742d...35Cc</code>
                <span className="flex items-center gap-1 animate-pulse rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white sm:text-xs">
                  <LinkIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  SAME!
                </span>
              </div>
            </div>
          </div>

          {/* Linkage Visualization */}
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-950/20 p-3 sm:mt-6 sm:rounded-xl sm:p-4">
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <LinkIcon className="h-3.5 w-3.5 text-red-400 sm:h-4 sm:w-4" />
              <span className="text-xs font-semibold text-red-400 sm:text-sm">
                Linkability Chain
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] sm:gap-2 sm:text-xs">
              <span className="rounded bg-red-500/20 px-1.5 py-0.5 font-mono text-red-400 sm:px-2 sm:py-1">
                Sender
              </span>
              <span className="text-red-400">=</span>
              <span className="rounded bg-red-500/20 px-1.5 py-0.5 font-mono text-red-400 sm:px-2 sm:py-1">
                Refund
              </span>
              <span className="text-red-400">=</span>
              <span className="rounded bg-red-500/20 px-1.5 py-0.5 font-mono text-red-400 sm:px-2 sm:py-1">
                LINKED!
              </span>
            </div>
            <p className="mt-2 text-center text-[10px] text-red-400/70 sm:mt-3 sm:text-xs">
              Anyone can trace funds back to you
            </p>
          </div>

          {/* What's Exposed */}
          <div className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">
              Chain Analysis Sees
            </p>
            <ul className="space-y-1 text-xs text-red-400 sm:space-y-1.5 sm:text-sm">
              <li className="flex items-center gap-1.5 sm:gap-2">
                <CrossIcon className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                <span>Your wallet address</span>
              </li>
              <li className="flex items-center gap-1.5 sm:gap-2">
                <CrossIcon className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                <span>Transaction amounts</span>
              </li>
              <li className="flex items-center gap-1.5 sm:gap-2">
                <CrossIcon className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                <span>Complete transaction history</span>
              </li>
              <li className="flex items-center gap-1.5 sm:gap-2">
                <CrossIcon className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                <span>Shielded pool activity linked</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile divider between Before and After */}
        <div className="flex items-center justify-center py-2 lg:hidden">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          <span className="px-4 text-xs text-gray-500">VS</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        </div>

        {/* AFTER SIP (Protected) */}
        <div
          className={`rounded-xl border-2 p-4 transition-all duration-500 sm:rounded-2xl sm:p-6 ${
            isShielded
              ? 'border-green-500/40 bg-gradient-to-b from-green-950/20 to-gray-900/50'
              : 'border-gray-700 bg-gray-900/50'
          }`}
        >
          <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors sm:h-12 sm:w-12 sm:rounded-xl ${
                isShielded ? 'bg-green-500/20' : 'bg-gray-700'
              }`}
            >
              <ShieldIcon
                className={`h-5 w-5 sm:h-6 sm:w-6 ${isShielded ? 'text-green-400' : 'text-gray-400'}`}
              />
            </div>
            <div className="min-w-0">
              <h3
                className={`text-lg font-bold sm:text-xl ${
                  isShielded ? 'text-green-400' : 'text-gray-400'
                }`}
              >
                After SIP
              </h3>
              <p
                className={`text-xs sm:text-sm ${
                  isShielded ? 'text-green-400/70' : 'text-gray-500'
                }`}
              >
                {isShielded ? 'Privacy Protected' : 'Toggle to Shielded'}
              </p>
            </div>
          </div>

          {/* Transaction Flow */}
          <div className="space-y-2 sm:space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Transaction Flow
            </p>

            {/* Sender - CSS animation (shielded uses green, transparent no animation) */}
            <div
              className={`flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-800/50 p-2.5 sm:p-3 ${
                isShielded ? 'animate-flow-sender-green' : ''
              }`}
            >
              <span className="text-xs text-gray-400 sm:text-sm">Sender</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {isShielded ? (
                  <>
                    <code className="font-mono text-xs text-green-400 sm:text-sm">
                      ••••••••••••
                    </code>
                    <span className="flex items-center gap-1 rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] font-medium text-green-400 sm:text-xs">
                      <EyeClosedIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      HIDDEN
                    </span>
                  </>
                ) : (
                  <>
                    <code className="font-mono text-xs text-gray-400 sm:text-sm">
                      0x742d...35Cc
                    </code>
                    <span className="rounded bg-gray-600 px-1.5 py-0.5 text-[10px] text-gray-300 sm:text-xs">
                      visible
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Arrow down - CSS animation */}
            <div className="flex justify-center">
              <ArrowDown
                className={`h-5 w-5 sm:h-6 sm:w-6 ${
                  isShielded ? 'animate-flow-arrow1-green text-gray-600' : 'text-gray-600'
                }`}
              />
            </div>

            {/* Shielded Pool - CSS animation */}
            <div
              className={`flex flex-wrap items-center justify-between gap-2 rounded-lg p-2.5 sm:p-3 ${
                isShielded ? 'bg-green-950/30 animate-flow-pool-green' : 'bg-gray-800/50'
              }`}
            >
              <span className="text-xs text-gray-400 sm:text-sm">Shielded Pool</span>
              <span
                className={`text-xs sm:text-sm ${isShielded ? 'text-green-400' : 'text-gray-500'}`}
              >
                {isShielded ? '(privacy enforced)' : '(privacy should be here)'}
              </span>
            </div>

            {/* Arrow down - CSS animation */}
            <div className="flex justify-center">
              <ArrowDown
                className={`h-5 w-5 sm:h-6 sm:w-6 ${
                  isShielded ? 'animate-flow-arrow2-green text-gray-600' : 'text-gray-600'
                }`}
              />
            </div>

            {/* Refund Address - THE FIX - CSS animation */}
            <div
              className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border-2 border-dashed p-2.5 sm:p-3 ${
                isShielded
                  ? 'border-green-500/50 bg-green-950/30 animate-flow-refund-green'
                  : 'border-gray-600 bg-gray-800/50'
              }`}
            >
              <span className="text-xs text-gray-400 sm:text-sm">Refund</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {isShielded ? (
                  <>
                    <code className="font-mono text-xs text-green-400 sm:text-sm">
                      0x8f2a...9b1c
                    </code>
                    <span className="flex items-center gap-1 rounded bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-white sm:text-xs">
                      <UnlinkIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      NEW!
                    </span>
                  </>
                ) : (
                  <>
                    <code className="font-mono text-xs text-gray-400 sm:text-sm">
                      0x742d...35Cc
                    </code>
                    <span className="rounded bg-gray-600 px-1.5 py-0.5 text-[10px] text-gray-300 sm:text-xs">
                      same
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Unlinkability Visualization */}
          <div
            className={`mt-4 rounded-lg border p-3 transition-colors sm:mt-6 sm:rounded-xl sm:p-4 ${
              isShielded
                ? 'border-green-500/30 bg-green-950/20'
                : 'border-gray-700 bg-gray-800/30'
            }`}
          >
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <UnlinkIcon
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isShielded ? 'text-green-400' : 'text-gray-500'}`}
              />
              <span
                className={`text-xs font-semibold sm:text-sm ${
                  isShielded ? 'text-green-400' : 'text-gray-500'
                }`}
              >
                {isShielded ? 'No Linkability' : 'Linkable (transparent)'}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] sm:gap-2 sm:text-xs">
              <span
                className={`rounded px-1.5 py-0.5 font-mono sm:px-2 sm:py-1 ${
                  isShielded
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                Sender
              </span>
              <span className={isShielded ? 'text-green-400' : 'text-gray-500'}>
                {isShielded ? '≠' : '='}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 font-mono sm:px-2 sm:py-1 ${
                  isShielded
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                Refund
              </span>
              <span className={isShielded ? 'text-green-400' : 'text-gray-500'}>
                =
              </span>
              <span
                className={`rounded px-1.5 py-0.5 font-mono sm:px-2 sm:py-1 ${
                  isShielded
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {isShielded ? 'SAFE' : 'LINKED'}
              </span>
            </div>
            <p
              className={`mt-2 text-center text-[10px] sm:mt-3 sm:text-xs ${
                isShielded ? 'text-green-400/70' : 'text-gray-500'
              }`}
            >
              {isShielded
                ? 'Stealth address breaks the chain'
                : 'Enable shielded mode for protection'}
            </p>
          </div>

          {/* What's Protected */}
          <div className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">
              Chain Analysis Sees
            </p>
            {isShielded ? (
              <ul className="space-y-1 text-xs text-green-400 sm:space-y-1.5 sm:text-sm">
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <CheckIcon className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                  <span>Intent exists (not who created it)</span>
                </li>
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <CheckIcon className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                  <span>Commitment (not actual amount)</span>
                </li>
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <CheckIcon className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                  <span>Stealth address (not your wallet)</span>
                </li>
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <CheckIcon className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                  <span>Nothing linkable</span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-1 text-xs text-gray-400 sm:space-y-1.5 sm:text-sm">
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <CrossIcon className="h-2.5 w-2.5 flex-shrink-0 text-gray-500 sm:h-3 sm:w-3" />
                  <span>Everything (transparent mode)</span>
                </li>
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-xs">Toggle to Shielded for privacy</span>
                </li>
              </ul>
            )}
          </div>

          {/* Compliant Mode Note */}
          {privacyLevel === PrivacyLevel.COMPLIANT && (
            <div className="mt-3 rounded-lg border border-blue-500/30 bg-blue-950/20 p-2.5 sm:mt-4 sm:p-3">
              <p className="text-xs text-blue-300 sm:text-sm">
                <strong>Compliant Mode:</strong> Auditors with your viewing key can
                verify transactions, but public cannot link them.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Technical Summary */}
      <div className="rounded-lg border border-purple-500/30 bg-purple-950/10 p-4 sm:rounded-xl sm:p-6">
        <h4 className="mb-3 text-base font-semibold text-purple-300 sm:mb-4 sm:text-lg">
          How SIP Fixes This
        </h4>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-gray-800/50 p-3 sm:p-4">
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 sm:h-8 sm:w-8">
              <span className="text-xs font-bold text-purple-400 sm:text-sm">1</span>
            </div>
            <h5 className="text-sm font-medium text-gray-200 sm:text-base">Stealth Addresses</h5>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-400 sm:text-xs">
              Each refund gets a unique, one-time address that cannot be linked to
              your wallet.
            </p>
          </div>
          <div className="rounded-lg bg-gray-800/50 p-3 sm:p-4">
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 sm:h-8 sm:w-8">
              <span className="text-xs font-bold text-purple-400 sm:text-sm">2</span>
            </div>
            <h5 className="text-sm font-medium text-gray-200 sm:text-base">Pedersen Commitments</h5>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-400 sm:text-xs">
              Amounts are hidden using cryptographic commitments - verifiable but
              not readable.
            </p>
          </div>
          <div className="rounded-lg bg-gray-800/50 p-3 sm:col-span-2 sm:p-4 lg:col-span-1">
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 sm:h-8 sm:w-8">
              <span className="text-xs font-bold text-purple-400 sm:text-sm">3</span>
            </div>
            <h5 className="text-sm font-medium text-gray-200 sm:text-base">Viewing Keys</h5>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-400 sm:text-xs">
              Optional selective disclosure for compliance - privacy with
              auditability when needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Icons

function AlertIcon({ className }: { className?: string }) {
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
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  )
}

function CrossIcon({ className }: { className?: string }) {
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
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

function ArrowDown({ className }: { className?: string }) {
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
        d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
      />
    </svg>
  )
}

function LinkIcon({ className }: { className?: string }) {
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
        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
      />
    </svg>
  )
}

function UnlinkIcon({ className }: { className?: string }) {
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
        d="M13.181 8.68a4.503 4.503 0 011.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 006.364 6.365l3.129-3.129m5.614-5.615l1.757-1.757a4.5 4.5 0 00-6.364-6.365l-4.5 4.5c-.258.26-.479.541-.661.84m1.903 6.405a4.495 4.495 0 01-1.242-.88 4.483 4.483 0 01-1.062-1.683m6.587 2.345l5.907 5.907m-5.907-5.907L8.898 8.898M2.991 2.99l6.364 6.364"
      />
    </svg>
  )
}

function EyeOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function EyeClosedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  )
}
