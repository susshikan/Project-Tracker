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

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { register: registerAccount, isAuthenticated, isAuthenticating, authError } = useAuth()

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: Location } | null
    return state?.from?.pathname ?? "/"
  }, [location.state])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setFormError("Password tidak cocok")
      return
    }

    setFormError(null)

    try {
      await registerAccount({ name: fullName, email, password })
    } catch {
      // error state handled via auth context
    }
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
          <Card className="order-2 backdrop-blur md:order-1">
            <CardHeader>
              <CardTitle className="text-2xl">Create account</CardTitle>
              <CardDescription>
                Get started with Project Tracker in just a few steps.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full name</Label>
                  <Input
                    id="full-name"
                    type="text"
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                  />
                </div>

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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      if (formError) {
                        setFormError(null)
                      }
                    }}
                    required
                    minLength={8}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value)
                      if (formError) {
                        setFormError(null)
                      }
                    }}
                    required
                    minLength={8}
                  />
                </div>

                {(formError || authError) && (
                  <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {formError ?? authError}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isAuthenticating}>
                  {isAuthenticating ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex-col gap-4 border-t pt-6 text-center text-sm text-muted-foreground">
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
              <p className="text-xs">
                By signing up you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </CardFooter>
          </Card>

          <div className="order-1 space-y-6 text-center md:order-2 md:text-left">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1 text-sm text-slate-600 shadow-sm">
              New here?
            </span>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
              Join Project Tracker and deliver projects with clarity
            </h1>
            <p className="text-base text-slate-600">
              Create an account to manage backlogs, document updates, and stay
              aligned with stakeholders in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
