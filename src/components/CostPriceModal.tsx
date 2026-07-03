import { useState } from 'react'
import type { FormEvent } from 'react'
import { Check } from 'lucide-react'
import { getCostPrice } from '../api/client'

interface Props {
  bookId: number
  bookTitle: string
  onClose: () => void
}

export default function CostPriceModal({ bookId, bookTitle, onClose }: Props) {
  const [reason, setReason] = useState('')
  const [costPrice, setCostPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (reason.trim().length < 5) {
      setError('Reason must be at least 5 characters.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await getCostPrice(bookId, reason.trim())
      setCostPrice(res.data.cost_price ?? res.data.data?.cost_price)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to retrieve cost price.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 px-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">View Cost Price</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          You are requesting the cost price for <span className="font-medium text-gray-700">"{bookTitle}"</span>. Please provide a reason.
        </p>

        {costPrice === null ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason <span className="text-gray-400 font-normal">(min. 5 characters)</span></label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${error ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="e.g. Reviewing pricing for Q3 margin analysis"
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {loading ? 'Submitting...' : 'Submit Reason'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Cost Price</p>
              <p className="text-2xl font-bold text-gray-900">₱{Number(costPrice).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-sm border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
