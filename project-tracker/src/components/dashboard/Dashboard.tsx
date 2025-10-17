import { LastActivityTable } from "./LastActivityTable"
import { ChartProject } from "./ChartProject"
import ActivityTable from "./ActivityTable"
import { ProjectTable } from "./ProjectTable"
import VerticalActivityStepper from "./VerticalActivityStepper"
import Navbar from "../navbar/Navbar"

const commits = [
  {
    sha: "1a2b3c4d5e6f7g8h9i",
    message: "Fix navbar alignment issue",
    author: "Haikal",
    avatar: "https://avatars.githubusercontent.com/u/583231?v=4",
    branch: "main",
    date: "2025-10-15T09:20:00",
  },
  {
    sha: "7h8i9j0k1l2m3n4o5p",
    message: "Add scroll area card component",
    author: "Aruni",
    avatar: "https://avatars.githubusercontent.com/u/1024025?v=4",
    branch: "feature/ui",
    date: "2025-10-14T21:45:00",
  },
  {
    sha: "4f5g6h7i8j9k0l1m2n",
    message: "Refactor ChartContainer props",
    author: "Edward",
    branch: "dev",
    date: "2025-10-14T16:00:00",
  },
]

const data = [
  {
    id: 1,
    projectName: "Sofita Queue System",
    status: "In Progress",
    lastCommit: "2025-10-12",
    deadline: "2025-11-01",
  },
  {
    id: 2,
    projectName: "Sofitify Music Player",
    status: "Done",
    lastCommit: "2025-10-08",
    deadline: "2025-10-10",
  },
  {
    id: 3,
    projectName: "Moodle Sync Bot",
    status: "In Progress",
    lastCommit: "2025-10-14",
    deadline: "2025-11-05",
  },
]


export default function Dashboard() {
  return (
    <div>
    <Navbar />
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
          <ProjectTable data={data}/>
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