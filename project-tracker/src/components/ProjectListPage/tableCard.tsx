import { type ProjectListItem } from "@/types/project"
import { CardProject } from "./Card"

type TableCardProps = {
  projects: ProjectListItem[]
}

function formatValue(value: string) {
  return value && value.trim().length > 0 ? value : "-"
}

export default function TableCard({ projects }: TableCardProps) {
  if (!projects.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-muted-foreground/40 bg-muted/20 text-sm text-muted-foreground">
        Belum ada project yang tersimpan.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <CardProject
          key={project.id}
          projectName={project.projectName}
          status={project.status}
          deadline={formatValue(project.deadline)}
          lastCommit={formatValue(project.lastCommit)}
        />
      ))}
    </div>
  )
}
