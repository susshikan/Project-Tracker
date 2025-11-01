"use client"

import { Calendar, Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type CardProjectProps = {
  projectName: string
  status: string
  deadline: string
  lastCommit: string
}

export function CardProject({ projectName, status, deadline, lastCommit }: CardProjectProps) {
  const isDone = status.toLowerCase() === "done"
  const badgeVariant: "default" | "secondary" = isDone ? "default" : "secondary"

  return (
    <Card className="flex h-full flex-col justify-between border border-white/10 bg-white/60 backdrop-blur-xl dark:bg-zinc-900/40">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-semibold">{projectName}</CardTitle>
          <Badge variant={badgeVariant} className="capitalize">
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Deadline: {deadline}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Last update: {lastCommit}</span>
        </div>
      </CardContent>
    </Card>
  )
}
