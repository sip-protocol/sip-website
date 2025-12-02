'use client'

import { useState, useEffect } from 'react'
import type { SwapStatus } from '@/hooks'

export interface TimelineStep {
  id: string
  title: string
  description: string
  action?: {
    label: string
    onClick?: () => void
  }
}

interface TransactionTimelineProps {
  status: SwapStatus
  isShielded: boolean
  isProduction: boolean
  startTime?: number
  onActionClick?: (stepId: string) => void
}

/**
 * Step definitions for different swap flows
 */
const DEMO_STEPS: TimelineStep[] = [
  {
    id: 'quote',
    title: 'Quote received',
    description: 'Best rate found for your swap',
  },
  {
    id: 'confirm',
    title: 'Confirm in wallet',
    description: 'Approve the transaction in your wallet',
    action: { label: 'Open wallet' },
  },
  {
    id: 'sign',
    title: 'Signing transaction',
    description: 'Creating your intent...',
  },
  {
    id: 'submit',
    title: 'Submitting',
    description: 'Broadcasting to the network...',
  },
  {
    id: 'complete',
    title: 'Complete!',
    description: 'Swap executed successfully',
  },
]

const SHIELDED_DEMO_STEPS: TimelineStep[] = [
  {
    id: 'quote',
    title: 'Quote received',
    description: 'Best rate found for your swap',
  },
  {
    id: 'confirm',
    title: 'Confirm in wallet',
    description: 'Approve the transaction in your wallet',
    action: { label: 'Open wallet' },
  },
  {
    id: 'sign',
    title: 'Signing transaction',
    description: 'Creating your shielded intent...',
  },
  {
    id: 'shield',
    title: 'Shielding',
    description: 'Applying privacy protections...',
  },
  {
    id: 'complete',
    title: 'Complete!',
    description: 'Tokens sent to your stealth address',
  },
]

const PRODUCTION_STEPS: TimelineStep[] = [
  {
    id: 'quote',
    title: 'Quote received',
    description: 'Best rate found from NEAR Intents',
  },
  {
    id: 'confirm',
    title: 'Confirm in wallet',
    description: 'Approve the transaction',
    action: { label: 'Open wallet' },
  },
  {
    id: 'sign',
    title: 'Intent created',
    description: 'Your swap intent is ready',
  },
  {
    id: 'deposit',
    title: 'Awaiting deposit',
    description: 'Send tokens to the deposit address',
    action: { label: 'View address' },
  },
  {
    id: 'processing',
    title: 'Processing',
    description: 'Your swap is executing on-chain',
  },
  {
    id: 'complete',
    title: 'Complete!',
    description: 'Tokens delivered to your wallet',
  },
]

/**
 * Map SwapStatus to step index
 */
function getStepIndex(status: SwapStatus, isProduction: boolean): number {
  if (isProduction) {
    switch (status) {
      case 'idle':
        return -1
      case 'confirming':
        return 1
      case 'signing':
        return 2
      case 'pending':
        return 2
      case 'awaiting_deposit':
        return 3
      case 'processing':
        return 4
      case 'success':
        return 5
      case 'error':
        return -1
      default:
        return 0
    }
  }
  // Demo flow
  switch (status) {
    case 'idle':
      return -1
    case 'confirming':
      return 1
    case 'signing':
      return 2
    case 'pending':
      return 3
    case 'success':
      return 4
    case 'error':
      return -1
    default:
      return 0
  }
}

/**
 * Multi-step transaction timeline component
 * Shows visual progress through swap steps with timestamps
 */
