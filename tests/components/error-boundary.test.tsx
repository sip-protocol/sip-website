import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '@/components/error-boundary'

// Component that throws an error
function ThrowError({ shouldThrow = false }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>Normal render</div>
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // Suppress console.error in tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('normal operation', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      )

      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('should render multiple children without errors', () => {
      render(
        <ErrorBoundary>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </ErrorBoundary>
      )

      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
      expect(screen.getByText('Child 3')).toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    it('should catch errors and display fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(
        screen.getByText('An unexpected error occurred. Please try refreshing the page.')
      ).toBeInTheDocument()
    })

    it('should display refresh button in fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      )

      expect(screen.getByRole('button', { name: 'Refresh Page' })).toBeInTheDocument()
    })

    it('should call onError callback when error occurs', () => {
      const onError = vi.fn()

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      )

      expect(onError).toHaveBeenCalledTimes(1)
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      )
    })

    it('should not call onError if error handler is not provided', () => {
      // Should not throw if onError is undefined
      expect(() => {
        render(
          <ErrorBoundary>
            <ThrowError shouldThrow />
          </ErrorBoundary>
        )
      }).not.toThrow()
    })
  })

  describe('custom fallback', () => {
    it('should render custom fallback when provided', () => {
      const customFallback = <div>Custom error message</div>

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      )

      expect(screen.getByText('Custom error message')).toBeInTheDocument()
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
    })

    it('should use default fallback when custom fallback is not provided', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })

  describe('error details in development', () => {
    const originalEnv = process.env.NODE_ENV

    afterEach(() => {
      // Restore by setting descriptor
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        writable: true,
        enumerable: true,
        configurable: true,
      })
    })

    it('should show error details in development mode', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        enumerable: true,
        configurable: true,
      })

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      )

      const details = screen.getByText('Error details (dev only)')
      expect(details).toBeInTheDocument()
    })

    it('should not show error details in production mode', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        enumerable: true,
        configurable: true,
      })

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      )

      const details = screen.queryByText('Error details (dev only)')
      expect(details).not.toBeInTheDocument()
    })
  })

  describe('nested error boundaries', () => {
    it('should allow nested error boundaries', () => {
      render(
        <ErrorBoundary fallback={<div>Outer fallback</div>}>
          <ErrorBoundary fallback={<div>Inner fallback</div>}>
            <ThrowError shouldThrow />
          </ErrorBoundary>
        </ErrorBoundary>
      )

      // Inner boundary should catch the error
      expect(screen.getByText('Inner fallback')).toBeInTheDocument()
      expect(screen.queryByText('Outer fallback')).not.toBeInTheDocument()
    })

    it('should propagate to outer boundary if inner has no fallback', () => {
      function InnerThrow() {
        return (
          <ErrorBoundary fallback={<div>Inner fallback</div>}>
            <div>Inner content</div>
          </ErrorBoundary>
        )
      }

      // Outer boundary with ThrowError
      render(
        <ErrorBoundary fallback={<div>Outer fallback</div>}>
          <ThrowError shouldThrow />
          <InnerThrow />
        </ErrorBoundary>
      )

      expect(screen.getByText('Outer fallback')).toBeInTheDocument()
    })
  })
})
