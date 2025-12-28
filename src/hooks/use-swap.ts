'use client'

import { useState, useCallback, useRef } from 'react'
import { PrivacyLevel, type Quote, type ChainId } from '@sip-protocol/types'
import { Connection, PublicKey, Transaction, type VersionedTransaction } from '@solana/web3.js'

// Use crypto API for random key generation (works in both browser and Node)
function generateRandomPrivateKey(): Uint8Array {
  const privateKey = new Uint8Array(32)
  crypto.getRandomValues(privateKey)
  return privateKey
}

// ProductionQuote extends Quote with depositAddress for production mode
interface ProductionQuote extends Quote {
  depositAddress?: string
}

// Same-chain quote marker type
interface SameChainQuote extends Quote {
  type: 'same-chain'
}

import { useSIP } from '@/contexts'
import { useWalletStore, useSwapModeStore, useSwapHistoryStore, toast } from '@/stores'
import { parseAmount, getTransactionUrl, createDepositCallback, logger, getSDK, type NetworkId } from '@/lib'
import { OneClickSwapStatus } from '@sip-protocol/types'

export type SwapStatus = 'idle' | 'confirming' | 'signing' | 'pending' | 'awaiting_deposit' | 'processing' | 'success' | 'error'

export interface SwapParams {
  fromChain: NetworkId
  toChain: NetworkId
  fromToken: string
  toToken: string
  amount: string
  privacyLevel: PrivacyLevel
  quote: Quote | null
  /** Destination address where funds will be sent (required for all non-ZEC swaps) */
  destinationAddress?: string
}

export interface SwapResult {
  /** Transaction hash (settlement/destination chain) */
  txHash: string | null
  /** Explorer URL for the settlement transaction */
  explorerUrl: string | null
  /** Deposit transaction hash (source chain - e.g., Solana) */
  depositTxHash: string | null
  /** Explorer URL for the deposit transaction */
  depositExplorerUrl: string | null
  /** Chain the deposit transaction was submitted on */
  txChain: NetworkId | null
  /** Destination chain for the settlement transaction */
  settlementChain: NetworkId | null
  /** Current swap status */
  status: SwapStatus
  /** Error message if any */
  error: string | null
  /** Deposit address for production mode (send tokens here) */
  depositAddress: string | null
  /** Amount to deposit (human readable) */
  depositAmount: string | null
  /** Token symbol being deposited (e.g., 'SOL', 'ETH') */
  depositToken: string | null
  /** Viewing key for compliant mode swaps (auditor access) */
  viewingKey: string | null
  /** Unique swap ID for tracking */
  swapId: string | null
  /** Execute the swap */
  execute: (params: SwapParams) => Promise<void>
  /** Reset the swap state */
  reset: () => void
  /** Cancel the swap (before deposit) */
  cancel: () => void
}

// Token decimals mapping
const TOKEN_DECIMALS: Record<string, number> = {
  SOL: 9,
  ETH: 18,
  NEAR: 24,
  ZEC: 8,
  USDC: 6,
  WETH: 18,
  // New tokens
  BTC: 8,
  ARB: 18,
  BASE: 18,
  OP: 18,
  POL: 18,
  BNB: 18,
  AVAX: 18,
  APT: 8,
}

// Solana token mint addresses (mainnet)
const SOLANA_TOKEN_MINTS: Record<string, string> = {
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  SOL: 'So11111111111111111111111111111111111111112', // Wrapped SOL
}

/**
 * Get Solana token mint address
 */
function getSolanaTokenMint(symbol: string): string | null {
  return SOLANA_TOKEN_MINTS[symbol] ?? null
}

/**
 * Get Solana wallet from browser window
 */
function getSolanaWallet(walletType: string): {
  signTransaction?: <T extends Transaction | VersionedTransaction>(tx: T) => Promise<T>
  signAllTransactions?: <T extends Transaction | VersionedTransaction>(txs: T[]) => Promise<T[]>
} | null {
  if (typeof window === 'undefined') return null

  // Access wallet provider from window
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
      // Try phantom as default
      return win.phantom?.solana as ReturnType<typeof getSolanaWallet>
  }
}

