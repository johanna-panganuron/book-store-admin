import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { getMe, logout as apiLogout } from '../api/client'

interface User {
  id: number
  name: string
  email?: string
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  setToken: (token: string) => void
  logout: () => Promise<void>
  hasPermission: (permission: string) => boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    getMe()
      .then(res => setUser(res.data.data ?? res.data))
      .catch(() => { localStorage.removeItem('token'); setUser(null) })
      .finally(() => setLoading(false))
  }, [])

  const setToken = (token: string) => {
    localStorage.setItem('token', token)
  }

  const logout = async () => {
    try { await apiLogout() } catch { /* ignore */ }
    localStorage.removeItem('token')
    setUser(null)
  }

  const hasPermission = (permission: string) =>
    !!user?.permissions?.includes(permission)

  return (
    <AuthContext.Provider value={{ user, setUser, setToken, logout, hasPermission, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
