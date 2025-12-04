import { NextRequest, NextResponse } from 'next/server'
import { ZcashRPCClient } from '@sip-protocol/sdk'
import { zcashRateLimiter, getClientIp } from '@/lib/rate-limiter'

/**
 * Zcash RPC Proxy API
 *
 * Proxies RPC calls to zcashd node, keeping credentials server-side.
 * Supports: getbalance, getaddress, getblockcount, validateaddress
 *
 * Enable by setting ZCASH_RPC_* environment variables.
 *
 * Rate limit: 10 requests per minute per IP
 */

// Allowed methods for security (whitelist approach)
const ALLOWED_METHODS = [
  'getbalance',
  'getaddress',
  'getblockcount',
  'getblockchaininfo',
  'validateaddress',
  'listaddresses',
] as const

type AllowedMethod = typeof ALLOWED_METHODS[number]

interface ZcashRPCRequestBody {
  method: AllowedMethod
  params?: unknown[]
}

// Lazy-initialized client (created on first request)
let rpcClient: ZcashRPCClient | null = null

function getClient(): ZcashRPCClient | null {
  // Check if already initialized
  if (rpcClient) return rpcClient

  // Check for required environment variables
  const host = process.env.ZCASH_RPC_HOST
  const username = process.env.ZCASH_RPC_USER
  const password = process.env.ZCASH_RPC_PASS

  if (!host || !username || !password) {
    return null
  }

  const port = process.env.ZCASH_RPC_PORT ? parseInt(process.env.ZCASH_RPC_PORT, 10) : undefined
  const testnet = process.env.ZCASH_RPC_TESTNET === 'true'

  rpcClient = new ZcashRPCClient({
    host,
    port,
    username,
    password,
    testnet,
    timeout: 15000,
    retries: 2,
  })

  return rpcClient
}

/**
 * GET /api/zcash - Check if Zcash RPC is configured
 */
export async function GET(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request)
  if (!zcashRateLimiter.check(clientIp)) {
    const resetTime = zcashRateLimiter.getResetTime(clientIp)
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        resetAt: resetTime
      },
      {
        status: 429,
        headers: {
          'Retry-After': resetTime ? Math.ceil((resetTime - Date.now()) / 1000).toString() : '60'
        }
      }
    )
  }

  const client = getClient()

  if (!client) {
    return NextResponse.json({
      configured: false,
      message: 'Zcash RPC not configured. Set ZCASH_RPC_* environment variables.',
    })
  }

  // Try to get block count to verify connection
  try {
    const blockCount = await client.getBlockCount()
    const info = await client.getBlockchainInfo()

    return NextResponse.json({
      configured: true,
      connected: true,
      testnet: client.isTestnet,
      blockHeight: blockCount,
      chain: info.chain,
    })
  } catch (error) {
    return NextResponse.json({
      configured: true,
      connected: false,
      error: error instanceof Error ? error.message : 'Connection failed',
    })
  }
}

/**
 * POST /api/zcash - Execute RPC method
 */
export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request)
  if (!zcashRateLimiter.check(clientIp)) {
    const resetTime = zcashRateLimiter.getResetTime(clientIp)
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        resetAt: resetTime
      },
      {
        status: 429,
        headers: {
          'Retry-After': resetTime ? Math.ceil((resetTime - Date.now()) / 1000).toString() : '60'
        }
      }
    )
  }

  const client = getClient()

  if (!client) {
    return NextResponse.json(
      { error: 'Zcash RPC not configured' },
      { status: 503 }
    )
  }

  let body: ZcashRPCRequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { method, params = [] } = body

  // Validate method is allowed
  if (!ALLOWED_METHODS.includes(method)) {
    return NextResponse.json(
      { error: `Method '${method}' not allowed` },
      { status: 403 }
    )
  }

  try {
    let result: unknown

    switch (method) {
      case 'getbalance': {
        // Get balance for account 0 by default
        const account = typeof params[0] === 'number' ? params[0] : 0
        const balance = await client.getAccountBalance(account)
        result = balance
        break
      }

      case 'getaddress': {
        // Get or create address for account
        const account = typeof params[0] === 'number' ? params[0] : 0
        const address = await client.getAddressForAccount(account)
        result = address
        break
      }

      case 'getblockcount': {
        result = await client.getBlockCount()
        break
      }

      case 'getblockchaininfo': {
        result = await client.getBlockchainInfo()
        break
      }

      case 'validateaddress': {
        if (typeof params[0] !== 'string') {
          return NextResponse.json(
            { error: 'Address parameter required' },
            { status: 400 }
          )
        }
        result = await client.validateAddress(params[0])
        break
      }

      case 'listaddresses': {
        result = await client.listAddresses()
        break
      }
    }

    return NextResponse.json({ result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'RPC call failed'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
