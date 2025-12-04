/**
 * Wallet Deposit Utilities
 *
 * Handles sending tokens to deposit addresses for real swap execution.
 * Used in production mode when NEXT_PUBLIC_REAL_SWAPS=true.
 */

import type { NetworkId } from './networks'
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from '@solana/web3.js'

// Dynamic SDK import to avoid SSR issues with WASM
const loadSDK = () => import('@sip-protocol/sdk')

// Solana RPC endpoints
// Use env var for custom RPC, fallback to Helius
const SOLANA_RPC = {
  devnet: 'https://api.devnet.solana.com',
  mainnet: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://mainnet.helius-rpc.com/?api-key=142fb48a-aa24-4083-99c8-249df5400b30',
}

export interface DepositParams {
  /** Chain to send from */
  chain: NetworkId
  /** Connected wallet type (phantom, metamask, etc.) */
  walletType: string
  /** Deposit address provided by 1Click API */
  depositAddress: string
  /** Amount to deposit (in base units as string) */
  amount: string
  /** Token symbol (SOL, ETH, etc.) - only native tokens supported for now */
  token: string
}

export interface DepositResult {
  /** Transaction hash */
  txHash: string
  /** Whether deposit was successful */
  success: boolean
  /** Error message if failed */
  error?: string
}

/**
 * Send tokens to a deposit address using the connected wallet
 *
 * This function recreates the wallet adapter and sends a transaction
 * to the deposit address. The wallet extension maintains the connection
 * state, so reconnection isn't required.
 *
 * @param params - Deposit parameters
 * @returns Transaction hash on success
 * @throws Error if transaction fails
 */
export async function sendDeposit(params: DepositParams): Promise<string> {
  const { chain, walletType, depositAddress, amount, token } = params

  if (chain === 'solana') {
    return sendSolanaDeposit(walletType, depositAddress, amount, token)
  } else if (chain === 'ethereum' || chain === 'arbitrum') {
    return sendEthereumDeposit(walletType, depositAddress, amount, token)
  } else if (chain === 'near') {
    return sendNearDeposit(depositAddress, amount, token)
  } else if (chain === 'zcash') {
    return sendZcashDeposit(depositAddress, amount, token)
  }

  throw new Error(`Unsupported chain for deposit: ${chain}`)
}

/**
 * Send SOL or SPL tokens to a deposit address
 *
 * Builds a proper Solana Transaction object for the SDK adapter.
 */
async function sendSolanaDeposit(
  walletType: string,
  depositAddress: string,
  amount: string,
  token: string
): Promise<string> {
  const sdk = await loadSDK()

  // Create adapter - will pick up existing wallet connection
  // Use mainnet-beta since 1Click API works on mainnet
  const adapter = sdk.createSolanaAdapter({
    wallet: walletType as 'phantom' | 'solflare' | 'backpack',
    cluster: 'mainnet-beta',
  })

  // Reconnect to pick up existing session
  await adapter.connect()

  if (!adapter.isConnected) {
    throw new Error('Failed to connect to Solana wallet')
  }

  // Only native SOL transfers supported for now
  if (token !== 'SOL') {
    throw new Error('Only native SOL deposits are currently supported')
  }

  // Get the sender's public key from the adapter
  // SDK uses `address` property getter, not getAddress() method
  const senderAddress = adapter.address
  if (!senderAddress) {
    throw new Error('No wallet address available')
  }

  // Convert addresses to PublicKey objects
  // SDK Solana adapter stores addresses in base58 format (not hex)
  const senderPubkey = new PublicKey(senderAddress)
  const recipientPubkey = new PublicKey(depositAddress)

  // Convert amount from lamports string to number
  const lamports = BigInt(amount)

  // Create connection to get recent blockhash (mainnet since 1Click uses mainnet)
  const connection = new Connection(SOLANA_RPC.mainnet, 'confirmed')
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')

  // Build the SOL transfer transaction
  const transaction = new Transaction({
    feePayer: senderPubkey,
    blockhash,
    lastValidBlockHeight,
  }).add(
    SystemProgram.transfer({
      fromPubkey: senderPubkey,
      toPubkey: recipientPubkey,
      lamports: lamports,
    })
  )

  // Sign and send via the SDK adapter
  // Pass the actual Transaction object, not a simple params object
  const receipt = await adapter.signAndSendTransaction({
    chain: 'solana',
    data: transaction,
    metadata: {
      sendOptions: {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      },
    },
  })

  if (!receipt.txHash) {
    throw new Error('Transaction failed - no hash returned')
  }

  // SDK returns txHash as base58 (Phantom) or hex (other wallets)
  return receipt.txHash
}

/**
 * Send ETH or ERC-20 tokens to a deposit address
 */
async function sendEthereumDeposit(
  walletType: string,
  depositAddress: string,
  amount: string,
  token: string
): Promise<string> {
  const sdk = await loadSDK()

  // Create adapter - will pick up existing wallet connection
  const adapter = sdk.createEthereumAdapter({
    wallet: walletType as 'metamask' | 'coinbase' | 'walletconnect',
    chainId: 1, // Ethereum mainnet
  })

  // Reconnect to pick up existing session
  await adapter.connect()

  if (!adapter.isConnected) {
    throw new Error('Failed to connect to Ethereum wallet')
  }

  // Only native ETH transfers supported for now
  if (token !== 'ETH') {
    throw new Error('Only native ETH deposits are currently supported')
  }

  // Build and send transfer transaction
  // For Ethereum, we send a native ETH transfer
  const receipt = await adapter.signAndSendTransaction({
    chain: 'ethereum',
    data: {
      to: depositAddress,
      value: `0x${BigInt(amount).toString(16)}`,
    },
  })

  if (!receipt.txHash) {
    throw new Error('Transaction failed - no hash returned')
  }

  return receipt.txHash
}

/**
 * Send NEAR tokens to a deposit address
 * Uses NEAR wallet selector for transaction signing
 */
async function sendNearDeposit(
  depositAddress: string,
  amount: string,
  token: string
): Promise<string> {
  // Only native NEAR transfers supported for now
  if (token !== 'NEAR') {
    throw new Error('Only native NEAR deposits are currently supported')
  }

  // Dynamic import to avoid SSR issues and circular dependencies
  const { sendNearTransaction } = await import('@/contexts/near-wallet-context')

  // sendNearTransaction expects amount in yoctoNEAR
  // The amount from 1Click API should already be in yoctoNEAR format
  return sendNearTransaction(depositAddress, amount)
}

/**
 * Send ZEC tokens to a deposit address
 * Zcash shielded transactions require a local node or zcashd wallet
 */
async function sendZcashDeposit(
  depositAddress: string,
  amount: string,
  token: string
): Promise<string> {
  // Zcash shielded deposits require zcashd node with wallet support
  // This is typically handled server-side or through a browser extension
  // For now, throw an informative error
  throw new Error(
    'Zcash shielded deposits require zcashd wallet integration. ' +
    'Use z_sendmany or z_shieldcoinbase via RPC for shielded transactions.'
  )
}

/**
 * Create a deposit callback function for useSwap hook
 *
 * This creates the onDepositRequired callback that the SDK expects
 * for production mode execution.
 *
 * @param chain - The source chain
 * @param walletType - The wallet type being used
 * @param token - The token being deposited
 */
export function createDepositCallback(
  chain: NetworkId,
  walletType: string,
  token: string
): (depositAddress: string, amount: string) => Promise<string> {
  return async (depositAddress: string, amount: string): Promise<string> => {
    return sendDeposit({
      chain,
      walletType,
      depositAddress,
      amount,
      token,
    })
  }
}
