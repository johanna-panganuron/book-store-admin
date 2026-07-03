import { LogOut } from 'lucide-react'

interface Props {
  onClose: () => void
  onConfirm: () => void
}

export default function SignOutModal({ onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 px-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogOut className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Sign Out</h2>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to sign out? You will need to log in again to access the dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
