/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type UserRole = 'admin' | 'user'

interface AuthUser {
  role: UserRole
  name: string
  initials: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (role: UserRole) => void
  logout: () => void
}

const STORAGE_KEY = 'omega_auth_user'

const AuthContext = createContext<AuthContextValue | null>(null)

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (parsed.role !== 'admin' && parsed.role !== 'user') return null
    if (!parsed.name || !parsed.initials) return null
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())

  const login = useCallback((role: UserRole) => {
    const nextUser: AuthUser = role === 'admin'
      ? { role: 'admin', name: 'System Admin', initials: 'SA' }
      : { role: 'user', name: 'Catalog User', initials: 'CU' }

    setUser(nextUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
