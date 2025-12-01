/**
 * Wallet Detection Utilities
 *
 * Detects multiple wallet extensions and potential conflicts
 * to provide better UX for users with multiple wallets installed.
 */

// Extend Window interface for wallet providers
// Note: window.near is typed by @near-wallet-selector packages
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      isPhantom?: boolean
      isCoinbaseWallet?: boolean
      isBraveWallet?: boolean
      isRabby?: boolean
      providers?: Array<{
        isMetaMask?: boolean
        isPhantom?: boolean
        isCoinbaseWallet?: boolean
      }>
    }
    solana?: {
      isPhantom?: boolean
      isSolflare?: boolean
      isBackpack?: boolean
      isGlow?: boolean
    }
  }
}

export interface WalletConflictInfo {
  hasConflict: boolean
  evmWallets: string[]
  solanaWallets: string[]
  nearWallets: string[]
  message: string | null
}

/**
 * Detect all installed EVM wallet extensions
 */
export function detectEvmWallets(): string[] {
  if (typeof window === 'undefined') return []

  const wallets: string[] = []
  const ethereum = window.ethereum

  if (!ethereum) return wallets

  // Check for multiple providers (EIP-6963 style)
  if (ethereum.providers && Array.isArray(ethereum.providers)) {
    ethereum.providers.forEach((provider) => {
      if (provider.isMetaMask) wallets.push('MetaMask')
      if (provider.isPhantom) wallets.push('Phantom')
      if (provider.isCoinbaseWallet) wallets.push('Coinbase Wallet')
    })
  } else {
    // Single provider - check flags
    if (ethereum.isMetaMask) wallets.push('MetaMask')
    if (ethereum.isPhantom) wallets.push('Phantom')
    if (ethereum.isCoinbaseWallet) wallets.push('Coinbase Wallet')
    if (ethereum.isBraveWallet) wallets.push('Brave Wallet')
    if (ethereum.isRabby) wallets.push('Rabby')
  }

  return [...new Set(wallets)] // Remove duplicates
}

/**
 * Detect all installed Solana wallet extensions
 */
export function detectSolanaWallets(): string[] {
  if (typeof window === 'undefined') return []

  const wallets: string[] = []
  const solana = window.solana

  if (solana) {
    if (solana.isPhantom) wallets.push('Phantom')
    if (solana.isSolflare) wallets.push('Solflare')
    if (solana.isBackpack) wallets.push('Backpack')
    if (solana.isGlow) wallets.push('Glow')
  }

  return [...new Set(wallets)]
}

/**
 * Detect NEAR wallet availability
 */
export function detectNearWallets(): string[] {
  if (typeof window === 'undefined') return []

  // NEAR wallets are typically browser-based or mobile
  // We check for known wallet presence
  const wallets: string[] = []

  // NEAR wallets inject differently, so we just note if NEAR is available
  // Check using 'in' operator to avoid type conflicts with wallet-selector types
  if ('near' in window && window.near) {
    wallets.push('NEAR Wallet')
  }

  return wallets
}

/**
 * Check for wallet extension conflicts
 * Returns conflict info with helpful message
 */
export function detectWalletConflicts(): WalletConflictInfo {
  const evmWallets = detectEvmWallets()
  const solanaWallets = detectSolanaWallets()
  const nearWallets = detectNearWallets()

  const hasEvmConflict = evmWallets.length > 1
  const hasConflict = hasEvmConflict

  let message: string | null = null

  if (hasEvmConflict) {
    message = `Multiple EVM wallets detected (${evmWallets.join(', ')}). This may cause connection issues.`
  }

  return {
    hasConflict,
    evmWallets,
    solanaWallets,
    nearWallets,
    message,
  }
}

/**
 * Check if an error is related to wallet property conflicts
 */
export function isWalletConflictError(error: unknown): boolean {
  if (!(error instanceof Error)) return false

  const message = error.message.toLowerCase()
  return (
    message.includes('redefine property') ||
    message.includes('cannot redefine') ||
    message.includes('property ethereum') ||
    message.includes('already defined')
  )
}

/**
 * Get user-friendly error message for wallet conflicts
 */
export function getWalletConflictMessage(error: unknown): string {
  if (isWalletConflictError(error)) {
    return 'Multiple wallet extensions detected. Try disabling unused wallets or use only one at a time.'
  }
  return error instanceof Error ? error.message : 'Unknown wallet error'
}
