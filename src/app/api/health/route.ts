import { NextResponse } from 'next/server'
import packageJson from '../../../../package.json'

/**
 * Health Check API Endpoint
 *
 * Lightweight endpoint for load balancer health checks and monitoring.
 * Returns service status, timestamp, and version information.
 *
 * Usage:
 * - Load balancers: Check if service is responsive (200 = healthy)
 * - Monitoring: Track service availability and version deployments
 * - CI/CD: Verify deployment success
 */

export async function GET() {
  try {
    // Basic health check - service is running
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: packageJson.version,
      service: 'sip-website',
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    // If we can reach this code, service is partially functional
    const health = {
      status: 'degraded',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      service: 'sip-website',
    }

    return NextResponse.json(health, { status: 503 })
  }
}

// Support HEAD requests for lightweight checks
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
