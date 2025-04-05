"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, remember?: boolean) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("integral_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("integral_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string, remember = false) => {
    setLoading(true)

    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we'll simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check credentials (in a real app, this would be done on the server)
      if (email === "demo@example.com" && password === "password") {
        const userData: User = {
          id: "1",
          name: "Demo User",
          email: "demo@example.com",
          avatar: "/placeholder.svg?height=100&width=100",
        }

        setUser(userData)

        // Store user data if remember me is checked
        if (remember) {
          localStorage.setItem("integral_user", JSON.stringify(userData))
        }

        return
      }

      // Check if this is a newly registered user
      const storedUsers = localStorage.getItem("integral_users")
      if (storedUsers) {
        const users = JSON.parse(storedUsers)
        const foundUser = users.find((u: any) => u.email === email)

        if (foundUser && foundUser.password === password) {
          const userData: User = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            avatar: foundUser.avatar || "/placeholder.svg?height=100&width=100",
          }

          setUser(userData)

          // Store user data if remember me is checked
          if (remember) {
            localStorage.setItem("integral_user", JSON.stringify(userData))
          }

          return
        }
      }

      throw new Error("Invalid email or password")
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true)

    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we'll simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if email is already in use
      const storedUsers = localStorage.getItem("integral_users")
      let users = []

      if (storedUsers) {
        users = JSON.parse(storedUsers)
        if (users.some((u: any) => u.email === email)) {
          throw new Error("Email is already in use")
        }
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, this would be hashed
        avatar: "/placeholder.svg?height=100&width=100",
      }

      // Save to "database"
      users.push(newUser)
      localStorage.setItem("integral_users", JSON.stringify(users))

      // Log user in
      const userData: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      }

      setUser(userData)
      localStorage.setItem("integral_user", JSON.stringify(userData))
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    // In a real app, this would include an API call to invalidate the session
    localStorage.removeItem("integral_user")
    setUser(null)

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

