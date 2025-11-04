import { type ProjectListItem } from "@/types/project"

type ProjectApiItem = {
  id: number
  localId: number | null
  title: string
  status: boolean
  deadline: string | null
  createAt?: string | null
  commit?: CommitApiItem[]
}

type CommitApiItem = {
  id: number
  localId: number
  message: string
  createAt: string | Date
  projectLocalId: number
  userId: number
}

export type ProjectApiResponse = {
  data?: ProjectApiItem[]
}

export type CommitApiResponse = {
  data?: CommitApiItem[]
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

function toISODate(value: string | Date | null | undefined): string {
  if (!value) return "-"
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toISOString().split("T")[0] 
}


function normalizeCommit(commit: CommitApiItem) {
  return {
    id: commit.id,
    localId: commit.localId,
    message: commit.message,
    createAt: toISODate(commit.createAt),
    projectLocalId: commit.projectLocalId,
    userId: commit.userId
  }
}

function normalizeProject(project: ProjectApiItem): ProjectListItem {
  return {
    localId: project.localId ?? project.id,
    projectName: project.title,
    status: project.status ? "Done" : "In Progress",
    deadline: formatDate(project.deadline),
    commits: (project.commit ?? []).map(normalizeCommit)
  }
}

export function mapProjectResponse(response: ProjectApiResponse | null | undefined): ProjectListItem[] {
  return (response?.data ?? []).map(normalizeProject)
}

export function mapCommitsResponse(response: CommitApiResponse | null | undefined): CommitApiItem[] {
  return (response?.data ?? []).map(normalizeCommit)
}
