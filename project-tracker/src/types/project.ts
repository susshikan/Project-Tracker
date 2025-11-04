import { description } from "@/components/dashboard/ChartProject"
import { z } from "zod"

const commitSchema = z.object({
  id: z.number(),
  localId: z.number(),
  message: z.string(),
  createAt: z.string(),
  projectLocalId: z.number(),
  userId: z.number()
})

export const projectSchema = z.object({
  localId: z.number(),
  projectName: z.string(),
  status: z.string(),
  deadline: z.string(),
  description: z.string(),
  commits: z.array(commitSchema)
})

export type ProjectListItem = z.infer<typeof projectSchema>
export type CommitsListItem = z.infer<typeof commitSchema>
