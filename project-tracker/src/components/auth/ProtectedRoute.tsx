import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "./AuthContext"

type ProtectedRouteProps = {
  redirectTo?: string
}

export default function ProtectedRoute({ redirectTo = "/login" }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  return <Outlet />
}
