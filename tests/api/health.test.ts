import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, HEAD } from '@/app/api/health/route'

// Mock package.json
vi.mock('../../../../package.json', () => ({
  default: {
    version: '0.0.1',
    name: 'sip-website',
  },
}))

describe('/api/health', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET endpoint', () => {
    it('should return 200 status code for healthy service', async () => {
      const response = await GET()

      expect(response.status).toBe(200)
    })

    it('should return correct health check structure', async () => {
      const response = await GET()
      const data = await response.json()

      expect(data).toHaveProperty('status')
      expect(data).toHaveProperty('timestamp')
      expect(data).toHaveProperty('version')
      expect(data).toHaveProperty('service')
    })

    it('should return status "ok" when healthy', async () => {
      const response = await GET()
      const data = await response.json()

      expect(data.status).toBe('ok')
    })

    it('should return service name', async () => {
      const response = await GET()
      const data = await response.json()

      expect(data.service).toBe('sip-website')
    })

    it('should return version from package.json', async () => {
      const response = await GET()
      const data = await response.json()

      expect(data.version).toBe('0.0.1')
    })

    it('should return valid ISO 8601 timestamp', async () => {
      const response = await GET()
      const data = await response.json()

      expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      expect(new Date(data.timestamp).toString()).not.toBe('Invalid Date')
    })

    it('should return recent timestamp (within last second)', async () => {
      const before = new Date()
      const response = await GET()
      const after = new Date()
      const data = await response.json()

      const timestamp = new Date(data.timestamp)
      expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('should return Content-Type application/json', async () => {
      const response = await GET()

      expect(response.headers.get('content-type')).toContain('application/json')
    })
  })

  describe('HEAD endpoint', () => {
    it('should return 200 status code', async () => {
      const response = await HEAD()

      expect(response.status).toBe(200)
    })

    it('should not return a body', async () => {
      const response = await HEAD()

      // HEAD responses should have no body
      expect(response.body).toBeNull()
    })

    it('should be lightweight for health checks', async () => {
      const start = performance.now()
      await HEAD()
      const duration = performance.now() - start

      // Should complete in less than 10ms
      expect(duration).toBeLessThan(10)
    })
  })

  describe('error handling', () => {
    it('should handle errors gracefully', async () => {
      // Mock an error scenario
      const originalDateToISOString = Date.prototype.toISOString
      vi.spyOn(Date.prototype, 'toISOString').mockImplementationOnce(() => {
        throw new Error('Timestamp generation failed')
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.status).toBe('degraded')
      expect(data).toHaveProperty('error')

      // Restore original implementation
      Date.prototype.toISOString = originalDateToISOString
    })

    it('should return error message in degraded state', async () => {
      // Mock an error
      vi.spyOn(Date.prototype, 'toISOString').mockImplementationOnce(() => {
        throw new Error('Test error')
      })

      const response = await GET()
      const data = await response.json()

      expect(data.error).toBe('Test error')
    })
  })

  describe('load balancer compatibility', () => {
    it('should return success code for load balancer health checks', async () => {
      const response = await GET()

      // Load balancers typically check for 2xx status codes
      expect(response.status).toBeGreaterThanOrEqual(200)
      expect(response.status).toBeLessThan(300)
    })

    it('should work with HEAD requests for minimal bandwidth', async () => {
      const response = await HEAD()

      expect(response.status).toBe(200)
      expect(response.body).toBeNull()
    })

    it('should respond quickly for load balancer timeouts', async () => {
      const start = performance.now()
      await GET()
      const duration = performance.now() - start

      // Should complete well within typical LB timeout (1-5 seconds)
      expect(duration).toBeLessThan(100)
    })
  })

  describe('monitoring integration', () => {
    it('should provide version for deployment tracking', async () => {
      const response = await GET()
      const data = await response.json()

      // Version should be a valid semver-like string
      expect(data.version).toMatch(/^\d+\.\d+\.\d+$/)
    })

    it('should provide service identifier for multi-service monitoring', async () => {
      const response = await GET()
      const data = await response.json()

      expect(data.service).toBe('sip-website')
    })

    it('should provide timestamp for time-series monitoring', async () => {
      const response = await GET()
      const data = await response.json()

      expect(data.timestamp).toBeTruthy()
      expect(typeof data.timestamp).toBe('string')
    })
  })
})
