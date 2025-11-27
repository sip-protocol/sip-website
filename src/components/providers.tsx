'use client'

import { WalletModal } from '@/components/wallet'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <WalletModal />
    </>
  )
}
