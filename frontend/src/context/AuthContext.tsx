import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../lib/api'

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('lf_token'))
  const [isLoading, setIsLoading] = useState(true)

  // Hydrate user from stored token on mount
  useEffect(() => {
    const stored = localStorage.getItem('lf_token')
    if (stored) {
      api.defaults.headers.common['Authorization'] = `Bearer ${stored}`
      api.get<{ success: boolean; data: AuthUser }>('/auth/me')
        .then(r => setUser(r.data.data))
        .catch(() => { localStorage.removeItem('lf_token'); setToken(null) })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const setAuth = (token: string, user: AuthUser) => {
    localStorage.setItem('lf_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setToken(token)
    setUser(user)
  }

  const login = async (email: string, password: string) => {
    const r = await api.post<{ success: boolean; token: string; data: AuthUser }>('/auth/login', { email, password })
    setAuth(r.data.token, r.data.data)
  }

  const register = async (name: string, email: string, password: string) => {
    const r = await api.post<{ success: boolean; token: string; data: AuthUser }>('/auth/register', { name, email, password })
    setAuth(r.data.token, r.data.data)
  }

  const logout = () => {
    localStorage.removeItem('lf_token')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
