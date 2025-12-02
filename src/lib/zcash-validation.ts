/**
 * Zcash Address Validation Utility
 *
 * Validates and identifies Zcash address types:
 * - Transparent (t-addr): t1/t3 prefix, less private
 * - Sapling (z-addr): zs prefix, shielded transactions
 * - Unified (UA): u1 prefix, supports multiple receivers
 *
 * @see https://zips.z.cash/zip-0316 (Unified Addresses)
 * @see https://zips.z.cash/zip-0321 (Payment Request URIs)
 */

export type ZcashAddressType = 'transparent' | 'sapling' | 'unified' | 'unknown'

export interface ZcashValidationResult {
  /** Whether the address is valid */
  isValid: boolean
  /** Type of address (transparent, sapling, unified, unknown) */
  type: ZcashAddressType
  /** Whether this is a testnet address */
  isTestnet: boolean
  /** Human-readable error message if invalid */
  error?: string
  /** Privacy level description */
  privacyNote?: string
}

// Base58 character set (no 0, O, I, l)
const BASE58_CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const BASE58_REGEX = new RegExp(`^[${BASE58_CHARS}]+$`)

// Bech32/Bech32m character set (lowercase alphanumeric, no 1, b, i, o)
const BECH32_CHARS = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'
const BECH32_REGEX = new RegExp(`^[${BECH32_CHARS}]+$`)

/**
 * Transparent address patterns
 * Mainnet: t1... (P2PKH, 35 chars) or t3... (P2SH, 35 chars)
 * Testnet: tm... (35 chars)
 */
