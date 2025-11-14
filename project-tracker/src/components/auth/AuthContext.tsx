import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { apiFetch } from "@/lib/api"

const AUTH_STORAGE_KEY = "project-tracker.token"
const LEGACY_AUTH_KEY = "project-tracker.authenticated"

type LoginCredentials = {
  email: string
  password: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
}

type AuthContextValue = {
  token: string | null
  user: any | null
  isAuthenticated: boolean
  isAuthenticating: boolean
  authError: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readInitialToken() {
  if (typeof window === "undefined") {
    return null
  }

  const storedToken = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (storedToken) {
    return storedToken
  }

  if (window.localStorage.getItem(LEGACY_AUTH_KEY)) {
    window.localStorage.removeItem(LEGACY_AUTH_KEY)
  }

  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readInitialToken())
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [user, setUser] = useState(null)

  const fetchLoginToken = useCallback(
    async ({ email, password }: LoginCredentials) => {
      const result = await apiFetch<{ message: string; token: string; user: any }>("/auth/login", {
        method: "POST",
        body: { email, password },
      })

      if (!result?.token) {
        throw new Error("Token tidak ditemukan pada respons login")
      }

      return {
        token: result.token,
        user: result.user
      }
    },
    [],
  )

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    if (token) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, token)
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [token])

  const login = useCallback(async ({ email, password }: LoginCredentials) => {
    setIsAuthenticating(true)
    setAuthError(null)

    try {
      const tokenValue = await fetchLoginToken({ email, password })
      setToken(tokenValue.token)
      setUser(tokenValue.user)
    } catch (error) {
      const message = "Login gagal"

      setAuthError(message)
      throw error
    } finally {
      setIsAuthenticating(false)
    }
  }, [fetchLoginToken])

  const register = useCallback(
    async ({ name, email, password }: RegisterPayload) => {
      setIsAuthenticating(true)
      setAuthError(null)

      try {
        await apiFetch<{ message: string; user: { id: number; email: string } }>("/auth/register", {
          method: "POST",
          body: { name, email, password },
        })

        const tokenValue = await fetchLoginToken({ email, password })
        setToken(tokenValue.token)
        setUser(tokenValue.user)
      } catch (error) {
        const message = "Registrasi gagal"

        setAuthError(message)
        throw error
      } finally {
        setIsAuthenticating(false)
      }
    },
    [fetchLoginToken],
  )

  const logout = useCallback(() => {
    setToken(null)
    setAuthError(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAuthenticating,
      authError,
      login,
      register,
      logout,
    }),
    [authError, isAuthenticating, login, logout, register, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
