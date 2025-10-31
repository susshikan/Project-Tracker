import { useEffect, useMemo, useState } from "react"
import { ChartProject } from "./ChartProject"
import ActivityTable from "./ActivityTable"
import { ProjectTable, schema as projectTableSchema } from "./ProjectTable"
import VerticalActivityStepper from "./VerticalActivityStepper"
import { useAuth } from "../auth/AuthContext"
import { apiFetch, ApiError } from "@/lib/api"
import { type z } from "zod"

type ProjectRow = z.infer<typeof projectTableSchema>

type ProjectApiResponse = {
  data?: Array<{
    id: number
    localId: number | null
    title: string
    status: boolean
    deadline: string | null
    updatedAt?: string | null
    createAt?: string | null
    createdAt?: string | null
  }>
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) {
    return "-"
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return date.toLocaleDateString()
}

export default function Dashboard() {
  const { token, logout } = useAuth()
  const [projects, setProjects] = useState<ProjectRow[]>([])
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

        const mapped = (response.data ?? []).map<ProjectRow>((project) => ({
          id: project.localId ?? project.id,
          projectName: project.title,
          status: project.status ? "Done" : "In Progress",
          lastCommit: formatDate(
            project.updatedAt ?? project.createAt ?? project.createdAt ?? null,
          ),
          deadline: formatDate(project.deadline),
        }))

        setProjects(mapped)
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
              : "Gagal memuat data proyek"

        setError(message)
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProjects()

    return () => controller.abort()
  }, [logout, token])

  const projectTable = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex h-48 items-center justify-center rounded-xl border bg-muted/30 text-sm text-muted-foreground">
          Memuat data proyek...
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex h-48 items-center justify-center rounded-xl border bg-destructive/5 px-4 text-sm text-destructive">
          {error}
        </div>
      )
    }

    return <ProjectTable data={projects} />
  }, [error, isLoading, projects])

  return (
    <div>
    <div className="min-h-screen p-6 bg-background">
      {/* grid utama: sidebar kiri + konten kanan */}
      <div className="grid grid-cols-[280px_1fr] gap-6 h-full">
        {/* Left Pane */}
        <VerticalActivityStepper />
        {/* Right Pane */}
        <main className="flex flex-col gap-6">
          {/* Top row: 2 cards sejajar */}
          <div className="grid grid-cols-[4fr_6fr] gap-6">
            <div className="max-h-[60vh]">
                <ChartProject />
            </div>
            <div className="max-h-[50vh]">
                <ActivityTable />
            </div>

          </div>

          {/* Bottom large card */}
          {projectTable}
        </main>
      </div>
    </div>
    </div>
  )
}

/*
<aside className="rounded-xl border p-4 flex flex-col justify-between">
          <p className="font-semibold text-center">Left Pane (Sidebar)</p>
          <div className="mt-4 flex-1 bg-muted rounded-lg"></div>
        </aside> 
*/

/*
<div className="rounded-xl border p-4 flex items-center justify-center">
              <p>Top Right 1</p>
            </div>
*/

/*
<div className="rounded-xl border p-4 flex items-center justify-center">
              <p>Top Right 2</p>
            </div>
 */
