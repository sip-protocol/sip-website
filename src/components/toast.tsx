'use client'

import { useEffect, useState } from 'react'
import { useToastStore, type Toast as ToastType, type ToastType as ToastVariant } from '@/stores/toast-store'

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose }: { toast: ToastType; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(onClose, 200) // Wait for exit animation
  }

  const styles = getToastStyles(toast.type)

  return (
    <div
      className={`
        flex max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm
        transition-all duration-200 ease-out
        ${styles.container}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
      `}
    >
      <div className={`flex-shrink-0 ${styles.icon}`}>
        <ToastIcon type={toast.type} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${styles.title}`}>{toast.title}</p>
        {toast.message && (
          <p className={`mt-1 text-sm ${styles.message}`}>{toast.message}</p>
        )}
      </div>
      <button
        onClick={handleClose}
        className={`flex-shrink-0 rounded p-1 transition-colors ${styles.closeButton}`}
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  )
}

function getToastStyles(type: ToastVariant) {
  switch (type) {
    case 'success':
      return {
        container: 'border-green-500/30 bg-green-900/90',
        icon: 'text-green-400',
        title: 'text-green-200',
        message: 'text-green-300/80',
        closeButton: 'text-green-400/60 hover:text-green-400 hover:bg-green-500/20',
      }
    case 'error':
      return {
        container: 'border-red-500/30 bg-red-900/90',
        icon: 'text-red-400',
        title: 'text-red-200',
        message: 'text-red-300/80',
        closeButton: 'text-red-400/60 hover:text-red-400 hover:bg-red-500/20',
      }
    case 'warning':
      return {
        container: 'border-yellow-500/30 bg-yellow-900/90',
        icon: 'text-yellow-400',
        title: 'text-yellow-200',
        message: 'text-yellow-300/80',
        closeButton: 'text-yellow-400/60 hover:text-yellow-400 hover:bg-yellow-500/20',
      }
    case 'info':
    default:
      return {
        container: 'border-blue-500/30 bg-blue-900/90',
        icon: 'text-blue-400',
        title: 'text-blue-200',
        message: 'text-blue-300/80',
        closeButton: 'text-blue-400/60 hover:text-blue-400 hover:bg-blue-500/20',
      }
  }
}

function ToastIcon({ type }: { type: ToastVariant }) {
  switch (type) {
    case 'success':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )
    case 'error':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    case 'warning':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    case 'info':
    default:
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
  }
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
