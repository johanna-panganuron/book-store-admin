import { useState, useEffect } from 'react'
import { getBooks } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { LogOut, Edit2, Eye, ChevronLeft, ChevronRight, BookOpen, BookText, User, Tag, Settings, Search, X, SearchX } from 'lucide-react'
import CostPriceModal from '../components/CostPriceModal'
import EditBookModal from '../components/EditBookModal'
import SignOutModal from '../components/SignOutModal'

interface Book {
  id: number
  title: string
  author: string
  retail_price: number
  stock: number
}

interface Pagination {
  current_page: number
  last_page: number
  total: number
  per_page: number
}

export default function BooksPage() {
  const { user, logout, hasPermission } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [costPriceBook, setCostPriceBook] = useState<Book | null>(null)
  const [editBook, setEditBook] = useState<Book | null>(null)
  const [showSignOut, setShowSignOut] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const canViewCostPrice = hasPermission('books.cost_price.view')

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    b.author.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearch !== searchTerm) {
        setPage(1)
        setDebouncedSearch(searchTerm)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm, debouncedSearch])

  const fetchBooks = async (p: number, search: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await getBooks(p, search)
      const data = res.data
      setBooks(data.data ?? data)
      if (data.meta) {
        setPagination({
          current_page: data.meta.current_page,
          last_page: data.meta.last_page,
          total: data.meta.total,
          per_page: data.meta.per_page,
        })
      } else if (data.current_page) {
        setPagination({
          current_page: data.current_page,
          last_page: data.last_page,
          total: data.total,
          per_page: data.per_page,
        })
      }
    } catch {
      setError('Failed to load books. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks(page, debouncedSearch)
  }, [page, debouncedSearch])

  const handleEditSuccess = (updated: Book) => {
    setBooks(prev => prev.map(b => b.id === updated.id ? updated : b))
    setEditBook(null)
  }

  const formatPrice = (price: number) =>
    `₱${Number(price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Bookstore Admin</h1>
            <p className="text-xs text-gray-500">{user?.name} · {user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => setShowSignOut(true)}
          className="text-sm flex items-center gap-2 text-gray-500 hover:text-gray-900 border border-gray-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-slide-up" style={{ animationFillMode: 'both', animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Books</h2>
            {pagination && (
              <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total books</p>
            )}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search current page..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-9 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 w-72 sm:w-80 transition-all bg-white shadow-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="text-gray-400 text-sm">Loading books...</div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
            <p className="text-red-600 text-sm">{error}</p>
            <button onClick={() => fetchBooks(page, debouncedSearch)} className="mt-3 text-sm text-red-700 underline">Try again</button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && books.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400 text-sm">No books found.</p>
          </div>
        )}

        {/* Empty Search */}
        {!loading && !error && books.length > 0 && filteredBooks.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                <SearchX className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No books found matching "<span className="font-medium text-gray-900">{debouncedSearch}</span>"</p>
              <button onClick={() => setSearchTerm('')} className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors text-sm">Clear search</button>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && filteredBooks.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      <div className="flex items-center gap-1.5"><BookText className="w-4 h-4 text-gray-400" /> Title</div>
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      <div className="flex items-center gap-1.5"><User className="w-4 h-4 text-gray-400" /> Author</div>
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      <div className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-gray-400" /> Retail Price</div>
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      <div className="flex items-center justify-end gap-1.5"><Settings className="w-4 h-4 text-gray-400" /> Actions</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBooks.map(book => (
                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{book.title}</td>
                      <td className="px-6 py-4 text-gray-600">{book.author}</td>
                      <td className="px-6 py-4 text-gray-700">{formatPrice(book.retail_price)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditBook(book)}
                            className="text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          {canViewCostPrice && (
                            <button
                              onClick={() => setCostPriceBook(book)}
                              className="text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-lg border border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-100 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" /> View cost price
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Page {pagination.current_page} of {pagination.last_page}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={pagination.current_page === 1}
                    className="text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                    disabled={pagination.current_page === pagination.last_page}
                    className="text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {costPriceBook && (
        <CostPriceModal
          bookId={costPriceBook.id}
          bookTitle={costPriceBook.title}
          onClose={() => setCostPriceBook(null)}
        />
      )}
      {editBook && (
        <EditBookModal
          book={editBook}
          onClose={() => setEditBook(null)}
          onSuccess={handleEditSuccess}
        />
      )}
      {showSignOut && (
        <SignOutModal
          onClose={() => setShowSignOut(false)}
          onConfirm={logout}
        />
      )}
    </div>
  )
}
