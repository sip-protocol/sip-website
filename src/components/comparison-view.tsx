'use client'

import { useState, useEffect } from 'react'
import { PrivacyLevel } from '@/types'

interface ComparisonViewProps {
  privacyLevel: PrivacyLevel
}

/**
 * Vulnerability Comparison View
 *
 * Shows "Before SIP" (vulnerable) vs "After SIP" (protected) side-by-side.
 * Demonstrates the refund address linkability vulnerability discovered by ZachXBT.
 */
export function ComparisonView({ privacyLevel }: ComparisonViewProps) {
  const isShielded = privacyLevel !== PrivacyLevel.TRANSPARENT
  const [animationStep, setAnimationStep] = useState(0)

  // Animate the fund flow
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* ZachXBT Attribution Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20">
            <AlertIcon className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="font-semibold text-amber-300">Real Vulnerability</p>
            <p className="mt-1 text-sm text-amber-400/80">
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
      <div className="grid gap-6 md:grid-cols-2">
        {/* BEFORE SIP (Vulnerable) */}
        <div className="rounded-2xl border-2 border-red-500/40 bg-gradient-to-b from-red-950/20 to-gray-900/50 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
              <CrossIcon className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-400">Before SIP</h3>
              <p className="text-sm text-red-400/70">Privacy Vulnerable</p>
            </div>
          </div>

          {/* Animated Transaction Flow */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Transaction Flow
            </p>

            {/* Sender */}
            <div
              className={`flex items-center justify-between rounded-lg bg-gray-800/50 p-3 transition-all duration-500 ${
                animationStep === 0 ? 'ring-2 ring-red-500/50' : ''
              }`}
            >
              <span className="text-sm text-gray-400">Sender</span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm text-red-400">0x742d...35Cc</code>
                <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-xs font-medium text-red-400">
                  EXPOSED
                </span>
              </div>
            </div>

            {/* Arrow down */}
            <div className="flex justify-center">
              <ArrowDown
                className={`h-6 w-6 transition-all duration-500 ${
                  animationStep === 1 ? 'text-red-400 scale-125' : 'text-gray-600'
                }`}
              />
            </div>

            {/* Shielded Pool */}
            <div
              className={`flex items-center justify-between rounded-lg bg-gray-800/50 p-3 transition-all duration-500 ${
                animationStep === 1 ? 'ring-2 ring-red-500/50' : ''
              }`}
            >
              <span className="text-sm text-gray-400">Shielded Pool</span>
              <span className="text-sm text-gray-500">
                (privacy should be here)
              </span>
            </div>

            {/* Arrow down */}
            <div className="flex justify-center">
              <ArrowDown
                className={`h-6 w-6 transition-all duration-500 ${
                  animationStep === 2 ? 'text-red-400 scale-125' : 'text-gray-600'
                }`}
              />
            </div>

            {/* Refund Address - THE PROBLEM */}
            <div
              className={`relative flex items-center justify-between rounded-lg border-2 border-dashed border-red-500/50 bg-red-950/30 p-3 transition-all duration-500 ${
                animationStep === 2 || animationStep === 3
                  ? 'ring-2 ring-red-500'
                  : ''
              }`}
            >
              <span className="text-sm text-gray-400">Refund</span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm text-red-400">0x742d...35Cc</code>
                <span className="animate-pulse rounded bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
                  SAME!
                </span>
              </div>
            </div>
          </div>

          {/* Linkage Visualization */}
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-950/20 p-4">
            <div className="mb-3 flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">
                Linkability Chain
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs">
              <span className="rounded bg-red-500/20 px-2 py-1 font-mono text-red-400">
                Sender
              </span>
              <span className="text-red-400">=</span>
              <span className="rounded bg-red-500/20 px-2 py-1 font-mono text-red-400">
                Refund
              </span>
              <span className="text-red-400">=</span>
              <span className="rounded bg-red-500/20 px-2 py-1 font-mono text-red-400">
                LINKED!
              </span>
            </div>
            <p className="mt-3 text-center text-xs text-red-400/70">
              Anyone can trace funds back to you
            </p>
          </div>

          {/* What's Exposed */}
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Chain Analysis Sees
            </p>
            <ul className="space-y-1.5 text-sm text-red-400">
              <li className="flex items-center gap-2">
                <CrossIcon className="h-3 w-3" />
                Your wallet address
              </li>
              <li className="flex items-center gap-2">
                <CrossIcon className="h-3 w-3" />
                Transaction amounts
              </li>
              <li className="flex items-center gap-2">
                <CrossIcon className="h-3 w-3" />
                Complete transaction history
              </li>
              <li className="flex items-center gap-2">
                <CrossIcon className="h-3 w-3" />
                Shielded pool activity linked
              </li>
            </ul>
          </div>
        </div>

        {/* AFTER SIP (Protected) */}
        <div
          className={`rounded-2xl border-2 p-6 transition-all duration-500 ${
            isShielded
              ? 'border-green-500/40 bg-gradient-to-b from-green-950/20 to-gray-900/50'
              : 'border-gray-700 bg-gray-900/50'
          }`}
        >
          <div className="mb-6 flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                isShielded ? 'bg-green-500/20' : 'bg-gray-700'
              }`}
            >
              <ShieldIcon
                className={`h-6 w-6 ${isShielded ? 'text-green-400' : 'text-gray-400'}`}
              />
            </div>
            <div>
              <h3
                className={`text-xl font-bold ${
                  isShielded ? 'text-green-400' : 'text-gray-400'
                }`}
              >
                After SIP
              </h3>
              <p
                className={`text-sm ${
                  isShielded ? 'text-green-400/70' : 'text-gray-500'
                }`}
              >
                {isShielded ? 'Privacy Protected' : 'Toggle to Shielded'}
              </p>
            </div>
          </div>

          {/* Transaction Flow */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Transaction Flow
            </p>

            {/* Sender */}
            <div
              className={`flex items-center justify-between rounded-lg bg-gray-800/50 p-3 transition-all duration-500 ${
                animationStep === 0 && isShielded ? 'ring-2 ring-green-500/50' : ''
              }`}
            >
              <span className="text-sm text-gray-400">Sender</span>
              <div className="flex items-center gap-2">
                {isShielded ? (
                  <>
                    <code className="font-mono text-sm text-green-400">
                      ••••••••••••
                    </code>
                    <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-xs font-medium text-green-400">
                      HIDDEN
                    </span>
                  </>
                ) : (
                  <>
                    <code className="font-mono text-sm text-gray-400">
                      0x742d...35Cc
                    </code>
                    <span className="rounded bg-gray-600 px-1.5 py-0.5 text-xs text-gray-300">
                      visible
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Arrow down */}
            <div className="flex justify-center">
              <ArrowDown
                className={`h-6 w-6 transition-all duration-500 ${
                  animationStep === 1 && isShielded
                    ? 'text-green-400 scale-125'
                    : 'text-gray-600'
                }`}
              />
            </div>

            {/* Shielded Pool */}
            <div
              className={`flex items-center justify-between rounded-lg p-3 transition-all duration-500 ${
                isShielded ? 'bg-green-950/30' : 'bg-gray-800/50'
              } ${animationStep === 1 && isShielded ? 'ring-2 ring-green-500/50' : ''}`}
            >
              <span className="text-sm text-gray-400">Shielded Pool</span>
              <span
                className={`text-sm ${isShielded ? 'text-green-400' : 'text-gray-500'}`}
              >
                {isShielded ? '(privacy enforced)' : '(privacy should be here)'}
              </span>
            </div>

            {/* Arrow down */}
            <div className="flex justify-center">
              <ArrowDown
                className={`h-6 w-6 transition-all duration-500 ${
                  animationStep === 2 && isShielded
                    ? 'text-green-400 scale-125'
                    : 'text-gray-600'
                }`}
              />
            </div>

            {/* Refund Address - THE FIX */}
            <div
              className={`flex items-center justify-between rounded-lg border-2 border-dashed p-3 transition-all duration-500 ${
                isShielded
                  ? 'border-green-500/50 bg-green-950/30'
                  : 'border-gray-600 bg-gray-800/50'
              } ${
                (animationStep === 2 || animationStep === 3) && isShielded
                  ? 'ring-2 ring-green-500'
                  : ''
              }`}
            >
              <span className="text-sm text-gray-400">Refund</span>
              <div className="flex items-center gap-2">
                {isShielded ? (
                  <>
                    <code className="font-mono text-sm text-green-400">
                      0x8f2a...9b1c
                    </code>
                    <span className="rounded bg-green-500 px-1.5 py-0.5 text-xs font-bold text-white">
                      NEW!
                    </span>
                  </>
                ) : (
                  <>
                    <code className="font-mono text-sm text-gray-400">
                      0x742d...35Cc
                    </code>
                    <span className="rounded bg-gray-600 px-1.5 py-0.5 text-xs text-gray-300">
                      same
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Unlinkability Visualization */}
          <div
            className={`mt-6 rounded-xl border p-4 transition-colors ${
              isShielded
                ? 'border-green-500/30 bg-green-950/20'
                : 'border-gray-700 bg-gray-800/30'
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <UnlinkIcon
                className={`h-4 w-4 ${isShielded ? 'text-green-400' : 'text-gray-500'}`}
              />
              <span
                className={`text-sm font-semibold ${
                  isShielded ? 'text-green-400' : 'text-gray-500'
                }`}
              >
                {isShielded ? 'No Linkability' : 'Linkable (transparent)'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs">
              <span
                className={`rounded px-2 py-1 font-mono ${
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
                className={`rounded px-2 py-1 font-mono ${
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
                className={`rounded px-2 py-1 font-mono ${
                  isShielded
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {isShielded ? 'SAFE' : 'LINKED'}
              </span>
            </div>
            <p
              className={`mt-3 text-center text-xs ${
                isShielded ? 'text-green-400/70' : 'text-gray-500'
              }`}
            >
              {isShielded
                ? 'Stealth address breaks the chain'
                : 'Enable shielded mode for protection'}
            </p>
          </div>

          {/* What's Protected */}
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Chain Analysis Sees
            </p>
            {isShielded ? (
              <ul className="space-y-1.5 text-sm text-green-400">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-3 w-3" />
                  Intent exists (not who created it)
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-3 w-3" />
                  Commitment (not actual amount)
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-3 w-3" />
                  Stealth address (not your wallet)
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-3 w-3" />
                  Nothing linkable
                </li>
              </ul>
            ) : (
              <ul className="space-y-1.5 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <CrossIcon className="h-3 w-3 text-gray-500" />
                  Everything (transparent mode)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-xs">Toggle to Shielded for privacy</span>
                </li>
              </ul>
            )}
          </div>

          {/* Compliant Mode Note */}
          {privacyLevel === PrivacyLevel.COMPLIANT && (
            <div className="mt-4 rounded-lg border border-blue-500/30 bg-blue-950/20 p-3">
              <p className="text-sm text-blue-300">
                <strong>Compliant Mode:</strong> Auditors with your viewing key can
                verify transactions, but public cannot link them.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Technical Summary */}
      <div className="rounded-xl border border-purple-500/30 bg-purple-950/10 p-6">
        <h4 className="mb-4 text-lg font-semibold text-purple-300">
          How SIP Fixes This
        </h4>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-gray-800/50 p-4">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
              <span className="text-sm font-bold text-purple-400">1</span>
            </div>
            <h5 className="font-medium text-gray-200">Stealth Addresses</h5>
            <p className="mt-1 text-xs text-gray-400">
              Each refund gets a unique, one-time address that cannot be linked to
              your wallet.
            </p>
          </div>
          <div className="rounded-lg bg-gray-800/50 p-4">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
              <span className="text-sm font-bold text-purple-400">2</span>
            </div>
            <h5 className="font-medium text-gray-200">Pedersen Commitments</h5>
            <p className="mt-1 text-xs text-gray-400">
              Amounts are hidden using cryptographic commitments - verifiable but
              not readable.
            </p>
          </div>
          <div className="rounded-lg bg-gray-800/50 p-4">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
              <span className="text-sm font-bold text-purple-400">3</span>
            </div>
            <h5 className="font-medium text-gray-200">Viewing Keys</h5>
            <p className="mt-1 text-xs text-gray-400">
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
