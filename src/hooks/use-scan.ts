'use client'

import { useState, useCallback } from 'react'
import { Connection } from '@solana/web3.js'
import type { HexString } from '@sip-protocol/types'
import { logger } from '@/lib'

export interface ScannedPayment {
  stealthAddress: string
  ephemeralPublicKey: string
  amount: bigint
  mint: string
  tokenSymbol?: string
  txSignature: string
  slot: number
  timestamp: number
}

export interface ScanResult {
  /** Scanned payments found */
  payments: ScannedPayment[]
  /** Whether scanning is in progress */
  isScanning: boolean
  /** Error message if any */
  error: string | null
  /** Last scan timestamp */
  lastScanTime: number | null
  /** Scan for incoming payments */
  scan: (params: ScanParams) => Promise<void>
  /** Clear results */
  reset: () => void
}

export interface ScanParams {
  /** Viewing private key (hex) */
  viewingPrivateKey: HexString
  /** Spending public key (hex) */
  spendingPublicKey: HexString
  /** Start slot for scanning */
  fromSlot?: number
  /** End slot for scanning */
  toSlot?: number
  /** Maximum transactions to check */
  limit?: number
}

/**
 * Hook for scanning Solana blockchain for incoming stealth payments
 *
 * @example
 * ```tsx
 * const { payments, isScanning, scan, error } = useScan()
 *
 * const handleScan = async () => {
 *   await scan({
 *     viewingPrivateKey: '0x...',
 *     spendingPublicKey: '0x...',
 *   })
 * }
 * ```
 */
export function useScan(): ScanResult {
  const [payments, setPayments] = useState<ScannedPayment[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastScanTime, setLastScanTime] = useState<number | null>(null)

  const reset = useCallback(() => {
    setPayments([])
    setError(null)
    setLastScanTime(null)
  }, [])

  const scan = useCallback(async (params: ScanParams) => {
    setIsScanning(true)
    setError(null)

    try {
      logger.debug('Starting payment scan', 'useScan')

      // Get Solana RPC connection
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
      const connection = new Connection(rpcUrl, 'confirmed')

      // Import SDK scan function
      const { scanForPayments } = await import('@sip-protocol/sdk')

      // Scan for payments
      const results = await scanForPayments({
        connection,
        viewingPrivateKey: params.viewingPrivateKey,
        spendingPublicKey: params.spendingPublicKey,
        fromSlot: params.fromSlot,
        toSlot: params.toSlot,
        limit: params.limit || 100,
      })

      // Convert results to UI format
      const scannedPayments: ScannedPayment[] = results.map((r) => ({
        stealthAddress: r.stealthAddress,
        ephemeralPublicKey: r.ephemeralPublicKey,
        amount: r.amount,
        mint: r.mint,
        tokenSymbol: r.tokenSymbol,
        txSignature: r.txSignature,
        slot: r.slot,
        timestamp: r.timestamp,
      }))

      setPayments(scannedPayments)
      setLastScanTime(Date.now())

      logger.debug(`Found ${scannedPayments.length} payments`, 'useScan')
    } catch (err) {
      logger.error('Scan failed', err, 'useScan')
      const message = err instanceof Error ? err.message : 'Scan failed'
      setError(message)
    } finally {
      setIsScanning(false)
    }
  }, [])

  return {
    payments,
    isScanning,
    error,
    lastScanTime,
    scan,
    reset,
  }
}
