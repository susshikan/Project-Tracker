import { z } from "zod"

export const projectSchema = z.object({
  id: z.number(),
  projectName: z.string(),
  status: z.string(),
  lastCommit: z.string(),
  deadline: z.string(),
})

export type ProjectListItem = z.infer<typeof projectSchema>
