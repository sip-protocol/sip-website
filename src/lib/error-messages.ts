/**
 * Centralized error messages with recovery actions
 *
 * Every error should have:
 * 1. What went wrong (clear description)
 * 2. Why it might have happened (likely cause)
 * 3. What to do next (actionable recovery)
 */

export type ErrorAction = 'retry' | 'refresh' | 'clear' | 'connect' | 'switch_network' | 'none'

export interface ErrorInfo {
  title: string
  description: string
  causes: string[]
  actions: Array<{
    label: string
    action: ErrorAction
  }>
}

export type ErrorCode =
  | 'QUOTE_FAILED'
  | 'QUOTE_EXPIRED'
  | 'QUOTE_UNAVAILABLE'
  | 'INSUFFICIENT_LIQUIDITY'
  | 'WALLET_REJECTED'
  | 'WALLET_NOT_CONNECTED'
  | 'WRONG_NETWORK'
  | 'INSUFFICIENT_BALANCE'
  | 'NETWORK_ERROR'
  | 'RATE_LIMITED'
  | 'UNSUPPORTED_PAIR'
  | 'AMOUNT_TOO_SMALL'
  | 'AMOUNT_TOO_LARGE'
  | 'SLIPPAGE_TOO_HIGH'
  | 'TRANSACTION_FAILED'
  | 'GAS_ERROR'
  | 'UNKNOWN'

export const ERROR_MESSAGES: Record<ErrorCode, ErrorInfo> = {
  QUOTE_FAILED: {
    title: 'Quote unavailable',
    description: "We couldn't get a quote for this pair.",
    causes: ['Low liquidity', 'Network congestion', 'Pair not supported'],
    actions: [
      { label: 'Try again', action: 'retry' },
      { label: 'Try different amount', action: 'clear' },
    ],
  },

  QUOTE_EXPIRED: {
    title: 'Quote expired',
    description: 'This quote is no longer valid.',
    causes: ['Quotes expire after ~1 minute', 'Market prices changed'],
    actions: [{ label: 'Get new quote', action: 'refresh' }],
  },

  QUOTE_UNAVAILABLE: {
    title: 'No quotes available',
    description: 'No solvers are offering quotes for this swap.',
    causes: ['Low liquidity for this pair', 'Amount too small/large'],
    actions: [
      { label: 'Try different amount', action: 'clear' },
      { label: 'Retry', action: 'retry' },
    ],
  },

  INSUFFICIENT_LIQUIDITY: {
    title: 'Insufficient liquidity',
    description: 'Not enough liquidity to complete this swap.',
    causes: ['Large trade amount', 'Low pool liquidity'],
    actions: [
      { label: 'Try smaller amount', action: 'clear' },
      { label: 'Retry', action: 'retry' },
    ],
  },

  WALLET_REJECTED: {
    title: 'Transaction cancelled',
    description: 'You declined the transaction in your wallet.',
    causes: ['Clicked reject', 'Wallet timed out'],
    actions: [{ label: 'Try again', action: 'retry' }],
  },

  WALLET_NOT_CONNECTED: {
    title: 'Wallet not connected',
    description: 'Please connect your wallet to continue.',
    causes: ['Wallet disconnected', 'Session expired'],
    actions: [{ label: 'Connect wallet', action: 'connect' }],
  },

  WRONG_NETWORK: {
    title: 'Wrong network',
    description: 'Please switch to the correct network.',
    causes: ['Connected to different chain'],
    actions: [{ label: 'Switch network', action: 'switch_network' }],
  },

  INSUFFICIENT_BALANCE: {
    title: 'Insufficient balance',
    description: "You don't have enough tokens for this swap.",
    causes: ['Balance too low', 'Need gas for transaction'],
    actions: [
      { label: 'Use max amount', action: 'clear' },
      { label: 'Retry', action: 'retry' },
    ],
  },

  NETWORK_ERROR: {
    title: 'Connection issue',
    description: "Couldn't reach the network.",
    causes: ['Internet connection', 'Network congestion', 'RPC issues'],
    actions: [
      { label: 'Check connection', action: 'none' },
      { label: 'Retry', action: 'retry' },
    ],
  },

  RATE_LIMITED: {
    title: 'Too many requests',
    description: 'Please wait a moment before trying again.',
    causes: ['Too many quote requests'],
    actions: [{ label: 'Wait and retry', action: 'retry' }],
  },

  UNSUPPORTED_PAIR: {
    title: 'Pair not supported',
    description: 'This trading pair is not available.',
    causes: ['Token not listed', 'Route not available'],
    actions: [{ label: 'Try different tokens', action: 'clear' }],
  },

  AMOUNT_TOO_SMALL: {
    title: 'Amount too small',
    description: 'The amount is below the minimum.',
    causes: ['Below minimum swap amount'],
    actions: [{ label: 'Increase amount', action: 'clear' }],
  },

  AMOUNT_TOO_LARGE: {
    title: 'Amount too large',
    description: 'The amount exceeds the maximum.',
    causes: ['Above maximum swap amount', 'Insufficient liquidity'],
    actions: [{ label: 'Reduce amount', action: 'clear' }],
  },

  SLIPPAGE_TOO_HIGH: {
    title: 'Price changed',
    description: 'Price moved too much since quote.',
    causes: ['Market volatility', 'Large trade impact'],
    actions: [
      { label: 'Get new quote', action: 'refresh' },
      { label: 'Retry', action: 'retry' },
    ],
  },

  TRANSACTION_FAILED: {
    title: 'Transaction failed',
    description: 'The transaction failed on the network.',
    causes: ['Contract error', 'Slippage exceeded', 'Gas issues'],
    actions: [
      { label: 'Get new quote', action: 'refresh' },
      { label: 'Retry', action: 'retry' },
    ],
  },

  GAS_ERROR: {
    title: 'Gas estimation failed',
    description: 'Could not estimate gas for this transaction.',
    causes: ['Contract may revert', 'Insufficient gas'],
    actions: [{ label: 'Retry', action: 'retry' }],
  },

  UNKNOWN: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred.',
    causes: ['Unknown issue'],
    actions: [{ label: 'Retry', action: 'retry' }],
  },
}

