'use client'

import { useEffect, useState } from 'react'
import { X, ExternalLink, AlertCircle, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
// Types only - no runtime SDK import at module level to avoid WASM issues
import type { SolanaWalletName, EthereumWalletName, HardwareWalletType } from '@sip-protocol/sdk'

// Dynamic SDK import to avoid WASM loading during SSG
const loadSDK = () => import('@sip-protocol/sdk')
import {
  useWalletStore,
  toast,
  type WalletType,
  type ChainType,
  WALLET_INFO,
} from '@/stores'
import { useNearWalletContext } from '@/contexts'
import {
  detectWalletConflicts,
  isWalletConflictError,
  type WalletConflictInfo,
} from '@/lib/wallet-detection'

type TabType = 'solana' | 'ethereum' | 'near' | 'hardware'

export function WalletModal() {
  const {
    isModalOpen,
    closeModal,
    setConnecting,
    connect,
    setAvailableWallets,
  } = useWalletStore()

  // NEAR wallet context (initialized in providers.tsx)
  const nearWallet = useNearWalletContext()

  const [activeTab, setActiveTab] = useState<TabType>('solana')
  const [detectedWallets, setDetectedWallets] = useState<{
    solana: SolanaWalletName[]
    ethereum: EthereumWalletName[]
    near: WalletType[]
    hardware: HardwareWalletType[]
  }>({ solana: [], ethereum: [], near: [], hardware: [] })
  const [webUSBSupported, setWebUSBSupported] = useState(false)
  const [selectedHardwareChain, setSelectedHardwareChain] = useState<'ethereum' | 'solana'>('ethereum')
  const [error, setError] = useState<string | null>(null)
  const [walletConflict, setWalletConflict] = useState<WalletConflictInfo | null>(null)

  // Detect wallets on mount (using dynamic SDK import)
  useEffect(() => {
    if (isModalOpen) {
      // Check for wallet conflicts first
      const conflicts = detectWalletConflicts()
      setWalletConflict(conflicts.hasConflict ? conflicts : null)

      loadSDK().then((sdk) => {
        const solanaWallets = sdk.detectSolanaWallets()
        const ethereumWallets = sdk.detectEthereumWallets()
        // NEAR wallets are detected via wallet selector when ready
        const nearWallets = nearWallet.isReady ? nearWallet.detectWallets() : []

        // Check WebUSB support for hardware wallets
        const hasWebUSB = sdk.supportsWebUSB()
        setWebUSBSupported(hasWebUSB)

        // Hardware wallets are always available if WebUSB is supported
        const hardwareWallets: HardwareWalletType[] = hasWebUSB ? ['ledger', 'trezor'] : []

        setDetectedWallets({
          solana: solanaWallets,
          ethereum: ethereumWallets,
          near: nearWallets,
          hardware: hardwareWallets,
        })
        setAvailableWallets({
          solana: solanaWallets as WalletType[],
          ethereum: ethereumWallets as WalletType[],
          near: nearWallets,
          hardware: hardwareWallets as WalletType[],
        })
        setError(null)
      })
    }
  }, [isModalOpen, setAvailableWallets, nearWallet])

  const handleConnect = async (walletType: WalletType, chain: ChainType) => {
    setError(null)
    setConnecting(true)

    const walletName = WALLET_INFO[walletType].name
    const sdk = await loadSDK()

    try {
      if (chain === 'solana') {
        const adapter = sdk.createSolanaAdapter({
          wallet: walletType as SolanaWalletName,
          cluster: 'devnet',
        })

        await adapter.connect()
        // Use address (Base58 for Solana) for display and RPC calls
        const solanaAddress = adapter.address

        if (solanaAddress) {
          connect(walletType, chain, solanaAddress)
          toast.success('Wallet Connected', `Connected to ${walletName} on Solana`)
        }
      } else if (chain === 'ethereum') {
        const adapter = sdk.createEthereumAdapter({
          wallet: walletType as EthereumWalletName,
          chainId: 1, // Ethereum mainnet
        })

        await adapter.connect()
        const address = adapter.address

        if (address) {
          connect(walletType, chain, address)
          toast.success('Wallet Connected', `Connected to ${walletName} on Ethereum`)
        }
      } else if (chain === 'near') {
        // Use NEAR wallet hook for connection
        const accountId = await nearWallet.connect(walletType)

        if (accountId) {
          connect(walletType, chain, accountId)
          toast.success('Wallet Connected', `Connected to ${walletName} on NEAR`)
        } else if (nearWallet.error) {
          throw new Error(nearWallet.error)
        }
      }
    } catch (err) {
      // Wallet connection failed - error handled via state/toast
      const errorMessage = getWalletErrorMessage(err)
      setError(errorMessage)
      toast.error('Connection Failed', errorMessage)
      setConnecting(false)
    }
  }

  const handleHardwareConnect = async (walletType: 'ledger' | 'trezor', chain: 'ethereum' | 'solana') => {
    setError(null)
    setConnecting(true)

    const walletName = WALLET_INFO[walletType].name
    const sdk = await loadSDK()

    try {
      if (walletType === 'ledger') {
        const adapter = sdk.createLedgerAdapter({
          chain: chain,
          accountIndex: 0,
        })

        await adapter.connect()
        const address = adapter.address

        if (address) {
          connect(walletType, chain, address)
          const networkName = chain === 'ethereum' ? 'Ethereum' : 'Solana'
          toast.success('Ledger Connected', `Connected to ${walletName} on ${networkName}`)
        }
      } else if (walletType === 'trezor') {
        const adapter = sdk.createTrezorAdapter({
          chain: chain,
          manifestEmail: 'dev@sip-protocol.org',
          manifestAppName: 'SIP Protocol Demo',
          manifestUrl: 'https://sip-protocol.org',
        })

        await adapter.connect()
        const address = adapter.address

        if (address) {
          connect(walletType, chain, address)
          const networkName = chain === 'ethereum' ? 'Ethereum' : 'Solana'
          toast.success('Trezor Connected', `Connected to ${walletName} on ${networkName}`)
        }
      }
    } catch (err) {
      // Wallet connection failed - error handled via state/toast
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

    // Wallet conflict (multiple extensions)
    if (isWalletConflictError(err)) {
      return 'Multiple wallet extensions detected. Try disabling unused wallets.'
    }

    // Hardware wallet specific errors
    if (message.includes('webusb') || message.includes('transport')) {
      return 'Failed to connect to hardware wallet. Please check the connection.'
    }

    if (message.includes('app not open') || message.includes('wrong app')) {
      return 'Please open the correct app on your hardware wallet'
    }

    if (message.includes('no device selected')) {
      return 'No device selected. Please try again.'
    }

    return err.message || 'Failed to connect wallet'
  }

  const solanaWallets: WalletType[] = ['phantom', 'solflare']
  const ethereumWallets: WalletType[] = ['metamask', 'walletconnect']
  const nearWallets: WalletType[] = ['meteor', 'mynearwallet', 'here', 'sender']
  const hardwareWallets: ('ledger' | 'trezor')[] = ['ledger', 'trezor']

  const renderWalletList = (wallets: WalletType[], chain: ChainType) => {
    const detected = chain === 'solana'
      ? detectedWallets.solana
      : chain === 'ethereum'
        ? detectedWallets.ethereum
        : detectedWallets.near

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
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden" data-testid="wallet-modal">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white" data-testid="wallet-modal-title">Connect Wallet</h2>
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
                  data-testid="wallet-tab-solana"
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
                  data-testid="wallet-tab-ethereum"
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'ethereum'
                      ? 'text-white border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Ethereum
                </button>
                <button
                  onClick={() => setActiveTab('near')}
                  data-testid="wallet-tab-near"
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'near'
                      ? 'text-white border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  NEAR
                </button>
                <button
                  onClick={() => setActiveTab('hardware')}
                  data-testid="wallet-tab-hardware"
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'hardware'
                      ? 'text-white border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Hardware
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

                {walletConflict && (
                  <div className="flex items-center gap-2 p-3 mb-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span>{walletConflict.message}</span>
                  </div>
                )}

                {activeTab === 'solana' && renderWalletList(solanaWallets, 'solana')}
                {activeTab === 'ethereum' && renderWalletList(ethereumWallets, 'ethereum')}
                {activeTab === 'near' && renderWalletList(nearWallets, 'near')}
                {activeTab === 'hardware' && (
                  <div className="space-y-4">
                    {!webUSBSupported ? (
                      <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <span>WebUSB is not supported in this browser. Try Chrome or Edge.</span>
                      </div>
                    ) : (
                      <>
                        {/* Chain selector */}
                        <div className="flex gap-2 mb-4">
                          <button
                            onClick={() => setSelectedHardwareChain('ethereum')}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              selectedHardwareChain === 'ethereum'
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            Ethereum
                          </button>
                          <button
                            onClick={() => setSelectedHardwareChain('solana')}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              selectedHardwareChain === 'solana'
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            Solana
                          </button>
                        </div>

                        {/* Hardware wallet list */}
                        <div className="space-y-2">
                          {hardwareWallets.map((walletType) => {
                            const info = WALLET_INFO[walletType]
                            const isAvailable = detectedWallets.hardware.includes(walletType)

                            return (
                              <button
                                key={walletType}
                                onClick={() => isAvailable
                                  ? handleHardwareConnect(walletType, selectedHardwareChain)
                                  : window.open(info.downloadUrl, '_blank')
                                }
                                className="flex items-center justify-between w-full p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl transition-all group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-xl bg-gray-700 flex items-center justify-center overflow-hidden">
                                    <span className="text-lg font-bold text-gray-300">
                                      {info.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="text-left">
                                    <div className="font-medium text-white">{info.name}</div>
                                    <div className="text-xs text-gray-400">
                                      {isAvailable ? 'Connect via USB' : 'WebUSB required'}
                                    </div>
                                  </div>
                                </div>

                                {isAvailable ? (
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

                        <p className="text-xs text-gray-500">
                          Connect your Ledger or Trezor device and ensure the correct app is open.
                        </p>
                      </>
                    )}
                  </div>
                )}

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
