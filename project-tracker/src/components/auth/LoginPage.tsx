import { useEffect, useMemo, useState } from "react"
import { Link, type Location, useLocation, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "./AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: Location } | null
    return state?.from?.pathname ?? "/"
  }, [location.state])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    login()
    navigate(redirectPath, { replace: true })
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectPath])

  return (
    <div className="bg-gradient-to-br from-slate-100 via-white to-slate-200 min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4">
        <div className="grid w-full items-center gap-12 md:grid-cols-2">
          <div className="space-y-6 text-center md:text-left">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1 text-sm text-slate-600 shadow-sm">
              Welcome back
            </span>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
              Track projects smarter with Project Tracker
            </h1>
            <p className="text-base text-slate-600">
              Sign in to access your dashboard, review project milestones, and
              collaborate with your team in one place.
            </p>
          </div>

          <Card className="backdrop-blur md:ml-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>
                Enter your credentials to continue to the dashboard.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex-col gap-4 border-t pt-6 text-center text-sm text-muted-foreground">
              <p>
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Create one
                </Link>
              </p>
              <p className="text-xs">
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
