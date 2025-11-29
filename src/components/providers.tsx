'use client'

import { WalletModal } from '@/components/wallet'
import { ToastContainer } from '@/components/toast'
import { SIPProvider } from '@/contexts'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SIPProvider>
      {children}
      <WalletModal />
      <ToastContainer />
    </SIPProvider>
  )
}
