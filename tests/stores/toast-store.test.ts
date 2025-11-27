import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useToastStore, toast } from '@/stores/toast-store'

describe('Toast Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useToastStore.setState({ toasts: [] })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('addToast', () => {
    it('should add a toast to the store', () => {
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Test Toast',
        message: 'Test message',
      })

      const { toasts } = useToastStore.getState()
      expect(toasts).toHaveLength(1)
      expect(toasts[0].title).toBe('Test Toast')
      expect(toasts[0].message).toBe('Test message')
      expect(toasts[0].type).toBe('success')
    })

    it('should generate unique IDs for toasts', () => {
      useToastStore.getState().addToast({ type: 'info', title: 'Toast 1' })
      useToastStore.getState().addToast({ type: 'info', title: 'Toast 2' })

      const { toasts } = useToastStore.getState()
      expect(toasts).toHaveLength(2)
      expect(toasts[0].id).not.toBe(toasts[1].id)
    })

    it('should auto-remove toast after duration', () => {
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Auto Remove',
        duration: 3000,
      })

      expect(useToastStore.getState().toasts).toHaveLength(1)

      vi.advanceTimersByTime(3000)

      expect(useToastStore.getState().toasts).toHaveLength(0)
    })

    it('should not auto-remove toast when duration is 0', () => {
      useToastStore.getState().addToast({
        type: 'info',
        title: 'Persistent',
        duration: 0,
      })

      vi.advanceTimersByTime(10000)

      expect(useToastStore.getState().toasts).toHaveLength(1)
    })

    it('should use default duration of 5000ms', () => {
      useToastStore.getState().addToast({
        type: 'info',
        title: 'Default Duration',
      })

      expect(useToastStore.getState().toasts).toHaveLength(1)

      vi.advanceTimersByTime(4999)
      expect(useToastStore.getState().toasts).toHaveLength(1)

      vi.advanceTimersByTime(1)
      expect(useToastStore.getState().toasts).toHaveLength(0)
    })
  })

  describe('removeToast', () => {
    it('should remove a specific toast by ID', () => {
      useToastStore.getState().addToast({ type: 'info', title: 'Toast 1' })
      useToastStore.getState().addToast({ type: 'info', title: 'Toast 2' })

      const { toasts } = useToastStore.getState()
      const toastToRemove = toasts[0]

      useToastStore.getState().removeToast(toastToRemove.id)

      const updated = useToastStore.getState().toasts
      expect(updated).toHaveLength(1)
      expect(updated[0].title).toBe('Toast 2')
    })

    it('should not throw when removing non-existent toast', () => {
      expect(() => {
        useToastStore.getState().removeToast('non-existent-id')
      }).not.toThrow()
    })
  })

  describe('clearToasts', () => {
    it('should remove all toasts', () => {
      useToastStore.getState().addToast({ type: 'info', title: 'Toast 1' })
      useToastStore.getState().addToast({ type: 'info', title: 'Toast 2' })
      useToastStore.getState().addToast({ type: 'info', title: 'Toast 3' })

      expect(useToastStore.getState().toasts).toHaveLength(3)

      useToastStore.getState().clearToasts()

      expect(useToastStore.getState().toasts).toHaveLength(0)
    })
  })

  describe('toast helpers', () => {
    it('toast.success should add a success toast', () => {
      toast.success('Success Title', 'Success message')

      const { toasts } = useToastStore.getState()
      expect(toasts).toHaveLength(1)
      expect(toasts[0].type).toBe('success')
      expect(toasts[0].title).toBe('Success Title')
      expect(toasts[0].message).toBe('Success message')
    })

    it('toast.error should add an error toast with longer duration', () => {
      toast.error('Error Title', 'Error message')

      const { toasts } = useToastStore.getState()
      expect(toasts).toHaveLength(1)
      expect(toasts[0].type).toBe('error')

      // Error toasts should stay longer (8000ms)
      vi.advanceTimersByTime(7999)
      expect(useToastStore.getState().toasts).toHaveLength(1)

      vi.advanceTimersByTime(1)
      expect(useToastStore.getState().toasts).toHaveLength(0)
    })

    it('toast.warning should add a warning toast', () => {
      toast.warning('Warning Title')

      const { toasts } = useToastStore.getState()
      expect(toasts).toHaveLength(1)
      expect(toasts[0].type).toBe('warning')
    })

    it('toast.info should add an info toast', () => {
      toast.info('Info Title')

      const { toasts } = useToastStore.getState()
      expect(toasts).toHaveLength(1)
      expect(toasts[0].type).toBe('info')
    })
  })

  describe('multiple toasts', () => {
    it('should maintain FIFO order', () => {
      toast.info('First')
      toast.info('Second')
      toast.info('Third')

      const { toasts } = useToastStore.getState()
      expect(toasts[0].title).toBe('First')
      expect(toasts[1].title).toBe('Second')
      expect(toasts[2].title).toBe('Third')
    })

    it('should handle mixed toast types', () => {
      toast.success('Success')
      toast.error('Error')
      toast.warning('Warning')
      toast.info('Info')

      const { toasts } = useToastStore.getState()
      expect(toasts.map(t => t.type)).toEqual(['success', 'error', 'warning', 'info'])
    })
  })
})
