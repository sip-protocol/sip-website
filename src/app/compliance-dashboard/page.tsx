'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Key,
  Shield,
  FileText,
  Download,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  Filter,
  Calendar,
  Building2,
  User,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  FileSpreadsheet,
} from 'lucide-react'

// Dynamic SDK import to avoid WASM loading during SSG
const loadSDK = () => import('@sip-protocol/sdk')

// ─── Types ──────────────────────────────────────────────────────────────────

interface ViewingKeyData {
  id: string
  label: string
  path: string
  key: string
  hash: string
  createdAt: Date
  scope?: 'all' | 'treasury' | 'payments' | 'audit'
  transactionCount?: number
}

interface AuditTransaction {
  id: string
  sender: string
  recipient: string
  amount: string
  asset: string
  timestamp: number
  status: 'confirmed' | 'pending' | 'failed'
  type: 'inbound' | 'outbound'
  chain: string
  viewingKeyHash?: string
}

interface AuditReport {
  reportId: string
  generatedAt: Date
  period: { start: Date; end: Date }
  transactions: AuditTransaction[]
  summary: {
    totalVolume: string
    transactionCount: number
    uniqueCounterparties: number
    inbound: number
    outbound: number
  }
}

// ─── Demo Data ──────────────────────────────────────────────────────────────

const DEMO_VIEWING_KEYS: ViewingKeyData[] = [
  {
    id: 'vk-1',
    label: 'Treasury Audit Key',
    path: 'm/0/treasury',
    key: '0x7c8f9d2e1a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
    hash: '0xabc123def456789012345678901234567890abcd',
    createdAt: new Date('2025-01-15'),
    scope: 'treasury',
    transactionCount: 47,
  },
  {
    id: 'vk-2',
    label: 'External Auditor',
    path: 'm/0/external',
    key: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    hash: '0xdef456789012345678901234567890abcdef12',
    createdAt: new Date('2025-02-01'),
    scope: 'all',
    transactionCount: 156,
  },
  {
    id: 'vk-3',
    label: 'Payments Q1 2026',
    path: 'm/0/payments/2026/q1',
    key: '0x9f8e7d6c5b4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8',
    hash: '0x789012345678901234567890abcdef1234567890',
    createdAt: new Date('2025-12-20'),
    scope: 'payments',
    transactionCount: 23,
  },
]

const DEMO_TRANSACTIONS: AuditTransaction[] = [
  {
    id: 'tx-001',
    sender: 'sip:solana:0x742d35Cc6634C0532925a3b8...4e9',
    recipient: 'sip:solana:0x8f3a2B1c4D5E6f7A8b9C0d...1e2',
    amount: '15000.00',
    asset: 'USDC',
    timestamp: Date.now() / 1000 - 3600,
    status: 'confirmed',
    type: 'outbound',
    chain: 'solana',
    viewingKeyHash: '0xabc123def456789012345678901234567890abcd',
  },
  {
    id: 'tx-002',
    sender: 'sip:solana:0x3E4f5A6b7C8d9E0f1A2b3c...4d5',
    recipient: 'sip:solana:0x742d35Cc6634C0532925a3b8...4e9',
    amount: '50000.00',
    asset: 'USDC',
    timestamp: Date.now() / 1000 - 7200,
    status: 'confirmed',
    type: 'inbound',
    chain: 'solana',
    viewingKeyHash: '0xabc123def456789012345678901234567890abcd',
  },
  {
    id: 'tx-003',
    sender: 'sip:solana:0x742d35Cc6634C0532925a3b8...4e9',
    recipient: 'sip:ethereum:0x9A8b7C6d5E4f3A2b1c0D...9e8',
    amount: '2.5',
    asset: 'SOL',
    timestamp: Date.now() / 1000 - 14400,
    status: 'confirmed',
    type: 'outbound',
    chain: 'solana',
    viewingKeyHash: '0xdef456789012345678901234567890abcdef12',
  },
  {
    id: 'tx-004',
    sender: 'sip:ethereum:0x1a2B3c4D5e6F7a8B9c0D...1e2',
    recipient: 'sip:solana:0x742d35Cc6634C0532925a3b8...4e9',
    amount: '100000.00',
    asset: 'USDC',
    timestamp: Date.now() / 1000 - 86400,
    status: 'confirmed',
    type: 'inbound',
    chain: 'ethereum',
    viewingKeyHash: '0xabc123def456789012345678901234567890abcd',
  },
  {
    id: 'tx-005',
    sender: 'sip:solana:0x742d35Cc6634C0532925a3b8...4e9',
    recipient: 'sip:solana:0x5F6a7B8c9D0e1F2a3b4C...5d6',
    amount: '7500.00',
    asset: 'USDC',
    timestamp: Date.now() / 1000 - 172800,
    status: 'pending',
    type: 'outbound',
    chain: 'solana',
    viewingKeyHash: '0x789012345678901234567890abcdef1234567890',
  },
  {
    id: 'tx-006',
    sender: 'sip:near:acme.near',
    recipient: 'sip:solana:0x742d35Cc6634C0532925a3b8...4e9',
    amount: '25.75',
    asset: 'SOL',
    timestamp: Date.now() / 1000 - 259200,
    status: 'confirmed',
    type: 'inbound',
    chain: 'near',
    viewingKeyHash: '0xdef456789012345678901234567890abcdef12',
  },
]

