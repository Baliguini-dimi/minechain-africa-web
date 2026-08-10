import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import apiClient from '../../services/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('auth_token')
  )
  const [isLoadingUser, setIsLoadingUser] = useState(isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoadingUser(false)
      return
    }

    apiClient
      .get('/me')
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem('auth_token')
        setIsAuthenticated(false)
      })
      .finally(() => setIsLoadingUser(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await apiClient.post('/login', { email, password })

    if (data.requires_2fa) {
      return { requiresTwoFactor: true, userId: data.user_id }
    }

    localStorage.setItem('auth_token', data.token)
    setUser(data.user)
    setIsAuthenticated(true)

    return { requiresTwoFactor: false, role: data.user.role?.name }
  }, [])

  const verifyTwoFactor = useCallback(async (userId, code) => {
    const { data } = await apiClient.post('/login/verify-2fa', {
      user_id: userId,
      code,
    })

    localStorage.setItem('auth_token', data.token)
    setUser(data.user)
    setIsAuthenticated(true)

    return { role: data.user.role?.name }
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/logout')
    } finally {
      localStorage.removeItem('auth_token')
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoadingUser, login, verifyTwoFactor, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider')
  }
  return context
}