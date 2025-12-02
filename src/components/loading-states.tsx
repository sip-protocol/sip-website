'use client'

import { useMemo } from 'react'
import type { SwapStatus } from '@/hooks'

interface LoadingStatesProps {
  /** Current swap status */
  status: SwapStatus
  /** Whether the swap is shielded */
  isShielded: boolean
  /** Whether it's compliant mode */
  isCompliant?: boolean
  /** Custom step messages */
  steps?: SwapStep[]
}

export interface SwapStep {
  id: string
  label: string
  description: string
  status: 'pending' | 'active' | 'completed' | 'error'
}

/**
 * Get the default swap steps based on status and privacy mode
 */
function getDefaultSteps(status: SwapStatus, isShielded: boolean, isCompliant: boolean): SwapStep[] {
  const privacyLabel = isCompliant ? 'Comply' : isShielded ? 'Shield' : 'Submit'
  const privacyDesc = isCompliant
    ? 'Applying privacy with viewing key'
    : isShielded
      ? 'Applying privacy protections'
      : 'Submitting to network'

  // Determine step statuses based on current status
  const getStepStatus = (stepIndex: number): 'pending' | 'active' | 'completed' | 'error' => {
    const statusOrder = ['confirming', 'signing', 'pending', 'awaiting_deposit', 'processing', 'success', 'error']
    const currentIndex = statusOrder.indexOf(status)

    if (status === 'error') {
      // Show error on the active step
      if (stepIndex === Math.min(currentIndex, 2)) return 'error'
      if (stepIndex < currentIndex) return 'completed'
      return 'pending'
    }

    if (stepIndex === 0) {
      // Prepare step
      if (status === 'confirming') return 'active'
      if (['signing', 'pending', 'awaiting_deposit', 'processing', 'success'].includes(status)) return 'completed'
      return 'pending'
    }

    if (stepIndex === 1) {
      // Sign step
      if (status === 'signing') return 'active'
      if (['pending', 'awaiting_deposit', 'processing', 'success'].includes(status)) return 'completed'
      return 'pending'
    }

    if (stepIndex === 2) {
      // Process/Shield step
      if (['pending', 'awaiting_deposit', 'processing'].includes(status)) return 'active'
      if (status === 'success') return 'completed'
      return 'pending'
    }

    return 'pending'
  }

  return [
    {
      id: 'prepare',
      label: 'Prepare',
      description: 'Building your swap intent',
      status: getStepStatus(0),
    },
    {
      id: 'sign',
      label: 'Sign',
      description: 'Sign in your wallet',
      status: getStepStatus(1),
    },
    {
      id: 'process',
      label: privacyLabel,
      description: privacyDesc,
      status: getStepStatus(2),
    },
  ]
}

/**
 * SwapLoadingSteps - Shows contextual loading progress during swap execution
 */
export function SwapLoadingSteps({
  status,
  isShielded,
  isCompliant = false,
  steps: customSteps,
}: LoadingStatesProps) {
  const steps = useMemo(() => {
    return customSteps ?? getDefaultSteps(status, isShielded, isCompliant)
  }, [customSteps, status, isShielded, isCompliant])

  const activeStep = steps.find(s => s.status === 'active')

  if (status === 'idle' || status === 'success' || status === 'error') {
    return null
  }

  return (
    <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
      {/* Main loading indicator */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <LoadingSpinner className="h-10 w-10 text-purple-400" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-purple-500/20" />
          </div>
        </div>
        <div className="flex-1">
          <p className="font-medium text-purple-300">
            {activeStep?.label ?? 'Processing'}
          </p>
          <p className="text-sm text-purple-400/80">
            {activeStep?.description ?? 'Please wait...'}
          </p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <StepIndicator step={step} />
            {index < steps.length - 1 && (
              <StepConnector isComplete={step.status === 'completed'} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function StepIndicator({ step }: { step: SwapStep }) {
  const statusConfig = {
    pending: {
      bg: 'border border-purple-500/30',
      text: 'text-purple-500/50',
      icon: null,
    },
    active: {
      bg: 'border-2 border-purple-500',
      text: 'text-purple-400',
      icon: null,
    },
    completed: {
      bg: 'bg-purple-500',
      text: 'text-purple-400',
      icon: <CheckIcon className="h-3 w-3 text-white" />,
    },
    error: {
      bg: 'bg-red-500',
      text: 'text-red-400',
      icon: <XIcon className="h-3 w-3 text-white" />,
    },
  }

  const config = statusConfig[step.status]

  return (
    <div className="flex flex-col items-center gap-1 text-xs">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full font-medium ${config.bg}`}
      >
        {config.icon}
      </div>
      <span className={config.text}>{step.label}</span>
    </div>
  )
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div
      className={`h-0.5 flex-1 mx-2 transition-colors ${
        isComplete ? 'bg-purple-500' : 'bg-purple-500/30'
      }`}
    />
  )
}

/**
 * QuoteLoadingIndicator - Shows quote loading with skeleton
 */
export function QuoteLoadingIndicator() {
  return (
    <div className="flex items-center gap-2" data-testid="quote-loading">
      <LoadingSpinner className="h-5 w-5 text-purple-400" />
      <div className="space-y-1">
        <div className="h-6 w-24 animate-pulse rounded bg-gray-700" />
        <div className="h-3 w-16 animate-pulse rounded bg-gray-700/60" />
      </div>
    </div>
  )
}

/**
 * InlineLoadingSpinner - Small inline loading indicator
 */
export function InlineLoadingSpinner({ className = '' }: { className?: string }) {
  return <LoadingSpinner className={`h-4 w-4 ${className}`} />
}

/**
 * ButtonLoadingState - Loading state for buttons
 */
export function ButtonLoadingState({
  children,
  isLoading,
  loadingText,
}: {
  children: React.ReactNode
  isLoading: boolean
  loadingText?: string
}) {
  if (!isLoading) {
    return <>{children}</>
  }

  return (
    <span className="flex items-center justify-center gap-2">
      <LoadingSpinner className="h-5 w-5" />
      {loadingText ?? 'Loading...'}
    </span>
  )
}

/**
 * SkeletonLoader - Generic skeleton loading placeholder
 */
export function SkeletonLoader({
  className = '',
  width,
  height,
}: {
  className?: string
  width?: string | number
  height?: string | number
}) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-700 ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  )
}

// Icons

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
