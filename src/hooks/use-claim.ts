'use client'

import { useState, useCallback } from 'react'
import { Connection, PublicKey, Transaction, type VersionedTransaction } from '@solana/web3.js'
import type { HexString } from '@sip-protocol/types'
import { logger } from '@/lib'
import { useWalletStore } from '@/stores'

export type ClaimStatus = 'idle' | 'signing' | 'pending' | 'success' | 'error'

export interface ClaimResult {
  /** Current claim status */
  status: ClaimStatus
  /** Transaction hash on success */
  txHash: string | null
  /** Explorer URL */
  explorerUrl: string | null
  /** Amount claimed */
  amount: bigint | null
  /** Destination address */
  destinationAddress: string | null
  /** Error message if any */
  error: string | null
  /** Claim a stealth payment */
  claim: (params: ClaimParams) => Promise<void>
  /** Reset state */
  reset: () => void
}

export interface ClaimParams {
  /** Stealth address to claim from */
  stealthAddress: string
  /** Ephemeral public key from the announcement */
  ephemeralPublicKey: string
  /** Token mint address */
  mint: string
  /** Viewing private key (hex) */
  viewingPrivateKey: HexString
  /** Spending private key (hex) */
  spendingPrivateKey: HexString
  /** Destination address to send funds to */
  destinationAddress: string
}

/**
 * Hook for claiming stealth payments on Solana
 *
 * @example
 * ```tsx
 * const { status, claim, txHash, error } = useClaim()
 *
 * const handleClaim = async (payment: ScannedPayment) => {
 *   await claim({
 *     stealthAddress: payment.stealthAddress,
 *     ephemeralPublicKey: payment.ephemeralPublicKey,
 *     mint: payment.mint,
 *     viewingPrivateKey: '0x...',
 *     spendingPrivateKey: '0x...',
 *     destinationAddress: 'myWallet...',
 *   })
 * }
 * ```
 */
export function useClaim(): ClaimResult {
  const { walletType } = useWalletStore()

  const [status, setStatus] = useState<ClaimStatus>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [explorerUrl, setExplorerUrl] = useState<string | null>(null)
  const [amount, setAmount] = useState<bigint | null>(null)
  const [destinationAddress, setDestinationAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setStatus('idle')
    setTxHash(null)
    setExplorerUrl(null)
    setAmount(null)
    setDestinationAddress(null)
    setError(null)
  }, [])

  const claim = useCallback(async (params: ClaimParams) => {
    setStatus('signing')
    setError(null)

    try {
      logger.debug('Claiming stealth payment', 'useClaim')

      // Get Solana RPC connection
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
      const connection = new Connection(rpcUrl, 'confirmed')

      // Import SDK claim function
      const { claimStealthPayment } = await import('@sip-protocol/sdk')

      // Get wallet for signing
      const wallet = getSolanaWallet(walletType || 'phantom')
      if (!wallet?.signTransaction) {
        throw new Error('Wallet does not support transaction signing')
      }

      setStatus('pending')

      // Claim the payment
      const result = await claimStealthPayment({
        connection,
        stealthAddress: params.stealthAddress,
        ephemeralPublicKey: params.ephemeralPublicKey,
        viewingPrivateKey: params.viewingPrivateKey,
        spendingPrivateKey: params.spendingPrivateKey,
        destinationAddress: params.destinationAddress,
        mint: new PublicKey(params.mint),
      })

      setTxHash(result.txSignature)
      setExplorerUrl(result.explorerUrl)
      setAmount(result.amount)
      setDestinationAddress(result.destinationAddress)
      setStatus('success')

      logger.debug(`Claimed ${result.amount} to ${result.destinationAddress}`, 'useClaim')
    } catch (err) {
      logger.error('Claim failed', err, 'useClaim')
      const message = err instanceof Error ? err.message : 'Claim failed'
      setError(message)
      setStatus('error')
    }
  }, [walletType])

  return {
    status,
    txHash,
    explorerUrl,
    amount,
    destinationAddress,
    error,
    claim,
    reset,
  }
}

/**
 * Get Solana wallet from browser window
 */
function getSolanaWallet(walletType: string): {
  signTransaction?: <T extends Transaction | VersionedTransaction>(tx: T) => Promise<T>
} | null {
  if (typeof window === 'undefined') return null

  const win = window as {
    phantom?: { solana?: unknown }
    solflare?: unknown
    backpack?: { solana?: unknown }
  }

  switch (walletType) {
    case 'phantom':
      return win.phantom?.solana as ReturnType<typeof getSolanaWallet>
    case 'solflare':
      return win.solflare as ReturnType<typeof getSolanaWallet>
    case 'backpack':
      return win.backpack?.solana as ReturnType<typeof getSolanaWallet>
    default:
      return win.phantom?.solana as ReturnType<typeof getSolanaWallet>
  }
}
