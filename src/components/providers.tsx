'use client'

import { WalletModal } from '@/components/wallet'
import { SIPProvider } from '@/contexts'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SIPProvider>
      {children}
      <WalletModal />
    </SIPProvider>
  )
}
