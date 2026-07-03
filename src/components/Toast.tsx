import { CheckCircle2, X } from 'lucide-react'
import { useEffect } from 'react'

interface Props {
  message: string
  onClose: () => void
}

export default function Toast({ message, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl animate-fade-in" style={{ animationDuration: '0.3s' }}>
      <CheckCircle2 className="w-5 h-5 text-white/90" />
      <p className="text-sm font-medium pr-2">{message}</p>
      <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