// ─── Helper Functions ───────────────────────────────────────────────────────

function formatAddress(address: string, length: number = 8): string {
  if (address.length <= length * 2) return address
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatTimestamp(timestamp: number): string {
  return formatDate(new Date(timestamp * 1000))
}

function formatAmount(amount: string, asset: string): string {
  const num = parseFloat(amount)
  if (asset === 'USDC' || asset === 'USDT') {
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `${num.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${asset}`
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now() / 1000
  const diff = now - timestamp

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return formatTimestamp(timestamp)
}

// ─── Components ─────────────────────────────────────────────────────────────

function CopyButton({ text, size = 'sm' }: { text: string; size?: 'sm' | 'md' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-white/10 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className={`${iconSize} text-green-400`} />
      ) : (
        <Copy className={`${iconSize} text-gray-400`} />
      )}
    </button>
  )
}

function ViewingKeyCard({
  viewingKey,
  isExpanded,
  onToggle,
  onDelete,
  onViewTransactions,
}: {
  viewingKey: ViewingKeyData
  isExpanded: boolean
  onToggle: () => void
  onDelete: () => void
  onViewTransactions: () => void
}) {
  const [showKey, setShowKey] = useState(false)

  const scopeColors: Record<string, string> = {
    all: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    treasury: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    payments: 'bg-green-500/20 text-green-400 border-green-500/30',
    audit: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  }

  return (
    <motion.div
      layout
      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl overflow-hidden"
    >
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Key className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-medium text-white">{viewingKey.label}</h3>
            <p className="text-sm text-gray-400 font-mono">{viewingKey.path}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {viewingKey.scope && (
            <span className={`px-2 py-0.5 text-xs rounded-full border ${scopeColors[viewingKey.scope]}`}>
              {viewingKey.scope}
            </span>
          )}
          <span className="text-sm text-gray-400">
            {viewingKey.transactionCount} txns
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 border-t border-gray-700/50 pt-4 space-y-4">
              {/* Key Hash */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Key Hash</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm text-cyan-400 font-mono">{formatAddress(viewingKey.hash, 12)}</code>
                  <CopyButton text={viewingKey.hash} />
                </div>
              </div>

              {/* Viewing Key */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Viewing Key</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm text-gray-300 font-mono flex-1">
                    {showKey ? viewingKey.key : '•'.repeat(40)}
                  </code>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowKey(!showKey) }}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    {showKey ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <CopyButton text={viewingKey.key} />
                </div>
              </div>

              {/* Created Date */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Created</label>
                <p className="text-sm text-gray-400 mt-1">{formatDate(viewingKey.createdAt)}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onViewTransactions() }}
                  className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View Transactions
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete() }}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function TransactionRow({ transaction }: { transaction: AuditTransaction }) {
  const isInbound = transaction.type === 'inbound'

  const statusColors = {
    confirmed: 'text-green-400',
    pending: 'text-amber-400',
    failed: 'text-red-400',
  }

  const StatusIcon = transaction.status === 'confirmed' ? CheckCircle2
    : transaction.status === 'pending' ? Clock
    : AlertTriangle

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border-b border-gray-700/50 hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isInbound
              ? 'bg-green-500/20 border border-green-500/30'
              : 'bg-red-500/20 border border-red-500/30'
          }`}>
            {isInbound ? (
              <ArrowDownLeft className="w-5 h-5 text-green-400" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-red-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">
                {isInbound ? 'Received' : 'Sent'} {formatAmount(transaction.amount, transaction.asset)}
              </span>
              <StatusIcon className={`w-4 h-4 ${statusColors[transaction.status]}`} />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="font-mono">{formatAddress(isInbound ? transaction.sender : transaction.recipient, 10)}</span>
              <span className="text-gray-600">on</span>
              <span className="capitalize">{transaction.chain}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">{getRelativeTime(transaction.timestamp)}</p>
          <p className="text-xs text-gray-500 font-mono">{transaction.id}</p>
        </div>
      </div>
    </motion.div>
  )
}

function GenerateKeyModal({
  isOpen,
  onClose,
  onGenerate,
}: {
  isOpen: boolean
  onClose: () => void
  onGenerate: (label: string, path: string, scope: string) => void
}) {
  const [label, setLabel] = useState('')
  const [path, setPath] = useState('m/0/')
  const [scope, setScope] = useState('all')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate(label, path, scope)
    setLabel('')
    setPath('m/0/')
    setScope('all')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold text-white mb-4">Generate Viewing Key</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Q1 2026 Audit"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Derivation Path</label>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="m/0/audit/2026"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Scope</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Transactions</option>
              <option value="treasury">Treasury Only</option>
              <option value="payments">Payments Only</option>
              <option value="audit">Audit Trail</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-colors"
            >
              Generate
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function ExportModal({
  isOpen,
  onClose,
  onExport,
}: {
  isOpen: boolean
  onClose: () => void
  onExport: (format: 'pdf' | 'csv' | 'json', dateRange: { start: string; end: string }) => void
}) {
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onExport(format, { start: startDate, end: endDate })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold text-white mb-4">Export Audit Report</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(['pdf', 'csv', 'json'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`px-4 py-3 rounded-lg border transition-colors flex flex-col items-center gap-1 ${
                    format === f
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                      : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {f === 'pdf' && <FileText className="w-5 h-5" />}
                  {f === 'csv' && <FileSpreadsheet className="w-5 h-5" />}
                  {f === 'json' && <code className="text-xs">{'{}'}</code>}
                  <span className="uppercase text-sm">{f}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ComplianceDashboardPage() {
  // State
  const [activeTab, setActiveTab] = useState<'keys' | 'transactions' | 'reports'>('keys')
  const [viewingKeys, setViewingKeys] = useState<ViewingKeyData[]>(DEMO_VIEWING_KEYS)
  const [transactions, setTransactions] = useState<AuditTransaction[]>(DEMO_TRANSACTIONS)
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'inbound' | 'outbound'>('all')
  const [selectedKeyHash, setSelectedKeyHash] = useState<string | null>(null)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isDemo, setIsDemo] = useState(true)

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Filter by type
      if (filterType !== 'all' && tx.type !== filterType) return false

      // Filter by viewing key
      if (selectedKeyHash && tx.viewingKeyHash !== selectedKeyHash) return false

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          tx.id.toLowerCase().includes(query) ||
          tx.sender.toLowerCase().includes(query) ||
          tx.recipient.toLowerCase().includes(query) ||
          tx.amount.includes(query) ||
          tx.asset.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [transactions, filterType, selectedKeyHash, searchQuery])

  // Summary stats
  const summaryStats = useMemo(() => {
    const inbound = filteredTransactions.filter((t) => t.type === 'inbound')
    const outbound = filteredTransactions.filter((t) => t.type === 'outbound')

    const totalInbound = inbound.reduce((sum, t) => sum + parseFloat(t.amount), 0)
    const totalOutbound = outbound.reduce((sum, t) => sum + parseFloat(t.amount), 0)

    return {
      totalTransactions: filteredTransactions.length,
      inboundCount: inbound.length,
      outboundCount: outbound.length,
      totalInbound,
      totalOutbound,
      netFlow: totalInbound - totalOutbound,
    }
  }, [filteredTransactions])

  // Handlers
  const handleGenerateKey = useCallback(async (label: string, path: string, scope: string) => {
    try {
      const sdk = await loadSDK()
      const viewingKey = sdk.generateViewingKey(path)

      const newKey: ViewingKeyData = {
        id: `vk-${Date.now()}`,
        label,
        path,
        key: viewingKey.key,
        hash: viewingKey.hash,
        createdAt: new Date(),
        scope: scope as 'all' | 'treasury' | 'payments' | 'audit',
        transactionCount: 0,
      }

      setViewingKeys((prev) => [...prev, newKey])
    } catch (error) {
      console.error('Failed to generate viewing key:', error)
    }
  }, [])

  const handleDeleteKey = useCallback((keyId: string) => {
    setViewingKeys((prev) => prev.filter((k) => k.id !== keyId))
    if (expandedKey === keyId) setExpandedKey(null)
  }, [expandedKey])

  const handleViewKeyTransactions = useCallback((keyHash: string) => {
    setSelectedKeyHash(keyHash)
    setActiveTab('transactions')
  }, [])

  const handleExport = useCallback((format: 'pdf' | 'csv' | 'json', dateRange: { start: string; end: string }) => {
    // Simulate export
    console.log('Exporting report:', { format, dateRange })

    // In production, this would call ComplianceReporter
    const reportData = {
      reportId: `audit_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      format,
      transactionCount: filteredTransactions.length,
      dateRange,
    }

    // Create download
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sip-audit-report-${Date.now()}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }, [filteredTransactions])

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Compliance Dashboard</h1>
                <p className="text-gray-400">Viewing key management & transaction auditing</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Demo Mode Toggle */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-sm text-amber-400">Demo Mode</span>
              </div>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Key className="w-4 h-4" />
                Viewing Keys
              </div>
              <p className="text-2xl font-bold text-white mt-1">{viewingKeys.length}</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <FileText className="w-4 h-4" />
                Transactions
              </div>
              <p className="text-2xl font-bold text-white mt-1">{summaryStats.totalTransactions}</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <ArrowDownLeft className="w-4 h-4" />
                Total Inbound
              </div>
              <p className="text-2xl font-bold text-green-400 mt-1">
                ${summaryStats.totalInbound.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                Total Outbound
              </div>
              <p className="text-2xl font-bold text-red-400 mt-1">
                ${summaryStats.totalOutbound.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {(['keys', 'transactions', 'reports'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab
                    ? 'text-cyan-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab === 'keys' && 'Viewing Keys'}
                {tab === 'transactions' && 'Transaction Audit'}
                {tab === 'reports' && 'Reports'}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Viewing Keys Tab */}
          {activeTab === 'keys' && (
            <motion.div
              key="keys"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Your Viewing Keys</h2>
                <button
                  onClick={() => setIsGenerateModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Generate Key
                </button>
              </div>

              <div className="space-y-3">
                {viewingKeys.map((key) => (
                  <ViewingKeyCard
                    key={key.id}
                    viewingKey={key}
                    isExpanded={expandedKey === key.id}
                    onToggle={() => setExpandedKey(expandedKey === key.id ? null : key.id)}
                    onDelete={() => handleDeleteKey(key.id)}
                    onViewTransactions={() => handleViewKeyTransactions(key.hash)}
                  />
                ))}
              </div>

              {viewingKeys.length === 0 && (
                <div className="text-center py-12">
                  <Key className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No viewing keys yet</p>
                  <p className="text-sm text-gray-500">Generate a key to start auditing transactions</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {(['all', 'inbound', 'outbound'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        filterType === type
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {type === 'all' ? 'All' : type === 'inbound' ? 'Inbound' : 'Outbound'}
                    </button>
                  ))}
                </div>

                {selectedKeyHash && (
                  <button
                    onClick={() => setSelectedKeyHash(null)}
                    className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30 flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Filtered by key
                    <span className="text-purple-300">&times;</span>
                  </button>
                )}
              </div>

              {/* Transaction List */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <TransactionRow key={tx.id} transaction={tx} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No transactions found</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Quick Export */}
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <Download className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Quick Export</h3>
                      <p className="text-sm text-gray-400">Export current view</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleExport('pdf', { start: '', end: '' })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-left hover:border-cyan-500/50 transition-colors flex items-center gap-3"
                    >
                      <FileText className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-white font-medium">PDF Report</p>
                        <p className="text-sm text-gray-400">Formatted audit document</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleExport('csv', { start: '', end: '' })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-left hover:border-cyan-500/50 transition-colors flex items-center gap-3"
                    >
                      <FileSpreadsheet className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">CSV Export</p>
                        <p className="text-sm text-gray-400">Spreadsheet compatible</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleExport('json', { start: '', end: '' })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-left hover:border-cyan-500/50 transition-colors flex items-center gap-3"
                    >
                      <code className="w-5 h-5 text-blue-400 text-xs">{'{}'}</code>
                      <div>
                        <p className="text-white font-medium">JSON Data</p>
                        <p className="text-sm text-gray-400">Machine readable format</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Regulatory Formats */}
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Regulatory Formats</h3>
                      <p className="text-sm text-gray-400">Compliance-ready exports</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">FATF Travel Rule</span>
                        <span className="text-xs text-gray-500">EU, UK, SG</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        Originator and beneficiary information for cross-border transfers
                      </p>
                      <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                        Generate FATF Report &rarr;
                      </button>
                    </div>
                    <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">FinCEN SAR</span>
                        <span className="text-xs text-gray-500">US Only</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        Suspicious Activity Report format for US regulators
                      </p>
                      <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                        Generate SAR Report &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Reports */}
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">Recent Reports</h3>
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No reports generated yet</p>
                  <p className="text-sm text-gray-500">Generate a report to see it here</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <GenerateKeyModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onGenerate={handleGenerateKey}
      />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </main>
  )
}
