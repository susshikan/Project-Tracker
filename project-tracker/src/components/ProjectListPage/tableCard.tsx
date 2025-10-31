import { CardProject } from "./Card"

export type Project = {
  id: string
  name: string
  tags: string[]
}

export default function TableCard({ projects }: { projects: Project[] }) {
  return (
    <main className="flex min-h-screen bg-background p-4 pt-3">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-5 gap-4">
          {projects.map((project) => (
            <div key={project.id}>
              <CardProject />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
//items-center
export const demoProjects: Project[] = [
  { id: "1", name: "Landing Page Revamp", tags: ["frontend", "tailwind", "a11y"] },
  { id: "2", name: "API Gateway", tags: ["backend", "node", "auth"] },
  { id: "3", name: "Mobile App", tags: ["react-native", "offline", "perf"] },
  { id: "4", name: "Analytics Dashboard", tags: ["dashboard", "charts", "etl"] },
  { id: "5", name: "Search Service", tags: ["elasticsearch", "indexing", "ops"] },
  { id: "6", name: "Notification System", tags: ["queue", "workers", "retry"] },
]
