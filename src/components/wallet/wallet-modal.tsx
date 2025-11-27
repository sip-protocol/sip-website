'use client'

import { useEffect, useState } from 'react'
import { X, ExternalLink, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  detectSolanaWallets,
  detectEthereumWallets,
  createSolanaAdapter,
  createEthereumAdapter,
  type SolanaWalletName,
  type EthereumWalletName,
} from '@sip-protocol/sdk'
import {
  useWalletStore,
  toast,
  type WalletType,
  type ChainType,
  WALLET_INFO,
} from '@/stores'

type TabType = 'solana' | 'ethereum'

export function WalletModal() {
  const {
    isModalOpen,
    closeModal,
    setConnecting,
    connect,
    setAvailableWallets,
  } = useWalletStore()

  const [activeTab, setActiveTab] = useState<TabType>('solana')
  const [detectedWallets, setDetectedWallets] = useState<{
    solana: SolanaWalletName[]
    ethereum: EthereumWalletName[]
  }>({ solana: [], ethereum: [] })
  const [error, setError] = useState<string | null>(null)

  // Detect wallets on mount
  useEffect(() => {
    if (isModalOpen) {
      const solanaWallets = detectSolanaWallets()
      const ethereumWallets = detectEthereumWallets()
      setDetectedWallets({ solana: solanaWallets, ethereum: ethereumWallets })
      setAvailableWallets({
        solana: solanaWallets as WalletType[],
        ethereum: ethereumWallets as WalletType[],
      })
      setError(null)
    }
  }, [isModalOpen, setAvailableWallets])

  const handleConnect = async (walletType: WalletType, chain: ChainType) => {
    setError(null)
    setConnecting(true)

    const walletName = WALLET_INFO[walletType].name

    try {
      if (chain === 'solana') {
        const adapter = createSolanaAdapter({
          wallet: walletType as SolanaWalletName,
          cluster: 'devnet',
        })

        await adapter.connect()
        // Use publicKey (hex) for consistency across chains
        const hexAddress = adapter.publicKey

        if (hexAddress) {
          connect(walletType, chain, hexAddress as `0x${string}`)
          toast.success('Wallet Connected', `Connected to ${walletName} on Solana Devnet`)
        }
      } else {
        const adapter = createEthereumAdapter({
          wallet: walletType as EthereumWalletName,
          chainId: 11155111, // Sepolia testnet
        })

        await adapter.connect()
        const address = adapter.address

        if (address) {
          connect(walletType, chain, address as `0x${string}`)
          toast.success('Wallet Connected', `Connected to ${walletName} on Sepolia`)
        }
      }
    } catch (err) {
      console.error('Wallet connection failed:', err)
      const errorMessage = getWalletErrorMessage(err)
      setError(errorMessage)
      toast.error('Connection Failed', errorMessage)
      setConnecting(false)
    }
  }

  // Parse wallet-specific error messages
  function getWalletErrorMessage(err: unknown): string {
    if (!(err instanceof Error)) return 'Failed to connect wallet'

    const message = err.message.toLowerCase()

    // User rejected
    if (message.includes('rejected') || message.includes('denied') || message.includes('cancelled')) {
      return 'Connection request was rejected'
    }

    // Wallet locked
    if (message.includes('locked')) {
      return 'Wallet is locked. Please unlock and try again'
    }

    // Already processing
    if (message.includes('pending') || message.includes('already')) {
      return 'A connection request is already pending'
    }

    // Not installed (shouldn't happen but just in case)
    if (message.includes('not found') || message.includes('not installed')) {
      return 'Wallet extension not found'
    }

    // Network error
    if (message.includes('network') || message.includes('timeout')) {
      return 'Network error. Please check your connection'
    }

    return err.message || 'Failed to connect wallet'
  }

  const solanaWallets: WalletType[] = ['phantom', 'solflare']
  const ethereumWallets: WalletType[] = ['metamask', 'walletconnect']

  const renderWalletList = (wallets: WalletType[], chain: ChainType) => {
    const detected = chain === 'solana' ? detectedWallets.solana : detectedWallets.ethereum

    return (
      <div className="space-y-2">
        {wallets.map((walletType) => {
          const info = WALLET_INFO[walletType]
          const isDetected = detected.includes(walletType as never)

          return (
            <button
              key={walletType}
              onClick={() => isDetected ? handleConnect(walletType, chain) : window.open(info.downloadUrl, '_blank')}
              className="flex items-center justify-between w-full p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-700 flex items-center justify-center overflow-hidden">
                  {/* Wallet icon placeholder - using initials */}
                  <span className="text-lg font-bold text-gray-300">
                    {info.name.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-white">{info.name}</div>
                  <div className="text-xs text-gray-400">
                    {isDetected ? 'Detected' : 'Not installed'}
                  </div>
                </div>
              </div>

              {isDetected ? (
                <div className="px-3 py-1 text-xs font-medium text-purple-400 bg-purple-500/10 rounded-full">
                  Connect
                </div>
              ) : (
                <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-gray-400" />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">Connect Wallet</h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-800">
                <button
                  onClick={() => setActiveTab('solana')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'solana'
                      ? 'text-white border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Solana
                </button>
                <button
                  onClick={() => setActiveTab('ethereum')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'ethereum'
                      ? 'text-white border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Ethereum
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {activeTab === 'solana' && renderWalletList(solanaWallets, 'solana')}
                {activeTab === 'ethereum' && renderWalletList(ethereumWallets, 'ethereum')}

                {/* Info */}
                <p className="mt-4 text-xs text-center text-gray-500">
                  By connecting, you agree to our Terms of Service
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
