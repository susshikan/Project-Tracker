import { useEffect, useMemo, useState } from "react"

import { apiFetch, ApiError } from "@/lib/api"
import { mapProjectResponse, type ProjectApiResponse } from "@/lib/projectApi"
import { type ProjectListItem } from "@/types/project"

import { useAuth } from "../auth/AuthContext"
import { AddButton } from "./AddButton"
import TableCard from "./TableCard"

export default function ProjectListPage() {
  const { token, logout } = useAuth()
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setProjects([])
      return
    }

    const controller = new AbortController()

    const fetchProjects = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiFetch<ProjectApiResponse>("/projects", {
          token,
          signal: controller.signal,
        })

        setProjects(mapProjectResponse(response))
      } catch (caughtError) {
        if (caughtError instanceof DOMException && caughtError.name === "AbortError") {
          return
        }

        if (caughtError instanceof ApiError && caughtError.status === 401) {
          logout()
        }

        const message =
          caughtError instanceof ApiError
            ? caughtError.message
            : caughtError instanceof Error
              ? caughtError.message
              : "Gagal memuat daftar project"

        setError(message)
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProjects()

    return () => controller.abort()
  }, [logout, token])

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex min-h-[160px] items-center justify-center rounded-xl border bg-muted/30 text-sm text-muted-foreground">
          Memuat project...
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex min-h-[160px] items-center justify-center rounded-xl border bg-destructive/5 px-4 text-sm text-destructive">
          {error}
        </div>
      )
    }

    return <TableCard projects={projects} />
  }, [error, isLoading, projects])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-6xl space-y-6 p-4">
        <div className="flex justify-end">
          <AddButton />
        </div>
        {content}
      </div>
    </div>
  )
}
