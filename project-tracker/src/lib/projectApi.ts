import { type ProjectListItem } from "@/types/project"

type ProjectApiItem = {
  id: number
  localId: number | null
  title: string
  status: boolean
  deadline: string | null
  updatedAt?: string | null
  createAt?: string | null
  createdAt?: string | null
}

export type ProjectApiResponse = {
  data?: ProjectApiItem[]
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

function normalizeProject(project: ProjectApiItem): ProjectListItem {
  return {
    id: project.localId ?? project.id,
    projectName: project.title,
    status: project.status ? "Done" : "In Progress",
    lastCommit: formatDate(project.updatedAt ?? project.createAt ?? project.createdAt ?? null),
    deadline: formatDate(project.deadline),
  }
}

export function mapProjectResponse(response: ProjectApiResponse | null | undefined): ProjectListItem[] {
  return (response?.data ?? []).map(normalizeProject)
}