/**
 * Parse error message and return structured error info
 */
export function parseError(err: unknown): { code: ErrorCode; info: ErrorInfo; originalMessage?: string } {
  if (!(err instanceof Error)) {
    return { code: 'UNKNOWN', info: ERROR_MESSAGES.UNKNOWN }
  }

  const message = err.message.toLowerCase()
  let code: ErrorCode = 'UNKNOWN'

  // Quote errors
  if (message.includes('expired') || message.includes('stale')) {
    code = 'QUOTE_EXPIRED'
  } else if (message.includes('no quotes') || message.includes('unavailable')) {
    code = 'QUOTE_UNAVAILABLE'
  } else if (message.includes('liquidity') || message.includes('insufficient')) {
    if (message.includes('balance')) {
      code = 'INSUFFICIENT_BALANCE'
    } else {
      code = 'INSUFFICIENT_LIQUIDITY'
    }
  }
  // Wallet errors
  else if (message.includes('rejected') || message.includes('denied') || message.includes('cancelled')) {
    code = 'WALLET_REJECTED'
  } else if (message.includes('not connected') || message.includes('connect')) {
    code = 'WALLET_NOT_CONNECTED'
  } else if (message.includes('wrong network') || message.includes('switch')) {
    code = 'WRONG_NETWORK'
  }
  // Network errors
  else if (message.includes('network') || message.includes('timeout') || message.includes('fetch') || message.includes('connection')) {
    code = 'NETWORK_ERROR'
  } else if (message.includes('rate limit') || message.includes('too many')) {
    code = 'RATE_LIMITED'
  }
  // Validation errors
  else if (message.includes('unsupported') || message.includes('invalid')) {
    code = 'UNSUPPORTED_PAIR'
  } else if (message.includes('minimum') || message.includes('too small')) {
    code = 'AMOUNT_TOO_SMALL'
  } else if (message.includes('maximum') || message.includes('too large')) {
    code = 'AMOUNT_TOO_LARGE'
  }
  // Transaction errors
  else if (message.includes('slippage') || message.includes('price')) {
    code = 'SLIPPAGE_TOO_HIGH'
  } else if (message.includes('reverted') || message.includes('failed')) {
    code = 'TRANSACTION_FAILED'
  } else if (message.includes('gas')) {
    code = 'GAS_ERROR'
  }

  return {
    code,
    info: ERROR_MESSAGES[code],
    originalMessage: err.message,
  }
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(err: unknown): string {
  const { info } = parseError(err)
  return info.description
}

/**
 * Get error title
 */
export function getErrorTitle(err: unknown): string {
  const { info } = parseError(err)
  return info.title
}
