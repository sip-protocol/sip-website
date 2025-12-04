'use client'

import dynamic from 'next/dynamic'
import { ToastContainer } from '@/components/toast'
import { ErrorBoundary } from '@/components/error-boundary'
import { SIPProvider, NearWalletProvider } from '@/contexts'

// Dynamic import to avoid SSR issues with SDK's WASM dependencies
const WalletModal = dynamic(
  () => import('@/components/wallet/wallet-modal').then((mod) => mod.WalletModal),
  { ssr: false }
)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <SIPProvider>
        <NearWalletProvider networkId="testnet">
          {children}
          <WalletModal />
          <ToastContainer />
        </NearWalletProvider>
      </SIPProvider>
    </ErrorBoundary>
  )
}