function validateTransparent(address: string): ZcashValidationResult {
  const isMainnetP2PKH = /^t1[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{33}$/.test(address)
  const isMainnetP2SH = /^t3[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{33}$/.test(address)
  const isTestnet = /^tm[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{33}$/.test(address)

  if (isMainnetP2PKH || isMainnetP2SH) {
    return {
      isValid: true,
      type: 'transparent',
      isTestnet: false,
      privacyNote: 'Transparent addresses expose transaction details on-chain. Consider using a shielded address for privacy.',
    }
  }

  if (isTestnet) {
    return {
      isValid: true,
      type: 'transparent',
      isTestnet: true,
      privacyNote: 'Transparent addresses expose transaction details on-chain. Consider using a shielded address for privacy.',
    }
  }

  return {
    isValid: false,
    type: 'transparent',
    isTestnet: false,
    error: 'Invalid transparent address format',
  }
}

/**
 * Sapling address patterns (shielded z-addresses)
 * Mainnet: zs... (78 chars, Bech32)
 * Testnet: ztestsapling... (varies)
 */
function validateSapling(address: string): ZcashValidationResult {
  // Mainnet Sapling: zs1... (78 characters, Bech32 encoded)
  const isMainnetSapling = /^zs1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{75}$/.test(address.toLowerCase())

  // Testnet Sapling: ztestsapling1...
  const isTestnetSapling = /^ztestsapling1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]+$/.test(address.toLowerCase())

  if (isMainnetSapling) {
    return {
      isValid: true,
      type: 'sapling',
      isTestnet: false,
      privacyNote: 'Sapling addresses provide full transaction privacy. Sender, amount, and memo are encrypted.',
    }
  }

  if (isTestnetSapling) {
    return {
      isValid: true,
      type: 'sapling',
      isTestnet: true,
      privacyNote: 'Sapling addresses provide full transaction privacy. Sender, amount, and memo are encrypted.',
    }
  }

  return {
    isValid: false,
    type: 'sapling',
    isTestnet: false,
    error: 'Invalid Sapling address format. Expected 78 characters starting with zs1',
  }
}

/**
 * Unified address patterns (ZIP-316)
 * Mainnet: u1... (variable length, Bech32m)
 * Testnet: utest1...
 *
 * UAs can contain multiple receiver types (Orchard, Sapling, transparent)
 * Minimum length ~50 chars for a single receiver, up to ~200+ for multiple
 */
function validateUnified(address: string): ZcashValidationResult {
  const lowerAddr = address.toLowerCase()

  // Mainnet Unified: u1... (minimum ~60 chars for single Orchard receiver)
  const isMainnetUnified = lowerAddr.startsWith('u1') &&
    lowerAddr.length >= 60 &&
    lowerAddr.length <= 250 &&
    BECH32_REGEX.test(lowerAddr.slice(2))

  // Testnet Unified: utest1...
  const isTestnetUnified = lowerAddr.startsWith('utest1') &&
    lowerAddr.length >= 65 &&
    BECH32_REGEX.test(lowerAddr.slice(6))

  if (isMainnetUnified) {
    return {
      isValid: true,
      type: 'unified',
      isTestnet: false,
      privacyNote: 'Unified addresses support multiple receiver types with automatic privacy selection. Best privacy when sender also uses Unified Addresses.',
    }
  }

  if (isTestnetUnified) {
    return {
      isValid: true,
      type: 'unified',
      isTestnet: true,
      privacyNote: 'Unified addresses support multiple receiver types with automatic privacy selection.',
    }
  }

  return {
    isValid: false,
    type: 'unified',
    isTestnet: false,
    error: 'Invalid Unified address format. Expected u1... with minimum 60 characters',
  }
}

/**
 * Validate a Zcash address and identify its type
 *
 * @param address - The Zcash address to validate
 * @returns Validation result with type and privacy information
 *
 * @example
 * ```ts
 * const result = validateZcashAddress('zs1...')
 * if (result.isValid) {
 *   console.log(`Valid ${result.type} address`)
 * } else {
 *   console.error(result.error)
 * }
 * ```
 */
export function validateZcashAddress(address: string): ZcashValidationResult {
  // Empty check
  if (!address || address.trim().length === 0) {
    return {
      isValid: false,
      type: 'unknown',
      isTestnet: false,
      error: 'Address is required',
    }
  }

  const trimmed = address.trim()
  const lowerAddr = trimmed.toLowerCase()

  // Detect type by prefix and validate
  if (trimmed.startsWith('t1') || trimmed.startsWith('t3') || trimmed.startsWith('tm')) {
    return validateTransparent(trimmed)
  }

  if (lowerAddr.startsWith('zs1') || lowerAddr.startsWith('ztestsapling')) {
    return validateSapling(trimmed)
  }

  if (lowerAddr.startsWith('u1') || lowerAddr.startsWith('utest1')) {
    return validateUnified(trimmed)
  }

  // Unknown format - provide helpful guidance
  return {
    isValid: false,
    type: 'unknown',
    isTestnet: false,
    error: 'Invalid Zcash address. Expected t1/t3 (transparent), zs1 (sapling), or u1 (unified)',
  }
}

/**
 * Check if an address is a privacy-preserving type (sapling or unified)
 */
export function isShieldedAddress(address: string): boolean {
  const result = validateZcashAddress(address)
  return result.isValid && (result.type === 'sapling' || result.type === 'unified')
}

/**
 * Get address type display name
 */
export function getAddressTypeLabel(type: ZcashAddressType): string {
  switch (type) {
    case 'transparent':
      return 'Transparent (t-addr)'
    case 'sapling':
      return 'Sapling (z-addr)'
    case 'unified':
      return 'Unified Address'
    default:
      return 'Unknown'
  }
}

/**
 * Get privacy level color class for UI
 */
export function getPrivacyColorClass(type: ZcashAddressType): string {
  switch (type) {
    case 'transparent':
      return 'text-orange-400' // Warning color - less private
    case 'sapling':
      return 'text-green-400' // Good - full privacy
    case 'unified':
      return 'text-purple-400' // Best - modern standard
    default:
      return 'text-gray-400'
  }
}
