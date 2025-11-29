'use client'

import dynamic from 'next/dynamic'
import { ToastContainer } from '@/components/toast'
import { SIPProvider } from '@/contexts'

// Dynamic import to avoid SSR issues with SDK's WASM dependencies
const WalletModal = dynamic(
  () => import('@/components/wallet/wallet-modal').then((mod) => mod.WalletModal),
  { ssr: false }
)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SIPProvider>
      {children}
      <WalletModal />
      <ToastContainer />
    </SIPProvider>
  )
}
