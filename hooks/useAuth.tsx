'use client'

import { useState, useEffect, createContext, useContext } from 'react'

interface User {
  id: string
  email: string
  username: string
  profileImage: string | null
  role: string
  isEmailVerified: boolean
  bio?: string
  firstName?: string
  lastName?: string
  phone?: string
  location?: string
  website?: string
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, username: string, profileImage?: string) => Promise<{ success: boolean; error?: string }>
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string }>
  resendCode: (email: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const saveAuth = (newToken: string, newUser: User) => {
    localStorage.setItem('auth_token', newToken)
    localStorage.setItem('auth_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const clearAuth = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
  }

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const baseUrl = '/api'
    const url = `${baseUrl}${endpoint}`
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }
    if (token && !endpoint.includes('/auth/')) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      }
    }
    try {
      const response = await fetch(url, config)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Une erreur est survenue' }
    }
  }

  const login = async (email: string, password: string) => {
    const result = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (result.success && result.data) {
      saveAuth(result.data.token, result.data.user)
    }
    return result
  }

  const register = async (email: string, password: string, username: string, profileImage?: string) => {
    const result = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username, profileImage }),
    })
    return result
  }

  const verifyEmail = async (email: string, code: string) => {
    const result = await apiCall('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    })
    return result
  }

  const resendCode = async (email: string) => {
    const result = await apiCall('/auth/resend-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    return result
  }

  const logout = async () => {
    await apiCall('/auth/logout', { method: 'POST' })
    clearAuth()
  }

  const updateProfile = async (data: Partial<User>) => {
    const result = await apiCall('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    if (result.success && result.data?.profile) {
      setUser(result.data.profile)
      localStorage.setItem('auth_user', JSON.stringify(result.data.profile))
    }
    return result
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const result = await apiCall('/user/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    return result
  }

  const forgotPassword = async (email: string) => {
    const result = await apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    return result
  }

  const resetPassword = async (token: string, newPassword: string) => {
    const result = await apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    })
    return result
  }

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    verifyEmail,
    resendCode,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
} 