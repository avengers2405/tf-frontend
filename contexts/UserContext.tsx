"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getCurrentUser } from '@/lib/auth'

interface User {
  username: string
  email: string
  id: string
  [key: string]: any
}

interface UserContextType {
  user: User | null
  loading: boolean
  error: string | null
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUser = async () => {
    try {
      setError(null)
      setLoading(true)
      const { user } = await getCurrentUser()
      setUser(user)
      console.log("Loaded user:", user.username)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user'
      setError(errorMessage)
      console.error("Failed to load user", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    await loadUser()
  }

  useEffect(() => {
    loadUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}