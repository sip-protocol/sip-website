/**
 * Wallet Deposit Utilities
 *
 * Handles sending tokens to deposit addresses for real swap execution.
 * Used in production mode when NEXT_PUBLIC_REAL_SWAPS=true.
 */

import type { NetworkId } from './networks'

// Dynamic SDK import to avoid SSR issues with WASM
const loadSDK = () => import('@sip-protocol/sdk')

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
  } else if (chain === 'ethereum') {
    return sendEthereumDeposit(walletType, depositAddress, amount, token)
  } else if (chain === 'near') {
    return sendNearDeposit(depositAddress, amount, token)
  }

  throw new Error(`Unsupported chain for deposit: ${chain}`)
}

/**
 * Send SOL or SPL tokens to a deposit address
 */
async function sendSolanaDeposit(
  walletType: string,
  depositAddress: string,
  amount: string,
  token: string
): Promise<string> {
  const sdk = await loadSDK()

  // Create adapter - will pick up existing wallet connection
  const adapter = sdk.createSolanaAdapter({
    wallet: walletType as 'phantom' | 'solflare' | 'backpack',
    cluster: 'devnet', // Using devnet for testnet
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

  // Build transfer transaction
  // For Solana, we need to construct a native SOL transfer
  // The data field should contain the transaction parameters
  const receipt = await adapter.signAndSendTransaction({
    chain: 'solana',
    data: {
      to: depositAddress,
      lamports: amount,
    },
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

  // Solana returns base58-encoded signatures, we need to return as-is or convert
  // The SDK returns it as hex string prefixed with 0x
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
    chainId: 11155111, // Sepolia testnet
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
  // NEAR deposits would use the wallet selector
  // For now, throw an informative error
  throw new Error(
    'NEAR deposits require wallet selector integration. ' +
    'Please use a Solana or Ethereum wallet for production swaps.'
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
