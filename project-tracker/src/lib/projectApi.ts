import { type ProjectListItem, type CommitsListItem } from "@/types/project"

export type ProjectApiItem = {
  id: number
  localId: number | null
  title: string
  status: boolean
  deadline: string | null
  createAt?: string | null
  description: string
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

export type ProjectApiResponseById = {
  data?: ProjectApiItem
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

export function normalizeProject(project: ProjectApiItem): ProjectListItem {
  return {
    localId: project.localId ?? project.id,
    projectName: project.title,
    status: project.status ? "Done" : "In Progress",
    deadline: formatDate(project.deadline),
    description: project.description,
    commits: (project.commit ?? []).map(normalizeCommit)
  }
}

export function normalizeProjectById(project: ProjectApiItem): ProjectListItem {
  return {
    localId: project.localId ?? project.id,
    projectName: project.title,
    status: project.status ? "Done" : "In Progress",
    deadline: formatDate(project.deadline),
    description: project.description,
    commits: (project.commit ?? []).map(normalizeCommit)
  }
}

export type CountMap = Record<string, number>

export function convertNormalizedProjectsToHeatmapValues(projects: ProjectListItem[]): CountMap {
  const values: CountMap = {}
  projects.forEach((project) => {
    project.commits.forEach((c) => {
      const dateKey = c.createAt 

      if (!values[dateKey]) {
        values[dateKey] = 0
      }

      values[dateKey] += 1
    })
  })

  return values
}

export function convertProjectToCommit(projects: ProjectListItem[]): CommitsListItem[]{
  let result: any = []
  projects.forEach((project) => {
    result = [...result, ...project.commits]
  })
  return result
}


export function mapProjectResponse(response: ProjectApiResponse | null | undefined): ProjectListItem[] {
  return (response?.data ?? []).map(normalizeProject)
} 

export function mapCommitsResponse(response: CommitApiResponse | null | undefined): CommitApiItem[] {
  return (response?.data ?? []).map(normalizeCommit)
}

export function mapProjectResponseById(response: ProjectApiResponseById | null | undefined): ProjectListItem {
  const project = response?.data
  if (!project) {
    throw new Error("Invalid response: missing project data")
  }
  return normalizeProjectById(project)
}