/**
 * Hook for executing swap transactions
 *
 * @example
 * ```tsx
 * const { status, txHash, error, execute, reset } = useSwap()
 *
 * const handleSwap = async () => {
 *   await execute({
 *     fromChain: 'solana',
 *     toChain: 'ethereum',
 *     fromToken: 'SOL',
 *     toToken: 'ETH',
 *     amount: '1.5',
 *     privacyLevel: PrivacyLevel.SHIELDED,
 *     quote,
 *   })
 * }
 * ```
 */
export function useSwap(): SwapResult {
  const { client, isProductionMode } = useSIP()
  const { isConnected, address, chain, walletType } = useWalletStore()
  const { mode: swapMode } = useSwapModeStore()
  const { addSwap, updateSwap: updateSwapHistory } = useSwapHistoryStore()

  const [status, setStatus] = useState<SwapStatus>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [depositTxHash, setDepositTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [txChain, setTxChain] = useState<NetworkId | null>(null)
  const [settlementChain, setSettlementChain] = useState<NetworkId | null>(null)
  const [depositAddress, setDepositAddress] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState<string | null>(null)
  const [depositToken, setDepositToken] = useState<string | null>(null)
  const [viewingKey, setViewingKey] = useState<string | null>(null)
  const [swapId, setSwapId] = useState<string | null>(null)
  const currentSwapId = useRef<string | null>(null)

  const reset = useCallback(() => {
    setStatus('idle')
    setTxHash(null)
    setDepositTxHash(null)
    setError(null)
    setTxChain(null)
    setSettlementChain(null)
    setDepositAddress(null)
    setDepositAmount(null)
    setDepositToken(null)
    setViewingKey(null)
    setSwapId(null)
    currentSwapId.current = null
  }, [])

  const cancel = useCallback(() => {
    // Only allow cancel before deposit is made
    if (status === 'confirming' || status === 'signing') {
      // Update swap history to failed if exists
      if (currentSwapId.current) {
        updateSwapHistory(currentSwapId.current, { status: 'failed' })
      }
      reset()
      toast.info('Swap Cancelled', 'Your swap has been cancelled')
    }
  }, [status, reset, updateSwapHistory])

  const execute = useCallback(async (params: SwapParams) => {
    // Block execution in preview mode
    if (swapMode === 'preview') {
      toast.info('Preview Mode', 'Switch to Execute mode to perform real swaps')
      return
    }

    // Validate wallet connection
    if (!isConnected || !address) {
      const msg = 'Please connect your wallet first'
      setError(msg)
      setStatus('error')
      toast.warning('Wallet Required', msg)
      return
    }

    // Validate chain matches
    if (chain !== params.fromChain) {
      const networkName = params.fromChain === 'solana' ? 'Solana' : 'Ethereum'
      const msg = `Please switch to ${networkName} network`
      setError(msg)
      setStatus('error')
      toast.warning('Wrong Network', msg)
      return
    }

    // Validate quote
    if (!params.quote) {
      const msg = 'No quote available. Please refresh and try again'
      setError(msg)
      setStatus('error')
      toast.error('Quote Required', msg)
      return
    }

    // Check if this is a same-chain privacy transfer
    const isSameChainQuote = (params.quote as SameChainQuote).type === 'same-chain'
    const isSolanaToSolana = params.fromChain === 'solana' && params.toChain === 'solana'

    // Handle same-chain Solana privacy transfer
    if (isSameChainQuote && isSolanaToSolana) {
      try {
        setStatus('confirming')
        setError(null)
        setTxHash(null)
        setTxChain(params.fromChain)
        setSettlementChain(params.toChain)

        // Track swap in history
        const newSwapId = `swap-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
        currentSwapId.current = newSwapId
        setSwapId(newSwapId)
        addSwap({
          id: newSwapId,
          fromToken: params.fromToken,
          toToken: params.toToken,
          fromChain: params.fromChain,
          toChain: params.toChain,
          fromAmount: params.amount,
          toAmount: params.amount, // 1:1 for same-chain
          status: 'pending',
          timestamp: Date.now(),
          privacyLevel: params.privacyLevel,
        })

        logger.debug('Executing same-chain Solana privacy transfer', 'useSwap')

        // Solana RPC endpoint (use mainnet or configured RPC)
        const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
        const connection = new Connection(rpcUrl, 'confirmed')

        // Get wallet adapter for signing
        const sdkModule = await import('@sip-protocol/sdk')
        const adapter = sdkModule.createSolanaAdapter({
          wallet: (walletType || 'phantom') as 'phantom' | 'solflare' | 'backpack',
          cluster: 'mainnet-beta',
        })

        // Reconnect to get the wallet session
        await adapter.connect()
        if (!adapter.isConnected || !adapter.address) {
          throw new Error('Failed to connect to Solana wallet')
        }

        const senderPubkey = new PublicKey(adapter.address)

        // Create signTransaction wrapper using the adapter
        const signTransaction = async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
          // Use the wallet's signTransaction directly
          const wallet = getSolanaWallet(walletType || 'phantom')
          if (!wallet?.signTransaction) {
            throw new Error('Wallet does not support signTransaction')
          }
          return wallet.signTransaction(tx) as Promise<T>
        }

        // Calculate amount
        const fromDecimals = TOKEN_DECIMALS[params.fromToken] ?? 9
        const amountBigInt = parseAmount(params.amount, fromDecimals)

        // Validate token is supported
        const tokenMint = getSolanaTokenMint(params.fromToken)
        if (!tokenMint) {
          throw new Error(`Unsupported token for same-chain transfer: ${params.fromToken}`)
        }

        setStatus('signing')

        // Validate recipient meta-address
        if (!params.destinationAddress) {
          throw new Error('Recipient SIP address is required for same-chain privacy')
        }

        // Decode the string meta-address to object format
        const sdkModule2 = await import('@sip-protocol/sdk')
        const recipientMetaAddress = sdkModule2.decodeStealthMetaAddress(params.destinationAddress)

        // Execute same-chain privacy transfer via SDK
        const result = await client!.executeSameChain('solana' as ChainId, {
          recipientMetaAddress,
          amount: amountBigInt,
          token: params.fromToken,
          connection,
          sender: senderPubkey,
          signTransaction,
        })

        // Update swap history with success
        if (currentSwapId.current) {
          updateSwapHistory(currentSwapId.current, {
            status: 'completed',
            txHash: result.txHash || undefined,
            explorerUrl: result.explorerUrl || undefined,
          })
        }

        setTxHash(result.txHash)
        setStatus('success')
        toast.success(
          'Private Transfer Complete',
          `Sent to stealth address: ${result.stealthAddress?.slice(0, 8)}...`
        )

        return
      } catch (err) {
        // Update swap history with failure
        if (currentSwapId.current) {
          updateSwapHistory(currentSwapId.current, { status: 'failed' })
        }

        logger.error('Same-chain transfer failed', err, 'useSwap')
        const message = err instanceof Error ? err.message : 'Transaction failed'
        setError(message)
        setStatus('error')
        toast.error('Transfer Failed', message)
        return
      }
    }

    // Continue with cross-chain flow for non-same-chain transfers
    try {
      setStatus('confirming')
      setError(null)
      setTxHash(null)
      setTxChain(params.fromChain)

      // Track swap in history
      const newSwapId = `swap-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      currentSwapId.current = newSwapId
      setSwapId(newSwapId)
      addSwap({
        id: newSwapId,
        fromToken: params.fromToken,
        toToken: params.toToken,
        fromChain: params.fromChain,
        toChain: params.toChain,
        fromAmount: params.amount,
        toAmount: params.quote?.outputAmount ? (Number(params.quote.outputAmount) / 1e18).toFixed(6) : '—',
        status: 'pending',
        timestamp: Date.now(),
        privacyLevel: params.privacyLevel,
      })

      const fromDecimals = TOKEN_DECIMALS[params.fromToken] ?? 18
      const toDecimals = TOKEN_DECIMALS[params.toToken] ?? 18
      const amountBigInt = parseAmount(params.amount, fromDecimals)

      // Load SDK for privacy-related functions (cached singleton)
      const sdk = await getSDK()

      // Generate viewing key for compliant mode
      let viewingKeyObj: { key: string; path: string; hash: string } | undefined
      if (params.privacyLevel === PrivacyLevel.COMPLIANT) {
        viewingKeyObj = sdk.generateViewingKey(`swap/${Date.now()}`)
        setViewingKey(viewingKeyObj.key) // Store for UI display
      }

      // For shielded/compliant modes with explicit destination address:
      // - Privacy is "sender-shielded" (hidden sender identity via Pedersen commitments)
      // - Funds are delivered to the user's actual destination address (not a random stealth)
      // - Use TRANSPARENT privacy level for API when destination provided (SDK requirement)
      // Only generate random stealth address if NO destination address is provided
      const hasExplicitDestination = !!params.destinationAddress
      const effectivePrivacyLevel = hasExplicitDestination ? PrivacyLevel.TRANSPARENT : params.privacyLevel

      let recipientMetaAddress: string | undefined
      if (effectivePrivacyLevel !== PrivacyLevel.TRANSPARENT) {
        const isEd25519 = sdk.isEd25519Chain(params.toChain as ChainId)
        const stealth = isEd25519
          ? sdk.generateEd25519StealthMetaAddress(params.toChain as ChainId)
          : sdk.generateStealthMetaAddress(params.toChain as ChainId)
        // Encode the meta-address object to string format: sip:<chain>:<spendingKey>:<viewingKey>
        recipientMetaAddress = sdk.encodeStealthMetaAddress(stealth.metaAddress)
        logger.warn('No destination address provided for shielded mode - using random stealth (funds may be lost!)', 'useSwap')
      }

      if (hasExplicitDestination && params.privacyLevel !== PrivacyLevel.TRANSPARENT) {
        logger.debug(`Sender-shielded mode: destination=${params.destinationAddress?.slice(0, 10)}...`, 'useSwap')
      }

      // Create the shielded intent
      if (!client) {
        throw new Error('SIP client not ready')
      }

      // Generate a secp256k1 private key for ZK proof signatures
      // The SDK will generate proper ECDSA signatures internally using this key
      // In production, this would come from a derived key or the user's wallet
      const senderSecret = generateRandomPrivateKey()

      const intent = await client.createIntent({
        input: {
          asset: {
            chain: params.fromChain as ChainId,
            symbol: params.fromToken,
            address: null,
            decimals: fromDecimals,
          },
          amount: amountBigInt,
        },
        output: {
          asset: {
            chain: params.toChain as ChainId,
            symbol: params.toToken,
            address: null,
            decimals: toDecimals,
          },
          minAmount: params.quote.outputAmount,
          maxSlippage: 0.01,
        },
        privacy: effectivePrivacyLevel, // Use effective level (TRANSPARENT when destination provided)
        recipientMetaAddress,
        viewingKey: viewingKeyObj?.key as `0x${string}` | undefined,
      }, {
        // Provide senderSecret - SDK will generate proper ECDSA signatures internally
        // This ensures signatures match the intentHash computed by the SDK
        senderSecret: senderSecret,
      })

      setStatus('signing')

      // For production mode, capture deposit address from quote before execution
      // The quote should have depositAddress from getQuotes() call
      if (isProductionMode) {
        const prodQuote = params.quote as ProductionQuote
        if (prodQuote.depositAddress) {
          setDepositAddress(prodQuote.depositAddress)
          setDepositAmount(params.amount)
          setDepositToken(params.fromToken)
          logger.debug(`Deposit address captured: ${prodQuote.depositAddress?.slice(0, 10)}...`, 'Swap')
        } else {
          logger.warn('Production mode quote missing depositAddress', 'Swap')
        }
      }

      // Create deposit callback for production mode
      // Determine effective wallet type (use stored type or fallback to detection)
      let effectiveWalletType = walletType
      if (!effectiveWalletType && params.fromChain) {
        // Fallback: detect wallet based on chain if store value is missing
        // This handles edge cases like page refresh or race conditions
        if (params.fromChain === 'solana') {
          const sdk = await getSDK()
          const detected = sdk.detectSolanaWallets?.() ?? []
          effectiveWalletType = detected[0] as typeof walletType || 'phantom' // Default to phantom
        } else if (params.fromChain === 'ethereum') {
          const sdk = await getSDK()
          const detected = sdk.detectEthereumWallets?.() ?? []
          effectiveWalletType = detected[0] as typeof walletType || 'metamask' // Default to metamask
        }
        logger.debug(`Wallet type fallback: detected ${effectiveWalletType} for ${params.fromChain}`, 'Swap')
      }

      logger.debug(`Deposit callback state: wallet=${effectiveWalletType}, prod=${isProductionMode}`, 'Swap')

      // Set settlement chain for destination tracking
      setSettlementChain(params.toChain)

      const baseDepositCallback = effectiveWalletType
        ? createDepositCallback(params.fromChain, effectiveWalletType, params.fromToken)
        : undefined

      // Wrap deposit callback to capture the deposit tx hash
      const depositCallback = baseDepositCallback
        ? async (depositAddress: string, amount: string): Promise<string> => {
            const txHash = await baseDepositCallback(depositAddress, amount)
            // Capture the deposit tx hash for display
            setDepositTxHash(txHash)
            logger.debug(`Deposit tx captured: ${txHash?.slice(0, 16)}...`, 'Swap')
            return txHash
          }
        : undefined

      if (!depositCallback && isProductionMode) {
        logger.warn(`No deposit callback - cannot prompt wallet for deposit`, 'Swap')
        toast.warning('Wallet Detection', 'Could not detect wallet for automatic deposit. You may need to send manually.')
      }

      // Status update handler
      const handleStatusUpdate = (status: OneClickSwapStatus) => {
        switch (status) {
          case OneClickSwapStatus.PENDING_DEPOSIT:
            setStatus('awaiting_deposit')
            break
          case OneClickSwapStatus.PROCESSING:
            setStatus('processing')
            break
          case OneClickSwapStatus.SUCCESS:
            setStatus('success')
            break
          case OneClickSwapStatus.INCOMPLETE_DEPOSIT:
          case OneClickSwapStatus.REFUNDED:
            setStatus('error')
            break
        }
      }

      // Execute the intent with the quote
      // In production mode: sends deposit tx and waits for completion
      // In demo mode: returns mock result
      const result = await client.execute(intent, params.quote, {
        onDepositRequired: isProductionMode ? depositCallback : undefined,
        onStatusUpdate: isProductionMode ? handleStatusUpdate : undefined,
        timeout: 300000, // 5 minutes
      })

      // Update swap history with success
      const explorerUrlForHistory = result.txHash && params.fromChain
        ? getTransactionUrl(params.fromChain, result.txHash)
        : undefined

      if (currentSwapId.current) {
        updateSwapHistory(currentSwapId.current, {
          status: 'completed',
          txHash: result.txHash || undefined,
          explorerUrl: explorerUrlForHistory,
        })
      }

      if (result.txHash) {
        setTxHash(result.txHash)
        setStatus('success')
        toast.success('Swap Submitted', 'Your transaction has been submitted to the network')
      } else if (params.privacyLevel === PrivacyLevel.SHIELDED) {
        // Shielded mode: no public txHash is expected (privacy protection)
        setTxHash(null)
        setStatus('success')
        toast.success('Shielded Swap Complete', 'Your private transaction has been processed')
      } else if (params.privacyLevel === PrivacyLevel.COMPLIANT) {
        // Compliant mode: private with viewing key
        setTxHash(null)
        setStatus('success')
        toast.success('Compliant Swap Complete', 'Your private transaction has been processed with viewing key')
      } else {
        // Transparent mode without txHash: transaction may still be processing
        setTxHash(null)
        setStatus('success')
        toast.success('Swap Complete', 'Your transaction has been processed')
      }
    } catch (err) {
      // Update swap history with failure
      if (currentSwapId.current) {
        updateSwapHistory(currentSwapId.current, { status: 'failed' })
      }

      logger.error('Swap execution failed', err, 'useSwap')
      const { message, toastTitle } = getSwapErrorMessage(err)
      setError(message)
      setStatus('error')
      toast.error(toastTitle, message)
    }
  }, [client, isConnected, address, chain, walletType, isProductionMode, swapMode, addSwap, updateSwapHistory])

  // Generate explorer URL for settlement transaction (destination chain - e.g., NEAR)
  const explorerUrl = txHash && settlementChain
    ? getTransactionUrl(settlementChain, txHash)
    : null

  // Generate explorer URL for deposit transaction (source chain - e.g., Solana)
  const depositExplorerUrl = depositTxHash && txChain
    ? getTransactionUrl(txChain, depositTxHash)
    : null

  return {
    txHash,
    explorerUrl,
    depositTxHash,
    depositExplorerUrl,
    txChain,
    settlementChain,
    status,
    error,
    depositAddress,
    depositAmount,
    depositToken,
    viewingKey,
    swapId,
    execute,
    reset,
    cancel,
  }
}

/**
 * Get status message for display
 */
export function getStatusMessage(status: SwapStatus, isShielded: boolean): string {
  switch (status) {
    case 'confirming':
      return 'Preparing transaction...'
    case 'signing':
      return 'Please sign in your wallet...'
    case 'pending':
      return isShielded ? 'Shielding transaction...' : 'Processing...'
    case 'awaiting_deposit':
      return 'Awaiting deposit to swap address...'
    case 'processing':
      return 'Processing swap on NEAR...'
    case 'success':
      return 'Transaction complete!'
    case 'error':
      return 'Transaction failed'
    default:
      return ''
  }
}

/**
 * Parse swap error messages into user-friendly format
 */
function getSwapErrorMessage(err: unknown): { message: string; toastTitle: string } {
  if (!(err instanceof Error)) {
    return { message: 'Transaction failed', toastTitle: 'Transaction Failed' }
  }

  const message = err.message.toLowerCase()

  // User rejected the transaction
  if (message.includes('rejected') || message.includes('denied') || message.includes('cancelled')) {
    return {
      message: 'You rejected the transaction in your wallet',
      toastTitle: 'Transaction Rejected',
    }
  }

  // Insufficient balance
  if (message.includes('insufficient') || message.includes('not enough')) {
    return {
      message: 'Insufficient balance for this transaction',
      toastTitle: 'Insufficient Balance',
    }
  }

  // Quote expired
  if (message.includes('expired') || message.includes('stale')) {
    return {
      message: 'Quote has expired. Please get a new quote',
      toastTitle: 'Quote Expired',
    }
  }

  // Slippage too high
  if (message.includes('slippage') || message.includes('price')) {
    return {
      message: 'Price moved too much. Try increasing slippage tolerance',
      toastTitle: 'Price Changed',
    }
  }

  // Network error
  if (message.includes('network') || message.includes('timeout') || message.includes('connection')) {
    return {
      message: 'Network error. Please check your connection and try again',
      toastTitle: 'Network Error',
    }
  }

  // Transaction failed on-chain
  if (message.includes('reverted') || message.includes('failed')) {
    return {
      message: 'Transaction failed on the network. Please try again',
      toastTitle: 'Transaction Failed',
    }
  }

  // Gas estimation failed
  if (message.includes('gas')) {
    return {
      message: 'Failed to estimate gas. The transaction may fail',
      toastTitle: 'Gas Error',
    }
  }

  // Nonce error
  if (message.includes('nonce')) {
    return {
      message: 'Transaction nonce error. Please refresh and try again',
      toastTitle: 'Nonce Error',
    }
  }

  // Default
  return {
    message: err.message || 'Transaction failed',
    toastTitle: 'Transaction Failed',
  }
}
