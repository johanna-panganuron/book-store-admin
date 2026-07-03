import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { login } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser, setToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string[]; password?: string[] }>({})
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})
    setGeneralError('')
    setLoading(true)

    try {
      const res = await login(email, password)
      const data = res.data.data ?? res.data
      setToken(data.token)
      setUser({ id: data.id, name: data.name, email: data.email, permissions: data.permissions })
      navigate('/')
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else if (err.response?.status === 401) {
        setGeneralError('Invalid credentials. Please try again.')
      } else {
        setGeneralError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 animate-slide-up" style={{ animationFillMode: 'both', animationDelay: '0.1s' }}>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bookstore Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {generalError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {generalError}
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`peer w-full h-12 px-3 pt-5 pb-1 rounded-lg border text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:shadow-md transition-all placeholder-transparent ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="you@example.com"
              required
            />
            <label 
              htmlFor="email"
              className="absolute left-3 top-1.5 text-[11px] font-medium text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-emerald-600 pointer-events-none"
            >
              Email
            </label>
            {errors.email?.map((e, i) => (
              <p key={i} className="text-red-500 text-xs mt-1">{e}</p>
            ))}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`peer w-full h-12 px-3 pt-5 pb-1 rounded-lg border text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:shadow-md transition-all placeholder-transparent pr-10 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="••••••••"
              required
            />
            <label 
              htmlFor="password"
              className="absolute left-3 top-1.5 text-[11px] font-medium text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-emerald-600 pointer-events-none"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            {errors.password?.map((e, i) => (
              <p key={i} className="text-red-500 text-xs mt-1">{e}</p>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
