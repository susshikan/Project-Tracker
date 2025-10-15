import { ProjectTable } from "./ProjectTable"
import ActivityTable from "./activityTable"
import { LastActivityTable } from "./LastActivityTable"

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

export default function Tes() {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-lg font-semibold mb-4">Recent Commits</h1>
      <LastActivityTable commits={commits} />
    </div>
  )
}