export function TransactionTimeline({
  status,
  isShielded,
  isProduction,
  startTime,
  onActionClick,
}: TransactionTimelineProps) {
  // Track completion times for each step
  const [stepTimes, setStepTimes] = useState<Record<string, number>>({})
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Get the appropriate steps based on mode
  const steps = isProduction
    ? PRODUCTION_STEPS
    : isShielded
      ? SHIELDED_DEMO_STEPS
      : DEMO_STEPS

  const currentStepIndex = getStepIndex(status, isProduction)

  // Record completion time when step changes
  useEffect(() => {
    if (currentStepIndex > 0) {
      setStepTimes((prev) => {
        const newTimes = { ...prev }
        // Mark all previous steps as completed at current time
        for (let i = 0; i < currentStepIndex; i++) {
          if (!newTimes[steps[i].id]) {
            newTimes[steps[i].id] = Date.now()
          }
        }
        return newTimes
      })
    }
  }, [currentStepIndex, steps])

  // Update current time for elapsed display
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Don't show timeline for idle or error states
  if (status === 'idle' || status === 'error') {
    return null
  }

  return (
    <div className="space-y-1">
      {steps.map((step, index) => {
        const isComplete = index < currentStepIndex
        const isActive = index === currentStepIndex
        const isPending = index > currentStepIndex
        const completedAt = stepTimes[step.id]

        return (
          <div key={step.id} className="relative">
            {/* Connection line to next step */}
            {index < steps.length - 1 && (
              <div
                className={`absolute left-[15px] top-8 w-0.5 h-6 transition-colors duration-300 ${
                  isComplete ? 'bg-green-500' : 'bg-gray-700'
                }`}
              />
            )}

            <div className="flex items-start gap-3 py-1.5">
              {/* Step indicator */}
              <div
                className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  isComplete
                    ? 'bg-green-500 text-white'
                    : isActive
                      ? 'bg-purple-500 text-white ring-2 ring-purple-400/50 ring-offset-2 ring-offset-gray-900'
                      : 'bg-gray-700 text-gray-400'
                }`}
              >
                {isComplete ? (
                  <CheckIcon className="h-4 w-4" />
                ) : isActive ? (
                  <div className="relative">
                    <span className="text-sm font-medium">{index + 1}</span>
                    <span className="absolute inset-0 rounded-full animate-ping bg-purple-400 opacity-20" />
                  </div>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2">
                  <p
                    className={`font-medium text-sm ${
                      isComplete
                        ? 'text-green-400'
                        : isActive
                          ? 'text-white'
                          : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>

                  {/* Completion time */}
                  {isComplete && completedAt && (
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(completedAt, startTime || completedAt)}
                    </span>
                  )}

                  {/* Active indicator - elapsed time */}
                  {isActive && startTime && (
                    <span className="text-xs text-purple-400 animate-pulse">
                      {formatElapsed(currentTime - startTime)}
                    </span>
                  )}
                </div>

                {/* Description - only show for active step */}
                {isActive && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {step.description}
                  </p>
                )}

                {/* Action button - only show for active step with action */}
                {isActive && step.action && (
                  <button
                    onClick={() => onActionClick?.(step.id)}
                    className="text-xs text-purple-400 hover:text-purple-300 mt-1 flex items-center gap-1 transition-colors"
                  >
                    {step.action.label}
                    <ArrowRightIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Compact timeline for inline display (replaces StatusStep)
 */
export function CompactTimeline({
  status,
  isShielded,
  isProduction,
}: {
  status: SwapStatus
  isShielded: boolean
  isProduction: boolean
}) {
  const steps = isProduction
    ? ['Intent', 'Deposit', 'Process', 'Done']
    : isShielded
      ? ['Prepare', 'Sign', 'Shield', 'Done']
      : ['Prepare', 'Sign', 'Submit', 'Done']

  const currentStepIndex = isProduction
    ? getProductionCompactIndex(status)
    : getDemoCompactIndex(status)

  return (
    <div className="flex items-center justify-between text-xs">
      {steps.map((label, index) => (
        <div key={label} className="flex items-center">
          <CompactStep
            label={label}
            isActive={index === currentStepIndex}
            isComplete={index < currentStepIndex}
          />
          {index < steps.length - 1 && (
            <CompactDivider isComplete={index < currentStepIndex} />
          )}
        </div>
      ))}
    </div>
  )
}

function getProductionCompactIndex(status: SwapStatus): number {
  switch (status) {
    case 'confirming':
    case 'signing':
    case 'pending':
      return 0
    case 'awaiting_deposit':
      return 1
    case 'processing':
      return 2
    case 'success':
      return 3
    default:
      return 0
  }
}

function getDemoCompactIndex(status: SwapStatus): number {
  switch (status) {
    case 'confirming':
      return 0
    case 'signing':
      return 1
    case 'pending':
      return 2
    case 'success':
      return 3
    default:
      return 0
  }
}

function CompactStep({
  label,
  isActive,
  isComplete,
}: {
  label: string
  isActive: boolean
  isComplete: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-all ${
          isComplete
            ? 'bg-green-500 text-white'
            : isActive
              ? 'border-2 border-purple-500 text-purple-400'
              : 'border border-gray-600 text-gray-500'
        }`}
      >
        {isComplete && <CheckIcon className="h-3 w-3" />}
      </div>
      <span
        className={`text-[10px] ${
          isActive ? 'text-purple-300' : isComplete ? 'text-green-400' : 'text-gray-500'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

function CompactDivider({ isComplete }: { isComplete: boolean }) {
  return (
    <div
      className={`h-0.5 w-6 mx-1 ${isComplete ? 'bg-green-500' : 'bg-gray-700'}`}
    />
  )
}

function formatRelativeTime(time: number, startTime: number): string {
  const elapsed = Math.floor((time - startTime) / 1000)
  if (elapsed < 60) return `+${elapsed}s`
  return `+${Math.floor(elapsed / 60)}m${elapsed % 60}s`
}

function formatElapsed(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
