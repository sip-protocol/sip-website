'use client'

import { Wallet, ChevronDown, LogOut, Copy, Check, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useWalletStore, formatAddress, WALLET_INFO } from '@/stores/wallet-store'

export function WalletButton() {
  const {
    isConnected,
    isConnecting,
    address,
    walletType,
    chain,
    openModal,
    disconnect,
  } = useWalletStore()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setIsDropdownOpen(false)
  }

  const explorerUrl = chain === 'solana'
    ? `https://solscan.io/account/${address}`
    : `https://etherscan.io/address/${address}`

  if (isConnecting) {
    return (
      <button
        disabled
        data-testid="wallet-connecting"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800 rounded-lg cursor-not-allowed"
      >
        <div className="h-4 w-4 border-2 border-gray-500 border-t-purple-500 rounded-full animate-spin" />
        <span>Connecting...</span>
      </button>
    )
  }

  if (isConnected && address && walletType) {
    const walletInfo = WALLET_INFO[walletType]

    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          data-testid="wallet-connected"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs">
            {chain === 'solana' ? 'S' : 'E'}
          </div>
          <span>{formatAddress(address)}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
              data-testid="wallet-backdrop"
            />
            <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden" data-testid="wallet-dropdown">
              {/* Wallet Info */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{walletInfo.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{chain}</div>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-gray-800/50 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Address</div>
                  <div className="text-sm font-mono text-white truncate">{address}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-2">
                <button
                  onClick={handleCopyAddress}
                  data-testid="copy-address"
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy Address'}</span>
                </button>

                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="view-explorer"
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View in Explorer</span>
                </a>

                <button
                  onClick={handleDisconnect}
                  data-testid="disconnect-wallet"
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={openModal}
      data-testid="wallet-connect"
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
    >
      <Wallet className="h-4 w-4" />
      <span>Connect</span>
    </button>
  )
}
