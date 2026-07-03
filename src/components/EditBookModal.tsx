import { useState } from 'react'
import type { FormEvent } from 'react'
import { Save } from 'lucide-react'
import { updateBook } from '../api/client'

interface Book {
  id: number
  title: string
  author: string
  retail_price: number
  stock: number
}

interface Props {
  book: Book
  onClose: () => void
  onSuccess: (updated: Book) => void
}

export default function EditBookModal({ book, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author)
  const [retailPrice, setRetailPrice] = useState(String(book.retail_price))
  const [stock, setStock] = useState(String(book.stock))
  const [errors, setErrors] = useState<{ title?: string[]; author?: string[]; retail_price?: string[]; stock?: string[] }>({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})
    setGeneralError('')
    setLoading(true)
    try {
      const res = await updateBook(book.id, {
        title,
        author,
        retail_price: parseFloat(retailPrice),
        stock: parseInt(stock),
      })
      onSuccess(res.data.data ?? res.data)
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        setGeneralError('Failed to update book. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 px-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Book</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        {generalError && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.title?.map((e, i) => <p key={i} className="text-red-500 text-xs mt-1">{e}</p>)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${errors.author ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.author?.map((e, i) => <p key={i} className="text-red-500 text-xs mt-1">{e}</p>)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Retail Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={retailPrice}
              onChange={e => setRetailPrice(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${errors.retail_price ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.retail_price?.map((e, i) => <p key={i} className="text-red-500 text-xs mt-1">{e}</p>)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={e => setStock(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${errors.stock ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.stock?.map((e, i) => <p key={i} className="text-red-500 text-xs mt-1">{e}</p>)}
          </div>

          <div className="flex gap-3 justify-end pt-2">
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
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
