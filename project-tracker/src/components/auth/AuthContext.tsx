import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type AuthContextValue = {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const AUTH_STORAGE_KEY = "project-tracker.authenticated"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false
    }
    return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true"
  })

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    if (isAuthenticated) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, "true")
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [isAuthenticated])

  const login = () => setIsAuthenticated(true)
  const logout = () => setIsAuthenticated(false)

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated],
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
