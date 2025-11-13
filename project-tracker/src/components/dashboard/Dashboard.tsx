import { useEffect, useMemo, useState } from "react"
import { ChartProject } from "./ChartProject"
import ActivityTable from "./ActivityTable"
import { ProjectTable } from "./ProjectTable"
import VerticalActivityStepper from "./VerticalActivityStepper"
import { useAuth } from "../auth/AuthContext"
import { apiFetch} from "@/lib/api"
import { mapProjectResponse, convertNormalizedProjectsToHeatmapValues,convertProjectToCommit, type ProjectApiResponse, type CountMap, type CommitApiResponse } from "@/lib/projectApi"
import { type ProjectListItem, type CommitsListItem } from "@/types/project"

export default function Dashboard() {
  const { token, logout } = useAuth()
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [heatMap, setHeatMap] = useState<CountMap>()
  const [commits, setCommits] = useState<CommitsListItem[]>([])
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
        const project = mapProjectResponse(response)
        const heatmapData = convertNormalizedProjectsToHeatmapValues(project)
        const getcommits = convertProjectToCommit(project) 
        console.log(getcommits)
        setCommits(getcommits)
        setHeatMap(heatmapData)
        setProjects(project)
      } catch (caughtError) {
        if (caughtError instanceof DOMException && caughtError.name === "AbortError") {
          return
        }



        const message = "Gagal memuat data proyek"

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
        <VerticalActivityStepper data={commits}/>
        {/* Right Pane */}
        <main className="flex flex-col gap-6">
          {/* Top row: 2 cards sejajar */}
          <div className="grid grid-cols-[4fr_6fr] gap-6">
            <div className="max-h-[60vh]">
                <ChartProject />
            </div>
            <div className="max-h-[50vh]">
                <ActivityTable data={heatMap}/>
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
