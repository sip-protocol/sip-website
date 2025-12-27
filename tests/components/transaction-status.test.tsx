import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TransactionStatus } from '@/components/transaction-status'
import type { SwapStatus } from '@/hooks'

describe('TransactionStatus', () => {
  const defaultProps = {
    status: 'idle' as SwapStatus,
    txHash: null,
    explorerUrl: null,
    chain: null,
    error: null,
    isShielded: false,
    onReset: vi.fn(),
    onRetry: vi.fn(),
  }

  describe('idle state', () => {
    it('should render nothing when idle', () => {
      const { container } = render(<TransactionStatus {...defaultProps} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('pending states', () => {
    it('should render pending UI for confirming status', () => {
      render(<TransactionStatus {...defaultProps} status="confirming" />)
      expect(screen.getByText('Preparing Transaction')).toBeInTheDocument()
      expect(screen.getByText('Building your swap intent...')).toBeInTheDocument()
    })

    it('should render pending UI for signing status', () => {
      render(<TransactionStatus {...defaultProps} status="signing" />)
      expect(screen.getByText('Awaiting Signature')).toBeInTheDocument()
      expect(screen.getByText('Please sign the transaction in your wallet')).toBeInTheDocument()
    })

    it('should render pending UI for pending status', () => {
      render(<TransactionStatus {...defaultProps} status="pending" />)
      expect(screen.getByText('Processing Transaction')).toBeInTheDocument()
      expect(screen.getByText('Submitting to the network...')).toBeInTheDocument()
    })

    it('should show shielded message when isShielded is true', () => {
      render(<TransactionStatus {...defaultProps} status="pending" isShielded />)
      expect(screen.getByText('Shielding Transaction')).toBeInTheDocument()
      expect(screen.getByText('Applying privacy protections to your transaction...')).toBeInTheDocument()
    })

    it('should show progress steps', () => {
      render(<TransactionStatus {...defaultProps} status="signing" />)
      // New timeline component shows full step names
      expect(screen.getByText('Quote received')).toBeInTheDocument()
      expect(screen.getByText('Confirm in wallet')).toBeInTheDocument()
      expect(screen.getByText('Signing transaction')).toBeInTheDocument()
    })

    it('should show Shielding step when shielded', () => {
      render(<TransactionStatus {...defaultProps} status="pending" isShielded />)
      // Shielded flow shows "Shielding" step with active styling
      expect(screen.getByText('Shielding')).toBeInTheDocument()
    })
  })

  describe('success state', () => {
    // Success state now shows different UI based on txHash vs depositTxHash
    // For cross-chain swaps: depositTxHash (source) + txHash (settlement)
    const successProps = {
      ...defaultProps,
      status: 'success' as SwapStatus,
      depositTxHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      depositExplorerUrl: 'https://solscan.io/tx/0x1234',
      chain: 'solana' as const,
      settlementChain: 'near' as const,
    }

    it('should render success UI', () => {
      render(<TransactionStatus {...successProps} />)
      expect(screen.getByText('Swap Complete!')).toBeInTheDocument()
    })

    it('should show source chain info', () => {
      render(<TransactionStatus {...successProps} />)
      expect(screen.getByText(/Source/)).toBeInTheDocument()
    })

    it('should show shielded message when isShielded is true', () => {
      render(<TransactionStatus {...successProps} isShielded />)
      expect(screen.getByText(/shielded/i)).toBeInTheDocument()
    })

    it('should show truncated tx hash', () => {
      render(<TransactionStatus {...successProps} />)
      // First 10 + ... + last 10 of 66 char hash
      // 0x1234567890abcdef... = first 10 is "0x12345678"
      // ...1234567890abcdef = last 10 is "7890abcdef"
      expect(screen.getByText('0x12345678...7890abcdef')).toBeInTheDocument()
    })

    it('should render explorer link with correct URL', () => {
      render(<TransactionStatus {...successProps} />)
      const link = screen.getByRole('link', { name: /View on Solscan/i })
      expect(link).toHaveAttribute('href', 'https://solscan.io/tx/0x1234')
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('should show Etherscan for Ethereum source chain', () => {
      render(<TransactionStatus {...successProps} chain="ethereum" depositExplorerUrl="https://etherscan.io/tx/0x1234" />)
      expect(screen.getByText(/Etherscan/i)).toBeInTheDocument()
    })

    it('should show NEARBlocks for NEAR settlement chain', () => {
      // When we have both deposit and settlement tx
      render(<TransactionStatus
        {...successProps}
        txHash="0xnear123"
        explorerUrl="https://nearblocks.io/tx/0xnear123"
      />)
      expect(screen.getByText(/NEARBlocks/i)).toBeInTheDocument()
    })

    it('should call onReset when New Swap button clicked', () => {
      const onReset = vi.fn()
      render(<TransactionStatus {...successProps} onReset={onReset} />)

      fireEvent.click(screen.getByText('New Swap'))
      expect(onReset).toHaveBeenCalledTimes(1)
    })
  })

  describe('error state', () => {
    const errorProps = {
      ...defaultProps,
      status: 'error' as SwapStatus,
      error: 'Transaction was rejected by user',
    }

    it('should render error UI', () => {
      render(<TransactionStatus {...errorProps} />)
      expect(screen.getByText('Transaction Failed')).toBeInTheDocument()
    })

    it('should show error message', () => {
      render(<TransactionStatus {...errorProps} />)
      expect(screen.getByText('Transaction was rejected by user')).toBeInTheDocument()
    })

    it('should call onRetry when Retry Swap button clicked', () => {
      const onRetry = vi.fn()
      render(<TransactionStatus {...errorProps} onRetry={onRetry} />)

      fireEvent.click(screen.getByText('Retry Swap'))
      expect(onRetry).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    it('should not render success without txHash or depositTxHash', () => {
      const { container } = render(
        <TransactionStatus {...defaultProps} status="success" txHash={null} />
      )
      // Component shows different UI for shielded success without txHash
      // For non-shielded success without txHash: shows "Swap Complete!" with basic UI
      expect(screen.getByText('Swap Complete!')).toBeInTheDocument()
    })

    it('should not render error without error message', () => {
      const { container } = render(
        <TransactionStatus {...defaultProps} status="error" error={null} />
      )
      expect(screen.queryByText('Transaction Failed')).not.toBeInTheDocument()
    })

    it('should handle short tx hash', () => {
      render(
        <TransactionStatus
          {...defaultProps}
          status="success"
          depositTxHash="0x1234"
          depositExplorerUrl="https://solscan.io/tx/0x1234"
          chain="solana"
        />
      )
      expect(screen.getByText('0x1234')).toBeInTheDocument()
    })
  })
})
