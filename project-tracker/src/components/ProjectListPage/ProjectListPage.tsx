import { useCallback, useEffect, useMemo, useState } from "react"

import { apiFetch } from "@/lib/api"
import { mapProjectResponse, type ProjectApiResponse } from "@/lib/projectApi"
import { type ProjectListItem } from "@/types/project"

import { useAuth } from "../auth/AuthContext"
import { AddButton } from "./AddButton"
import TableCard from "./tableCard"

export default function ProjectListPage() {
  const { token, logout } = useAuth()
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async (signal?: AbortSignal, keepProjects = false) => {
    if (!token) {
      setProjects([]) 
      return
    }
    if (keepProjects) {
        setIsLoading(false)
        setError(null)
    }


    try {
      const response = await apiFetch<ProjectApiResponse>("/projects", {
        token,
        signal,
      })

      setProjects(mapProjectResponse(response))
      setIsLoading(false)
    } catch (caughtError) {
      if (caughtError instanceof DOMException && caughtError.name === "AbortError") {
        return
      }
      setIsLoading(false)

    } 
  }, [token])

  useEffect(() => {
    if (!token) {
      setProjects([])
      return
    }

    const controller = new AbortController()

    void fetchProjects(controller.signal)

    return () => controller.abort()
  }, [fetchProjects, logout, token])

  const content = useMemo(() => {
    console.log(isLoading)
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
    console.log(projects)

    return <TableCard projects={projects} />
  }, [error, isLoading, projects])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-6xl space-y-6 p-4">
        <div className="flex justify-end">
          <AddButton onCreated={() => { void fetchProjects(undefined, true) }} />
        </div>
        {content}
      </div>
    </div>
  )
}
