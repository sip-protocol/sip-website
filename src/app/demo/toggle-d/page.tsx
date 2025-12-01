'use client'

import { useState } from 'react'
import Link from 'next/link'

type SwapMode = 'preview' | 'execute'

export default function ToggleDPage() {
  const [mode, setMode] = useState<SwapMode>('preview')

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/demo" className="text-sm text-gray-400 hover:text-white mb-4 inline-block">
            ← Back to Demo
          </Link>
          <h1 className="text-2xl font-bold">Toggle D: Inline Badge</h1>
          <p className="text-gray-400 mt-2">Small badge next to swap button • ~80% smaller</p>
          <div className="mt-4 inline-flex gap-2 text-sm">
            <Link href="/demo/toggle-a" className="text-purple-400 hover:text-purple-300">A</Link>
            <Link href="/demo/toggle-b" className="text-purple-400 hover:text-purple-300">B</Link>
            <Link href="/demo/toggle-c" className="text-purple-400 hover:text-purple-300">C</Link>
            <Link href="/demo/toggle-e" className="text-purple-400 hover:text-purple-300">E</Link>
          </div>
        </div>

        {/* Demo Card */}
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            {/* Header - NO toggle here */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Swap</h3>
              <div className="rounded-full bg-purple-600/20 px-3 py-1 text-xs font-medium text-purple-400">
                Shielded
              </div>
            </div>

            {/* Mock Swap UI */}
            <div className="mb-2 rounded-xl bg-gray-800/50 p-4">
              <div className="mb-2 text-sm text-gray-400">From</div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-medium text-gray-500">0.0</span>
                <div className="rounded-xl bg-gray-700/50 px-3 py-2 text-sm">ETH</div>
              </div>
            </div>
            <div className="mb-6 rounded-xl bg-gray-800/50 p-4">
              <div className="mb-2 text-sm text-gray-400">To</div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-medium text-gray-500">0.0</span>
                <div className="rounded-xl bg-gray-700/50 px-3 py-2 text-sm">SOL</div>
              </div>
            </div>

            {/* TOGGLE D: Inline badge next to swap button */}
            <div className="flex items-center gap-2">
              <button className="flex-1 rounded-xl bg-purple-600 py-4 text-white font-semibold hover:bg-purple-700 transition-colors">
                Shielded Swap
              </button>
              <button
                onClick={() => setMode(mode === 'preview' ? 'execute' : 'preview')}
                className={`rounded-xl px-3 py-4 text-xs font-medium transition-all flex items-center gap-1 ${
                  mode === 'preview'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                }`}
              >
                {mode === 'preview' ? <EyeIcon className="h-4 w-4" /> : <BoltIcon className="h-4 w-4" />}
              </button>
            </div>

            {/* Mode indicator below */}
            <p className={`mt-2 text-center text-xs ${
              mode === 'preview' ? 'text-amber-400' : 'text-green-400'
            }`}>
              {mode === 'preview' ? 'Preview mode' : 'Execute mode'}
            </p>
          </div>
        </div>

        {/* Comparison */}
        <div className="mt-12 mx-auto max-w-2xl">
          <h2 className="text-lg font-semibold mb-4 text-center">Size Comparison</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <p className="text-xs text-gray-500 mb-2">Current (bulky)</p>
              <CurrentToggle mode={mode} setMode={setMode} />
            </div>
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
              <p className="text-xs text-purple-400 mb-2">Option D (compact)</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-xl bg-purple-600 py-2 px-4 text-white text-sm font-medium text-center">
                  Swap
                </div>
                <button className={`rounded-lg p-2 ${
                  mode === 'preview'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}>
                  {mode === 'preview' ? <EyeIcon className="h-4 w-4" /> : <BoltIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CurrentToggle({ mode, setMode }: { mode: SwapMode; setMode: (m: SwapMode) => void }) {
  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="inline-flex rounded-xl border border-gray-700 bg-gray-900 p-1">
        <button
          onClick={() => setMode('preview')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            mode === 'preview' ? 'bg-amber-600 text-white' : 'text-gray-400'
          }`}
        >
          <span className="flex items-center gap-2">
            <EyeIcon className="h-4 w-4" />
            Preview
          </span>
        </button>
        <button
          onClick={() => setMode('execute')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            mode === 'execute' ? 'bg-green-600 text-white' : 'text-gray-400'
          }`}
        >
          <span className="flex items-center gap-2">
            <BoltIcon className="h-4 w-4" />
            Execute
          </span>
        </button>
      </div>
      <p className="text-sm text-gray-400">
        {mode === 'preview' ? 'Dry-run mode - explore quotes without executing' : 'Live mode - real swaps with your wallet'}
      </p>
    </div>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  )
}
